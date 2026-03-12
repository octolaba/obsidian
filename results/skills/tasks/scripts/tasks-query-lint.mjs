#!/usr/bin/env node

import path from 'node:path';
import {
    EXIT,
    STUDIED_PLUGIN_VERSION,
    TOOL_VERSION,
    assertFormat,
    buildEffectiveQuery,
    describeOrigin,
    diagnostic,
    environmentAssumptions,
    extractTasksBlocks,
    isHiddenOrigin,
    loadTasksConfig,
    parseArgs,
    parseFrontmatter,
    readMarkdown,
    relativeTo,
    resolveVaultArgument,
    resolveVaultFile,
    walkMarkdown,
    writeReport,
    writeUsageError,
} from './lib.mjs';

const USAGE = `usage: node tasks-query-lint.mjs [VAULT] [--vault PATH] [--file NOTE.md] [--format text|json|sarif] [--js-enabled|--js-disabled]`;

const LIMITATIONS = [
    'Static analysis only: no Obsidian index, no rendering and no JavaScript execution.',
    'Preset and placeholder expansion reproduces the pinned algorithm but stops at a preset cycle instead of recursing, so a cyclic definition is reported rather than executed.',
    'Instruction recognition uses a ported grammar subset; an unrecognised instruction may still be valid in a newer release.',
];

const SORT_FIELDS = [
    'status.type',
    'status.name',
    'cancelled',
    'scheduled',
    'recurring',
    'description',
    'priority',
    'urgency',
    'created',
    'happens',
    'filename',
    'heading',
    'random',
    'status',
    'start',
    'done',
    'path',
    'tag',
    'due',
    'id',
];
function knownInstruction(line) {
    const value = line.trim();
    if (!value || value.startsWith('#')) return true;
    const patterns = [
        /^(done|not done)$/i,
        /^(is|is not) (recurring|blocked|blocking)$/i,
        /^(has|no) (id|depends on|tag|tags)$/i,
        /^exclude sub-items$/i,
        /^(has|no) (cancelled|created|start|scheduled|due|done|happens) date$/i,
        /^(cancelled|created|start|scheduled|due|done) date is invalid$/i,
        /^(cancelled|created|starts|scheduled|due|done|happens)(?: (?:on|in|before|after|on or before|in or before|on or after|in or after))? .+$/i,
        /^(description|path|folder|root|filename|heading|status\.name|recurrence|id|tags?|depends on) (?:includes|does not include|include|do not include|regex matches|regex does not match) .+$/i,
        /^priority(?: is)?(?: (?:above|below|not))? (?:lowest|low|none|medium|high|highest)$/i,
        /^status\.type (?:is|is not) [A-Z_]+$/i,
        /^filter by function .+$/i,
        /^sort by .+$/i,
        /^group by .+$/i,
        /^(?:view list|view columns by .+)$/i,
        /^(?:hide|show) .+$/i,
        /^(?:short|full)(?: mode)?$/i,
        /^show tree$/i,
        /^limit(?: to)? \d+(?: tasks?)?$/i,
        /^limit groups(?: to)? \d+(?: tasks?)?$/i,
        /^(?:explain|ignore global query)$/i,
        /^preset .+$/i,
    ];
    if (patterns.some((pattern) => pattern.test(value))) return true;
    if (/\b(?:AND|OR|XOR|NOT)\b/.test(value) && /[[({"].+[\])}"]/.test(value)) return true;
    return false;
}

function regexBodies(line) {
    const bodies = [];
    const pattern = /regex (?:matches|does not match)\s+\/((?:\\.|[^/])*)\/[a-z]*/gi;
    for (const match of line.matchAll(pattern)) bodies.push(match[1]);
    return bodies;
}

function lineDiagnostics(line, location, context) {
    const findings = [];
    const value = line.trim();
    const add = (severity, rule, message, column = 1) => {
        findings.push(diagnostic(location.file, location.line, column, severity, rule, message));
    };
    if (!value || value.startsWith('#')) return findings;

    if (/\b(?:last|this|next) (?:week(?:end\w*)|month\w+|quarter\w+|year\w+)\b/i.test(value)) {
        const exact = /\b(?:last|this|next) (?:week|month|quarter|year)\b/i.exec(value);
        const suspicious = /\b(?:last|this|next) (?:weekend\w*|weeks\w+|months\w+|quarters\w+|years\w+|quarterly\w*)\b/i.exec(value);
        if (suspicious || !exact) {
            add(
                'error',
                'TQ001-relative-range-prefix',
                'relative range may be silently parsed by prefix (for example, “next weekend” as “next week”); use a supported phrase or explicit date',
            );
        }
    }

    const sort = new RegExp(`^sort by (${SORT_FIELDS.map((x) => x.replace('.', '\\.')).join('|')})(.*)$`, 'i').exec(
        value,
    );
    if (sort && sort[1].toLowerCase() !== 'tag') {
        const suffix = sort[2].trim();
        if (suffix && suffix.toLowerCase() !== 'reverse') {
            add(
                'error',
                'TQ002-sort-trailing-text',
                `sorter accepts and ignores trailing text “${suffix}”; use only optional “reverse”`,
            );
        }
    }

    const customFilter = /^filter by function\s+(.+)$/i.exec(value);
    const customAny = /^(filter|sort|group) by function\b/i.test(value);
    if (customFilter) {
        const expression = customFilter[1];
        if (
            expression.includes('return') &&
            !/(?:^|[;\\]\s*)return(?:\s+|$)/.test(expression)
        ) {
            add(
                'error',
                'TQ003-return-substring',
                'the expression contains “return” but no return statement, so Tasks will not auto-prepend one',
            );
        }
        if (/\.moment\.(?:[A-Za-z_$][\w$]*)/.test(expression)) {
            add(
                'warning',
                'TQ013-null-unsafe-moment',
                'TasksDate.moment can be null; use optional chaining and return a real boolean',
            );
        }
        if (/\.format\(\s*['"]dddd['"]\s*\)\s*={2,3}\s*['"][A-Za-z]+['"]/.test(expression)) {
            add(
                'warning',
                'TQ014-locale-weekday',
                'weekday-name comparison depends on locale; prefer moment.isoWeekday()',
            );
        }
        if (
            /query\.allTasks\.(?:find|filter|map|reduce|some|every)\s*\(/.test(expression) &&
            !/query\.searchCache/.test(context.effectiveText)
        ) {
            add(
                'warning',
                'TQ015-repeated-allTasks-scan',
                'vault-wide scan inside a per-task function can create quadratic-style work; memoise shared work in query.searchCache',
            );
        }
        const builtins = [
            [/task\.file\.folder\s*===\s*query\.file\.folder/, 'consider built-in preset this_folder_only (same JS requirement) or an explicit folder filter'],
            [/task\.status\.type\s*===?/, 'consider status.type is/is not for explainable built-in semantics'],
            [/task\.isRecurring/, 'consider is recurring/is not recurring when semantics are equivalent'],
        ];
        for (const [pattern, message] of builtins) {
            if (pattern.test(expression)) add('info', 'TQ016-built-in-equivalent', message);
        }
    }

    if (customAny) {
        if (context.jsState === 'disabled') {
            add('error', 'TQ011-js-disabled', 'custom query JavaScript is disabled on the selected device');
        } else if (context.jsState === 'unknown') {
            add(
                'warning',
                'TQ011-js-state-unknown',
                'custom query JavaScript state is device-local and could not be read; verify it on every device',
            );
        }
        add(
            'warning',
            'TQ012-js-security-review',
            'custom query code is executable JavaScript; review its source and trust boundary before enabling it',
        );
    }

    if (
        !customAny &&
        !/^not done$/i.test(value) &&
        /\b(and|or|xor|not)\b/.test(value) &&
        /[[({"].+[\])}"]/.test(value)
    ) {
        add(
            'error',
            'TQ004-boolean-case',
            'Tasks Boolean operators must be uppercase: AND, OR, XOR, NOT',
        );
    }
    if ((value.match(/\bXOR\b/g) ?? []).length > 1) {
        add(
            'warning',
            'TQ005-chained-xor',
            'chained XOR also matches the all-true case; write the intended cardinality explicitly',
        );
    }
    if (/\b(?:AND|OR|XOR|NOT)\b/.test(value)) {
        const pairs = [
            value.includes('(') || value.includes(')'),
            value.includes('[') || value.includes(']'),
            value.includes('{') || value.includes('}'),
            value.includes('"'),
        ].filter(Boolean).length;
        if (pairs > 1) {
            add(
                'error',
                'TQ006-mixed-boolean-delimiters',
                'a Boolean instruction must use one delimiter pair consistently',
            );
        }
    }
    if (/^priority(?: is)? above low$/i.test(value)) {
        add(
            'warning',
            'TQ007-priority-above-low',
            '“above low” also includes tasks with no priority; use “above none” if None must be excluded',
        );
    }
    if (/^path includes \.md$/i.test(value)) {
        add(
            'warning',
            'TQ008-path-all-markdown',
            'task paths include .md, so this matches every indexed task; use a meaningful path fragment',
        );
    }
    if (/^show tree$/i.test(value)) {
        add(
            'info',
            'TQ009-tree-extra-rows',
            'tree rendering includes non-matching descendants of matching tasks; visible rows may exceed matches',
        );
    }

    for (const body of regexBodies(value)) {
        if (body.length > 500) {
            add('error', 'TQ017-regex-too-long', `Tasks ${STUDIED_PLUGIN_VERSION} rejects regex patterns longer than 500 characters`);
        }
        if (/\([^)]*[+*][^)]*\)[+*{]/.test(body)) {
            add('error', 'TQ018-regex-nested-quantifier', 'nested quantifiers are rejected as a performance risk');
        }
    }

    for (const match of value.matchAll(/\{\{query\.file\.([A-Za-z0-9_]+)(?:\([^}]*\))?\}\}/g)) {
        const known = new Set([
            'path',
            'pathWithoutExtension',
            'root',
            'folder',
            'filename',
            'filenameWithoutExtension',
            'property',
            'hasProperty',
            'tags',
            'outlinks',
        ]);
        if (!known.has(match[1])) {
            add('error', 'TQ020-unknown-placeholder', `unknown query.file placeholder property “${match[1]}”`);
        }
    }

    if (!knownInstruction(value)) {
        add(
            'error',
            'TQ021-unknown-instruction',
            `instruction is not recognised by the static Tasks ${STUDIED_PLUGIN_VERSION} grammar; verify spelling with explain`,
        );
    }
    return findings;
}

function lintBlock(block, frontmatter, settings, file, jsState) {
    const findings = [];
    const effective = buildEffectiveQuery(block, frontmatter, settings);
    const context = {
        jsState,
        presets: settings.presets ?? {},
        effectiveText: effective.lines.join('\n'),
    };

    // Every effective logical statement is linted, whatever produced it, so a risky instruction
    // reached through a preset or the global query cannot look clean.
    for (const statement of effective.statements) {
        const hidden = isHiddenOrigin(statement.origin);
        const location = { file, line: statement.origin.line ?? block.startLine };
        for (const finding of lineDiagnostics(statement.text, location, context)) {
            findings.push(
                hidden
                    ? {
                          ...finding,
                          origin: describeOrigin(statement.origin),
                          message: `effective-query context (${describeOrigin(statement.origin)}): ${finding.message}`,
                      }
                    : { ...finding, origin: describeOrigin(statement.origin) },
            );
        }
    }

    for (const unknown of effective.unknownPresets) {
        findings.push(
            diagnostic(
                file,
                unknown.origin.line ?? block.startLine,
                1,
                'error',
                'TQ019-unknown-preset',
                `unknown preset “${unknown.name}”; Tasks resolves presets from its settings, and this vault supplies them from ${settings.presetsOrigin}`,
                { origin: describeOrigin(unknown.origin) },
            ),
        );
    }
    for (const cycle of effective.presetCycles) {
        findings.push(
            diagnostic(
                file,
                cycle.origin.line ?? block.startLine,
                1,
                'error',
                'TQ025-preset-cycle',
                `preset cycle ${cycle.cycle.join(' → ')}; the plugin would recurse without a guard`,
                { origin: describeOrigin(cycle.origin) },
            ),
        );
    }

    const effectiveNonComments = effective.lines.filter((line) => line.trim() && !line.trim().startsWith('#'));
    if (
        effectiveNonComments.some((line) => /^starts(?:\s|$)/i.test(line.trim())) &&
        !effectiveNonComments.some((line) => /\bhas start date\b/i.test(line))
    ) {
        findings.push(
            diagnostic(
                file,
                block.startLine,
                1,
                'warning',
                'TQ010-starts-includes-undated',
                'starts comparisons include tasks with no start date; add “has start date” if that is not intended',
            ),
        );
    }
    if (
        effectiveNonComments.some((line) => /^limit groups\b/i.test(line.trim())) &&
        !effectiveNonComments.some((line) => /^(group by|view columns by)\b/i.test(line.trim()))
    ) {
        findings.push(
            diagnostic(
                file,
                block.startLine,
                1,
                'warning',
                'TQ022-group-limit-without-group',
                'limit groups is ignored when there is no grouping instruction',
            ),
        );
    }
    if (effectiveNonComments.filter((line) => /^limit(?:\s|$)/i.test(line.trim())).length > 1) {
        findings.push(
            diagnostic(
                file,
                block.startLine,
                1,
                'warning',
                'TQ023-multiple-task-limits',
                'multiple task limits are hard to reason about; retain one explicit limit',
            ),
        );
    }
    return findings;
}

try {
    const args = parseArgs(process.argv.slice(2), {
        booleans: ['js-enabled', 'js-disabled', 'help'],
        values: ['vault', 'file', 'format'],
    });
    if (args.help) {
        process.stdout.write(`${USAGE}\n`);
        process.exit(EXIT.clean);
    }
    if (args['js-enabled'] && args['js-disabled']) {
        throw new Error('--js-enabled and --js-disabled are mutually exclusive');
    }
    const format = assertFormat(args.format ?? 'text');
    const vault = resolveVaultArgument(args);
    const config = loadTasksConfig(vault);
    const jsState = args['js-enabled'] ? 'enabled' : args['js-disabled'] ? 'disabled' : 'unknown';
    const environment = environmentAssumptions(config, relativeTo(vault, config.manifestPath));
    const findings = [...environment.diagnostics];
    let blocks = 0;
    let files = walkMarkdown(vault);
    if (args.file) {
        const selected = resolveVaultFile(vault, args.file, '--file');
        if (!files.includes(selected)) {
            throw new Error(`--file must name a Markdown file inside the vault: ${args.file}`);
        }
        files = [selected];
    }
    for (const absolute of files) {
        const relative = relativeTo(vault, absolute);
        const { lines } = readMarkdown(absolute);
        const frontmatter = parseFrontmatter(lines).data;
        for (const block of extractTasksBlocks(lines)) {
            blocks += 1;
            findings.push(...lintBlock(block, frontmatter, config.settings, relative, jsState));
            if (!block.closed) {
                findings.push(
                    diagnostic(
                        relative,
                        block.startLine,
                        block.startColumn,
                        'error',
                        'TQ024-unclosed-block',
                        `tasks code fence opened with ${block.fence} is not closed by a fence of the same character and at least the same length`,
                    ),
                );
            }
        }
    }
    writeReport(
        {
            tool: 'tasks-query-lint',
            toolVersion: TOOL_VERSION,
            studiedPluginVersion: STUDIED_PLUGIN_VERSION,
            vault: path.resolve(vault),
            tasksVersion: config.manifest?.version ?? null,
            presetsOrigin: config.settings.presetsOrigin,
            jsState,
            blocks,
            assumptions: environment.assumptions,
            limitations: LIMITATIONS,
            diagnostics: findings,
        },
        format,
    );
    process.exitCode = findings.length ? EXIT.findings : EXIT.clean;
} catch (error) {
    writeUsageError(error, USAGE);
}
