#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { EXIT, isFile, listFiles, parseArgs, readJson, readText, sha256, writeUsageError } from './lib.mjs';
import { IDENTITY_STATUS, PRIMARY, verifyMaterial } from './identity.mjs';
import { loadIndexes, themeSlug } from './model.mjs';

/**
 * The artifact's own verifier: it checks what this skill *claims*, against the pinned material and
 * against the skill directory itself.
 *
 * The runtime skill name and the storage directory basename are independent namespaces, so each is
 * pinned to its own constant here. Asserting that they are equal would let one rename hide another.
 */

const SCRIPT_ROOT = path.dirname(fileURLToPath(import.meta.url));
const SKILL_ROOT = path.dirname(SCRIPT_ROOT);

const EXPECTED_SKILL_NAME = 'obsidian-community-catalog';
const EXPECTED_DIRECTORY_BASENAME = 'catalog';
const EXPECTED_SOURCE = 'obsidianmd/obsidian-releases';
const EXPECTED_BASIS = 'source';

/** Extraction deletes this section, so its heading is matched exactly, never by prefix. */
const REPOSITORY_SECTION_HEADING = '## Repository-only verification (remove when extracting this skill)';

const REFERENCE_FILES = ['note-contracts.md', 'extraction-contract.md', 'graphql-coverage.md', 'run-protocol.md'];
const SCRIPT_FILES = [
    'about.mjs',
    'archive.mjs',
    'body.mjs',
    'datablock.mjs',
    'directory.mjs',
    'gate.mjs',
    'github.mjs',
    'identity.mjs',
    'lib.mjs',
    'model.mjs',
    'note.mjs',
    'render.mjs',
    'resolve.mjs',
    'run.mjs',
    'state.mjs',
    'test.mjs',
    'verify.mjs',
    'worklist.mjs',
];
const FIXTURE_FILES = [
    'directory/provenance.json',
    'directory/plugin-dataview.html',
    'directory/plugin-canvas-loom.html',
    'directory/theme-rose-pine.html',
    'directory/plugin-not-found.html',
];
const REQUIRED_FILES = [
    'SKILL.md',
    ...REFERENCE_FILES.map(name => `reference/${name}`),
    ...SCRIPT_FILES.map(name => `scripts/${name}`),
    'scripts/manifest.json',
    ...FIXTURE_FILES.map(name => `scripts/fixtures/${name}`),
];

/**
 * Flags an extracted copy must still document, so a reader can drive the tools without this repo.
 *
 * The list is checked in both directions, and the second direction iterates the flags the tools
 * *parse* rather than this list: a check that walks its own list can only find what it already
 * knows about, so an undocumented new flag would escape it precisely where the guard is needed.
 */
const DOCUMENTED_FLAGS = [
    '--release-mirror-root',
    '--base-index-root',
    '--templates-root',
    '--catalog-root',
    '--archive-root',
    '--support-root',
    '--state-file',
    '--release-pin',
    '--stage',
    '--run',
    '--plugin',
    '--theme',
    '--user-agent',
    '--interval-ms',
    '--batch-size',
    '--limit',
    '--bodies',
    '--model',
    '--pacing',
    '--prompt',
    '--gate-status',
    '--refresh-repositories',
    '--allow-empty-bodies',
    '--dry-run',
    '--json',
    '--help',
];

/** Every flag a tool really accepts, read out of its own `parseArgs` declaration. */
function parsedFlags(source) {
    const call = source.indexOf('parseArgs(argv, {');
    if (call === -1) return [];
    const start = source.indexOf('{', call);
    let depth = 0;
    let end = start;
    for (; end < source.length; end += 1) {
        if (source[end] === '{') depth += 1;
        else if (source[end] === '}' && (depth -= 1) === 0) break;
    }
    const names = new Set();
    for (const list of source.slice(start, end + 1).matchAll(/\b(?:booleans|values|repeatable): \[([^\]]*)\]/g)) {
        for (const quoted of list[1].matchAll(/'([^']+)'/g)) names.add(`--${quoted[1]}`);
    }
    return [...names];
}

/** Phrases that would claim an evaluation this repository has deliberately not run. */
const FORBIDDEN_CLAIMS = [
    /(?<!no )agent[- ]behaviour evaluation (?:was |has been )?(?:run|performed|passed)/i,
    /evaluated (?:in|against) a clean context/i,
    /trigger(?:ing)? (?:was|has been) (?:evaluated|measured|validated)/i,
];

const USAGE = `usage: verify.mjs --release-mirror-root DIR [--json]

exit: 0 clean  1 findings  2 usage  3 missing material  4 source-identity mismatch`;

const findings = [];
const lines = [];
function assertion(condition, message, evidence = null) {
    if (condition) return;
    findings.push({ message, evidence });
}

function frontmatterOf(text) {
    const match = /^---\n([\s\S]*?)\n---\n/.exec(text);
    if (!match) return null;
    const values = {};
    for (const line of match[1].split('\n')) {
        const entry = /^([A-Za-z0-9_-]+): (.*)$/.exec(line);
        if (!entry) continue;
        let value = entry[2].trim();
        if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1).replace(/\\"/g, '"');
        values[entry[1]] = value;
    }
    return values;
}

function main(argv) {
    let args;
    try {
        args = parseArgs(argv, { booleans: ['json', 'help'], values: ['release-mirror-root', 'release-pin'] });
    } catch (error) {
        writeUsageError(error, USAGE);
        return;
    }
    if (args.help) {
        process.stdout.write(`${USAGE}\n`);
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

    // --- the directory is complete and self-contained ------------------------------------------
    for (const relative of REQUIRED_FILES) {
        assertion(isFile(path.join(SKILL_ROOT, relative)), `missing portable file ${relative}`);
    }
    assertion(
        path.basename(SKILL_ROOT) === EXPECTED_DIRECTORY_BASENAME,
        `directory basename is ${path.basename(SKILL_ROOT)}, not ${EXPECTED_DIRECTORY_BASENAME}`,
    );

    const skill = readText(path.join(SKILL_ROOT, 'SKILL.md'));
    const frontmatter = frontmatterOf(skill);
    assertion(frontmatter !== null, 'SKILL.md has no frontmatter');
    if (frontmatter) {
        assertion(frontmatter.name === EXPECTED_SKILL_NAME, `skill name is ${frontmatter.name}`);
        assertion(frontmatter.source === EXPECTED_SOURCE, `source is ${frontmatter.source}`);
        assertion(frontmatter.basis === EXPECTED_BASIS, `basis is ${frontmatter.basis}`);
        assertion(/^[0-9a-f]{40}$/.test(frontmatter.version ?? ''), `version ${frontmatter.version} is not a full commit id`);
        assertion(
            // A NUL sentinel, because a description can never contain one: an absent `version`
            // must fail this assertion, and `''` would make `includes` trivially true.
            (frontmatter.description ?? '').includes(frontmatter.version ?? '\0'),
            'the description does not name the version the frontmatter records',
        );
        if (args['release-pin']) {
            assertion(
                frontmatter.version === args['release-pin'],
                `frontmatter version ${frontmatter.version} is not the checked-out pin ${args['release-pin']}`,
                'a completed Update Run advances it as its final step (§6.3.7)',
            );
        }
    }

    // --- no link may leave the skill directory ---------------------------------------------------
    const portable = skill.split(REPOSITORY_SECTION_HEADING)[0];
    assertion(skill.includes(REPOSITORY_SECTION_HEADING), 'the repository-only section heading is not exact');
    for (const match of portable.matchAll(/\]\(([^)]+)\)/g)) {
        const target = match[1];
        if (/^https?:/.test(target)) continue;
        assertion(!target.startsWith('../') && !target.startsWith('/'), `portable text links outside the skill: ${target}`);
        assertion(isFile(path.join(SKILL_ROOT, target)), `portable text links to a missing file: ${target}`);
    }
    for (const marker of ['.github/issues/', '.github/reviews/', 'make lint', 'research/']) {
        assertion(!portable.includes(marker), `portable text mentions the repository layout: ${marker}`);
    }
    for (const file of REFERENCE_FILES) {
        const text = readText(path.join(SKILL_ROOT, 'reference', file));
        for (const match of text.matchAll(/\]\(([^)]+)\)/g)) {
            const target = match[1];
            if (/^https?:/.test(target)) continue;
            assertion(!target.startsWith('../'), `${file} links outside the skill: ${target}`);
        }
    }

    // --- no claim of an evaluation that was not run ------------------------------------------------
    const everything = [skill, ...REFERENCE_FILES.map(file => readText(path.join(SKILL_ROOT, 'reference', file)))].join('\n');
    for (const pattern of FORBIDDEN_CLAIMS) {
        assertion(!pattern.test(everything), `the artifact claims an evaluation that was not run: ${pattern}`);
    }
    assertion(
        /No agent-behaviour evaluation has been run/i.test(skill),
        'SKILL.md does not record the standing agent-behaviour evaluation gap',
    );

    // --- documented flags actually exist, and parsed flags are actually documented -------------------
    const gate = readText(path.join(SKILL_ROOT, 'scripts', 'gate.mjs'));
    const run = readText(path.join(SKILL_ROOT, 'scripts', 'run.mjs'));
    const parsed = new Map();
    for (const [tool, source] of [['gate.mjs', gate], ['run.mjs', run]]) {
        for (const flag of parsedFlags(source)) parsed.set(flag, tool);
    }
    const documentation = [skill, ...REFERENCE_FILES.map(file => readText(path.join(SKILL_ROOT, 'reference', file)))];
    for (const flag of DOCUMENTED_FLAGS) {
        assertion(parsed.has(flag), `documented flag ${flag} is not parsed by any tool`);
    }
    for (const [flag, tool] of parsed) {
        assertion(
            documentation.some(text => text.includes(flag)),
            `flag ${flag} is parsed by ${tool} but never documented`,
        );
        assertion(DOCUMENTED_FLAGS.includes(flag), `flag ${flag} is parsed by ${tool} but missing from DOCUMENTED_FLAGS`);
    }

    // --- the alias-slash limitation is recorded, with its consequence -------------------------------
    assertion(/alias containing a slash/i.test(skill), 'the alias-slash limitation is not recorded in SKILL.md');
    assertion(/\[\[GitHub - \d+\]\]/.test(skill), 'SKILL.md does not show the bare repository-link form');
    assertion(!/\[\[GitHub - \d+\|/.test(skill), 'SKILL.md still shows a repository link carrying display text (§3.1, amended)');

    // --- the filled data block is documented where an operator will look for it ----------------------
    const contracts = readText(path.join(SKILL_ROOT, 'reference', 'note-contracts.md'));
    assertion(/data block/i.test(skill), 'SKILL.md does not mention the data block every note carries');
    assertion(/```cue/.test(contracts), 'note-contracts.md does not show the filled data block');
    for (const removed of ['site_admin', 'network_count', 'readme.content']) {
        assertion(
            readText(path.join(SKILL_ROOT, 'reference', 'graphql-coverage.md')).includes(removed),
            `the coverage matrix does not account for the removed field ${removed}`,
        );
    }

    // --- numeric claims re-derived from the pinned material -----------------------------------------
    const indexes = loadIndexes(material.root);
    const slugs = new Set(indexes.themes.map(theme => themeSlug(theme.name)));
    const statsGapIndex = indexes.plugins.filter(plugin => !indexes.stats[plugin.id]).length;
    const pluginIds = new Set(indexes.plugins.map(plugin => plugin.id));
    const statsGapStats = Object.keys(indexes.stats).filter(id => !pluginIds.has(id)).length;
    const legacy = indexes.themes.filter(theme => theme.legacy === true).length;
    const repos = new Set([...indexes.plugins, ...indexes.themes].map(row => row.repo.toLowerCase()));
    const uppercase = [...indexes.plugins, ...indexes.themes].filter(row => /[A-Z]/.test(row.repo)).length;
    const removedIds = new Set(indexes.pluginsRemoved.map(row => row.id));
    const intersect = indexes.plugins.filter(plugin => removedIds.has(plugin.id));

    // Owners sharing one case-folded basename: the reason repository notes are named by numeric id.
    const owners = new Map();
    for (const row of [...indexes.plugins, ...indexes.themes]) {
        const [owner, name] = row.repo.split('/');
        const key = (name ?? '').toLowerCase();
        if (!owners.has(key)) owners.set(key, new Set());
        owners.get(key).add((owner ?? '').toLowerCase());
    }
    const collisions = [...owners.values()].filter(set => set.size > 1).length;

    // Screenshot paths needing URL-encoding — counted the way the renderer encodes, segment by segment.
    const needEncoding = indexes.themes.filter(theme =>
        theme.screenshot.split('/').some(segment => encodeURIComponent(segment) !== segment),
    ).length;

    // Release-tag keys in Plugin Stats: shaped like a version, or an arbitrary tag name. The shape
    // rule is the gate's, restated rather than shared, so the two cannot quietly diverge on it.
    const versionShaped = /^v?\d+\.\d+(?:\.\d+)?(?:[-+.][0-9A-Za-z.-]+)?$/;
    const releaseTags = { total: 0, arbitrary: 0 };
    for (const record of Object.values(indexes.stats)) {
        for (const key of Object.keys(record)) {
            if (key === 'downloads' || key === 'updated') continue;
            releaseTags.total += 1;
            if (!versionShaped.test(key)) releaseTags.arbitrary += 1;
        }
    }

    const claims = [
        [indexes.plugins.length, 6594, 'plugins'],
        [indexes.themes.length, 684, 'themes'],
        [slugs.size, 684, 'distinct slugs'],
        [repos.size, 7278, 'distinct repositories'],
        [legacy, 17, 'legacy themes'],
        [statsGapIndex, 19, 'index ids without stats'],
        [statsGapStats, 4, 'stats ids without an index row'],
        [uppercase, 966, 'repo strings containing uppercase'],
        [collisions, 68, 'basename collisions across owners'],
        [needEncoding, 12, 'screenshot paths needing URL-encoding'],
        [releaseTags.total, 81941, 'release-tag keys in Plugin Stats'],
        [releaseTags.total - releaseTags.arbitrary, 81901, 'version-shaped release-tag keys'],
        [releaseTags.arbitrary, 40, 'arbitrary release-tag keys'],
        [intersect.length, 3, 'ids in both the index and the removal list'],
    ];
    for (const [actual, expected, what] of claims) {
        assertion(actual === expected, `${what}: the artifact says ${expected}, the pin says ${actual}`);
        const grouped = expected.toLocaleString('en-US');
        assertion(
            skill.includes(String(expected)) || skill.includes(grouped),
            `${what}: ${expected} is not stated in SKILL.md`,
        );
    }
    for (const id of ['duplicate-line', 'memos-sync', 'smart-gantt']) {
        assertion(intersect.some(plugin => plugin.id === id), `${id} is no longer both indexed and removed`);
        assertion(skill.includes(id), `${id} is named as an anchor but not in SKILL.md`);
    }

    // A reference file restating a pin-derived count is as stale as the skill would be, and the
    // phrase is matched rather than the bare digits: `19` alone occurs in unrelated prose.
    for (const [phrase, what] of [
        [`${statsGapIndex} ids without a stats entry`, 'the ids without a stats entry'],
        [`(${statsGapIndex} at the pin)`, 'the empty-downloads count'],
        [`${needEncoding} pinned paths`, 'the screenshot paths needing URL-encoding'],
    ]) {
        assertion(contracts.includes(phrase), `note-contracts.md does not state ${what} at this pin: expected "${phrase}"`);
    }

    // --- the manifest covers what the artifact says it covers -----------------------------------------
    const manifest = readJson(path.join(SKILL_ROOT, 'scripts', 'manifest.json'));
    for (const [file, source] of Object.entries(manifest.sources)) {
        assertion(
            source.wholeFile || Object.values(source.keys ?? {}).every(entry => entry.state === 'mapped' || entry.state === 'ignored'),
            `${file}: a key is neither mapped nor ignored`,
        );
        for (const [key, entry] of Object.entries(source.keys ?? {})) {
            if (entry.state !== 'ignored') continue;
            assertion(Boolean(entry.rationale), `${file}.${key} is ignored without a rationale`);
        }
    }
    assertion((manifest.consumedInputs ?? []).length >= 4, 'the manifest declares fewer consumed inputs than the artifact describes');

    // --- fixtures carry their provenance ----------------------------------------------------------------
    const provenance = readJson(path.join(SKILL_ROOT, 'scripts', 'fixtures', 'directory', 'provenance.json'));
    assertion(provenance.accessed === '2026-08-06', `fixture access date is ${provenance.accessed}`);
    for (const record of provenance.fixtures) {
        assertion(isFile(path.join(SKILL_ROOT, 'scripts', 'fixtures', 'directory', record.fixture)), `fixture ${record.fixture} is missing`);
        assertion(/^[0-9a-f]{64}$/.test(record.capturedSha256), `fixture ${record.fixture} records no capture hash`);
        assertion(record.url.startsWith('https://community.obsidian.md/'), `fixture ${record.fixture} records no source URL`);
    }

    lines.push(`skill: ${EXPECTED_SKILL_NAME} in ${path.basename(SKILL_ROOT)}/`);
    lines.push(`material: ${PRIMARY.repo} verified structurally at ${material.root}`);
    lines.push(
        `claims re-derived: ${claims.length} counts, ${intersect.length} index-and-removed ids, ${releaseTags.total} release-tag keys`,
    );
    lines.push(
        `portable surface: ${REQUIRED_FILES.length} files, ${parsed.size} parsed flags, ${DOCUMENTED_FLAGS.length} documented`,
    );

    if (args.json) {
        process.stdout.write(`${JSON.stringify({ lines, findings }, null, 2)}\n`);
    } else {
        for (const line of lines) process.stdout.write(`${line}\n`);
        for (const finding of findings) {
            process.stdout.write(`error: ${finding.message}\n`);
            if (finding.evidence) process.stdout.write(`    ${finding.evidence}\n`);
        }
        process.stdout.write(`\n${findings.length} findings\n`);
    }
    process.exitCode = findings.length ? EXIT.findings : EXIT.clean;
}

main(process.argv.slice(2));
