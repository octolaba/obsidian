#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
    BOARD_FORMATS,
    LOCALE_MARKERS,
    SETTING_KEYS,
    classifyDrift,
    inferUseTab,
    markersFor,
    parseBoard,
    plainText,
    serializeBoard,
} from './board.mjs';
import {
    EXIT,
    assertFormat,
    buildReport,
    emitReport,
    exitCodeFor,
    makeFinding,
    markdownFiles,
    parseArgs,
    readRaw,
    relativeTo,
    resolveContainedFile,
    resolveDirectory,
    writeUsageError,
} from './lib.mjs';

const USAGE = [
    'usage: kanban-board-lint.mjs --vault PATH [--file PATH]... [--locale CODE] [--format text|json|sarif]',
    '',
    '  --vault PATH     vault root to scan for Kanban boards (required)',
    '  --file PATH      limit the scan to one board; repeatable; must be inside the vault',
    '  --locale CODE    the Obsidian UI language the board was written under (default: en); a',
    '                   language the plugin does not translate falls back to the English markers',
    '  --format FORMAT  text (default), json, or sarif',
    '  -h, --help       print this message',
].join('\n');

/**
 * The rule table.
 *
 * Every rule declares two things it cannot choose freely: the pinned line it is written on, and what
 * actually happens to the board. The severity is derived from the consequence rather than picked, so
 * a rule can never be made louder than what it costs the user, and two rules with the same
 * consequence can never disagree about how serious they are. `verify.mjs` re-derives every severity
 * and re-resolves every citation against the pin.
 */
export const RULES = {
    KB001: {
        consequence: 'board-does-not-load',
        confidence: 'high',
        cite: 'kanban: src/parsers/parseMarkdown.ts:27',
        message: 'The file does not begin with `---`, so the plugin throws before reading the board.',
        fix: 'Move the YAML frontmatter to the very start of the file; nothing may precede it, not even a blank line.',
    },
    KB002: {
        consequence: 'board-does-not-load',
        confidence: 'high',
        cite: 'kanban: src/parsers/parseMarkdown.ts:33',
        message: 'The frontmatter block is never closed, so the board fails to load.',
        fix: 'Close the frontmatter with a `---` line of its own.',
    },
    KB003: {
        consequence: 'board-does-not-load',
        confidence: 'medium',
        cite: 'kanban: src/parsers/parseMarkdown.ts:173',
        message: 'The frontmatter block is empty, which fails while its keys are read.',
        fix: 'Put at least `kanban-plugin: board` inside the frontmatter block.',
    },
    KB004: {
        consequence: 'board-does-not-load',
        confidence: 'high',
        cite: 'kanban: src/parsers/parseMarkdown.ts:60',
        message: 'The trailing fenced block is not valid JSON, so the whole board fails to load.',
        fix: 'Repair the JSON inside the `%% kanban:settings %%` block, or delete the block and let the plugin rewrite it.',
    },
    KB005: {
        consequence: 'content-lost',
        confidence: 'high',
        cite: 'kanban: src/parsers/parseMarkdown.ts:55',
        message: 'Content after the settings block makes the settings unreadable, and the next save discards every board-local setting.',
        fix: 'Move that content above the `%% kanban:settings %%` block; only backticks, percent signs and line breaks may follow it.',
    },
    KB006: {
        consequence: 'informational',
        confidence: 'high',
        cite: 'kanban: src/parsers/common.ts:29',
        message: 'The board has no settings block; the plugin appends one on its first save.',
        fix: 'Nothing to do unless board-local settings are wanted.',
    },
    KB007: {
        consequence: 'meaning-differs',
        confidence: 'medium',
        cite: 'kanban: src/parsers/parseMarkdown.ts:59',
        message: 'A trailing fenced block is read as board settings even though the `%% kanban:settings` marker is missing.',
        fix: 'Add the `%% kanban:settings` line above the fence, or move the code block so it is not the last thing in the file.',
    },
    KB008: {
        consequence: 'board-does-not-load',
        confidence: 'high',
        cite: 'kanban: src/helpers.ts:52',
        message: 'The frontmatter does not mention `kanban-plugin`, so Obsidian will not open this note as a board.',
        fix: 'Add `kanban-plugin: board` to the frontmatter.',
    },
    KB009: {
        consequence: 'bytes-change-on-save',
        confidence: 'high',
        cite: 'kanban: src/parsers/parseMarkdown.ts:175',
        message: 'The legacy `basic` format is rewritten to `board` on the next save, in both the frontmatter and the settings block.',
        fix: 'Set `kanban-plugin: board` now if the rewrite should not arrive as a surprise diff.',
    },
    KB010: {
        consequence: 'meaning-differs',
        confidence: 'medium',
        cite: 'kanban: src/Settings.ts:50',
        message: 'The `kanban-plugin` value is not one the plugin recognises.',
        fix: `Use one of ${BOARD_FORMATS.join(', ')}.`,
    },
    KB011: {
        consequence: 'content-lost',
        confidence: 'high',
        cite: 'kanban: src/parsers/formats/list.ts:250',
        message: 'This content is not part of any lane or card, and the next save deletes it.',
        fix: 'Move it into a card, or keep it in a different note; the board model can only carry lanes, cards, the archive and the settings block.',
    },
    KB012: {
        consequence: 'content-lost',
        confidence: 'high',
        cite: 'kanban: src/parsers/helpers/ast.ts:57',
        message: 'Only the first list under a lane heading becomes cards; these items belong to a second list and are dropped.',
        fix: 'Use the same bullet character for every card in a lane, and do not separate them with a paragraph.',
    },
    KB013: {
        consequence: 'content-lost',
        confidence: 'high',
        cite: 'kanban: src/parsers/formats/list.ts:267',
        message: 'A complete marker placed after the cards is ignored, and the next save deletes the line together with the lane\'s complete flag.',
        fix: 'Put the marker on its own line between the lane heading and the first card.',
    },
    KB014: {
        consequence: 'meaning-differs',
        confidence: 'high',
        cite: 'kanban: src/parsers/formats/list.ts:276',
        message: 'An archive heading with no cards under it is not recognised as the archive and becomes an ordinary lane.',
        fix: 'Delete the empty archive section, or put at least one card in it.',
    },
    KB015: {
        consequence: 'bytes-change-on-save',
        confidence: 'high',
        cite: 'kanban: src/parsers/common.ts:24',
        message: 'The archive separator is accepted but rewritten as `***` on the next save.',
        fix: 'Write the separator as `***` to keep the file stable.',
    },
    KB016: {
        consequence: 'bytes-change-on-save',
        confidence: 'high',
        cite: 'kanban: src/parsers/formats/list.ts:410',
        message: 'Lane headings are always rewritten as level two, whatever level they are written at.',
        fix: 'Use `## ` for lane headings.',
    },
    KB017: {
        consequence: 'bytes-change-on-save',
        confidence: 'high',
        cite: 'kanban: src/parsers/formats/list.ts:404',
        message: 'Cards are always rewritten with a `-` bullet, so another list marker does not survive a save.',
        fix: 'Use `- ` for cards.',
    },
    KB018: {
        consequence: 'meaning-differs',
        confidence: 'high',
        cite: 'kanban: src/parsers/extensions/taskList.ts:79',
        message: 'A checked box with no text is not a task at all; the next save turns it into an unchecked card whose text is the box.',
        fix: 'Give the card some text, or delete it.',
    },
    KB019: {
        consequence: 'bytes-change-on-save',
        confidence: 'high',
        cite: 'kanban: src/parsers/formats/list.ts:404',
        message: 'A list item with no checkbox gains one on the next save.',
        fix: 'Write cards as `- [ ] text` to keep the file stable.',
    },
    KB020: {
        consequence: 'meaning-differs',
        confidence: 'high',
        cite: 'kanban: src/parsers/helpers/parser.ts:57',
        message: 'A continuation line indented by something other than one tab or four spaces keeps that indentation inside the card text.',
        fix: 'Indent continuation lines with a single tab, or with exactly four spaces.',
    },
    KB021: {
        consequence: 'bytes-change-on-save',
        confidence: 'high',
        cite: 'kanban: src/helpers.ts:66',
        message: 'A `(0)` work-in-progress limit means no limit, and the next save deletes it from the lane title.',
        fix: 'Remove the `(0)`, or give the lane a real limit.',
    },
    KB022: {
        consequence: 'meaning-differs',
        confidence: 'medium',
        cite: 'kanban: src/parsers/helpers/parser.ts:63',
        message: 'A lane title ending in a parenthesised number is read as a work-in-progress limit, not as part of the title.',
        fix: 'If the number is part of the name, move it or rephrase the title.',
    },
    KB023: {
        consequence: 'meaning-differs',
        confidence: 'high',
        cite: 'kanban: src/helpers/boardModifiers.ts:276',
        message: 'Two cards carry the same block id; duplicating a card copies it, and both are written back.',
        fix: 'Delete the block id from the duplicate card; duplicating a card copies its block id.',
    },
    KB024: {
        consequence: 'meaning-differs',
        confidence: 'medium',
        cite: 'kanban: src/parsers/helpers/parser.ts:51',
        message: 'This block id contains characters the plugin will not strip back out of the card text, so it can be duplicated on the next save.',
        fix: 'Use only letters, digits and hyphens in a block id.',
    },
    KB025: {
        consequence: 'content-lost',
        confidence: 'high',
        cite: 'kanban: src/lang/helpers.ts:61',
        message: 'A structural marker is written in a different language than the one given, so it stops being recognised when Obsidian runs in that language.',
        fix: 'Open the board once in the language it was written in, or rewrite the marker in the target language.',
    },
    KB026: {
        consequence: 'content-lost',
        confidence: 'high',
        cite: 'kanban: src/lang/helpers.ts:53',
        message: 'Structural markers in this board come from more than one language, so no single Obsidian language recognises all of them.',
        fix: 'Rewrite every marker in one language.',
    },
    KB027: {
        consequence: 'informational',
        confidence: 'high',
        cite: 'kanban: src/components/Lane/LaneTitle.tsx:40',
        message: 'The lane holds more cards than its work-in-progress limit; the limit only styles the counter, and no code path consults it before a card is inserted.',
        fix: 'Move cards out of the lane, or raise the limit.',
    },
    KB028: {
        consequence: 'content-lost',
        confidence: 'high',
        cite: 'kanban: src/components/Kanban.tsx:153',
        message: 'The archive is longer than the board allows, so opening it deletes cards from the front of the archive without asking; archiving a whole lane puts its cards there.',
        fix: 'Raise or remove `max-archive-size`, or move the archived cards elsewhere first.',
    },
    KB029: {
        consequence: 'meaning-differs',
        confidence: 'high',
        cite: 'kanban: src/parsers/parseMarkdown.ts:178',
        message: 'A Kanban setting written in the YAML frontmatter is moved into the settings block on the next save and disappears from the YAML.',
        fix: 'Put board-local settings in the `%% kanban:settings %%` block instead.',
    },
    KB030: {
        consequence: 'meaning-differs',
        confidence: 'medium',
        cite: 'kanban: src/helpers/boardModifiers.ts:99',
        message: 'The `list-collapse` array does not have one entry per lane, so collapsed state applies to the wrong lanes.',
        fix: 'Delete `list-collapse` from the settings block and let the plugin rebuild it.',
    },
    KB031: {
        consequence: 'bytes-change-on-save',
        confidence: 'high',
        cite: 'kanban: src/parsers/formats/list.ts:443',
        message: 'The next save rewrites this file: blank lines and spacing differ from what the plugin emits.',
        fix: 'Nothing is lost; expect a whitespace-only diff the first time the board is touched in Obsidian.',
    },
    KB032: {
        consequence: 'content-lost',
        confidence: 'medium',
        cite: 'kanban: src/parsers/formats/list.ts:443',
        message: 'The next save changes visible content in this file.',
        fix: 'Compare the board against the serialisation the plugin would write before letting Obsidian save it.',
    },
    KB033: {
        consequence: 'bytes-change-on-save',
        confidence: 'high',
        cite: 'kanban: src/parsers/formats/list.ts:450',
        message: 'The file uses CRLF line endings; the plugin writes LF, so the whole file changes on the next save.',
        fix: 'Convert the file to LF line endings.',
    },
};

/**
 * Rules that already explain why the next save changes visible content, so the catch-all drift rule
 * would only repeat them. This is about coverage of the explanation, not about severity.
 */
const EXPLAINS_CONTENT_DRIFT = new Set(['KB009', 'KB011', 'KB012', 'KB013', 'KB018', 'KB024']);

/** `hasFrontmatterKeyRaw`: a substring test inside the first `---` … `---` region, not a YAML lookup. */
export function looksLikeBoard(text) {
    if (!text) return false;
    const match = text.match(/---\s+([\w\W]+?)\s+---/);
    if (!match) return false;
    return match[1].includes('kanban-plugin');
}

function localeOfMarker(kind, value) {
    return Object.entries(LOCALE_MARKERS)
        .filter(([, markers]) => markers[kind] === value)
        .map(([locale]) => locale);
}

export function lintBoard(relative, text, options = {}) {
    const locale = options.locale ?? 'en';
    const findings = [];
    const add = (id, line = null, note = null) =>
        findings.push(makeFinding({ ...RULES[id], id, file: relative, line, note }));

    // The board is parsed strictly for the given language, because that is the board Obsidian sees.
    // Markers written in another language are found separately and reported as such, rather than
    // being quietly understood by a validator that no running Obsidian agrees with.
    const board = parseBoard(text, { locale, acceptAnyLocaleMarker: false });

    for (const error of board.errors) {
        if (error.kind === 'frontmatter-missing') add('KB001', 1);
        if (error.kind === 'frontmatter-unterminated') add('KB002', 1);
        if (error.kind === 'settings-json-invalid') {
            add('KB004', board.settingsFooter.openFenceLine !== null ? board.settingsFooter.openFenceLine + 1 : null, error.detail);
        }
    }
    if (!board.errors.length && board.frontmatterYaml !== null && board.frontmatterYaml.trim() === '') {
        add('KB003', 1);
    }

    if (board.settingsFooter.absent) {
        if (board.settingsFooter.reason === 'no-trailing-fence' && /%%\s*kanban:settings/.test(text)) {
            add('KB005', null);
        } else {
            add('KB006', null);
        }
    } else if (!board.settingsFooter.markerPresent) {
        add('KB007', board.settingsFooter.openFenceLine + 1);
    }

    const format = board.frontmatter[Object.keys(board.frontmatter).find(key => key === 'kanban-plugin')];
    if (format === undefined) {
        add('KB008', 1);
    } else if (!BOARD_FORMATS.includes(format)) {
        add('KB010', 1, `found ${JSON.stringify(format)}`);
    }
    if (/^\s*kanban-plugin\s*:\s*basic\s*$/m.test(text) || board.settings['kanban-plugin'] === 'basic') {
        add('KB009', 1);
    }

    for (const entry of board.unrepresented) {
        add('KB011', entry.line, entry.text.trim().slice(0, 80));
    }

    // A second list under one heading is a specific, common shape of dropped content.
    for (let index = 0; index < board.blocks.length; index += 1) {
        const block = board.blocks[index];
        if (block.type !== 'list') continue;
        const previousList = board.blocks
            .slice(0, index)
            .reverse()
            .find(candidate => candidate.type === 'list' || candidate.type === 'heading');
        if (previousList?.type === 'list') add('KB012', block.startLine + 1);
    }

    // A complete marker in the requested language that no lane picked up was written in the wrong
    // place — after the cards, or outside any lane — so the plugin ignores and then deletes it.
    // Markers in another language are a different problem, reported below as a locale mismatch.
    {
        const marker = markersFor(locale).complete;
        const escaped = marker.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const pattern = new RegExp(`^\\s*(?:\\*\\*|__|\\*|_)?${escaped}(?:\\*\\*|__|\\*|_)?\\s*$`);
        board.lines.forEach((line, index) => {
            if (!pattern.test(line)) return;
            if (board.lanes.some(lane => lane.completeMarkerLine === index)) return;
            add('KB013', index + 1, marker);
        });
    }

    for (const lane of board.lanes) {
        if (lane.headingDepth !== 2) add('KB016', lane.headingLine + 1, `level ${lane.headingDepth}`);
        if (lane.listKind && lane.listKind !== '-') {
            add('KB017', lane.listStartLine + 1, `marker ${lane.listKind}`);
        }
        if (/\(0\)\s*$/.test(lane.rawTitle)) add('KB021', lane.headingLine + 1);
        if (lane.maxItems >= 100) {
            add('KB022', lane.headingLine + 1, `read as a limit of ${lane.maxItems}`);
        }
        if (lane.maxItems > 0 && lane.cards.length > lane.maxItems) {
            add('KB027', lane.headingLine + 1, `${lane.cards.length} of ${lane.maxItems}`);
        }
        // An archive section the plugin refuses to recognise because it has no cards under it: the
        // separator is there and the heading is right, but it degrades into an ordinary lane.
        if (
            plainText(lane.rawTitle) === markersFor(locale).archive &&
            !lane.cards.length &&
            board.blocks.some(
                block => block.type === 'thematicBreak' && block.endLine === lane.headingLine - 1,
            )
        ) {
            add('KB014', lane.headingLine + 1);
        }
        for (const card of lane.cards) {
            if (card.titleRaw === '[' + (card.checkChar === ' ' ? 'x' : card.checkChar) + ']' ||
                /^\[[^\s\]]\]$/.test(card.titleRaw)) {
                add('KB018', card.startLine + 1);
            }
            if (!/^\s*[-*+]\s*\[/.test(card.sourceLines[0])) add('KB019', card.startLine + 1);
            for (const line of card.sourceLines.slice(1)) {
                if (!line.trim()) continue;
                if (!/^(?:\t| {4})/.test(line)) add('KB020', card.startLine + 1, line.slice(0, 40));
            }
            if (card.blockId && !/^[a-zA-Z0-9-]+$/.test(card.blockId)) {
                add('KB024', card.startLine + 1, card.blockId);
            }
        }
    }

    const seenBlockIds = new Map();
    for (const card of [...board.lanes.flatMap(lane => lane.cards), ...board.archive]) {
        if (!card.blockId) continue;
        if (seenBlockIds.has(card.blockId)) add('KB023', card.startLine + 1, card.blockId);
        else seenBlockIds.set(card.blockId, card.startLine);
    }

    if (board.archiveBlock) {
        const separator = board.lines[board.archiveBlock.separatorLine].trim();
        if (separator !== '***') add('KB015', board.archiveBlock.separatorLine + 1, separator);
    }

    const maxArchive = board.settings['max-archive-size'];
    if (typeof maxArchive === 'number' && maxArchive >= 0 && board.archive.length > maxArchive) {
        add('KB028', null, `${board.archive.length} archived, limit ${maxArchive}`);
    }

    const collapse = board.settings['list-collapse'];
    if (Array.isArray(collapse) && collapse.length !== board.lanes.length) {
        add('KB030', null, `${collapse.length} entries for ${board.lanes.length} lanes`);
    }

    if (board.frontmatterYaml) {
        for (const key of SETTING_KEYS) {
            if (key === 'kanban-plugin') continue;
            const pattern = new RegExp(`^${key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*:`, 'm');
            if (pattern.test(board.frontmatterYaml)) add('KB029', 1, key);
        }
    }

    // Locale coherence. The parse above only recognised markers for the requested language, so the
    // raw lines are scanned here for every other language the plugin translates. A marker in the
    // wrong language is not a cosmetic problem: the plugin does not see it, and deletes it on save.
    // Distinct marker *spellings*, not locale codes: most languages leave these two keys in English,
    // so counting languages would report every ordinary board as mixed.
    const spellings = new Set();
    const target = markersFor(locale);
    board.lines.forEach((line, index) => {
        const heading = /^ {0,3}#{1,6}[ \t]+(.*)$/.exec(line);
        const plain = plainText(heading ? heading[1] : line);
        const kind = heading ? 'archive' : 'complete';
        const languages = localeOfMarker(kind, plain);
        if (!languages.length) return;
        spellings.add(`${kind}:${plain}`);
        if (plain !== target[kind]) {
            add(
                'KB025',
                index + 1,
                `${plain} is the ${kind} marker for ${languages.join('/')}, not for ${locale}`,
            );
        }
    });
    const completeSpellings = [...spellings].filter(value => value.startsWith('complete:'));
    const archiveSpellings = [...spellings].filter(value => value.startsWith('archive:'));
    if (completeSpellings.length > 1 || archiveSpellings.length > 1) {
        add('KB026', null, [...spellings].sort().join(', '));
    }

    if (text.includes('\r\n')) add('KB033', 1);

    if (!board.errors.length) {
        const drift = classifyDrift(text.trim(), serializeBoard(board, { useTab: inferUseTab(board) }));
        if (drift === 'format') add('KB031', null);
        if (drift === 'content' && !findings.some(item => EXPLAINS_CONTENT_DRIFT.has(item.id))) {
            add('KB032', null);
        }
    }

    return { board, findings: prune(findings, board, text) };
}

/**
 * Drop findings that only exist because a more fundamental one is already reported.
 *
 * A board that does not load has no meaningful lane structure, so reporting its lanes would be
 * describing a parse nobody performs. A block of dropped content that a more specific rule already
 * explains does not need the generic rule as well. The suppressed findings are not hidden — the
 * rule that replaces them carries the same consequence.
 */
function prune(findings, board, text) {
    const fatal = new Set(['KB001', 'KB002', 'KB003', 'KB004']);
    if (findings.some(item => fatal.has(item.id))) {
        return findings.filter(item => fatal.has(item.id));
    }
    const specific = new Set(
        findings.filter(item => item.id === 'KB012' || item.id === 'KB013').map(item => item.line),
    );
    const settingsMarkerLine = board.lines.findIndex(line => line.trim().startsWith('%% kanban:settings'));
    const settingsUnreachable = findings.some(item => item.id === 'KB005');
    return findings.filter(item => {
        if (item.id !== 'KB011') return true;
        if (specific.has(item.line)) return false;
        if (settingsUnreachable && settingsMarkerLine >= 0 && item.line >= settingsMarkerLine + 1) return false;
        return true;
    });
}

function main() {
    let args;
    try {
        args = parseArgs(process.argv.slice(2), {
            booleans: ['help'],
            values: ['vault', 'locale', 'format'],
            repeatable: ['file'],
        });
    } catch (error) {
        writeUsageError(error, USAGE);
        return;
    }
    if (args.help) {
        process.stdout.write(`${USAGE}\n`);
        return;
    }
    try {
        if (args._.length) throw new Error('positional arguments are not accepted; pass --vault');
        const format = assertFormat(args.format ?? 'text', ['text', 'json', 'sarif']);
        // An unrecognised language is not an error: the plugin's own lookup misses and falls back to
        // English, so the tool has to model that rather than refuse.
        const locale = args.locale ?? 'en';
        const vault = resolveDirectory(args.vault, '--vault');
        const targets = args.file.length
            ? args.file.map(value => resolveContainedFile(vault, value, '--file'))
            : markdownFiles(vault).filter(file => {
                  try {
                      return looksLikeBoard(fs.readFileSync(file, 'utf8'));
                  } catch {
                      return false;
                  }
              });

        const findings = [];
        const notes = [];
        let boards = 0;
        for (const file of targets) {
            const relative = relativeTo(vault, file);
            const text = readRaw(file);
            boards += 1;
            const result = lintBoard(relative, text, { locale });
            findings.push(...result.findings);
            // Anything the port declined to model is a statement about this scan, not a finding about
            // the board — but it must be said, or a short report reads as a clean one.
            for (const item of result.board.uncertainties) {
                notes.push(`${relative}:${item.line ?? 1} ${item.detail}`);
            }
        }

        const report = buildReport({
            tool: 'kanban-board-lint',
            target: vault,
            mode: `locale ${locale}`,
            scanned: { boards, findings: findings.length, notModelled: notes.length },
            findings,
            notes,
            assumptions: [
                'Boards are recognised the way the plugin recognises them: the string `kanban-plugin` appearing anywhere inside the first `---` … `---` region.',
                `Structural markers are read for the ${locale} locale and for every other locale the plugin translates, because the marker written on disk depends on Obsidian's UI language.`,
                'Continuation indentation is inferred from the board itself, falling back to a tab, because the vault setting that decides it is not readable from here.',
                'The plugin trims the file before parsing, so leading and trailing whitespace is ignored exactly as it is in Obsidian.',
            ],
            limitations: [
                'This is a port of the pinned parser for the constructs a board contains, not a re-implementation of micromark; a construct it cannot classify is reported rather than guessed at.',
                'Nothing here reads the vault configuration, the plugin data file, or any other plugin, so settings inherited from the global configuration are invisible.',
                'Whether the Tasks or Dataview plugin is installed changes what a card means, and that cannot be determined from the board file.',
                'Agent behaviour is not evaluated here or anywhere: nothing in this report says how the skill triggers or routes in a clean context.',
            ],
        });
        emitReport(report, RULES, format);
        process.exitCode = exitCodeFor(report);
    } catch (error) {
        writeUsageError(error, USAGE);
    }
}

// Importable so verify.mjs can check the rule table; only a direct invocation runs the linter.
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
