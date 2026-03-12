#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import {
    documentMetadata,
    inferDataviewType,
    isTaskReservedField,
    parseArgs,
    EXIT,
    TOOL_VERSION,
    resolveVaultArgument,
    resolveVaultFile,
    walkMarkdown,
    writeUsageError,
} from './lib.mjs';

const USAGE =
    'usage: node dataview-vault-lint.mjs [VAULT] [--vault PATH] [--file FILE] [--format text|json|sarif] [--all]';

const RULES = {
    DVS001: {
        severity: 'warning',
        confidence: 'medium',
        message: 'One canonical field has incompatible value types.',
        suggestion: 'Choose one type, migrate outliers, and guard legacy values during the migration.',
    },
    DVS002: {
        severity: 'warning',
        confidence: 'high',
        message: 'One canonical field alternates between scalar and list cardinality.',
        suggestion: 'Choose scalar or list as the schema contract and normalize existing notes.',
    },
    DVS003: {
        severity: 'warning',
        confidence: 'high',
        message: 'Different field spellings collapse to the same Dataview canonical name.',
        suggestion: 'Adopt one spelling; canonical aliases can merge values into an unexpected list.',
    },
    DVS004: {
        severity: 'warning',
        confidence: 'high',
        message: 'A frontmatter key is repeated in one note.',
        suggestion: 'Keep one key and express intentional multiplicity as a YAML list.',
    },
    DVS005: {
        severity: 'warning',
        confidence: 'high',
        message: 'A task annotation reuses a task field reserved by Dataview.',
        suggestion: 'Rename the user field so it cannot shadow task metadata.',
    },
    DVS006: {
        severity: 'note',
        confidence: 'high',
        message: 'A quoted frontmatter scalar still resembles a Dataview date or duration.',
        suggestion: 'Do not rely on YAML quotes to force text; use an explicit schema-safe representation.',
    },
    DVS007: {
        severity: 'note',
        confidence: 'medium',
        message: 'The same tag appears with multiple letter-case variants.',
        suggestion: 'Choose one tag spelling to make sources, grouping and UI navigation predictable.',
    },
    DVS008: {
        severity: 'note',
        confidence: 'medium',
        message: 'One canonical field is authored in both frontmatter and inline locations.',
        suggestion: 'Document the intended location or consolidate it if queries depend on one editing workflow.',
    },
};

const severityRank = { note: 1, warning: 2, error: 3 };

function diagnostic(rule, occurrence, details = {}) {
    return {
        rule,
        ...RULES[rule],
        file: occurrence.file,
        line: occurrence.line,
        column: 1,
        field: occurrence.canonical,
        ...details,
    };
}

function distinct(values) {
    return [...new Set(values)].sort((left, right) => String(left).localeCompare(String(right)));
}

function scalarKinds(occurrence) {
    if (!Array.isArray(occurrence.value)) return [occurrence.type];
    const types = occurrence.value.map(inferDataviewType);
    return distinct(types);
}

function analyze(documents) {
    const diagnostics = [];
    const occurrences = documents.flatMap(document =>
        document.fields.map(field => ({ ...field, file: document.file })),
    );
    const byCanonical = new Map();
    for (const occurrence of occurrences) {
        const bucket = byCanonical.get(occurrence.canonical) ?? [];
        bucket.push(occurrence);
        byCanonical.set(occurrence.canonical, bucket);
    }

    for (const [canonical, bucket] of byCanonical) {
        const spellings = distinct(bucket.map(item => item.key));
        if (spellings.length > 1) {
            diagnostics.push(
                diagnostic('DVS003', bucket[0], { evidence: spellings.join(', ') }),
            );
        }

        const types = distinct(
            bucket.flatMap(scalarKinds).filter(type => type !== 'null'),
        );
        if (types.length > 1) {
            diagnostics.push(
                diagnostic('DVS001', bucket[0], { evidence: types.join(', ') }),
            );
        }

        const cardinalities = distinct(
            bucket.map(item => (Array.isArray(item.value) ? 'list' : 'scalar')),
        );
        if (cardinalities.length > 1) {
            diagnostics.push(
                diagnostic('DVS002', bucket[0], { evidence: cardinalities.join(', ') }),
            );
        }

        const locations = distinct(
            bucket
                .map(item => item.location)
                .filter(location => location === 'frontmatter' || location === 'inline'),
        );
        if (locations.length > 1) {
            diagnostics.push(
                diagnostic('DVS008', bucket[0], { evidence: locations.join(', ') }),
            );
        }

        for (const item of bucket) {
            if (
                item.location === 'task' &&
                isTaskReservedField(item.key)
            ) {
                diagnostics.push(diagnostic('DVS005', item));
            }
            if (
                item.location === 'frontmatter' &&
                item.quoted &&
                ['date', 'duration'].includes(item.type)
            ) {
                diagnostics.push(
                    diagnostic('DVS006', item, { evidence: `${item.raw} → ${item.type}` }),
                );
            }
        }
    }

    for (const document of documents) {
        const keys = new Map();
        for (const field of document.frontmatter.fields) {
            const bucket = keys.get(field.key) ?? [];
            bucket.push(field);
            keys.set(field.key, bucket);
        }
        for (const duplicate of [...keys.values()].filter(bucket => bucket.length > 1)) {
            diagnostics.push(
                diagnostic(
                    'DVS004',
                    { ...duplicate[1], file: document.file, canonical: duplicate[1].key },
                    { evidence: `also authored at line ${duplicate[0].line}` },
                ),
            );
        }
    }

    const tagOccurrences = new Map();
    for (const document of documents) {
        for (const tag of document.tags) {
            const folded = tag.toLocaleLowerCase();
            const bucket = tagOccurrences.get(folded) ?? [];
            bucket.push({ tag, file: document.file, line: 1, canonical: 'file.tags' });
            tagOccurrences.set(folded, bucket);
        }
    }
    for (const bucket of tagOccurrences.values()) {
        const spellings = distinct(bucket.map(item => item.tag));
        if (spellings.length > 1) {
            diagnostics.push(
                diagnostic('DVS007', bucket[0], { evidence: spellings.join(', ') }),
            );
        }
    }

    diagnostics.sort(
        (left, right) =>
            severityRank[right.severity] - severityRank[left.severity] ||
            left.file.localeCompare(right.file) ||
            left.line - right.line ||
            left.rule.localeCompare(right.rule),
    );

    const fields = [...byCanonical.entries()]
        .map(([canonical, bucket]) => ({
            canonical,
            spellings: distinct(bucket.map(item => item.key)),
            files: distinct(bucket.map(item => item.file)).length,
            occurrences: bucket.length,
            types: distinct(bucket.flatMap(scalarKinds)),
            cardinalities: distinct(
                bucket.map(item => (Array.isArray(item.value) ? 'list' : 'scalar')),
            ),
            locations: distinct(bucket.map(item => item.location)),
        }))
        .sort((left, right) => left.canonical.localeCompare(right.canonical));

    return { diagnostics, fields };
}

function sarifReport(report) {
    const usedRules = distinct(report.diagnostics.map(item => item.rule));
    return {
        version: '2.1.0',
        $schema: 'https://json.schemastore.org/sarif-2.1.0.json',
        runs: [
            {
                tool: {
                    driver: {
                        name: report.tool,
                        rules: usedRules.map(id => ({
                            id,
                            shortDescription: { text: RULES[id].message },
                            help: { text: RULES[id].suggestion },
                        })),
                    },
                },
                results: report.diagnostics.map(item => ({
                    ruleId: item.rule,
                    level: item.severity === 'warning' ? 'warning' : 'note',
                    message: {
                        text: `${item.message} ${item.suggestion}${
                            item.evidence ? ` Evidence: ${item.evidence}` : ''
                        }`,
                    },
                    locations: [
                        {
                            physicalLocation: {
                                artifactLocation: { uri: item.file },
                                region: { startLine: item.line, startColumn: item.column },
                            },
                        },
                    ],
                    properties: {
                        confidence: item.confidence,
                        field: item.field,
                    },
                })),
            },
        ],
    };
}

function main() {
    const args = parseArgs(process.argv.slice(2), {
        booleans: ['help', 'all'],
        values: ['vault', 'file', 'format'],
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
    const files = args.file ? [resolveVaultFile(vault, args.file, '--file')] : walkMarkdown(vault);
    for (const file of files) {
        if (!fs.existsSync(file) || !fs.statSync(file).isFile()) {
            throw new Error(`Markdown file does not exist: ${file}`);
        }
    }
    const documents = files.map(file => documentMetadata(file, vault));
    const { diagnostics, fields } = analyze(documents);
    const report = {
        tool: 'dataview-vault-lint',
        version: TOOL_VERSION,
        vault,
        scanned: { files: files.length, fields: fields.length },
        limitations: [
            'Static parser covers scalar and flat-list frontmatter plus Dataview inline fields.',
            'Nested YAML, aliases, block scalars and runtime index state require live inspection.',
            'Canonicalization of multi-code-point emoji field names is approximate; confirm it in the live index.',
        ],
        diagnostics,
        fields: args.all ? fields : undefined,
    };

    if (format === 'json') {
        process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
    } else if (format === 'sarif') {
        process.stdout.write(`${JSON.stringify(sarifReport(report), null, 2)}\n`);
    } else {
        process.stdout.write(
            `Dataview vault lint: ${files.length} files, ${fields.length} fields, ${diagnostics.length} findings\n`,
        );
        for (const item of diagnostics) {
            process.stdout.write(
                `${item.file}:${item.line}:1 ${item.severity.toUpperCase()} ${item.rule} [${item.confidence}] ${item.message}\n`,
            );
            process.stdout.write(`  ${item.suggestion}\n`);
            if (item.evidence) process.stdout.write(`  evidence: ${item.evidence}\n`);
        }
        if (args.all) {
            process.stdout.write('\nField inventory:\n');
            for (const field of fields) {
                process.stdout.write(
                    `${field.canonical}: ${field.files} files; ${field.types.join('|')}; ${field.cardinalities.join('|')}; ${field.locations.join('|')}\n`,
                );
            }
        }
    }
    if (diagnostics.some(item => item.severity === 'warning')) process.exitCode = EXIT.findings;
}

try {
    main();
} catch (error) {
    writeUsageError(error, USAGE, EXIT.usage);
}
