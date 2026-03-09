#!/usr/bin/env node
/**
 * audit-dataview-queries — find and rank Dataview queries in an Obsidian vault.
 *
 * Read-only. No dependencies. Node 18+.
 *
 *   node audit-dataview-queries.mjs <vault> [--json] [--all] [--top N] [--min-score N]
 *
 * It scans every .md file for ```dataview / ```dataviewjs blocks and inline `= …` / `$= …`
 * queries, then reports two independent things per query:
 *
 *   COST   — static signals that a query is expensive to execute (and it re-executes on every
 *            index revision, for every block currently on screen).
 *   TRAPS  — static signals that a query is silently wrong, from the verified trap catalogue
 *            in this skill's SKILL.md.
 *
 * Everything reported is a CANDIDATE. This tool segments clauses by keyword, it does not parse
 * DQL, and it cannot see how many notes a source actually selects. Confirm before rewriting.
 */

import { readdir, readFile, stat } from "node:fs/promises";
import { join, relative, sep } from "node:path";

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

const argv = process.argv.slice(2);
const flags = new Set(argv.filter(a => a.startsWith("--")));
const positional = argv.filter(a => !a.startsWith("--"));
const optValue = name => {
    const i = argv.indexOf(name);
    return i >= 0 && argv[i + 1] ? argv[i + 1] : undefined;
};

const VAULT = positional[0];
const AS_JSON = flags.has("--json");
const SHOW_ALL = flags.has("--all");
const TOP = Number(optValue("--top") ?? 25);
const MIN_SCORE = Number(optValue("--min-score") ?? (SHOW_ALL ? 0 : 1));

if (!VAULT || flags.has("--help") || flags.has("-h")) {
    console.log(
        [
            "usage: node audit-dataview-queries.mjs <vault> [options]",
            "",
            "  --json            machine-readable output",
            "  --all             include queries with no findings",
            "  --top N           show at most N queries (default 25)",
            "  --min-score N     hide queries scoring below N (default 1)",
        ].join("\n")
    );
    process.exit(flags.has("--help") || flags.has("-h") ? 0 : 2);
}

const escapeRe = s => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// ---------------------------------------------------------------------------
// Lightweight structural model of a query
// ---------------------------------------------------------------------------

const CLAUSE_RE = /\b(FROM|WHERE|SORT|GROUP\s+BY|FLATTEN|LIMIT)\b/gi;

/** Blank out string literals and // comments so keyword matching cannot fire inside them. */
function blankStrings(src) {
    return src
        .replace(/"(?:[^"\\]|\\.)*"/g, s => '"' + " ".repeat(Math.max(0, s.length - 2)) + '"')
        .split("\n")
        .map(l => l.replace(/\/\/.*$/, m => " ".repeat(m.length)))
        .join("\n");
}

/**
 * Split a DQL query into a header plus an ordered list of clauses. Offsets are preserved so the
 * raw text (strings intact) can be sliced for the same ranges.
 */
function parseShape(raw) {
    const masked = blankStrings(raw);
    const hits = [...masked.matchAll(CLAUSE_RE)].map(m => ({
        kw: m[1].toUpperCase().replace(/\s+/g, " "),
        start: m.index,
        end: m.index + m[0].length,
    }));

    const header = {
        masked: masked.slice(0, hits.length ? hits[0].start : masked.length).trim(),
        raw: raw.slice(0, hits.length ? hits[0].start : raw.length).trim(),
    };

    const clauses = hits.map((h, i) => {
        const to = i + 1 < hits.length ? hits[i + 1].start : masked.length;
        return {
            kw: h.kw,
            index: i,
            masked: masked.slice(h.end, to).trim(),
            raw: raw.slice(h.end, to).trim(),
        };
    });

    const type = /^(TABLE|LIST|TASK|CALENDAR)\b/i.exec(header.masked)?.[1]?.toUpperCase();
    return { raw, masked, header, clauses, type, order: clauses.map(c => c.kw) };
}

const of = (shape, kw) => shape.clauses.filter(c => c.kw === kw);
const has = (shape, kw) => shape.order.includes(kw);

/** Remove date()/dur() calls and wiki links, so date-shaped text inside them is not misread. */
function stripDateish(text) {
    return text
        .replace(/\bdate\s*\([^)]*\)/gi, "date()")
        .replace(/\bdur\s*\([^)]*\)/gi, "dur()")
        .replace(/\[\[[^\]]*\]\]/g, "[[]]");
}

// ---------------------------------------------------------------------------
// Rules
// ---------------------------------------------------------------------------

/** Each rule: { id, kind: "cost"|"trap", weight, note, test(shape) -> boolean }. */
const RULES = [
    // ---------------------------------------------------------------- cost
    {
        id: "no-from",
        kind: "cost",
        weight: 4,
        note: "No FROM: materializes every note in the vault on every refresh. Add the narrowest source that can hold the answer.",
        test: s => !has(s, "FROM"),
    },
    {
        id: "negated-source",
        kind: "cost",
        weight: 3,
        note: 'A negated source (-"folder" / -#tag) enumerates every markdown file and subtracts. Prefer a positive source ANDed with the negation.',
        test: s => of(s, "FROM").some(c => /(^|[\s(])[-!]\s*["#[]/.test(c.raw)),
    },
    {
        id: "incoming-link-source",
        kind: "cost",
        weight: 2,
        note: "FROM [[Note]] (incoming links) does a full scan of the vault's resolved-link table.",
        test: s => of(s, "FROM").some(c => /\[\[/.test(c.raw) && !/\boutgoing\s*\(/i.test(c.raw)),
    },
    {
        id: "flatten-then-unrelated-where",
        kind: "cost",
        weight: 4,
        note: "A WHERE after FLATTEN does not reference the flattened value, so it could have run before it. FLATTEN deep-copies the whole row per element — move that filter above the FLATTEN.",
        test: s => {
            for (const f of of(s, "FLATTEN")) {
                const alias = flattenAlias(f.masked);
                for (const w of of(s, "WHERE")) {
                    if (w.index < f.index) continue;
                    if (!alias || !new RegExp(`\\b${escapeRe(alias)}\\b`).test(w.masked)) return true;
                }
            }
            return false;
        },
    },
    {
        id: "flatten-lists-unnarrowed",
        kind: "cost",
        weight: 3,
        note: "FLATTEN over file.lists / file.tasks with nothing narrowing the rows first: it multiplies rows by the list items per note, deep-copying each one. Add a FROM and a WHERE above the FLATTEN. (It also silently drops notes with no list items.)",
        test: s =>
            of(s, "FLATTEN").some(
                f =>
                    /\bfile\.(lists|tasks)\b/i.test(f.masked) &&
                    (!has(s, "FROM") || !of(s, "WHERE").some(w => w.index < f.index))
            ),
    },
    {
        id: "multiple-flatten",
        kind: "cost",
        weight: 3,
        note: "More than one FLATTEN: the row count multiplies, and so does the per-row deep copy.",
        test: s => of(s, "FLATTEN").length > 1,
    },
    {
        id: "sort-before-where",
        kind: "cost",
        weight: 2,
        note: "SORT runs before a WHERE, so rows that are about to be discarded get sorted. Sorting costs roughly 13x a filter per row.",
        test: s => of(s, "SORT").some(x => of(s, "WHERE").some(w => w.index > x.index)),
    },
    {
        id: "group-before-plain-where",
        kind: "cost",
        weight: 2,
        note: "A WHERE after GROUP BY that does not use rows/key would have been cheaper before it — and after GROUP BY, plain field references are null anyway.",
        test: s =>
            of(s, "GROUP BY").some(g =>
                of(s, "WHERE").some(w => w.index > g.index && !/\b(rows|key|length\s*\()/i.test(w.masked))
            ),
    },
    {
        id: "no-limit-with-flatten",
        kind: "cost",
        weight: 1,
        note: "A FLATTEN with no LIMIT renders every produced row; rendering runs Obsidian's markdown renderer per cell.",
        test: s => has(s, "FLATTEN") && !has(s, "LIMIT"),
    },
    {
        id: "link-indexing-in-filter",
        kind: "cost",
        weight: 1,
        note: "Indexing through a link inside a filter resolves a link per row. Filter on local fields first.",
        test: s => of(s, "WHERE").some(c => /(\[\[[^\]]*\]\]\s*\.|\blink\s*\([^)]*\)\s*\.)/.test(c.raw)),
    },

    // ---------------------------------------------------------------- traps
    {
        id: "sort-after-bare-header",
        kind: "trap",
        weight: 5,
        note: 'PARSE ERROR: SORT directly after a fieldless LIST/TABLE. The header consumes the word SORT, which is not a reserved word, and the query fails with "PARSING FAILED". Give the header a field, or put FROM/WHERE first.',
        test: s =>
            (s.type === "LIST" || s.type === "TABLE") &&
            /^(TABLE|LIST)(\s+WITHOUT\s+ID)?$/i.test(s.header.masked.trim()) &&
            s.order[0] === "SORT",
    },
    {
        id: "bare-date",
        kind: "trap",
        weight: 4,
        note: "A bare YYYY-MM-DD in an expression is arithmetic, not a date: 2021-01-01 evaluates to 2019. Wrap it in date(...).",
        test: s => /(^|[^\w"\-[])\d{4}-\d{2}-\d{2}(?![\w\-\]])/.test(stripDateish(s.masked)),
    },
    {
        id: "null-unsafe-comparison",
        kind: "trap",
        weight: 3,
        note: 'A <, <= or != comparison with no guard: null is smaller than everything, so notes MISSING the field match. Add `WHERE field AND ...` or `typeof(field) = "..."`.',
        test: s => of(s, "WHERE").some(c => nullUnsafe(c.masked, s.masked)),
    },
    {
        id: "mixed-and-or",
        kind: "trap",
        weight: 3,
        note: "and/or share one precedence level and associate left to right: `a or b and c` is `(a or b) and c`. Parenthesise.",
        test: s => [...of(s, "WHERE"), ...of(s, "FROM")].some(c => mixedAndOr(c.masked)),
    },
    {
        id: "aggregate-without-nonnull",
        kind: "trap",
        weight: 3,
        note: "sum()/average()/product() over rows.x throws as soon as one row lacks x, which fails the whole query. Use sum(nonnull(rows.x)).",
        test: s => /\b(sum|average|product)\s*\(\s*(?!nonnull)[^)]*\brows\./i.test(s.masked),
    },
    {
        id: "second-from",
        kind: "trap",
        weight: 4,
        note: 'A second FROM parses but fails at run time with "Unrecognized query operation". Combine sources with and/or inside one FROM.',
        test: s => of(s, "FROM").length > 1,
    },
    {
        id: "folder-trailing-slash",
        kind: "trap",
        weight: 4,
        note: 'A folder source with a trailing slash matches nothing. Write FROM "Path/To/Folder".',
        test: s => of(s, "FROM").some(c => /"[^"]+\/"/.test(c.raw)),
    },
    {
        id: "contains-on-tags",
        kind: "trap",
        weight: 2,
        note: "contains() on a list ends in a SUBSTRING test per element, so #proj also matches #project. Use econtains() for exact membership.",
        test: s => /\bcontains\s*\(\s*[\w.]*\b(tags|etags)\b/i.test(s.masked),
    },
    {
        id: "regexmatch-anchored",
        kind: "trap",
        weight: 2,
        note: "regexmatch() auto-anchors to ^...$ unless the pattern already starts with ^ or ends with $. For a substring search use regextest().",
        test: s => {
            for (const m of s.raw.matchAll(/\bregexmatch\s*\(\s*"((?:[^"\\]|\\.)*)"/gi)) {
                if (!m[1].startsWith("^") && !m[1].endsWith("$")) return true;
            }
            return false;
        },
    },
    {
        id: "identifier-hyphen-number",
        kind: "trap",
        weight: 3,
        note: "`-` is a valid identifier character, so `count-1` is ONE field name, not subtraction. Put spaces around the operator: `count - 1`.",
        test: s => /[A-Za-z][\w-]*-\d+(?![\w-])/.test(stripDateish(s.masked)),
    },
    {
        id: "limit-negative",
        kind: "trap",
        weight: 2,
        note: "LIMIT with a negative value drops rows from the END (Array.slice semantics); it does not return nothing.",
        test: s => of(s, "LIMIT").some(c => /^-\s*\d/.test(c.masked)),
    },
    {
        id: "field-after-group",
        kind: "trap",
        weight: 3,
        note: "After GROUP BY only key, rows and the group name exist; every other field reference — file.* included — is null. Use rows.<field>.",
        test: s => fieldAfterGroup(s),
    },
    {
        id: "task-from-tag",
        kind: "trap",
        weight: 2,
        note: 'In a TASK query FROM selects PAGES, then every task in them is returned. To filter tasks by tag use WHERE contains(tags, "#x").',
        test: s => s.type === "TASK" && of(s, "FROM").some(c => /#/.test(c.raw)),
    },
];

function flattenAlias(clauseText) {
    const as = /\bAS\s+("([^"]+)"|[\w-]+)\s*$/i.exec(clauseText.trim());
    if (as) return (as[2] ?? as[1]).trim();
    const expr = clauseText.trim();
    return /^[\w.-]+$/.test(expr) ? expr.split(".").pop() : undefined;
}

function nullUnsafe(clause, whole) {
    if (!/(<=|<|!=)/.test(clause)) return false;
    for (const m of clause.matchAll(/([A-Za-zÀ-￿][\w.À-￿-]*)\s*(?:<=|<|!=)/g)) {
        const name = m[1];
        if (name.startsWith("file.")) continue; // implicit fields always exist
        if (/^(true|false|null|date|dur|length|number|string)$/i.test(name)) continue;
        const n = escapeRe(name);
        const guarded =
            new RegExp(`typeof\\s*\\(\\s*${n}\\s*\\)`, "i").test(whole) ||
            new RegExp(`default\\s*\\(\\s*${n}\\b`, "i").test(whole) ||
            new RegExp(`\\b${n}\\s+(AND|and|&)`, "").test(whole) ||
            new RegExp(`(AND|and|WHERE|where|&)\\s+${n}\\s*(\\)|$|\\n)`, "").test(whole);
        if (!guarded) return true;
    }
    return false;
}

function mixedAndOr(text) {
    let body = text;
    for (let i = 0; i < 4; i++) body = body.replace(/\([^()]*\)/g, " "); // drop nested groups
    const hasAnd = /\b(and|AND)\b|&/.test(body);
    const hasOr = /\b(or|OR)\b|\|/.test(body);
    return hasAnd && hasOr;
}

function fieldAfterGroup(s) {
    const gi = s.clauses.findIndex(c => c.kw === "GROUP BY");
    if (gi === -1) return false;
    const groupAlias = flattenAlias(s.clauses[gi].masked) ?? "";
    for (const c of s.clauses.slice(gi + 1)) {
        if (!["WHERE", "SORT", "FLATTEN"].includes(c.kw)) continue;
        let t = c.masked
            .replace(/\brows(\.[\w-]+)*/gi, " ")
            .replace(/[\w-]+\s*\(/g, "(") // drop function names
            .replace(/"[^"]*"/g, " ")
            .replace(/\b\d+(\.\d+)?\b/g, " ");
        for (const m of t.matchAll(/[A-Za-zÀ-￿][\w.À-￿-]*/g)) {
            const id = m[0];
            if (/^(key|true|false|null|asc|desc|ascending|descending|and|or|not|as)$/i.test(id)) continue;
            if (groupAlias && id === groupAlias) continue;
            return true;
        }
    }
    return false;
}

// ---------------------------------------------------------------------------
// Scanning
// ---------------------------------------------------------------------------

const SKIP_DIRS = new Set([".obsidian", ".trash", ".git", "node_modules", ".stversions", ".smart-env"]);

async function* walk(dir) {
    let entries;
    try {
        entries = await readdir(dir, { withFileTypes: true });
    } catch {
        return;
    }
    for (const e of entries) {
        const full = join(dir, e.name);
        if (e.isDirectory()) {
            if (SKIP_DIRS.has(e.name)) continue;
            yield* walk(full);
        } else if (e.isFile() && /\.(md|markdown)$/i.test(e.name)) {
            yield full;
        }
    }
}

const FENCE = /^([ \t]*)(`{3,}|~{3,})[ \t]*([A-Za-z0-9_-]+)[ \t]*$/;

function extractBlocks(text) {
    const lines = text.split("\n");
    const blocks = [];
    let open = null;
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (open) {
            if (new RegExp(`^[ \\t]*${open.fence}[ \\t]*$`).test(line)) {
                blocks.push({ ...open, endLine: i + 1, raw: open.body.join("\n") });
                open = null;
            } else {
                open.body.push(line);
            }
            continue;
        }
        const m = FENCE.exec(line);
        if (!m) continue;
        const lang = m[3].toLowerCase();
        if (lang === "dataview" || lang === "dataviewjs") {
            open = { type: lang === "dataview" ? "dql" : "js", fence: m[2], startLine: i + 1, body: [] };
        }
    }
    if (open) blocks.push({ ...open, endLine: lines.length, raw: open.body.join("\n") }); // unterminated fence

    const covered = new Set();
    for (const b of blocks) for (let l = b.startLine; l <= (b.endLine ?? b.startLine); l++) covered.add(l);
    for (let i = 0; i < lines.length; i++) {
        if (covered.has(i + 1)) continue;
        for (const m of lines[i].matchAll(/`(\$?=)\s*([^`]+)`/g)) {
            blocks.push({
                type: m[1] === "$=" ? "inline-js" : "inline",
                startLine: i + 1,
                endLine: i + 1,
                raw: m[2].trim(),
            });
        }
    }
    return blocks;
}

function analyze(block) {
    const raw = block.raw ?? "";
    const findings = [];
    if (block.type === "dql") {
        const shape = parseShape(raw);
        if (shape.type) {
            for (const rule of RULES) {
                let hit = false;
                try {
                    hit = rule.test(shape);
                } catch {
                    hit = false;
                }
                if (hit) findings.push(rule);
            }
        }
    } else if (block.type === "inline") {
        // Inline queries are a single expression: only expression-level traps apply.
        const shape = { raw, masked: blankStrings(raw), header: { masked: "", raw: "" }, clauses: [], order: [] };
        for (const id of ["bare-date", "identifier-hyphen-number", "regexmatch-anchored", "mixed-and-or"]) {
            const rule = RULES.find(r => r.id === id);
            let hit = false;
            try {
                hit = id === "mixed-and-or" ? mixedAndOr(shape.masked) : rule.test(shape);
            } catch {
                hit = false;
            }
            if (hit) findings.push(rule);
        }
    }
    const cost = findings.filter(f => f.kind === "cost").reduce((a, f) => a + f.weight, 0);
    const trap = findings.filter(f => f.kind === "trap").reduce((a, f) => a + f.weight, 0);
    return { findings, cost, trap, score: cost + trap };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

const root = VAULT.replace(new RegExp(`${escapeRe(sep)}$`), "");
try {
    const s = await stat(root);
    if (!s.isDirectory()) throw new Error("not a directory");
} catch {
    console.error(`error: '${VAULT}' is not a readable directory.`);
    process.exit(2);
}

const results = [];
const perFile = new Map();
let fileCount = 0;
let blockCount = 0;
const byType = { dql: 0, js: 0, inline: 0, "inline-js": 0 };

for await (const path of walk(root)) {
    fileCount++;
    let text;
    try {
        text = await readFile(path, "utf8");
    } catch {
        continue;
    }
    if (!text.includes("dataview") && !/`\$?=/.test(text)) continue;
    const blocks = extractBlocks(text);
    if (blocks.length === 0) continue;
    const rel = relative(root, path);
    perFile.set(rel, (perFile.get(rel) ?? 0) + blocks.length);
    for (const b of blocks) {
        blockCount++;
        byType[b.type] = (byType[b.type] ?? 0) + 1;
        results.push({ file: rel, line: b.startLine, type: b.type, source: b.raw, ...analyze(b) });
    }
}

// Blocks-per-note is a cost signal in its own right: every visible block re-runs on each refresh.
const crowded = [...perFile.entries()].filter(([, n]) => n >= 4).sort((a, b) => b[1] - a[1]);

results.sort((a, b) => b.score - a.score || a.file.localeCompare(b.file) || a.line - b.line);
const shown = results.filter(r => r.score >= MIN_SCORE).slice(0, TOP);

if (AS_JSON) {
    console.log(
        JSON.stringify(
            {
                vault: root,
                scanned: { files: fileCount, blocks: blockCount, byType },
                crowdedNotes: crowded.map(([file, blocks]) => ({ file, blocks })),
                queries: shown.map(r => ({
                    file: r.file,
                    line: r.line,
                    type: r.type,
                    cost: r.cost,
                    trap: r.trap,
                    score: r.score,
                    findings: r.findings.map(f => ({ id: f.id, kind: f.kind, weight: f.weight, note: f.note })),
                    source: r.source,
                })),
            },
            null,
            2
        )
    );
    process.exit(0);
}

const bar = "─".repeat(78);
console.log(`\nDataview audit — ${root}`);
console.log(bar);
console.log(
    `${fileCount} markdown files scanned · ${blockCount} queries found ` +
        `(${byType.dql} dataview, ${byType.js} dataviewjs, ${byType.inline} inline, ${byType["inline-js"]} inline JS)`
);
console.log(`${results.filter(r => r.score >= 1).length} with findings · showing ${shown.length}`);

if (crowded.length) {
    console.log(`\nNotes with many queries (all of them re-run together on every refresh):`);
    for (const [file, n] of crowded.slice(0, 10)) console.log(`  ${String(n).padStart(3)} queries  ${file}`);
}

if (!shown.length) {
    console.log(`\nNothing to report.${SHOW_ALL ? "" : "  (Use --all to list every query.)"}\n`);
    process.exit(0);
}

for (const r of shown) {
    console.log(`\n${bar}`);
    console.log(`${r.file}:${r.line}  [${r.type}]  cost ${r.cost} · traps ${r.trap}`);
    const src = r.source.split("\n");
    const preview = src.length > 12 ? [...src.slice(0, 11), `… ${src.length - 11} more lines`] : src;
    for (const l of preview) console.log(`  │ ${l}`);
    for (const f of r.findings) {
        console.log(`  ${f.kind === "trap" ? "TRAP" : "COST"}  ${f.id}`);
        console.log(`        ${f.note}`);
    }
}

console.log(`\n${bar}`);
console.log("Every finding is a candidate: this tool segments clauses by keyword, it does not parse DQL.");
console.log("Confirm against the note and the actual source size before rewriting.\n");
