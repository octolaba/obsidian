/**
 * The board grammar, ported from the pinned plugin.
 *
 * This module answers two questions the way the plugin answers them: what does this Markdown mean,
 * and what bytes would the plugin write for that meaning. It is a port, not an approximation of a
 * port: where the pinned code does something surprising — an empty-task guard that only recognises
 * one spelling, a settings scanner that never checks its own marker, a lane heading whose level is
 * discarded — this reproduces the surprise rather than the intent, and says so in a comment.
 *
 * What it deliberately does not do is re-implement micromark. Block structure is recognised at line
 * level for the constructs a board actually contains, and everything else is recorded as an
 * uncertainty rather than guessed at. A caller that only reports can print the uncertainties; a
 * caller that writes must refuse when one is blocking, because a parser that quietly mis-models a
 * file is worse than one that declines to act on it.
 */

/**
 * The complete-lane and archive markers, per Obsidian UI language.
 *
 * The keys are the values Obsidian stores in `localStorage.language`, not the names of the pinned
 * locale files: `pt-BR` selects `pt-br.ts`, `zh` selects `zh-cn.ts`, and `zh-TW` selects `zh-tw.ts`,
 * which translates neither key and therefore falls back to English. So does every language whose
 * locale file leaves the two keys untranslated, and so does an unknown language, because the lookup
 * misses and `t()` reaches for the English table.
 *
 * The marker language is resolved once when the plugin loads, so this is the language Obsidian was
 * running in when the board was last saved, not necessarily the one it is running in now.
 *
 * `verify.mjs` rebuilds this table from the pinned locale map and locale files and asserts it still
 * matches, so the port cannot drift from the pin silently.
 */
export const LOCALE_MARKERS = Object.freeze({
    ar: { complete: 'Complete', archive: 'Archive' },
    cz: { complete: 'Complete', archive: 'Archive' },
    da: { complete: 'Complete', archive: 'Archive' },
    de: { complete: 'Fertiggestellt', archive: 'Archiv' },
    en: { complete: 'Complete', archive: 'Archive' },
    es: { complete: 'Complete', archive: 'Archive' },
    fr: { complete: 'Complete', archive: 'Archive' },
    hi: { complete: 'Complete', archive: 'Archive' },
    id: { complete: 'Complete', archive: 'Archive' },
    it: { complete: 'Completato', archive: 'Archivio' },
    ja: { complete: '完了', archive: 'アーカイブ' },
    ko: { complete: '완료됨', archive: '보관됨' },
    nl: { complete: 'Complete', archive: 'Archive' },
    no: { complete: 'Complete', archive: 'Archive' },
    pl: { complete: 'Complete', archive: 'Archive' },
    pt: { complete: 'Complete', archive: 'Archive' },
    'pt-BR': { complete: 'Concluído', archive: 'Arquivado' },
    ro: { complete: 'Complete', archive: 'Archive' },
    ru: { complete: 'Выполнено', archive: 'Архивировать' },
    sq: { complete: 'Complete', archive: 'Archive' },
    tr: { complete: 'Complete', archive: 'Archive' },
    uk: { complete: 'Complete', archive: 'Archive' },
    zh: { complete: '完成', archive: '归档' },
    'zh-TW': { complete: 'Complete', archive: 'Archive' },
});

export const FRONTMATTER_KEY = 'kanban-plugin';
export const ARCHIVE_SEPARATOR = '***';
export const DEFAULT_DATE_TRIGGER = '@';
export const DEFAULT_TIME_TRIGGER = '@@';

/** Every key the plugin routes out of YAML frontmatter and into the settings codeblock. */
export const SETTING_KEYS = Object.freeze([
    'kanban-plugin',
    'append-archive-date',
    'archive-date-format',
    'archive-date-separator',
    'archive-with-date',
    'date-colors',
    'date-display-format',
    'date-format',
    'date-picker-week-start',
    'date-time-display-format',
    'date-trigger',
    'full-list-lane-width',
    'hide-card-count',
    'inline-metadata-position',
    'lane-width',
    'link-date-to-daily-note',
    'list-collapse',
    'max-archive-size',
    'metadata-keys',
    'move-dates',
    'move-tags',
    'move-task-metadata',
    'new-card-insertion-method',
    'new-line-trigger',
    'new-note-folder',
    'new-note-template',
    'show-add-list',
    'show-archive-all',
    'show-board-settings',
    'show-checkboxes',
    'show-relative-date',
    'show-search',
    'show-set-view',
    'show-view-as-markdown',
    'table-sizing',
    'tag-action',
    'tag-colors',
    'tag-sort',
    'time-format',
    'time-trigger',
]);

/** Every value the plugin will accept for the frontmatter key; `basic` is normalised to `board`. */
export const BOARD_FORMATS = Object.freeze(['basic', 'board', 'table', 'list']);

const SETTING_KEY_SET = new Set(SETTING_KEYS);

/**
 * Resolve the settings a running board actually consumes after local, global and vault defaults.
 *
 * The settings block returned by `parseBoard` must stay local because it is what the serialiser
 * writes back. Consumers, however, read through `StateManager.compileSettings`: board-local values
 * win over plugin `data.json`, and several keys are then derived. Keeping that second object
 * explicit prevents a card edit from accidentally persisting inherited global settings into the
 * board while still letting the edit follow them.
 */
export function compileEffectiveSettings(local = {}, global = {}, vaultDefaults = {}) {
    const raw = key =>
        local?.[key] !== undefined
            ? local[key]
            : global?.[key] !== undefined
              ? global[key]
              : null;
    const dateFormat = raw('date-format') || vaultDefaults.dateFormat || 'YYYY-MM-DD';
    const dateDisplayFormat = raw('date-display-format') || dateFormat;
    const timeFormat = raw('time-format') || vaultDefaults.timeFormat || 'HH:mm';
    const globalMetadata = Array.isArray(global?.['metadata-keys']) ? global['metadata-keys'] : [];
    const localMetadata = Array.isArray(local?.['metadata-keys']) ? local['metadata-keys'] : [];

    return {
        ...global,
        ...local,
        [FRONTMATTER_KEY]: raw(FRONTMATTER_KEY) || 'board',
        'date-format': dateFormat,
        'date-display-format': dateDisplayFormat,
        // Upstream always derives this value, even when a stored value exists.
        'date-time-display-format': `${dateDisplayFormat} ${timeFormat}`,
        'date-trigger': raw('date-trigger') || DEFAULT_DATE_TRIGGER,
        'inline-metadata-position': raw('inline-metadata-position') || 'body',
        'time-format': timeFormat,
        'time-trigger': raw('time-trigger') || DEFAULT_TIME_TRIGGER,
        'link-date-to-daily-note': raw('link-date-to-daily-note'),
        'move-dates': raw('move-dates'),
        'move-tags': raw('move-tags'),
        'move-task-metadata': raw('move-task-metadata'),
        'metadata-keys': Array.from(new Set([...globalMetadata, ...localMetadata])),
        // This is the steady-state value after StateManager.setState() recompiles the parsed board.
        'archive-date-separator': raw('archive-date-separator') || '',
        'archive-date-format': raw('archive-date-format') || `${dateFormat} ${timeFormat}`,
        'show-add-list': raw('show-add-list') ?? true,
        'show-archive-all': raw('show-archive-all') ?? true,
        'show-view-as-markdown': raw('show-view-as-markdown') ?? true,
        'show-board-settings': raw('show-board-settings') ?? true,
        'show-search': raw('show-search') ?? true,
        'show-set-view': raw('show-set-view') ?? true,
        'tag-colors': raw('tag-colors') ?? [],
        'tag-sort': raw('tag-sort') ?? [],
        'date-colors': raw('date-colors') ?? [],
        'tag-action': raw('tag-action') ?? 'obsidian',
    };
}

export function markersFor(locale) {
    return LOCALE_MARKERS[locale] ?? LOCALE_MARKERS.en;
}

/** Every marker string any supported locale can produce, for a validator that does not know the UI language. */
export function allMarkers(kind) {
    return [...new Set(Object.values(LOCALE_MARKERS).map(entry => entry[kind]))];
}

/**
 * The places the plugin would ever compare against a structural marker.
 *
 * Upstream tests only stringified top-level paragraphs (the complete marker) and headings (the
 * archive marker); text inside a card, a code fence, the frontmatter or the settings footer is
 * never consulted. A scanner that walked raw lines instead would read a card body that merely
 * spells the word as a marker — so every marker scan takes its candidates from here.
 */
export function markerCandidates(board) {
    const candidates = [];
    for (const block of board.blocks) {
        if (block.type === 'paragraph') {
            candidates.push({ kind: 'complete', line: block.startLine, plain: plainText(block.text) });
        } else if (block.type === 'heading') {
            candidates.push({ kind: 'archive', line: block.startLine, plain: plainText(block.text) });
        }
    }
    return candidates;
}

// --- string transforms, ported one for one ------------------------------------------------------

/** `replaceBrs`: only the exact four-character `<br>` is decoded, then the whole string is trimmed. */
export function replaceBrs(value) {
    return value.replace(/<br>/g, '\n').trim();
}

/** `replaceNewLines`, used for lane titles only. */
export function replaceNewLines(value) {
    return value.trim().replace(/(?:\r\n|\n)/g, '<br>');
}

/** `dedentNewLines`: exactly one tab or exactly four spaces, once per line. */
export function dedentNewLines(value) {
    return value.trim().replace(/(?:\r\n|\n)(?: {4}|\t)/g, '\n');
}

/** `indentNewLines`: the plugin reads `useTab` from the vault config; here it is a parameter. */
export function indentNewLines(value, useTab = true) {
    return value.trim().replace(/(?:\r\n|\n)/g, useTab ? '\n\t' : '\n    ');
}

/** `removeBlockId`: first line only, and a narrower character class than the tokenizer accepts. */
export function removeBlockId(value) {
    const lines = value.split(/(?:\r\n|\n)/g);
    lines[0] = lines[0].replace(/\s+\^([a-zA-Z0-9-]+)$/, '');
    return lines.join('\n');
}

/** `addBlockId`: always line 0, wherever the id was found. */
export function addBlockId(value, blockId) {
    if (!blockId) return value;
    const lines = value.split(/(?:\r\n|\n)/g);
    lines[0] += ` ^${blockId}`;
    return lines.join('\n');
}

/** `parseLaneTitle`: a trailing `(N)` is a WIP limit, and `(0)` is indistinguishable from none. */
export function parseLaneTitle(value) {
    const text = replaceBrs(value);
    const match = text.match(/^(.*?)\s*\((\d+)\)$/);
    if (match == null) return { title: text, maxItems: 0 };
    return { title: match[1], maxItems: Number(match[2]) };
}

/** `laneTitleWithMaxItems`: a zero limit is dropped, and the spacing is normalised to one space. */
export function laneTitleWithMaxItems(title, maxItems) {
    if (!maxItems) return title;
    return `${title} (${maxItems})`;
}

/**
 * Blank out the interior of every inline construct that consumes its own characters, preserving
 * length so offsets stay valid.
 *
 * This matters because the tokenizers are tried left to right: by the time the scanner reaches a
 * caret inside `[[note#^blk]]`, the wikilink construct has already taken those characters, so no
 * block id is produced there. A validator that looked at raw text would invent one.
 *
 * The wrapped constructs cannot nest and cannot span a line, so a single left-to-right pass is
 * faithful. The order below is the order the plugin registers them in, which is what decides `@@{`
 * against `@{`.
 */
export function maskInline(line, triggers = {}) {
    const dateTrigger = triggers.dateTrigger ?? DEFAULT_DATE_TRIGGER;
    const timeTrigger = triggers.timeTrigger ?? DEFAULT_TIME_TRIGGER;
    const wrappers = [
        { open: '`', close: '`' },
        { open: '![[', close: ']]' },
        { open: '[[', close: ']]' },
        { open: `${timeTrigger}{`, close: '}' },
        { open: `${dateTrigger}[[`, close: ']]' },
        { open: `${dateTrigger}{`, close: '}' },
    ];
    const chars = [...line];
    let index = 0;
    outer: while (index < chars.length) {
        for (const wrapper of wrappers) {
            if (!line.startsWith(wrapper.open, index)) continue;
            const from = index + wrapper.open.length;
            const close = line.indexOf(wrapper.close, from);
            if (close === -1) continue;
            // The construct requires at least one character that is neither a space nor a line end.
            if (!line.slice(from, close).trim()) continue;
            for (let blank = index; blank < close + wrapper.close.length; blank += 1) chars[blank] = ' ';
            index = close + wrapper.close.length;
            continue outer;
        }
        index += 1;
    }
    return chars.join('');
}

/**
 * The block-id tokenizer: `^` followed by one or more non-space characters, running to end of line.
 * There is no requirement for whitespace before the caret, which is why `2^10` yields the id `10`.
 */
export function extractBlockId(line, triggers = {}) {
    const match = maskInline(line, triggers).match(/\^([^\s]+)$/);
    if (!match) return null;
    return { id: line.slice(match.index + 1), start: match.index };
}

/**
 * An approximation of mdast's `toString` for a single-line paragraph, used only to compare a line
 * against the complete and archive markers. Emphasis is stripped because the real comparison runs
 * on stringified inline content, which is why a bare `Complete` matches as readily as `**Complete**`.
 */
export function plainText(line) {
    let text = line.trim();
    for (const delimiter of ['***', '___', '**', '__', '*', '_', '`']) {
        if (text.length > delimiter.length * 2 && text.startsWith(delimiter) && text.endsWith(delimiter)) {
            text = text.slice(delimiter.length, -delimiter.length).trim();
        }
    }
    return text;
}

// --- frontmatter and settings, ported one for one ------------------------------------------------

/**
 * `extractFrontmatter`, including both of its failure modes.
 *
 * The plugin trims the file before parsing, so `start` is the offset of the first non-whitespace
 * character. The first three characters from there must each be `-`; anything else throws. A block
 * that never closes, and a block whose YAML is empty, both end as a TypeError one frame later, which
 * is reported here as a distinct kind because the two produce different messages in Obsidian.
 */
export function extractFrontmatterRange(text, start = 0) {
    let frontmatterStart = -1;
    let openDashCount = 0;
    for (let i = start, len = text.length; i < len; i += 1) {
        if (openDashCount < 3) {
            if (text[i] === '-') {
                openDashCount += 1;
                continue;
            }
            return { error: 'not-frontmatter' };
        }
        if (frontmatterStart < 0) frontmatterStart = i;
        if (text[i] === '-' && /[\r\n]/.test(text[i - 1]) && text[i + 1] === '-' && text[i + 2] === '-') {
            return {
                error: null,
                bodyStart: frontmatterStart,
                bodyEnd: i - 1,
                closeStart: i,
                closeEnd: i + 3,
                yaml: text.slice(frontmatterStart, i - 1).trim(),
            };
        }
    }
    return { error: 'unterminated' };
}

/**
 * `extractSettingsFooter`, including the two properties that matter most to anything editing a board
 * by hand: the tolerated tail characters are exactly backtick, percent, CR and LF — a single trailing
 * space discards every board-local setting — and the `%% kanban:settings` marker is never checked, so
 * any trailing fenced block is handed to `JSON.parse`.
 */
export function extractSettingsFooterRange(text, end = text.length) {
    let hasEntered = false;
    let openTickCount = 0;
    let settingsEnd = -1;
    for (let i = end - 1; i >= 0; i -= 1) {
        if (!hasEntered && /[`%\n\r]/.test(text[i])) {
            if (text[i] === '`') {
                openTickCount += 1;
                if (openTickCount === 3) {
                    hasEntered = true;
                    settingsEnd = i - 1;
                }
            }
            continue;
        }
        if (!hasEntered) return { found: false, reason: 'no-trailing-fence' };
        if (
            text[i] === '`' &&
            text[i - 1] === '`' &&
            text[i - 2] === '`' &&
            /[\r\n]/.test(text[i - 3])
        ) {
            return {
                found: true,
                openFenceStart: i - 2,
                jsonStart: i + 1,
                jsonEnd: settingsEnd,
                json: text.slice(i + 1, settingsEnd).trim(),
            };
        }
    }
    return { found: false, reason: 'unterminated-fence' };
}

// --- block-level scanning ------------------------------------------------------------------------

const ATX_HEADING = /^ {0,3}(#{1,6})(?:[ \t]+(.*?))?[ \t]*$/;
const THEMATIC_BREAK = /^ {0,3}(?:(?:\*[ \t]*){3,}|(?:-[ \t]*){3,}|(?:_[ \t]*){3,})$/;
const SETEXT_UNDERLINE = /^ {0,3}(?:=+|-+)[ \t]*$/;
const FENCE_OPEN = /^( {0,3})(`{3,}|~{3,})(.*)$/;
const LIST_ITEM = /^( {0,3})([-*+]|\d{1,9}[.)])([ \t]+|$)/;
const BLANK = /^[ \t]*$/;

function markerKind(marker) {
    return /^\d/.test(marker) ? `ordered${marker.slice(-1)}` : marker;
}

/**
 * A backtick fence's info string may not contain a backtick, so a line that opens and closes with
 * backticks is an inline code span rather than a block delimiter.
 */
function fenceAt(line) {
    const match = FENCE_OPEN.exec(line);
    if (!match) return null;
    return match[2][0] === '~' || !match[3].includes('`') ? match : null;
}

/**
 * Split the body into the top-level blocks the plugin's lane scan walks over.
 *
 * Only the constructs a board can contain are modelled. An indented code block, a blockquote, an
 * HTML block is recognised well enough to be reported, never well enough to be silently
 * reinterpreted. Setext headings are modelled because mdast presents them to the plugin as ordinary
 * heading nodes; treating their underline as a thematic break invents an archive boundary.
 */
function scanBlocks(lines, from, to, uncertainties, triggers = {}) {
    const blocks = [];
    let index = from;
    while (index < to) {
        const line = lines[index];
        if (BLANK.test(line)) {
            index += 1;
            continue;
        }
        const fence = fenceAt(line);
        if (fence) {
            const closer = new RegExp(`^ {0,3}${fence[2][0]}{${fence[2].length},}[ \\t]*$`);
            let end = index + 1;
            while (end < to && !closer.test(lines[end])) end += 1;
            blocks.push({ type: 'code', startLine: index, endLine: Math.min(end, to - 1) });
            index = Math.min(end, to - 1) + 1;
            continue;
        }
        const heading = ATX_HEADING.exec(line);
        if (heading) {
            blocks.push({
                type: 'heading',
                startLine: index,
                endLine: index,
                depth: heading[1].length,
                text: stripClosingSequence(heading[2] ?? '', triggers),
            });
            index += 1;
            continue;
        }
        if (THEMATIC_BREAK.test(line)) {
            blocks.push({ type: 'thematicBreak', startLine: index, endLine: index });
            index += 1;
            continue;
        }
        if (LIST_ITEM.test(line)) {
            const list = scanList(lines, index, to);
            blocks.push(list);
            index = list.endLine + 1;
            continue;
        }
        if (/^ {4,}\S/.test(line)) {
            uncertainties.push({
                kind: 'indented-code-block',
                line: index + 1,
                blocking: true,
                detail: 'a line indented four or more spaces at top level is an indented code block, which this port does not model',
            });
            blocks.push({ type: 'unknown', startLine: index, endLine: index });
            index += 1;
            continue;
        }
        // A paragraph: every line until a blank line or a construct that interrupts it. A setext
        // underline belongs to the paragraph immediately above it and turns the whole paragraph
        // into a heading in mdast. It is checked before the thematic-break branch because `---`
        // otherwise has both spellings at line level.
        let end = index;
        let setext = null;
        while (
            end + 1 < to &&
            !BLANK.test(lines[end + 1]) &&
            !ATX_HEADING.test(lines[end + 1]) &&
            !fenceAt(lines[end + 1]) &&
            !LIST_ITEM.test(lines[end + 1])
        ) {
            if (SETEXT_UNDERLINE.test(lines[end + 1])) {
                setext = end + 1;
                break;
            }
            if (THEMATIC_BREAK.test(lines[end + 1])) break;
            end += 1;
        }
        if (setext !== null) {
            blocks.push({
                type: 'heading',
                startLine: index,
                endLine: setext,
                depth: lines[setext].trimStart().startsWith('=') ? 1 : 2,
                text: stripClosingSequence(lines.slice(index, setext).join('\n'), triggers),
            });
            index = setext + 1;
            continue;
        }
        blocks.push({ type: 'paragraph', startLine: index, endLine: end, text: lines.slice(index, end + 1).join('\n') });
        index = end + 1;
    }
    return blocks;
}

/**
 * A heading's text as upstream extracts it: without the closing `#` sequence, and without a trailing
 * block id, which the content boundary excludes and the serialiser then never writes back.
 */
function stripClosingSequence(text, triggers = {}) {
    const withoutClosing = text.replace(/[ \t]+#+[ \t]*$/, '').trim();
    const blockId = extractBlockId(withoutClosing, triggers);
    return blockId ? withoutClosing.slice(0, blockId.start).trim() : withoutClosing;
}

/**
 * One list, ending where the plugin's list ends.
 *
 * A change of bullet character or of list type starts a new list in CommonMark, and only the first
 * list under a heading becomes that lane's cards — so this returns at the change rather than
 * absorbing it, and the caller reports the dropped items.
 */
function scanList(lines, start, to) {
    const first = LIST_ITEM.exec(lines[start]);
    const kind = markerKind(first[2]);
    const items = [];
    let index = start;
    let current = null;
    let lastContentLine = start;
    // A list item indented to at least the current item's content column opens a *nested* list,
    // which upstream keeps inside the parent card because the parent's content boundary runs to the
    // end of its last child. Treating it as a sibling would split one card into several and make
    // every card index after it wrong.

    const openItem = (line, match) => {
        const markerEnd = match[1].length + match[2].length + (match[3] ?? '').length;
        current = {
            startLine: line,
            endLine: line,
            marker: match[2],
            contentColumn: markerEnd,
            lines: [lines[line].slice(markerEnd)],
        };
        items.push(current);
    };

    openItem(index, first);
    index += 1;

    while (index < to) {
        const line = lines[index];
        if (BLANK.test(line)) {
            // A blank line only ends the list when what follows is neither an item of the same list
            // nor an indented continuation.
            let probe = index;
            while (probe < to && BLANK.test(lines[probe])) probe += 1;
            if (probe >= to) break;
            const next = LIST_ITEM.exec(lines[probe]);
            const continues =
                (next && markerKind(next[2]) === kind) ||
                (!next && /^(?: {2,}|\t)\S/.test(lines[probe]));
            if (!continues) break;
            for (let blank = index; blank < probe; blank += 1) current.lines.push('');
            index = probe;
            continue;
        }
        const item = LIST_ITEM.exec(line);
        if (item) {
            if (item[1].length >= current.contentColumn) {
                current.lines.push(line);
                lastContentLine = index;
                index += 1;
                continue;
            }
            if (markerKind(item[2]) !== kind) break;
            current.endLine = lastContentLine;
            openItem(index, item);
            lastContentLine = index;
            index += 1;
            continue;
        }
        if (/^(?: {2,}|\t)/.test(line)) {
            // Indented continuation: part of this item, whatever it contains.
            current.lines.push(line);
            lastContentLine = index;
            index += 1;
            continue;
        }
        // An unindented line only continues the item lazily, and only as paragraph text. A heading,
        // a thematic break and a fence all interrupt a paragraph, so they end the list instead —
        // which is what stops a fenced block or a `## ` line at column zero from being swallowed
        // into a card that does not contain it.
        if (ATX_HEADING.test(line) || THEMATIC_BREAK.test(line) || fenceAt(line)) break;
        current.lines.push(line);
        lastContentLine = index;
        index += 1;
    }
    current.endLine = lastContentLine;
    // Trailing blank placeholders belong to the file, not to the card.
    for (const entry of items) {
        while (entry.lines.length && BLANK.test(entry.lines[entry.lines.length - 1])) entry.lines.pop();
    }
    return { type: 'list', startLine: start, endLine: items[items.length - 1].endLine, kind, items };
}

// --- card construction ---------------------------------------------------------------------------

const CHECKBOX = /^\[(.)\]([ \t]+)(\S)/u;

/**
 * Turn one list item into the card the plugin would build.
 *
 * The checkbox tokenizer accepts exactly one character between the brackets and then requires
 * whitespace followed by a non-space character, so `- [ ]` and `- [x]` alone are not tasks at all.
 * The empty-task guard compares against the literal `[ ]`, which is why a bare `- [x]` survives as
 * the card text `[x]` and is written back as `- [ ] [x]`.
 *
 * A block id is removed twice, exactly as upstream does it and for two different reasons: the
 * content boundary excludes a block id that ends the item's last line, and `removeBlockId` then
 * scrubs one off line 0 with a narrower character class. Both are needed, and neither alone is
 * right — which is why `- [ ] 2^10` becomes the card text `2` with the block id `10`.
 */
export function itemToCard(item, lines, triggers = {}) {
    const raw = item.lines.join('\n');
    const match = CHECKBOX.exec(raw);
    let checked = null;
    let checkChar = ' ';
    // Trailing whitespace never reaches upstream's content boundary, because that boundary runs to
    // the end of the last inline node. Trimming here is what makes `- [ ] ` — a checkbox, a space
    // and nothing else — hit the empty-task guard the way it does in the plugin.
    let content = raw.replace(/[ \t]+$/, '');
    if (match) {
        checked = /^[ \t]$/.test(match[1]) ? false : true;
        checkChar = checked ? match[1] : ' ';
        content = content.slice(match[0].length - 1);
    }
    if (content === '[ ]') content = '';

    // Any block id in the item wins the assignment, and document order means the last one wins.
    const contentLines = content.split('\n');
    let blockId = null;
    for (const line of contentLines) {
        const found = extractBlockId(line, triggers);
        if (found) blockId = found.id;
    }
    // The content boundary excludes only a block id that terminates the item's last content line.
    for (let index = contentLines.length - 1; index >= 0; index -= 1) {
        if (!contentLines[index].trim()) continue;
        const found = extractBlockId(contentLines[index], triggers);
        if (found) contentLines[index] = contentLines[index].slice(0, found.start);
        break;
    }
    content = contentLines.join('\n');

    const withBrs = replaceBrs(content);
    const dedented = dedentNewLines(withBrs);
    const titleRaw = removeBlockId(dedented);
    return {
        startLine: item.startLine,
        endLine: item.endLine,
        marker: item.marker,
        checked,
        checkChar,
        titleRaw,
        blockId,
        sourceLines: lines.slice(item.startLine, item.endLine + 1),
    };
}

/** `itemToMd`. */
export function cardToMd(card, useTab = true) {
    return `- [${card.checkChar}] ${addBlockId(indentNewLines(card.titleRaw, useTab), card.blockId)}`;
}

// --- the board -----------------------------------------------------------------------------------

/**
 * Parse a board the way the plugin parses it.
 *
 * `locale` selects the complete and archive marker strings. `acceptAnyLocaleMarker` additionally
 * recognises every other locale's markers, which is what a validator wants when it does not know the
 * vault's UI language; the recognised locale is reported so the caller can say which one it used.
 */
export function parseBoard(text, options = {}) {
    const locale = options.locale ?? 'en';
    const markers = markersFor(locale);
    // Strict by default: the plugin only recognises the marker of the language Obsidian is running
    // in, so a lenient parse would describe a board nobody's Obsidian actually sees.
    const acceptAny = options.acceptAnyLocaleMarker ?? false;
    const completeMarkers = acceptAny ? allMarkers('complete') : [markers.complete];
    const archiveMarkers = acceptAny ? allMarkers('archive') : [markers.archive];

    const uncertainties = [];
    const errors = [];
    const lines = text.split(/\r\n|\n|\r/);
    const leading = text.length - text.trimStart().length;
    const trailing = text.length - text.trimEnd().length;

    const frontmatter = extractFrontmatterRange(text, leading);
    if (frontmatter.error === 'not-frontmatter') {
        errors.push({
            kind: 'frontmatter-missing',
            detail: 'the first three non-whitespace characters are not `---`, so the plugin throws before parsing anything',
        });
    } else if (frontmatter.error === 'unterminated') {
        errors.push({
            kind: 'frontmatter-unterminated',
            detail: 'the frontmatter block never closes, so the plugin fails while reading its keys',
        });
    }

    const footer = extractSettingsFooterRange(text, text.length - trailing);
    let settings = {};
    let settingsJsonError = null;
    if (footer.found) {
        try {
            // Upstream spreads whatever the JSON turns out to be, so a scalar becomes an empty
            // object and a string becomes index keys. Reproducing the spread keeps a malformed but
            // parseable payload from killing a whole vault scan, which is what throwing here did.
            const payload = JSON.parse(footer.json);
            settings = { ...payload };
            if (payload === null || typeof payload !== 'object' || Array.isArray(payload)) {
                uncertainties.push({
                    kind: 'settings-not-an-object',
                    line: null,
                    blocking: true,
                    detail: `the settings block holds ${Array.isArray(payload) ? 'an array' : typeof payload}, not an object`,
                });
            }
        } catch (error) {
            settingsJsonError = error.message;
            errors.push({
                kind: 'settings-json-invalid',
                detail: `the trailing fenced block is not valid JSON, so the whole board fails to load: ${error.message}`,
            });
        }
    }
    const markerLine = footer.found ? offsetToLine(text, footer.openFenceStart) : null;
    const settingsMarkerPresent =
        footer.found &&
        markerLine !== null &&
        markerLine > 0 &&
        lines[markerLine - 1].trim().startsWith('%% kanban:settings');

    let yamlLineOffset = 0;
    if (!frontmatter.error) {
        const rawYaml = text.slice(frontmatter.bodyStart, frontmatter.bodyEnd);
        const firstYamlByte = frontmatter.bodyStart + (rawYaml.length - rawYaml.trimStart().length);
        yamlLineOffset = offsetToLine(text, firstYamlByte);
    }
    const yaml = frontmatter.error
        ? null
        : parseSimpleYaml(frontmatter.yaml, uncertainties, yamlLineOffset);
    const frontmatterKeys = yaml ?? {};
    const fileFrontmatter = {};
    for (const [key, value] of Object.entries(frontmatterKeys)) {
        if (key === FRONTMATTER_KEY) {
            const normalised = value === 'basic' ? 'board' : value;
            settings[key] = normalised;
            fileFrontmatter[key] = normalised;
        } else if (SETTING_KEY_SET.has(key)) {
            settings[key] = value;
        } else {
            fileFrontmatter[key] = value;
        }
    }

    const bodyStart = frontmatter.error ? 0 : offsetToLine(text, frontmatter.closeEnd) + 1;
    const bodyEnd = footer.found
        ? Math.max(bodyStart, offsetToLine(text, footer.openFenceStart) - (settingsMarkerPresent ? 1 : 0))
        : lines.length;

    if (bodyEnd > bodyStart && bodyEnd < lines.length && lines[bodyEnd - 1].trim() !== '') {
        uncertainties.push({
            kind: 'tight-settings-block',
            line: bodyEnd,
            blocking: true,
            detail: 'the settings block follows content with no blank line, which upstream reads as part of the card above it',
        });
    }

    const effectiveSettings = compileEffectiveSettings(settings, options.globalSettings, {
        dateFormat: options.vaultDateFormat,
        timeFormat: options.vaultTimeFormat,
    });
    const triggers = {
        dateTrigger: effectiveSettings['date-trigger'],
        timeTrigger: effectiveSettings['time-trigger'],
    };
    const blocks = scanBlocks(lines, bodyStart, bodyEnd, uncertainties, triggers);

    const lanes = [];
    const archive = [];
    let archiveBlock = null;

    for (let index = 0; index < blocks.length; index += 1) {
        const block = blocks[index];
        if (block.type !== 'heading') continue;

        const previous = index > 0 ? blocks[index - 1] : null;
        const isArchive =
            previous?.type === 'thematicBreak' && archiveMarkers.includes(plainText(block.text));

        let completeMarkerLine = null;
        let list = null;
        for (let probe = index + 1; probe < blocks.length; probe += 1) {
            const candidate = blocks[probe];
            if (candidate.type === 'list') {
                list = candidate;
                break;
            }
            if (candidate.type === 'heading') break;
            if (candidate.type === 'paragraph') {
                const plain = plainText(candidate.text);
                if (candidate.text.trim().startsWith('%% kanban:settings')) break;
                if (completeMarkers.includes(plain)) {
                    completeMarkerLine = candidate.startLine;
                    continue;
                }
            }
            if (candidate.type === 'unknown') {
                uncertainties.push({
                    kind: 'unmodelled-block',
                    line: candidate.startLine + 1,
                    blocking: true,
                    detail: 'a block between a lane heading and its cards could not be classified',
                });
            }
        }

        const cards = list ? list.items.map(item => itemToCard(item, lines, triggers)) : [];

        if (isArchive && list) {
            archive.push(...cards);
            archiveBlock = {
                separatorLine: previous.startLine,
                headingLine: block.startLine,
                listStartLine: list.startLine,
                listEndLine: list.endLine,
                heading: block.text,
            };
            continue;
        }

        const parsedTitle = parseLaneTitle(block.text);
        lanes.push({
            headingLine: block.startLine,
            headingDepth: block.depth,
            rawTitle: block.text,
            title: parsedTitle.title,
            maxItems: parsedTitle.maxItems,
            shouldMarkItemsComplete: completeMarkerLine !== null,
            completeMarkerLine,
            listStartLine: list ? list.startLine : null,
            listEndLine: list ? list.endLine : null,
            listKind: list ? list.kind : null,
            cards,
        });
    }

    // Content the board model cannot carry is dropped by the plugin on its next save. Report it
    // rather than reproduce the loss silently.
    const claimed = new Set();
    for (const lane of lanes) {
        claimed.add(lane.headingLine);
        if (lane.completeMarkerLine !== null) claimed.add(lane.completeMarkerLine);
        for (let line = lane.listStartLine ?? -1; line >= 0 && line <= lane.listEndLine; line += 1) {
            claimed.add(line);
        }
    }
    if (archiveBlock) {
        claimed.add(archiveBlock.separatorLine);
        claimed.add(archiveBlock.headingLine);
        for (let line = archiveBlock.listStartLine; line <= archiveBlock.listEndLine; line += 1) {
            claimed.add(line);
        }
    }
    const unrepresented = [];
    for (const block of blocks) {
        for (let line = block.startLine; line <= block.endLine; line += 1) {
            if (!claimed.has(line) && !BLANK.test(lines[line])) {
                unrepresented.push({ line: line + 1, text: lines[line], blockType: block.type });
                break;
            }
        }
    }

    return {
        lines,
        eol: text.includes('\r\n') ? '\r\n' : '\n',
        locale,
        markers,
        frontmatterRange: frontmatter.error
            ? null
            : { startLine: offsetToLine(text, leading), endLine: offsetToLine(text, frontmatter.closeEnd) },
        frontmatter: fileFrontmatter,
        frontmatterYaml: frontmatter.error ? null : frontmatter.yaml,
        settings,
        effectiveSettings,
        settingsFooter: footer.found
            ? {
                  markerPresent: settingsMarkerPresent,
                  openFenceLine: markerLine,
                  json: footer.json,
                  jsonError: settingsJsonError,
              }
            : { markerPresent: false, absent: true, reason: footer.reason },
        bodyStartLine: bodyStart,
        bodyEndLine: bodyEnd,
        lanes,
        archive,
        archiveBlock,
        unrepresented,
        uncertainties,
        errors,
        blocks,
    };
}

function offsetToLine(text, offset) {
    if (offset === null || offset === undefined || offset < 0) return null;
    let line = 0;
    for (let index = 0; index < offset && index < text.length; index += 1) {
        if (text[index] === '\n') line += 1;
    }
    return line;
}

/**
 * A deliberately small YAML reader for the frontmatter block.
 *
 * A board's frontmatter is flat scalars in practice, and the only key the plugin cares about is a
 * string. Anything this cannot read — a nested mapping, a block scalar, an anchor — is reported as
 * an uncertainty instead of being guessed at, because guessing here would change which keys the port
 * believes are settings.
 */
/**
 * An unquoted YAML scalar, typed the way a YAML reader types it.
 *
 * This matters beyond tidiness: a settings key that arrives as the string `"1"` never compares equal
 * to a number, so a rule that asks whether the archive is over its limit silently does not fire, and
 * a re-serialisation writes the value back quoted.
 */
function typedScalar(value) {
    if (/^[-+]?\d+$/.test(value)) return Number(value);
    if (/^[-+]?(?:\d+\.\d*|\.\d+)(?:[eE][-+]?\d+)?$/.test(value)) return Number(value);
    if (/^(?:true|yes|on)$/i.test(value)) return true;
    if (/^(?:false|no|off)$/i.test(value)) return false;
    if (/^(?:null|~)$/i.test(value)) return null;
    return value;
}

export function parseSimpleYaml(source, uncertainties = [], lineOffset = 0) {
    const result = {};
    if (!source) return result;
    const lines = source.split('\n');
    const unmodelled = (index, detail) =>
        uncertainties.push({
            kind: 'yaml-not-modelled',
            line: lineOffset + index + 1,
            blocking: false,
            detail,
        });
    for (let index = 0; index < lines.length; index += 1) {
        const line = lines[index];
        if (!line.trim() || line.trim().startsWith('#')) continue;
        if (/^\s/.test(line)) {
            // A continuation of something above: a sequence item, a nested mapping, a block scalar.
            // Whatever it is, this port did not build it, and saying so is the whole point — a
            // caller that re-serialises must not be allowed to believe it read the frontmatter.
            unmodelled(index, 'an indented frontmatter line that this port does not model');
            continue;
        }
        const match = /^([^:]+):\s*(.*)$/.exec(line);
        if (!match) {
            unmodelled(index, 'a frontmatter line that is not `key: value`');
            continue;
        }
        const key = match[1].trim();
        let value = match[2].trim();
        const commentAt = inlineYamlCommentAt(value);
        if (commentAt !== -1) {
            unmodelled(
                index,
                `the value of \`${key}\` has an inline YAML comment; its value is modelled, but a whole-file rewrite would discard the comment`,
            );
            value = value.slice(0, commentAt).trimEnd();
        }
        if (value === '') {
            // `key:` with an indented block under it is a sequence or a mapping, not an empty
            // string. Reading it as one would quietly replace it on the next serialisation.
            const next = lines.slice(index + 1).find(candidate => candidate.trim());
            if (next !== undefined && /^\s/.test(next)) {
                unmodelled(index, `the value of \`${key}\` is a block this port does not model`);
                continue;
            }
            result[key] = '';
            continue;
        }
        if (/^[\[\{|>&*!]/.test(value)) {
            unmodelled(index, `the value of \`${key}\` is a flow collection or block scalar this port does not model`);
            continue;
        }
        if (value.startsWith('"') || value.endsWith('"')) {
            if (!(value.startsWith('"') && value.endsWith('"'))) {
                unmodelled(index, `the double-quoted value of \`${key}\` is not closed`);
                continue;
            }
            try {
                // JSON string escapes are a strict, useful subset of YAML double-quoted escapes.
                result[key] = JSON.parse(value);
            } catch {
                unmodelled(index, `the double-quoted value of \`${key}\` uses YAML escapes this port does not model`);
            }
            continue;
        }
        if (value.startsWith("'") || value.endsWith("'")) {
            if (!(value.startsWith("'") && value.endsWith("'"))) {
                unmodelled(index, `the single-quoted value of \`${key}\` is not closed`);
                continue;
            }
            result[key] = value.slice(1, -1).replace(/''/g, "'");
            continue;
        }
        result[key] = typedScalar(value);
    }
    return result;
}

/** Index of a YAML inline comment, excluding hashes inside quoted scalars and literal hashes. */
function inlineYamlCommentAt(value) {
    let quote = null;
    let escaped = false;
    for (let index = 0; index < value.length; index += 1) {
        const char = value[index];
        if (quote === '"' && escaped) {
            escaped = false;
            continue;
        }
        if (quote === '"' && char === '\\') {
            escaped = true;
            continue;
        }
        if (quote && char === quote) {
            if (quote === "'" && value[index + 1] === "'") {
                index += 1;
                continue;
            }
            quote = null;
            continue;
        }
        if (!quote && (char === '"' || char === "'")) {
            quote = char;
            continue;
        }
        if (!quote && char === '#' && (index === 0 || /\s/.test(value[index - 1]))) return index;
    }
    return -1;
}

// --- serialisation --------------------------------------------------------------------------------

/**
 * `boardToMd`, reproduced from the pinned code path.
 *
 * The shape is fixed: a frontmatter block with a blank line on each side of the YAML, then every
 * lane as `## title`, one blank line, an optional complete marker directly above the first card, the
 * cards, and three newlines; then the archive only when it is non-empty; then the settings block.
 * The output does not end with a newline — the last two bytes are the closing `%%`.
 *
 * One caveat, and it is not a small one: the frontmatter is regenerated, and upstream regenerates it
 * through Obsidian's own YAML writer. Everything a board's frontmatter holds in practice is flat
 * scalars, which `stringifySimpleYaml` reproduces; anything richer than that is beyond what can be
 * claimed from outside Obsidian, which is why the normalising strategy refuses a frontmatter this
 * port could not fully read.
 */
export function serializeBoard(board, options = {}) {
    const useTab = options.useTab ?? true;
    const markers = board.markers ?? markersFor(board.locale ?? 'en');
    const frontmatter = ['---', '', stringifySimpleYaml(board.frontmatter), '---', '', ''].join('\n');
    const lanes = board.lanes
        .map(lane => {
            const out = [`## ${replaceNewLines(laneTitleWithMaxItems(lane.title, lane.maxItems))}`, ''];
            if (lane.shouldMarkItemsComplete) out.push(`**${markers.complete}**`);
            for (const card of lane.cards) out.push(cardToMd(card, useTab));
            out.push('', '', '');
            return out.join('\n');
        })
        .join('');
    const archive = board.archive.length
        ? [
              ARCHIVE_SEPARATOR,
              '',
              `## ${markers.archive}`,
              '',
              ...board.archive.map(card => cardToMd(card, useTab)),
          ].join('\n')
        : '';
    const settings = ['', '', '%% kanban:settings', '```', JSON.stringify(board.settings), '```', '%%'].join(
        '\n',
    );
    return frontmatter + lanes + archive + settings;
}

/** `stringifyYaml` for the flat scalar mappings a board frontmatter actually holds. */
export function stringifySimpleYaml(value) {
    const entries = Object.entries(value ?? {});
    if (!entries.length) return '';
    return `${entries
        .map(([key, item]) => `${key}: ${formatYamlScalar(item)}`)
        .join('\n')}\n`;
}

function formatYamlScalar(value) {
    if (value === null || value === undefined) return 'null';
    if (typeof value === 'number' || typeof value === 'boolean') return String(value);
    const text = String(value);
    if (text === '') return "''";
    if (/^[A-Za-z0-9_][A-Za-z0-9 _.\-/]*$/.test(text) && !/^(?:true|false|null|yes|no|on|off)$/i.test(text)) {
        return text;
    }
    return JSON.stringify(text);
}

// --- editing ---------------------------------------------------------------------------------------

/**
 * Apply line edits atomically.
 *
 * Each edit replaces the half-open line range `[start, end)` with `replacement`. Overlapping edits
 * are a programming error rather than a merge problem, so they throw instead of being resolved by
 * order. Edits are applied from the bottom of the file upwards, which is what keeps every recorded
 * line number valid while the list is being applied.
 */
export function applyEdits(lines, edits) {
    const sorted = [...edits].sort((left, right) => right.start - left.start || right.end - left.end);
    for (let index = 1; index < sorted.length; index += 1) {
        if (sorted[index].end > sorted[index - 1].start) {
            throw new Error(
                `overlapping edits at lines ${sorted[index].start + 1} and ${sorted[index - 1].start + 1}`,
            );
        }
    }
    const out = [...lines];
    for (const edit of sorted) out.splice(edit.start, edit.end - edit.start, ...edit.replacement);
    return out;
}

/**
 * Which indentation a continuation line should use.
 *
 * The plugin reads `useTab` from the vault configuration, which a command-line tool cannot see. The
 * board itself is better evidence than any default: if it already has continuation lines, follow
 * them. Obsidian's own default is a tab, so that is the fallback.
 */
export function inferUseTab(board, fallback = true) {
    for (const lane of board.lanes) {
        for (const card of lane.cards) {
            for (const line of card.sourceLines.slice(1)) {
                if (line.startsWith('\t')) return true;
                if (line.startsWith('    ')) return false;
            }
        }
    }
    return fallback;
}

/**
 * How far a re-serialisation differs from what is on disk.
 *
 * `format` means the plugin would rewrite blank lines and trailing whitespace only — cosmetic, but
 * it will happen on the next save. `content` means text the reader can see would change or vanish,
 * which is the difference worth stopping for.
 */
export function classifyDrift(original, serialized) {
    if (original === serialized) return 'none';
    const normalise = value =>
        value
            .replace(/\r\n?/g, '\n')
            .split('\n')
            .map(line => line.replace(/[ \t]+$/, ''))
            .join('\n')
            .replace(/\n{2,}/g, '\n\n')
            .trim();
    return normalise(original) === normalise(serialized) ? 'format' : 'content';
}

/** True when the board carries something that must stop a write rather than be worked around. */
export function blockingProblems(board) {
    return [
        ...board.errors.map(error => ({ kind: error.kind, detail: error.detail, line: null })),
        ...board.uncertainties.filter(item => item.blocking),
    ];
}
