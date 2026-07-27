#!/usr/bin/env node
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
    BOARD_FORMATS,
    LOCALE_MARKERS,
    SETTING_KEYS,
    blockingProblems,
    inferUseTab,
    markerCandidates,
    markersFor,
    parseBoard,
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
    '  --allow-partial  write safe boards even when others are skipped; the run still exits 5',
    '  --expect-sha256 H  only act on the target-set SHA-256 printed by a reviewed dry run',
    '  --expect-output-sha256 H  only write the exact plan, locale and per-board outcomes reviewed',
    '  --no-backup      do not keep the previous contents beside each board',
    '  --settle-seconds N   after writing, wait N seconds and re-check that every written board',
    '                   survived (default 3, longer than Obsidian\'s save debounce)',
    '  --format text|json   report shape (default: text)',
    '  -h, --help       print this message',
    '',
    'A plan is a closed-schema JSON object and must request a change; fields present are applied in this order:',
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
    '    "onMissingLane": "error"                 error (default) or skip',
    '  }',
    '',
    'Exit codes: 0 clean, 1 nothing to change, 2 usage error, 5 refused — the plan could not be',
    'applied, a written board was rewritten underneath the settle check, or boards were skipped',
    'for safety. Skips block all writes unless --allow-partial explicitly accepts them.',
].join('\n');

class Refused extends Error {}

function refuse(message) {
    throw new Refused(message);
}

const PLAN_FIELDS = new Set(['format', 'lanes', 'order', 'settings', 'unsetSettings', 'onMissingLane']);
const LANE_FIELDS = new Set([
    'from',
    'to',
    'after',
    'merge',
    'delete',
    'create',
    'discardCards',
    'maxItems',
    'marksComplete',
]);
const SETTING_KEY_SET = new Set(SETTING_KEYS);
const BOOLEAN_SETTINGS = new Set([
    'append-archive-date',
    'archive-with-date',
    'full-list-lane-width',
    'hide-card-count',
    'link-date-to-daily-note',
    'move-dates',
    'move-tags',
    'move-task-metadata',
    'show-add-list',
    'show-archive-all',
    'show-board-settings',
    'show-checkboxes',
    'show-relative-date',
    'show-search',
    'show-set-view',
    'show-view-as-markdown',
]);
const STRING_SETTINGS = new Set([
    'archive-date-format',
    'archive-date-separator',
    'date-display-format',
    'date-format',
    'date-time-display-format',
    'date-trigger',
    'new-note-folder',
    'new-note-template',
    'time-format',
    'time-trigger',
]);
const NUMBER_SETTINGS = new Set(['date-picker-week-start', 'lane-width', 'max-archive-size']);
const ENUM_SETTINGS = new Map([
    ['inline-metadata-position', ['body', 'footer', 'metadata-table']],
    ['new-card-insertion-method', ['prepend', 'prepend-compact', 'append']],
    ['new-line-trigger', ['enter', 'shift-enter']],
    ['tag-action', ['kanban', 'obsidian']],
]);

function isObject(value) {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function rejectUnknownKeys(value, allowed, label) {
    const unknown = Object.keys(value).filter(key => !allowed.has(key));
    if (unknown.length) throw new Error(`${label} has unknown ${unknown.length === 1 ? 'field' : 'fields'}: ${unknown.join(', ')}`);
}

function requireObjectFields(value, fields, label) {
    if (!isObject(value)) throw new Error(`${label} must be an object`);
    rejectUnknownKeys(value, new Set(Object.keys(fields)), label);
    for (const [key, type] of Object.entries(fields)) {
        if (typeof value[key] !== type) throw new Error(`${label}.${key} must be ${type}`);
    }
}

function validateDateColor(value, label) {
    if (!isObject(value)) throw new Error(`${label} must be an object`);
    const allowed = new Set(['isToday', 'isBefore', 'isAfter', 'distance', 'unit', 'direction', 'color', 'backgroundColor']);
    rejectUnknownKeys(value, allowed, label);
    for (const key of ['isToday', 'isBefore', 'isAfter']) {
        if (value[key] !== undefined && typeof value[key] !== 'boolean') throw new Error(`${label}.${key} must be boolean`);
    }
    if (value.distance !== undefined && (!Number.isFinite(value.distance) || value.distance < 0)) {
        throw new Error(`${label}.distance must be a non-negative number`);
    }
    if (value.unit !== undefined && !['hours', 'days', 'weeks', 'months'].includes(value.unit)) {
        throw new Error(`${label}.unit must be hours, days, weeks or months`);
    }
    if (value.direction !== undefined && !['before', 'after'].includes(value.direction)) {
        throw new Error(`${label}.direction must be before or after`);
    }
    for (const key of ['color', 'backgroundColor']) {
        if (value[key] !== undefined && typeof value[key] !== 'string') throw new Error(`${label}.${key} must be a string`);
    }
}

function validateSetting(key, value, label) {
    if (!SETTING_KEY_SET.has(key)) throw new Error(`${label} is not a Kanban 2.0.51 setting`);
    if (key === 'kanban-plugin') throw new Error(`${label} is owned by plan.format`);
    if (key === 'list-collapse') {
        throw new Error(`${label} is maintained by lane provenance; remove it with unsetSettings instead of assigning it`);
    }
    if (BOOLEAN_SETTINGS.has(key) && typeof value !== 'boolean') throw new Error(`${label} must be true or false`);
    if (STRING_SETTINGS.has(key) && typeof value !== 'string') throw new Error(`${label} must be a string`);
    if (NUMBER_SETTINGS.has(key) && (!Number.isFinite(value) || value < 0)) {
        throw new Error(`${label} must be a non-negative number`);
    }
    if (key === 'date-picker-week-start' && (!Number.isInteger(value) || value > 6)) {
        throw new Error(`${label} must be a whole day index from 0 through 6`);
    }
    if (ENUM_SETTINGS.has(key) && !ENUM_SETTINGS.get(key).includes(value)) {
        throw new Error(`${label} must be one of ${ENUM_SETTINGS.get(key).join(', ')}`);
    }
    if (key === 'date-colors') {
        if (!Array.isArray(value)) throw new Error(`${label} must be an array`);
        value.forEach((entry, index) => validateDateColor(entry, `${label}[${index}]`));
    }
    if (key === 'metadata-keys') {
        if (!Array.isArray(value)) throw new Error(`${label} must be an array`);
        value.forEach((entry, index) =>
            requireObjectFields(
                entry,
                { metadataKey: 'string', label: 'string', shouldHideLabel: 'boolean', containsMarkdown: 'boolean' },
                `${label}[${index}]`,
            ),
        );
    }
    if (key === 'tag-colors') {
        if (!Array.isArray(value)) throw new Error(`${label} must be an array`);
        value.forEach((entry, index) =>
            requireObjectFields(
                entry,
                { tagKey: 'string', color: 'string', backgroundColor: 'string' },
                `${label}[${index}]`,
            ),
        );
    }
    if (key === 'tag-sort') {
        if (!Array.isArray(value)) throw new Error(`${label} must be an array`);
        value.forEach((entry, index) => requireObjectFields(entry, { tag: 'string' }, `${label}[${index}]`));
    }
    if (key === 'table-sizing') {
        if (!isObject(value) || Object.values(value).some(size => !Number.isFinite(size) || size < 0)) {
            throw new Error(`${label} must be an object of non-negative numeric widths`);
        }
    }
}

function planLane(board, title, onMissing, what, changes) {
    const matches = board.lanes.filter(lane => lane.title === title);
    if (matches.length > 1) refuse(`${what}: more than one lane is titled ${JSON.stringify(title)}`);
    if (!matches.length) {
        if (onMissing === 'error') refuse(`${what}: no lane titled ${JSON.stringify(title)}`);
        changes.push(`skipped ${what}: no lane titled ${JSON.stringify(title)}`);
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
    const onMissing = plan.onMissingLane ?? 'error';
    const model = {
        frontmatter: { ...board.frontmatter },
        settings: { ...board.settings },
        // `originalIndex` follows each lane through every step — rename included — so positional
        // state such as `list-collapse` can be remapped by provenance rather than by title, which a
        // rename would break. The serialiser never reads it.
        lanes: board.lanes.map((lane, index) => ({
            originalIndex: index,
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
            const lane = planLane(model, step.from ?? step.to, onMissing, 'delete', changes);
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
                originalIndex: null,
                title: step.to,
                maxItems: step.maxItems ?? 0,
                shouldMarkItemsComplete: Boolean(step.marksComplete),
                cards: [],
            };
            const anchor = step.after ? model.lanes.findIndex(candidate => candidate.title === step.after) : -1;
            if (anchor >= 0) model.lanes.splice(anchor + 1, 0, lane);
            else {
                if (step.after && onMissing === 'error') {
                    refuse(`create: no lane titled ${JSON.stringify(step.after)} for "after"`);
                }
                model.lanes.push(lane);
                if (step.after) {
                    changes.push(
                        `the lane ${JSON.stringify(step.after)} named by "after" does not exist, so ${JSON.stringify(step.to)} was appended at the end`,
                    );
                }
            }
            changes.push(`created the lane ${JSON.stringify(step.to)}`);
            continue;
        }
        if (step.from && step.to && step.from !== step.to) {
            const source = planLane(model, step.from, onMissing, 'move', changes);
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
        const lane = planLane(model, target, onMissing, 'update', changes);
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
        const missing = plan.order.filter(title => !model.lanes.some(lane => lane.title === title));
        if (missing.length && onMissing === 'error') {
            refuse(
                `order: no ${missing.length === 1 ? 'lane' : 'lanes'} titled ${missing
                    .map(title => JSON.stringify(title))
                    .join(', ')}`,
            );
        }
        for (const title of missing) changes.push(`skipped order entry: no lane titled ${JSON.stringify(title)}`);
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
    // removes, renames or reorders a lane invalidates it, so it is remapped by each lane's tracked
    // original position — a created lane starts expanded.
    if (Array.isArray(model.settings['list-collapse'])) {
        const before = model.settings['list-collapse'];
        const after = model.lanes.map(lane =>
            lane.originalIndex === null ? false : Boolean(before[lane.originalIndex]),
        );
        if (JSON.stringify(before) !== JSON.stringify(after)) {
            model.settings['list-collapse'] = after;
            changes.push('remapped list-collapse so each entry still belongs to its own lane');
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
    rejectUnknownKeys(plan, PLAN_FIELDS, 'plan');
    if (plan.format !== undefined && !BOARD_FORMATS.filter(value => value !== 'basic').includes(plan.format)) {
        throw new Error('plan.format must be board, table or list');
    }
    if (plan.lanes !== undefined) {
        if (!Array.isArray(plan.lanes)) throw new Error('plan.lanes must be an array of steps');
        plan.lanes.forEach((step, index) => {
            if (!isObject(step)) throw new Error(`plan.lanes[${index}] must be an object`);
            rejectUnknownKeys(step, LANE_FIELDS, `plan.lanes[${index}]`);
            for (const key of ['from', 'to', 'after']) {
                if (step[key] !== undefined && typeof step[key] !== 'string') {
                    throw new Error(`plan.lanes[${index}].${key} must be a string`);
                }
                if (step[key] !== undefined && !step[key].trim()) {
                    throw new Error(`plan.lanes[${index}].${key} must not be empty`);
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
            const modes = ['create', 'delete', 'merge'].filter(key => step[key] === true);
            if (modes.length > 1) {
                throw new Error(`plan.lanes[${index}] cannot combine ${modes.join(', ')}`);
            }
            if (step.create) {
                if (!step.to) throw new Error(`plan.lanes[${index}].to is required for create`);
                if (step.from !== undefined) throw new Error(`plan.lanes[${index}].from is not valid for create`);
            } else if (step.delete) {
                if (!step.from && !step.to) throw new Error(`plan.lanes[${index}] needs from or to for delete`);
                if (step.from && step.to && step.from !== step.to) {
                    throw new Error(`plan.lanes[${index}] delete must name one lane, not different from and to titles`);
                }
                if (step.after !== undefined || step.maxItems !== undefined || step.marksComplete !== undefined) {
                    throw new Error(`plan.lanes[${index}] cannot update or position a lane it deletes`);
                }
            } else if (step.merge) {
                if (!step.from || !step.to || step.from === step.to) {
                    throw new Error(`plan.lanes[${index}] merge requires different from and to titles`);
                }
            } else if (!step.from && !step.to) {
                throw new Error(`plan.lanes[${index}] needs from or to`);
            }
            if (!step.create && step.after !== undefined) {
                throw new Error(`plan.lanes[${index}].after is only valid for create`);
            }
            if (!step.delete && step.discardCards !== undefined) {
                throw new Error(`plan.lanes[${index}].discardCards is only valid for delete`);
            }
            const onlySelector =
                !step.create &&
                !step.delete &&
                !step.merge &&
                !(step.from && step.to && step.from !== step.to) &&
                step.maxItems === undefined &&
                step.marksComplete === undefined;
            if (onlySelector) throw new Error(`plan.lanes[${index}] does not request a change`);
        });
    }
    if (plan.order !== undefined) {
        if (!Array.isArray(plan.order) || plan.order.some(title => typeof title !== 'string')) {
            throw new Error('plan.order must be an array of lane titles');
        }
        if (plan.order.some(title => !title.trim())) throw new Error('plan.order lane titles must not be empty');
        if (new Set(plan.order).size !== plan.order.length) throw new Error('plan.order must not repeat a lane title');
    }
    if (plan.settings !== undefined) {
        if (!isObject(plan.settings)) throw new Error('plan.settings must be an object of settings keys');
        for (const [key, value] of Object.entries(plan.settings)) validateSetting(key, value, `plan.settings.${key}`);
    }
    if (plan.unsetSettings !== undefined) {
        if (!Array.isArray(plan.unsetSettings) || plan.unsetSettings.some(key => typeof key !== 'string')) {
            throw new Error('plan.unsetSettings must be an array of settings keys');
        }
        if (new Set(plan.unsetSettings).size !== plan.unsetSettings.length) {
            throw new Error('plan.unsetSettings must not repeat a key');
        }
        for (const key of plan.unsetSettings) {
            if (!SETTING_KEY_SET.has(key)) throw new Error(`plan.unsetSettings contains unknown setting ${key}`);
            if (key === 'kanban-plugin') throw new Error('plan.unsetSettings cannot remove kanban-plugin; use plan.format');
            if (plan.settings && key in plan.settings) {
                throw new Error(`plan both sets and unsets ${key}`);
            }
        }
    }
    if (plan.onMissingLane !== undefined && !['skip', 'error'].includes(plan.onMissingLane)) {
        throw new Error('plan.onMissingLane must be skip or error');
    }
    if (
        plan.format === undefined &&
        (plan.lanes === undefined || plan.lanes.length === 0) &&
        (plan.order === undefined || plan.order.length === 0) &&
        (plan.settings === undefined || Object.keys(plan.settings).length === 0) &&
        (plan.unsetSettings === undefined || plan.unsetSettings.length === 0)
    ) {
        throw new Error('plan does not request any change');
    }
    return plan;
}

/**
 * Markers of a language other than the one being migrated under, which a rewrite would delete.
 * Candidates come from the constructs the plugin compares — top-level paragraphs and headings —
 * so a card body that merely spells a marker word does not make its board unmigratable.
 */
function foreignMarkers(board, locale) {
    const target = markersFor(locale);
    const found = [];
    for (const candidate of markerCandidates(board)) {
        if (candidate.plain === target[candidate.kind]) continue;
        for (const markers of Object.values(LOCALE_MARKERS)) {
            if (markers[candidate.kind] === candidate.plain) {
                found.push(`line ${candidate.line + 1}: ${candidate.plain}`);
                break;
            }
        }
    }
    return [...new Set(found)];
}

function fingerprint(text) {
    return crypto.createHash('sha256').update(text).digest('hex');
}

function targetFingerprint(results) {
    const identities = results
        .map(result => ({ board: result.relative, sha256: result.before }))
        .sort((left, right) => left.board.localeCompare(right.board));
    return fingerprint(JSON.stringify(identities));
}

function proposalFingerprint(results, planSha256, locale) {
    const boards = results
        .map(result => ({
            board: result.relative,
            input: result.before,
            output: result.updated === undefined ? null : fingerprint(result.updated),
            skipped: result.skipped ?? null,
        }))
        .sort((left, right) => left.board.localeCompare(right.board));
    return fingerprint(JSON.stringify({ planSha256, locale, boards }));
}

function validateExpectedSha(value, actual, label = 'target-set input') {
    if (value === undefined) return;
    const option = label === 'target-set input' ? '--expect-sha256' : '--expect-output-sha256';
    if (!/^[a-f0-9]{64}$/i.test(value)) throw new Error(`${option} must be 64 hexadecimal characters`);
    if (value.toLowerCase() !== actual) {
        refuse(
            `the reviewed ${label} SHA-256 was ${value.toLowerCase()}, but this run computed ${actual}; nothing was written`,
        );
    }
}

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

/** Parsed once, and always before anything is written, so a typo cannot follow a completed write. */
function settleSeconds(args) {
    if (args['settle-seconds'] === undefined) return 3;
    const value = Number(args['settle-seconds']);
    if (!Number.isFinite(value) || value < 0) throw new Error('--settle-seconds must be a number of seconds');
    return value;
}

function availableBackup(file) {
    let candidate = `${file}.bak`;
    let index = 1;
    while (fs.existsSync(candidate)) candidate = `${file}.bak.${index++}`;
    return candidate;
}

function stageFile(result, index) {
    const nonce = crypto.randomBytes(6).toString('hex');
    const staged = `${result.file}.kanban-migrate-${process.pid}-${index}-${nonce}.tmp`;
    const descriptor = fs.openSync(staged, 'wx', fs.statSync(result.file).mode);
    try {
        fs.writeFileSync(descriptor, result.updated);
        fs.fsyncSync(descriptor);
    } finally {
        fs.closeSync(descriptor);
    }
    if (readRaw(staged) !== result.updated) throw new Error(`staging ${result.relative} produced different bytes`);
    return staged;
}

function restoreCommitted(committed) {
    const failures = [];
    for (const result of [...committed].reverse()) {
        const rollback = `${result.file}.kanban-rollback-${process.pid}-${crypto.randomBytes(6).toString('hex')}.tmp`;
        try {
            const descriptor = fs.openSync(rollback, 'wx', result.mode);
            try {
                fs.writeFileSync(descriptor, result.original);
                fs.fsyncSync(descriptor);
            } finally {
                fs.closeSync(descriptor);
            }
            fs.renameSync(rollback, result.file);
            if (readRaw(result.file) !== result.original) throw new Error('read-back differs');
        } catch (error) {
            failures.push(`${result.relative}: ${error.message}`);
            try {
                if (fs.existsSync(rollback)) fs.unlinkSync(rollback);
            } catch {
                // The failure list already says recovery needs human attention.
            }
        }
    }
    return failures;
}

/** Stage every new board, then replace each original atomically with rollback on a detected failure. */
async function commitMigration(changed, args, settle) {
    const staged = [];
    const committed = [];
    const backups = [];
    try {
        for (const result of changed) {
            if (fingerprint(fs.readFileSync(result.file)) !== result.before) {
                refuse(`${result.relative} changed on disk while the migration was being computed`);
            }
            try {
                fs.accessSync(result.file, fs.constants.W_OK);
            } catch {
                refuse(`${result.relative} is not writable; nothing was written`);
            }
        }

        for (const [index, result] of changed.entries()) {
            result.mode = fs.statSync(result.file).mode & 0o777;
            result.staged = stageFile(result, index);
            staged.push(result.staged);
        }

        // A second compare immediately before the first rename closes the staging window. Each file
        // is checked once more at its own rename so a late change triggers rollback of earlier ones.
        for (const result of changed) {
            if (fingerprint(fs.readFileSync(result.file)) !== result.before) {
                refuse(`${result.relative} changed while the migration was being staged; nothing was written`);
            }
        }
        if (!args['no-backup']) {
            for (const result of changed) {
                const backup = availableBackup(result.file);
                fs.writeFileSync(backup, result.original, { flag: 'wx', mode: result.mode });
                backups.push(backup);
            }
        }

        try {
            for (const result of changed) {
                if (fingerprint(fs.readFileSync(result.file)) !== result.before) {
                    throw new Error(`${result.relative} changed immediately before its atomic replace`);
                }
                fs.renameSync(result.staged, result.file);
                staged.splice(staged.indexOf(result.staged), 1);
                committed.push(result);
                if (readRaw(result.file) !== result.updated) {
                    throw new Error(`the write to ${result.relative} did not survive its immediate read-back`);
                }
            }
        } catch (error) {
            const rollbackFailures = restoreCommitted(committed);
            const backupNote = backups.length ? `; recovery copies: ${backups.join(', ')}` : '';
            if (rollbackFailures.length) {
                refuse(
                    `migration commit failed (${error.message}), and rollback also failed: ${rollbackFailures.join('; ')}${backupNote}; use the recovery copies before opening Obsidian`,
                );
            }
            refuse(`migration commit failed (${error.message}); every replaced board was rolled back${backupNote}`);
        }

        if (settle > 0 && changed.length) {
            await sleep(settle * 1000);
            const lost = changed.filter(result => readRaw(result.file) !== result.updated);
            if (lost.length) {
                const backupNote = backups.length ? `; recovery copies: ${backups.join(', ')}` : '';
                refuse(
                    `${lost.length === 1 ? 'a board was' : `${lost.length} boards were`} rewritten ${settle}s after the migration — which is what an open Obsidian board does: ${lost
                        .map(result => result.relative)
                        .join(', ')}${backupNote}`,
                );
            }
        }
        return backups;
    } catch (error) {
        if (error instanceof Refused) throw error;
        refuse(`the migration could not be prepared safely: ${error.message}`);
    } finally {
        for (const file of staged) {
            try {
                if (fs.existsSync(file)) fs.unlinkSync(file);
            } catch {
                // A stale non-Markdown temp is safer than deleting a path whose identity changed.
            }
        }
    }
}

function migrateFile(file, relative, plan, locale) {
    const originalBytes = fs.readFileSync(file);
    const original = originalBytes.toString('utf8');
    const base = { file, relative, original, before: fingerprint(originalBytes) };
    const board = parseBoard(original, { locale });
    const blocking = blockingProblems(board);
    if (blocking.length) {
        return {
            ...base,
            skipped: `not safe to migrate: ${blocking.map(item => item.kind).join('; ')}`,
        };
    }
    // A migration always re-serialises, which regenerates the frontmatter. Anything richer than flat
    // key-and-value lines is beyond what this tool can rewrite faithfully, so the board is skipped
    // with a reason rather than reformatted into something nobody asked for.
    if (board.uncertainties.some(item => item.kind === 'yaml-not-modelled')) {
        return {
            ...base,
            skipped:
                'the frontmatter holds more than flat key-and-value lines, and migrating would rewrite it; edit this board by hand',
        };
    }
    if (!decodesLosslessly(file)) {
        return { ...base, skipped: 'this file contains bytes that are not valid UTF-8, which a rewrite would replace' };
    }
    if (hasMixedLineEndings(original)) {
        return { ...base, skipped: 'this file mixes CRLF and LF line endings, which a rewrite would normalise' };
    }
    if (board.unrepresented.length) {
        return {
            ...base,
            skipped: `a rewrite would delete content the board model cannot carry, first at line ${board.unrepresented[0].line}; fix that first`,
        };
    }
    const foreign = foreignMarkers(board, locale);
    if (foreign.length) {
        return {
            ...base,
            skipped: `this board carries structural markers of another language (${foreign.join('; ')}), and migrating under --locale ${locale} would delete them`,
        };
    }
    let migrated;
    try {
        migrated = migrateBoard(board, plan);
    } catch (error) {
        if (error instanceof Refused) {
            return { ...base, skipped: `the plan was not safe to apply: ${error.message}` };
        }
        throw error;
    }
    const { model, changes } = migrated;
    const updated = serializeBoard(model, { useTab: inferUseTab(board) });
    const postcondition = blockingProblems(parseBoard(updated, { locale }));
    if (postcondition.length) {
        refuse(
            `the migration produced a board the port cannot parse safely: ${postcondition
                .map(item => item.kind)
                .join('; ')}`,
        );
    }
    return {
        ...base,
        updated,
        changes,
        changed: updated !== original,
    };
}

async function main() {
    let args;
    try {
        args = parseArgs(process.argv.slice(2), {
            booleans: ['help', 'write', 'no-backup', 'allow-partial'],
            values: [
                'plan',
                'vault',
                'board',
                'locale',
                'expect-sha256',
                'expect-output-sha256',
                'settle-seconds',
                'format',
            ],
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
        const settle = settleSeconds(args);
        const locale = args.locale ?? 'en';
        markersFor(locale);
        const vault = resolveDirectory(args.vault, '--vault');
        if (!args.plan) throw new Error('--plan is required');
        const planFile = path.resolve(args.plan);
        const planBytes = fs.existsSync(planFile) ? fs.readFileSync(planFile) : null;
        const plan = readJson(planFile, null);
        if (!plan) throw new Error(`--plan is not readable JSON: ${args.plan}`);
        if (typeof plan !== 'object' || Array.isArray(plan)) throw new Error('--plan must be a JSON object');
        validatePlan(plan);

        const selectTargets = () => {
            const selected = args.board
                ? [resolveContainedFile(vault, args.board, '--board')]
                : markdownFiles(vault).filter(file => {
                      if (!isContained(vault, file)) return false;
                      const text = fs.readFileSync(file, 'utf8');
                      const match = text.match(/---\s+([\w\W]+?)\s+---/);
                      return Boolean(match && match[1].includes('kanban-plugin'));
                  });
            // `walkFiles` deliberately exposes linked files to read-only tools. A writer must act on
            // the contained target instead of atomically replacing the symlink itself, and two
            // aliases to one note must not stage that target twice.
            return [...new Set(selected.map(file => fs.realpathSync(file)))].sort();
        };
        const targets = selectTargets();

        const results = targets.map(file => migrateFile(file, relativeTo(vault, file), plan, locale));
        const changed = results.filter(result => result.changed);
        const skipped = results.filter(result => result.skipped);
        const unchanged = results.filter(result => !result.skipped && !result.changed);
        const inputSha256 = targetFingerprint(results);
        validateExpectedSha(args['expect-sha256'], inputSha256);
        const planSha256 = fingerprint(planBytes);
        const outputSha256 = proposalFingerprint(results, planSha256, locale);
        validateExpectedSha(args['expect-output-sha256'], outputSha256, 'proposal');
        const partialWriteRefused = Boolean(args.write && skipped.length && !args['allow-partial']);
        let backups = [];

        if (args.write && !partialWriteRefused) {
            let currentTargets;
            try {
                currentTargets = selectTargets();
            } catch (error) {
                refuse(`the selected boards could not be re-checked before commit: ${error.message}; nothing was written`);
            }
            if (
                currentTargets.length !== targets.length ||
                currentTargets.some((file, index) => file !== targets[index])
            ) {
                refuse('the set of selected boards changed while the migration was being prepared; nothing was written');
            }
            backups = await commitMigration(changed, args, settle);
        }

        const report = {
            tool: 'kanban-migrate',
            plan: path.resolve(args.plan),
            vault,
            written: Boolean(args.write && !partialWriteRefused && changed.length),
            partialWriteAllowed: Boolean(args.write && skipped.length && args['allow-partial']),
            writeRefused: partialWriteRefused
                ? 'boards were skipped; no board was written without explicit --allow-partial'
                : null,
            inputSha256,
            outputSha256,
            planSha256,
            backups,
            settleSeconds: args.write && !partialWriteRefused && changed.length ? settle : null,
            boards: results.length,
            changedBoards: changed.length,
            assumptions: [
                'A migration re-serialises the whole board, so every board it touches also loses any spacing the plugin would not have written.',
                'Structural markers are read and written for the given language, which is the language Obsidian was running in when the board was last saved.',
                'Nothing here can tell whether a board is open in Obsidian; the settle re-check catches an overwrite landing inside its window, and nothing catches one that lands later.',
            ],
            limitations: [
                'Card text is never rewritten by a plan: changing a date trigger, for example, needs the card tool or a hand edit.',
                'The archive is carried through unchanged; lanes cannot be migrated into or out of it.',
                'Each file replacement is atomic and detected commit failures roll back, but a process or machine crash cannot make several separate files one transaction.',
                'Agent behaviour is not evaluated here or anywhere: nothing in this report says how the skill triggers or routes in a clean context.',
            ],
            boardsChanged: changed.map(result => ({
                board: result.relative,
                changes: result.changes,
                diff: unifiedDiff(result.original, result.updated, result.relative),
            })),
            boardsUnchanged: unchanged.map(result => ({
                board: result.relative,
                notes: result.changes,
            })),
            skipped: skipped.map(result => ({ board: result.relative, reason: result.skipped })),
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
            for (const entry of report.boardsUnchanged) {
                process.stdout.write(`\n=== ${entry.board} (unchanged) ===\n`);
                for (const note of entry.notes) process.stdout.write(`- ${note}\n`);
            }
            for (const entry of report.skipped) {
                process.stdout.write(`\nskipped ${entry.board}: ${entry.reason}\n`);
            }
            process.stdout.write(`\ntarget-set SHA-256: ${report.inputSha256}\n`);
            process.stdout.write(`proposal SHA-256: ${report.outputSha256}\n`);
            if (report.writeRefused) process.stdout.write(`write refused: ${report.writeRefused}\n`);
            process.stdout.write('\nassumptions:\n');
            for (const item of report.assumptions) process.stdout.write(`- ${item}\n`);
            process.stdout.write('\nlimitations:\n');
            for (const item of report.limitations) process.stdout.write(`- ${item}\n`);
            process.stdout.write(
                report.written
                    ? '\nwritten\n'
                    : `\nnothing was written; re-run with --write --expect-sha256 ${report.inputSha256} --expect-output-sha256 ${report.outputSha256} to apply exactly this reviewed proposal\n`,
            );
        }
        // A board skipped for safety is work the plan asked for and did not get. Automation must
        // not read partial coverage as success, so skips outrank both clean and nothing-to-change.
        process.exitCode = report.skipped.length
            ? EXIT.refused
            : changed.length
              ? EXIT.clean
              : EXIT.findings;
    } catch (error) {
        if (error instanceof Refused) {
            process.stderr.write(`refused: ${error.message}\n`);
            process.exitCode = EXIT.refused;
            return;
        }
        writeUsageError(error, USAGE);
    }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await main();
