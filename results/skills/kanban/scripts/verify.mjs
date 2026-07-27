#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

import {
    BOARD_FORMATS,
    LOCALE_MARKERS,
    SETTING_KEYS,
    parseBoard,
    serializeBoard,
} from './board.mjs';
import { CONSEQUENCES, EXIT, assertFormat, parseArgs, readText, severityFor, writeUsageError } from './lib.mjs';
import {
    IDENTITY,
    IDENTITY_STATUS,
    PRIMARY,
    SUPPORTING,
    SUPPORTING_ALIASES,
    buildIdentityRecord,
    discoverRoots,
    verifyPrimaryIdentity,
    verifySupportingIdentity,
} from './identity.mjs';
import { RULES } from './kanban-board-lint.mjs';

const SCRIPT_ROOT = path.dirname(fileURLToPath(import.meta.url));
const SKILL_ROOT = path.dirname(SCRIPT_ROOT);

const EXPECTED_SKILL_NAME = 'obsidian-kanban-plugin';
/**
 * The runtime skill name and the storage path are independent namespaces: each is pinned to its own
 * constant, so renaming one can never be masked by renaming the other.
 */
const EXPECTED_DIRECTORY_BASENAME = 'kanban';
const EXPECTED_SOURCE = 'obsidian-community/obsidian-kanban';
const EXPECTED_VERSION = '2.0.51';
const EXPECTED_BASIS = 'source';

/** Extraction deletes this section, so its heading is matched exactly, never by prefix. */
const REPOSITORY_SECTION_HEADING = '## Repository-only verification (remove when extracting this skill)';
const REPOSITORY_SECTION =
    /(?:^|\n)## Repository-only verification \(remove when extracting this skill\)[\s\S]*?(?=\n## |\s*$)/;

const REFERENCE_FILES = [
    'board-format.md',
    'card-anatomy.md',
    'lanes-and-archive.md',
    'settings.md',
    'safe-mutation.md',
    'migrations.md',
    'validation-and-diagnosis.md',
    'integrations.md',
];

const SCRIPT_FILES = [
    'board.mjs',
    'identity.mjs',
    'kanban-board-lint.mjs',
    'kanban-card.mjs',
    'kanban-migrate.mjs',
    'lib.mjs',
    'test.mjs',
    'verify.mjs',
];

const REQUIRED_PORTABLE_FILES = [
    'SKILL.md',
    'agents/openai.yaml',
    ...REFERENCE_FILES.map(name => `reference/${name}`),
    ...SCRIPT_FILES.map(name => `scripts/${name}`),
    'scripts/fixtures/upstream-identity.json',
];

/** Flags the extracted copy must still document, so a reader can drive the tools without this repo. */
const DOCUMENTED_FLAGS = [
    '--vault',
    '--board',
    '--locale',
    '--write',
    '--kanban-data',
    '--vault-date-format',
    '--vault-time-format',
    '--tasks-emoji',
    '--tasks-data',
    '--tasks-format',
    '--tasks-set-done-date',
    '--global-filter',
    '--archive-stamp',
    '--allow-lossy-recurrence',
    '--settle-seconds',
    '--strategy',
    '--no-backup',
    '--via',
    '--plan',
    '--allow-partial',
    '--expect-sha256',
    '--expect-output-sha256',
];

const CITATION = /`(kanban|tasks): ([^`]+?):(\d+)(?:-(\d+))?`/g;
const PATH_LINE_SHAPE = /[^\s()[\]`]*\.[A-Za-z0-9]{1,6}:\d+(?:-\d+)?/g;

/** The material whose exact contents the primary fingerprint covers. */
const PRIMARY_MATERIAL_PREFIXES = ['src/', 'docs/'];
const PRIMARY_MATERIAL_FILES = ['manifest.json', 'package.json', 'versions.json'];

function assertion(checks, id, passed, message, evidence = null, kind = 'validation') {
    checks.push({ id, passed: Boolean(passed), message, evidence, kind });
}

function parseFrontmatter(text) {
    const match = /^---\n([\s\S]*?)\n---(?:\n|$)/.exec(text);
    if (!match) return null;
    const result = {};
    for (const line of match[1].split('\n')) {
        const entry = /^([A-Za-z0-9_-]+):\s*(.*)$/.exec(line);
        if (!entry) continue;
        let value = entry[2].trim();
        if (
            (value.startsWith('"') && value.endsWith('"')) ||
            (value.startsWith("'") && value.endsWith("'"))
        ) {
            value = value.slice(1, -1);
        }
        result[entry[1]] = value;
    }
    return result;
}

function withoutRepositorySection(text) {
    return text.replace(REPOSITORY_SECTION, '');
}

function artifactMarkdown() {
    const files = [path.join(SKILL_ROOT, 'SKILL.md')];
    const referenceDirectory = path.join(SKILL_ROOT, 'reference');
    if (fs.existsSync(referenceDirectory)) {
        for (const name of fs.readdirSync(referenceDirectory).sort()) {
            if (name.endsWith('.md')) files.push(path.join(referenceDirectory, name));
        }
    }
    return files.filter(file => fs.existsSync(file));
}

function slugifyHeading(text) {
    return text
        .toLowerCase()
        .replace(/`/g, '')
        .replace(/[^\w\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-');
}

/**
 * A backtick fence's info string may not contain a backtick, so a line that opens with four
 * backticks and closes with four more is an inline code span, not a fence. Toggling on it would
 * swallow every heading below it.
 */
function isFenceDelimiter(line) {
    const match = /^ {0,3}(`{3,}|~{3,})(.*)$/.exec(line);
    if (!match) return false;
    return match[1][0] === '~' || !match[2].includes('`');
}

function headingAnchors(text) {
    const anchors = new Set();
    let fenced = false;
    for (const line of text.split('\n')) {
        if (isFenceDelimiter(line)) {
            fenced = !fenced;
            continue;
        }
        if (fenced) continue;
        const heading = /^#{1,6}\s+(.*?)\s*$/.exec(line);
        if (heading) anchors.add(slugifyHeading(heading[1]));
    }
    return anchors;
}

function parseCitations(text) {
    const citations = [];
    const consumed = [];
    for (const match of text.matchAll(CITATION)) {
        citations.push({
            alias: match[1],
            file: match[2],
            start: Number(match[3]),
            end: match[4] ? Number(match[4]) : Number(match[3]),
            raw: match[0],
        });
        consumed.push(match[0]);
    }
    let residue = text;
    for (const raw of consumed) residue = residue.replace(raw, ' ');
    const stray = [...new Set((residue.match(PATH_LINE_SHAPE) ?? []).filter(value => /\//.test(value)))];
    return { citations, stray };
}

function lineOf(root, relative, number) {
    const file = path.join(root, ...relative.split('/'));
    if (!fs.existsSync(file)) return null;
    const lines = fs.readFileSync(file, 'utf8').split('\n');
    if (number < 1 || number > lines.length) return null;
    return lines[number - 1];
}

// --- checks --------------------------------------------------------------------------------------

function verifyIdentity(roots, checks) {
    assertion(checks, 'identity-record-present', Boolean(IDENTITY), 'the skill records what it studied', null, 'identity');
    const statuses = [];
    const primary = verifyPrimaryIdentity(roots.kanban);
    statuses.push(primary.status);
    assertion(
        checks,
        'identity-kanban',
        primary.status === IDENTITY_STATUS.verified,
        `${PRIMARY.repo} is the studied pin ${IDENTITY?.version}`,
        primary.reason ?? `${primary.actual?.files} files`,
        'identity',
    );
    for (const alias of SUPPORTING_ALIASES) {
        const result = verifySupportingIdentity(alias, roots[alias]);
        statuses.push(result.status);
        assertion(
            checks,
            `identity-${alias}`,
            result.status === IDENTITY_STATUS.verified,
            `${SUPPORTING[alias].repo} still holds the cited files unchanged`,
            result.reason,
            'identity',
        );
    }
    return {
        missing: statuses.includes(IDENTITY_STATUS.missing),
        mismatch: statuses.includes(IDENTITY_STATUS.mismatch),
    };
}

function verifyFrontmatter(main, roots, checks) {
    const frontmatter = parseFrontmatter(main);
    assertion(checks, 'skill-frontmatter', Boolean(frontmatter), 'SKILL.md opens with YAML frontmatter');
    if (!frontmatter) return;
    assertion(checks, 'skill-name', frontmatter.name === EXPECTED_SKILL_NAME, `the skill is named ${EXPECTED_SKILL_NAME}`, frontmatter.name);
    assertion(
        checks,
        'skill-directory-basename',
        path.basename(SKILL_ROOT) === EXPECTED_DIRECTORY_BASENAME,
        `the skill lives in a directory named ${EXPECTED_DIRECTORY_BASENAME}`,
        path.basename(SKILL_ROOT),
    );
    assertion(checks, 'skill-source', frontmatter.source === EXPECTED_SOURCE, `the primary source is ${EXPECTED_SOURCE}`, frontmatter.source);
    assertion(checks, 'skill-version', frontmatter.version === EXPECTED_VERSION, `the studied version is ${EXPECTED_VERSION}`, frontmatter.version);
    assertion(checks, 'skill-basis', frontmatter.basis === EXPECTED_BASIS, `the basis is ${EXPECTED_BASIS}`, frontmatter.basis);
    assertion(
        checks,
        'description-version-boundary',
        (frontmatter.description ?? '').includes(EXPECTED_VERSION),
        'the description names the studied version, because a runtime reads it before the body',
        frontmatter.description,
    );
    assertion(
        checks,
        'description-shape',
        (frontmatter.description ?? '').length > 0 &&
            frontmatter.description.length <= 1024 &&
            !/[<>]/.test(frontmatter.description),
        'the description is one plain line of at most 1024 characters',
        String(frontmatter.description?.length),
    );
    assertion(
        checks,
        'description-routes-neighbours',
        (frontmatter.description ?? '').includes('Tasks') && (frontmatter.description ?? '').includes('Dataview'),
        'the description routes questions that belong to the neighbouring skills',
        frontmatter.description,
    );
    // The version is not restated from memory: it is read out of the pinned manifest.
    const manifest = roots.kanban
        ? JSON.parse(fs.readFileSync(path.join(roots.kanban, 'manifest.json'), 'utf8'))
        : {};
    assertion(
        checks,
        'pinned-version-matches-frontmatter',
        manifest.version === EXPECTED_VERSION,
        'the pinned manifest carries the version the frontmatter claims',
        manifest.version,
    );
    assertion(
        checks,
        'sources-commit-kanban',
        main.includes(IDENTITY?.commit ?? ' '),
        'SKILL.md records the full commit of the primary pin',
        IDENTITY?.commit,
    );
    for (const alias of SUPPORTING_ALIASES) {
        const commit = IDENTITY?.supporting?.[alias]?.commit;
        assertion(
            checks,
            `sources-commit-${alias}`,
            Boolean(commit) && main.includes(commit),
            `SKILL.md records the full commit of the ${alias} pin`,
            commit,
        );
    }
}

function verifyStructure(main, checks) {
    const lines = main.split('\n');
    assertion(checks, 'skill-length', lines.length <= 400, 'SKILL.md stays under 400 lines', String(lines.length));

    for (const relative of REQUIRED_PORTABLE_FILES) {
        assertion(
            checks,
            `required-${relative.replace(/\W+/g, '-')}`,
            fs.existsSync(path.join(SKILL_ROOT, relative)),
            `the portable copy carries ${relative}`,
        );
    }
    for (const name of REFERENCE_FILES) {
        assertion(
            checks,
            `route-reference-${name.replace(/\W+/g, '-')}`,
            main.includes(`](reference/${name})`),
            `SKILL.md links reference/${name}`,
        );
    }
    for (const name of SCRIPT_FILES) {
        if (name === 'board.mjs' || name === 'identity.mjs' || name === 'lib.mjs') continue;
        assertion(
            checks,
            `route-script-${name.replace(/\W+/g, '-')}`,
            main.includes(`](scripts/${name})`),
            `SKILL.md links scripts/${name}`,
        );
    }

    for (const file of artifactMarkdown()) {
        const text = readText(file);
        const name = path.basename(file);
        if (name === 'SKILL.md') continue;
        assertion(
            checks,
            `reference-no-frontmatter-${name.replace(/\W+/g, '-')}`,
            text.split('\n')[0]?.trim() !== '---',
            `${name} carries no YAML frontmatter`,
        );
        if (text.split('\n').length > 100) {
            assertion(
                checks,
                `contents-${name.replace(/\W+/g, '-')}`,
                text.split('\n').slice(0, 30).some(line => line.trim() === '## Contents'),
                `${name} opens with a contents list`,
            );
        }
    }

    assertion(
        checks,
        'repository-section-once',
        main.split(REPOSITORY_SECTION_HEADING).length - 1 === 1,
        'the removable repository section appears exactly once, verbatim',
    );

    const offenders = [];
    for (const file of artifactMarkdown()) {
        const name = path.basename(file);
        const text = name === 'SKILL.md' ? withoutRepositorySection(readText(file)) : readText(file);
        text.split('\n').forEach((line, index) => {
            if (/\b(?:research|results)\//.test(line)) offenders.push(`${name}:${index + 1}`);
        });
    }
    assertion(
        checks,
        'repository-paths-confined',
        offenders.length === 0,
        'no repository path survives extraction outside the removable section',
        offenders.slice(0, 12).join('; '),
    );

    const linkErrors = [];
    for (const file of artifactMarkdown()) {
        const text = readText(file);
        const anchors = new Map();
        for (const match of text.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)) {
            const target = match[1];
            if (/^[a-z][a-z0-9+.-]*:\/\//i.test(target)) continue;
            if (target.startsWith('mailto:') || path.isAbsolute(target)) {
                linkErrors.push(`${path.basename(file)} -> ${target} (non-portable link)`);
                continue;
            }
            const [relative, fragment] = target.split('#');
            const resolved = relative ? path.resolve(path.dirname(file), relative) : file;
            if (
                !fs.existsSync(resolved) ||
                !(resolved === SKILL_ROOT || resolved.startsWith(SKILL_ROOT + path.sep))
            ) {
                linkErrors.push(`${path.basename(file)} -> ${target} (unresolved or escaping link)`);
                continue;
            }
            if (fragment) {
                if (!anchors.has(resolved)) anchors.set(resolved, headingAnchors(readText(resolved)));
                if (!anchors.get(resolved).has(fragment)) {
                    linkErrors.push(`${path.basename(file)} -> ${target} (no such heading)`);
                }
            }
        }
    }
    assertion(checks, 'portable-links', linkErrors.length === 0, 'every link resolves inside the skill directory', linkErrors.slice(0, 12).join('; '));

    const portable = withoutRepositorySection(main);
    const undocumented = DOCUMENTED_FLAGS.filter(flag => !portable.includes(flag));
    assertion(
        checks,
        'tool-inputs-documented',
        undocumented.length === 0,
        'the extracted copy still documents every flag a reader needs',
        undocumented.join(', '),
    );
}

function verifyCitations(roots, checks) {
    const unresolved = [];
    const strays = [];
    const outsideMaterial = [];
    let total = 0;
    for (const file of artifactMarkdown()) {
        const text = readText(file);
        const { citations, stray } = parseCitations(text);
        for (const value of stray) strays.push(`${path.basename(file)}: ${value}`);
        for (const citation of citations) {
            total += 1;
            const root = roots[citation.alias];
            if (!root) {
                unresolved.push(`${path.basename(file)}: no ${citation.alias} root`);
                continue;
            }
            if (citation.end < citation.start) {
                unresolved.push(`${path.basename(file)}: inverted range ${citation.raw}`);
                continue;
            }
            const first = lineOf(root, citation.file, citation.start);
            const last = lineOf(root, citation.file, citation.end);
            if (first === null || last === null || !first.trim() || !last.trim()) {
                unresolved.push(`${path.basename(file)}: ${citation.raw}`);
            }
            if (citation.alias === 'kanban') {
                const known =
                    PRIMARY_MATERIAL_PREFIXES.some(prefix => citation.file.startsWith(prefix)) ||
                    PRIMARY_MATERIAL_FILES.includes(citation.file);
                if (!known) outsideMaterial.push(`${path.basename(file)}: ${citation.file}`);
            } else if (!IDENTITY?.supporting?.[citation.alias]?.files?.[citation.file]) {
                outsideMaterial.push(`${path.basename(file)}: ${citation.alias} ${citation.file}`);
            }
        }
    }
    assertion(checks, 'citations-no-stray-shapes', strays.length === 0, 'every path-and-line shape in the prose is a parsed citation', strays.slice(0, 12).join('; '));
    assertion(checks, 'citations-resolve', unresolved.length === 0, `all ${total} citations resolve to non-blank pinned lines`, unresolved.slice(0, 12).join('; '));
    assertion(
        checks,
        'cited-subset-material',
        outsideMaterial.length === 0,
        'every cited file is part of the material the identity fingerprint covers',
        outsideMaterial.slice(0, 12).join('; '),
    );
}

/**
 * Values the port copied out of the pin, compared against the pin again.
 *
 * These are the checks that would notice a pin bump changing behaviour rather than only text: the
 * marker table, the settings keys, the board formats and the serialisation constants are read out of
 * the pinned source here and compared with what the port believes.
 */
function verifyInvariants(roots, checks) {
    const root = roots.kanban;
    if (!root) return;
    const read = relative => fs.readFileSync(path.join(root, ...relative.split('/')), 'utf8');

    const common = read('src/parsers/common.ts');
    assertion(
        checks,
        'invariant-complete-string',
        /completeString = `\*\*\$\{t\('Complete'\)\}\*\*`/.test(common),
        'the complete marker is still the localised word wrapped in double asterisks',
    );
    assertion(checks, 'invariant-archive-separator', /archiveString = '\*\*\*'/.test(common), 'the archive separator is still ***');
    assertion(
        checks,
        'invariant-settings-block',
        common.includes("'%% kanban:settings'") && common.includes('JSON.stringify(board.data.settings)'),
        'the settings block is still a fenced JSON payload under the kanban:settings marker',
    );
    assertion(
        checks,
        'invariant-frontmatter-key',
        /frontmatterKey = 'kanban-plugin'/.test(common),
        'the frontmatter key is still kanban-plugin',
    );

    const settingHelpers = read('src/settingHelpers.ts');
    assertion(
        checks,
        'invariant-default-triggers',
        /defaultDateTrigger = '@'/.test(settingHelpers) && /defaultTimeTrigger = '@@'/.test(settingHelpers),
        'the default date and time triggers are still @ and @@',
    );

    const parseMarkdown = read('src/parsers/parseMarkdown.ts');
    assertion(
        checks,
        'invariant-basic-normalisation',
        /=== 'basic' \? 'board'/.test(parseMarkdown),
        'the legacy basic format is still normalised to board on read',
    );
    assertion(
        checks,
        'invariant-settings-tail-class',
        /\/\[`%\\n\\r\]\//.test(parseMarkdown),
        'the settings footer still tolerates only backticks, percent signs and line breaks after itself',
    );

    const stateManager = read('src/StateManager.ts');
    assertion(
        checks,
        'invariant-parse-trims',
        /const trimmedContent = data\.trim\(\)/.test(stateManager),
        'the board text is still trimmed before parsing, which is what makes leading and trailing whitespace harmless',
    );
    assertion(
        checks,
        'invariant-save-refuses-on-error',
        /if \(this\.state\.data\.errors\.length > 0\) \{\s*return;/.test(stateManager),
        'a board with parse errors still refuses to save',
    );

    // The settings keys the port routes out of frontmatter are read back out of the pin.
    const settings = read('src/Settings.ts');
    const lookup = /settingKeyLookup: Set<keyof KanbanSettings> = new Set\(\[([\s\S]*?)\]\)/.exec(settings);
    const pinnedKeys = lookup
        ? lookup[1]
              .split('\n')
              .map(line => /'([^']+)'/.exec(line)?.[1] ?? (/frontmatterKey/.test(line) ? 'kanban-plugin' : null))
              .filter(Boolean)
        : [];
    assertion(
        checks,
        'invariant-setting-keys',
        JSON.stringify([...pinnedKeys].sort()) === JSON.stringify([...SETTING_KEYS].sort()),
        `the ported settings-key set equals the pinned settingKeyLookup (${pinnedKeys.length} keys)`,
        `pinned=${pinnedKeys.length} ported=${SETTING_KEYS.length}`,
    );

    const formats = /export type KanbanFormat = ([^;]+);/.exec(settings);
    const pinnedFormats = formats ? [...formats[1].matchAll(/'([^']+)'/g)].map(match => match[1]) : [];
    assertion(
        checks,
        'invariant-board-formats',
        JSON.stringify([...pinnedFormats].sort()) === JSON.stringify([...BOARD_FORMATS].sort()),
        'the ported board formats equal the pinned KanbanFormat union',
        `pinned=${pinnedFormats.join(',')} ported=${BOARD_FORMATS.join(',')}`,
    );

    // The marker table is rebuilt from the pinned locale map and locale files.
    const helpers = read('src/lang/helpers.ts');
    const imports = new Map();
    for (const match of helpers.matchAll(/import (\w+)(?:, \{[^}]*\})? from '\.\/locale\/([\w-]+)'/g)) {
        imports.set(match[1], match[2]);
    }
    const mapBody = /const localeMap: \{ \[k: string\]: Partial<Lang> \} = \{([\s\S]*?)\n\};/.exec(helpers);
    const rebuilt = {};
    if (mapBody) {
        for (const raw of mapBody[1].split(',')) {
            const line = raw.trim();
            if (!line) continue;
            const pair = /^'?([\w-]+)'?(?:\s*:\s*(\w+))?$/.exec(line);
            if (!pair) continue;
            const code = pair[1];
            const binding = pair[2] ?? pair[1];
            const localeFile = imports.get(binding);
            const markers = { complete: 'Complete', archive: 'Archive' };
            if (localeFile) {
                const source = read(`src/lang/locale/${localeFile}.ts`);
                const complete = /^ {2}Complete: '(.+)',$/m.exec(source);
                const archive = /^ {2}Archive: '(.+)',$/m.exec(source);
                if (complete) markers.complete = complete[1];
                if (archive) markers.archive = archive[1];
            }
            rebuilt[code] = markers;
        }
    }
    const canonical = table =>
        Object.keys(table)
            .sort()
            .map(code => `${code}=${table[code].complete}/${table[code].archive}`)
            .join(' ');
    const rebuiltCanonical = canonical(rebuilt);
    const portedCanonical = canonical(LOCALE_MARKERS);
    assertion(
        checks,
        'invariant-locale-markers',
        rebuiltCanonical === portedCanonical,
        `the ported marker table equals the pinned locale map (${Object.keys(rebuilt).length} languages)`,
        rebuiltCanonical === portedCanonical
            ? null
            : `pinned=${rebuiltCanonical}\n      ported=${portedCanonical}`,
    );

    const inlineMetadata = read('src/parsers/helpers/inlineMetadata.ts');
    assertion(
        checks,
        'invariant-done-char-fallback',
        /if \(!statuses\) return 'x';/.test(inlineMetadata),
        'the done character still falls back to x when the Tasks plugin is not there',
    );
    assertion(
        checks,
        'invariant-toggle-needs-tasks',
        /const plugin = getTasksPlugin\(\);\s*if \(!plugin\) \{\s*return null;/.test(inlineMetadata),
        'the completion toggle still does nothing without the Tasks plugin, which is why no date is written',
    );

    if (roots.tasks) {
        const serializer = fs.readFileSync(
            path.join(roots.tasks, 'src', 'TaskSerializer', 'DefaultTaskSerializer.ts'),
            'utf8',
        );
        assertion(
            checks,
            'invariant-tasks-done-symbol',
            /doneDateSymbol: '✅'/.test(serializer),
            'the Tasks completion symbol this skill imitates is still ✅',
        );
        const status = fs.readFileSync(path.join(roots.tasks, 'src', 'Statuses', 'Status.ts'), 'utf8');
        assertion(
            checks,
            'invariant-tasks-done-status',
            /new StatusConfiguration\('x', 'Done'/.test(status),
            'the Tasks core done status is still the symbol x',
        );
    }
}

function verifyTools(roots, checks) {
    const scriptFiles = fs
        .readdirSync(SCRIPT_ROOT)
        .filter(name => name.endsWith('.mjs'))
        .map(name => path.join(SCRIPT_ROOT, name));

    const syntaxErrors = [];
    const modeErrors = [];
    for (const file of scriptFiles) {
        const result = spawnSync(process.execPath, ['--check', file], { encoding: 'utf8' });
        if (result.status !== 0) syntaxErrors.push(`${path.basename(file)}: ${result.stderr.split('\n')[0]}`);
        const shebang = fs.readFileSync(file, 'utf8').startsWith('#!');
        const executable = (fs.statSync(file).mode & 0o111) !== 0;
        if (shebang !== executable) {
            modeErrors.push(`${path.basename(file)}: shebang=${shebang} executable=${executable}`);
        }
    }
    assertion(checks, 'script-syntax', syntaxErrors.length === 0, 'every bundled script parses', syntaxErrors.join('; '));
    assertion(checks, 'entry-point-modes', modeErrors.length === 0, 'exactly the scripts with a shebang are executable', modeErrors.join('; '));

    const ids = Object.keys(RULES);
    assertion(
        checks,
        'rule-ids-shape',
        ids.every(id => /^KB\d{3}$/.test(id)),
        'every rule id has the documented shape',
        ids.filter(id => !/^KB\d{3}$/.test(id)).join(', '),
    );
    assertion(checks, 'rule-ids-unique', new Set(ids).size === ids.length, 'rule ids are unique');

    const severityErrors = [];
    const citationErrors = [];
    const fieldErrors = [];
    for (const [id, rule] of Object.entries(RULES)) {
        if (!Object.keys(CONSEQUENCES).includes(rule.consequence)) {
            severityErrors.push(`${id}: unknown consequence ${rule.consequence}`);
            continue;
        }
        if (rule.severity !== undefined && rule.severity !== severityFor(rule.consequence)) {
            severityErrors.push(`${id}: severity does not follow from ${rule.consequence}`);
        }
        if (!rule.message || !rule.fix || !rule.confidence) fieldErrors.push(id);
        const match = /^(kanban|tasks): (.+):(\d+)$/.exec(rule.cite ?? '');
        if (!match) {
            citationErrors.push(`${id}: unparsed citation ${rule.cite}`);
            continue;
        }
        const root = roots[match[1]];
        const line = root ? lineOf(root, match[2], Number(match[3])) : null;
        if (line === null || !line.trim()) citationErrors.push(`${id}: ${rule.cite}`);
    }
    assertion(checks, 'rule-severity-derived', severityErrors.length === 0, 'every rule severity follows from its declared consequence', severityErrors.join('; '));
    assertion(checks, 'rule-fields-complete', fieldErrors.length === 0, 'every rule carries a message, a fix and a confidence', fieldErrors.join(', '));
    assertion(checks, 'rule-citations-resolve', citationErrors.length === 0, 'every rule citation resolves to a non-blank pinned line', citationErrors.slice(0, 12).join('; '));

    // The writing tool's safety contract is asserted as source patterns, because a tool that can
    // lose a user's board must not be able to lose the checks that stop it.
    const card = fs.readFileSync(path.join(SCRIPT_ROOT, 'kanban-card.mjs'), 'utf8');
    const contract = [
        ['compare-and-swap', /if \(!sameFingerprint\(current, result\.snapshot\)\)/],
        ['reviewed-input-hash', /validateExpectedSha\(args\['expect-sha256'\], snapshot\.sha256\)/],
        ['reviewed-output-hash', /validateExpectedSha\(args\['expect-output-sha256'\], outputSha256, 'output'\)/],
        ['backup-by-default', /if \(!args\['no-backup'\]\) \{[\s\S]*?writeFileSync\(backup, result\.original/],
        ['atomic-replace', /fs\.renameSync\(staged, result\.file\)/],
        ['read-back', /if \(afterWrite !== result\.updated\)/],
        ['settle-check', /const afterSettle = readRaw\(result\.file\);/],
        ['refuse-on-blocking', /const blocking = blockingProblems\(board\);/],
        ['postcondition', /const postcondition = blockingProblems\(validated\);/],
    ];
    const missing = contract.filter(([, pattern]) => !pattern.test(card)).map(([name]) => name);
    assertion(checks, 'card-tool-safety-contract', missing.length === 0, 'the card tool still refuses to write over a board it did not read', missing.join(', '));

    // The migration tool rewrites whole vaults, so its write protocol is held to the same standard:
    // compare-and-swap, staged atomic replacement, rollback, backup, immediate read-back, a settle
    // re-check, and skipped boards blocking writes unless partial mutation is explicitly accepted.
    const migrateSource = fs.readFileSync(path.join(SCRIPT_ROOT, 'kanban-migrate.mjs'), 'utf8');
    const migrateContract = [
        ['compare-and-swap', /fingerprint\(fs\.readFileSync\(result\.file\)\) !== result\.before/],
        ['reviewed-target-hash', /validateExpectedSha\(args\['expect-sha256'\], inputSha256\)/],
        ['reviewed-proposal-hash', /validateExpectedSha\(args\['expect-output-sha256'\], outputSha256, 'proposal'\)/],
        ['closed-plan-schema', /rejectUnknownKeys\(plan, PLAN_FIELDS, 'plan'\)/],
        ['skips-block-write', /partialWriteRefused[\s\S]*?if \(args\.write && !partialWriteRefused\)/],
        ['backup-by-default', /if \(!args\['no-backup'\]\) \{[\s\S]*?writeFileSync\(backup, result\.original/],
        ['staged-atomic-replace', /fs\.renameSync\(result\.staged, result\.file\)/],
        ['rollback', /const rollbackFailures = restoreCommitted\(committed\)/],
        ['read-back', /readRaw\(result\.file\) !== result\.updated/],
        ['settle-check', /await sleep\(settle \* 1000\)/],
        ['skips-fail-the-run', /report\.skipped\.length\s*\?\s*EXIT\.refused/],
    ];
    const migrateMissing = migrateContract
        .filter(([, pattern]) => !pattern.test(migrateSource))
        .map(([name]) => name);
    assertion(
        checks,
        'migrate-tool-safety-contract',
        migrateMissing.length === 0,
        'the migration tool binds reviewed input, stages atomic replacements, rolls back detected failures, settles, and blocks unacknowledged partial writes',
        migrateMissing.join(', '),
    );

    // Fixtures have to be what they claim, or a green test proves nothing.
    const cleanFixture = path.join(SCRIPT_ROOT, 'fixtures', 'vault', 'Clean.md');
    if (fs.existsSync(cleanFixture)) {
        const text = fs.readFileSync(cleanFixture, 'utf8');
        const round = serializeBoard(parseBoard(text));
        assertion(
            checks,
            'fixture-clean-is-plugin-shaped',
            round === text,
            'the clean fixture is exactly what the ported serialiser emits, so a drift finding on it would be real',
        );
    }

    const codex = fs.existsSync(path.join(SKILL_ROOT, 'agents', 'openai.yaml'))
        ? readText(path.join(SKILL_ROOT, 'agents', 'openai.yaml'))
        : '';
    assertion(checks, 'codex-ui-metadata', codex.includes(`$${EXPECTED_SKILL_NAME}`), 'the runtime metadata invokes the skill by its own name');
    const shortDescription = /short_description:\s*"([^"]*)"/.exec(codex)?.[1] ?? '';
    assertion(
        checks,
        'codex-short-description-length',
        shortDescription.length >= 25 && shortDescription.length <= 64 && !shortDescription.endsWith('.'),
        'the runtime short description fits the space a launcher gives it',
        `${shortDescription.length} chars`,
    );
}

const USAGE = [
    'usage: verify.mjs [--source-root PATH] [--tasks-root PATH] [--format text|json] [--write-fingerprints]',
    '',
    '  --source-root PATH     checkout of obsidian-community/obsidian-kanban',
    '  --tasks-root PATH      checkout of obsidian-tasks-group/obsidian-tasks',
    '  --format FORMAT        text (default) or json',
    '  --write-fingerprints   regenerate scripts/fixtures/upstream-identity.json and exit',
    '  -h, --help             print this message',
].join('\n');

function main() {
    let args;
    try {
        args = parseArgs(process.argv.slice(2), {
            booleans: ['help', 'write-fingerprints'],
            values: ['format', 'source-root', 'tasks-root'],
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

        const explicit = {
            kanban: args['source-root'] ? path.resolve(args['source-root']) : null,
            tasks: args['tasks-root'] ? path.resolve(args['tasks-root']) : null,
        };
        const discovered = explicit.kanban && explicit.tasks ? {} : discoverRoots(SCRIPT_ROOT);
        const roots = {
            kanban: explicit.kanban ?? discovered.kanban ?? null,
            tasks: explicit.tasks ?? discovered.tasks ?? null,
        };

        const missing = Object.entries(roots)
            .filter(([, value]) => !value)
            .map(([alias]) => (alias === 'kanban' ? `${PRIMARY.repo} (--${PRIMARY.flag})` : `${SUPPORTING[alias].repo} (--${SUPPORTING[alias].flag})`));
        if (missing.length) {
            process.stderr.write(`source material missing: ${missing.join(', ')}\n`);
            process.exitCode = EXIT.missingMaterial;
            return;
        }

        if (args['write-fingerprints']) {
            const citedBySource = { tasks: new Set() };
            for (const file of artifactMarkdown()) {
                for (const citation of parseCitations(readText(file)).citations) {
                    if (citation.alias !== 'kanban') citedBySource[citation.alias]?.add(citation.file);
                }
            }
            const record = buildIdentityRecord(roots.kanban, { tasks: roots.tasks }, citedBySource);
            fs.writeFileSync(
                path.join(SCRIPT_ROOT, 'fixtures', 'upstream-identity.json'),
                `${JSON.stringify(record, null, 2)}\n`,
            );
            process.stdout.write(
                `wrote fixtures/upstream-identity.json: ${record.materialFiles} primary files, ${
                    Object.keys(record.supporting.tasks?.files ?? {}).length
                } cited tasks files\n`,
            );
            return;
        }

        const checks = [];
        const identity = verifyIdentity(roots, checks);
        // Identity is checked first and short-circuits: reading invariants out of a checkout that is
        // not the pin would report failures about the wrong tree, and a missing file there would
        // surface as a usage error rather than as the mismatch it is.
        if (checks.every(check => check.passed)) {
            const main_ = readText(path.join(SKILL_ROOT, 'SKILL.md'));
            verifyFrontmatter(main_, roots, checks);
            verifyStructure(main_, checks);
            verifyCitations(roots, checks);
            verifyInvariants(roots, checks);
            verifyTools(roots, checks);
        }

        const failures = checks.filter(check => !check.passed);
        const identityFailures = failures.filter(check => check.kind === 'identity');
        const report = {
            tool: 'obsidian-kanban-skill-verify',
            expected: { skill: EXPECTED_SKILL_NAME, source: EXPECTED_SOURCE, version: EXPECTED_VERSION },
            roots,
            assumptions: [
                'Identity is content-derived: a checkout is accepted only when the studied material hashes to the reviewed pin, because a directory name and a version string prove nothing.',
                'Identity is checked before anything else, since a drifted pin makes the rest of this report meaningless.',
                'A citation check proves that the cited line exists and is not blank; it cannot prove that the sentence beside it is true.',
                'Ported values are compared against the pinned source rather than restated here, so a pin bump that changes behaviour fails rather than passing quietly.',
            ],
            limitations: [
                'No Obsidian session was run: nothing here shows how the plugin behaves at runtime, only what the pinned source says it does.',
                'Upstream ships no test suite, so the ported parser has no oracle beyond the fixtures checked in beside it.',
                'Agent behaviour is not evaluated here or anywhere: nothing in this report says how the skill triggers or routes in a clean context.',
            ],
            checks,
            passed: checks.length - failures.length,
            failed: failures.length,
        };

        if (format === 'json') {
            process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
        } else {
            for (const check of checks) {
                process.stdout.write(
                    check.passed
                        ? `PASS ${check.id}: ${check.message}\n`
                        : `FAIL ${check.id}: ${check.message}${check.evidence ? ` — ${check.evidence}` : ''}\n`,
                );
            }
            process.stdout.write('\nassumptions:\n');
            for (const item of report.assumptions) process.stdout.write(`- ${item}\n`);
            process.stdout.write('\nlimitations:\n');
            for (const item of report.limitations) process.stdout.write(`- ${item}\n`);
            process.stdout.write(`\nobsidian-kanban skill verification: ${report.passed}/${checks.length} passed\n`);
        }

        // Identity outranks every other failure: a drifted pin makes the rest of the report
        // meaningless, and material that is simply absent is a different problem from material that
        // is present and wrong.
        process.exitCode = identity.missing
            ? EXIT.missingMaterial
            : identityFailures.length || identity.mismatch
              ? EXIT.identityMismatch
              : failures.length
                ? EXIT.findings
                : EXIT.clean;
    } catch (error) {
        writeUsageError(error, USAGE);
    }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
