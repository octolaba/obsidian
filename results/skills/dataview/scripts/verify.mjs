#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { EXIT, parseArgs, readJson, toPosix } from './lib.mjs';
import {
    IDENTITY,
    IDENTITY_STATUS,
    markdownFiles,
    primaryFingerprint,
    sha256File,
    verifyPrimaryIdentity,
} from './identity.mjs';

const EXPECTED_SOURCE = 'blacksmithgu/obsidian-dataview';
const EXPECTED_VERSION = '0.5.70';

/**
 * The runtime skill name and the storage path are independent namespaces: each is pinned to its
 * own constant so that renaming one can never be masked by renaming the other.
 */
const EXPECTED_SKILL_NAME = 'obsidian-dataview-plugin';
const EXPECTED_DIRECTORY_BASENAME = 'dataview';

const SCRIPT_ROOT = path.dirname(fileURLToPath(import.meta.url));
const SKILL_ROOT = path.dirname(SCRIPT_ROOT);
const USAGE =
    'usage: node verify.mjs [--source-root PATH] [--obsidian-api-root PATH] [--obsidian-help-root PATH] [--format text|json]';

function assertion(checks, id, passed, message, evidence = null, kind = 'validation') {
    checks.push({ id, passed: Boolean(passed), message, evidence, kind });
}

function walkAncestors(start, resolver) {
    let current = path.resolve(start);
    while (true) {
        const result = resolver(current);
        if (result) return result;
        const parent = path.dirname(current);
        if (parent === current) return null;
        current = parent;
    }
}

function discover(relative, sentinel) {
    return walkAncestors(SKILL_ROOT, current => {
        const candidate = path.join(current, relative);
        return fs.existsSync(path.join(candidate, sentinel)) ? candidate : null;
    });
}

function filesUnder(root) {
    const files = [];
    const visit = directory => {
        for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
            const absolute = path.join(directory, entry.name);
            if (entry.isDirectory()) visit(absolute);
            else if (entry.isFile()) files.push(absolute);
        }
    };
    visit(root);
    return files.sort();
}

function sourceLines(root, relative) {
    const absolute = path.join(root, relative);
    if (!fs.existsSync(absolute) || !fs.statSync(absolute).isFile()) return null;
    return fs.readFileSync(absolute, 'utf8').replace(/\r\n?/g, '\n').split('\n');
}

/** Heading anchors, so a link fragment is checked and not only its target file. */
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

function slugifyHeading(value) {
    return value
        .toLowerCase()
        .replace(/`/g, '')
        .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
        .replace(/[^\p{Letter}\p{Number}\s-]/gu, '')
        .trim()
        .replace(/\s+/g, '-');
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
            (raw.startsWith('"') && raw.endsWith('"')) ||
            (raw.startsWith("'") && raw.endsWith("'"))
                ? raw.slice(1, -1)
                : raw;
    }
    return result;
}

function verifyIdentity(primary, apiRoot, helpRoot, checks) {
    assertion(
        checks,
        'identity-record',
        IDENTITY.source === EXPECTED_SOURCE &&
            IDENTITY.version === EXPECTED_VERSION &&
            IDENTITY.commit === '77ab745aee787d519642a87ed8f68be12fdc4b0d',
        'checked-in identity record names the reviewed source, version and commit',
        `${IDENTITY.source}@${IDENTITY.version}/${IDENTITY.commit}`,
        'identity',
    );
    const fingerprint = primaryFingerprint(primary);
    assertion(
        checks,
        'primary-material-count',
        fingerprint?.files === IDENTITY.materialFiles,
        'primary material file count matches the reviewed pin',
        `${fingerprint?.files ?? 'missing'} vs ${IDENTITY.materialFiles}`,
        'identity',
    );
    const resolved = verifyPrimaryIdentity(primary);
    assertion(
        checks,
        'primary-material-sha256',
        resolved.status === IDENTITY_STATUS.verified,
        'primary source-content fingerprint matches the reviewed pin',
        resolved.reason ?? fingerprint?.sha256 ?? 'missing',
        'identity',
    );

    const manifest = readJson(path.join(primary, 'manifest.json'));
    const packageJson = readJson(path.join(primary, 'package.json'));
    assertion(checks, 'source-plugin-id', manifest?.id === 'dataview', 'manifest identifies Dataview', manifest?.id);
    assertion(
        checks,
        'embedded-version-boundary',
        manifest?.version === '0.5.68' && packageJson?.version === '0.5.68',
        'reviewed tag retains the documented 0.5.68 embedded versions',
        `${manifest?.version}/${packageJson?.version}`,
    );

    const supporting = [
        {
            id: 'obsidian-api-material',
            root: apiRoot,
            relative: 'obsidian.d.ts',
            key: 'obsidian-api@cc174432:obsidian.d.ts',
        },
        {
            id: 'obsidian-help-material',
            root: helpRoot,
            relative: 'Editing and formatting/Properties.md',
            key: 'obsidian-help@a97de34c:Editing and formatting/Properties.md',
        },
    ];
    for (const item of supporting) {
        const file = item.root ? path.join(item.root, item.relative) : null;
        const actual = file && fs.existsSync(file) ? sha256File(file) : null;
        assertion(
            checks,
            item.id,
            actual === IDENTITY.supporting[item.key],
            `${item.key} matches its reviewed content`,
            actual ?? 'missing',
            'identity',
        );
    }
}

function verifyInvariants(primary, checks) {
    const invariants = [
        {
            id: 'parser-export',
            file: 'src/query/parse.ts',
            patterns: [/export function parseQuery/, /source: from\.length == 0 \? Sources\.folder\(""\)/],
        },
        {
            id: 'settings-defaults',
            file: 'src/settings.ts',
            patterns: [
                /enableInlineDataview: true/,
                /enableDataviewJs: false/,
                /enableInlineDataviewJs: false/,
                /dataviewJsKeyword: "dataviewjs"/,
            ],
        },
        {
            id: 'written-operation-order',
            file: 'src/query/engine.ts',
            patterns: [/for \(let op of ops\)/, /switch \(op\.type\)/],
        },
        {
            id: 'group-row-shape',
            file: 'src/query/engine.ts',
            patterns: [/rows: \[groupData\[0\]\.data\.data\]/, /\[op\.field\.name\]: groupData\[0\]\.key/],
        },
        {
            id: 'containment-contract',
            file: 'src/expression/functions.ts',
            patterns: [
                /export const contains:/,
                /l\.some\(e => contains\(context, e, elem\)\)/,
                /export const econtains:/,
                /l\.some\(e => context\.evaluate/,
            ],
        },
        {
            id: 'frontmatter-second-parse',
            file: 'src/data-import/markdown-file.ts',
            patterns: [
                /value instanceof Date/,
                /EXPRESSION\.date\.parse\(value\)/,
                /EXPRESSION\.duration\.parse\(value\)/,
                /EXPRESSION\.embedLink\.parse\(value\)/,
            ],
        },
        {
            id: 'task-page-source-and-merge',
            file: 'src/query/engine.ts',
            patterns: [
                /matchingSourcePaths\(query\.source/,
                /pageData\.file\.tasks\.map/,
                /if \(key in tcopy\) continue/,
            ],
        },
        {
            id: 'task-source-rewrite',
            file: 'src/ui/views/task-view.tsx',
            patterns: [/export async function rewriteTask/, /vault\.adapter\.read\(task\.path\)/],
        },
        {
            id: 'public-version-api',
            file: 'src/api/plugin-api.ts',
            patterns: [/public version:/, /get current\(\)/, /satisfies:/],
        },
        {
            id: 'csv-dynamic-typing',
            file: 'src/data-import/csv.ts',
            patterns: [/dynamicTyping: true/, /canonicalizeVarName/],
        },
    ];

    for (const invariant of invariants) {
        const lines = sourceLines(primary, invariant.file);
        if (!lines) {
            assertion(checks, invariant.id, false, `${invariant.file} exists`, 'missing');
            continue;
        }
        const text = lines.join('\n');
        const evidence = invariant.patterns.map(pattern => `${pattern}: ${pattern.test(text) ? 'found' : 'missing'}`);
        assertion(
            checks,
            invariant.id,
            evidence.every(item => item.endsWith('found')),
            `${invariant.file} retains the relied-on implementation invariant`,
            evidence.join('; '),
        );
    }
}

function verifySkill(primary, apiRoot, helpRoot, checks) {
    const mainPath = path.join(SKILL_ROOT, 'SKILL.md');
    const main = fs.readFileSync(mainPath, 'utf8').replace(/\r\n?/g, '\n');
    const frontmatter = parseFrontmatter(main);
    assertion(checks, 'skill-frontmatter', Boolean(frontmatter), 'SKILL.md has YAML frontmatter');
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
        'skill-description',
        typeof frontmatter?.description === 'string' &&
            frontmatter.description.length > 0 &&
            frontmatter.description.length <= 1024 &&
            !/[<>]/.test(frontmatter.description),
        'description is usable for triggering and portable frontmatter',
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
        'skill-source',
        frontmatter?.source === EXPECTED_SOURCE,
        `skill source is ${EXPECTED_SOURCE}`,
        frontmatter?.source,
    );
    assertion(
        checks,
        'skill-version',
        frontmatter?.version === EXPECTED_VERSION,
        `skill version is ${EXPECTED_VERSION}`,
        frontmatter?.version,
    );
    assertion(checks, 'skill-basis', frontmatter?.basis === 'source', 'skill basis is source', frontmatter?.basis);
    assertion(
        checks,
        'main-progressive-disclosure',
        main.split('\n').length < 500,
        'SKILL.md stays below 500 lines',
        `${main.split('\n').length} lines`,
    );
    assertion(
        checks,
        'main-source-identities',
        main.includes(IDENTITY.commit) &&
            main.includes('cc1744324150c632416857c98964f87b1574a5fc') &&
            main.includes('a97de34c1a9f2381586f4f51070aeb9207c8a457'),
        'main records the exact primary and supporting source identities',
    );
    for (const heading of [
        '## Research question and scope',
        '## Sources and evidence',
        '## Intake before answering',
        '## Diagnose in layers',
        '## Validate before handoff',
        '## Limitations and conflicts',
    ]) {
        assertion(checks, `main-section-${heading.slice(3).toLowerCase().replace(/\W+/g, '-')}`, main.includes(heading), `main contains ${heading}`);
    }

    const requiredRoutes = [
        ...[
            'query-language.md',
            'data-model.md',
            'debugging.md',
            'performance.md',
            'dataviewjs.md',
            'metadata-design.md',
            'settings-and-rendering.md',
            'tasks-and-mutation.md',
            'csv.md',
            'compatibility.md',
            'tooling.md',
        ].map(file => `reference/${file}`),
        'scripts/dataview-query-lint.mjs',
        'scripts/dataview-vault-lint.mjs',
        'scripts/audit-dataview-queries.mjs',
        'scripts/test.mjs',
        'scripts/verify.mjs',
        'assets/dataview-doctor/view.js',
    ];
    for (const route of requiredRoutes) {
        assertion(
            checks,
            `main-route-${route.replace(/\W+/g, '-')}`,
            main.includes(`](${route})`),
            `SKILL.md directly links ${route}`,
        );
    }

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

    const requiredFiles = [
        'agents/openai.yaml',
        'scripts/identity.mjs',
        'scripts/lib.mjs',
        'scripts/upstream-parser.mjs',
        'scripts/dataview-query-lint.mjs',
        'scripts/dataview-vault-lint.mjs',
        'scripts/audit-dataview-queries.mjs',
        'scripts/test.mjs',
        'scripts/verify.mjs',
        'scripts/fixtures/upstream-identity.json',
        'scripts/fixtures/dataview-config/manifest.json',
        'scripts/fixtures/dataview-config/data.json',
        'scripts/fixtures/vault/BadQueries.md',
        'scripts/fixtures/vault/Callouts.md',
        'scripts/fixtures/vault/CleanQueries.md',
        'scripts/fixtures/vault/Extraction.md',
        'scripts/fixtures/vault/Projects/Alpha.md',
        'scripts/fixtures/vault/Projects/Beta.md',
        'scripts/fixtures/vault/Unclosed.md',
        'assets/dataview-doctor/view.js',
        'assets/dataview-doctor/view.css',
    ];
    for (const relative of requiredFiles) {
        assertion(
            checks,
            `required-${relative.replace(/\W+/g, '-')}`,
            fs.existsSync(path.join(SKILL_ROOT, relative)),
            `required portable file exists: ${relative}`,
        );
    }

    for (const reference of filesUnder(path.join(SKILL_ROOT, 'reference')).filter(file => file.endsWith('.md'))) {
        const text = fs.readFileSync(reference, 'utf8').replace(/\r\n?/g, '\n');
        const lines = text.split('\n');
        assertion(
            checks,
            `reference-toc-${path.basename(reference)}`,
            lines.length <= 100 || lines.slice(0, 25).includes('## Contents'),
            `${path.basename(reference)} has a Contents section when longer than 100 lines`,
            `${lines.length} lines`,
        );
    }

    const roots = {
        primary,
        'obsidian-api': apiRoot,
        'obsidian-help': helpRoot,
    };
    const markdown = markdownFiles(SKILL_ROOT);
    const linkErrors = [];
    const fragmentErrors = [];
    const citationErrors = [];
    const unrecognisedCitations = [];
    const shorthand = [];
    const unlined = [];
    const anchorCache = new Map();
    for (const file of markdown) {
        const relativeFile = toPosix(path.relative(SKILL_ROOT, file));
        const text = fs.readFileSync(file, 'utf8').replace(/\r\n?/g, '\n');
        const recognisedCitations = new Set();
        for (const match of text.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)) {
            const raw = match[1].trim();
            if (!raw) continue;
            if (/^[a-z]+:\/\//i.test(raw) || path.isAbsolute(raw)) {
                linkErrors.push(`${relativeFile}: non-portable link ${raw}`);
                continue;
            }
            const [rawTarget, ...rest] = raw.split('#');
            const fragment = rest.join('#');
            const target = decodeURIComponent(rawTarget);
            const resolved = target === '' ? file : path.resolve(path.dirname(file), target);
            if (
                (resolved !== SKILL_ROOT && !resolved.startsWith(`${SKILL_ROOT}${path.sep}`)) ||
                !fs.existsSync(resolved)
            ) {
                linkErrors.push(`${relativeFile}: unresolved/outside link ${raw}`);
                continue;
            }
            if (fragment && resolved.endsWith('.md')) {
                const wanted = slugifyHeading(decodeURIComponent(fragment).replace(/-/g, ' '));
                const anchors = headingAnchors(resolved, anchorCache);
                if (!anchors.has(slugifyHeading(decodeURIComponent(fragment))) && !anchors.has(wanted)) {
                    fragmentErrors.push(`${relativeFile}: unresolved heading fragment ${raw}`);
                }
            }
        }

        for (const match of text.matchAll(
            /`((?:src|docs)\/[^`\n]+?|manifest\.json|package\.json|CHANGELOG\.md):(\d+)`/g,
        )) {
            recognisedCitations.add(match[0]);
            const lines = sourceLines(primary, match[1]);
            const line = Number(match[2]);
            if (!lines) citationErrors.push(`${relativeFile}: missing primary source ${match[1]}`);
            else if (line < 1 || line > lines.length || lines[line - 1].trim() === '') {
                citationErrors.push(`${relativeFile}: invalid/blank primary citation ${match[1]}:${line}`);
            }
        }
        for (const match of text.matchAll(
            /`(obsidian-api|obsidian-help)@([0-9a-f]{7,40}):([^`\n]+?):(\d+)`/g,
        )) {
            recognisedCitations.add(match[0]);
            const [, source, revision, relative, lineRaw] = match;
            const expectedRevision = source === 'obsidian-api' ? 'cc174432' : 'a97de34c';
            const lines = roots[source] ? sourceLines(roots[source], relative) : null;
            const line = Number(lineRaw);
            if (!revision.startsWith(expectedRevision)) {
                citationErrors.push(`${relativeFile}: unexpected ${source} revision ${revision}`);
            } else if (!lines) {
                citationErrors.push(`${relativeFile}: missing ${source} source ${relative}`);
            } else if (line < 1 || line > lines.length || lines[line - 1].trim() === '') {
                citationErrors.push(`${relativeFile}: invalid/blank ${source} citation ${relative}:${line}`);
            }
        }
        for (const match of text.matchAll(/`:(\d+)`/g)) {
            shorthand.push(`${relativeFile}: shorthand citation :${match[1]}`);
        }
        for (const match of text.matchAll(/`((?:src|docs)\/[^`\n]+\.(?:ts|tsx|md))`/g)) {
            if (!match[1].includes('…')) {
                unlined.push(`${relativeFile}: unlined source reference ${match[1]}`);
            }
        }
        // A citation that looks like path:line but was not consumed by the parsers above is a
        // silent gap: it would never be checked against the pin.
        for (const match of text.matchAll(/`([^`\n]*\.[A-Za-z0-9]{1,6}:\d+)`/g)) {
            if (!/[/@]/.test(match[1])) continue;
            if (!recognisedCitations.has(match[0])) {
                unrecognisedCitations.push(`${relativeFile}: unrecognised citation ${match[1]}`);
            }
        }
    }
    assertion(checks, 'portable-links', linkErrors.length === 0, 'all Markdown links resolve inside the skill', linkErrors.join('; '));
    assertion(checks, 'heading-fragments', fragmentErrors.length === 0, 'every link fragment resolves to a heading in its target', fragmentErrors.join('; '));
    assertion(checks, 'citations-parsed', unrecognisedCitations.length === 0, 'every path:line citation is understood by the citation parser', unrecognisedCitations.join('; '));
    assertion(checks, 'source-citations', citationErrors.length === 0, 'all full path:line citations resolve to nonblank pinned evidence', citationErrors.join('; '));
    assertion(checks, 'no-shorthand-citations', shorthand.length === 0, 'citations repeat their full source path', shorthand.join('; '));
    assertion(checks, 'no-unlined-source-references', unlined.length === 0, 'concrete source-path code spans include line numbers', unlined.join('; '));

    // A shebang and the executable bit go together, and only on an entry point.
    const modeErrors = [];
    for (const relative of filesUnder(path.join(SKILL_ROOT, 'scripts')).map(file => toPosix(path.relative(SKILL_ROOT, file)))) {
        if (!relative.endsWith('.mjs')) continue;
        const absolute = path.join(SKILL_ROOT, relative);
        const shebang = fs.readFileSync(absolute, 'utf8').startsWith('#!');
        const executable = (fs.statSync(absolute).mode & 0o111) !== 0;
        if (shebang !== executable) {
            modeErrors.push(`${relative}: shebang=${shebang} executable=${executable}`);
        }
    }
    assertion(
        checks,
        'entry-point-modes',
        modeErrors.length === 0,
        'every script with a shebang is executable and every library is not',
        modeErrors.join('; '),
    );

    const syntaxFiles = requiredFiles
        .filter(relative => /\.(?:mjs|js)$/.test(relative))
        .map(relative => path.join(SKILL_ROOT, relative))
        .filter(fs.existsSync);
    const syntaxErrors = [];
    for (const file of syntaxFiles) {
        const relative = toPosix(path.relative(SKILL_ROOT, file));
        if (relative === 'assets/dataview-doctor/view.js') {
            try {
                const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
                new AsyncFunction('dv', 'input', fs.readFileSync(file, 'utf8'));
            } catch (error) {
                syntaxErrors.push(`${relative}: ${error.message}`);
            }
        } else {
            const result = spawnSync(process.execPath, ['--check', file], { encoding: 'utf8' });
            if (result.status !== 0) {
                syntaxErrors.push(`${relative}: ${(result.stderr || result.stdout).trim()}`);
            }
        }
    }
    assertion(checks, 'script-syntax', syntaxErrors.length === 0, 'all bundled JavaScript parses in Node', syntaxErrors.join('; '));
}

async function main() {
    let args;
    try {
        args = parseArgs(process.argv.slice(2), {
            booleans: ['help'],
            values: ['source-root', 'obsidian-api-root', 'obsidian-help-root', 'format'],
        });
    } catch (error) {
        process.stderr.write(`error: ${error.message}\n${USAGE}\n`);
        process.exitCode = 2;
        return;
    }
    if (args.help) {
        process.stdout.write(`${USAGE}\n`);
        return;
    }
    if (args._.length) {
        process.stderr.write(`error: positional arguments are not accepted\n${USAGE}\n`);
        process.exitCode = 2;
        return;
    }
    const format = args.format ?? 'text';
    if (!['text', 'json'].includes(format)) {
        process.stderr.write(`error: --format must be text or json\n${USAGE}\n`);
        process.exitCode = 2;
        return;
    }

    const primary = path.resolve(
        args['source-root'] ??
            discover('research/plugins/blacksmithgu/obsidian-dataview', 'manifest.json') ??
            '',
    );
    const apiRoot = path.resolve(
        args['obsidian-api-root'] ??
            discover('research/core/obsidian-api', 'obsidian.d.ts') ??
            '',
    );
    const helpRoot = path.resolve(
        args['obsidian-help-root'] ??
            discover('research/core/obsidian-help/en', 'Editing and formatting/Properties.md') ??
            '',
    );
    const missing = [
        ['Dataview', primary, 'manifest.json'],
        ['obsidian-api', apiRoot, 'obsidian.d.ts'],
        ['obsidian-help/en', helpRoot, 'Editing and formatting/Properties.md'],
    ].filter(([, root, sentinel]) => !root || !fs.existsSync(path.join(root, sentinel)));
    if (missing.length) {
        process.stderr.write(
            `source material missing: ${missing.map(([name]) => name).join(', ')}; pass explicit roots\n${USAGE}\n`,
        );
        process.exitCode = 3;
        return;
    }

    const checks = [];
    verifyIdentity(primary, apiRoot, helpRoot, checks);
    verifyInvariants(primary, checks);
    verifySkill(primary, apiRoot, helpRoot, checks);
    const failures = checks.filter(check => !check.passed);
    const identityFailures = failures.filter(check => check.kind === 'identity');
    const report = {
        tool: 'dataview-skill-verify',
        version: '1.0.0',
        expected: { source: EXPECTED_SOURCE, version: EXPECTED_VERSION },
        roots: { primary, obsidianApi: apiRoot, obsidianHelp: helpRoot },
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
        process.stdout.write(`Dataview skill verification: ${report.passed}/${checks.length} passed\n`);
    }
    process.exitCode = identityFailures.length ? 4 : failures.length ? 1 : 0;
}

await main();
