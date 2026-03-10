#!/usr/bin/env node

import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const FIXTURE_VAULT = path.join(SCRIPT_DIR, 'fixtures', 'vault');
const PERFORMANCE_LOG = path.join(SCRIPT_DIR, 'fixtures', 'performance.log');

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

const badQuery = run(
    'tasks-query-lint.mjs',
    ['--vault', FIXTURE_VAULT, '--file', 'Dashboard.md', '--format', 'json', '--js-disabled'],
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

const cleanQuery = run(
    'tasks-query-lint.mjs',
    ['--vault', FIXTURE_VAULT, '--file', 'Clean.md', '--format', 'json', '--js-disabled'],
    [0],
);
const cleanQueryReport = parseJson(cleanQuery, 'clean query lint');
check('clean query has no diagnostics', cleanQueryReport?.diagnostics?.length === 0);

const vaultAudit = run(
    'tasks-vault-lint.mjs',
    ['--vault', FIXTURE_VAULT, '--format', 'json'],
    [1],
);
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
]) {
    check(`vault audit reports ${rule}`, vaultRules.has(rule));
}

const whyNot = run(
    'tasks-why-not.mjs',
    [
        '--vault',
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

const profile = run(
    'tasks-profile.mjs',
    [PERFORMANCE_LOG, '--format', 'json'],
    [0],
);
const profileReport = parseJson(profile, 'performance profile');
check('profile groups three search samples', profileReport?.summary?.search?.count === 3);
check('profile computes search median', profileReport?.summary?.search?.medianMs === 20);
check('profile computes nearest-rank search p95', profileReport?.summary?.search?.p95Ms === 30);
check('profile groups vault load', profileReport?.summary?.['vault-load']?.maxMs === 100);

process.stdout.write(`Integration checks: ${checks - failures}/${checks} passed\n`);
process.exit(failures === 0 ? 0 : 1);
