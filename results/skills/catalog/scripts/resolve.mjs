import path from 'node:path';
import { listFiles, readText } from './lib.mjs';
import { NOTE_CLASSES, repoKey, repositoryNumericXid } from './model.mjs';
import { parseNote } from './note.mjs';

/**
 * Repository resolution (§6.1).
 *
 * The expensive step is the network, so the first step is a lookup over the repository notes
 * already in the catalog — case-insensitive, because GitHub canonicalises case freely and 885 of
 * the 6,707 pinned repo strings carry uppercase. The notes are the only identity store.
 *
 * Resolution is scoped to repository-class notes by tag. Plugin and theme notes carry the same
 * `repo` string as an alias by the owner's standing template convention, so an unscoped alias
 * search would resolve every already-cataloged plugin to itself.
 */

export function loadRepositoryNotes(catalogRoot) {
    const directory = path.join(catalogRoot, NOTE_CLASSES.repository.directory);
    const byAlias = new Map();
    const byId = new Map();
    for (const file of listFiles(directory, name => name.endsWith('.md'))) {
        const note = parseNote(readText(file));
        if (!note.ok) continue;
        const tags = note.values.tags ?? [];
        if (!tags.includes(NOTE_CLASSES.repository.tag)) continue;
        const numericId = repositoryNumericXid(note.values);
        if (numericId === null) continue;
        const record = { numericId, fullName: note.h1, note: path.relative(catalogRoot, file) };
        byId.set(numericId, record);
        for (const alias of note.values.aliases ?? []) byAlias.set(repoKey(alias), record);
    }
    return { byAlias, byId };
}

/**
 * The other half of the relationship graph: which repository notes each plugin and theme note
 * links to. Together with `loadRepositoryNotes` it is the whole of decision 3.3's baseline
 * component — the links, not the index, are what record how the catalog stood at the run baseline.
 *
 * `related to` members are YAML-quoted on disk, so they are read through `parseNote`; a hand-rolled
 * frontmatter reader finds zero links and computes a closure that looks plausible and is wrong.
 *
 * A note that exists and does not parse is reported as `links: null` rather than as no links at
 * all: an unreadable note in a closure would silently leave its repository live.
 */
export function loadEntityNotes(catalogRoot) {
    const byKey = new Map();
    for (const [kind, spec] of Object.entries(NOTE_CLASSES)) {
        if (kind === 'repository') continue;
        for (const file of listFiles(path.join(catalogRoot, spec.directory), name => name.endsWith('.md'))) {
            const basename = path.basename(file);
            if (!basename.startsWith(spec.prefix)) continue;
            const identity = basename.slice(spec.prefix.length, -'.md'.length);
            const relative = path.relative(catalogRoot, file);
            const note = parseNote(readText(file));
            if (!note.ok) {
                byKey.set(`${kind}:${identity}`, { file: relative, links: null, reason: note.reason });
                continue;
            }
            if (!(note.values.tags ?? []).includes(spec.tag)) continue;
            const links = [];
            for (const member of note.values['related to'] ?? []) {
                const match = /^\[\[GitHub - (\d+)\]\]$/.exec(member);
                if (match) links.push(Number(match[1]));
            }
            byKey.set(`${kind}:${identity}`, { file: relative, links, reason: null });
        }
    }
    return { byKey };
}

/**
 * @param capture async `(repoString) => repositoryRecord | null` — step 3, the only network step.
 * @returns `{ repository, source }` where source names which step answered, or a miss with reason.
 */
export async function resolveRepository(repoString, { notes, capture }) {
    const fromNotes = notes.byAlias.get(repoKey(repoString));
    if (fromNotes) return { repository: fromNotes, source: 'catalog', captured: false };

    const captured = await capture(repoString);
    if (!captured) return { repository: null, source: 'capture', captured: true, reason: 'repository not found' };

    const existing = notes.byId.get(captured.numericId);
    if (existing) {
        // The repository already exists under a newer name: current names lead, former ones stay.
        const refreshed = { ...existing, fullName: captured.fullName, record: captured };
        return { repository: refreshed, source: 'renamed', captured: true, record: captured };
    }

    const created = {
        numericId: captured.numericId,
        fullName: captured.fullName,
        note: path.join(NOTE_CLASSES.repository.directory, `${NOTE_CLASSES.repository.prefix}${captured.numericId}.md`),
    };
    return { repository: created, source: 'created', captured: true, record: captured };
}
