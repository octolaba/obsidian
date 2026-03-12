#!/usr/bin/env node

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { parseArgs } from './lib.mjs';
import { IDENTITY_STATUS, verifyPrimaryIdentity } from './identity.mjs';

const SCRIPT_ROOT = path.dirname(fileURLToPath(import.meta.url));
const SKILL_ROOT = path.dirname(SCRIPT_ROOT);
const FIXTURE_SOURCE = path.join(SCRIPT_ROOT, 'fixtures', 'vault');
const CONFIG_SOURCE = path.join(SCRIPT_ROOT, 'fixtures', 'dataview-config');
let FIXTURE = FIXTURE_SOURCE;
const USAGE = 'usage: node test.mjs [--source-root PATH]';

function discover(relative, sentinel) {
    let current = SKILL_ROOT;
    while (true) {
        const candidate = path.join(current, ...relative.split('/'));
        if (fs.existsSync(path.join(candidate, sentinel))) return candidate;
        const parent = path.dirname(current);
        if (parent === current) return null;
        current = parent;
    }
}

function discoverSource() {
    return discover('research/plugins/blacksmithgu/obsidian-dataview', 'manifest.json');
}

/**
 * A relocated copy of the skill cannot discover the supporting roots by walking upwards, so the
 * rename regression passes them explicitly.
 */
function supportingRootArguments() {
    const api = discover('research/core/obsidian-api', 'obsidian.d.ts');
    const help = discover('research/core/obsidian-help/en', 'Editing and formatting/Properties.md');
    if (!api || !help) return null;
    return ['--obsidian-api-root', api, '--obsidian-help-root', help];
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
    expect(report.scanned.queries === 15, `expected 15 fixture queries, got ${report.scanned.queries}`);
    expect(
        JSON.stringify(report.scanned.byType) ===
            JSON.stringify({ dql: 12, js: 1, inline: 1, 'inline-js': 1 }),
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

/** Every callout-nested source line must retain its physical Markdown column. */
function testCalloutLocations(sourceRoot) {
    const report = parseReport(
        run('dataview-query-lint.mjs', [FIXTURE, '--file', 'Callouts.md', '--format', 'json', '--all']),
        'callout locations',
        [1],
    );
    const blocks = report.queries.filter(item => item.file === 'Callouts.md');
    expect(blocks.length === 3, `callout locations: expected three blocks, got ${blocks.length}`);
    expect(
        blocks[0].column === 3 && blocks[1].column === 5,
        `callout locations: expected opener columns 3/5, got ${blocks.map(item => item.column).join('/')}`,
    );
    const comparisonLocations = report.diagnostics
        .filter(item => item.rule === 'DVQ003' && item.file === 'Callouts.md')
        .map(item => `${item.line}:${item.column}`);
    expect(
        JSON.stringify(comparisonLocations) === JSON.stringify(['6:3', '12:5']),
        `callout locations: later source lines lost their prefixes: ${comparisonLocations.join(', ')}`,
    );

    const sarif = parseReport(
        run('dataview-query-lint.mjs', [FIXTURE, '--file', 'Callouts.md', '--format', 'sarif']),
        'callout SARIF locations',
        [1],
    );
    const sarifLocations = sarif.runs[0].results
        .filter(item => item.ruleId === 'DVQ003')
        .map(item => {
            const region = item.locations[0].physicalLocation.region;
            return `${region.startLine}:${region.startColumn}`;
        });
    expect(
        JSON.stringify(sarifLocations) === JSON.stringify(['6:3', '12:5']),
        `callout SARIF locations: expected 6:3/12:5, got ${sarifLocations.join(', ')}`,
    );

    if (sourceRoot) {
        const exact = parseReport(
            run('dataview-query-lint.mjs', [
                FIXTURE,
                '--file',
                'Callouts.md',
                '--source-root',
                sourceRoot,
                '--format',
                'json',
            ]),
            'exact callout locations',
            [1],
        );
        const parserError = exact.diagnostics.find(
            item => item.rule === 'DVQ000' && item.file === 'Callouts.md',
        );
        expect(Boolean(parserError), 'exact callout locations: expected a parser error');
        expect(
            parserError.line === 17 && parserError.column === 5,
            `exact callout locations: expected 17:5, got ${parserError.line}:${parserError.column}`,
        );
    }
}

/** Version and settings assumptions are surfaced as findings, not merely echoed. */
function testEnvironmentAssumptions() {
    const manifestPath = path.join(FIXTURE, '.obsidian', 'plugins', 'dataview', 'manifest.json');
    const original = fs.readFileSync(manifestPath, 'utf8');
    try {
        fs.writeFileSync(manifestPath, JSON.stringify({ ...JSON.parse(original), version: '0.4.0' }, null, 2));
        const drifted = parseReport(
            run('dataview-query-lint.mjs', [FIXTURE, '--file', 'CleanQueries.md', '--format', 'json']),
            'version drift',
            [1],
        );
        expect(ruleSet(drifted).has('DVE002'), 'version drift: expected DVE002 outside the studied boundary');
        expect(
            drifted.assumptions.some(item => item.includes('0.4.0')),
            'version drift: the assumption must name the installed version',
        );
        fs.rmSync(manifestPath);
        const absent = parseReport(
            run('dataview-query-lint.mjs', [FIXTURE, '--file', 'CleanQueries.md', '--format', 'json']),
            'absent manifest',
            [1],
        );
        expect(ruleSet(absent).has('DVE001'), 'absent manifest: expected DVE001');
    } finally {
        fs.mkdirSync(path.dirname(manifestPath), { recursive: true });
        fs.writeFileSync(manifestPath, original);
    }
}

/** Vault scope is explicit: no implicit current directory and no file outside the vault. */
function testVaultScope() {
    const missingVault = run('dataview-query-lint.mjs', ['--format', 'json']);
    expect(missingVault.status === 2, `vault scope: expected exit 2 without a vault, got ${missingVault.status}`);
    const contradiction = run('dataview-query-lint.mjs', [FIXTURE, '--vault', SKILL_ROOT]);
    expect(
        contradiction.status === 2,
        `vault scope: expected exit 2 for a contradicting positional, got ${contradiction.status}`,
    );
    const outside = run('dataview-query-lint.mjs', [FIXTURE, '--file', '../../etc/hosts']);
    expect(outside.status === 2, `vault scope: expected exit 2 for a file outside the vault, got ${outside.status}`);
}

/**
 * Exact mode must prove the checkout is the reviewed pin before loading anything from it.
 * The decoy carries the studied material layout but neither the reviewed contents nor any
 * dependency, so reaching the loader at all would fail differently.
 */
function testExactModeIdentityGate(sourceRoot, temporary) {
    const decoy = path.join(temporary, 'decoy-dataview');
    fs.mkdirSync(path.join(decoy, 'src', 'query'), { recursive: true });
    fs.mkdirSync(path.join(decoy, 'docs', 'docs'), { recursive: true });
    fs.writeFileSync(path.join(decoy, 'src', 'query', 'parse.ts'), 'export function parseQuery() {}\n');
    fs.writeFileSync(path.join(decoy, 'docs', 'docs', 'index.md'), '# decoy\n');
    fs.writeFileSync(path.join(decoy, 'manifest.json'), '{"id":"dataview","version":"0.5.68"}\n');
    fs.writeFileSync(path.join(decoy, 'package.json'), '{"name":"obsidian-dataview","version":"0.5.68"}\n');
    fs.writeFileSync(path.join(decoy, 'CHANGELOG.md'), '# decoy\n');

    const identity = verifyPrimaryIdentity(decoy);
    expect(
        identity.status === IDENTITY_STATUS.mismatch,
        `identity gate: decoy should mismatch, got ${identity.status}`,
    );

    const report = parseReport(
        run('dataview-query-lint.mjs', [FIXTURE, '--source-root', decoy, '--format', 'json']),
        'exact mode identity gate',
        [4],
    );
    expect(report.mode === 'static', `identity gate: expected degradation to static, got ${report.mode}`);
    expect(report.material.matchesReviewedPin === false, 'identity gate: material must not claim the reviewed pin');
    expect(report.material.exactModeEnabled === false, 'identity gate: exact mode must stay disabled');
    expect(ruleSet(report).has('DVM002'), 'identity gate: expected a DVM002 provenance finding');

    const empty = run('dataview-query-lint.mjs', [FIXTURE, '--source-root', path.join(temporary, 'nowhere')]);
    expect(empty.status === 3, `identity gate: expected exit 3 for missing material, got ${empty.status}`);

    if (sourceRoot) {
        const alternate = path.join(temporary, 'alternate-dataview');
        fs.cpSync(sourceRoot, alternate, {
            recursive: true,
            filter(source) {
                const relative = path.relative(sourceRoot, source);
                return (
                    relative !== '.git' &&
                    relative !== 'node_modules' &&
                    !relative.startsWith(`node_modules${path.sep}`)
                );
            },
        });
        fs.symlinkSync(path.join(sourceRoot, 'node_modules'), path.join(alternate, 'node_modules'), 'dir');
        fs.appendFileSync(path.join(alternate, 'CHANGELOG.md'), '\n<!-- identity-drift fixture -->\n');

        const override = parseReport(
            run('dataview-query-lint.mjs', [
                FIXTURE,
                '--file',
                'CleanQueries.md',
                '--source-root',
                alternate,
                '--allow-unverified-source-root',
                '--format',
                'json',
            ]),
            'exact mode identity override',
            [0],
        );
        const identityNote = override.diagnostics.find(item => item.rule === 'DVM002');
        expect(
            override.mode === 'upstream-ast+static (unverified material)',
            `identity override: expected stamped exact mode, got ${override.mode}`,
        );
        expect(
            identityNote?.severity === 'note',
            `identity override: DVM002 must be a non-failing note, got ${identityNote?.severity}`,
        );
        expect(
            override.material.matchesReviewedPin === false && override.material.exactModeEnabled === true,
            'identity override: report must expose the mismatch and deliberate exact parse',
        );
    }
}

/**
 * The directory must stay valid when copied out of the repository with its repository-only section
 * removed, which is the shape a target runtime actually receives.
 */
function testExtractedCopy(sourceRoot, temporary) {
    const supporting = supportingRootArguments();
    if (!sourceRoot || !supporting) return 'skipped';
    const copy = path.join(temporary, 'extracted', 'dataview');
    fs.cpSync(SKILL_ROOT, copy, { recursive: true });
    const skillFile = path.join(copy, 'SKILL.md');
    const stripped = fs
        .readFileSync(skillFile, 'utf8')
        .replace(/## Repository-only verification[\s\S]*$/, '');
    fs.writeFileSync(skillFile, stripped);
    expect(!stripped.includes('research/plugins'), 'extracted copy: repository paths survived extraction');
    const verified = spawnSync(
        process.execPath,
        [path.join(copy, 'scripts', 'verify.mjs'), '--source-root', sourceRoot, ...supporting, '--format', 'json'],
        { encoding: 'utf8' },
    );
    expect(
        verified.status === 0,
        `extracted copy: verification exited ${verified.status}: ${(verified.stdout || verified.stderr).slice(-400)}`,
    );
    const degraded = spawnSync(
        process.execPath,
        [path.join(copy, 'scripts', 'verify.mjs'), '--format', 'json'],
        { encoding: 'utf8' },
    );
    expect(
        degraded.status === 3,
        `extracted copy: without source roots verification must report missing material, got ${degraded.status}`,
    );
}

/**
 * Renaming the directory or the frontmatter name must fail verification on its own. Deriving one
 * from the other would let an accidental co-rename pass.
 */
function testRenameRegression(sourceRoot, temporary) {
    const supporting = supportingRootArguments();
    if (!sourceRoot || !supporting) return 'skipped';
    const renamedName = path.join(temporary, 'rename-name', 'dataview');
    fs.cpSync(SKILL_ROOT, renamedName, { recursive: true });
    const skillFile = path.join(renamedName, 'SKILL.md');
    fs.writeFileSync(
        skillFile,
        fs
            .readFileSync(skillFile, 'utf8')
            .replace('name: obsidian-dataview-plugin', 'name: dataview'),
    );
    const nameResult = spawnSync(
        process.execPath,
        [
            path.join(renamedName, 'scripts', 'verify.mjs'),
            '--source-root',
            sourceRoot,
            ...supporting,
            '--format',
            'json',
        ],
        { encoding: 'utf8' },
    );
    expect(nameResult.status === 1, `rename regression: expected exit 1 for a renamed skill, got ${nameResult.status}`);
    const nameReport = JSON.parse(nameResult.stdout);
    expect(
        nameReport.checks.some(check => check.id === 'skill-name' && !check.passed),
        'rename regression: skill-name must fail when the frontmatter name changes',
    );

    const renamedDirectory = path.join(temporary, 'rename-directory', 'dataview-plugin');
    fs.cpSync(SKILL_ROOT, renamedDirectory, { recursive: true });
    const directoryResult = spawnSync(
        process.execPath,
        [
            path.join(renamedDirectory, 'scripts', 'verify.mjs'),
            '--source-root',
            sourceRoot,
            ...supporting,
            '--format',
            'json',
        ],
        { encoding: 'utf8' },
    );
    expect(
        directoryResult.status === 1,
        `rename regression: expected exit 1 for a renamed directory, got ${directoryResult.status}`,
    );
    const directoryReport = JSON.parse(directoryResult.stdout);
    expect(
        directoryReport.checks.some(check => check.id === 'skill-directory-basename' && !check.passed),
        'rename regression: skill-directory-basename must fail when the directory changes',
    );
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

    // Identity is established before any exact-mode stage runs against that checkout.
    if (sourceRoot) {
        const identity = verifyPrimaryIdentity(sourceRoot);
        if (identity.status !== IDENTITY_STATUS.verified) {
            throw new Error(`source identity is not the reviewed pin: ${identity.reason}`);
        }
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
            ['callout-nested locations', () => testCalloutLocations(sourceRoot)],
            ['explicit vault scope', () => testVaultScope()],
            ['environment assumptions', () => testEnvironmentAssumptions()],
            ['settings gates', () => testSettingsGates()],
            ['exact-mode identity gate', () => testExactModeIdentityGate(sourceRoot, temporary)],
            ['source-backed exact query lint', () => testExactQueryLint(sourceRoot)],
            ['rename regression', () => testRenameRegression(sourceRoot, temporary)],
            ['extracted copy', () => testExtractedCopy(sourceRoot, temporary)],
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
