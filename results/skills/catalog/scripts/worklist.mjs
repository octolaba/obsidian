import { repoKey, repositoryLink, themeSlug } from './model.mjs';
import { MARKERS, SECTIONS } from './state.mjs';

/**
 * The Update Run classifier: two index states in, one worklist out.
 *
 * Everything here is pure. The base-pin indexes arrive as a second injected material root and the
 * target-pin indexes come from the Release Mirror itself, so the classifier never learns where
 * either lives and never invokes the version-control system — the pin is injected by the caller
 * that owns the repository layout, exactly as it is for the gate (`identity.mjs`).
 *
 * Three separations carry the module:
 *
 * - **One item per subject.** A row may satisfy several predicates; the classification order below
 *   picks exactly one class, and the item still carries every field that moved so a later stage
 *   lands them all in a single render.
 * - **What the pin diff decides, and what it does not.** `Dump` (work that needs the network) and
 *   `Drop` (archive moves) genuinely need two pins. `Sync` — the offline point-edit bulk — does
 *   not: an entity is out of date exactly when its target-pin render differs from the file on
 *   disk, which the render stage tests directly. The classifier still computes the `Sync` classes,
 *   because the render stage needs the full landing list; the writer just does not enumerate them.
 * - **The closure is a fact about the notes, not about the index.** It is the transitive
 *   plugin/theme ↔ repository component as it stood at the run baseline, read from the notes' own
 *   links, and then reduced by the target state so a repository a live entity still resolves to is
 *   never archived out from under it.
 */

export const CLASSES = Object.freeze({
    /** the id or slug appears at the target pin */
    added: 'added',
    /** the id or slug is gone at the target pin; the trigger of an archive closure */
    removed: 'removed',
    /** `repo` moved to a different repository (case-insensitively); beats `amended` */
    relocated: 'relocated',
    /** a mapped index property moved; `bodyQueued` iff a plugin `description` did */
    amended: 'amended',
    /** only `downloads`/`updated` moved, appeared or vanished */
    stats: 'stats',
    /** a Removed and an Added theme sharing one repository: queued for the owner, never executed */
    renameSuspect: 'rename-suspect',
    /** GitHub confirmed the repository gone; learned at capture, never from the pin diff */
    repositoryUnavailable: 'repository-unavailable',
    /** pulled into an archive closure by a relationship, not by a difference of its own */
    closure: 'closure',
});

/** Mapped index properties, per class. `repo` appears here for a case-only change: the data block
 *  records it verbatim and the gate compares it exactly, so the note has to be rewritten. */
const PLUGIN_FIELDS = Object.freeze(['author', 'description', 'name', 'repo']);
const THEME_FIELDS = Object.freeze(['author', 'legacy', 'modes', 'name', 'repo', 'screenshot']);

/**
 * The reason tail, made safe for the item grammar: no newline, and no second ` — ` for the item
 * regex to split on. Removal-List reasons are upstream text and go through here.
 */
export function reasonTail(text) {
    return String(text ?? '')
        .replace(/\s+/g, ' ')
        .replace(/ — /g, ' - ')
        .trim();
}

function fieldValue(row, field) {
    // A NUL joins the list because it is the one separator upstream data cannot contain, so two
    // different mode lists can never compare equal by accident.
    if (field === 'modes') return (row.modes ?? []).join('\0');
    if (field === 'legacy') return row.legacy === true;
    return row[field] ?? null;
}

function movedFields(base, target, fields) {
    return fields.filter(field => fieldValue(base, field) !== fieldValue(target, field));
}

/**
 * Plugin Stats movement, compared on the raw record rather than through `statsFor`: the data block
 * records `updated` as the source served it, so a sub-second move is still a byte the run owes.
 */
function statsMoved(baseStats, targetStats, id) {
    const before = baseStats?.[id];
    const after = targetStats?.[id];
    if (!before && !after) return [];
    if (!before) return ['appeared'];
    if (!after) return ['vanished'];
    const moved = [];
    if (before.downloads !== after.downloads) moved.push('downloads');
    if (before.updated !== after.updated) moved.push('updated');
    return moved;
}

function removalReason(rows, matches) {
    const row = (rows ?? []).find(matches);
    const reason = reasonTail(row?.reason ?? '');
    return reason === '' ? 'no recorded reason' : reason;
}

function keyed(rows, key) {
    const byKey = new Map();
    const duplicates = [];
    for (const row of rows) {
        const identity = key(row);
        if (byKey.has(identity)) duplicates.push(identity);
        byKey.set(identity, row);
    }
    return { byKey, duplicates };
}

function item(values) {
    return {
        fields: [],
        statsFields: [],
        bodyQueued: false,
        marker: MARKERS.todo,
        numericId: null,
        baseRow: null,
        targetRow: null,
        ...values,
    };
}

/**
 * Every difference between two index states, in exactly one class per subject.
 *
 * Keying is fixed by the note contract: plugins by `id`, themes by the slug their `name` derives.
 * That is also why a theme is never identified by its name — the item id carries no spaces, and the
 * reason tail is the only place a display name may appear.
 *
 * @param base,target `{plugins, themes, stats, pluginsRemoved, themesRemoved}` as `loadIndexes`
 *   returns them; the removal lists supply the reason recorded on a `Drop` line.
 * @returns `{items, renameSuspects, duplicateKeys, counts}`
 */
export function classify({ base, target }) {
    const basePlugins = keyed(base.plugins, row => row.id);
    const targetPlugins = keyed(target.plugins, row => row.id);
    const baseThemes = keyed(base.themes, row => themeSlug(row.name));
    const targetThemes = keyed(target.themes, row => themeSlug(row.name));

    const items = [];
    const counts = {
        plugin: { added: 0, removed: 0, relocated: 0, amended: 0, bodyQueued: 0, stats: 0 },
        theme: { added: 0, removed: 0, relocated: 0, amended: 0, bodyQueued: 0, stats: 0 },
        // The stats *predicate*, which is wider than the `stats` class: a subject whose stats moved
        // and whose row also moved is one `amended` item that lands both, so the two counts differ
        // by design and the histogram has to show the split rather than let a reader infer it.
        statsPredicate: { downloads: 0, updated: 0, appeared: 0, vanished: 0, subjects: 0, amended: 0, relocated: 0 },
    };

    // --- rename-suspect first, because it suppresses both of its halves ---------------------------
    // Themes only: a theme's identity is a slug derived from its name, so one repository arriving
    // under a new slug as another leaves is indistinguishable from a rename. Executing it would
    // spend a fresh uid and lose every human field, so neither half is queued (§Update Run).
    const removedThemeSlugs = [...baseThemes.byKey.keys()].filter(slug => !targetThemes.byKey.has(slug));
    const addedThemeSlugs = [...targetThemes.byKey.keys()].filter(slug => !baseThemes.byKey.has(slug));
    const removedThemeByRepo = new Map(
        removedThemeSlugs.map(slug => [repoKey(baseThemes.byKey.get(slug).repo), slug]),
    );
    const renameSuspects = [];
    for (const slug of addedThemeSlugs) {
        const row = targetThemes.byKey.get(slug);
        const was = removedThemeByRepo.get(repoKey(row.repo));
        if (was === undefined) continue;
        renameSuspects.push({ removed: was, added: slug, repo: row.repo });
    }
    const suppressedAdded = new Set(renameSuspects.map(pair => pair.added));
    const suppressedRemoved = new Set(renameSuspects.map(pair => pair.removed));
    for (const pair of renameSuspects) {
        items.push(
            item({
                class: CLASSES.renameSuspect,
                type: 'theme',
                id: pair.added,
                section: 'Sync',
                marker: MARKERS.failed,
                reason: `rename-suspect (repo ${pair.repo}, was theme ${pair.removed}); queued for the owner`,
                targetRow: targetThemes.byKey.get(pair.added),
            }),
            item({
                class: CLASSES.renameSuspect,
                type: 'theme',
                id: pair.removed,
                section: 'Drop',
                marker: MARKERS.failed,
                reason: `rename-suspect (repo ${pair.repo}, now theme ${pair.added}); queued for the owner`,
                baseRow: baseThemes.byKey.get(pair.removed),
            }),
        );
    }

    // --- plugins ----------------------------------------------------------------------------------
    for (const [id, row] of targetPlugins.byKey) {
        if (basePlugins.byKey.has(id)) continue;
        counts.plugin.added += 1;
        items.push(
            item({
                class: CLASSES.added,
                type: 'plugin',
                id,
                section: 'Dump',
                reason: `added (repo ${row.repo})`,
                bodyQueued: true,
                targetRow: row,
            }),
        );
    }
    for (const [id, row] of basePlugins.byKey) {
        if (targetPlugins.byKey.has(id)) continue;
        counts.plugin.removed += 1;
        items.push(
            item({
                class: CLASSES.removed,
                type: 'plugin',
                id,
                section: 'Drop',
                reason: `removed; ${removalReason(target.pluginsRemoved, entry => entry.id === id)}`,
                baseRow: row,
            }),
        );
    }
    for (const [id, targetRow] of targetPlugins.byKey) {
        const baseRow = basePlugins.byKey.get(id);
        if (!baseRow) continue;
        const stats = statsMoved(base.stats, target.stats, id);
        for (const field of stats) counts.statsPredicate[field] += 1;
        if (stats.length) counts.statsPredicate.subjects += 1;
        // Order matters, and this is where it earns its keep: a relocation that also moved `author`
        // is one relocation, not two items, and relocation wins because the repository link is what
        // has to be re-resolved.
        if (repoKey(baseRow.repo) !== repoKey(targetRow.repo)) {
            counts.plugin.relocated += 1;
            if (stats.length) counts.statsPredicate.relocated += 1;
            items.push(
                item({
                    class: CLASSES.relocated,
                    type: 'plugin',
                    id,
                    section: 'Dump',
                    reason: `relocated (repo ${baseRow.repo} to ${targetRow.repo})`,
                    fields: movedFields(baseRow, targetRow, PLUGIN_FIELDS),
                    statsFields: stats,
                    bodyQueued: true,
                    baseRow,
                    targetRow,
                }),
            );
            continue;
        }
        const fields = movedFields(baseRow, targetRow, PLUGIN_FIELDS);
        if (fields.length) {
            const bodyQueued = fields.includes('description');
            counts.plugin.amended += 1;
            if (bodyQueued) counts.plugin.bodyQueued += 1;
            if (stats.length) counts.statsPredicate.amended += 1;
            items.push(
                item({
                    class: CLASSES.amended,
                    type: 'plugin',
                    id,
                    // A `description` change is the one amendment that queues a body, and a body
                    // needs a freshly observed About — so it is network work and belongs in `Dump`.
                    section: bodyQueued ? 'Dump' : 'Sync',
                    reason: `amended (${fields.join(', ')})${bodyQueued ? ' with body' : ''}`,
                    fields,
                    statsFields: stats,
                    bodyQueued,
                    baseRow,
                    targetRow,
                }),
            );
            continue;
        }
        if (stats.length) {
            counts.plugin.stats += 1;
            items.push(
                item({
                    class: CLASSES.stats,
                    type: 'plugin',
                    id,
                    section: 'Sync',
                    reason: `stats (${stats.join(', ')})`,
                    statsFields: stats,
                    baseRow,
                    targetRow,
                }),
            );
        }
    }

    // --- themes -----------------------------------------------------------------------------------
    for (const [slug, row] of targetThemes.byKey) {
        if (baseThemes.byKey.has(slug) || suppressedAdded.has(slug)) continue;
        counts.theme.added += 1;
        items.push(
            item({
                class: CLASSES.added,
                type: 'theme',
                id: slug,
                section: 'Dump',
                reason: `added (repo ${row.repo})`,
                bodyQueued: true,
                targetRow: row,
            }),
        );
    }
    for (const [slug, row] of baseThemes.byKey) {
        if (targetThemes.byKey.has(slug) || suppressedRemoved.has(slug)) continue;
        counts.theme.removed += 1;
        items.push(
            item({
                class: CLASSES.removed,
                type: 'theme',
                id: slug,
                section: 'Drop',
                reason: `removed; ${removalReason(target.themesRemoved, entry => themeSlug(entry.name) === slug)}`,
                baseRow: row,
            }),
        );
    }
    for (const [slug, targetRow] of targetThemes.byKey) {
        const baseRow = baseThemes.byKey.get(slug);
        if (!baseRow) continue;
        if (repoKey(baseRow.repo) !== repoKey(targetRow.repo)) {
            counts.theme.relocated += 1;
            items.push(
                item({
                    class: CLASSES.relocated,
                    type: 'theme',
                    id: slug,
                    section: 'Dump',
                    reason: `relocated (repo ${baseRow.repo} to ${targetRow.repo})`,
                    fields: movedFields(baseRow, targetRow, THEME_FIELDS),
                    bodyQueued: true,
                    baseRow,
                    targetRow,
                }),
            );
            continue;
        }
        const fields = movedFields(baseRow, targetRow, THEME_FIELDS);
        if (!fields.length) continue;
        counts.theme.amended += 1;
        items.push(
            item({
                class: CLASSES.amended,
                type: 'theme',
                id: slug,
                section: 'Sync',
                reason: `amended (${fields.join(', ')})`,
                fields,
                baseRow,
                targetRow,
            }),
        );
    }

    return {
        items,
        renameSuspects,
        duplicateKeys: [
            ...basePlugins.duplicates.map(id => `base plugin ${id}`),
            ...targetPlugins.duplicates.map(id => `target plugin ${id}`),
            ...baseThemes.duplicates.map(slug => `base theme ${slug}`),
            ...targetThemes.duplicates.map(slug => `target theme ${slug}`),
        ],
        counts,
    };
}

/** The typed key a state-file line and an item agree on; repository ids compare case-insensitively. */
export function subjectKey(typeOrItem, id) {
    const type = typeof typeOrItem === 'string' ? typeOrItem : typeOrItem.type;
    const value = typeof typeOrItem === 'string' ? id : typeOrItem.id;
    return `${type}|${type === 'repo' ? repoKey(value) : value}`;
}

/**
 * The closure's one dangerous case: a repository that a *removed* entity holds while an entity live
 * at the target pin resolves to it too. Archiving it and then re-creating it from the same
 * immutable numeric id would mint a second note carrying the archived note's uid.
 *
 * The reduction is deliberately narrow — a repository GitHub has confirmed unavailable still
 * archives with every entity pointing at it, live index rows included.
 *
 * **This pass is best effort, and offline by construction.** It can only spare what the alias
 * lookup can see, and an index row whose repository was renamed upstream *after* the base pin
 * carries a string that is on no alias list yet. Such a row resolves only against GitHub, which is
 * a capture, so the final reduction is applied by the archive stage on resolved numeric ids and
 * recorded in the receipt. What this pass leaves in the closure is therefore a proposal, not a
 * verdict.
 *
 * @returns numeric id → the first target-pin `repo` string that resolved to it. A `Map` rather than
 *   a `Set` so a spared repository can be printed with the row that claimed it; `closureFor` needs
 *   nothing but `has`.
 */
export function claimedRepositories(rows, repositoryNotes) {
    const claimed = new Map();
    for (const row of rows) {
        const record = repositoryNotes.byAlias.get(repoKey(row.repo));
        if (record && !claimed.has(record.numericId)) claimed.set(record.numericId, row.repo);
    }
    return claimed;
}

/**
 * The baseline relationship closure, read from the notes' own links (decision 3.3): start at every
 * trigger and follow plugin/theme ↔ repository edges in both directions until closed.
 *
 * A spared repository is not merely dropped from the result — it is never traversed, so nothing
 * downstream of it is pulled in either, and the outcome does not depend on the order the seeds are
 * visited in.
 *
 * `spared` is whatever the caller could establish offline; see `claimedRepositories` for why that
 * is a proposal the archive stage narrows further.
 *
 * @param seeds typed keys, `plugin:<id>` / `theme:<slug>`
 * @param graph `{entities, repositories}` from `loadEntityNotes` and `loadRepositoryNotes`
 */
export function closureFor(seeds, graph, { spared = new Map() } = {}) {
    const holders = new Map();
    for (const [key, note] of graph.entities.byKey) {
        for (const numericId of note.links ?? []) {
            if (!holders.has(numericId)) holders.set(numericId, []);
            holders.get(numericId).push(key);
        }
    }
    const entities = new Set();
    const repositories = new Set();
    const sparedHere = new Set();
    const unreadable = [];
    const withoutNote = [];
    const reachedBy = new Map();
    const queue = [...seeds].sort();
    while (queue.length) {
        const key = queue.shift();
        if (entities.has(key)) continue;
        entities.add(key);
        const note = graph.entities.byKey.get(key);
        if (!note) {
            withoutNote.push(key);
            continue;
        }
        if (note.links === null) {
            unreadable.push(key);
            continue;
        }
        for (const numericId of note.links) {
            if (spared.has(numericId)) {
                sparedHere.add(numericId);
                continue;
            }
            if (repositories.has(numericId)) continue;
            repositories.add(numericId);
            reachedBy.set(numericId, key);
            for (const other of holders.get(numericId) ?? []) if (!entities.has(other)) queue.push(other);
        }
    }
    return {
        entities,
        repositories,
        spared: sparedHere,
        reachedBy,
        unreadable,
        withoutNote,
        repositoriesWithoutNote: [...repositories].filter(numericId => !graph.repositories.byId.has(numericId)),
    };
}

/**
 * The closure as `Drop` items: one repository line per archived repository note, plus a line for
 * any entity a shared repository pulled in that was not itself a trigger.
 */
export function closureItems(closure, { graph, triggers }) {
    const seeds = new Set(triggers);
    const items = [];
    for (const numericId of closure.repositories) {
        const record = graph.repositories.byId.get(numericId);
        const reachedBy = closure.reachedBy.get(numericId) ?? '';
        const [type, id] = [reachedBy.slice(0, reachedBy.indexOf(':')), reachedBy.slice(reachedBy.indexOf(':') + 1)];
        items.push(
            item({
                class: CLASSES.closure,
                type: 'repo',
                // The documented typed id is `owner/name`; the note's H1 is the only place the
                // current full name of an archived-by-relationship repository is recorded.
                id: record?.fullName ?? String(numericId),
                numericId,
                section: 'Drop',
                reason: `archived with ${type} ${id}`,
            }),
        );
    }
    for (const key of closure.entities) {
        if (seeds.has(key)) continue;
        const [type, id] = [key.slice(0, key.indexOf(':')), key.slice(key.indexOf(':') + 1)];
        const note = graph.entities.byKey.get(key);
        const through = (note?.links ?? []).find(numericId => closure.repositories.has(numericId));
        const record = through === undefined ? null : graph.repositories.byId.get(through);
        items.push(
            item({
                class: CLASSES.closure,
                type,
                id,
                section: 'Drop',
                reason: `archived with repo ${record?.fullName ?? through ?? 'unknown'}`,
            }),
        );
    }
    return items;
}

/**
 * What the writer puts in the file. `Dump` and `Drop` are enumerated because network work and
 * archive moves are expensive and genuinely stateful — and because `Drop` is the only record of a
 * relationship graph that no longer exists by the time the archive stage executes it. `Sync` work
 * is re-derived from the notes every run, so only its failures earn lines.
 */
export function writableItems(items) {
    return items.filter(entry => entry.section !== 'Sync' || entry.marker !== MARKERS.todo);
}

/**
 * The classes that cost a network round trip, and therefore the whole of what a capture selects.
 *
 * Added and relocated entities need the full pipeline, and an amendment that queues a body needs a
 * freshly observed About to ground it. Everything else — `stats`, and an amendment that moved only
 * `author` or `name` — is a point-edit whose every input is already in hand, so it never reaches
 * the networked stage. That is what makes the efficiency claim a one-line assertion instead of a
 * promise: zero network calls are attributable to any `Sync` item.
 */
export function capturedClasses(items) {
    return items.filter(
        entry =>
            entry.class === CLASSES.added ||
            entry.class === CLASSES.relocated ||
            (entry.class === CLASSES.amended && entry.bodyQueued),
    );
}

/** Deterministic order: by section as the grammar fixes it, then by type, then by id. */
export function sortItems(items) {
    return [...items].sort(
        (left, right) =>
            SECTIONS.indexOf(left.section) - SECTIONS.indexOf(right.section) ||
            left.type.localeCompare(right.type) ||
            left.id.localeCompare(right.id),
    );
}

/**
 * No stage reads its class off the state file: it re-derives the classification from the same pin
 * pair and reconciles. Markers are the mutable field and are ignored; section, type, id and the
 * reason label are compared. Any non-empty result is a refusal with nothing written, which is what
 * stops a hand-edited file from silently redirecting several thousand writes.
 *
 * Only `Dump` and `Drop` are compared, because only they are enumerated. A standing `[>]`/`[-]`
 * line the classifier does not claim is a preserved exception, not excess.
 *
 * @param sections which of them to compare. The default is both, which is what opening a run
 *   checks. A later stage narrows it to `Dump`: `Drop` records a relationship graph the render
 *   stage has already rewritten by the time it runs, so re-deriving it there would compare against
 *   a tree that is no longer the baseline — the archive stage owns that comparison instead.
 */
export function reconcile(state, items, { sections = ['Dump', 'Drop'] } = {}) {
    const compared = new Set(sections);
    const expected = new Map();
    for (const entry of items) {
        if (!compared.has(entry.section)) continue;
        expected.set(subjectKey(entry), entry);
    }
    const missing = [];
    const excess = [];
    const mislabelled = [];
    const matched = new Set();
    for (const section of SECTIONS) {
        if (!compared.has(section)) continue;
        for (const line of state.sections[section] ?? []) {
            const key = subjectKey(line);
            const entry = expected.get(key);
            if (!entry) {
                if (line.marker !== MARKERS.retry && line.marker !== MARKERS.failed) {
                    excess.push({ section, type: line.type, id: line.id });
                }
                continue;
            }
            matched.add(key);
            // A `[>]`/`[-]` line records a terminal or standing outcome for its subject, and the
            // outcome owns the reason from then on: the renderer writes `bodyless-no-input` onto
            // the very line the classifier labelled `added`. Markers are already the mutable
            // field; the reason moves with them, or a run would refuse its own second pass.
            if (line.marker === MARKERS.retry || line.marker === MARKERS.failed) continue;
            if (entry.section !== section || (entry.reason ?? null) !== (line.reason ?? null)) {
                mislabelled.push({
                    type: line.type,
                    id: line.id,
                    expected: `${entry.section}: ${entry.reason ?? ''}`,
                    actual: `${section}: ${line.reason ?? ''}`,
                });
            }
        }
    }
    for (const [key, entry] of expected) {
        if (!matched.has(key)) missing.push({ section: entry.section, type: entry.type, id: entry.id });
    }
    return { ok: missing.length === 0 && excess.length === 0 && mislabelled.length === 0, missing, excess, mislabelled };
}

/**
 * The worklist as the state file will carry it.
 *
 * A standing line whose subject the classifier now claims is deleted rather than left beside the
 * new item: one line per subject is what the grammar and every later tick depend on, and a
 * terminated lifecycle is the one licensed reason to move a line — the retry a `[>]` promised has
 * just been answered. The deleted lines are returned so the stage can print what it retired.
 */
export function applyWorklist(state, items) {
    const claimed = new Map(items.map(entry => [subjectKey(entry), entry]));
    const retired = [];
    const sections = {};
    for (const name of SECTIONS) {
        sections[name] = (state.sections[name] ?? []).filter(line => {
            if (!claimed.has(subjectKey(line))) return true;
            retired.push({ ...line, section: name });
            return false;
        });
    }
    for (const entry of sortItems(items)) {
        sections[entry.section].push({
            marker: entry.marker,
            type: entry.type,
            id: entry.id,
            reason: entry.reason ? reasonTail(entry.reason) : null,
        });
    }
    return { state: { ...state, sections }, retired };
}

/**
 * Every repository link the machine would have written for this row at the Sync State pin (§4.4).
 *
 * Filling it is what lets a relocation *replace* its link instead of stacking a new one beside a
 * stale one: a member the machine recognises as its own may be dropped, anything else is human and
 * survives. For a rename — same numeric id under a new name — the set equals the machine member and
 * nothing changes.
 */
export function recognizedLinksFor(baseRow, repositoryNotes) {
    const record = baseRow ? repositoryNotes.byAlias.get(repoKey(baseRow.repo)) : null;
    return new Set(record ? [repositoryLink(record.numericId)] : []);
}
