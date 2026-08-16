#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

import {
    EXIT,
    isDirectory,
    isFile,
    nowUtc,
    parseArgs,
    readJson,
    readText,
    writeJson,
    writeUsageError,
} from './lib.mjs';
import { IDENTITY_STATUS, PRIMARY, verifyMaterial } from './identity.mjs';
import {
    NOTE_CLASSES,
    dedupe,
    githubUrl,
    isFilenameSafe,
    loadIndexes,
    pluginNoteName,
    pluginUrl,
    repoKey,
    repositoryNoteName,
    screenshotUrl,
    themeNoteName,
    themeSlug,
    themeUrl,
} from './model.mjs';
import { bodyMissing, loadTemplate, parseNote } from './note.mjs';
import { flattenDataBlock, parseDataBlock } from './datablock.mjs';
import { renderPluginNote, renderRepositoryNote, renderThemeNote } from './render.mjs';
import { DirectoryClient, pacingFrom } from './directory.mjs';
import { captureRepositories, fetchReadme, fetchRepositoryById, toRepositoryRecord } from './github.mjs';
import { loadEntityNotes, loadRepositoryNotes } from './resolve.mjs';
import { hasNoUsableInput, movedBodyInputs, validateBody } from './body.mjs';
import {
    MARKERS,
    SECTIONS,
    blockers,
    duplicateSubjects,
    exceptions,
    loadState,
    receiptDescribes,
    resetState,
    serializeState,
    writeReceipt,
} from './state.mjs';
import {
    applyArchiveToState,
    claimsAtTarget,
    confirmedArchivals,
    executeArchive,
    hashArchived,
    planArchive,
    rowsAtPin,
} from './archive.mjs';
import {
    CLASSES,
    applyWorklist,
    capturedClasses,
    claimedRepositories,
    classify,
    closureFor,
    closureItems,
    reconcile,
    recognizedLinksFor,
    sortItems,
    subjectKey,
    writableItems,
} from './worklist.mjs';

/**
 * The run driver under the state model (decision 3.11): no Ledger, no Run Reports.
 *
 * `worklist` is offline and opens the run — it classifies the pin pair, expands every archive
 * trigger to its baseline relationship closure, and writes the network work and the archive moves
 * into the live state file; `capture` performs every network read and leaves its evidence and the
 * body queue in the disposable cache; `render` is offline and mechanical — it validates every body,
 * lands notes, and ticks the live state file; `finalize` checks that every worklist item is
 * terminal, writes the compact receipt beside the state file, and resets the worklists while
 * advancing `base pin`.
 *
 * Change detection needs no store: the note's own data block is the baseline (description and
 * About are recorded verbatim, the README by blob sha), so a capture queues a body exactly when
 * the note is missing or a recorded input moved.
 *
 * Exit: 0 clean, 1 findings (failure lanes or blockers), 2 usage, 3 missing material,
 * 4 identity mismatch, 5 refused.
 */

const USAGE = `usage: run.mjs --stage worklist|capture|render|archive|finalize [options]

  --release-mirror-root DIR  checkout of ${PRIMARY.repo} at the target pin (worklist, capture, render, archive)
  --base-index-root DIR      the same six data files plus README at the \`base pin\` (required for worklist and archive)
  --templates-root DIR       note templates (required for capture and render)
  --catalog-root DIR         catalog tree (required for worklist, capture, render and archive)
  --archive-root DIR         archived notes, class split preserved (required for archive)
  --support-root DIR         catalog support tree; scratch files land here (required for capture, render and archive)
  --state-file FILE          the live state file; worklist writes it, render ticks it, archive records its moves, finalize resets it
  --release-pin SHA          the Release Pin being processed (required for worklist, render and archive)
  --run LABEL                the run label recorded in the state file and used as the receipt filename
  --plugin ID                pilot selection, repeatable; not combinable with a state file
  --theme NAME               pilot selection by index name, repeatable
  --limit N                  render only the first N landings in the deterministic order
  --interval-ms N            Directory pacing interval (default 1500)
  --batch-size N             GraphQL repositories per request (default 10)
  --user-agent STRING        recorded run input; required for any network stage
  --refresh-repositories     re-capture every selected repository even when it resolves offline
  --allow-empty-bodies       render a note whose body is not staged yet and record it as pending
  --bodies FILE              staged bodies for the render stage
  --model STRING             short model id recorded in the state file and receipt
  --pacing STRING            recorded pacing parameters, carried into the receipt
  --prompt STRING            prompt identity recorded alongside
  --gate-status STRING       finalize only: the offline gate's result, recorded in the receipt
  --dry-run                  report what the stage would do and write nothing
  --help`;

function cachePath(supportRoot, name) {
    return path.join(supportRoot, name);
}

function requireRoots(args, names) {
    const missing = names.filter(name => !args[name]);
    if (missing.length) throw new Error(`missing required ${missing.map(name => `--${name}`).join(', ')}`);
}

function loadTemplates(root) {
    return {
        plugin: loadTemplate(root, NOTE_CLASSES.plugin.template),
        theme: loadTemplate(root, NOTE_CLASSES.theme.template),
        repository: loadTemplate(root, NOTE_CLASSES.repository.template),
    };
}

function selectEntities(indexes, args) {
    const plugins = [];
    const themes = [];
    const missing = [];
    for (const id of args.plugin) {
        const plugin = indexes.plugins.find(row => row.id === id);
        if (plugin) plugins.push(plugin);
        else missing.push(`plugin ${id}`);
    }
    for (const name of args.theme) {
        const theme = indexes.themes.find(row => row.name === name || themeSlug(row.name) === name);
        if (theme) themes.push(theme);
        else missing.push(`theme ${name}`);
    }
    return { plugins, themes, missing };
}

/**
 * The note on disk, in the three states the caller has to keep apart: absent, present and parsed,
 * or present and unparsable. The third one must never read as absent — a re-render from scratch
 * would drop `remind me` and every human `related to` member (§4.4), which is exactly what the
 * merge discipline exists to prevent. It is carried out as the `note-unparsable` lane instead, and
 * the entity is left byte-identical for a human to repair.
 */
function readExisting(file) {
    if (!isFile(file)) return { text: null, note: null, unparsable: null };
    const text = readText(file);
    const parsed = parseNote(text);
    return parsed.ok ? { text, note: parsed, unparsable: null } : { text, note: null, unparsable: parsed.reason };
}

/**
 * The note's data block, flattened — the baseline every change comparison reads (decision 3.11).
 *
 * A block that is absent and a block that does not parse are two different facts and must not
 * collapse into one: the offline point-edit path reads this function for its `about`, where "no
 * baseline" would quietly drop a recorded About and rewrite the note without it. The caller decides
 * what each means — capture treats an unreadable block as a reason to re-capture, the point-edit
 * path refuses the item.
 */
function blockValues(existing) {
    if (!existing?.data) return { values: null, unparsable: null };
    try {
        return { values: flattenDataBlock(parseDataBlock(existing.data)), unparsable: null };
    } catch (error) {
        return { values: null, unparsable: error.message };
    }
}

/**
 * Whether the note already carries an embed, in either of the two positions it can sit in: a theme
 * note with a body carries it among `embeds`, and one without a body carries it in the body
 * position, because `parseNote` calls the first block the body. Reading only `embeds` would drop
 * the embed of every body-less theme note on re-render.
 */
function carriesEmbed(existing) {
    return [existing?.body, ...(existing?.embeds ?? [])].some(block => String(block ?? '').trimStart().startsWith('!['));
}

function refuse(message) {
    process.stderr.write(`${message}\n`);
    process.exitCode = EXIT.refused;
}

function verifyRoot(root, flag) {
    const material = verifyMaterial(root, { flag });
    if (material.status === IDENTITY_STATUS.verified) return material;
    process.stderr.write(`${material.reason}\n`);
    process.exitCode = material.status === IDENTITY_STATUS.missing ? EXIT.missingMaterial : EXIT.identityMismatch;
    return null;
}

/** One histogram row: a label of fixed width, then one right-aligned column per value. */
const row = (label, ...values) => `    ${label.padEnd(22)}${values.map(value => String(value).padStart(8)).join('')}`;

/**
 * Stage 0 (decision 3.11): classify `base pin → target pin`, expand every archive trigger to its
 * baseline relationship closure, and write the network work and the archive moves into the live
 * state file.
 *
 * Both index states arrive as injected material roots — the mirror at the target pin and the base
 * pin's copy of the same six files — so the stage learns nothing about the repository layout and
 * invokes no version-control system. The caller that owns the layout materializes the base root.
 *
 * On a resume it re-derives the same list and reconciles it against the file, writing nothing: the
 * markers a render put there are the run's progress, and re-writing them would erase it.
 */
function stageWorklist(args) {
    requireRoots(args, ['release-mirror-root', 'base-index-root', 'catalog-root', 'state-file', 'release-pin', 'run']);
    if (!isFilenameSafe(args.run)) throw new Error(`--run ${args.run} is not usable as a receipt filename`);

    const material = verifyRoot(args['release-mirror-root'], PRIMARY.flag);
    if (!material) return;
    const baseMaterial = verifyRoot(args['base-index-root'], 'base-index-root');
    if (!baseMaterial) return;
    if (material.root === baseMaterial.root) {
        return refuse(`--base-index-root and --${PRIMARY.flag} are the same directory; one pin cannot be two`);
    }

    const state = loadState(args['state-file']);
    if (!state.ok) {
        process.stderr.write(`state file: ${state.reason}\n`);
        process.exitCode = state.absent ? EXIT.missingMaterial : EXIT.usage;
        return;
    }
    if (!state.basePin) return refuse('the state file records no `base pin`; there is nothing to diff against');
    if (state.basePin === args['release-pin']) {
        return refuse(`the catalog already reflects ${args['release-pin']}; there is nothing to do`);
    }
    if (state.targetPin && state.targetPin !== args['release-pin']) {
        return refuse(`the state file is already processing ${state.targetPin}; finalise it before starting another run`);
    }
    const resuming = Boolean(state.targetPin);

    const base = loadIndexes(baseMaterial.root);
    const target = loadIndexes(material.root);
    const classification = classify({ base, target });
    if (classification.duplicateKeys.length) {
        return refuse(`the indexes carry duplicate keys, so a diff would be ambiguous: ${classification.duplicateKeys.join(', ')}`);
    }

    // The closure is a fact about the notes, not about the index: decision 3.3 defines the unit as
    // the relationship component *as it stood at the run baseline*, and only the notes record that.
    const catalogRoot = args['catalog-root'];
    const graph = { entities: loadEntityNotes(catalogRoot), repositories: loadRepositoryNotes(catalogRoot) };
    const claimed = claimedRepositories([...target.plugins, ...target.themes], graph.repositories);
    const triggers = classification.items
        .filter(entry => entry.class === CLASSES.removed)
        .map(entry => `${entry.type}:${entry.id}`);
    const closure = closureFor(triggers, graph, { spared: claimed });
    if (closure.unreadable.length) {
        return refuse(`the closure reaches notes that do not parse, so it cannot be trusted: ${closure.unreadable.join(', ')}`);
    }
    if (closure.withoutNote.length) {
        return refuse(`the closure reaches entities with no note on disk: ${closure.withoutNote.join(', ')}`);
    }
    if (closure.repositoriesWithoutNote.length) {
        return refuse(`the closure reaches repository links with no note on disk: ${closure.repositoriesWithoutNote.join(', ')}`);
    }

    const items = [...classification.items, ...closureItems(closure, { graph, triggers })];
    const writable = writableItems(items);
    // The item id becomes a state-file token, so it may carry no whitespace. A repository takes its
    // id from a note's H1, which is upstream text, and this is the one place that can be checked
    // before the file is written rather than after the next run fails to parse it.
    const unsafe = writable.filter(entry => /\s/.test(entry.id));
    if (unsafe.length) {
        return refuse(`an item id may carry no whitespace: ${unsafe.map(entry => `${entry.type} ${entry.id}`).join(', ')}`);
    }
    const seen = new Set();
    const doubled = [];
    for (const entry of writable) {
        const key = subjectKey(entry);
        if (seen.has(key)) doubled.push(entry);
        else seen.add(key);
    }
    if (doubled.length) {
        return refuse(`the classifier produced two items for one subject: ${doubled.map(entry => `${entry.type} ${entry.id}`).join(', ')}`);
    }
    // A resume reconciles the file it finds and leaves it alone: the markers a render put there are
    // the run's progress, and re-applying the worklist would erase it.
    const applied = resuming ? { state, retired: [] } : applyWorklist(state, writable);
    const duplicates = duplicateSubjects(applied.state);
    if (duplicates.length) {
        const named = duplicates.map(entry => `${entry.type} ${entry.id} (${entry.sections.join(' and ')})`);
        return refuse(`one line per subject is required; these carry more: ${named.join(', ')}`);
    }

    // --- what the run is about to be, printed before anything is written -------------------------
    const counts = classification.counts;
    const section = name => writable.filter(entry => entry.section === name).length;
    const standing = applied.state.sections.Dump
        .concat(applied.state.sections.Sync, applied.state.sections.Drop)
        .filter(line => line.marker === MARKERS.retry || line.marker === MARKERS.failed);
    const lines = [
        `worklist ${args.run}: base ${state.basePin} → target ${args['release-pin']}`,
        '  index',
        row('', 'plugins', 'themes'),
        row('at the base pin', base.plugins.length, base.themes.length),
        row('at the target pin', target.plugins.length, target.themes.length),
        '  classification, one item per subject',
        row('added', counts.plugin.added, counts.theme.added),
        row('relocated', counts.plugin.relocated, counts.theme.relocated),
        row('amended', counts.plugin.amended, counts.theme.amended),
        row('  queueing a body', counts.plugin.bodyQueued, counts.theme.bodyQueued),
        row('stats only', counts.plugin.stats, counts.theme.stats),
        row('removed', counts.plugin.removed, counts.theme.removed),
        row('rename-suspect', 0, classification.renameSuspects.length),
        '  stats predicate over subjects present at both pins',
        row('downloads moved', counts.statsPredicate.downloads),
        row('updated moved', counts.statsPredicate.updated),
        row('appeared', counts.statsPredicate.appeared),
        row('vanished', counts.statsPredicate.vanished),
        `${row('subjects', counts.statsPredicate.subjects)}  (${counts.plugin.stats} stats only, ` +
            `${counts.statsPredicate.amended} also amended, ${counts.statsPredicate.relocated} also relocated)`,
        '  archive closure, read from the notes on disk',
        row('triggers', triggers.length),
        row('entity notes', closure.entities.size),
        row('repository notes', closure.repositories.size),
        row('spared offline', closure.spared.size),
        row('baseline closure', closure.entities.size + closure.repositories.size + closure.spared.size),
        '    the reduction above is best effort: only the archive stage, working from resolved',
        '    numeric ids, can spare a repository whose new name is on no alias list yet',
        '  state file',
        row('Dump', section('Dump')),
        row('Drop', section('Drop')),
        `${row('Sync', section('Sync'))}  (derived from the notes at render; failures only)`,
        row('standing lines retired', applied.retired.length),
        row('standing lines kept', standing.length),
    ];
    for (const entry of sortItems(writable.filter(item => item.class === CLASSES.relocated))) {
        lines.push(`  relocated ${entry.type} ${entry.id}: ${entry.baseRow.repo} → ${entry.targetRow.repo}`);
    }
    for (const numericId of [...closure.spared].sort()) {
        const record = graph.repositories.byId.get(numericId);
        lines.push(`  spared ${repositoryNoteName(numericId).slice(0, -3)}: claimed at the target pin by ${claimed.get(numericId)} (${record?.fullName ?? 'unknown'})`);
    }
    for (const pair of classification.renameSuspects) {
        lines.push(`  rename-suspect theme ${pair.removed} → ${pair.added} (repo ${pair.repo}); queued for the owner, executed by nobody`);
    }
    for (const line of applied.retired) {
        lines.push(`  retired [${line.marker}] ${line.type} ${line.id} — ${line.reason ?? ''}`);
    }
    for (const line of standing.filter(entry => entry.marker === MARKERS.retry)) {
        lines.push(`  seeded ahead of rotation [${line.marker}] ${line.type} ${line.id} — ${line.reason ?? ''}`);
    }

    if (resuming) {
        const verdict = reconcile(state, writable);
        for (const entry of verdict.missing) lines.push(`  missing ${entry.section} ${entry.type} ${entry.id}`);
        for (const entry of verdict.excess) lines.push(`  excess ${entry.section} ${entry.type} ${entry.id}`);
        for (const entry of verdict.mislabelled) {
            lines.push(`  mislabelled ${entry.type} ${entry.id}: expected ${entry.expected}, found ${entry.actual}`);
        }
        lines.push(`  reconciliation: ${verdict.ok ? 'clean' : 'mismatch'}`);
        for (const line of lines) process.stdout.write(`${line}\n`);
        if (!verdict.ok) {
            process.exitCode = EXIT.refused;
            return;
        }
        process.exitCode = classification.renameSuspects.length ? EXIT.findings : EXIT.clean;
        return;
    }

    if (args['dry-run']) {
        lines.push('  dry run: nothing written');
        for (const line of lines) process.stdout.write(`${line}\n`);
        process.exitCode = classification.renameSuspects.length ? EXIT.findings : EXIT.clean;
        return;
    }

    const values = { ...state.values };
    if (args.model) values.model = args.model;
    if (args.pacing) values.pacing = args.pacing;
    fs.writeFileSync(
        args['state-file'],
        serializeState({ ...applied.state, values, targetPin: args['release-pin'], run: args.run }),
    );
    lines.push(`  written to ${args['state-file']}`);
    for (const line of lines) process.stdout.write(`${line}\n`);
    process.exitCode = classification.renameSuspects.length ? EXIT.findings : EXIT.clean;
}

/** One cost record, printed in whatever shape it was recorded — the stages count different things. */
function describeCost(cost) {
    const parts = [];
    if (cost.requests !== undefined) parts.push(`${cost.requests} requests`);
    if (cost.repos !== undefined) parts.push(`${cost.repos} repos`);
    if (cost.cost !== undefined) parts.push(`${cost.cost} points`);
    if (cost.nodeCount !== undefined) parts.push(`nodeCount ${cost.nodeCount}`);
    if (cost.remaining !== undefined) parts.push(`remaining ${cost.remaining}`);
    return `  cost ${cost.stage}: ${parts.join(', ')}`;
}

/**
 * The capture selection, re-derived from the pin pair rather than read off the state file.
 *
 * A stage never trusts the file for what a subject *is*: it classifies the same two pins again and
 * reconciles, so a hand-edited worklist cannot silently redirect several hundred network calls.
 * Only `Dump` is compared here — `Drop` records a relationship graph the archive stage owns.
 *
 * The classes selected are the ones that cost a round trip, plus every standing `[>]` subject,
 * which an Update Run re-probes ahead of its ordinary refresh rotation. A standing subject whose
 * row has left the index is dropped rather than selected and failed: its lifecycle ended, and the
 * archive stage owns it from here.
 */
function selectFromWorklist(args, target) {
    const fail = (exit, message) => ({ ok: false, exit, message });
    if (!args['base-index-root']) return fail(EXIT.usage, 'missing required --base-index-root');
    if (!args['release-pin']) return fail(EXIT.usage, 'missing required --release-pin');
    const baseMaterial = verifyMaterial(args['base-index-root'], { flag: 'base-index-root' });
    if (baseMaterial.status !== IDENTITY_STATUS.verified) {
        const exit = baseMaterial.status === IDENTITY_STATUS.missing ? EXIT.missingMaterial : EXIT.identityMismatch;
        return fail(exit, baseMaterial.reason);
    }
    const state = loadState(args['state-file']);
    if (!state.ok) return fail(state.absent ? EXIT.missingMaterial : EXIT.usage, `state file: ${state.reason}`);
    if (!state.targetPin) {
        return fail(EXIT.refused, 'the state file carries no `target pin`; open the run with --stage worklist first');
    }
    if (state.targetPin !== args['release-pin']) {
        return fail(EXIT.refused, `the state file is processing ${state.targetPin}, not ${args['release-pin']}`);
    }

    const base = loadIndexes(baseMaterial.root);
    const classification = classify({ base, target });
    const verdict = reconcile(state, writableItems(classification.items), { sections: ['Dump'] });
    if (!verdict.ok) {
        const named = [
            ...verdict.missing.map(entry => `missing ${entry.section} ${entry.type} ${entry.id}`),
            ...verdict.excess.map(entry => `excess ${entry.section} ${entry.type} ${entry.id}`),
            ...verdict.mislabelled.map(entry => `mislabelled ${entry.type} ${entry.id}`),
        ];
        return fail(EXIT.refused, `the state file no longer describes this pin pair: ${named.join(', ')}`);
    }

    const rowFor = line =>
        line.type === 'plugin'
            ? target.plugins.find(plugin => plugin.id === line.id) ?? null
            : line.type === 'theme'
              ? target.themes.find(theme => themeSlug(theme.name) === line.id) ?? null
              : null;
    const selected = new Map();
    for (const entry of capturedClasses(classification.items)) {
        selected.set(subjectKey(entry), { kind: entry.type, key: entry.id, row: entry.targetRow, why: entry.class });
    }
    const retries = [];
    for (const line of exceptions(state)) {
        if (line.marker !== MARKERS.retry) continue;
        const key = subjectKey(line);
        if (selected.has(key)) continue;
        const row = rowFor(line);
        if (!row) continue;
        selected.set(key, { kind: line.type, key: line.id, row, why: 'standing retry' });
        retries.push(line);
    }

    const counts = classification.counts;
    const chosen = kind => [...selected.values()].filter(entry => entry.kind === kind).length;
    const bodyless = kind => counts[kind].amended - counts[kind].bodyQueued;
    const lines = [
        `capture selection from the worklist: base ${state.basePin} → target ${state.targetPin}`,
        row('', 'plugins', 'themes'),
        row('added', counts.plugin.added, counts.theme.added),
        row('relocated', counts.plugin.relocated, counts.theme.relocated),
        row('amended with a body', counts.plugin.bodyQueued, counts.theme.bodyQueued),
        row('standing retry', retries.filter(line => line.type === 'plugin').length, retries.filter(line => line.type === 'theme').length),
        row('selected', chosen('plugin'), chosen('theme')),
        '  never captured — the point-edit classes; no request below is attributable to one',
        row('stats only', counts.plugin.stats, counts.theme.stats),
        row('amended, no body', bodyless('plugin'), bodyless('theme')),
        row('removed', counts.plugin.removed, counts.theme.removed),
    ];
    for (const line of retries) lines.push(`  standing retry [${line.marker}] ${line.type} ${line.id} — ${line.reason ?? ''}`);
    return { ok: true, entities: [...selected.values()], lines };
}

/**
 * Stage 1 (decision 3.11): the only networked stage.
 *
 * Selection comes from the worklist, not from a hand-written list — see `selectFromWorklist` for
 * which classes reach it and why. `--plugin`/`--theme` stay for a pilot over a named handful and
 * are a *different* selection, so passing both a pilot flag and a state file is a usage error
 * rather than a silent precedence rule.
 *
 * Order inside the stage is fixed (§6.1): resolve the repositories, then the Directory page, then
 * the screenshot probe for a theme, then the body queue.
 */
async function stageCapture(args) {
    requireRoots(args, ['release-mirror-root', 'templates-root', 'catalog-root', 'support-root', 'user-agent']);
    const material = verifyMaterial(args['release-mirror-root']);
    if (material.status !== IDENTITY_STATUS.verified) {
        process.stderr.write(`${material.reason}\n`);
        process.exitCode = material.status === IDENTITY_STATUS.missing ? EXIT.missingMaterial : EXIT.identityMismatch;
        return;
    }
    const indexes = loadIndexes(material.root);

    const pilot = args.plugin.length > 0 || args.theme.length > 0;
    if (pilot && args['state-file']) {
        process.stderr.write('--plugin/--theme and --state-file are two different selections; pass one of them\n');
        process.exitCode = EXIT.usage;
        return;
    }
    if (!pilot && !args['state-file']) {
        process.stderr.write('no selection: pass --plugin/--theme for a pilot, or --state-file for the run worklist\n');
        process.exitCode = EXIT.usage;
        return;
    }
    const lines = [];
    let entities;
    if (pilot) {
        const { plugins, themes, missing } = selectEntities(indexes, args);
        if (missing.length) {
            process.stderr.write(`not in the index at this pin: ${missing.join(', ')}\n`);
            process.exitCode = EXIT.usage;
            return;
        }
        entities = [
            ...plugins.map(plugin => ({ kind: 'plugin', key: plugin.id, row: plugin, why: 'pilot' })),
            ...themes.map(theme => ({ kind: 'theme', key: themeSlug(theme.name), row: theme, why: 'pilot' })),
        ];
        lines.push(`capture pilot: ${plugins.length} plugins, ${themes.length} themes`);
    } else {
        const selection = selectFromWorklist(args, indexes);
        if (!selection.ok) {
            process.stderr.write(`${selection.message}\n`);
            process.exitCode = selection.exit;
            return;
        }
        entities = selection.entities;
        lines.push(...selection.lines);
    }
    for (const entity of entities) {
        entity.url = entity.kind === 'plugin' ? pluginUrl(entity.key) : themeUrl(entity.key);
    }

    const catalogRoot = args['catalog-root'];
    const supportRoot = args['support-root'];
    const userAgent = args['user-agent'];
    const notes = loadRepositoryNotes(catalogRoot);
    const pacing = pacingFrom({ intervalMs: args['interval-ms'] ? Number(args['interval-ms']) : undefined });

    // --- repositories: batched GraphQL metadata, one REST readme call per repository ------------
    const wanted = dedupe(entities.map(entity => entity.row.repo));
    // Lookup-first by default (§6.1): a repository already in the catalog costs no network call.
    // A refresh asks for the record itself rather than for the identity — which is what a template
    // migration needs, because the data block is rendered from the record, not from the note.
    const toCapture = args['refresh-repositories']
        ? [...wanted]
        : wanted.filter(repo => !notes.byAlias.has(repoKey(repo)));
    const batchSize = Number(args['batch-size'] ?? 10);
    const themeCount = entities.filter(entity => entity.kind === 'theme').length;
    lines.push(
        '  repositories',
        row('distinct repo strings', wanted.length),
        row('resolved offline', wanted.length - toCapture.length),
        row('to capture', toCapture.length),
    );

    if (args['dry-run']) {
        lines.push(
            '  dry run: nothing captured, no request issued',
            row('Directory pages', entities.length),
            row('screenshot probes', themeCount),
            row('GraphQL batches', Math.ceil(toCapture.length / batchSize)),
            row('REST readme calls', toCapture.length),
        );
        for (const line of lines) process.stdout.write(`${line}\n`);
        process.exitCode = EXIT.clean;
        return;
    }

    const client = new DirectoryClient({ pacing, userAgent });
    const repositories = new Map();
    const failures = [];
    const costs = [];
    const misses = [];
    /**
     * One capture wave. `as` maps the name asked for back to the index string the catalog knows
     * the repository by, so a repository captured under its canonical name after a rename still
     * keeps the index string as a former name — which is what lets a later run resolve that row
     * offline instead of asking again.
     */
    const captureWave = async (names, as = name => name) => {
        for (let index = 0; index < names.length; index += batchSize) {
            const batch = names.slice(index, index + batchSize);
            const { records, rateLimit } = await captureRepositories(batch, { userAgent });
            costs.push({ stage: 'repositories-graphql', repos: batch.length, ...(rateLimit ?? {}) });
            let readmeCalls = 0;
            for (const record of records) {
                const repo = as(record.repo);
                if (!record.node) {
                    misses.push({ repo, asked: record.repo, error: record.error });
                    continue;
                }
                // The index string is a former full name whenever GitHub answers under another one.
                const formerNames = repoKey(record.node.nameWithOwner) === repoKey(repo) ? [] : [repo];
                // README discovery is server-side (decision 3.8): one REST call per
                // captured repository, addressed by the canonical name GitHub answered with. The call
                // counts against the 5,000/h REST budget, so a full-catalog refresh spans budget
                // windows; the resumable worklist makes the pause a resume, not a loss.
                let readme = null;
                try {
                    readme = await fetchReadme(record.node.nameWithOwner, { userAgent });
                    readmeCalls += 1;
                } catch (error) {
                    failures.push({ lane: 'readme-error', subject: repo, detail: error.message });
                }
                if (readme?.oversized) {
                    failures.push({
                        lane: 'readme-oversized',
                        subject: repo,
                        detail: `README ${readme.size} bytes answers encoding "none"; skipped as a summary input`,
                    });
                }
                repositories.set(repo, {
                    record: { ...toRepositoryRecord(record.node, readme, nowUtc()), formerNames },
                });
            }
            costs.push({ stage: 'readmes-rest', repos: readmeCalls, cost: readmeCalls, nodeCount: 0 });
        }
    };
    await captureWave(toCapture);

    // --- the second identity probe (decision 3.3) -------------------------------------------------
    // A known repository that missed by `owner/name` is either renamed or gone, and only its
    // immutable numeric id separates the two. A repository with no id recorded anywhere cannot be
    // asked: its first terminal answer is a standing observation, and only a second one in a
    // distinct run confirms loss. Nothing here writes a state-file line — the archive stage owns
    // that, so the set of state-file writers stays {worklist, render, archive, finalize}.
    const renamed = new Map();
    for (const miss of misses.splice(0)) {
        const known = notes.byAlias.get(repoKey(miss.repo));
        if (!known) {
            failures.push({ lane: 'github-missing', subject: miss.repo, detail: miss.error });
            continue;
        }
        const probe = await fetchRepositoryById(known.numericId, { userAgent });
        costs.push({ stage: 'repository-by-id-rest', repos: 1, cost: 1, nodeCount: 0 });
        if (probe.terminal) {
            failures.push({
                lane: 'repository-unavailable',
                subject: miss.repo,
                databaseId: known.numericId,
                statuses: [`graphql ${miss.error}`, `rest /repositories/${known.numericId} ${probe.status}`],
                detail: `${miss.repo} and its immutable id ${known.numericId} both answer terminal`,
            });
            continue;
        }
        if (probe.status === 200 && probe.nameWithOwner) {
            renamed.set(probe.nameWithOwner, miss.repo);
            continue;
        }
        failures.push({
            lane: 'github-missing-at-refresh',
            subject: miss.repo,
            detail: `id ${known.numericId}: ${probe.reason}; retry on a later run`,
        });
    }
    if (renamed.size) {
        await captureWave([...renamed.keys()], name => renamed.get(name) ?? name);
        for (const miss of misses.splice(0)) {
            failures.push({
                lane: 'github-missing-at-refresh',
                subject: miss.repo,
                detail: `renamed to ${miss.asked}, which then missed too (${miss.error})`,
            });
        }
    }

    // --- Directory pages ------------------------------------------------------------------------
    const captures = { repositories: {}, entities: {} };
    const queue = [];
    let pages = 0;
    let probes = 0;
    let aborted = null;
    for (const entity of entities) {
        let about;
        try {
            about = await client.captureAbout(entity.url, entity.kind);
            pages += 1;
        } catch (error) {
            if (error.aborted) {
                aborted = error.message;
                break;
            }
            throw error;
        }
        if (about.status !== 'ok' && about.status !== 'absent') {
            failures.push({ lane: `directory-${about.status}`, subject: entity.url, detail: about.reason });
        }
        captures.entities[`${entity.kind}:${entity.key}`] = {
            url: entity.url,
            aboutStatus: about.status,
            about: about.about,
            accessedAt: nowUtc(),
            pageBytes: about.page?.bytes ?? null,
            pageHash: about.page?.hash ?? null,
            markers: about.markers ?? null,
        };
        // Decision 3.9: the embed address is derived, never observed, so the derived address is
        // probed before a note is written to carry it. A 404 omits the embed and records the lane;
        // the pinned path is left exactly as upstream serves it, trailing space and all.
        if (entity.kind === 'theme') {
            const url = screenshotUrl(entity.row.repo, entity.row.screenshot);
            let probe;
            try {
                probe = await client.probe(url);
                probes += 1;
            } catch (error) {
                if (error.aborted) {
                    aborted = error.message;
                    break;
                }
                throw error;
            }
            if (probe.status === 404 || probe.status === 410) {
                failures.push({ lane: 'screenshot-404', subject: url, detail: `HEAD answered ${probe.status}` });
            } else if (!probe.ok) {
                failures.push({
                    lane: 'screenshot-probe-error',
                    subject: url,
                    detail: `HEAD answered ${probe.status ?? probe.reason}; the embed is kept and re-probed on rotation`,
                });
            }
        }
        const noteFile = path.join(
            catalogRoot,
            NOTE_CLASSES[entity.kind].directory,
            entity.kind === 'plugin' ? pluginNoteName(entity.key) : themeNoteName(entity.key),
        );
        // The note is the baseline (decision 3.11): a body is queued exactly when the note is
        // missing or a recorded input moved. Both inputs are compared, not just About — a plugin
        // whose `description` moved while its About stood still is precisely the case the skill's
        // own rule queues, and keying on About alone would drop it silently. A note that exists but
        // does not parse has no readable baseline and the renderer will refuse to touch it, so it
        // takes the lane instead of a body task nothing can land.
        const { note: existing, unparsable: unreadable } = readExisting(noteFile);
        if (unreadable) {
            failures.push({
                lane: 'note-unparsable',
                subject: `${entity.kind}:${entity.key}`,
                detail: `${path.relative(catalogRoot, noteFile)} does not parse: ${unreadable}`,
            });
            continue;
        }
        const recorded = blockValues(existing);
        if (recorded.unparsable) {
            failures.push({
                lane: 'data-block-unparsable',
                subject: `${entity.kind}:${entity.key}`,
                detail: `${path.relative(catalogRoot, noteFile)}: ${recorded.unparsable}; captured inputs replace it`,
            });
        }
        const moved = movedBodyInputs({
            kind: entity.kind,
            description: entity.row.description ?? null,
            about: about.about,
            recorded: recorded.values,
        });
        if (!existing || moved.length) {
            queue.push({
                kind: entity.kind,
                key: entity.key,
                note: path.relative(catalogRoot, noteFile),
                reason: existing ? `recorded ${moved.join(' and ')} moved` : 'note does not exist',
                inputs: {
                    description: entity.kind === 'plugin' ? entity.row.description : null,
                    about: about.about,
                    aboutStatus: about.status,
                },
                allowedLinks: [entity.url, githubUrl(entity.row.repo)],
            });
        }
    }

    // --- repository body queue ------------------------------------------------------------------
    for (const [repo, entry] of repositories) {
        const record = entry.record;
        if (!record) continue;
        captures.repositories[repo] = record;
        const noteFile = path.join(catalogRoot, NOTE_CLASSES.repository.directory, repositoryNoteName(record.numericId));
        const { note: existing, unparsable: unreadable } = readExisting(noteFile);
        if (unreadable) {
            failures.push({
                lane: 'note-unparsable',
                subject: `repository:${record.numericId}`,
                detail: `${path.relative(catalogRoot, noteFile)} does not parse: ${unreadable}`,
            });
            continue;
        }
        const recorded = blockValues(existing);
        if (recorded.unparsable) {
            failures.push({
                lane: 'data-block-unparsable',
                subject: `repository:${record.numericId}`,
                detail: `${path.relative(catalogRoot, noteFile)}: ${recorded.unparsable}; captured inputs replace it`,
            });
        }
        const values = recorded.values;
        // Baseline from the note: the contract nests the sha under `repository.readme.sha`;
        // a pre-migration note answers under the top-level `readme.sha`.
        const recordedSha = values?.get('repository.readme.sha') ?? values?.get('readme.sha') ?? null;
        const recordedDescription = values?.get('repository.description') ?? null;
        const changed =
            (record.readme?.sha ?? null) !== recordedSha ||
            (record.description ?? '') !== (recordedDescription ?? '');
        if (!existing || changed) {
            queue.push({
                kind: 'repository',
                key: String(record.numericId),
                note: path.relative(catalogRoot, noteFile),
                reason: existing ? 'recorded input moved' : 'note does not exist',
                inputs: {
                    description: record.description,
                    readmePath: record.readme?.path ?? null,
                    readmeExcerpt: record.readme?.content ? record.readme.content.slice(0, 4000) : null,
                    readmeTruncated: Boolean(record.readme?.content && record.readme.content.length > 4000),
                },
                allowedLinks: [record.url, ...(record.homepageUrl ? [record.homepageUrl] : [])],
            });
        }
    }

    costs.push({ stage: 'directory-pages', requests: pages });
    costs.push({ stage: 'screenshot-probes', requests: probes });
    costs.push({ stage: 'directory-http-total', requests: client.requests });
    writeJson(cachePath(supportRoot, 'captures.json'), {
        pin: args['release-pin'] ?? null,
        capturedAt: nowUtc(),
        pacing,
        userAgent,
        costs,
        failures,
        aborted,
        captures,
    });
    writeJson(cachePath(supportRoot, 'queue.json'), { pin: args['release-pin'] ?? null, tasks: queue });

    lines.push(
        `captured ${repositories.size} repositories, ${pages} Directory pages, ${probes} screenshot probes; ` +
            `${queue.length} body tasks queued; ${failures.length} failure lanes`,
    );
    for (const line of lines) process.stdout.write(`${line}\n`);
    for (const failure of failures) process.stdout.write(`  lane ${failure.lane}: ${failure.subject} — ${failure.detail}\n`);
    for (const cost of costs) process.stdout.write(`${describeCost(cost)}\n`);
    if (aborted) {
        process.stderr.write(`${aborted}\n`);
        process.exitCode = EXIT.refused;
        return;
    }
    process.exitCode = failures.length ? EXIT.findings : EXIT.clean;
}

/** How many lines two runs share, in order. Bounded, because a wholly rewritten note is quadratic. */
function commonLines(left, right) {
    if (left.length * right.length > 250000) return 0;
    let previous = new Array(right.length + 1).fill(0);
    for (let index = 0; index < left.length; index += 1) {
        const current = new Array(right.length + 1).fill(0);
        for (let other = 0; other < right.length; other += 1) {
            current[other + 1] =
                left[index] === right[other] ? previous[other] + 1 : Math.max(current[other], previous[other + 1]);
        }
        previous = current;
    }
    return previous[right.length];
}

/**
 * The shape of one edit, for the dry-run histogram. Equal-length notes are compared positionally,
 * which is exact for the scalar edits nearly every landing is made of; a length change is measured
 * over the region that differs once the common head and tail are trimmed. It is a summary, not a
 * diff — its job is to make an unexpected blast radius visible in one line rather than in a
 * several-hundred-megabyte working-tree diff.
 */
function diffShape(before, after) {
    const left = before.split('\n');
    const right = after.split('\n');
    if (left.length === right.length) {
        let changed = 0;
        for (let index = 0; index < left.length; index += 1) if (left[index] !== right[index]) changed += 1;
        return `changed ${changed}`;
    }
    let head = 0;
    while (head < left.length && head < right.length && left[head] === right[head]) head += 1;
    let tail = 0;
    while (
        tail < left.length - head &&
        tail < right.length - head &&
        left[left.length - 1 - tail] === right[right.length - 1 - tail]
    ) {
        tail += 1;
    }
    const midLeft = left.slice(head, left.length - tail);
    const midRight = right.slice(head, right.length - tail);
    const shared = commonLines(midLeft, midRight);
    let removed = midLeft.length - shared;
    let added = midRight.length - shared;
    const changed = Math.min(removed, added);
    removed -= changed;
    added -= changed;
    const parts = [`changed ${changed}`];
    if (added) parts.push(`+${added}`);
    if (removed) parts.push(`-${removed}`);
    return parts.join(' ');
}

/**
 * The dry-run histogram's rows, in a fixed order so a zero is printed rather than absent: the
 * claim worth reading is that `not reproducible at base pin` is zero, and a row that only appears
 * when it is non-zero cannot carry it.
 */
const HISTOGRAM_ROWS = Object.freeze([
    'up to date (nothing moved)',
    'already at target (resumed)',
    'not reproducible at base pin',
    'note unparsable',
    'data block unparsable',
    'no note on disk',
    'excused by a standing line',
    'rejected',
    'new note',
    'captured rewrite',
    'point-edit',
]);

/** One renderer call, whichever landing produced the values it is given (decision D1). */
function renderEntity({ kind, templates, indexRow, stats, repository, body, about, existing, recognizedLinks, screenshotAvailable }) {
    return kind === 'plugin'
        ? renderPluginNote({
              template: templates.plugin,
              plugin: indexRow,
              stats,
              repository,
              body,
              about,
              existing,
              recognizedLinks,
          })
        : renderThemeNote({
              template: templates.theme,
              theme: indexRow,
              repository,
              body,
              about,
              existing,
              recognizedLinks,
              screenshotAvailable,
          });
}

/**
 * Stage 3 (decision 3.11): offline and mechanical, and the one path that writes a note.
 *
 * A point-edit is not a second renderer — everything lands through `renderPluginNote` /
 * `renderThemeNote`, so byte stability, merge discipline and `uid` write-once hold identically for
 * a captured entity and a point-edited one. What differs is only where the values come from: a
 * captured landing takes About and its body from the capture, while a note landing synthesises
 * both from the note itself, which costs no network call at all.
 *
 * Every note landing is preceded by the no-op proof, in this order (ruling 9a):
 *
 * 1. the target-pin render already equals the file — the item is done; write nothing;
 * 2. else the base-pin render equals the file — the note is exactly what the machine last wrote,
 *    so writing the target-pin render is safe;
 * 3. else refuse the item, leave the file untouched, and record `render/not-reproducible`.
 *
 * The order is load-bearing: with `Sync` deliberately carrying no per-item state, a resumed run
 * would otherwise refuse every note it had just written. The first arm splits further — a note
 * whose base and target renders are equal was never out of date, while one whose renders differ
 * and already carries the target bytes was landed by an earlier pass.
 */
async function stageRender(args) {
    requireRoots(args, ['release-mirror-root', 'templates-root', 'catalog-root', 'support-root', 'release-pin', 'bodies']);
    const material = verifyRoot(args['release-mirror-root'], PRIMARY.flag);
    if (!material) return;
    const catalogRoot = args['catalog-root'];
    const supportRoot = args['support-root'];
    const indexes = loadIndexes(material.root);
    const templates = loadTemplates(args['templates-root']);
    const captures = readJson(cachePath(supportRoot, 'captures.json'), {
        failures: [],
        captures: { repositories: {}, entities: {} },
    });
    const bodies = readJson(args.bodies);
    const dryRun = Boolean(args['dry-run']);
    const limit = args.limit === undefined ? null : Number(args.limit);
    if (limit !== null && (!Number.isInteger(limit) || limit < 0)) throw new Error('--limit takes a non-negative integer');
    // §4.4: the machine recognises as its own every member it would have written at the Sync State
    // pin, so a relocation replaces its repository link instead of stacking a new one beside a
    // stale one that resolves just as well. Recomputing it needs the base-pin row; a run with no
    // base index injected is a first backfill, where every note is new and nothing is superseded.
    const baseIndexes = args['base-index-root'] ? loadIndexes(args['base-index-root']) : null;
    const basePluginsById = new Map((baseIndexes?.plugins ?? []).map(row => [row.id, row]));
    const baseThemesBySlug = new Map((baseIndexes?.themes ?? []).map(row => [themeSlug(row.name), row]));

    const written = [];
    const rejected = [];
    const pending = [];
    // The `note-unparsable` lane: a note that exists and does not parse is left byte-identical and
    // its entity is skipped, because re-rendering it from scratch would drop `remind me` and every
    // human `related to` member. One malformed note never aborts a several-thousand-note run; it is
    // carried out as a per-entity lane and repaired by hand.
    const unparsable = [];
    const refused = [];
    // Typed keys of the entities this render landed or classified, for the state-file ticks:
    // `repo` keys are case-insensitive (GitHub canonicalises case), plugin/theme keys are exact.
    const landed = new Set();
    // One entry per bodyless subject, carrying every typed key a line may already name it by. A
    // repository is known by its captured `nameWithOwner` and by the index string that reached it,
    // and appending a line under each would put two lines on one subject.
    const bodyless = new Map();
    const failures = [...(captures.failures ?? [])];
    const lines = [];
    // A mechanical capture wave lands the pin-derived bytes and leaves the prose to a later body
    // pass. The flag is explicit, and every note it lets through without a body is listed on
    // stdout as pending; until that pass lands, the gate reports each such note as
    // `catalog/block-order` — the absence stays loud rather than papered over.
    const allowEmpty = Boolean(args['allow-empty-bodies']);

    // --- the landing list: captured entities and offline point-edits, one path for both -----------
    const state = args['state-file'] ? loadState(args['state-file']) : null;
    const worklistMode = Boolean(state?.ok && state.targetPin);
    const covered = new Set();
    // Subjects a standing `[>]`/`[-]` line already accounts for. It is not the same set: a
    // rename-suspect's added half is queued for the owner and legitimately has no note, while a
    // `bodyless-no-input` entity is live and still owes its point-edit — so the line excuses a
    // *missing* note and nothing else.
    const excused = new Set();
    if (worklistMode) {
        if (!baseIndexes) return refuse('--base-index-root is required to land a worklist: the no-op proof renders at the base pin');
        if (state.targetPin !== args['release-pin']) {
            return refuse(`the state file is processing ${state.targetPin}, not ${args['release-pin']}`);
        }
        const classification = classify({ base: baseIndexes, target: indexes });
        const verdict = reconcile(state, writableItems(classification.items), { sections: ['Dump'] });
        if (!verdict.ok) {
            const named = [
                ...verdict.missing.map(entry => `missing ${entry.section} ${entry.type} ${entry.id}`),
                ...verdict.excess.map(entry => `excess ${entry.section} ${entry.type} ${entry.id}`),
                ...verdict.mislabelled.map(entry => `mislabelled ${entry.type} ${entry.id}`),
            ];
            return refuse(`the state file no longer describes this pin pair: ${named.join(', ')}`);
        }
        // `Sync` membership is derived from the notes, never from the pin diff: a live note is a
        // landing when its target-pin render differs from the file on disk and no `Dump` or `Drop`
        // item already covers it. That is what makes resume and `--limit` correct with no per-item
        // bookkeeping, and what lets a note an earlier run skipped still be recovered afterwards.
        for (const name of SECTIONS) {
            for (const item of state.sections[name] ?? []) {
                if (name !== 'Sync') covered.add(subjectKey(item));
                if (item.marker === MARKERS.retry || item.marker === MARKERS.failed) excused.add(subjectKey(item));
            }
        }
    } else if (args['state-file']) {
        process.stderr.write(`state file: ${state.reason} — landing captures only\n`);
    }

    const landings = [];
    for (const [repo, record] of Object.entries(captures.captures.repositories)) {
        landings.push({ kind: 'repository', key: String(record.numericId), repo, record, source: 'capture' });
    }
    for (const [key, capture] of Object.entries(captures.captures.entities)) {
        const [kind, identifier] = [key.slice(0, key.indexOf(':')), key.slice(key.indexOf(':') + 1)];
        const indexRow =
            kind === 'plugin'
                ? indexes.plugins.find(plugin => plugin.id === identifier)
                : indexes.themes.find(theme => themeSlug(theme.name) === identifier);
        if (!indexRow) {
            failures.push({ lane: 'not-in-index', subject: key, detail: 'captured entity is not in the index at this pin' });
            continue;
        }
        landings.push({ kind, key: identifier, indexRow, capture, source: 'capture' });
    }
    const captured = new Set(landings.filter(entry => entry.kind !== 'repository').map(entry => `${entry.kind}|${entry.key}`));
    let uncaptured = 0;
    if (worklistMode) {
        const candidates = [
            ...indexes.plugins.map(indexRow => ({ kind: 'plugin', key: indexRow.id, indexRow })),
            ...indexes.themes.map(indexRow => ({ kind: 'theme', key: themeSlug(indexRow.name), indexRow })),
        ];
        for (const candidate of candidates) {
            const key = `${candidate.kind}|${candidate.key}`;
            if (captured.has(key)) continue;
            if (covered.has(key)) {
                // A `Dump` or `Drop` line already accounts for this subject and no capture landed
                // it: the line is what carries it, and a `[ ]` one still blocks finalisation.
                uncaptured += 1;
                continue;
            }
            landings.push({ ...candidate, source: 'note' });
        }
    }
    const ORDER = ['repository', 'plugin', 'theme'];
    landings.sort((left, right) => ORDER.indexOf(left.kind) - ORDER.indexOf(right.kind) || left.key.localeCompare(right.key));
    const selected = limit === null ? landings : landings.slice(0, limit);

    // The histogram: every landing falls into exactly one row, the rows are fixed so a zero is
    // printed rather than absent, and the total is checked against the landing count — "accounted
    // for" is a number a reader can verify, not a claim.
    const tally = new Map(HISTOGRAM_ROWS.map(name => [name, 0]));
    const count = name => tally.set(name, tally.get(name) + 1);
    const shapes = new Map();

    // Repository notes first: plugin and theme links point at them, and the sort order guarantees
    // a `--limit` prefix never reaches an entity before its repository.
    for (const landing of selected.filter(entry => entry.kind === 'repository')) {
        const { repo, record } = landing;
        const file = path.join(catalogRoot, NOTE_CLASSES.repository.directory, repositoryNoteName(record.numericId));
        const { text: current, note: existing, unparsable: unreadable } = readExisting(file);
        if (unreadable) {
            unparsable.push({
                subject: `repository:${record.numericId}`,
                detail: `${path.relative(catalogRoot, file)} does not parse: ${unreadable}`,
            });
            count('note unparsable');
            continue;
        }
        const body = bodies[`repository:${record.numericId}`] ?? existing?.body ?? null;
        if (!body && !allowEmpty) {
            rejected.push({ subject: `repository:${record.numericId}`, problems: ['no staged body'] });
            count('rejected');
            continue;
        }
        const repositoryInputs = [record.description, record.readme?.content ?? ''];
        if (body) {
            const check = validateBody(body, {
                inputs: repositoryInputs,
                allowedLinks: [record.url, ...(record.homepageUrl ? [record.homepageUrl] : [])],
            });
            if (!check.ok) {
                rejected.push({ subject: `repository:${record.numericId}`, problems: check.problems });
                count('rejected');
                continue;
            }
        } else if (hasNoUsableInput(repositoryInputs)) {
            // `bodyless-no-input`: the recorded inputs cannot ground any body, so the note keeps
            // an empty one rather than an invention, and the exception line records which README
            // was judged ungroundable — a changed sha re-opens it.
            bodyless.set(subjectKey('repo', record.fullName), {
                type: 'repo',
                id: record.fullName,
                reason: `bodyless-no-input (readme sha ${record.readme?.sha ?? 'absent'})`,
                keys: dedupe([subjectKey('repo', record.fullName), subjectKey('repo', repo)]),
            });
        } else {
            pending.push({ task: `repository:${record.numericId}`, note: path.relative(catalogRoot, file) });
        }
        const after = renderRepositoryNote({ template: templates.repository, repository: record, body: body ?? '', existing });
        landed.add(subjectKey('repo', record.fullName));
        landed.add(subjectKey('repo', repo));
        if (current === after) {
            count('already at target (resumed)');
            continue;
        }
        count(current === null ? 'new note' : 'captured rewrite');
        if (!dryRun) {
            fs.mkdirSync(path.dirname(file), { recursive: true });
            fs.writeFileSync(file, after);
        }
        written.push(path.relative(catalogRoot, file));
    }

    const notes = loadRepositoryNotes(catalogRoot);
    // Captured repository records, keyed case-insensitively: GitHub canonicalises case freely, so
    // the index string and the captured `nameWithOwner` may differ in case alone.
    const repositoryRecords = new Map(
        Object.entries(captures.captures.repositories).map(([repo, record]) => [repoKey(repo), record]),
    );
    const repositoryRecordFor = repo => repositoryRecords.get(repoKey(repo)) ?? null;
    const repositoryFor = repo => {
        const record = repositoryRecordFor(repo);
        if (record) return { numericId: record.numericId, fullName: record.fullName };
        const fromNotes = notes.byAlias.get(repoKey(repo));
        return fromNotes ?? null;
    };

    for (const landing of selected.filter(entry => entry.kind !== 'repository')) {
        const { kind, key, indexRow, source } = landing;
        const subject = `${kind}:${key}`;
        const file = path.join(
            catalogRoot,
            NOTE_CLASSES[kind].directory,
            kind === 'plugin' ? pluginNoteName(key) : themeNoteName(key),
        );
        const { text: current, note: existing, unparsable: unreadable } = readExisting(file);
        if (unreadable) {
            unparsable.push({ subject, detail: `${path.relative(catalogRoot, file)} does not parse: ${unreadable}` });
            count('note unparsable');
            continue;
        }
        const baseRow = kind === 'plugin' ? basePluginsById.get(key) : baseThemesBySlug.get(key);
        const recognizedLinks = recognizedLinksFor(baseRow ?? null, notes);
        let about = null;
        let body = null;
        let screenshotAvailable = true;
        if (source === 'capture') {
            about = landing.capture.about ?? null;
            body = bodies[subject] ?? existing?.body ?? null;
            // The "no staged body" rejection belongs to captured landings alone: a point-edit never
            // needs one, and for a note carrying a standing `bodyless-no-input` excuse the empty
            // string is the intended value rather than a missing input.
            if (!body && !allowEmpty) {
                rejected.push({ subject, problems: ['no staged body'] });
                count('rejected');
                continue;
            }
            // The grounding source set is About *or* the recorded fallback input. A theme page that
            // renders carries About in the same markup shape as a plugin page, so the fallback is the
            // repository's own recorded text and fires only when About is empty — which is exactly the
            // state existing theme bodies were written in. Without it a re-render would reject
            // bodies that were grounded correctly under the skill's own fallback rule.
            const repositoryRecord = repositoryRecordFor(indexRow.repo);
            const aboutEmpty = !about || String(about).trim() === '';
            const groundingInputs = [
                kind === 'plugin' ? indexRow.description : null,
                about,
                ...(aboutEmpty ? [repositoryRecord?.description ?? null, repositoryRecord?.readme?.content ?? null] : []),
            ];
            if (body) {
                const check = validateBody(body, { inputs: groundingInputs, allowedLinks: [landing.capture.url, githubUrl(indexRow.repo)] });
                if (!check.ok) {
                    rejected.push({ subject, problems: check.problems });
                    count('rejected');
                    continue;
                }
            } else if (hasNoUsableInput(groundingInputs)) {
                bodyless.set(subjectKey(kind, key), { type: kind, id: key, reason: 'bodyless-no-input', keys: [subjectKey(kind, key)] });
            } else {
                pending.push({ task: subject, note: path.relative(catalogRoot, file) });
            }
            screenshotAvailable = !failures.some(
                failure => failure.lane === 'screenshot-404' && failure.subject === screenshotUrl(indexRow.repo, indexRow.screenshot),
            );
        } else {
            // D2, made concrete: the data block is a function of the index row, the pinned stats
            // record and one captured string — and that string is already recorded verbatim in the
            // note's own block. The body is the note's body, the repository comes from the offline
            // alias lookup, and the embed is whatever the note already carries. Zero network.
            if (!existing) {
                if (excused.has(subjectKey(kind, key))) {
                    count('excused by a standing line');
                    continue;
                }
                failures.push({ lane: 'note-missing', subject, detail: `${path.relative(catalogRoot, file)} does not exist` });
                count('no note on disk');
                continue;
            }
            const recorded = blockValues(existing);
            if (recorded.unparsable) {
                failures.push({ lane: 'data-block-unparsable', subject, detail: `${path.relative(catalogRoot, file)}: ${recorded.unparsable}` });
                count('data block unparsable');
                continue;
            }
            about = recorded.values?.get(`${kind}.about`) ?? null;
            // A body-less theme note parses with its embed in the body position; taking that as the
            // body would write the embed twice.
            body = bodyMissing(existing) ? '' : existing.body;
            screenshotAvailable = carriesEmbed(existing);
        }
        const after = renderEntity({
            kind,
            templates,
            indexRow,
            stats: indexes.stats,
            repository: repositoryFor(indexRow.repo),
            body: body ?? '',
            about,
            existing,
            recognizedLinks,
            screenshotAvailable,
        });
        if (source === 'note') {
            if (!baseRow) {
                refused.push({ subject, detail: 'no row at the base pin, so the note has no reproducible baseline' });
                count('not reproducible at base pin');
                continue;
            }
            const before = renderEntity({
                kind,
                templates,
                indexRow: baseRow,
                stats: baseIndexes.stats,
                repository: repositoryFor(baseRow.repo),
                body: body ?? '',
                about,
                existing,
                recognizedLinks,
                screenshotAvailable,
            });
            if (current === after) {
                count(before === after ? 'up to date (nothing moved)' : 'already at target (resumed)');
                landed.add(subjectKey(kind, key));
                continue;
            }
            if (current !== before) {
                refused.push({ subject, detail: `${path.relative(catalogRoot, file)} is not what the base pin renders` });
                count('not reproducible at base pin');
                continue;
            }
        } else if (current === after) {
            count('already at target (resumed)');
            landed.add(subjectKey(kind, key));
            continue;
        }
        count(current === null ? 'new note' : source === 'capture' ? 'captured rewrite' : 'point-edit');
        if (source === 'note') {
            const shape = diffShape(current, after);
            shapes.set(shape, (shapes.get(shape) ?? 0) + 1);
        }
        if (!dryRun) {
            fs.mkdirSync(path.dirname(file), { recursive: true });
            fs.writeFileSync(file, after);
        }
        written.push(path.relative(catalogRoot, file));
        landed.add(subjectKey(kind, key));
    }

    // --- tick the live state file (decision 3.11) -----------------------------------------------
    // The renderer ticks what it landed and marks what it classified bodyless. A repository is
    // never enumerated in `Dump`, so a repository the renderer classifies bodyless has no line to
    // tick: it gets one appended here, because the renderer owns those exception lines and the
    // gate reads them as its excuse list. Every other subject already has its line.
    let ticked = 0;
    let appended = 0;
    if (args['state-file'] && !dryRun) {
        const live = loadState(args['state-file']);
        if (!live.ok) {
            process.stderr.write(`state file: ${live.reason} — ticks skipped\n`);
        } else {
            const byKey = new Map();
            for (const name of SECTIONS) {
                for (const item of live.sections[name] ?? []) byKey.set(subjectKey(item), item);
            }
            for (const entry of bodyless.values()) {
                const item = entry.keys.map(key => byKey.get(key)).find(Boolean);
                if (item) {
                    item.marker = MARKERS.failed;
                    item.reason = entry.reason;
                    ticked += 1;
                    continue;
                }
                live.sections.Dump.push({ marker: MARKERS.failed, type: entry.type, id: entry.id, reason: entry.reason });
                appended += 1;
            }
            const classified = new Set([...bodyless.values()].flatMap(entry => entry.keys));
            for (const [key, item] of byKey) {
                if (classified.has(key)) continue;
                if (!landed.has(key)) continue;
                if (item.marker !== MARKERS.todo && item.marker !== MARKERS.wip) continue;
                item.marker = MARKERS.done;
                ticked += 1;
            }
            fs.writeFileSync(args['state-file'], serializeState(live));
        }
    }

    const accounted = [...tally.values()].reduce((total, value) => total + value, 0);
    lines.push(
        `render${dryRun ? ' dry run' : ''}: ${landings.length} landings` +
            `${limit === null ? '' : `, ${selected.length} within --limit ${limit}`}` +
            ` (${landings.filter(entry => entry.source === 'capture').length} captured, ` +
            `${landings.filter(entry => entry.source === 'note').length} point-edits)`,
    );
    for (const [name, value] of tally) lines.push(row(name, value));
    for (const [shape, value] of [...shapes].sort((left, right) => right[1] - left[1])) lines.push(row(`  ${shape}`, value));
    lines.push(row('accounted', `${accounted}/${selected.length}`));
    if (uncaptured) lines.push(row('queued, not captured', uncaptured));
    lines.push(
        `wrote ${dryRun ? 0 : written.length} notes (${pending.length} awaiting a body); ` +
            `${ticked} state items ticked, ${appended} exception lines appended; ` +
            `${failures.length + rejected.length + unparsable.length + refused.length} findings`,
    );
    for (const line of lines) process.stdout.write(`${line}\n`);
    for (const item of pending) process.stdout.write(`  pending ${item.task} — ${item.note}\n`);
    for (const item of rejected) process.stdout.write(`  rejected ${item.subject}: ${item.problems.join('; ')}\n`);
    for (const item of unparsable) process.stdout.write(`  lane note-unparsable: ${item.subject} — ${item.detail}\n`);
    for (const item of refused) process.stdout.write(`  lane render/not-reproducible: ${item.subject} — ${item.detail}\n`);
    // Every lane the capture carried over is printed and reaches the exit status: a
    // `screenshot-404`, a `github-missing` or a rejected body nobody prints is indistinguishable
    // from a clean run, and this run's correctness depends on the difference being visible.
    for (const failure of failures) process.stdout.write(`  lane ${failure.lane}: ${failure.subject} — ${failure.detail ?? ''}\n`);
    const clean = rejected.length === 0 && unparsable.length === 0 && refused.length === 0 && failures.length === 0;
    process.exitCode = clean ? EXIT.clean : EXIT.findings;
}

/**
 * Stage 4 (decision 3.3): the archive, and the only destructive stage in the run.
 *
 * It is all-or-nothing on purpose — a partial archive is the one failure mode that is expensive to
 * undo — so the whole plan reconciles before a byte moves, and a single refusal leaves every note
 * where it was. What moves is the `Drop` set the worklist recorded, unioned with what capture
 * confirmed terminal, minus the repositories a live target-pin entity still claims.
 *
 * Two things about that shape are deliberate. The recorded `Drop` set is the authority rather than
 * a closure recomputed here: render has created notes and re-pointed links by now, so the tree is
 * no longer the baseline the closure was computed over. And the final reduction happens here rather
 * than in the worklist because it needs resolved numeric ids — a repository renamed upstream after
 * the base pin is on no alias list, and only its immutable id reveals that a live entity claims it.
 * Every sparing is printed and recorded; a run that silently declines to do something it wrote down
 * would be worse than one that fails.
 */
function stageArchive(args) {
    requireRoots(args, [
        'release-mirror-root',
        'base-index-root',
        'catalog-root',
        'archive-root',
        'support-root',
        'state-file',
        'release-pin',
    ]);
    const material = verifyRoot(args['release-mirror-root'], PRIMARY.flag);
    if (!material) return;
    const baseMaterial = verifyRoot(args['base-index-root'], 'base-index-root');
    if (!baseMaterial) return;
    const catalogRoot = args['catalog-root'];
    const archiveRoot = args['archive-root'];
    // The archive is durable, versioned catalog state, so the run is given it rather than inferring
    // it: a mistyped root would otherwise scatter a component into a directory nobody reviews.
    if (!isDirectory(archiveRoot)) return refuse(`--archive-root ${archiveRoot} is not a directory; create it before archiving`);
    const state = loadState(args['state-file']);
    if (!state.ok) {
        process.stderr.write(`state file: ${state.reason}\n`);
        process.exitCode = state.absent ? EXIT.missingMaterial : EXIT.usage;
        return;
    }
    if (!state.targetPin) return refuse('the state file carries no `target pin`; open the run with --stage worklist first');
    if (state.targetPin !== args['release-pin']) {
        return refuse(`the state file is processing ${state.targetPin}, not ${args['release-pin']}`);
    }
    const duplicates = duplicateSubjects(state);
    if (duplicates.length) {
        const named = duplicates.map(entry => `${entry.type} ${entry.id} (${entry.sections.join(' and ')})`);
        return refuse(`one line per subject is required; these carry more: ${named.join(', ')}`);
    }

    const target = loadIndexes(material.root);
    const classification = classify({ base: loadIndexes(baseMaterial.root), target });
    const removed = new Set(
        classification.items.filter(entry => entry.class === CLASSES.removed).map(entry => `${entry.type}:${entry.id}`),
    );
    const rows = rowsAtPin(target, themeSlug);
    const graph = { entities: loadEntityNotes(catalogRoot), repositories: loadRepositoryNotes(catalogRoot) };
    const archived = { entities: loadEntityNotes(archiveRoot), repositories: loadRepositoryNotes(archiveRoot) };
    const captures = readJson(cachePath(args['support-root'], 'captures.json'), {
        failures: [],
        captures: { repositories: {}, entities: {} },
    });
    const confirmed = confirmedArchivals({
        failures: captures.failures ?? [],
        standing: exceptions(state),
        rows,
    });
    // A `Drop` line is not automatically a move. A `[>]`/`[-]` line there is a standing exception —
    // a rename-suspect's removed half is written into `Drop` precisely so a human can see it, and
    // ruling 7 says it is executed by nobody — so only the work markers reach the plan. A subject
    // that must archive and stands failed instead is not silently skipped: the reconciliation below
    // reports it as a missing move.
    const parked = (state.sections.Drop ?? []).filter(item => item.marker === MARKERS.retry || item.marker === MARKERS.failed);
    const recorded = (state.sections.Drop ?? []).filter(item => !parked.includes(item));
    const leaving = new Set([
        ...recorded.filter(item => item.type !== 'repo').map(item => `${item.type}:${item.id}`),
        ...confirmed.entities.keys(),
    ]);
    const captured = new Map(
        Object.entries(captures.captures?.repositories ?? {}).map(([repo, record]) => [repoKey(repo), record]),
    );
    const claims = claimsAtTarget({ rows, graph, captured, archived: leaving });
    // The same question asked of every row, including the ones leaving: what the worklist's offline
    // reduction already spared, and therefore what an archived note may still link to.
    const resolvable = claimsAtTarget({ rows, graph, captured });
    const plan = planArchive({
        recorded,
        confirmed,
        rows,
        graph,
        archived,
        claims,
        resolvable,
        removed,
        catalogRoot,
        archiveRoot,
    });

    const classOf = type => plan.moves.filter(move => move.type === type).length;
    const lines = [
        `archive ${state.run}: base ${state.basePin} → target ${state.targetPin}`,
        row('recorded Drop items', recorded.length),
        row('standing in Drop', parked.length),
        row('confirmed at capture', confirmed.entities.size + confirmed.repositories.size),
        row('spared by the reduction', plan.spared.length),
        row('already archived', plan.already.length),
        `${row('moves', plan.moves.length)}  (${classOf('plugin')} plugins, ${classOf('theme')} themes, ${classOf('repo')} repositories)`,
    ];
    for (const entry of plan.spared) {
        lines.push(
            `  spared ${entry.type} ${entry.id} (${entry.numericId}): claimed at the target pin by ` +
                `${entry.claim.by.replace(':', ' ')} via ${entry.claim.repo} (${entry.claim.source})`,
        );
    }
    for (const [key, evidence] of confirmed.entities) lines.push(`  confirmed ${key.replace(':', ' ')}: ${evidence.reason}`);
    for (const [numericId, evidence] of confirmed.repositories) lines.push(`  confirmed repo ${numericId}: ${evidence.reason}`);
    for (const move of plan.moves) {
        lines.push(`  move ${move.type} ${move.id}: ${path.relative(catalogRoot, move.from)} → ${path.relative(archiveRoot, move.to)}`);
    }
    for (const entry of plan.already) {
        lines.push(`  already ${entry.type} ${entry.id}: ${path.relative(archiveRoot, entry.to)}`);
    }
    for (const line of lines) process.stdout.write(`${line}\n`);
    if (!plan.ok) {
        for (const refusal of plan.refusals) process.stderr.write(`  ${refusal.kind}: ${refusal.subject} — ${refusal.detail}\n`);
        process.stderr.write(`${plan.refusals.length} refusals; nothing was moved\n`);
        process.exitCode = EXIT.refused;
        return;
    }
    if (args['dry-run']) {
        process.stdout.write('  dry run: nothing moved, nothing written\n');
        process.exitCode = EXIT.clean;
        return;
    }
    // A rename inside one filesystem is atomic and cannot rewrite content. Across filesystems there
    // is no rename at all, only a copy and a delete — which is a second set of bytes and the one
    // thing an archive move may never become — so the devices are compared before anything moves.
    if (plan.moves.length && fs.statSync(catalogRoot).dev !== fs.statSync(archiveRoot).dev) {
        return refuse(`${catalogRoot} and ${archiveRoot} are on different filesystems; an archive move is a rename, never a copy`);
    }

    const executed = executeArchive(plan.moves);
    const moved = [...executed.done, ...hashArchived(plan.already)];
    // The receipt is what the archive is verified against afterwards, so the manifest is written
    // even when a move failed: the notes that did move are already in their new home.
    writeJson(cachePath(args['support-root'], 'archive.json'), {
        run: state.run,
        basePin: state.basePin,
        targetPin: state.targetPin,
        archivedAt: nowUtc(),
        moves: moved.map(entry => ({
            type: entry.type,
            id: entry.id,
            from: path.relative(catalogRoot, entry.from ?? entry.to),
            to: path.relative(archiveRoot, entry.to),
            sha256: entry.sha256,
        })),
        spared: plan.spared.map(entry => ({
            type: entry.type,
            id: entry.id,
            numericId: entry.numericId,
            claimedBy: entry.claim.by,
            via: entry.claim.repo,
            source: entry.claim.source,
        })),
    });
    if (executed.failed) {
        process.stderr.write(`  ${executed.failed.move.type} ${executed.failed.move.id}: ${executed.failed.detail}\n`);
        process.stderr.write(`${executed.done.length} of ${plan.moves.length} moves completed before the failure\n`);
        process.exitCode = EXIT.refused;
        return;
    }
    const applied = applyArchiveToState(state, { moved, spared: plan.spared, rows });
    fs.writeFileSync(args['state-file'], serializeState(applied.state));
    for (const line of applied.standing) {
        process.stdout.write(`  standing [${line.marker}] ${line.type} ${line.id} — ${line.reason}\n`);
    }
    process.stdout.write(
        `moved ${executed.done.length} notes (${plan.already.length} already archived); ` +
            `${applied.ticked.length} items retired, ${applied.standing.length} standing, ` +
            `${applied.appended.length} lines appended\n`,
    );
    process.exitCode = EXIT.clean;
}

/**
 * Finalisation (decision 3.11), idempotent and ordered: the caller runs the offline gate first and
 * passes its result; this stage refuses while any worklist item is non-terminal or an exception
 * lacks a reason, writes the compact receipt with exclusive-create semantics, then resets the live
 * file — `base pin` := `target pin`, `[x]` items dropped, `[>]`/`[-]` lines kept in place.
 *
 * The two writes are ordered, so a crash lands between them: the receipt exists and Sync State has
 * not advanced. Exclusive create still refuses to finalise two *different* runs under one label,
 * but a receipt recording this run — same label, same pin pair — means only the reset is left, and
 * re-running finalize performs it. A receipt describing anything else is a refusal (exit 5).
 */
function stageFinalize(args) {
    requireRoots(args, ['state-file']);
    const state = loadState(args['state-file']);
    if (!state.ok) {
        process.stderr.write(`state file: ${state.reason}\n`);
        process.exitCode = state.absent ? EXIT.missingMaterial : EXIT.usage;
        return;
    }
    if (!state.targetPin) {
        process.stderr.write('no target pin in the state file — nothing to finalise\n');
        process.exitCode = EXIT.refused;
        return;
    }
    const blocking = blockers(state);
    if (blocking.length) {
        for (const item of blocking) {
            process.stdout.write(`  blocker [${item.marker}] ${item.type} ${item.id} (${item.section}): ${item.problem}\n`);
        }
        process.stdout.write(`${blocking.length} blockers; the pin does not advance\n`);
        process.exitCode = EXIT.findings;
        return;
    }
    const directory = path.dirname(args['state-file']);
    // The archive step leaves its move manifest in the cache; the receipt is where those hashes
    // become durable, because they are what an archived note's unchanged bytes are checked against
    // (ruling R6). A manifest describing another run is reported and ignored, never folded in.
    const manifest = args['support-root'] ? readJson(cachePath(args['support-root'], 'archive.json'), null) : null;
    const describes = manifest && manifest.run === state.run && manifest.targetPin === state.targetPin;
    if (manifest && !describes) {
        process.stdout.write(`archive manifest for ${manifest.run} → ${manifest.targetPin} is not this run's; not recorded\n`);
    }
    const record = {
        run: state.run,
        basePin: state.basePin,
        targetPin: state.targetPin,
        startedAt: state.values['started at'] ?? null,
        finishedAt: nowUtc(),
        model: state.values.model ?? args.model ?? null,
        pacing: state.values.pacing ?? null,
        gate: args['gate-status'] ?? null,
        sections: state.sections,
        archive: describes ? manifest : null,
    };
    let receipt;
    try {
        receipt = writeReceipt(directory, record);
    } catch (error) {
        if (error.code !== 'EEXIST') throw error;
        const existing = receiptDescribes(directory, record);
        if (!existing.same) {
            process.stderr.write(
                `receipt ${existing.file} already records another run (${existing.reason}); ` +
                    'a receipt is never overwritten — finalise under a new run label\n',
            );
            process.exitCode = EXIT.refused;
            return;
        }
        receipt = existing.file;
        process.stdout.write(`receipt ${receipt} already records this run; resuming with the reset\n`);
    }
    fs.writeFileSync(args['state-file'], serializeState(resetState(state)));
    process.stdout.write(`receipt ${receipt}; base pin advanced to ${state.targetPin}\n`);
    process.exitCode = EXIT.clean;
}

async function main(argv) {
    let args;
    try {
        args = parseArgs(argv, {
            booleans: ['help', 'refresh-repositories', 'allow-empty-bodies', 'dry-run'],
            values: [
                'stage',
                'release-mirror-root',
                'base-index-root',
                'templates-root',
                'catalog-root',
                'archive-root',
                'support-root',
                'state-file',
                'release-pin',
                'run',
                'interval-ms',
                'batch-size',
                'limit',
                'user-agent',
                'bodies',
                'model',
                'pacing',
                'prompt',
                'gate-status',
            ],
            repeatable: ['plugin', 'theme'],
        });
    } catch (error) {
        writeUsageError(error, USAGE);
        return;
    }
    if (args.help || !args.stage) {
        process.stdout.write(`${USAGE}\n`);
        if (!args.help) process.exitCode = EXIT.usage;
        return;
    }
    try {
        if (args.stage === 'worklist') return stageWorklist(args);
        if (args.stage === 'capture') return await stageCapture(args);
        if (args.stage === 'render') return await stageRender(args);
        if (args.stage === 'archive') return stageArchive(args);
        if (args.stage === 'finalize') return stageFinalize(args);
        throw new Error(`unknown stage ${args.stage}`);
    } catch (error) {
        writeUsageError(error, USAGE, error.aborted ? EXIT.refused : EXIT.usage);
    }
}

await main(process.argv.slice(2));
