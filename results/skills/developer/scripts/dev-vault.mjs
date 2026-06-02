#!/usr/bin/env node

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { EXIT, isDirectory, isFile, parseArgs, readJson, writeUsageError } from './lib.mjs';

const USAGE = [
    'usage: node dev-vault.mjs <vault-dir> (--plugin DIR | --theme DIR | --snippet FILE)... [--copy|--link] [--config-dir NAME] [--refresh]',
    '  <vault-dir>        a new/empty directory, or a vault created by this tool when --refresh is passed',
    '  --plugin DIR       plugin repository or build output containing manifest.json and main.js (repeatable)',
    '  --theme DIR        theme repository containing manifest.json and theme.css (repeatable)',
    '  --snippet FILE     a .css snippet file (repeatable)',
    '  --copy | --link    install mode; --link is the default on macOS and Linux, --copy on Windows',
    '  --config-dir NAME  configuration folder name, default .obsidian',
    '  --refresh          update installed files in a marked dev vault; seeded notes are left untouched',
].join('\n');

const DEFAULT_CONFIG_DIR = '.obsidian';
const MARKER_FILE = '.obsidian-developer-dev-vault.json';
const MARKER_TOOL = 'obsidian-developer-dev-vault';
const MARKER_SCHEMA_VERSION = 1;

/** 1x1 transparent PNG, so the seeded attachment is a real image rather than a renamed text file. */
const PNG_1X1 =
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

function fail(message, code) {
    process.stderr.write(`error: ${message}\n`);
    if (code === EXIT.usage) process.stderr.write(`${USAGE}\n`);
    process.exitCode = code;
    return null;
}

function ensureEmptyTarget(vault) {
    if (fs.existsSync(vault)) {
        if (!isDirectory(vault)) throw new Error(`${vault} exists and is not a directory`);
        if (fs.readdirSync(vault).length > 0) {
            throw new Error(`${vault} is not empty; this tool only creates a fresh throwaway vault`);
        }
    } else {
        fs.mkdirSync(vault, { recursive: true });
    }
}

function requireRefreshMarker(vault) {
    if (!isDirectory(vault)) throw new Error(`${vault} is not an existing development vault`);
    const markerPath = path.join(vault, MARKER_FILE);
    const marker = isFile(markerPath) ? readJson(markerPath) : null;
    if (
        !marker ||
        marker.tool !== MARKER_TOOL ||
        marker.schemaVersion !== MARKER_SCHEMA_VERSION ||
        !['copy', 'link'].includes(marker.mode) ||
        typeof marker.configDir !== 'string'
    ) {
        throw new Error(
            `${vault} is not marked as a vault created by this tool; refusing --refresh`,
        );
    }
    return marker;
}

/**
 * A manifest is untrusted input: `id` and `name` become directory names, so a `..` segment in one
 * would place the write outside the vault this tool promises to stay inside. Both are required to
 * be a single path segment, and the check runs during pre-flight so nothing is created.
 */
function assertSinglePathSegment(value, label) {
    const raw = String(value).normalize('NFC');
    const normalized = raw.trim();
    if (
        /[\u0000-\u001f\u007f\u2028\u2029]/u.test(raw) ||
        normalized === '' ||
        normalized === '.' ||
        normalized === '..' ||
        normalized.includes('/') ||
        normalized.includes('\\') ||
        path.isAbsolute(normalized) ||
        path.basename(normalized) !== normalized
    ) {
        throw new Error(
            `${label} ${JSON.stringify(value)} is not a single directory name; refusing to install outside the vault`,
        );
    }
    return normalized;
}

/** Quote one argument for the host shell block emitted into Welcome.md. */
function shellQuote(value) {
    if (process.platform === 'win32') return `'${String(value).replaceAll("'", "''")}'`;
    return `'${String(value).replaceAll("'", "'\"'\"'")}'`;
}

function changeDirectoryCommand(vault) {
    return process.platform === 'win32'
        ? `Set-Location -LiteralPath ${shellQuote(vault)}`
        : `cd -- ${shellQuote(vault)}`;
}

function refreshCommand({ vault, configDir, plugins, themes, snippets, mode }) {
    const words = ['node', shellQuote(path.resolve(process.argv[1])), shellQuote(vault), '--refresh'];
    for (const plugin of plugins) words.push('--plugin', shellQuote(plugin.source));
    for (const theme of themes) words.push('--theme', shellQuote(theme.source));
    for (const snippet of snippets) words.push('--snippet', shellQuote(snippet.source));
    words.push(mode === 'copy' ? '--copy' : '--link', '--config-dir', shellQuote(configDir));
    return words.join(' ');
}

/** Belt and braces: whatever the manifest said, the resolved write stays under the vault. */
function assertInsideVault(vault, target) {
    const root = path.resolve(vault);
    const resolved = path.resolve(target);
    if (resolved !== root && !resolved.startsWith(`${root}${path.sep}`)) {
        throw new Error(`refusing to write ${resolved}: it is outside the vault ${root}`);
    }
    return resolved;
}

function install(sourceFile, targetFile, mode) {
    if (path.resolve(sourceFile) === path.resolve(targetFile)) {
        throw new Error(`source and destination are the same file: ${path.resolve(sourceFile)}`);
    }
    fs.mkdirSync(path.dirname(targetFile), { recursive: true });
    fs.rmSync(targetFile, { force: true });
    if (mode === 'link') fs.symlinkSync(path.resolve(sourceFile), targetFile);
    else fs.copyFileSync(sourceFile, targetFile);
}

function canvasFixture() {
    // Shapes follow the studied canvas typings: nodes carry id/x/y/width/height plus a type
    // discriminator, and every edge names the nodes it joins. The link node's url is seeded canvas
    // data so the fixture exercises a real node type; nothing here fetches it, and no tool in this
    // skill makes a network request.
    return {
        nodes: [
            { id: 'n-text', type: 'text', text: '# Canvas\n\nA text node.', x: -260, y: -160, width: 320, height: 140 },
            { id: 'n-file', type: 'file', file: 'Welcome.md', x: 120, y: -160, width: 320, height: 200 },
            { id: 'n-file-heading', type: 'file', file: 'Structure.md', subpath: '#Headings', x: 120, y: 80, width: 320, height: 160 },
            { id: 'n-link', type: 'link', url: 'https://obsidian.md', x: -260, y: 40, width: 320, height: 100, color: '4' },
            { id: 'n-group', type: 'group', label: 'Seeded nodes', x: -300, y: -220, width: 800, height: 520, backgroundStyle: 'cover' },
        ],
        edges: [
            { id: 'e-1', fromNode: 'n-text', fromSide: 'right', toNode: 'n-file', toSide: 'left', toEnd: 'arrow' },
            { id: 'e-2', fromNode: 'n-file', fromSide: 'bottom', toNode: 'n-file-heading', toSide: 'top', label: 'subpath' },
        ],
    };
}

function longNote() {
    const lines = ['---', 'type: fixture', 'purpose: scrolling and rendering cost', '---', '', '# A long note', ''];
    for (let index = 1; index <= 200; index += 1) {
        lines.push(`## Section ${index}`);
        lines.push('');
        lines.push(`Paragraph ${index}. Repeated prose so the note is long enough to scroll, re-render, and show up in a startup measurement.`);
        lines.push('');
    }
    return lines.join('\n');
}

function welcomeNote({ vault, configDir, plugins, themes, snippets, mode }) {
    const lines = [
        '---',
        'title: Welcome',
        'type: dev-vault',
        '---',
        '',
        '# Throwaway development vault',
        '',
        'Never develop a plugin in your main vault: one mistake can rewrite or delete notes. This vault',
        'exists to be thrown away.',
        '',
        '## What is installed',
        '',
        `Configuration folder: \`${configDir}\`. Install mode: **${mode}**.`,
        '',
    ];
    if (plugins.length) {
        lines.push('| Plugin id | Installed from |', '|---|---|');
        for (const plugin of plugins) lines.push(`| \`${plugin.id}\` | \`${plugin.source}\` |`);
        lines.push('');
    }
    if (themes.length) {
        lines.push('| Theme name | Installed from |', '|---|---|');
        for (const theme of themes) lines.push(`| ${theme.name} | \`${theme.source}\` |`);
        lines.push('');
    }
    if (snippets.length) {
        lines.push('| Snippet | Installed from |', '|---|---|');
        for (const snippet of snippets) lines.push(`| ${snippet.name} | \`${snippet.source}\` |`);
        lines.push('');
    }
    lines.push(
        '## Enable it by hand',
        '',
        'This tool writes no Obsidian configuration JSON, because those files have no documented schema. Do this once:',
        '',
        '1. **Settings → Community plugins → Turn on community plugins** (this leaves Restricted Mode).',
        '2. Under **Installed plugins**, toggle the plugin on.',
        '3. For a theme: **Settings → Appearance → Themes** and pick it.',
        '4. For a snippet: **Settings → Appearance → CSS snippets** and toggle it on.',
        '',
        '## The reload asymmetry',
        '',
        '```text',
        'source change    →  reload the PLUGIN (toggle it off/on, or run "Reload app without saving")',
        'manifest change  →  RESTART the app',
        'snippet change   →  applied on save',
        'theme CSS change →  may need "Reload Obsidian without saving"',
        '```',
        '',
        '## Bootstrap from the command line',
        '',
        'Gates first: the Obsidian **1.12 installer**, app version **1.12.7 or above**, the **Command line',
        'interface** toggle under **Settings → General** (accept the registration prompt). If the app is',
        'stopped, the first CLI command launches it; expect that command to be slow and stateful.',
        '',
        'The first command below changes into this exact throwaway vault. Do not omit it: otherwise the CLI',
        'may target whichever vault is active.',
        '',
        process.platform === 'win32' ? '```powershell' : '```shell',
        changeDirectoryCommand(vault),
        'obsidian vault info=path                     # read-only; must print this dev-vault path',
        '```',
        '',
        'Stop if that output is not this vault. Only then run the security-changing block:',
        '',
        process.platform === 'win32' ? '```powershell' : '```shell',
        'obsidian plugins:restrict off               # leave Restricted Mode (throwaway vault only)',
    );
    for (const plugin of plugins) {
        lines.push(`obsidian plugin:enable id=${shellQuote(plugin.id)}`);
        lines.push(`obsidian plugin:reload id=${shellQuote(plugin.id)}      # after every rebuild`);
    }
    for (const theme of themes) lines.push(`obsidian theme:set name=${shellQuote(theme.name)}`);
    for (const snippet of snippets) lines.push(`obsidian snippet:enable name=${shellQuote(snippet.name)}`);
    lines.push(
        'obsidian dev:errors                         # did it throw?',
        'obsidian dev:console limit=100 level=error',
        '```',
        '',
        '`plugins:restrict off` disables a security control. That is acceptable here and nowhere else.',
        '',
        ...(mode === 'copy'
            ? [
                '## Refresh copied builds',
                '',
                'After rebuilding any source, run this exact command. It refreshes installed files and its',
                'own Welcome/marker metadata; it does not rewrite seeded or user-created notes:',
                '',
                process.platform === 'win32' ? '```powershell' : '```shell',
                refreshCommand({ vault, configDir, plugins, themes, snippets, mode }),
                '```',
                '',
            ]
            : []),
        '## Seeded content',
        '',
        'The notes beside this one exist to exercise real surfaces: frontmatter property types, resolved and',
        'unresolved links, an embed, tasks, headings, a fenced code block, right-to-left text, a subfolder',
        'with an attachment, a long note, and a canvas.',
        '',
    );
    return lines.join('\n');
}

function seedNotes(vault) {
    const write = (relative, contents) => {
        const target = path.join(vault, ...relative.split('/'));
        fs.mkdirSync(path.dirname(target), { recursive: true });
        fs.writeFileSync(target, contents);
    };

    write(
        'Properties.md',
        [
            '---',
            'title: Property types',
            'tags:',
            '  - fixture',
            '  - properties',
            'done: false',
            'due: 2026-01-31',
            'reviewed: 2026-01-31T09:00:00',
            'count: 3',
            'link: "[[Links]]"',
            '---',
            '',
            '# Property types',
            '',
            'Text, list, checkbox, date, date-and-time, number and a link, one of each.',
            '',
        ].join('\n'),
    );

    write(
        'Links.md',
        [
            '# Links',
            '',
            'A resolved link: [[Properties]].',
            'A link to a heading: [[Structure#Headings]].',
            'A link with an alias: [[Notes/Subfolder note|the subfolder note]].',
            'An unresolved link, on purpose: [[Nowhere in this vault]].',
            '',
            'An embed:',
            '',
            '![[Notes/attachment.png]]',
            '',
            'A note embed:',
            '',
            '![[Properties]]',
            '',
        ].join('\n'),
    );

    write(
        'Tasks.md',
        [
            '# Tasks',
            '',
            '- [ ] An open task',
            '- [x] A completed task',
            '- [ ] A task with a [[Properties|link]] inside it',
            '    - [ ] A nested task',
            '- A plain list item, which is not a task',
            '',
        ].join('\n'),
    );

    write(
        'Structure.md',
        [
            '# Structure',
            '',
            '## Headings',
            '',
            'Second level.',
            '',
            '### Third level',
            '',
            'Text under a third-level heading.',
            '',
            '## A fenced code block',
            '',
            '```ts',
            "import { Plugin } from 'obsidian';",
            '',
            'export default class Example extends Plugin {',
            '\tasync onload() {',
            "\t\tthis.addRibbonIcon('dice', 'Example', () => {});",
            '\t}',
            '}',
            '```',
            '',
            '## A table',
            '',
            '| Column | Column |',
            '|---|---|',
            '| a | b |',
            '',
        ].join('\n'),
    );

    write(
        'RTL.md',
        [
            '---',
            'direction: rtl',
            '---',
            '',
            '# Right to left',
            '',
            'مرحبا بالعالم. This paragraph mixes Arabic and Latin script on one line.',
            '',
            'שלום עולם — and Hebrew, with a [[Properties|link]] inside a right-to-left run.',
            '',
        ].join('\n'),
    );

    write(
        'Notes/Subfolder note.md',
        ['# A note in a subfolder', '', 'It sits beside an attachment.', '', '![[attachment.png]]', ''].join('\n'),
    );
    fs.writeFileSync(path.join(vault, 'Notes', 'attachment.png'), Buffer.from(PNG_1X1, 'base64'));

    write('Long note.md', longNote());
    write('Board.canvas', `${JSON.stringify(canvasFixture(), null, 2)}\n`);
}

function main() {
    let args;
    try {
        args = parseArgs(process.argv.slice(2), {
            booleans: ['help', 'copy', 'link', 'refresh'],
            values: ['config-dir'],
            repeatable: ['plugin', 'theme', 'snippet'],
        });
    } catch (error) {
        writeUsageError(error, USAGE);
        return;
    }
    if (args.help) {
        process.stdout.write(`${USAGE}\n`);
        return;
    }

    try {
        if (args._.length !== 1) throw new Error('exactly one <vault-dir> is required');
        if (args.copy && args.link) throw new Error('--copy and --link are mutually exclusive');
        if (args.plugin.length + args.theme.length + args.snippet.length === 0) {
            throw new Error('pass at least one --plugin, --theme or --snippet');
        }
        const vault = path.resolve(args._[0]);
        const marker = args.refresh ? requireRefreshMarker(vault) : null;
        const configDir = assertSinglePathSegment(
            args['config-dir'] ?? marker?.configDir ?? DEFAULT_CONFIG_DIR,
            '--config-dir',
        );
        if (marker && args['config-dir'] && configDir !== marker.configDir) {
            throw new Error(
                `--config-dir ${JSON.stringify(configDir)} does not match the marked vault (${JSON.stringify(marker.configDir)})`,
            );
        }
        const mode = args.copy
            ? 'copy'
            : args.link
                ? 'link'
                : marker?.mode ?? (process.platform === 'win32' ? 'copy' : 'link');

        // Resolve every target before creating anything, so a usage error leaves no half-built vault.
        const plugins = [];
        for (const value of args.plugin) {
            const root = path.resolve(value);
            if (!isDirectory(root)) throw new Error(`--plugin ${value} is not a directory`);
            const manifest = isFile(path.join(root, 'manifest.json')) ? readJson(path.join(root, 'manifest.json')) : null;
            if (!manifest || typeof manifest.id !== 'string') {
                throw new Error(`${root} is not a plugin directory: no manifest.json with an "id"`);
            }
            plugins.push({ root, id: assertSinglePathSegment(manifest.id, `plugin id in ${root}/manifest.json`), source: root });
        }
        const themes = [];
        for (const value of args.theme) {
            const root = path.resolve(value);
            if (!isDirectory(root)) throw new Error(`--theme ${value} is not a directory`);
            const manifest = isFile(path.join(root, 'manifest.json')) ? readJson(path.join(root, 'manifest.json')) : null;
            if (!manifest || typeof manifest.name !== 'string') {
                throw new Error(`${root} is not a theme directory: no manifest.json with a "name"`);
            }
            themes.push({ root, name: assertSinglePathSegment(manifest.name, `theme name in ${root}/manifest.json`), source: root });
        }
        const snippets = [];
        for (const value of args.snippet) {
            const file = path.resolve(value);
            if (!isFile(file)) throw new Error(`--snippet ${value} is not a file`);
            if (!file.endsWith('.css')) throw new Error(`--snippet ${value} must be a .css file`);
            snippets.push({
                file,
                name: assertSinglePathSegment(path.basename(file, '.css'), `snippet name from ${file}`),
                source: file,
            });
        }

        for (const [items, key, label] of [
            [plugins, 'id', 'plugin id'],
            [themes, 'name', 'theme name'],
            [snippets, 'name', 'snippet name'],
        ]) {
            const seen = new Set();
            for (const item of items) {
                if (seen.has(item[key])) throw new Error(`duplicate ${label} ${JSON.stringify(item[key])}`);
                seen.add(item[key]);
            }
        }

        // Built output is checked after the usage checks, because "you forgot to build" is a
        // different problem from "you pointed at the wrong directory".
        const unbuilt = [];
        for (const plugin of plugins) {
            if (!isFile(path.join(plugin.root, 'main.js'))) unbuilt.push(`${plugin.root}/main.js`);
        }
        for (const theme of themes) {
            if (!isFile(path.join(theme.root, 'theme.css'))) unbuilt.push(`${theme.root}/theme.css`);
        }
        if (unbuilt.length) {
            return fail(
                `missing built output: ${unbuilt.join(', ')} — build it first: npm run build (or keep npm run dev running in another terminal)`,
                EXIT.missingMaterial,
            );
        }

        if (!args.refresh) ensureEmptyTarget(vault);

        const installed = [];
        const place = (source, target) => {
            const inside = assertInsideVault(vault, target);
            install(source, inside, mode);
            installed.push(path.relative(vault, inside));
        };
        const removeMissingOptional = target => {
            if (!args.refresh) return;
            const inside = assertInsideVault(vault, target);
            if (fs.existsSync(inside)) {
                fs.rmSync(inside, { force: true });
                installed.push(`${path.relative(vault, inside)} (removed: absent from source)`);
            }
        };
        for (const plugin of plugins) {
            const target = path.join(vault, configDir, 'plugins', plugin.id);
            for (const name of ['main.js', 'manifest.json', 'styles.css']) {
                const source = path.join(plugin.root, name);
                if (isFile(source)) place(source, path.join(target, name));
                else if (name === 'styles.css') removeMissingOptional(path.join(target, name));
            }
        }
        for (const theme of themes) {
            const target = path.join(vault, configDir, 'themes', theme.name);
            for (const name of ['theme.css', 'manifest.json']) {
                const source = path.join(theme.root, name);
                if (!isFile(source)) continue;
                place(source, path.join(target, name));
            }
        }
        for (const snippet of snippets) {
            place(snippet.file, path.join(vault, configDir, 'snippets', `${snippet.name}.css`));
        }

        if (!args.refresh) seedNotes(vault);
        fs.writeFileSync(
            assertInsideVault(vault, path.join(vault, 'Welcome.md')),
            welcomeNote({ vault, configDir, plugins, themes, snippets, mode }),
        );
        fs.writeFileSync(
            assertInsideVault(vault, path.join(vault, MARKER_FILE)),
            `${JSON.stringify({
                tool: MARKER_TOOL,
                schemaVersion: MARKER_SCHEMA_VERSION,
                configDir,
                mode,
            }, null, 2)}\n`,
        );

        const out = [];
        out.push(`${args.refresh ? 'Refreshed' : 'Created'} a development vault at ${vault}`);
        out.push(`Configuration folder: ${configDir} (the default is ${DEFAULT_CONFIG_DIR}, and the name is configurable)`);
        out.push(`Install mode: ${mode} (${os.platform()})`);
        out.push(
            mode === 'link'
                ? 'Links are per file, never a whole directory: Obsidian writes data.json into the real plugin folder, so a directory symlink would route plugin-written files back into your source tree.'
                : `Files were copied; after each rebuild, run the exact --refresh command in ${path.join(vault, 'Welcome.md')}.`,
        );
        out.push('');
        out.push(`${args.refresh ? 'Updated' : 'Installed'}:`);
        for (const relative of installed) out.push(`  ${relative}`);
        out.push('');
        out.push('Next, by hand (no Obsidian configuration JSON was written — those files have no documented schema):');
        out.push('  Settings → Community plugins → Turn on community plugins, then toggle your plugin');
        for (const theme of themes) out.push(`  Settings → Appearance → Themes → ${theme.name}`);
        for (const snippet of snippets) out.push(`  Settings → Appearance → CSS snippets → ${snippet.name}`);
        out.push('  Read Welcome.md in the new vault for the CLI bootstrap and its gates.');
        process.stdout.write(`${out.join('\n')}\n`);
    } catch (error) {
        writeUsageError(error, USAGE, EXIT.usage);
    }
}

main();
