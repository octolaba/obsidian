import fs from 'node:fs';
import path from 'node:path';
import { isFile, readText } from './lib.mjs';
import { parseFrontmatter, serializeFrontmatter } from './note.mjs';

/**
 * The live state file and the run receipt (decision 3.11).
 *
 * Catalog state is exactly three things: the notes, one live checklist file, and a compact receipt
 * per completed run. This module owns the checklist grammar — deliberately strict, because the
 * file is the single source of run progress and the gate's source of standing exceptions:
 *
 * - frontmatter: `base pin` (the Sync State — the pin the catalog reflects), `target pin` (the pin
 *   being processed; absent while idle), `run` (date label, also the receipt filename), `model`,
 *   `pacing`;
 * - exactly the sections `## Dump`, `## Sync`, `## Drop`, in that order, each holding
 *   `- [M] <type> <id>` items with an optional ` — reason` tail; `type` is `repo`, `plugin` or
 *   `theme`; the id carries no spaces (owner/name, plugin id, theme slug);
 * - markers: `[ ]` todo, `[/]` handed to a subagent (ephemeral — a resume reads it as todo),
 *   `[x]` done, `[-]` failed or accepted-standing, `[>]` known miss retried next run.
 *
 * `[>]` and `[-]` lines survive the post-run reset in place: they ARE the standing exceptions the
 * gate reads — there is no separate exceptions section. An anything-else line is a parse error,
 * never a guess.
 */

export const SECTIONS = Object.freeze(['Dump', 'Sync', 'Drop']);
export const FRONTMATTER_KEYS = Object.freeze(['base pin', 'target pin', 'run', 'model', 'pacing']);
export const MARKERS = Object.freeze({ todo: ' ', wip: '/', done: 'x', failed: '-', retry: '>' });

const ITEM = /^- \[([ /x>-])\] (repo|plugin|theme) (\S+)(?: — (.+))?$/;
const HEADING = /^## (.+)$/;

export function parseState(text) {
    const frontmatter = parseFrontmatter(text);
    if (!frontmatter.ok) return { ok: false, reason: frontmatter.reason };
    const sections = { Dump: [], Sync: [], Drop: [] };
    const seen = [];
    let current = null;
    for (const line of (frontmatter.rest ?? '').split('\n')) {
        if (line.trim() === '') continue;
        const heading = HEADING.exec(line);
        if (heading) {
            if (!SECTIONS.includes(heading[1])) return { ok: false, reason: `unknown section ${heading[1]}` };
            if (seen.includes(heading[1])) return { ok: false, reason: `duplicate section ${heading[1]}` };
            seen.push(heading[1]);
            current = heading[1];
            continue;
        }
        const item = ITEM.exec(line);
        if (!item) return { ok: false, reason: `unparsable state line: ${line}` };
        if (!current) return { ok: false, reason: `item before any section: ${line}` };
        sections[current].push({ marker: item[1], type: item[2], id: item[3], reason: item[4] ?? null });
    }
    if (seen.join('|') !== SECTIONS.filter(name => seen.includes(name)).join('|')) {
        return { ok: false, reason: `sections out of order: ${seen.join(', ')}` };
    }
    return {
        ok: true,
        values: frontmatter.values,
        basePin: frontmatter.values['base pin'] ?? null,
        targetPin: frontmatter.values['target pin'] ?? null,
        run: frontmatter.values.run ?? null,
        sections,
    };
}

export function serializeState(state) {
    const values = { ...state.values, 'base pin': state.basePin, 'target pin': state.targetPin, run: state.run };
    const parts = [serializeFrontmatter(FRONTMATTER_KEYS, values)];
    for (const name of SECTIONS) {
        parts.push('\n', `## ${name}\n`);
        const items = state.sections[name] ?? [];
        if (items.length) {
            parts.push('\n');
            for (const item of items) {
                parts.push(`- [${item.marker}] ${item.type} ${item.id}${item.reason ? ` — ${item.reason}` : ''}\n`);
            }
        }
    }
    return parts.join('');
}

export function loadState(file) {
    if (!file || !isFile(file)) return { ok: false, reason: 'state file absent', absent: true };
    return { ...parseState(readText(file)), file };
}

/** A resume owns nothing a crashed coordinator held: wip items read as todo. */
export function resumeView(state) {
    const sections = {};
    for (const name of SECTIONS) {
        sections[name] = (state.sections[name] ?? []).map(item =>
            item.marker === MARKERS.wip ? { ...item, marker: MARKERS.todo } : item,
        );
    }
    return { ...state, sections };
}

/** Every `[>]`/`[-]` line, flattened: the standing exceptions the gate reads. */
export function exceptions(state) {
    const out = [];
    for (const name of SECTIONS) {
        for (const item of state.sections[name] ?? []) {
            if (item.marker === MARKERS.retry || item.marker === MARKERS.failed) {
                out.push({ ...item, section: name });
            }
        }
    }
    return out;
}

/** Items that still block finalisation: todo, wip, or an exception carrying no reason. */
export function blockers(state) {
    const out = [];
    for (const name of SECTIONS) {
        for (const item of state.sections[name] ?? []) {
            if (item.marker === MARKERS.todo || item.marker === MARKERS.wip) {
                out.push({ ...item, section: name, problem: 'not terminal' });
            } else if ((item.marker === MARKERS.retry || item.marker === MARKERS.failed) && !item.reason) {
                out.push({ ...item, section: name, problem: 'exception without a reason' });
            }
        }
    }
    return out;
}

/**
 * The post-run reset: `base pin` := `target pin`, target cleared, `[x]` dropped, exceptions kept
 * in place. The caller writes the receipt first — see `writeReceipt`.
 */
export function resetState(state) {
    const sections = {};
    for (const name of SECTIONS) {
        sections[name] = (state.sections[name] ?? []).filter(
            item => item.marker === MARKERS.retry || item.marker === MARKERS.failed,
        );
    }
    return { ...state, basePin: state.targetPin, targetPin: null, sections };
}

/**
 * The compact receipt (decision 3.11): the worked checklist is deliberately not archived — the
 * catalog diff in git records the work. Exclusive create: finalising twice under one run label is
 * an error, not an overwrite.
 */
export function renderReceipt(receipt) {
    const lines = [
        serializeFrontmatter(
            ['run', 'base pin', 'target pin', 'started at', 'finished at', 'model', 'pacing', 'gate'],
            {
                run: receipt.run,
                'base pin': receipt.basePin,
                'target pin': receipt.targetPin,
                'started at': receipt.startedAt,
                'finished at': receipt.finishedAt,
                model: receipt.model ?? null,
                pacing: receipt.pacing ?? null,
                gate: receipt.gate ?? null,
            },
        ),
        '\n## Counts\n\n',
        '| section | done | failed | retry |\n| --- | --- | --- | --- |\n',
    ];
    for (const name of SECTIONS) {
        const items = receipt.sections[name] ?? [];
        const count = marker => items.filter(item => item.marker === marker).length;
        lines.push(`| ${name} | ${count(MARKERS.done)} | ${count(MARKERS.failed)} | ${count(MARKERS.retry)} |\n`);
    }
    const standing = exceptions({ sections: receipt.sections });
    lines.push('\n## Exceptions\n\n');
    lines.push(
        standing.length
            ? standing.map(item => `- [${item.marker}] ${item.type} ${item.id}${item.reason ? ` — ${item.reason}` : ''}\n`).join('')
            : 'None.\n',
    );
    return lines.join('');
}

export function writeReceipt(directory, receipt) {
    const file = path.join(directory, `${receipt.run}.md`);
    fs.mkdirSync(directory, { recursive: true });
    fs.writeFileSync(file, renderReceipt(receipt), { flag: 'wx' });
    return file;
}
