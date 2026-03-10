#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { parseArgs, writeUsageError } from './lib.mjs';

const USAGE = `usage: node tasks-profile.mjs FILE [--format text|json] [--top N]`;

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

try {
    const args = parseArgs(process.argv.slice(2), {
        booleans: ['help'],
        values: ['format', 'top'],
    });
    if (args.help) {
        process.stdout.write(`${USAGE}\n`);
        process.exit(0);
    }
    if (args._.length !== 1) throw new Error('exactly one input file is required');
    const input = path.resolve(args._[0]);
    if (!fs.existsSync(input) || !fs.statSync(input).isFile()) {
        throw new Error(`input is not a file: ${input}`);
    }
    const format = args.format ?? 'text';
    if (!['text', 'json'].includes(format)) throw new Error('--format must be text or json');
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
    const grouped = {};
    for (const entry of entries) {
        (grouped[entry.category] ??= []).push(entry);
    }
    const summary = Object.fromEntries(
        Object.entries(grouped)
            .sort(([left], [right]) => left.localeCompare(right))
            .map(([name, values]) => [name, statistics(values)]),
    );
    const slowest = [...entries]
        .sort((left, right) => right.durationMs - left.durationMs || left.line - right.line)
        .slice(0, top);
    const report = {
        tool: 'tasks-profile',
        input,
        measurements: entries.length,
        summary,
        slowest,
        caveat:
            'Descriptive statistics only: this parser does not control cold/warm cache, device load, vault state, or causality.',
    };
    if (format === 'json') {
        process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
    } else {
        process.stdout.write(`Tasks performance measurements: ${entries.length}\n`);
        process.stdout.write('category     count    min ms  median ms   p95 ms   max ms\n');
        for (const [name, stats] of Object.entries(summary)) {
            process.stdout.write(
                `${name.padEnd(12)} ${String(stats.count).padStart(5)} ${String(stats.minMs).padStart(9)} ${String(stats.medianMs).padStart(10)} ${String(stats.p95Ms).padStart(8)} ${String(stats.maxMs).padStart(8)}\n`,
            );
        }
        if (slowest.length) {
            process.stdout.write('Slowest observations:\n');
            for (const item of slowest) {
                process.stdout.write(`  ${item.durationMs} ms  line ${item.line}  ${item.label}\n`);
            }
        }
        process.stdout.write(`${report.caveat}\n`);
    }
} catch (error) {
    writeUsageError(error, USAGE);
}
