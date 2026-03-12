#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { EXIT, TOOL_VERSION, parseArgs, writeUsageError } from './lib.mjs';

const USAGE = `usage: node tasks-profile.mjs FILE [--format text|json] [--top N] [--by label|category]`;

const LIMITATIONS = [
    'Descriptive statistics only: this parser does not control cold/warm cache, device load, vault state, or causality.',
    'Cold and warm runs are not separated. Split the input yourself if that distinction matters.',
    'Statistics are keyed by the exact measurement label, so two queries never share a distribution. The category roll-up is a secondary, explicitly named view.',
];

/** Broad Tasks measurement families, used only for the secondary roll-up. */
function category(label) {
    const normalized = label.trim();
    if (normalized.startsWith('Search:')) return 'search';
    if (normalized.startsWith('Render:')) return 'render';
    if (normalized.startsWith('Loading vault')) return 'vault-load';
    return 'other';
}

function quantile(sorted, ratio) {
    if (!sorted.length) return null;
    const index = Math.max(0, Math.ceil(ratio * sorted.length) - 1);
    return sorted[index];
}

function statistics(entries) {
    const durations = entries.map((entry) => entry.durationMs).sort((a, b) => a - b);
    const middle = Math.floor(durations.length / 2);
    const median =
        durations.length % 2
            ? durations[middle]
            : (durations[middle - 1] + durations[middle]) / 2;
    return {
        count: durations.length,
        minMs: durations[0],
        medianMs: Number(median.toFixed(2)),
        p95Ms: quantile(durations, 0.95),
        maxMs: durations.at(-1),
    };
}

function group(entries, key) {
    const grouped = new Map();
    for (const entry of entries) {
        const name = key(entry);
        if (!grouped.has(name)) grouped.set(name, []);
        grouped.get(name).push(entry);
    }
    return Object.fromEntries(
        [...grouped.entries()]
            .sort(([left], [right]) => left.localeCompare(right))
            .map(([name, values]) => [name, { ...statistics(values), category: category(name) }]),
    );
}

try {
    const args = parseArgs(process.argv.slice(2), {
        booleans: ['help'],
        values: ['format', 'top', 'by'],
    });
    if (args.help) {
        process.stdout.write(`${USAGE}\n`);
        process.exit(EXIT.clean);
    }
    if (args._.length !== 1) throw new Error('exactly one input file is required');
    const input = path.resolve(args._[0]);
    if (!fs.existsSync(input) || !fs.statSync(input).isFile()) {
        throw new Error(`input is not a file: ${input}`);
    }
    const format = args.format ?? 'text';
    if (!['text', 'json'].includes(format)) throw new Error('--format must be text or json');
    const by = args.by ?? 'label';
    if (!['label', 'category'].includes(by)) throw new Error('--by must be label or category');
    const top = Number(args.top ?? 5);
    if (!Number.isInteger(top) || top < 0) throw new Error('--top must be a non-negative integer');

    const entries = [];
    const lines = fs.readFileSync(input, 'utf8').replace(/\r\n?/g, '\n').split('\n');
    for (let index = 0; index < lines.length; index += 1) {
        const match = /^(.*):\s*([0-9]+(?:\.[0-9]+)?)\s+milliseconds\b/.exec(lines[index].trim());
        if (!match) continue;
        entries.push({
            line: index + 1,
            label: match[1].trim(),
            category: category(match[1]),
            durationMs: Number(match[2]),
        });
    }
    if (!entries.length) {
        throw new Error('no Tasks “<label>: <duration> milliseconds” measurements found');
    }

    // The exact label is the primary key: two distinct queries must never merge into one
    // distribution. The category roll-up is offered separately and named as such.
    const byLabel = group(entries, (entry) => entry.label);
    const byCategory = group(entries, (entry) => entry.category);
    const slowest = [...entries]
        .sort((left, right) => right.durationMs - left.durationMs || left.line - right.line)
        .slice(0, top);
    const report = {
        tool: 'tasks-profile',
        toolVersion: TOOL_VERSION,
        input,
        measurements: entries.length,
        primaryKey: 'label',
        byLabel,
        byCategory,
        slowest,
        limitations: LIMITATIONS,
    };
    if (format === 'json') {
        process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
    } else {
        const selected = by === 'label' ? byLabel : byCategory;
        const width = Math.max(12, ...Object.keys(selected).map((name) => name.length));
        process.stdout.write(`Tasks performance measurements: ${entries.length}\n`);
        process.stdout.write(
            `${(by === 'label' ? 'label' : 'category').padEnd(width)} count    min ms  median ms   p95 ms   max ms\n`,
        );
        for (const [name, stats] of Object.entries(selected)) {
            process.stdout.write(
                `${name.padEnd(width)} ${String(stats.count).padStart(5)} ${String(stats.minMs).padStart(9)} ${String(stats.medianMs).padStart(10)} ${String(stats.p95Ms).padStart(8)} ${String(stats.maxMs).padStart(8)}\n`,
            );
        }
        if (slowest.length) {
            process.stdout.write('Slowest observations:\n');
            for (const item of slowest) {
                process.stdout.write(`  ${item.durationMs} ms  line ${item.line}  ${item.label}\n`);
            }
        }
        for (const limitation of LIMITATIONS) process.stdout.write(`Limitation: ${limitation}\n`);
    }
} catch (error) {
    writeUsageError(error, USAGE);
}
