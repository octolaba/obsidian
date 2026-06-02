import fs from 'node:fs';
import path from 'node:path';

export const TOOL_VERSION = '1.0.0';

/**
 * Shared harness exit meanings. 0-4 is the repository-wide baseline; documented
 * tool-specific codes would start at 5, and none of these tools defines one.
 */
export const EXIT = Object.freeze({
    clean: 0,
    findings: 1,
    usage: 2,
    missingMaterial: 3,
    identityMismatch: 4,
});

/**
 * Finding tiers, ordered by consequence. A tier is not a severity the tool invents: it names the
 * class of the upstream page the rule is written on, so a reader can find the rule.
 */
export const TIERS = Object.freeze(['policy', 'submission', 'guideline', 'checklist', 'convention']);

/** Only these tiers make a run fail; checklist and convention findings print and exit 0. */
export const FAILING_TIERS = Object.freeze(new Set(['policy', 'submission', 'guideline']));

export const CONFIDENCES = Object.freeze(['high', 'medium', 'low']);

/**
 * Cited file -> tiers that file may justify. Singleton sets are the mechanical part: a rule whose
 * evidence is the policy page is a policy finding and nothing else. Schema, reference and template
 * files carry more than one class of statement, so they declare the documented set they may carry.
 * verify.mjs asserts every rule's primary citation resolves to a file in this table and that the
 * rule's tier is a member.
 */
export const SOURCE_CLASSES = Object.freeze({
    'docs: en/Developer policies.md': ['policy'],
    'docs: en/Plugins/Releasing/Submission requirements for plugins.md': ['submission'],
    'docs: en/Plugins/Releasing/Submit your plugin.md': ['submission'],
    'docs: en/Themes/App themes/Submit your theme.md': ['submission'],
    'docs: en/Plugins/Releasing/Plugin guidelines.md': ['guideline'],
    'docs: en/Themes/App themes/Theme guidelines.md': ['guideline'],
    'docs: en/Plugins/Getting started/Mobile development.md': ['guideline'],
    'docs: en/Obsidian October plugin self-critique checklist.md': ['checklist'],
    'docs: en/Obsidian October theme self-critique checklist.md': ['checklist'],
    'docs: en/Reference/Manifest.md': ['submission', 'convention'],
    'docs: en/Reference/Versions.md': ['submission', 'convention'],
    'docs: en/Plugins/User interface/HTML elements.md': ['convention'],
    'api: obsidian.d.ts': ['convention'],
    'sample: esbuild.config.mjs': ['convention'],
    'rel: desktop-releases.json': ['convention'],
});

const DEFAULT_SKIP_DIRECTORIES = Object.freeze([
    '.git',
    '.github',
    '.obsidian',
    'node_modules',
    'dist',
    'build',
    'out',
    'coverage',
    '.next',
    '.svelte-kit',
]);

/**
 * Directories that hold something other than shipped plugin source. A Node import in a Jest helper
 * is not a mobile defect in `main.js`, a demo vault is content rather than code, and neither reaches
 * the bundle — so scanning them produces findings about files the user never ships.
 */
const NON_SOURCE_DIRECTORIES = Object.freeze([
    ...DEFAULT_SKIP_DIRECTORIES,
    'test',
    'tests',
    '__tests__',
    '__mocks__',
    'integration_tests',
    'scripts',
    'tools',
    'docs',
    'doc',
    'examples',
    'resources',
    'fixtures',
]);

/** `sample_vault`, `sample_vaults`, `sample-vaults/…`: demo content shipped inside a repository. */
const SAMPLE_VAULT_PATTERN = /^sample[-_]vaults?/i;

const TEST_FILE_PATTERN = /\.(?:test|spec)\./i;

/**
 * Build tooling runs in Node by design, so a Node import there is not a mobile defect and a `var`
 * there is not plugin style. The official template excludes the same files from its own ESLint run
 * (sample: eslint.config.mts:6-16).
 */
const BUILD_SCRIPT_BASENAMES = Object.freeze(
    new Set(['version-bump.mjs', 'esbuild.config.mjs', 'esbuild.config.js', 'esbuild.config.ts']),
);

const BUILD_SCRIPT_PATTERN = /(?:^|\.)(?:config|conf)\.[cm]?[jt]sx?$/i;

/**
 * `.svelte` and `.vue` are read as plain text like every other file here: the text rules see the
 * whole component, so `<script>` semantics are approximated rather than parsed.
 */
export const SOURCE_EXTENSIONS = Object.freeze(
    new Set(['.ts', '.tsx', '.mts', '.cts', '.js', '.jsx', '.mjs', '.cjs', '.svelte', '.vue']),
);

/**
 * Strict argument parsing: an unknown flag is a usage error rather than a silently ignored token,
 * because every one of these tools acts on a path the caller names.
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

export function readText(file) {
    return fs.readFileSync(file, 'utf8').replace(/\r\n?/g, '\n');
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
                // Follow a linked file, never a linked directory: a dev vault installs plugins as
                // per-file links, and following a directory link can leave the scanned tree.
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

export function isBuildScript(relative) {
    const base = path.posix.basename(relative);
    return BUILD_SCRIPT_BASENAMES.has(base) || BUILD_SCRIPT_PATTERN.test(base);
}

const NON_SOURCE_DIRECTORY_NAMES = new Set(NON_SOURCE_DIRECTORIES.map(name => name.toLowerCase()));

function isNonSourceDirectory(name) {
    return NON_SOURCE_DIRECTORY_NAMES.has(name.toLowerCase()) || SAMPLE_VAULT_PATTERN.test(name);
}

/**
 * The scan scope, in one sentence, so every report can state what was and was not read. A `src/`
 * directory is the template's layout and the strongest available signal of where shipped code
 * lives; without one there is nothing to narrow to, so the whole tree minus the excluded
 * directories is scanned instead.
 */
export function describeSourceScope(root) {
    const scoped = isDirectory(path.join(root, 'src'));
    return `${
        scoped ? 'Source rules read src/** plus root-level source files' : 'No src/ directory: source rules read the whole tree'
    }, minus ${NON_SOURCE_DIRECTORIES.join(', ')}, sample vaults, *.test.* and *.spec.*, built and minified output, and build or configuration scripts; file types read: ${[...SOURCE_EXTENSIONS].join(' ')}.`;
}

/** Source files a plugin's own code lives in; built and generated artifacts are not source. */
export function sourceFiles(root) {
    const scoped = isDirectory(path.join(root, 'src'));
    const walked = scoped
        ? walkFiles(path.join(root, 'src'), { skipDirectory: isNonSourceDirectory })
        : walkFiles(root, { skipDirectory: isNonSourceDirectory });
    const rootLevel = scoped
        ? (fs.existsSync(root) ? fs.readdirSync(root, { withFileTypes: true }) : [])
              .filter(entry => entry.isFile() || (entry.isSymbolicLink() && isFile(path.join(root, entry.name))))
              .map(entry => path.join(root, entry.name))
        : [];
    return [...new Set([...walked, ...rootLevel])]
        .sort()
        .map(file => ({ absolute: file, relative: relativeTo(root, file) }))
        .filter(({ relative }) => {
            const base = path.posix.basename(relative);
            if (!SOURCE_EXTENSIONS.has(path.posix.extname(base).toLowerCase())) return false;
            if (base === 'main.js' || /\.min\.[cm]?js$/i.test(base)) return false;
            if (TEST_FILE_PATTERN.test(base)) return false;
            if (isBuildScript(relative)) return false;
            return true;
        });
}

/**
 * True when the character at `index` is live code: `maskCode` blanks comment and string bodies while
 * preserving offsets, so a raw-text match that still stands in the masked copy is not prose. Rules
 * that must read a module specifier — which masking blanks — use this instead of scanning `masked`.
 */
export function isLiveCode(text, masked, index) {
    return index >= 0 && index < text.length && masked[index] === text[index] && !/\s/.test(text[index]);
}

/**
 * Blank out comments and string bodies while preserving every offset and newline, so a regex can
 * match code without matching prose. Template-literal bodies are blanked too, but `${` and `}`
 * survive so an interpolation is still visible to the caller.
 */
export function maskCode(text) {
    const chars = [...text];
    const blank = index => {
        if (chars[index] !== '\n') chars[index] = ' ';
    };
    let index = 0;
    const templates = [];
    while (index < chars.length) {
        const char = chars[index];
        const next = chars[index + 1];
        if (templates.length === 0 && char === '/' && next === '/') {
            while (index < chars.length && chars[index] !== '\n') blank(index++);
            continue;
        }
        if (templates.length === 0 && char === '/' && next === '*') {
            const end = text.indexOf('*/', index + 2);
            const stop = end === -1 ? chars.length : end + 2;
            while (index < stop) blank(index++);
            continue;
        }
        if (char === '"' || char === "'") {
            const quote = char;
            index += 1;
            while (index < chars.length && chars[index] !== quote && chars[index] !== '\n') {
                if (chars[index] === '\\') blank(index++);
                if (index < chars.length) blank(index++);
            }
            index += 1;
            continue;
        }
        if (char === '`') {
            templates.push('`');
            index += 1;
            while (index < chars.length) {
                if (chars[index] === '\\') {
                    blank(index);
                    blank(index + 1);
                    index += 2;
                    continue;
                }
                if (chars[index] === '`') {
                    templates.pop();
                    index += 1;
                    break;
                }
                if (chars[index] === '$' && chars[index + 1] === '{') {
                    index += 2;
                    let depth = 1;
                    while (index < chars.length && depth > 0) {
                        if (chars[index] === '{') depth += 1;
                        else if (chars[index] === '}') depth -= 1;
                        index += 1;
                    }
                    continue;
                }
                blank(index);
                index += 1;
            }
            continue;
        }
        index += 1;
    }
    return chars.join('');
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

/** Brace-balanced body that follows a header match, using masked text so braces are real code. */
export function blockAfter(masked, from) {
    const open = masked.indexOf('{', from);
    if (open === -1) return null;
    let depth = 0;
    for (let index = open; index < masked.length; index += 1) {
        if (masked[index] === '{') depth += 1;
        else if (masked[index] === '}') {
            depth -= 1;
            if (depth === 0) return { start: open, end: index + 1 };
        }
    }
    return { start: open, end: masked.length };
}

/** Brace depth at an offset, so a module-scope reference can be told from a nested one. */
export function depthAt(masked, offset) {
    let depth = 0;
    for (let index = 0; index < offset && index < masked.length; index += 1) {
        if (masked[index] === '{') depth += 1;
        else if (masked[index] === '}') depth -= 1;
    }
    return depth;
}

/** Every finding carries its evidence: an id, a tier bound to a citation, and a fix. */
export function makeFinding({ id, tier, confidence, file = null, line = null, cite, fix, note = null }) {
    if (!TIERS.includes(tier)) throw new Error(`unknown tier ${tier} on ${id}`);
    if (!CONFIDENCES.includes(confidence)) throw new Error(`unknown confidence ${confidence} on ${id}`);
    if (!cite) throw new Error(`missing citation on ${id}`);
    return { id, tier, confidence, file, line, cite, fix, note };
}

function tierRank(tier) {
    return TIERS.indexOf(tier);
}

export function sortFindings(findings) {
    return [...findings].sort(
        (left, right) =>
            tierRank(left.tier) - tierRank(right.tier) ||
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
    const byTier = Object.fromEntries(
        TIERS.map(tier => [tier, sorted.filter(item => item.tier === tier).length]),
    );
    return {
        tool,
        version: TOOL_VERSION,
        target,
        mode,
        scanned,
        summary: { total: sorted.length, byTier, failing: sorted.filter(isFailing).length },
        assumptions,
        limitations,
        notes,
        findings: sorted,
    };
}

export function isFailing(finding) {
    return FAILING_TIERS.has(finding.tier);
}

export function exitCodeFor(report) {
    return report.findings.some(isFailing) ? EXIT.findings : EXIT.clean;
}

function sarifLevel(tier) {
    if (tier === 'policy' || tier === 'submission') return 'error';
    if (tier === 'guideline') return 'warning';
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
                            properties: { tier: rules[id].tier, citation: rules[id].cite },
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
                            level: /^BUNDLE MODE/.test(text) ? 'warning' : 'note',
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
                    level: sarifLevel(item.tier),
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
                        tier: item.tier,
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
        out.push(`findings: ${report.summary.total} (${TIERS.map(tier => `${tier} ${report.summary.byTier[tier]}`).join(', ')})`);
        out.push('');
        for (const item of report.findings) {
            const where = item.file ? `${item.file}${item.line ? `:${item.line}` : ''}` : '<repository>';
            out.push(`${where} ${item.tier.toUpperCase()} ${item.id} [${item.confidence}] ${rules[item.id].message}`);
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

/** x.y.z with no prefix and no pre-release suffix, the only shape the directory accepts. */
export const SEMVER_PATTERN = /^\d+\.\d+\.\d+$/;

export function compareVersions(left, right) {
    const l = String(left).split('.').map(Number);
    const r = String(right).split('.').map(Number);
    for (let index = 0; index < Math.max(l.length, r.length); index += 1) {
        const a = Number.isFinite(l[index]) ? l[index] : 0;
        const b = Number.isFinite(r[index]) ? r[index] : 0;
        if (a !== b) return a < b ? -1 : 1;
    }
    return 0;
}
