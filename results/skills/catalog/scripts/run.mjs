#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

import {
    EXIT,
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
import { loadTemplate, parseNote } from './note.mjs';
import { flattenDataBlock, parseDataBlock } from './datablock.mjs';
import { renderPluginNote, renderRepositoryNote, renderThemeNote } from './render.mjs';
import { DirectoryClient, pacingFrom } from './directory.mjs';
import { captureRepositories, fetchReadme, toRepositoryRecord } from './github.mjs';
import { loadRepositoryNotes } from './resolve.mjs';
import { hasNoUsableInput, validateBody } from './body.mjs';
import { MARKERS, blockers, loadState, resetState, serializeState, writeReceipt } from './state.mjs';

/**
 * The run driver under the state model (decision 3.11): no Ledger, no Run Reports.
 *
 * `capture` performs every network read and leaves its evidence and the body queue in the
 * disposable cache; `render` is offline and mechanical — it validates every body, lands notes, and
 * ticks the live state file; `finalize` checks that every worklist item is terminal, writes the
 * compact receipt beside the state file, and resets the worklists while advancing `base pin`.
 *
 * Change detection needs no store: the note's own data block is the baseline (description and
 * About are recorded verbatim, the README by blob sha), so a capture queues a body exactly when
 * the note is missing or a recorded input moved.
 *
 * Exit: 0 clean, 1 findings (failure lanes or blockers), 2 usage, 3 missing material, 5 refused.
 */

const USAGE = `usage: run.mjs --stage capture|render|finalize [options]

  --release-mirror-root DIR  checkout of ${PRIMARY.repo} (required for capture and render)
  --templates-root DIR       note templates (required for capture and render)
  --catalog-root DIR         catalog tree (required for capture and render)
  --support-root DIR         catalog support tree; scratch files land here (required for capture and render)
  --state-file FILE          the live state file; render ticks it, finalize resets it
  --release-pin SHA          the Release Pin being processed (required for render)
  --plugin ID                pilot selection, repeatable
  --theme NAME               pilot selection by index name, repeatable
  --interval-ms N            Directory pacing interval (default 1500)
  --batch-size N             GraphQL repositories per request (default 10)
  --user-agent STRING        recorded run input; required for any network stage
  --refresh-repositories     re-capture every selected repository even when it resolves offline
  --allow-empty-bodies       render a note whose body is not staged yet and record it as pending
  --bodies FILE              staged bodies for the render stage
  --model STRING             short model id recorded in the state file and receipt
  --prompt STRING            prompt identity recorded alongside
  --gate-status STRING       finalize only: the offline gate's result, recorded in the receipt
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

function readExisting(file) {
    if (!isFile(file)) return null;
    const parsed = parseNote(readText(file));
    return parsed.ok ? parsed : null;
}

/** The note's data block, flattened — the baseline every change comparison reads (decision 3.11). */
function blockValues(existing) {
    if (!existing?.data) return null;
    try {
        return flattenDataBlock(parseDataBlock(existing.data));
    } catch {
        return null;
    }
}

async function stageCapture(args) {
    requireRoots(args, ['release-mirror-root', 'templates-root', 'catalog-root', 'support-root', 'user-agent']);
    const material = verifyMaterial(args['release-mirror-root']);
    if (material.status !== IDENTITY_STATUS.verified) {
        process.stderr.write(`${material.reason}\n`);
        process.exitCode = material.status === IDENTITY_STATUS.missing ? EXIT.missingMaterial : EXIT.identityMismatch;
        return;
    }
    const indexes = loadIndexes(material.root);
    const { plugins, themes, missing } = selectEntities(indexes, args);
    if (missing.length) {
        process.stderr.write(`not in the index at this pin: ${missing.join(', ')}\n`);
        process.exitCode = EXIT.usage;
        return;
    }

    const catalogRoot = args['catalog-root'];
    const supportRoot = args['support-root'];
    const notes = loadRepositoryNotes(catalogRoot);
    const pacing = pacingFrom({ intervalMs: args['interval-ms'] ? Number(args['interval-ms']) : undefined });
    const client = new DirectoryClient({ pacing, userAgent: args['user-agent'] });

    const entities = [
        ...plugins.map(plugin => ({ kind: 'plugin', key: plugin.id, row: plugin, url: pluginUrl(plugin.id) })),
        ...themes.map(theme => ({ kind: 'theme', key: themeSlug(theme.name), row: theme, url: themeUrl(themeSlug(theme.name)) })),
    ];

    // --- repositories: batched GraphQL metadata, one REST readme call per repository ------------
    const wanted = dedupe(entities.map(entity => entity.row.repo));
    // Lookup-first by default (§6.1): a repository already in the catalog costs no network call.
    // A refresh asks for the record itself rather than for the identity — which is what a template
    // migration needs, because the data block is rendered from the record, not from the note.
    const toCapture = args['refresh-repositories']
        ? [...wanted]
        : wanted.filter(repo => !notes.byAlias.has(repoKey(repo)));
    const batchSize = Number(args['batch-size'] ?? 10);
    const repositories = new Map();
    const failures = [];
    const costs = [];
    for (let index = 0; index < toCapture.length; index += batchSize) {
        const batch = toCapture.slice(index, index + batchSize);
        const { records, rateLimit } = await captureRepositories(batch, { userAgent: args['user-agent'] });
        costs.push({ stage: 'repositories', repos: batch.length, ...(rateLimit ?? {}) });
        let readmeCalls = 0;
        for (const record of records) {
            if (!record.node) {
                failures.push({ lane: 'github-missing', subject: record.repo, detail: record.error });
                continue;
            }
            // The index string is a former full name whenever GitHub answers under another one.
            const formerNames =
                repoKey(record.node.nameWithOwner) === repoKey(record.repo) ? [] : [record.repo];
            // README discovery is server-side (decision 3.8): one REST call per
            // captured repository, addressed by the canonical name GitHub answered with. The call
            // counts against the 5,000/h REST budget, so a full-catalog refresh spans budget
            // windows; the resumable worklist makes the pause a resume, not a loss.
            let readme = null;
            try {
                readme = await fetchReadme(record.node.nameWithOwner, { userAgent: args['user-agent'] });
                readmeCalls += 1;
            } catch (error) {
                failures.push({ lane: 'readme-error', subject: record.repo, detail: error.message });
            }
            if (readme?.oversized) {
                failures.push({
                    lane: 'readme-oversized',
                    subject: record.repo,
                    detail: `README ${readme.size} bytes answers encoding "none"; skipped as a summary input`,
                });
            }
            repositories.set(record.repo, {
                record: { ...toRepositoryRecord(record.node, readme, nowUtc()), formerNames },
            });
        }
        costs.push({ stage: 'readmes-rest', repos: readmeCalls, cost: readmeCalls, nodeCount: 0 });
    }

    // --- Directory pages ------------------------------------------------------------------------
    const captures = { repositories: {}, entities: {} };
    const queue = [];
    let aborted = null;
    for (const entity of entities) {
        let about;
        try {
            about = await client.captureAbout(entity.url, entity.kind);
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
        const noteFile = path.join(
            catalogRoot,
            NOTE_CLASSES[entity.kind].directory,
            entity.kind === 'plugin' ? pluginNoteName(entity.key) : themeNoteName(entity.key),
        );
        // The note is the baseline (decision 3.11): a body is queued exactly when the note is
        // missing or the About the block records is not the About the Directory serves now.
        const existing = readExisting(noteFile);
        const recordedAbout = blockValues(existing)?.get(`${entity.kind}.about`) ?? null;
        const changed = (about.about ?? '') !== (recordedAbout ?? '');
        if (!existing || changed) {
            queue.push({
                kind: entity.kind,
                key: entity.key,
                note: path.relative(catalogRoot, noteFile),
                reason: existing ? 'recorded About moved' : 'note does not exist',
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
        const existing = readExisting(noteFile);
        const values = blockValues(existing);
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

    writeJson(cachePath(supportRoot, 'captures.json'), {
        pin: args['release-pin'] ?? null,
        capturedAt: nowUtc(),
        pacing,
        userAgent: args['user-agent'],
        costs,
        failures,
        aborted,
        captures,
    });
    writeJson(cachePath(supportRoot, 'queue.json'), { pin: args['release-pin'] ?? null, tasks: queue });

    process.stdout.write(
        `captured ${repositories.size} repositories, ${entities.length} Directory pages; ` +
            `${queue.length} body tasks queued; ${failures.length} failure lanes\n`,
    );
    for (const failure of failures) process.stdout.write(`  lane ${failure.lane}: ${failure.subject} — ${failure.detail}\n`);
    for (const cost of costs) process.stdout.write(`  cost ${cost.stage}: ${cost.repos} repos, ${cost.cost} points, nodeCount ${cost.nodeCount}\n`);
    if (aborted) {
        process.stderr.write(`${aborted}\n`);
        process.exitCode = EXIT.refused;
        return;
    }
    process.exitCode = failures.length ? EXIT.findings : EXIT.clean;
}

async function stageRender(args) {
    requireRoots(args, ['release-mirror-root', 'templates-root', 'catalog-root', 'support-root', 'release-pin', 'bodies']);
    const material = verifyMaterial(args['release-mirror-root']);
    if (material.status !== IDENTITY_STATUS.verified) {
        process.stderr.write(`${material.reason}\n`);
        process.exitCode = EXIT.missingMaterial;
        return;
    }
    const catalogRoot = args['catalog-root'];
    const supportRoot = args['support-root'];
    const indexes = loadIndexes(material.root);
    const templates = loadTemplates(args['templates-root']);
    const captures = readJson(cachePath(supportRoot, 'captures.json'));
    const bodies = readJson(args.bodies);

    const written = [];
    const rejected = [];
    const pending = [];
    // Typed keys of the entities this render landed or classified, for the state-file ticks:
    // `repo` keys are case-insensitive (GitHub canonicalises case), plugin/theme keys are exact.
    const landed = new Set();
    const bodyless = new Map();
    const failures = [...(captures.failures ?? [])];
    // A mechanical capture wave lands the pin-derived bytes and leaves the prose to a later body
    // pass. The flag is explicit, and every note it lets through without a body is listed on
    // stdout as pending; until that pass lands, the gate reports each such note as
    // `catalog/block-order` — the absence stays loud rather than papered over.
    const allowEmpty = Boolean(args['allow-empty-bodies']);

    // Repository notes first: plugin and theme links point at them.
    for (const [repo, record] of Object.entries(captures.captures.repositories)) {
        const file = path.join(catalogRoot, NOTE_CLASSES.repository.directory, repositoryNoteName(record.numericId));
        const existing = readExisting(file);
        const body = bodies[`repository:${record.numericId}`] ?? existing?.body ?? null;
        if (!body && !allowEmpty) {
            rejected.push({ subject: `repository:${record.numericId}`, problems: ['no staged body'] });
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
                continue;
            }
        } else if (hasNoUsableInput(repositoryInputs)) {
            // `bodyless-no-input`: the recorded inputs cannot ground any body, so the note keeps
            // an empty one rather than an invention, and the exception line records which README
            // was judged ungroundable — a changed sha re-opens it.
            bodyless.set(
                `repo|${repoKey(record.fullName)}`,
                `bodyless-no-input (readme sha ${record.readme?.sha ?? 'absent'})`,
            );
            bodyless.set(`repo|${repoKey(repo)}`, `bodyless-no-input (readme sha ${record.readme?.sha ?? 'absent'})`);
        } else {
            pending.push({ task: `repository:${record.numericId}`, note: path.relative(catalogRoot, file) });
        }
        fs.mkdirSync(path.dirname(file), { recursive: true });
        fs.writeFileSync(file, renderRepositoryNote({ template: templates.repository, repository: record, body: body ?? '', existing }));
        written.push(path.relative(catalogRoot, file));
        landed.add(`repo|${repoKey(record.fullName)}`);
        landed.add(`repo|${repoKey(repo)}`);
    }

    const notes = loadRepositoryNotes(catalogRoot);
    // Captured repository records, keyed case-insensitively: GitHub canonicalises case freely, so
    // the index string and the captured `nameWithOwner` may differ in case alone.
    const repositoryRecords = new Map(
        Object.entries(captures.captures.repositories).map(([repo, record]) => [repoKey(repo), record]),
    );
    const repositoryRecordFor = repo => repositoryRecords.get(repoKey(repo)) ?? null;
    const repositoryFor = repo => {
        const record = captures.captures.repositories[repo] ?? null;
        if (record) return { numericId: record.numericId, fullName: record.fullName };
        const fromNotes = notes.byAlias.get(repoKey(repo));
        return fromNotes ?? null;
    };

    for (const [key, capture] of Object.entries(captures.captures.entities)) {
        const [kind, identifier] = [key.slice(0, key.indexOf(':')), key.slice(key.indexOf(':') + 1)];
        const row =
            kind === 'plugin'
                ? indexes.plugins.find(plugin => plugin.id === identifier)
                : indexes.themes.find(theme => themeSlug(theme.name) === identifier);
        if (!row) {
            failures.push({ lane: 'not-in-index', subject: key, detail: 'captured entity is not in the index at this pin' });
            continue;
        }
        const repository = repositoryFor(row.repo);
        const file = path.join(
            catalogRoot,
            NOTE_CLASSES[kind].directory,
            kind === 'plugin' ? pluginNoteName(identifier) : themeNoteName(identifier),
        );
        const existing = readExisting(file);
        const body = bodies[key] ?? existing?.body ?? null;
        if (!body && !allowEmpty) {
            rejected.push({ subject: key, problems: ['no staged body'] });
            continue;
        }
        // The grounding source set is About *or* the recorded fallback input. A theme page that
        // renders carries About in the same markup shape as a plugin page, so the fallback is the
        // repository's own recorded text and fires only when About is empty — which is exactly the
        // state existing theme bodies were written in. Without it a re-render would reject
        // bodies that were grounded correctly under the skill's own fallback rule.
        const repositoryRecord = repositoryRecordFor(row.repo);
        const aboutEmpty = !capture.about || String(capture.about).trim() === '';
        const groundingInputs = [
            kind === 'plugin' ? row.description : null,
            capture.about,
            ...(aboutEmpty ? [repositoryRecord?.description ?? null, repositoryRecord?.readme?.content ?? null] : []),
        ];
        if (body) {
            const check = validateBody(body, {
                inputs: groundingInputs,
                allowedLinks: [capture.url, githubUrl(row.repo)],
            });
            if (!check.ok) {
                rejected.push({ subject: key, problems: check.problems });
                continue;
            }
        } else if (hasNoUsableInput(groundingInputs)) {
            bodyless.set(`${kind}|${identifier}`, 'bodyless-no-input');
        } else {
            pending.push({ task: key, note: path.relative(catalogRoot, file) });
        }
        fs.mkdirSync(path.dirname(file), { recursive: true });
        const text =
            kind === 'plugin'
                ? renderPluginNote({
                      template: templates.plugin,
                      plugin: row,
                      stats: indexes.stats,
                      repository,
                      body: body ?? '',
                      about: capture.about ?? null,
                      existing,
                  })
                : renderThemeNote({
                      template: templates.theme,
                      theme: row,
                      repository,
                      body: body ?? '',
                      about: capture.about ?? null,
                      existing,
                      screenshotAvailable: !failures.some(
                          failure => failure.lane === 'screenshot-404' && failure.subject === screenshotUrl(row.repo, row.screenshot),
                      ),
                  });
        fs.writeFileSync(file, text);
        written.push(path.relative(catalogRoot, file));
        landed.add(`${kind}|${identifier}`);
    }

    // --- tick the live state file (decision 3.11) -----------------------------------------------
    // The renderer ticks what it landed and marks what it classified bodyless; `github-missing`
    // and other capture-side exceptions are the coordinator's lines, written by hand with their
    // reasons. The renderer is the only writer here while it runs — single-writer discipline.
    let ticked = 0;
    if (args['state-file']) {
        const state = loadState(args['state-file']);
        if (!state.ok) {
            process.stderr.write(`state file: ${state.reason} — ticks skipped\n`);
        } else {
            for (const name of Object.keys(state.sections)) {
                for (const item of state.sections[name]) {
                    const key = item.type === 'repo' ? `repo|${repoKey(item.id)}` : `${item.type}|${item.id}`;
                    if (bodyless.has(key)) {
                        item.marker = MARKERS.failed;
                        item.reason = bodyless.get(key);
                        ticked += 1;
                    } else if (landed.has(key) && (item.marker === MARKERS.todo || item.marker === MARKERS.wip)) {
                        item.marker = MARKERS.done;
                        ticked += 1;
                    }
                }
            }
            fs.writeFileSync(args['state-file'], serializeState(state));
        }
    }

    const status = rejected.length === 0 ? 'success' : 'failed';
    process.stdout.write(
        `wrote ${written.length} notes (${pending.length} awaiting a body); ` +
            `${ticked} state items ticked; ${bodyless.size ? 'bodyless classified' : 'no bodyless'} (${status})\n`,
    );
    for (const item of pending) process.stdout.write(`  pending ${item.task} — ${item.note}\n`);
    for (const item of rejected) process.stdout.write(`  rejected ${item.subject}: ${item.problems.join('; ')}\n`);
    process.exitCode = status === 'success' ? EXIT.clean : EXIT.findings;
}

/**
 * Finalisation (decision 3.11), idempotent and ordered: the caller runs the offline gate first and
 * passes its result; this stage refuses while any worklist item is non-terminal or an exception
 * lacks a reason, writes the compact receipt with exclusive-create semantics, then resets the live
 * file — `base pin` := `target pin`, `[x]` items dropped, `[>]`/`[-]` lines kept in place.
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
    const receipt = writeReceipt(path.dirname(args['state-file']), {
        run: state.run,
        basePin: state.basePin,
        targetPin: state.targetPin,
        startedAt: state.values['started at'] ?? null,
        finishedAt: nowUtc(),
        model: state.values.model ?? args.model ?? null,
        pacing: state.values.pacing ?? null,
        gate: args['gate-status'] ?? null,
        sections: state.sections,
    });
    fs.writeFileSync(args['state-file'], serializeState(resetState(state)));
    process.stdout.write(`receipt ${receipt}; base pin advanced to ${state.targetPin}\n`);
    process.exitCode = EXIT.clean;
}

async function main(argv) {
    let args;
    try {
        args = parseArgs(argv, {
            booleans: ['help', 'refresh-repositories', 'allow-empty-bodies'],
            values: [
                'stage',
                'release-mirror-root',
                'templates-root',
                'catalog-root',
                'support-root',
                'state-file',
                'release-pin',
                'interval-ms',
                'batch-size',
                'user-agent',
                'bodies',
                'model',
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
        if (args.stage === 'capture') return await stageCapture(args);
        if (args.stage === 'render') return await stageRender(args);
        if (args.stage === 'finalize') return stageFinalize(args);
        throw new Error(`unknown stage ${args.stage}`);
    } catch (error) {
        writeUsageError(error, USAGE, error.aborted ? EXIT.refused : EXIT.usage);
    }
}

await main(process.argv.slice(2));
