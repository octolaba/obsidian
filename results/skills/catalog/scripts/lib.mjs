import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

export const TOOL_VERSION = '0.1.0';

/**
 * Shared harness exit meanings. 0-4 is the repository-wide baseline documented in the Makefile;
 * codes from 5 upwards are tool-specific and documented where they are raised.
 *
 *   5  refused — the request is understood but acting on it would not be safe (a live run against
 *      an unclean catalog, a capture without recorded pacing parameters).
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
 * What a gate finding costs, and therefore how loud it is allowed to be. Severity follows from the
 * consequence mechanically so two findings with the same consequence can never disagree.
 */
export const CONSEQUENCES = Object.freeze({
    /** Upstream grew or lost a key: a run would drop data or write wrong values silently. */
    'contract-drift': 'error',
    /** An identity assumption the catalog's filenames and links rest on no longer holds. */
    'identity-broken': 'error',
    /** A note on disk does not round-trip, so the next render would rewrite bytes unreviewably. */
    'catalog-malformed': 'error',
    /** The catalog reflects an older pin than the one checked out; an Update Run is required. */
    'catalog-stale': 'error',
    /** True of the pin and worth knowing, with no consequence for the catalog. */
    informational: 'info',
});

export const SEVERITIES = Object.freeze(['error', 'warning', 'info']);
export const FAILING_SEVERITIES = Object.freeze(new Set(['error', 'warning']));

export function severityFor(consequence) {
    const severity = CONSEQUENCES[consequence];
    if (!severity) throw new Error(`unknown consequence ${consequence}`);
    return severity;
}

/** Strict argument parsing: an unknown flag is a usage error, never a silently ignored token. */
export function parseArgs(argv, options = {}) {
    const booleans = new Set(options.booleans ?? []);
    const values = new Set(options.values ?? []);
    const repeatable = new Set(options.repeatable ?? []);
    const result = { _: [] };
    for (const name of repeatable) result[name] = [];
    for (let index = 0; index < argv.length; index += 1) {
        const token = argv[index];
        if (token === '-h') {
            result.help = true;
            continue;
        }
        if (!token.startsWith('--')) {
            result._.push(token);
            continue;
        }
        const equal = token.indexOf('=');
        const name = token.slice(2, equal === -1 ? undefined : equal);
        const inline = equal === -1 ? null : token.slice(equal + 1);
        if (booleans.has(name)) {
            if (inline !== null) throw new Error(`--${name} takes no value`);
            result[name] = true;
            continue;
        }
        if (values.has(name) || repeatable.has(name)) {
            const value = inline !== null ? inline : argv[++index];
            if (value === undefined) throw new Error(`--${name} requires a value`);
            if (repeatable.has(name)) result[name].push(value);
            else result[name] = value;
            continue;
        }
        if (name === 'help') {
            result.help = true;
            continue;
        }
        throw new Error(`unknown flag --${name}`);
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

export function isFile(value) {
    try {
        return fs.statSync(value).isFile();
    } catch {
        return false;
    }
}

export function isDirectory(value) {
    try {
        return fs.statSync(value).isDirectory();
    } catch {
        return false;
    }
}

export function readText(file) {
    return fs.readFileSync(file, 'utf8');
}

export function readJson(file, fallback = undefined) {
    try {
        return JSON.parse(fs.readFileSync(file, 'utf8'));
    } catch (error) {
        if (fallback !== undefined) return fallback;
        throw error;
    }
}

export function writeJson(file, value) {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
}

export function sha256(value) {
    return crypto.createHash('sha256').update(value).digest('hex');
}

export function listFiles(root, filter = () => true) {
    const files = [];
    const visit = directory => {
        let entries;
        try {
            entries = fs.readdirSync(directory, { withFileTypes: true });
        } catch {
            return;
        }
        for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
            const absolute = path.join(directory, entry.name);
            if (entry.isDirectory()) {
                if (entry.name.startsWith('.')) continue;
                visit(absolute);
            } else if (entry.isFile() && filter(absolute)) {
                files.push(absolute);
            }
        }
    };
    if (isDirectory(root)) visit(root);
    return files.sort();
}

/** ISO 8601 UTC, second precision, no fractional part — the catalog's one timestamp shape. */
export function isoUtc(value) {
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) return null;
    return `${date.toISOString().slice(0, 19)}Z`;
}

export function nowUtc() {
    return isoUtc(new Date());
}

export function makeFinding({ id, consequence, message, file = null, evidence = null }) {
    return { id, consequence, severity: severityFor(consequence), message, file, evidence };
}

export function sortFindings(findings) {
    return [...findings].sort(
        (left, right) =>
            SEVERITIES.indexOf(left.severity) - SEVERITIES.indexOf(right.severity) ||
            String(left.id).localeCompare(String(right.id)) ||
            String(left.file ?? '').localeCompare(String(right.file ?? '')),
    );
}

export function printReport(report, { json = false } = {}) {
    if (json) {
        process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
        return;
    }
    for (const line of report.lines ?? []) process.stdout.write(`${line}\n`);
    for (const finding of sortFindings(report.findings ?? [])) {
        const where = finding.file ? ` (${finding.file})` : '';
        process.stdout.write(`${finding.severity}: ${finding.id}${where} — ${finding.message}\n`);
        if (finding.evidence) process.stdout.write(`    ${finding.evidence}\n`);
    }
}

export function exitFor(findings) {
    return findings.some(item => FAILING_SEVERITIES.has(item.severity)) ? EXIT.findings : EXIT.clean;
}
