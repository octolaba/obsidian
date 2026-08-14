#!/usr/bin/env node
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

import { EXIT, isDirectory, parseArgs, readText, writeUsageError } from './lib.mjs';
import { STATUS, extractAbout } from './about.mjs';
import { hasNoUsableInput, validateBody } from './body.mjs';
import { normalizeReadme } from './github.mjs';
import { verifyMaterial, IDENTITY_STATUS, describeStaleness } from './identity.mjs';
import {
    dedupe,
    isFilenameSafe,
    loadIndexes,
    pluginUid,
    repositoryLink,
    repositoryUid,
    screenshotUrl,
    themeSlug,
    themeUid,
    uuidV5,
} from './model.mjs';
import { bodyMissing, loadTemplate, parseFrontmatter, parseNote, serializeFrontmatter, yamlScalar } from './note.mjs';
import { emitDataBlock, fields, flattenDataBlock, parseDataBlock } from './datablock.mjs';
import { renderPluginNote, renderRepositoryNote, renderThemeNote } from './render.mjs';
import { blockers, exceptions, parseState, resetState, resumeView, serializeState, writeReceipt } from './state.mjs';

const SCRIPT_ROOT = path.dirname(fileURLToPath(import.meta.url));
const FIXTURES = path.join(SCRIPT_ROOT, 'fixtures');

const USAGE = `usage: test.mjs --release-mirror-root DIR --templates-root DIR

exit: 0 all passed  1 failures  2 usage  3 missing material`;

const results = [];
function check(name, fn) {
    try {
        fn();
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

function main(argv) {
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
        assert(!note.data.includes('stats'), 'no stats record when the id has none');
        const values = flattenDataBlock(parseDataBlock(note.data));
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
        const record = {
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
        };
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

    check('inputs below the grounding floor are classified, not retried', () => {
        assert(hasNoUsableInput([null, '# GDCT\n\n![](gdct.png)']), 'a bare title cannot ground a body');
        assert(hasNoUsableInput([null, '![image](image.png)']), 'a single image embed cannot ground a body');
        assert(hasNoUsableInput([null, '']), 'no input at all cannot ground a body');
        assert(
            !hasNoUsableInput([null, 'Render the vault as a globe where folders become continents and links become roads.']),
            'ordinary recorded prose is usable input',
        );
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

main(process.argv.slice(2));
