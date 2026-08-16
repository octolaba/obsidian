#!/usr/bin/env node
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

import { EXIT, isDirectory, isFile, listFiles, parseArgs, readJson, readText, sha256, writeUsageError } from './lib.mjs';
import { STATUS, extractAbout } from './about.mjs';
import { UNREVIEWED_PLUGIN_NOTICE, hasNoUsableInput, movedBodyInputs, validateBody, withoutIndexBoilerplate } from './body.mjs';
import { fetchRepositoryById, normalizeReadme } from './github.mjs';
import { verifyMaterial, IDENTITY_STATUS, describeStaleness } from './identity.mjs';
import {
    INDEX_FILES,
    dedupe,
    isFilenameSafe,
    loadIndexes,
    pluginNoteName,
    pluginUid,
    repositoryLink,
    repositoryNoteName,
    repositoryUid,
    screenshotUrl,
    themeNoteName,
    themeSlug,
    themeUid,
    uuidV5,
} from './model.mjs';
import { bodyMissing, loadTemplate, parseFrontmatter, parseNote, serializeFrontmatter, yamlScalar } from './note.mjs';
import { emitDataBlock, fields, flattenDataBlock, parseDataBlock } from './datablock.mjs';
import { renderPluginNote, renderRepositoryNote, renderThemeNote } from './render.mjs';
import { loadEntityNotes, loadRepositoryNotes } from './resolve.mjs';
import {
    blockers,
    duplicateSubjects,
    exceptions,
    parseState,
    renderReceipt,
    resetState,
    resumeView,
    serializeState,
    writeReceipt,
} from './state.mjs';
import {
    CLASSES,
    applyWorklist,
    capturedClasses,
    claimedRepositories,
    classify,
    closureFor,
    closureItems,
    reasonTail,
    recognizedLinksFor,
    reconcile,
    writableItems,
} from './worklist.mjs';

const SCRIPT_ROOT = path.dirname(fileURLToPath(import.meta.url));
const FIXTURES = path.join(SCRIPT_ROOT, 'fixtures');

const USAGE = `usage: test.mjs --release-mirror-root DIR --templates-root DIR

exit: 0 all passed  1 failures  2 usage  3 missing material`;

/**
 * One captured GitHub record, shared by every check that needs a repository note: the data-block
 * contract, the notes the gate is spawned over, and the run driver's refusal to overwrite. The
 * renderer never mutates it.
 */
const REPOSITORY_RECORD = Object.freeze({
    numericId: 329202727,
    nodeId: 'MDEwOlJlcG9zaXRvcnkzMjkyMDI3Mjc=',
    fullName: 'blacksmithgu/obsidian-dataview',
    name: 'obsidian-dataview',
    description: 'A data index and query language over Markdown files.',
    language: 'TypeScript',
    topics: ['obsidian', 'dataview'],
    url: 'https://github.com/blacksmithgu/obsidian-dataview',
    sshUrl: 'git@github.com:blacksmithgu/obsidian-dataview.git',
    homepageUrl: 'https://blacksmithgu.github.io/obsidian-dataview/',
    owner: { id: 616974, type: 'User', login: 'blacksmithgu', url: 'https://github.com/blacksmithgu' },
    license: { key: 'mit', name: 'MIT License', spdxId: 'MIT' },
    stargazerCount: 9254,
    watcherCount: 51,
    forkCount: 553,
    openIssueCount: 700,
    features: {
        hasIssuesEnabled: true,
        hasPullRequestsEnabled: true,
        hasProjectsEnabled: false,
        hasWikiEnabled: false,
        hasDiscussionsEnabled: true,
        hasSponsorshipsEnabled: false,
        forkingAllowed: true,
    },
    state: {
        visibility: 'PUBLIC',
        defaultBranch: 'master',
        isPrivate: false,
        isFork: false,
        isArchived: false,
        isDisabled: false,
        isTemplate: false,
    },
    diskUsage: 12345,
    createdAt: '2020-12-12T00:00:00Z',
    updatedAt: '2025-11-17T20:51:35Z',
    pushedAt: '2025-11-17T20:51:35Z',
    readme: {
        name: 'README.md',
        path: 'README.md',
        sha: '4e365f3a',
        size: 7828,
        htmlUrl: 'https://github.com/blacksmithgu/obsidian-dataview/blob/master/README.md',
        oversized: false,
        content: 'secret readme text',
        contentHash: 'f'.repeat(64),
    },
});

/**
 * A synthetic pin pair, built so that every class the classifier knows appears exactly once and
 * the two precedence rules are exercised by rows that satisfy both predicates: `moved` and
 * `reloedit` both relocate *and* change a mapped property, `retitled` changes its display name
 * without moving its slug, and `renamed-old`/`renamed-new` share one repository across a removal
 * and an addition.
 */
const PLUGIN = (id, over = {}) => ({ id, name: id, author: 'A', description: 'D', repo: `o/${id}`, ...over });
const THEME = (name, over = {}) => ({ name, author: 'A', repo: `o/${themeSlug(name)}`, screenshot: 's.png', modes: ['dark'], legacy: false, ...over });
const STAT = (downloads, updated) => ({ downloads, updated });

const FIXTURE_PINS = Object.freeze({
    base: {
        plugins: [
            PLUGIN('keep'),
            PLUGIN('gone'),
            PLUGIN('moved', { repo: 'o/old' }),
            PLUGIN('edited'),
            PLUGIN('described'),
            PLUGIN('statsonly'),
            PLUGIN('appears'),
            PLUGIN('vanishes'),
            PLUGIN('reloedit', { repo: 'o/relo-old' }),
            PLUGIN('oldname', { repo: 'o/shared' }),
            PLUGIN('holder'),
            PLUGIN('tagalong'),
            PLUGIN('linkless'),
        ],
        themes: [THEME('Kept'), THEME('Vanished'), THEME('Renamed Old', { repo: 'o/renamed' }), THEME('Retitled')],
        stats: {
            keep: STAT(1, 1), gone: STAT(1, 1), moved: STAT(1, 1), edited: STAT(1, 1), described: STAT(1, 1),
            statsonly: STAT(1, 1), vanishes: STAT(1, 1), reloedit: STAT(1, 1),
        },
        pluginsRemoved: [{ id: 'ancient', name: 'Ancient', reason: 'withdrawn' }],
        themesRemoved: [{ name: 'Ancient', reason: 'withdrawn' }],
        deprecation: {},
    },
    target: {
        plugins: [
            PLUGIN('keep'),
            PLUGIN('moved', { repo: 'o/new' }),
            PLUGIN('edited', { author: 'B' }),
            PLUGIN('described', { description: 'D2' }),
            PLUGIN('statsonly'),
            PLUGIN('appears'),
            PLUGIN('vanishes'),
            PLUGIN('reloedit', { repo: 'o/relo-new', author: 'B' }),
            PLUGIN('newname', { repo: 'o/shared' }),
            PLUGIN('tagalong'),
            PLUGIN('fresh'),
        ],
        themes: [
            THEME('Kept', { author: 'B' }),
            THEME('Renamed New', { repo: 'o/renamed' }),
            THEME('Retitled!', { repo: 'o/retitled' }),
        ],
        stats: {
            keep: STAT(1, 1), moved: STAT(1, 1), edited: STAT(1, 1), described: STAT(1, 1),
            statsonly: STAT(2, 1), appears: STAT(5, 5), reloedit: STAT(1, 1),
        },
        // Upstream text with an em-dash tail and a newline: both would break the item grammar.
        pluginsRemoved: [{ id: 'gone', name: 'Gone', reason: 'Author request — repository withdrawn' }],
        themesRemoved: [{ name: 'Vanished', reason: 'Developer policies\nviolation' }],
        deprecation: {},
    },
});

/** The six data files plus the README, laid out so `verifyMaterial` recognises the directory. */
function writeIndexRoot(directory, indexes) {
    fs.mkdirSync(directory, { recursive: true });
    fs.writeFileSync(path.join(directory, 'README.md'), '# Mirror\n\nThe community plugins & themes directories.\n');
    for (const [key, file] of Object.entries(INDEX_FILES)) {
        fs.writeFileSync(path.join(directory, file), `${JSON.stringify(indexes[key], null, 2)}\n`);
    }
    return directory;
}

/**
 * A catalog whose links are the baseline relationship graph the closure reads: `gone` and
 * `vanished` hold a repository of their own, `oldname` holds one an added row still claims,
 * `holder` shares one with the surviving `tagalong`, and `linkless` holds none at all.
 *
 * @param renamed numeric id → the name GitHub answers under now. A repository renamed upstream
 *   after the base pin carries a name that is on no alias list, which is precisely what the
 *   offline reduction cannot see and the archive stage resolves by numeric id.
 */
function writeFixtureCatalog(catalogRoot, templates, { renamed = {} } = {}) {
    const repository = (numericId, name) => {
        const fullName = renamed[numericId] ?? name;
        return {
            ...REPOSITORY_RECORD,
            numericId,
            nodeId: `node-${numericId}`,
            fullName,
            name: fullName.split('/')[1],
            url: `https://github.com/${fullName}`,
        };
    };
    const write = (relative, text) => {
        const file = path.join(catalogRoot, relative);
        fs.mkdirSync(path.dirname(file), { recursive: true });
        fs.writeFileSync(file, text);
    };
    for (const [numericId, fullName] of [
        [101, 'o/gone'], [102, 'o/vanished'], [103, 'o/shared'], [104, 'o/holder'], [105, 'o/tagalong'],
    ]) {
        write(
            path.join('repositories', repositoryNoteName(numericId)),
            renderRepositoryNote({ template: templates.repository, repository: repository(numericId, fullName), body: 'Body.' }),
        );
    }
    const plugin = (row, numericId, extraLinks = []) =>
        write(
            path.join('plugins', pluginNoteName(row.id)),
            renderPluginNote({
                template: templates.plugin,
                plugin: row,
                stats: FIXTURE_PINS.base.stats,
                repository: numericId === null ? null : { numericId },
                body: 'Body.',
                existing: extraLinks.length ? { values: { 'related to': extraLinks } } : null,
            }),
        );
    plugin(PLUGIN('gone'), 101);
    plugin(PLUGIN('oldname', { repo: 'o/shared' }), 103);
    plugin(PLUGIN('holder'), 104);
    plugin(PLUGIN('tagalong'), 105, [repositoryLink(104)]);
    plugin(PLUGIN('linkless'), null);
    write(
        path.join('themes', themeNoteName('vanished')),
        renderThemeNote({ template: templates.theme, theme: THEME('Vanished'), repository: { numericId: 102 }, body: 'Body.' }),
    );
    return catalogRoot;
}

const results = [];
function check(name, fn) {
    try {
        fn();
        results.push({ name, ok: true });
    } catch (error) {
        results.push({ name, ok: false, reason: error.message });
    }
}
/** The same harness for a check that has to await something — a stubbed network call, today. */
async function checkAsync(name, fn) {
    try {
        await fn();
        results.push({ name, ok: true });
    } catch (error) {
        results.push({ name, ok: false, reason: error.message });
    }
}
function assert(condition, message) {
    if (!condition) throw new Error(message);
}
function equal(actual, expected, message) {
    if (actual !== expected) throw new Error(`${message}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
}

async function main(argv) {
    let args;
    try {
        args = parseArgs(argv, { booleans: ['help'], values: ['release-mirror-root', 'templates-root'] });
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
    if (material.status !== IDENTITY_STATUS.verified) {
        process.stderr.write(`${material.reason}\n`);
        process.exitCode = material.status === IDENTITY_STATUS.missing ? EXIT.missingMaterial : EXIT.identityMismatch;
        return;
    }
    if (!isDirectory(FIXTURES)) {
        process.stderr.write(`fixtures are missing from ${FIXTURES}\n`);
        process.exitCode = EXIT.missingMaterial;
        return;
    }
    const indexes = loadIndexes(material.root);
    const templates = {
        plugin: loadTemplate(args['templates-root'], 'Obsidian plugin.md'),
        theme: loadTemplate(args['templates-root'], 'Obsidian theme.md'),
        repository: loadTemplate(args['templates-root'], 'GitHub repository.md'),
    };

    check('run refuses to infer a scratch directory from the live catalog root', () => {
        const run = spawnSync(
            process.execPath,
            [
                path.join(SCRIPT_ROOT, 'run.mjs'),
                '--stage',
                'capture',
                '--release-mirror-root',
                args['release-mirror-root'],
                '--templates-root',
                args['templates-root'],
                '--catalog-root',
                'docs/data',
                '--user-agent',
                'catalog-self-test',
            ],
            { encoding: 'utf8' },
        );
        equal(run.status, EXIT.usage, 'capture without --support-root is a usage error');
        assert(run.stderr.includes('--support-root'), 'the refusal names the missing support root');
    });

    // --- the slug rule --------------------------------------------------------------------------
    check('slug rule reproduces every recorded anchor', () => {
        const anchors = [
            ['Rosé Pine', 'ros-pine'],
            ['Rose Pine', 'rose-pine'],
            ['Rosé Pine Moon', 'ros-pine-moon'],
            ["Synthwave '84", 'synthwave-84'],
            ['OLED.Black', 'oledblack'],
            ['obsidian_ia', 'obsidiania'],
            ['Garden Gnome (Adwaita, GTK)', 'garden-gnome-adwaita-gtk'],
            ['Blue Topaz', 'blue-topaz'],
        ];
        for (const [name, slug] of anchors) equal(themeSlug(name), slug, `slug for ${name}`);
    });

    check('every pinned theme name yields a distinct, filename-safe slug', () => {
        const seen = new Map();
        for (const theme of indexes.themes) {
            const slug = themeSlug(theme.name);
            assert(slug !== '', `${theme.name} yields an empty slug`);
            assert(isFilenameSafe(slug), `${theme.name} yields unsafe ${slug}`);
            assert(!seen.has(slug), `${theme.name} collides with ${seen.get(slug)} on ${slug}`);
            seen.set(slug, theme.name);
        }
        equal(seen.size, indexes.themes.length, 'one slug per theme');
    });

    check('the near-collision the deletion rule protects still holds', () => {
        assert(indexes.themes.some(theme => theme.name === 'Rosé Pine'), 'Rosé Pine is in the index');
        assert(indexes.themes.some(theme => theme.name === 'Rose Pine'), 'Rose Pine is in the index');
        assert(themeSlug('Rosé Pine') !== themeSlug('Rose Pine'), 'the two slugs stay distinct');
    });

    // --- identity -------------------------------------------------------------------------------
    check('uuidV5 is deterministic and version-tagged', () => {
        const first = uuidV5('obsidian-plugin:dataview');
        equal(first, pluginUid('dataview'), 'plugin uid helper agrees');
        equal(first, uuidV5('obsidian-plugin:dataview'), 'repeat call agrees');
        equal(first[14], '5', 'version nibble is 5');
        assert('89ab'.includes(first[19]), 'variant nibble is 8, 9, a or b');
        assert(pluginUid('dataview') !== themeUid('dataview'), 'class prefixes separate namespaces');
        assert(repositoryUid(329202727) !== repositoryUid(329202728), 'different ids, different uids');
    });

    check('filename safety rejects what would break a path', () => {
        assert(isFilenameSafe('scrybble.ink'), 'a dot is safe');
        assert(!isFilenameSafe('a/b'), 'a slash is not');
        assert(!isFilenameSafe('..'), 'traversal is not');
        assert(!isFilenameSafe('a b'), 'a space is not');
        assert(!isFilenameSafe(''), 'empty is not');
    });

    check('repository links are bare, with no display text', () => {
        equal(repositoryLink(329202727), '[[GitHub - 329202727]]', 'link shape');
        assert(!repositoryLink(329202727).includes('|'), 'display text was dropped by decision (§3.1)');
    });

    // --- quoting and round-trip ------------------------------------------------------------------
    check('the quoting policy round-trips hostile upstream strings', () => {
        const values = {
            plain: 'Dataview',
            url: 'https://community.obsidian.md/plugins/dataview',
            colon: 'RedShift: OLED Blue Light Filter',
            accent: 'Rosé Pine',
            apostrophe: "Synthwave '84",
            emoji: '📊 Charts',
            numberish: '0123',
            boolish: 'yes',
            leading: '- dash',
            quoted: 'He said "no"',
            backslash: 'a\\b',
            empty: null,
            list: ['a b', 'plain', 42],
            count: 9254,
            flag: true,
        };
        const keys = Object.keys(values);
        const text = serializeFrontmatter(keys, values);
        const parsed = parseFrontmatter(text);
        assert(parsed.ok, `re-parse failed: ${parsed.reason}`);
        equal(serializeFrontmatter(parsed.keys, parsed.values), text, 'second render is byte-identical');
        equal(parsed.values.colon, values.colon, 'colon survives');
        equal(parsed.values.accent, values.accent, 'accent survives');
        equal(parsed.values.emoji, values.emoji, 'emoji survives');
        equal(parsed.values.quoted, values.quoted, 'inner quotes survive');
        equal(parsed.values.numberish, '0123', 'a numeric-looking string stays a string');
        equal(parsed.values.count, 9254, 'a real integer stays an integer');
        equal(yamlScalar(''), '', 'an empty value writes nothing');
    });

    check('a numeric list member stays unquoted and round-trips', () => {
        // The node id leads; the numeric id follows it.
        const text = serializeFrontmatter(['xid'], { xid: ['MDEwOlJlcG9zaXRvcnk=', 329202727] });
        assert(text.includes('  - 329202727\n'), 'the numeric id is written plain');
        const parsed = parseFrontmatter(text);
        equal(serializeFrontmatter(parsed.keys, parsed.values), text, 'byte-stable');
    });

    // --- rendering --------------------------------------------------------------------------------
    check('a plugin note renders with every mapped property', () => {
        const plugin = indexes.plugins.find(row => row.id === 'dataview');
        const text = renderPluginNote({
            template: templates.plugin,
            plugin,
            stats: indexes.stats,
            repository: { numericId: 329202727, fullName: 'blacksmithgu/obsidian-dataview' },
            body: 'A body that is long enough to pass validation and describes the plugin. It names the query language it provides.',
        });
        const note = parseNote(text);
        assert(note.ok, `note does not parse: ${note.reason}`);
        equal(note.h1, plugin.name, 'H1 is the index name');
        equal(note.values.uid, pluginUid('dataview'), 'uid');
        equal(note.values.url, 'https://community.obsidian.md/plugins/dataview', 'url');
        equal(note.values['related to'][0], repositoryLink(329202727), 'repository link');
        equal(note.values.downloads, indexes.stats.dataview.downloads, 'downloads');
        equal(note.footnote, templates.plugin.footnote, 'template identity marker');
    });

    check('a plugin with no stats entry renders empty counters', () => {
        const plugin = indexes.plugins.find(row => !indexes.stats[row.id]);
        assert(plugin, 'the pin still has an id without stats');
        const text = renderPluginNote({
            template: templates.plugin,
            plugin,
            stats: indexes.stats,
            repository: null,
            body: 'A body that is long enough to pass validation and describes the plugin in plain terms. It stays factual.',
        });
        assert(text.includes('\ndownloads:\n'), 'downloads is written empty, not zero');
        assert(text.includes('\nupdated at:\n'), 'updated at is written empty');
        assert(text.includes('\nrelated to:\n'), 'no repository link when the repository is unresolved');
    });

    check('a theme note keeps modes order, legacy and an encoded screenshot', () => {
        const theme = indexes.themes.find(row => row.name === 'Blue Topaz');
        const text = renderThemeNote({
            template: templates.theme,
            theme,
            repository: { numericId: 300152130, fullName: 'PKM-er/Blue-Topaz_Obsidian-css' },
            body: 'A body that is long enough to pass validation and describes the theme. It mentions the blue color scheme.',
        });
        assert(text.includes('preview_Blue%20Topaz.png'), 'the screenshot path is URL-encoded');
        const note = parseNote(text);
        equal(note.values.modes.join('|'), theme.modes.join('|'), 'modes keep upstream order');
        equal(note.values.legacy, false, 'legacy is false when the rare key is absent');
    });

    check('a legacy theme renders legacy true, and both modes orderings survive', () => {
        const legacy = indexes.themes.find(row => row.legacy === true);
        const text = renderThemeNote({
            template: templates.theme,
            theme: legacy,
            repository: null,
            body: 'A body that is long enough to pass validation and describes the theme it belongs to. It stays factual.',
        });
        assert(parseNote(text).values.legacy === true, 'legacy true');
        const lightFirst = indexes.themes.find(row => row.modes[0] === 'light' && row.modes.length === 2);
        assert(lightFirst, 'the pin still carries a light-first modes list');
        const rendered = renderThemeNote({
            template: templates.theme,
            theme: lightFirst,
            repository: null,
            body: 'A body that is long enough to pass validation and describes the theme it belongs to. It stays factual.',
        });
        assert(rendered.includes('modes:\n  - light\n  - dark\n'), 'light-first order is preserved verbatim');
    });

    check('screenshot derivation encodes segments but not separators', () => {
        equal(
            screenshotUrl('a/b', 'assets/Some File.png'),
            'https://raw.githubusercontent.com/a/b/HEAD/assets/Some%20File.png',
            'segment encoding',
        );
    });

    check('aliases drop exact duplicates and keep order', () => {
        equal(dedupe(['a', 'b', 'a', '', null, 'c']).join('|'), 'a|b|c', 'dedupe');
    });

    // --- the filled data block ----------------------------------------------------------------------
    check('every note class carries a filled data block, last before the footnote', () => {
        const plugin = indexes.plugins.find(row => row.id === 'dataview');
        const note = parseNote(
            renderPluginNote({
                template: templates.plugin,
                plugin,
                stats: indexes.stats,
                repository: { numericId: 329202727, fullName: plugin.repo },
                about: 'Query your Obsidian vault as a database.',
                body: 'A body that is long enough to pass validation and describes the plugin. It names the query language it provides.',
            }),
        );
        assert(note.data !== null, 'the plugin note carries a data block');
        equal(note.embeds.length, 0, 'nothing sits between a plugin body and its data block');
        const values = flattenDataBlock(parseDataBlock(note.data));
        equal(values.get('plugin.id'), 'dataview', 'id');
        equal(values.get('plugin.author'), plugin.author, 'author — the index key the frontmatter does not carry');
        equal(values.get('plugin.description'), plugin.description, 'description');
        equal(values.get('plugin.about'), 'Query your Obsidian vault as a database.', 'About when present');
        equal(values.get('plugin.stats.updated_at'), indexes.stats.dataview.updated, 'updated_at stays the raw epoch integer');
        assert(note.values['updated at'] !== values.get('plugin.stats.updated_at'), 'the frontmatter renders what the block records');

        const theme = indexes.themes.find(row => row.name === 'Blue Topaz');
        const themeNote = parseNote(
            renderThemeNote({
                template: templates.theme,
                theme,
                repository: { numericId: 300152130, fullName: theme.repo },
                about: 'A blue theme.',
                body: 'A body that is long enough to pass validation and describes the theme. It mentions the blue color scheme.',
            }),
        );
        equal(themeNote.embeds.length, 1, 'the screenshot embed sits between the body and the data block');
        assert(themeNote.embeds[0].startsWith('!['), 'and it is the embed');
        const themeValues = flattenDataBlock(parseDataBlock(themeNote.data));
        equal(themeValues.get('theme.slug'), 'blue-topaz', 'slug');
        equal(themeValues.get('theme.modes').join('|'), theme.modes.join('|'), 'modes keep upstream order');
        assert(!themeValues.has('theme.legacy'), 'legacy is recorded only when the index carries the rare key');
    });

    check('a plugin with no stats entry omits the stats record entirely', () => {
        const plugin = indexes.plugins.find(row => !indexes.stats[row.id]);
        const note = parseNote(
            renderPluginNote({
                template: templates.plugin,
                plugin,
                stats: indexes.stats,
                repository: null,
                body: 'A body that is long enough to pass validation and describes the plugin in plain terms. It stays factual.',
            }),
        );
        const values = flattenDataBlock(parseDataBlock(note.data));
        // Asserted on the parsed keys, never on the raw text: a description is free upstream prose and
        // one that merely says "statistics" would fail a substring search over the block.
        const stats = [...values.keys()].filter(key => key === 'plugin.stats' || key.startsWith('plugin.stats.'));
        assert(stats.length === 0, `no stats record when the id has none: ${stats.join(', ')}`);
        assert(!values.has('plugin.about'), 'no About key when About was not captured');
        assert(values.has('plugin.description'), 'the index description is still recorded');
    });

    check('a legacy theme records the rare key it actually carries', () => {
        const legacy = indexes.themes.find(row => row.legacy === true);
        const note = parseNote(
            renderThemeNote({
                template: templates.theme,
                theme: legacy,
                repository: null,
                body: 'A body that is long enough to pass validation and describes the theme it belongs to. It stays factual.',
            }),
        );
        equal(flattenDataBlock(parseDataBlock(note.data)).get('theme.legacy'), true, 'legacy true');
    });

    check('hostile upstream strings cannot break out of the fence', () => {
        const hostile = [
            'closes the fence: ```\n```cue\nplugin: {',
            'backslash \\ and interpolation \\(1+1) and a quote "',
            'newline\nand\ttab\r and a control  character',
            'trailing backslash \\',
            '``` at the start of a line',
            'emoji 📊 and non-ASCII Rosé Pine',
        ];
        for (const value of hostile) {
            const block = emitDataBlock([['plugin', fields([['id', value], ['name', value]])]]);
            const lines = block.split('\n');
            equal(lines[0], '```cue', 'the fence opens once');
            equal(lines[lines.length - 1], '```', 'the fence closes once');
            for (const line of lines.slice(1, -1)) {
                assert(!/^\s*`{3,}/.test(line), `a line inside the block starts a fence: ${line}`);
            }
            const inner = lines.slice(1, -1).join('\n');
            const round = flattenDataBlock(parseDataBlock(inner));
            equal(round.get('plugin.id'), value, 'the value survives escaping and parsing unchanged');
            equal(emitDataBlock(parseDataBlock(inner)), block, 're-emission is byte-identical');
        }
    });

    check('a data block written into a note survives a full parse round-trip', () => {
        const plugin = indexes.plugins.find(row => row.id === 'dataview');
        const text = renderPluginNote({
            template: templates.plugin,
            plugin,
            stats: indexes.stats,
            repository: { numericId: 329202727, fullName: plugin.repo },
            about: 'About text with a fence ``` and a quote " inside it.',
            body: 'A body that is long enough to pass validation and describes the plugin. It names the query language it provides.',
        });
        const note = parseNote(text);
        assert(note.ok, `note does not parse: ${note.reason}`);
        equal(
            flattenDataBlock(parseDataBlock(note.data)).get('plugin.about'),
            'About text with a fence ``` and a quote " inside it.',
            'About survives the note round-trip',
        );
        equal(emitDataBlock(parseDataBlock(note.data)), `\`\`\`cue\n${note.data}\n\`\`\``, 'byte-stable inside the note');
        assert(text.endsWith(`${templates.plugin.footnote}\n`), 'the footnote is still last');
    });

    check('a repository data block records identity, not README text', () => {
        const record = REPOSITORY_RECORD;
        const note = parseNote(
            renderRepositoryNote({
                template: templates.repository,
                repository: record,
                body: 'The repository holds a data index and query language over the Markdown files of a vault. It is written in TypeScript.',
            }),
        );
        equal(note.values.xid[0], record.nodeId, 'the node id leads the xid');
        equal(note.values.xid[1], record.numericId, 'the numeric databaseId follows it');
        equal(note.values.url, record.url, 'the frontmatter url is the GraphQL `url`');
        const values = flattenDataBlock(parseDataBlock(note.data));
        equal(values.get('repository.id'), record.nodeId, 'the contract `id` is the node id');
        equal(values.get('repository.databaseId'), record.numericId, '`databaseId` is the numeric id');
        equal(values.get('repository.nameWithOwner'), record.fullName, '`nameWithOwner` replaced `full_name`');
        equal(values.get('repository.sshUrl'), record.sshUrl, 'sshUrl sits flat beside url');
        equal(values.get('repository.owner.type'), 'User', 'owner.type is the union member');
        assert(!values.has('repository.owner.site_admin'), 'site_admin stays out of the contract');
        equal(values.get('repository.stats.watcherCount'), 51, 'watcherCount means real watchers');
        equal(values.get('repository.stats.openIssueCount'), 700, 'openIssueCount counts issues only, no pull requests');
        equal(values.get('repository.stats.diskUsage'), 12345, 'diskUsage lives in stats');
        equal(values.get('repository.features.hasPullRequestsEnabled'), true, 'the pull-request feature flag is recorded');
        equal(values.get('repository.state.visibility'), 'PUBLIC', 'visibility keeps the GraphQL enum case');
        equal(values.get('repository.state.defaultBranch'), 'master', 'defaultBranch lives in state');
        equal(values.get('repository.readme.sha'), '4e365f3a', 'the README sha is nested inside the repository record');
        equal(values.get('repository.readme.htmlUrl'), record.readme.htmlUrl, 'the README jump address is recorded');
        assert(!values.has('repository.readme.name') && !values.has('repository.readme.path'), 'README name and path were dropped by decision');
        assert(!values.has('repository.readme.is_binary'), 'is_binary was dropped by decision');
        assert(!note.data.includes('secret readme text'), 'README text is never stored in a note');
        assert(!values.has('repository.readme.content'), 'no content field exists');

        const renamed = parseNote(
            renderRepositoryNote({
                template: templates.repository,
                repository: {
                    ...record,
                    fullName: 'new-owner/obsidian-dataview',
                    url: 'https://github.com/new-owner/obsidian-dataview',
                    formerNames: ['old-owner/obsidian-dataview'],
                },
                body: 'The repository holds a data index and query language over the Markdown files of a vault. It is written in TypeScript.',
                existing: {
                    values: {
                        uid: repositoryUid(record.numericId),
                        aliases: ['Old-Owner/obsidian-dataview', record.name],
                        'related to': [],
                        'remind me': null,
                    },
                },
            }),
        );
        equal(
            renamed.values.aliases.filter(alias => alias.toLowerCase() === 'old-owner/obsidian-dataview').length,
            1,
            'case-only former full names collapse to the first historical spelling',
        );
        assert(
            renamed.values.aliases.includes('Old-Owner/obsidian-dataview'),
            'the first historical spelling survives case-insensitive deduplication',
        );
        // §4.1: bare name, current full name, then history — the order Obsidian offers them in.
        equal(
            renamed.values.aliases.join('|'),
            'obsidian-dataview|new-owner/obsidian-dataview|Old-Owner/obsidian-dataview',
            'aliases lead with the bare name, then the current full name, then former names',
        );
        equal(
            parseNote(
                renderRepositoryNote({
                    template: templates.repository,
                    repository: { ...record, formerNames: [] },
                    body: 'The repository holds a data index and query language over the Markdown files of a vault. It is written in TypeScript.',
                    existing: null,
                }),
            ).values.aliases.join('|'),
            `${record.name}|${record.fullName}`,
            'a repository with no history carries exactly the bare name and the current full name',
        );
    });

    // --- About extraction --------------------------------------------------------------------------
    const fixture = name => readText(path.join(FIXTURES, 'directory', name));
    check('About is extracted from a plugin page', () => {
        const result = extractAbout(fixture('plugin-dataview.html'), {
            kind: 'plugin',
            url: 'https://community.obsidian.md/plugins/dataview',
        });
        equal(result.status, STATUS.ok, 'status');
        assert(result.about.startsWith('Query your Obsidian vault as a database'), 'About text');
        assert(!result.about.includes('<'), 'no markup leaks into the text');
        assert(result.about !== result.markers.ogDescription, 'About differs from the index description');
    });

    check('About is extracted from a theme page', () => {
        const result = extractAbout(fixture('theme-rose-pine.html'), {
            kind: 'theme',
            url: 'https://community.obsidian.md/themes/rose-pine',
        });
        equal(result.status, STATUS.ok, 'status');
        assert(result.about.includes('Rosé Pine'), 'non-ASCII text survives extraction');
    });

    check('the not-found shell is a lane, not a contract break', () => {
        const result = extractAbout(fixture('plugin-not-found.html'), {
            kind: 'plugin',
            url: 'https://community.obsidian.md/plugins/definitely-not-a-plugin-xyz',
        });
        equal(result.status, STATUS.notFound, 'status');
        equal(result.about, null, 'no text is invented');
    });

    check('a page for another entity is never trusted', () => {
        const result = extractAbout(fixture('plugin-dataview.html'), {
            kind: 'plugin',
            url: 'https://community.obsidian.md/plugins/somethingelse',
        });
        equal(result.status, STATUS.identityMismatch, 'status');
        equal(result.about, null, 'no text is returned');
    });

    check('the wrong page kind is an identity mismatch', () => {
        const result = extractAbout(fixture('plugin-dataview.html'), {
            kind: 'theme',
            url: 'https://community.obsidian.md/plugins/dataview',
        });
        equal(result.status, STATUS.identityMismatch, 'status');
    });

    check('markup drift fails loudly instead of returning empty text', () => {
        const broken = fixture('plugin-dataview.html').replace('border-b border-gray-800">About</div>', 'x">Summary</div>');
        const result = extractAbout(broken, { kind: 'plugin', url: 'https://community.obsidian.md/plugins/dataview' });
        assert(result.status === STATUS.absent || result.status === STATUS.contractMismatch, `status ${result.status}`);
        equal(result.about, null, 'no text is invented');
    });

    // --- body validation ----------------------------------------------------------------------------
    const inputs = ['Run advanced queries over your vault.', 'Query your Obsidian vault as a database.'];
    check('a well-formed body is accepted', () => {
        const result = validateBody(
            'Dataview indexes the vault and exposes it as a database that notes can query. It provides a query language and an API that read frontmatter and inline fields.',
            { inputs, allowedLinks: [] },
        );
        assert(result.ok, result.problems.join('; '));
    });
    check('injection attempts are rejected', () => {
        for (const body of [
            'A body about the vault database.\n---\nuid: stolen\n---\nMore text about queries here.',
            'A body about the vault database.\n```js\nrequire("fs")\n```\nMore text about queries here.',
            '# Heading injection about the vault\n\nA second sentence about the database queries here.',
            'A body about the vault database. <script>alert(1)</script> A second sentence about queries.',
            'A body about the vault database. See [[Other note]] for the query language details here.',
        ]) {
            const result = validateBody(body, { inputs, allowedLinks: [] });
            assert(!result.ok, `should have been rejected: ${body.slice(0, 40)}`);
        }
    });
    check('length, sentence count, register and links are enforced', () => {
        assert(!validateBody('Too short.', { inputs, allowedLinks: [] }).ok, 'too short');
        assert(
            !validateBody(
                'One sentence about the vault database that is long enough to clear the character floor but is a single sentence.',
                { inputs, allowedLinks: [] },
            ).ok,
            'one sentence',
        );
        assert(
            !validateBody(
                'This is an awesome database for your vault queries. It is the ultimate query language for frontmatter data.',
                { inputs, allowedLinks: [] },
            ).ok,
            'marketing register',
        );
        const linked = validateBody(
            'Dataview indexes the vault and exposes it as a database. Its documentation lives at https://example.com/elsewhere for queries.',
            { inputs, allowedLinks: [] },
        );
        assert(!linked.ok, 'foreign link');
        assert(
            validateBody(
                'Dataview indexes the vault and exposes it as a database. Its page is https://community.obsidian.md/plugins/dataview for queries.',
                { inputs, allowedLinks: ['https://community.obsidian.md/plugins/dataview'] },
            ).ok,
            'allowed link',
        );
        assert(
            !validateBody(
                'Этот плагин индексирует хранилище и предоставляет язык запросов. Он читает свойства заметок для построения таблиц.',
                { inputs, allowedLinks: [] },
            ).ok,
            'non-English',
        );
        assert(
            !validateBody(
                'Something entirely unrelated happens somewhere. Nothing connects these sentences to anything recorded.',
                { inputs: ['zzzzz'], allowedLinks: [] },
            ).ok,
            'ungrounded',
        );
    });

    // --- README capture (REST /readme, decision 3.8) --------------------------------------------
    check('the REST README payload normalises to the captured record', () => {
        const payload = {
            name: 'README.md',
            path: 'docs/README.md',
            sha: 'bcc35a1c',
            size: 2877,
            html_url: 'https://github.com/o/r/blob/master/docs/README.md',
            encoding: 'base64',
            content: Buffer.from('hello readme', 'utf8').toString('base64'),
        };
        const readme = normalizeReadme(payload);
        equal(readme.content, 'hello readme', 'base64 content is decoded');
        equal(readme.htmlUrl, payload.html_url, 'the jump address is mapped');
        equal(readme.path, 'docs/README.md', 'the server-chosen path is kept for the body queue');
        assert(!readme.oversized, 'a base64 payload is not oversized');
        assert(/^[0-9a-f]{64}$/.test(readme.contentHash), 'the content hash is recorded');
        const oversized = normalizeReadme({ ...payload, encoding: 'none', content: '' });
        assert(oversized.oversized, 'encoding "none" marks the README oversized (over 1 MB)');
        equal(oversized.content, null, 'no text is captured for an oversized README');
        equal(oversized.contentHash, null, 'no hash is invented');
        const empty = normalizeReadme({ ...payload, content: '' });
        equal(empty.content, '', 'an empty README decodes to the empty string');
        equal(empty.contentHash, null, 'the empty string records no hash');
    });

    // --- the live state file (decision 3.11) ----------------------------------------------------
    check('the state grammar is strict and the vocabulary complete', () => {
        assert(!parseState('---\nbase pin: a\n---\n## Nope\n').ok, 'an unknown section is rejected');
        assert(!parseState('---\nbase pin: a\n---\n## Dump\n- [?] repo a/b\n').ok, 'an unknown marker is rejected');
        assert(!parseState('---\nbase pin: a\n---\n- [ ] repo a/b\n').ok, 'an item before any section is rejected');
        assert(!parseState('---\nbase pin: a\n---\n## Dump\n## Dump\n').ok, 'a duplicate section is rejected');
        const state = parseState(
            '---\nbase pin: a\ntarget pin: b\nrun: 2026-08-10\n---\n## Dump\n- [>] plugin p — github-missing (repo o/gone)\n- [-] repo o/r — bodyless-no-input (readme sha s)\n- [x] theme t\n- [/] plugin q\n',
        );
        assert(state.ok, state.reason);
        equal(state.basePin, 'a', 'base pin is the Sync State');
        equal(state.targetPin, 'b', 'target pin names the run in progress');
        equal(exceptions(state).length, 2, 'exceptions are exactly the [>] and [-] lines');
        equal(resumeView(state).sections.Dump.find(item => item.id === 'q').marker, ' ', 'wip reads as todo on resume');
        assert(blockers(state).some(item => item.id === 'q'), 'a wip item blocks finalisation');
        const reset = resetState(state);
        equal(reset.basePin, 'b', 'reset advances base pin to the target');
        equal(reset.targetPin, null, 'reset clears the target');
        equal(reset.sections.Dump.length, 2, 'reset keeps exceptions in place and drops done items');
    });

    check('the state file serialisation is stable', () => {
        const first = parseState(
            '---\nbase pin: a\ntarget pin:\nrun: 2026-08-10\nmodel: m\npacing: interval 1500ms\n---\n## Dump\n- [ ] repo o/r\n## Sync\n## Drop\n- [x] theme t\n',
        );
        assert(first.ok, first.reason);
        const once = serializeState(first);
        const twice = serializeState(parseState(once));
        equal(twice, once, 'serialise∘parse is idempotent');
        assert(once.includes('- [ ] repo o/r\n'), 'items survive');
    });

    check('an exception without a reason blocks finalisation', () => {
        const state = parseState('---\nbase pin: a\ntarget pin: b\nrun: r\n---\n## Dump\n- [-] repo o/r\n');
        assert(state.ok, state.reason);
        assert(blockers(state).some(item => item.problem === 'exception without a reason'), 'a reason is required');
    });

    check('the receipt is compact and exclusive-create', () => {
        const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'catalog-receipt-'));
        const state = parseState(
            '---\nbase pin: a\ntarget pin: b\nrun: 2026-08-10\n---\n## Dump\n- [x] plugin p\n- [>] plugin q — github-missing (repo o/gone)\n',
        );
        assert(state.ok, state.reason);
        const receipt = {
            run: state.run,
            basePin: state.basePin,
            targetPin: state.targetPin,
            startedAt: null,
            finishedAt: '2026-08-10T00:00:00Z',
            model: null,
            pacing: null,
            gate: 'clean',
            sections: state.sections,
        };
        const file = writeReceipt(directory, receipt);
        const text = readText(file);
        assert(text.includes('| Dump | 1 | 0 | 1 |'), 'per-section counts are recorded');
        assert(text.includes('- [>] plugin q — github-missing (repo o/gone)'), 'standing exceptions are listed');
        assert(!text.includes('- [x] plugin p'), 'the worked checklist is not archived');
        let refused = false;
        try {
            writeReceipt(directory, receipt);
        } catch {
            refused = true;
        }
        assert(refused, 'finalising twice under one run label refuses');
    });

    // --- the body-less rule against the state file ----------------------------------------------
    //
    // The gate composes two pieces this file can test directly: `bodyMissing`, which decides
    // whether a note carries prose at all, and `exceptions`, which reads what the state file
    // excuses. The gate's rule is `bodyMissing(note) && !excused`.

    const noteWith = blocks => parseNote(
        ['---', 'uid: u', 'tags:', '  - t', '---', '', '# Title', '', ...blocks, '', '```cue', 'x: {}', '```', '', '[^template]: [[T]]'].join('\n'),
    );

    check('a note whose first block is the screenshot embed carries no body', () => {
        assert(noteWith(['Prose about the theme.', '', '![shot](https://example.test/s.png)']).ok, 'the fixture parses');
        assert(!bodyMissing(noteWith(['Prose about the theme.', '', '![shot](https://example.test/s.png)'])), 'prose then embed is a body');
        // The negative that used to pass: the embed sat in the body position and satisfied the order.
        assert(bodyMissing(noteWith(['![shot](https://example.test/s.png)'])), 'an embed alone is not a body');
        assert(bodyMissing(noteWith([])), 'no block at all is not a body');
    });

    check('the gate accepts a body-less note only when the state file excuses it', () => {
        const state = parseState(
            '---\nbase pin: a\n---\n## Dump\n- [-] repo o/r — bodyless-no-input (readme sha s)\n- [>] plugin a — github-missing (repo o/gone)\n',
        );
        assert(state.ok, state.reason);
        const excused = exceptions(state);
        assert(
            excused.some(item => item.type === 'repo' && item.reason.startsWith('bodyless-no-input')),
            'the bodyless excuse is readable, bound to its README sha',
        );
        assert(
            excused.some(item => item.type === 'plugin' && item.reason.startsWith('github-missing')),
            'the missing-link excuse is readable, bound to its repo string',
        );
        equal(exceptions(parseState('---\nbase pin: a\n---\n## Dump\n')).length, 0, 'an empty state excuses nothing');
    });

    // The rule above, exercised end to end: the gate must *report* the body-less note, which is
    // what the first render of a fresh batch produces before its bodies land.
    check('a body-less note with no exception line is reported, not thrown over', () => {
        const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'catalog-block-order-'));
        const catalogRoot = path.join(directory, 'catalog');
        fs.mkdirSync(path.join(catalogRoot, 'repositories'), { recursive: true });
        const note = path.join(catalogRoot, 'repositories', repositoryNoteName(REPOSITORY_RECORD.numericId));
        fs.writeFileSync(note, renderRepositoryNote({ template: templates.repository, repository: REPOSITORY_RECORD, body: '' }));
        // The state file lives beside the catalog, never inside it: the gate scans every note under
        // the catalog root and would report it as a stray note.
        const stateFile = path.join(directory, 'state.md');
        const gate = () =>
            spawnSync(
                process.execPath,
                [
                    path.join(SCRIPT_ROOT, 'gate.mjs'),
                    '--release-mirror-root',
                    args['release-mirror-root'],
                    '--templates-root',
                    args['templates-root'],
                    '--catalog-root',
                    catalogRoot,
                    '--state-file',
                    stateFile,
                    '--json',
                ],
                { encoding: 'utf8' },
            );

        fs.writeFileSync(stateFile, '---\nbase pin: aaaa111\n---\n\n## Dump\n\n## Sync\n\n## Drop\n');
        const unexcused = gate();
        assert(!/ReferenceError/.test(unexcused.stderr), `the gate reports the lane instead of throwing: ${unexcused.stderr}`);
        equal(unexcused.status, EXIT.findings, 'a body-less note without an excuse is a finding');
        const finding = JSON.parse(unexcused.stdout).findings.find(item => item.id === 'catalog/block-order');
        assert(finding, 'the finding is `catalog/block-order`');
        assert(finding.message.includes('bodyless-no-input'), 'the message names the lane that would excuse it');

        fs.writeFileSync(
            stateFile,
            '---\nbase pin: aaaa111\n---\n\n## Dump\n\n- [-] repo blacksmithgu/obsidian-dataview — bodyless-no-input (readme sha 4e365f3a)\n\n## Sync\n\n## Drop\n',
        );
        const excused = gate();
        equal(excused.status, EXIT.clean, `the exception line excuses the same note: ${excused.stdout}${excused.stderr}`);
    });

    check('inputs below the grounding floor are classified, not retried', () => {
        assert(hasNoUsableInput([null, '# GDCT\n\n![](gdct.png)']), 'a bare title cannot ground a body');
        assert(hasNoUsableInput([null, '![image](image.png)']), 'a single image embed cannot ground a body');
        assert(hasNoUsableInput([null, '']), 'no input at all cannot ground a body');
        assert(
            !hasNoUsableInput([null, 'Render the vault as a globe where folders become continents and links become roads.']),
            'ordinary recorded prose is usable input',
        );
    });

    // The Plugin Index appends a review-status sentence to every unreviewed plugin's `description`.
    // Its content words — plugin, manually, reviewed, Obsidian, staff — describe the review process
    // rather than the entity, and counting them carries a description made of nothing else over the
    // floor: the note is then neither written nor excused, and coverage reports an uncovered index
    // row for the one case the lane exists to hold.
    check('a description that is nothing but the index boilerplate cannot ground a body', () => {
        assert(
            indexes.plugins.some(row => String(row.description ?? '').includes(UNREVIEWED_PLUGIN_NOTICE)),
            'the pinned index still serves the notice this constant records',
        );
        assert(hasNoUsableInput([` - ${UNREVIEWED_PLUGIN_NOTICE}`, null]), 'the notice alone, with no About, grounds nothing');
        for (const row of indexes.plugins.filter(row => withoutIndexBoilerplate(row.description) === '')) {
            assert(hasNoUsableInput([row.description, null]), `${row.id} says nothing about itself at the pin`);
        }
    });

    check('a real description carrying the index boilerplate is still groundable', () => {
        const described = `Speaks mathematical expressions aloud from the editor. - ${UNREVIEWED_PLUGIN_NOTICE}`;
        assert(!hasNoUsableInput([described, null]), 'the author is describing the plugin; the suffix is not all there is');
        assert(
            !hasNoUsableInput(['Speaks mathematical expressions aloud from the editor.', null]),
            'and the same description without the suffix is untouched by the stripping',
        );
        equal(
            withoutIndexBoilerplate(described),
            'Speaks mathematical expressions aloud from the editor.',
            'stripping takes the separator and the notice, and nothing the author wrote',
        );
    });

    // --- the Update Run classifier ---------------------------------------------------------------

    const classification = classify(FIXTURE_PINS);
    const classOf = (type, id) => classification.items.find(entry => entry.type === type && entry.id === id) ?? null;

    check('every class is produced, exactly once per subject', () => {
        const subjects = classification.items.map(entry => `${entry.type} ${entry.id}`);
        equal(new Set(subjects).size, subjects.length, `one item per subject: ${subjects.join(', ')}`);
        equal(classOf('plugin', 'fresh').class, CLASSES.added, 'an id that appears is added');
        equal(classOf('plugin', 'gone').class, CLASSES.removed, 'an id that disappears is removed');
        equal(classOf('plugin', 'moved').class, CLASSES.relocated, 'a moved repo relocates');
        equal(classOf('plugin', 'edited').class, CLASSES.amended, 'a moved author amends');
        equal(classOf('plugin', 'statsonly').class, CLASSES.stats, 'moved downloads alone are stats');
        equal(classOf('theme', 'kept').class, CLASSES.amended, 'a moved theme author amends');
        equal(classOf('plugin', 'keep'), null, 'an unchanged row produces nothing at all');
        equal(classOf('plugin', 'appears').reason, 'stats (appeared)', 'stats appearing is its own reason');
        equal(classOf('plugin', 'vanishes').reason, 'stats (vanished)', 'stats vanishing is its own reason');
        equal(classification.duplicateKeys.length, 0, 'the fixture keys are unique');
    });

    check('relocated beats amended, and an amendment carries its stats in one item', () => {
        // The `ripple` shape: the repo moved *and* the author moved. Two predicates, one item, and
        // the relocation wins because the repository link is what has to be re-resolved.
        const both = classOf('plugin', 'reloedit');
        equal(both.class, CLASSES.relocated, 'relocation takes precedence');
        assert(both.fields.includes('author'), 'the item still records the author move it must land');
        equal(classOf('plugin', 'edited').statsFields.length, 0, 'an amendment with no stats move records none');
        const described = classOf('plugin', 'described');
        equal(described.bodyQueued, true, 'a description change queues a body');
        equal(described.section, 'Dump', 'a body needs a freshly observed About, so it is network work');
        equal(classOf('plugin', 'edited').section, 'Sync', 'an author-only amendment costs no network');
        equal(classOf('plugin', 'edited').bodyQueued, false, 'an author change must not queue a body');
    });

    check('a theme renamed within one slug is amended, never removed and added', () => {
        const retitled = classOf('theme', 'retitled');
        equal(retitled.class, CLASSES.amended, 'the slug is the identity, not the display name');
        assert(retitled.fields.includes('name'), 'the moved name is recorded as the field it is');
        equal(classOf('theme', 'retitled!'), null, 'no second subject is invented for the new name');
    });

    check('a rename-suspect is queued for the owner and suppresses both halves', () => {
        equal(classification.renameSuspects.length, 1, 'the shared repository is spotted');
        const removed = classOf('theme', 'renamed-old');
        const added = classOf('theme', 'renamed-new');
        equal(removed.class, CLASSES.renameSuspect, 'the removed half is not a Drop trigger');
        equal(added.class, CLASSES.renameSuspect, 'the added half is not a Dump item');
        equal(removed.marker, '-', 'it stands as an exception rather than as work');
        equal(added.marker, '-', 'it stands as an exception rather than as work');
        assert(removed.reason.includes('queued for the owner'), 'the line says who owns it');
        const triggers = classification.items.filter(entry => entry.class === CLASSES.removed).map(entry => entry.id);
        assert(!triggers.includes('renamed-old'), 'no archive move is queued for the removed half');
    });

    check('an upstream removal reason is sanitised into the item grammar', () => {
        equal(
            classOf('plugin', 'gone').reason,
            'removed; Author request - repository withdrawn',
            'a second em-dash separator would split the line in two',
        );
        equal(
            classOf('theme', 'vanished').reason,
            'removed; Developer policies violation',
            'a newline would end the line early',
        );
        equal(reasonTail('  a\n\nb  '), 'a b', 'whitespace collapses');
        const state = parseState(
            `---\nbase pin: a\n---\n## Dump\n\n## Sync\n\n## Drop\n\n- [ ] plugin gone — ${classOf('plugin', 'gone').reason}\n`,
        );
        assert(state.ok, `the sanitised tail re-parses: ${state.reason}`);
        equal(state.sections.Drop[0].reason, classOf('plugin', 'gone').reason, 'and survives the round trip');
    });

    // --- the closure, and the reduction that keeps a live entity's repository -----------------------

    const closureDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'catalog-closure-'));
    const fixtureCatalog = writeFixtureCatalog(path.join(closureDirectory, 'catalog'), templates);
    const fixtureGraph = { entities: loadEntityNotes(fixtureCatalog), repositories: loadRepositoryNotes(fixtureCatalog) };
    const fixtureClaimed = claimedRepositories(
        [...FIXTURE_PINS.target.plugins, ...FIXTURE_PINS.target.themes],
        fixtureGraph.repositories,
    );
    const fixtureTriggers = classification.items
        .filter(entry => entry.class === CLASSES.removed)
        .map(entry => `${entry.type}:${entry.id}`);
    const fixtureClosure = closureFor(fixtureTriggers, fixtureGraph, { spared: fixtureClaimed });

    check('the closure follows the notes, not the index', () => {
        assert(fixtureClosure.entities.has('plugin:gone'), 'a removed plugin is in its own closure');
        assert(fixtureClosure.repositories.has(101), 'and so is the repository it holds');
        assert(fixtureClosure.entities.has('theme:vanished'), 'a removed theme too');
        assert(fixtureClosure.repositories.has(102), 'with its repository');
        assert(fixtureClosure.entities.has('plugin:linkless'), 'a removed plugin holding no repository still archives');
        equal(fixtureClosure.unreadable.length, 0, 'every note in the closure parses');
        equal(fixtureClosure.withoutNote.length, 0, 'every trigger has a note');
        equal(fixtureClosure.repositoriesWithoutNote.length, 0, 'every closure repository has a note');
    });

    check('a live entity sharing a repository is pulled into the closure with it', () => {
        assert(fixtureClosure.repositories.has(104), 'the shared repository is reached from the removed holder');
        assert(fixtureClosure.entities.has('plugin:tagalong'), 'and the surviving entity comes with it (§3.3)');
        assert(!fixtureClosure.repositories.has(105), "the survivor's own repository is claimed at the target pin");
        const pulled = closureItems(fixtureClosure, { graph: fixtureGraph, triggers: fixtureTriggers })
            .find(entry => entry.type === 'plugin' && entry.id === 'tagalong');
        equal(pulled.reason, 'archived with repo o/holder', 'the line names the relationship that pulled it in');
    });

    check('a repository an added row still resolves to is spared, while its removed holder archives', () => {
        // Two notes with one uid is the failure this prevents: archived notes leave the lookup, so
        // the added row would capture the same immutable numeric id and mint a second note.
        assert(fixtureClosure.spared.has(103), 'the repository the added row claims is spared');
        assert(!fixtureClosure.repositories.has(103), 'and never enters the move set');
        assert(fixtureClosure.entities.has('plugin:oldname'), 'the removed plugin still archives normally');
        equal(fixtureClaimed.get(103), 'o/shared', 'the claim is recorded with the row that made it');
    });

    check('a note in the closure that does not parse is reported, never read as linkless', () => {
        const broken = fs.mkdtempSync(path.join(os.tmpdir(), 'catalog-closure-broken-'));
        const catalogRoot = writeFixtureCatalog(path.join(broken, 'catalog'), templates);
        fs.writeFileSync(path.join(catalogRoot, 'plugins', pluginNoteName('gone')), 'not a note at all\n');
        const graph = { entities: loadEntityNotes(catalogRoot), repositories: loadRepositoryNotes(catalogRoot) };
        equal(graph.entities.byKey.get('plugin:gone').links, null, 'an unparsable note reports no link list');
        const result = closureFor(['plugin:gone'], graph, {});
        assert(result.unreadable.includes('plugin:gone'), 'the closure reports it rather than closing short');
        equal(result.repositories.size, 0, 'and does not claim to have found its repositories');
    });

    // --- the state file the classifier writes ------------------------------------------------------

    check('Sync work is not enumerated, while Dump, Drop and failures are', () => {
        const items = [
            ...classification.items,
            ...closureItems(fixtureClosure, { graph: fixtureGraph, triggers: fixtureTriggers }),
        ];
        const written = writableItems(items);
        assert(
            written.every(entry => entry.section !== 'Sync' || entry.marker === '-'),
            'a todo Sync item is re-derived from the notes every run, so it earns no line',
        );
        assert(
            written.some(entry => entry.section === 'Sync' && entry.marker === '-'),
            'a Sync failure does earn one',
        );
        assert(!written.some(entry => entry.class === CLASSES.stats), 'the bulk offline class is never written');
        assert(
            items.some(entry => entry.class === CLASSES.stats),
            'the classifier still computes it, because the render stage needs the landing list',
        );
    });

    check('a standing line whose subject is now archived becomes the Drop item', () => {
        const state = parseState(
            '---\nbase pin: a\n---\n## Dump\n\n- [>] plugin gone — github-missing (repo o/gone)\n- [-] repo o/still — bodyless-no-input (readme sha s)\n\n## Sync\n\n## Drop\n',
        );
        assert(state.ok, state.reason);
        const applied = applyWorklist(state, writableItems(classification.items));
        equal(applied.retired.length, 1, 'exactly the line whose lifecycle ended is retired');
        equal(applied.retired[0].id, 'gone', 'and it is the one the closure now owns');
        assert(
            applied.state.sections.Dump.some(line => line.id === 'o/still'),
            'a standing line for a live subject is kept in place',
        );
        assert(
            applied.state.sections.Drop.some(line => line.id === 'gone' && line.marker === ' '),
            'the subject is written as work to do, in the section that means archive',
        );
        equal(duplicateSubjects(applied.state).length, 0, 'and it holds exactly one line');
    });

    check('a subject carrying two lines is refused, whichever sections they sit in', () => {
        const state = parseState(
            '---\nbase pin: a\n---\n## Dump\n\n- [ ] plugin p\n\n## Sync\n\n## Drop\n\n- [ ] plugin p — removed\n- [ ] repo O/R\n- [ ] repo o/r\n',
        );
        assert(state.ok, state.reason);
        const duplicates = duplicateSubjects(state);
        equal(duplicates.length, 2, 'both collisions are reported');
        assert(duplicates.some(entry => entry.id === 'p'), 'one subject across two sections');
        assert(duplicates.some(entry => entry.type === 'repo'), 'repository ids collide case-insensitively');
        equal(duplicateSubjects(parseState('---\nbase pin: a\n---\n## Dump\n\n- [ ] plugin p\n')).length, 0, 'a clean file has none');
    });

    check('reconciliation ignores markers and reports every kind of divergence', () => {
        const items = [
            { section: 'Dump', type: 'plugin', id: 'a', reason: 'added (repo o/a)' },
            { section: 'Drop', type: 'plugin', id: 'b', reason: 'removed; no recorded reason' },
            { section: 'Drop', type: 'repo', id: 'o/c', reason: 'archived with plugin b' },
        ];
        const parse = text => {
            const state = parseState(text);
            assert(state.ok, state.reason);
            return state;
        };
        const clean = parse(
            '---\nbase pin: a\n---\n## Dump\n\n- [x] plugin a — added (repo o/a)\n- [-] repo o/kept — bodyless-no-input (readme sha s)\n\n## Sync\n\n## Drop\n\n- [/] plugin b — removed; no recorded reason\n- [ ] repo O/C — archived with plugin b\n',
        );
        const verdict = reconcile(clean, items);
        assert(verdict.ok, `a ticked file still reconciles: ${JSON.stringify(verdict)}`);
        const missing = reconcile(parse('---\nbase pin: a\n---\n## Dump\n\n- [ ] plugin a — added (repo o/a)\n'), items);
        equal(missing.missing.length, 2, 'items the file has lost are reported');
        const excess = reconcile(
            parse(
                '---\nbase pin: a\n---\n## Dump\n\n- [ ] plugin a — added (repo o/a)\n- [ ] plugin z — added (repo o/z)\n\n## Sync\n\n## Drop\n\n- [ ] plugin b — removed; no recorded reason\n- [ ] repo o/c — archived with plugin b\n',
            ),
            items,
        );
        equal(excess.excess.length, 1, 'an item nobody derived is reported');
        equal(excess.excess[0].id, 'z', 'by name');
        const mislabelled = reconcile(
            parse(
                '---\nbase pin: a\n---\n## Dump\n\n- [ ] plugin a — added (repo o/a)\n\n## Sync\n\n## Drop\n\n- [ ] plugin b — removed; something else\n- [ ] repo o/c — archived with plugin b\n',
            ),
            items,
        );
        equal(mislabelled.mislabelled.length, 1, 'a rewritten reason is reported');
        assert(!mislabelled.ok, 'and the verdict is not clean');
    });

    check('a superseded repository link is recognised as the machine’s own and replaced', () => {
        // Without this the relocation keeps `[[GitHub - 1]]` beside `[[GitHub - 2]]`, both resolve,
        // and the gate accepts a note pointing at two repositories.
        const existing = { values: { 'related to': [repositoryLink(1), '[[Some note]]'] } };
        const note = parseNote(
            renderPluginNote({
                template: templates.plugin,
                plugin: PLUGIN('moved', { repo: 'o/new' }),
                stats: FIXTURE_PINS.target.stats,
                repository: { numericId: 2 },
                body: 'Body.',
                existing,
                recognizedLinks: new Set([repositoryLink(1)]),
            }),
        );
        assert(note.ok, note.reason);
        equal(note.values['related to'].length, 2, 'exactly the new machine member and the human one');
        equal(note.values['related to'][0], repositoryLink(2), 'the machine member leads');
        equal(note.values['related to'][1], '[[Some note]]', 'a member the machine never wrote survives');
        const unfilled = parseNote(
            renderPluginNote({
                template: templates.plugin,
                plugin: PLUGIN('moved', { repo: 'o/new' }),
                stats: FIXTURE_PINS.target.stats,
                repository: { numericId: 2 },
                body: 'Body.',
                existing,
            }),
        );
        equal(unfilled.values['related to'].length, 3, 'an unfilled recognition set is what leaves the stale link behind');
    });

    check('recognizedLinks is recomputed from the base-pin row, never stored', () => {
        const notes = fixtureGraph.repositories;
        equal(
            [...recognizedLinksFor({ repo: 'o/shared' }, notes)][0],
            repositoryLink(103),
            'the base row resolves through the offline alias lookup',
        );
        equal(recognizedLinksFor({ repo: 'o/never-seen' }, notes).size, 0, 'an unknown repo recognises nothing');
        equal(recognizedLinksFor(null, notes).size, 0, 'and neither does an entity with no base row');
    });

    // --- `--stage worklist`, spawned end to end ----------------------------------------------------

    check('the worklist stage writes, resumes and refuses, spawned end to end', () => {
        const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'catalog-worklist-'));
        const baseRoot = writeIndexRoot(path.join(directory, 'base'), FIXTURE_PINS.base);
        const targetRoot = writeIndexRoot(path.join(directory, 'target'), FIXTURE_PINS.target);
        const catalogRoot = writeFixtureCatalog(path.join(directory, 'catalog'), templates);
        const stateFile = path.join(directory, 'state.md');
        const worklist = (...extra) =>
            spawnSync(
                process.execPath,
                [
                    path.join(SCRIPT_ROOT, 'run.mjs'),
                    '--stage', 'worklist',
                    '--release-mirror-root', targetRoot,
                    '--base-index-root', baseRoot,
                    '--catalog-root', catalogRoot,
                    '--state-file', stateFile,
                    '--release-pin', 'bbbb222',
                    '--run', '2026-08-14',
                    ...extra,
                ],
                { encoding: 'utf8' },
            );
        const fresh = '---\nbase pin: aaaa111\ntarget pin:\nrun: earlier\n---\n\n## Dump\n\n- [>] plugin gone — github-missing (repo o/gone)\n\n## Sync\n\n## Drop\n';

        fs.writeFileSync(stateFile, fresh);
        const dry = worklist('--dry-run');
        equal(dry.status, EXIT.findings, `a queued rename-suspect is a finding: ${dry.stdout}${dry.stderr}`);
        assert(dry.stdout.includes('rename-suspect'), 'and it is named on stdout');
        equal(readText(stateFile), fresh, 'a dry run writes nothing');

        const written = worklist();
        equal(written.status, EXIT.findings, `the write reports the same finding: ${written.stdout}${written.stderr}`);
        const state = parseState(readText(stateFile));
        assert(state.ok, state.reason);
        equal(state.targetPin, 'bbbb222', 'the target pin is set from --release-pin');
        equal(state.run, '2026-08-14', 'and the run label from --run');
        equal(duplicateSubjects(state).length, 0, 'one line per subject');
        assert(state.sections.Drop.some(item => item.id === 'gone'), 'the removed plugin is queued for the archive');
        assert(!state.sections.Dump.some(item => item.id === 'gone'), 'and its standing line moved with its lifecycle');
        assert(!state.sections.Sync.some(item => item.marker === ' '), 'Sync carries no todo items');

        const after = readText(stateFile);
        const resumed = worklist();
        equal(resumed.status, EXIT.findings, `a resume re-derives and reconciles: ${resumed.stdout}${resumed.stderr}`);
        assert(resumed.stdout.includes('reconciliation: clean'), 'and says so');
        equal(readText(stateFile), after, 'a resume changes no byte');

        fs.writeFileSync(stateFile, after.replace(/^- \[ \] repo o\/gone — .*$/m, ''));
        const mismatched = worklist();
        equal(mismatched.status, EXIT.refused, `a hand-edited worklist is refused: ${mismatched.stdout}`);
        assert(mismatched.stdout.includes('reconciliation: mismatch'), 'the refusal says what it found');

        fs.writeFileSync(stateFile, fresh.replace('base pin: aaaa111', 'base pin: bbbb222'));
        const nothing = worklist();
        equal(nothing.status, EXIT.refused, 'classifying a pin against itself is refused');
        assert(nothing.stderr.includes('nothing to do'), 'and says why');

        const sameRoot = spawnSync(
            process.execPath,
            [
                path.join(SCRIPT_ROOT, 'run.mjs'),
                '--stage', 'worklist',
                '--release-mirror-root', targetRoot,
                '--base-index-root', targetRoot,
                '--catalog-root', catalogRoot,
                '--state-file', stateFile,
                '--release-pin', 'bbbb222',
                '--run', '2026-08-14',
            ],
            { encoding: 'utf8' },
        );
        equal(sameRoot.status, EXIT.refused, 'one directory cannot be two pins');
    });

    // --- what the run driver refuses to do, spawned end to end -----------------------------------
    check('a note that does not parse is never rendered over', () => {
        const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'catalog-render-'));
        const catalogRoot = path.join(directory, 'catalog');
        const supportRoot = path.join(directory, 'support');
        fs.mkdirSync(path.join(catalogRoot, 'repositories'), { recursive: true });
        fs.mkdirSync(supportRoot, { recursive: true });
        // A note left mid-edit: it exists, it does not parse, and it still carries the two fields
        // no render may invent — `remind me` and a human `related to` member.
        const corrupt = ['---', 'uid: 0c1f', 'related to:', '  - "[[A human note]]"', 'remind me: 2026-09-01', '---', '', 'no heading any more', ''].join('\n');
        const note = path.join(catalogRoot, 'repositories', repositoryNoteName(REPOSITORY_RECORD.numericId));
        fs.writeFileSync(note, corrupt);
        fs.writeFileSync(
            path.join(supportRoot, 'captures.json'),
            JSON.stringify({ failures: [], captures: { repositories: { [REPOSITORY_RECORD.fullName]: REPOSITORY_RECORD }, entities: {} } }),
        );
        const bodies = path.join(directory, 'bodies.json');
        fs.writeFileSync(
            bodies,
            JSON.stringify({
                [`repository:${REPOSITORY_RECORD.numericId}`]:
                    'The repository holds a data index and query language over the Markdown files of a vault. It is written in TypeScript.',
            }),
        );
        const run = spawnSync(
            process.execPath,
            [
                path.join(SCRIPT_ROOT, 'run.mjs'),
                '--stage',
                'render',
                '--release-mirror-root',
                args['release-mirror-root'],
                '--templates-root',
                args['templates-root'],
                '--catalog-root',
                catalogRoot,
                '--support-root',
                supportRoot,
                '--release-pin',
                'aaaa111',
                '--bodies',
                bodies,
            ],
            { encoding: 'utf8' },
        );
        equal(readText(note), corrupt, 'the note on disk is byte-identical');
        assert(run.stdout.includes('lane note-unparsable'), `the run reports the lane: ${run.stdout}${run.stderr}`);
        assert(run.stdout.includes(`repository:${REPOSITORY_RECORD.numericId}`), 'the lane names the entity it left alone');
        equal(run.status, EXIT.findings, 'the run finishes and reports findings rather than aborting');
    });

    check('finalize resumes after its own receipt and refuses another run under one label', () => {
        const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'catalog-finalize-'));
        const stateFile = path.join(directory, 'state.md');
        const before = '---\nbase pin: aaaa111\ntarget pin: bbbb222\nrun: 2026-08-14\n---\n\n## Dump\n\n- [x] plugin dataview\n\n## Sync\n\n## Drop\n';
        const finalize = () =>
            spawnSync(
                process.execPath,
                [path.join(SCRIPT_ROOT, 'run.mjs'), '--stage', 'finalize', '--state-file', stateFile, '--gate-status', 'clean'],
                { encoding: 'utf8' },
            );
        const basePinNow = () => parseState(readText(stateFile)).basePin;

        fs.writeFileSync(stateFile, before);
        const first = finalize();
        equal(first.status, EXIT.clean, `the first finalize is clean: ${first.stdout}${first.stderr}`);
        equal(basePinNow(), 'bbbb222', 'the first finalize reached the reset');
        const receipt = readText(path.join(directory, '2026-08-14.md'));

        // The crash the protocol promises to survive: the receipt landed, the reset did not.
        fs.writeFileSync(stateFile, before);
        const again = finalize();
        equal(again.status, EXIT.clean, `finalising again reaches the reset: ${again.stdout}${again.stderr}`);
        assert(again.stdout.includes('already records this run'), 'the receipt on disk is recognised as this run');
        equal(readText(path.join(directory, '2026-08-14.md')), receipt, 'the receipt is not rewritten');
        equal(basePinNow(), 'bbbb222', 'the reset ran again');

        // A different pin pair under one run label is a refusal, never an overwrite.
        fs.writeFileSync(stateFile, before.replace('target pin: bbbb222', 'target pin: cccc333'));
        const other = finalize();
        equal(other.status, EXIT.refused, `another run under one label is refused: ${other.stdout}${other.stderr}`);
        assert(other.stderr.includes('another run'), 'the refusal says what it found');
        equal(readText(path.join(directory, '2026-08-14.md')), receipt, 'the receipt is left as it was');
        equal(basePinNow(), 'aaaa111', 'a refused finalize does not advance Sync State');
    });

    // --- what reaches the network, and what must never ---------------------------------------------

    check('only the classes that need the network are captured', () => {
        const selected = capturedClasses(classification.items).map(entry => `${entry.type} ${entry.id}`);
        for (const subject of ['plugin fresh', 'plugin newname', 'plugin moved', 'plugin reloedit', 'plugin described']) {
            assert(selected.includes(subject), `${subject} needs the network: ${selected.join(', ')}`);
        }
        // The negatives are the point of the rule: every one of these is a point-edit, and a
        // request attributable to one would break the efficiency claim outright.
        for (const subject of ['plugin statsonly', 'plugin appears', 'plugin vanishes', 'plugin edited', 'theme kept', 'theme retitled']) {
            assert(!selected.includes(subject), `${subject} is a point-edit and must not be captured`);
        }
        assert(!selected.some(subject => subject.startsWith('plugin gone')), 'a removed subject is archived, never captured');
    });

    check('a body is owed when either recorded input moved, not only About', () => {
        const recorded = flattenDataBlock(
            parseDataBlock(
                emitDataBlock([['plugin', fields([['description', 'Old text.'], ['about', 'Same About.']])]]).split('\n').slice(1, -1).join('\n'),
            ),
        );
        equal(
            movedBodyInputs({ kind: 'plugin', description: 'Old text.', about: 'Same About.', recorded }).length,
            0,
            'nothing moved, so the recorded body still stands',
        );
        // The trap: 55 plugins in the real pin pair are exactly this shape.
        equal(
            movedBodyInputs({ kind: 'plugin', description: 'New text.', about: 'Same About.', recorded }).join(),
            'description',
            'a description rewritten upstream owes a body even when About stood still',
        );
        equal(
            movedBodyInputs({ kind: 'plugin', description: 'Old text.', about: 'Fresh About.', recorded }).join(),
            'About',
            'and so does a moved About',
        );
        // A theme has no description at all, so the only input that can move is About. Passing one
        // must change nothing, or every theme in the catalog would queue a body it does not owe.
        const themeRecorded = flattenDataBlock(parseDataBlock('theme: {\n    about: "Same About."\n}'));
        equal(
            movedBodyInputs({ kind: 'theme', description: 'a description a theme cannot have', about: 'Same About.', recorded: themeRecorded }).length,
            0,
            'a theme carries no description, so nothing moved',
        );
        equal(
            movedBodyInputs({ kind: 'theme', about: 'Fresh About.', recorded: themeRecorded }).join(),
            'About',
            'while its About moving is the one thing that owes it a body',
        );
    });

    await checkAsync('the second identity probe separates a rename from a loss', async () => {
        const original = globalThis.fetch;
        const token = process.env.GITHUB_TOKEN;
        process.env.GITHUB_TOKEN = 'test-token';
        const answer = (status, body = '') => {
            globalThis.fetch = async () => ({ status, ok: status === 200, text: async () => body });
        };
        try {
            answer(200, JSON.stringify({ full_name: 'newowner/newname' }));
            const renamed = await fetchRepositoryById(1257816172, { userAgent: 'test' });
            equal(renamed.terminal, false, '200 is a rename, never archive evidence');
            equal(renamed.nameWithOwner, 'newowner/newname', 'and it carries the current name');
            for (const status of [404, 410]) {
                answer(status);
                equal((await fetchRepositoryById(1, { userAgent: 'test' })).terminal, true, `${status} is terminal`);
            }
            // The whole point of the probe is what it refuses to conclude: none of these says
            // anything about the repository, and archiving on one would delete a live component.
            for (const status of [401, 403, 429, 500, 502]) {
                answer(status);
                equal((await fetchRepositoryById(1, { userAgent: 'test' })).terminal, false, `${status} is a retry`);
            }
            globalThis.fetch = async () => {
                throw new Error('socket hang up');
            };
            const failed = await fetchRepositoryById(1, { userAgent: 'test' });
            equal(failed.terminal, false, 'a request that never answered is a retry');
            equal(failed.status, null, 'and records no status to mistake for one');
        } finally {
            globalThis.fetch = original;
            if (token === undefined) delete process.env.GITHUB_TOKEN;
            else process.env.GITHUB_TOKEN = token;
        }
    });

    // --- the capture selection, spawned end to end -------------------------------------------------

    check('capture selects the worklist and refuses the shapes that are not one', () => {
        const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'catalog-capture-'));
        const baseRoot = writeIndexRoot(path.join(directory, 'base'), FIXTURE_PINS.base);
        const targetRoot = writeIndexRoot(path.join(directory, 'target'), FIXTURE_PINS.target);
        const catalogRoot = writeFixtureCatalog(path.join(directory, 'catalog'), templates);
        const supportRoot = path.join(directory, 'support');
        const stateFile = path.join(directory, 'state.md');
        const capture = (...extra) =>
            spawnSync(
                process.execPath,
                [
                    path.join(SCRIPT_ROOT, 'run.mjs'),
                    '--stage', 'capture',
                    '--release-mirror-root', targetRoot,
                    '--templates-root', args['templates-root'],
                    '--catalog-root', catalogRoot,
                    '--support-root', supportRoot,
                    '--user-agent', 'catalog-test',
                    ...extra,
                ],
                { encoding: 'utf8' },
            );

        // A state file whose standing `[>]` names a subject that is still in the index: its retry
        // is this run's capture, while the six whose rows have gone are archived, not re-probed.
        fs.writeFileSync(
            stateFile,
            '---\nbase pin: aaaa111\ntarget pin:\nrun: earlier\n---\n\n## Dump\n\n' +
                '- [>] plugin keep — github-missing (repo o/keep)\n- [>] plugin gone — github-missing (repo o/gone)\n\n## Sync\n\n## Drop\n',
        );
        const worklist = spawnSync(
            process.execPath,
            [
                path.join(SCRIPT_ROOT, 'run.mjs'),
                '--stage', 'worklist',
                '--release-mirror-root', targetRoot,
                '--base-index-root', baseRoot,
                '--catalog-root', catalogRoot,
                '--state-file', stateFile,
                '--release-pin', 'bbbb222',
                '--run', '2026-08-14',
            ],
            { encoding: 'utf8' },
        );
        equal(worklist.status, EXIT.findings, `the worklist lands first: ${worklist.stdout}${worklist.stderr}`);

        const dry = capture('--base-index-root', baseRoot, '--state-file', stateFile, '--release-pin', 'bbbb222', '--dry-run');
        equal(dry.status, EXIT.clean, `a dry selection is clean: ${dry.stdout}${dry.stderr}`);
        const value = label => Number(/\d+/.exec(dry.stdout.split(`\n`).find(line => line.includes(label))?.replace(label, '') ?? 'x'));
        equal(value('added'), 2, `two ids appeared: ${dry.stdout}`);
        equal(value('relocated'), 2, 'two repositories moved');
        equal(value('amended with a body'), 1, 'one description moved');
        equal(value('standing retry'), 1, 'the standing subject still in the index is re-probed');
        equal(value('selected'), 6, 'and nothing else is selected');
        equal(value('stats only'), 3, 'the point-edit classes are counted and excluded');
        equal(value('amended, no body'), 1, 'an author-only amendment never reaches the network');
        assert(dry.stdout.includes('no request issued'), 'a dry selection issues nothing');
        assert(!fs.existsSync(path.join(supportRoot, 'captures.json')), 'and writes no evidence');

        const both = capture('--state-file', stateFile, '--plugin', 'keep');
        equal(both.status, EXIT.usage, `a pilot and a worklist are two selections: ${both.stdout}${both.stderr}`);
        const neither = capture();
        equal(neither.status, EXIT.usage, 'and capturing nothing at all is a mistake, not a no-op');

        fs.writeFileSync(stateFile, '---\nbase pin: aaaa111\ntarget pin:\nrun: earlier\n---\n\n## Dump\n\n## Sync\n\n## Drop\n');
        const unopened = capture('--base-index-root', baseRoot, '--state-file', stateFile, '--release-pin', 'bbbb222', '--dry-run');
        equal(unopened.status, EXIT.refused, 'a run nobody opened has no worklist to capture');
    });

    // --- the offline point-edit landing path, spawned end to end -----------------------------------

    /**
     * A catalog holding the note the machine would have written at the base pin for every subject
     * present at both pins — which is exactly what the no-op proof requires of a live tree.
     */
    function writeRenderFixture(directory) {
        const baseRoot = writeIndexRoot(path.join(directory, 'base'), FIXTURE_PINS.base);
        const targetRoot = writeIndexRoot(path.join(directory, 'target'), FIXTURE_PINS.target);
        const catalogRoot = writeFixtureCatalog(path.join(directory, 'catalog'), templates);
        const write = (relative, text) => fs.writeFileSync(path.join(catalogRoot, relative), text);
        const plugin = (id, about) =>
            write(
                path.join('plugins', pluginNoteName(id)),
                renderPluginNote({
                    template: templates.plugin,
                    plugin: FIXTURE_PINS.base.plugins.find(entry => entry.id === id),
                    stats: FIXTURE_PINS.base.stats,
                    repository: null,
                    body: 'The plugin does one thing, and the note records what that is.',
                    about,
                }),
            );
        // `keep` carries no About at all: an absent optional value is omitted from the block by
        // contract, and a re-render that wrote `about: ""` instead would change bytes.
        plugin('keep', null);
        plugin('edited', 'An About the Directory served once.');
        plugin('statsonly', 'An About the Directory served once.');
        plugin('appears', 'An About the Directory served once.');
        plugin('vanishes', 'An About the Directory served once.');
        // A body-less theme note: its embed sits in the body position, so a re-render that took the
        // first block for prose would write the embed twice.
        write(
            path.join('themes', themeNoteName('kept')),
            renderThemeNote({ template: templates.theme, theme: THEME('Kept'), repository: null, body: '' }),
        );
        write(
            path.join('themes', themeNoteName('retitled')),
            renderThemeNote({
                template: templates.theme,
                theme: FIXTURE_PINS.base.themes.find(entry => themeSlug(entry.name) === 'retitled'),
                repository: null,
                body: 'The theme restyles the interface, and the note records how.',
                screenshotAvailable: false,
            }),
        );
        const stateFile = path.join(directory, 'state.md');
        fs.writeFileSync(stateFile, '---\nbase pin: aaaa111\ntarget pin:\nrun: earlier\n---\n\n## Dump\n\n## Sync\n\n## Drop\n');
        const bodies = path.join(directory, 'bodies.json');
        fs.writeFileSync(bodies, '{}');
        const worklist = spawnSync(
            process.execPath,
            [
                path.join(SCRIPT_ROOT, 'run.mjs'),
                '--stage', 'worklist',
                '--release-mirror-root', targetRoot,
                '--base-index-root', baseRoot,
                '--catalog-root', catalogRoot,
                '--state-file', stateFile,
                '--release-pin', 'bbbb222',
                '--run', '2026-08-14',
            ],
            { encoding: 'utf8' },
        );
        assert(worklist.status === EXIT.findings, `the worklist lands first: ${worklist.stdout}${worklist.stderr}`);
        const supportRoot = path.join(directory, 'support');
        fs.mkdirSync(supportRoot, { recursive: true });
        const render = (...extra) =>
            spawnSync(
                process.execPath,
                [
                    path.join(SCRIPT_ROOT, 'run.mjs'),
                    '--stage', 'render',
                    '--release-mirror-root', targetRoot,
                    '--base-index-root', baseRoot,
                    '--templates-root', args['templates-root'],
                    '--catalog-root', catalogRoot,
                    '--support-root', supportRoot,
                    '--state-file', stateFile,
                    '--release-pin', 'bbbb222',
                    '--bodies', bodies,
                    ...extra,
                ],
                { encoding: 'utf8' },
            );
        const noteAt = (kind, key) =>
            path.join(catalogRoot, kind === 'plugin' ? 'plugins' : 'themes', kind === 'plugin' ? pluginNoteName(key) : themeNoteName(key));
        return { baseRoot, targetRoot, catalogRoot, supportRoot, stateFile, bodies, render, noteAt };
    }

    /** `label    N` from a histogram row. */
    const histogram = (stdout, label) => {
        const line = stdout.split('\n').find(entry => entry.trim().startsWith(label));
        return line === undefined ? null : Number(line.trim().slice(label.length).trim().split(/\s+/)[0]);
    };

    check('a point-edit lands offline, changes only what moved, and needs no capture', () => {
        const fixture = writeRenderFixture(fs.mkdtempSync(path.join(os.tmpdir(), 'catalog-point-edit-')));
        const before = readText(fixture.noteAt('plugin', 'statsonly'));

        const dry = fixture.render('--dry-run');
        equal(dry.status, EXIT.clean, `a dry run over the worklist is clean: ${dry.stdout}${dry.stderr}`);
        equal(histogram(dry.stdout, 'not reproducible at base pin'), 0, `every note reproduces: ${dry.stdout}`);
        equal(histogram(dry.stdout, 'no note on disk'), 0, 'and every index row the run must land has one');
        // `keep` moved in neither index nor stats: its base and target renders are equal, which is
        // what "nothing moved" means and what keeps it apart from a resumed landing.
        equal(histogram(dry.stdout, 'up to date (nothing moved)'), 1, `only the unchanged row is idle: ${dry.stdout}`);
        // The rename-suspect's added half is queued for the owner and has no note by design.
        equal(histogram(dry.stdout, 'excused by a standing line'), 1, 'a queued-for-the-owner subject is not a shortfall');
        equal(readText(fixture.noteAt('plugin', 'statsonly')), before, 'and a dry run writes nothing');

        const landed = fixture.render();
        equal(landed.status, EXIT.clean, `the landing is clean: ${landed.stdout}${landed.stderr}`);
        const after = readText(fixture.noteAt('plugin', 'statsonly'));
        const moved = before.split('\n').filter((line, index) => line !== after.split('\n')[index]);
        equal(moved.length, 2, `a stats-only edit moves two lines, not a whole note: ${moved.join(' | ')}`);
        assert(moved.every(line => line.includes('downloads')), 'and both of them are the download count');
        assert(after.includes('remind me:'), 'the human-owned key survives');

        // 37 live plugin notes carry no `about` key and none carries an empty string.
        const keep = readText(fixture.noteAt('plugin', 'keep'));
        assert(!/^ {4}about:/m.test(keep), 'an absent About is reproduced as absent, never as an empty string');
        // The body-less theme keeps exactly one embed: its first block is the embed, and reading
        // that as prose would write it twice.
        const kept = readText(fixture.noteAt('theme', 'kept'));
        equal(kept.split('![Kept screenshot]').length - 1, 1, `the embed is preserved once: ${kept}`);
        assert(!readText(fixture.noteAt('theme', 'retitled')).includes('!['), 'and a note with no embed does not gain one');
    });

    check('a resumed render skips its own work instead of refusing it', () => {
        const fixture = writeRenderFixture(fs.mkdtempSync(path.join(os.tmpdir(), 'catalog-resume-')));
        const limited = fixture.render('--limit', '2');
        equal(limited.status, EXIT.clean, `a bounded first batch is clean: ${limited.stdout}${limited.stderr}`);
        assert(limited.stdout.includes('within --limit 2'), 'and says how much of the list it took');

        // The order that matters (ruling 9a): the target arm is tested first, so a note already at
        // the target reads as done rather than as drift. Reversed, a resume would refuse its own work.
        const again = fixture.render('--limit', '2');
        equal(again.status, EXIT.clean, `resuming is clean: ${again.stdout}${again.stderr}`);
        equal(histogram(again.stdout, 'already at target (resumed)'), 2, `and the landed notes are skipped: ${again.stdout}`);
        equal(histogram(again.stdout, 'not reproducible at base pin'), 0, 'not refused as drift');

        const rest = fixture.render();
        equal(rest.status, EXIT.clean, `the rest lands: ${rest.stdout}${rest.stderr}`);
        const settled = fixture.render();
        equal(histogram(settled.stdout, 'not reproducible at base pin'), 0, 'a second full pass refuses nothing');
        equal(histogram(settled.stdout, 'point-edit'), 0, 'and writes nothing');
        assert(settled.stdout.includes('wrote 0 notes'), `the tree is settled: ${settled.stdout}`);
    });

    check('a note the pipeline did not write is refused, not overwritten', () => {
        const fixture = writeRenderFixture(fs.mkdtempSync(path.join(os.tmpdir(), 'catalog-drift-')));
        const file = fixture.noteAt('plugin', 'statsonly');
        // A hand edit to a machine-owned value: the note is now neither its base-pin render nor its
        // target-pin one, and nothing in the pipeline can say what it was meant to be.
        const drifted = readText(file).replace('\n# statsonly\n', '\n# statsonly, renamed by hand\n');
        assert(drifted !== readText(file), 'the fixture edit landed');
        fs.writeFileSync(file, drifted);
        const run = fixture.render();
        equal(run.status, EXIT.findings, `the run reports findings: ${run.stdout}${run.stderr}`);
        equal(histogram(run.stdout, 'not reproducible at base pin'), 1, 'exactly the drifted note is refused');
        assert(run.stdout.includes('lane render/not-reproducible'), 'the lane is printed, not swallowed');
        equal(readText(file), drifted, 'and the file is left byte-identical for a human to settle');
        assert(readText(fixture.noteAt('plugin', 'edited')).includes('author: "B"'), 'while the rest of the run lands');

        // A data block that exists and does not parse is not "no baseline": rendering from it would
        // drop the recorded About silently, so the item is refused with a lane of its own.
        const second = writeRenderFixture(fs.mkdtempSync(path.join(os.tmpdir(), 'catalog-block-')));
        const broken = second.noteAt('plugin', 'edited');
        fs.writeFileSync(broken, readText(broken).replace('    about:       "An About', '  about: "An About'));
        const run2 = second.render();
        equal(histogram(run2.stdout, 'data block unparsable'), 1, `the unparsable block is its own lane: ${run2.stdout}`);
        equal(run2.status, EXIT.findings, 'and it reaches the exit status');
    });

    check('a lane the capture recorded is printed and reaches the exit status', () => {
        const fixture = writeRenderFixture(fs.mkdtempSync(path.join(os.tmpdir(), 'catalog-lanes-')));
        const url = screenshotUrl(THEME('Kept').repo, THEME('Kept').screenshot);
        fs.writeFileSync(
            path.join(fixture.supportRoot, 'captures.json'),
            JSON.stringify({
                failures: [{ lane: 'screenshot-404', subject: url, detail: 'HEAD answered 404' }],
                captures: { repositories: {}, entities: {} },
            }),
        );
        const run = fixture.render();
        assert(run.stdout.includes('lane screenshot-404'), `the carried lane is printed: ${run.stdout}`);
        equal(run.status, EXIT.findings, 'a swallowed lane is indistinguishable from a clean run, so it is not swallowed');
        // The lane belongs to a captured theme; a note landing preserves whatever embed it has.
        assert(readText(fixture.noteAt('theme', 'kept')).includes('!['), 'a point-edit keeps the embed the note carries');
    });

    check('a bodyless repository gets the exception line the classifier never wrote', () => {
        const fixture = writeRenderFixture(fs.mkdtempSync(path.join(os.tmpdir(), 'catalog-bodyless-')));
        // Repositories are not enumerated in `Dump`, so this subject has no line to tick — and the
        // renderer owns `bodyless-no-input`, which the gate reads as its excuse list.
        const record = { ...REPOSITORY_RECORD, description: null, readme: { ...REPOSITORY_RECORD.readme, content: 'a b' } };
        fs.writeFileSync(
            path.join(fixture.supportRoot, 'captures.json'),
            JSON.stringify({ failures: [], captures: { repositories: { [record.fullName]: record }, entities: {} } }),
        );
        const run = fixture.render('--allow-empty-bodies');
        equal(run.status, EXIT.clean, `an ungroundable README is a classification, not a failure: ${run.stdout}${run.stderr}`);
        const state = parseState(readText(fixture.stateFile));
        assert(state.ok, state.reason);
        const line = state.sections.Dump.find(item => item.type === 'repo' && item.id === record.fullName);
        assert(line, `the line is appended: ${readText(fixture.stateFile)}`);
        equal(line.marker, '-', 'as a standing exception');
        assert(line.reason.startsWith('bodyless-no-input (readme sha'), 'carrying the sha a later capture re-opens it with');
        equal(duplicateSubjects(state).length, 0, 'and exactly one line names the subject');

        // Twice is once: a second render finds the line and ticks it rather than appending another.
        const again = fixture.render('--allow-empty-bodies');
        equal(again.status, EXIT.clean, `${again.stdout}${again.stderr}`);
        equal(duplicateSubjects(parseState(readText(fixture.stateFile))).length, 0, 'a resume appends no second line');
        assert(again.stdout.includes('0 exception lines appended'), 'and says it appended none');
    });

    // --- the archive stage, spawned end to end -----------------------------------------------------

    /**
     * A run one step before the archive: the worklist has recorded its `Drop` set and the catalog
     * still holds every note in it.
     *
     * Repository 103 is renamed upstream between the pins, so its note carries the new name and
     * only the new name. That is what puts it beyond the worklist's offline reduction — the added
     * row still says `o/shared`, which is now on no alias list — and into the final reduction the
     * archive stage performs on resolved numeric ids.
     */
    function writeArchiveFixture(directory, { captures = null, standing = '', renamed = { 103: 'o/shared-renamed' } } = {}) {
        const baseRoot = writeIndexRoot(path.join(directory, 'base'), FIXTURE_PINS.base);
        const targetRoot = writeIndexRoot(path.join(directory, 'target'), FIXTURE_PINS.target);
        const catalogRoot = writeFixtureCatalog(path.join(directory, 'catalog'), templates, { renamed });
        // `kept` is live at both pins: the subject a standing `[>]` line can name and the archive
        // stage can confirm without its index row going anywhere.
        fs.writeFileSync(
            path.join(catalogRoot, 'themes', themeNoteName('kept')),
            renderThemeNote({ template: templates.theme, theme: THEME('Kept'), repository: null, body: 'Body.' }),
        );
        const archiveRoot = path.join(directory, 'archive');
        const supportRoot = path.join(directory, 'support');
        fs.mkdirSync(archiveRoot, { recursive: true });
        fs.mkdirSync(supportRoot, { recursive: true });
        if (captures) fs.writeFileSync(path.join(supportRoot, 'captures.json'), JSON.stringify(captures));
        const stateFile = path.join(directory, 'state.md');
        fs.writeFileSync(stateFile, `---\nbase pin: aaaa111\ntarget pin:\nrun: 2026-08-14\n---\n\n## Dump\n\n${standing}\n## Sync\n\n## Drop\n`);
        const worklist = spawnSync(
            process.execPath,
            [
                path.join(SCRIPT_ROOT, 'run.mjs'),
                '--stage', 'worklist',
                '--release-mirror-root', targetRoot,
                '--base-index-root', baseRoot,
                '--catalog-root', catalogRoot,
                '--state-file', stateFile,
                '--release-pin', 'bbbb222',
                '--run', '2026-08-14',
            ],
            { encoding: 'utf8' },
        );
        assert(worklist.status === EXIT.findings, `the worklist lands first: ${worklist.stdout}${worklist.stderr}`);
        const archive = (...extra) =>
            spawnSync(
                process.execPath,
                [
                    path.join(SCRIPT_ROOT, 'run.mjs'),
                    '--stage', 'archive',
                    '--release-mirror-root', targetRoot,
                    '--base-index-root', baseRoot,
                    '--catalog-root', catalogRoot,
                    '--archive-root', archiveRoot,
                    '--support-root', supportRoot,
                    '--state-file', stateFile,
                    '--release-pin', 'bbbb222',
                    ...extra,
                ],
                { encoding: 'utf8' },
            );
        const state = () => {
            const parsed = parseState(readText(stateFile));
            assert(parsed.ok, `the state file parses: ${parsed.reason}`);
            return parsed;
        };
        const archived = () => listFiles(archiveRoot, name => name.endsWith('.md')).map(file => path.relative(archiveRoot, file));
        return { baseRoot, targetRoot, catalogRoot, archiveRoot, supportRoot, stateFile, archive, state, archived, worklist };
    }

    /** The capture that resolved the added row's repository string to a repository already indexed. */
    const RENAMED_CAPTURE = {
        failures: [],
        captures: {
            repositories: { 'o/shared': { ...REPOSITORY_RECORD, numericId: 103, fullName: 'o/shared-renamed' } },
            entities: {},
        },
    };

    check('the archive moves the recorded Drop set byte for byte, and only after the final reduction', () => {
        const fixture = writeArchiveFixture(fs.mkdtempSync(path.join(os.tmpdir(), 'catalog-archive-')), {
            captures: RENAMED_CAPTURE,
        });
        const all = fixture.state().sections.Drop;
        // The rename-suspect's removed half is written into `Drop` as a standing `[-]` line so a
        // human sees it, and it is executed by nobody: `Drop` membership alone is not a move.
        const recorded = all.filter(item => item.marker === ' ');
        equal(all.length - recorded.length, 1, `one line stands rather than moves: ${all.map(item => `[${item.marker}] ${item.type} ${item.id}`).join(', ')}`);
        equal(recorded.length, 10, `the worklist recorded the closure: ${recorded.map(item => `${item.type} ${item.id}`).join(', ')}`);
        assert(
            recorded.some(item => item.type === 'repo' && item.id === 'o/shared-renamed'),
            'the offline reduction cannot see a repository renamed after the base pin, so it is recorded as a move',
        );
        const before = new Map(
            recorded.map(item => [`${item.type} ${item.id}`, null]),
        );
        for (const file of listFiles(fixture.catalogRoot, name => name.endsWith('.md'))) {
            before.set(path.basename(file), sha256(fs.readFileSync(file)));
        }

        const dry = fixture.archive('--dry-run');
        equal(dry.status, EXIT.clean, `a dry plan reconciles: ${dry.stdout}${dry.stderr}`);
        equal(fixture.archived().length, 0, 'and moves nothing');
        assert(dry.stdout.includes('dry run: nothing moved'), 'saying so');
        assert(
            dry.stdout.includes('spared repo o/shared-renamed (103): claimed at the target pin by plugin newname'),
            `the subtraction table names the repository and its claimant: ${dry.stdout}`,
        );

        const run = fixture.archive();
        equal(run.status, EXIT.clean, `the archive is clean: ${run.stdout}${run.stderr}`);
        const moved = fixture.archived();
        equal(moved.length, 9, `ten recorded, one spared: ${moved.join(', ')}`);
        // The class split is preserved and the basename is unchanged, so a bare link still resolves.
        for (const relative of moved) {
            equal(sha256(fs.readFileSync(path.join(fixture.archiveRoot, relative))), before.get(path.basename(relative)), `${relative} moved byte for byte`);
            assert(!isFile(path.join(fixture.catalogRoot, relative)), `${relative} left the live tree`);
        }
        assert(moved.includes(path.join('repositories', repositoryNoteName(104))), 'a shared repository archives with its component');
        assert(moved.includes(path.join('plugins', pluginNoteName('tagalong'))), 'including the live entity that holds it (§3.3)');
        assert(!moved.includes(path.join('repositories', repositoryNoteName(103))), 'while the repository a live row now resolves to stays');
        assert(isFile(path.join(fixture.catalogRoot, 'repositories', repositoryNoteName(103))), 'exactly where it was');

        // Every hash the receipt will carry is the hash of the note where it now lives.
        const manifest = readJson(path.join(fixture.supportRoot, 'archive.json'));
        equal(manifest.moves.length, 9, 'the manifest records every move');
        for (const move of manifest.moves) {
            equal(move.sha256, sha256(fs.readFileSync(path.join(fixture.archiveRoot, move.to))), `${move.to} is recorded under its own hash`);
        }
        equal(manifest.spared.length, 1, 'and the decision not to move one');
        equal(manifest.spared[0].source, 'capture', 'naming what resolved it');

        const after = fixture.state();
        equal(after.sections.Drop.filter(item => item.marker === 'x').length, 9, 'nine lines retire, the spared one among them');
        const spared = after.sections.Drop.find(item => item.id === 'o/shared-renamed');
        assert(spared.reason.startsWith('spared;'), `the spared line records the decision: ${spared.reason}`);
        // A pulled-in entity whose index row survives keeps a standing line, or coverage reports an
        // uncovered row forever.
        const pulled = after.sections.Drop.find(item => item.id === 'tagalong');
        equal(pulled.marker, '-', `an entity archived while still indexed stands: ${pulled.reason}`);
        assert(pulled.reason.endsWith('archived while its index row stands'), pulled.reason);
        equal(after.sections.Drop.find(item => item.id === 'gone').marker, 'x', 'while one whose row is gone retires');
        equal(duplicateSubjects(after).length, 0, 'and no subject gained a second line');

        // Twice is once: the second pass finds its own work and refuses nothing. The standing line
        // the first pass wrote records a fate rather than queueing one, so it does not re-enter the
        // work set — which is why eight notes are recognised as already archived and not nine.
        const again = fixture.archive();
        equal(again.status, EXIT.clean, `a resumed archive is clean: ${again.stdout}${again.stderr}`);
        assert(again.stdout.includes('moved 0 notes (8 already archived)'), `and moves nothing again: ${again.stdout}`);
        equal(fixture.archived().length, 9, 'the archive is unchanged');
        const resumed = fixture.state();
        equal(duplicateSubjects(resumed).length, 0, 'and no line was appended twice');
        equal(resumed.sections.Drop.find(item => item.id === 'tagalong').reason, pulled.reason, 'the standing line is left exactly as it was');
    });

    check('a second terminal answer archives a subject whose index row survives, the first does not', () => {
        const lane = { failures: [{ lane: 'github-missing', subject: 'o/kept', detail: 'HEAD answered 404' }], captures: { repositories: {}, entities: {} } };
        const line = '- [>] theme kept — github-missing (repo o/kept)\n';

        // One terminal answer is an observation, not a verdict: without the standing line the
        // previous run left, this is the first, and nothing may be archived on it.
        const first = writeArchiveFixture(fs.mkdtempSync(path.join(os.tmpdir(), 'catalog-archive-first-')), { captures: lane });
        equal(first.archive().status, EXIT.clean, 'the run is clean');
        assert(!first.archived().includes(path.join('themes', themeNoteName('kept'))), 'and the live theme stays live');

        const second = writeArchiveFixture(fs.mkdtempSync(path.join(os.tmpdir(), 'catalog-archive-second-')), {
            captures: lane,
            standing: line,
        });
        const run = second.archive();
        equal(run.status, EXIT.clean, `the second terminal answer confirms: ${run.stdout}${run.stderr}`);
        assert(second.archived().includes(path.join('themes', themeNoteName('kept'))), `the component archives: ${second.archived().join(', ')}`);
        const state = second.state();
        const lines = [...state.sections.Dump, ...state.sections.Drop].filter(item => item.type === 'theme' && item.id === 'kept');
        equal(lines.length, 1, 'exactly one line names the subject');
        equal(lines[0].marker, '-', `and it stands rather than retiring: ${lines[0].reason}`);
        assert(lines[0].reason.startsWith('repository-unavailable ('), `carrying the lane that archived it: ${lines[0].reason}`);
        assert(lines[0].reason.endsWith('archived while its index row stands'), lines[0].reason);
        assert(run.stdout.includes('confirmed theme kept'), `and the evidence is printed: ${run.stdout}`);
    });

    check('a missing or excess move aborts before anything is renamed', () => {
        const plant = (name, edit) => {
            const fixture = writeArchiveFixture(fs.mkdtempSync(path.join(os.tmpdir(), `catalog-archive-${name}-`)), {
                captures: RENAMED_CAPTURE,
            });
            fs.writeFileSync(fixture.stateFile, edit(readText(fixture.stateFile)));
            const run = fixture.archive();
            equal(run.status, EXIT.refused, `${name} is refused: ${run.stdout}${run.stderr}`);
            equal(fixture.archived().length, 0, `${name} moves nothing at all`);
            assert(run.stderr.includes('nothing was moved'), `${name} says so: ${run.stderr}`);
            return run.stderr;
        };
        // A `Drop` line deleted by hand: the pin diff still says the subject left the index, and it
        // is a fact about the two indexes rather than about the tree, so it still answers after
        // render has rewritten the tree.
        const missing = plant('missing', text => text.replace(/^- \[ \] plugin gone .*\n/m, ''));
        assert(missing.includes('missing move: plugin gone'), `the deleted line is named: ${missing}`);
        // A `Drop` line invented by hand: `kept` is in the Theme Index at the target pin and holds
        // no repository the run is archiving, so nothing this run knows justifies moving it.
        const excess = plant('excess', text => text.replace('## Drop\n', '## Drop\n\n- [ ] theme kept — invented\n'));
        assert(excess.includes('excess move: theme kept'), `the invented line is named: ${excess}`);
        // And a line naming a subject with no note resolves to nothing rather than to a guess.
        const unresolved = plant('unresolved', text => text.replace('## Drop\n', '## Drop\n\n- [ ] plugin ghost — invented\n'));
        assert(unresolved.includes('unresolved subject: plugin ghost'), unresolved);
        // The item grammar accepts any id without whitespace, so the destination is checked rather
        // than trusted: a traversal never becomes a path outside the archive root.
        const traversal = plant('traversal', text => text.replace('## Drop\n', '## Drop\n\n- [ ] plugin .. — invented\n'));
        assert(traversal.includes('destination outside the archive root: plugin ..'), traversal);
    });

    check('the receipt carries one hash per archived note', () => {
        const receipt = renderReceipt({
            run: '2026-08-14',
            basePin: 'aaaa111',
            targetPin: 'bbbb222',
            startedAt: null,
            finishedAt: null,
            sections: { Dump: [], Sync: [], Drop: [] },
            archive: {
                moves: [{ type: 'plugin', id: 'gone', from: 'plugins/x.md', to: 'plugins/Obsidian plugin - gone.md', sha256: 'a'.repeat(64) }],
                spared: [{ type: 'repo', id: 'o/shared-renamed', numericId: 103, claimedBy: 'plugin:newname', via: 'o/shared', source: 'capture' }],
            },
        });
        assert(receipt.includes('| plugin | plugins/Obsidian plugin - gone.md | aaaa'), `the hash table is written: ${receipt}`);
        assert(receipt.includes('1 notes moved: 1 plugins, 0 themes, 0 repositories'), receipt);
        assert(receipt.includes('- spared repo o/shared-renamed (103): claimed at the target pin by plugin newname'), receipt);
        assert(!renderReceipt({ run: 'r', sections: { Dump: [], Sync: [], Drop: [] } }).includes('## Archive'), 'a run that archived nothing carries no such section');
    });

    // --- the archive-aware gate and coverage accounting ----------------------------------------------

    /**
     * A finished run, one step before finalisation: the worklist landed, the archive moved its
     * component, the live tree covers every index row the run did not archive, and the receipt
     * carries the sha256 each move recorded.
     *
     * The live tree is completed *after* the archive, so the closure the worklist computed is
     * untouched, and every note is rendered from the **target** row — the pin the gate reads.
     * Repository links are handed out round-robin over the repositories still live, which is what
     * keeps `newname` holding the repository the reduction spared out from under `oldname`.
     */
    function writeCoverageFixture(directory, { receipt = true } = {}) {
        const fixture = writeArchiveFixture(directory, { captures: RENAMED_CAPTURE });
        const landed = fixture.archive();
        assert(landed.status === EXIT.clean, `the archive lands: ${landed.stdout}${landed.stderr}`);

        const archived = new Set(fixture.archived().map(relative => path.basename(relative)));
        const excused = new Set(exceptions(fixture.state()).map(item => `${item.type} ${item.id}`));
        const targets = listFiles(path.join(fixture.catalogRoot, 'repositories'), name => name.endsWith('.md')).map(
            file => Number(/GitHub - (\d+)\.md$/.exec(path.basename(file))[1]),
        );
        assert(targets.length > 0, 'the archive left at least one repository live');
        let next = 0;
        const repository = () => ({ numericId: targets[next++ % targets.length] });
        for (const row of FIXTURE_PINS.target.plugins) {
            if (archived.has(pluginNoteName(row.id)) || excused.has(`plugin ${row.id}`)) continue;
            fs.writeFileSync(
                path.join(fixture.catalogRoot, 'plugins', pluginNoteName(row.id)),
                renderPluginNote({
                    template: templates.plugin,
                    plugin: row,
                    stats: FIXTURE_PINS.target.stats,
                    repository: repository(),
                    body: 'Body.',
                }),
            );
        }
        for (const row of FIXTURE_PINS.target.themes) {
            const slug = themeSlug(row.name);
            if (archived.has(themeNoteName(slug)) || excused.has(`theme ${slug}`)) continue;
            fs.writeFileSync(
                path.join(fixture.catalogRoot, 'themes', themeNoteName(slug)),
                renderThemeNote({ template: templates.theme, theme: row, repository: repository(), body: 'Body.' }),
            );
        }

        const state = fixture.state();
        if (receipt) {
            writeReceipt(path.dirname(fixture.stateFile), {
                run: state.run,
                basePin: state.basePin,
                targetPin: state.targetPin,
                startedAt: null,
                finishedAt: null,
                model: null,
                pacing: null,
                gate: 'clean',
                sections: state.sections,
                archive: readJson(path.join(fixture.supportRoot, 'archive.json')),
            });
        }
        const gate = (...extra) => {
            const run = spawnSync(
                process.execPath,
                [
                    path.join(SCRIPT_ROOT, 'gate.mjs'),
                    '--release-mirror-root', fixture.targetRoot,
                    '--templates-root', args['templates-root'],
                    '--catalog-root', fixture.catalogRoot,
                    '--state-file', fixture.stateFile,
                    '--json',
                    ...extra,
                ],
                { encoding: 'utf8' },
            );
            assert(run.stdout.startsWith('{'), `the gate reports rather than throwing: ${run.stdout}${run.stderr}`);
            return { ...run, report: JSON.parse(run.stdout) };
        };
        const homed = (...extra) => gate('--archive-root', fixture.archiveRoot, ...extra);
        return { ...fixture, gate, homed, archivedNames: archived };
    }

    /** Findings of one id, which is what a negative test counts rather than eyeballs. */
    const only = (report, id) => report.findings.filter(finding => finding.id === id);
    const errors = report => report.findings.filter(finding => finding.severity !== 'info');

    check('the gate proves coverage in both directions and verifies archived bytes', () => {
        const fixture = writeCoverageFixture(fs.mkdtempSync(path.join(os.tmpdir(), 'catalog-coverage-')));
        const run = fixture.homed();
        equal(run.status, EXIT.clean, `a complete run is clean: ${JSON.stringify(errors(run.report), null, 2)}`);

        // Every figure is derived from the same two sources the gate reads: the index at the pin and
        // the notes on disk. A hard-coded expectation here would prove only that two constants agree.
        const live = home => listFiles(path.join(home, 'plugins'), name => name.endsWith('.md')).length;
        const archivedPlugins = [...fixture.archivedNames].filter(name => name.startsWith('Obsidian plugin - ')).length;
        const indexed = FIXTURE_PINS.target.plugins.length;
        const uncovered = indexed - live(fixture.catalogRoot);
        assert(uncovered > 0, 'the fixture really does archive a plugin whose index row survives');
        assert(
            run.report.lines.some(
                line =>
                    line.startsWith('coverage: plugin') &&
                    line.includes(`${live(fixture.catalogRoot)} live / ${indexed} indexed`) &&
                    line.includes(`${archivedPlugins} archived, ${uncovered} uncovered, ${uncovered} excused`),
            ),
            `the plugin coverage line is derived: ${run.report.lines.join(' | ')}`,
        );
        const repositories = run.report.lines.find(line => line.startsWith('coverage: repositories'));
        assert(repositories.includes('(0 orphan)'), `every live repository is held by a live entity: ${repositories}`);
        assert(repositories.includes('(0 unreferenced)'), `and every archived one by an archived entity: ${repositories}`);

        // The archive's integrity guard is the recorded hash, so every archived note is accounted for.
        const notes = listFiles(fixture.archiveRoot, name => name.endsWith('.md')).length;
        assert(
            run.report.lines.some(line => line.startsWith(`archive: ${notes} notes checked, ${notes} of ${notes} hash-verified from 1 receipt`)),
            `every archived note is verified against the receipt: ${run.report.lines.join(' | ')}`,
        );

        // The reduction leaves a departing entity linking at a repository a live row still claims.
        // The tree is what proves it legitimate, and the gate says so rather than staying silent.
        assert(
            run.report.lines.some(line => line.includes('links into repositories the closure reduction spared')),
            `the spared link is reported, not merely tolerated: ${run.report.lines.join(' | ')}`,
        );
    });

    check('a missing live note is a finding no unrelated excuse can silence', () => {
        const fixture = writeCoverageFixture(fs.mkdtempSync(path.join(os.tmpdir(), 'catalog-uncovered-')));
        const victim = path.join(fixture.catalogRoot, 'plugins', pluginNoteName('fresh'));
        assert(isFile(victim), 'the note the run created exists');
        fs.rmSync(victim);

        const bare = fixture.homed();
        equal(bare.status, EXIT.findings, 'an index row with no live note is a finding');
        equal(only(bare.report, 'catalog/uncovered-index-row').length, 1, `exactly one: ${JSON.stringify(errors(bare.report))}`);
        assert(only(bare.report, 'catalog/uncovered-index-row')[0].file.endsWith(pluginNoteName('fresh')), 'naming the note that is missing');

        // Ruling R4: the excuse must match on reason vocabulary, not only on subject. A
        // `bodyless-no-input` line says the note carries no prose — a statement about a note that
        // exists — and it must never stand in for one that was never written. The subject's own
        // worklist line becomes the excuse, so nothing but the vocabulary changes between the arms.
        const worklist = readText(fixture.stateFile);
        const stand = reason => fs.writeFileSync(fixture.stateFile, worklist.replace(/^- \[ \] plugin fresh .*$/m, `- [-] plugin fresh — ${reason}`));
        stand('bodyless-no-input (readme sha abc)');
        equal(
            only(fixture.homed().report, 'catalog/uncovered-index-row').length,
            1,
            'a bodyless excuse does not excuse a missing note',
        );
        stand('github-missing (repo o/fresh)');
        equal(
            only(fixture.homed().report, 'catalog/uncovered-index-row').length,
            1,
            'and neither does a github-missing one',
        );
        // The lane that does mean "legitimately not live" is the one the archive stage writes.
        stand('repository-unavailable (o/fresh answered terminal in two distinct runs); archived while its index row stands');
        equal(only(fixture.homed().report, 'catalog/uncovered-index-row').length, 0, 'while the archive lane does');
    });

    check('retiring the standing line un-excuses both coverage directions at once', () => {
        const fixture = writeCoverageFixture(fs.mkdtempSync(path.join(os.tmpdir(), 'catalog-excuse-')));
        // The line the archive stage wrote for the subject it moved while its index row survived.
        const state = fixture.state();
        const standing = state.sections.Drop.find(item => item.marker === '-' && item.id === 'tagalong');
        assert(standing, `the archive left a standing line: ${readText(fixture.stateFile)}`);
        assert(standing.reason.endsWith('archived while its index row stands'), standing.reason);
        equal(errors(fixture.homed().report).length, 0, 'and it excuses the shortfall');

        fs.writeFileSync(fixture.stateFile, readText(fixture.stateFile).replace(/^- \[-\] plugin tagalong .*\n/m, ''));
        const report = fixture.homed().report;
        equal(only(report, 'catalog/uncovered-index-row').length, 1, `the index row is uncovered again: ${JSON.stringify(errors(report))}`);
        equal(only(report, 'catalog/archived-but-indexed').length, 1, 'and the archived note contradicts the index');
    });

    check('a broken archive closure is reported from either end', () => {
        const missing = writeCoverageFixture(fs.mkdtempSync(path.join(os.tmpdir(), 'catalog-closure-')));
        fs.rmSync(path.join(missing.archiveRoot, 'repositories', repositoryNoteName(101)));
        const gone = missing.homed().report;
        equal(only(gone, 'catalog/archive-closure-broken').length, 1, `exactly one: ${JSON.stringify(errors(gone))}`);

        // The other end: a repository in the archive that no archived note holds. Reconciliation
        // cannot see an *over*-collected closure once the moves have landed; only the tree can.
        const excess = writeCoverageFixture(fs.mkdtempSync(path.join(os.tmpdir(), 'catalog-overcollected-')));
        fs.writeFileSync(
            path.join(excess.archiveRoot, 'repositories', repositoryNoteName(107)),
            renderRepositoryNote({
                template: templates.repository,
                repository: { ...REPOSITORY_RECORD, numericId: 107, nodeId: 'node-107', fullName: 'o/stranded', name: 'stranded', url: 'https://github.com/o/stranded' },
                body: 'Body.',
            }),
        );
        const stranded = excess.homed().report;
        equal(only(stranded, 'catalog/archive-closure-broken').length, 1, `the archive holds one note nothing archived refers to: ${JSON.stringify(errors(stranded))}`);
        assert(only(stranded, 'catalog/archive-closure-broken')[0].file.endsWith(repositoryNoteName(107)), 'named by the note itself');

        // And a live note must never point into the archive (D4): resolution is scoped to the live
        // tree, so a link that lands there would be re-created rather than followed.
        const inward = writeCoverageFixture(fs.mkdtempSync(path.join(os.tmpdir(), 'catalog-inward-')));
        const live = path.join(inward.catalogRoot, 'repositories', repositoryNoteName(103));
        fs.renameSync(live, path.join(inward.archiveRoot, 'repositories', repositoryNoteName(103)));
        const dangling = only(inward.homed().report, 'catalog/dangling-link');
        assert(dangling.length > 0, 'the live notes that pointed at it dangle');
        assert(dangling.every(finding => finding.message.includes('resolves only into the archive')), 'and the message says where it went');
    });

    check('an archived note is checked for its bytes, never for its current shape', () => {
        const moved = writeCoverageFixture(fs.mkdtempSync(path.join(os.tmpdir(), 'catalog-bytes-')));
        const note = path.join(moved.archiveRoot, 'plugins', pluginNoteName('gone'));
        fs.writeFileSync(note, readText(note).replace('Body.', 'Body!'));
        const report = moved.homed().report;
        equal(errors(report).length, 1, `one finding, and it is the hash: ${JSON.stringify(errors(report))}`);
        equal(errors(report)[0].id, 'catalog/archive-bytes-changed', 'the receipt is what archived bytes answer to');
        assert(errors(report)[0].file.startsWith('archive/'), `and the path says which home: ${errors(report)[0].file}`);

        // Ruling B8: template key order, tags and the re-render proof are live-tree checks. Without
        // them a template migration would turn every archived note into `catalog/template-drift` and
        // force a choice between a permanently red gate and re-rendering history.
        const shape = writeCoverageFixture(fs.mkdtempSync(path.join(os.tmpdir(), 'catalog-shape-')), { receipt: false });
        const archived = path.join(shape.archiveRoot, 'plugins', pluginNoteName('gone'));
        fs.writeFileSync(
            archived,
            readText(archived).replace(/^tags:\n(?:  - .*\n)+/m, 'tags:\n  - obsidian/plugin\n  - gone/from/the/template\n'),
        );
        const tolerated = shape.homed();
        equal(tolerated.status, EXIT.clean, `an archived note's shape is not the gate's business: ${JSON.stringify(errors(tolerated.report))}`);
    });

    check('one uid never names two notes, whichever homes they sit in', () => {
        const fixture = writeCoverageFixture(fs.mkdtempSync(path.join(os.tmpdir(), 'catalog-uid-')));
        // The corruption ruling A exists to prevent: a repository re-created from its immutable
        // numeric id carries the uid of the note just archived under it.
        const archived = path.join(fixture.archiveRoot, 'repositories', repositoryNoteName(101));
        fs.copyFileSync(archived, path.join(fixture.catalogRoot, 'repositories', repositoryNoteName(101)));
        const report = fixture.homed().report;
        equal(only(report, 'catalog/duplicate-uid').length, 1, `the second note is caught: ${JSON.stringify(errors(report))}`);
        equal(only(report, 'catalog/duplicate-uid')[0].severity, 'error', 'as identity-broken, not as a note to tidy');
    });

    check('without an archive root the gate says coverage is unproven instead of guessing', () => {
        const fixture = writeCoverageFixture(fs.mkdtempSync(path.join(os.tmpdir(), 'catalog-unhomed-')));
        fs.rmSync(path.join(fixture.catalogRoot, 'plugins', pluginNoteName('fresh')));
        const run = fixture.gate();
        equal(run.status, EXIT.clean, `the gate stays usable without an archive: ${JSON.stringify(errors(run.report))}`);
        assert(
            run.report.lines.includes('coverage: not checked (--archive-root absent)'),
            `and says what it did not prove: ${run.report.lines.join(' | ')}`,
        );
        equal(only(run.report, 'catalog/uncovered-index-row').length, 0, 'raising no coverage finding it cannot stand behind');

        // A flag pointing at nothing is not the same thing as no flag: it would disable the proof
        // silently, which is the one failure mode a coverage check must not have.
        const mistyped = spawnSync(
            process.execPath,
            [
                path.join(SCRIPT_ROOT, 'gate.mjs'),
                '--release-mirror-root', fixture.targetRoot,
                '--templates-root', args['templates-root'],
                '--catalog-root', fixture.catalogRoot,
                '--archive-root', path.join(fixture.archiveRoot, 'nowhere'),
            ],
            { encoding: 'utf8' },
        );
        equal(mistyped.status, EXIT.missingMaterial, `a mistyped archive root is missing material: ${mistyped.stdout}${mistyped.stderr}`);
    });

    check('staleness is reported, never guessed', () => {
        equal(describeStaleness('a', 'a').state, 'current', 'equal pins');
        equal(describeStaleness('a', 'b').state, 'stale', 'different pins');
        equal(describeStaleness(null, 'b').state, 'pin-unknown', 'no injected pin');
        equal(describeStaleness('a', null).state, 'no-sync-state', 'no completed run yet');
    });

    const failed = results.filter(result => !result.ok);
    for (const result of results) {
        process.stdout.write(`${result.ok ? 'ok  ' : 'FAIL'} ${result.name}${result.ok ? '' : ` — ${result.reason}`}\n`);
    }
    process.stdout.write(`\n${results.length - failed.length}/${results.length} checks passed\n`);
    process.exitCode = failed.length ? EXIT.findings : EXIT.clean;
}

await main(process.argv.slice(2));
