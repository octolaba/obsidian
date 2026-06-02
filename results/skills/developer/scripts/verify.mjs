#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { EXIT, SOURCE_CLASSES, isFile, parseArgs, readJson, toPosix, walkFiles } from './lib.mjs';
import {
    ALIASES,
    IDENTITY,
    IDENTITY_STATUS,
    SOURCES,
    buildIdentityRecord,
    discoverRoots,
    manifestFiles,
    verifySourceIdentity,
} from './identity.mjs';
import { RULES as PLUGIN_RULES } from './plugin-lint.mjs';
import { RULES as THEME_RULES } from './theme-lint.mjs';

const EXPECTED_SKILL_NAME = 'obsidian-developer';

/**
 * The runtime skill name and the storage path are independent namespaces: each is pinned to its
 * own constant, so renaming one can never be masked by renaming the other.
 */
const EXPECTED_DIRECTORY_BASENAME = 'developer';
const EXPECTED_SOURCE = 'obsidianmd/obsidian-api';
const EXPECTED_VERSION = '1.13.2';
const EXPECTED_BASIS = 'source';

/** Extraction deletes this section, so its heading is matched exactly, never by prefix. */
const REPOSITORY_SECTION_HEADING = '## Repository-only verification (remove when extracting this skill)';

const SCRIPT_ROOT = path.dirname(fileURLToPath(import.meta.url));
const SKILL_ROOT = path.dirname(SCRIPT_ROOT);

const USAGE = [
    'usage: node verify.mjs [--<source>-root PATH ...] [--format text|json] [--write-fingerprints]',
    `  roots: ${ALIASES.map(alias => `--${SOURCES[alias].flag}`).join(' ')}`,
    '  every root is discovered by content sentinel when its flag is omitted',
].join('\n');

const REQUIRED_PORTABLE_FILES = [
    'SKILL.md',
    'agents/openai.yaml',
    'scripts/lib.mjs',
    'scripts/identity.mjs',
    'scripts/plugin-lint.mjs',
    'scripts/theme-lint.mjs',
    'scripts/dev-vault.mjs',
    'scripts/verify.mjs',
    'scripts/test.mjs',
    'scripts/fixtures/upstream-identity.json',
];

const REFERENCE_FILES = [
    'project-setup.md',
    'decision-guides.md',
    'lifecycle-and-registration.md',
    'workspace-views-and-state.md',
    'vault-and-metadata.md',
    'settings.md',
    'ui-surfaces.md',
    'editor-extensions.md',
    'themes-and-css.md',
    'mobile-and-compat.md',
    'performance.md',
    'security-and-policies.md',
    'releasing.md',
    'code-review.md',
    'debugging.md',
];

const SCRIPT_FILES = [
    'scripts/plugin-lint.mjs',
    'scripts/theme-lint.mjs',
    'scripts/dev-vault.mjs',
    'scripts/verify.mjs',
    'scripts/test.mjs',
];

/**
 * A tool whose input is not written down anywhere is a tool the reader has to discover by running it
 * argument-less and reading the usage error. Every flag below has to appear in the prose the
 * extracted copy keeps — so the repository-only section of SKILL.md does not count as a home.
 */
const DOCUMENTED_FLAGS = [
    ['plugin-lint.mjs', ['--plugin-root', '--new', '--published', '--release', '--format']],
    ['theme-lint.mjs', ['--theme-root', '--new', '--published', '--format']],
    ['dev-vault.mjs', ['--plugin', '--theme', '--snippet', '--copy', '--link', '--config-dir', '--refresh']],
    ['verify.mjs', ['--format', '--write-fingerprints']],
    ['test.mjs', ['--sample-plugin-root', '--sample-theme-root']],
];

/**
 * Curated invariants: the sentences and declarations this skill's rules and traps are read from.
 * Identity gates before these run, so they are a targeted second line rather than a full diff.
 * No `@since` is asserted for a symbol the typings leave untagged.
 */
const INVARIANTS = [
    { id: 'policy-telemetry', alias: 'docs', file: 'en/Developer policies.md', patterns: [/Include client-side telemetry\./] },
    { id: 'policy-self-update', alias: 'docs', file: 'en/Developer policies.md', patterns: [/Include a mechanism that updates the plugin\./] },
    { id: 'policy-theme-network', alias: 'docs', file: 'en/Developer policies.md', patterns: [/Themes may not load assets from the network\./] },
    { id: 'policy-disclosures', alias: 'docs', file: 'en/Developer policies.md', patterns: [/Network use\. Clearly explain which remote services are used and why they're needed\./, /Payment is required for full access\./] },
    { id: 'policy-license', alias: 'docs', file: 'en/Developer policies.md', patterns: [/Include a \[LICENSE file\]/, /clearly indicate the license of your plugin or theme/] },
    { id: 'policy-forks', alias: 'docs', file: 'en/Developer policies.md', patterns: [/are not allowed in the Community directory unless they meet one of the following criteria/] },
    { id: 'policy-removal', alias: 'docs', file: 'en/Developer policies.md', patterns: [/Plugins and themes that don't follow these policies will be removed from the directory\./] },

    { id: 'manifest-id-rule', alias: 'docs', file: 'en/Reference/Manifest.md', patterns: [/The ID must contain only lowercase letters and hyphens, can't end with `plugin`, and can't contain `obsidian`\./] },
    { id: 'manifest-name-obsidian', alias: 'docs', file: 'en/Reference/Manifest.md', patterns: [/Do not include the word "Obsidian" or variations like "Obsi-" and "-sidian"\./] },
    { id: 'manifest-name-word-ban', alias: 'docs', file: 'en/Reference/Manifest.md', patterns: [/Themes may not contain the word "Theme", and plugins may not contain the word "Plugin"\./] },
    { id: 'manifest-basic-latin', alias: 'docs', file: 'en/Reference/Manifest.md', patterns: [/\[Basic Latin\][\s\S]{0,140}characters only/] },
    { id: 'manifest-folder-id', alias: 'docs', file: 'en/Reference/Manifest.md', patterns: [/the `id` should match the plugin's folder name; otherwise some methods, such as `onExternalSettingsChange`, won't be called/] },
    { id: 'manifest-funding-shape', alias: 'docs', file: 'en/Reference/Manifest.md', patterns: [/`fundingUrl` can either be a string with a single URL, or an object with multiple URLs\./] },
    { id: 'manifest-theme-name-immutable', alias: 'docs', file: 'en/Reference/Manifest.md', patterns: [/Theme names cannot be changed once the theme has been submitted to the community directory\./] },

    { id: 'submission-description-rules', alias: 'docs', file: 'en/Plugins/Releasing/Submission requirements for plugins.md', patterns: [/Have 250 characters maximum\./, /End with a period `\.`\./, /Avoid using emoji or special characters\./, /Avoid starting your description with "This is a plugin"/] },
    { id: 'submission-desktop-only', alias: 'docs', file: 'en/Plugins/Releasing/Submission requirements for plugins.md', patterns: [/you \*\*must\*\* set `isDesktopOnly` to `true` in the `manifest\.json`/] },
    { id: 'submission-command-prefix', alias: 'docs', file: 'en/Plugins/Releasing/Submission requirements for plugins.md', patterns: [/Obsidian automatically prefixes command IDs with your plugin ID\./] },
    { id: 'submission-remove-sample', alias: 'docs', file: 'en/Plugins/Releasing/Submission requirements for plugins.md', patterns: [/sample code should be removed from your plugin before submission/] },

    { id: 'submit-portal-head', alias: 'docs', file: 'en/Plugins/Releasing/Submit your plugin.md', patterns: [/The directory processes the `manifest\.json` at the HEAD of your repository's default branch/, /The `id` must be unique across all published plugins and can't contain `obsidian`\./] },
    { id: 'submit-automated-review', alias: 'docs', file: 'en/Plugins/Releasing/Submit your plugin.md', patterns: [/your plugin is reviewed automatically/, /publish a new GitHub release with an incremented version/] },
    { id: 'submit-semver-and-tag', alias: 'docs', file: 'en/Plugins/Releasing/Submit your plugin.md', patterns: [/Versions supported only in the format `x\.y\.z`\./, /The "Tag version" of the release must match the version in your `manifest\.json`\./] },
    { id: 'submit-assets', alias: 'docs', file: 'en/Plugins/Releasing/Submit your plugin.md', patterns: [/Upload the following plugin assets to the release as binary attachments/, /`styles\.css` \(optional\)/] },

    { id: 'guidelines-innerhtml', alias: 'docs', file: 'en/Plugins/Releasing/Plugin guidelines.md', patterns: [/Avoid `innerHTML`, `outerHTML` and `insertAdjacentHTML`/, /can allow a potential attacker to execute arbitrary code on the user's computer/, /To cleanup a HTML elements contents use `el\.empty\(\);`/] },
    { id: 'guidelines-global-app', alias: 'docs', file: 'en/Plugins/Releasing/Plugin guidelines.md', patterns: [/Avoid using the global app object, `app` \(or `window\.app`\)/] },
    { id: 'guidelines-default-hotkey', alias: 'docs', file: 'en/Plugins/Releasing/Plugin guidelines.md', patterns: [/Setting a default hotkey may lead to conflicts between plugins/] },
    { id: 'guidelines-detach-leaves', alias: 'docs', file: 'en/Plugins/Releasing/Plugin guidelines.md', patterns: [/Don't detach leaves in `onunload`/] },
    { id: 'guidelines-severity-clause', alias: 'docs', file: 'en/Plugins/Releasing/Plugin guidelines.md', patterns: [/While the guidelines on this page are recommendations, depending on their severity, we may still require you to address any violations\./] },
    { id: 'guidelines-setheading', alias: 'docs', file: 'en/Plugins/Releasing/Plugin guidelines.md', patterns: [/Use `setHeading` instead of a `<h1>`, `<h2>`/] },
    { id: 'guidelines-styling-and-vault', alias: 'docs', file: 'en/Plugins/Releasing/Plugin guidelines.md', patterns: [/No hardcoded styling/, /Prefer the Editor API instead of `Vault\.modify` to the active file/, /Avoid iterating all files to find a file by its path/, /Avoid accessing `workspace\.activeLeaf` directly/] },

    { id: 'theme-guidelines-scope', alias: 'docs', file: 'en/Themes/App themes/Theme guidelines.md', patterns: [/Override general variables under `body`, and colors under `\.theme-light` or `\.theme-dark`\./] },
    { id: 'theme-guidelines-assets', alias: 'docs', file: 'en/Themes/App themes/Theme guidelines.md', patterns: [/community themes must not load remote assets/, /all resources must be bundled into your theme/] },
    { id: 'theme-guidelines-important', alias: 'docs', file: 'en/Themes/App themes/Theme guidelines.md', patterns: [/Declaring styles as `!important` prevents users from overriding styles from your theme using snippets\./] },
    { id: 'theme-submit-files', alias: 'docs', file: 'en/Themes/App themes/Submit your theme.md', patterns: [/A screenshot of your theme to be displayed in the community theme store/, /`theme\.css`/] },

    { id: 'checklist-repo-hygiene', alias: 'docs', file: 'en/Obsidian October plugin self-critique checklist.md', patterns: [/Don't include `main\.js` in your repo/, /Do commit and use a lock file/] },
    { id: 'checklist-configdir', alias: 'docs', file: 'en/Obsidian October plugin self-critique checklist.md', patterns: [/please use `Vault\.configDir` instead/] },
    { id: 'checklist-mobile-scope', alias: 'docs', file: 'en/Obsidian October plugin self-critique checklist.md', patterns: [/Complete this section if you have `isDesktopOnly` set to false in your manifest\./, /Don't use regex lookbehinds/, /Don't use `process\.platform`/, /Don't use `fetch` or `axios\.get`/] },
    { id: 'theme-checklist-perf', alias: 'docs', file: 'en/Obsidian October theme self-critique checklist.md', patterns: [/Don't use `!important`\./, /Don't use `:has\(\)` unless absolutely necessary/] },

    { id: 'mobile-node-electron', alias: 'docs', file: 'en/Plugins/Getting started/Mobile development.md', patterns: [/The Node\.js API, and the Electron API aren't available on mobile devices\./, /Lookbehind in regular expressions is only supported on iOS 16\.4 and above/] },
    { id: 'versions-fallback', alias: 'docs', file: 'en/Reference/Versions.md', patterns: [/`versions\.json` contains a JSON object, where the key is the plugin version, and the value is the corresponding `minAppVersion`\./, /Obsidian looks for a `versions\.json` file at the root of the plugin repository/, /You only need to update `versions\.json` if you change the `minAppVersion` for your plugin\./] },
    { id: 'settings-declarative-boundary', alias: 'docs', file: 'en/Plugins/User interface/Settings.md', patterns: [/1\.13/] },
    { id: 'build-a-plugin-dev-vault', alias: 'docs', file: 'en/Plugins/Getting started/Build a plugin.md', patterns: [/you should never develop plugins in your main vault/, /rebuilds the plugin when you modify the source code/] },

    { id: 'dts-register-event', alias: 'api', file: 'obsidian.d.ts', patterns: [/registerEvent\(eventRef: EventRef\): void;/] },
    { id: 'dts-process-frontmatter', alias: 'api', file: 'obsidian.d.ts', patterns: [/@throws YAMLParseError if the YAML parsing fails/, /processFrontMatter\(file: TFile, fn: \(frontmatter: any\) => void, options\?: DataWriteOptions\): Promise<void>;/] },
    { id: 'dts-bases-view', alias: 'api', file: 'obsidian.d.ts', patterns: [/@returns false if bases are not enabled in this vault\.[\s\S]{0,80}@since 1\.10\.0[\s\S]{0,40}registerBasesView\(/] },
    { id: 'dts-secret-storage', alias: 'api', file: 'obsidian.d.ts', patterns: [/@since 1\.11\.4\s*\*\/\s*export class SecretStorage extends Events/] },
    { id: 'dts-declarative-settings', alias: 'api', file: 'obsidian.d.ts', patterns: [/@deprecated Since 1\.13\.0\. Use \{@link getSettingDefinitions\} instead\./, /getSettingDefinitions\(\): SettingDefinitionItem\[\];/] },
    { id: 'dts-cli-handler', alias: 'api', file: 'obsidian.d.ts', patterns: [/Command IDs must be globally unique\. Attempting to register a command that is already registered will throw an Error\./, /@since 1\.12\.2[\s\S]{0,40}registerCliHandler\(/] },
    { id: 'dts-command-prefix', alias: 'api', file: 'obsidian.d.ts', patterns: [/The command id and name will be automatically prefixed with this plugin's id and name/] },
    { id: 'dts-requesturl-throw', alias: 'api', file: 'obsidian.d.ts', patterns: [/Whether to throw an error when the status code is 400\+\s*\n\s*\* Defaults to true/] },
    { id: 'dts-require-api-version', alias: 'api', file: 'obsidian.d.ts', patterns: [/export function requireApiVersion\(version: string\): boolean;/] },
    { id: 'dts-get-language', alias: 'api', file: 'obsidian.d.ts', patterns: [/@since 1\.8\.7\s*\*\/\s*export function getLanguage\(\): string;/] },
    { id: 'dts-config-dir', alias: 'api', file: 'obsidian.d.ts', patterns: [/typically `\.obsidian` but it could be different[\s\S]{0,240}configDir: string;/] },
    { id: 'dts-status-bar-mobile', alias: 'api', file: 'obsidian.d.ts', patterns: [/Not available on mobile[\s\S]{0,200}addStatusBarItem\(\): HTMLElement;/] },
    { id: 'dts-window-set-interval', alias: 'api', file: 'obsidian.d.ts', patterns: [/Use \{@link window\.setInterval\} instead of \{@link setInterval\}[\s\S]{0,120}registerInterval\(id: number\): number;/] },
    { id: 'dts-active-leaf-deprecated', alias: 'api', file: 'obsidian.d.ts', patterns: [/@deprecated The use of this field is discouraged\.[\s\S]{0,400}activeLeaf: WorkspaceLeaf \| null;/] },
    { id: 'dts-vault-process-sync', alias: 'api', file: 'obsidian.d.ts', patterns: [/process\(file: TFile, fn: \(data: string\) => string, options\?: DataWriteOptions\): Promise<string>;/] },
    { id: 'api-package-version', alias: 'api', file: 'package.json', patterns: [/"version": "1\.13\.2"/] },
    { id: 'api-changelog-stale', alias: 'api', file: 'CHANGELOG.md', patterns: [/1\.7\.2/] },

    { id: 'sample-externals', alias: 'sample', file: 'esbuild.config.mjs', patterns: [/'obsidian',/, /'@codemirror\/state',/, /\.\.\.builtinModules,/, /minify: prod,/, /sourcemap: prod \? false : 'inline',/] },
    { id: 'sample-eslint-obsidianmd', alias: 'sample', file: 'eslint.config.mts', patterns: [/\.\.\.obsidianmd\.configs\.recommended,/] },
    { id: 'sample-npmrc', alias: 'sample', file: '.npmrc', patterns: [/tag-version-prefix=""/] },
    { id: 'sample-release-draft', alias: 'sample', file: '.github/workflows/release.yml', patterns: [/--draft/] },
    { id: 'sample-gitignore-main', alias: 'sample', file: '.gitignore', patterns: [/^main\.js$/m] },
    { id: 'sample-id-suffix', alias: 'sample', file: 'manifest.json', patterns: [/"id": "sample-plugin"/, /"name": "Sample Plugin"/] },

    { id: 'theme-template-versions', alias: 'theme', file: 'versions.json', patterns: [/"1\.0\.0": "1\.0\.0"/] },
    { id: 'theme-template-manifest', alias: 'theme', file: 'manifest.json', patterns: [/"name": "Sample Theme"/] },

    { id: 'rel-mirror-source', alias: 'rel', file: '.github/workflows/mirror-community-json.yml', patterns: [/https:\/\/community\.obsidian\.md\/assets\/community-plugins\.json/, /cron: "17 \* \* \* \*"/] },
    { id: 'rel-stable-version', alias: 'rel', file: 'desktop-releases.json', patterns: [/"latestVersion": "1\.12\.7"/] },
    { id: 'rel-readme-pipeline', alias: 'rel', file: 'README.md', patterns: [/The `manifest\.json` in your repo will only be used to figure out the latest version/, /tagged identically to the version inside `manifest\.json`/] },

    { id: 'help-cli-gates', alias: 'help', file: 'en/Extending Obsidian/Obsidian CLI.md', patterns: [/Requires Obsidian 1\.12 installer/, /Obsidian installer version\]\] \(1\.12\.7\+\)/, /Enable \*\*Command line interface\*\*/, /If Obsidian is not running, the first command you run launches Obsidian/] },
    { id: 'help-cli-commands', alias: 'help', file: 'en/Extending Obsidian/Obsidian CLI.md', patterns: [/### `plugin:reload`/, /### `dev:mobile`/, /### `dev:debug`/, /### `dev:errors`/] },
    { id: 'help-config-dir-default', alias: 'help', file: 'en/Obsidian Sync/Headless Sync.md', patterns: [/Config directory\]\] name \(default: `\.obsidian`\)/] },
    { id: 'help-restricted-mode', alias: 'help', file: 'en/Extending Obsidian/Plugin security.md', patterns: [/By default, Obsidian runs in Restricted Mode to prevent third-party code execution/, /plugins will inherit\nObsidian's access levels|plugins will inherit Obsidian's access levels/] },
    { id: 'help-no-auto-update', alias: 'help', file: 'en/Extending Obsidian/Community plugins.md', patterns: [/date/i] },
];

function assertion(checks, id, passed, message, evidence = null, kind = 'validation') {
    checks.push({ id, passed: Boolean(passed), message, evidence, kind });
}

function readLines(root, relative) {
    const absolute = path.join(root, ...relative.split('/'));
    if (!isFile(absolute)) return null;
    return fs.readFileSync(absolute, 'utf8').replace(/\r\n?/g, '\n').split('\n');
}

function parseFrontmatter(text) {
    const match = /^---\n([\s\S]*?)\n---(?:\n|$)/.exec(text);
    if (!match) return null;
    const result = {};
    for (const line of match[1].split('\n')) {
        const field = /^([A-Za-z0-9_-]+):\s*(.*)$/.exec(line);
        if (!field) continue;
        const raw = field[2];
        result[field[1]] =
            (raw.startsWith('"') && raw.endsWith('"')) || (raw.startsWith("'") && raw.endsWith("'"))
                ? raw.slice(1, -1)
                : raw;
    }
    return result;
}

function slugifyHeading(value) {
    return value
        .toLowerCase()
        .replace(/`/g, '')
        .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
        .replace(/[^\p{Letter}\p{Number}\s-]/gu, '')
        .trim()
        .replace(/\s+/g, '-');
}

function headingAnchors(file, cache) {
    if (cache.has(file)) return cache.get(file);
    const anchors = new Set();
    const text = fs.readFileSync(file, 'utf8').replace(/\r\n?/g, '\n');
    let fence = null;
    for (const line of text.split('\n')) {
        const fenceMatch = /^\s*(`{3,}|~{3,})/.exec(line);
        if (fenceMatch) {
            if (!fence) fence = fenceMatch[1][0];
            else if (fence === fenceMatch[1][0]) fence = null;
            continue;
        }
        if (fence) continue;
        const heading = /^(#{1,6})\s+(.*?)\s*$/.exec(line);
        if (heading) anchors.add(slugifyHeading(heading[2]));
    }
    cache.set(file, anchors);
    return anchors;
}

/** The artifact: SKILL.md and the references. Fixtures are deliberately outside this set. */
function artifactMarkdown() {
    return walkFiles(SKILL_ROOT)
        .filter(file => file.endsWith('.md'))
        .filter(file => !toPosix(path.relative(SKILL_ROOT, file)).startsWith('scripts/fixtures/'));
}

const CITATION_GROUP = /\(([a-z][a-z0-9-]{0,9}:\s[^()]*?)\)/g;
const CITATION_SEGMENT = /^([a-z][a-z0-9-]{0,9}):\s(.+):(\d+)(?:-(\d+))?$/;
const PATH_LINE_SHAPE = /[^\s()[\]`]*\.[A-Za-z0-9]{1,6}:\d+(?:-\d+)?/g;

/**
 * Closed-grammar citation parser: `(alias: path:line)` or `(alias: path:line-line)`, several joined
 * by `; `. Anything path:line-shaped that this parser did not consume is reported, because an
 * unparsed citation is one that is never checked against the pin.
 */
function parseCitations(text) {
    const citations = [];
    const malformed = [];
    const spans = [];
    for (const group of text.matchAll(CITATION_GROUP)) {
        const body = group[1];
        if (!/[^\s]+:\d+/.test(body)) continue;
        if (/^(?:https?|mailto|ftp):/.test(body)) continue;
        spans.push([group.index, group.index + group[0].length]);
        for (const segment of body.split(';').map(item => item.trim())) {
            const parsed = CITATION_SEGMENT.exec(segment);
            if (!parsed) {
                malformed.push(`malformed citation segment ${JSON.stringify(segment)}`);
                continue;
            }
            const [, alias, file, start, end] = parsed;
            citations.push({
                alias,
                file,
                start: Number(start),
                end: end === undefined ? Number(start) : Number(end),
                raw: segment,
            });
        }
    }
    const stray = [];
    for (const match of text.matchAll(PATH_LINE_SHAPE)) {
        const inside = spans.some(([from, to]) => match.index >= from && match.index + match[0].length <= to);
        if (inside) continue;
        const context = text.slice(Math.max(0, match.index - 12), match.index + match[0].length);
        if (/:\/\//.test(context)) continue;
        stray.push(match[0]);
    }
    return { citations, malformed, stray };
}

function verifyIdentity(roots, checks) {
    assertion(
        checks,
        'identity-record-present',
        Boolean(IDENTITY?.sources),
        'fixtures/upstream-identity.json carries a record per source',
        IDENTITY ? Object.keys(IDENTITY.sources).join(', ') : 'missing',
        'identity',
    );
    for (const alias of ALIASES) {
        const result = verifySourceIdentity(alias, roots[alias]);
        assertion(
            checks,
            `identity-${alias}`,
            result.status === IDENTITY_STATUS.verified,
            `${SOURCES[alias].repo} is the studied pin ${SOURCES[alias].commit}`,
            result.reason ?? `${result.actual?.files} files`,
            'identity',
        );
    }
}

function verifyInvariants(roots, checks) {
    for (const invariant of INVARIANTS) {
        const root = roots[invariant.alias];
        const lines = root ? readLines(root, invariant.file) : null;
        if (!lines) {
            assertion(checks, `invariant-${invariant.id}`, false, `${invariant.alias}: ${invariant.file} exists`, 'missing');
            continue;
        }
        const text = lines.join('\n');
        const misses = invariant.patterns.filter(pattern => !pattern.test(text)).map(String);
        assertion(
            checks,
            `invariant-${invariant.id}`,
            misses.length === 0,
            `${invariant.alias}: ${invariant.file} retains the relied-on statement`,
            misses.join('; '),
        );
    }
}

function verifyFrontmatter(main, roots, checks) {
    const frontmatter = parseFrontmatter(main);
    assertion(checks, 'skill-frontmatter', Boolean(frontmatter), 'SKILL.md opens with YAML frontmatter');
    assertion(checks, 'skill-name', frontmatter?.name === EXPECTED_SKILL_NAME, `skill name is exactly ${EXPECTED_SKILL_NAME}`, frontmatter?.name);
    assertion(
        checks,
        'skill-directory-basename',
        path.basename(SKILL_ROOT) === EXPECTED_DIRECTORY_BASENAME,
        `skill directory basename is exactly ${EXPECTED_DIRECTORY_BASENAME}`,
        path.basename(SKILL_ROOT),
    );
    assertion(checks, 'skill-source', frontmatter?.source === EXPECTED_SOURCE, `skill source is ${EXPECTED_SOURCE}`, frontmatter?.source);
    assertion(checks, 'skill-version', frontmatter?.version === EXPECTED_VERSION, `skill version is ${EXPECTED_VERSION}`, frontmatter?.version);
    assertion(checks, 'skill-basis', frontmatter?.basis === EXPECTED_BASIS, `skill basis is ${EXPECTED_BASIS}`, frontmatter?.basis);
    const description = frontmatter?.description ?? '';
    assertion(
        checks,
        'description-version-boundary',
        description.includes(EXPECTED_VERSION),
        `description names the studied version ${EXPECTED_VERSION}`,
        description.slice(0, 80),
    );
    assertion(
        checks,
        'description-routes-neighbours',
        description.includes('Dataview') && description.includes('Tasks'),
        'description routes vault-side Dataview and Tasks questions to their own skills',
        description.slice(-120),
    );
    assertion(
        checks,
        'description-covers-consultation',
        /explaining how Obsidian extension development works/i.test(description) && /Selecting an existing third-party plugin or theme/i.test(description),
        'description covers explanatory consultation and excludes ecosystem product selection',
        description.slice(0, 180),
    );
    assertion(
        checks,
        'description-shape',
        description.length > 0 && description.length <= 1024 && !/[<>]/.test(description),
        'description is a usable, portable trigger surface',
        `${description.length} characters`,
    );

    const apiPackage = roots.api ? readJson(path.join(roots.api, 'package.json'), null) : null;
    assertion(
        checks,
        'api-version-matches-frontmatter',
        apiPackage?.version === EXPECTED_VERSION,
        `the typings package at the pin declares version ${EXPECTED_VERSION}`,
        apiPackage?.version,
    );
    for (const alias of ALIASES) {
        assertion(
            checks,
            `sources-commit-${alias}`,
            main.includes(SOURCES[alias].commit),
            `SKILL.md records the full commit for ${SOURCES[alias].repo}`,
            SOURCES[alias].commit,
        );
    }
}

function verifyStructure(main, checks) {
    const lines = main.split('\n');
    assertion(checks, 'skill-length', lines.length <= 400, 'SKILL.md stays within 400 lines', `${lines.length} lines`);

    for (const relative of REQUIRED_PORTABLE_FILES) {
        assertion(checks, `required-${relative.replace(/\W+/g, '-')}`, isFile(path.join(SKILL_ROOT, relative)), `required portable file exists: ${relative}`);
    }
    for (const reference of REFERENCE_FILES) {
        assertion(
            checks,
            `route-reference-${reference.replace(/\W+/g, '-')}`,
            main.includes(`](reference/${reference})`),
            `SKILL.md links reference/${reference}`,
        );
    }
    for (const script of SCRIPT_FILES) {
        assertion(checks, `route-script-${script.replace(/\W+/g, '-')}`, main.includes(`](${script})`), `SKILL.md links ${script}`);
    }

    const referenceRoot = path.join(SKILL_ROOT, 'reference');
    for (const file of walkFiles(referenceRoot).filter(item => item.endsWith('.md'))) {
        const text = fs.readFileSync(file, 'utf8').replace(/\r\n?/g, '\n');
        const count = text.split('\n').length;
        assertion(
            checks,
            `contents-${path.basename(file)}`,
            count <= 100 || text.split('\n').slice(0, 25).includes('## Contents'),
            `${path.basename(file)} opens with a Contents list when longer than 100 lines`,
            `${count} lines`,
        );
    }

    const headingOccurrences = main.split(REPOSITORY_SECTION_HEADING).length - 1;
    assertion(
        checks,
        'repository-section-once',
        headingOccurrences === 1,
        `SKILL.md carries the repository-only heading exactly once, verbatim`,
        `${headingOccurrences} occurrence(s)`,
    );
    const sectionIndex = main.indexOf(REPOSITORY_SECTION_HEADING);
    const repositoryPaths = [];
    for (const file of artifactMarkdown()) {
        const relative = toPosix(path.relative(SKILL_ROOT, file));
        const text = fs.readFileSync(file, 'utf8').replace(/\r\n?/g, '\n');
        for (const match of text.matchAll(/\b(?:research|results)\//g)) {
            if (relative === 'SKILL.md' && sectionIndex !== -1 && match.index > sectionIndex) continue;
            repositoryPaths.push(`${relative}:${text.slice(0, match.index).split('\n').length}`);
        }
    }
    assertion(
        checks,
        'repository-paths-confined',
        repositoryPaths.length === 0,
        'repository paths appear only inside the section extraction removes',
        repositoryPaths.join('; '),
    );

    const linkErrors = [];
    const fragmentErrors = [];
    const anchorCache = new Map();
    for (const file of artifactMarkdown()) {
        const relative = toPosix(path.relative(SKILL_ROOT, file));
        const text = fs.readFileSync(file, 'utf8').replace(/\r\n?/g, '\n');
        for (const match of text.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)) {
            const raw = match[1].trim();
            if (!raw) continue;
            if (/^[a-z]+:\/\//i.test(raw) || raw.startsWith('mailto:') || path.isAbsolute(raw)) {
                if (/^[a-z]+:\/\//i.test(raw)) continue;
                linkErrors.push(`${relative}: non-portable link ${raw}`);
                continue;
            }
            const [rawTarget, ...rest] = raw.split('#');
            const fragment = rest.join('#');
            const target = decodeURIComponent(rawTarget);
            const resolved = target === '' ? file : path.resolve(path.dirname(file), target);
            if ((resolved !== SKILL_ROOT && !resolved.startsWith(`${SKILL_ROOT}${path.sep}`)) || !fs.existsSync(resolved)) {
                linkErrors.push(`${relative}: unresolved or escaping link ${raw}`);
                continue;
            }
            if (fragment && resolved.endsWith('.md')) {
                const anchors = headingAnchors(resolved, anchorCache);
                const decoded = decodeURIComponent(fragment);
                if (!anchors.has(slugifyHeading(decoded)) && !anchors.has(slugifyHeading(decoded.replace(/-/g, ' ')))) {
                    fragmentErrors.push(`${relative}: unresolved heading fragment ${raw}`);
                }
            }
        }
    }
    let portableProse = '';
    const unsafeAvailabilityClaims = [];
    for (const file of artifactMarkdown()) {
        const text = fs.readFileSync(file, 'utf8').replace(/\r\n?/g, '\n');
        const isMain = toPosix(path.relative(SKILL_ROOT, file)) === 'SKILL.md';
        portableProse += `${isMain && sectionIndex !== -1 ? text.slice(0, sectionIndex) : text}\n`;
        const relative = toPosix(path.relative(SKILL_ROOT, file));
        for (const [index, paragraph] of text.split(/\n\s*\n/).entries()) {
            const flat = paragraph.replace(/\s+/g, ' ');
            if (
                /\buntagged\s*(?:,|and|—|-)\s*(?:\*\*)?stable\b/i.test(flat) ||
                /\|\s*untagged\s*\|\s*stable\s*\|/i.test(flat) ||
                /\buntagged\b.{0,100}\busable at 1\.12\.7\b/i.test(flat) ||
                /no `?@since`? tag[^.]{0,100}\bstable at pin\b/i.test(flat)
            ) {
                unsafeAvailabilityClaims.push(`${relative}: paragraph ${index + 1}`);
            }
        }
    }
    const undocumented = [];
    for (const [script, flags] of DOCUMENTED_FLAGS) {
        for (const flag of flags) {
            if (!new RegExp(`${flag}(?![\\w-])`).test(portableProse)) undocumented.push(`${script} ${flag}`);
        }
    }
    assertion(
        checks,
        'tool-inputs-documented',
        undocumented.length === 0,
        'every bundled tool names its inputs in prose the extracted skill keeps',
        undocumented.join('; '),
    );
    assertion(
        checks,
        'untagged-availability-honest',
        unsafeAvailabilityClaims.length === 0,
        'untagged APIs are never called stable or usable at 1.12.7 without independent evidence',
        unsafeAvailabilityClaims.join('; '),
    );

    assertion(checks, 'portable-links', linkErrors.length === 0, 'every local link resolves inside the skill directory', linkErrors.join('; '));
    assertion(checks, 'heading-fragments', fragmentErrors.length === 0, 'every link fragment resolves to a heading in its target', fragmentErrors.join('; '));
}

function verifyCitations(roots, checks) {
    const errors = [];
    const strays = [];
    const malformed = [];
    const citedBySource = Object.fromEntries(ALIASES.map(alias => [alias, new Set()]));
    const lineCache = new Map();
    const linesOf = (alias, file) => {
        const key = `${alias}\u0000${file}`;
        if (!lineCache.has(key)) lineCache.set(key, roots[alias] ? readLines(roots[alias], file) : null);
        return lineCache.get(key);
    };

    let total = 0;
    for (const markdown of artifactMarkdown()) {
        const relative = toPosix(path.relative(SKILL_ROOT, markdown));
        const text = fs.readFileSync(markdown, 'utf8').replace(/\r\n?/g, '\n');
        const parsed = parseCitations(text);
        malformed.push(...parsed.malformed.map(item => `${relative}: ${item}`));
        strays.push(...parsed.stray.map(item => `${relative}: ${item}`));
        for (const citation of parsed.citations) {
            total += 1;
            if (!ALIASES.includes(citation.alias)) {
                errors.push(`${relative}: unknown alias in ${citation.raw}`);
                continue;
            }
            citedBySource[citation.alias].add(citation.file);
            const lines = linesOf(citation.alias, citation.file);
            if (!lines) {
                errors.push(`${relative}: missing source file ${citation.alias}: ${citation.file}`);
                continue;
            }
            // Range rule: both endpoints must exist and be non-blank; interior blank lines are
            // allowed, because a cited block legitimately spans them.
            for (const line of [citation.start, citation.end]) {
                if (line < 1 || line > lines.length || lines[line - 1].trim() === '') {
                    errors.push(`${relative}: blank or out-of-range endpoint ${citation.alias}: ${citation.file}:${line}`);
                }
            }
            if (citation.end < citation.start) errors.push(`${relative}: inverted range ${citation.raw}`);
        }
    }
    assertion(checks, 'citations-parsed', malformed.length === 0, 'every citation matches the closed grammar', malformed.join('; '));
    assertion(checks, 'citations-no-stray-shapes', strays.length === 0, 'no path:line-shaped string escapes the citation grammar', [...new Set(strays)].slice(0, 12).join('; '));
    assertion(checks, 'citations-resolve', errors.length === 0, `all ${total} citations resolve to non-blank pinned lines`, [...new Set(errors)].slice(0, 12).join('; '));

    for (const alias of ALIASES) {
        const manifest = roots[alias] ? new Set(manifestFiles(alias, roots[alias])) : new Set();
        const outside = [...citedBySource[alias]].filter(file => !manifest.has(file)).sort();
        assertion(
            checks,
            `cited-subset-${alias}`,
            outside.length === 0,
            `every cited ${alias} file is part of the studied material manifest`,
            outside.slice(0, 6).join('; '),
        );
    }
    return citedBySource;
}

function verifyTools(roots, checks) {
    const scripts = walkFiles(path.join(SKILL_ROOT, 'scripts')).filter(file => file.endsWith('.mjs'));
    const syntaxErrors = [];
    for (const file of scripts) {
        const result = spawnSync(process.execPath, ['--check', file], { encoding: 'utf8' });
        if (result.status !== 0) syntaxErrors.push(`${path.basename(file)}: ${(result.stderr || result.stdout).trim()}`);
    }
    assertion(checks, 'script-syntax', syntaxErrors.length === 0, 'every bundled script parses in Node', syntaxErrors.join('; '));

    // A shebang and the executable bit go together, and only on an entry point.
    const modeErrors = [];
    for (const file of scripts) {
        const shebang = fs.readFileSync(file, 'utf8').startsWith('#!');
        const executable = (fs.statSync(file).mode & 0o111) !== 0;
        if (shebang !== executable) modeErrors.push(`${path.basename(file)}: shebang=${shebang} executable=${executable}`);
    }
    assertion(checks, 'entry-point-modes', modeErrors.length === 0, 'every script with a shebang is executable and every library is not', modeErrors.join('; '));

    const tables = [
        ['plugin-lint', PLUGIN_RULES, /^ODP\d{3}$/],
        ['theme-lint', THEME_RULES, /^ODT\d{3}$/],
    ];
    const ids = new Set();
    const idErrors = [];
    const citeErrors = [];
    const tierErrors = [];
    for (const [name, table, shape] of tables) {
        for (const [id, rule] of Object.entries(table)) {
            if (!shape.test(id)) idErrors.push(`${name}: ${id} does not match ${shape}`);
            if (ids.has(id)) idErrors.push(`${name}: duplicate rule id ${id}`);
            ids.add(id);

            const segments = rule.cite.split(';').map(item => item.trim());
            let primaryKey = null;
            for (const segment of segments) {
                const parsed = CITATION_SEGMENT.exec(segment);
                if (!parsed) {
                    citeErrors.push(`${id}: malformed citation ${JSON.stringify(segment)}`);
                    continue;
                }
                const [, alias, file, start, end] = parsed;
                if (!ALIASES.includes(alias)) {
                    citeErrors.push(`${id}: unknown alias ${alias}`);
                    continue;
                }
                if (primaryKey === null) primaryKey = `${alias}: ${file}`;
                const lines = roots[alias] ? readLines(roots[alias], file) : null;
                if (!lines) {
                    citeErrors.push(`${id}: missing source ${alias}: ${file}`);
                    continue;
                }
                for (const line of [Number(start), end === undefined ? Number(start) : Number(end)]) {
                    if (line < 1 || line > lines.length || lines[line - 1].trim() === '') {
                        citeErrors.push(`${id}: blank or out-of-range ${alias}: ${file}:${line}`);
                    }
                }
            }
            const allowed = SOURCE_CLASSES[primaryKey];
            if (!allowed) {
                tierErrors.push(`${id}: ${primaryKey} has no declared source class`);
            } else {
                for (const tier of [rule.tier, rule.publishedTier].filter(Boolean)) {
                    if (!allowed.includes(tier)) {
                        tierErrors.push(`${id}: tier ${tier} is not one of ${allowed.join('|')} for ${primaryKey}`);
                    }
                }
            }
        }
    }
    assertion(checks, 'rule-ids-unique', idErrors.length === 0, 'linter rule ids are unique and well-formed', idErrors.join('; '));
    assertion(checks, 'rule-citations-resolve', citeErrors.length === 0, 'every linter rule citation resolves to a non-blank pinned line', citeErrors.slice(0, 8).join('; '));
    assertion(checks, 'rule-tiers-bound-to-source', tierErrors.length === 0, 'every rule tier is one the class of its citation may carry', tierErrors.slice(0, 8).join('; '));

    const semanticRuleErrors = [];
    for (const [id, table, tier, cite] of [
        ['ODP050', PLUGIN_RULES, 'submission', 'docs: en/Plugins/Releasing/Submission requirements for plugins.md:48'],
        ['ODP056', PLUGIN_RULES, 'convention', 'api: obsidian.d.ts:4951'],
        ['ODT008', THEME_RULES, 'guideline', 'docs: en/Themes/App themes/Theme guidelines.md:43'],
    ]) {
        const rule = table[id];
        if (!rule || rule.tier !== tier || rule.cite !== cite) {
            semanticRuleErrors.push(`${id}: expected ${tier} from ${cite}, got ${rule?.tier ?? 'missing'} from ${rule?.cite ?? 'missing'}`);
        }
    }
    assertion(
        checks,
        'rule-semantic-contracts',
        semanticRuleErrors.length === 0,
        'command prefix and !important rules retain their evidence-specific tiers and citations',
        semanticRuleErrors.join('; '),
    );

    const devVaultPath = path.join(SCRIPT_ROOT, 'dev-vault.mjs');
    const devVault = isFile(devVaultPath) ? fs.readFileSync(devVaultPath, 'utf8') : '';
    const debuggingPath = path.join(SKILL_ROOT, 'reference', 'debugging.md');
    const debugging = isFile(debuggingPath) ? fs.readFileSync(debuggingPath, 'utf8') : '';
    const devVaultSafeguards = [
        /function requireRefreshMarker\(vault\)/,
        /booleans: \['help', 'copy', 'link', 'refresh'\]/,
        /if \(!args\.refresh\) seedNotes\(vault\);/,
        /id=\$\{shellQuote\(plugin\.id\)\}/,
        /name=\$\{shellQuote\(theme\.name\)\}/,
        /name=\$\{shellQuote\(snippet\.name\)\}/,
        /changeDirectoryCommand\(vault\)/,
        /obsidian vault info=path/,
        /replaceAll\("'", "''"\)/,
        /Set-Location -LiteralPath/,
    ].filter(pattern => !pattern.test(devVault));
    assertion(
        checks,
        'dev-vault-safety-contract',
        devVaultSafeguards.length === 0 &&
            /changeDirectoryCommand\(vault\)[\s\S]*obsidian vault info=path[\s\S]*obsidian plugins:restrict off/.test(devVault) &&
            /cd -- '\/absolute\/path\/to\/throwaway-dev-vault'[\s\S]*obsidian vault info=path[\s\S]*obsidian plugins:restrict off/.test(debugging),
        'dev-vault refresh is marker-gated, preserves notes, quotes values, and targets the throwaway vault explicitly',
        devVaultSafeguards.map(String).join('; '),
    );

    const codexPath = path.join(SKILL_ROOT, 'agents', 'openai.yaml');
    const codex = isFile(codexPath) ? fs.readFileSync(codexPath, 'utf8') : '';
    const shortMatch = /^\s*short_description:\s*(?:"([^"]*)"|'([^']*)'|(.+))\s*$/m.exec(codex);
    const shortDescription = shortMatch ? (shortMatch[1] ?? shortMatch[2] ?? shortMatch[3].trim()) : '';
    assertion(
        checks,
        'codex-ui-metadata',
        codex.includes('display_name:') && codex.includes('short_description:') && codex.includes(`$${EXPECTED_SKILL_NAME}`),
        'agents/openai.yaml carries UI metadata whose default prompt names the runtime skill',
        codex ? 'present' : 'missing',
    );
    assertion(
        checks,
        'codex-short-description-length',
        shortDescription.length >= 25 && shortDescription.length <= 64,
        'agents/openai.yaml short_description is 25-64 characters',
        `${shortDescription.length} characters`,
    );
}

function main() {
    let args;
    try {
        args = parseArgs(process.argv.slice(2), {
            booleans: ['help', 'write-fingerprints'],
            values: ['format', ...ALIASES.map(alias => SOURCES[alias].flag)],
        });
    } catch (error) {
        process.stderr.write(`error: ${error.message}\n${USAGE}\n`);
        process.exitCode = EXIT.usage;
        return;
    }
    if (args.help) {
        process.stdout.write(`${USAGE}\n`);
        return;
    }
    if (args._.length) {
        process.stderr.write(`error: positional arguments are not accepted\n${USAGE}\n`);
        process.exitCode = EXIT.usage;
        return;
    }
    const format = args.format ?? 'text';
    if (!['text', 'json'].includes(format)) {
        process.stderr.write(`error: --format must be text or json\n${USAGE}\n`);
        process.exitCode = EXIT.usage;
        return;
    }

    const discovered = ALIASES.every(alias => args[SOURCES[alias].flag]) ? {} : discoverRoots(SCRIPT_ROOT);
    const roots = {};
    for (const alias of ALIASES) {
        const explicit = args[SOURCES[alias].flag];
        roots[alias] = explicit ? path.resolve(explicit) : (discovered[alias] ?? null);
    }
    const missing = ALIASES.filter(alias => {
        const root = roots[alias];
        return !root || !isFile(path.join(root, ...SOURCES[alias].sentinel.file.split('/')));
    });
    if (missing.length) {
        process.stderr.write(
            `source material missing: ${missing.map(alias => `${SOURCES[alias].repo} (--${SOURCES[alias].flag})`).join(', ')}\n${USAGE}\n`,
        );
        process.exitCode = EXIT.missingMaterial;
        return;
    }

    if (args['write-fingerprints']) {
        const citedBySource = {};
        for (const alias of ALIASES) citedBySource[alias] = [];
        for (const markdown of artifactMarkdown()) {
            const text = fs.readFileSync(markdown, 'utf8').replace(/\r\n?/g, '\n');
            for (const citation of parseCitations(text).citations) {
                if (ALIASES.includes(citation.alias)) citedBySource[citation.alias].push(citation.file);
            }
        }
        const record = buildIdentityRecord(roots, citedBySource);
        const target = path.join(SCRIPT_ROOT, 'fixtures', 'upstream-identity.json');
        fs.mkdirSync(path.dirname(target), { recursive: true });
        fs.writeFileSync(target, `${JSON.stringify(record, null, 2)}\n`);
        process.stdout.write(
            `wrote ${path.relative(SKILL_ROOT, target)}\n${ALIASES.map(
                alias => `  ${alias}: ${record.sources[alias].aggregate.files} files, ${Object.keys(record.sources[alias].files).length} hashed individually`,
            ).join('\n')}\n`,
        );
        return;
    }

    const checks = [];
    verifyIdentity(roots, checks);

    const main_ = fs.readFileSync(path.join(SKILL_ROOT, 'SKILL.md'), 'utf8').replace(/\r\n?/g, '\n');
    verifyFrontmatter(main_, roots, checks);
    verifyStructure(main_, checks);
    verifyCitations(roots, checks);
    verifyInvariants(roots, checks);
    verifyTools(roots, checks);

    const failures = checks.filter(check => !check.passed);
    // Identity outranks every other failure: a drifted pin makes the rest of the report meaningless.
    const identityFailures = failures.filter(check => check.kind === 'identity');
    const report = {
        tool: 'obsidian-developer-skill-verify',
        expected: { skill: EXPECTED_SKILL_NAME, source: EXPECTED_SOURCE, version: EXPECTED_VERSION },
        roots,
        assumptions: [
            'Identity is content-derived: a checkout is the studied pin when its material hashes match, whatever its Git state says.',
            'Identity is checked before anything else, so a passing citation check is a statement about the studied pin and about nothing else.',
            'A rule tier is legitimate when the class of the page it cites may carry that tier (lib.mjs SOURCE_CLASSES); the mapping is declared, not inferred.',
        ],
        limitations: [
            'Citations are checked for existence and non-blankness, not for meaning: the invariant list, not the citation check, is what notices a rewritten sentence.',
            'Only the endpoints of a cited range are checked; interior blank lines are allowed because a cited block legitimately spans them.',
            'Per-file hashes cover the cited surface; a change elsewhere in the studied material moves the aggregate but cannot be named file by file.',
            'Agent behaviour is not evaluated here or anywhere: nothing in this report says how the skill triggers or routes in a clean context.',
        ],
        checks,
        passed: checks.length - failures.length,
        failed: failures.length,
    };
    if (format === 'json') {
        process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
    } else {
        for (const check of checks) {
            process.stdout.write(`${check.passed ? 'PASS' : 'FAIL'} ${check.id}: ${check.message}`);
            if (!check.passed && check.evidence) process.stdout.write(` — ${check.evidence}`);
            process.stdout.write('\n');
        }
        process.stdout.write('\nassumptions:\n');
        for (const item of report.assumptions) process.stdout.write(`- ${item}\n`);
        process.stdout.write('\nlimitations:\n');
        for (const item of report.limitations) process.stdout.write(`- ${item}\n`);
        process.stdout.write(`\nobsidian-developer skill verification: ${report.passed}/${checks.length} passed\n`);
    }
    process.exitCode = identityFailures.length ? EXIT.identityMismatch : failures.length ? EXIT.findings : EXIT.clean;
}

main();
