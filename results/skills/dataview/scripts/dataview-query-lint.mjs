#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import {
    EXIT,
    TOOL_VERSION,
    clausesOf,
    extractDataviewBlocks,
    hasClause,
    loadDataviewConfig,
    maskDql,
    offsetToLineColumn,
    parseArgs,
    parseDqlShape,
    readMarkdown,
    relativeTo,
    resolveVaultArgument,
    resolveVaultFile,
    walkMarkdown,
    writeUsageError,
} from './lib.mjs';
import { IDENTITY, IDENTITY_STATUS, verifyPrimaryIdentity } from './identity.mjs';
import { loadUpstreamParser } from './upstream-parser.mjs';

const STUDIED_VERSION = '0.5.70';
/** The reviewed tree ships 0.5.68 in its manifest, so both identify studied material. */
const ACCEPTED_MANIFEST_VERSIONS = ['0.5.70', '0.5.68'];

const USAGE =
    'usage: node dataview-query-lint.mjs [VAULT] [--vault PATH] [--file FILE] [--source-root PATH] [--allow-unverified-source-root] [--format text|json|sarif] [--all]';

const RULES = {
    DVM001: {
        category: 'syntax',
        severity: 'error',
        confidence: 'high',
        fixSafety: 'safe',
        message: 'The Dataview fence is not closed.',
        suggestion: 'Close it with a fence using the same character and at least the opener length.',
    },
    DVE001: {
        category: 'environment',
        severity: 'warning',
        confidence: 'high',
        fixSafety: 'safe',
        message: 'No Dataview plugin manifest was found in this vault.',
        suggestion:
            'Findings assume the studied release; confirm the installed version with dv.api.version.current.',
    },
    DVE002: {
        category: 'environment',
        severity: 'warning',
        confidence: 'high',
        fixSafety: 'safe',
        message: 'The installed Dataview version is outside the studied boundary.',
        suggestion:
            'Grammar, functions and defaults may differ; re-check any finding against that release before acting.',
    },
    DVM002: {
        category: 'provenance',
        severity: 'warning',
        confidence: 'high',
        fixSafety: 'safe',
        message: 'Exact mode was requested but the supplied checkout is not the reviewed pin.',
        suggestion:
            'Point --source-root at the reviewed checkout, or pass --allow-unverified-source-root to parse against it deliberately.',
    },
    DVQ000: {
        category: 'syntax',
        severity: 'error',
        confidence: 'high',
        fixSafety: 'intent-required',
        message: 'The pinned upstream parser rejects this query.',
    },
    DVQ001: {
        category: 'correctness',
        severity: 'error',
        confidence: 'high',
        fixSafety: 'safe',
        message: 'SORT directly after a fieldless LIST/TABLE is consumed by the header and fails to parse.',
        suggestion: 'Give LIST/TABLE an expression or insert a semantics-preserving WHERE true before SORT.',
    },
    DVQ002: {
        category: 'correctness',
        severity: 'warning',
        confidence: 'high',
        fixSafety: 'likely',
        message: 'A bare YYYY-MM-DD in DQL is subtraction, not a date.',
        suggestion: 'Wrap the intended date in date(...).',
    },
    DVQ003: {
        category: 'correctness',
        severity: 'warning',
        confidence: 'medium',
        fixSafety: 'intent-required',
        message: 'A comparison can include missing values because null sorts before every non-null value.',
        suggestion: 'State the missing-value policy and add a presence/type guard when absence should not match.',
    },
    DVQ004: {
        category: 'correctness',
        severity: 'warning',
        confidence: 'high',
        fixSafety: 'intent-required',
        message: 'and/or share one precedence level and associate left-to-right.',
        suggestion: 'Add parentheses that state the intended grouping.',
    },
    DVQ005: {
        category: 'correctness',
        severity: 'warning',
        confidence: 'high',
        fixSafety: 'intent-required',
        message: 'sum/average/product over rows.x fails when any grouped row lacks x.',
        suggestion: 'Use nonnull(rows.x) only when missing values should be ignored.',
    },
    DVQ006: {
        category: 'syntax',
        severity: 'error',
        confidence: 'high',
        fixSafety: 'intent-required',
        message: 'A second FROM parses as an operation and then fails at runtime.',
        suggestion: 'Combine sources inside one FROM with and/or.',
    },
    DVQ007: {
        category: 'correctness',
        severity: 'error',
        confidence: 'high',
        fixSafety: 'safe',
        message: 'A folder source ending in / matches no folder.',
        suggestion: 'Remove the trailing slash.',
    },
    DVQ008: {
        category: 'correctness',
        severity: 'warning',
        confidence: 'high',
        fixSafety: 'intent-required',
        message: 'contains() performs substring membership on string elements.',
        suggestion: 'Use econtains() when exact tag/status/list membership is intended.',
    },
    DVQ009: {
        category: 'correctness',
        severity: 'note',
        confidence: 'medium',
        fixSafety: 'intent-required',
        message: 'regexmatch() is an exact, auto-anchored match.',
        suggestion: 'Use regextest() for substring search; keep regexmatch() for whole-value matching.',
    },
    DVQ010: {
        category: 'correctness',
        severity: 'warning',
        confidence: 'medium',
        fixSafety: 'likely',
        message: 'A hyphen can be part of an identifier, so this may be one field rather than subtraction.',
        suggestion: 'Put spaces around - when subtraction is intended.',
    },
    DVQ011: {
        category: 'correctness',
        severity: 'warning',
        confidence: 'high',
        fixSafety: 'intent-required',
        message: 'LIMIT uses Array.slice semantics: negatives drop rows from the end and fractions truncate.',
        suggestion: 'Use a non-negative integer limit.',
    },
    DVQ012: {
        category: 'correctness',
        severity: 'warning',
        confidence: 'high',
        fixSafety: 'intent-required',
        message: 'After GROUP BY, plain page/task fields are no longer in scope.',
        suggestion: 'Use key, the group alias, or rows.<field>.',
    },
    DVQ013: {
        category: 'correctness',
        severity: 'note',
        confidence: 'high',
        fixSafety: 'intent-required',
        message: 'TASK FROM #tag selects tagged pages, then includes all tasks from those pages.',
        suggestion: 'Add WHERE econtains(tags, "#tag") when the tag must be on the task itself.',
    },
    DVQ014: {
        category: 'settings',
        severity: 'warning',
        confidence: 'high',
        fixSafety: 'intent-required',
        message: 'This query form is disabled by the vault Dataview settings.',
        suggestion: 'Enable the exact mode only after reviewing its security/behaviour, or rewrite the query.',
    },
    DVQ101: {
        category: 'cost',
        severity: 'warning',
        confidence: 'high',
        fixSafety: 'intent-required',
        message: 'No FROM materializes every indexed Markdown page on every refresh.',
        suggestion: 'Add the narrowest positive source that can contain the answer.',
    },
    DVQ102: {
        category: 'cost',
        severity: 'warning',
        confidence: 'high',
        fixSafety: 'intent-required',
        message: 'A negated source enumerates every Markdown file before subtraction.',
        suggestion: 'Prefer a positive parent source plus a local WHERE exclusion when equivalent.',
    },
    DVQ103: {
        category: 'cost',
        severity: 'note',
        confidence: 'high',
        fixSafety: 'intent-required',
        message: 'An incoming-link source scans the vault resolved-link table.',
        suggestion: 'Keep it when it expresses the intent; avoid repeating it across many visible blocks.',
    },
    DVQ104: {
        category: 'cost',
        severity: 'warning',
        confidence: 'high',
        fixSafety: 'likely',
        message: 'SORT runs before a later WHERE and sorts rows that will be discarded.',
        suggestion: 'Move independent selective WHERE operations before SORT.',
    },
    DVQ105: {
        category: 'cost',
        severity: 'warning',
        confidence: 'high',
        fixSafety: 'intent-required',
        message: 'FLATTEN file.lists/file.tasks multiplies wide page rows before they are narrowed.',
        suggestion: 'Add a positive FROM and page-level WHERE before FLATTEN.',
    },
    DVQ106: {
        category: 'cost',
        severity: 'warning',
        confidence: 'medium',
        fixSafety: 'likely',
        message: 'A WHERE after FLATTEN does not reference the flattened alias.',
        suggestion: 'Move that predicate before FLATTEN if it depends only on the input row.',
    },
    DVQ107: {
        category: 'cost',
        severity: 'warning',
        confidence: 'high',
        fixSafety: 'intent-required',
        message: 'Multiple FLATTEN operations multiply row counts and deep copies.',
        suggestion: 'Keep values nested unless one output row per Cartesian combination is required.',
    },
    DVQ108: {
        category: 'cost',
        severity: 'note',
        confidence: 'medium',
        fixSafety: 'intent-required',
        message: 'An unbounded FLATTEN can render every generated row.',
        suggestion: 'Add a meaningful LIMIT or summary only when it preserves the intended output.',
    },
    DVQ109: {
        category: 'cost',
        severity: 'note',
        confidence: 'medium',
        fixSafety: 'likely',
        message: 'This filter resolves a linked page for each row.',
        suggestion: 'Place cheap local filters before link traversal.',
    },
    DVJ001: {
        category: 'javascript',
        severity: 'warning',
        confidence: 'medium',
        fixSafety: 'likely',
        message: 'An asynchronous dv API call may be missing await.',
        suggestion: 'Await query, I/O and view calls unless the Promise is deliberately returned.',
    },
    DVJ002: {
        category: 'javascript',
        severity: 'error',
        confidence: 'high',
        fixSafety: 'intent-required',
        message: 'dv.pages() accepts a FROM source string, not a WHERE expression.',
        suggestion: 'Pass a source such as "#book" and filter the DataArray with .where(...).',
    },
    DVJ003: {
        category: 'cost',
        severity: 'warning',
        confidence: 'medium',
        fixSafety: 'likely',
        message: 'The block materializes pages more than once.',
        suggestion: 'Store one dv.pages()/dv.pagePaths() result and reuse it.',
    },
    DVJ004: {
        category: 'cost',
        severity: 'note',
        confidence: 'medium',
        fixSafety: 'intent-required',
        message: 'dv.pages() without a source scans the whole vault.',
        suggestion: 'Pass the narrowest source and bound rendered output.',
    },
    DVJ005: {
        category: 'security',
        severity: 'warning',
        confidence: 'high',
        fixSafety: 'intent-required',
        message: 'DataviewJS reaches a privileged filesystem/network/runtime surface.',
        suggestion: 'Review the code as an unsigned script and document why the capability is required.',
    },
    DVJ006: {
        category: 'javascript',
        severity: 'warning',
        confidence: 'medium',
        fixSafety: 'likely',
        message: 'A DOM event listener has no visible component cleanup.',
        suggestion: 'Register cleanup on dv.component so refreshes do not leak listeners.',
    },
    DVJ007: {
        category: 'correctness',
        severity: 'warning',
        confidence: 'medium',
        fixSafety: 'likely',
        message: 'JavaScript object equality is unreliable for Dataview links and Luxon dates.',
        suggestion: 'Use dv.equal() or compare a stable primitive key.',
    },
    DVJ008: {
        category: 'javascript',
        severity: 'warning',
        confidence: 'medium',
        fixSafety: 'intent-required',
        message: 'A constant-true loop needs a visible termination guarantee and runs on Obsidian’s UI thread.',
        suggestion: 'Use bounded iteration or make and review the break condition explicitly.',
    },
};

const severityRank = { note: 1, warning: 2, error: 3 };

function finding(rule, block, offset = 0, details = {}) {
    const metadata = RULES[rule];
    const position = offsetToLineColumn(
        block.raw,
        offset,
        block.startLine + (block.type === 'dql' || block.type === 'js' ? 1 : 0),
        block.startColumn,
        block.lineColumns,
    );
    return {
        rule,
        ...metadata,
        line: position.line,
        column: position.column,
        blockType: block.type,
        ...details,
    };
}

function flattenAlias(text) {
    const named = /\bAS\s+("([^"]+)"|[\w-]+)\s*$/i.exec(text.trim());
    if (named) {
        const alias = (named[2] ?? named[1]).trim();
        return /^[\p{Letter}_][\p{Letter}\p{Number}_-]*$/u.test(alias)
            ? alias
            : undefined;
    }
    const expression = text.trim();
    return /^[\p{Letter}_][\p{Letter}\p{Number}_-]*$/u.test(expression)
        ? expression
        : undefined;
}

function mixedAndOr(text) {
    let body = text;
    for (let count = 0; count < 8; count += 1) {
        const reduced = body.replace(/\([^()]*\)/g, ' ');
        if (reduced === body) break;
        body = reduced;
    }
    return (/\b(?:and)\b|&/i.test(body) && /\b(?:or)\b|\|/i.test(body));
}

function stripDateConstructors(text) {
    return text
        .replace(/\bdate\s*\([^)]*\)/gi, 'date()')
        .replace(/\bdur\s*\([^)]*\)/gi, 'dur()');
}

function nullUnsafe(text, whole) {
    for (const match of text.matchAll(/([A-Za-zÀ-￿][\w.À-￿-]*)\s*(<=|<|!=)/g)) {
        const name = match[1];
        if (/^(?:true|false|null|date|dur|length|number|string)$/i.test(name)) continue;
        if (name.startsWith('file.') && name !== 'file.day') continue;
        const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const before = whole.slice(0, whole.indexOf(text) + (match.index ?? 0));
        const guarded =
            new RegExp(`typeof\\s*\\(\\s*${escaped}\\s*\\)\\s*(?:=|!=)`, 'i').test(before) ||
            new RegExp(`\\b${escaped}\\s+(?:AND|&)`, 'i').test(before) ||
            new RegExp(`(?:WHERE|AND|&)\\s+${escaped}\\s*(?:\\)|$|\\n)`, 'i').test(before);
        if (!guarded) return match.index ?? 0;
    }
    return -1;
}

function fieldAfterGroup(shape) {
    const groupIndex = shape.clauses.findIndex(clause => clause.keyword === 'GROUP BY');
    if (groupIndex === -1) return null;
    const alias = flattenAlias(shape.clauses[groupIndex].masked) ?? '';
    const headerExpression =
        shape.type === 'LIST' || shape.type === 'TABLE'
            ? shape.header.masked.replace(/^(?:TABLE|LIST)(?:\s+WITHOUT\s+ID)?/i, '')
            : shape.type === 'CALENDAR'
              ? shape.header.masked.replace(/^CALENDAR/i, '')
              : '';
    const candidates = [
        ...(headerExpression.trim()
            ? [{ text: headerExpression, offset: 0 }]
            : []),
        ...shape.clauses.slice(groupIndex + 1).map(clause => ({
            text: clause.masked,
            offset: clause.start,
        })),
    ];
    for (const candidate of candidates) {
        let text = candidate.text
            .replace(/\bAS\s+(?:"(?:[^"\\]|\\.)*"|[A-Za-zÀ-￿][\wÀ-￿-]*)/gi, ' ')
            .replace(/\brow\s*\[[^\]]+\]/gi, ' ')
            .replace(/\brows(?:\.[\w-]+)*/gi, ' ')
            .replace(/[\w-]+\s*\(/g, '(')
            .replace(/\b(?:key|row|true|false|null|asc|desc|ascending|descending|and|or|not|as)\b/gi, ' ')
            .replace(/"[^"]*"/g, ' ')
            .replace(/\b\d+(?:\.\d+)?\b/g, ' ');
        if (alias) text = text.replace(new RegExp(`\\b${alias}\\b`, 'g'), ' ');
        const match = /[A-Za-zÀ-￿][\w.À-￿-]*/.exec(text);
        if (match) return candidate.offset + match.index;
    }
    return null;
}

function analyzeDqlHeuristic(block) {
    const shape = parseDqlShape(block.raw);
    const output = [];
    const add = (rule, offset = 0, details = {}) => output.push(finding(rule, block, offset, details));
    if (!shape.type) return output;
    if (!hasClause(shape, 'FROM')) add('DVQ101');
    for (const source of clausesOf(shape, 'FROM')) {
        if (/(^|[\s(])[-!]\s*(?=["#[])/.test(source.raw)) add('DVQ102', source.start);
        if (/\[\[/.test(source.raw) && !/\boutgoing\s*\(/i.test(source.raw)) add('DVQ103', source.start);
        if (/"[^"]+\/"/.test(source.raw)) add('DVQ007', source.start);
    }
    if (clausesOf(shape, 'FROM').length > 1) add('DVQ006', clausesOf(shape, 'FROM')[1].start);
    if (
        ['LIST', 'TABLE'].includes(shape.type) &&
        /^(?:LIST|TABLE)(?:\s+WITHOUT\s+ID)?$/i.test(shape.header.masked) &&
        shape.order[0] === 'SORT'
    ) {
        add('DVQ001', clausesOf(shape, 'SORT')[0]?.start ?? 0);
    }
    const dateMatch = /(^|[^\w"-])\d{4}-\d{2}-\d{2}(?![\w-])/.exec(
        stripDateConstructors(maskDql(block.raw)),
    );
    if (dateMatch) add('DVQ002', dateMatch.index + dateMatch[1].length);
    for (const where of clausesOf(shape, 'WHERE')) {
        const unsafe = nullUnsafe(where.masked, shape.masked);
        if (unsafe >= 0) add('DVQ003', where.start + unsafe);
        if (mixedAndOr(where.masked)) add('DVQ004', where.start);
    }
    for (const source of clausesOf(shape, 'FROM')) {
        if (mixedAndOr(source.masked)) add('DVQ004', source.start);
    }
    const aggregate = /\b(?:sum|average|product)\s*\(\s*(?!nonnull)[^)]*\brows\./i.exec(shape.masked);
    if (aggregate) add('DVQ005', aggregate.index);
    for (const match of block.raw.matchAll(/\bcontains\s*\(\s*[\w.]*\b(?:tags|etags)\b/gi)) {
        add('DVQ008', match.index);
    }
    for (const match of block.raw.matchAll(/\bregexmatch\s*\(\s*"((?:[^"\\]|\\.)*)"/gi)) {
        if (!match[1].startsWith('^') && !match[1].endsWith('$')) add('DVQ009', match.index);
    }
    const hyphen = /[A-Za-z][\w-]*-\d+(?![\w-])/.exec(stripDateConstructors(shape.masked));
    if (hyphen) add('DVQ010', hyphen.index);
    for (const limit of clausesOf(shape, 'LIMIT')) {
        if (/^-\s*\d|^\d+\.\d/.test(limit.masked)) add('DVQ011', limit.start);
    }
    const afterGroup = fieldAfterGroup(shape);
    if (afterGroup !== null) add('DVQ012', afterGroup);
    if (shape.type === 'TASK' && clausesOf(shape, 'FROM').some(source => /#/.test(source.raw))) {
        add('DVQ013', clausesOf(shape, 'FROM')[0].start);
    }
    for (const sort of clausesOf(shape, 'SORT')) {
        if (clausesOf(shape, 'WHERE').some(where => where.index > sort.index)) add('DVQ104', sort.start);
    }
    const flatten = clausesOf(shape, 'FLATTEN');
    if (flatten.length > 1) add('DVQ107', flatten[1].start);
    if (flatten.length && !hasClause(shape, 'LIMIT')) add('DVQ108', flatten[0].start);
    for (const item of flatten) {
        if (
            /\bfile\.(?:lists|tasks)\b/i.test(item.masked) &&
            (!hasClause(shape, 'FROM') ||
                !clausesOf(shape, 'WHERE').some(where => where.index < item.index))
        ) {
            add('DVQ105', item.start);
        }
        const alias = flattenAlias(item.masked);
        for (const where of clausesOf(shape, 'WHERE')) {
            if (where.index < item.index) continue;
            if (!alias || !new RegExp(`\\b${alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`).test(where.masked)) {
                add('DVQ106', where.start);
                break;
            }
        }
    }
    for (const where of clausesOf(shape, 'WHERE')) {
        if (
            /(?:\[\[[^\]]*\]\]\s*\.|\blink\s*\([^)]*\)\s*\.|\b[A-Za-z][\w-]*\.(?:file|[A-Za-z][\w-]*)\.)/.test(
                where.raw,
            )
        ) {
            add('DVQ109', where.start);
        }
    }
    return output;
}

function fieldPath(field) {
    if (!field) return null;
    if (field.type === 'variable') return field.name;
    if (
        field.type === 'index' &&
        field.index?.type === 'literal' &&
        typeof field.index.value === 'string'
    ) {
        const parent = fieldPath(field.object);
        return parent ? `${parent}.${field.index.value}` : null;
    }
    return null;
}

function functionName(field) {
    return field?.type === 'function' ? fieldPath(field.func) : null;
}

function walkField(field, visitor, options = {}) {
    if (!field) return;
    visitor(field);
    switch (field.type) {
        case 'binaryop':
            walkField(field.left, visitor, options);
            walkField(field.right, visitor, options);
            break;
        case 'function':
            if (options.includeFunctionName) walkField(field.func, visitor, options);
            for (const argument of field.arguments) walkField(argument, visitor, options);
            break;
        case 'index':
            walkField(field.object, visitor, options);
            if (field.index?.type !== 'literal') walkField(field.index, visitor, options);
            break;
        case 'negated':
            walkField(field.child, visitor, options);
            break;
        case 'lambda':
            walkField(field.value, visitor, options);
            break;
        case 'object':
            Object.values(field.values).forEach(value => walkField(value, visitor, options));
            break;
        case 'list':
            field.values.forEach(value => walkField(value, visitor, options));
            break;
    }
}

function rootVariables(field) {
    const roots = new Set();
    walkField(field, node => {
        const pathValue = fieldPath(node);
        if (pathValue) roots.add(pathValue.split('.')[0]);
    });
    return roots;
}

function sourceNodes(source, output = []) {
    if (!source) return output;
    output.push(source);
    if (source.type === 'binaryop') {
        sourceNodes(source.left, output);
        sourceNodes(source.right, output);
    } else if (source.type === 'negate') {
        sourceNodes(source.child, output);
    }
    return output;
}

function operationFields(operation) {
    if (operation.type === 'where') return [operation.clause];
    if (operation.type === 'sort') return operation.fields.map(item => item.field);
    if (operation.type === 'limit') return [operation.amount];
    if (operation.type === 'flatten' || operation.type === 'group') return [operation.field.field];
    return [];
}

function headerFields(header) {
    if (header.type === 'table') return header.fields.map(item => item.field);
    if (header.type === 'list') return header.format ? [header.format] : [];
    if (header.type === 'calendar') return [header.field.field];
    return [];
}

function analyzeAst(block, query) {
    const output = [];
    const add = (rule, details = {}) => output.push(finding(rule, block, 0, details));
    const nodes = sourceNodes(query.source);
    if (nodes.some(node => node.type === 'negate')) add('DVQ102');
    if (nodes.some(node => node.type === 'link' && node.direction === 'incoming')) add('DVQ103');

    let groupAlias = null;
    let grouped = false;
    for (const operation of query.operations) {
        if (operation.type === 'group') {
            grouped = true;
            groupAlias = operation.field.name;
            continue;
        }
        if (!grouped) continue;
        for (const field of operationFields(operation)) {
            const allowed = new Set(['rows', 'key', 'row']);
            if (/^[\p{Letter}_][\p{Letter}\p{Number}_-]*$/u.test(groupAlias ?? '')) {
                allowed.add(groupAlias);
            }
            const disallowed = [...rootVariables(field)].filter(root => !allowed.has(root));
            if (disallowed.length) add('DVQ012', { evidence: disallowed.join(', ') });
        }
    }
    if (grouped) {
        for (const field of headerFields(query.header)) {
            const allowed = new Set(['rows', 'key', 'row']);
            if (/^[\p{Letter}_][\p{Letter}\p{Number}_-]*$/u.test(groupAlias ?? '')) {
                allowed.add(groupAlias);
            }
            const disallowed = [...rootVariables(field)].filter(root => !allowed.has(root));
            if (disallowed.length) add('DVQ012', { evidence: disallowed.join(', ') });
        }
    }

    const fields = [
        ...headerFields(query.header),
        ...query.operations.flatMap(operationFields),
    ];
    for (const field of fields) {
        walkField(field, node => {
            const name = functionName(node);
            if (name === 'contains') {
                const container = fieldPath(node.arguments[0]);
                if (container && /(?:^|\.)(?:tags|etags)$/.test(container)) add('DVQ008');
                if (node.arguments[0]?.type === 'list') {
                    add('DVQ008', { confidence: 'medium' });
                }
            }
            if (['sum', 'average', 'product'].includes(name)) {
                const argument = node.arguments[0];
                const nested = functionName(argument);
                let hasRows = false;
                walkField(argument, child => {
                    if (fieldPath(child)?.startsWith('rows.')) hasRows = true;
                });
                if (hasRows && nested !== 'nonnull') add('DVQ005');
            }
        });
    }
    for (const operation of query.operations) {
        if (operation.type !== 'limit') continue;
        if (
            operation.amount?.type === 'literal' &&
            typeof operation.amount.value === 'number' &&
            (operation.amount.value < 0 || !Number.isInteger(operation.amount.value))
        ) {
            add('DVQ011');
        }
    }
    return output;
}

function analyzeJavaScript(block) {
    const output = [];
    const add = (rule, offset = 0, details = {}) => output.push(finding(rule, block, offset, details));
    const code = block.raw;
    const asyncCall = /\bdv\.(?:query|tryQuery|queryMarkdown|tryQueryMarkdown|view|io\.(?:csv|load))\s*\(/g;
    for (const match of code.matchAll(asyncCall)) {
        const before = code.slice(Math.max(0, match.index - 30), match.index);
        if (!/\b(?:await|return)\s*$/.test(before)) add('DVJ001', match.index);
    }
    for (const match of code.matchAll(/\bdv\.pages\s*\(\s*(['"])(.*?)\1\s*\)/gs)) {
        if (/(?:^|\s)[A-Za-z][\w.-]*\s*(?:=|!=|<=|>=|<|>)/.test(match[2])) add('DVJ002', match.index);
    }
    const pageCalls = [...code.matchAll(/\bdv\.(?:pages|pagePaths)\s*\(/g)];
    if (pageCalls.length > 1) add('DVJ003', pageCalls[1].index);
    for (const match of code.matchAll(/\bdv\.pages\s*\(\s*\)/g)) add('DVJ004', match.index);
    const privileged =
        /\b(?:require|fetch)\s*\(|\bdv\.app\b|\b(?:vault|adapter)\.(?:write|modify|create|delete|remove|rename)\s*\(/g;
    for (const match of code.matchAll(privileged)) add('DVJ005', match.index);
    const listener = /\.addEventListener\s*\(/.exec(code);
    if (
        listener &&
        !/(?:dv\.component|component)\.(?:register|registerEvent|addChild)\s*\(/.test(code) &&
        !/removeEventListener\s*\(/.test(code)
    ) {
        add('DVJ006', listener.index);
    }
    const equality = /(?:file\.link|(?:due|date|time|created|modified|mtime|ctime))[^;\n]{0,50}={2,3}|={2,3}[^;\n]{0,50}(?:file\.link|(?:due|date|time|created|modified|mtime|ctime))/gi.exec(
        code,
    );
    if (equality) add('DVJ007', equality.index);
    for (const loop of code.matchAll(/\bwhile\s*\(\s*true\s*\)|\bfor\s*\(\s*;\s*;\s*\)/g)) {
        const tail = code.slice((loop.index ?? 0) + loop[0].length);
        if (/^\s*(?:\{\s*)?break\b/.test(tail)) continue;
        add('DVJ008', loop.index);
    }
    return output;
}

function deduplicate(findings) {
    const seen = new Set();
    return findings.filter(item => {
        const key = `${item.rule}:${item.line}:${item.blockType}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    });
}

function sarifReport(report) {
    const used = [...new Set(report.diagnostics.map(item => item.rule))];
    return {
        version: '2.1.0',
        $schema: 'https://json.schemastore.org/sarif-2.1.0.json',
        runs: [
            {
                tool: {
                    driver: {
                        name: 'dataview-query-lint',
                        rules: used.map(id => ({
                            id,
                            shortDescription: { text: RULES[id].message },
                            help: { text: RULES[id].suggestion ?? RULES[id].message },
                        })),
                    },
                },
                results: report.diagnostics.map(item => ({
                    ruleId: item.rule,
                    level: item.severity === 'error' ? 'error' : item.severity === 'warning' ? 'warning' : 'note',
                    message: { text: `${item.message}${item.suggestion ? ` ${item.suggestion}` : ''}` },
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
                    },
                })),
            },
        ],
    };
}

async function main() {
    const args = parseArgs(process.argv.slice(2), {
        booleans: ['help', 'all', 'allow-unverified-source-root'],
        values: ['vault', 'file', 'source-root', 'format'],
    });
    if (args.help) {
        process.stdout.write(`${USAGE}\n`);
        return;
    }
    const vault = resolveVaultArgument(args);
    const format = args.format ?? 'text';
    if (!['text', 'json', 'sarif'].includes(format)) {
        throw new Error('--format must be text, json or sarif');
    }
    const config = loadDataviewConfig(vault);
    const files = args.file ? [resolveVaultFile(vault, args.file, '--file')] : walkMarkdown(vault);
    for (const file of files) {
        if (!fs.existsSync(file) || !fs.statSync(file).isFile()) {
            throw new Error(`Markdown file does not exist: ${file}`);
        }
    }

    // Exact mode builds and executes the supplied checkout's own toolchain. Prove the checkout is
    // the reviewed pin before resolving or loading anything from it, so an exact-mode report can
    // never carry the reviewed-pin label for material nobody reviewed.
    let exact = null;
    let identity = null;
    const provenance = [];
    if (args['source-root']) {
        identity = verifyPrimaryIdentity(args['source-root']);
        if (identity.status === IDENTITY_STATUS.missing) {
            const error = new Error(identity.reason);
            error.code = 'SOURCE_MISSING';
            throw error;
        }
        if (identity.status === IDENTITY_STATUS.verified || args['allow-unverified-source-root']) {
            exact = await loadUpstreamParser(args['source-root']);
        }
        if (identity.status === IDENTITY_STATUS.mismatch) {
            provenance.push({
                file: '.',
                rule: 'DVM002',
                ...RULES.DVM002,
                severity: args['allow-unverified-source-root'] ? 'note' : RULES.DVM002.severity,
                line: 1,
                column: 1,
                blockType: null,
                evidence: identity.reason,
            });
        }
    }

    // The version and settings a report depends on are stated as findings, not merely echoed.
    const assumptions = [];
    const installedVersion = config.manifest?.version ?? null;
    if (installedVersion === null) {
        provenance.push({
            file: '.',
            rule: 'DVE001',
            ...RULES.DVE001,
            line: 1,
            column: 1,
            blockType: null,
            evidence: `expected .obsidian/plugins/dataview/manifest.json`,
        });
        assumptions.push(`No plugin manifest found; every rule assumes Dataview ${STUDIED_VERSION}.`);
    } else if (!ACCEPTED_MANIFEST_VERSIONS.includes(installedVersion)) {
        provenance.push({
            file: '.',
            rule: 'DVE002',
            ...RULES.DVE002,
            line: 1,
            column: 1,
            blockType: null,
            evidence: `installed ${installedVersion}, studied ${STUDIED_VERSION}`,
        });
        assumptions.push(`Installed Dataview ${installedVersion} is outside the studied ${STUDIED_VERSION} boundary.`);
    } else {
        assumptions.push(
            `Installed manifest reports ${installedVersion}, which the studied ${STUDIED_VERSION} tree also embeds.`,
        );
    }
    assumptions.push(
        config.hasSettings
            ? 'Query extraction used the vault\'s own Dataview settings.'
            : 'No data.json found; pinned default settings are assumed, including the dataviewjs keyword and inline prefixes.',
    );

    const diagnostics = [...provenance];
    const queries = [];
    const byType = { dql: 0, js: 0, inline: 0, 'inline-js': 0 };
    for (const file of files) {
        const { text } = readMarkdown(file);
        const relative = relativeTo(vault, file);
        for (const block of extractDataviewBlocks(text, config.settings)) {
            byType[block.type] = (byType[block.type] ?? 0) + 1;
            const local = [];
            if (!block.closed) {
                local.push(
                    finding('DVM001', block, 0, {
                        line: block.startLine,
                        column: block.startColumn,
                    }),
                );
            }
            if (
                (block.type === 'js' && !config.settings.enableDataviewJs) ||
                (block.type === 'inline' && !config.settings.enableInlineDataview) ||
                (block.type === 'inline-js' &&
                    (!config.settings.enableDataviewJs ||
                        !config.settings.enableInlineDataviewJs))
            ) {
                local.push(finding('DVQ014', block));
            }
            if (block.type === 'dql' || block.type === 'inline') {
                local.push(...analyzeDqlHeuristic(block));
                if (exact) {
                    const parsed =
                        block.type === 'dql'
                            ? exact.parseQuery(block.raw)
                            : exact.parseInline(block.raw);
                    if (!parsed.successful) {
                        const match = /line\s+(\d+)\s+column\s+(\d+)/i.exec(String(parsed.error));
                        local.push(
                            finding('DVQ000', block, 0, {
                                line: match
                                    ? block.startLine +
                                      (block.type === 'dql' ? 1 : 0) +
                                      Number(match[1]) -
                                      1
                                    : block.startLine,
                                column: match
                                    ? (block.lineColumns?.[Number(match[1]) - 1] ?? 1) +
                                      Number(match[2]) -
                                      1
                                    : block.startColumn,
                                evidence: String(parsed.error),
                            }),
                        );
                    } else {
                        local.push(...analyzeAst(block, parsed.value));
                    }
                }
            } else {
                local.push(...analyzeJavaScript(block));
            }
            const resolved = deduplicate(local).map(item => ({ file: relative, ...item }));
            diagnostics.push(...resolved);
            if (args.all || resolved.length) {
                queries.push({
                    file: relative,
                    line: block.startLine,
                    column: block.startColumn,
                    type: block.type,
                    closed: block.closed,
                    diagnostics: resolved.map(item => item.rule),
                    source: block.raw,
                });
            }
        }
    }
    diagnostics.sort(
        (left, right) =>
            severityRank[right.severity] - severityRank[left.severity] ||
            left.file.localeCompare(right.file) ||
            left.line - right.line ||
            left.column - right.column ||
            left.rule.localeCompare(right.rule),
    );
    const verifiedPin = identity?.status === IDENTITY_STATUS.verified;
    const report = {
        tool: 'dataview-query-lint',
        version: TOOL_VERSION,
        vault,
        mode: exact
            ? verifiedPin
                ? 'upstream-ast+static'
                : 'upstream-ast+static (unverified material)'
            : 'static',
        sourceRoot: exact?.sourceRoot ?? null,
        // Exact-mode findings are only ever labelled with the identity actually parsed against.
        material: identity
            ? {
                  requested: path.resolve(args['source-root']),
                  status: identity.status,
                  reviewedPin: `${IDENTITY.source}@${IDENTITY.version} (${IDENTITY.commit})`,
                  matchesReviewedPin: verifiedPin,
                  observedSha256: identity.actual?.sha256 ?? null,
                  observedFiles: identity.actual?.files ?? null,
                  exactModeEnabled: Boolean(exact),
              }
            : null,
        assumptions,
        limitations: [
            'Static analysis only: no Obsidian index, no rendering and no query execution.',
            'Cost and correctness rules cannot know source cardinality, view visibility or user intent.',
            'DataviewJS is inspected as text; it is never executed.',
        ],
        trustModel:
            'Exact mode builds and requires the supplied checkout with the caller\'s privileges; static mode executes nothing from it. Neither mode writes to the vault or to the checkout.',
        settings: {
            detected: config.hasSettings,
            pluginVersion: config.manifest?.version ?? null,
            dataviewJsKeyword: config.settings.dataviewJsKeyword,
            inlineQueryPrefix: config.settings.inlineQueryPrefix,
            inlineJsQueryPrefix: config.settings.inlineJsQueryPrefix,
        },
        scanned: {
            files: files.length,
            queries: Object.values(byType).reduce((sum, value) => sum + value, 0),
            byType,
        },
        diagnostics,
        queries,
    };

    if (format === 'json') {
        process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
    } else if (format === 'sarif') {
        process.stdout.write(`${JSON.stringify(sarifReport(report), null, 2)}\n`);
    } else {
        process.stdout.write(
            `Dataview query lint (${report.mode}): ${report.scanned.files} files, ${report.scanned.queries} queries, ${diagnostics.length} findings\n`,
        );
        for (const item of diagnostics) {
            process.stdout.write(
                `${item.file}:${item.line}:${item.column} ${item.severity.toUpperCase()} ${item.rule} [${item.confidence}/${item.fixSafety}] ${item.message}\n`,
            );
            if (item.suggestion) process.stdout.write(`  ${item.suggestion}\n`);
            if (item.evidence) process.stdout.write(`  evidence: ${String(item.evidence).split('\n')[0]}\n`);
        }
    }
    if (
        identity?.status === IDENTITY_STATUS.mismatch &&
        !args['allow-unverified-source-root']
    ) {
        process.exitCode = EXIT.identityMismatch;
    } else if (diagnostics.some(item => severityRank[item.severity] >= severityRank.warning)) {
        process.exitCode = EXIT.findings;
    }
}

main().catch(error => {
    if (['SOURCE_MISSING', 'DEPENDENCIES_MISSING'].includes(error.code)) {
        writeUsageError(error, USAGE, EXIT.missingMaterial);
    } else {
        writeUsageError(error, USAGE, EXIT.usage);
    }
});
