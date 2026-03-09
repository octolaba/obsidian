// Verification harness for results/deep-dives/tasks/query-language-defects/README.md
//
// Reads the relevant regular expressions and heuristics OUT OF the pinned upstream source
// rather than duplicating them, so that this harness fails loudly if the submodule pin moves
// and upstream has changed the code. It exercises them in isolation: it reproduces the
// mechanism of each finding, not the full plugin. End-to-end reproduction steps for Obsidian
// are given in README.md.
//
// Usage:  node results/deep-dives/tasks/query-language-defects/verify.mjs
//         Runnable from any working directory, and unaffected by moving this file within the repo.
// Exit:   0 = every expectation held, 1 = at least one differed, 2 = pin drift or missing submodule

import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const UPSTREAM = 'research/plugins/obsidian-tasks-group/obsidian-tasks';

/**
 * Find the repository root by walking up from this file until the pinned submodule is present.
 *
 * Anchoring on the submodule itself, rather than on a fixed number of '..' segments or on
 * `git rev-parse`, means the harness keeps working if it is moved to a different depth, needs no
 * subprocess, works in a copy of the tree that has no .git, and fails with one actionable message
 * when the submodule has simply not been hydrated.
 */
function findRepoRoot(startDir) {
    for (let dir = startDir; ; dir = dirname(dir)) {
        if (existsSync(join(dir, UPSTREAM, 'manifest.json'))) {
            return dir;
        }
        if (dirname(dir) === dir) {
            console.error(`Could not find ${UPSTREAM}/manifest.json in any ancestor of ${startDir}.`);
            console.error('Hydrate the research submodules first:  git submodule update --init --recursive');
            process.exit(2);
        }
    }
}

const repoRoot = findRepoRoot(dirname(fileURLToPath(import.meta.url)));
const upstream = join(repoRoot, UPSTREAM);
const read = (path) => readFileSync(join(upstream, path), 'utf8');

let failures = 0;

/** Locate a line in pinned source; exit if it has gone, so that pin drift is never silent. */
function locate(path, needle) {
    const lines = read(path).split('\n');
    const index = lines.findIndex((line) => line.includes(needle));
    if (index === -1) {
        console.error(`PIN DRIFT: ${JSON.stringify(needle)} no longer found in ${path}`);
        process.exit(2);
    }
    return { citation: `${path}:${index + 1}`, text: lines[index].trim() };
}

function check(id, description, expected, observed) {
    const ok = JSON.stringify(expected) === JSON.stringify(observed);
    if (!ok) failures += 1;
    console.log(`  ${ok ? 'HOLDS ' : 'FAILED'}  ${id}  ${description}`);
    if (!ok) {
        console.log(`            expected ${JSON.stringify(expected)}, observed ${JSON.stringify(observed)}`);
    }
}

console.log(`pinned plugin version: ${JSON.parse(read('manifest.json')).version}`);
console.log(`node: ${process.version}\n`);

// ---------------------------------------------------------------------------------------------
// D1 - the relative date range pattern is not anchored, so it matches inside longer words
// ---------------------------------------------------------------------------------------------
const d1 = locate('src/DateTime/DateParser.ts', 'const relativeDateRangeRegexp');
console.log(`D1  ${d1.citation}\n    ${d1.text}\n`);

const expectedPattern = '(last|this|next) (week|month|quarter|year)';
if (!d1.text.includes(expectedPattern)) {
    console.error(`PIN DRIFT: relative-range pattern changed to: ${d1.text}`);
    process.exit(2);
}
const relativeRange = new RegExp(expectedPattern);

for (const [input, expected] of [
    ['next week', 'next week'],
    ['next weekend', 'next week'],
    ['this weekend', 'this week'],
    ['last quarterly review', 'last quarter'],
    ['next yearly planning', 'next year'],
    ['next semester', null],
]) {
    const match = input.match(relativeRange);
    const label = expected === null ? 'no relative-range match' : `read as "${expected}"`;
    check('D1', `"${input}" -> ${label}`, expected, match ? match[0] : null);
}

// The date-field regex decides how much of the instruction reaches the date parser.
const d1b = locate('src/Query/Filter/DateField.ts', '(?:on|in) or before|before');
console.log(`\nD1  ${d1b.citation} (keyword / date split)\n    ${d1b.text}\n`);
const dueRegex = /^due (((?:on|in) or before|before|(?:on|in) or after|after|on|in)? ?(.*))/i;
check('D1', '"due next weekend" hands "next weekend" to the date parser', 'next weekend',
    'due next weekend'.match(dueRegex)[3]);
check('D1', '"due before next week" hands "next week" to the date parser', 'next week',
    'due before next week'.match(dueRegex)[3]);

// ---------------------------------------------------------------------------------------------
// D2 - 'return' is auto-prepended based on a substring test, not a syntax test
// ---------------------------------------------------------------------------------------------
const d2 = locate('src/Scripting/Expression.ts', "arg.includes('return')");
console.log(`\nD2  ${d2.citation}\n    ${d2.text}\n`);

const wrap = (arg) => (arg.includes('return') ? arg : `return ${arg}`);
const evaluate = (arg, task) => new Function('task', 'query', wrap(arg))(task, null);

check('D2', 'plain expression is wrapped, yields boolean', 'boolean',
    typeof evaluate('task.description.includes("book")', { description: 'read the book' }));
check('D2', "expression containing 'return' is not wrapped, yields undefined", 'undefined',
    typeof evaluate("task.description.includes('return')", { description: 'return the book' }));
check('D2', 'an explicit return restores correct behaviour', true,
    evaluate("return task.description.includes('return')", { description: 'return the book' }));
check('D2', 'the trap also hits any word containing the substring', 'undefined',
    typeof evaluate('task.description.includes("returned")', { description: 'returned it' }));

// ---------------------------------------------------------------------------------------------
// D3 - 'sort by' is not end-anchored while 'group by' is
// ---------------------------------------------------------------------------------------------
const sorter = locate('src/Query/Filter/Field.ts', '^sort by ${this.fieldNameSingularEscaped()}');
const grouper = locate('src/Query/Filter/Field.ts', '^group by ${this.fieldNameSingularEscaped()}');
console.log(`\nD3  ${sorter.citation}\n    ${sorter.text}`);
console.log(`D3  ${grouper.citation}\n    ${grouper.text}\n`);

check('D3', 'the sort pattern ends without an anchor', true, !sorter.text.includes('$`'));
check('D3', 'the group pattern ends with an anchor', true, grouper.text.includes('$`'));

const sortRegex = new RegExp('^sort by due( reverse)?', 'i');
const groupRegex = new RegExp('^group by due( reverse)?$', 'i');

check('D3', '"sort by due" matches', true, sortRegex.test('sort by due'));
check('D3', '"sort by due nonsense" also matches, trailing text ignored', true,
    sortRegex.test('sort by due nonsense'));
check('D3', '"sort by due reverssse" matches, and is NOT reversed', undefined,
    'sort by due reverssse'.match(sortRegex)[1]);
check('D3', '"group by due nonsense" is correctly rejected', false, groupRegex.test('group by due nonsense'));

// ---------------------------------------------------------------------------------------------
// D5 - the code tolerates one Variation Selector 16 after a signifier emoji
// ---------------------------------------------------------------------------------------------
const VS16 = '\uFE0F';
const NBSP = '\u00A0';
const DUE = '\u{1F4C5}';

const d5 = locate('src/TaskSerializer/DefaultTaskSerializer.ts', "let source = symbols + '\\uFE0F?'");
console.log(`\nD5  ${d5.citation}\n    ${d5.text}\n`);

// Rebuild the due-date field regex exactly as dateFieldRegex()/fieldRegex() compose it.
const dueDateRegex = new RegExp('(?:\u{1F4C5}|\u{1F4C6}|\u{1F5D3})' + VS16 + '?' + ' *' + '(\\d{4}-\\d{2}-\\d{2})$');
const dueValue = (line) => line.match(dueDateRegex)?.[1] ?? null;

check('D5', 'plain due emoji parses', '2025-07-01', dueValue(`- [ ] task ${DUE} 2025-07-01`));
check('D5', 'one trailing VS16 after the emoji still parses', '2025-07-01',
    dueValue(`- [ ] task ${DUE}${VS16} 2025-07-01`));
check('D5', 'two VS16 do not parse', null, dueValue(`- [ ] task ${DUE}${VS16}${VS16} 2025-07-01`));
check('D5', 'a non-breaking space before the value does not parse', null,
    dueValue(`- [ ] task ${DUE}${NBSP}2025-07-01`));
check('D5', 'trailing prose after the value blocks parsing entirely', null,
    dueValue(`- [ ] task ${DUE} 2025-07-01 see note`));

// ---------------------------------------------------------------------------------------------
// N1 - by design, not a defect: 'priority is above low' includes tasks with no priority
// ---------------------------------------------------------------------------------------------
const n1 = locate('src/Task/Priority.ts', 'None = ');
const n1b = locate('src/Query/Filter/PriorityField.ts', "case 'above':");
console.log(`\nN1  ${n1.citation}\n    ${n1.text}`);
console.log(`N1  ${n1b.citation} (comparison is localeCompare on the priority code)\n`);

const priorities = { Highest: '0', High: '1', Medium: '2', None: '3', Low: '4', Lowest: '5' };
const above = (limit) => Object.entries(priorities)
    .filter(([, code]) => code.localeCompare(priorities[limit]) < 0)
    .map(([name]) => name);

check('N1', "'priority is above low' spans Highest..None", ['Highest', 'High', 'Medium', 'None'], above('Low'));
check('N1', "'priority is above none' spans Highest..Medium", ['Highest', 'High', 'Medium'], above('None'));

// ---------------------------------------------------------------------------------------------
console.log(`\n${failures === 0 ? 'All expectations held.' : `${failures} expectation(s) differed.`}`);
process.exit(failures === 0 ? 0 : 1);
