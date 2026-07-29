import path from 'node:path';
import { listFiles, readText } from './lib.mjs';
import { NOTE_CLASSES, repoKey } from './model.mjs';
import { parseNote } from './note.mjs';
import { lookupRepository, recordRepository } from './ledger.mjs';

/**
 * Repository resolution (§6.1).
 *
 * The expensive step is the network, so the first two steps are lookups: the Ledger, then the
 * repository notes already in the catalog. Both are case-insensitive, because GitHub canonicalises
 * case freely and 885 of the 6,707 pinned repo strings carry uppercase.
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
        const numericId = Number(note.values.xid?.[0]);
        if (!Number.isInteger(numericId)) continue;
        const record = { numericId, fullName: note.h1, note: path.relative(catalogRoot, file) };
        byId.set(numericId, record);
        for (const alias of note.values.aliases ?? []) byAlias.set(repoKey(alias), record);
    }
    return { byAlias, byId };
}

/**
 * @param capture async `(repoString) => repositoryRecord | null` — step 3, the only network step.
 * @returns `{ repository, source }` where source names which step answered, or a miss with reason.
 */
export async function resolveRepository(repoString, { ledger, notes, capture }) {
    const fromLedger = lookupRepository(ledger, repoString);
    if (fromLedger) return { repository: fromLedger, source: 'ledger', captured: false };

    const fromNotes = notes.byAlias.get(repoKey(repoString));
    if (fromNotes) {
        recordRepository(ledger, repoString, fromNotes);
        return { repository: fromNotes, source: 'catalog', captured: false };
    }

    const captured = await capture(repoString);
    if (!captured) return { repository: null, source: 'capture', captured: true, reason: 'repository not found' };

    const existing = notes.byId.get(captured.numericId);
    if (existing) {
        // The repository already exists under a newer name: current names lead, former ones stay.
        const refreshed = { ...existing, fullName: captured.fullName, record: captured };
        recordRepository(ledger, repoString, refreshed);
        return { repository: refreshed, source: 'renamed', captured: true, record: captured };
    }

    const created = {
        numericId: captured.numericId,
        fullName: captured.fullName,
        note: path.join(NOTE_CLASSES.repository.directory, `${NOTE_CLASSES.repository.prefix}${captured.numericId}.md`),
    };
    recordRepository(ledger, repoString, { ...created, capturedAt: captured.capturedAt });
    return { repository: created, source: 'created', captured: true, record: captured };
}
