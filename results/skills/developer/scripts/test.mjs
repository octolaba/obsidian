#!/usr/bin/env node

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { parseArgs } from './lib.mjs';

const SCRIPT_ROOT = path.dirname(fileURLToPath(import.meta.url));
const FIXTURES = path.join(SCRIPT_ROOT, 'fixtures');
const USAGE = 'usage: node test.mjs [--sample-plugin-root PATH] [--sample-theme-root PATH]';

/**
 * Expected finding-id sets per fixture. They are exact: a rule that stops firing, and a rule that
 * starts firing where it should not, both fail here.
 */
const PLUGIN_FIXTURES = [
    { name: 'plugin-good', args: ['--new'], expect: [], exit: 0 },
    {
        name: 'plugin-bad-manifest',
        args: ['--new'],
        expect: [
            'ODP002', 'ODP003', 'ODP004', 'ODP005', 'ODP006', 'ODP007', 'ODP008', 'ODP009',
            'ODP010', 'ODP011', 'ODP012', 'ODP013', 'ODP014', 'ODP015', 'ODP016', 'ODP017',
            'ODP021',
        ],
        exit: 1,
    },
    {
        name: 'plugin-bad-source',
        args: ['--new'],
        expect: [
            'ODP020', 'ODP022', 'ODP023', 'ODP025', 'ODP030', 'ODP031', 'ODP032', 'ODP033',
            'ODP034', 'ODP035', 'ODP036', 'ODP037', 'ODP038', 'ODP039', 'ODP040', 'ODP041',
            'ODP042', 'ODP043', 'ODP044', 'ODP045', 'ODP046', 'ODP047', 'ODP048', 'ODP049',
            'ODP050', 'ODP051', 'ODP052', 'ODP053', 'ODP054', 'ODP055', 'ODP056',
        ],
        exit: 1,
    },
    { name: 'plugin-bundle-mode', args: ['--new'], expect: ['ODP006'], exit: 1, bundle: true },
    { name: 'plugin-release-mismatch', args: ['--release'], expect: ['ODP024'], exit: 1, notes: 3 },
];

const THEME_FIXTURES = [
    { name: 'theme-good', args: ['--new'], expect: [], exit: 0 },
    {
        name: 'theme-bad',
        args: ['--new'],
        expect: ['ODT002', 'ODT003', 'ODT004', 'ODT005', 'ODT008', 'ODT009', 'ODT010', 'ODT011', 'ODT012', 'ODT013', 'ODT014'],
        exit: 1,
    },
    { name: 'theme-remote-assets', args: ['--new'], expect: ['ODT007'], exit: 1 },
    // Two failing-tier theme rules that no other fixture can reach: a manifest that is present but
    // unparseable, and a theme whose stylesheet is not at the root where Obsidian downloads it.
    { name: 'theme-bad-manifest', args: ['--new'], expect: ['ODT001'], exit: 1 },
    { name: 'theme-missing-css', args: ['--new'], expect: ['ODT006'], exit: 1 },
];

/**
 * Snapshots of the official templates at their pin. Zero findings would be the wrong bar: the
 * templates deliberately ship placeholder identities, so the honest expectation is this exact set.
 */
const SAMPLE_PLUGIN_EXPECTED = ['ODP006', 'ODP007', 'ODP035', 'ODP051'];
const SAMPLE_THEME_EXPECTED = ['ODT004', 'ODT012', 'ODT013'];

function run(script, args, options = {}) {
    return spawnSync(process.execPath, [path.join(SCRIPT_ROOT, script), ...args], {
        encoding: 'utf8',
        ...options,
    });
}

function expect(condition, message) {
    if (!condition) throw new Error(message);
}

function parseJson(result, label, expectedExit) {
    if (expectedExit !== undefined && result.status !== expectedExit) {
        throw new Error(`${label}: exit ${result.status}, expected ${expectedExit}\n${result.stdout}\n${result.stderr}`);
    }
    try {
        return JSON.parse(result.stdout);
    } catch (error) {
        throw new Error(`${label}: invalid JSON (${error.message})\n${result.stdout}\n${result.stderr}`);
    }
}

function idsOf(report) {
    return [...new Set(report.findings.map(item => item.id))].sort();
}

function assertSet(actual, expected, label) {
    const missing = expected.filter(id => !actual.includes(id));
    const unexpected = actual.filter(id => !expected.includes(id));
    expect(
        missing.length === 0 && unexpected.length === 0,
        `${label}: missing [${missing.join(', ')}], unexpected [${unexpected.join(', ')}]`,
    );
}

function testPluginFixtures() {
    for (const fixture of PLUGIN_FIXTURES) {
        const report = parseJson(
            run('plugin-lint.mjs', ['--plugin-root', path.join(FIXTURES, fixture.name), ...fixture.args, '--format', 'json']),
            fixture.name,
            fixture.exit,
        );
        assertSet(idsOf(report), fixture.expect, fixture.name);
        expect(report.tool === 'obsidian-plugin-lint', `${fixture.name}: wrong tool name`);
        expect(report.assumptions.length > 0 && report.limitations.length > 0, `${fixture.name}: report must carry assumptions and limitations`);
        for (const finding of report.findings) {
            expect(Boolean(finding.cite && finding.fix && finding.tier && finding.confidence), `${fixture.name}: ${finding.id} is missing a required field`);
        }
        if (fixture.bundle) {
            expect(/^BUNDLE MODE/.test(report.limitations[0]), `${fixture.name}: bundle limitation must come first`);
            expect(report.scanned.sourceFiles === 0, `${fixture.name}: source files must not be scanned in bundle mode`);
            // The limitation has to name what did NOT run, or a reader takes a clean bundle report
            // for a clean review. checkRepository() is skipped, so ODP016/ODP017 never fire here.
            expect(
                /Only the manifest and versions\.json checks ran/.test(report.limitations[0]),
                `${fixture.name}: the bundle limitation must state the checks that did run`,
            );
            for (const skipped of ['ODP016', 'ODP017', 'ODP018', 'ODP019']) {
                expect(report.limitations[0].includes(skipped), `${fixture.name}: the bundle limitation must name ${skipped} as skipped`);
                expect(!idsOf(report).includes(skipped), `${fixture.name}: ${skipped} must not fire in bundle mode`);
            }
        }
        if (fixture.notes) expect(report.notes.length === fixture.notes, `${fixture.name}: expected ${fixture.notes} release notes`);

        if (fixture.name === 'plugin-bad-source') {
            const idFinding = report.findings.find(item => item.id === 'ODP050');
            const nameFinding = report.findings.find(item => item.id === 'ODP056');
            expect(
                idFinding?.tier === 'submission' && /Submission requirements for plugins\.md:48/.test(idFinding.cite),
                'plugin-bad-source: command id must remain the cited submission rule',
            );
            expect(
                nameFinding?.tier === 'convention' && nameFinding.cite === 'api: obsidian.d.ts:4951',
                'plugin-bad-source: command name must be a typings-backed convention',
            );
        }
    }
}

function testThemeFixtures() {
    for (const fixture of THEME_FIXTURES) {
        const report = parseJson(
            run('theme-lint.mjs', ['--theme-root', path.join(FIXTURES, fixture.name), ...fixture.args, '--format', 'json']),
            fixture.name,
            fixture.exit,
        );
        assertSet(idsOf(report), fixture.expect, fixture.name);
        expect(report.assumptions.length > 0 && report.limitations.length > 0, `${fixture.name}: report must carry assumptions and limitations`);
    }
    const aggregate = parseJson(
        run('theme-lint.mjs', ['--theme-root', path.join(FIXTURES, 'theme-bad'), '--format', 'json']),
        'theme-bad aggregate',
        1,
    );
    const important = aggregate.findings.find(item => item.id === 'ODT008');
    expect(
        important?.tier === 'guideline' && important.cite === 'docs: en/Themes/App themes/Theme guidelines.md:43',
        'theme-bad: !important must be a Theme guidelines finding',
    );
    for (const id of ['ODT008', 'ODT009']) {
        const hits = aggregate.findings.filter(item => item.id === id);
        expect(hits.length === 1, `theme-bad: ${id} must be one aggregate finding, got ${hits.length}`);
        expect(/\d+ (?:declaration|selector)\(s\)/.test(hits[0].note ?? ''), `theme-bad: ${id} must carry a count`);
    }
    const remote = aggregate.findings.find(item => item.id === 'ODT007');
    expect(remote === undefined, 'theme-bad: no remote assets are present in this fixture');
    const remoteReport = parseJson(
        run('theme-lint.mjs', ['--theme-root', path.join(FIXTURES, 'theme-remote-assets'), '--format', 'json']),
        'theme-remote-assets carve-out',
        1,
    );
    expect(
        remoteReport.findings.every(item => item.id !== 'ODT007' || /Google Fonts/.test(item.note ?? '')),
        'theme-remote-assets: the finding text must carry the Google Fonts carve-out',
    );
}

/** Aggregated rules report once, with a count, rather than once per occurrence. */
function testAggregation() {
    const report = parseJson(
        run('plugin-lint.mjs', ['--plugin-root', path.join(FIXTURES, 'plugin-bad-source'), '--new', '--format', 'json']),
        'aggregation',
        1,
    );
    for (const id of ['ODP025', 'ODP035', 'ODP039', 'ODP042', 'ODP044', 'ODP049', 'ODP051']) {
        const hits = report.findings.filter(item => item.id === id);
        expect(hits.length === 1, `aggregation: ${id} must be a single aggregate finding, got ${hits.length}`);
        expect(/occurrence\(s\)|call\(s\)|import\(s\)/.test(hits[0].note ?? ''), `aggregation: ${id} must carry a count`);
    }
}

/**
 * The scan scope decides which files every source rule can see, so it is asserted directly rather
 * than through the rules: a tree whose only Node import sits in a test helper must come back clean.
 */
function testSourceScope(temporary) {
    const root = path.join(temporary, 'scoped-plugin');
    fs.mkdirSync(path.join(root, 'src'), { recursive: true });
    fs.mkdirSync(path.join(root, 'tests'), { recursive: true });
    fs.mkdirSync(path.join(root, 'scripts'), { recursive: true });
    fs.mkdirSync(path.join(root, 'resources', 'sample_vaults', 'Demo', '_meta'), { recursive: true });
    fs.writeFileSync(
        path.join(root, 'manifest.json'),
        JSON.stringify({
            id: 'scoped',
            name: 'Scoped',
            version: '1.0.0',
            minAppVersion: '1.0.0',
            description: 'Keeps its tooling out of the bundle.',
            author: 'Fixture',
            isDesktopOnly: false,
        }),
    );
    fs.writeFileSync(path.join(root, 'LICENSE'), 'Fixture licence text.\n');
    fs.writeFileSync(path.join(root, 'README.md'), '# Scoped\n');
    fs.writeFileSync(path.join(root, 'src', 'main.ts'), "import { Plugin } from 'obsidian';\nexport default class S extends Plugin {}\n");
    fs.writeFileSync(path.join(root, 'src', 'View.svelte'), '<script>\nvar legacy = 1;\n</script>\n');
    fs.writeFileSync(path.join(root, 'tests', 'helper.test.ts'), "import fs from 'fs';\nexport const f = fs;\n");
    fs.writeFileSync(path.join(root, 'scripts', 'build-docs.mjs'), "import path from 'path';\nexport const p = path;\n");
    fs.writeFileSync(
        path.join(root, 'resources', 'sample_vaults', 'Demo', '_meta', 'user-script.js'),
        "const fs = require('node:fs');\nconst vault = app.vault;\n",
    );

    const report = parseJson(run('plugin-lint.mjs', ['--plugin-root', root, '--new', '--format', 'json']), 'source scope', 0);
    assertSet(idsOf(report), ['ODP032'], 'source scope');
    expect(report.scanned.sourceFiles === 2, `source scope: expected 2 scanned files, got ${report.scanned.sourceFiles}`);
    expect(report.scanned.scope === 'src+root', 'source scope: a src/ directory narrows the scan');
    expect(
        report.findings[0].file === 'src/View.svelte',
        `source scope: .svelte files must be scanned, got ${report.findings[0].file}`,
    );
    expect(
        report.assumptions.some(item => /Source rules read src\/\*\* plus root-level source files/.test(item)),
        'source scope: the scope must be stated in the assumptions block',
    );
}

function testExitCodeTiers(temporary) {
    const report = parseJson(
        run('plugin-lint.mjs', ['--plugin-root', path.join(FIXTURES, 'plugin-bundle-mode'), '--format', 'json']),
        'published bundle',
        0,
    );
    expect(
        report.findings.every(item => item.tier === 'convention' || item.tier === 'checklist'),
        'published bundle: identity findings must drop to a non-failing tier',
    );
    expect(idsOf(report).includes('ODP006'), 'published bundle: the id rule must still be reported');

    const commandNameOnly = path.join(temporary, 'plugin-command-name-only');
    fs.cpSync(path.join(FIXTURES, 'plugin-good'), commandNameOnly, { recursive: true });
    const cleanSource = fs.readFileSync(path.join(commandNameOnly, 'src', 'main.ts'), 'utf8');
    fs.writeFileSync(
        path.join(commandNameOnly, 'src', 'main.ts'),
        cleanSource.replace("name: 'Show a notice'", "name: 'Clean Example show a notice'"),
    );
    const nameReport = parseJson(
        run('plugin-lint.mjs', ['--plugin-root', commandNameOnly, '--new', '--format', 'json']),
        'command name convention tier',
        0,
    );
    assertSet(idsOf(nameReport), ['ODP056'], 'command name convention tier');

    const commandIdOnly = path.join(temporary, 'plugin-command-id-only');
    fs.cpSync(path.join(FIXTURES, 'plugin-good'), commandIdOnly, { recursive: true });
    fs.writeFileSync(
        path.join(commandIdOnly, 'src', 'main.ts'),
        cleanSource.replace("id: 'show-notice'", "id: 'clean-example-show-notice'"),
    );
    const idReport = parseJson(
        run('plugin-lint.mjs', ['--plugin-root', commandIdOnly, '--new', '--format', 'json']),
        'command id submission tier',
        1,
    );
    assertSet(idsOf(idReport), ['ODP050'], 'command id submission tier');

    const importantOnly = path.join(temporary, 'theme-important-only');
    fs.cpSync(path.join(FIXTURES, 'theme-good'), importantOnly, { recursive: true });
    fs.appendFileSync(path.join(importantOnly, 'theme.css'), '\n.workspace-leaf { color: red !important; }\n');
    const themeReport = parseJson(
        run('theme-lint.mjs', ['--theme-root', importantOnly, '--format', 'json']),
        'theme !important tier',
        1,
    );
    assertSet(idsOf(themeReport), ['ODT008'], 'theme !important tier');
    expect(themeReport.findings[0].tier === 'guideline', 'theme !important tier: guideline finding must drive exit 1');
}

function testSarif() {
    for (const [script, flag, fixture] of [
        ['plugin-lint.mjs', '--plugin-root', 'plugin-bad-source'],
        ['theme-lint.mjs', '--theme-root', 'theme-bad'],
    ]) {
        const report = parseJson(run(script, [flag, path.join(FIXTURES, fixture), '--format', 'sarif']), `${script} sarif`, 1);
        expect(report.version === '2.1.0', `${script}: wrong SARIF version`);
        expect(report.runs[0].results.length > 0, `${script}: SARIF carries no results`);
        expect(report.runs[0].tool.driver.rules.every(rule => rule.properties.citation), `${script}: SARIF rules must carry their citation`);
    }
}

function testUsageErrors(temporary) {
    for (const [script, args] of [
        ['plugin-lint.mjs', []],
        ['theme-lint.mjs', []],
        ['dev-vault.mjs', []],
        ['plugin-lint.mjs', ['--plugin-root', path.join(FIXTURES, 'plugin-good'), '--nonsense']],
        ['theme-lint.mjs', ['--theme-root', path.join(FIXTURES, 'theme-good'), '--nonsense']],
        ['plugin-lint.mjs', ['--plugin-root', path.join(FIXTURES, 'plugin-good'), '--format', 'yaml']],
        ['plugin-lint.mjs', ['--plugin-root', path.join(temporary, 'does-not-exist')]],
        ['plugin-lint.mjs', ['--plugin-root', path.join(FIXTURES, 'plugin-good'), '--new', '--published']],
    ]) {
        const result = run(script, args);
        expect(result.status === 2, `${script} ${args.join(' ')}: expected exit 2, got ${result.status}`);
    }
}

/** Cases the checked-in fixtures deliberately do not carry, built and thrown away here. */
function testRepositoryShapeRules(temporary) {
    const empty = path.join(temporary, 'no-manifest');
    fs.mkdirSync(empty, { recursive: true });
    const missing = parseJson(run('plugin-lint.mjs', ['--plugin-root', empty, '--new', '--format', 'json']), 'no manifest', 1);
    assertSet(idsOf(missing), ['ODP001', 'ODP016', 'ODP017'], 'no manifest');

    const committed = path.join(temporary, 'committed-build');
    fs.mkdirSync(path.join(committed, 'src'), { recursive: true });
    fs.writeFileSync(
        path.join(committed, 'manifest.json'),
        JSON.stringify(
            {
                id: 'committed-build',
                name: 'Committed Build',
                version: '1.0.0',
                minAppVersion: '1.0.0',
                description: 'Commits its build output.',
                author: 'Fixture',
                isDesktopOnly: true,
            },
            null,
            '\t',
        ),
    );
    fs.writeFileSync(path.join(committed, 'main.js'), 'const noop = 1;\n');
    fs.writeFileSync(path.join(committed, 'tsconfig.json'), '{}\n');
    fs.writeFileSync(path.join(committed, 'package.json'), '{"name":"committed-build","version":"1.0.0"}\n');
    fs.writeFileSync(path.join(committed, 'src', 'main.ts'), "export const noop = 1;\n");
    fs.writeFileSync(path.join(committed, 'LICENSE'), 'Fixture licence text.\n');
    fs.writeFileSync(path.join(committed, 'README.md'), '# Committed Build\n');
    const report = parseJson(run('plugin-lint.mjs', ['--plugin-root', committed, '--new', '--format', 'json']), 'committed build', 0);
    assertSet(idsOf(report), ['ODP018', 'ODP019'], 'committed build');
    expect(report.mode === 'new', 'committed build: a tsconfig beside main.js is not bundle mode');
}

function testDevVault(temporary) {
    const plugin = path.join(temporary, 'source-plugin');
    fs.mkdirSync(plugin, { recursive: true });
    fs.writeFileSync(path.join(plugin, 'manifest.json'), JSON.stringify({ id: 'demo-plugin', name: 'Demo', version: '1.0.0' }));

    const unbuilt = run('dev-vault.mjs', [path.join(temporary, 'vault-unbuilt'), '--plugin', plugin]);
    expect(unbuilt.status === 3, `dev-vault unbuilt: expected exit 3, got ${unbuilt.status}`);
    expect(/npm run build \(or keep npm run dev running in another terminal\)/.test(unbuilt.stderr), 'dev-vault unbuilt: the message must name the build command');
    expect(!fs.existsSync(path.join(temporary, 'vault-unbuilt')), 'dev-vault unbuilt: nothing may be created before the build check');

    fs.writeFileSync(path.join(plugin, 'main.js'), 'module.exports = {};\n');
    fs.writeFileSync(path.join(plugin, 'styles.css'), '.demo { color: var(--text-normal); }\n');

    const theme = path.join(temporary, 'source-theme');
    fs.mkdirSync(theme, { recursive: true });
    fs.writeFileSync(path.join(theme, 'manifest.json'), JSON.stringify({ name: 'Demo Slate', version: '1.0.0', minAppVersion: '1.0.0', author: 'Fixture' }));
    fs.writeFileSync(path.join(theme, 'theme.css'), 'body { --radius-m: 0; }\n');

    const snippet = path.join(temporary, 'tweaks.css');
    fs.writeFileSync(snippet, '.markdown-preview-view { --line-height-normal: 1.6; }\n');

    const vault = path.join(temporary, 'vault');
    const created = run('dev-vault.mjs', [vault, '--plugin', plugin, '--theme', theme, '--snippet', snippet, '--config-dir', '.config-dir']);
    expect(created.status === 0, `dev-vault create: exit ${created.status}\n${created.stderr}`);
    expect(/Links are per file|Files were copied/.test(created.stdout), 'dev-vault: the install-mode rationale must be printed');

    for (const relative of [
        '.config-dir/plugins/demo-plugin/main.js',
        '.config-dir/plugins/demo-plugin/manifest.json',
        '.config-dir/plugins/demo-plugin/styles.css',
        '.config-dir/themes/Demo Slate/theme.css',
        '.config-dir/themes/Demo Slate/manifest.json',
        '.config-dir/snippets/tweaks.css',
        '.obsidian-developer-dev-vault.json',
        'Welcome.md',
        'Properties.md',
        'Links.md',
        'Tasks.md',
        'Structure.md',
        'RTL.md',
        'Notes/Subfolder note.md',
        'Notes/attachment.png',
        'Long note.md',
        'Board.canvas',
    ]) {
        expect(fs.existsSync(path.join(vault, relative)), `dev-vault: missing ${relative}`);
    }

    const configFiles = fs.readdirSync(path.join(vault, '.config-dir'));
    expect(
        configFiles.every(entry => fs.statSync(path.join(vault, '.config-dir', entry)).isDirectory()),
        'dev-vault: no configuration JSON may be written into the config folder',
    );

    const welcome = fs.readFileSync(path.join(vault, 'Welcome.md'), 'utf8');
    const quotedVault = process.platform === 'win32'
        ? `'${vault.replaceAll("'", "''")}'`
        : `'${vault.replaceAll("'", "'\"'\"'")}'`;
    const targetedCd = process.platform === 'win32'
        ? `Set-Location -LiteralPath ${quotedVault}`
        : `cd -- ${quotedVault}`;
    for (const fragment of [
        targetedCd,
        'vault info=path',
        'plugins:restrict off',
        "plugin:enable id='demo-plugin'",
        "plugin:reload id='demo-plugin'",
        "theme:set name='Demo Slate'",
        "snippet:enable name='tweaks'",
        'dev:errors',
        '1.12 installer',
        '1.12.7',
        'Command line',
        'first CLI command launches it',
        'RESTART the app',
    ]) {
        expect(welcome.includes(fragment), `dev-vault welcome: missing ${JSON.stringify(fragment)}`);
    }
    expect(
        welcome.indexOf(targetedCd) < welcome.indexOf('obsidian vault info=path') &&
            welcome.indexOf('obsidian vault info=path') < welcome.indexOf('obsidian plugins:restrict off'),
        'dev-vault welcome: vault targeting and the read-only path check must precede Restricted Mode changes',
    );

    const canvas = JSON.parse(fs.readFileSync(path.join(vault, 'Board.canvas'), 'utf8'));
    expect(Array.isArray(canvas.nodes) && Array.isArray(canvas.edges), 'canvas: nodes and edges must be arrays');
    const nodeIds = new Set(canvas.nodes.map(node => node.id));
    for (const node of canvas.nodes) {
        expect(typeof node.id === 'string' && node.id !== '', 'canvas: every node needs an id');
        for (const key of ['x', 'y', 'width', 'height']) {
            expect(typeof node[key] === 'number', `canvas: node ${node.id} needs a numeric ${key}`);
        }
        expect(['file', 'text', 'link', 'group'].includes(node.type), `canvas: node ${node.id} has an unknown type`);
        if (node.type === 'file') expect(typeof node.file === 'string', `canvas: file node ${node.id} needs a file`);
        if (node.type === 'text') expect(typeof node.text === 'string', `canvas: text node ${node.id} needs text`);
        if (node.type === 'link') expect(typeof node.url === 'string', `canvas: link node ${node.id} needs a url`);
        if (node.subpath !== undefined) expect(node.subpath.startsWith('#'), `canvas: subpath on ${node.id} must start with #`);
    }
    for (const edge of canvas.edges) {
        expect(typeof edge.id === 'string', 'canvas: every edge needs an id');
        expect(nodeIds.has(edge.fromNode) && nodeIds.has(edge.toNode), `canvas: edge ${edge.id} names a node that does not exist`);
        for (const side of [edge.fromSide, edge.toSide].filter(Boolean)) {
            expect(['top', 'right', 'bottom', 'left'].includes(side), `canvas: edge ${edge.id} has an unknown side`);
        }
        for (const end of [edge.fromEnd, edge.toEnd].filter(Boolean)) {
            expect(['none', 'arrow'].includes(end), `canvas: edge ${edge.id} has an unknown end`);
        }
    }

    const again = run('dev-vault.mjs', [vault, '--plugin', plugin]);
    expect(again.status === 2, `dev-vault non-empty: expected exit 2, got ${again.status}`);
    expect(/is not empty/.test(again.stderr), 'dev-vault non-empty: the refusal must say why');

    const notAPlugin = path.join(temporary, 'not-a-plugin');
    fs.mkdirSync(notAPlugin, { recursive: true });
    const rejected = run('dev-vault.mjs', [path.join(temporary, 'vault-rejected'), '--plugin', notAPlugin]);
    expect(rejected.status === 2, `dev-vault no manifest: expected exit 2, got ${rejected.status}`);

    const copied = path.join(temporary, 'vault-copy');
    const copyRun = run('dev-vault.mjs', [copied, '--plugin', plugin, '--copy']);
    expect(copyRun.status === 0, `dev-vault --copy: exit ${copyRun.status}\n${copyRun.stderr}`);
    expect(
        !fs.lstatSync(path.join(copied, '.obsidian', 'plugins', 'demo-plugin', 'main.js')).isSymbolicLink(),
        'dev-vault --copy: files must be copies',
    );
    expect(/--refresh/.test(fs.readFileSync(path.join(copied, 'Welcome.md'), 'utf8')), 'dev-vault --copy: Welcome must print a refresh command');
    const preserved = '# User-owned fixture\n';
    fs.writeFileSync(path.join(copied, 'Properties.md'), preserved);
    fs.writeFileSync(path.join(plugin, 'main.js'), 'module.exports = { refreshed: true };\n');
    const refreshed = run('dev-vault.mjs', [copied, '--plugin', plugin, '--copy', '--refresh']);
    expect(refreshed.status === 0, `dev-vault --refresh: exit ${refreshed.status}\n${refreshed.stderr}`);
    expect(/Refreshed a development vault/.test(refreshed.stdout), 'dev-vault --refresh: output must identify refresh mode');
    expect(
        /refreshed: true/.test(fs.readFileSync(path.join(copied, '.obsidian', 'plugins', 'demo-plugin', 'main.js'), 'utf8')),
        'dev-vault --refresh: copied build must be updated',
    );
    expect(fs.readFileSync(path.join(copied, 'Properties.md'), 'utf8') === preserved, 'dev-vault --refresh: ordinary notes must not be reseeded');

    const installedPlugin = path.join(copied, '.obsidian', 'plugins', 'demo-plugin');
    const installedBefore = fs.readFileSync(path.join(installedPlugin, 'main.js'), 'utf8');
    const selfRefresh = run('dev-vault.mjs', [copied, '--plugin', installedPlugin, '--copy', '--refresh']);
    expect(selfRefresh.status === 2, `dev-vault self-refresh: expected exit 2, got ${selfRefresh.status}`);
    expect(/source and destination are the same file/.test(selfRefresh.stderr), 'dev-vault self-refresh: refusal must explain the alias');
    expect(
        fs.readFileSync(path.join(installedPlugin, 'main.js'), 'utf8') === installedBefore,
        'dev-vault self-refresh: installed build must not be deleted',
    );

    const arbitrary = path.join(temporary, 'not-a-dev-vault');
    fs.mkdirSync(arbitrary);
    fs.writeFileSync(path.join(arbitrary, 'keep.md'), 'keep\n');
    const unsafeRefresh = run('dev-vault.mjs', [arbitrary, '--plugin', plugin, '--copy', '--refresh']);
    expect(unsafeRefresh.status === 2, `dev-vault unmarked refresh: expected exit 2, got ${unsafeRefresh.status}`);
    expect(/not marked as a vault created by this tool/.test(unsafeRefresh.stderr), 'dev-vault unmarked refresh: refusal must name the missing marker');
    expect(fs.readFileSync(path.join(arbitrary, 'keep.md'), 'utf8') === 'keep\n', 'dev-vault unmarked refresh: existing content must be untouched');

    const shellPlugin = path.join(temporary, 'shell-plugin');
    fs.mkdirSync(shellPlugin);
    fs.writeFileSync(
        path.join(shellPlugin, 'manifest.json'),
        JSON.stringify({ id: 'demo$(touch pwned)', name: 'Demo', version: '1.0.0' }),
    );
    fs.writeFileSync(path.join(shellPlugin, 'main.js'), 'module.exports = {};\n');
    const shellVault = path.join(temporary, 'vault-shell-safe');
    const shellRun = run('dev-vault.mjs', [shellVault, '--plugin', shellPlugin, '--copy']);
    expect(shellRun.status === 0, `dev-vault shell quoting: exit ${shellRun.status}\n${shellRun.stderr}`);
    const shellWelcome = fs.readFileSync(path.join(shellVault, 'Welcome.md'), 'utf8');
    expect(
        shellWelcome.includes("id='demo$(touch pwned)'"),
        'dev-vault shell quoting: command substitutions from a manifest must be inside shell quotes',
    );
    expect(
        !shellWelcome.includes('id=demo$(touch pwned)'),
        'dev-vault shell quoting: an unquoted command substitution must never be emitted',
    );
    if (process.platform !== 'win32') {
        const linked = path.join(temporary, 'vault-link');
        run('dev-vault.mjs', [linked, '--plugin', plugin, '--link']);
        expect(
            fs.lstatSync(path.join(linked, '.obsidian', 'plugins', 'demo-plugin', 'main.js')).isSymbolicLink(),
            'dev-vault --link: files must be per-file symlinks',
        );
        expect(
            !fs.lstatSync(path.join(linked, '.obsidian', 'plugins', 'demo-plugin')).isSymbolicLink(),
            'dev-vault --link: the plugin directory itself must be real',
        );
    }
}

/**
 * A manifest is untrusted input. An `id` or `name` carrying `..` would place a write outside the
 * vault the tool promises to stay inside, so the refusal is asserted together with the file set of
 * the whole scratch tree before and after: the proof is that nothing anywhere changed.
 */
function testDevVaultTraversal(temporary) {
    const sandbox = path.join(temporary, 'traversal');
    fs.mkdirSync(sandbox, { recursive: true });

    const listTree = directory => {
        const found = [];
        const visit = current => {
            for (const entry of fs.readdirSync(current, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
                const absolute = path.join(current, entry.name);
                found.push(path.relative(sandbox, absolute));
                if (entry.isDirectory() && !entry.isSymbolicLink()) visit(absolute);
            }
        };
        visit(directory);
        return found.sort();
    };

    const cases = [
        ['evil-plugin', { id: '../../../../escaped-plugin', name: 'Evil', version: '1.0.0' }, 'main.js', '--plugin'],
        ['evil-theme', { name: '../../../../escaped-theme', version: '1.0.0', minAppVersion: '1.0.0', author: 'Fixture' }, 'theme.css', '--theme'],
        ['abs-plugin', { id: '/tmp/absolute-escape', name: 'Abs', version: '1.0.0' }, 'main.js', '--plugin'],
        ['dot-plugin', { id: '..', name: 'Dot', version: '1.0.0' }, 'main.js', '--plugin'],
        ['newline-plugin', { id: 'evil\nplugin', name: 'Newline', version: '1.0.0' }, 'main.js', '--plugin'],
    ];
    for (const [directory, manifest, artifact] of cases) {
        const source = path.join(sandbox, directory);
        fs.mkdirSync(source, { recursive: true });
        fs.writeFileSync(path.join(source, 'manifest.json'), JSON.stringify(manifest));
        fs.writeFileSync(path.join(source, artifact), artifact.endsWith('.css') ? 'body { color: red; }\n' : 'module.exports = {};\n');
    }

    const before = listTree(sandbox);
    for (const [directory, , , flag] of cases) {
        const result = run('dev-vault.mjs', [path.join(sandbox, `vault-${directory}`), flag, path.join(sandbox, directory)]);
        expect(result.status === 2, `dev-vault traversal ${directory}: expected exit 2, got ${result.status}`);
        expect(
            /is not a single directory name; refusing to install outside the vault/.test(result.stderr),
            `dev-vault traversal ${directory}: the refusal must say why — got ${JSON.stringify(result.stderr)}`,
        );
        expect(!fs.existsSync(path.join(sandbox, `vault-${directory}`)), `dev-vault traversal ${directory}: no vault may be created`);
    }
    const after = listTree(sandbox);
    expect(
        before.length === after.length && before.every((entry, index) => entry === after[index]),
        `dev-vault traversal: the file set changed — added [${after.filter(entry => !before.includes(entry)).join(', ')}]`,
    );
    expect(!fs.existsSync(path.join(temporary, 'escaped-plugin')), 'dev-vault traversal: nothing may be written outside the vault');
    expect(!fs.existsSync(path.join(temporary, 'escaped-theme')), 'dev-vault traversal: nothing may be written outside the vault');
}

function testSamplePlugin(root) {
    if (!root) return 'skipped';
    const report = parseJson(run('plugin-lint.mjs', ['--plugin-root', root, '--new', '--format', 'json']), 'sample plugin snapshot', 1);
    assertSet(idsOf(report), SAMPLE_PLUGIN_EXPECTED, 'sample plugin snapshot');
    const manifest = JSON.parse(fs.readFileSync(path.join(root, 'manifest.json'), 'utf8'));
    expect(manifest.id.endsWith('plugin'), 'sample plugin: the id really does end with "plugin"');
    expect(/\bPlugin\b/.test(manifest.name), 'sample plugin: the name really does contain "Plugin"');
    const leftovers = report.findings.find(item => item.id === 'ODP051');
    expect(/MyPlugin/.test(leftovers.note ?? ''), 'sample plugin: the leftover finding must name the placeholder classes');
    // In published intake the two identity findings drop to a non-failing tier; the leftover
    // sample code stays a gate, so the run still exits 1.
    const published = parseJson(run('plugin-lint.mjs', ['--plugin-root', root, '--format', 'json']), 'sample plugin published', 1);
    assertSet(idsOf(published), SAMPLE_PLUGIN_EXPECTED, 'sample plugin published');
    const submission = published.findings.filter(item => item.tier === 'submission');
    expect(
        submission.length === 1 && submission[0].id === 'ODP051',
        'sample plugin published: only the sample-code finding stays a submission gate',
    );
    expect(
        published.findings.filter(item => ['ODP006', 'ODP007'].includes(item.id)).every(item => item.tier === 'convention' && /do not change it|delists/.test(item.note ?? '')),
        'sample plugin published: identity findings must carry the counter-warning',
    );
    return 'ok';
}

function testSampleTheme(root) {
    if (!root) return 'skipped';
    const report = parseJson(run('theme-lint.mjs', ['--theme-root', root, '--format', 'json']), 'sample theme snapshot', 1);
    assertSet(idsOf(report), SAMPLE_THEME_EXPECTED, 'sample theme snapshot');
    expect(!fs.existsSync(path.join(root, 'LICENSE')), 'sample theme: the LICENSE really is absent');
    return 'ok';
}

function main() {
    let args;
    try {
        args = parseArgs(process.argv.slice(2), {
            booleans: ['help'],
            values: ['sample-plugin-root', 'sample-theme-root'],
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
    const samplePlugin = args['sample-plugin-root'] ? path.resolve(args['sample-plugin-root']) : null;
    const sampleTheme = args['sample-theme-root'] ? path.resolve(args['sample-theme-root']) : null;
    for (const [label, root, sentinel] of [
        ['--sample-plugin-root', samplePlugin, 'manifest.json'],
        ['--sample-theme-root', sampleTheme, 'manifest.json'],
    ]) {
        if (root && !fs.existsSync(path.join(root, sentinel))) {
            process.stderr.write(`error: ${label} ${root} is not hydrated\n${USAGE}\n`);
            process.exitCode = 3;
            return;
        }
    }

    const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'obsidian-developer-test-'));
    let failed = 0;
    let skipped = 0;
    let passed = 0;
    try {
        const tests = [
            ['plugin fixtures', () => testPluginFixtures()],
            ['theme fixtures', () => testThemeFixtures()],
            ['aggregated rules', () => testAggregation()],
            ['source scan scope', () => testSourceScope(temporary)],
            ['tier-driven exit codes', () => testExitCodeTiers(temporary)],
            ['SARIF reports', () => testSarif()],
            ['repository-shape rules', () => testRepositoryShapeRules(temporary)],
            ['usage errors', () => testUsageErrors(temporary)],
            ['dev vault', () => testDevVault(temporary)],
            ['dev vault path traversal', () => testDevVaultTraversal(temporary)],
            ['sample plugin snapshot', () => testSamplePlugin(samplePlugin)],
            ['sample theme snapshot', () => testSampleTheme(sampleTheme)],
        ];
        for (const [name, test] of tests) {
            try {
                const result = test();
                if (result === 'skipped') {
                    skipped += 1;
                    process.stdout.write(`SKIP ${name} (pass --sample-plugin-root and --sample-theme-root to run the real-tree snapshots)\n`);
                } else {
                    passed += 1;
                    process.stdout.write(`PASS ${name}\n`);
                }
            } catch (error) {
                failed += 1;
                process.stdout.write(`FAIL ${name}: ${error.message}\n`);
            }
        }
        process.stdout.write(
            `obsidian-developer tool tests: ${passed}/${tests.length} passed${skipped ? `, ${skipped} skipped` : ''}${failed ? `, ${failed} failed` : ''}\n`,
        );
    } finally {
        fs.rmSync(temporary, { recursive: true, force: true });
    }
    if (failed) process.exitCode = 1;
}

main();
