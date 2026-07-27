#!/usr/bin/env node
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
    LOCALE_MARKERS,
    blockingProblems,
    inferUseTab,
    markersFor,
    parseBoard,
    plainText,
    serializeBoard,
} from './board.mjs';
import {
    EXIT,
    assertFormat,
    decodesLosslessly,
    hasMixedLineEndings,
    isContained,
    markdownFiles,
    parseArgs,
    readJson,
    readRaw,
    relativeTo,
    resolveContainedFile,
    resolveDirectory,
    unifiedDiff,
    writeUsageError,
} from './lib.mjs';

const USAGE = [
    'usage: kanban-migrate.mjs --plan PLAN.json --vault PATH [--board PATH] [--write]',
    '',
    '  --plan PATH      the migration plan, as JSON (required)',
    '  --vault PATH     vault root (required)',
    '  --board PATH     migrate one board; default is every board in the vault',
    '  --locale CODE    the Obsidian UI language the boards were written under (default: en);',
    '                   a board whose markers are in another language is skipped, not rewritten',
    '  --write          apply the migration; without it nothing is written',
    '  --no-backup      do not keep the previous contents beside each board',
    '  --format text|json   report shape (default: text)',
    '  -h, --help       print this message',
    '',
    'A plan is a JSON object. Every field is optional; the ones present are applied in this order:',
    '',
    '  {',
    '    "format": "board",                       normalise the kanban-plugin value',
    '    "lanes": [                               lane-level operations, in order',
    '      {"from": "Doing", "to": "In Progress"},',
    '      {"from": "Review", "to": "In Progress", "merge": true},',
    '      {"from": "Icebox", "delete": true},',
    '      {"to": "Blocked", "create": true, "after": "In Progress"},',
    '      {"to": "In Progress", "maxItems": 3},',
    '      {"to": "Done", "marksComplete": true}',
    '    ],',
    '    "order": ["Backlog", "In Progress", "Blocked", "Done"],',
    '    "settings": {"lane-width": 320},         merge into the settings block',
    '    "unsetSettings": ["table-sizing"],',
    '    "onMissingLane": "skip"                  skip (default) or error',
    '  }',
    '',
    'Exit codes: 0 clean, 1 nothing to change, 2 usage error, 5 refused.',
].join('\n');

class Refused extends Error {}

function refuse(message) {
    throw new Refused(message);
}

function planLane(board, title, onMissing, what) {
    const matches = board.lanes.filter(lane => lane.title === title);
    if (matches.length > 1) refuse(`${what}: more than one lane is titled ${JSON.stringify(title)}`);
    if (!matches.length) {
        if (onMissing === 'error') refuse(`${what}: no lane titled ${JSON.stringify(title)}`);
        return null;
    }
    return matches[0];
}

/**
 * Apply a plan to one board's model.
 *
 * A migration is a whole-board rewrite by construction: renaming a lane changes a heading, merging
 * lanes moves cards between lists, and reordering lanes moves every line in the file. There is no
 * useful minimal splice for that, so the board is re-serialised the way the plugin would — which is
 * also why `list-collapse` has to be rebuilt here rather than left to drift out of alignment.
 */
export function migrateBoard(board, plan) {
    const changes = [];
    const onMissing = plan.onMissingLane ?? 'skip';
    const model = {
        frontmatter: { ...board.frontmatter },
        settings: { ...board.settings },
        lanes: board.lanes.map(lane => ({
            title: lane.title,
            maxItems: lane.maxItems,
            shouldMarkItemsComplete: lane.shouldMarkItemsComplete,
            cards: [...lane.cards],
        })),
        archive: [...board.archive],
        markers: board.markers,
        locale: board.locale,
    };

    if (plan.format) {
        if (model.frontmatter['kanban-plugin'] !== plan.format) {
            changes.push(`set the board format to ${plan.format}`);
        }
        model.frontmatter['kanban-plugin'] = plan.format;
        model.settings['kanban-plugin'] = plan.format;
    }

    for (const step of plan.lanes ?? []) {
        if (step.delete) {
            const lane = planLane(model, step.from ?? step.to, onMissing, 'delete');
            if (!lane) continue;
            if (lane.cards.length && !step.discardCards) {
                refuse(
                    `delete: lane ${JSON.stringify(lane.title)} still holds ${lane.cards.length} cards; move them first, or set "discardCards": true`,
                );
            }
            model.lanes = model.lanes.filter(candidate => candidate !== lane);
            changes.push(`deleted the lane ${JSON.stringify(lane.title)}`);
            continue;
        }
        if (step.create) {
            if (!step.to) refuse('create: "to" is required');
            if (model.lanes.some(lane => lane.title === step.to)) {
                changes.push(`the lane ${JSON.stringify(step.to)} already exists`);
                continue;
            }
            const lane = {
                title: step.to,
                maxItems: step.maxItems ?? 0,
                shouldMarkItemsComplete: Boolean(step.marksComplete),
                cards: [],
            };
            const anchor = step.after ? model.lanes.findIndex(candidate => candidate.title === step.after) : -1;
            if (anchor >= 0) model.lanes.splice(anchor + 1, 0, lane);
            else model.lanes.push(lane);
            changes.push(`created the lane ${JSON.stringify(step.to)}`);
            continue;
        }
        if (step.from && step.to && step.from !== step.to) {
            const source = planLane(model, step.from, onMissing, 'move');
            if (!source) continue;
            const destination = model.lanes.find(candidate => candidate.title === step.to);
            if (destination && step.merge) {
                destination.cards.push(...source.cards);
                model.lanes = model.lanes.filter(candidate => candidate !== source);
                changes.push(
                    `merged ${JSON.stringify(step.from)} into ${JSON.stringify(step.to)}, moving ${source.cards.length} cards`,
                );
            } else if (destination) {
                refuse(
                    `rename: a lane titled ${JSON.stringify(step.to)} already exists; set "merge": true to combine them`,
                );
            } else {
                source.title = step.to;
                changes.push(`renamed ${JSON.stringify(step.from)} to ${JSON.stringify(step.to)}`);
            }
        }
        const target = step.to ?? step.from;
        if (target === undefined) continue;
        const lane = planLane(model, target, onMissing, 'update');
        if (!lane) continue;
        if (step.maxItems !== undefined && lane.maxItems !== step.maxItems) {
            lane.maxItems = step.maxItems;
            changes.push(
                step.maxItems
                    ? `set the work-in-progress limit of ${JSON.stringify(lane.title)} to ${step.maxItems}`
                    : `removed the work-in-progress limit from ${JSON.stringify(lane.title)}`,
            );
        }
        if (step.marksComplete !== undefined && lane.shouldMarkItemsComplete !== step.marksComplete) {
            lane.shouldMarkItemsComplete = step.marksComplete;
            changes.push(
                `${step.marksComplete ? 'made' : 'stopped making'} ${JSON.stringify(lane.title)} mark its cards complete`,
            );
            changes.push(
                'the flag alone does not re-check or un-check the cards already in that lane; the plugin does not do that either',
            );
        }
    }

    if (plan.order) {
        const ranked = [...model.lanes];
        ranked.sort((left, right) => {
            const l = plan.order.indexOf(left.title);
            const r = plan.order.indexOf(right.title);
            return (l === -1 ? Number.MAX_SAFE_INTEGER : l) - (r === -1 ? Number.MAX_SAFE_INTEGER : r);
        });
        if (ranked.some((lane, index) => lane !== model.lanes[index])) {
            changes.push(`reordered the lanes to ${plan.order.join(', ')}`);
        }
        model.lanes = ranked;
    }

    for (const [key, value] of Object.entries(plan.settings ?? {})) {
        if (JSON.stringify(model.settings[key]) === JSON.stringify(value)) continue;
        model.settings[key] = value;
        changes.push(`set the setting ${key}`);
    }
    for (const key of plan.unsetSettings ?? []) {
        if (!(key in model.settings)) continue;
        delete model.settings[key];
        changes.push(`removed the setting ${key}`);
    }

    // `list-collapse` is positional: one boolean per lane, in lane order. Any migration that adds,
    // removes or reorders a lane invalidates it, so it is rebuilt rather than carried over.
    if (Array.isArray(model.settings['list-collapse'])) {
        const before = model.settings['list-collapse'];
        const after = model.lanes.map((lane, index) => {
            const original = board.lanes.findIndex(candidate => candidate.title === lane.title);
            return Boolean(before[original >= 0 ? original : index]);
        });
        if (JSON.stringify(before) !== JSON.stringify(after)) {
            model.settings['list-collapse'] = after;
            changes.push('rebuilt list-collapse so each entry still belongs to its own lane');
        }
    }

    return { model, changes };
}

/**
 * A plan comes from outside and drives a whole-vault rewrite, so its shape is checked rather than
 * duck-typed. Iterating a string as if it were an array of steps, or spreading one into the settings
 * block, are both things that used to succeed silently.
 */
export function validatePlan(plan) {
    const isObject = value => value !== null && typeof value === 'object' && !Array.isArray(value);
    if (plan.format !== undefined && typeof plan.format !== 'string') {
        throw new Error('plan.format must be a string');
    }
    if (plan.lanes !== undefined) {
        if (!Array.isArray(plan.lanes)) throw new Error('plan.lanes must be an array of steps');
        plan.lanes.forEach((step, index) => {
            if (!isObject(step)) throw new Error(`plan.lanes[${index}] must be an object`);
            for (const key of ['from', 'to', 'after']) {
                if (step[key] !== undefined && typeof step[key] !== 'string') {
                    throw new Error(`plan.lanes[${index}].${key} must be a string`);
                }
            }
            if (step.maxItems !== undefined && (!Number.isInteger(step.maxItems) || step.maxItems < 0)) {
                throw new Error(`plan.lanes[${index}].maxItems must be a whole number of cards`);
            }
            for (const key of ['merge', 'delete', 'create', 'discardCards', 'marksComplete']) {
                if (step[key] !== undefined && typeof step[key] !== 'boolean') {
                    throw new Error(`plan.lanes[${index}].${key} must be true or false`);
                }
            }
        });
    }
    if (plan.order !== undefined) {
        if (!Array.isArray(plan.order) || plan.order.some(title => typeof title !== 'string')) {
            throw new Error('plan.order must be an array of lane titles');
        }
    }
    if (plan.settings !== undefined && !isObject(plan.settings)) {
        throw new Error('plan.settings must be an object of settings keys');
    }
    if (plan.unsetSettings !== undefined) {
        if (!Array.isArray(plan.unsetSettings) || plan.unsetSettings.some(key => typeof key !== 'string')) {
            throw new Error('plan.unsetSettings must be an array of settings keys');
        }
    }
    if (plan.onMissingLane !== undefined && !['skip', 'error'].includes(plan.onMissingLane)) {
        throw new Error('plan.onMissingLane must be skip or error');
    }
    return plan;
}

/** Markers of a language other than the one being migrated under, which a rewrite would delete. */
function foreignMarkers(board, locale) {
    const target = markersFor(locale);
    const found = [];
    board.lines.forEach((line, index) => {
        const heading = /^ {0,3}#{1,6}[ \t]+(.*)$/.exec(line);
        const plain = plainText(heading ? heading[1] : line);
        const kind = heading ? 'archive' : 'complete';
        if (plain === target[kind]) return;
        for (const markers of Object.values(LOCALE_MARKERS)) {
            if (markers[kind] === plain) {
                found.push(`line ${index + 1}: ${plain}`);
                return;
            }
        }
    });
    return [...new Set(found)];
}

function fingerprint(text) {
    return crypto.createHash('sha256').update(text).digest('hex');
}

function migrateFile(file, relative, plan, locale, options) {
    const original = readRaw(file);
    const board = parseBoard(original, { locale });
    const blocking = blockingProblems(board);
    if (blocking.length) {
        return {
            file,
            relative,
            skipped: `not safe to migrate: ${blocking.map(item => item.kind).join('; ')}`,
        };
    }
    // A migration always re-serialises, which regenerates the frontmatter. Anything richer than flat
    // key-and-value lines is beyond what this tool can rewrite faithfully, so the board is skipped
    // with a reason rather than reformatted into something nobody asked for.
    if (board.uncertainties.some(item => item.kind === 'yaml-not-modelled')) {
        return {
            file,
            relative,
            skipped:
                'the frontmatter holds more than flat key-and-value lines, and migrating would rewrite it; edit this board by hand',
        };
    }
    if (!decodesLosslessly(file)) {
        return { file, relative, skipped: 'this file contains bytes that are not valid UTF-8, which a rewrite would replace' };
    }
    if (hasMixedLineEndings(original)) {
        return { file, relative, skipped: 'this file mixes CRLF and LF line endings, which a rewrite would normalise' };
    }
    if (board.unrepresented.length) {
        return {
            file,
            relative,
            skipped: `a rewrite would delete content the board model cannot carry, first at line ${board.unrepresented[0].line}; fix that first`,
        };
    }
    const foreign = foreignMarkers(board, locale);
    if (foreign.length) {
        return {
            file,
            relative,
            skipped: `this board carries structural markers of another language (${foreign.join('; ')}), and migrating under --locale ${locale} would delete them`,
        };
    }
    const { model, changes } = migrateBoard(board, plan);
    const updated = serializeBoard(model, { useTab: inferUseTab(board) });
    return {
        file,
        relative,
        original,
        updated,
        changes,
        changed: updated !== original,
        before: fingerprint(original),
    };
}

function main() {
    let args;
    try {
        args = parseArgs(process.argv.slice(2), {
            booleans: ['help', 'write', 'no-backup'],
            values: ['plan', 'vault', 'board', 'locale', 'format'],
        });
    } catch (error) {
        writeUsageError(error, USAGE);
        return;
    }
    if (args.help) {
        process.stdout.write(`${USAGE}\n`);
        return;
    }
    try {
        if (args._.length) throw new Error('positional arguments are not accepted');
        const format = assertFormat(args.format ?? 'text', ['text', 'json']);
        const locale = args.locale ?? 'en';
        markersFor(locale);
        const vault = resolveDirectory(args.vault, '--vault');
        if (!args.plan) throw new Error('--plan is required');
        const plan = readJson(path.resolve(args.plan), null);
        if (!plan) throw new Error(`--plan is not readable JSON: ${args.plan}`);
        if (typeof plan !== 'object' || Array.isArray(plan)) throw new Error('--plan must be a JSON object');
        validatePlan(plan);

        const targets = args.board
            ? [resolveContainedFile(vault, args.board, '--board')]
            : markdownFiles(vault).filter(file => {
                  if (!isContained(vault, file)) return false;
                  const text = fs.readFileSync(file, 'utf8');
                  const match = text.match(/---\s+([\w\W]+?)\s+---/);
                  return Boolean(match && match[1].includes('kanban-plugin'));
              });

        const results = targets.map(file => migrateFile(file, relativeTo(vault, file), plan, locale, args));
        const changed = results.filter(result => result.changed);

        if (args.write) {
            // Everything is checked before anything is written: a migration that stops halfway
            // leaves a vault where some boards follow the new workflow and some do not, and no
            // report says which.
            for (const result of changed) {
                if (fingerprint(readRaw(result.file)) !== result.before) {
                    refuse(`${result.relative} changed on disk while the migration was being computed`);
                }
                try {
                    fs.accessSync(result.file, fs.constants.W_OK);
                } catch {
                    refuse(`${result.relative} is not writable; nothing was written`);
                }
            }
            for (const result of changed) {
                if (!args['no-backup']) fs.writeFileSync(`${result.file}.bak`, result.original);
                fs.writeFileSync(result.file, result.updated);
            }
        }

        const report = {
            tool: 'kanban-migrate',
            plan: path.resolve(args.plan),
            vault,
            written: Boolean(args.write),
            boards: results.length,
            changedBoards: changed.length,
            assumptions: [
                'A migration re-serialises the whole board, so every board it touches also loses any spacing the plugin would not have written.',
                'Structural markers are read and written for the given language, which is the language Obsidian was running in when the board was last saved.',
                'Nothing here can tell whether a board is open in Obsidian; an open board holds its own copy of the settings and will write it back over this migration.',
            ],
            limitations: [
                'Card text is never rewritten by a plan: changing a date trigger, for example, needs the card tool or a hand edit.',
                'The archive is carried through unchanged; lanes cannot be migrated into or out of it.',
                'Agent behaviour is not evaluated here or anywhere: nothing in this report says how the skill triggers or routes in a clean context.',
            ],
            boardsChanged: changed.map(result => ({
                board: result.relative,
                changes: result.changes,
                diff: unifiedDiff(result.original, result.updated, result.relative),
            })),
            skipped: results.filter(result => result.skipped).map(result => ({ board: result.relative, reason: result.skipped })),
        };

        if (format === 'json') {
            process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
        } else {
            process.stdout.write(`kanban-migrate — ${report.boards} boards, ${report.changedBoards} to change\n`);
            for (const entry of report.boardsChanged) {
                process.stdout.write(`\n=== ${entry.board} ===\n`);
                for (const change of entry.changes) process.stdout.write(`- ${change}\n`);
                process.stdout.write(entry.diff);
            }
            for (const entry of report.skipped) {
                process.stdout.write(`\nskipped ${entry.board}: ${entry.reason}\n`);
            }
            process.stdout.write('\nassumptions:\n');
            for (const item of report.assumptions) process.stdout.write(`- ${item}\n`);
            process.stdout.write('\nlimitations:\n');
            for (const item of report.limitations) process.stdout.write(`- ${item}\n`);
            process.stdout.write(
                args.write ? '\nwritten\n' : '\nnothing was written; re-run with --write to apply\n',
            );
        }
        if (!changed.length) process.exitCode = EXIT.findings;
    } catch (error) {
        if (error instanceof Refused) {
            process.stderr.write(`refused: ${error.message}\n`);
            process.exitCode = EXIT.refused;
            return;
        }
        writeUsageError(error, USAGE);
    }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
