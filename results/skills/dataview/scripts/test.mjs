#!/usr/bin/env node

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { parseArgs } from './lib.mjs';

const SCRIPT_ROOT = path.dirname(fileURLToPath(import.meta.url));
const SKILL_ROOT = path.dirname(SCRIPT_ROOT);
const FIXTURE_SOURCE = path.join(SCRIPT_ROOT, 'fixtures', 'vault');
const CONFIG_SOURCE = path.join(SCRIPT_ROOT, 'fixtures', 'dataview-config');
let FIXTURE = FIXTURE_SOURCE;
const USAGE = 'usage: node test.mjs [--source-root PATH]';

function discoverSource() {
    let current = SKILL_ROOT;
    while (true) {
        const candidate = path.join(
            current,
            'research',
            'plugins',
            'blacksmithgu',
            'obsidian-dataview',
        );
        if (fs.existsSync(path.join(candidate, 'manifest.json'))) return candidate;
        const parent = path.dirname(current);
        if (parent === current) return null;
        current = parent;
    }
}

function run(script, args) {
    return spawnSync(process.execPath, [path.join(SCRIPT_ROOT, script), ...args], {
        encoding: 'utf8',
    });
}

function parseReport(result, label, expectedStatuses = [0, 1]) {
    if (!expectedStatuses.includes(result.status)) {
        throw new Error(
            `${label}: exit ${result.status}\nstdout:\n${result.stdout}\nstderr:\n${result.stderr}`,
        );
    }
    try {
        return JSON.parse(result.stdout);
    } catch (error) {
        throw new Error(`${label}: invalid JSON: ${error.message}\n${result.stdout}`);
    }
}

function expect(condition, message) {
    if (!condition) throw new Error(message);
}

function ruleSet(report) {
    return new Set(report.diagnostics.map(item => item.rule));
}

function expectRules(report, expected, label) {
    const actual = ruleSet(report);
    for (const rule of expected) expect(actual.has(rule), `${label}: expected ${rule}`);
}

function testStaticQueryLint() {
    const result = run('dataview-query-lint.mjs', [
        '--format',
        'json',
        '--all',
        '--vault',
        FIXTURE,
    ]);
    const report = parseReport(result, 'static query lint', [1]);
    expect(report.mode === 'static', 'static query lint: wrong mode');
    expect(report.settings.dataviewJsKeyword === 'dvjs', 'custom DataviewJS keyword was not read');
    expect(report.settings.inlineQueryPrefix === 'dv=', 'custom inline prefix was not read');
    expect(report.scanned.queries === 12, `expected 12 fixture queries, got ${report.scanned.queries}`);
    expect(
        JSON.stringify(report.scanned.byType) ===
            JSON.stringify({ dql: 9, js: 1, inline: 1, 'inline-js': 1 }),
        `unexpected query type counts: ${JSON.stringify(report.scanned.byType)}`,
    );
    expectRules(
        report,
        [
            'DVM001',
            'DVQ001',
            'DVQ002',
            'DVQ003',
            'DVQ004',
            'DVQ005',
            'DVQ007',
            'DVQ008',
            'DVQ011',
            'DVQ012',
            'DVQ013',
            'DVQ101',
            'DVJ001',
            'DVJ002',
            'DVJ004',
            'DVJ008',
        ],
        'static query lint',
    );
    const clean = report.queries.filter(item => item.file === 'CleanQueries.md');
    expect(clean.length === 2, 'static query lint: clean queries were not extracted');
    expect(clean.every(item => item.diagnostics.length === 0), 'clean fixture has a false positive');
    const edge = report.queries.filter(item => item.file === 'Extraction.md');
    expect(edge.length === 1, 'callout/tilde/long-closing-fence extraction failed');
    expect(edge[0].diagnostics.length === 0, 'extraction edge fixture has a false positive');
}

function testCleanQueryLint(sourceRoot) {
    const args = [FIXTURE, '--file', 'CleanQueries.md', '--format', 'json'];
    if (sourceRoot) args.push('--source-root', sourceRoot);
    const result = run('dataview-query-lint.mjs', args);
    const report = parseReport(result, 'clean query lint', [0]);
    expect(report.diagnostics.length === 0, 'clean query lint: expected zero diagnostics');
    expect(
        report.mode === (sourceRoot ? 'upstream-ast+static' : 'static'),
        `clean query lint: unexpected mode ${report.mode}`,
    );
}

function testSettingsGates() {
    const settingsPath = path.join(
        FIXTURE,
        '.obsidian',
        'plugins',
        'dataview',
        'data.json',
    );
    const original = fs.readFileSync(settingsPath, 'utf8');
    try {
        const settings = JSON.parse(original);
        fs.writeFileSync(
            settingsPath,
            `${JSON.stringify(
                {
                    ...settings,
                    enableDataviewJs: false,
                    enableInlineDataview: false,
                    enableInlineDataviewJs: false,
                },
                null,
                2,
            )}\n`,
        );
        const report = parseReport(
            run('dataview-query-lint.mjs', [
                FIXTURE,
                '--file',
                'BadQueries.md',
                '--format',
                'json',
            ]),
            'settings gates',
            [1],
        );
        expect(
            report.diagnostics.filter(item => item.rule === 'DVQ014').length === 3,
            'settings gates: expected disabled block JS, inline DQL and inline JS findings',
        );
    } finally {
        fs.writeFileSync(settingsPath, original);
    }
}

function testExactQueryLint(sourceRoot) {
    if (!sourceRoot) return 'skipped';
    const result = run('dataview-query-lint.mjs', [
        FIXTURE,
        '--source-root',
        sourceRoot,
        '--format',
        'json',
    ]);
    const report = parseReport(result, 'exact query lint', [1]);
    expect(report.mode === 'upstream-ast+static', 'exact query lint: parser was not enabled');
    expectRules(report, ['DVQ000', 'DVQ012'], 'exact query lint');
    testCleanQueryLint(sourceRoot);
}

function testSarifReports() {
    for (const script of ['dataview-query-lint.mjs', 'dataview-vault-lint.mjs']) {
        const result = run(script, [FIXTURE, '--format', 'sarif']);
        const report = parseReport(result, `${script} SARIF`, [1]);
        expect(report.version === '2.1.0', `${script}: wrong SARIF version`);
        expect(
            Array.isArray(report.runs) && report.runs[0]?.results?.length > 0,
            `${script}: SARIF contains no results`,
        );
    }
}

function testVaultLint() {
    const result = run('dataview-vault-lint.mjs', [FIXTURE, '--format', 'json', '--all']);
    const report = parseReport(result, 'vault lint', [1]);
    expectRules(
        report,
        ['DVS001', 'DVS002', 'DVS003', 'DVS004', 'DVS005', 'DVS006', 'DVS007', 'DVS008'],
        'vault lint',
    );
    expect(report.fields.some(item => item.canonical === 'project-status'), 'field inventory missing canonical alias');
    expect(
        report.fields.some(
            item => item.canonical === 'owner-link' && item.types.includes('link'),
        ),
        'schema parser did not preserve a wikilink inside a bracketed task field',
    );
    expect(
        report.limitations.some(item => item.includes('Nested YAML')),
        'vault lint must state its parser boundary',
    );
}

function testCompatibilityWrapper() {
    const help = run('audit-dataview-queries.mjs', ['-h']);
    expect(help.status === 0 && help.stdout.includes('usage:'), 'compatibility wrapper -h failed');
    const wrapped = run('audit-dataview-queries.mjs', [
        '--json',
        '--top',
        '5',
        '--min-score',
        '2',
        FIXTURE,
    ]);
    const report = parseReport(wrapped, 'compatibility wrapper', [1]);
    expect(report.tool === 'dataview-query-lint', 'compatibility wrapper did not call the new linter');
}

async function testLiveDoctorMock() {
    const source = fs.readFileSync(
        path.join(SKILL_ROOT, 'assets', 'dataview-doctor', 'view.js'),
        'utf8',
    );
    const rendered = [];
    let queryRuns = 0;
    const link = {
        path: 'Projects/Alpha.md',
        embed: false,
        toString: () => '[[Projects/Alpha]]',
    };
    const page = {
        status: 'open',
        due: null,
        file: {
            path: 'Projects/Alpha.md',
            link,
            tags: ['#project'],
            day: null,
        },
    };
    const dv = {
        api: { version: { current: '0.5.70' } },
        value: {
            isLink: value => Boolean(value?.path && 'embed' in value),
            isDate: () => false,
            isDuration: () => false,
        },
        isArray: Array.isArray,
        current: () => page,
        page: () => page,
        pagePaths: () => ['Projects/Alpha.md'],
        tryEvaluate: expression => expression.includes('status'),
        tryQuery: async () => {
            queryRuns += 1;
            return {
                type: 'table',
                headers: ['File'],
                values: [[link]],
                idMeaning: { type: 'path' },
            };
        },
        header: (...args) => rendered.push(['header', ...args]),
        paragraph: (...args) => rendered.push(['paragraph', ...args]),
        table: (...args) => rendered.push(['table', ...args]),
    };
    const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
    await new AsyncFunction('dv', 'input', source)(dv, {
        target: 'Projects/Alpha',
        fields: ['status', 'due', 'file.tags'],
        checks: [{ label: 'Open', expression: 'status = "open"' }],
        queries: [
            {
                label: 'Projects',
                dql: 'TABLE status FROM "Projects" WHERE status = "open"',
                repeats: 2,
            },
        ],
    });
    expect(queryRuns === 3, `live doctor mock: expected 3 query runs, got ${queryRuns}`);
    expect(
        rendered.filter(item => item[0] === 'table').length >= 4,
        'live doctor mock: expected snapshot, checks, query and trace tables',
    );
}

function testVerifier(sourceRoot) {
    if (!sourceRoot) return 'skipped';
    const result = run('verify.mjs', ['--source-root', sourceRoot, '--format', 'json']);
    const report = parseReport(result, 'formal verifier', [0]);
    expect(report.failed === 0, `formal verifier has ${report.failed} failures`);
}

async function main() {
    const args = parseArgs(process.argv.slice(2), {
        booleans: ['help'],
        values: ['source-root'],
    });
    if (args.help) {
        process.stdout.write(`${USAGE}\n`);
        return;
    }
    if (args._.length) throw new Error('positional arguments are not accepted');
    const sourceRoot = args['source-root']
        ? path.resolve(args['source-root'])
        : discoverSource();
    if (args['source-root'] && !fs.existsSync(path.join(sourceRoot, 'package.json'))) {
        throw new Error(`source root is not hydrated: ${sourceRoot}`);
    }

    const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'dataview-skill-test-'));
    FIXTURE = path.join(temporary, 'vault');
    try {
        fs.cpSync(FIXTURE_SOURCE, FIXTURE, { recursive: true });
        const pluginConfig = path.join(FIXTURE, '.obsidian', 'plugins', 'dataview');
        fs.mkdirSync(pluginConfig, { recursive: true });
        fs.copyFileSync(path.join(CONFIG_SOURCE, 'manifest.json'), path.join(pluginConfig, 'manifest.json'));
        fs.copyFileSync(path.join(CONFIG_SOURCE, 'data.json'), path.join(pluginConfig, 'data.json'));

        const tests = [
            ['settings-aware static query lint', () => testStaticQueryLint()],
            ['clean query baseline', () => testCleanQueryLint(null)],
            ['settings gates', () => testSettingsGates()],
            ['source-backed exact query lint', () => testExactQueryLint(sourceRoot)],
            ['metadata schema audit', () => testVaultLint()],
            ['SARIF reports', () => testSarifReports()],
            ['legacy entry point', () => testCompatibilityWrapper()],
            ['live doctor mock integration', () => testLiveDoctorMock()],
            ['formal verifier', () => testVerifier(sourceRoot)],
        ];
        let passed = 0;
        let skipped = 0;
        for (const [name, test] of tests) {
            const result = await test();
            if (result === 'skipped') {
                skipped += 1;
                process.stdout.write(`SKIP ${name} (source checkout unavailable)\n`);
            } else {
                passed += 1;
                process.stdout.write(`PASS ${name}\n`);
            }
        }
        process.stdout.write(
            `Dataview skill integration: ${passed}/${tests.length} passed${
                skipped ? `, ${skipped} skipped` : ''
            }\n`,
        );
    } finally {
        fs.rmSync(temporary, { recursive: true, force: true });
    }
}

try {
    await main();
} catch (error) {
    process.stderr.write(`FAIL ${error.message}\n${USAGE}\n`);
    process.exitCode = 1;
}
