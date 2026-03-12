#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import {
    BLOCK_LINK_REGEX,
    DEFAULT_PRESETS,
    EXIT,
    HASH_TAGS_SOURCE,
    MAX_SCAN_RUNS,
    parseArgs,
    readJson,
    toPosix,
    writeUsageError,
} from './lib.mjs';
import { IDENTITY, IDENTITY_STATUS, filesUnder, primaryFingerprint, verifyPrimaryIdentity } from './identity.mjs';

const EXPECTED_SOURCE = 'obsidian-tasks-group/obsidian-tasks';
const EXPECTED_VERSION = '8.3.0';

/**
 * The runtime skill name and the storage path are independent namespaces: each is pinned to its
 * own constant so that renaming one can never be masked by renaming the other.
 */
const EXPECTED_SKILL_NAME = 'obsidian-tasks-plugin';
const EXPECTED_DIRECTORY_BASENAME = 'tasks';

/**
 * Content join key with the query-defect deep dive. The set is declared here and asserted from
 * both sides, so a finding that gains operational guidance in one artifact cannot silently lose
 * its counterpart in the other.
 */
const EXPECTED_DEFECT_IDS = ['D1', 'D2', 'D3', 'D4', 'D5'];

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const SKILL_ROOT = path.dirname(SCRIPT_DIR);
const USAGE = `usage: node verify.mjs [--source-root PATH] [--format text|json]`;
const REPOSITORY_SECTION =
    /(?:^|\n)## Repository navigation \(remove when extracting this skill\)[\s\S]*?(?=\n## |\s*$)/;

function withoutRepositorySection(text) {
    return text.replace(REPOSITORY_SECTION, '');
}

function findDefaultSourceRoot() {
    let current = SKILL_ROOT;
    while (true) {
        const candidate = path.join(
            current,
            'research',
            'plugins',
            'obsidian-tasks-group',
            'obsidian-tasks',
        );
        if (fs.existsSync(path.join(candidate, 'manifest.json'))) return candidate;
        const parent = path.dirname(current);
        if (parent === current) break;
        current = parent;
    }
    return null;
}

function markdownFiles(root) {
    return filesUnder(root).filter((file) => file.endsWith('.md'));
}

function sourceLines(sourceRoot, relative) {
    const absolute = path.join(sourceRoot, relative);
    if (!fs.existsSync(absolute) || !fs.statSync(absolute).isFile()) return null;
    return fs.readFileSync(absolute, 'utf8').replace(/\r\n?/g, '\n').split('\n');
}

function sourceText(sourceRoot, relative) {
    const lines = sourceLines(sourceRoot, relative);
    return lines ? lines.join('\n') : null;
}

function parseFrontmatter(text) {
    const match = /^---\n([\s\S]*?)\n---\n/.exec(text);
    if (!match) return null;
    const data = {};
    for (const line of match[1].split('\n')) {
        const item = /^([A-Za-z0-9_-]+):\s*(.*)$/.exec(line);
        if (item) {
            let value = item[2];
            if (value.startsWith('"') && value.endsWith('"')) {
                try {
                    value = JSON.parse(value);
                } catch {
                    // The source-citation and repository YAML checks will report malformed data.
                }
            } else if (value.startsWith("'") && value.endsWith("'")) {
                value = value.slice(1, -1);
            }
            data[item[1]] = value;
        }
    }
    return data;
}

function assertion(checks, id, passed, message, evidence = null, kind = 'validation') {
    checks.push({ id, passed: Boolean(passed), message, evidence, kind });
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
    let fence = null;
    for (const line of fs.readFileSync(file, 'utf8').replace(/\r\n?/g, '\n').split('\n')) {
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

// ---------------------------------------------------------------------------------------------
// Identity
// ---------------------------------------------------------------------------------------------

function verifyIdentity(sourceRoot, checks) {
    assertion(
        checks,
        'identity-record',
        IDENTITY.source === EXPECTED_SOURCE &&
            IDENTITY.version === EXPECTED_VERSION &&
            /^[0-9a-f]{40}$/.test(IDENTITY.commit ?? ''),
        'checked-in identity record names the reviewed source, version and full commit',
        `${IDENTITY.source}@${IDENTITY.version}/${IDENTITY.commit}`,
        'identity',
    );
    const fingerprint = primaryFingerprint(sourceRoot);
    assertion(
        checks,
        'primary-material-count',
        fingerprint?.files === IDENTITY.materialFiles,
        'studied-file inventory size matches the reviewed pin',
        `${fingerprint?.files ?? 'missing'} vs ${IDENTITY.materialFiles}`,
        'identity',
    );
    const resolved = verifyPrimaryIdentity(sourceRoot);
    assertion(
        checks,
        'primary-material-sha256',
        resolved.status === IDENTITY_STATUS.verified,
        'primary source-content fingerprint matches the reviewed pin',
        resolved.reason ?? fingerprint?.sha256 ?? 'missing',
        'identity',
    );

    const manifest = readJson(path.join(sourceRoot, 'manifest.json'), null);
    assertion(
        checks,
        'source-version',
        manifest?.version === EXPECTED_VERSION,
        `manifest version must be ${EXPECTED_VERSION}`,
        manifest?.version ?? 'missing',
        'identity',
    );
    assertion(
        checks,
        'source-id',
        manifest?.id === 'obsidian-tasks-plugin',
        'source must be the Tasks plugin',
        manifest?.id ?? 'missing',
        'identity',
    );
}

// ---------------------------------------------------------------------------------------------
// The ported operational subset must still equal the pinned grammar it was ported from.
// These read the values out of the pinned material rather than restating them.
// ---------------------------------------------------------------------------------------------

function extractRegexSource(text, name) {
    const match = new RegExp(`${name}\\s*=\\s*/(.*)/[a-z]*;`).exec(text ?? '');
    return match ? match[1] : null;
}

function extractPinnedPresets(text) {
    if (!text) return null;
    const start = text.indexOf('export const defaultPresets = {');
    if (start === -1) return null;
    const body = text.slice(start, text.indexOf('\n};', start));
    const presets = {};
    for (const match of body.matchAll(/^\s{4}([a-z_]+):\s*\n?\s*'((?:[^'\\]|\\.)*)',?$/gm)) {
        presets[match[1]] = JSON.parse(`"${match[2].replace(/"/g, '\\"').replace(/\\'/g, "'")}"`);
    }
    return presets;
}

function verifyPortedGrammar(sourceRoot, checks) {
    const regexes = sourceText(sourceRoot, 'src/Task/TaskRegularExpressions.ts');
    const serializer = sourceText(sourceRoot, 'src/TaskSerializer/DefaultTaskSerializer.ts');
    const presetsFile = sourceText(sourceRoot, 'src/Query/Presets/Presets.ts');
    const settings = sourceText(sourceRoot, 'src/Config/Settings.ts');
    const scanner = sourceText(sourceRoot, 'src/Query/Scanner.ts');

    const pinnedBlockLink = extractRegexSource(regexes, 'blockLinkRegex');
    assertion(
        checks,
        'ported-block-link-regex',
        pinnedBlockLink !== null && pinnedBlockLink === BLOCK_LINK_REGEX.source,
        'the ported terminal block-id pattern equals the pinned blockLinkRegex',
        `pinned=${pinnedBlockLink} ported=${BLOCK_LINK_REGEX.source}`,
    );

    const pinnedHashTags = extractRegexSource(regexes, 'hashTags');
    assertion(
        checks,
        'ported-tag-grammar',
        pinnedHashTags !== null && pinnedHashTags === HASH_TAGS_SOURCE,
        'the ported tag grammar equals the pinned hashTags pattern, including its punctuation exclusions',
        `pinned=${pinnedHashTags} ported=${HASH_TAGS_SOURCE}`,
    );
    assertion(
        checks,
        'pinned-tags-from-end-anchor',
        /hashTagsFromEnd = new RegExp\(this\.hashTags\.source \+ '\$'\)/.test(regexes ?? ''),
        'the pinned end-anchored tag pattern is still hashTags plus $',
    );

    const pinnedMaxRuns = /const maxRuns = (\d+);/.exec(serializer ?? '');
    assertion(
        checks,
        'ported-scan-failsafe',
        pinnedMaxRuns !== null && Number(pinnedMaxRuns[1]) === MAX_SCAN_RUNS,
        'the ported backwards-scan failsafe equals the pinned maxRuns',
        `pinned=${pinnedMaxRuns?.[1]} ported=${MAX_SCAN_RUNS}`,
    );
    assertion(
        checks,
        'pinned-scan-exit-condition',
        /\} while \(state\.matched && runs <= maxRuns\);/.test(serializer ?? ''),
        'the pinned loop still exits on runs <= maxRuns, which permits one iteration past the failsafe',
    );
    assertion(
        checks,
        'pinned-block-link-removed-before-deserialize',
        /body = body\.replace\(TaskRegularExpressions\.blockLinkRegex, ''\)\.trim\(\);/.test(
            sourceText(sourceRoot, 'src/Task/Task.ts') ?? '',
        ),
        'a terminal block id is still removed before the serializer sees the body',
    );

    const pinnedPresets = extractPinnedPresets(presetsFile);
    const pinnedKeys = pinnedPresets ? Object.keys(pinnedPresets).sort() : [];
    const portedKeys = Object.keys(DEFAULT_PRESETS).sort();
    assertion(
        checks,
        'ported-default-presets',
        pinnedKeys.length > 0 &&
            JSON.stringify(pinnedKeys) === JSON.stringify(portedKeys) &&
            portedKeys.every((key) => pinnedPresets[key] === DEFAULT_PRESETS[key]),
        'the ported default presets equal the pinned defaultPresets, key for key and value for value',
        `pinned=${pinnedKeys.join(',')} ported=${portedKeys.join(',')}`,
    );
    assertion(
        checks,
        'pinned-presets-installed-by-default',
        /presets: defaultPresets,/.test(settings ?? ''),
        'the pinned default settings still install those presets',
    );
    assertion(
        checks,
        'pinned-includes-migration',
        /'includes' in migratedSettings && !\('presets' in migratedSettings\)/.test(settings ?? '') &&
            /migratedSettings\.presets = migratedSettings\.includes;/.test(settings ?? ''),
        'the pinned legacy includes to presets migration is unchanged',
    );
    assertion(
        checks,
        'pinned-settings-replace-not-merge',
        /settings = \{ \.\.\.settings, \.\.\.migratedSettings \};/.test(settings ?? ''),
        'loaded settings still replace the preset map wholesale rather than merging into the defaults',
    );
    assertion(
        checks,
        'pinned-line-continuations',
        /export function continueLines\(input: string\): Statement\[\]/.test(scanner ?? '') &&
            /function endsWith2Slashes\(inputLine: string\)/.test(scanner ?? ''),
        'the pinned continuation scanner still joins single trailing backslashes and halves double ones',
    );
}

function verifyInvariants(sourceRoot, checks) {
    const invariants = [
        {
            id: 'one-selected-format',
            file: 'docs/Reference/Task Formats/About Task Formats.md',
            patterns: [
                /only supports reading and writing one format at a time/,
                /no facility in Tasks to convert a vault/,
            ],
        },
        {
            id: 'query-execution-order',
            file: 'src/Query/Query.ts',
            ordered: [
                'this.filters.forEach',
                'Sort.by',
                'tasksSorted.slice',
                'new TaskGroups',
                'applyTaskLimit',
            ],
        },
        {
            id: 'filename-date-preconditions',
            file: 'src/DateTime/DateFallback.ts',
            patterns: [
                /useFilenameAsScheduledDate/,
                /matchesAnyFolder/,
                /startDate === null && dueDate === null && scheduledDate === null/,
            ],
        },
        {
            id: 'unknown-status-semantics',
            file: 'src/Statuses/Status.ts',
            patterns: [/createUnknownStatus/, /'Unknown'/, /StatusType\.TODO/],
        },
        {
            id: 'javascript-opt-in-local-state',
            file: 'src/Config/EnableJsInTasksQueries.ts',
            patterns: [
                /DEFAULT_ENABLE_JS_IN_TASKS_QUERIES = false/,
                /vault-local app storage/,
                /not persisted\s*\n\s*\* to the plugin's data\.json/,
            ],
        },
        {
            id: 'api-surface',
            file: 'src/Api/TasksApiV1.ts',
            patterns: [
                /createTaskLineModal/,
                /editTaskLineModal/,
                /executeToggleTaskDoneCommand/,
            ],
            absent: [/searchTasks\s*\(/, /executeQuery\s*\(/],
        },
        {
            id: 'on-completion-delete',
            file: 'src/Task/OnCompletion.ts',
            patterns: [
                /Keep = 'keep'/,
                /Delete = 'delete'/,
                /returnWithoutCompletedInstance/,
                /endStatus\.type !== StatusType\.DONE/,
            ],
        },
        {
            id: 'recurrence-clears-dependencies',
            file: 'src/Task/Task.ts',
            patterns: [/id: ''/, /dependsOn: \[\]/],
        },
        {
            id: 'performance-timers',
            file: 'src/lib/PerformanceTracker.ts',
            patterns: [/performance\.measure/, /milliseconds/, /recordTimings/],
        },
        {
            id: 'search-render-timers',
            file: 'src/Renderer/QueryResultsRenderer.ts',
            patterns: [/PerformanceTracker\(`Search:/, /PerformanceTracker\(`Render:/],
        },
    ];

    for (const invariant of invariants) {
        const lines = sourceLines(sourceRoot, invariant.file);
        if (!lines) {
            assertion(checks, invariant.id, false, `${invariant.file} exists`, 'missing');
            continue;
        }
        const text = lines.join('\n');
        let passed = true;
        const evidence = [];
        for (const pattern of invariant.patterns ?? []) {
            const match = pattern.exec(text);
            passed &&= Boolean(match);
            evidence.push(`${pattern}: ${match ? 'found' : 'missing'}`);
        }
        for (const pattern of invariant.absent ?? []) {
            const match = pattern.exec(text);
            passed &&= !match;
            evidence.push(`${pattern}: ${match ? 'unexpected' : 'absent'}`);
        }
        if (invariant.ordered) {
            let previous = -1;
            for (const token of invariant.ordered) {
                const index = text.indexOf(token);
                passed &&= index > previous;
                evidence.push(`${token}@${index}`);
                previous = index;
            }
        }
        assertion(checks, invariant.id, passed, `${invariant.file} implementation invariant`, evidence.join('; '));
    }

    const apiLines = sourceLines(sourceRoot, 'src/Api/TasksApiV1.ts');
    if (apiLines) {
        const methods = apiLines
            .map((line) => /^\s{4}([A-Za-z][A-Za-z0-9]*)(?:\(|:)/.exec(line)?.[1])
            .filter(Boolean);
        assertion(
            checks,
            'api-exact-method-count',
            JSON.stringify(methods) ===
                JSON.stringify([
                    'createTaskLineModal',
                    'editTaskLineModal',
                    'executeToggleTaskDoneCommand',
                ]),
            'TasksApiV1 still has exactly the three documented methods',
            methods.join(', '),
        );
    }
}

// ---------------------------------------------------------------------------------------------
// Artifact
// ---------------------------------------------------------------------------------------------

function verifySkill(sourceRoot, checks) {
    const mainPath = path.join(SKILL_ROOT, 'SKILL.md');
    const main = fs.readFileSync(mainPath, 'utf8').replace(/\r\n?/g, '\n');
    const frontmatter = parseFrontmatter(main);
    assertion(checks, 'skill-frontmatter', Boolean(frontmatter), 'SKILL.md has YAML frontmatter');
    assertion(
        checks,
        'skill-source',
        frontmatter?.source === EXPECTED_SOURCE,
        `skill source must be ${EXPECTED_SOURCE}`,
        frontmatter?.source,
    );
    assertion(
        checks,
        'skill-version',
        frontmatter?.version === EXPECTED_VERSION,
        `skill version must be ${EXPECTED_VERSION}`,
        frontmatter?.version,
    );
    assertion(
        checks,
        'skill-basis',
        frontmatter?.basis === 'source',
        'skill basis must be source',
        frontmatter?.basis,
    );
    assertion(
        checks,
        'skill-name',
        frontmatter?.name === EXPECTED_SKILL_NAME,
        `skill name is exactly ${EXPECTED_SKILL_NAME}`,
        frontmatter?.name,
    );
    assertion(
        checks,
        'skill-directory-basename',
        path.basename(SKILL_ROOT) === EXPECTED_DIRECTORY_BASENAME,
        `skill directory basename is exactly ${EXPECTED_DIRECTORY_BASENAME}`,
        path.basename(SKILL_ROOT),
    );
    assertion(
        checks,
        'skill-description-shape',
        typeof frontmatter?.description === 'string' &&
            frontmatter.description.length > 0 &&
            frontmatter.description.length <= 1024 &&
            !/[<>]/.test(frontmatter.description),
        'skill description is non-empty, at most 1024 characters, and has no angle brackets',
        `${frontmatter?.description?.length ?? 0} characters`,
    );
    assertion(
        checks,
        'description-version-boundary',
        typeof frontmatter?.description === 'string' &&
            frontmatter.description.includes(EXPECTED_VERSION),
        `description names the studied version ${EXPECTED_VERSION}, so the trigger surface states its boundary`,
        frontmatter?.description,
    );
    assertion(
        checks,
        'main-source-identity',
        main.includes(IDENTITY.commit.slice(0, 7)),
        'main records the reviewed commit',
    );
    assertion(
        checks,
        'main-size',
        main.split('\n').length < 500,
        'main SKILL.md stays below 500 lines for progressive disclosure',
        `${main.split('\n').length} lines`,
    );

    const requiredMarkers = [
        'authoring-and-formats.md',
        'dates-and-recurrence.md',
        'statuses-dependencies-completion.md',
        'settings-integrations.md',
        'query-context.md',
        'query-language.md',
        'debugging.md',
        'scripting.md',
        'performance.md',
        'workflows.md',
        'tasks-query-lint.mjs',
        'tasks-vault-lint.mjs',
        'tasks-why-not.mjs',
        'tasks-profile.mjs',
    ];
    for (const marker of requiredMarkers) {
        assertion(
            checks,
            `main-routes-${marker}`,
            main.includes(`](${marker.startsWith('tasks-') ? `scripts/${marker}` : `reference/${marker}`})`),
            `SKILL.md directly links ${marker}`,
        );
    }

    const files = markdownFiles(SKILL_ROOT);
    const sourceLineCache = new Map();
    const anchorCache = new Map();
    const linkErrors = [];
    const fragmentErrors = [];
    const citationErrors = [];
    const unrecognisedCitations = [];
    const unlined = [];
    const shorthand = [];
    const repositoryPaths = [];
    const defectMarkers = new Set();
    for (const file of files) {
        const relativeFile = toPosix(path.relative(SKILL_ROOT, file));
        const text = fs.readFileSync(file, 'utf8').replace(/\r\n?/g, '\n');
        const recognisedCitations = new Set();
        for (const marker of text.matchAll(/\*\*(D\d+)\*\*/g)) defectMarkers.add(marker[1]);

        for (const match of text.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)) {
            const raw = match[1].trim();
            if (!raw || /^[a-z]+:\/\//i.test(raw)) continue;
            const [rawTarget, ...rest] = raw.split('#');
            const fragment = rest.join('#');
            const target = decodeURIComponent(rawTarget);
            const resolved = target === '' ? file : path.resolve(path.dirname(file), target);
            if (resolved !== SKILL_ROOT && !resolved.startsWith(`${SKILL_ROOT}${path.sep}`)) {
                linkErrors.push(`${relativeFile}: link leaves skill: ${raw}`);
                continue;
            }
            if (!fs.existsSync(resolved)) {
                linkErrors.push(`${relativeFile}: missing link target: ${raw}`);
                continue;
            }
            if (fragment && resolved.endsWith('.md')) {
                const anchors = headingAnchors(resolved, anchorCache);
                const decoded = decodeURIComponent(fragment);
                if (!anchors.has(slugifyHeading(decoded)) && !anchors.has(slugifyHeading(decoded.replace(/-/g, ' ')))) {
                    fragmentErrors.push(`${relativeFile}: unresolved heading fragment ${raw}`);
                }
            }
        }

        for (const match of text.matchAll(/`((?:src|docs)\/[^`\n]+?\.(?:ts|md)|manifest\.json):(\d+)`/g)) {
            recognisedCitations.add(match[0]);
            const sourceFile = match[1];
            const line = Number(match[2]);
            let lines = sourceLineCache.get(sourceFile);
            if (lines === undefined) {
                lines = sourceLines(sourceRoot, sourceFile);
                sourceLineCache.set(sourceFile, lines);
            }
            if (!lines) citationErrors.push(`${relativeFile}: missing source ${sourceFile}`);
            else if (line < 1 || line > lines.length) {
                citationErrors.push(`${relativeFile}: ${sourceFile}:${line} outside 1..${lines.length}`);
            } else if (lines[line - 1].trim() === '') {
                citationErrors.push(`${relativeFile}: ${sourceFile}:${line} points to a blank line`);
            }
        }
        for (const match of text.matchAll(/`((?:src|docs)\/[^`\n]+?\.(?:ts|md))`/g)) {
            unlined.push(`${relativeFile}: unlined source reference ${match[1]}`);
        }
        for (const match of text.matchAll(/`:(\d+)`/g)) {
            shorthand.push(`${relativeFile}: shorthand citation :${match[1]}`);
        }
        // A citation shaped like path:line that no parser above consumed would never be checked.
        for (const match of text.matchAll(/`([^`\n]*\.[A-Za-z0-9]{1,6}:\d+)`/g)) {
            if (!/[/@]/.test(match[1])) continue;
            if (!recognisedCitations.has(match[0])) {
                unrecognisedCitations.push(`${relativeFile}: unrecognised citation ${match[1]}`);
            }
        }
        // Remove exactly the repository-only section, then inspect everything that extraction
        // retains — including sections that follow it.
        const portable = withoutRepositorySection(text);
        for (const match of portable.matchAll(
            /(?:research\/(?:core|plugins|themes)\/|results\/(?:deep-dives|skills)\/)/g,
        )) {
            repositoryPaths.push(`${relativeFile}: repository path ${match[0]} outside the removable section`);
        }
    }
    assertion(
        checks,
        'portable-links',
        linkErrors.length === 0,
        'all Markdown links resolve inside the portable skill',
        linkErrors.join('; '),
    );
    assertion(
        checks,
        'heading-fragments',
        fragmentErrors.length === 0,
        'every link fragment resolves to a heading in its target',
        fragmentErrors.join('; '),
    );
    assertion(
        checks,
        'source-citations',
        citationErrors.length === 0,
        'all path:line citations resolve inside the pinned source',
        citationErrors.join('; '),
    );
    assertion(
        checks,
        'citations-parsed',
        unrecognisedCitations.length === 0,
        'every path:line citation is understood by the citation parser',
        unrecognisedCitations.join('; '),
    );
    assertion(
        checks,
        'no-unlined-source-references',
        unlined.length === 0,
        'source-path code spans include line numbers',
        unlined.join('; '),
    );
    assertion(
        checks,
        'no-shorthand-citations',
        shorthand.length === 0,
        'every citation repeats its full source path',
        shorthand.join('; '),
    );
    assertion(
        checks,
        'no-repository-paths',
        repositoryPaths.length === 0,
        'repository layout appears only in the section extraction removes',
        repositoryPaths.join('; '),
    );

    // Long references carry their own contents section, as the Dataview skill already requires.
    for (const reference of markdownFiles(path.join(SKILL_ROOT, 'reference'))) {
        const lines = fs.readFileSync(reference, 'utf8').replace(/\r\n?/g, '\n').split('\n');
        assertion(
            checks,
            `reference-toc-${path.basename(reference)}`,
            lines.length <= 100 || lines.slice(0, 30).includes('## Contents'),
            `${path.basename(reference)} has a Contents section when longer than 100 lines`,
            `${lines.length} lines`,
        );
        assertion(
            checks,
            `reference-no-frontmatter-${path.basename(reference)}`,
            lines[0]?.trim() !== '---',
            `${path.basename(reference)} carries no partial mini-frontmatter`,
            lines[0],
        );
    }

    // Content join with the query-defect deep dive, asserted from this side.
    assertion(
        checks,
        'defect-join-markers',
        JSON.stringify([...defectMarkers].sort()) === JSON.stringify([...EXPECTED_DEFECT_IDS].sort()),
        `the portable skill carries exactly the ${EXPECTED_DEFECT_IDS.join(', ')} join markers`,
        [...defectMarkers].sort().join(', ') || 'none',
    );
    // In the repository the removable section must declare the pair; in an extracted copy it is
    // gone by design, and its absence is the correct state rather than a defect.
    const navigation = /## Repository navigation \(remove when extracting this skill\)([\s\S]*?)(?:\n## |$)/.exec(main);
    assertion(
        checks,
        'companion-authority-declared',
        navigation === null ||
            (/authoritative/.test(navigation[1]) &&
                /update/i.test(navigation[1]) &&
                navigation[1].includes(EXPECTED_VERSION)),
        'when present, the removable navigation section names the companions, which artifact is authoritative, the update order and the shared pin',
        navigation ? 'section present' : 'section removed (extracted copy)',
    );

    const codexMetadataPath = path.join(SKILL_ROOT, 'agents', 'openai.yaml');
    const codexMetadata = fs.existsSync(codexMetadataPath)
        ? fs.readFileSync(codexMetadataPath, 'utf8')
        : '';
    assertion(
        checks,
        'codex-ui-metadata',
        codexMetadata.includes('display_name:') &&
            codexMetadata.includes('short_description:') &&
            codexMetadata.includes(`$${EXPECTED_SKILL_NAME}`),
        'agents/openai.yaml carries UI metadata whose default prompt names the runtime skill',
        codexMetadata ? 'present' : 'missing',
    );

    const requiredScripts = [
        'lib.mjs',
        'identity.mjs',
        'tasks-query-lint.mjs',
        'tasks-vault-lint.mjs',
        'tasks-why-not.mjs',
        'tasks-profile.mjs',
        'verify.mjs',
        'test.mjs',
        'fixtures/upstream-identity.json',
    ];
    for (const script of requiredScripts) {
        assertion(
            checks,
            `script-${script.replace(/\W+/g, '-')}`,
            fs.existsSync(path.join(SCRIPT_DIR, script)),
            `required portable file exists: ${script}`,
        );
    }

    // A shebang and the executable bit go together, and only on an entry point.
    const modeErrors = [];
    for (const absolute of filesUnder(SCRIPT_DIR).filter((file) => file.endsWith('.mjs'))) {
        const shebang = fs.readFileSync(absolute, 'utf8').startsWith('#!');
        const executable = (fs.statSync(absolute).mode & 0o111) !== 0;
        if (shebang !== executable) {
            modeErrors.push(`${path.basename(absolute)}: shebang=${shebang} executable=${executable}`);
        }
    }
    assertion(
        checks,
        'entry-point-modes',
        modeErrors.length === 0,
        'every script with a shebang is executable and every library is not',
        modeErrors.join('; '),
    );

    const syntaxErrors = [];
    for (const script of requiredScripts.filter((name) => name.endsWith('.mjs'))) {
        const result = spawnSync(process.execPath, ['--check', path.join(SCRIPT_DIR, script)], {
            encoding: 'utf8',
        });
        if (result.status !== 0) {
            syntaxErrors.push(`${script}: ${(result.stderr || result.stdout).trim()}`);
        }
    }
    assertion(
        checks,
        'script-syntax',
        syntaxErrors.length === 0,
        'all bundled JavaScript parses in Node',
        syntaxErrors.join('; '),
    );
}

try {
    const args = parseArgs(process.argv.slice(2), {
        booleans: ['help'],
        values: ['source-root', 'format'],
    });
    if (args.help) {
        process.stdout.write(`${USAGE}\n`);
        process.exit(EXIT.clean);
    }
    if (args._.length) throw new Error('positional arguments are not accepted');
    const format = args.format ?? 'text';
    if (!['text', 'json'].includes(format)) throw new Error('--format must be text or json');

    const sourceRoot = path.resolve(args['source-root'] ?? findDefaultSourceRoot() ?? '');
    if (!sourceRoot || !fs.existsSync(path.join(sourceRoot, 'manifest.json'))) {
        process.stderr.write(
            `source material missing: no Tasks checkout found; pass --source-root\n${USAGE}\n`,
        );
        process.exitCode = EXIT.missingMaterial;
    } else {
        const checks = [];
        verifyIdentity(sourceRoot, checks);
        verifyPortedGrammar(sourceRoot, checks);
        verifyInvariants(sourceRoot, checks);
        verifySkill(sourceRoot, checks);
        const failures = checks.filter((check) => !check.passed);
        const identityFailures = failures.filter((check) => check.kind === 'identity');
        const report = {
            tool: 'tasks-skill-verify',
            sourceRoot,
            expected: {
                source: EXPECTED_SOURCE,
                version: EXPECTED_VERSION,
                commit: IDENTITY.commit,
                skillName: EXPECTED_SKILL_NAME,
                directoryBasename: EXPECTED_DIRECTORY_BASENAME,
                defectIds: EXPECTED_DEFECT_IDS,
            },
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
            process.stdout.write(`Tasks skill verification: ${report.passed}/${checks.length} passed\n`);
        }
        process.exitCode = identityFailures.length
            ? EXIT.identityMismatch
            : failures.length
              ? EXIT.findings
              : EXIT.clean;
    }
} catch (error) {
    writeUsageError(error, USAGE, EXIT.usage);
}
