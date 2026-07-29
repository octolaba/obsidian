import fs from 'node:fs';
import path from 'node:path';
import { isDirectory, listFiles, nowUtc, readText } from './lib.mjs';
import { bodyMissing, parseFrontmatter, serializeFrontmatter } from './note.mjs';

/**
 * Run Reports (§1, §5.3, §7.5).
 *
 * The Run Report is the only durable carrier of Sync State and of the failure queue between runs:
 * the Ledger is disposable by decision 3.10, so nothing load-bearing may live only there. A report
 * is versioned Markdown with a machine-readable frontmatter head, so the gate can recover Sync
 * State without parsing prose.
 */

/**
 * The frontmatter is the machine surface and stays scalar: `model` carries the short model id
 * alone (owner decision, 2026-08-06). The prompt identity and the pacing parameters are run inputs
 * a human reads, so they live in the body's `Parameters` section as one formatted JSON block
 * instead of as an escaped one-line string in a property.
 */
const FRONTMATTER_KEYS = ['run', 'kind', 'status', 'pin', 'sync state', 'started at', 'finished at', 'model'];

export const PARAMETERS_TITLE = 'Parameters';

/** The recorded run inputs, in one block: model and prompt identity, user agent, pacing. */
export function parametersSection({ model = null, prompt = null, userAgent = null, pacing = null, extra = {} }) {
    const parameters = { model, prompt, userAgent, pacing, ...extra };
    return {
        title: PARAMETERS_TITLE,
        body: `Recorded run inputs: the identity of the agent pass and the pacing the capture stage ran at.

\`\`\`json
${JSON.stringify(parameters, null, 2)}
\`\`\``,
    };
}

export function runReportName(startedAt, kind) {
    return `${startedAt.replace(/:/g, '')}-${kind}.md`;
}

export function renderRunReport(report) {
    const values = {
        run: report.run,
        kind: report.kind,
        status: report.status,
        pin: report.pin,
        'sync state': report.status === 'success' ? report.pin : null,
        'started at': report.startedAt,
        'finished at': report.finishedAt ?? nowUtc(),
        model: report.model ?? null,
    };
    const parts = [serializeFrontmatter(FRONTMATTER_KEYS, values), '\n', `# Run report — ${report.run}\n`];
    for (const section of report.sections ?? []) {
        parts.push('\n', `## ${section.title}\n`, '\n', `${section.body.trim()}\n`);
    }
    return parts.join('');
}

export function writeRunReport(runsRoot, report) {
    fs.mkdirSync(runsRoot, { recursive: true });
    const file = path.join(runsRoot, runReportName(report.startedAt, report.kind));
    fs.writeFileSync(file, renderRunReport(report));
    return file;
}

export function readRunReport(file) {
    const parsed = parseFrontmatter(readText(file));
    if (!parsed.ok) return null;
    return {
        file,
        run: parsed.values.run ?? null,
        kind: parsed.values.kind ?? null,
        status: parsed.values.status ?? null,
        pin: parsed.values.pin ?? null,
        syncState: parsed.values['sync state'] ?? null,
        finishedAt: parsed.values['finished at'] ?? null,
    };
}

/** The two fences the gate parses, by name. Prose around them is never read. */
export const FENCES = Object.freeze({
    unresolved: 'unresolved-repository-links',
    bodyless: 'bodyless-no-input',
});

/** Emits one fenced list; an empty list still emits the fence, so "recorded none" is explicit. */
export function fence(name, entries) {
    return `\`\`\`${name}\n${[...new Set(entries)].sort().join('\n')}\n\`\`\``;
}

/**
 * Reads both machine-readable fences out of a report's text.
 *
 * An absent fence reads as an empty list rather than as "everything is allowed": a report that
 * never recorded a lane must not silently license it.
 */
export function parseFences(text) {
    const read = name => {
        const found = new RegExp(`\`\`\`${name}\\n([\\s\\S]*?)\`\`\``).exec(text);
        if (!found) return [];
        return found[1]
            .split('\n')
            .map(line => line.trim())
            .filter(Boolean);
    };
    return { unresolved: read(FENCES.unresolved), bodyless: read(FENCES.bodyless) };
}

/**
 * Recomputes both fences over the whole catalog, not over the notes one run happened to touch.
 *
 * The gate reads the latest successful report alone, so a lane recorded by an earlier run would
 * disappear the moment any later run wrote a report — which is exactly the defect the re-baseline
 * stage had, writing an empty `unresolved-repository-links` fence unconditionally.
 *
 * The two fences are recomputed differently on purpose. A missing repository link is visible on
 * disk, so `unresolved` is derived from the catalog alone. "No usable input" is a *reason*, which
 * disk cannot show: an entry is carried only if this run classified the entity as having no usable
 * recorded input, or a previous report already recorded it — and, either way, only while the note
 * is still body-less. A note merely awaiting a body pass is therefore never fenced, and stays a
 * loud `catalog/block-order` finding.
 *
 * @param entries  `{ relative, kind, note, noInput }` for every note in the catalog
 */
export function recomputeFences(entries, { carriedBodyless = [] } = {}) {
    const carried = new Set(carriedBodyless);
    const unresolved = new Set();
    const bodyless = new Set();
    for (const entry of entries) {
        if (entry.kind !== 'repository' && (entry.note.values['related to'] ?? []).length === 0) {
            unresolved.add(entry.relative);
        }
        if (bodyMissing(entry.note) && (entry.noInput === true || carried.has(entry.relative))) {
            bodyless.add(entry.relative);
        }
    }
    return { unresolved: [...unresolved].sort(), bodyless: [...bodyless].sort() };
}

/**
 * Sync State recovery (decision 3.10): the latest *successful* report wins, ordered by filename,
 * which is its UTC start timestamp. A failed run never advances Sync State.
 */
export function latestSuccessfulRun(runsRoot) {
    if (!isDirectory(runsRoot)) return null;
    const files = listFiles(runsRoot, file => file.endsWith('.md'));
    let latest = null;
    for (const file of files) {
        const report = readRunReport(file);
        if (!report || report.status !== 'success' || !report.syncState) continue;
        if (!latest || path.basename(file) > path.basename(latest.file)) latest = report;
    }
    return latest;
}
