#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

import {
    EXIT,
    isFile,
    listFiles,
    nowUtc,
    parseArgs,
    readJson,
    readText,
    sha256,
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
    repositoryLink,
    repositoryNoteName,
    screenshotUrl,
    themeNoteName,
    themeSlug,
    themeUrl,
} from './model.mjs';
import { loadTemplate, parseNote } from './note.mjs';
import { renderPluginNote, renderRepositoryNote, renderThemeNote } from './render.mjs';
import { DirectoryClient, pacingFrom } from './directory.mjs';
import { captureReadmes, captureRepositories, preferredReadmePath, toRepositoryRecord } from './github.mjs';
import { baseline, checkpoint, loadLedger, recordCapture, recordRepository, saveLedger } from './ledger.mjs';
import { loadRepositoryNotes } from './resolve.mjs';
import { hasNoUsableInput, validateBody } from './body.mjs';
import { FENCES, fence, latestSuccessfulRun, parametersSection, parseFences, recomputeFences, writeRunReport } from './run-report.mjs';

/**
 * The run driver: capture, render, and the re-baseline pass.
 *
 * Stages are separate commands on purpose. `capture` performs every network read and leaves the
 * evidence and the body queue in the disposable cache; `render` is offline and mechanical and lands
 * notes plus the Run Report; `rebaseline` proves the Ledger-loss recovery semantics of §7.3 without
 * touching a single pin-derived byte. Nothing writes outside the catalog root, the cache and the
 * runs root.
 *
 * Exit: 0 clean, 1 findings (failure lanes recorded), 2 usage, 3 missing material, 5 refused.
 */

const USAGE = `usage: run.mjs --stage capture|render|rebaseline [options]

  --release-mirror-root DIR  checkout of ${PRIMARY.repo} (required)
  --templates-root DIR       note templates (required)
  --catalog-root DIR         catalog tree (required)
  --runs-root DIR            Run Report directory (required for render and rebaseline)
  --release-pin SHA          the Release Pin being processed (required for render)
  --plugin ID                pilot selection, repeatable
  --theme NAME               pilot selection by index name, repeatable
  --interval-ms N            Directory pacing interval (default 1500)
  --batch-size N             GraphQL repositories per request (default 10)
  --user-agent STRING        recorded run input; required for any network stage
  --refresh-repositories     re-capture every selected repository even when it resolves offline
  --allow-empty-bodies       render a note whose body is not staged yet and record it as pending
  --bodies FILE              staged bodies for the render stage
  --model STRING             short model id recorded in the Run Report frontmatter
  --prompt STRING            prompt identity recorded in the Run Report Parameters section
  --kind STRING              run kind recorded in the Run Report (default backfill-pilot)
  --help`;

const CACHE = '.catalog';

function cachePath(catalogRoot, name) {
    return path.join(catalogRoot, CACHE, name);
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

async function stageCapture(args) {
    requireRoots(args, ['release-mirror-root', 'templates-root', 'catalog-root', 'user-agent']);
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
    const { ledger } = loadLedger(catalogRoot, args['release-pin'] ?? null);
    const notes = loadRepositoryNotes(catalogRoot);
    const pacing = pacingFrom({ intervalMs: args['interval-ms'] ? Number(args['interval-ms']) : undefined });
    const client = new DirectoryClient({ pacing, userAgent: args['user-agent'] });

    const entities = [
        ...plugins.map(plugin => ({ kind: 'plugin', key: plugin.id, row: plugin, url: pluginUrl(plugin.id) })),
        ...themes.map(theme => ({ kind: 'theme', key: themeSlug(theme.name), row: theme, url: themeUrl(themeSlug(theme.name)) })),
    ];

    // --- repositories, batched GraphQL ---------------------------------------------------------
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
        const readmeRequests = [];
        for (const record of records) {
            if (!record.node) {
                failures.push({ lane: 'github-missing', subject: record.repo, detail: record.error });
                continue;
            }
            const trees = {
                root: record.node.root?.entries ?? [],
                dotgithub: record.node.dotgithub?.entries ?? [],
                docs: record.node.docs?.entries ?? [],
            };
            const readmePath = preferredReadmePath(trees);
            if (readmePath) readmeRequests.push({ repo: record.repo, path: readmePath });
            // The index string is a former full name whenever GitHub answers under another one.
            const formerNames =
                repoKey(record.node.nameWithOwner) === repoKey(record.repo) ? [] : [record.repo];
            repositories.set(record.repo, { node: record.node, readmePath, formerNames });
        }
        const { blobs, rateLimit: readmeLimit } = await captureReadmes(readmeRequests, { userAgent: args['user-agent'] });
        if (readmeLimit) costs.push({ stage: 'readmes', repos: readmeRequests.length, ...readmeLimit });
        for (const [repo, entry] of repositories) {
            if (!blobs.has(repo) || entry.record) continue;
            entry.record = { ...toRepositoryRecord(entry.node, blobs.get(repo), nowUtc()), formerNames: entry.formerNames ?? [] };
        }
        for (const [repo, entry] of repositories) {
            if (entry.record) continue;
            entry.record = { ...toRepositoryRecord(entry.node, null, nowUtc()), formerNames: entry.formerNames ?? [] };
        }
        checkpoint(ledger, 'repositories', index + batch.length);
        saveLedger(catalogRoot, ledger);
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
        const key = `about:${entity.kind}:${entity.key}`;
        const record = recordCapture(ledger, key, about.about ?? '');
        captures.entities[`${entity.kind}:${entity.key}`] = {
            url: entity.url,
            aboutStatus: about.status,
            about: about.about,
            accessedAt: nowUtc(),
            pageBytes: about.page?.bytes ?? null,
            pageHash: about.page?.hash ?? null,
            markers: about.markers ?? null,
            hash: record.hash,
            rebaselined: record.rebaselined,
        };
        const noteFile = path.join(
            catalogRoot,
            NOTE_CLASSES[entity.kind].directory,
            entity.kind === 'plugin' ? pluginNoteName(entity.key) : themeNoteName(entity.key),
        );
        // §6.2.4 re-baseline rule: a note that already has a body and no baseline records the fresh
        // hash and is not queued. Only a changed input, or a missing note, queues a body.
        const hasNote = isFile(noteFile);
        if (!hasNote || record.changed) {
            queue.push({
                kind: entity.kind,
                key: entity.key,
                note: path.relative(catalogRoot, noteFile),
                reason: hasNote ? 'input hash changed' : 'note does not exist',
                inputs: {
                    description: entity.kind === 'plugin' ? entity.row.description : null,
                    about: about.about,
                    aboutStatus: about.status,
                },
                allowedLinks: [entity.url, githubUrl(entity.row.repo)],
            });
        }
    }

    // --- repository body queue -------------------------------------------------------------------
    for (const [repo, entry] of repositories) {
        const record = entry.record;
        if (!record) continue;
        captures.repositories[repo] = record;
        recordRepository(ledger, repo, {
            numericId: record.numericId,
            fullName: record.fullName,
            note: path.join(NOTE_CLASSES.repository.directory, repositoryNoteName(record.numericId)),
            capturedAt: record.capturedAt,
        });
        const readmeHash = record.readme?.contentHash ?? '';
        const descriptionHash = sha256(record.description ?? '');
        const capture = recordCapture(ledger, `repository:${record.numericId}`, `${readmeHash}:${descriptionHash}`);
        const noteFile = path.join(catalogRoot, NOTE_CLASSES.repository.directory, repositoryNoteName(record.numericId));
        if (!isFile(noteFile) || capture.changed) {
            queue.push({
                kind: 'repository',
                key: String(record.numericId),
                note: path.relative(catalogRoot, noteFile),
                reason: isFile(noteFile) ? 'input hash changed' : 'note does not exist',
                inputs: {
                    description: record.description,
                    readmePath: record.readme?.path ?? null,
                    readmeExcerpt: record.readme?.content ? record.readme.content.slice(0, 4000) : null,
                    readmeTruncated: Boolean(record.readme?.content && record.readme.content.length > 4000),
                },
                allowedLinks: [record.htmlUrl, ...(record.homepage ? [record.homepage] : [])],
            });
        }
    }

    saveLedger(catalogRoot, ledger);
    writeJson(cachePath(catalogRoot, 'captures.json'), {
        pin: args['release-pin'] ?? null,
        capturedAt: nowUtc(),
        pacing,
        userAgent: args['user-agent'],
        costs,
        failures,
        aborted,
        captures,
    });
    writeJson(cachePath(catalogRoot, 'queue.json'), { pin: args['release-pin'] ?? null, tasks: queue });

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

function readExisting(file) {
    if (!isFile(file)) return null;
    const parsed = parseNote(readText(file));
    return parsed.ok ? parsed : null;
}

/**
 * Both machine-readable fences, recomputed over the whole catalog. Every report-writing stage calls
 * this — the gate reads only the latest successful report, so a stage that recomputed one fence and
 * left the other empty would erase a lane the moment its report became the latest one.
 *
 * `noInput` names the notes this run classified as having no usable recorded input; anything else
 * in the fence is carried from the previous report, and only while the note is still body-less.
 */
function fencesForCatalog(catalogRoot, runsRoot, { noInput = [] } = {}) {
    const latest = runsRoot ? latestSuccessfulRun(runsRoot) : null;
    const carriedBodyless = latest ? parseFences(readText(latest.file)).bodyless : [];
    const classified = new Set(noInput);
    const entries = [];
    for (const kind of Object.keys(NOTE_CLASSES)) {
        const directory = path.join(catalogRoot, NOTE_CLASSES[kind].directory);
        for (const file of listFiles(directory, name => name.endsWith('.md'))) {
            const note = parseNote(readText(file));
            if (!note.ok) continue;
            const relative = path.relative(catalogRoot, file);
            entries.push({ relative, kind, note, noInput: classified.has(relative) });
        }
    }
    return recomputeFences(entries, { carriedBodyless });
}

async function stageRender(args) {
    requireRoots(args, ['release-mirror-root', 'templates-root', 'catalog-root', 'runs-root', 'release-pin', 'bodies']);
    const material = verifyMaterial(args['release-mirror-root']);
    if (material.status !== IDENTITY_STATUS.verified) {
        process.stderr.write(`${material.reason}\n`);
        process.exitCode = EXIT.missingMaterial;
        return;
    }
    const startedAt = nowUtc();
    const catalogRoot = args['catalog-root'];
    const indexes = loadIndexes(material.root);
    const templates = loadTemplates(args['templates-root']);
    const captures = readJson(cachePath(catalogRoot, 'captures.json'));
    const queue = readJson(cachePath(catalogRoot, 'queue.json'));
    const bodies = readJson(args.bodies);
    const { ledger } = loadLedger(catalogRoot, args['release-pin']);

    const written = [];
    const rejected = [];
    const pending = [];
    const noInput = [];
    const failures = [...(captures.failures ?? [])];
    // A mechanical capture wave lands the pin-derived bytes and leaves the prose to a later body
    // pass (§6.6 keeps the two apart). The flag is explicit, and every note it lets through without
    // a body is listed in the Run Report's `pending-bodies` fence, which is the body pass's
    // worklist. Until that pass lands, the gate reports each such note as `catalog/block-order` —
    // the absence stays loud rather than being papered over with placeholder prose.
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
                allowedLinks: [record.htmlUrl, ...(record.homepage ? [record.homepage] : [])],
            });
            if (!check.ok) {
                rejected.push({ subject: `repository:${record.numericId}`, problems: check.problems });
                continue;
            }
        } else if (hasNoUsableInput(repositoryInputs)) {
            // §6.5 `bodyless-no-input`: the recorded inputs cannot ground any body, so the note
            // keeps an empty one rather than an invention, and the fence records why.
            noInput.push(path.relative(catalogRoot, file));
        } else {
            pending.push({ task: `repository:${record.numericId}`, note: path.relative(catalogRoot, file) });
        }
        fs.mkdirSync(path.dirname(file), { recursive: true });
        fs.writeFileSync(file, renderRepositoryNote({ template: templates.repository, repository: record, body: body ?? '', existing }));
        written.push(path.relative(catalogRoot, file));
    }

    const notes = loadRepositoryNotes(catalogRoot);
    // Captured repository records, keyed case-insensitively: GitHub canonicalises case freely, so
    // the index string and the captured `full_name` may differ in case alone.
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
        // state the 2026-08-09 theme bodies were written in. Without it a re-render would reject
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
            noInput.push(path.relative(catalogRoot, file));
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
    }

    saveLedger(catalogRoot, ledger);

    // Both fences are recomputed over the whole catalog, not only over the notes this run touched:
    // the gate reads the latest successful report alone, so a lane recorded by an earlier run would
    // otherwise disappear the moment any later run wrote a report.
    const fences = fencesForCatalog(catalogRoot, args['runs-root'], { noInput });

    const status = rejected.length === 0 ? 'success' : 'failed';
    const report = {
        run: `${startedAt.replace(/:/g, '')}-${args.kind ?? 'backfill-pilot'}`,
        kind: args.kind ?? 'backfill-pilot',
        status,
        pin: args['release-pin'],
        startedAt,
        finishedAt: nowUtc(),
        model: args.model ?? null,
        sections: [
            {
                title: 'Scope',
                body: `Run kind \`${args.kind ?? 'backfill-pilot'}\` over the selection recorded in \`Parameters\`. Notes written: ${written.length}. Repositories captured: ${
                    Object.keys(captures.captures.repositories).length
                }. Directory pages captured: ${Object.keys(captures.captures.entities).length}.`,
            },
            {
                title: 'Tasks by class',
                body: [
                    `| class | count |`,
                    `| --- | --- |`,
                    `| added (notes rendered) | ${written.length} |`,
                    `| body tasks queued | ${queue.tasks.length} |`,
                    `| bodies pending (rendered without prose) | ${pending.length} |`,
                    `| bodies rejected | ${rejected.length} |`,
                    `| bodyless, no usable input | ${noInput.length} |`,
                    `| deletions | 0 |`,
                ].join('\n'),
            },
            {
                title: 'Captures',
                body: [
                    '| entity | status | accessed | page bytes |',
                    '| --- | --- | --- | --- |',
                    ...Object.entries(captures.captures.entities).map(
                        ([key, value]) => `| ${key} | ${value.aboutStatus} | ${value.accessedAt} | ${value.pageBytes ?? '—'} |`,
                    ),
                ].join('\n'),
            },
            {
                title: 'GraphQL cost',
                body: [
                    '| stage | repositories | points | nodeCount |',
                    '| --- | --- | --- | --- |',
                    ...(captures.costs ?? []).map(cost => `| ${cost.stage} | ${cost.repos} | ${cost.cost} | ${cost.nodeCount} |`),
                ].join('\n'),
            },
            {
                title: 'Failure lanes',
                body: failures.length
                    ? failures.map(failure => `- \`${failure.lane}\` ${failure.subject} — ${failure.detail}`).join('\n')
                    : 'None.',
            },
            {
                title: 'Bodies pending',
                body: `Notes this run rendered mechanically with no body staged. Each line is a body task id
for the body pass; until it lands, the gate reports the note as \`catalog/block-order\`.\n\n\`\`\`pending-bodies\n${pending
                    .map(item => item.task)
                    .sort()
                    .join('\n')}\n\`\`\``,
            },
            {
                title: 'Rejected bodies',
                body: rejected.length
                    ? rejected.map(item => `- ${item.subject}: ${item.problems.join('; ')}`).join('\n')
                    : 'None.',
            },
            {
                title: 'Notes with no repository link',
                body: `Recorded so \`§5.4\` can distinguish a knowing miss from a broken render. The set is
recomputed over the whole catalog on every run, not only over the notes this run wrote.\n\n${fence(
                    FENCES.unresolved,
                    fences.unresolved,
                )}`,
            },
            {
                title: 'Notes with no usable input',
                body: `The \`${FENCES.bodyless}\` lane (§6.5): the recorded inputs carry too little semantic
content for any body to clear the grounding floor, so the note keeps an empty body rather than an
invention. The gate accepts a body-less note only while it is listed here. Recomputed over the whole
catalog on every run, and an entry drops out the moment its note gains a body.\n\n${fence(
                    FENCES.bodyless,
                    fences.bodyless,
                )}`,
            },
            parametersSection({
                model: args.model ?? null,
                prompt: args.prompt ?? null,
                userAgent: captures.userAgent ?? null,
                pacing: captures.pacing ?? null,
            }),
        ],
    };
    const file = writeRunReport(args['runs-root'], report);
    process.stdout.write(`wrote ${written.length} notes (${pending.length} awaiting a body); run report ${file} (${status})\n`);
    for (const item of rejected) process.stdout.write(`  rejected ${item.subject}: ${item.problems.join('; ')}\n`);
    process.exitCode = status === 'success' ? EXIT.clean : EXIT.findings;
}

/**
 * The re-baseline pass (§6.2.4, §7.3): recover identity from note frontmatter and Sync State from
 * the latest successful Run Report, re-capture, record fresh hashes, queue nothing, and prove that
 * no pin-derived byte changed.
 */
async function stageRebaseline(args) {
    requireRoots(args, ['release-mirror-root', 'templates-root', 'catalog-root', 'runs-root', 'user-agent']);
    const catalogRoot = args['catalog-root'];
    const material = verifyMaterial(args['release-mirror-root']);
    if (material.status !== IDENTITY_STATUS.verified) {
        process.stderr.write(`${material.reason}\n`);
        process.exitCode = EXIT.missingMaterial;
        return;
    }
    const latest = latestSuccessfulRun(args['runs-root']);
    if (!latest) {
        process.stderr.write('no successful Run Report: Sync State cannot be recovered\n');
        process.exitCode = EXIT.refused;
        return;
    }
    const before = new Map();
    for (const file of listFiles(catalogRoot, name => name.endsWith('.md'))) {
        before.set(path.relative(catalogRoot, file), sha256(readText(file)));
    }

    const { present, ledger } = loadLedger(catalogRoot, latest.syncState);
    ledger.pin = latest.syncState;
    const indexes = loadIndexes(material.root);
    const notes = loadRepositoryNotes(catalogRoot);
    for (const [, record] of notes.byId) {
        // Identity comes back from note frontmatter alone.
        for (const [alias, target] of notes.byAlias) {
            if (target.numericId === record.numericId && alias.includes('/')) {
                ledger.repositoriesByRepoString[alias] = record.numericId;
            }
        }
        ledger.repositoriesById[String(record.numericId)] = { fullName: record.fullName, note: record.note, capturedAt: null };
    }

    const pacing = pacingFrom({ intervalMs: args['interval-ms'] ? Number(args['interval-ms']) : undefined });
    const client = new DirectoryClient({ pacing, userAgent: args['user-agent'] });
    const rebaselined = [];
    const queued = [];
    for (const file of listFiles(path.join(catalogRoot, NOTE_CLASSES.plugin.directory), name => name.endsWith('.md'))) {
        const note = parseNote(readText(file));
        if (!note.ok) continue;
        const id = String(note.values.xid?.[0]);
        const about = await client.captureAbout(pluginUrl(id), 'plugin');
        const key = `about:plugin:${id}`;
        const had = baseline(ledger, key);
        const record = recordCapture(ledger, key, about.about ?? '');
        if (had === null) rebaselined.push(key);
        else if (record.changed) queued.push(key);
    }
    for (const file of listFiles(path.join(catalogRoot, NOTE_CLASSES.theme.directory), name => name.endsWith('.md'))) {
        const note = parseNote(readText(file));
        if (!note.ok) continue;
        const slug = String(note.values.xid?.[0]);
        const about = await client.captureAbout(themeUrl(slug), 'theme');
        const key = `about:theme:${slug}`;
        const had = baseline(ledger, key);
        const record = recordCapture(ledger, key, about.about ?? '');
        if (had === null) rebaselined.push(key);
        else if (record.changed) queued.push(key);
    }
    saveLedger(catalogRoot, ledger);

    const changed = [];
    for (const file of listFiles(catalogRoot, name => name.endsWith('.md'))) {
        const relative = path.relative(catalogRoot, file);
        if (before.get(relative) !== sha256(readText(file))) changed.push(relative);
    }

    const fences = fencesForCatalog(catalogRoot, args['runs-root']);

    const startedAt = nowUtc();
    const report = {
        run: `${startedAt.replace(/:/g, '')}-rebaseline`,
        kind: 'rebaseline',
        status: changed.length === 0 ? 'success' : 'failed',
        pin: latest.syncState,
        startedAt,
        finishedAt: nowUtc(),
        model: args.model ?? null,
        sections: [
            {
                title: 'Recovery semantics proven (§7.3)',
                body: [
                    `- Ledger present at start: ${present ? 'yes' : 'no'} — the rehearsal expects **no**.`,
                    `- Sync State recovered from \`${path.basename(latest.file)}\`: \`${latest.syncState}\`.`,
                    `- Identity mappings recovered from note frontmatter: ${Object.keys(ledger.repositoriesById).length} repositories.`,
                    `- Captures re-baselined without queuing: ${rebaselined.length}.`,
                    `- Body tasks queued: ${queued.length} (expected 0 for a re-baseline; a non-zero count means the About text itself moved between the two captures).`,
                    `- Notes whose bytes changed: ${changed.length}${changed.length ? ` (${changed.join(', ')})` : ' — no pin-derived content changed.'}`,
                ].join('\n'),
            },
            {
                title: 'Notes with no repository link',
                body: `Recomputed over the whole catalog, like every report-writing stage. Writing an empty fence
here would erase the recorded misses the moment this report became the latest successful one.\n\n${fence(
                    FENCES.unresolved,
                    fences.unresolved,
                )}`,
            },
            {
                title: 'Notes with no usable input',
                body: `Carried from the previous report and filtered against the catalog as it now stands. A
re-baseline writes no body, so it classifies nothing into this lane itself.\n\n${fence(
                    FENCES.bodyless,
                    fences.bodyless,
                )}`,
            },
            parametersSection({
                model: args.model ?? null,
                prompt: args.prompt ?? null,
                userAgent: args['user-agent'] ?? null,
                pacing,
            }),
        ],
    };
    const file = writeRunReport(args['runs-root'], report);
    process.stdout.write(
        `rebaseline: ledger ${present ? 'present' : 'absent'} at start, sync state ${latest.syncState}, ` +
            `${rebaselined.length} baselines recorded, ${queued.length} queued, ${changed.length} notes changed\n`,
    );
    process.stdout.write(`run report ${file}\n`);
    process.exitCode = changed.length === 0 ? EXIT.clean : EXIT.findings;
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
                'runs-root',
                'release-pin',
                'interval-ms',
                'batch-size',
                'user-agent',
                'bodies',
                'model',
                'prompt',
                'kind',
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
        if (args.stage === 'rebaseline') return await stageRebaseline(args);
        throw new Error(`unknown stage ${args.stage}`);
    } catch (error) {
        writeUsageError(error, USAGE, error.aborted ? EXIT.refused : EXIT.usage);
    }
}

await main(process.argv.slice(2));
