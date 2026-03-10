#!/usr/bin/env node

import path from 'node:path';
import {
    diagnostic,
    extractTaskLines,
    hasDataviewTaskField,
    hasEmojiSignifier,
    loadTasksConfig,
    parseArgs,
    parseTask,
    printDiagnostics,
    readMarkdown,
    relativeTo,
    resolveVault,
    statusRegistry,
    walkMarkdown,
    writeUsageError,
} from './lib.mjs';

const USAGE = `usage: node tasks-vault-lint.mjs --vault PATH [--format text|json]`;

function rawIndent(line) {
    const leading = /^(\s*(?:>\s*)*)/.exec(line)?.[1] ?? '';
    return leading.replace(/>\s*/g, '').replace(/\t/g, '    ').length;
}

function hasIndentedChild(lines, task) {
    for (let index = task.line; index < lines.length; index += 1) {
        const line = lines[index];
        if (!line.trim()) continue;
        const indent = rawIndent(line);
        if (indent <= task.indent) return false;
        if (/^\s*(?:>\s*)*(?:[-*+]|\d+[.)])\s+/.test(line)) return true;
    }
    return false;
}

function configFindings(relativeConfig, settings, hasSettings) {
    const findings = [];
    if (!hasSettings) {
        findings.push(
            diagnostic(
                relativeConfig,
                1,
                1,
                'info',
                'TV001-settings-unavailable',
                'Tasks data.json was not found; defaults are assumed and vault-specific settings may change findings',
            ),
        );
    }
    const { configured } = statusRegistry(settings);
    const symbols = new Map();
    for (const status of configured) {
        const entries = symbols.get(status.symbol) ?? [];
        entries.push(status);
        symbols.set(status.symbol, entries);
    }
    for (const [symbol, entries] of symbols) {
        if (entries.length > 1) {
            findings.push(
                diagnostic(
                    relativeConfig,
                    1,
                    1,
                    'error',
                    'TV002-duplicate-status-symbol',
                    `status symbol ${JSON.stringify(symbol)} is configured ${entries.length} times`,
                ),
            );
        }
    }
    for (const status of configured) {
        if (!symbols.has(status.nextStatusSymbol)) {
            findings.push(
                diagnostic(
                    relativeConfig,
                    1,
                    1,
                    'error',
                    'TV003-missing-next-status',
                    `status ${JSON.stringify(status.symbol)} points to unconfigured next symbol ${JSON.stringify(status.nextStatusSymbol)}`,
                ),
            );
        }
    }
    return findings;
}

function findCycles(tasksById) {
    const graph = new Map();
    for (const [id, tasks] of tasksById) {
        if (tasks.length !== 1) continue;
        graph.set(id, (tasks[0].fields.dependsOn ?? []).filter((target) => tasksById.has(target)));
    }
    const cycles = [];
    const visiting = new Set();
    const visited = new Set();
    const stack = [];
    const seen = new Set();
    const visit = (node) => {
        if (visiting.has(node)) {
            const start = stack.indexOf(node);
            const cycle = [...stack.slice(start), node];
            const key = [...new Set(cycle)].sort().join('|');
            if (!seen.has(key)) {
                seen.add(key);
                cycles.push(cycle);
            }
            return;
        }
        if (visited.has(node)) return;
        visiting.add(node);
        stack.push(node);
        for (const next of graph.get(node) ?? []) visit(next);
        stack.pop();
        visiting.delete(node);
        visited.add(node);
    };
    for (const node of graph.keys()) visit(node);
    return cycles;
}

try {
    const args = parseArgs(process.argv.slice(2), {
        booleans: ['help'],
        values: ['vault', 'format'],
    });
    if (args.help) {
        process.stdout.write(`${USAGE}\n`);
        process.exit(0);
    }
    const format = args.format ?? 'text';
    if (!['text', 'json'].includes(format)) throw new Error('--format must be text or json');
    const vault = resolveVault(args.vault);
    const config = loadTasksConfig(vault);
    const configRelative = relativeTo(vault, config.dataPath);
    const findings = configFindings(configRelative, config.settings, config.hasSettings);
    const registry = statusRegistry(config.settings);
    const parsedTasks = [];
    const sourceLines = new Map();

    for (const absolute of walkMarkdown(vault)) {
        const relative = relativeTo(vault, absolute);
        const { lines } = readMarkdown(absolute);
        sourceLines.set(relative, lines);
        for (const rawTask of extractTaskLines(lines, relative)) {
            const task = parseTask(rawTask, config.settings);
            const admitted =
                !config.settings.globalFilter ||
                rawTask.body.includes(String(config.settings.globalFilter));
            task.admitted = admitted;
            parsedTasks.push(task);

            const add = (severity, rule, message) => {
                findings.push(diagnostic(relative, task.line, 1, severity, rule, message));
            };
            if (rawTask.raw.includes('\u00a0')) {
                add(
                    'warning',
                    'TV004-non-breaking-space',
                    'non-breaking space can prevent trailing task-field parsing; replace it after reviewing the raw line',
                );
            }
            if (!admitted) {
                add(
                    'info',
                    'TV005-global-filter-excluded',
                    `checkbox lacks global-filter substring ${JSON.stringify(config.settings.globalFilter)} and is not indexed by Tasks`,
                );
            }
            const status = registry.bySymbol.get(task.status);
            if (!status) {
                add(
                    'warning',
                    'TV006-unknown-status',
                    `status symbol ${JSON.stringify(task.status)} is unregistered and Tasks interprets it as Unknown/TODO`,
                );
            }
            if (task.otherFormatFields.length) {
                const other =
                    task.selectedFormat === 'dataview' ? 'Emoji' : 'Dataview';
                add(
                    'warning',
                    'TV007-mixed-task-format',
                    `${other} fields are present but the selected ${task.selectedFormat} serializer ignores them`,
                );
            }
            if (
                (task.selectedFormat === 'tasksPluginEmoji' && hasEmojiSignifier(task.description)) ||
                (task.selectedFormat === 'dataview' && hasDataviewTaskField(task.description))
            ) {
                add(
                    'warning',
                    'TV008-unparsed-task-field',
                    'task-like metadata remains in the parsed description, usually because trailing prose/unsupported data stopped the backwards scan',
                );
            }
            for (const field of task.invalidDates) {
                add('error', 'TV009-invalid-date', `${field} contains an invalid calendar date`);
            }
            for (const field of task.duplicates) {
                add('warning', 'TV010-duplicate-field', `${field} occurs more than once on the task line`);
            }
            if (
                task.fields.recurrence &&
                !task.fields.start &&
                !task.fields.scheduled &&
                !task.fields.due
            ) {
                add(
                    'error',
                    'TV012-recurrence-without-date',
                    'recurring task has no start, scheduled, or due date and cannot advance usefully',
                );
            }
            if (task.fields.recurrence && /\b(?:until|for\s+\d+\s+times?)\b/i.test(task.fields.recurrence)) {
                add(
                    'error',
                    'TV013-unsupported-recurrence-bound',
                    'Tasks 8.3.0 does not support count-limited or until-bounded recurrence reliably',
                );
            }
            if (
                task.fields.recurrence &&
                /(?:^|\/)\d{4}-?\d{2}-?\d{2}(?:\s|[^/]*)\.md$/i.test(relative)
            ) {
                add(
                    'warning',
                    'TV014-recurring-in-daily-note',
                    'recurrence in a date-named note may create repeated copies in daily-note workflows',
                );
            }
            if (
                task.fields.onCompletion === 'delete' &&
                hasIndentedChild(lines, task)
            ) {
                add(
                    'error',
                    'TV015-delete-parent-with-children',
                    'onCompletion delete on a parent can leave nested list items as an indented code block',
                );
            }
            if (task.fields.scheduledInferred) {
                add(
                    'info',
                    'TV016-inferred-scheduled-date',
                    `scheduled date ${task.fields.scheduled} is inferred from the filename and is invisible in Markdown`,
                );
            } else if (task.inferred?.customFormatUnresolved) {
                add(
                    'info',
                    'TV017-custom-filename-date-unresolved',
                    'custom filename-date format is enabled; this static tool cannot evaluate arbitrary Moment formats',
                );
            }
        }
    }

    const indexed = parsedTasks.filter((task) => task.admitted);
    const tasksById = new Map();
    for (const task of indexed) {
        const id = task.fields.id;
        if (!id) continue;
        const entries = tasksById.get(id) ?? [];
        entries.push(task);
        tasksById.set(id, entries);
    }
    for (const [id, tasks] of tasksById) {
        if (tasks.length <= 1) continue;
        for (const task of tasks) {
            findings.push(
                diagnostic(
                    task.file,
                    task.line,
                    1,
                    'error',
                    'TV018-duplicate-id',
                    `task ID ${JSON.stringify(id)} occurs ${tasks.length} times and makes dependency resolution ambiguous`,
                ),
            );
        }
    }
    for (const task of indexed) {
        for (const dependency of task.fields.dependsOn ?? []) {
            if (dependency === task.fields.id) {
                findings.push(
                    diagnostic(
                        task.file,
                        task.line,
                        1,
                        'error',
                        'TV019-self-dependency',
                        `task depends on its own ID ${JSON.stringify(dependency)}`,
                    ),
                );
            } else if (!tasksById.has(dependency)) {
                findings.push(
                    diagnostic(
                        task.file,
                        task.line,
                        1,
                        'warning',
                        'TV020-dangling-dependency',
                        `dependsOn target ${JSON.stringify(dependency)} does not exist among indexed Tasks tasks`,
                    ),
                );
            }
        }
    }
    for (const cycle of findCycles(tasksById)) {
        const first = tasksById.get(cycle[0])?.[0];
        if (!first) continue;
        findings.push(
            diagnostic(
                first.file,
                first.line,
                1,
                'error',
                'TV021-dependency-cycle',
                `dependency cycle: ${cycle.join(' -> ')}`,
            ),
        );
    }

    printDiagnostics(findings, format, {
        tool: 'tasks-vault-lint',
        vault: path.resolve(vault),
        tasksVersion: config.manifest?.version ?? null,
        selectedTaskFormat: config.settings.taskFormat,
        checkboxes: parsedTasks.length,
        indexedTasks: indexed.length,
    });
    process.exitCode = findings.length ? 1 : 0;
} catch (error) {
    writeUsageError(error, USAGE);
}
