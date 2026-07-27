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
    readJson,
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
    '  --kanban-data PATH  Kanban plugin data.json, inside the vault; inherited settings are then',
    '                      resolved exactly instead of assuming board-local or stock values',
    '  --vault-date-format S  effective vault date format when no Kanban value overrides it',
    '  --vault-time-format S  effective vault time format when no Kanban value overrides it',
    '  --via drag|menu     which plugin path to imitate for move; drag applies the complete',
    '                      mechanic, menu does not (default: drag)',
    '  --tasks-emoji       imitate the Tasks plugin on complete and uncomplete (the historical flag',
    '                      name is retained; --tasks-format may select Dataview metadata)',
    '  --tasks-data PATH   Tasks plugin data.json, inside the vault; supplies its format, global',
    '                      filter, setDoneDate and done-status symbol',
    '  --tasks-format emoji|dataview   override the Tasks metadata format',
    '  --tasks-set-done-date true|false   override the Tasks setDoneDate setting',
    '  --global-filter S   the Tasks global filter configured in the vault; a card whose first line',
    '                      lacks it gets no completion date, exactly as Tasks behaves',
    '  --done-char CHAR    the character a completed card carries (default: x)',
    '  --allow-lossy-recurrence  complete only the current card even though Tasks would also create',
    '                      the next occurrence (--allow-recurrence is a deprecated alias)',
    '  --now TIMESTAMP     the moment to stamp, as YYYY-MM-DD, YYYY-MM-DD HH:mm, or with :ss',
    '  --archive-stamp S   the exact archive timestamp text, pre-formatted by the caller; use it',
    '                      when the board\'s archive-date-format needs tokens this tool refuses',
    '  --date VALUE        the date for set-date, formatted as the board expects',
    '  --time VALUE        the time for set-time',
    '  --locale CODE       the Obsidian UI language the board was written under (default: en); a',
    '                      language the plugin does not translate falls back to English markers, and',
    '                      the wrong one makes a complete marker or archive invisible',
    '  --strategy minimal|normalize   splice the edited lines (default) or rewrite the whole',
    '                      file the way the plugin would',
    '  --write             apply the change; without it nothing is written',
    '  --expect-sha256 H   only act on the input SHA-256 printed by a reviewed dry run',
    '  --expect-output-sha256 H  only write the exact proposed output printed by that dry run',
    '  --no-backup         do not keep the previous contents beside the board',
    '  --settle-seconds N  after writing, wait N seconds and check the bytes survived',
    '                      (default 3, which is longer than Obsidian\'s save debounce)',
    '  --format text|json  report shape (default: text)',
    '  -h, --help          print this message',
    '',
    'Exit codes: 0 clean, 1 nothing to do, 2 usage error, 5 refused or lost to a concurrent write.',
].join('\n');

const TASK_FORMATS = Object.freeze(['emoji', 'dataview']);

const EMOJI_METADATA = Object.freeze([
    { kind: 'priority', regex: /(?:^|\s+)(?:🔺|⏫|🔼|🔽|⏬)\uFE0F?$/u },
    { kind: 'doneDate', regex: /(?:^|\s+)✅\uFE0F? *(\d{4}-\d{2}-\d{2})$/u },
    { kind: 'cancelledDate', regex: /(?:^|\s+)❌\uFE0F? *(\d{4}-\d{2}-\d{2})$/u },
    { kind: 'dueDate', regex: /(?:^|\s+)(?:📅|📆|🗓)\uFE0F? *(\d{4}-\d{2}-\d{2})$/u },
    { kind: 'scheduledDate', regex: /(?:^|\s+)(?:⏳|⌛)\uFE0F? *(\d{4}-\d{2}-\d{2})$/u },
    { kind: 'startDate', regex: /(?:^|\s+)🛫\uFE0F? *(\d{4}-\d{2}-\d{2})$/u },
    { kind: 'createdDate', regex: /(?:^|\s+)➕\uFE0F? *(\d{4}-\d{2}-\d{2})$/u },
    { kind: 'recurrence', regex: /(?:^|\s+)🔁\uFE0F? *([a-zA-Z0-9, !]+)$/u },
    { kind: 'onCompletion', regex: /(?:^|\s+)🏁\uFE0F? *([a-zA-Z]+)$/u },
    { kind: 'tag', regex: /(?:^|\s+)#[^ !@#$%^&*(),.?":{}|<>]+$/u },
    { kind: 'id', regex: /(?:^|\s+)🆔\uFE0F? *([a-zA-Z0-9-_]+)$/u },
    {
        kind: 'dependsOn',
        regex: /(?:^|\s+)⛔\uFE0F? *([a-zA-Z0-9-_]+(?: *, *[a-zA-Z0-9-_]+)*)$/u,
    },
]);

function dataviewField(kind, inner) {
    return {
        kind,
        regex: new RegExp(
            `(?:^|\\s+)(?:\\[\\s*${inner}\\s*\\]|\\(\\s*${inner}\\s*\\))(?:\\s*,)?$`,
            'iu',
        ),
    };
}

const DATAVIEW_METADATA = Object.freeze([
    dataviewField('priority', 'priority:: *(highest|high|medium|low|lowest)'),
    dataviewField('doneDate', 'completion:: *(\\d{4}-\\d{2}-\\d{2})'),
    dataviewField('cancelledDate', 'cancelled:: *(\\d{4}-\\d{2}-\\d{2})'),
    dataviewField('dueDate', 'due:: *(\\d{4}-\\d{2}-\\d{2})'),
    dataviewField('scheduledDate', 'scheduled:: *(\\d{4}-\\d{2}-\\d{2})'),
    dataviewField('startDate', 'start:: *(\\d{4}-\\d{2}-\\d{2})'),
    dataviewField('createdDate', 'created:: *(\\d{4}-\\d{2}-\\d{2})'),
    dataviewField('recurrence', 'repeat:: *([a-zA-Z0-9, !]+)'),
    dataviewField('onCompletion', 'onCompletion:: *([a-zA-Z]+)'),
    { kind: 'tag', regex: /(?:^|\s+)#[^ !@#$%^&*(),.?":{}|<>]+$/u },
    dataviewField('id', 'id:: *([a-zA-Z0-9-_]+)'),
    dataviewField('dependsOn', 'dependsOn:: *([a-zA-Z0-9-_]+(?: *, *[a-zA-Z0-9-_]+)*)'),
]);

class Refused extends Error {}

function refuse(message) {
    throw new Refused(message);
}

function readSettingsFile(vault, value, option) {
    if (value === undefined) return null;
    const file = resolveContainedFile(vault, value, option);
    const settings = readJson(file, null);
    if (settings === null || typeof settings !== 'object' || Array.isArray(settings)) {
        throw new Error(`${option} must contain one JSON object: ${file}`);
    }
    return { file, settings };
}

function booleanValue(value, option, fallback) {
    if (value === undefined) return fallback;
    if (value === 'true') return true;
    if (value === 'false') return false;
    throw new Error(`${option} must be true or false`);
}

function taskStatuses(settings) {
    const statusSettings = settings?.statusSettings;
    return [
        ...(Array.isArray(statusSettings?.coreStatuses) ? statusSettings.coreStatuses : []),
        ...(Array.isArray(statusSettings?.customStatuses) ? statusSettings.customStatuses : []),
    ];
}

function statusDoneSymbol(settings) {
    const statuses = taskStatuses(settings);
    const done = statuses.find(status => status?.type === 'DONE');
    return done?.symbol ?? done?.indicator ?? 'x';
}

function tasksContext(args, loaded) {
    const settings = loaded?.settings ?? {};
    if (settings.globalFilter !== undefined && typeof settings.globalFilter !== 'string') {
        throw new Error('Tasks data.json globalFilter must be a string');
    }
    if (settings.setDoneDate !== undefined && typeof settings.setDoneDate !== 'boolean') {
        throw new Error('Tasks data.json setDoneDate must be true or false');
    }
    const storedFormat = settings.taskFormat ?? 'tasksPluginEmoji';
    const format =
        args['tasks-format'] ??
        (storedFormat === 'tasksPluginEmoji' ? 'emoji' : storedFormat === 'dataview' ? 'dataview' : storedFormat);
    if (!TASK_FORMATS.includes(format)) {
        throw new Error(
            `the Tasks format ${JSON.stringify(format)} is not supported; expected emoji or dataview`,
        );
    }
    return {
        enabled: Boolean(args['tasks-emoji']),
        file: loaded?.file ?? null,
        format,
        globalFilter: args['global-filter'] ?? settings.globalFilter ?? '',
        setDoneDate: booleanValue(
            args['tasks-set-done-date'],
            '--tasks-set-done-date',
            settings.setDoneDate ?? true,
        ),
        doneChar: statusDoneSymbol(settings),
        statuses: taskStatuses(settings),
        recurrenceOnNextLine: Boolean(settings.recurrenceOnNextLine),
    };
}

function validateExpectedSha(value, actual, label = 'input') {
    if (value === undefined) return;
    const option = label === 'input' ? '--expect-sha256' : '--expect-output-sha256';
    if (!/^[a-f0-9]{64}$/i.test(value)) throw new Error(`${option} must be 64 hexadecimal characters`);
    if (value.toLowerCase() !== actual) {
        refuse(
            `the reviewed ${label} SHA-256 was ${value.toLowerCase()}, but this run computed ${actual}; nothing was written`,
        );
    }
}

function looksLikeBoard(text) {
    const match = text.match(/---\s+([\w\W]+?)\s+---/);
    return Boolean(match && match[1].includes('kanban-plugin'));
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
    if (args['block-id'] && args.index !== undefined) {
        throw new Error('--block-id and --index select the same card in two ways; give one');
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

/**
 * A card the operation did not touch keeps its bytes.
 *
 * Re-rendering every card in an edited lane would also normalise indentation and bullet markers the
 * caller never asked to change. A card still carrying its source lines is spliced back verbatim;
 * only a card this run modified — which `modifiedCard` marks by dropping them — is re-rendered.
 */
function renderLane(lane, cards, useTab) {
    return cards.flatMap(card =>
        card.sourceLines ? card.sourceLines : cardToMd(card, useTab).split('\n'),
    );
}

/** A card whose text or state this tool changed no longer matches its bytes on disk. */
function modifiedCard(card, patch) {
    const next = { ...card, ...patch };
    delete next.sourceLines;
    return next;
}

function laneEdit(board, lane, cards, useTab) {
    const region = laneCardRegion(board, lane);
    const lines = renderLane(lane, cards, useTab);
    if (region.empty && region.needsBlank && lines.length) lines.unshift('');
    return { start: region.start, end: region.end, replacement: lines };
}

/** Where an archived card is appended, creating the archive section when the board has none. */
function archiveEdit(board, cards, useTab, markers) {
    const rendered = cards.flatMap(card =>
        card.sourceLines ? card.sourceLines : cardToMd(card, useTab).split('\n'),
    );
    if (board.archiveBlock) {
        return {
            start: board.archiveBlock.listStartLine,
            end: board.archiveBlock.listEndLine + 1,
            replacement: rendered,
        };
    }
    // The archive goes between the last lane and the settings block, which is where the plugin
    // emits it, at the line where the parser says the body ends. Re-scanning the lines for the marker text
    // would match a card that merely mentions it, and splice the archive into the middle of a card.
    const line = board.bodyEndLine;
    return {
        start: line,
        end: line,
        replacement: ['***', '', `## ${markers.archive}`, '', ...rendered, ''],
    };
}

/**
 * Add or refresh the imitated completion date on the card's first line — the only line Tasks ever
 * sees. A date already there is replaced with the new one, which is what a real toggle does; a date
 * on a continuation line is invisible to Tasks and is left alone.
 */
function doneDateText(format, stamp) {
    return format === 'dataview' ? `  [completion:: ${stamp}]` : ` ✅ ${stamp}`;
}

/**
 * Peel the suffix fields in the same repeated order as Tasks' serializer parser.
 *
 * Every upstream field regex is end-anchored. After one field is removed, parsing starts again, so
 * a done date may be followed by another recognised field even though a look at the raw line would
 * not find it at `$`. Keeping each raw suffix lets this tool remove only the field it changes while
 * leaving the other user-authored bytes in their original order.
 */
function trailingTaskMetadata(line, format) {
    const definitions = format === 'dataview' ? DATAVIEW_METADATA : EMOJI_METADATA;
    const fields = [];
    let description = line;
    let runs = 0;
    let matched;
    do {
        matched = false;
        for (const definition of definitions) {
            const match = definition.regex.exec(description);
            if (!match) continue;
            fields.push({
                kind: definition.kind,
                value: match.slice(1).find(value => value !== undefined) ?? null,
                raw: match[0],
            });
            description = description.slice(0, match.index);
            matched = true;
        }
        runs += 1;
    } while (matched && runs <= 20);
    return { description: description.trimEnd(), fields };
}

function withoutMetadataKind(line, format, kind) {
    const parsed = trailingTaskMetadata(line, format);
    if (!parsed.fields.some(field => field.kind === kind)) return line;
    const suffix = [...parsed.fields]
        .reverse()
        .filter(field => field.kind !== kind)
        .map(field => field.raw)
        .join('');
    return `${parsed.description}${suffix}`.trim();
}

function withDoneDate(titleRaw, stamp, format) {
    const lines = titleRaw.split('\n');
    const rendered = doneDateText(format, stamp);
    lines[0] = `${withoutMetadataKind(lines[0], format, 'doneDate')}${rendered}`;
    return lines.join('\n');
}

function withoutDoneDate(titleRaw, format) {
    const lines = titleRaw.split('\n');
    lines[0] = withoutMetadataKind(lines[0], format, 'doneDate');
    return lines.join('\n');
}

function hasRecurrence(card, task) {
    const first = card.titleRaw.split('\n')[0];
    return trailingTaskMetadata(first, task.format).fields.some(field => field.kind === 'recurrence');
}

function hasOnCompletionDelete(card, task) {
    const first = card.titleRaw.split('\n')[0];
    return trailingTaskMetadata(first, task.format).fields.some(
        field => field.kind === 'onCompletion' && field.value?.toLowerCase() === 'delete',
    );
}

function guardRecurrence(card, args, effects, task) {
    if (!hasRecurrence(card, task)) return;
    if (!args['allow-lossy-recurrence'] && !args['allow-recurrence']) {
        refuse(
            'this card carries a recurrence rule; Tasks creates the next occurrence and the exact two-card placement depends on recurrenceOnNextLine. Use Obsidian, or explicitly accept loss with --allow-lossy-recurrence.',
        );
    }
    effects.push(
        `lossy override: Tasks would also create the next occurrence (${task.recurrenceOnNextLine ? 'on the next line' : 'before the completed one'}), and this tool did not`,
    );
    if (args['allow-recurrence']) effects.push('--allow-recurrence is deprecated; use --allow-lossy-recurrence');
}

/**
 * A card whose first line lacks the vault's Tasks global filter never parses as a task: Tasks only
 * swaps the status symbol and writes no completion date. `--global-filter` models that; without it
 * the tool imitates the default empty filter, and says so in the assumptions.
 */
function passesGlobalFilter(card, task) {
    const filter = task.globalFilter;
    return !filter || card.titleRaw.split('\n')[0].includes(filter);
}

function noteBlockIdDeviation(card, effects) {
    if (!card.blockId) return;
    effects.push(
        `preserved block id ^${card.blockId} deliberately; the pinned Kanban-to-Tasks path reconstructs the first line without it and drops it, which this safety-oriented tool does not imitate`,
    );
}

function nextTasksStatusSymbol(card, task) {
    const current = task.statuses.find(
        status => (status?.symbol ?? status?.indicator) === card.checkChar,
    );
    const next = current?.nextStatusSymbol ?? current?.nextStatusIndicator ?? ' ';
    if (typeof next !== 'string' || [...next].length !== 1) {
        refuse(`Tasks status ${JSON.stringify(card.checkChar)} has no single-character nextStatusSymbol`);
    }
    return next;
}

function completeCard(card, args, effects, doneChar, stamp, task) {
    const next = modifiedCard(card, { checked: true, checkChar: doneChar });
    if (task.enabled) {
        noteBlockIdDeviation(card, effects);
        if (!passesGlobalFilter(card, task)) {
            effects.push(
                `the card's first line does not carry the Tasks global filter ${JSON.stringify(task.globalFilter)}, so Tasks would only change the check character; no completion date was written`,
            );
        } else {
            guardRecurrence(card, args, effects, task);
            if (hasOnCompletionDelete(card, task) && !hasRecurrence(card, task)) {
                effects.push(
                    'Tasks onCompletion=delete returns an empty replacement; Kanban falls back to changing only the check character, so no completion metadata was written',
                );
            } else if (task.setDoneDate) {
                next.titleRaw = withDoneDate(card.titleRaw, stamp.slice(0, 10), task.format);
                effects.push(
                    `stamped the Tasks completion date as ${JSON.stringify(doneDateText(task.format, stamp.slice(0, 10)).trim())}`,
                );
            } else {
                next.titleRaw = withoutDoneDate(card.titleRaw, task.format);
                effects.push('Tasks setDoneDate is off, so completion metadata was not written');
            }
        }
    } else {
        effects.push(
            'no completion date was written: without the Tasks plugin the Kanban plugin only changes the check character',
        );
    }
    effects.push(`set the check character to ${JSON.stringify(doneChar)}`);
    return next;
}

function uncompleteCard(card, args, effects, task) {
    const nextChar = task.enabled ? nextTasksStatusSymbol(card, task) : ' ';
    const next = modifiedCard(card, { checked: !/^[ \t]$/.test(nextChar), checkChar: nextChar });
    if (task.enabled) {
        noteBlockIdDeviation(card, effects);
        if (!passesGlobalFilter(card, task)) {
            effects.push(
                `the card's first line does not carry the Tasks global filter ${JSON.stringify(task.globalFilter)}, so Tasks would only change the check character; the completion date was left in place`,
            );
        } else {
            next.titleRaw = withoutDoneDate(card.titleRaw, task.format);
            effects.push('removed the Tasks completion date');
        }
    } else if (
        ['emoji', 'dataview'].some(format =>
            trailingTaskMetadata(card.titleRaw.split('\n')[0], format).fields.some(
                field => field.kind === 'doneDate',
            ),
        )
    ) {
        effects.push(
            'a completion date is still in the card text: without the Tasks plugin the Kanban plugin never removes it',
        );
    }
    effects.push(`set the check character to ${JSON.stringify(nextChar)}`);
    return next;
}

/**
 * The moment tokens an archive timestamp needs, and nothing more.
 *
 * The board's `archive-date-format` is a moment format string. Implementing all of moment would be
 * guessing at a library the pin does not vendor, so exactly these tokens are rendered — year,
 * month, day, hour, minute, second, one- or two- or four-digit, plus `[literal]` escapes — and any
 * other alphabetic token is refused so the caller decides, via --archive-stamp, instead of this
 * tool writing a stamp the plugin would not have written.
 */
const STAMP_TOKENS = ['YYYY', 'YY', 'MM', 'M', 'DD', 'D', 'HH', 'H', 'mm', 'm', 'ss', 's'];

function formatStamp(format, stamp) {
    const [date, time] = stamp.split(' ');
    const [year, month, day] = date.split('-').map(Number);
    const [hour, minute, second] = time.split(':').map(Number);
    const pad = value => String(value).padStart(2, '0');
    const values = {
        YYYY: String(year),
        YY: pad(year % 100),
        MM: pad(month),
        M: String(month),
        DD: pad(day),
        D: String(day),
        HH: pad(hour),
        H: String(hour),
        mm: pad(minute),
        m: String(minute),
        ss: pad(second),
        s: String(second),
    };
    let out = '';
    let index = 0;
    while (index < format.length) {
        if (format[index] === '[') {
            const close = format.indexOf(']', index);
            if (close === -1) return null;
            out += format.slice(index + 1, close);
            index = close + 1;
            continue;
        }
        const token = STAMP_TOKENS.find(candidate => format.startsWith(candidate, index));
        if (token) {
            out += values[token];
            index += token.length;
            continue;
        }
        if (/[A-Za-z]/.test(format[index])) return null;
        out += format[index];
        index += 1;
    }
    return out;
}

/** The format the plugin would compile for this board's archive timestamp. */
function archiveDateFormat(board) {
    return (
        board.effectiveSettings['archive-date-format'] ??
        `${board.effectiveSettings['date-format']} ${board.effectiveSettings['time-format']}`
    );
}

function stampArchiveDate(titleRaw, board, args, stamp) {
    if (!board.effectiveSettings['archive-with-date']) return { titleRaw, note: null };
    let text;
    let source;
    if (args['archive-stamp'] !== undefined) {
        text = args['archive-stamp'];
        source = 'the caller-supplied --archive-stamp';
    } else {
        const format = archiveDateFormat(board);
        text = formatStamp(format, stamp);
        if (text === null) {
            refuse(
                `the board's archive timestamp format ${JSON.stringify(format)} uses moment tokens this tool does not implement; pass --archive-stamp with the pre-formatted text instead`,
            );
        }
        source = `the board's format ${JSON.stringify(format)}`;
    }
    const separator = board.effectiveSettings['archive-date-separator'] ?? '';
    const parts = [text];
    if (separator) parts.push(separator);
    parts.push(titleRaw);
    if (board.effectiveSettings['append-archive-date']) parts.reverse();
    return { titleRaw: parts.join(' '), note: `stamped the archive date ${JSON.stringify(text)} using ${source}` };
}

function defaultStamp(args) {
    if (args.now) {
        if (!/^\d{4}-\d{2}-\d{2}( \d{2}:\d{2}(:\d{2})?)?$/.test(args.now)) {
            throw new Error('--now must be YYYY-MM-DD, "YYYY-MM-DD HH:mm", or "YYYY-MM-DD HH:mm:ss"');
        }
        if (args.now.length === 10) return `${args.now} 00:00:00`;
        return args.now.length === 16 ? `${args.now}:00` : args.now;
    }
    const now = new Date();
    const pad = value => String(value).padStart(2, '0');
    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
}

function assumedVaultDateDefaults(board, globalSettings = {}, args = {}) {
    const candidates = [
        ['date-format', 'vault-date-format', 'YYYY-MM-DD'],
        ['time-format', 'vault-time-format', 'HH:mm'],
    ];
    return candidates
        .filter(
            ([setting, option]) =>
                board.settings[setting] === undefined &&
                globalSettings[setting] === undefined &&
                args[option] === undefined,
        )
        .map(([setting, , fallback]) => `${setting}=${fallback}`);
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
    const kanbanData = readSettingsFile(vault, args['kanban-data'], '--kanban-data');
    const tasksData = readSettingsFile(vault, args['tasks-data'], '--tasks-data');
    const task = tasksContext(args, tasksData);
    const locale = args.locale ?? 'en';
    const markers = markersFor(locale);
    const original = readRaw(file);
    const snapshot = fingerprintFile(file, original);
    validateExpectedSha(args['expect-sha256'], snapshot.sha256);
    if (!looksLikeBoard(original)) {
        refuse('the file is not a Kanban board by the plugin\'s own frontmatter substring test');
    }
    const { eol, trailingNewline } = detectEol(original);
    const parseOptions = {
        locale,
        globalSettings: kanbanData?.settings,
        vaultDateFormat: args['vault-date-format'],
        vaultTimeFormat: args['vault-time-format'],
    };
    const board = parseBoard(original, parseOptions);

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
        return {
            operation,
            board,
            changed: false,
            inventory: { inputSha256: snapshot.sha256, ...describeBoard(board) },
            effects: [],
            snapshot,
        };
    }

    const useTab = inferUseTab(board);
    const doneChar = args['done-char'] ?? (task.enabled ? task.doneChar : 'x');
    if ([...doneChar].length !== 1) throw new Error('--done-char must be exactly one Unicode character');
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
                moved = completeCard(card, args, effects, doneChar, stamp, task);
            } else {
                moved = uncompleteCard(card, args, effects, task);
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
                ? completeCard(card, args, effects, doneChar, stamp, task)
                : uncompleteCard(card, args, effects, task);
        const cards = [...lane.cards];
        cards[index] = next;
        edits.push(laneEdit(board, lane, cards, useTab));
    }

    if (operation === 'edit') {
        if (args.text === undefined) throw new Error('--text is required for edit');
        const { lane, card, index } = findCard(board, args);
        const cards = [...lane.cards];
        cards[index] = modifiedCard(card, { titleRaw: args.text });
        effects.push('replaced the card text; the check character and block id are kept');
        edits.push(laneEdit(board, lane, cards, useTab));
    }

    if (operation === 'set-date' || operation === 'set-time') {
        const { lane, card, index } = findCard(board, args);
        const trigger =
            operation === 'set-date'
                ? board.effectiveSettings['date-trigger']
                : board.effectiveSettings['time-trigger'];
        const value = operation === 'set-date' ? args.date : args.time;
        if (value === undefined) throw new Error(`--${operation === 'set-date' ? 'date' : 'time'} is required`);
        if (operation === 'set-date' && board.effectiveSettings['link-date-to-daily-note']) {
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
        cards[index] = modifiedCard(card, { titleRaw: lines.join('\n') });
        effects.push(`wrote ${trigger}{${value}} using the board's own trigger`);
        edits.push(laneEdit(board, lane, cards, useTab));
    }

    if (operation === 'archive' || operation === 'remove') {
        const { lane, card, index } = findCard(board, args);
        const cards = [...lane.cards];
        cards.splice(index, 1);
        edits.push(laneEdit(board, lane, cards, useTab));
        if (operation === 'archive') {
            const stamped = stampArchiveDate(card.titleRaw, board, args, stamp);
            if (stamped.note) effects.push(stamped.note);
            else effects.push('the board does not stamp archived cards, so the text is unchanged');
            const archivedCard =
                stamped.titleRaw === card.titleRaw ? card : modifiedCard(card, { titleRaw: stamped.titleRaw });
            const archived = [...board.archive, archivedCard];
            effects.push('appended to the end of the archive, which is where archiving one card puts it');
            const maxArchive = board.effectiveSettings['max-archive-size'];
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
        const reparsed = parseBoard(updated, parseOptions);
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

    // Every strategy gets the same postcondition: the bytes being proposed must still be a board the
    // port can model. This catches a malformed edit before the compare-and-swap ever reaches disk.
    const validated = parseBoard(updated, parseOptions);
    const postcondition = blockingProblems(validated);
    if (postcondition.length) {
        refuse(
            `the proposed result does not parse safely: ${postcondition
                .map(item => `${item.kind}${item.line ? ` at line ${item.line}` : ''}`)
                .join('; ')}`,
        );
    }

    return {
        operation,
        board,
        changed: updated !== original,
        original,
        updated,
        file,
        effects,
        snapshot,
        kanbanData,
        tasksData,
        task,
    };
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

function availableBackup(file) {
    let candidate = `${file}.bak`;
    let index = 1;
    while (fs.existsSync(candidate)) candidate = `${file}.bak.${index++}`;
    return candidate;
}

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
 * The replacement is staged and synced before the recovery copy is created, so a staging failure
 * does not leave an unexplained backup for a write that never became ready. A second comparison
 * follows the backup, then the board is atomically renamed, read back, and read again after a settle
 * window longer than Obsidian's save debounce.
 */
async function commit(result, args) {
    const backups = [];
    const current = fingerprintFile(result.file, readRaw(result.file));
    if (!sameFingerprint(current, result.snapshot)) {
        refuse(
            'the board changed on disk while this edit was being computed, so nothing was written; re-read the board and try again',
        );
    }
    const staged = `${result.file}.kanban-card-${process.pid}-${crypto.randomBytes(6).toString('hex')}.tmp`;
    try {
        const mode = fs.statSync(result.file).mode & 0o777;
        const descriptor = fs.openSync(staged, 'wx', mode);
        try {
            fs.writeFileSync(descriptor, result.updated);
            fs.fsyncSync(descriptor);
        } finally {
            fs.closeSync(descriptor);
        }
        if (!sameFingerprint(fingerprintFile(result.file, readRaw(result.file)), result.snapshot)) {
            refuse('the board changed while the replacement was being staged, so nothing was written');
        }
        if (!args['no-backup']) {
            const backup = availableBackup(result.file);
            fs.writeFileSync(backup, result.original, { flag: 'wx', mode });
            backups.push(backup);
        }
        if (!sameFingerprint(fingerprintFile(result.file, readRaw(result.file)), result.snapshot)) {
            refuse(
                `the board changed immediately before its atomic replace, so nothing was written${
                    backups.length ? `; the bytes this run reviewed are in ${backups[0]}` : ''
                }`,
            );
        }
        try {
            fs.renameSync(staged, result.file);
        } catch (error) {
            refuse(
                `the staged board could not replace the original: ${error.message}${
                    backups.length ? `; the previous contents are in ${backups[0]}` : ''
                }`,
            );
        }
    } finally {
        if (fs.existsSync(staged)) fs.unlinkSync(staged);
    }

    const afterWrite = readRaw(result.file);
    if (afterWrite !== result.updated) {
        refuse(
            `the write did not survive: ${result.file} already holds different bytes${
                backups.length ? `; the previous contents are in ${backups[0]}` : ''
            }`,
        );
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
    const method = board.effectiveSettings['new-card-insertion-method'];
    if (method === 'prepend' || method === 'prepend-compact') return 'top';
    return 'bottom';
}

async function main() {
    let args;
    try {
        args = parseArgs(process.argv.slice(2), {
            booleans: [
                'help',
                'write',
                'tasks-emoji',
                'allow-recurrence',
                'allow-lossy-recurrence',
                'no-backup',
            ],
            values: [
                'board',
                'vault',
                'kanban-data',
                'vault-date-format',
                'vault-time-format',
                'lane',
                'index',
                'block-id',
                'to-lane',
                'to-index',
                'text',
                'position',
                'via',
                'done-char',
                'tasks-data',
                'tasks-format',
                'tasks-set-done-date',
                'global-filter',
                'now',
                'archive-stamp',
                'date',
                'time',
                'locale',
                'strategy',
                'expect-sha256',
                'expect-output-sha256',
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
        const outputSha256 = crypto.createHash('sha256').update(result.updated).digest('hex');
        validateExpectedSha(args['expect-output-sha256'], outputSha256, 'output');
        if (!result.changed) {
            process.stdout.write('nothing to change\n');
            process.exitCode = EXIT.findings;
            return;
        }
        const diff = unifiedDiff(result.original, result.updated, path.basename(result.file));
        let commitment = null;
        if (args.write) {
            try {
                commitment = await commit(result, args);
            } catch (error) {
                if (error instanceof Refused) throw error;
                refuse(`the atomic write could not be completed: ${error.message}`);
            }
        }
        const assumptions = [
            'Whether a completion date appears at all depends on the Tasks plugin being installed in this vault, which cannot be read from the board file.',
            'Structural markers were read for the given language, which is the language Obsidian was running in when the board was last saved.',
            'Obsidian holds no lock on a board and detects no conflict: an open board rewrites the file from memory, with no user action, seconds after any change.',
        ];
        if (result.task.enabled) {
            assumptions.push(
                `Tasks emulation used the ${result.task.format} metadata format, ${result.task.setDoneDate ? 'with' : 'without'} automatic done dates, and done symbol ${JSON.stringify(result.task.doneChar)}.`,
            );
        }
        if (result.kanbanData) {
            assumptions.push(`Kanban global settings were read from ${result.kanbanData.file}.`);
        } else {
            assumptions.push(
                "No Kanban data.json was supplied: an inherited insertion method, archive cap, trigger or format is invisible; pass --kanban-data to resolve it.",
            );
        }
        if (result.tasksData) {
            assumptions.push(`Tasks settings were read from ${result.tasksData.file}.`);
        }
        if (result.task.enabled && !result.tasksData && args['global-filter'] === undefined) {
            assumptions.push(
                'No Tasks global filter was declared: with a filter configured in the vault, Tasks writes no completion date on a card that lacks it — pass --global-filter to model that.',
            );
        }
        const assumedFormats = assumedVaultDateDefaults(
            result.board,
            result.kanbanData?.settings,
            args,
        );
        if (assumedFormats.length) {
            assumptions.push(
                `Vault date and time defaults can come from Daily Notes, Natural Language Dates or Templates; stock ${assumedFormats.join(' and ')} ${assumedFormats.length === 1 ? 'was' : 'were'} used. Pass the corresponding --vault-date-format or --vault-time-format to bind them.`,
            );
        }
        const limitations = [
            'The tool cannot detect whether this board is open in Obsidian; the settle window catches only an overwrite that lands before it ends.',
            'A recurring Tasks toggle creates another card. Exact recurrence is refused; --allow-lossy-recurrence intentionally omits that card.',
            'Archive timestamps implement a documented subset of moment tokens; --archive-stamp is required for any other format.',
            'Agent behaviour is not evaluated here or anywhere: this report says nothing about clean-context triggering or routing.',
        ];
        if (format === 'json') {
            process.stdout.write(
                `${JSON.stringify(
                    {
                        operation: result.operation,
                        written: Boolean(args.write),
                        inputSha256: result.snapshot.sha256,
                        outputSha256,
                        backups: commitment?.backups ?? [],
                        settleSeconds: commitment?.settle ?? null,
                        effects: result.effects,
                        assumptions,
                        limitations,
                        diff,
                    },
                    null,
                    2,
                )}\n`,
            );
        } else {
            process.stdout.write(diff);
            process.stdout.write(`\ninput SHA-256: ${result.snapshot.sha256}\n`);
            process.stdout.write(`proposed output SHA-256: ${outputSha256}\n`);
            process.stdout.write('\nmechanics applied:\n');
            for (const effect of result.effects) process.stdout.write(`- ${effect}\n`);
            process.stdout.write('\nassumptions:\n');
            for (const item of assumptions) process.stdout.write(`- ${item}\n`);
            process.stdout.write('\nlimitations:\n');
            for (const item of limitations) process.stdout.write(`- ${item}\n`);
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
                process.stdout.write(
                    `\nnothing was written; re-run with --write --expect-sha256 ${result.snapshot.sha256} --expect-output-sha256 ${outputSha256} to apply exactly this reviewed proposal\n`,
                );
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
