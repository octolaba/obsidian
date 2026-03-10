import fs from 'node:fs';
import path from 'node:path';

export const TOOL_VERSION = '1.0.0';

export const DEFAULT_SETTINGS = {
    presets: {},
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
const DATE_FIELDS = new Map([
    ['➕', 'created'],
    ['🛫', 'start'],
    ['⏳', 'scheduled'],
    ['📅', 'due'],
    ['❌', 'cancelled'],
    ['✅', 'done'],
]);
const PRIORITIES = new Map([
    ['🔺', 'highest'],
    ['⏫', 'high'],
    ['🔼', 'medium'],
    ['🔽', 'low'],
    ['⏬', 'lowest'],
]);
const DATAVIEW_FIELDS = new Map([
    ['created', 'created'],
    ['start', 'start'],
    ['scheduled', 'scheduled'],
    ['due', 'due'],
    ['cancelled', 'cancelled'],
    ['completion', 'done'],
    ['priority', 'priority'],
    ['repeat', 'recurrence'],
    ['onCompletion', 'onCompletion'],
    ['id', 'id'],
    ['dependsOn', 'dependsOn'],
]);

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
    const vault = path.resolve(value ?? '.');
    if (!fs.existsSync(vault) || !fs.statSync(vault).isDirectory()) {
        throw new Error(`vault is not a directory: ${vault}`);
    }
    return vault;
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

function mergeSettings(user) {
    const merged = {
        ...DEFAULT_SETTINGS,
        ...(user ?? {}),
        statusSettings: {
            ...DEFAULT_SETTINGS.statusSettings,
            ...(user?.statusSettings ?? {}),
        },
    };
    merged.presets = { ...(DEFAULT_SETTINGS.presets ?? {}), ...(user?.presets ?? {}) };
    return merged;
}

export function loadTasksConfig(vault) {
    const plugin = path.join(vault, '.obsidian', 'plugins', 'obsidian-tasks-plugin');
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

export function extractTasksBlocks(lines) {
    const blocks = [];
    for (let index = 0; index < lines.length; index += 1) {
        const opening = /^(\s*(?:>\s*)*)```tasks\s*$/i.exec(lines[index]);
        if (!opening) continue;
        const start = index;
        const body = [];
        let closed = false;
        for (index += 1; index < lines.length; index += 1) {
            if (/^\s*(?:>\s*)*```\s*$/.test(lines[index])) {
                closed = true;
                break;
            }
            const prefix = opening[1];
            let text = lines[index];
            if (prefix.trimStart().startsWith('>')) {
                text = text.replace(/^\s*(?:>\s*)*/, '');
            }
            body.push({ text, line: index + 1 });
        }
        blocks.push({
            index: blocks.length + 1,
            startLine: start + 1,
            endLine: index + 1,
            closed,
            lines: body,
            source: body.map((entry) => entry.text).join('\n'),
        });
    }
    return blocks;
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

function expandPresetLines(lines, presets, depth = 0, stack = []) {
    if (depth > 20) return lines;
    const output = [];
    for (const line of lines) {
        const match = /^\s*preset\s+(.+?)\s*$/i.exec(line);
        if (!match) {
            output.push(line.replace(/\{\{preset\.([^}]+)\}\}/g, (_, name) => presets[name] ?? `{{preset.${name}}}`));
            continue;
        }
        const name = match[1];
        if (!(name in presets) || stack.includes(name)) {
            output.push(line);
            continue;
        }
        output.push(
            ...expandPresetLines(String(presets[name]).split(/\r?\n/), presets, depth + 1, [...stack, name]),
        );
    }
    return output;
}

export function buildEffectiveQuery(block, frontmatter, settings) {
    const defaults = queryDefaults(frontmatter);
    const local = [...defaults, ...block.lines.map((entry) => entry.text)];
    const ignoreGlobal = local.some((line) => /^\s*ignore global query\s*$/i.test(line));
    const globalSource = String(settings.globalQuery ?? '');
    const global = ignoreGlobal || globalSource === '' ? [] : globalSource.split(/\r?\n/);
    const assembled = [...global, ...local];
    return {
        defaults,
        global,
        ignoreGlobal,
        lines: expandPresetLines(assembled, settings.presets ?? {}),
    };
}

export function extractTaskLines(lines, file) {
    const tasks = [];
    let fence = null;
    for (let index = 0; index < lines.length; index += 1) {
        const fenceMatch = /^\s*(?:>\s*)*(`{3,}|~{3,})/.exec(lines[index]);
        if (fenceMatch) {
            if (fence === null) {
                fence = fenceMatch[1][0];
            } else if (fence === fenceMatch[1][0]) {
                fence = null;
            }
            continue;
        }
        if (fence !== null) continue;
        const match = /^(\s*(?:>\s*)*)([-*+]|\d+[.)])\s+\[([^\]])\]\s*(.*)$/.exec(lines[index]);
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
            body: match[4],
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

function parseEmoji(body) {
    let rest = body.replace(/\s+$/, '');
    const fields = {};
    const occurrences = [];
    const tags = [];
    let passes = 0;
    while (passes < 200) {
        passes += 1;
        const before = rest;
        const tag = /(?:^|\s)(#[^\s#]+)\s*$/.exec(rest);
        if (tag) {
            tags.unshift(tag[1]);
            rest = rest.slice(0, tag.index).trimEnd();
            continue;
        }
        let matched = false;
        for (const [symbol, field] of DATE_FIELDS) {
            const regex = new RegExp(`${symbol}\\uFE0F?\\s*(\\d{4}-\\d{2}-\\d{2}|Invalid date)\\s*$`, 'u');
            const match = regex.exec(rest);
            if (!match) continue;
            const value = match[1];
            occurrences.push({ field, value, symbol });
            if (!(field in fields)) fields[field] = value;
            rest = rest.slice(0, match.index).trimEnd();
            matched = true;
            break;
        }
        if (matched) continue;
        for (const [symbol, priority] of PRIORITIES) {
            const regex = new RegExp(`${symbol}\\uFE0F?\\s*$`, 'u');
            const match = regex.exec(rest);
            if (!match) continue;
            occurrences.push({ field: 'priority', value: priority, symbol });
            if (!('priority' in fields)) fields.priority = priority;
            rest = rest.slice(0, match.index).trimEnd();
            matched = true;
            break;
        }
        if (matched) continue;
        const id = /🆔\uFE0F?\s*([A-Za-z0-9_-]+)\s*$/u.exec(rest);
        if (id) {
            occurrences.push({ field: 'id', value: id[1], symbol: '🆔' });
            if (!('id' in fields)) fields.id = id[1];
            rest = rest.slice(0, id.index).trimEnd();
            continue;
        }
        const depends = /⛔\uFE0F?\s*([A-Za-z0-9_, -]+)\s*$/u.exec(rest);
        if (depends) {
            const value = depends[1].split(/[\s,]+/).filter(Boolean);
            occurrences.push({ field: 'dependsOn', value, symbol: '⛔' });
            if (!('dependsOn' in fields)) fields.dependsOn = value;
            rest = rest.slice(0, depends.index).trimEnd();
            continue;
        }
        const completion = /🏁\uFE0F?\s*(keep|delete)\s*$/iu.exec(rest);
        if (completion) {
            const value = completion[1].toLowerCase();
            occurrences.push({ field: 'onCompletion', value, symbol: '🏁' });
            if (!('onCompletion' in fields)) fields.onCompletion = value;
            rest = rest.slice(0, completion.index).trimEnd();
            continue;
        }
        const recurrence = /🔁\uFE0F?\s+([^🔺⏫🔼🔽⏬🛫➕⏳📅✅❌🏁⛔🆔]+?)\s*$/u.exec(rest);
        if (recurrence) {
            const value = recurrence[1].trim();
            occurrences.push({ field: 'recurrence', value, symbol: '🔁' });
            if (!('recurrence' in fields)) fields.recurrence = value;
            rest = rest.slice(0, recurrence.index).trimEnd();
            continue;
        }
        if (before === rest) break;
    }
    return {
        fields,
        occurrences,
        tags,
        description: `${rest}${tags.length ? ` ${tags.join(' ')}` : ''}`.trim(),
    };
}

function parseDataview(body) {
    let rest = body.replace(/\s+$/, '');
    const fields = {};
    const occurrences = [];
    let passes = 0;
    while (passes < 200) {
        passes += 1;
        const match = /(?:,\s*)?[\[(]([A-Za-z][A-Za-z0-9]*)::\s*([^\])]*?)[\])]\s*$/.exec(rest);
        if (!match) break;
        const canonical = DATAVIEW_FIELDS.get(match[1]);
        if (!canonical) break;
        let value = match[2].trim();
        if (canonical === 'dependsOn') value = value.split(/[\s,]+/).filter(Boolean);
        occurrences.push({ field: canonical, value, key: match[1] });
        if (!(canonical in fields)) fields[canonical] = value;
        rest = rest.slice(0, match.index).trimEnd();
    }
    const tags = [...rest.matchAll(/(?:^|\s)(#[^\s#]+)/g)].map((match) => match[1]);
    return { fields, occurrences, tags, description: rest.trim() };
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
    const selected = selectedDataview ? parseDataview(task.body) : parseEmoji(task.body);
    const other = selectedDataview ? parseEmoji(task.body) : parseDataview(task.body);
    const inferred = inferFilenameDate(task, settings, selected.fields);
    if (inferred?.value && !selected.fields.scheduled) {
        selected.fields.scheduled = inferred.value;
        selected.fields.scheduledInferred = true;
    }
    const duplicates = [...new Set(
        selected.occurrences
            .map((item) => item.field)
            .filter((field, index, all) => all.indexOf(field) !== index),
    )];
    const invalidDates = [];
    for (const field of ['created', 'start', 'scheduled', 'due', 'cancelled', 'done']) {
        const value = selected.fields[field];
        if (value && value !== 'Invalid date' && !validCalendarDate(value)) invalidDates.push(field);
        if (value === 'Invalid date') invalidDates.push(field);
    }
    return {
        ...task,
        selectedFormat: selectedDataview ? 'dataview' : 'tasksPluginEmoji',
        fields: selected.fields,
        occurrences: selected.occurrences,
        tags: selected.tags,
        description: selected.description,
        duplicates,
        invalidDates,
        otherFormatFields: other.occurrences,
        inferred,
    };
}

export function statusRegistry(settings) {
    const configured = [
        ...(settings.statusSettings?.coreStatuses ?? DEFAULT_SETTINGS.statusSettings.coreStatuses),
        ...(settings.statusSettings?.customStatuses ?? DEFAULT_SETTINGS.statusSettings.customStatuses),
    ];
    const bySymbol = new Map();
    for (const status of configured) {
        if (!bySymbol.has(status.symbol)) bySymbol.set(status.symbol, status);
    }
    return { configured, bySymbol };
}

export function diagnostic(file, line, column, severity, rule, message, extra = {}) {
    return { file, line, column, severity, rule, message, ...extra };
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

export function printDiagnostics(items, format = 'text', metadata = {}) {
    const sorted = sortDiagnostics(items);
    if (format === 'json') {
        process.stdout.write(`${JSON.stringify({ ...metadata, diagnostics: sorted }, null, 2)}\n`);
        return;
    }
    for (const item of sorted) {
        process.stdout.write(
            `${item.file}:${item.line}:${item.column} ${item.severity} ${item.rule} ${item.message}\n`,
        );
    }
    const counts = { error: 0, warning: 0, info: 0 };
    for (const item of sorted) counts[item.severity] = (counts[item.severity] ?? 0) + 1;
    process.stdout.write(
        `Tasks audit: ${sorted.length} finding(s) (${counts.error} error, ${counts.warning} warning, ${counts.info} info)\n`,
    );
}

export function writeUsageError(error, usage) {
    process.stderr.write(`error: ${error.message}\n${usage}\n`);
    process.exitCode = 2;
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
    return /[🔺⏫🔼🔽⏬🛫➕⏳📅✅❌🔁🏁⛔🆔]/u.test(value);
}

export function hasDataviewTaskField(value) {
    return /[\[(](?:created|start|scheduled|due|cancelled|completion|priority|repeat|onCompletion|id|dependsOn)::/u.test(
        value,
    );
}

export function isValidCalendarDate(value) {
    return validCalendarDate(value);
}
