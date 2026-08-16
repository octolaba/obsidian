import fs from 'node:fs';
import path from 'node:path';

import { isFile, sha256 } from './lib.mjs';
import { NOTE_CLASSES, isFilenameSafe, pluginNoteName, repoKey, repositoryNoteName, themeNoteName } from './model.mjs';
import { MARKERS, SECTIONS } from './state.mjs';
import { reasonTail, subjectKey } from './worklist.mjs';

/**
 * The archive step (decision 3.3): the one destructive stage, and the only all-or-nothing one.
 *
 * Everything here exists to make a wrong move set impossible to execute rather than possible to
 * detect afterwards. Nothing touches the filesystem until the whole plan has reconciled, and a
 * single refusal leaves every note where it was.
 *
 * Three separations carry the module:
 *
 * - **The recorded `Drop` set is the authority, not a closure recomputed from the tree.** By the
 *   time this stage runs, render has created notes and re-pointed links, so the tree is no longer
 *   the baseline the closure was computed over. `Drop` is the only surviving record of that graph,
 *   which is why it is enumerated in the state file while `Sync` is not.
 * - **The final reduction is applied here, on resolved numeric ids.** The worklist could only
 *   reduce by an offline alias lookup, and a repository renamed upstream after the base pin carries
 *   a string that is on no alias list yet — its numeric id is the only thing that reveals the live
 *   claim. Sparing is a decision the run made and is recorded, never silent.
 * - **Two archive lanes, two state-file fates.** A subject whose index row is gone retires its line
 *   to `[x]` and the archived note becomes the record. A subject archived while its index row
 *   survives keeps a standing `[-]` line carrying its lane and evidence, or coverage reports an
 *   uncovered index row forever.
 */

/** Where each state-file subject type lives, and what its note is called. */
const HOMES = Object.freeze({
    plugin: { spec: NOTE_CLASSES.plugin, noteName: pluginNoteName },
    theme: { spec: NOTE_CLASSES.theme, noteName: themeNoteName },
    repo: { spec: NOTE_CLASSES.repository, noteName: repositoryNoteName },
});

/** Why a plan was refused. Every one of them is exit 5, and every one of them is pre-flight. */
export const REFUSALS = Object.freeze({
    /** a subject the pin diff archives, or a repository an archived note holds, carries no `Drop` item */
    missing: 'missing move',
    /** a `Drop` item names a subject this run has no reason to archive */
    excess: 'excess move',
    /** a `Drop` item resolves to no note, live or already archived */
    unresolved: 'unresolved subject',
    /** both the live path and the archive path hold a note: two files claim one identity */
    ambiguous: 'source and destination both exist',
    /** the destination is not under the archive root, or the note is not named after its identity */
    misplaced: 'destination outside the archive root',
    /** a note in the component does not parse, so the component cannot be proven closed */
    unreadable: 'note does not parse',
});

/** Typed key → index row, for every plugin and theme present at the pin. */
export function rowsAtPin(indexes, slugOf) {
    const rows = new Map();
    for (const row of indexes.plugins) rows.set(`plugin:${row.id}`, row);
    for (const row of indexes.themes) rows.set(`theme:${slugOf(row.name)}`, row);
    return rows;
}

/**
 * What capture confirmed and the pin diff could not know (ruling B11). Two shapes, deliberately
 * not symmetric:
 *
 * - `repository-unavailable` — a known repository missed by current name *and* its immutable id
 *   answered terminal in the same run. The repository itself is the trigger, and decision 3.3
 *   archives its whole component including live index rows, so it is never a candidate for the
 *   reduction below.
 * - `github-missing` — a repository with no known numeric id answered terminal. One such answer is
 *   an observation, never a verdict: the standing `[>]` line a previous run left is the first, and
 *   this run's lane is the second in a distinct run, which is exactly what the class demands. The
 *   subject comes from the line and its repository string from the index row at the pin — never
 *   from the line's prose, which is a human-readable tail rather than evidence.
 *
 * @param standing the state file's `[>]`/`[-]` lines
 * @param rows typed key → index row at the target pin
 * @returns entities and repositories to archive, each with the evidence that confirmed it
 */
export function confirmedArchivals({ failures = [], standing = [], rows = new Map() }) {
    const entities = new Map();
    const repositories = new Map();
    const terminal = new Set();
    for (const failure of failures) {
        if (failure.lane === 'repository-unavailable' && failure.databaseId !== undefined) {
            repositories.set(Number(failure.databaseId), {
                repo: failure.subject,
                reason: `repository-unavailable (${failure.subject} and its immutable id ${failure.databaseId} both answered terminal)`,
            });
        }
        // `github-missing-at-refresh` is a different lane with a different meaning: the identity
        // probe was inconclusive and the subject is retried, not archived.
        if (failure.lane === 'github-missing') terminal.add(repoKey(failure.subject));
    }
    for (const line of standing) {
        if (line.marker !== MARKERS.retry) continue;
        if (!/^github-missing(?!-)/.test(line.reason ?? '')) continue;
        const key = `${line.type}:${line.id}`;
        const row = rows.get(key);
        if (!row || !terminal.has(repoKey(row.repo))) continue;
        entities.set(key, {
            repo: row.repo,
            line,
            reason: `repository-unavailable (${row.repo} answered terminal in two distinct runs)`,
        });
    }
    return { entities, repositories };
}

/**
 * Which repositories an entity live at the target pin claims, and how (ruling R8).
 *
 * Three sources, in the order they are trusted. A capture resolved the row's repository string
 * against GitHub in this very run; the catalog resolves it offline through the repository note's
 * aliases, which render has just refreshed; and only when neither answers does the live note's own
 * link stand in for a resolution.
 *
 * That last restriction is load-bearing. `related to` also carries human members the machine never
 * wrote, and decision 3.3 deliberately archives a whole shared component — a live entity holding a
 * hand-written link to a removed entity's repository is pulled into the closure with it, not used
 * as a reason to spare it. A link therefore only speaks where the row's own string is silent.
 *
 * A subject already destined for the archive claims nothing: it is leaving.
 */
export function claimsAtTarget({ rows, graph, captured = new Map(), archived = new Set() }) {
    const claims = new Map();
    const record = (numericId, claim) => {
        if (Number.isInteger(numericId) && !claims.has(numericId)) claims.set(numericId, claim);
    };
    for (const [key, row] of rows) {
        if (archived.has(key)) continue;
        const capture = captured.get(repoKey(row.repo)) ?? null;
        if (capture) record(capture.numericId, { by: key, repo: row.repo, source: 'capture' });
        const note = graph.repositories.byAlias.get(repoKey(row.repo)) ?? null;
        if (note) record(note.numericId, { by: key, repo: row.repo, source: 'catalog' });
        if (capture || note) continue;
        for (const numericId of graph.entities.byKey.get(key)?.links ?? []) {
            record(numericId, { by: key, repo: row.repo, source: 'link' });
        }
    }
    return claims;
}

/** The one place a subject becomes a pair of paths; `to` keeps the basename `from` carries. */
function placement({ type, from, numericId, id, catalogRoot, archiveRoot }) {
    const home = HOMES[type];
    const basename = from === null ? home.noteName(type === 'repo' ? numericId : id) : path.basename(from);
    const to = path.join(archiveRoot, home.spec.directory, basename);
    const expected = home.noteName(type === 'repo' ? numericId : id);
    const inside = path.resolve(to).startsWith(`${path.resolve(archiveRoot)}${path.sep}`);
    return { to, basename, named: basename === expected, inside };
}

/**
 * The whole plan, built before a byte moves: the union of the recorded `Drop` set and what capture
 * confirmed, reduced by the target state, resolved to paths, and reconciled in both directions.
 *
 * @param recorded the state file's `Drop` items
 * @param confirmed `confirmedArchivals` output
 * @param rows typed key → index row at the target pin
 * @param graph `{entities, repositories}` over the live catalog
 * @param archived the same pair over the archive root; a move an interrupted run already performed
 *   resolves here, which is what makes the stage re-runnable and keeps the closure proof honest
 *   when half the component has already left
 * @param claims `claimsAtTarget` output, computed over the entities that are staying: what a
 *   departing entity resolves to must never keep its own repository out of its own archive
 * @param resolvable every repository *any* row at the target pin resolves to, the departing ones
 *   included. It excuses a link that points outside the move set, and nothing else: the worklist's
 *   offline reduction spares exactly these, which is how a shared component can archive an entity
 *   whose own repository stays live for the index row that still claims it
 * @param removed typed keys the classifier calls Removed at this pin pair — pin-derived, so it
 *   survives the tree changes render made and can still catch a deleted `Drop` line
 */
export function planArchive({
    recorded,
    confirmed,
    rows,
    graph,
    archived,
    claims,
    resolvable = new Map(),
    removed,
    catalogRoot,
    archiveRoot,
}) {
    const refusals = [];
    const refuse = (kind, subject, detail) => refusals.push({ kind, subject, detail });
    const subjects = [];
    const byIdentity = new Map();
    /** A note in the component, wherever it now sits: the live tree first, then the archive. */
    const noteFor = key => graph.entities.byKey.get(key) ?? archived.entities.byKey.get(key) ?? null;

    const add = entry => {
        const identity = `${entry.type}:${entry.type === 'repo' ? entry.numericId : entry.id}`;
        const existing = byIdentity.get(identity);
        if (existing) {
            existing.line = existing.line ?? entry.line;
            existing.confirmed = existing.confirmed ?? entry.confirmed;
            return existing;
        }
        byIdentity.set(identity, entry);
        subjects.push(entry);
        return entry;
    };

    // --- resolve every recorded item to the note it names -------------------------------------------
    for (const item of recorded) {
        const type = item.type;
        if (!HOMES[type]) {
            refuse(REFUSALS.unresolved, `${item.type} ${item.id}`, 'unknown subject type');
            continue;
        }
        if (type === 'repo') {
            const live = graph.repositories.byAlias.get(repoKey(item.id)) ?? null;
            const gone = archived.repositories.byAlias.get(repoKey(item.id)) ?? null;
            if (!live && !gone) {
                refuse(REFUSALS.unresolved, `repo ${item.id}`, 'no repository note carries this name, live or archived');
                continue;
            }
            add({
                type,
                id: item.id,
                numericId: (live ?? gone).numericId,
                from: live ? path.join(catalogRoot, live.note) : null,
                line: item,
                confirmed: null,
            });
            continue;
        }
        if (!isFilenameSafe(item.id)) {
            refuse(REFUSALS.misplaced, `${type} ${item.id}`, 'the id is not usable as a filename');
            continue;
        }
        add({
            type,
            id: item.id,
            numericId: null,
            from: path.join(catalogRoot, HOMES[type].spec.directory, HOMES[type].noteName(item.id)),
            line: item,
            confirmed: null,
        });
    }

    // --- and everything capture confirmed, which the pin diff could not have written ----------------
    for (const [key, evidence] of confirmed.entities) {
        const [type, id] = [key.slice(0, key.indexOf(':')), key.slice(key.indexOf(':') + 1)];
        if (!HOMES[type] || !isFilenameSafe(id)) {
            refuse(REFUSALS.misplaced, `${type} ${id}`, 'the id is not usable as a filename');
            continue;
        }
        add({
            type,
            id,
            numericId: null,
            from: path.join(catalogRoot, HOMES[type].spec.directory, HOMES[type].noteName(id)),
            line: null,
            confirmed: evidence,
        });
    }
    for (const [numericId, evidence] of confirmed.repositories) {
        const live = graph.repositories.byId.get(numericId) ?? null;
        const gone = archived.repositories.byId.get(numericId) ?? null;
        if (!live && !gone) {
            refuse(REFUSALS.unresolved, `repo ${numericId}`, 'the confirmed repository has no note');
            continue;
        }
        add({
            type: 'repo',
            id: (live ?? gone).fullName,
            numericId,
            from: live ? path.join(catalogRoot, live.note) : null,
            line: null,
            confirmed: evidence,
        });
    }

    // --- the final reduction, and what it leaves ---------------------------------------------------
    // A repository GitHub has confirmed unavailable archives with its whole component, live index
    // rows included; nothing may spare it. Everything else a live entity claims stays where it is.
    const spared = [];
    const moving = [];
    for (const entry of subjects) {
        const claim = entry.type === 'repo' ? claims.get(entry.numericId) : undefined;
        if (claim && !confirmed.repositories.has(entry.numericId)) {
            spared.push({ ...entry, claim });
            continue;
        }
        moving.push(entry);
    }
    const movingKeys = new Set(moving.map(entry => `${entry.type}:${entry.type === 'repo' ? entry.numericId : entry.id}`));
    const sparedIds = new Set(spared.filter(entry => entry.type === 'repo').map(entry => entry.numericId));

    // --- reconciliation, both directions, before anything moves ------------------------------------
    // 1. The pin diff is a fact about the two indexes, not about the tree, so it still answers after
    //    render has rewritten the tree: every subject it archives must carry a `Drop` item.
    for (const key of removed) {
        if (!movingKeys.has(key)) refuse(REFUSALS.missing, key.replace(':', ' '), 'removed at this pin pair with no Drop item');
    }
    // 2. The component closes over the links the archived notes themselves hold. Those notes are
    //    the part of the baseline graph render never touches — a removed entity is in no index at
    //    the target pin, so it is never a landing — which is what makes this an independent check
    //    rather than a re-derivation of the closure from a tree that has moved on.
    //
    //    A link may legitimately point at a repository that is not moving, and at exactly one
    //    thing: a repository some row at the target pin still resolves to. That is the reduction
    //    the worklist already applied offline, and it is why a shared component can leave a live
    //    repository behind — the row that claimed it is what keeps it live.
    const held = new Set();
    for (const entry of moving) {
        if (entry.type === 'repo') continue;
        const note = noteFor(`${entry.type}:${entry.id}`);
        if (!note) continue;
        if (note.links === null) {
            refuse(REFUSALS.unreadable, `${entry.type} ${entry.id}`, note.reason ?? 'the note does not parse');
            continue;
        }
        for (const numericId of note.links) {
            held.add(numericId);
            if (movingKeys.has(`repo:${numericId}`) || sparedIds.has(numericId) || resolvable.has(numericId)) continue;
            refuse(REFUSALS.missing, `repo ${numericId}`, `held by archived ${entry.type} ${entry.id} with no Drop item`);
        }
    }
    // 3. And nothing else: a repository moves because an archived note holds it or because GitHub
    //    confirmed it gone, never because a line said so.
    for (const entry of moving) {
        if (entry.type !== 'repo') continue;
        if (held.has(entry.numericId) || confirmed.repositories.has(entry.numericId)) continue;
        refuse(REFUSALS.excess, `repo ${entry.id}`, `no archived note holds ${entry.numericId} and GitHub confirmed nothing`);
    }
    // 4. An entity is archived because its index row is gone. One that is still indexed may only
    //    leave on confirmed evidence — or because a shared repository pulled its whole component
    //    out from under it, which decision 3.3 covers deliberately — and its line then has to
    //    survive the run (ruling R4).
    for (const entry of moving) {
        if (entry.type === 'repo') continue;
        const key = `${entry.type}:${entry.id}`;
        if (!rows.has(key) || confirmed.entities.has(key)) continue;
        const pulled = (noteFor(key)?.links ?? []).some(numericId => movingKeys.has(`repo:${numericId}`));
        if (pulled) continue;
        refuse(REFUSALS.excess, `${entry.type} ${entry.id}`, 'still present in an index at the target pin');
    }

    // --- paths, and the pre-flight refusals that belong to them ------------------------------------
    const moves = [];
    const already = [];
    const ORDER = ['plugin', 'theme', 'repo'];
    for (const entry of moving) {
        const placed = placement({ ...entry, catalogRoot, archiveRoot });
        const subject = `${entry.type} ${entry.id}`;
        if (!placed.inside) {
            refuse(REFUSALS.misplaced, subject, `${placed.to} is not under the archive root`);
            continue;
        }
        if (!placed.named) {
            refuse(REFUSALS.misplaced, subject, `${placed.basename} is not the note this identity is filed under`);
            continue;
        }
        const source = entry.from !== null && isFile(entry.from);
        const destination = isFile(placed.to);
        if (source && destination) {
            refuse(REFUSALS.ambiguous, subject, `${placed.to} already exists`);
            continue;
        }
        // An interrupted run leaves the note at its destination and its line unticked. Re-running is
        // the repair, so a move already performed is counted rather than refused — and its hash is
        // still recorded, because the receipt is what the archive is verified against.
        if (!source && destination) {
            already.push({ ...entry, ...placed, from: entry.from });
            continue;
        }
        if (!source) {
            refuse(REFUSALS.unresolved, subject, `${entry.from ?? placed.to} does not exist`);
            continue;
        }
        moves.push({ ...entry, ...placed });
    }
    const sort = (left, right) =>
        ORDER.indexOf(left.type) - ORDER.indexOf(right.type) || String(left.basename ?? left.id).localeCompare(String(right.basename ?? right.id));
    moves.sort(sort);
    already.sort(sort);
    spared.sort((left, right) => String(left.id).localeCompare(String(right.id)));

    return { moves, already, spared, refusals, ok: refusals.length === 0 };
}

/**
 * Execute a plan that has already reconciled.
 *
 * `rename` inside one filesystem is atomic and cannot rewrite content; the hashes are the proof,
 * not the mechanism. `EXDEV` aborts rather than degrading into copy-and-delete: a copy is a second
 * set of bytes, and the whole contract of an archive move is that there is only ever one.
 */
export function executeArchive(moves) {
    const done = [];
    for (const move of moves) {
        const before = sha256(fs.readFileSync(move.from));
        fs.mkdirSync(path.dirname(move.to), { recursive: true });
        try {
            fs.renameSync(move.from, move.to);
        } catch (error) {
            const detail = error.code === 'EXDEV'
                ? `${move.from} and ${move.to} are on different filesystems; an archive move is a rename, never a copy`
                : error.message;
            return { done, failed: { move, detail } };
        }
        const after = sha256(fs.readFileSync(move.to));
        if (after !== before) return { done, failed: { move, detail: `${move.to} does not carry the bytes of ${move.from}` } };
        if (isFile(move.from)) return { done, failed: { move, detail: `${move.from} still exists after the rename` } };
        done.push({ ...move, sha256: after });
    }
    return { done, failed: null };
}

/** The hash of a note that an earlier pass already moved: the receipt records it either way. */
export function hashArchived(entries) {
    return entries.map(entry => ({ ...entry, sha256: sha256(fs.readFileSync(entry.to)) }));
}

/**
 * The state file after the archive: what moved is terminal, what was spared says why, and the one
 * subject archived while its index row survives keeps a standing line instead of retiring.
 *
 * A `[-]` line is the only thing that survives the reset, so the distinction decides whether
 * coverage stays provable: an entity whose row is gone needs no excuse, and one whose row is still
 * there needs one forever.
 */
export function applyArchiveToState(state, { moved, spared, rows }) {
    const sections = {};
    for (const name of SECTIONS) sections[name] = (state.sections[name] ?? []).map(item => ({ ...item }));
    const byKey = new Map();
    for (const name of SECTIONS) for (const item of sections[name]) byKey.set(subjectKey(item), item);

    const ticked = [];
    const standing = [];
    const appended = [];
    for (const entry of moved) {
        const key = subjectKey(entry.type, entry.id);
        const indexed = entry.type !== 'repo' && rows.has(`${entry.type}:${entry.id}`);
        const line = byKey.get(key);
        const reason = entry.confirmed ? reasonTail(entry.confirmed.reason) : line?.reason ?? null;
        if (!line) {
            const item = {
                marker: indexed ? MARKERS.failed : MARKERS.done,
                type: entry.type,
                id: entry.id,
                reason: indexed ? `${reason}; archived while its index row stands` : reason,
            };
            sections.Drop.push(item);
            appended.push(item);
            if (indexed) standing.push(item);
            continue;
        }
        line.marker = indexed ? MARKERS.failed : MARKERS.done;
        line.reason = indexed ? `${reason}; archived while its index row stands` : reason;
        (indexed ? standing : ticked).push(line);
    }
    for (const entry of spared) {
        const line = byKey.get(subjectKey(entry.type, entry.id));
        const reason = reasonTail(
            `spared; ${entry.numericId} is claimed at the target pin by ${entry.claim.by.replace(':', ' ')} ` +
                `via ${entry.claim.repo} (${entry.claim.source})`,
        );
        // The line is terminal either way: the run decided, and the receipt records the decision.
        // A `[-]` here would leave a standing excuse for a note that is live and needs none.
        if (line) {
            line.marker = MARKERS.done;
            line.reason = reason;
        } else {
            sections.Drop.push({ marker: MARKERS.done, type: entry.type, id: entry.id, reason });
        }
    }
    return { state: { ...state, sections }, ticked, standing, appended };
}
