/*
 * Read-only Dataview live doctor.
 *
 * Copy this directory into the vault, then call it from a dataviewjs block:
 *
 * await dv.view("path/to/dataview-doctor", {
 *   target: "Projects/Alpha",
 *   fields: ["status", "due", "file.day", "file.tags"],
 *   checks: [{ label: "Open", expression: 'status = "open"' }],
 *   queries: [{ label: "Dashboard query", dql: 'TABLE status FROM "Projects" WHERE status = "open"', repeats: 3 }]
 * })
 */

const config = input ?? {};
const targetInput = config.target ?? dv.current()?.file?.path;
const target = targetInput ? dv.page(targetInput) : undefined;
const targetPath = target?.file?.path;
const maxFields = Math.max(1, Math.min(Number(config.maxSnapshotFields ?? 80), 250));
const normalizePath = value => String(value ?? '').replace(/\.md$/i, '');

function valueType(value) {
    if (value === null || value === undefined) return 'null';
    if (dv.isArray(value)) return 'array';
    if (dv.value.isLink(value)) return 'link';
    if (dv.value.isDate(value)) return 'date';
    if (dv.value.isDuration(value)) return 'duration';
    return typeof value;
}

function fieldValue(page, dotted) {
    return dotted.split('.').reduce((value, segment) => value?.[segment], page);
}

function percentile(values, ratio) {
    if (!values.length) return null;
    const sorted = [...values].sort((left, right) => left - right);
    return sorted[Math.max(0, Math.ceil(sorted.length * ratio) - 1)];
}

function resultCount(result) {
    if (result?.type !== 'task') return result?.values?.length ?? 0;
    let count = 0;
    const visit = value => {
        if (Array.isArray(value) || dv.isArray(value)) {
            for (const child of value) visit(child);
        } else if (value && typeof value === 'object') {
            if (value.task === true) count += 1;
            else if ('rows' in value) visit(value.rows);
        }
    };
    visit(result.values);
    return count;
}

function containsTarget(result, expectedPath) {
    if (!expectedPath) return false;
    const expected = normalizePath(expectedPath);
    const seen = new WeakSet();
    let visited = 0;
    const visit = (value, depth = 0) => {
        if (depth > 8 || visited++ > 100000 || value === null || value === undefined) return false;
        if (typeof value === 'string') return normalizePath(value) === expected;
        if (typeof value !== 'object') return false;
        if (seen.has(value)) return false;
        seen.add(value);
        if (typeof value.path === 'string' && normalizePath(value.path) === expected) return true;
        if (typeof value.file?.path === 'string' && normalizePath(value.file.path) === expected) return true;
        if (Array.isArray(value) || dv.isArray(value)) {
            for (const child of value) if (visit(child, depth + 1)) return true;
            return false;
        }
        for (const child of Object.values(value)) if (visit(child, depth + 1)) return true;
        return false;
    };
    return visit(result?.values);
}

function splitClauses(query) {
    const masked = [...query];
    let quote = false;
    let escaped = false;
    let comment = false;
    let wikiDepth = 0;
    for (let index = 0; index < masked.length; index += 1) {
        const char = masked[index];
        const next = masked[index + 1];
        if (comment) {
            if (char === '\n') comment = false;
            else masked[index] = ' ';
        } else if (wikiDepth > 0) {
            if (char === ']' && next === ']') {
                masked[index] = masked[index + 1] = ' ';
                index += 1;
                wikiDepth -= 1;
            } else {
                masked[index] = char === '\n' ? '\n' : ' ';
            }
        } else if (quote) {
            if (escaped) {
                masked[index] = ' ';
                escaped = false;
            } else if (char === '\\') {
                masked[index] = ' ';
                escaped = true;
            } else if (char === '"') {
                quote = false;
            } else {
                masked[index] = char === '\n' ? '\n' : ' ';
            }
        } else if (char === '/' && next === '/') {
            masked[index] = masked[index + 1] = ' ';
            index += 1;
            comment = true;
        } else if (char === '[' && next === '[') {
            masked[index] = masked[index + 1] = ' ';
            index += 1;
            wikiDepth += 1;
        } else if (char === '"') {
            quote = true;
        }
    }
    const clean = masked.join('');
    const hits = [...clean.matchAll(/\b(FROM|WHERE|SORT|GROUP\s+BY|FLATTEN|LIMIT)\b/gi)];
    return hits.map((match, index) => {
        const end = index + 1 < hits.length ? hits[index + 1].index : query.length;
        return {
            keyword: match[1].toUpperCase().replace(/\s+/g, ' '),
            body: query.slice(match.index + match[0].length, end).trim(),
        };
    });
}

async function traceTarget(query) {
    if (!target) return [];
    const clauses = splitClauses(query);
    const trace = [];
    const source = clauses.find(clause => clause.keyword === 'FROM');
    try {
        const paths = dv.pagePaths(source?.body ?? '');
        trace.push({
            stage: source ? `FROM ${source.body}` : 'implicit whole-vault source',
            result: paths.some(path => normalizePath(path) === normalizePath(targetPath)),
            value: `${paths.length} source pages`,
        });
    } catch (error) {
        trace.push({ stage: 'FROM', result: 'error', value: String(error.message ?? error) });
    }
    for (const clause of clauses) {
        if (clause.keyword === 'GROUP BY' || clause.keyword === 'FLATTEN') break;
        if (clause.keyword !== 'WHERE') continue;
        try {
            const value = dv.tryEvaluate(clause.body, target);
            trace.push({ stage: `WHERE ${clause.body}`, result: Boolean(value), value });
        } catch (error) {
            trace.push({
                stage: `WHERE ${clause.body}`,
                result: 'not page-local',
                value: String(error.message ?? error),
            });
        }
    }
    return trace;
}

dv.header(2, 'Dataview doctor');
dv.paragraph(
    target
        ? `Target: ${target.file.link} · Dataview ${dv.api?.version?.current ?? 'unknown'}`
        : `Target not indexed or unresolved: ${String(targetInput ?? '(none)')}`,
    { cls: target ? 'dv-doctor-ok' : 'dv-doctor-error' },
);

if (target) {
    const requestedFields =
        Array.isArray(config.fields) && config.fields.length
            ? config.fields
            : Object.keys(target).sort().slice(0, maxFields);
    dv.header(3, 'Indexed target snapshot');
    dv.table(
        ['Field', 'Observed type', 'Indexed value'],
        requestedFields.slice(0, maxFields).map(name => {
            const value = fieldValue(target, name);
            return [name, valueType(value), value ?? null];
        }),
    );
}

if (Array.isArray(config.checks) && config.checks.length) {
    dv.header(3, 'Target expression checks');
    const rows = config.checks.map(check => {
        const expression = typeof check === 'string' ? check : check.expression;
        const label = typeof check === 'string' ? check : check.label ?? expression;
        try {
            const value = dv.tryEvaluate(expression, target ?? {});
            return [label, expression, Boolean(value), value];
        } catch (error) {
            return [label, expression, 'error', String(error.message ?? error)];
        }
    });
    dv.table(['Check', 'DQL expression', 'Truth', 'Value/error'], rows);
}

if (Array.isArray(config.queries) && config.queries.length) {
    dv.header(3, 'Full query checks');
    const rows = [];
    const traces = [];
    for (const queryInput of config.queries) {
        const entry = typeof queryInput === 'string' ? { dql: queryInput } : queryInput;
        const repeats = Math.max(1, Math.min(Number(entry.repeats ?? config.repeats ?? 3), 10));
        const durations = [];
        try {
            let result;
            for (let iteration = 0; iteration < repeats; iteration += 1) {
                const started = performance.now();
                result = await dv.tryQuery(entry.dql);
                durations.push(performance.now() - started);
            }
            let membershipResult = result;
            if (target && (result.type === 'table' || result.type === 'list')) {
                // WITHOUT ID can remove every path from the public result. Force the ID only for
                // this untimed diagnostic execution so target membership remains observable.
                membershipResult = await dv.tryQuery(entry.dql, undefined, { forceId: true });
            }
            rows.push([
                entry.label ?? entry.dql.split('\n')[0],
                result.type,
                resultCount(result),
                target ? containsTarget(membershipResult, targetPath) : 'n/a',
                `${percentile(durations, 0.5).toFixed(1)} / ${percentile(durations, 0.95).toFixed(1)} ms`,
            ]);
            if (entry.trace !== false && target) {
                traces.push({
                    label: entry.label ?? entry.dql.split('\n')[0],
                    rows: await traceTarget(entry.dql),
                });
            }
        } catch (error) {
            rows.push([
                entry.label ?? String(entry.dql).split('\n')[0],
                'error',
                'n/a',
                'n/a',
                String(error.message ?? error),
            ]);
        }
    }
    dv.table(['Query', 'Type', 'Rows/tasks', 'Contains target', 'Median / p95'], rows);
    for (const trace of traces) {
        dv.header(4, `Why-not trace: ${trace.label}`);
        dv.table(
            ['Stage', 'Target passes', 'Observed value'],
            trace.rows.map(row => [row.stage, row.result, row.value]),
        );
    }
}

dv.paragraph(
    'Read-only diagnostic. Timings include current cache/UI conditions; compare repeated medians, not one run. Automatic tracing stops before FLATTEN/GROUP BY because row shape changes there.',
    { cls: 'dv-doctor-note' },
);
