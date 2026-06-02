#!/usr/bin/env node

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
    SEMVER_PATTERN,
    assertFormat,
    buildReport,
    emitReport,
    exitCodeFor,
    isFile,
    lineLocator,
    makeFinding,
    parseArgs,
    readText,
    resolveDirectory,
    walkFiles,
    writeUsageError,
} from './lib.mjs';

const USAGE = [
    'usage: node theme-lint.mjs --theme-root PATH [--new|--published] [--format text|json|sarif]',
    '  --theme-root PATH  repository root of the theme',
    '  --new              pre-first-release intake: the naming rules are submission gates',
    '  --published        default intake: a submitted theme name can no longer be changed',
].join('\n');

export const RULES = Object.freeze({
    ODT001: {
        tier: 'submission',
        message: 'manifest.json is missing or is not valid JSON.',
        fix: 'Add a valid manifest.json at the repository root.',
        cite: 'docs: en/Themes/App themes/Submit your theme.md:19',
    },
    ODT002: {
        tier: 'submission',
        message: 'A required manifest field is missing or is not a string.',
        fix: 'Set name, version, minAppVersion and author.',
        cite: 'docs: en/Reference/Manifest.md:13-16',
    },
    ODT003: {
        tier: 'submission',
        message: 'manifest version is not x.y.z.',
        fix: 'Use a plain semantic version, for example 1.0.0, and tag the release identically.',
        cite: 'docs: en/Themes/App themes/Submit your theme.md:32',
    },
    ODT004: {
        tier: 'submission',
        publishedTier: 'convention',
        message: 'Theme name breaks a documented naming rule.',
        fix: 'Rename to a short Basic Latin name without "Theme", "Obsidian" or a core feature name.',
        cite: 'docs: en/Reference/Manifest.md:39-45',
    },
    ODT005: {
        tier: 'convention',
        message: 'The theme manifest carries a plugin-only field.',
        fix: 'Remove id, description and isDesktopOnly from a theme manifest.',
        cite: 'docs: en/Reference/Manifest.md:22',
    },
    ODT006: {
        tier: 'submission',
        message: 'theme.css is missing at the repository root.',
        fix: 'Ship a single theme.css; it is one of the two files Obsidian downloads.',
        cite: 'docs: en/Themes/App themes/Submit your theme.md:38',
    },
    ODT007: {
        tier: 'policy',
        message: 'The stylesheet loads an asset over the network.',
        fix: 'Bundle the font or image into the theme; see the embed guide.',
        cite: 'docs: en/Developer policies.md:20; docs: en/Themes/App themes/Theme guidelines.md:37',
    },
    ODT008: {
        tier: 'guideline',
        message: '!important is used in the stylesheet.',
        fix: 'Lower specificity instead; !important stops users overriding the rule from a snippet.',
        cite: 'docs: en/Themes/App themes/Theme guidelines.md:43',
    },
    ODT009: {
        tier: 'checklist',
        message: ':has() is used in the stylesheet.',
        fix: 'Use :has() only where nothing else works; it is called out for Canvas performance.',
        cite: 'docs: en/Obsidian October theme self-critique checklist.md:16',
    },
    ODT010: {
        tier: 'guideline',
        message: 'Colour variables are overridden without a .theme-light or .theme-dark scope.',
        fix: 'Override general variables under body and colours under .theme-light / .theme-dark.',
        cite: 'docs: en/Themes/App themes/Theme guidelines.md:9',
    },
    ODT011: {
        tier: 'convention',
        message: 'versions.json is not a JSON object of x.y.z pairs.',
        fix: 'Keep it consistent with the manifest, or remove it.',
        cite: 'docs: en/Reference/Versions.md:7',
    },
    ODT012: {
        tier: 'submission',
        message: 'No screenshot image anywhere in the repository.',
        fix: 'Add a screenshot; 512 x 288 pixels is the recommended size.',
        cite: 'docs: en/Themes/App themes/Submit your theme.md:18',
    },
    ODT013: {
        tier: 'policy',
        message: 'No LICENSE file at the repository root.',
        fix: 'Add a LICENSE file and state the licence of the theme.',
        cite: 'docs: en/Developer policies.md:38',
    },
    ODT014: {
        tier: 'submission',
        message: 'No README at the repository root.',
        fix: 'Add a README.md describing the theme.',
        cite: 'docs: en/Themes/App themes/Submit your theme.md:16',
    },
});

const CORE_FEATURE_NAMES = ['Live Preview', 'Bases', 'Canvas', 'Graph view', 'Daily notes', 'Templates', 'Sync', 'Publish'];

const IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.gif', '.webp'];

/**
 * CSS has no line comments, and `//` occurs inside every absolute URL, so only block comments are
 * masked here. String bodies stay visible because a remote `url()` may be quoted.
 */
function maskCssComments(text) {
    const chars = [...text];
    let index = 0;
    while (index < chars.length) {
        if (chars[index] === '/' && chars[index + 1] === '*') {
            const end = text.indexOf('*/', index + 2);
            const stop = end === -1 ? chars.length : end + 2;
            while (index < stop) {
                if (chars[index] !== '\n') chars[index] = ' ';
                index += 1;
            }
            continue;
        }
        index += 1;
    }
    return chars.join('');
}

function tierFor(id, mode) {
    const rule = RULES[id];
    return mode === 'published' && rule.publishedTier ? rule.publishedTier : rule.tier;
}

function firstLineMatching(text, pattern) {
    const lines = text.split('\n');
    for (let index = 0; index < lines.length; index += 1) {
        if (pattern.test(lines[index])) return index + 1;
    }
    return null;
}

function checkManifest(root, mode, add) {
    const file = path.join(root, 'manifest.json');
    if (!isFile(file)) {
        add('ODT001', { file: 'manifest.json', confidence: 'high', note: 'No manifest.json under the given root.' });
        return null;
    }
    const text = readText(file);
    let manifest;
    try {
        manifest = JSON.parse(text);
    } catch (error) {
        add('ODT001', { file: 'manifest.json', confidence: 'high', note: `JSON parse failed: ${error.message}` });
        return null;
    }
    const lineOf = key => firstLineMatching(text, new RegExp(`"${key}"\\s*:`));

    for (const field of ['name', 'version', 'minAppVersion', 'author']) {
        if (typeof manifest[field] !== 'string') {
            add('ODT002', {
                file: 'manifest.json',
                line: lineOf(field),
                confidence: 'high',
                note: `${field} is ${manifest[field] === undefined ? 'absent' : typeof manifest[field]}, expected string.`,
            });
        }
    }
    if (typeof manifest.version === 'string' && !SEMVER_PATTERN.test(manifest.version)) {
        add('ODT003', { file: 'manifest.json', line: lineOf('version'), confidence: 'high', note: `version is ${JSON.stringify(manifest.version)}.` });
    }

    const name = typeof manifest.name === 'string' ? manifest.name : '';
    const immutability =
        mode === 'published'
            ? 'Informational: a theme name cannot be changed once the theme has been submitted, so this is a record, not an action.'
            : null;
    const nameFinding = note =>
        add('ODT004', { file: 'manifest.json', line: lineOf('name'), confidence: 'high', note: [note, immutability].filter(Boolean).join(' ') });
    if (/\bthemes?\b/i.test(name)) nameFinding('Theme names may not contain the word "Theme".');
    if (/obsidian|obsi-|-sidian/i.test(name)) nameFinding('Names may not contain "Obsidian" or variations.');
    if (/[^ -~]/.test(name)) nameFinding('Names use Basic Latin characters only.');
    if (/[^A-Za-z0-9 \-+()]/.test(name.replace(/[^ -~]/g, ''))) {
        nameFinding('Only hyphens, plus signs and parentheses are allowed as punctuation.');
    }
    for (const feature of CORE_FEATURE_NAMES) {
        if (new RegExp(`^${feature}$`, 'i').test(name.trim())) nameFinding(`"${feature}" is a core Obsidian feature name.`);
    }

    for (const field of ['id', 'description', 'isDesktopOnly']) {
        if (field in manifest) {
            add('ODT005', { file: 'manifest.json', line: lineOf(field), confidence: 'high', note: `${field} is plugin-only; a theme is identified by its name.` });
        }
    }
    return manifest;
}

function checkVersions(root, add) {
    const file = path.join(root, 'versions.json');
    if (!isFile(file)) return;
    let versions;
    try {
        versions = JSON.parse(readText(file));
    } catch (error) {
        add('ODT011', { file: 'versions.json', line: 1, confidence: 'high', note: `JSON parse failed: ${error.message}` });
        return;
    }
    const note = 'The mechanism is documented for plugins only; for themes it is the sample template\'s convention.';
    if (!versions || typeof versions !== 'object' || Array.isArray(versions)) {
        add('ODT011', { file: 'versions.json', line: 1, confidence: 'high', note: `The file is not a JSON object. ${note}` });
        return;
    }
    for (const [themeVersion, appVersion] of Object.entries(versions)) {
        if (!SEMVER_PATTERN.test(themeVersion) || typeof appVersion !== 'string' || !SEMVER_PATTERN.test(appVersion)) {
            add('ODT011', { file: 'versions.json', line: 1, confidence: 'high', note: `"${themeVersion}": ${JSON.stringify(appVersion)} is not an x.y.z pair. ${note}` });
        }
    }
}

function checkStylesheet(root, add) {
    const file = path.join(root, 'theme.css');
    if (!isFile(file)) {
        add('ODT006', { file: 'theme.css', confidence: 'high' });
        return { scanned: 0 };
    }
    const text = readText(file);
    const masked = maskCssComments(text);
    const at = lineLocator(text);

    // The carve-out travels with every remote-asset finding, because a reader who meets only one of
    // them still has to know which contexts the exception belongs to.
    const carveOut =
        'App themes must bundle every asset. The Google Fonts carve-out in the help pages is written for a different context (a team allowlist), and the Publish-theme guidance against embedding applies to Publish sites, not app themes.';
    // An `@import url(https://…)` is one network load written with two matchable shapes, so the
    // `@import` spans are taken first and a `url(` inside one of them is not counted again.
    const remote = [];
    const importSpans = [];
    for (const match of masked.matchAll(/@import\s+(?:url\s*\(\s*)?['"]?\s*(?:https?:)?\/\//gi)) {
        importSpans.push([match.index, match.index + match[0].length]);
        remote.push({ line: at(match.index), kind: '@import' });
    }
    for (const match of masked.matchAll(/url\s*\(\s*['"]?\s*(?:https?:)?\/\//gi)) {
        if (importSpans.some(([from, to]) => match.index >= from && match.index < to)) continue;
        remote.push({ line: at(match.index), kind: 'url()' });
    }
    if (remote.length) {
        remote.sort((left, right) => left.line - right.line);
        add('ODT007', {
            file: 'theme.css',
            line: remote[0].line,
            confidence: 'high',
            note: `${remote.length} network load(s) at render time (${[...new Set(remote.map(item => item.kind))].join(', ')}); at line ${remote
                .slice(0, 10)
                .map(item => item.line)
                .join(', ')}${remote.length > 10 ? `, and ${remote.length - 10} more` : ''}. ${carveOut}`,
        });
    }

    const importantHits = [...masked.matchAll(/!\s*important/gi)].map(match => at(match.index));
    if (importantHits.length) {
        add('ODT008', {
            file: 'theme.css',
            line: importantHits[0],
            confidence: 'high',
            note: `${importantHits.length} declaration(s); first at line ${importantHits.slice(0, 5).join(', ')}. Vendored major themes carry counts in the same order of magnitude, so a count alone is not a failure — read each one.`,
        });
    }
    const hasHits = [...masked.matchAll(/:has\s*\(/gi)].map(match => at(match.index));
    if (hasHits.length) {
        add('ODT009', {
            file: 'theme.css',
            line: hasHits[0],
            confidence: 'high',
            note: `${hasHits.length} selector(s); first at line ${hasHits.slice(0, 5).join(', ')}.`,
        });
    }

    const scoped = /\.theme-(?:light|dark)\b/.test(masked);
    const colourVariables = [...masked.matchAll(/--[A-Za-z0-9-]*(?:color|colour|background|text|accent|highlight|shadow)[A-Za-z0-9-]*\s*:/gi)];
    if (!scoped && colourVariables.length) {
        add('ODT010', {
            file: 'theme.css',
            line: at(colourVariables[0].index),
            confidence: 'medium',
            note: `${colourVariables.length} colour-ish custom propert(ies) declared and no .theme-light/.theme-dark selector anywhere. Candidate, not proof: a name-based heuristic cannot tell a colour from a size.`,
        });
    }
    return { scanned: text.split('\n').length };
}

function checkRepository(root, add) {
    const files = walkFiles(root).map(file => path.relative(root, file).split(path.sep).join('/'));
    if (!files.some(relative => /^LICENSE(\.md|\.txt)?$/i.test(relative) || /^COPYING$/i.test(relative))) {
        add('ODT013', { confidence: 'high' });
    }
    if (!files.some(relative => /^README(\.md)?$/i.test(relative))) {
        add('ODT014', { confidence: 'high' });
    }
    if (!files.some(relative => IMAGE_EXTENSIONS.includes(path.posix.extname(relative).toLowerCase()))) {
        add('ODT012', { confidence: 'high', note: 'No .png, .jpg, .jpeg, .gif or .webp file was found anywhere in the repository.' });
    }
    return files.length;
}

function main() {
    let args;
    try {
        args = parseArgs(process.argv.slice(2), {
            booleans: ['help', 'new', 'published'],
            values: ['theme-root', 'format'],
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
        if (args._.length) throw new Error('positional arguments are not accepted; pass --theme-root');
        if (args.new && args.published) throw new Error('--new and --published are mutually exclusive');
        const format = assertFormat(args.format ?? 'text', ['text', 'json', 'sarif']);
        const root = resolveDirectory(args['theme-root'], '--theme-root');
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

        checkManifest(root, mode, add);
        checkVersions(root, add);
        const stylesheet = checkStylesheet(root, add);
        const fileCount = checkRepository(root, add);

        const report = buildReport({
            tool: 'obsidian-theme-lint',
            target: root,
            mode,
            scanned: { files: fileCount, stylesheetLines: stylesheet.scanned },
            findings,
            assumptions: [
                `Intake mode ${mode}: the naming rules are ${mode === 'new' ? 'submission gates' : 'informational, because a submitted theme name is immutable'}.`,
                'The repository is treated as the source of the shipped artifact; only a root theme.css is read, because that is the file Obsidian downloads.',
                'Rules are read against the studied pin: developer docs at commit 2d0e942f and the theme template at be9db886.',
            ],
            limitations: [
                'CSS is scanned textually, without a parser: a selector built by a preprocessor, or a rule inside an @media block, is seen as plain text.',
                'The folder-name-must-equal-the-theme-name rule is an install-time rule about the vault, not about the repository, so it is deliberately not checked here.',
                'The remote-asset, !important and :has() counts are aggregates: they say where to look, not that the theme is wrong.',
                'Known false negative: a URL written with CSS character escapes, such as url("\\68 ttps://example.com/x.png"), is not decoded and so is not matched — and this is the policy-tier rule.',
                'Nothing is rendered and nothing is executed; visual correctness, accessibility and rendering cost are outside a text scanner.',
            ],
            notes: [],
        });
        emitReport(report, RULES, format);
        process.exitCode = exitCodeFor(report);
    } catch (error) {
        writeUsageError(error, USAGE);
    }
}

// Importable for the rule-table checks in verify.mjs; only a direct invocation runs the linter.
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
