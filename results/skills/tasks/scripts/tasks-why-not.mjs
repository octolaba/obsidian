#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import {
    buildEffectiveQuery,
    dateCompare,
    extractTaskLines,
    extractTasksBlocks,
    isValidCalendarDate,
    loadTasksConfig,
    parseArgs,
    parseFrontmatter,
    parseTask,
    readMarkdown,
    relativeTo,
    resolveSimpleDate,
    resolveVault,
    statusRegistry,
    todayString,
    writeUsageError,
} from './lib.mjs';

const USAGE = `usage: node tasks-why-not.mjs --vault PATH --task-file FILE --task-line N --query-file FILE [--query-block N] [--today YYYY-MM-DD] [--format text|json]`;

function queryFileValues(relative) {
    const normalized = relative.replace(/\\/g, '/');
    const extensionless = normalized.replace(/\.md$/i, '');
    const pieces = normalized.split('/');
    const filename = pieces.at(-1);
    const folder = pieces.length > 1 ? `${pieces.slice(0, -1).join('/')}/` : '/';
    const root = pieces.length > 1 ? `${pieces[0]}/` : '/';
    return {
        path: normalized,
        pathWithoutExtension: extensionless,
        filename,
        filenameWithoutExtension: filename.replace(/\.md$/i, ''),
        folder,
        root,
    };
}

function expandSimplePlaceholders(line, queryFile, frontmatter) {
    const values = queryFileValues(queryFile);
    let unsupported = false;
    let output = line.replace(/\{\{query\.file\.(path|pathWithoutExtension|filename|filenameWithoutExtension|folder|root)\}\}/g, (_, key) => values[key]);
    output = output.replace(
        /\{\{query\.file\.property\(\s*['"]([^'"]+)['"]\s*\)\}\}/g,
        (_, key) => (frontmatter[key] === undefined ? '' : String(frontmatter[key])),
    );
    if (/\{\{[^}]+\}\}/.test(output)) unsupported = true;
    return { output, unsupported };
}

function taskValue(task, field, registry, globalFilter) {
    const relative = task.file;
    const values = queryFileValues(relative);
    const status = registry.bySymbol.get(task.status) ?? { name: 'Unknown', type: 'TODO' };
    const map = {
        description: task.description.replace(globalFilter ?? '', '').trim(),
        path: values.path,
        folder: values.folder,
        root: values.root,
        filename: values.filename,
        'status.name': status.name,
        recurrence: task.fields.recurrence ?? '',
        id: task.fields.id ?? '',
    };
    return map[field];
}

function evaluateDate(task, field, operator, rawDate, today) {
    const target = resolveSimpleDate(rawDate, today);
    if (!target) return { supported: false, reason: `date expression “${rawDate}” is outside the static subset` };
    const candidates =
        field === 'happens'
            ? [task.fields.start, task.fields.scheduled, task.fields.due]
            : [task.fields[field === 'starts' ? 'start' : field]];
    const present = candidates.filter(Boolean);
    if (!present.length) {
        return { supported: true, match: field === 'starts', detail: field === 'starts' ? 'missing start matches starts by design' : 'field is missing' };
    }
    const valid = present.filter(isValidCalendarDate);
    if (!valid.length) return { supported: true, match: false, detail: 'field is invalid' };
    const match = valid.some((value) => dateCompare(value, operator || 'on', target));
    return { supported: true, match, detail: `${valid.join(', ')} ${operator || 'on'} ${target}` };
}

function evaluateInstruction(line, task, context) {
    const value = line.trim();
    if (!value || value.startsWith('#')) return { ignored: true };
    if (
        /^(?:sort by|group by|view |hide |show |short(?: mode)?$|full(?: mode)?$|explain$|ignore global query$|preset )/i.test(
            value,
        )
    ) {
        return { ignored: true };
    }
    if (/^limit(?:\s|$)|^limit groups(?:\s|$)/i.test(value)) {
        return { supported: false, reason: 'limits depend on the complete sorted result set' };
    }
    if (/\b(?:AND|OR|XOR|NOT)\b/.test(value)) {
        return { supported: false, reason: 'Boolean instruction is outside the static evaluator subset' };
    }
    if (/^(?:filter|sort|group) by function\b/i.test(value)) {
        return { supported: false, reason: 'custom JavaScript is never executed by this tool' };
    }

    const status = context.registry.bySymbol.get(task.status) ?? { name: 'Unknown', type: 'TODO' };
    const broadDone = new Set(['DONE', 'CANCELLED', 'NON_TASK']).has(status.type);
    if (/^done$/i.test(value)) return { supported: true, match: broadDone, detail: `status.type=${status.type}` };
    if (/^not done$/i.test(value)) return { supported: true, match: !broadDone, detail: `status.type=${status.type}` };
    if (/^is recurring$/i.test(value)) return { supported: true, match: Boolean(task.fields.recurrence), detail: task.fields.recurrence ?? 'no recurrence' };
    if (/^is not recurring$/i.test(value)) return { supported: true, match: !task.fields.recurrence, detail: task.fields.recurrence ?? 'no recurrence' };
    if (/^(?:is|is not) (?:blocked|blocking)$/i.test(value)) {
        return { supported: false, reason: 'blocking evaluation requires full Tasks dependency/status semantics' };
    }
    if (/^exclude sub-items$/i.test(value)) {
        return { supported: true, match: task.indent === 0, detail: `indent=${task.indent}` };
    }
    const presence = /^(has|no) (cancelled|created|start|scheduled|due|done|happens) date$/i.exec(value);
    if (presence) {
        const values =
            presence[2].toLowerCase() === 'happens'
                ? [task.fields.start, task.fields.scheduled, task.fields.due]
                : [task.fields[presence[2].toLowerCase()]];
        const has = values.some(Boolean);
        const match = presence[1].toLowerCase() === 'has' ? has : !has;
        return { supported: true, match, detail: has ? 'date present' : 'date missing' };
    }
    const invalid = /^(cancelled|created|start|scheduled|due|done) date is invalid$/i.exec(value);
    if (invalid) {
        const field = invalid[1].toLowerCase();
        const date = task.fields[field];
        return {
            supported: true,
            match: Boolean(date) && !isValidCalendarDate(date),
            detail: date ?? 'missing',
        };
    }
    const date = /^(cancelled|created|starts|scheduled|due|done|happens)(?: (on or before|in or before|on or after|in or after|before|after|on|in))? (.+)$/i.exec(value);
    if (date) {
        return evaluateDate(task, date[1].toLowerCase(), date[2]?.toLowerCase() ?? 'on', date[3], context.today);
    }
    const statusType = /^status\.type (is|is not) ([A-Z_]+)$/i.exec(value);
    if (statusType) {
        const equal = status.type.toUpperCase() === statusType[2].toUpperCase();
        return {
            supported: true,
            match: statusType[1].toLowerCase() === 'is' ? equal : !equal,
            detail: `status.type=${status.type}`,
        };
    }
    const identifier = /^(has|no) (id|depends on)$/i.exec(value);
    if (identifier) {
        const has =
            identifier[2].toLowerCase() === 'id'
                ? Boolean(task.fields.id)
                : Boolean(task.fields.dependsOn?.length);
        return {
            supported: true,
            match: identifier[1].toLowerCase() === 'has' ? has : !has,
            detail: has ? 'value present' : 'value missing',
        };
    }
    const text = /^(description|path|folder|root|filename|status\.name|recurrence|id|tags?) (includes|does not include|include|do not include) (.*)$/i.exec(value);
    if (text) {
        const field = text[1].toLowerCase();
        const needle = text[3].toLowerCase();
        const haystacks =
            field === 'tag' || field === 'tags'
                ? task.tags
                      .filter((tag) => tag !== context.globalFilter)
                      .map((tag) => tag.toLowerCase())
                : [
                      String(
                          taskValue(task, field, context.registry, context.globalFilter) ?? '',
                      ).toLowerCase(),
                  ];
        const includes = haystacks.some((item) => item.includes(needle));
        const positive = ['includes', 'include'].includes(text[2].toLowerCase());
        return { supported: true, match: positive ? includes : !includes, detail: `${field}=${JSON.stringify(haystacks)}` };
    }
    const regex = /^(description|path|folder|root|filename|status\.name|recurrence|id|tags?) regex (matches|does not match) \/((?:\\.|[^/])*)\/([a-z]*)$/i.exec(value);
    if (regex) {
        try {
            const matcher = new RegExp(regex[3], regex[4]);
            const field = regex[1].toLowerCase();
            const haystacks =
                field === 'tag' || field === 'tags'
                    ? task.tags.filter((tag) => tag !== context.globalFilter)
                    : [
                          String(
                              taskValue(task, field, context.registry, context.globalFilter) ?? '',
                          ),
                      ];
            const matches = haystacks.some((item) => matcher.test(item));
            return {
                supported: true,
                match: regex[2].toLowerCase() === 'matches' ? matches : !matches,
                detail: `${field}=${JSON.stringify(haystacks)}`,
            };
        } catch (error) {
            return { supported: false, reason: `invalid regular expression: ${error.message}` };
        }
    }
    const priority = /^priority(?: is)?( above| below| not)? (lowest|low|none|medium|high|highest)$/i.exec(value);
    if (priority) {
        const codes = { highest: 0, high: 1, medium: 2, none: 3, low: 4, lowest: 5 };
        const actualName = task.fields.priority ?? 'none';
        const actual = codes[actualName];
        const expected = codes[priority[2].toLowerCase()];
        const op = priority[1]?.trim().toLowerCase() ?? 'is';
        const match = op === 'above' ? actual < expected : op === 'below' ? actual > expected : op === 'not' ? actual !== expected : actual === expected;
        return { supported: true, match, detail: `priority=${actualName}` };
    }
    return { supported: false, reason: 'instruction is outside the static evaluator subset' };
}

function printReport(report, format) {
    if (format === 'json') {
        process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
        return;
    }
    process.stdout.write(`Task: ${report.task.file}:${report.task.line}\n`);
    process.stdout.write(`Indexed: ${report.indexed ? 'yes' : 'no'}\n`);
    process.stdout.write(`Format: ${report.task.selectedFormat}\n`);
    process.stdout.write(`Status: ${report.task.statusName} (${report.task.statusType})\n`);
    process.stdout.write(`Parsed description: ${report.task.description}\n`);
    process.stdout.write(`Query description: ${report.task.queryDescription}\n`);
    process.stdout.write(`Fields: ${JSON.stringify(report.task.fields)}\n`);
    process.stdout.write('Effective query:\n');
    report.effectiveQuery.forEach((line) => process.stdout.write(`  ${line}\n`));
    for (const evaluation of report.evaluations) {
        const marker = evaluation.ignored ? 'skip' : evaluation.supported ? (evaluation.match ? 'pass' : 'REJECT') : 'unknown';
        process.stdout.write(`  [${marker}] ${evaluation.instruction}${evaluation.detail ? ` — ${evaluation.detail}` : ''}${evaluation.reason ? ` — ${evaluation.reason}` : ''}\n`);
    }
    process.stdout.write(`Verdict: ${report.verdict}\n`);
}

try {
    const args = parseArgs(process.argv.slice(2), {
        booleans: ['help'],
        values: ['vault', 'task-file', 'task-line', 'query-file', 'query-block', 'today', 'format'],
    });
    if (args.help) {
        process.stdout.write(`${USAGE}\n`);
        process.exit(0);
    }
    for (const required of ['vault', 'task-file', 'task-line', 'query-file']) {
        if (!args[required]) throw new Error(`--${required} is required`);
    }
    const format = args.format ?? 'text';
    if (!['text', 'json'].includes(format)) throw new Error('--format must be text or json');
    const vault = resolveVault(args.vault);
    const taskRelative = args['task-file'].replace(/\\/g, '/');
    const queryRelative = args['query-file'].replace(/\\/g, '/');
    const taskAbsolute = path.resolve(vault, taskRelative);
    const queryAbsolute = path.resolve(vault, queryRelative);
    if (!taskAbsolute.startsWith(`${vault}${path.sep}`) || !queryAbsolute.startsWith(`${vault}${path.sep}`)) {
        throw new Error('task/query files must be inside the vault');
    }
    if (!fs.existsSync(taskAbsolute)) throw new Error(`task file not found: ${taskRelative}`);
    if (!fs.existsSync(queryAbsolute)) throw new Error(`query file not found: ${queryRelative}`);
    const taskLineNumber = Number(args['task-line']);
    const blockNumber = Number(args['query-block'] ?? 1);
    if (!Number.isInteger(taskLineNumber) || taskLineNumber < 1) throw new Error('--task-line must be a positive integer');
    if (!Number.isInteger(blockNumber) || blockNumber < 1) throw new Error('--query-block must be a positive integer');

    const config = loadTasksConfig(vault);
    const taskDocument = readMarkdown(taskAbsolute);
    const rawTask = extractTaskLines(taskDocument.lines, taskRelative).find((task) => task.line === taskLineNumber);
    if (!rawTask) throw new Error(`no task checkbox at ${taskRelative}:${taskLineNumber}`);
    const parsed = parseTask(rawTask, config.settings);
    const registry = statusRegistry(config.settings);
    const status = registry.bySymbol.get(parsed.status) ?? { name: 'Unknown', type: 'TODO' };
    const indexed =
        taskRelative.toLowerCase().endsWith('.md') &&
        (!config.settings.globalFilter || rawTask.body.includes(String(config.settings.globalFilter)));

    const queryDocument = readMarkdown(queryAbsolute);
    const blocks = extractTasksBlocks(queryDocument.lines);
    const block = blocks[blockNumber - 1];
    if (!block) throw new Error(`query block ${blockNumber} not found in ${queryRelative}`);
    const frontmatter = parseFrontmatter(queryDocument.lines).data;
    const effective = buildEffectiveQuery(block, frontmatter, config.settings);
    const expanded = effective.lines.map((line) => expandSimplePlaceholders(line, queryRelative, frontmatter));
    const evaluations = [];
    let rejected = null;
    let indeterminate = false;
    for (const item of expanded) {
        if (item.unsupported) {
            const result = {
                instruction: item.output,
                supported: false,
                reason: 'placeholder could not be resolved statically',
            };
            evaluations.push(result);
            indeterminate = true;
            continue;
        }
        const result = evaluateInstruction(item.output, parsed, {
            registry,
            today: todayString(args.today),
            globalFilter: String(config.settings.globalFilter ?? ''),
        });
        const evaluation = { instruction: item.output, ...result };
        evaluations.push(evaluation);
        if (!result.ignored && result.supported === false) indeterminate = true;
        if (!result.ignored && result.supported && result.match === false && rejected === null) {
            rejected = evaluation;
        }
    }

    let verdict;
    let exitCode;
    if (!indexed) {
        verdict = `definite rejection before querying: missing global-filter substring ${JSON.stringify(config.settings.globalFilter)}`;
        exitCode = 1;
    } else if (rejected) {
        verdict = `definite rejection by: ${rejected.instruction}`;
        exitCode = 1;
    } else if (indeterminate) {
        verdict = 'indeterminate: every supported filter passed, but at least one instruction needs Tasks runtime semantics';
        exitCode = 3;
    } else {
        verdict = 'all supported filters pass; grouping/layout cannot remove the task, and no task limit was present';
        exitCode = 0;
    }
    const report = {
        tool: 'tasks-why-not',
        tasksVersion: config.manifest?.version ?? null,
        today: todayString(args.today),
        indexed,
        task: {
            file: taskRelative,
            line: taskLineNumber,
            raw: parsed.raw,
            selectedFormat: parsed.selectedFormat,
            status: parsed.status,
            statusName: status.name,
            statusType: status.type,
            description: parsed.description,
            queryDescription: parsed.description
                .replace(String(config.settings.globalFilter ?? ''), '')
                .trim(),
            tags: parsed.tags.filter(
                (tag) => tag !== String(config.settings.globalFilter ?? ''),
            ),
            fields: parsed.fields,
            invalidDates: parsed.invalidDates,
            otherFormatFields: parsed.otherFormatFields,
        },
        query: { file: queryRelative, block: blockNumber },
        effectiveQuery: expanded.map((entry) => entry.output),
        evaluations,
        firstRejectingInstruction: rejected?.instruction ?? null,
        verdict,
    };
    printReport(report, format);
    process.exitCode = exitCode;
} catch (error) {
    writeUsageError(error, USAGE);
}
