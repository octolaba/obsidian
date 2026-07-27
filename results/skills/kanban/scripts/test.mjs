#!/usr/bin/env node
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

import { classifyDrift, parseBoard, serializeBoard } from './board.mjs';
import { CONSEQUENCES, EXIT, parseArgs, severityFor, writeUsageError } from './lib.mjs';
import { RULES } from './kanban-board-lint.mjs';

const SCRIPT_ROOT = path.dirname(fileURLToPath(import.meta.url));
const SKILL_ROOT = path.dirname(SCRIPT_ROOT);
const FIXTURE_VAULT = path.join(SCRIPT_ROOT, 'fixtures', 'vault');
const PLAN = path.join(SCRIPT_ROOT, 'fixtures', 'plans', 'example.json');

/**
 * Expected finding sets, as data.
 *
 * They are exact: a rule that stops firing, and a rule that starts firing where it should not, both
 * fail here. `Clean.md` is the load-bearing one — it is byte-for-byte what the ported serialiser
 * emits, so any finding on it is a false positive by construction.
 */
const BOARD_EXPECTATIONS = [
    { board: 'Clean.md', locale: 'en', expect: [] },
    { board: 'Legacy.md', locale: 'en', expect: ['KB009'] },
    { board: 'Broken.md', locale: 'en', expect: ['KB001'] },
    { board: 'Lossy.md', locale: 'en', expect: ['KB011', 'KB012', 'KB013', 'KB018', 'KB019', 'KB020'] },
    { board: 'Localised.md', locale: 'en', expect: ['KB011', 'KB025'] },
    { board: 'Localised.md', locale: 'ru', expect: ['KB031'] },
    { board: 'Settings.md', locale: 'en', expect: ['KB005', 'KB029'] },
];

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

function assertSet(actual, expected, label) {
    const missing = expected.filter(id => !actual.includes(id));
    const unexpected = actual.filter(id => !expected.includes(id));
    expect(
        missing.length === 0 && unexpected.length === 0,
        `${label}: missing [${missing.join(', ')}], unexpected [${unexpected.join(', ')}]`,
    );
}

function temporaryVault() {
    const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'obsidian-kanban-test-'));
    fs.cpSync(FIXTURE_VAULT, directory, { recursive: true });
    return directory;
}

// --- tests -----------------------------------------------------------------------------------------

function testBoardFixtures() {
    for (const scenario of BOARD_EXPECTATIONS) {
        const result = run('kanban-board-lint.mjs', [
            '--vault',
            FIXTURE_VAULT,
            '--file',
            scenario.board,
            '--locale',
            scenario.locale,
            '--format',
            'json',
        ]);
        const label = `${scenario.board} (${scenario.locale})`;
        // An info-only board is clean: the exit code follows the same derivation the severities do.
        const failing = scenario.expect.some(id => severityFor(RULES[id].consequence) !== 'info');
        const report = parseJson(result, label, failing ? EXIT.findings : EXIT.clean);
        assertSet([...new Set(report.findings.map(item => item.id))].sort(), [...scenario.expect].sort(), label);
        expect(report.assumptions.length > 0, `${label}: no assumptions`);
        expect(report.limitations.length > 0, `${label}: no limitations`);
        for (const finding of report.findings) {
            expect(Boolean(finding.cite), `${label}: ${finding.id} has no citation`);
            expect(Boolean(finding.fix), `${label}: ${finding.id} has no fix`);
            expect(finding.severity === severityFor(finding.consequence), `${label}: ${finding.id} severity is not derived`);
        }
    }
}

/** An `info`-only board must not fail a run, or every legacy board becomes a blocker. */
function testInfoDoesNotFail() {
    const result = run('kanban-board-lint.mjs', ['--vault', FIXTURE_VAULT, '--file', 'Legacy.md', '--format', 'json']);
    const report = parseJson(result, 'Legacy severity', EXIT.clean);
    expect(report.summary.bySeverity.info === 1, 'Legacy.md should carry exactly one info finding');
    expect(report.summary.failing === 0, 'an info finding must not be counted as failing');
    expect(result.status === EXIT.clean, 'an info-only run must exit clean');
}

function testSarif() {
    const result = run('kanban-board-lint.mjs', ['--vault', FIXTURE_VAULT, '--format', 'sarif']);
    const sarif = parseJson(result, 'sarif', EXIT.findings);
    expect(sarif.version === '2.1.0', 'sarif version');
    expect(sarif.runs[0].results.length > 0, 'sarif results are empty');
    for (const rule of sarif.runs[0].tool.driver.rules) {
        expect(Boolean(rule.properties.citation), `sarif rule ${rule.id} carries no citation`);
    }
    expect(sarif.runs[0].invocations[0].toolExecutionNotifications.length > 0, 'sarif carries no limitations');
}

function testRoundTrip() {
    const clean = fs.readFileSync(path.join(FIXTURE_VAULT, 'Clean.md'), 'utf8');
    expect(serializeBoard(parseBoard(clean)) === clean, 'the clean fixture is not a fixed point of the port');
    expect(classifyDrift(clean, serializeBoard(parseBoard(clean))) === 'none', 'drift on a fixed point');

    // Parsing what the serialiser wrote must give the same model back.
    const twice = serializeBoard(parseBoard(serializeBoard(parseBoard(clean))));
    expect(twice === clean, 'the port is not idempotent');
}

/**
 * Constructs that decide where a card ends.
 *
 * Each of these was chosen because getting it wrong silently moves the boundary of a card, and a
 * boundary that moves is content that a write deletes.
 */
function testParserEdgeCases() {
    const settings = '\n\n%% kanban:settings\n```\n{"kanban-plugin":"board"}\n```\n%%';
    const frontmatter = '---\n\nkanban-plugin: board\n\n---\n\n';
    const cases = [
        {
            name: 'a fenced block inside a card keeps its lines in the card',
            board: `${frontmatter}## A\n\n- [ ] card\n\t\`\`\`\n\t## not a lane\n\t\`\`\`\n- [ ] second\n${settings}`,
            check: board => {
                expect(board.lanes.length === 1, 'a fenced heading inside a card became a lane');
                expect(board.lanes[0].cards.length === 2, 'the card count is wrong');
                expect(board.lanes[0].cards[0].titleRaw.includes('## not a lane'), 'the fenced body was lost');
            },
        },
        {
            name: 'a four-backtick code span at the start of a line is not a fence',
            board: `${frontmatter}## A\n\n- [ ] card\n\t\`\`\`\`a \`\`\` b\`\`\`\`\n- [ ] second\n${settings}`,
            check: board => expect(board.lanes[0].cards.length === 2, 'a code span was read as a fence'),
        },
        {
            name: 'a heading at column zero ends the list rather than continuing a card',
            board: `${frontmatter}## A\n\n- [ ] card\n## B\n\n- [ ] other\n${settings}`,
            check: board => {
                expect(board.lanes.length === 2, `expected two lanes, got ${board.lanes.length}`);
                expect(!board.lanes[0].cards[0].titleRaw.includes('## B'), 'a heading was swallowed into a card');
            },
        },
        {
            name: 'a thematic break at column zero ends the list',
            board: `${frontmatter}## A\n\n- [ ] card\n***\n\n## Archive\n\n- [x] old\n${settings}`,
            check: board => {
                expect(board.archive.length === 1, 'the archive was not recognised');
                expect(!board.lanes[0].cards[0].titleRaw.includes('***'), 'the separator was swallowed into a card');
            },
        },
    ];
    for (const scenario of cases) {
        const board = parseBoard(scenario.board);
        expect(board.errors.length === 0, `${scenario.name}: the board did not parse`);
        try {
            scenario.check(board);
        } catch (error) {
            throw new Error(`${scenario.name}: ${error.message}`);
        }
    }
}

function testCardOperations() {
    const vault = temporaryVault();
    try {
        const board = 'Clean.md';
        const before = fs.readFileSync(path.join(vault, board), 'utf8');

        // Moving into the complete lane marks the card and, with the flag, stamps the Tasks date.
        const move = run('kanban-card.mjs', [
            'move', '--vault', vault, '--board', board,
            '--lane', 'Backlog', '--index', '0', '--to-lane', 'Done',
            '--tasks-emoji', '--now', '2026-08-03', '--settle-seconds', '0', '--write',
            '--format', 'json',
        ]);
        const moved = parseJson(move, 'move', EXIT.clean);
        expect(moved.written === true, 'move did not write');
        expect(moved.backups.length === 1, 'move kept no backup');
        const afterMove = fs.readFileSync(path.join(vault, board), 'utf8');
        expect(afterMove.includes('- [x] Write the proposal ✅ 2026-08-03'), `completion not written:\n${afterMove}`);
        expect(fs.readFileSync(moved.backups[0], 'utf8') === before, 'the backup is not the previous contents');

        // Moving back out un-completes it and removes the imitated date.
        run('kanban-card.mjs', [
            'move', '--vault', vault, '--board', board,
            '--lane', 'Done', '--index', '0', '--to-lane', 'Backlog',
            '--tasks-emoji', '--settle-seconds', '0', '--write',
        ]);
        const afterBack = fs.readFileSync(path.join(vault, board), 'utf8');
        expect(afterBack.includes('- [ ] Write the proposal'), `un-completion not written:\n${afterBack}`);
        expect(!afterBack.includes('✅'), 'the completion date was not removed');

        // The menu path does not run the complete mechanic at all.
        run('kanban-card.mjs', [
            'move', '--vault', vault, '--board', board,
            '--lane', 'Backlog', '--index', '0', '--to-lane', 'Done',
            '--via', 'menu', '--settle-seconds', '0', '--write',
        ]);
        const afterMenu = fs.readFileSync(path.join(vault, board), 'utf8');
        expect(afterMenu.includes('- [ ] Write the proposal'), `the menu path must not complete the card:\n${afterMenu}`);

        // Adding to a complete lane sets the character and writes no date.
        run('kanban-card.mjs', [
            'add', '--vault', vault, '--board', board, '--lane', 'Done',
            '--text', 'Added here', '--settle-seconds', '0', '--write',
        ]);
        const afterAdd = fs.readFileSync(path.join(vault, board), 'utf8');
        expect(afterAdd.includes('- [x] Added here'), 'a card added to a complete lane must be checked');
        expect(!/Added here ✅/.test(afterAdd), 'the add path must not stamp a completion date');

        // The board still parses, and the linter still finds nothing but drift.
        const lint = run('kanban-board-lint.mjs', ['--vault', vault, '--file', board, '--format', 'json']);
        const report = parseJson(lint, 'post-edit lint');
        const ids = [...new Set(report.findings.map(item => item.id))];
        expect(
            ids.every(id => RULES[id].consequence === 'bytes-change-on-save' || RULES[id].consequence === 'informational'),
            `editing introduced a real finding: ${ids.join(', ')}`,
        );
    } finally {
        fs.rmSync(vault, { recursive: true, force: true });
    }
}

function testArchiveMechanics() {
    const vault = temporaryVault();
    try {
        const board = 'Clean.md';
        run('kanban-card.mjs', [
            'archive', '--vault', vault, '--board', board, '--lane', 'Backlog', '--index', '0',
            '--now', '2026-08-03 09:15', '--settle-seconds', '0', '--write',
        ]);
        const text = fs.readFileSync(path.join(vault, board), 'utf8');
        expect(text.includes('***'), 'the archive separator was not written');
        expect(text.includes('## Archive'), 'the archive heading was not written');
        expect(text.includes('- [ ] Write the proposal'), 'the archived card is missing');
        // The fixture does not enable archive-with-date, so no timestamp must appear.
        expect(!text.includes('2026-08-03 09:15'), 'a timestamp was written although the board does not ask for one');
        const parsed = parseBoard(text);
        expect(parsed.archive.length === 1, `the archive did not round-trip: ${JSON.stringify(parsed.archive)}`);
    } finally {
        fs.rmSync(vault, { recursive: true, force: true });
    }
}

/**
 * The settle check has to notice a board that something else rewrote after the write.
 *
 * A concurrent writer is started first and fires while the tool is inside its settle window, which is
 * exactly the shape of the loss this whole protocol exists to catch: an open Obsidian board saving
 * from memory seconds after an external edit.
 */
function testSettleDetectsClobber() {
    const vault = temporaryVault();
    try {
        const board = path.join(vault, 'Clean.md');
        const original = fs.readFileSync(board, 'utf8');
        const source = path.join(vault, 'clobber.txt');
        fs.writeFileSync(source, original);
        const clobber = path.join(vault, 'clobber.sh');
        fs.writeFileSync(clobber, `#!/bin/sh\nsleep 1\ncp "${source}" "${board}"\n`);
        fs.chmodSync(clobber, 0o755);
        const writer = spawnSync('sh', ['-c', `"${clobber}" >/dev/null 2>&1 &`], { encoding: 'utf8' });
        expect(writer.status === 0, 'could not start the concurrent writer');

        const result = run('kanban-card.mjs', [
            'add', '--vault', vault, '--board', 'Clean.md', '--lane', 'Backlog', '--text', 'racing',
            '--settle-seconds', '3', '--write',
        ]);
        expect(
            result.status === EXIT.refused,
            `a board rewritten during the settle window must be reported: exit ${result.status}\n${result.stdout}\n${result.stderr}`,
        );
        expect(/rewritten/.test(result.stderr), `the loss was not explained: ${result.stderr}`);
        expect(fs.existsSync(`${board}.bak`), 'no backup was left behind after a lost write');
    } finally {
        fs.rmSync(vault, { recursive: true, force: true });
    }
}

/** A normal write still succeeds, and leaves the file exactly as the tool reported it. */
function testWriteRoundTrip() {
    const vault = temporaryVault();
    try {
        const board = path.join(vault, 'Clean.md');
        const result = run('kanban-card.mjs', [
            'add', '--vault', vault, '--board', 'Clean.md', '--lane', 'Backlog', '--text', 'plain',
            '--settle-seconds', '0', '--write', '--format', 'json',
        ]);
        const report = parseJson(result, 'write', EXIT.clean);
        expect(report.written === true, 'the write was not reported');
        expect(fs.readFileSync(board, 'utf8').includes('- [ ] plain'), 'the card is not in the file');
        expect(parseBoard(fs.readFileSync(board, 'utf8')).errors.length === 0, 'the written board does not parse');
    } finally {
        fs.rmSync(vault, { recursive: true, force: true });
    }
}

function testRefusals() {
    const cases = [
        {
            label: 'unparseable board',
            args: ['add', '--vault', FIXTURE_VAULT, '--board', 'Broken.md', '--lane', 'A', '--text', 'x'],
        },
        {
            label: 'missing lane',
            args: ['add', '--vault', FIXTURE_VAULT, '--board', 'Clean.md', '--lane', 'Nope', '--text', 'x'],
        },
        {
            label: 'index out of range',
            args: ['move', '--vault', FIXTURE_VAULT, '--board', 'Clean.md', '--lane', 'Backlog', '--index', '99', '--to-lane', 'Done'],
        },
    ];
    for (const scenario of cases) {
        const result = run('kanban-card.mjs', scenario.args);
        expect(result.status === EXIT.refused, `${scenario.label}: exit ${result.status}, expected ${EXIT.refused}`);
        expect(/^refused: /.test(result.stderr), `${scenario.label}: refusal not reported on stderr`);
    }

    // A recurring card is two cards; the tool must not pretend otherwise.
    const vault = temporaryVault();
    try {
        const board = path.join(vault, 'Recurring.md');
        fs.writeFileSync(
            board,
            fs
                .readFileSync(path.join(vault, 'Clean.md'), 'utf8')
                .replace('- [ ] Write the proposal', '- [ ] Write the proposal 🔁 every week'),
        );
        const refused = run('kanban-card.mjs', [
            'complete', '--vault', vault, '--board', 'Recurring.md', '--lane', 'Backlog', '--index', '0',
            '--tasks-emoji',
        ]);
        expect(refused.status === EXIT.refused, `recurrence: exit ${refused.status}`);
        const allowed = run('kanban-card.mjs', [
            'complete', '--vault', vault, '--board', 'Recurring.md', '--lane', 'Backlog', '--index', '0',
            '--tasks-emoji', '--allow-recurrence', '--format', 'json',
        ]);
        const report = parseJson(allowed, 'recurrence allowed', EXIT.clean);
        expect(
            report.effects.some(effect => effect.includes('recurrence')),
            'the recurrence caveat is not reported when the guard is waived',
        );
    } finally {
        fs.rmSync(vault, { recursive: true, force: true });
    }
}

/**
 * A frontmatter this port cannot fully read must stop anything that re-serialises it.
 *
 * The minimal splice is still safe — it never touches the frontmatter — so the guard has to be on
 * the two paths that rewrite the whole file, not on the tool.
 */
function testRichFrontmatterIsRefused() {
    const vault = temporaryVault();
    try {
        const board = path.join(vault, 'Rich.md');
        fs.writeFileSync(
            board,
            fs
                .readFileSync(path.join(vault, 'Clean.md'), 'utf8')
                .replace('kanban-plugin: board\n', 'kanban-plugin: board\ntags:\n  - project\n  - active\n'),
        );

        const parsed = parseBoard(fs.readFileSync(board, 'utf8'));
        expect(
            parsed.uncertainties.some(item => item.kind === 'yaml-not-modelled'),
            'a block frontmatter value was read as if it were a scalar',
        );

        const normalise = run('kanban-card.mjs', [
            'add', '--vault', vault, '--board', 'Rich.md', '--lane', 'Backlog', '--text', 'x',
            '--strategy', 'normalize',
        ]);
        expect(normalise.status === EXIT.refused, `normalize must refuse: exit ${normalise.status}`);

        const plan = path.join(vault, 'noop.json');
        fs.writeFileSync(plan, JSON.stringify({ format: 'board' }));
        const migrate = run('kanban-migrate.mjs', ['--plan', plan, '--vault', vault, '--board', 'Rich.md', '--format', 'json']);
        const report = parseJson(migrate, 'migrate rich frontmatter');
        expect(report.skipped.length === 1, 'the migration did not skip the board');

        // The minimal splice is safe and must still work, leaving the frontmatter untouched.
        const spliced = run('kanban-card.mjs', [
            'add', '--vault', vault, '--board', 'Rich.md', '--lane', 'Backlog', '--text', 'x',
            '--settle-seconds', '0', '--write',
        ]);
        expect(spliced.status === EXIT.clean, `the minimal splice failed: ${spliced.stderr}`);
        const after = fs.readFileSync(board, 'utf8');
        expect(after.includes('tags:\n  - project\n  - active'), `the frontmatter was damaged:\n${after}`);
        expect(after.includes('- [ ] x'), 'the card was not added');
    } finally {
        fs.rmSync(vault, { recursive: true, force: true });
    }
}

const SETTINGS_BLOCK = '\n\n%% kanban:settings\n```\n{"kanban-plugin":"board"}\n```\n%%';
const FRONTMATTER = '---\n\nkanban-plugin: board\n\n---\n\n';

/**
 * Every case here was a real defect found by attacking the tools, and every one of them either lost
 * a user's content or reported a lie. They are grouped so that a regression is obvious.
 */
function testAdversarialRegressions() {
    const vault = temporaryVault();
    const write = (name, text) => {
        const file = path.join(vault, name);
        fs.writeFileSync(file, text);
        return file;
    };
    try {
        // The archive used to be spliced wherever the marker text first appeared, which put it in the
        // middle of a card that merely mentioned it.
        write(
            'Mention.md',
            `${FRONTMATTER}## A\n\n- [ ] card\n\t%% kanban:settings is mentioned here\n\n## B\n\n- [ ] move me\n- [ ] stay\n\n\n\n${SETTINGS_BLOCK}`,
        );
        run('kanban-card.mjs', [
            'archive', '--vault', vault, '--board', 'Mention.md', '--lane', 'B', '--index', '0',
            '--settle-seconds', '0', '--write',
        ]);
        const mentioned = fs.readFileSync(path.join(vault, 'Mention.md'), 'utf8');
        expect(
            mentioned.indexOf('***') > mentioned.indexOf('- [ ] stay'),
            `the archive was spliced above the lanes:\n${mentioned}`,
        );
        expect(
            mentioned.includes('- [ ] card\n\t%% kanban:settings is mentioned here'),
            'a card that mentions the settings marker was broken apart',
        );

        // Bytes that do not survive a decode would be replaced on write, and in the backup too.
        const latin1 = path.join(vault, 'Latin1.md');
        fs.writeFileSync(
            latin1,
            Buffer.concat([
                Buffer.from(`${FRONTMATTER}## Notes\n\n- [ ] caf`, 'utf8'),
                Buffer.from([0xe9]),
                Buffer.from(`\n- [ ] plain\n\n\n\n${SETTINGS_BLOCK}`, 'utf8'),
            ]),
        );
        const lossy = run('kanban-card.mjs', [
            'complete', '--vault', vault, '--board', 'Latin1.md', '--lane', 'Notes', '--index', '1',
            '--settle-seconds', '0', '--write',
        ]);
        expect(lossy.status === EXIT.refused, `a non-UTF-8 board must be refused: exit ${lossy.status}`);
        expect(fs.readFileSync(latin1)[fs.readFileSync(latin1).length - 1] !== undefined, 'file vanished');
        expect(fs.readFileSync(latin1).includes(0xe9), 'the original byte was destroyed');

        // No single join reproduces a file that mixes CRLF and LF.
        write('Mixed.md', `${FRONTMATTER}## A\n\n- [ ] one\n- [ ] two\r\n\n\n\n${SETTINGS_BLOCK}`);
        const mixed = run('kanban-card.mjs', [
            'complete', '--vault', vault, '--board', 'Mixed.md', '--lane', 'A', '--index', '0',
            '--settle-seconds', '0', '--write',
        ]);
        expect(mixed.status === EXIT.refused, `mixed line endings must be refused: exit ${mixed.status}`);

        // A link inside the vault must not carry a write out of it.
        const outside = fs.mkdtempSync(path.join(os.tmpdir(), 'obsidian-kanban-outside-'));
        try {
            fs.writeFileSync(path.join(outside, 'Out.md'), `${FRONTMATTER}## A\n\n- [ ] a\n\n\n\n${SETTINGS_BLOCK}`);
            fs.symlinkSync(outside, path.join(vault, 'link'));
            const escaped = run('kanban-card.mjs', [
                'edit', '--vault', vault, '--board', 'link/Out.md', '--lane', 'A', '--index', '0',
                '--text', 'escaped', '--settle-seconds', '0', '--write',
            ]);
            expect(escaped.status === EXIT.usage, `a symlinked escape must be refused: exit ${escaped.status}`);
            expect(
                !fs.readFileSync(path.join(outside, 'Out.md'), 'utf8').includes('escaped'),
                'a file outside the vault was written',
            );
        } finally {
            fs.rmSync(path.join(vault, 'link'), { force: true });
            fs.rmSync(outside, { recursive: true, force: true });
        }

        // A nested list belongs to its parent card; treating it as siblings shifted every index.
        const nested = parseBoard(
            `${FRONTMATTER}## Backlog\n\n- [ ] parent\n  - [ ] child\n- [ ] sibling\n\n\n\n${SETTINGS_BLOCK}`,
        );
        expect(nested.lanes[0].cards.length === 2, `a nested list was flattened: ${nested.lanes[0].cards.length} cards`);
        expect(nested.lanes[0].cards[0].titleRaw.includes('child'), 'the nested item left its parent card');

        // A checkbox followed by only a space is an empty card, not a card whose text is the box.
        const trailing = parseBoard(`${FRONTMATTER}## A\n\n- [ ] \n- [ ] real\n\n\n\n${SETTINGS_BLOCK}`);
        expect(trailing.lanes[0].cards[0].titleRaw === '', `the empty-task guard missed: ${JSON.stringify(trailing.lanes[0].cards[0].titleRaw)}`);

        // A settings payload that is not an object used to throw and abort a whole vault scan.
        write('Scalar.md', `${FRONTMATTER}## A\n\n- [ ] a\n\n\n\n\n\n%% kanban:settings\n\`\`\`\n"hello"\n\`\`\`\n%%`);
        const scan = run('kanban-board-lint.mjs', ['--vault', vault, '--format', 'json']);
        expect(scan.status !== EXIT.usage, `a malformed settings payload aborted the scan: ${scan.stderr}`);
        parseJson(scan, 'scan with a scalar settings payload');

        // A setext heading is a lane upstream; guessing at it invented an archive separator.
        const setext = parseBoard(`${FRONTMATTER}Doing\n---\n\n- [ ] a\n\n\n\n${SETTINGS_BLOCK}`);
        expect(
            setext.uncertainties.some(item => item.kind === 'setext-heading' && item.blocking),
            'a setext heading was silently mismodelled',
        );

        // A block id on a lane heading is not part of the lane title.
        const laneId = parseBoard(`${FRONTMATTER}## Doing ^lane-1\n\n- [ ] a\n\n\n\n${SETTINGS_BLOCK}`);
        expect(laneId.lanes[0].title === 'Doing', `lane title kept its block id: ${laneId.lanes[0].title}`);

        // Frontmatter scalars are typed, or numeric rules silently never fire.
        const typed = parseBoard(
            `---\n\nkanban-plugin: board\nmax-archive-size: 1\n\n---\n\n## A\n\n- [ ] a\n\n\n\n${SETTINGS_BLOCK}`,
        );
        expect(typed.settings['max-archive-size'] === 1, 'a frontmatter number stayed a string');
    } finally {
        fs.rmSync(vault, { recursive: true, force: true });
    }
}

/** A migration that stops halfway leaves a vault nobody can describe. */
function testMigrationIsAllOrNothing() {
    const vault = temporaryVault();
    try {
        for (const name of ['AAA.md', 'BBB.md']) {
            fs.copyFileSync(path.join(vault, 'Clean.md'), path.join(vault, name));
        }
        fs.chmodSync(path.join(vault, 'BBB.md'), 0o444);
        const plan = path.join(vault, 'plan.json');
        fs.writeFileSync(plan, JSON.stringify({ settings: { 'lane-width': 320 } }));
        const result = run('kanban-migrate.mjs', ['--plan', plan, '--vault', vault, '--board', 'AAA.md', '--write']);
        expect(result.status === EXIT.clean, 'a writable board should still migrate');
        const all = run('kanban-migrate.mjs', ['--plan', plan, '--vault', vault, '--write']);
        expect(all.status === EXIT.refused, `an unwritable board must stop the run: exit ${all.status}`);
        expect(!fs.readFileSync(path.join(vault, 'BBB.md'), 'utf8').includes('lane-width'), 'a read-only board was written');
        expect(!fs.existsSync(path.join(vault, 'BBB.md.bak')), 'a backup was left for a board that was never written');

        for (const bad of [
            { lanes: 'Doing' },
            { settings: 'nope' },
            { order: 'Backlog' },
            { lanes: [{ to: 'New', create: true, maxItems: 'lots' }] },
        ]) {
            fs.writeFileSync(plan, JSON.stringify(bad));
            const rejected = run('kanban-migrate.mjs', ['--plan', plan, '--vault', vault]);
            expect(
                rejected.status === EXIT.usage,
                `plan ${JSON.stringify(bad)} was not rejected: exit ${rejected.status}`,
            );
        }
    } finally {
        fs.chmodSync(path.join(vault, 'BBB.md'), 0o644);
        fs.rmSync(vault, { recursive: true, force: true });
    }
}

function testMigration() {
    const vault = temporaryVault();
    try {
        const dry = run('kanban-migrate.mjs', ['--plan', PLAN, '--vault', vault, '--board', 'Clean.md', '--format', 'json']);
        const planned = parseJson(dry, 'migrate dry run', EXIT.clean);
        expect(planned.written === false, 'a dry run must not write');
        expect(planned.changedBoards === 1, 'the plan should change the clean board');

        const applied = run('kanban-migrate.mjs', ['--plan', PLAN, '--vault', vault, '--board', 'Clean.md', '--write']);
        expect(applied.status === EXIT.clean, `migrate failed: ${applied.stderr}`);
        const text = fs.readFileSync(path.join(vault, 'Clean.md'), 'utf8');
        expect(text.includes('## Inbox'), 'the lane was not renamed');
        expect(text.includes('## In Progress (3)'), 'the created lane is missing its limit');
        expect(text.includes('"lane-width":320'), 'the setting was not written');
        expect(fs.existsSync(path.join(vault, 'Clean.md.bak')), 'no backup was kept');

        const board = parseBoard(text);
        expect(board.errors.length === 0, 'the migrated board does not parse');
        expect(board.lanes.map(lane => lane.title).join(',') === 'Inbox,In Progress,Done', 'lane order is wrong');
        expect(board.lanes[2].shouldMarkItemsComplete, 'the done column lost its flag');
    } finally {
        fs.rmSync(vault, { recursive: true, force: true });
    }
}

/** `list-collapse` is positional: a migration that reorders lanes must move it with them. */
function testCollapseStateFollowsLanes() {
    const vault = temporaryVault();
    try {
        const board = path.join(vault, 'Collapse.md');
        const source = fs
            .readFileSync(path.join(vault, 'Clean.md'), 'utf8')
            .replace('{"kanban-plugin":"board"}', '{"kanban-plugin":"board","list-collapse":[true,false]}');
        fs.writeFileSync(board, source);
        const plan = path.join(vault, 'reorder.json');
        fs.writeFileSync(plan, JSON.stringify({ order: ['Done', 'Backlog'] }));
        run('kanban-migrate.mjs', ['--plan', plan, '--vault', vault, '--board', 'Collapse.md', '--write']);
        const parsed = parseBoard(fs.readFileSync(board, 'utf8'));
        expect(
            JSON.stringify(parsed.settings['list-collapse']) === '[false,true]',
            `collapsed state did not follow its lanes: ${JSON.stringify(parsed.settings['list-collapse'])}`,
        );
    } finally {
        fs.rmSync(vault, { recursive: true, force: true });
    }
}

function testUsageErrors() {
    const cases = [
        ['kanban-board-lint.mjs', []],
        ['kanban-board-lint.mjs', ['--nonsense']],
        ['kanban-board-lint.mjs', ['--vault', FIXTURE_VAULT, '--format', 'xml']],
        ['kanban-board-lint.mjs', ['--vault', path.join(FIXTURE_VAULT, 'nope')]],
        ['kanban-board-lint.mjs', ['--vault', FIXTURE_VAULT, 'positional']],
        ['kanban-card.mjs', ['--vault', FIXTURE_VAULT, '--board', 'Clean.md']],
        ['kanban-card.mjs', ['fly', '--vault', FIXTURE_VAULT, '--board', 'Clean.md']],
        ['kanban-card.mjs', ['list', '--vault', FIXTURE_VAULT, '--board', '../outside.md']],
        ['kanban-migrate.mjs', ['--vault', FIXTURE_VAULT]],
        ['kanban-migrate.mjs', ['--plan', path.join(FIXTURE_VAULT, 'nope.json'), '--vault', FIXTURE_VAULT]],
        ['verify.mjs', ['--nonsense']],
    ];
    for (const [script, args] of cases) {
        const result = run(script, args);
        expect(
            result.status === EXIT.usage || result.status === EXIT.refused,
            `${script} ${args.join(' ')}: exit ${result.status}, expected a usage error`,
        );
    }
    for (const script of ['kanban-board-lint.mjs', 'kanban-card.mjs', 'kanban-migrate.mjs', 'verify.mjs']) {
        const help = run(script, ['--help']);
        expect(help.status === EXIT.clean, `${script} --help exited ${help.status}`);
        expect(help.stdout.startsWith('usage:'), `${script} --help printed no usage`);
    }
}

function testConsequenceModel() {
    for (const [id, rule] of Object.entries(RULES)) {
        expect(Object.keys(CONSEQUENCES).includes(rule.consequence), `${id}: unknown consequence`);
        expect(/^KB\d{3}$/.test(id), `${id}: bad id shape`);
    }
    const severities = new Set(Object.values(RULES).map(rule => severityFor(rule.consequence)));
    expect(severities.has('error') && severities.has('warning') && severities.has('info'), 'the catalogue does not exercise every severity');
}

function testIdentityDiscrimination(roots) {
    if (!roots.kanban) return 'skipped';
    const decoy = fs.mkdtempSync(path.join(os.tmpdir(), 'obsidian-kanban-decoy-'));
    try {
        // A checkout that keeps the version string but is not the pin must exit 4, not 0.
        fs.mkdirSync(path.join(decoy, 'src', 'parsers'), { recursive: true });
        fs.mkdirSync(path.join(decoy, 'docs'), { recursive: true });
        fs.writeFileSync(path.join(decoy, 'manifest.json'), JSON.stringify({ id: 'obsidian-kanban', version: '2.0.51' }));
        fs.writeFileSync(path.join(decoy, 'package.json'), '{}');
        fs.writeFileSync(path.join(decoy, 'versions.json'), '{}');
        fs.writeFileSync(path.join(decoy, 'src', 'parsers', 'common.ts'), "export const frontmatterKey = 'kanban-plugin';\n");
        const mismatch = run('verify.mjs', ['--source-root', decoy, '--tasks-root', roots.tasks ?? decoy]);
        expect(mismatch.status === EXIT.identityMismatch, `decoy checkout: exit ${mismatch.status}, expected ${EXIT.identityMismatch}`);

        const missing = run('verify.mjs', ['--source-root', path.join(decoy, 'nowhere'), '--tasks-root', roots.tasks ?? decoy]);
        expect(missing.status === EXIT.missingMaterial, `missing checkout: exit ${missing.status}, expected ${EXIT.missingMaterial}`);
    } finally {
        fs.rmSync(decoy, { recursive: true, force: true });
    }
    return undefined;
}

function testVerifierIsGreen(roots) {
    if (!roots.kanban || !roots.tasks) return 'skipped';
    const result = run('verify.mjs', [
        '--source-root', roots.kanban, '--tasks-root', roots.tasks, '--format', 'json',
    ]);
    const report = parseJson(result, 'verify');
    const failed = report.checks.filter(check => !check.passed);
    expect(failed.length === 0, `verifier failures: ${failed.map(check => check.id).join(', ')}`);
    return undefined;
}

/** The extracted copy must stand alone, and must still refuse to carry repository paths. */
function testExtractedCopy(roots) {
    if (!roots.kanban || !roots.tasks) return 'skipped';
    const copy = fs.mkdtempSync(path.join(os.tmpdir(), 'obsidian-kanban-extract-'));
    try {
        const target = path.join(copy, 'kanban');
        fs.cpSync(SKILL_ROOT, target, { recursive: true });
        const skill = path.join(target, 'SKILL.md');
        const before = fs.readFileSync(skill, 'utf8');
        const after = before.replace(
            /(?:^|\n)## Repository-only verification \(remove when extracting this skill\)[\s\S]*?(?=\n## |\s*$)/,
            '',
        );
        expect(after !== before, 'the removable section was not found');
        expect(!/\b(?:research|results)\//.test(after), 'repository paths survive extraction');
        fs.writeFileSync(skill, after);

        const verify = spawnSync(
            process.execPath,
            [path.join(target, 'scripts', 'verify.mjs'), '--source-root', roots.kanban, '--tasks-root', roots.tasks],
            { encoding: 'utf8' },
        );
        // The extracted copy no longer carries the section, so the section check is expected to fail
        // and nothing else is: assert exactly that.
        const failures = (verify.stdout.match(/^FAIL (\S+):/gm) ?? []).map(line => line.split(' ')[1].replace(':', ''));
        expect(
            failures.length === 1 && failures[0] === 'repository-section-once',
            `the extracted copy failed more than the removed section: ${failures.join(', ')}`,
        );

        fs.appendFileSync(skill, '\nA stray reference to results/skills/kanban.\n');
        const dirty = spawnSync(
            process.execPath,
            [path.join(target, 'scripts', 'verify.mjs'), '--source-root', roots.kanban, '--tasks-root', roots.tasks],
            { encoding: 'utf8' },
        );
        expect(/FAIL repository-paths-confined/.test(dirty.stdout), 'a repository path in the copy was not caught');
    } finally {
        fs.rmSync(copy, { recursive: true, force: true });
    }
    return undefined;
}

const USAGE = [
    'usage: test.mjs [--source-root PATH] [--tasks-root PATH]',
    '',
    '  --source-root PATH  checkout of obsidian-community/obsidian-kanban',
    '  --tasks-root PATH   checkout of obsidian-tasks-group/obsidian-tasks',
    '  -h, --help          print this message',
    '',
    'Tests that need a pinned checkout are skipped when its root is not given.',
].join('\n');

function main() {
    let args;
    try {
        args = parseArgs(process.argv.slice(2), { booleans: ['help'], values: ['source-root', 'tasks-root'] });
    } catch (error) {
        writeUsageError(error, USAGE);
        return;
    }
    if (args.help) {
        process.stdout.write(`${USAGE}\n`);
        return;
    }
    const roots = {
        kanban: args['source-root'] ? path.resolve(args['source-root']) : null,
        tasks: args['tasks-root'] ? path.resolve(args['tasks-root']) : null,
    };
    for (const [alias, root] of Object.entries(roots)) {
        if (root && !fs.existsSync(root)) {
            process.stderr.write(`missing pinned material: ${alias} at ${root}\n`);
            process.exitCode = EXIT.missingMaterial;
            return;
        }
    }

    const tests = [
        ['board fixtures', () => testBoardFixtures()],
        ['info findings do not fail a run', () => testInfoDoesNotFail()],
        ['sarif output', () => testSarif()],
        ['serialiser round trip', () => testRoundTrip()],
        ['parser edge cases', () => testParserEdgeCases()],
        ['card operations', () => testCardOperations()],
        ['archive mechanics', () => testArchiveMechanics()],
        ['write round trip', () => testWriteRoundTrip()],
        ['settle check catches a concurrent rewrite', () => testSettleDetectsClobber()],
        ['refusals', () => testRefusals()],
        ['frontmatter beyond flat scalars is refused', () => testRichFrontmatterIsRefused()],
        ['adversarial regressions', () => testAdversarialRegressions()],
        ['migration is all or nothing', () => testMigrationIsAllOrNothing()],
        ['migration', () => testMigration()],
        ['collapsed state follows lanes', () => testCollapseStateFollowsLanes()],
        ['usage errors', () => testUsageErrors()],
        ['consequence model', () => testConsequenceModel()],
        ['identity discrimination', () => testIdentityDiscrimination(roots)],
        ['verifier is green', () => testVerifierIsGreen(roots)],
        ['extracted copy', () => testExtractedCopy(roots)],
    ];

    let passed = 0;
    let failed = 0;
    let skipped = 0;
    for (const [name, test] of tests) {
        try {
            const result = test();
            if (result === 'skipped') {
                skipped += 1;
                process.stdout.write(`SKIP ${name} (no pinned checkout given)\n`);
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
        `obsidian-kanban tool tests: ${passed}/${tests.length} passed${skipped ? `, ${skipped} skipped` : ''}${
            failed ? `, ${failed} failed` : ''
        }\n`,
    );
    if (failed) process.exitCode = EXIT.findings;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
