#!/usr/bin/env node
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
    applyEdits,
    blockingProblems,
    cardToMd,
    inferUseTab,
    markersFor,
    parseBoard,
    serializeBoard,
} from './board.mjs';
import {
    EXIT,
    assertFormat,
    decodesLosslessly,
    detectEol,
    hasMixedLineEndings,
    parseArgs,
    readRaw,
    resolveContainedFile,
    unifiedDiff,
    writeUsageError,
} from './lib.mjs';

const OPERATIONS = [
    'list',
    'add',
    'move',
    'edit',
    'complete',
    'uncomplete',
    'archive',
    'remove',
    'set-date',
    'set-time',
];

const USAGE = [
    `usage: kanban-card.mjs <${OPERATIONS.join('|')}> --board PATH [options]`,
    '',
    '  --board PATH        the board note to act on (required)',
    '  --vault PATH        vault root the board must live inside (required)',
    '  --lane NAME|#N      target lane, by title or by zero-based index',
    '  --index N           zero-based card position within the lane',
    '  --block-id ID       select a card by its block id instead of lane and index',
    '  --to-lane NAME|#N   destination lane for move',
    '  --to-index N        destination position; default is the top of the lane',
    '  --text TEXT         card text for add and edit',
    '  --position top|bottom|N   where add inserts; default follows the board setting',
    '  --via drag|menu     which plugin path to imitate for move; drag applies the complete',
    '                      mechanic, menu does not (default: drag)',
    '  --tasks-emoji       imitate the Tasks plugin completion date on complete and uncomplete',
    '  --done-char CHAR    the character a completed card carries (default: x)',
    '  --allow-recurrence  proceed even when a card carries a recurrence rule',
    '  --now TIMESTAMP     the moment to stamp, as YYYY-MM-DD or YYYY-MM-DD HH:mm',
    '  --date VALUE        the date for set-date, formatted as the board expects',
    '  --time VALUE        the time for set-time',
    '  --locale CODE       the Obsidian UI language the board was written under (default: en); a',
    '                      language the plugin does not translate falls back to English markers, and',
    '                      the wrong one makes a complete marker or archive invisible',
    '  --strategy minimal|normalize   splice the edited lines (default) or rewrite the whole',
    '                      file the way the plugin would',
    '  --write             apply the change; without it nothing is written',
    '  --no-backup         do not keep the previous contents beside the board',
    '  --settle-seconds N  after writing, wait N seconds and check the bytes survived',
    '                      (default 3, which is longer than Obsidian\'s save debounce)',
    '  --format text|json  report shape (default: text)',
    '  -h, --help          print this message',
    '',
    'Exit codes: 0 clean, 1 nothing to do, 2 usage error, 5 refused or lost to a concurrent write.',
].join('\n');

const DONE_DATE = /\s*✅ *\d{4}-\d{2}-\d{2}/u;
const RECURRENCE = /🔁/u;

class Refused extends Error {}

function refuse(message) {
    throw new Refused(message);
}

function findLane(board, selector, label) {
    if (selector === undefined) throw new Error(`${label} is required`);
    if (/^#\d+$/.test(selector)) {
        const index = Number(selector.slice(1));
        if (!board.lanes[index]) refuse(`${label} #${index} does not exist; the board has ${board.lanes.length} lanes`);
        return board.lanes[index];
    }
    const matches = board.lanes.filter(lane => lane.title === selector);
    if (matches.length === 0) {
        refuse(
            `${label} ${JSON.stringify(selector)} does not exist; lanes are ${board.lanes
                .map(lane => JSON.stringify(lane.title))
                .join(', ')}`,
        );
    }
    if (matches.length > 1) refuse(`${label} ${JSON.stringify(selector)} is ambiguous: ${matches.length} lanes share it`);
    return matches[0];
}

function findCard(board, args) {
    if (args['block-id'] && args.lane !== undefined) {
        throw new Error('--block-id and --lane select the same card in two ways; give one');
    }
    if (args['block-id']) {
        const hits = [];
        for (const lane of board.lanes) {
            lane.cards.forEach((card, index) => {
                if (card.blockId === args['block-id']) hits.push({ lane, card, index });
            });
        }
        if (!hits.length) refuse(`no card carries the block id ${args['block-id']}`);
        if (hits.length > 1) refuse(`the block id ${args['block-id']} is on ${hits.length} cards`);
        return hits[0];
    }
    const lane = findLane(board, args.lane, '--lane');
    if (args.index === undefined) throw new Error('--index is required unless --block-id is given');
    if (!/^\d+$/.test(String(args.index))) throw new Error(`--index must be a whole number, not ${args.index}`);
    const index = Number(args.index);
    if (index >= lane.cards.length) {
        refuse(`--index ${args.index} is out of range; lane ${JSON.stringify(lane.title)} has ${lane.cards.length} cards`);
    }
    return { lane, card: lane.cards[index], index };
}

/** The half-open line range holding a lane's cards, and where a new card goes when it has none. */
function laneCardRegion(board, lane) {
    if (lane.listStartLine !== null) {
        return { start: lane.listStartLine, end: lane.listEndLine + 1, empty: false };
    }
    let line = (lane.completeMarkerLine ?? lane.headingLine) + 1;
    const needsBlank = !(board.lines[line] !== undefined && board.lines[line].trim() === '');
    if (!needsBlank) line += 1;
    return { start: line, end: line, empty: true, needsBlank };
}

function renderLane(lane, cards, useTab) {
    return cards.map(card => cardToMd(card, useTab)).flatMap(text => text.split('\n'));
}

function laneEdit(board, lane, cards, useTab) {
    const region = laneCardRegion(board, lane);
    const lines = renderLane(lane, cards, useTab);
    if (region.empty && region.needsBlank && lines.length) lines.unshift('');
    return { start: region.start, end: region.end, replacement: lines };
}

/** Where an archived card is appended, creating the archive section when the board has none. */
function archiveEdit(board, cards, useTab, markers) {
    if (board.archiveBlock) {
        return {
            start: board.archiveBlock.listStartLine,
            end: board.archiveBlock.listEndLine + 1,
            replacement: cards.map(card => cardToMd(card, useTab)).flatMap(text => text.split('\n')),
        };
    }
    // The archive goes between the last lane and the settings block, which is where the plugin
    // emits it, at the line where the parser says the body ends. Re-scanning the lines for the marker text
    // would match a card that merely mentions it, and splice the archive into the middle of a card.
    const line = board.bodyEndLine;
    return {
        start: line,
        end: line,
        replacement: [
            '***',
            '',
            `## ${markers.archive}`,
            '',
            ...cards.map(card => cardToMd(card, useTab)).flatMap(text => text.split('\n')),
            '',
        ],
    };
}

function withDoneDate(titleRaw, stamp) {
    if (DONE_DATE.test(titleRaw)) return titleRaw;
    const lines = titleRaw.split('\n');
    lines[0] = `${lines[0]} ✅ ${stamp}`.trim();
    return lines.join('\n');
}

function withoutDoneDate(titleRaw) {
    const lines = titleRaw.split('\n');
    lines[0] = lines[0].replace(DONE_DATE, '').trim();
    return lines.join('\n');
}

function guardRecurrence(card, args, effects) {
    if (!RECURRENCE.test(card.titleRaw)) return;
    if (!args['allow-recurrence']) {
        refuse(
            'this card carries a recurrence rule; with the Tasks plugin installed, completing it creates a second card that this tool does not write. Re-run with --allow-recurrence to complete only this one.',
        );
    }
    effects.push(
        'the card carries a recurrence rule: the Tasks plugin would also create the next occurrence, and this tool did not',
    );
}

function completeCard(card, args, effects, doneChar, stamp) {
    const next = { ...card, checked: true, checkChar: doneChar };
    if (args['tasks-emoji']) {
        guardRecurrence(card, args, effects);
        next.titleRaw = withDoneDate(card.titleRaw, stamp.slice(0, 10));
        effects.push(`stamped the Tasks completion date ✅ ${stamp.slice(0, 10)}`);
    } else {
        effects.push(
            'no completion date was written: without the Tasks plugin the Kanban plugin only changes the check character',
        );
    }
    effects.push(`set the check character to ${JSON.stringify(doneChar)}`);
    return next;
}

function uncompleteCard(card, args, effects) {
    const next = { ...card, checked: false, checkChar: ' ' };
    if (args['tasks-emoji']) {
        next.titleRaw = withoutDoneDate(card.titleRaw);
        effects.push('removed the Tasks completion date');
    } else if (DONE_DATE.test(card.titleRaw)) {
        effects.push(
            'a completion date is still in the card text: without the Tasks plugin the Kanban plugin never removes it',
        );
    }
    effects.push('set the check character to a space');
    return next;
}

function stampArchiveDate(titleRaw, board, stamp) {
    if (!board.settings['archive-with-date']) return { titleRaw, note: null };
    const separator = board.settings['archive-date-separator'] ?? '';
    const parts = [stamp];
    if (separator) parts.push(separator);
    parts.push(titleRaw);
    if (board.settings['append-archive-date']) parts.reverse();
    return { titleRaw: parts.join(' '), note: `stamped the archive date using ${JSON.stringify(stamp)}` };
}

function defaultStamp(args) {
    if (args.now) {
        if (!/^\d{4}-\d{2}-\d{2}( \d{2}:\d{2})?$/.test(args.now)) {
            throw new Error('--now must be YYYY-MM-DD or "YYYY-MM-DD HH:mm"');
        }
        return args.now.length === 10 ? `${args.now} 00:00` : args.now;
    }
    const now = new Date();
    const pad = value => String(value).padStart(2, '0');
    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
}

function describeBoard(board) {
    return {
        lanes: board.lanes.map((lane, index) => ({
            index,
            title: lane.title,
            maxItems: lane.maxItems || null,
            marksComplete: lane.shouldMarkItemsComplete,
            cards: lane.cards.map((card, position) => ({
                index: position,
                checkChar: card.checkChar,
                checked: Boolean(card.checked),
                blockId: card.blockId,
                line: card.startLine + 1,
                text: card.titleRaw,
            })),
        })),
        archive: board.archive.map(card => ({ text: card.titleRaw, checkChar: card.checkChar })),
    };
}

function run(args) {
    const operation = args._[0];
    if (!operation) throw new Error(`an operation is required; expected one of ${OPERATIONS.join(', ')}`);
    if (!OPERATIONS.includes(operation)) {
        throw new Error(`unknown operation ${operation}; expected one of ${OPERATIONS.join(', ')}`);
    }
    if (args._.length > 1) throw new Error('only one operation may be given');

    const vault = args.vault;
    if (!vault) throw new Error('--vault is required');
    const file = resolveContainedFile(vault, args.board, '--board');
    const locale = args.locale ?? 'en';
    const markers = markersFor(locale);
    const original = readRaw(file);
    const snapshot = fingerprintFile(file, original);
    const { eol, trailingNewline } = detectEol(original);
    const board = parseBoard(original, { locale });

    const blocking = blockingProblems(board);
    if (blocking.length) {
        refuse(
            `this board cannot be modelled safely: ${blocking
                .map(item => `${item.kind}${item.line ? ` at line ${item.line}` : ''}`)
                .join('; ')}`,
        );
    }
    if (operation !== 'list') {
        // Everything below works on a decoded string. A byte that does not survive the decode would
        // be replaced on write — and in the backup too, because the backup is written from the same
        // string. Mixed line endings have the same shape of problem: no single join reproduces them.
        if (!decodesLosslessly(file)) {
            refuse('this file contains bytes that are not valid UTF-8, and writing it back would replace them');
        }
        if (hasMixedLineEndings(original)) {
            refuse('this file mixes CRLF and LF line endings, and writing it back would normalise the ones it did not touch');
        }
    }

    if (operation === 'list') {
        return { operation, board, changed: false, inventory: describeBoard(board), effects: [], snapshot };
    }

    const useTab = inferUseTab(board);
    const doneChar = args['done-char'] ?? 'x';
    if (doneChar.length !== 1) throw new Error('--done-char must be exactly one character');
    if (/\s/.test(doneChar)) {
        throw new Error('--done-char must not be whitespace; a space is the character an unchecked card carries');
    }
    const stamp = defaultStamp(args);
    const effects = [];
    const edits = [];

    if (operation === 'add') {
        if (args.text === undefined) throw new Error('--text is required for add');
        const lane = findLane(board, args.lane, '--lane');
        const checkChar = lane.shouldMarkItemsComplete ? doneChar : ' ';
        if (lane.shouldMarkItemsComplete) {
            effects.push(
                `the lane marks its cards complete, so the new card is written as [${checkChar}]; the plugin's own add path does not ask the Tasks plugin for a completion date here either`,
            );
        }
        const card = { checkChar, checked: lane.shouldMarkItemsComplete, titleRaw: args.text, blockId: null };
        const insertion = args.position ?? insertionFromSettings(board);
        const cards = [...lane.cards];
        if (insertion === 'top') cards.unshift(card);
        else if (insertion === 'bottom') cards.push(card);
        else {
            const at = Number(insertion);
            if (!Number.isInteger(at) || at < 0 || at > cards.length) {
                throw new Error(`--position must be top, bottom, or a number from 0 to ${cards.length}`);
            }
            cards.splice(at, 0, card);
        }
        effects.push(`inserted at ${insertion === 'top' || insertion === 'bottom' ? insertion : `index ${insertion}`} of ${JSON.stringify(lane.title)}`);
        if (lane.maxItems && cards.length > lane.maxItems) {
            effects.push(
                `the lane is now over its work-in-progress limit of ${lane.maxItems}; the plugin does not block this, it only styles the counter`,
            );
        }
        edits.push(laneEdit(board, lane, cards, useTab));
    }

    if (operation === 'move') {
        const { lane, card, index } = findCard(board, args);
        const destination = findLane(board, args['to-lane'], '--to-lane');
        const via = args.via ?? 'drag';
        if (!['drag', 'menu'].includes(via)) throw new Error('--via must be drag or menu');
        let moved = { ...card };
        if (via === 'drag') {
            const wasComplete = Boolean(card.checked) && card.checkChar === doneChar;
            if (!lane.shouldMarkItemsComplete && !destination.shouldMarkItemsComplete) {
                effects.push('neither lane marks cards complete, so the check state is untouched');
            } else if (destination.shouldMarkItemsComplete === wasComplete) {
                effects.push('the card already matches the destination lane, so the check state is untouched');
            } else if (destination.shouldMarkItemsComplete) {
                moved = completeCard(card, args, effects, doneChar, stamp);
            } else {
                moved = uncompleteCard(card, args, effects);
            }
        } else {
            effects.push(
                'the move-to-list menu path was imitated, and that path does not run the complete mechanic at all',
            );
        }
        const sourceCards = [...lane.cards];
        sourceCards.splice(index, 1);
        const destinationCards = lane === destination ? sourceCards : [...destination.cards];
        const at = args['to-index'] === undefined ? 0 : Number(args['to-index']);
        if (!Number.isInteger(at) || at < 0 || at > destinationCards.length) {
            throw new Error(`--to-index must be a number from 0 to ${destinationCards.length}`);
        }
        destinationCards.splice(at, 0, moved);
        if (lane === destination) {
            edits.push(laneEdit(board, lane, destinationCards, useTab));
        } else {
            edits.push(laneEdit(board, lane, sourceCards, useTab));
            edits.push(laneEdit(board, destination, destinationCards, useTab));
        }
        effects.push(`moved to index ${at} of ${JSON.stringify(destination.title)}`);
        if (destination.maxItems && destinationCards.length > destination.maxItems) {
            effects.push(`the destination lane is now over its work-in-progress limit of ${destination.maxItems}`);
        }
    }

    if (operation === 'complete' || operation === 'uncomplete') {
        const { lane, card, index } = findCard(board, args);
        const next =
            operation === 'complete'
                ? completeCard(card, args, effects, doneChar, stamp)
                : uncompleteCard(card, args, effects);
        const cards = [...lane.cards];
        cards[index] = next;
        edits.push(laneEdit(board, lane, cards, useTab));
    }

    if (operation === 'edit') {
        if (args.text === undefined) throw new Error('--text is required for edit');
        const { lane, card, index } = findCard(board, args);
        const cards = [...lane.cards];
        cards[index] = { ...card, titleRaw: args.text };
        effects.push('replaced the card text; the check character and block id are kept');
        edits.push(laneEdit(board, lane, cards, useTab));
    }

    if (operation === 'set-date' || operation === 'set-time') {
        const { lane, card, index } = findCard(board, args);
        const trigger =
            operation === 'set-date'
                ? board.settings['date-trigger'] ?? '@'
                : board.settings['time-trigger'] ?? '@@';
        const value = operation === 'set-date' ? args.date : args.time;
        if (value === undefined) throw new Error(`--${operation === 'set-date' ? 'date' : 'time'} is required`);
        if (operation === 'set-date' && board.settings['link-date-to-daily-note']) {
            refuse(
                'this board links dates to daily notes, so the plugin writes a link rather than a braced value; set the date in Obsidian instead',
            );
        }
        const escaped = trigger.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const pattern = new RegExp(`(^|\\s)${escaped}\\{[^}]+\\}`);
        const lines = card.titleRaw.split('\n');
        lines[0] = pattern.test(lines[0])
            ? lines[0].replace(pattern, `$1${trigger}{${value}}`)
            : `${lines[0]} ${trigger}{${value}}`;
        const cards = [...lane.cards];
        cards[index] = { ...card, titleRaw: lines.join('\n') };
        effects.push(`wrote ${trigger}{${value}} using the board's own trigger`);
        edits.push(laneEdit(board, lane, cards, useTab));
    }

    if (operation === 'archive' || operation === 'remove') {
        const { lane, card, index } = findCard(board, args);
        const cards = [...lane.cards];
        cards.splice(index, 1);
        edits.push(laneEdit(board, lane, cards, useTab));
        if (operation === 'archive') {
            const stamped = stampArchiveDate(card.titleRaw, board, stamp);
            if (stamped.note) effects.push(stamped.note);
            else effects.push('the board does not stamp archived cards, so the text is unchanged');
            const archived = [...board.archive, { ...card, titleRaw: stamped.titleRaw }];
            effects.push('appended to the end of the archive, which is where archiving one card puts it');
            const maxArchive = board.settings['max-archive-size'];
            if (typeof maxArchive === 'number' && maxArchive >= 0 && archived.length > maxArchive) {
                effects.push(
                    `the archive now holds ${archived.length} cards against a limit of ${maxArchive}; opening the board deletes the oldest without asking`,
                );
            }
            edits.push(archiveEdit(board, archived, useTab, markers));
        } else {
            effects.push('deleted the card; nothing is written to the archive');
        }
    }

    let nextLines;
    try {
        nextLines = applyEdits(board.lines, edits);
    } catch (error) {
        refuse(`this edit could not be applied cleanly: ${error.message}`);
    }
    let updated = nextLines.join(eol);
    if (trailingNewline && !updated.endsWith(eol)) updated += eol;

    if (args.strategy === 'normalize') {
        const reparsed = parseBoard(updated, { locale });
        if (blockingProblems(reparsed).length) {
            refuse('the edited board no longer parses cleanly, so it was not normalised');
        }
        // Normalising regenerates the frontmatter, and upstream regenerates it through Obsidian's
        // YAML writer. Reproducing that for anything beyond flat scalars is not something this tool
        // can promise, so it declines rather than rewriting a frontmatter it only partly read.
        if (reparsed.uncertainties.some(item => item.kind === 'yaml-not-modelled')) {
            refuse(
                'this board has frontmatter beyond flat key-and-value lines, and normalising would rewrite it; use the default strategy',
            );
        }
        // Normalising emits only what the board model holds, so anything outside it would be deleted
        // by this tool rather than by Obsidian. The default strategy leaves those lines alone.
        if (reparsed.unrepresented.length) {
            refuse(
                `normalising would delete content the board model cannot carry, first at line ${reparsed.unrepresented[0].line}; use the default strategy, or fix that content first`,
            );
        }
        if (reparsed.settingsFooter.absent && /%%\s*kanban:settings/.test(updated)) {
            refuse(
                'the settings block cannot be read on this board, so normalising would replace it with only what the frontmatter carries',
            );
        }
        updated = serializeBoard(reparsed, { useTab });
        effects.push('rewrote the whole file the way the plugin would, which also normalises spacing everywhere else');
    }

    return { operation, board, changed: updated !== original, original, updated, file, effects, snapshot };
}

/**
 * Identity of the bytes this run read.
 *
 * The plugin has no lock, no mtime guard and no conflict detection: every save serialises the whole
 * board out of memory (`kanban: src/StateManager.ts:99-114`). Comparing this snapshot immediately
 * before writing is the only way, from outside Obsidian, to notice that something else moved the
 * file while the edit was being computed.
 */
function fingerprintFile(file, text) {
    const stat = fs.statSync(file);
    return {
        size: stat.size,
        mtimeMs: stat.mtimeMs,
        sha256: crypto.createHash('sha256').update(text).digest('hex'),
    };
}

function sameFingerprint(left, right) {
    return left.size === right.size && left.sha256 === right.sha256;
}

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

/** Parsed once, and always before anything is written, so a typo cannot follow a completed write. */
function settleSeconds(args) {
    if (args['settle-seconds'] === undefined) return 3;
    const value = Number(args['settle-seconds']);
    if (!Number.isFinite(value) || value < 0) throw new Error('--settle-seconds must be a number of seconds');
    return value;
}

/**
 * Write the board, but only onto the bytes this run actually read.
 *
 * Three checks, in the order that matters: the file must still be what it was when it was read; the
 * previous contents are kept beside the board unless that was refused; and after the write the file
 * is read back, then read again after a settle window longer than Obsidian's save debounce, because
 * an open board will happily overwrite an external edit seconds later with no user action at all.
 */
async function commit(result, args) {
    const backups = [];
    const current = fingerprintFile(result.file, readRaw(result.file));
    if (!sameFingerprint(current, result.snapshot)) {
        refuse(
            'the board changed on disk while this edit was being computed, so nothing was written; re-read the board and try again',
        );
    }
    if (!args['no-backup']) {
        const backup = `${result.file}.bak`;
        fs.writeFileSync(backup, result.original);
        backups.push(backup);
    }
    fs.writeFileSync(result.file, result.updated);

    const afterWrite = readRaw(result.file);
    if (afterWrite !== result.updated) {
        refuse(`the write did not survive: ${result.file} already holds different bytes`);
    }
    const settle = settleSeconds(args);
    if (settle > 0) {
        await sleep(settle * 1000);
        const afterSettle = readRaw(result.file);
        if (afterSettle !== result.updated) {
            refuse(
                `the board was rewritten ${settle}s after the edit, which is what an open Obsidian board does; the edit is gone${
                    backups.length ? ` and the previous contents are in ${backups[0]}` : ''
                }`,
            );
        }
    }
    return { backups, settle };
}

/** New cards follow the board's own insertion setting; the documented default is to append. */
function insertionFromSettings(board) {
    const method = board.settings['new-card-insertion-method'];
    if (method === 'prepend' || method === 'prepend-compact') return 'top';
    return 'bottom';
}

async function main() {
    let args;
    try {
        args = parseArgs(process.argv.slice(2), {
            booleans: ['help', 'write', 'tasks-emoji', 'allow-recurrence', 'no-backup'],
            values: [
                'board',
                'vault',
                'lane',
                'index',
                'block-id',
                'to-lane',
                'to-index',
                'text',
                'position',
                'via',
                'done-char',
                'now',
                'date',
                'time',
                'locale',
                'strategy',
                'settle-seconds',
                'format',
            ],
        });
    } catch (error) {
        writeUsageError(error, USAGE);
        return;
    }
    if (args.help) {
        process.stdout.write(`${USAGE}\n`);
        return;
    }
    let result;
    try {
        const format = assertFormat(args.format ?? 'text', ['text', 'json']);
        if (args.strategy && !['minimal', 'normalize'].includes(args.strategy)) {
            throw new Error('--strategy must be minimal or normalize');
        }
        settleSeconds(args);
        result = run(args);
        if (result.inventory) {
            if (format === 'json') process.stdout.write(`${JSON.stringify(result.inventory, null, 2)}\n`);
            else process.stdout.write(`${renderInventory(result.inventory)}\n`);
            return;
        }
        if (!result.changed) {
            process.stdout.write('nothing to change\n');
            process.exitCode = EXIT.findings;
            return;
        }
        const diff = unifiedDiff(result.original, result.updated, path.basename(result.file));
        let commitment = null;
        if (args.write) commitment = await commit(result, args);
        const assumptions = [
            'Whether a completion date appears at all depends on the Tasks plugin being installed in this vault, which cannot be read from the board file.',
            'A completion date written here imitates the Tasks emoji format; the real one is produced by the Tasks plugin against the status registry and settings in effect in that vault.',
            'Structural markers were read for the given language, which is the language Obsidian was running in when the board was last saved.',
            'Obsidian holds no lock on a board and detects no conflict: an open board rewrites the file from memory, with no user action, seconds after any change.',
        ];
        if (format === 'json') {
            process.stdout.write(
                `${JSON.stringify(
                    {
                        operation: result.operation,
                        written: Boolean(args.write),
                        backups: commitment?.backups ?? [],
                        settleSeconds: commitment?.settle ?? null,
                        effects: result.effects,
                        assumptions,
                        diff,
                    },
                    null,
                    2,
                )}\n`,
            );
        } else {
            process.stdout.write(diff);
            process.stdout.write('\nmechanics applied:\n');
            for (const effect of result.effects) process.stdout.write(`- ${effect}\n`);
            process.stdout.write('\nassumptions:\n');
            for (const item of assumptions) process.stdout.write(`- ${item}\n`);
            if (args.write) {
                process.stdout.write(`\nwritten to ${result.file}\n`);
                if (commitment.backups.length) {
                    process.stdout.write(`previous contents kept in ${commitment.backups[0]}\n`);
                }
                process.stdout.write(
                    commitment.settle > 0
                        ? `the bytes were still there ${commitment.settle}s later\n`
                        : 'the settle check was skipped, so an open board may still overwrite this\n',
                );
            } else {
                process.stdout.write('\nnothing was written; re-run with --write to apply\n');
            }
        }
    } catch (error) {
        if (error instanceof Refused) {
            process.stderr.write(`refused: ${error.message}\n`);
            process.exitCode = EXIT.refused;
            return;
        }
        writeUsageError(error, USAGE);
    }
}

function renderInventory(inventory) {
    const out = [];
    for (const lane of inventory.lanes) {
        const limit = lane.maxItems ? ` (limit ${lane.maxItems})` : '';
        const complete = lane.marksComplete ? ' [marks cards complete]' : '';
        out.push(`#${lane.index} ${lane.title}${limit}${complete}`);
        for (const card of lane.cards) {
            const id = card.blockId ? ` ^${card.blockId}` : '';
            out.push(`  ${card.index}. [${card.checkChar}] ${card.text.split('\n')[0]}${id}  (line ${card.line})`);
        }
        if (!lane.cards.length) out.push('  (no cards)');
    }
    if (inventory.archive.length) {
        out.push(`archive: ${inventory.archive.length} cards`);
        for (const card of inventory.archive) out.push(`  [${card.checkChar}] ${card.text.split('\n')[0]}`);
    }
    return out.join('\n');
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await main();
