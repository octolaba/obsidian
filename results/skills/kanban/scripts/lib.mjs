import fs from 'node:fs';
import path from 'node:path';

export const TOOL_VERSION = '1.0.0';

/**
 * Shared harness exit meanings. 0-4 is the repository-wide baseline; a documented tool-specific
 * code starts at 5, and `kanban-card.mjs` and `kanban-migrate.mjs` define exactly one: 5, refused,
 * used when a request is understood but declined because acting on it would not be safe.
 */
export const EXIT = Object.freeze({
    clean: 0,
    findings: 1,
    usage: 2,
    missingMaterial: 3,
    identityMismatch: 4,
    refused: 5,
});

/**
 * Finding severities, ordered by consequence.
 *
 * - `error`   the plugin will misparse, refuse to load, or silently lose content.
 * - `warning` the plugin parses the file, but the result is not what the text suggests, or the
 *             next save will change bytes the author did not intend to change.
 * - `info`    true of the pin and worth knowing, with no consequence for this board.
 */
export const SEVERITIES = Object.freeze(['error', 'warning', 'info']);

/** Only these severities make a run fail; an `info`-only run prints and exits 0. */
export const FAILING_SEVERITIES = Object.freeze(new Set(['error', 'warning']));

export const CONFIDENCES = Object.freeze(['high', 'medium', 'low']);

/**
 * What a finding costs, and therefore how loud it is allowed to be.
 *
 * Severity is a property of the consequence, not of the tool's opinion and not of which file the
 * rule happens to cite. A rule declares what actually happens to the user's board; the severity
 * follows from that mechanically, so two rules with the same consequence can never disagree about
 * how serious they are. `verify.mjs` re-derives every rule's severity from its consequence and
 * fails if a rule was written with one it did not earn.
 */
export const CONSEQUENCES = Object.freeze({
    /**
     * Obsidian does not present this file as a board. Either it fails to parse — in which case it
     * also refuses to save it — or nothing ever recognises it as a board in the first place.
     */
    'board-does-not-load': 'error',
    /** The board loads, but text the author can see is deleted by the next save. */
    'content-lost': 'error',
    /** The board loads and keeps its text, but it means something other than it looks like. */
    'meaning-differs': 'warning',
    /** Nothing is lost and nothing changes meaning; the next save rewrites bytes anyway. */
    'bytes-change-on-save': 'info',
    /** True of this board and worth knowing, with no consequence for it. */
    informational: 'info',
});

export function severityFor(consequence) {
    const severity = CONSEQUENCES[consequence];
    if (!severity) throw new Error(`unknown consequence ${consequence}`);
    return severity;
}

const DEFAULT_SKIP_DIRECTORIES = Object.freeze([
    '.git',
    '.github',
    '.obsidian',
    '.trash',
    'node_modules',
]);

/**
 * Strict argument parsing: an unknown flag is a usage error rather than a silently ignored token,
 * because every one of these tools acts on a path the caller names, and two of them can write.
 */
export function parseArgs(argv, options = {}) {
    const booleans = new Set(options.booleans ?? []);
    const values = new Set(options.values ?? []);
    const repeatable = new Set(options.repeatable ?? []);
    const aliases = new Map([['-h', 'help'], ...(options.aliases ?? [])]);
    const result = { _: [] };
    for (const name of repeatable) result[name] = [];
    for (let index = 0; index < argv.length; index += 1) {
        let token = argv[index];
        if (aliases.has(token)) token = `--${aliases.get(token)}`;
        if (!token.startsWith('--')) {
            result._.push(token);
            continue;
        }
        const equal = token.indexOf('=');
        const name = token.slice(2, equal === -1 ? undefined : equal);
        if (booleans.has(name)) {
            result[name] = equal === -1 ? true : token.slice(equal + 1) !== 'false';
            continue;
        }
        if (!values.has(name) && !repeatable.has(name)) {
            throw new Error(`unknown option --${name}`);
        }
        const value = equal === -1 ? argv[++index] : token.slice(equal + 1);
        if (value === undefined) throw new Error(`missing value for --${name}`);
        if (repeatable.has(name)) result[name].push(value);
        else result[name] = value;
    }
    return result;
}

export function writeUsageError(error, usage, exitCode = EXIT.usage) {
    process.stderr.write(`error: ${error.message}\n${usage}\n`);
    process.exitCode = exitCode;
}

export function toPosix(value) {
    return value.split(path.sep).join('/');
}

export function relativeTo(root, value) {
    return toPosix(path.relative(root, value));
}

export function readJson(file, fallback = null) {
    try {
        return JSON.parse(fs.readFileSync(file, 'utf8'));
    } catch (error) {
        if (error?.code === 'ENOENT') return fallback;
        throw error;
    }
}

/** Normalised text, for reading the pinned tree and this skill's own markdown. */
export function readText(file) {
    return fs.readFileSync(file, 'utf8').replace(/\r\n?/g, '\n');
}

/**
 * Unnormalised text, for reading a board that may be written back.
 *
 * A board is edited by splicing lines into the bytes that are already on disk, so line endings and
 * a final newline have to survive the round trip. Normalising here would make every mutation also a
 * whole-file line-ending change.
 */
export function readRaw(file) {
    return fs.readFileSync(file, 'utf8');
}

/**
 * Whether the file's bytes survive being decoded and encoded again.
 *
 * Everything here works on strings, and a byte that is not valid UTF-8 decodes to a replacement
 * character that cannot be turned back into the original byte. Writing such a file out would destroy
 * those bytes silently — and would destroy them in the backup too, because the backup is written
 * from the same decoded string. A caller that is about to write has to ask this first.
 */
export function decodesLosslessly(file) {
    const bytes = fs.readFileSync(file);
    return Buffer.from(bytes.toString('utf8'), 'utf8').equals(bytes);
}

/** Whether a file mixes CRLF and bare LF, which no single join can reproduce. */
export function hasMixedLineEndings(text) {
    return /\r\n/.test(text) && /(?<!\r)\n/.test(text);
}

/** The dominant line ending in a file, and whether it ends with one. */
export function detectEol(text) {
    const crlf = (text.match(/\r\n/g) ?? []).length;
    const lf = (text.match(/(?<!\r)\n/g) ?? []).length;
    return {
        eol: crlf > lf ? '\r\n' : '\n',
        trailingNewline: /\r?\n$/.test(text),
    };
}

export function isDirectory(value) {
    return Boolean(value) && fs.existsSync(value) && fs.statSync(value).isDirectory();
}

export function isFile(value) {
    return Boolean(value) && fs.existsSync(value) && fs.statSync(value).isFile();
}

export function resolveDirectory(value, option) {
    if (value === undefined || value === null || value === '') {
        throw new Error(`${option} is required`);
    }
    const resolved = path.resolve(value);
    if (!isDirectory(resolved)) throw new Error(`${option} is not a directory: ${resolved}`);
    return resolved;
}

/**
 * A file argument that must live inside a declared root.
 *
 * Board paths arrive from a caller and from migration plans, so a `..` segment or an absolute path
 * that escapes the vault is refused here rather than discovered after a write.
 */
/**
 * A file argument that must live inside a declared root, symlinks included.
 *
 * A lexical check is not enough: a link inside the vault can point anywhere, and following one would
 * let a `--board` argument read and write outside the tree the caller declared. Both sides are
 * resolved through the filesystem before they are compared.
 */
export function resolveContainedFile(root, value, option) {
    if (value === undefined || value === null || value === '') {
        throw new Error(`${option} is required`);
    }
    const resolvedRoot = fs.realpathSync(path.resolve(root));
    const lexical = path.resolve(resolvedRoot, value);
    if (!isFile(lexical)) throw new Error(`${option} is not a file: ${lexical}`);
    const resolved = fs.realpathSync(lexical);
    for (const candidate of [lexical, resolved]) {
        if (candidate !== resolvedRoot && !candidate.startsWith(resolvedRoot + path.sep)) {
            throw new Error(`${option} resolves outside the vault: ${candidate}`);
        }
    }
    return resolved;
}

/** True when a path, once every link is followed, is still inside the declared root. */
export function isContained(root, file) {
    try {
        const resolvedRoot = fs.realpathSync(path.resolve(root));
        const resolved = fs.realpathSync(path.resolve(file));
        return resolved === resolvedRoot || resolved.startsWith(resolvedRoot + path.sep);
    } catch {
        return false;
    }
}

export function walkFiles(root, options = {}) {
    const skip = new Set(options.skipDirectories ?? DEFAULT_SKIP_DIRECTORIES);
    const skipDirectory = options.skipDirectory ?? (name => skip.has(name));
    const files = [];
    const visit = directory => {
        let entries;
        try {
            entries = fs.readdirSync(directory, { withFileTypes: true });
        } catch {
            return;
        }
        for (const entry of entries) {
            const absolute = path.join(directory, entry.name);
            if (entry.isSymbolicLink()) {
                // Follow a linked file, never a linked directory: a vault can link individual notes,
                // and following a directory link can leave the scanned tree.
                if (isFile(absolute)) files.push(absolute);
                continue;
            }
            if (entry.isDirectory()) {
                if (!skipDirectory(entry.name)) visit(absolute);
            } else if (entry.isFile()) {
                files.push(absolute);
            }
        }
    };
    if (isDirectory(root)) visit(root);
    return files.sort();
}

/** Markdown notes in a vault, in a stable order. */
export function markdownFiles(root) {
    return walkFiles(root).filter(file => path.extname(file).toLowerCase() === '.md');
}

/** Offset -> 1-based line, precomputed once per file because a scan produces many matches. */
export function lineLocator(text) {
    const starts = [0];
    for (let index = 0; index < text.length; index += 1) {
        if (text[index] === '\n') starts.push(index + 1);
    }
    return offset => {
        let low = 0;
        let high = starts.length - 1;
        while (low < high) {
            const middle = Math.ceil((low + high) / 2);
            if (starts[middle] <= offset) low = middle;
            else high = middle - 1;
        }
        return low + 1;
    };
}

/**
 * Every finding carries its evidence: an id, a declared consequence, a citation, and a fix. The
 * severity is derived, never supplied, so a rule cannot be made louder than what it does to a board.
 */
export function makeFinding({
    id,
    consequence,
    confidence,
    file = null,
    line = null,
    cite,
    fix,
    note = null,
}) {
    const severity = severityFor(consequence);
    if (!CONFIDENCES.includes(confidence)) throw new Error(`unknown confidence ${confidence} on ${id}`);
    if (!cite) throw new Error(`missing citation on ${id}`);
    return { id, consequence, severity, confidence, file, line, cite, fix, note };
}

function severityRank(severity) {
    return SEVERITIES.indexOf(severity);
}

export function sortFindings(findings) {
    return [...findings].sort(
        (left, right) =>
            severityRank(left.severity) - severityRank(right.severity) ||
            String(left.file ?? '').localeCompare(String(right.file ?? '')) ||
            (left.line ?? 0) - (right.line ?? 0) ||
            left.id.localeCompare(right.id),
    );
}

export function buildReport({
    tool,
    target,
    mode = null,
    scanned = {},
    findings,
    assumptions,
    limitations,
    notes = [],
}) {
    const sorted = sortFindings(findings);
    const bySeverity = Object.fromEntries(
        SEVERITIES.map(severity => [severity, sorted.filter(item => item.severity === severity).length]),
    );
    return {
        tool,
        version: TOOL_VERSION,
        target,
        mode,
        scanned,
        summary: { total: sorted.length, bySeverity, failing: sorted.filter(isFailing).length },
        assumptions,
        limitations,
        notes,
        findings: sorted,
    };
}

export function isFailing(finding) {
    return FAILING_SEVERITIES.has(finding.severity);
}

export function exitCodeFor(report) {
    return report.findings.some(isFailing) ? EXIT.findings : EXIT.clean;
}

function sarifLevel(severity) {
    if (severity === 'error') return 'error';
    if (severity === 'warning') return 'warning';
    return 'note';
}

export function sarifReport(report, rules) {
    const used = [...new Set(report.findings.map(item => item.id))].sort();
    return {
        version: '2.1.0',
        $schema: 'https://json.schemastore.org/sarif-2.1.0.json',
        runs: [
            {
                tool: {
                    driver: {
                        name: report.tool,
                        version: report.version,
                        rules: used.map(id => ({
                            id,
                            shortDescription: { text: rules[id].message },
                            help: { text: `${rules[id].fix} Evidence: ${rules[id].cite}` },
                            properties: { severity: rules[id].severity, citation: rules[id].cite },
                        })),
                    },
                },
                // A SARIF consumer cannot ask a follow-up question, so the caveats travel with the
                // results: run properties carry the whole report header, and every limitation is
                // also a notification, which is what a viewer surfaces beside the findings.
                invocations: [
                    {
                        executionSuccessful: true,
                        toolExecutionNotifications: report.limitations.map(text => ({
                            level: 'note',
                            message: { text },
                        })),
                    },
                ],
                properties: {
                    target: report.target,
                    mode: report.mode,
                    scanned: report.scanned,
                    assumptions: report.assumptions,
                    limitations: report.limitations,
                    notes: report.notes,
                },
                results: report.findings.map(item => ({
                    ruleId: item.id,
                    level: sarifLevel(item.severity),
                    message: {
                        text: `${rules[item.id].message}${item.note ? ` ${item.note}` : ''} Fix: ${item.fix}`,
                    },
                    locations: [
                        {
                            physicalLocation: {
                                artifactLocation: { uri: item.file ?? '.' },
                                region: { startLine: Math.max(1, item.line ?? 1) },
                            },
                        },
                    ],
                    properties: {
                        severity: item.severity,
                        confidence: item.confidence,
                        citation: item.cite,
                    },
                })),
            },
        ],
    };
}

export function renderText(report, rules) {
    const out = [];
    out.push(`${report.tool} ${report.version} — ${report.target}`);
    if (report.mode) out.push(`mode: ${report.mode}`);
    const scanned = Object.entries(report.scanned)
        .map(([key, value]) => `${key}=${value}`)
        .join(', ');
    if (scanned) out.push(`scanned: ${scanned}`);
    out.push('');
    if (report.findings.length === 0) {
        out.push('findings: none');
    } else {
        out.push(
            `findings: ${report.summary.total} (${SEVERITIES.map(
                severity => `${severity} ${report.summary.bySeverity[severity]}`,
            ).join(', ')})`,
        );
        out.push('');
        for (const item of report.findings) {
            const where = item.file ? `${item.file}${item.line ? `:${item.line}` : ''}` : '<board>';
            out.push(
                `${where} ${item.severity.toUpperCase()} ${item.id} [${item.confidence}] ${rules[item.id].message}`,
            );
            out.push(`  cite: ${item.cite}`);
            out.push(`  fix:  ${item.fix}`);
            if (item.note) out.push(`  note: ${item.note}`);
        }
    }
    if (report.notes.length) {
        out.push('');
        out.push('notes:');
        for (const note of report.notes) out.push(`- ${note}`);
    }
    out.push('');
    out.push('assumptions:');
    for (const item of report.assumptions) out.push(`- ${item}`);
    out.push('');
    out.push('limitations:');
    for (const item of report.limitations) out.push(`- ${item}`);
    out.push('');
    return `${out.join('\n')}`;
}

export function emitReport(report, rules, format) {
    if (format === 'json') {
        process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
    } else if (format === 'sarif') {
        process.stdout.write(`${JSON.stringify(sarifReport(report, rules), null, 2)}\n`);
    } else {
        process.stdout.write(renderText(report, rules));
    }
}

export function assertFormat(format, allowed) {
    if (!allowed.includes(format)) {
        throw new Error(`--format must be one of ${allowed.join(', ')}`);
    }
    return format;
}

/**
 * A unified diff between two versions of one file, so a dry run shows exactly what a write would
 * change. The algorithm is a plain longest-common-subsequence over lines: boards are small, and a
 * dependency-free diff is worth more here than an optimal one.
 */
/** Above this many line pairs the quadratic table costs more memory than a preview is worth. */
const DIFF_CELL_BUDGET = 4_000_000;

export function unifiedDiff(before, after, label, context = 3) {
    const a = before.split('\n');
    const b = after.split('\n');
    if ((a.length + 1) * (b.length + 1) > DIFF_CELL_BUDGET) {
        // A board this size would need gigabytes to diff exactly, and a preview nobody can read is
        // not worth an out-of-memory kill. Report the shape of the change instead of drawing it.
        const shared = new Set(a);
        const added = b.filter(line => !shared.has(line)).length;
        const kept = new Set(b);
        const removed = a.filter(line => !kept.has(line)).length;
        return [
            `--- a/${label}`,
            `+++ b/${label}`,
            `@@ ${a.length} lines before, ${b.length} lines after @@`,
            `# too large to diff line by line: about ${removed} lines removed and ${added} added`,
            '',
        ].join('\n');
    }
    const lcs = Array.from({ length: a.length + 1 }, () => new Uint32Array(b.length + 1));
    for (let i = a.length - 1; i >= 0; i -= 1) {
        for (let j = b.length - 1; j >= 0; j -= 1) {
            lcs[i][j] = a[i] === b[j] ? lcs[i + 1][j + 1] + 1 : Math.max(lcs[i + 1][j], lcs[i][j + 1]);
        }
    }
    const ops = [];
    let i = 0;
    let j = 0;
    while (i < a.length && j < b.length) {
        if (a[i] === b[j]) {
            ops.push([' ', a[i]]);
            i += 1;
            j += 1;
        } else if (lcs[i + 1][j] >= lcs[i][j + 1]) {
            ops.push(['-', a[i]]);
            i += 1;
        } else {
            ops.push(['+', b[j]]);
            j += 1;
        }
    }
    while (i < a.length) ops.push(['-', a[i++]]);
    while (j < b.length) ops.push(['+', b[j++]]);
    if (!ops.some(([kind]) => kind !== ' ')) return '';

    const out = [`--- a/${label}`, `+++ b/${label}`];
    let index = 0;
    let oldLine = 1;
    let newLine = 1;
    while (index < ops.length) {
        if (ops[index][0] === ' ') {
            oldLine += 1;
            newLine += 1;
            index += 1;
            continue;
        }
        let start = index;
        let leading = 0;
        while (start > 0 && ops[start - 1][0] === ' ' && leading < context) {
            start -= 1;
            leading += 1;
        }
        let end = index;
        let quiet = 0;
        while (end < ops.length && quiet <= context) {
            if (ops[end][0] === ' ') quiet += 1;
            else quiet = 0;
            end += 1;
        }
        const chunk = ops.slice(start, end);
        const oldCount = chunk.filter(([kind]) => kind !== '+').length;
        const newCount = chunk.filter(([kind]) => kind !== '-').length;
        out.push(`@@ -${oldLine - leading},${oldCount} +${newLine - leading},${newCount} @@`);
        for (const [kind, line] of chunk) out.push(`${kind}${line}`);
        for (const [kind] of ops.slice(index, end)) {
            if (kind !== '+') oldLine += 1;
            if (kind !== '-') newLine += 1;
        }
        index = end;
    }
    return `${out.join('\n')}\n`;
}
