import fs from 'node:fs';
import path from 'node:path';

export const TOOL_VERSION = '2.0.0';

/** The Tasks release this operational subset was ported from. */
export const STUDIED_PLUGIN_VERSION = '8.3.0';
export const STUDIED_PLUGIN_ID = 'obsidian-tasks-plugin';

/**
 * Shared harness exit meanings. 0-4 are the repository-wide baseline; 5 and above are
 * documented tool-specific extensions.
 */
export const EXIT = Object.freeze({
    clean: 0,
    findings: 1,
    usage: 2,
    missingMaterial: 3,
    identityMismatch: 4,
    indeterminate: 5,
});

/**
 * The eight presets Tasks 8.3.0 installs into default settings
 * (`src/Query/Presets/Presets.ts:2`, `src/Config/Settings.ts:113`).
 * They apply only when the vault has neither a `presets` nor a legacy `includes` key.
 */
export const DEFAULT_PRESETS = Object.freeze({
    this_file: 'path includes {{query.file.path}}',
    this_folder: 'folder includes {{query.file.folder}}',
    this_folder_only: 'filter by function task.file.folder === query.file.folder',
    this_root: 'root includes {{query.file.root}}',
    hide_date_fields:
        '# Hide any values for all date fields\nhide due date\nhide scheduled date\nhide start date\nhide created date\nhide done date\nhide cancelled date',
    hide_non_date_fields:
        '# Hide all the non-date fields, but not tags\nhide id\nhide depends on\nhide recurrence rule\nhide on completion\nhide priority',
    hide_query_elements:
        '# Hide toolbar, postpone, edit and backlinks\nhide toolbar\nhide postpone button\nhide edit button\nhide backlinks',
    hide_everything:
        '# Hide everything except description and any tags\npreset hide_date_fields\npreset hide_non_date_fields\npreset hide_query_elements',
});

export const DEFAULT_SETTINGS = {
    presets: DEFAULT_PRESETS,
    globalQuery: '',
    globalFilter: '',
    removeGlobalFilter: false,
    taskFormat: 'tasksPluginEmoji',
    useFilenameAsScheduledDate: false,
    filenameAsScheduledDateFormat: '',
    filenameAsDateFolders: [],
    statusSettings: {
        coreStatuses: [
            { symbol: ' ', name: 'Todo', nextStatusSymbol: 'x', type: 'TODO' },
            { symbol: 'x', name: 'Done', nextStatusSymbol: ' ', type: 'DONE' },
        ],
        customStatuses: [
            { symbol: '/', name: 'In Progress', nextStatusSymbol: 'x', type: 'IN_PROGRESS' },
            { symbol: '-', name: 'Cancelled', nextStatusSymbol: ' ', type: 'CANCELLED' },
        ],
    },
};

const SKIP_DIRECTORIES = new Set(['.git', '.obsidian', 'node_modules']);

// ---------------------------------------------------------------------------------------------
// Ported serializer grammar (src/TaskSerializer/DefaultTaskSerializer.ts:57-113,
// src/TaskSerializer/DataviewTaskSerializer.ts:16-95, src/Task/TaskRegularExpressions.ts:56-68).
// The sources are reproduced, not approximated, so that the tool's parse boundary is the
// plugin's parse boundary.
// ---------------------------------------------------------------------------------------------

const TASK_ID_SOURCE = '[a-zA-Z0-9-_]+';
const TASK_ID_SEQUENCE_SOURCE = `${TASK_ID_SOURCE}( *, *${TASK_ID_SOURCE} *)*`;

/** `src/Task/TaskRegularExpressions.ts:56` — a terminal block ID is removed before deserialization. */
export const BLOCK_LINK_REGEX = / \^[a-zA-Z0-9-]+$/u;
/** `src/Task/TaskRegularExpressions.ts:67` — punctuation, including the comma, terminates a tag. */
export const HASH_TAGS_SOURCE = '(^|\\s)#[^ !@#$%^&*(),.?":{}|<>]+';
const HASH_TAGS_FROM_END = new RegExp(`${HASH_TAGS_SOURCE}$`);
const HASH_TAGS_GLOBAL = new RegExp(HASH_TAGS_SOURCE, 'g');

/** `src/Task/TaskRegularExpressions.ts:25` — indentation, list marker, checkbox, remainder. */
const TASK_REGEX = /^([\s\t>]*)([-*+]|[0-9]+[.)]) +\[(.)\] *(.*)/u;

function fieldRegex(symbols, valueRegexString) {
    // ️? allows exactly one optional Variation Selector 16 after the signifier.
    let source = `${symbols}\\uFE0F?`;
    if (valueRegexString !== '') source += ` *${valueRegexString}`;
    source += '$';
    // The 'u' flag is deliberately absent upstream, to fix parsing on iPadOS/iOS.
    return new RegExp(source);
}

function dateFieldRegex(symbols) {
    return fieldRegex(symbols, '(\\d{4}-\\d{2}-\\d{2})');
}

function toInlineFieldRegex(innerSource) {
    return new RegExp(
        `(?:(?=[^\\]]+\\])\\[|(?=[^)]+\\))\\() *${innerSource} *[)\\]](?: *,)?$`,
    );
}

const EMOJI_SYMBOLS = {
    format: 'tasksPluginEmoji',
    priorityRegex: fieldRegex('(🔺|⏫|🔼|🔽|⏬)', ''),
    startDateRegex: dateFieldRegex('🛫'),
    createdDateRegex: dateFieldRegex('➕'),
    scheduledDateRegex: dateFieldRegex('(?:⏳|⌛)'),
    dueDateRegex: dateFieldRegex('(?:📅|📆|🗓)'),
    doneDateRegex: dateFieldRegex('✅'),
    cancelledDateRegex: dateFieldRegex('❌'),
    recurrenceRegex: fieldRegex('🔁', '([a-zA-Z0-9, !]+)'),
    onCompletionRegex: fieldRegex('🏁', '([a-zA-Z]+)'),
    dependsOnRegex: fieldRegex('⛔', `(${TASK_ID_SEQUENCE_SOURCE})`),
    idRegex: fieldRegex('🆔', `(${TASK_ID_SOURCE})`),
};

const DATAVIEW_SYMBOLS = {
    format: 'dataview',
    priorityRegex: toInlineFieldRegex('priority:: *(highest|high|medium|low|lowest)'),
    startDateRegex: toInlineFieldRegex('start:: *(\\d{4}-\\d{2}-\\d{2})'),
    createdDateRegex: toInlineFieldRegex('created:: *(\\d{4}-\\d{2}-\\d{2})'),
    scheduledDateRegex: toInlineFieldRegex('scheduled:: *(\\d{4}-\\d{2}-\\d{2})'),
    dueDateRegex: toInlineFieldRegex('due:: *(\\d{4}-\\d{2}-\\d{2})'),
    doneDateRegex: toInlineFieldRegex('completion:: *(\\d{4}-\\d{2}-\\d{2})'),
    cancelledDateRegex: toInlineFieldRegex('cancelled:: *(\\d{4}-\\d{2}-\\d{2})'),
    recurrenceRegex: toInlineFieldRegex('repeat:: *([a-zA-Z0-9, !]+)'),
    onCompletionRegex: toInlineFieldRegex('onCompletion:: *([a-zA-Z]+)'),
    dependsOnRegex: toInlineFieldRegex(`dependsOn:: *(${TASK_ID_SEQUENCE_SOURCE})`),
    idRegex: toInlineFieldRegex(`id:: *(${TASK_ID_SOURCE})`),
};

/** `src/TaskSerializer/DefaultTaskSerializer.ts:325` and its `runs <= maxRuns` exit test. */
export const MAX_SCAN_RUNS = 20;

export function parseArgs(argv, options = {}) {
    const booleans = new Set(options.booleans ?? []);
    const values = new Set(options.values ?? []);
    const result = { _: [] };
    for (let index = 0; index < argv.length; index += 1) {
        const token = argv[index];
        if (!token.startsWith('--')) {
            result._.push(token);
            continue;
        }
        const equal = token.indexOf('=');
        const name = token.slice(2, equal === -1 ? undefined : equal);
        if (booleans.has(name)) {
            result[name] = equal === -1 ? true : token.slice(equal + 1) !== 'false';
            continue;
        }
        if (!values.has(name)) {
            throw new Error(`unknown option --${name}`);
        }
        const value = equal === -1 ? argv[++index] : token.slice(equal + 1);
        if (value === undefined) {
            throw new Error(`missing value for --${name}`);
        }
        result[name] = value;
    }
    return result;
}

export function resolveVault(value) {
    if (value === undefined || value === null || value === '') {
        throw new Error('a vault path is required');
    }
    const vault = path.resolve(value);
    if (!fs.existsSync(vault) || !fs.statSync(vault).isDirectory()) {
        throw new Error(`vault is not a directory: ${vault}`);
    }
    return vault;
}

/**
 * Accept the vault positionally or through `--vault`, exactly as the Dataview linter does,
 * and reject every ambiguous form instead of silently scanning the current directory.
 */
export function resolveVaultArgument(args) {
    if (args._.length > 1) {
        throw new Error('at most one positional VAULT is allowed');
    }
    const positional = args._[0];
    const explicit = args.vault;
    if (explicit !== undefined && positional !== undefined) {
        if (path.resolve(explicit) !== path.resolve(positional)) {
            throw new Error(
                `positional VAULT ${positional} contradicts --vault ${explicit}; pass the vault once`,
            );
        }
    }
    const chosen = explicit ?? positional;
    if (chosen === undefined) {
        throw new Error('a vault path is required: pass it positionally or with --vault');
    }
    return resolveVault(chosen);
}

/** Reject a file argument that resolves outside the declared vault. */
export function resolveVaultFile(vault, value, option) {
    const absolute = path.resolve(vault, String(value).replace(/\\/g, '/'));
    if (absolute !== vault && !absolute.startsWith(`${vault}${path.sep}`)) {
        throw new Error(`${option} must name a path inside the vault: ${value}`);
    }
    return absolute;
}

export function toPosix(value) {
    return value.split(path.sep).join('/');
}

export function relativeTo(vault, file) {
    return toPosix(path.relative(vault, file));
}

export function readJson(file, fallback = null) {
    try {
        return JSON.parse(fs.readFileSync(file, 'utf8'));
    } catch (error) {
        if (error?.code === 'ENOENT') return fallback;
        throw new Error(`cannot parse ${file}: ${error.message}`);
    }
}

/**
 * Reproduce the plugin's preset resolution (`src/Config/Settings.ts:282`, `:218`).
 *
 * A user-supplied map replaces the defaults wholesale; the defaults apply only when the
 * vault has never written either key. Seeding the defaults into a user map would resurrect
 * presets the user deleted.
 */
export function resolvePresets(userSettings) {
    if (userSettings && typeof userSettings === 'object') {
        if ('presets' in userSettings) {
            return { presets: { ...(userSettings.presets ?? {}) }, origin: 'vault-presets' };
        }
        if ('includes' in userSettings) {
            return { presets: { ...(userSettings.includes ?? {}) }, origin: 'migrated-includes' };
        }
    }
    return { presets: { ...DEFAULT_PRESETS }, origin: 'pinned-defaults' };
}

function mergeSettings(user) {
    const merged = {
        ...DEFAULT_SETTINGS,
        ...(user ?? {}),
        statusSettings: {
            ...DEFAULT_SETTINGS.statusSettings,
            ...(user?.statusSettings ?? {}),
        },
    };
    const resolved = resolvePresets(user);
    merged.presets = resolved.presets;
    merged.presetsOrigin = resolved.origin;
    return merged;
}

export function loadTasksConfig(vault) {
    const plugin = path.join(vault, '.obsidian', 'plugins', STUDIED_PLUGIN_ID);
    const manifestPath = path.join(plugin, 'manifest.json');
    const dataPath = path.join(plugin, 'data.json');
    const manifest = readJson(manifestPath, null);
    const userSettings = readJson(dataPath, null);
    return {
        manifest,
        settings: mergeSettings(userSettings),
        manifestPath,
        dataPath,
        hasSettings: userSettings !== null,
    };
}

/**
 * State the version and settings a report depends on, so that a clean result is never read as
 * a claim about an unstudied release.
 */
export function environmentAssumptions(config, relativeConfig) {
    const assumptions = [];
    const diagnostics = [];
    const detected = config.manifest?.version ?? null;
    if (detected === null) {
        assumptions.push(
            `Tasks plugin manifest was not found; every rule assumes the studied release ${STUDIED_PLUGIN_VERSION}.`,
        );
        diagnostics.push(
            diagnostic(
                relativeConfig,
                1,
                1,
                'warning',
                'TE001-plugin-version-unknown',
                `no Tasks manifest.json under .obsidian/plugins/${STUDIED_PLUGIN_ID}; results assume Tasks ${STUDIED_PLUGIN_VERSION} and may not describe the installed plugin`,
            ),
        );
    } else if (detected !== STUDIED_PLUGIN_VERSION) {
        assumptions.push(
            `Installed Tasks ${detected} is outside the studied boundary ${STUDIED_PLUGIN_VERSION}.`,
        );
        diagnostics.push(
            diagnostic(
                relativeConfig,
                1,
                1,
                'warning',
                'TE002-plugin-version-outside-boundary',
                `installed Tasks ${detected} is outside the studied ${STUDIED_PLUGIN_VERSION} boundary; grammar, presets and defaults may differ`,
            ),
        );
    } else {
        assumptions.push(`Installed Tasks ${detected} matches the studied release.`);
    }
    if (!config.hasSettings) {
        assumptions.push(
            'Tasks data.json was not found; pinned default settings and the eight pinned presets are assumed.',
        );
    } else {
        assumptions.push(
            `Preset definitions came from ${
                config.settings.presetsOrigin === 'vault-presets'
                    ? 'the vault presets map'
                    : config.settings.presetsOrigin === 'migrated-includes'
                      ? 'the legacy includes map, migrated as the plugin does'
                      : 'the pinned defaults, because the vault defines neither presets nor includes'
            }.`,
        );
    }
    return { assumptions, diagnostics };
}

export function walkMarkdown(vault) {
    const files = [];
    const visit = (directory) => {
        const entries = fs.readdirSync(directory, { withFileTypes: true });
        for (const entry of entries) {
            if (entry.isDirectory() && SKIP_DIRECTORIES.has(entry.name)) continue;
            const absolute = path.join(directory, entry.name);
            if (entry.isDirectory()) {
                visit(absolute);
            } else if (entry.isFile() && entry.name.toLowerCase().endsWith('.md')) {
                files.push(absolute);
            }
        }
    };
    visit(vault);
    return files.sort();
}

export function readMarkdown(file) {
    const text = fs.readFileSync(file, 'utf8').replace(/\r\n?/g, '\n');
    return { text, lines: text.split('\n') };
}

function parseScalar(raw) {
    const value = raw.trim();
    if (value === 'true') return true;
    if (value === 'false') return false;
    if (value === 'null' || value === '~') return null;
    if (/^-?\d+(?:\.\d+)?$/.test(value)) return Number(value);
    if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
    ) {
        return value.slice(1, -1);
    }
    return value;
}

export function parseFrontmatter(lines) {
    if (lines[0]?.trim() !== '---') return { data: {}, endLine: 0 };
    const data = {};
    let index = 1;
    for (; index < lines.length; index += 1) {
        const line = lines[index];
        if (line.trim() === '---') return { data, endLine: index + 1 };
        const match = /^([A-Za-z0-9_-]+):(?:\s*(.*))?$/.exec(line);
        if (!match) continue;
        const [, key, raw = ''] = match;
        if (/^[|>][-+]?$/.test(raw.trim())) {
            const values = [];
            const baseIndent = line.match(/^\s*/)[0].length;
            let next = index + 1;
            for (; next < lines.length; next += 1) {
                const candidate = lines[next];
                const indent = candidate.match(/^\s*/)[0].length;
                if (candidate.trim() && indent <= baseIndent) break;
                values.push(candidate.slice(Math.min(candidate.length, baseIndent + 2)));
            }
            data[key] = values.join('\n').replace(/\n+$/, '');
            index = next - 1;
        } else {
            data[key] = parseScalar(raw);
        }
    }
    return { data: {}, endLine: 0, malformed: true };
}

function withoutQuotePrefix(line) {
    return line.replace(/^\s*(?:>\s*)*/, '');
}

/**
 * Extract `tasks` code blocks using the character-and-length-aware fence rule Obsidian
 * documents for fenced code (`obsidian-help@a97de34c:en/Editing and formatting/Basic formatting syntax.md:377`).
 * Three or more backticks or tildes open a block; only a fence of the same character and at
 * least the opening length closes it.
 */
export function extractTasksBlocks(lines) {
    const blocks = [];
    let open = null;
    for (let index = 0; index < lines.length; index += 1) {
        const line = lines[index];
        const stripped = withoutQuotePrefix(line);
        if (open) {
            const closing = /^(`{3,}|~{3,})\s*$/.exec(stripped);
            if (closing && closing[1][0] === open.character && closing[1].length >= open.length) {
                if (open.isTasks) {
                    blocks.push(finishBlock(open, blocks.length + 1, index + 1, true));
                }
                open = null;
                continue;
            }
            if (open.isTasks) {
                open.body.push({ text: open.quoted ? stripped : line, line: index + 1 });
            }
            continue;
        }
        const opening = /^(`{3,}|~{3,})\s*([A-Za-z0-9_-]+)?(?:\s+.*)?$/.exec(stripped);
        if (!opening) continue;
        open = {
            character: opening[1][0],
            length: opening[1].length,
            isTasks: (opening[2] ?? '').toLowerCase() === 'tasks',
            quoted: stripped !== line,
            startLine: index + 1,
            startColumn: line.length - stripped.length + 1,
            body: [],
        };
    }
    if (open?.isTasks) {
        blocks.push(finishBlock(open, blocks.length + 1, lines.length, false));
    }
    return blocks;
}

function finishBlock(open, index, endLine, closed) {
    return {
        index,
        startLine: open.startLine,
        startColumn: open.startColumn,
        endLine,
        closed,
        fence: open.character.repeat(open.length),
        lines: open.body,
        source: open.body.map((entry) => entry.text).join('\n'),
    };
}

// ---------------------------------------------------------------------------------------------
// Line continuations (src/Query/Scanner.ts:68-108). Applied before preset expansion and before
// any per-instruction diagnostic, exactly as the plugin applies them before query parsing.
// ---------------------------------------------------------------------------------------------

const endsWith1Slash = (value) => value.endsWith('\\');
const endsWith2Slashes = (value) => value.endsWith('\\\\');

function adjustLine(inputLine, continuePreviousLine) {
    let adjusted = inputLine;
    if (continuePreviousLine) adjusted = adjusted.replace(/^[ \t]*/, '');
    if (endsWith2Slashes(adjusted)) {
        adjusted = adjusted.slice(0, -1);
    } else if (endsWith1Slash(inputLine)) {
        adjusted = adjusted.replace(/[ \t]*\\$/, '');
    }
    return adjusted;
}

/**
 * Join backslash-continued physical lines into logical statements.
 *
 * @param entries physical lines as `{ text, line }`; `line` may be null for generated sources.
 * @returns statements as `{ text, firstLine, lastLine, physicalLines }`
 */
export function continueLines(entries) {
    const statements = [];
    let continuePreviousLine = false;
    let processed = '';
    let physicalLines = [];
    const guaranteedFinalEol = [...entries, { text: '', line: null }];
    for (const entry of guaranteedFinalEol) {
        const inputLine = entry.text;
        const adjusted = adjustLine(inputLine, continuePreviousLine);
        if (continuePreviousLine) {
            processed += ` ${adjusted}`;
            physicalLines.push(entry.line);
        } else {
            processed = adjusted;
            physicalLines = [entry.line];
        }
        continuePreviousLine = endsWith2Slashes(inputLine) ? false : endsWith1Slash(inputLine);
        if (!continuePreviousLine) {
            if (processed.trim() !== '') {
                const known = physicalLines.filter((value) => value !== null);
                statements.push({
                    text: processed,
                    firstLine: known[0] ?? null,
                    lastLine: known.at(-1) ?? null,
                    physicalLines: known,
                });
            }
            processed = '';
            physicalLines = [];
        }
    }
    return statements;
}

/** Split a settings-supplied source string, honouring the same continuation rule. */
export function splitSourceHonouringLineContinuations(source) {
    return continueLines(
        String(source ?? '')
            .split(/\r?\n/)
            .map((text) => ({ text, line: null })),
    ).map((statement) => statement.text);
}

function queryDefaults(frontmatter) {
    const lines = [];
    const map = {
        TQ_show_backlink: 'backlink',
        TQ_show_nested_backlink: 'nested backlink',
        TQ_show_task_count: 'task count',
        TQ_show_urgency: 'urgency',
        TQ_show_tree: 'tree',
        TQ_show_edit_button: 'edit button',
        TQ_show_postpone_button: 'postpone button',
        TQ_show_toolbar: 'toolbar',
        TQ_show_id: 'id',
        TQ_show_depends_on: 'depends on',
        TQ_show_priority: 'priority',
        TQ_show_recurrence_rule: 'recurrence rule',
        TQ_show_on_completion: 'on completion',
        TQ_show_created_date: 'created date',
        TQ_show_start_date: 'start date',
        TQ_show_scheduled_date: 'scheduled date',
        TQ_show_due_date: 'due date',
        TQ_show_cancelled_date: 'cancelled date',
        TQ_show_done_date: 'done date',
        TQ_show_tags: 'tags',
    };
    for (const [key, element] of Object.entries(map)) {
        if (typeof frontmatter[key] === 'boolean') {
            lines.push(`${frontmatter[key] ? 'show' : 'hide'} ${element}`);
        }
    }
    if (frontmatter.TQ_explain === true) lines.push('explain');
    if (typeof frontmatter.TQ_short_mode === 'boolean') {
        lines.push(frontmatter.TQ_short_mode ? 'short mode' : 'full mode');
    }
    if (typeof frontmatter.TQ_extra_instructions === 'string') {
        lines.push(...frontmatter.TQ_extra_instructions.split('\n'));
    }
    return lines;
}

const PRESET_INSTRUCTION = /^preset +(.*)/i;
const PRESET_PLACEHOLDER = /\{\{preset\.([^}]+)\}\}/g;
const MAX_PLACEHOLDER_EXPANSIONS = 10;

function recordPresetCycle(state, cycle, origin) {
    const key = JSON.stringify([cycle, origin.kind, origin.line, origin.presetChain ?? []]);
    if (state.cycleKeys.has(key)) return;
    state.cycleKeys.add(key);
    state.cycles.push({ cycle, origin });
}

function recordUnknownPreset(state, name, origin) {
    const key = JSON.stringify([name, origin.kind, origin.line, origin.presetChain ?? []]);
    if (state.unknownKeys.has(key)) return;
    state.unknownKeys.add(key);
    state.unknown.push({ name, origin });
}

function originWithPresetChain(origin, presetChain) {
    if (presetChain.length === 0) return origin;
    return { ...origin, presetChain };
}

function appendExpandedSegment(segments, text, presetChain) {
    if (text === '') return;
    const previous = segments.at(-1);
    if (
        previous &&
        previous.presetChain.length === presetChain.length &&
        previous.presetChain.every((name, index) => name === presetChain[index])
    ) {
        previous.text += text;
        return;
    }
    segments.push({ text, presetChain: [...presetChain] });
}

function expandedSegmentsToStatements(segments, statement) {
    const physicalLines = [{ text: '', presetChain: [] }];
    for (const segment of segments) {
        const pieces = segment.text.split(/\r?\n/);
        for (let index = 0; index < pieces.length; index += 1) {
            if (index > 0) physicalLines.push({ text: '', presetChain: [] });
            const current = physicalLines.at(-1);
            current.text += pieces[index];
            if (pieces[index] !== '') {
                for (const name of segment.presetChain) {
                    if (!current.presetChain.includes(name)) current.presetChain.push(name);
                }
            }
        }
    }

    return continueLines(
        physicalLines.map((line, index) => ({ text: line.text, line: index })),
    ).map((logical) => {
        const presetChain = [];
        for (const lineIndex of logical.physicalLines) {
            for (const name of physicalLines[lineIndex].presetChain) {
                if (!presetChain.includes(name)) presetChain.push(name);
            }
        }
        return {
            ...statement,
            text: logical.text.trim(),
            origin: originWithPresetChain(statement.origin, presetChain),
        };
    });
}

/**
 * Reproduce Query.expandPlaceholders() for the preset namespace.
 *
 * The pinned query parser expands placeholders repeatedly, at most ten times, normalises line
 * continuations in the expanded value and then turns every resulting line into its own Statement
 * (`src/Query/Query.ts:174-235`). Other query.* placeholders stay intact for the caller-specific
 * evaluator, but preset placeholders must be resolved here so hidden instructions are linted.
 */
function expandPresetPlaceholders(statement, presets, state) {
    // Query.expandPlaceholders() returns comments unchanged before attempting Mustache expansion.
    if (/^#/.test(statement.text)) return [{ ...statement, text: statement.text.trim() }];

    let segments = [
        {
            text: statement.text,
            presetChain: [...(statement.origin.presetChain ?? [])],
        },
    ];
    for (let iteration = 0; iteration < MAX_PLACEHOLDER_EXPANSIONS; iteration += 1) {
        const next = [];
        let changed = false;
        for (const segment of segments) {
            PRESET_PLACEHOLDER.lastIndex = 0;
            let cursor = 0;
            for (const match of segment.text.matchAll(PRESET_PLACEHOLDER)) {
                appendExpandedSegment(next, segment.text.slice(cursor, match.index), segment.presetChain);
                const name = match[1].trim();
                const origin = originWithPresetChain(statement.origin, segment.presetChain);
                if (!(name in presets)) {
                    recordUnknownPreset(state, name, origin);
                    appendExpandedSegment(next, match[0], segment.presetChain);
                } else if (segment.presetChain.includes(name)) {
                    recordPresetCycle(state, [...segment.presetChain, name], origin);
                    appendExpandedSegment(next, match[0], segment.presetChain);
                } else {
                    appendExpandedSegment(next, String(presets[name]), [...segment.presetChain, name]);
                    changed = true;
                }
                cursor = match.index + match[0].length;
            }
            appendExpandedSegment(next, segment.text.slice(cursor), segment.presetChain);
        }
        segments = next;
        if (!changed) break;
    }

    return expandedSegmentsToStatements(segments, statement);
}

/**
 * Expand `preset name` instructions and `{{preset.name}}` placeholders, keeping every produced
 * statement joined to the physical location it came from.
 *
 * Upstream recurses without a cycle guard (`src/Query/Query.ts:520`); this tool stops instead
 * and records the cycle, which is a deliberate, reported divergence.
 */
function expandPresets(statements, presets, state, chain = []) {
    const output = [];
    for (const statement of statements) {
        for (const expanded of expandPresetPlaceholders(statement, presets, state)) {
            const preset = PRESET_INSTRUCTION.exec(expanded.text.trim());
            if (!preset) {
                output.push(expanded);
                continue;
            }
            const name = preset[1].trim();
            if (!(name in presets)) {
                recordUnknownPreset(state, name, expanded.origin);
                output.push(expanded);
                continue;
            }
            if (chain.includes(name)) {
                recordPresetCycle(state, [...chain, name], expanded.origin);
                continue;
            }
            const inner = splitSourceHonouringLineContinuations(presets[name]).map((text) => ({
                text,
                origin: {
                    ...expanded.origin,
                    presetChain: [...(expanded.origin.presetChain ?? []), name],
                },
            }));
            output.push(...expandPresets(inner, presets, state, [...chain, name]));
        }
    }
    return output;
}

/**
 * Assemble the effective query the plugin would execute: global query, query-file defaults and
 * block instructions, each continued, then preset-expanded, with the origin of every produced
 * statement preserved.
 */
export function buildEffectiveQuery(block, frontmatter, settings, options = {}) {
    const blockLine = block.startLine;
    const defaults = queryDefaults(frontmatter);
    const defaultStatements = continueLines(
        defaults.map((text) => ({ text, line: blockLine })),
    ).map((statement) => ({
        text: statement.text,
        origin: { kind: 'query-file-defaults', line: blockLine },
    }));
    const blockStatements = continueLines(block.lines).map((statement) => ({
        text: statement.text,
        origin: {
            kind: 'block',
            line: statement.firstLine ?? blockLine,
            physicalLines: statement.physicalLines,
        },
    }));
    const local = [...defaultStatements, ...blockStatements];
    const ignoreGlobal = local.some((statement) =>
        /^\s*ignore global query\s*$/i.test(statement.text),
    );
    const globalSource = String(settings.globalQuery ?? '');
    const global =
        ignoreGlobal || globalSource === ''
            ? []
            : splitSourceHonouringLineContinuations(globalSource).map((text) => ({
                  text,
                  origin: { kind: 'global-query', line: blockLine },
              }));
    const state = {
        unknown: [],
        unknownKeys: new Set(),
        cycles: [],
        cycleKeys: new Set(),
    };
    const statements = expandPresets(
        [...global, ...local],
        settings.presets ?? {},
        state,
    );
    return {
        defaults,
        global: global.map((statement) => statement.text),
        ignoreGlobal,
        statements,
        lines: statements.map((statement) => statement.text),
        unknownPresets: state.unknown,
        presetCycles: state.cycles,
        blockStatements,
        options,
    };
}

/** True when the statement did not come from the visible block text. */
export function isHiddenOrigin(origin) {
    return origin.kind !== 'block' || Boolean(origin.presetChain?.length);
}

export function describeOrigin(origin) {
    const chain = origin.presetChain?.length ? ` via preset ${origin.presetChain.join(' → ')}` : '';
    if (origin.kind === 'block') return chain ? `block${chain}` : 'block';
    if (origin.kind === 'global-query') return `global query${chain}`;
    return `query-file defaults${chain}`;
}

export function extractTaskLines(lines, file) {
    const tasks = [];
    let fence = null;
    for (let index = 0; index < lines.length; index += 1) {
        const stripped = withoutQuotePrefix(lines[index]);
        const fenceMatch = /^(`{3,}|~{3,})/.exec(stripped);
        if (fenceMatch) {
            if (fence === null) {
                fence = { character: fenceMatch[1][0], length: fenceMatch[1].length };
            } else if (
                fenceMatch[1][0] === fence.character &&
                fenceMatch[1].length >= fence.length &&
                /^(`{3,}|~{3,})\s*$/.test(stripped)
            ) {
                fence = null;
            }
            continue;
        }
        if (fence !== null) continue;
        const match = TASK_REGEX.exec(lines[index]);
        if (!match) continue;
        const leading = match[1];
        const quoteRemoved = leading.replace(/>\s*/g, '');
        tasks.push({
            file,
            line: index + 1,
            raw: lines[index],
            leading,
            indent: quoteRemoved.replace(/\t/g, '    ').length,
            marker: match[2],
            status: match[3],
            body: match[4].trim(),
        });
    }
    return tasks;
}

function validCalendarDate(value) {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
    if (!match) return false;
    const [, year, month, day] = match.map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));
    return (
        date.getUTCFullYear() === year &&
        date.getUTCMonth() === month - 1 &&
        date.getUTCDate() === day
    );
}

/**
 * Port of `DefaultTaskSerializer.deserialize` (`src/TaskSerializer/DefaultTaskSerializer.ts:298`).
 *
 * One pass tries every field regex in the plugin's order, each anchored at the end of the
 * remaining line; the loop repeats while the previous pass matched something and `runs`
 * has not passed `maxRuns`, which permits a 21st iteration.
 */
function deserialize(body, symbols) {
    const state = { line: body, matched: false };
    const occurrences = [];
    const fields = {};
    let trailingTags = '';
    let runs = 0;

    const extract = (regex, field, transform) => {
        const match = state.line.match(regex);
        if (match === null) return;
        const value = transform(match);
        if (value !== undefined) {
            occurrences.push({ field, value });
            fields[field] = value;
        }
        state.line = state.line.replace(regex, '').trim();
        state.matched = true;
    };

    do {
        state.matched = false;
        extract(symbols.priorityRegex, 'priority', (match) => parsePriorityName(match[1], symbols));
        extract(symbols.doneDateRegex, 'done', (match) => match[1]);
        extract(symbols.cancelledDateRegex, 'cancelled', (match) => match[1]);
        extract(symbols.dueDateRegex, 'due', (match) => match[1]);
        extract(symbols.scheduledDateRegex, 'scheduled', (match) => match[1]);
        extract(symbols.startDateRegex, 'start', (match) => match[1]);
        extract(symbols.createdDateRegex, 'created', (match) => match[1]);
        extract(symbols.recurrenceRegex, 'recurrence', (match) => match[1].trim());
        extract(symbols.onCompletionRegex, 'onCompletion', (match) => parseOnCompletion(match[1]));
        extract(HASH_TAGS_FROM_END, 'trailingTag', (match) => {
            const tagName = match[0].trim();
            trailingTags = trailingTags.length > 0 ? `${tagName} ${trailingTags}` : tagName;
            return undefined;
        });
        extract(symbols.idRegex, 'id', (match) => match[1].trim());
        extract(symbols.dependsOnRegex, 'dependsOn', (match) =>
            match[1].replace(/ /g, '').split(',').filter((item) => item !== ''),
        );
        runs += 1;
    } while (state.matched && runs <= MAX_SCAN_RUNS);

    if (trailingTags.length > 0) state.line += ` ${trailingTags}`;
    const description = state.line;
    const tags = [...description.matchAll(HASH_TAGS_GLOBAL)].map((match) => match[0].trim());
    return {
        fields,
        occurrences,
        tags,
        description,
        runs,
        // The scan stopped because the failsafe was reached, not because the line was exhausted.
        exhausted: state.matched && runs > MAX_SCAN_RUNS,
    };
}

function parsePriorityName(symbol, symbols) {
    if (symbols.format === 'dataview') {
        const name = String(symbol).toLowerCase();
        return ['lowest', 'low', 'medium', 'high', 'highest'].includes(name) ? name : 'none';
    }
    const map = { '🔺': 'highest', '⏫': 'high', '🔼': 'medium', '🔽': 'low', '⏬': 'lowest' };
    return map[symbol] ?? 'none';
}

function parseOnCompletion(value) {
    const normalized = String(value).trim().toLowerCase();
    if (normalized === 'delete') return 'delete';
    if (normalized === 'keep') return 'keep';
    return '';
}

function inferFilenameDate(task, settings, fields) {
    if (!settings.useFilenameAsScheduledDate) return null;
    if (fields.start || fields.scheduled || fields.due) return null;
    const relative = toPosix(task.file);
    const folders = settings.filenameAsDateFolders ?? [];
    if (
        folders.length &&
        !folders.some((folder) => {
            const normalized = String(folder).replace(/^\/+|\/+$/g, '');
            return relative === `${normalized}.md` || relative.startsWith(`${normalized}/`);
        })
    ) {
        return null;
    }
    const name = path.basename(task.file, path.extname(task.file));
    const dashed = /(?:^|\D)(\d{4})-(\d{2})-(\d{2})(?:\D|$)/.exec(name);
    const compact = /(?:^|\D)(\d{4})(\d{2})(\d{2})(?:\D|$)/.exec(name);
    const match = dashed ?? compact;
    if (!match) {
        return settings.filenameAsScheduledDateFormat
            ? { value: null, customFormatUnresolved: true }
            : null;
    }
    const value = `${match[1]}-${match[2]}-${match[3]}`;
    return { value, valid: validCalendarDate(value), customFormatUnresolved: false };
}

export function parseTask(task, settings) {
    const selectedDataview = settings.taskFormat === 'dataview';
    const selectedSymbols = selectedDataview ? DATAVIEW_SYMBOLS : EMOJI_SYMBOLS;
    const otherSymbols = selectedDataview ? EMOJI_SYMBOLS : DATAVIEW_SYMBOLS;

    // `src/Task/Task.ts:301` removes a terminal block ID before the serializer sees the body.
    const blockLinkMatch = task.body.match(BLOCK_LINK_REGEX);
    const blockLink = blockLinkMatch === null ? '' : blockLinkMatch[0];
    const body = blockLink === '' ? task.body : task.body.replace(BLOCK_LINK_REGEX, '').trim();

    const selected = deserialize(body, selectedSymbols);
    const other = deserialize(body, otherSymbols);
    const inferred = inferFilenameDate(task, settings, selected.fields);
    if (inferred?.value && !selected.fields.scheduled) {
        selected.fields.scheduled = inferred.value;
        selected.fields.scheduledInferred = true;
    }
    const duplicates = [
        ...new Set(
            selected.occurrences
                .map((item) => item.field)
                .filter((field) => field !== 'trailingTag')
                .filter((field, index, all) => all.indexOf(field) !== index),
        ),
    ];
    const invalidDates = [];
    for (const field of ['created', 'start', 'scheduled', 'due', 'cancelled', 'done']) {
        const value = selected.fields[field];
        if (value && !validCalendarDate(value)) invalidDates.push(field);
    }
    return {
        ...task,
        body,
        blockLink,
        selectedFormat: selectedDataview ? 'dataview' : 'tasksPluginEmoji',
        fields: selected.fields,
        occurrences: selected.occurrences.filter((item) => item.field !== 'trailingTag'),
        tags: selected.tags,
        description: selected.description,
        scanRuns: selected.runs,
        scanExhausted: selected.exhausted,
        duplicates,
        invalidDates,
        otherFormatFields: other.occurrences.filter((item) => item.field !== 'trailingTag'),
        inferred,
    };
}

export function statusRegistry(settings) {
    const configured = [
        ...(settings.statusSettings?.coreStatuses ?? DEFAULT_SETTINGS.statusSettings.coreStatuses),
        ...(settings.statusSettings?.customStatuses ??
            DEFAULT_SETTINGS.statusSettings.customStatuses),
    ];
    const bySymbol = new Map();
    for (const status of configured) {
        if (!bySymbol.has(status.symbol)) bySymbol.set(status.symbol, status);
    }
    return { configured, bySymbol };
}

// ---------------------------------------------------------------------------------------------
// Diagnostics and the pluggable reporting layer.
// ---------------------------------------------------------------------------------------------

/**
 * Per-rule metadata. Only rules whose claim genuinely carries uncertainty override the
 * defaults; everything else inherits them.
 */
const RULE_DEFAULT = { category: 'correctness', confidence: 'high', fixSafety: 'intent-required' };
const RULE_META = {
    'TE001-plugin-version-unknown': { category: 'environment', confidence: 'high', fixSafety: 'safe' },
    'TE002-plugin-version-outside-boundary': { category: 'environment', confidence: 'high', fixSafety: 'safe' },
    'TQ001-relative-range-prefix': { category: 'correctness', confidence: 'medium', fixSafety: 'intent-required' },
    'TQ002-sort-trailing-text': { category: 'correctness', confidence: 'high', fixSafety: 'safe' },
    'TQ003-return-substring': { category: 'correctness', confidence: 'high', fixSafety: 'likely' },
    'TQ004-boolean-case': { category: 'syntax', confidence: 'medium', fixSafety: 'likely' },
    'TQ005-chained-xor': { category: 'correctness', confidence: 'medium', fixSafety: 'intent-required' },
    'TQ006-mixed-boolean-delimiters': { category: 'syntax', confidence: 'medium', fixSafety: 'intent-required' },
    'TQ007-priority-above-low': { category: 'correctness', confidence: 'high', fixSafety: 'intent-required' },
    'TQ008-path-all-markdown': { category: 'correctness', confidence: 'high', fixSafety: 'intent-required' },
    'TQ009-tree-extra-rows': { category: 'rendering', confidence: 'high', fixSafety: 'safe' },
    'TQ010-starts-includes-undated': { category: 'correctness', confidence: 'high', fixSafety: 'intent-required' },
    'TQ011-js-disabled': { category: 'environment', confidence: 'high', fixSafety: 'intent-required' },
    'TQ011-js-state-unknown': { category: 'environment', confidence: 'medium', fixSafety: 'intent-required' },
    'TQ012-js-security-review': { category: 'security', confidence: 'high', fixSafety: 'intent-required' },
    'TQ013-null-unsafe-moment': { category: 'correctness', confidence: 'medium', fixSafety: 'likely' },
    'TQ014-locale-weekday': { category: 'correctness', confidence: 'medium', fixSafety: 'likely' },
    'TQ015-repeated-allTasks-scan': { category: 'performance', confidence: 'medium', fixSafety: 'intent-required' },
    'TQ016-built-in-equivalent': { category: 'maintainability', confidence: 'low', fixSafety: 'intent-required' },
    'TQ017-regex-too-long': { category: 'syntax', confidence: 'high', fixSafety: 'intent-required' },
    'TQ018-regex-nested-quantifier': { category: 'performance', confidence: 'high', fixSafety: 'intent-required' },
    'TQ019-unknown-preset': { category: 'correctness', confidence: 'high', fixSafety: 'intent-required' },
    'TQ020-unknown-placeholder': { category: 'correctness', confidence: 'high', fixSafety: 'intent-required' },
    'TQ021-unknown-instruction': { category: 'syntax', confidence: 'medium', fixSafety: 'intent-required' },
    'TQ022-group-limit-without-group': { category: 'correctness', confidence: 'high', fixSafety: 'safe' },
    'TQ023-multiple-task-limits': { category: 'maintainability', confidence: 'high', fixSafety: 'intent-required' },
    'TQ024-unclosed-block': { category: 'syntax', confidence: 'high', fixSafety: 'safe' },
    'TQ025-preset-cycle': { category: 'correctness', confidence: 'high', fixSafety: 'intent-required' },
    'TV001-settings-unavailable': { category: 'environment', confidence: 'high', fixSafety: 'safe' },
    'TV004-non-breaking-space': { category: 'correctness', confidence: 'high', fixSafety: 'likely' },
    'TV005-global-filter-excluded': { category: 'environment', confidence: 'high', fixSafety: 'intent-required' },
    'TV006-unknown-status': { category: 'correctness', confidence: 'high', fixSafety: 'intent-required' },
    'TV008-unparsed-task-field': { category: 'correctness', confidence: 'medium', fixSafety: 'intent-required' },
    'TV014-recurring-in-daily-note': { category: 'correctness', confidence: 'low', fixSafety: 'intent-required' },
    'TV016-inferred-scheduled-date': { category: 'environment', confidence: 'high', fixSafety: 'safe' },
    'TV017-custom-filename-date-unresolved': { category: 'environment', confidence: 'high', fixSafety: 'safe' },
    'TV020-dangling-dependency': { category: 'correctness', confidence: 'medium', fixSafety: 'intent-required' },
    'TV023-scan-limit-reached': { category: 'correctness', confidence: 'high', fixSafety: 'intent-required' },
};

export function ruleMetadata(rule) {
    return RULE_META[rule] ?? RULE_DEFAULT;
}

export function diagnostic(file, line, column, severity, rule, message, extra = {}) {
    const meta = ruleMetadata(rule);
    return {
        file,
        line,
        column,
        severity,
        rule,
        message,
        category: meta.category,
        confidence: meta.confidence,
        fixSafety: meta.fixSafety,
        ...extra,
    };
}

export function sortDiagnostics(items) {
    const rank = { error: 0, warning: 1, info: 2 };
    return items.sort(
        (a, b) =>
            a.file.localeCompare(b.file) ||
            a.line - b.line ||
            a.column - b.column ||
            (rank[a.severity] ?? 9) - (rank[b.severity] ?? 9) ||
            a.rule.localeCompare(b.rule),
    );
}

function renderText(report) {
    let output = '';
    for (const item of report.diagnostics) {
        output += `${item.file}:${item.line}:${item.column} ${item.severity} ${item.rule} [${item.confidence}/${item.fixSafety}] ${item.message}\n`;
    }
    const counts = { error: 0, warning: 0, info: 0 };
    for (const item of report.diagnostics) counts[item.severity] = (counts[item.severity] ?? 0) + 1;
    output += `Tasks audit: ${report.diagnostics.length} finding(s) (${counts.error} error, ${counts.warning} warning, ${counts.info} info)\n`;
    for (const assumption of report.assumptions ?? []) output += `Assumption: ${assumption}\n`;
    for (const limitation of report.limitations ?? []) output += `Limitation: ${limitation}\n`;
    return output;
}

function renderJson(report) {
    return `${JSON.stringify(report, null, 2)}\n`;
}

function renderSarif(report) {
    const used = [...new Set(report.diagnostics.map((item) => item.rule))].sort();
    return `${JSON.stringify(
        {
            version: '2.1.0',
            $schema: 'https://json.schemastore.org/sarif-2.1.0.json',
            runs: [
                {
                    tool: {
                        driver: {
                            name: report.tool,
                            version: report.toolVersion ?? TOOL_VERSION,
                            rules: used.map((id) => ({
                                id,
                                shortDescription: {
                                    text:
                                        report.diagnostics.find((item) => item.rule === id)
                                            ?.message ?? id,
                                },
                                properties: { category: ruleMetadata(id).category },
                            })),
                        },
                    },
                    results: report.diagnostics.map((item) => ({
                        ruleId: item.rule,
                        level:
                            item.severity === 'error'
                                ? 'error'
                                : item.severity === 'warning'
                                  ? 'warning'
                                  : 'note',
                        message: { text: item.message },
                        locations: [
                            {
                                physicalLocation: {
                                    artifactLocation: { uri: item.file },
                                    region: { startLine: item.line, startColumn: item.column },
                                },
                            },
                        ],
                        properties: {
                            category: item.category,
                            confidence: item.confidence,
                            fixSafety: item.fixSafety,
                            ...(item.origin ? { origin: item.origin } : {}),
                        },
                    })),
                    invocations: [
                        {
                            executionSuccessful: true,
                            properties: {
                                assumptions: report.assumptions ?? [],
                                limitations: report.limitations ?? [],
                            },
                        },
                    ],
                },
            ],
        },
        null,
        2,
    )}\n`;
}

/**
 * Output formats are registered here rather than branched on inside each tool, so an
 * additional renderer — for example a vault-readable Markdown report — is one entry.
 */
export const REPORT_FORMATS = new Map([
    ['text', renderText],
    ['json', renderJson],
    ['sarif', renderSarif],
]);

export function assertFormat(format) {
    if (!REPORT_FORMATS.has(format)) {
        throw new Error(`--format must be one of ${[...REPORT_FORMATS.keys()].join(', ')}`);
    }
    return format;
}

export function writeReport(report, format) {
    const rendered = { ...report, diagnostics: sortDiagnostics([...report.diagnostics]) };
    process.stdout.write(REPORT_FORMATS.get(format)(rendered));
    return rendered;
}

export function writeUsageError(error, usage, exitCode = EXIT.usage) {
    process.stderr.write(`error: ${error.message}\n${usage}\n`);
    process.exitCode = exitCode;
}

export function dateCompare(left, operator, right) {
    const a = left;
    const b = right;
    if (operator === 'before') return a < b;
    if (operator === 'after') return a > b;
    if (operator === 'on or before' || operator === 'in or before') return a <= b;
    if (operator === 'on or after' || operator === 'in or after') return a >= b;
    return a === b;
}

export function todayString(value = null) {
    if (value) {
        if (!validCalendarDate(value)) throw new Error(`invalid --today date: ${value}`);
        return value;
    }
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

export function addDays(value, amount) {
    const [year, month, day] = value.split('-').map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));
    date.setUTCDate(date.getUTCDate() + amount);
    return date.toISOString().slice(0, 10);
}

export function resolveSimpleDate(value, today) {
    const normalized = value.trim().toLowerCase();
    if (validCalendarDate(normalized)) return normalized;
    if (normalized === 'today') return today;
    if (normalized === 'tomorrow') return addDays(today, 1);
    if (normalized === 'yesterday') return addDays(today, -1);
    const inDays = /^in\s+(\d+)\s+days?$/.exec(normalized);
    if (inDays) return addDays(today, Number(inDays[1]));
    const daysAgo = /^(\d+)\s+days?\s+ago$/.exec(normalized);
    if (daysAgo) return addDays(today, -Number(daysAgo[1]));
    return null;
}

export function hasEmojiSignifier(value) {
    return /[🔺⏫🔼🔽⏬🛫➕⏳⌛📅📆🗓✅❌🔁🏁⛔🆔]/u.test(value);
}

export function hasDataviewTaskField(value) {
    return /[[(](?:created|start|scheduled|due|cancelled|completion|priority|repeat|onCompletion|id|dependsOn)::/u.test(
        value,
    );
}

export function isValidCalendarDate(value) {
    return validCalendarDate(value);
}
