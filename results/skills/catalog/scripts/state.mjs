import fs from 'node:fs';
import path from 'node:path';
import { isFile, readText } from './lib.mjs';
import { repoKey } from './model.mjs';
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

/**
 * Subjects carrying more than one line, anywhere in the file.
 *
 * `parseState` deliberately does not enforce this — the grammar is about line shape — but every
 * later stage does depend on it: a tick matches by typed id and would mark two lines at once, and
 * a second line for one subject is the shape a hand edit takes when it means to redirect work.
 * Repository ids compare case-insensitively, as they do everywhere else.
 */
export function duplicateSubjects(state) {
    const seen = new Map();
    const duplicates = [];
    for (const name of SECTIONS) {
        for (const item of state.sections[name] ?? []) {
            const key = `${item.type} ${item.type === 'repo' ? repoKey(item.id) : item.id}`;
            if (seen.has(key)) duplicates.push({ type: item.type, id: item.id, sections: [seen.get(key), name] });
            else seen.set(key, name);
        }
    }
    return duplicates;
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
 * catalog diff in git records the work. Exclusive create: a receipt is never overwritten, and
 * `receiptDescribes` decides whether one already on disk belongs to the run finalising now.
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
    if (receipt.archive) lines.push(renderArchive(receipt.archive));
    return lines.join('');
}

/**
 * The archive's integrity guard is a recorded hash, not a diff.
 *
 * An archived note is exempt from the template and re-render checks — its contract is unchanged
 * bytes, not current shape, and a note archived by index removal cannot be re-rendered at all,
 * because the row it would render from is gone. "It is versioned, so a changed byte shows in the
 * diff" is not a guard either: it is empty until the owner commits, which is exactly when a
 * freshly moved note is least protected. So the hash the move computed is written down here,
 * where it is durable and a later gate can assert the bytes against it.
 */
function renderArchive(archive) {
    const lines = ['\n## Archive\n\n'];
    const count = type => archive.moves.filter(move => move.type === type).length;
    lines.push(
        `${archive.moves.length} notes moved: ${count('plugin')} plugins, ${count('theme')} themes, ` +
            `${count('repo')} repositories; ${archive.spared.length} ` +
            `${archive.spared.length === 1 ? 'repository' : 'repositories'} spared by the target state.\n\n`,
    );
    lines.push('| class | note | sha256 |\n| --- | --- | --- |\n');
    for (const move of archive.moves) lines.push(`| ${move.type} | ${move.to} | ${move.sha256} |\n`);
    if (archive.spared.length) {
        lines.push('\n');
        for (const entry of archive.spared) {
            lines.push(
                `- spared ${entry.type} ${entry.id} (${entry.numericId}): claimed at the target pin by ` +
                    `${entry.claimedBy.replace(':', ' ')} via ${entry.via} (${entry.source})\n`,
            );
        }
    }
    return lines.join('');
}

/** One run label, one receipt filename — the convention lives here and nowhere else. */
export function receiptPath(directory, run) {
    return path.join(directory, `${run}.md`);
}

export function writeReceipt(directory, receipt) {
    const file = receiptPath(directory, receipt.run);
    fs.mkdirSync(directory, { recursive: true });
    fs.writeFileSync(file, renderReceipt(receipt), { flag: 'wx' });
    return file;
}

/**
 * Whether the receipt already on disk describes *this* run: same run label, same pin pair. That
 * is what makes finalisation re-runnable — a crash between the receipt and the reset leaves the
 * receipt behind while the reset still has to happen, and the reset is what advances Sync State.
 * A receipt describing anything else is refused rather than overwritten, so two different runs can
 * never finalise under one label. Timestamps are deliberately not compared: they record when the
 * work finished, not which run it was.
 */
export function receiptDescribes(directory, receipt) {
    const file = receiptPath(directory, receipt.run);
    if (!isFile(file)) return { file, same: false, reason: 'no receipt on disk' };
    const frontmatter = parseFrontmatter(readText(file));
    if (!frontmatter.ok) return { file, same: false, reason: `the receipt does not parse: ${frontmatter.reason}` };
    const differences = [];
    for (const [key, expected] of [['run', receipt.run], ['base pin', receipt.basePin], ['target pin', receipt.targetPin]]) {
        const actual = frontmatter.values[key] ?? null;
        if (String(actual ?? '') !== String(expected ?? '')) {
            differences.push(`${key} ${actual ?? 'absent'} ≠ ${expected ?? 'absent'}`);
        }
    }
    return { file, same: differences.length === 0, reason: differences.join('; ') || null };
}
