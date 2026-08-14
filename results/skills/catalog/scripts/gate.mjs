#!/usr/bin/env node
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
    EXIT,
    isDirectory,
    listFiles,
    makeFinding,
    parseArgs,
    printReport,
    readJson,
    readText,
    writeUsageError,
} from './lib.mjs';
import { IDENTITY_STATUS, PRIMARY, describeStaleness, verifyMaterial } from './identity.mjs';
import {
    INDEX_FILES,
    NOTE_CLASSES,
    dedupe,
    githubUrl,
    isFilenameSafe,
    loadIndexes,
    pluginNoteName,
    pluginUid,
    pluginUrl,
    repoKey,
    repositoryNoteName,
    repositoryNumericXid,
    repositoryUid,
    screenshotUrl,
    statsFor,
    themeNoteName,
    themeSlug,
    themeUid,
    themeUrl,
} from './model.mjs';
import { emitDataBlock, flattenDataBlock, parseDataBlock } from './datablock.mjs';
import { bodyMissing, loadTemplate, parseNote, serializeFrontmatter } from './note.mjs';
import { exceptions, loadState } from './state.mjs';

const SCRIPT_ROOT = path.dirname(fileURLToPath(import.meta.url));
const MANIFEST = readJson(path.join(SCRIPT_ROOT, 'manifest.json'));

const USAGE = `usage: gate.mjs --release-mirror-root DIR --templates-root DIR [options]

  --release-mirror-root DIR   checkout of ${PRIMARY.repo} (required)
  --templates-root DIR        directory holding the three note templates (required)
  --catalog-root DIR          the catalog tree; skipped when absent
  --state-file FILE           the live state file; carries Sync State and standing exceptions
  --release-pin SHA           the Release Pin the caller has checked out
  --json                      machine-readable report
  --help

exit: 0 clean  1 findings  2 usage  3 missing material  4 stale catalog or material mismatch`;

/**
 * Release-tag keys are opaque by manifest decision: 32 of the 75,052 at the pin are not semver at
 * all. The anchor is kept so a *shape* shift still shows up as an informational line.
 */
const SEMVER_SHAPED = /^v?\d+\.\d+(?:\.\d+)?(?:[-+.][0-9A-Za-z.-]+)?$/;

function observedKeys(rows) {
    const keys = new Map();
    for (const row of rows) {
        for (const key of Object.keys(row)) keys.set(key, (keys.get(key) ?? 0) + 1);
    }
    return keys;
}

/** §5.1 — contract ↔ data complementarity, in both directions. */
function checkComplementarity(indexes, findings, lines) {
    const rowsByFile = {
        [INDEX_FILES.plugins]: indexes.plugins,
        [INDEX_FILES.themes]: indexes.themes,
        [INDEX_FILES.pluginsRemoved]: indexes.pluginsRemoved,
        [INDEX_FILES.themesRemoved]: indexes.themesRemoved,
    };
    for (const [file, rows] of Object.entries(rowsByFile)) {
        const declared = MANIFEST.sources[file].keys;
        const observed = observedKeys(rows);
        for (const [key, count] of observed) {
            if (!declared[key]) {
                findings.push(
                    makeFinding({
                        id: 'manifest/unknown-key',
                        consequence: 'contract-drift',
                        file,
                        message: `upstream key \`${key}\` is neither mapped nor ignored in the gate manifest`,
                        evidence: `${count} of ${rows.length} rows carry it`,
                    }),
                );
            }
        }
        for (const [key, entry] of Object.entries(declared)) {
            if (observed.has(key)) continue;
            findings.push(
                makeFinding({
                    id: entry.presence === 'rare' ? 'manifest/rare-key-vanished' : 'manifest/declared-key-absent',
                    consequence: entry.presence === 'rare' ? 'informational' : 'contract-drift',
                    file,
                    message: `declared key \`${key}\` is not observed at this pin`,
                    evidence: entry.presence === 'rare' ? 'rare key, absence is normal but its disappearance is a regression anchor' : null,
                }),
            );
        }
        lines.push(`${file}: ${rows.length} rows, ${observed.size} distinct keys`);
    }

    // Plugin Stats: two mapped scalars plus opaque per-release counters.
    const statsSource = MANIFEST.sources[INDEX_FILES.stats];
    const statsDeclared = statsSource.keys;
    let ids = 0;
    let releaseKeys = 0;
    let semverShaped = 0;
    const badValues = [];
    const missingScalars = [];
    for (const [id, record] of Object.entries(indexes.stats)) {
        ids += 1;
        for (const declared of Object.keys(statsDeclared)) {
            if (!(declared in record)) missingScalars.push(`${id}.${declared}`);
        }
        for (const [key, value] of Object.entries(record)) {
            if (statsDeclared[key]) {
                if (!Number.isInteger(value)) badValues.push(`${id}.${key}`);
                continue;
            }
            releaseKeys += 1;
            if (SEMVER_SHAPED.test(key)) semverShaped += 1;
            if (!Number.isInteger(value)) badValues.push(`${id}.${key}`);
        }
    }
    if (missingScalars.length) {
        findings.push(
            makeFinding({
                id: 'manifest/declared-key-absent',
                consequence: 'contract-drift',
                file: INDEX_FILES.stats,
                message: `${missingScalars.length} stats records lack a declared scalar (contract: every value carries downloads and updated)`,
                evidence: missingScalars.slice(0, 5).join(', '),
            }),
        );
    }
    if (badValues.length) {
        findings.push(
            makeFinding({
                id: 'manifest/shape-drift',
                consequence: 'contract-drift',
                file: INDEX_FILES.stats,
                message: `${badValues.length} stats values are not integers, which the manifest declares them to be`,
                evidence: badValues.slice(0, 5).join(', '),
            }),
        );
    }
    const anchor = statsSource.otherKeys.regressionAnchor;
    if (releaseKeys !== anchor.releaseKeys || semverShaped !== anchor.semverShaped) {
        findings.push(
            makeFinding({
                id: 'manifest/release-key-shape-moved',
                consequence: 'informational',
                file: INDEX_FILES.stats,
                message: `release-tag keys ${releaseKeys} (${semverShaped} semver-shaped); the recorded anchor is ${anchor.releaseKeys} (${anchor.semverShaped})`,
            }),
        );
    }
    lines.push(`${INDEX_FILES.stats}: ${ids} ids, ${releaseKeys} opaque release-tag keys, ${semverShaped} semver-shaped`);

    const deprecationShape = MANIFEST.sources[INDEX_FILES.deprecation].wholeFile;
    const badDeprecation = Object.entries(indexes.deprecation).filter(([, value]) => !Array.isArray(value));
    if (badDeprecation.length) {
        findings.push(
            makeFinding({
                id: 'manifest/shape-drift',
                consequence: 'contract-drift',
                file: INDEX_FILES.deprecation,
                message: `ignored file no longer has its recorded shape (${deprecationShape.keyShape})`,
                evidence: badDeprecation.slice(0, 3).map(([key]) => key).join(', '),
            }),
        );
    }

    // Every consumed input must be declared — the half that a Data Contract alone cannot satisfy.
    for (const input of MANIFEST.consumedInputs) {
        if (!input.source || !input.consumer) {
            findings.push(
                makeFinding({
                    id: 'manifest/undeclared-input',
                    consequence: 'contract-drift',
                    message: `consumed input ${input.input} does not declare both a source and a consumer`,
                }),
            );
        }
    }
}

/** §5.2 — identity assumptions as checked invariants, each labelled contract or pin observation. */
function checkInvariants(indexes, findings, lines) {
    const pluginIds = new Map();
    const pluginRepos = new Map();
    for (const plugin of indexes.plugins) {
        pluginIds.set(plugin.id, (pluginIds.get(plugin.id) ?? 0) + 1);
        pluginRepos.set(repoKey(plugin.repo), (pluginRepos.get(repoKey(plugin.repo)) ?? 0) + 1);
        if (!isFilenameSafe(plugin.id)) {
            findings.push(
                makeFinding({
                    id: 'invariant/unsafe-filename',
                    consequence: 'identity-broken',
                    file: INDEX_FILES.plugins,
                    message: `plugin id \`${plugin.id}\` cannot become a filename`,
                }),
            );
        }
    }
    for (const [id, count] of pluginIds) {
        if (count > 1) {
            findings.push(
                makeFinding({
                    id: 'invariant/duplicate-plugin-id',
                    consequence: 'identity-broken',
                    file: INDEX_FILES.plugins,
                    message: `plugin id \`${id}\` occurs ${count} times (contract: ids are unique)`,
                }),
            );
        }
    }
    for (const [repo, count] of pluginRepos) {
        if (count > 1) {
            findings.push(
                makeFinding({
                    id: 'invariant/duplicate-repo',
                    consequence: 'identity-broken',
                    file: INDEX_FILES.plugins,
                    message: `repo \`${repo}\` occurs ${count} times in the plugin index (pin observation)`,
                }),
            );
        }
    }

    const themeNames = new Map();
    const slugs = new Map();
    const themeRepos = new Map();
    for (const theme of indexes.themes) {
        themeNames.set(theme.name, (themeNames.get(theme.name) ?? 0) + 1);
        themeRepos.set(repoKey(theme.repo), (themeRepos.get(repoKey(theme.repo)) ?? 0) + 1);
        const slug = themeSlug(theme.name);
        if (!slugs.has(slug)) slugs.set(slug, []);
        slugs.get(slug).push(theme.name);
        if (!isFilenameSafe(slug)) {
            findings.push(
                makeFinding({
                    id: 'invariant/unsafe-filename',
                    consequence: 'identity-broken',
                    file: INDEX_FILES.themes,
                    message: `theme \`${theme.name}\` yields slug \`${slug}\`, which cannot become a filename`,
                }),
            );
        }
        if (!Array.isArray(theme.modes) || theme.modes.length === 0) {
            findings.push(
                makeFinding({
                    id: 'invariant/theme-modes',
                    consequence: 'contract-drift',
                    file: INDEX_FILES.themes,
                    message: `theme \`${theme.name}\` has no modes list`,
                }),
            );
        }
    }
    for (const [name, count] of themeNames) {
        if (count > 1) {
            findings.push(
                makeFinding({
                    id: 'invariant/duplicate-theme-name',
                    consequence: 'identity-broken',
                    file: INDEX_FILES.themes,
                    message: `theme name \`${name}\` occurs ${count} times (contract: names are unique)`,
                }),
            );
        }
    }
    for (const [slug, names] of slugs) {
        if (names.length > 1) {
            findings.push(
                makeFinding({
                    id: 'invariant/slug-collision',
                    consequence: 'identity-broken',
                    file: INDEX_FILES.themes,
                    message: `slug \`${slug}\` is produced by ${names.length} theme names`,
                    evidence: names.join(' | '),
                }),
            );
        }
    }
    for (const [repo, count] of themeRepos) {
        if (count > 1) {
            findings.push(
                makeFinding({
                    id: 'invariant/duplicate-repo',
                    consequence: 'identity-broken',
                    file: INDEX_FILES.themes,
                    message: `repo \`${repo}\` occurs ${count} times in the theme index (pin observation)`,
                }),
            );
        }
    }

    const shared = [...pluginRepos.keys()].filter(repo => themeRepos.has(repo));
    if (shared.length) {
        findings.push(
            makeFinding({
                id: 'invariant/repo-in-both-indexes',
                consequence: 'identity-broken',
                message: `${shared.length} repositories appear in both indexes (pin observation: none did)`,
                evidence: shared.slice(0, 5).join(', '),
            }),
        );
    }

    // Membership is read from the indexes alone: ids in both index and removal list are normal.
    const removedIds = new Set(indexes.pluginsRemoved.map(row => row.id));
    const intersect = indexes.plugins.filter(plugin => removedIds.has(plugin.id)).map(plugin => plugin.id);
    findings.push(
        makeFinding({
            id: 'invariant/index-and-removed',
            consequence: 'informational',
            message: `${intersect.length} plugin ids sit in both the index and the Removal List; membership reads the index alone`,
            evidence: intersect.join(', ') || 'none',
        }),
    );

    const legacy = indexes.themes.filter(theme => theme.legacy === true).length;
    const statsGapIndex = indexes.plugins.filter(plugin => !indexes.stats[plugin.id]).length;
    const pluginIdSet = new Set(indexes.plugins.map(plugin => plugin.id));
    const statsGapStats = Object.keys(indexes.stats).filter(id => !pluginIdSet.has(id)).length;
    lines.push(
        `invariants: ${indexes.plugins.length} plugins, ${indexes.themes.length} themes, ${slugs.size} distinct slugs, ` +
            `${legacy} legacy themes, stats gaps ${statsGapIndex} index-without-stats / ${statsGapStats} stats-without-index`,
    );
}

/** §5.4 — catalog well-formedness, including a byte-stable re-render of every frontmatter block. */
function checkCatalog(context, findings, lines) {
    const { catalogRoot, templates, indexes, state } = context;
    if (!catalogRoot || !isDirectory(catalogRoot)) {
        lines.push('catalog: absent — nothing to check');
        return;
    }
    const pluginsById = new Map(indexes.plugins.map(plugin => [plugin.id, plugin]));
    const themesBySlug = new Map(indexes.themes.map(theme => [themeSlug(theme.name), theme]));
    const repositoryNotes = new Map();
    const repositoryAliases = new Map();
    let counted = 0;

    const classOf = file => {
        const parent = path.basename(path.dirname(file));
        for (const [name, spec] of Object.entries(NOTE_CLASSES)) {
            if (parent === spec.directory) return { name, spec };
        }
        return null;
    };

    const files = listFiles(catalogRoot, file => file.endsWith('.md'));

    // Pre-pass: repository alias → note path plus body presence, so a `repo <owner/name>`
    // exception line can be resolved and checked for staleness (decision 3.11).
    const aliasToPath = new Map();
    const repositoryBodies = new Map();
    for (const file of files) {
        const kind = classOf(file);
        if (!kind || kind.name !== 'repository') continue;
        const note = parseNote(readText(file));
        if (!note.ok) continue;
        const relative = path.relative(catalogRoot, file);
        repositoryBodies.set(relative, !bodyMissing(note));
        for (const alias of note.values.aliases ?? []) aliasToPath.set(repoKey(alias), relative);
    }

    // Standing exceptions live as `[>]`/`[-]` lines in the state file; there are no report fences.
    const standing = state?.ok ? exceptions(state) : [];
    const recordedMisses = new Set();
    const recordedBodyless = new Set();
    for (const exception of standing) {
        if (!exception.reason) {
            findings.push(
                makeFinding({
                    id: 'state/exception-without-reason',
                    consequence: 'catalog-malformed',
                    message: `state exception \`${exception.type} ${exception.id}\` carries no reason`,
                }),
            );
            continue;
        }
        if (exception.reason.startsWith('github-missing') && exception.type !== 'repo') {
            recordedMisses.add(
                exception.type === 'plugin'
                    ? path.join(NOTE_CLASSES.plugin.directory, pluginNoteName(exception.id))
                    : path.join(NOTE_CLASSES.theme.directory, themeNoteName(exception.id)),
            );
        } else if (exception.reason.startsWith('bodyless-no-input') && exception.type === 'repo') {
            const resolved = /^\d+$/.test(exception.id)
                ? path.join(NOTE_CLASSES.repository.directory, repositoryNoteName(Number(exception.id)))
                : aliasToPath.get(repoKey(exception.id));
            if (!resolved || !repositoryBodies.has(resolved)) {
                findings.push(
                    makeFinding({
                        id: 'state/stale-exception',
                        consequence: 'catalog-malformed',
                        message: `bodyless exception \`repo ${exception.id}\` resolves to no repository note`,
                    }),
                );
            } else if (repositoryBodies.get(resolved)) {
                findings.push(
                    makeFinding({
                        id: 'state/stale-exception',
                        consequence: 'catalog-malformed',
                        file: resolved,
                        message: `the note carries a body; the \`bodyless-no-input\` exception for \`repo ${exception.id}\` is stale`,
                    }),
                );
            } else {
                recordedBodyless.add(resolved);
            }
        }
        // Other reasons (readme-oversized, readme-error, …) are recorded context, not gate excuses.
    }
    for (const file of files) {
        const relative = path.relative(catalogRoot, file);
        const kind = classOf(file);
        if (!kind) {
            findings.push(
                makeFinding({
                    id: 'catalog/stray-note',
                    consequence: 'catalog-malformed',
                    file: relative,
                    message: 'note sits outside plugins/, themes/ and repositories/',
                }),
            );
            continue;
        }
        const text = readText(file);
        const note = parseNote(text);
        if (!note.ok) {
            findings.push(
                makeFinding({
                    id: 'catalog/unparsable',
                    consequence: 'catalog-malformed',
                    file: relative,
                    message: `note does not parse: ${note.reason}`,
                }),
            );
            continue;
        }
        counted += 1;
        const template = templates[kind.name];
        const rendered = serializeFrontmatter(note.keys, note.values);
        if (!text.startsWith(rendered)) {
            findings.push(
                makeFinding({
                    id: 'catalog/not-byte-stable',
                    consequence: 'catalog-malformed',
                    file: relative,
                    message: 'frontmatter does not survive a re-render byte for byte (quoting policy or key shape)',
                }),
            );
        }
        if (note.keys.join('|') !== template.keys.join('|')) {
            findings.push(
                makeFinding({
                    id: 'catalog/template-drift',
                    consequence: 'catalog-malformed',
                    file: relative,
                    message: `frontmatter keys do not match ${template.filename}; a template change is a migration (§4.4)`,
                    evidence: `note: ${note.keys.join(', ')}`,
                }),
            );
        }
        if ((note.values.tags ?? []).join('|') !== template.tags.join('|')) {
            findings.push(
                makeFinding({
                    id: 'catalog/tag-drift',
                    consequence: 'catalog-malformed',
                    file: relative,
                    message: `tags do not match ${template.filename}`,
                }),
            );
        }
        if (note.footnote !== template.footnote) {
            findings.push(
                makeFinding({
                    id: 'catalog/footnote-drift',
                    consequence: 'catalog-malformed',
                    file: relative,
                    message: 'template identity footnote does not match the template',
                }),
            );
        }
        checkDataBlock(
            { note, template, kind: kind.name, relative, indexes, bodylessRecorded: recordedBodyless.has(relative) },
            findings,
        );

        const basename = path.basename(file);
        if (kind.name === 'plugin') {
            const id = String(note.values.xid?.[0] ?? '');
            const plugin = pluginsById.get(id);
            if (!plugin) {
                findings.push(
                    makeFinding({
                        id: 'catalog/not-in-index',
                        consequence: 'catalog-malformed',
                        file: relative,
                        message: `plugin id \`${id}\` is not in the Plugin Index at this pin; its related component belongs in the archive (decision 3.3)`,
                    }),
                );
            } else {
                expect(findings, relative, basename === pluginNoteName(id), 'filename does not follow `Obsidian plugin - {id}.md`');
                expect(findings, relative, note.values.uid === pluginUid(id), 'uid is not the deterministic UUIDv5 for this id');
                expect(findings, relative, note.values.url === pluginUrl(id), 'url is not the Directory Page address for this id');
                expect(findings, relative, (note.values.alt ?? [])[0] === githubUrl(plugin.repo), 'alt is not the GitHub address of the index repo');
                expect(findings, relative, note.h1 === plugin.name, 'H1 is not the index name');
                const aliases = dedupe([plugin.id, plugin.name, plugin.repo]);
                expect(findings, relative, (note.values.aliases ?? []).join('|') === aliases.join('|'), 'aliases are not id, name, repo with exact duplicates dropped');
                const stat = statsFor(indexes.stats, id);
                expect(findings, relative, (note.values.downloads ?? null) === stat.downloads, 'downloads does not match Plugin Stats');
                expect(findings, relative, (note.values['updated at'] ?? null) === stat.updatedAt, '`updated at` does not match Plugin Stats');
            }
        } else if (kind.name === 'theme') {
            const slug = String(note.values.xid?.[0] ?? '');
            const theme = themesBySlug.get(slug);
            if (!theme) {
                findings.push(
                    makeFinding({
                        id: 'catalog/not-in-index',
                        consequence: 'catalog-malformed',
                        file: relative,
                        message: `theme slug \`${slug}\` is not derivable from any name in the Theme Index at this pin`,
                    }),
                );
            } else {
                expect(findings, relative, basename === themeNoteName(slug), 'filename does not follow `Obsidian theme - {slug}.md`');
                expect(findings, relative, note.values.uid === themeUid(slug), 'uid is not the deterministic UUIDv5 for this slug');
                expect(findings, relative, note.values.url === themeUrl(slug), 'url is not the Directory Page address for this slug');
                expect(findings, relative, (note.values.alt ?? [])[0] === githubUrl(theme.repo), 'alt is not the GitHub address of the index repo');
                expect(findings, relative, note.h1 === theme.name, 'H1 is not the index name');
                expect(findings, relative, (note.values.modes ?? []).join('|') === theme.modes.join('|'), 'modes is not the index list in upstream order');
                expect(findings, relative, note.values.legacy === (theme.legacy === true), 'legacy does not match the index');
            }
        } else {
            const numericId = repositoryNumericXid(note.values);
            if (numericId === null) {
                findings.push(
                    makeFinding({
                        id: 'catalog/bad-repository-xid',
                        consequence: 'catalog-malformed',
                        file: relative,
                        message: 'no xid member is a numeric GitHub repository id',
                    }),
                );
                continue;
            }
            const xid = note.values.xid ?? [];
            if (!(xid.length === 2 && typeof xid[0] === 'string' && Number.isInteger(xid[1]))) {
                findings.push(
                    makeFinding({
                        id: 'catalog/bad-repository-xid',
                        consequence: 'catalog-malformed',
                        file: relative,
                        message: 'xid is not the GraphQL node id followed by the numeric databaseId; a template change is a migration (§4.4)',
                    }),
                );
            }
            expect(findings, relative, basename === repositoryNoteName(numericId), 'filename does not follow `GitHub - {numeric id}.md`');
            expect(findings, relative, note.values.uid === repositoryUid(numericId), 'uid is not the deterministic UUIDv5 for this repository id');
            // §4.1: the two leading aliases are recomputed from the record on every render, so the
            // note's own H1 — the current `nameWithOwner` — is enough to check them offline. What
            // follows them is history, whose order the machine preserves rather than derives.
            const repositoryAliasList = note.values.aliases ?? [];
            const slash = note.h1.indexOf('/');
            expect(
                findings,
                relative,
                slash > 0 && repositoryAliasList[0] === note.h1.slice(slash + 1) && repositoryAliasList[1] === note.h1,
                'aliases do not lead with the bare name followed by the current full name',
            );
            repositoryNotes.set(String(numericId), relative);
            for (const alias of note.values.aliases ?? []) {
                if (!alias.includes('/')) continue;
                const key = repoKey(alias);
                if (repositoryAliases.has(key)) {
                    findings.push(
                        makeFinding({
                            id: 'catalog/duplicate-full-name-alias',
                            consequence: 'identity-broken',
                            file: relative,
                            message: `full-name alias \`${alias}\` is also carried by ${repositoryAliases.get(key)} (uniqueness holds per note class)`,
                        }),
                    );
                }
                repositoryAliases.set(key, relative);
            }
        }
    }

    // Every plugin and theme link must resolve, or the miss must be excused in the state file.
    for (const file of files) {
        const kind = classOf(file);
        if (!kind || kind.name === 'repository') continue;
        const relative = path.relative(catalogRoot, file);
        const note = parseNote(readText(file));
        if (!note.ok) continue;
        const links = note.values['related to'] ?? [];
        if (links.length > 0 && recordedMisses.has(relative)) {
            findings.push(
                makeFinding({
                    id: 'state/stale-exception',
                    consequence: 'catalog-malformed',
                    file: relative,
                    message: 'the note carries a repository link; its `github-missing` exception is stale',
                }),
            );
        }
        if (links.length === 0) {
            if (!recordedMisses.has(relative)) {
                findings.push(
                    makeFinding({
                        id: 'catalog/unrecorded-missing-link',
                        consequence: 'catalog-malformed',
                        file: relative,
                        message: 'no repository link and no `github-missing` exception in the state file (§5.4)',
                    }),
                );
            }
            continue;
        }
        for (const link of links) {
            // §3.1: the link is bare. A link carrying display text is drift, not a
            // variant, so it fails the shape test and is reported as dangling-shaped below.
            const match = /^\[\[GitHub - (\d+)\]\]$/.exec(link);
            if (!match) {
                if (link.startsWith('[[GitHub - ')) {
                    findings.push(
                        makeFinding({
                            id: 'catalog/link-shape',
                            consequence: 'catalog-malformed',
                            file: relative,
                            message: `repository link ${link} is not the bare \`[[GitHub - {id}]]\` form (§3.1)`,
                        }),
                    );
                }
                continue;
            }
            if (!repositoryNotes.has(match[1])) {
                findings.push(
                    makeFinding({
                        id: 'catalog/dangling-link',
                        consequence: 'catalog-malformed',
                        file: relative,
                        message: `repository link ${link} has no note`,
                    }),
                );
            }
        }
    }

    lines.push(`catalog: ${counted} notes checked, ${repositoryNotes.size} repository notes`);
    lines.push(
        `state exceptions: ${standing.length} standing ` +
            `(${recordedMisses.size} github-missing, ${recordedBodyless.size} bodyless-no-input)`,
    );
}

function expect(findings, file, condition, message) {
    if (condition) return;
    findings.push(makeFinding({ id: 'catalog/mapping-drift', consequence: 'catalog-malformed', file, message }));
}

/**
 * §5.4: the Data Contract fence is filled rather than stripped, so byte stability covers the data
 * block, not only the frontmatter.
 *
 * Three obligations, in order. **Placement** — the block is the last thing before the footnote, with
 * the body first and only a theme allowed an embed between them. **Byte stability** — the block is
 * parsed and re-emitted, and the bytes must match, so a hand edit or an emitter change is a finding
 * instead of an invisible rewrite on the next run. **Values** — every pin-derived field is compared
 * against the index, which is the half of the block a gate can check offline; About and the GitHub
 * record are captures, dated observations the gate takes as recorded.
 */
function checkDataBlock({ note, template, kind, relative, indexes, bodylessRecorded = false }, findings) {
    const file = relative;
    if (note.data === null) {
        findings.push(
            makeFinding({
                id: 'catalog/missing-data-block',
                consequence: 'catalog-malformed',
                file,
                message: `note carries no filled \`cue\` data block; ${template.filename} declares one (§4.x)`,
            }),
        );
        return;
    }
    // The body must precede *both* the screenshot embed and the data block. Testing only for an
    // empty body let a body-less theme through, because the parser calls the embed the first block
    // and the embed alone satisfied the order; `bodyMissing` closes that. A body-less note is
    // accepted only when the state file excuses it with a `bodyless-no-input` exception line
    // (decision 3.11) — that is how "the inputs carry no usable semantic content" stays
    // distinguishable from a note still awaiting its body pass.
    if (bodyMissing(note) && !bodylessRecorded) {
        findings.push(
            makeFinding({
                id: 'catalog/block-order',
                consequence: 'catalog-malformed',
                file,
                message: `the data block is not preceded by a body, and no \`${FENCES.bodyless}\` record excuses it (§6.5)`,
            }),
        );
    }
    const allowedEmbeds = kind === 'theme' ? 1 : 0;
    if (note.embeds.length > allowedEmbeds) {
        findings.push(
            makeFinding({
                id: 'catalog/block-order',
                consequence: 'catalog-malformed',
                file,
                message: `${note.embeds.length} blocks sit between the body and the data block; at most ${allowedEmbeds} may`,
            }),
        );
    }
    if (note.embeds.some(block => !block.startsWith('!['))) {
        findings.push(
            makeFinding({ id: 'catalog/block-order', consequence: 'catalog-malformed', file, message: 'a block between the body and the data block is not an embed' }),
        );
    }

    let records;
    try {
        records = parseDataBlock(note.data);
    } catch (error) {
        findings.push(
            makeFinding({ id: 'catalog/data-block-unparsable', consequence: 'catalog-malformed', file, message: `data block does not parse: ${error.message}` }),
        );
        return;
    }
    let reemitted;
    try {
        reemitted = emitDataBlock(records);
    } catch (error) {
        findings.push(
            makeFinding({ id: 'catalog/data-block-unparsable', consequence: 'catalog-malformed', file, message: `data block cannot be re-emitted: ${error.message}` }),
        );
        return;
    }
    if (reemitted !== `\`\`\`cue\n${note.data}\n\`\`\``) {
        findings.push(
            makeFinding({
                id: 'catalog/not-byte-stable',
                consequence: 'catalog-malformed',
                file,
                message: 'the data block does not survive a re-render byte for byte (indentation, alignment or quoting)',
            }),
        );
    }

    // The records a note carries must follow the template's, in order. `readme` is the one the
    // repository note may omit: a repository with no README has no README record to fill.
    const names = records.map(([name]) => name);
    const declared = template.contractRecords;
    const ordered = names.every((name, index) => declared.indexOf(name) >= (index === 0 ? 0 : declared.indexOf(names[index - 1]) + 1));
    if (!ordered || names.length === 0 || names[0] !== declared[0]) {
        findings.push(
            makeFinding({
                id: 'catalog/data-block-drift',
                consequence: 'catalog-malformed',
                file,
                message: `data block records ${names.join(', ') || 'none'} do not follow ${template.filename} (${declared.join(', ')})`,
            }),
        );
        return;
    }

    const values = flattenDataBlock(records);
    const differs = (key, expected) => {
        const actual = values.get(key);
        const same = Array.isArray(expected)
            ? Array.isArray(actual) && actual.join('|') === expected.join('|')
            : actual === expected;
        if (same) return;
        findings.push(
            makeFinding({
                id: 'catalog/data-block-drift',
                consequence: 'catalog-malformed',
                file,
                message: `data block \`${key}\` is ${JSON.stringify(actual ?? null)}, the pin says ${JSON.stringify(expected)}`,
            }),
        );
    };

    if (kind === 'plugin') {
        // Keyed by the note's own identity, never by the block's: a tampered `id` inside the block
        // must fail the comparison instead of quietly selecting a different index row — or none.
        const plugin = indexes.plugins.find(row => row.id === String(note.values.xid?.[0] ?? ''));
        if (!plugin) return;
        differs('plugin.id', plugin.id);
        differs('plugin.name', plugin.name);
        differs('plugin.author', plugin.author);
        differs('plugin.repo', plugin.repo);
        differs('plugin.html_url', pluginUrl(plugin.id));
        differs('plugin.github_url', githubUrl(plugin.repo));
        differs('plugin.description', plugin.description);
        const stats = indexes.stats[plugin.id];
        if (stats) {
            // The block records the source value; the frontmatter renders it. `updated_at` stays the
            // raw epoch integer here precisely so the two cannot silently become one.
            differs('plugin.stats.downloads', stats.downloads);
            differs('plugin.stats.updated_at', stats.updated);
        } else if (values.has('plugin.stats.downloads')) {
            findings.push(
                makeFinding({
                    id: 'catalog/data-block-drift',
                    consequence: 'catalog-malformed',
                    file,
                    message: 'the data block carries a stats record for an id that has none at this pin',
                }),
            );
        }
    } else if (kind === 'theme') {
        const slug = String(note.values.xid?.[0] ?? '');
        const theme = indexes.themes.find(row => themeSlug(row.name) === slug);
        if (!theme) return;
        differs('theme.name', theme.name);
        differs('theme.author', theme.author);
        differs('theme.repo', theme.repo);
        differs('theme.slug', themeSlug(theme.name));
        differs('theme.html_url', themeUrl(slug));
        differs('theme.github_url', githubUrl(theme.repo));
        differs('theme.screenshot_url', screenshotUrl(theme.repo, theme.screenshot));
        differs('theme.modes', theme.modes);
        if (theme.legacy === undefined && values.has('theme.legacy')) {
            findings.push(
                makeFinding({
                    id: 'catalog/data-block-drift',
                    consequence: 'catalog-malformed',
                    file,
                    message: 'the data block carries `legacy` for a theme whose index row does not (the rare key is recorded, never invented)',
                }),
            );
        }
        if (theme.legacy !== undefined) differs('theme.legacy', theme.legacy);
    } else {
        // A repository record is a capture, not a pin-derived value: only its identity is checkable
        // offline, against the note's own filename and xid.
        differs('repository.id', (note.values.xid ?? []).find(member => typeof member === 'string') ?? null);
        differs('repository.databaseId', repositoryNumericXid(note.values));
        differs('repository.nameWithOwner', note.h1);
    }
}

function main(argv) {
    let args;
    try {
        args = parseArgs(argv, {
            booleans: ['json', 'help'],
            values: ['release-mirror-root', 'catalog-root', 'templates-root', 'state-file', 'release-pin'],
        });
    } catch (error) {
        writeUsageError(error, USAGE);
        return;
    }
    if (args.help) {
        process.stdout.write(`${USAGE}\n`);
        return;
    }
    if (!args['release-mirror-root'] || !args['templates-root']) {
        writeUsageError(new Error('--release-mirror-root and --templates-root are required'), USAGE);
        return;
    }

    const material = verifyMaterial(args['release-mirror-root']);
    if (material.status === IDENTITY_STATUS.missing) {
        process.stderr.write(`${material.reason}\n`);
        process.exitCode = EXIT.missingMaterial;
        return;
    }
    if (material.status === IDENTITY_STATUS.mismatch) {
        process.stderr.write(`${material.reason}\n`);
        process.exitCode = EXIT.identityMismatch;
        return;
    }

    const findings = [];
    const lines = [`material: ${PRIMARY.repo} verified structurally at ${material.root}`];

    let templates;
    try {
        templates = {
            plugin: loadTemplate(args['templates-root'], NOTE_CLASSES.plugin.template),
            theme: loadTemplate(args['templates-root'], NOTE_CLASSES.theme.template),
            repository: loadTemplate(args['templates-root'], NOTE_CLASSES.repository.template),
        };
    } catch (error) {
        process.stderr.write(`templates: ${error.message}\n`);
        process.exitCode = EXIT.missingMaterial;
        return;
    }

    const indexes = loadIndexes(material.root);
    checkComplementarity(indexes, findings, lines);
    checkInvariants(indexes, findings, lines);

    const state = args['state-file'] ? loadState(args['state-file']) : null;
    if (state && !state.ok && !state.absent) {
        findings.push(
            makeFinding({
                id: 'state/unparsable',
                consequence: 'catalog-malformed',
                file: args['state-file'],
                message: `the state file does not parse: ${state.reason}`,
            }),
        );
    }
    const staleness = describeStaleness(args['release-pin'] ?? null, state?.ok ? state.basePin ?? null : null);
    if (staleness.state === 'stale') {
        findings.push(
            makeFinding({
                id: 'catalog/stale',
                consequence: 'catalog-stale',
                message: `the catalog reflects ${staleness.syncState}, the checkout is ${staleness.pin}; an Update Run is required (§5.3)`,
                evidence: state?.ok && state.run ? `state run ${state.run}` : null,
            }),
        );
    } else {
        lines.push(`sync state: ${staleness.state}` + (staleness.syncState ? ` (${staleness.syncState})` : ''));
    }

    checkCatalog(
        { catalogRoot: args['catalog-root'], templates, indexes, state },
        findings,
        lines,
    );

    printReport({ lines, findings, staleness }, { json: Boolean(args.json) });
    if (staleness.state === 'stale') {
        process.exitCode = EXIT.identityMismatch;
        return;
    }
    process.exitCode = findings.some(item => item.severity !== 'info') ? EXIT.findings : EXIT.clean;
}

main(process.argv.slice(2));
