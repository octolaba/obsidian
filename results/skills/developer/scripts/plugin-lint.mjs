#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
    SEMVER_PATTERN,
    assertFormat,
    blockAfter,
    compareVersions,
    depthAt,
    describeSourceScope,
    emitReport,
    buildReport,
    exitCodeFor,
    isDirectory,
    isFile,
    isLiveCode,
    lineLocator,
    makeFinding,
    maskCode,
    parseArgs,
    readJson,
    readText,
    resolveDirectory,
    sourceFiles,
    walkFiles,
    writeUsageError,
} from './lib.mjs';

const USAGE = [
    'usage: node plugin-lint.mjs --plugin-root PATH [--new|--published] [--release] [--format text|json|sarif]',
    '  --plugin-root PATH  repository root of the plugin, or an installed plugin folder (bundle mode)',
    '  --new               pre-first-release intake: identity rules are submission gates',
    '  --published         default intake: identity rules are informational and must not be "fixed"',
    '  --release           additionally check version synchronisation and print the release notes',
].join('\n');

/** The stable desktop app at the studied pin; anything above it is insider-only. */
const STABLE_APP_AT_PIN = '1.12.7';

/**
 * Every rule states the upstream line it comes from. The tier is not chosen: it is the class of
 * the page carrying the rule (lib.mjs SOURCE_CLASSES), which is what verify.mjs asserts.
 * `publishedTier` exists only where an identity rule stops being a gate after first release.
 */
export const RULES = Object.freeze({
    ODP001: {
        tier: 'submission',
        message: 'manifest.json is missing or is not valid JSON.',
        fix: 'Add a valid manifest.json at the repository root.',
        cite: 'docs: en/Plugins/Releasing/Submit your plugin.md:18',
    },
    ODP002: {
        tier: 'submission',
        message: 'A required manifest field is missing or is not a string/boolean.',
        fix: 'Set id, name, version, minAppVersion, description, author and isDesktopOnly.',
        cite: 'docs: en/Reference/Manifest.md:13-16; docs: en/Reference/Manifest.md:26-28',
    },
    ODP003: {
        tier: 'submission',
        message: 'manifest version is not x.y.z.',
        fix: 'Use a plain semantic version with no prefix and no suffix, for example 1.0.0.',
        cite: 'docs: en/Plugins/Releasing/Submit your plugin.md:33',
    },
    ODP004: {
        tier: 'submission',
        publishedTier: 'convention',
        message: 'Plugin id uses characters outside lowercase letters and hyphens.',
        fix: 'Before the first release, rename the id to lowercase letters and hyphens.',
        cite: 'docs: en/Reference/Manifest.md:27',
    },
    ODP005: {
        tier: 'submission',
        publishedTier: 'convention',
        message: 'Plugin id contains "obsidian".',
        fix: 'Remove "obsidian" from the id before the first release.',
        cite: 'docs: en/Reference/Manifest.md:27; docs: en/Plugins/Releasing/Submit your plugin.md:53',
    },
    ODP006: {
        tier: 'submission',
        publishedTier: 'convention',
        message: 'Plugin id ends with "plugin".',
        fix: 'Drop the "plugin" suffix from the id before the first release.',
        cite: 'docs: en/Reference/Manifest.md:27',
    },
    ODP007: {
        tier: 'submission',
        publishedTier: 'convention',
        message: 'Plugin name breaks a documented naming rule.',
        fix: 'Rename to a short Basic Latin name without "Plugin", "Obsidian" or a core feature name.',
        cite: 'docs: en/Reference/Manifest.md:39-45',
    },
    ODP008: {
        tier: 'submission',
        message: 'Description is longer than 250 characters.',
        fix: 'Shorten the description to 250 characters or fewer.',
        cite: 'docs: en/Plugins/Releasing/Submission requirements for plugins.md:29',
    },
    ODP009: {
        tier: 'submission',
        message: 'Description does not end with a period.',
        fix: 'End the description with ".".',
        cite: 'docs: en/Plugins/Releasing/Submission requirements for plugins.md:30',
    },
    ODP010: {
        tier: 'submission',
        message: 'Description contains an emoji or a special character.',
        fix: 'Remove emoji and decorative characters from the description.',
        cite: 'docs: en/Plugins/Releasing/Submission requirements for plugins.md:31',
    },
    ODP011: {
        tier: 'submission',
        message: 'Description starts with "This is a plugin".',
        fix: 'Start with an action statement such as "Translate selected text into...".',
        cite: 'docs: en/Plugins/Releasing/Submission requirements for plugins.md:24',
    },
    ODP012: {
        tier: 'submission',
        message: 'Description miscapitalises a proper noun or acronym.',
        fix: 'Write "Obsidian", "Markdown" and "PDF" exactly.',
        cite: 'docs: en/Plugins/Releasing/Submission requirements for plugins.md:32',
    },
    ODP013: {
        tier: 'convention',
        message: 'fundingUrl is neither a string nor an object of string URLs.',
        fix: 'Use a single URL string, or an object whose values are URL strings.',
        cite: 'docs: en/Reference/Manifest.md:49',
    },
    ODP014: {
        tier: 'submission',
        message: 'versions.json is not a JSON object mapping plugin version to minAppVersion.',
        fix: 'Store {"<plugin version>": "<minAppVersion>"} pairs, both in x.y.z form.',
        cite: 'docs: en/Reference/Versions.md:7',
    },
    ODP015: {
        tier: 'convention',
        message: `minAppVersion is above the stable desktop app at the studied pin (${STABLE_APP_AT_PIN}).`,
        fix: 'Lower minAppVersion, or accept that users on the stable app cannot install this version.',
        cite: 'rel: desktop-releases.json:3',
    },
    ODP016: {
        tier: 'policy',
        message: 'No LICENSE file at the repository root.',
        fix: 'Add a LICENSE file and state the licence of the plugin.',
        cite: 'docs: en/Developer policies.md:38',
    },
    ODP017: {
        tier: 'submission',
        message: 'No README at the repository root.',
        fix: 'Add a README.md describing the purpose of the plugin and how to use it.',
        cite: 'docs: en/Plugins/Releasing/Submit your plugin.md:16',
    },
    ODP018: {
        tier: 'checklist',
        message: 'A built main.js is committed to the repository.',
        fix: 'Ignore main.js in .gitignore and attach it to releases instead.',
        cite: 'docs: en/Obsidian October plugin self-critique checklist.md:13',
    },
    ODP019: {
        tier: 'checklist',
        message: 'package.json is present but no lock file is committed.',
        fix: 'Commit package-lock.json, pnpm-lock.yaml or yarn.lock.',
        cite: 'docs: en/Obsidian October plugin self-critique checklist.md:49',
    },
    ODP020: {
        tier: 'policy',
        message: 'Network use is reachable from the source but the README carries no disclosure.',
        fix: 'Explain in the README which remote services are used and why.',
        cite: 'docs: en/Developer policies.md:28',
    },
    ODP021: {
        tier: 'convention',
        message: 'The current manifest version is absent from versions.json.',
        fix: 'Add the version only if minAppVersion changed; versions.json needs no entry per release.',
        cite: 'docs: en/Reference/Versions.md:38',
    },
    ODP022: {
        tier: 'guideline',
        message: 'innerHTML is assigned an empty string to clear an element.',
        fix: 'Call el.empty() instead.',
        cite: 'docs: en/Plugins/Releasing/Plugin guidelines.md:94',
    },
    ODP023: {
        tier: 'convention',
        message: 'innerHTML is assigned a static string literal.',
        fix: 'Build the element with createEl()/createDiv()/createSpan() instead.',
        cite: 'docs: en/Plugins/User interface/HTML elements.md:27',
    },
    ODP024: {
        tier: 'submission',
        message: 'Release versions disagree between manifest.json, versions.json and package.json.',
        fix: 'Synchronise the versions, then tag the release with exactly the manifest version.',
        cite: 'docs: en/Plugins/Releasing/Submit your plugin.md:34',
    },
    ODP025: {
        tier: 'checklist',
        message: 'A bare `app.` reference appears inside a function.',
        fix: 'Use this.app from the plugin instance, or pass the App you already hold.',
        cite: 'docs: en/Obsidian October plugin self-critique checklist.md:37',
    },
    ODP030: {
        tier: 'guideline',
        message: 'innerHTML/outerHTML/insertAdjacentHTML is assigned a dynamically built value.',
        fix: 'Build the DOM with createEl()/createDiv()/createSpan(), or sanitize with sanitizeHTMLToDom().',
        cite: 'docs: en/Plugins/Releasing/Plugin guidelines.md:80; docs: en/Plugins/Releasing/Plugin guidelines.md:82',
    },
    ODP031: {
        tier: 'guideline',
        message: 'The global app object is used.',
        fix: 'Use this.app from the plugin instance.',
        cite: 'docs: en/Plugins/Releasing/Plugin guidelines.md:12',
    },
    ODP032: {
        tier: 'checklist',
        message: '`var` is used to declare a variable.',
        fix: 'Use let or const.',
        cite: 'docs: en/Obsidian October plugin self-critique checklist.md:36',
    },
    ODP033: {
        tier: 'guideline',
        message: 'A command declares a default hotkey.',
        fix: 'Remove hotkeys and let the user assign one.',
        cite: 'docs: en/Plugins/Releasing/Plugin guidelines.md:127',
    },
    ODP034: {
        tier: 'guideline',
        message: 'Styling is assigned from JavaScript.',
        fix: 'Add a CSS class and style it in styles.css using Obsidian CSS variables.',
        cite: 'docs: en/Plugins/Releasing/Plugin guidelines.md:311-321',
    },
    ODP035: {
        tier: 'checklist',
        message: 'Non-error console logging is left in the source.',
        fix: 'Remove logging that is not needed in production; keep console.error and console.warn.',
        cite: 'docs: en/Obsidian October plugin self-critique checklist.md:76',
    },
    ODP036: {
        tier: 'checklist',
        message: 'fetch or axios is used while the plugin claims mobile support.',
        fix: "Use requestUrl from 'obsidian'.",
        cite: 'docs: en/Obsidian October plugin self-critique checklist.md:32',
    },
    ODP037: {
        tier: 'guideline',
        message: 'Vault.modify is used to write a file.',
        fix: 'Use the Editor API for the active file, or Vault.process in the background.',
        cite: 'docs: en/Plugins/Releasing/Plugin guidelines.md:194',
    },
    ODP038: {
        tier: 'checklist',
        message: 'Vault.delete is used to remove a file.',
        fix: "Use FileManager.trashFile so the user's deletion preference is honoured.",
        cite: 'docs: en/Obsidian October plugin self-critique checklist.md:55',
    },
    ODP039: {
        tier: 'checklist',
        message: '`as any` is used.',
        fix: 'Type the value properly, or narrow with instanceof.',
        cite: 'docs: en/Obsidian October plugin self-critique checklist.md:42',
    },
    ODP040: {
        tier: 'guideline',
        message: 'workspace.activeLeaf is accessed directly.',
        fix: 'Use getActiveViewOfType(), or workspace.activeEditor for the editor.',
        cite: 'docs: en/Plugins/Releasing/Plugin guidelines.md:142',
    },
    ODP041: {
        tier: 'guideline',
        message: 'detachLeavesOfType is called inside onunload.',
        fix: 'Detach leaves only from a user-invoked action; leave them in place on unload.',
        cite: 'docs: en/Plugins/Releasing/Plugin guidelines.md:119',
    },
    ODP042: {
        tier: 'checklist',
        message: "moment is imported from 'moment'.",
        fix: "Import { moment } from 'obsidian' so a second copy is not bundled.",
        cite: 'docs: en/Obsidian October plugin self-critique checklist.md:66',
    },
    ODP043: {
        tier: 'checklist',
        message: "The configuration folder is hardcoded as '.obsidian'.",
        fix: 'Use Vault.configDir; the folder name is configurable.',
        cite: 'docs: en/Obsidian October plugin self-critique checklist.md:22',
    },
    ODP044: {
        tier: 'guideline',
        message: 'A Node.js or Electron module is imported while the plugin claims mobile support.',
        fix: 'Set isDesktopOnly true, or gate the feature behind Platform.isDesktopApp with a dynamic require.',
        cite: 'docs: en/Plugins/Getting started/Mobile development.md:68',
    },
    ODP045: {
        tier: 'checklist',
        message: 'A regular expression uses lookbehind while the plugin claims mobile support.',
        fix: 'Rewrite without lookbehind, or drop iOS below 16.4 explicitly.',
        cite: 'docs: en/Obsidian October plugin self-critique checklist.md:29',
    },
    ODP046: {
        tier: 'checklist',
        message: 'process.platform is used to detect the platform.',
        fix: "Use Platform from 'obsidian'.",
        cite: 'docs: en/Obsidian October plugin self-critique checklist.md:31',
    },
    ODP047: {
        tier: 'checklist',
        message: 'Vault.adapter is cast to FileSystemAdapter without a nearby instanceof check.',
        fix: 'Gate every FileSystemAdapter use behind instanceof; on mobile the adapter is a CapacitorAdapter.',
        cite: 'docs: en/Obsidian October plugin self-critique checklist.md:30',
    },
    ODP048: {
        tier: 'convention',
        message: 'setInterval is called without the window prefix.',
        fix: 'Use window.setInterval so TypeScript picks the browser overload, and register it.',
        cite: 'api: obsidian.d.ts:1908',
    },
    ODP049: {
        tier: 'checklist',
        message: 'A symbol deprecated in the studied typings is used.',
        fix: 'Move to the replacement named in the typings.',
        cite: 'docs: en/Obsidian October plugin self-critique checklist.md:20',
    },
    ODP050: {
        tier: 'submission',
        message: 'A command id repeats the plugin id.',
        fix: 'Drop the prefix; Obsidian prefixes the command id with the plugin id.',
        cite: 'docs: en/Plugins/Releasing/Submission requirements for plugins.md:48',
    },
    ODP051: {
        tier: 'submission',
        message: 'Sample-template placeholder code is still present.',
        fix: 'Rename MyPlugin, MyPluginSettings, SampleSettingTab and SampleModal, and delete unused samples.',
        cite: 'docs: en/Plugins/Releasing/Submission requirements for plugins.md:54',
    },
    ODP052: {
        tier: 'guideline',
        message: 'A heading element is created inside a settings tab.',
        fix: 'Use new Setting(containerEl).setName(...).setHeading().',
        cite: 'docs: en/Plugins/Releasing/Plugin guidelines.md:69',
    },
    ODP053: {
        tier: 'guideline',
        message: 'Every file is scanned to find one by path.',
        fix: 'Use Vault.getFileByPath, getFolderByPath or getAbstractFileByPath.',
        cite: 'docs: en/Plugins/Releasing/Plugin guidelines.md:231',
    },
    ODP054: {
        tier: 'convention',
        message: 'The bundler configuration does not externalise obsidian, the CodeMirror packages and the Node builtins.',
        fix: "Keep 'obsidian', 'electron', every @codemirror/* and @lezer/* package and builtinModules external.",
        cite: 'sample: esbuild.config.mjs:19-34',
    },
    ODP055: {
        tier: 'convention',
        message: 'The production build does not minify, or emits a sourcemap.',
        fix: 'Minify in the production branch and emit no sourcemap there.',
        cite: 'sample: esbuild.config.mjs:38; sample: esbuild.config.mjs:41',
    },
    ODP056: {
        tier: 'convention',
        message: 'A command name repeats the plugin name.',
        fix: 'Drop the prefix; Obsidian prefixes the displayed command name with the plugin name.',
        cite: 'api: obsidian.d.ts:4951',
    },
});

/**
 * Deprecated in the studied typings; each entry names the declaration line it is read from.
 *
 * Every member is matched through its receiver dot, because a bare name collides with any local
 * identifier that happens to share it — a test helper called `renderMarkdown` is not
 * `MarkdownRenderer.renderMarkdown`. The three entries that are legitimately bare are imported
 * symbols rather than members; they carry `bare: true`, which turns on the definition heuristic.
 */
const DEPRECATED_SYMBOLS = [
    { symbol: 'setWarning', pattern: /\.\s*setWarning\s*\(/g, replacement: 'setDestructive()', at: 'api: obsidian.d.ts:1353', confidence: 'medium' },
    { symbol: 'editorViewField', names: ['editorViewField'], bare: true, pattern: /\beditorViewField\b/g, replacement: 'editorInfoField', at: 'api: obsidian.d.ts:2786', confidence: 'high' },
    { symbol: 'iterateCacheRefs', pattern: /\.\s*iterateCacheRefs\s*\(/g, replacement: 'iterate the cache fields directly', at: 'api: obsidian.d.ts:3613', confidence: 'high' },
    { symbol: 'MarkdownRenderer.renderMarkdown', pattern: /\bMarkdownRenderer\s*\.\s*renderMarkdown\s*\(/g, replacement: 'MarkdownRenderer.render', at: 'api: obsidian.d.ts:4134', confidence: 'high' },
    { symbol: 'Notice.noticeEl', pattern: /\.\s*noticeEl\b/g, replacement: 'messageEl', at: 'api: obsidian.d.ts:4616', confidence: 'high' },
    { symbol: 'SliderComponent.setDynamicTooltip', pattern: /\.\s*setDynamicTooltip\s*\(/g, replacement: 'nothing — the value is always shown', at: 'api: obsidian.d.ts:6788', confidence: 'high' },
    { symbol: 'Workspace.rightRibbon', pattern: /\.\s*rightRibbon\b/g, replacement: 'no replacement — the field is no longer used', at: 'api: obsidian.d.ts:7781', confidence: 'high' },
    { symbol: 'Workspace.splitActiveLeaf', pattern: /\.\s*splitActiveLeaf\s*\(/g, replacement: 'getLeaf(true)', at: 'api: obsidian.d.ts:7864', confidence: 'high' },
    { symbol: 'Workspace.duplicateLeaf', pattern: /\.\s*duplicateLeaf\s*\(/g, replacement: 'the newer duplicateLeaf overload', at: 'api: obsidian.d.ts:7871', confidence: 'low' },
    { symbol: 'Workspace.getUnpinnedLeaf', pattern: /\.\s*getUnpinnedLeaf\s*\(/g, replacement: 'getLeaf(false)', at: 'api: obsidian.d.ts:7882', confidence: 'high' },
    // Only the three-argument overload is deprecated (api: obsidian.d.ts:7943); the two-argument
    // options form is current and @since 0.16.3 (api: obsidian.d.ts:7938).
    { symbol: 'Workspace.setActiveLeaf (pushHistory/focus form)', pattern: /\.\s*setActiveLeaf\s*\(\s*[^,(){}]+,\s*[^,(){}]+,/g, replacement: 'the options form, setActiveLeaf(leaf, { focus })', at: 'api: obsidian.d.ts:7943', confidence: 'medium' },
    { symbol: 'PluginSettingTab.display', pattern: /\bdisplay\s*\(\s*\)\s*(?::\s*void\s*)?\{/g, replacement: 'getSettingDefinitions()', at: 'api: obsidian.d.ts:6654', confidence: 'medium', onlyAtOrAbove: '1.13.0' },
    { symbol: 'prepareQuery/fuzzySearch/PreparedQuery', names: ['prepareQuery', 'fuzzySearch', 'PreparedQuery'], bare: true, pattern: /\b(?:prepareQuery|fuzzySearch|PreparedQuery)\b/g, replacement: 'no declared replacement — the symbols are absent from the studied typings', at: 'api: obsidian.d.ts:3365', confidence: 'high', removed: true },
];

/**
 * Cheap definition heuristic for the bare-name entries: a line that both looks like a definition and
 * binds the name itself is a local of that name, not the deprecated symbol. Residual risk is
 * documented in the limitations block — a definition spread over several lines is not seen.
 */
function definesName(line, names) {
    if (!/\bfunction\b|=>|\bclass\b/.test(line)) return false;
    return names.some(name =>
        new RegExp(
            `\\b(?:function|class)\\s+${name}\\b|\\b(?:const|let|var)\\s+${name}\\b|\\b${name}\\s*[:=]\\s*(?:async\\s*)?(?:function\\b|\\()|\\b${name}\\s*\\([^)]*\\)\\s*(?::[^=]+)?(?:=>|\\{)`,
        ).test(line),
    );
}

const CORE_FEATURE_NAMES = [
    'Live Preview',
    'Bases',
    'Canvas',
    'Graph view',
    'Daily notes',
    'Templates',
    'Backlinks',
    'Outline',
    'Sync',
    'Publish',
    'Properties',
    'Bookmarks',
    'Command palette',
];

const NODE_BUILTINS = [
    'fs',
    'path',
    'os',
    'crypto',
    'child_process',
    'http',
    'https',
    'net',
    'stream',
    'zlib',
    'util',
    'worker_threads',
    'electron',
];

function tierFor(id, mode) {
    const rule = RULES[id];
    return mode === 'published' && rule.publishedTier ? rule.publishedTier : rule.tier;
}

/** An aggregate finding names where to look: up to ten places, then how many were left out. */
function locations(hits, limit = 10) {
    const shown = hits.slice(0, limit).map(hit => `${hit.file}:${hit.line}`).join(', ');
    return hits.length > limit ? `${shown}, and ${hits.length - limit} more` : shown;
}

function bannerOfMainJs(root) {
    const file = path.join(root, 'main.js');
    if (!isFile(file)) return null;
    const handle = fs.openSync(file, 'r');
    try {
        const buffer = Buffer.alloc(1024);
        const read = fs.readSync(handle, buffer, 0, 1024, 0);
        return buffer.subarray(0, read).toString('utf8');
    } finally {
        fs.closeSync(handle);
    }
}

/**
 * Bundle detection runs before any rule, because pointing the linter at an installed plugin folder
 * changes what a clean report can possibly mean.
 */
function detectBundle(root, sources) {
    const head = bannerOfMainJs(root);
    if (head === null) return { bundle: false, reason: null };
    if (/THIS IS A GENERATED\/BUNDLED FILE/i.test(head)) {
        return { bundle: true, reason: 'main.js carries the generated-bundle banner the official template emits' };
    }
    if (!isFile(path.join(root, 'tsconfig.json')) && sources.length === 0) {
        return { bundle: true, reason: 'a built main.js sits beside no tsconfig.json and no source files' };
    }
    return { bundle: false, reason: null };
}

function readRepositoryFile(root, names) {
    for (const name of names) {
        const file = path.join(root, name);
        if (isFile(file)) return { name, text: readText(file) };
    }
    return null;
}

function firstLineMatching(text, pattern) {
    const lines = text.split('\n');
    for (let index = 0; index < lines.length; index += 1) {
        if (pattern.test(lines[index])) return index + 1;
    }
    return null;
}

function checkManifest(root, mode, add) {
    const manifestPath = path.join(root, 'manifest.json');
    if (!isFile(manifestPath)) {
        add('ODP001', { file: 'manifest.json', confidence: 'high', note: 'No manifest.json under the given root.' });
        return null;
    }
    let manifest;
    const text = readText(manifestPath);
    try {
        manifest = JSON.parse(text);
    } catch (error) {
        add('ODP001', { file: 'manifest.json', confidence: 'high', note: `JSON parse failed: ${error.message}` });
        return null;
    }
    const lineOf = key => firstLineMatching(text, new RegExp(`"${key}"\\s*:`));

    for (const [field, type] of [
        ['id', 'string'],
        ['name', 'string'],
        ['version', 'string'],
        ['minAppVersion', 'string'],
        ['description', 'string'],
        ['author', 'string'],
        ['isDesktopOnly', 'boolean'],
    ]) {
        if (typeof manifest[field] !== type) {
            add('ODP002', {
                file: 'manifest.json',
                line: lineOf(field),
                confidence: 'high',
                note: `${field} is ${manifest[field] === undefined ? 'absent' : typeof manifest[field]}, expected ${type}.`,
            });
        }
    }

    if (typeof manifest.version === 'string' && !SEMVER_PATTERN.test(manifest.version)) {
        add('ODP003', { file: 'manifest.json', line: lineOf('version'), confidence: 'high', note: `version is ${JSON.stringify(manifest.version)}.` });
    }

    const id = typeof manifest.id === 'string' ? manifest.id : '';
    const identityNote =
        mode === 'published'
            ? 'Informational on a published plugin: the id is stable API after release, so do not change it.'
            : null;
    if (id && !/^[a-z0-9-]+$/.test(id)) {
        add('ODP004', { file: 'manifest.json', line: lineOf('id'), confidence: 'high', note: identityNote });
    } else if (id && /[0-9]/.test(id)) {
        add('ODP004', {
            file: 'manifest.json',
            line: lineOf('id'),
            confidence: 'low',
            note: ['Digits are common in published ids but the reference sentence names only lowercase letters and hyphens.', identityNote]
                .filter(Boolean)
                .join(' '),
        });
    }
    if (id.includes('obsidian')) {
        add('ODP005', { file: 'manifest.json', line: lineOf('id'), confidence: 'high', note: identityNote });
    }
    if (/plugin$/.test(id)) {
        add('ODP006', { file: 'manifest.json', line: lineOf('id'), confidence: 'high', note: identityNote });
    }

    const name = typeof manifest.name === 'string' ? manifest.name : '';
    const nameNote =
        mode === 'published'
            ? 'Informational on a published plugin: a plugin name can be changed, but an invalid name delists it until fixed.'
            : null;
    const nameFinding = note =>
        add('ODP007', { file: 'manifest.json', line: lineOf('name'), confidence: 'high', note: [note, nameNote].filter(Boolean).join(' ') });
    if (/\bplugins?\b/i.test(name)) nameFinding('Plugin names may not contain the word "Plugin".');
    if (/obsidian|obsi-|-sidian/i.test(name)) nameFinding('Names may not contain "Obsidian" or variations.');
    if (/[^ -~]/.test(name)) nameFinding('Names use Basic Latin characters only.');
    if (/[^A-Za-z0-9 \-+()]/.test(name.replace(/[^ -~]/g, ''))) {
        nameFinding('Only hyphens, plus signs and parentheses are allowed as punctuation.');
    }
    for (const feature of CORE_FEATURE_NAMES) {
        if (new RegExp(`^${feature}$`, 'i').test(name.trim())) {
            nameFinding(`"${feature}" is a core Obsidian feature name.`);
        }
    }

    const description = typeof manifest.description === 'string' ? manifest.description : '';
    const descriptionLine = lineOf('description');
    if (description.length > 250) {
        add('ODP008', { file: 'manifest.json', line: descriptionLine, confidence: 'high', note: `${description.length} characters.` });
    }
    if (description && !description.trimEnd().endsWith('.')) {
        add('ODP009', { file: 'manifest.json', line: descriptionLine, confidence: 'high' });
    }
    if (/[\p{Extended_Pictographic}]/u.test(description) || /[^ -~]/.test(description)) {
        add('ODP010', { file: 'manifest.json', line: descriptionLine, confidence: 'medium', note: 'Non Basic-Latin or pictographic characters found.' });
    }
    if (/^this is a plugin/i.test(description.trim())) {
        add('ODP011', { file: 'manifest.json', line: descriptionLine, confidence: 'high' });
    }
    for (const canonical of ['Obsidian', 'Markdown', 'PDF']) {
        const pattern = new RegExp(`\\b${canonical}\\b`, 'gi');
        for (const match of description.matchAll(pattern)) {
            if (match[0] !== canonical) {
                add('ODP012', { file: 'manifest.json', line: descriptionLine, confidence: 'high', note: `"${match[0]}" should be "${canonical}".` });
            }
        }
    }

    if ('fundingUrl' in manifest) {
        const funding = manifest.fundingUrl;
        const valid =
            typeof funding === 'string' ||
            (funding && typeof funding === 'object' && !Array.isArray(funding) && Object.values(funding).every(value => typeof value === 'string'));
        if (!valid) {
            add('ODP013', { file: 'manifest.json', line: lineOf('fundingUrl'), confidence: 'high' });
        }
    }

    if (typeof manifest.minAppVersion === 'string' && SEMVER_PATTERN.test(manifest.minAppVersion) && compareVersions(manifest.minAppVersion, STABLE_APP_AT_PIN) > 0) {
        add('ODP015', {
            file: 'manifest.json',
            line: lineOf('minAppVersion'),
            confidence: 'high',
            note: `minAppVersion is a hard install gate; users on ${STABLE_APP_AT_PIN} cannot install this version at all.`,
        });
    }
    return manifest;
}

function checkVersions(root, manifest, add) {
    const file = path.join(root, 'versions.json');
    if (!isFile(file)) return null;
    let versions;
    try {
        versions = JSON.parse(readText(file));
    } catch (error) {
        add('ODP014', { file: 'versions.json', line: 1, confidence: 'high', note: `JSON parse failed: ${error.message}` });
        return null;
    }
    if (!versions || typeof versions !== 'object' || Array.isArray(versions)) {
        add('ODP014', { file: 'versions.json', line: 1, confidence: 'high', note: 'The file is not a JSON object.' });
        return null;
    }
    for (const [pluginVersion, appVersion] of Object.entries(versions)) {
        if (!SEMVER_PATTERN.test(pluginVersion) || typeof appVersion !== 'string' || !SEMVER_PATTERN.test(appVersion)) {
            add('ODP014', { file: 'versions.json', line: 1, confidence: 'high', note: `"${pluginVersion}": ${JSON.stringify(appVersion)} is not an x.y.z pair.` });
        }
    }
    // "You only need to update versions.json if you change the minAppVersion"
    // (docs: en/Reference/Versions.md:38). So a missing entry for the current version is only a
    // finding when the newest recorded minAppVersion no longer matches the manifest: a published
    // plugin that never moved its floor legitimately has no entry per release.
    if (manifest?.version && !(manifest.version in versions)) {
        const pairs = Object.entries(versions)
            .filter(([key, value]) => SEMVER_PATTERN.test(key) && typeof value === 'string' && SEMVER_PATTERN.test(value))
            .sort(([left], [right]) => compareVersions(left, right));
        const latest = pairs.length ? pairs[pairs.length - 1] : null;
        if (latest && typeof manifest.minAppVersion === 'string' && latest[1] !== manifest.minAppVersion) {
            add('ODP021', {
                file: 'versions.json',
                line: 1,
                confidence: 'medium',
                note: `The newest entry maps ${latest[0]} to minAppVersion ${latest[1]} while the manifest declares ${manifest.minAppVersion}: the floor moved, so this version needs an entry. An absent entry is correct while minAppVersion is unchanged.`,
            });
        }
    }
    return versions;
}

function checkRepository(root, mode, sources, manifest, add) {
    if (!readRepositoryFile(root, ['LICENSE', 'LICENSE.md', 'LICENSE.txt', 'license', 'license.md', 'COPYING'])) {
        add('ODP016', { confidence: 'high' });
    }
    if (!readRepositoryFile(root, ['README.md', 'README', 'readme.md', 'Readme.md'])) {
        add('ODP017', { confidence: 'high' });
    }
    if (isFile(path.join(root, 'package.json'))) {
        const lock = ['package-lock.json', 'pnpm-lock.yaml', 'yarn.lock', 'npm-shrinkwrap.json', 'bun.lockb'].some(name => isFile(path.join(root, name)));
        if (!lock) add('ODP019', { file: 'package.json', confidence: 'high' });
    }
    if (mode === 'new' && isFile(path.join(root, 'main.js'))) {
        const ignore = isFile(path.join(root, '.gitignore')) ? readText(path.join(root, '.gitignore')) : '';
        add('ODP018', {
            file: 'main.js',
            confidence: /^\s*main\.js\s*$/m.test(ignore) ? 'low' : 'high',
            note: /^\s*main\.js\s*$/m.test(ignore)
                ? '.gitignore lists main.js, so this copy is probably a local build rather than a committed file.'
                : '.gitignore does not list main.js.',
        });
    }

    const readme = readRepositoryFile(root, ['README.md', 'README', 'readme.md', 'Readme.md']);
    const networkMarkers = [];
    for (const source of sources) {
        for (const marker of ['requestUrl', 'fetch(', 'axios', 'XMLHttpRequest', 'WebSocket']) {
            if (source.masked.includes(marker)) networkMarkers.push(`${source.relative}: ${marker}`);
        }
    }
    // A missing README is ODP017's finding, not this one, so an absent README is silent here. A
    // README that names any of the words the domain actually uses counts as a disclosure: no word
    // list can decide whether prose is a *sufficient* disclosure, and that judgement is a human's.
    const disclosure = /network|remote|service|\bapi\b|privacy|telemetry|download|sync|account/i;
    if (networkMarkers.length && readme && !disclosure.test(readme.text)) {
        add('ODP020', {
            file: readme.name,
            confidence: 'low',
            note: `Candidate, not proof: ${networkMarkers.slice(0, 4).join(', ')} in scanned source, and the README names none of network, remote, service, api, privacy, telemetry, download, sync, account. A marker may be dead code, and a README may disclose in words no heuristic matches — read it.`,
        });
    }
}

function classifyAssignment(rest) {
    const trimmed = rest.trimStart();
    if (/^(['"`])\1/.test(trimmed) || /^(['"])\s*\1/.test(trimmed)) return 'empty';
    if (/^``/.test(trimmed)) return 'empty';
    if (trimmed.startsWith('`')) {
        const end = trimmed.indexOf('`', 1);
        const body = end === -1 ? trimmed.slice(1) : trimmed.slice(1, end);
        if (body === '') return 'empty';
        return body.includes('${') ? 'dynamic' : 'static';
    }
    if (trimmed.startsWith('"') || trimmed.startsWith("'")) {
        const quote = trimmed[0];
        let index = 1;
        while (index < trimmed.length && trimmed[index] !== quote) {
            if (trimmed[index] === '\\') index += 1;
            index += 1;
        }
        const body = trimmed.slice(1, index);
        const after = trimmed.slice(index + 1).trimStart();
        if (after.startsWith('+')) return 'dynamic';
        return body === '' ? 'empty' : 'static';
    }
    return 'dynamic';
}

function scanSource(source, context, add) {
    const { relative, text, masked } = source;
    const at = lineLocator(text);
    const lines = text.split('\n');
    const lineAt = offset => lines[at(offset) - 1] ?? '';
    const mobile = context.manifest?.isDesktopOnly === false;
    const report = (id, offset, extra = {}) => add(id, { file: relative, line: at(offset), ...extra });

    for (const match of masked.matchAll(/\.(innerHTML|outerHTML|insertAdjacentHTML)\s*(?:\(|=)/g)) {
        const property = match[1];
        const isCall = masked[match.index + match[0].length - 1] === '(';
        const rest = text.slice(match.index + match[0].length);
        const kind = isCall ? 'dynamic' : classifyAssignment(rest);
        if (/sanitizeHTMLToDom/.test(text.slice(Math.max(0, match.index - 200), match.index + 200))) continue;
        if (kind === 'empty') report('ODP022', match.index, { confidence: 'high', note: `${property} cleared with an empty string.` });
        else if (kind === 'static') report('ODP023', match.index, { confidence: 'medium', note: `${property} assigned a literal.` });
        else {
            report('ODP030', match.index, {
                confidence: 'high',
                note: `${property} receives a value built at runtime. Blocking despite the guideline tier: injected markup can execute arbitrary code with the app's privileges.`,
            });
        }
    }

    for (const match of masked.matchAll(/window\.app\b/g)) {
        report('ODP031', match.index, { confidence: 'high', note: 'window.app is a debugging affordance and may be removed.' });
    }
    for (const match of masked.matchAll(/(^|[^\w$.'"`])app\s*\./g)) {
        const offset = match.index + match[1].length;
        if (/\bthis\s*\.\s*$/.test(masked.slice(Math.max(0, offset - 12), offset))) continue;
        if (depthAt(masked, offset) === 0) {
            report('ODP031', offset, { confidence: 'high', note: 'A module-scope `app` can only be the global object.' });
        } else {
            context.bareAppHits.push({ file: relative, line: at(offset) });
        }
    }

    // `var` is the only legal keyword inside an ambient declaration, and code that needs one there
    // says so with an eslint-disable comment: neither is the plugin style the checklist is about.
    const ambient = [];
    for (const match of masked.matchAll(/\bdeclare\s+(?:global|module|namespace)\b/g)) {
        const body = blockAfter(masked, match.index);
        if (body) ambient.push(body);
    }
    for (const match of masked.matchAll(/^([ \t]*)var\s+[A-Za-z_$]/gm)) {
        const offset = match.index + match[1].length;
        if (ambient.some(body => offset >= body.start && offset < body.end)) continue;
        if (/eslint-disable-next-line[^\n]*\bno-var\b/.test(lines[at(offset) - 2] ?? '')) continue;
        report('ODP032', offset, { confidence: 'high' });
    }

    for (const match of masked.matchAll(/\.style\.(color|background|backgroundColor|backgroundImage|font|fontSize|fontFamily|fontWeight|border|borderColor|borderWidth|borderStyle|display|visibility|opacity)\s*=/g)) {
        report('ODP034', match.index, { confidence: 'high', note: `style.${match[1]} assigned from code.` });
    }

    for (const match of masked.matchAll(/\bconsole\.(log|info|debug|trace)\s*\(/g)) {
        context.consoleHits.push({ file: relative, line: at(match.index), method: match[1] });
    }
    for (const match of masked.matchAll(/\bas\s+any\b/g)) {
        context.anyHits.push({ file: relative, line: at(match.index) });
    }

    if (mobile) {
        for (const match of masked.matchAll(/(^|[^\w$.])(?:fetch\s*\(|axios\b)/g)) {
            report('ODP036', match.index + match[1].length, { confidence: 'high', note: 'requestUrl also bypasses CORS, which fetch does not.' });
        }
        for (const match of masked.matchAll(/\(\?<[=!]/g)) {
            report('ODP045', match.index, { confidence: 'medium', note: 'Candidate, not proof: the match may sit outside a regular expression literal.' });
        }
        // A module specifier is a string body, which masking blanks, so the raw text is matched and
        // the keyword offset is checked against the mask instead: that rejects a specifier quoted
        // inside a comment or a string without losing the specifier itself.
        const importPattern = new RegExp(
            `\\b(?:from|require\\s*\\(|import\\s*\\()\\s*['"](?:node:)?(${NODE_BUILTINS.join('|')})['"]`,
            'g',
        );
        // Any Platform flag in the file counts as a gate the scanner cannot evaluate; only
        // isDesktopApp is the documented runtime test (api: obsidian.d.ts:4838), so the others are
        // reported as a weaker signal rather than silently accepted.
        const gate = /Platform\s*\.\s*is(Desktop|Mobile)(App)?\b/.exec(text);
        for (const match of text.matchAll(importPattern)) {
            if (!isLiveCode(text, masked, match.index)) continue;
            const before = text.slice(Math.max(0, match.index - 300), match.index);
            const guarded = /\btry\s*\{[^}]*$/.test(before) && /\bcatch\b/.test(text.slice(match.index, match.index + 300));
            context.nodeImports.push({
                file: relative,
                line: at(match.index),
                module: match[1],
                gate: gate ? gate[0] : null,
                guarded,
            });
        }
    }

    for (const match of masked.matchAll(/\.modify\s*\(/g)) {
        const before = masked.slice(Math.max(0, match.index - 40), match.index);
        if (/vault|Vault/.test(before)) report('ODP037', match.index, { confidence: 'medium' });
    }
    for (const match of masked.matchAll(/\.delete\s*\(/g)) {
        const before = masked.slice(Math.max(0, match.index - 40), match.index);
        if (/vault|Vault|adapter/.test(before)) report('ODP038', match.index, { confidence: 'medium' });
    }
    for (const match of masked.matchAll(/\bworkspace\s*\.\s*activeLeaf\b/g)) {
        report('ODP040', match.index, { confidence: 'high' });
    }
    for (const match of masked.matchAll(/\bprocess\s*\.\s*platform\b/g)) {
        report('ODP046', match.index, { confidence: 'high' });
    }
    for (const match of masked.matchAll(/\bas\s+FileSystemAdapter\b/g)) {
        const window = text.slice(Math.max(0, match.index - 300), match.index + 300);
        if (!/instanceof\s+FileSystemAdapter/.test(window)) {
            report('ODP047', match.index, { confidence: 'high' });
        }
    }
    for (const match of masked.matchAll(/(^|[^.\w$])setInterval\s*\(/gm)) {
        report('ODP048', match.index + match[1].length, { confidence: 'high' });
    }
    // Only a specifier that resolves to the moment package: `'moment'` or `'moment/…'`. A name that
    // merely contains "moment" is a different module, and a mention in prose is not an import.
    for (const match of text.matchAll(/\b(?:from|require\s*\(|import\s*\()\s*['"]moment(?:\/[^'"\n]*)?['"]/g)) {
        if (!isLiveCode(text, masked, match.index)) continue;
        context.momentHits.push({
            file: relative,
            line: at(match.index),
            typeOnly: /\bimport\s+type\b/.test(lineAt(match.index)),
        });
    }
    for (const match of text.matchAll(/['"`][^'"`\n]*\.obsidian(?:[/\\][^'"`\n]*)?['"`]/g)) {
        if (!isLiveCode(text, masked, match.index)) continue;
        // A line that also names configDir is building the path from the API and quoting the
        // default beside it, which is the shape the rule asks for.
        if (/\bconfigDir\b/.test(lineAt(match.index))) continue;
        report('ODP043', match.index, { confidence: 'medium', note: `Literal ${match[0]} — the configuration folder is configurable.` });
    }
    for (const match of masked.matchAll(/getFiles\s*\(\s*\)\s*\.\s*(?:find|filter)\s*\(/g)) {
        const tail = text.slice(match.index, match.index + 200);
        if (/\.path\s*===?/.test(tail)) report('ODP053', match.index, { confidence: 'high' });
    }

    for (const match of masked.matchAll(/\bonunload\s*\(\s*\)\s*(?::\s*\w+\s*)?\{/g)) {
        const body = blockAfter(masked, match.index);
        if (!body) continue;
        const slice = masked.slice(body.start, body.end);
        const hit = slice.indexOf('detachLeavesOfType');
        if (hit !== -1) {
            report('ODP041', body.start + hit, {
                confidence: 'high',
                note: 'Textual match only: a detach reached through a helper call is a known false negative.',
            });
        }
    }

    for (const match of masked.matchAll(/\bextends\s+(?:PluginSettingTab|SettingTab)\b/g)) {
        const classBody = blockAfter(masked, match.index);
        if (!classBody) continue;
        // The element tag is a string literal, so this pattern reads the raw text inside bounds
        // that the masked text established.
        const slice = text.slice(classBody.start, classBody.end);
        for (const heading of slice.matchAll(/createEl\s*\(\s*['"]h[1-6]['"]|<h[1-6]>/g)) {
            report('ODP052', classBody.start + heading.index, { confidence: 'high' });
        }
    }

    for (const match of masked.matchAll(/\baddCommand\s*\(\s*\{/g)) {
        const body = blockAfter(masked, match.index + 'addCommand('.length - 1);
        if (!body) continue;
        const slice = text.slice(body.start, body.end);
        if (/(^|[{,\s])hotkeys\s*:/.test(slice)) {
            report('ODP033', body.start + slice.search(/hotkeys\s*:/), { confidence: 'high' });
        }
        const id = /(^|[{,\s])id\s*:\s*(['"])(.*?)\2/.exec(slice);
        const name = /(^|[{,\s])name\s*:\s*(['"])(.*?)\2/.exec(slice);
        const pluginId = context.manifest?.id;
        const pluginName = context.manifest?.name;
        if (id && pluginId && id[3].toLowerCase().includes(String(pluginId).toLowerCase())) {
            report('ODP050', body.start + id.index, { confidence: 'high', note: `Command id "${id[3]}" repeats the plugin id "${pluginId}".` });
        }
        if (name && pluginName && name[3].toLowerCase().includes(String(pluginName).toLowerCase())) {
            report('ODP056', body.start + name.index, { confidence: 'high', note: `Command name "${name[3]}" repeats the plugin name "${pluginName}".` });
        }
    }

    for (const match of masked.matchAll(/\b(MyPlugin|MyPluginSettings|SampleSettingTab|SampleModal)\b/g)) {
        context.sampleHits.push({ file: relative, line: at(match.index), symbol: match[1] });
    }

    const minApp = context.manifest?.minAppVersion;
    for (const entry of DEPRECATED_SYMBOLS) {
        if (entry.onlyAtOrAbove && !(typeof minApp === 'string' && SEMVER_PATTERN.test(minApp) && compareVersions(minApp, entry.onlyAtOrAbove) >= 0)) {
            continue;
        }
        for (const match of masked.matchAll(new RegExp(entry.pattern.source, 'g'))) {
            if (entry.bare && definesName(lineAt(match.index), entry.names)) continue;
            const hits = context.deprecatedHits.get(entry.symbol) ?? [];
            hits.push({ file: relative, line: at(match.index), entry });
            context.deprecatedHits.set(entry.symbol, hits);
        }
    }
}

/** Packages the scanned source actually imports and that therefore have to stay external. */
function externalCandidates(sources) {
    const packages = new Set();
    let builtins = false;
    const specifier = new RegExp(
        `\\b(?:from|require\\s*\\(|import\\s*\\()\\s*['"]((?:node:)?[^'"\\n]+)['"]`,
        'g',
    );
    for (const { text, masked } of sources) {
        for (const match of text.matchAll(specifier)) {
            if (!isLiveCode(text, masked, match.index)) continue;
            const module = match[1];
            const bare = module.replace(/^node:/, '');
            if (module === 'obsidian' || module === 'electron') packages.add(module);
            else if (/^@(?:codemirror|lezer)\//.test(module)) packages.add(module);
            else if (NODE_BUILTINS.includes(bare.split('/')[0])) builtins = true;
        }
    }
    return { packages: [...packages].sort(), builtins };
}

function checkBundlerConfig(root, sources, add, notes) {
    const configs = walkFiles(root).filter(file => /(?:^|[/\\])esbuild\.config\.[cm]?[jt]s$/.test(file));
    if (configs.length === 0) {
        const others = walkFiles(root)
            .filter(file => /(?:^|[/\\])(?:rollup|webpack|vite|tsup|rspack)\.config\.[cm]?[jt]s$/.test(file))
            .map(file => path.relative(root, file).split(path.sep).join('/'));
        if (others.length) {
            notes.push(
                `Bundler not analysed: ${others.join(', ')} present, and the only bundler configuration this tool reads is esbuild's, because that is the one the official template ships (sample: esbuild.config.mjs:19-34). Check the externals by hand.`,
            );
        }
        return;
    }
    const wanted = externalCandidates(sources);
    for (const file of configs) {
        const relative = path.relative(root, file).split(path.sep).join('/');
        const text = readText(file);
        const externalBlock = /external\s*:\s*\[([\s\S]*?)\]/.exec(text);
        const externals = externalBlock ? externalBlock[1] : '';
        // `...builtins` after `import builtins from 'builtin-modules'` is the idiomatic spread and
        // is exactly as external as a literal builtinModules list.
        const spreads = new Set([...externals.matchAll(/\.\.\.\s*([A-Za-z_$][\w$]*)/g)].map(match => match[1]));
        const builtinNames = new Set();
        for (const match of text.matchAll(/import\s+(?:([A-Za-z_$][\w$]*)|\{([^}]*)\})\s*from\s*['"](?:builtin-modules|node:module|module)['"]/g)) {
            if (match[1]) builtinNames.add(match[1]);
            for (const part of (match[2] ?? '').split(',')) {
                const name = part.split(/\s+as\s+/).pop().trim();
                if (name) builtinNames.add(name);
            }
        }
        for (const match of text.matchAll(/(?:const|let|var)\s+(?:\{[^}]*\}|[A-Za-z_$][\w$]*)\s*=\s*require\s*\(\s*['"](?:builtin-modules|node:module|module)['"]\s*\)/g)) {
            const name = /(?:const|let|var)\s+([A-Za-z_$][\w$]*)/.exec(match[0]);
            if (name) builtinNames.add(name[1]);
        }
        const builtinsExternal =
            /builtinModules/.test(externals) || [...spreads].some(name => builtinNames.has(name));

        const missing = wanted.packages.filter(name => !new RegExp(`['"]${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"]`).test(externals));
        if (wanted.builtins && !builtinsExternal) missing.push('the Node builtins imported by the source');
        if (missing.length) {
            add('ODP054', {
                file: relative,
                line: externalBlock ? text.slice(0, externalBlock.index).split('\n').length : 1,
                confidence: 'high',
                note: `Imported by the scanned source but absent from external: ${missing.join(', ')}. Each one is bundled a second time; for @codemirror/state that breaks facet identity silently, and for obsidian it ships a copy of the API shim.`,
            });
        }
        const minify = /minify\s*:\s*([^,\n}]+)/.exec(text);
        const sourcemap = /sourcemap\s*:\s*([^,\n}]+)/.exec(text);
        if (!minify || /^false\s*$/.test(minify[1].trim())) {
            add('ODP055', { file: relative, line: minify ? text.slice(0, minify.index).split('\n').length : 1, confidence: 'medium', note: 'No production minification found.' });
        }
        if (sourcemap && /^(?:true|'inline'|"inline")\s*$/.test(sourcemap[1].trim())) {
            add('ODP055', { file: relative, line: text.slice(0, sourcemap.index).split('\n').length, confidence: 'medium', note: 'A sourcemap is emitted unconditionally.' });
        }
    }
}

function releaseNotes(manifest) {
    return [
        `Release assets are attached individually, not as an archive: main.js, manifest.json${manifest?.version ? '' : ''} and styles.css when present (docs: en/Plugins/Releasing/Submit your plugin.md:36-40).`,
        `The release tag must equal the manifest version exactly, with no "v" prefix — ${manifest?.version ?? '<version>'} (docs: en/Plugins/Releasing/Submit your plugin.md:34; sample: .npmrc:1).`,
        'Both official workflows create a draft; an unpublished draft is invisible to the installer (sample: .github/workflows/release.yml:49).',
    ];
}

function main() {
    let args;
    try {
        args = parseArgs(process.argv.slice(2), {
            booleans: ['help', 'new', 'published', 'release'],
            values: ['plugin-root', 'format'],
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
        if (args._.length) throw new Error('positional arguments are not accepted; pass --plugin-root');
        if (args.new && args.published) throw new Error('--new and --published are mutually exclusive');
        const format = assertFormat(args.format ?? 'text', ['text', 'json', 'sarif']);
        const root = resolveDirectory(args['plugin-root'], '--plugin-root');
        const mode = args.new ? 'new' : 'published';

        const findings = [];
        const add = (id, extra = {}) => {
            findings.push(
                makeFinding({
                    id,
                    tier: tierFor(id, mode),
                    confidence: extra.confidence ?? 'medium',
                    file: extra.file ?? null,
                    line: extra.line ?? null,
                    cite: RULES[id].cite,
                    fix: RULES[id].fix,
                    note: extra.note ?? null,
                }),
            );
        };

        const sourceList = sourceFiles(root).map(({ absolute, relative }) => {
            const text = readText(absolute);
            return { relative, text, masked: maskCode(text) };
        });
        const bundle = detectBundle(root, sourceList);

        const manifest = checkManifest(root, mode, add);
        checkVersions(root, manifest, add);

        const notes = [];
        const context = {
            manifest,
            consoleHits: [],
            anyHits: [],
            sampleHits: [],
            bareAppHits: [],
            momentHits: [],
            nodeImports: [],
            deprecatedHits: new Map(),
        };
        if (!bundle.bundle) {
            checkRepository(root, mode, sourceList, manifest, add);
            for (const source of sourceList) scanSource(source, context, add);
            checkBundlerConfig(root, sourceList, add, notes);
            if (context.consoleHits.length) {
                add('ODP035', {
                    file: context.consoleHits[0].file,
                    line: context.consoleHits[0].line,
                    confidence: 'high',
                    note: `${context.consoleHits.length} call(s); first at ${context.consoleHits
                        .slice(0, 4)
                        .map(hit => `${hit.file}:${hit.line} (console.${hit.method})`)
                        .join(', ')}.`,
                });
            }
            if (context.anyHits.length) {
                add('ODP039', {
                    file: context.anyHits[0].file,
                    line: context.anyHits[0].line,
                    confidence: 'high',
                    note: `${context.anyHits.length} occurrence(s); first at ${context.anyHits
                        .slice(0, 4)
                        .map(hit => `${hit.file}:${hit.line}`)
                        .join(', ')}.`,
                });
            }
            if (context.sampleHits.length) {
                add('ODP051', {
                    file: context.sampleHits[0].file,
                    line: context.sampleHits[0].line,
                    confidence: 'high',
                    note: `${context.sampleHits.length} occurrence(s) of ${[...new Set(context.sampleHits.map(hit => hit.symbol))].sort().join(', ')}; first at ${context.sampleHits[0].file}:${context.sampleHits[0].line}.`,
                });
            }
            if (context.bareAppHits.length) {
                add('ODP025', {
                    file: context.bareAppHits[0].file,
                    line: context.bareAppHits[0].line,
                    confidence: 'low',
                    note: `${context.bareAppHits.length} occurrence(s); ${locations(context.bareAppHits)}. Candidate, not proof, and the commonest shape behind this rule is a parameter or local named \`app\` — which a text scanner cannot tell from the global, so read each one.`,
                });
            }
            if (context.momentHits.length) {
                const typeOnly = context.momentHits.filter(hit => hit.typeOnly).length;
                add('ODP042', {
                    file: context.momentHits[0].file,
                    line: context.momentHits[0].line,
                    confidence: typeOnly === context.momentHits.length ? 'low' : 'high',
                    note: `${context.momentHits.length} import(s) of the moment package; ${locations(context.momentHits)}.${
                        typeOnly ? ` ${typeOnly} of them are \`import type\`, which is erased at build time and bundles nothing.` : ''
                    }`,
                });
            }
            const ungated = context.nodeImports.filter(hit => hit.gate === null);
            if (ungated.length) {
                const guarded = ungated.filter(hit => hit.guarded).length;
                add('ODP044', {
                    file: ungated[0].file,
                    line: ungated[0].line,
                    confidence: guarded === ungated.length ? 'medium' : 'high',
                    note: `${ungated.length} import(s) of ${[...new Set(ungated.map(hit => hit.module))].sort().join(', ')} in ${
                        new Set(ungated.map(hit => hit.file)).size
                    } file(s) with no Platform check anywhere in them; ${locations(ungated)}.${
                        guarded
                            ? ` ${guarded} sit inside a try/catch, so those degrade rather than crash; add a Platform.isDesktopApp gate to make the intent explicit.`
                            : ''
                    }`,
                });
            }
            const gated = context.nodeImports.filter(hit => hit.gate !== null);
            if (gated.length) {
                const layout = gated.filter(hit => hit.gate !== 'Platform.isDesktopApp');
                notes.push(
                    `Convention note, not a finding: ${gated.length} Node or Electron import(s) sit in files that also test ${[
                        ...new Set(gated.map(hit => hit.gate)),
                    ].sort().join(', ')} — ${locations(gated)}. The gate is taken at face value; a text scanner cannot tell which branch the import is in.${
                        layout.length
                            ? ' Platform.isDesktop and Platform.isMobile are layout flags; Platform.isDesktopApp is the documented runtime test (api: obsidian.d.ts:4838).'
                            : ''
                    }`,
                );
            }
            for (const [symbol, hits] of [...context.deprecatedHits.entries()].sort()) {
                add('ODP049', {
                    file: hits[0].file,
                    line: hits[0].line,
                    confidence: hits[0].entry.confidence,
                    note: `${symbol} — use ${hits[0].entry.replacement} (${hits[0].entry.at}${
                        hits[0].entry.removed ? '; the symbol is absent from the studied typings entirely' : ''
                    }). ${hits.length} occurrence(s); ${locations(hits)}.`,
                });
            }
        }

        if (args.release) {
            const packageJson = readJson(path.join(root, 'package.json'), null);
            const versions = readJson(path.join(root, 'versions.json'), null);
            const declared = [
                ['manifest.json', manifest?.version],
                ['package.json', packageJson?.version],
            ].filter(([, value]) => typeof value === 'string');
            const distinct = [...new Set(declared.map(([, value]) => value))];
            if (distinct.length > 1) {
                add('ODP024', {
                    file: 'manifest.json',
                    confidence: 'high',
                    note: declared.map(([file, value]) => `${file}=${value}`).join(', '),
                });
            }
            if (versions && manifest?.version && Object.prototype.hasOwnProperty.call(versions, manifest.version)) {
                const mapped = versions[manifest.version];
                if (manifest.minAppVersion && mapped !== manifest.minAppVersion) {
                    add('ODP024', {
                        file: 'versions.json',
                        confidence: 'high',
                        note: `versions.json maps ${manifest.version} to ${JSON.stringify(mapped)} while the manifest declares minAppVersion ${manifest.minAppVersion}.`,
                    });
                }
            }
            notes.push(...releaseNotes(manifest));
        }

        const assumptions = [
            `Intake mode ${mode}: identity rules (id and name) are ${mode === 'new' ? 'submission gates' : 'informational, and a published id must not be changed'}.`,
            `The manifest declares isDesktopOnly=${manifest?.isDesktopOnly ?? 'unknown'}, so mobile rules are ${manifest?.isDesktopOnly === false ? 'applied' : 'not applied'}.`,
            `Rules are read against the studied pin: obsidian typings 1.13.2 and the developer docs at commit 2d0e942f; stable desktop app ${STABLE_APP_AT_PIN}.`,
            'Tiers name the class of the upstream page a rule is written on; they are not severities this tool invented.',
            describeSourceScope(root),
        ];
        const limitations = [
            'Every source rule is a text pattern, not a type-aware analysis: findings are candidates to look at, never proof.',
            'The scan scope is stated in the assumptions above and is not a claim that dev tooling was handled: a file outside the scope was not read at all, so no rule here says anything about it. Build and configuration scripts are excluded the way the official template excludes them from its own lint run.',
            'Known false positives: a destructured or locally named `app`, a parameter named `app`, a definition of a deprecated name spread over several lines, and an import inside a branch a Platform check makes unreachable.',
            'Known false negatives, none of which a text scanner can close: innerHTML or outerHTML reached through a computed property or Reflect.set; hotkeys merged into addCommand by spread; a console alias such as const log = console.log, or console["debug"]; globalThis.app, since only window.app and a bare app. are matched; a require whose specifier is a template literal or a variable; a regular expression built from a string; and detachLeavesOfType reached through a helper called from onunload.',
            '.svelte and .vue files are read as plain text, so a rule sees the whole component rather than its <script> block, and framework syntax is not understood.',
            'Nothing is executed: no build runs, no dependency is installed, nothing is written to the reviewed project.',
            'A clean run is not a passed review: policy judgement, README truthfulness and runtime behaviour are outside a text scanner.',
        ];
        if (bundle.bundle) {
            limitations.unshift(
                `BUNDLE MODE — ${bundle.reason}. Only the manifest and versions.json checks ran. Skipped entirely: every source rule (ODP020, ODP022, ODP023, ODP025, ODP030-ODP056) and every repository-shape rule, so no LICENSE check (ODP016), no README check (ODP017), no committed-build check (ODP018) and no lock-file check (ODP019) was performed. Run this against the repository root before treating the result as a review.`,
            );
        }

        const report = buildReport({
            tool: 'obsidian-plugin-lint',
            target: root,
            mode: bundle.bundle ? `${mode} (bundle)` : mode,
            scanned: {
                sourceFiles: bundle.bundle ? 0 : sourceList.length,
                scope: isDirectory(path.join(root, 'src')) ? 'src+root' : 'whole-tree',
                manifest: manifest ? 'read' : 'missing',
                release: Boolean(args.release),
            },
            findings,
            assumptions,
            limitations,
            notes,
        });
        emitReport(report, RULES, format);
        process.exitCode = exitCodeFor(report);
    } catch (error) {
        writeUsageError(error, USAGE);
    }
}

// Importable for the rule-table checks in verify.mjs; only a direct invocation runs the linter.
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
