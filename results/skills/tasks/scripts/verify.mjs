#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs, readJson, toPosix, writeUsageError } from './lib.mjs';

const EXPECTED_VERSION = '8.3.0';
const EXPECTED_SOURCE = 'obsidian-tasks-group/obsidian-tasks';
const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const SKILL_ROOT = path.dirname(SCRIPT_DIR);
const USAGE = `usage: node verify.mjs [--source-root PATH] [--format text|json]`;

function findDefaultSourceRoot() {
    let current = SKILL_ROOT;
    while (true) {
        const candidate = path.join(
            current,
            'research',
            'plugins',
            'obsidian-tasks-group',
            'obsidian-tasks',
        );
        if (fs.existsSync(path.join(candidate, 'manifest.json'))) return candidate;
        const parent = path.dirname(current);
        if (parent === current) break;
        current = parent;
    }
    return null;
}

function markdownFiles(root) {
    const files = [];
    const visit = (directory) => {
        for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
            const absolute = path.join(directory, entry.name);
            if (entry.isDirectory()) visit(absolute);
            else if (entry.isFile() && entry.name.endsWith('.md')) files.push(absolute);
        }
    };
    visit(root);
    return files.sort();
}

function sourceLines(sourceRoot, relative) {
    const absolute = path.join(sourceRoot, relative);
    if (!fs.existsSync(absolute) || !fs.statSync(absolute).isFile()) return null;
    return fs.readFileSync(absolute, 'utf8').replace(/\r\n?/g, '\n').split('\n');
}

function parseFrontmatter(text) {
    const match = /^---\n([\s\S]*?)\n---\n/.exec(text);
    if (!match) return null;
    const data = {};
    for (const line of match[1].split('\n')) {
        const item = /^([A-Za-z0-9_-]+):\s*(.*)$/.exec(line);
        if (item) {
            let value = item[2];
            if (value.startsWith('"') && value.endsWith('"')) {
                try {
                    value = JSON.parse(value);
                } catch {
                    // The source-citation and repository YAML checks will report malformed data.
                }
            } else if (value.startsWith("'") && value.endsWith("'")) {
                value = value.slice(1, -1);
            }
            data[item[1]] = value;
        }
    }
    return data;
}

function assertion(checks, id, passed, message, evidence = null) {
    checks.push({ id, passed: Boolean(passed), message, evidence });
}

function verifySource(sourceRoot, checks) {
    const manifest = readJson(path.join(sourceRoot, 'manifest.json'), null);
    assertion(
        checks,
        'source-version',
        manifest?.version === EXPECTED_VERSION,
        `manifest version must be ${EXPECTED_VERSION}`,
        manifest?.version ?? 'missing',
    );
    assertion(
        checks,
        'source-id',
        manifest?.id === 'obsidian-tasks-plugin',
        'source must be the Tasks plugin',
        manifest?.id ?? 'missing',
    );

    const invariants = [
        {
            id: 'one-selected-format',
            file: 'docs/Reference/Task Formats/About Task Formats.md',
            patterns: [
                /only supports reading and writing one format at a time/,
                /no facility in Tasks to convert a vault/,
            ],
        },
        {
            id: 'query-execution-order',
            file: 'src/Query/Query.ts',
            ordered: [
                'this.filters.forEach',
                'Sort.by',
                'tasksSorted.slice',
                'new TaskGroups',
                'applyTaskLimit',
            ],
        },
        {
            id: 'filename-date-preconditions',
            file: 'src/DateTime/DateFallback.ts',
            patterns: [
                /useFilenameAsScheduledDate/,
                /matchesAnyFolder/,
                /startDate === null && dueDate === null && scheduledDate === null/,
            ],
        },
        {
            id: 'unknown-status-semantics',
            file: 'src/Statuses/Status.ts',
            patterns: [/createUnknownStatus/, /'Unknown'/, /StatusType\.TODO/],
        },
        {
            id: 'javascript-opt-in-local-state',
            file: 'src/Config/EnableJsInTasksQueries.ts',
            patterns: [
                /DEFAULT_ENABLE_JS_IN_TASKS_QUERIES = false/,
                /vault-local app storage/,
                /not persisted\s*\n\s*\* to the plugin's data\.json/,
            ],
        },
        {
            id: 'api-surface',
            file: 'src/Api/TasksApiV1.ts',
            patterns: [
                /createTaskLineModal/,
                /editTaskLineModal/,
                /executeToggleTaskDoneCommand/,
            ],
            absent: [/searchTasks\s*\(/, /executeQuery\s*\(/],
        },
        {
            id: 'on-completion-delete',
            file: 'src/Task/OnCompletion.ts',
            patterns: [
                /Keep = 'keep'/,
                /Delete = 'delete'/,
                /returnWithoutCompletedInstance/,
                /endStatus\.type !== StatusType\.DONE/,
            ],
        },
        {
            id: 'recurrence-clears-dependencies',
            file: 'src/Task/Task.ts',
            patterns: [/id: ''/, /dependsOn: \[\]/],
        },
        {
            id: 'performance-timers',
            file: 'src/lib/PerformanceTracker.ts',
            patterns: [/performance\.measure/, /milliseconds/, /recordTimings/],
        },
        {
            id: 'search-render-timers',
            file: 'src/Renderer/QueryResultsRenderer.ts',
            patterns: [/PerformanceTracker\(`Search:/, /PerformanceTracker\(`Render:/],
        },
    ];

    for (const invariant of invariants) {
        const lines = sourceLines(sourceRoot, invariant.file);
        if (!lines) {
            assertion(checks, invariant.id, false, `${invariant.file} exists`, 'missing');
            continue;
        }
        const text = lines.join('\n');
        let passed = true;
        const evidence = [];
        for (const pattern of invariant.patterns ?? []) {
            const match = pattern.exec(text);
            passed &&= Boolean(match);
            evidence.push(`${pattern}: ${match ? 'found' : 'missing'}`);
        }
        for (const pattern of invariant.absent ?? []) {
            const match = pattern.exec(text);
            passed &&= !match;
            evidence.push(`${pattern}: ${match ? 'unexpected' : 'absent'}`);
        }
        if (invariant.ordered) {
            let previous = -1;
            for (const token of invariant.ordered) {
                const index = text.indexOf(token);
                passed &&= index > previous;
                evidence.push(`${token}@${index}`);
                previous = index;
            }
        }
        assertion(checks, invariant.id, passed, `${invariant.file} implementation invariant`, evidence.join('; '));
    }

    const apiLines = sourceLines(sourceRoot, 'src/Api/TasksApiV1.ts');
    if (apiLines) {
        const methods = apiLines
            .map((line) => /^\s{4}([A-Za-z][A-Za-z0-9]*)(?:\(|:)/.exec(line)?.[1])
            .filter(Boolean);
        assertion(
            checks,
            'api-exact-method-count',
            JSON.stringify(methods) ===
                JSON.stringify([
                    'createTaskLineModal',
                    'editTaskLineModal',
                    'executeToggleTaskDoneCommand',
                ]),
            'TasksApiV1 still has exactly the three documented methods',
            methods.join(', '),
        );
    }
}

function verifySkill(sourceRoot, checks) {
    const mainPath = path.join(SKILL_ROOT, 'SKILL.md');
    const main = fs.readFileSync(mainPath, 'utf8').replace(/\r\n?/g, '\n');
    const frontmatter = parseFrontmatter(main);
    assertion(checks, 'skill-frontmatter', Boolean(frontmatter), 'SKILL.md has YAML frontmatter');
    assertion(
        checks,
        'skill-source',
        frontmatter?.source === EXPECTED_SOURCE,
        `skill source must be ${EXPECTED_SOURCE}`,
        frontmatter?.source,
    );
    assertion(
        checks,
        'skill-version',
        frontmatter?.version === EXPECTED_VERSION,
        `skill version must be ${EXPECTED_VERSION}`,
        frontmatter?.version,
    );
    assertion(
        checks,
        'skill-basis',
        frontmatter?.basis === 'source',
        'skill basis must be source',
        frontmatter?.basis,
    );
    assertion(
        checks,
        'skill-name-shape',
        typeof frontmatter?.name === 'string' &&
            /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(frontmatter.name) &&
            frontmatter.name.length <= 64,
        'skill name is valid lowercase hyphen-case and at most 64 characters',
        frontmatter?.name,
    );
    assertion(
        checks,
        'skill-description-shape',
        typeof frontmatter?.description === 'string' &&
            frontmatter.description.length > 0 &&
            frontmatter.description.length <= 1024 &&
            !/[<>]/.test(frontmatter.description),
        'skill description is non-empty, at most 1024 characters, and has no angle brackets',
        `${frontmatter?.description?.length ?? 0} characters`,
    );
    assertion(
        checks,
        'main-size',
        main.split('\n').length < 500,
        'main SKILL.md stays below 500 lines for progressive disclosure',
        `${main.split('\n').length} lines`,
    );

    const requiredMarkers = [
        'authoring-and-formats.md',
        'dates-and-recurrence.md',
        'statuses-dependencies-completion.md',
        'settings-integrations.md',
        'query-context.md',
        'query-language.md',
        'debugging.md',
        'scripting.md',
        'performance.md',
        'workflows.md',
        'tasks-query-lint.mjs',
        'tasks-vault-lint.mjs',
        'tasks-why-not.mjs',
        'tasks-profile.mjs',
    ];
    for (const marker of requiredMarkers) {
        assertion(
            checks,
            `main-routes-${marker}`,
            main.includes(`](${marker.startsWith('tasks-') ? `scripts/${marker}` : `reference/${marker}`})`),
            `SKILL.md directly links ${marker}`,
        );
    }

    const files = markdownFiles(SKILL_ROOT);
    const sourceLineCache = new Map();
    const linkErrors = [];
    const citationErrors = [];
    const unlined = [];
    const shorthand = [];
    for (const file of files) {
        const relativeFile = toPosix(path.relative(SKILL_ROOT, file));
        const text = fs.readFileSync(file, 'utf8').replace(/\r\n?/g, '\n');
        for (const match of text.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)) {
            let target = match[1].trim();
            if (!target || target.startsWith('#') || /^[a-z]+:\/\//i.test(target)) continue;
            target = target.split('#')[0];
            if (!target) continue;
            const resolved = path.resolve(path.dirname(file), decodeURIComponent(target));
            if (resolved !== SKILL_ROOT && !resolved.startsWith(`${SKILL_ROOT}${path.sep}`)) {
                linkErrors.push(`${relativeFile}: link leaves skill: ${match[1]}`);
            } else if (!fs.existsSync(resolved)) {
                linkErrors.push(`${relativeFile}: missing link target: ${match[1]}`);
            }
        }

        for (const match of text.matchAll(/`((?:src|docs)\/[^`\n]+?\.(?:ts|md)|manifest\.json):(\d+)`/g)) {
            const sourceFile = match[1];
            const line = Number(match[2]);
            let lines = sourceLineCache.get(sourceFile);
            if (lines === undefined) {
                lines = sourceLines(sourceRoot, sourceFile);
                sourceLineCache.set(sourceFile, lines);
            }
            if (!lines) citationErrors.push(`${relativeFile}: missing source ${sourceFile}`);
            else if (line < 1 || line > lines.length) {
                citationErrors.push(`${relativeFile}: ${sourceFile}:${line} outside 1..${lines.length}`);
            } else if (lines[line - 1].trim() === '') {
                citationErrors.push(`${relativeFile}: ${sourceFile}:${line} points to a blank line`);
            }
        }
        for (const match of text.matchAll(/`((?:src|docs)\/[^`\n]+?\.(?:ts|md))`/g)) {
            unlined.push(`${relativeFile}: unlined source reference ${match[1]}`);
        }
        for (const match of text.matchAll(/`:(\d+)`/g)) {
            shorthand.push(`${relativeFile}: shorthand citation :${match[1]}`);
        }
    }
    assertion(
        checks,
        'portable-links',
        linkErrors.length === 0,
        'all Markdown links resolve inside the portable skill',
        linkErrors.join('; '),
    );
    assertion(
        checks,
        'source-citations',
        citationErrors.length === 0,
        'all path:line citations resolve inside the pinned source',
        citationErrors.join('; '),
    );
    assertion(
        checks,
        'no-unlined-source-references',
        unlined.length === 0,
        'source-path code spans include line numbers',
        unlined.join('; '),
    );
    assertion(
        checks,
        'no-shorthand-citations',
        shorthand.length === 0,
        'every citation repeats its full source path',
        shorthand.join('; '),
    );

    const requiredScripts = [
        'lib.mjs',
        'tasks-query-lint.mjs',
        'tasks-vault-lint.mjs',
        'tasks-why-not.mjs',
        'tasks-profile.mjs',
        'verify.mjs',
        'test.mjs',
    ];
    for (const script of requiredScripts) {
        assertion(
            checks,
            `script-${script}`,
            fs.existsSync(path.join(SCRIPT_DIR, script)),
            `required script exists: ${script}`,
        );
    }
}

try {
    const args = parseArgs(process.argv.slice(2), {
        booleans: ['help'],
        values: ['source-root', 'format'],
    });
    if (args.help) {
        process.stdout.write(`${USAGE}\n`);
        process.exit(0);
    }
    const format = args.format ?? 'text';
    if (!['text', 'json'].includes(format)) throw new Error('--format must be text or json');
    const sourceRoot = path.resolve(args['source-root'] ?? findDefaultSourceRoot() ?? '');
    if (!sourceRoot || !fs.existsSync(path.join(sourceRoot, 'manifest.json'))) {
        throw new Error('Tasks source root not found; pass --source-root');
    }
    const checks = [];
    verifySource(sourceRoot, checks);
    verifySkill(sourceRoot, checks);
    const failures = checks.filter((check) => !check.passed);
    const report = {
        tool: 'tasks-skill-verify',
        sourceRoot,
        expectedVersion: EXPECTED_VERSION,
        checks,
        passed: checks.length - failures.length,
        failed: failures.length,
    };
    if (format === 'json') {
        process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
    } else {
        for (const check of checks) {
            process.stdout.write(`${check.passed ? 'PASS' : 'FAIL'} ${check.id}: ${check.message}`);
            if (!check.passed && check.evidence) process.stdout.write(` — ${check.evidence}`);
            process.stdout.write('\n');
        }
        process.stdout.write(`Tasks skill verification: ${report.passed}/${checks.length} passed\n`);
    }
    process.exitCode = failures.length ? 2 : 0;
} catch (error) {
    writeUsageError(error, USAGE);
}
