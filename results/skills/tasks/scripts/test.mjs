#!/usr/bin/env node

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import {
    DEFAULT_PRESETS,
    DEFAULT_SETTINGS,
    buildEffectiveQuery,
    extractTaskLines,
    extractTasksBlocks,
    parseTask,
    readMarkdown,
    resolvePresets,
} from './lib.mjs';
import { IDENTITY_STATUS, verifyPrimaryIdentity } from './identity.mjs';

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const SKILL_ROOT = path.dirname(SCRIPT_DIR);
const FIXTURE_VAULT = path.join(SCRIPT_DIR, 'fixtures', 'vault');
const PERFORMANCE_LOG = path.join(SCRIPT_DIR, 'fixtures', 'performance.log');
const EMOJI_SETTINGS = { ...DEFAULT_SETTINGS, globalFilter: '#task' };

let failures = 0;
let checks = 0;

function check(description, condition, detail = '') {
    checks += 1;
    if (!condition) failures += 1;
    process.stdout.write(`${condition ? 'PASS' : 'FAIL'} ${description}${!condition && detail ? ` — ${detail}` : ''}\n`);
}

function run(script, args, expectedCodes = [0]) {
    const result = spawnSync(process.execPath, [path.join(SCRIPT_DIR, script), ...args], {
        encoding: 'utf8',
        cwd: SCRIPT_DIR,
    });
    check(
        `${script} exit code`,
        expectedCodes.includes(result.status),
        `expected ${expectedCodes.join('/')}, got ${result.status}; stderr=${result.stderr.trim()}`,
    );
    return result;
}

function parseJson(result, label) {
    try {
        return JSON.parse(result.stdout);
    } catch (error) {
        check(`${label} emits JSON`, false, `${error.message}; stdout=${result.stdout.slice(0, 500)}`);
        return null;
    }
}

function findDefaultSourceRoot() {
    let current = SKILL_ROOT;
    while (true) {
        const candidate = path.join(current, 'research', 'plugins', 'obsidian-tasks-group', 'obsidian-tasks');
        if (fs.existsSync(path.join(candidate, 'manifest.json'))) return candidate;
        const parent = path.dirname(current);
        if (parent === current) return null;
        current = parent;
    }
}

function taskAt(file, line) {
    const { lines } = readMarkdown(path.join(FIXTURE_VAULT, file));
    const raw = extractTaskLines(lines, file).find((task) => task.line === line);
    return raw ? parseTask(raw, EMOJI_SETTINGS) : null;
}

// ---------------------------------------------------------------------------------------------
// Differential parser expectations. Each mirrors a boundary of the pinned serializer; verify.mjs
// separately proves that the ported grammar still equals the pinned grammar.
// ---------------------------------------------------------------------------------------------

const blockId = taskAt('Parsing.md', 5);
check('terminal block id is separated, not swallowed', blockId?.blockLink === ' ^task-id', JSON.stringify(blockId?.blockLink));
check('a field before a terminal block id still parses', blockId?.fields.due === '2026-08-01', JSON.stringify(blockId?.fields));

const commaTag = taskAt('Parsing.md', 6);
check(
    'a comma-terminated tag stops the scan, as the pinned tag grammar does',
    commaTag?.fields.due === undefined,
    JSON.stringify(commaTag?.fields),
);

const behind21 = taskAt('Parsing.md', 7);
check(
    'a field behind 21 trailing tags is out of reach of the 21-iteration scan',
    behind21?.fields.due === undefined && behind21.scanExhausted === true,
    `${JSON.stringify(behind21?.fields)} runs=${behind21?.scanRuns}`,
);
const behind20 = taskAt('Parsing.md', 8);
check(
    'a field behind 20 trailing tags is still reached on the last permitted iteration',
    behind20?.fields.due === '2026-08-04' && behind20.scanRuns === 21,
    `${JSON.stringify(behind20?.fields)} runs=${behind20?.scanRuns}`,
);

const oneSelector = taskAt('Parsing.md', 9);
check('one variation selector after the signifier parses', oneSelector?.fields.due === '2026-08-05', JSON.stringify(oneSelector?.fields));
const nbsp = taskAt('Parsing.md', 10);
check('a non-breaking space before the value does not parse', nbsp?.fields.due === undefined, JSON.stringify(nbsp?.fields));

const duplicateDate = taskAt('Tasks.md', 17);
check(
    'repeated fields end on the leftmost value, as repeated setter assignment does',
    duplicateDate?.fields.due === '2026-07-30' && duplicateDate.duplicates.includes('due'),
    JSON.stringify(duplicateDate?.fields),
);

const dataviewTask = parseTask(
    extractTaskLines(['- [ ] Dataview format task  [due:: 2026-09-01]'], 'x.md')[0],
    { ...DEFAULT_SETTINGS, taskFormat: 'dataview' },
);
check(
    'the Dataview serializer parses its own inline fields',
    dataviewTask.fields.due === '2026-09-01',
    JSON.stringify(dataviewTask.fields),
);

// ---------------------------------------------------------------------------------------------
// Fences, continuations and presets
// ---------------------------------------------------------------------------------------------

const fenceBlocks = extractTasksBlocks(readMarkdown(path.join(FIXTURE_VAULT, 'Fences.md')).lines);
check('four-backtick, tilde and three-backtick tasks fences are all extracted', fenceBlocks.length === 3, `${fenceBlocks.length} blocks`);
check('every extracted fence is closed', fenceBlocks.every((block) => block.closed));

const continuation = buildEffectiveQuery(fenceBlocks[2], {}, DEFAULT_SETTINGS);
check(
    'a trailing backslash joins two physical lines into one statement',
    continuation.statements.length === 1 &&
        continuation.statements[0].text === '(priority is highest) OR (priority is lowest)',
    JSON.stringify(continuation.statements.map((item) => item.text)),
);

const unclosed = extractTasksBlocks(readMarkdown(path.join(FIXTURE_VAULT, 'UnclosedFence.md')).lines);
check('a closing fence shorter than the opener does not close the block', unclosed[0]?.closed === false);

check(
    'a vault presets map replaces the pinned defaults wholesale',
    JSON.stringify(resolvePresets({ presets: { only: 'not done' } })) ===
        JSON.stringify({ presets: { only: 'not done' }, origin: 'vault-presets' }),
);
check(
    'a legacy includes map is migrated exactly as the plugin migrates it',
    resolvePresets({ includes: { legacy: 'done' } }).presets.legacy === 'done' &&
        resolvePresets({ includes: { legacy: 'done' } }).origin === 'migrated-includes',
);
check(
    'settings with neither key fall back to the eight pinned defaults',
    Object.keys(resolvePresets({ globalFilter: '#task' }).presets).length === 8 &&
        resolvePresets(null).presets.this_file === DEFAULT_PRESETS.this_file,
);
check(
    'a deleted preset stays deleted rather than being reseeded from the defaults',
    resolvePresets({ presets: {} }).presets.this_file === undefined,
);

const placeholderBlock = {
    startLine: 1,
    lines: [{ text: '{{preset.outer}}', line: 2 }],
};
const placeholderExpansion = buildEffectiveQuery(placeholderBlock, {}, {
    ...DEFAULT_SETTINGS,
    presets: {
        outer: '# generated comment\n{{preset.inner}}',
        inner: 'filter by function task.description.includes("x")',
    },
});
check(
    'nested multi-line preset placeholders become separate effective statements',
    JSON.stringify(placeholderExpansion.lines) ===
        JSON.stringify(['# generated comment', 'filter by function task.description.includes("x")']),
    JSON.stringify(placeholderExpansion.lines),
);
check(
    'placeholder-expanded statements retain the complete preset origin chain',
    placeholderExpansion.statements[1]?.origin?.presetChain?.join(' → ') === 'outer → inner',
    JSON.stringify(placeholderExpansion.statements[1]?.origin),
);

const branchedPlaceholderExpansion = buildEffectiveQuery(placeholderBlock, {}, {
    ...DEFAULT_SETTINGS,
    presets: {
        outer: '{{preset.left}}\n{{preset.right}}',
        left: 'not done',
        right: 'done',
    },
});
check(
    'parallel placeholder branches keep distinct per-statement origin chains',
    branchedPlaceholderExpansion.statements[0]?.origin?.presetChain?.join(' → ') ===
        'outer → left' &&
        branchedPlaceholderExpansion.statements[1]?.origin?.presetChain?.join(' → ') ===
            'outer → right',
    JSON.stringify(branchedPlaceholderExpansion.statements.map((item) => item.origin)),
);

const commentPlaceholder = buildEffectiveQuery(
    { startLine: 1, lines: [{ text: '# {{preset.risky}}', line: 2 }] },
    {},
    { ...DEFAULT_SETTINGS, presets: { risky: 'filter by function true' } },
);
check(
    'a placeholder in an original comment stays unexpanded like the pinned parser',
    commentPlaceholder.lines[0] === '# {{preset.risky}}' &&
        commentPlaceholder.statements[0]?.origin?.presetChain === undefined,
    JSON.stringify(commentPlaceholder.statements),
);

const placeholderCycle = buildEffectiveQuery(placeholderBlock, {}, {
    ...DEFAULT_SETTINGS,
    presets: { outer: '{{preset.inner}}', inner: '{{preset.outer}}' },
});
check(
    'a placeholder cycle is reported and bounded',
    placeholderCycle.presetCycles.some(
        (item) => item.cycle.join(' → ') === 'outer → inner → outer',
    ),
    JSON.stringify(placeholderCycle.presetCycles),
);

// ---------------------------------------------------------------------------------------------
// Command-line behaviour
// ---------------------------------------------------------------------------------------------

const badQuery = run(
    'tasks-query-lint.mjs',
    [FIXTURE_VAULT, '--file', 'Dashboard.md', '--format', 'json', '--js-disabled'],
    [1],
);
const badQueryReport = parseJson(badQuery, 'bad query lint');
const badRules = new Set(badQueryReport?.diagnostics?.map((item) => item.rule) ?? []);
for (const rule of [
    'TQ001-relative-range-prefix',
    'TQ002-sort-trailing-text',
    'TQ003-return-substring',
    'TQ004-boolean-case',
    'TQ007-priority-above-low',
    'TQ008-path-all-markdown',
    'TQ010-starts-includes-undated',
    'TQ011-js-disabled',
    'TQ012-js-security-review',
    'TQ015-repeated-allTasks-scan',
    'TQ018-regex-nested-quantifier',
    'TQ019-unknown-preset',
    'TQ022-group-limit-without-group',
]) {
    check(`bad query reports ${rule}`, badRules.has(rule));
}
check(
    'reports state the plugin version and the origin of preset definitions',
    badQueryReport?.assumptions?.some((item) => item.includes('8.3.0')) &&
        badQueryReport?.presetsOrigin === 'vault-presets',
    JSON.stringify(badQueryReport?.assumptions),
);
check('reports state their limitations', (badQueryReport?.limitations?.length ?? 0) >= 3);
check(
    'diagnostics carry confidence and fix safety',
    badQueryReport?.diagnostics?.every((item) => item.confidence && item.fixSafety),
);

const cleanQuery = run(
    'tasks-query-lint.mjs',
    [FIXTURE_VAULT, '--file', 'Clean.md', '--format', 'json', '--js-disabled'],
    [0],
);
const cleanQueryReport = parseJson(cleanQuery, 'clean query lint');
check('clean query has no diagnostics', cleanQueryReport?.diagnostics?.length === 0);

const fenceLint = parseJson(
    run('tasks-query-lint.mjs', [FIXTURE_VAULT, '--file', 'Fences.md', '--format', 'json', '--js-disabled'], [0]),
    'fence lint',
);
check('supported fence forms and continuations produce no false positives', fenceLint?.diagnostics?.length === 0);

const presetLint = parseJson(
    run('tasks-query-lint.mjs', [FIXTURE_VAULT, '--file', 'Presets.md', '--format', 'json', '--js-disabled'], [1]),
    'preset lint',
);
const presetRules = new Set(presetLint?.diagnostics?.map((item) => item.rule) ?? []);
check(
    'a risky instruction reached through a preset is not reported clean',
    presetRules.has('TQ012-js-security-review') && presetRules.has('TQ011-js-disabled'),
    [...presetRules].join(', '),
);
check(
    'a preset-originated finding names where it came from',
    presetLint?.diagnostics?.some((item) => item.origin === 'block via preset risky_js'),
    JSON.stringify(presetLint?.diagnostics?.map((item) => item.origin)),
);
check('a cyclic preset definition is reported, not followed', presetRules.has('TQ025-preset-cycle'));
check(
    'a risky instruction behind a nested multi-line placeholder is not hidden by its comment line',
    presetLint?.diagnostics?.some(
        (item) =>
            item.rule === 'TQ012-js-security-review' &&
            item.origin === 'block via preset placeholder_outer → placeholder_inner',
    ),
    JSON.stringify(presetLint?.diagnostics),
);
check(
    'a placeholder cycle is reported, not left as an apparently ordinary statement',
    presetLint?.diagnostics?.some(
        (item) =>
            item.rule === 'TQ025-preset-cycle' &&
            item.message.includes('placeholder_cycle_a → placeholder_cycle_b → placeholder_cycle_a'),
    ),
    JSON.stringify(presetLint?.diagnostics),
);

const unclosedLint = parseJson(
    run('tasks-query-lint.mjs', [FIXTURE_VAULT, '--file', 'UnclosedFence.md', '--format', 'json'], [1]),
    'unclosed fence lint',
);
check(
    'an unclosed block is reported',
    unclosedLint?.diagnostics?.some((item) => item.rule === 'TQ024-unclosed-block'),
);

const sarif = parseJson(
    run('tasks-query-lint.mjs', [FIXTURE_VAULT, '--file', 'Dashboard.md', '--format', 'sarif', '--js-disabled'], [1]),
    'SARIF report',
);
check('SARIF output is version 2.1.0 with results', sarif?.version === '2.1.0' && sarif.runs[0].results.length > 0);
check(
    'SARIF carries the assumptions and limitations of the run',
    (sarif?.runs?.[0]?.invocations?.[0]?.properties?.assumptions?.length ?? 0) > 0 &&
        (sarif?.runs?.[0]?.invocations?.[0]?.properties?.limitations?.length ?? 0) > 0,
);

check(
    'a missing vault is an error, not a silent scan of the current directory',
    spawnSync(process.execPath, [path.join(SCRIPT_DIR, 'tasks-query-lint.mjs')], { encoding: 'utf8' }).status === 2,
);
check(
    'a positional vault contradicting --vault is rejected',
    spawnSync(process.execPath, [path.join(SCRIPT_DIR, 'tasks-query-lint.mjs'), FIXTURE_VAULT, '--vault', SKILL_ROOT], {
        encoding: 'utf8',
    }).status === 2,
);
check(
    'a file outside the vault is rejected',
    spawnSync(
        process.execPath,
        [path.join(SCRIPT_DIR, 'tasks-query-lint.mjs'), FIXTURE_VAULT, '--file', '../../../etc/hosts'],
        { encoding: 'utf8' },
    ).status === 2,
);

const vaultAudit = run('tasks-vault-lint.mjs', [FIXTURE_VAULT, '--format', 'json'], [1]);
const vaultReport = parseJson(vaultAudit, 'vault audit');
const vaultRules = new Set(vaultReport?.diagnostics?.map((item) => item.rule) ?? []);
for (const rule of [
    'TV002-duplicate-status-symbol',
    'TV003-missing-next-status',
    'TV004-non-breaking-space',
    'TV006-unknown-status',
    'TV007-mixed-task-format',
    'TV008-unparsed-task-field',
    'TV009-invalid-date',
    'TV010-duplicate-field',
    'TV012-recurrence-without-date',
    'TV013-unsupported-recurrence-bound',
    'TV014-recurring-in-daily-note',
    'TV015-delete-parent-with-children',
    'TV016-inferred-scheduled-date',
    'TV018-duplicate-id',
    'TV019-self-dependency',
    'TV020-dangling-dependency',
    'TV021-dependency-cycle',
    'TV023-scan-limit-reached',
]) {
    check(`vault audit reports ${rule}`, vaultRules.has(rule));
}

const whyNot = run(
    'tasks-why-not.mjs',
    [
        FIXTURE_VAULT,
        '--task-file',
        'WhyNot.md',
        '--task-line',
        '1',
        '--query-file',
        'WhyNot.md',
        '--query-block',
        '1',
        '--today',
        '2026-07-29',
        '--format',
        'json',
    ],
    [1],
);
const whyNotReport = parseJson(whyNot, 'why-not');
check(
    'why-not identifies first rejecting filter',
    whyNotReport?.firstRejectingInstruction === 'due before 2026-08-01',
    whyNotReport?.verdict,
);
check('why-not reconstructs due date', whyNotReport?.task?.fields?.due === '2026-08-15');
check(
    'why-not attributes every evaluated instruction to its origin',
    whyNotReport?.evaluations?.every((item) => typeof item.origin === 'string'),
);

// ---------------------------------------------------------------------------------------------
// Performance statistics are keyed by exact label, never merged across queries.
// ---------------------------------------------------------------------------------------------

const profile = run('tasks-profile.mjs', [PERFORMANCE_LOG, '--format', 'json'], [0]);
const profileReport = parseJson(profile, 'performance profile');
check('profile keys statistics by exact label', profileReport?.primaryKey === 'label');
check(
    'two distinct search labels never merge into one distribution',
    profileReport?.byLabel?.['Search: query-a - Dashboard.md']?.count === 2 &&
        profileReport?.byLabel?.['Search: query-b - Projects.md']?.count === 1,
    JSON.stringify(Object.keys(profileReport?.byLabel ?? {})),
);
check(
    'per-label median and nearest-rank p95 are computed on that label alone',
    profileReport?.byLabel?.['Search: query-a - Dashboard.md']?.medianMs === 15 &&
        profileReport?.byLabel?.['Search: query-a - Dashboard.md']?.p95Ms === 20,
    JSON.stringify(profileReport?.byLabel?.['Search: query-a - Dashboard.md']),
);
check(
    'the category roll-up is offered separately and explicitly named',
    profileReport?.byCategory?.search?.count === 3 && profileReport?.byCategory?.['vault-load']?.maxMs === 100,
    JSON.stringify(profileReport?.byCategory),
);
check(
    'cold and warm runs are not silently merged without saying so',
    profileReport?.limitations?.some((item) => item.includes('Cold and warm')),
);

// ---------------------------------------------------------------------------------------------
// Identity, then the formal verifier.
// ---------------------------------------------------------------------------------------------

const sourceRoot = findDefaultSourceRoot();
if (!sourceRoot) {
    process.stdout.write('SKIP formal verifier (no hydrated Tasks checkout found)\n');
} else {
    const identity = verifyPrimaryIdentity(sourceRoot);
    check(
        'the discovered checkout is the reviewed pin',
        identity.status === IDENTITY_STATUS.verified,
        identity.reason ?? '',
    );
    if (identity.status === IDENTITY_STATUS.verified) {
        const verifier = run('verify.mjs', ['--source-root', sourceRoot, '--format', 'json'], [0]);
        const verifierReport = parseJson(verifier, 'formal verifier');
        check(`formal verifier is clean`, verifierReport?.failed === 0, `${verifierReport?.failed} failures`);
    }

    // The directory must stay valid when copied out of the repository with its repository-only
    // navigation removed, which is the shape a target runtime actually receives.
    const extracted = fs.mkdtempSync(path.join(os.tmpdir(), 'tasks-extracted-'));
    try {
        const copy = path.join(extracted, 'tasks');
        fs.cpSync(SKILL_ROOT, copy, { recursive: true });
        const skillFile = path.join(copy, 'SKILL.md');
        const stripped = fs
            .readFileSync(skillFile, 'utf8')
            .replace(/## Repository navigation \(remove when extracting this skill\)[\s\S]*?(?=\n## )/, '');
        fs.writeFileSync(skillFile, stripped);
        check(
            'the repository-only section was the only thing removed',
            !stripped.includes('results/deep-dives') && stripped.includes('## Handoff checklist'),
        );
        const result = spawnSync(
            process.execPath,
            [path.join(copy, 'scripts', 'verify.mjs'), '--source-root', sourceRoot, '--format', 'json'],
            { encoding: 'utf8' },
        );
        check(
            'an extracted copy still verifies clean',
            result.status === 0,
            `exit ${result.status}: ${(result.stdout || result.stderr).slice(-400)}`,
        );
        const tests = spawnSync(process.execPath, [path.join(copy, 'scripts', 'test.mjs')], {
            encoding: 'utf8',
        });
        check(
            'an extracted copy still passes its own fixture suite',
            tests.status === 0,
            `exit ${tests.status}: ${(tests.stdout || tests.stderr).slice(-400)}`,
        );

        fs.appendFileSync(
            skillFile,
            '\nRepository leak after extraction: research/plugins/example/component\n',
        );
        const leaked = spawnSync(
            process.execPath,
            [path.join(copy, 'scripts', 'verify.mjs'), '--source-root', sourceRoot, '--format', 'json'],
            { encoding: 'utf8' },
        );
        const leakedReport = leaked.stdout ? JSON.parse(leaked.stdout) : null;
        check(
            'the verifier scans portable content after the removed repository section',
            leaked.status === 1 &&
                leakedReport?.checks?.some(
                    (item) => item.id === 'no-repository-paths' && item.passed === false,
                ),
            `exit ${leaked.status}: ${(leaked.stdout || leaked.stderr).slice(-400)}`,
        );
    } finally {
        fs.rmSync(extracted, { recursive: true, force: true });
    }

    const decoy = fs.mkdtempSync(path.join(os.tmpdir(), 'tasks-decoy-'));
    try {
        fs.mkdirSync(path.join(decoy, 'src'), { recursive: true });
        fs.mkdirSync(path.join(decoy, 'docs'), { recursive: true });
        fs.writeFileSync(path.join(decoy, 'src', 'Task.ts'), 'export const x = 1;\n');
        fs.writeFileSync(path.join(decoy, 'docs', 'index.md'), '# decoy\n');
        fs.writeFileSync(
            path.join(decoy, 'manifest.json'),
            '{"id":"obsidian-tasks-plugin","version":"8.3.0"}\n',
        );
        fs.writeFileSync(path.join(decoy, 'package.json'), '{"name":"obsidian-tasks","version":"8.3.0"}\n');
        fs.writeFileSync(path.join(decoy, 'versions.json'), '{}\n');
        const decoyResult = spawnSync(
            process.execPath,
            [path.join(SCRIPT_DIR, 'verify.mjs'), '--source-root', decoy, '--format', 'json'],
            { encoding: 'utf8' },
        );
        check(
            'a checkout that keeps version 8.3.0 but is not the reviewed pin exits with the identity code',
            decoyResult.status === 4,
            `expected 4, got ${decoyResult.status}`,
        );
        const missing = spawnSync(
            process.execPath,
            [path.join(SCRIPT_DIR, 'verify.mjs'), '--source-root', path.join(decoy, 'nowhere')],
            { encoding: 'utf8' },
        );
        check('missing material is distinguishable from an artifact defect', missing.status === 3, `got ${missing.status}`);
        const usage = spawnSync(process.execPath, [path.join(SCRIPT_DIR, 'verify.mjs'), '--nonsense'], {
            encoding: 'utf8',
        });
        check('a usage error is distinguishable from both', usage.status === 2, `got ${usage.status}`);
    } finally {
        fs.rmSync(decoy, { recursive: true, force: true });
    }
}

process.stdout.write(`Integration checks: ${checks - failures}/${checks} passed\n`);
process.exit(failures === 0 ? 0 : 1);
