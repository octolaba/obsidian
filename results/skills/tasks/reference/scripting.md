---
source: obsidian-tasks-group/obsidian-tasks
version: 8.3.0
basis: source
---

# Scripting: `filter by`, `sort by` and `group by function`

Part of the [Tasks skill](../SKILL.md); its scope, prerequisites, evidence base and
claim-marking conventions apply here. Paths are relative to
`research/plugins/obsidian-tasks-group/obsidian-tasks` at tag `8.3.0`, commit `e16dbc2`.

## The security gate — check this first

Since 8.0.0 JavaScript in Tasks queries is **disabled by default**
(`src/Config/EnableJsInTasksQueries.ts:4`). While it is off:

- `filter by function` returns the "JavaScript is disabled" help text as a query error
  (`src/Query/Filter/FunctionField.ts:28`);
- `sort by function` and `group by function` throw at parse time
  (`src/Query/Filter/FunctionField.ts:74`, `:224`);
- placeholders that are not plain dotted lookups also throw
  (`src/Scripting/ExpandPlaceholders.ts:88`) — the documented `query.file.*` placeholders,
  including `query.file.property('name')`, still work
  (`src/Scripting/KnownPlaceholderResolver.ts:23`).

Enable at Settings → Tasks → Searches → **Enable custom searches**. The value is stored in
Obsidian's vault-local app storage, not in `data.json`
(`src/Config/EnableJsInTasksQueries.ts:64`), so it is **per device** — the classic "works on my
laptop, not on my phone" report.

Prefer built-in instructions where they exist: they need no opt-in, are explained by `explain`, and
avoid per-task JavaScript evaluation.

## Syntax and evaluation

```
filter by function <expression>
sort by function [reverse] <expression>
group by function [reverse] <expression>
```

The expression is compiled once with `new Function('task', 'query', body)`
(`src/Scripting/Expression.ts:29`) and evaluated per task, with `task` and `query` in scope.
`window.moment` is available as `moment` because it is a global in Obsidian.

**The `return` rule and its trap.** The body is wrapped as
`arg.includes('return') ? arg : 'return ' + arg` (`src/Scripting/Expression.ts:28`). So:

- a single expression needs no `return`;
- a multi-statement body **does** need one — and use `\` line continuations for readability;
- ⚠️ if the expression merely *contains the substring* `return` anywhere — for example
  `task.description.includes('return')` — the wrapper is **not** added, the function returns
  `undefined`, and you get `filtering function must return true or false. This returned
  "undefined"`. Add an explicit `return` in that case.

Errors inside a filter propagate up and abort the whole search with `Search failed`, annotated with
the instruction (`src/Query/Query.ts:391`). Errors inside a grouper are caught and rendered as a
group heading beginning `Error: Failed calculating expression …`
(`src/Query/Filter/FunctionField.ts:317`) — so a broken `group by function` shows its error in the
results rather than replacing them.

### Return-value rules

| Instruction | Requirement |
|---|---|
| `filter by function` | Must return a real `boolean`. Truthy/falsy is rejected: `filtering function must return true or false. This returned "…"` (`src/Query/Filter/FunctionField.ts:267`). Use `&& true \|\| false` or `!!` to coerce. |
| `sort by function` | Any comparable scalar. `undefined`, `NaN` and arrays are rejected (`src/Query/Filter/FunctionField.ts:102`). Mixing types across tasks throws `Unable to compare two different sort key types`. `null` sorts first; `Moment` and `TasksDate` values sort with dates-before-nulls semantics; `true` sorts before `false` (`:131`). |
| `group by function` | String, number, array, `null`, or anything with `toString()`. An array produces one group per element — the task appears in each. `null` produces **no** group heading, and the task is rendered under a blank heading (`:298`, `src/Query/Group/TaskGroupingTree.ts:73`). Non-integer numbers are rounded to 5 decimals and returned as a string, to keep group ordering stable (`:302`). |

Two grouping notes. Headings are rendered as Markdown, so `'**' + x + '**'` works. And group order is
decided by comparing heading **strings** with `localeCompare(…, { numeric: true })`, not by the
underlying value (`src/Query/Group/TaskGroups.ts:102`) — which is why a hidden `%%N%%` prefix is the
way to force a different order. Obsidian hides `%% … %%` on render. The built-in
`task.priorityNameGroupText`, `task.status.typeGroupText` and `TasksDate.category.groupText` exist
precisely to supply such prefixes.

## `task` properties

Complete surface, from `docs/Scripting/Task Properties.md` and the classes it documents.

### Status

| Property | Type | Notes |
|---|---|---|
| `task.isDone` | boolean | `DONE`, `CANCELLED` or `NON_TASK` (`src/Task/Task.ts:537`) |
| `task.status.name` | string | `Unknown` for unregistered symbols |
| `task.status.type` | string | `TODO` `DONE` `IN_PROGRESS` `ON_HOLD` `CANCELLED` `NON_TASK` |
| `task.status.typeGroupText` | string | `%%N%%TYPE`, ordered IN_PROGRESS→EMPTY (`src/Statuses/Status.ts:150`) |
| `task.status.symbol` | string | the character between the brackets |
| `task.status.nextSymbol` | string | what toggling would produce |

### Dates

`task.created`, `task.start`, `task.scheduled`, `task.due`, `task.cancelled`, `task.done`,
`task.happens` — each a `TasksDate` (`src/DateTime/TasksDate.ts:9`). `task.happens` is the earliest
valid of start/scheduled/due (`src/Task/Task.ts:742`). All dates are at local midnight; there is no
time-of-day support.

`TasksDate` members:

| Member | Returns |
|---|---|
| `.moment` | `Moment` or `null` — the escape hatch to full moment.js |
| `.formatAsDate(fallback?)` | `'2023-07-04'` |
| `.formatAsDateAndTime(fallback?)` | `'2023-07-04 00:00'` |
| `.format(fmt, fallback?)` | any moment.js format |
| `.toISOString(keepOffset?)` | ISO string |
| `.category.name` | `Invalid date` \| `Overdue` \| `Today` \| `Future` \| `Undated` |
| `.category.sortOrder` | 0–4 in that order |
| `.category.groupText` | `%%N%% Name` |
| `.fromNow.name` | `in 5 days`, `2 months ago`, … |
| `.fromNow.sortOrder` / `.groupText` | sortable equivalents |

Every formatting method takes a fallback string used when the date is missing; `''` means "produce
no heading".

Because `.moment` may be `null`, guard it: `task.due.moment?.isBefore(moment()) || false` — the
`|| false` is what satisfies the boolean requirement of `filter by function`.

### Dependencies

| Property | Type |
|---|---|
| `task.id` | string, `''` if none |
| `task.dependsOn` | string[] |
| `task.isBlocked(query.allTasks)` | boolean |
| `task.isBlocking(query.allTasks)` | boolean |

### Other task properties

| Property | Type | Notes |
|---|---|---|
| `task.description` | string | trimmed; **includes** tags; signifiers already removed |
| `task.descriptionWithoutTags` | string | |
| `task.priorityNumber` | number | Highest 0 … Lowest 5, `None` = 3 |
| `task.priorityName` | string | `None` is called `Normal` |
| `task.priorityNameGroupText` | string | `%%N%%Name priority` |
| `task.urgency` | number | floating point — see the equality warning below |
| `task.isRecurring` | boolean | false for an invalid rule |
| `task.recurrenceRule` | string | standardised text, `''` if absent or invalid |
| `task.onCompletion` | string | `delete` \| `keep` \| `''` |
| `task.tags` | string[] | with `#`; any global filter tag removed |
| `task.originalMarkdown` | string | the raw line — the only way to see unparsed content |
| `task.lineNumber` | number | **0-based** |
| `task.listMarker` | string | `-` `*` `+` `1.` `1)`; no indentation |

`task.urgency` is a float, so never compare it with `===` against a literal. Use
`task.urgency.toFixed(2) === (1.95).toFixed(2)` for equality, and offset comparisons
(`> 8.9999`) for inequalities (`docs/Queries/Filters.md:1059`).

`task.originalMarkdown` is the workhorse for data-hygiene queries: it is the only property that
shows text the parser failed to interpret.

### File properties

| Property | Type | Notes |
|---|---|---|
| `task.file.path` | string | includes `.md` |
| `task.file.pathWithoutExtension` | string | |
| `task.file.root` | string | first segment + `/`, or `/` |
| `task.file.folder` | string | trailing `/`, or `/` |
| `task.file.filename` | string | includes `.md` |
| `task.file.filenameWithoutExtension` | string | |
| `task.heading` | string \| null | nearest preceding heading |
| `task.hasHeading` | boolean | |
| `task.file.hasProperty('name')` | boolean | true only if present **and** non-null |
| `task.file.property('name')` | any | value, or `null`; arrays have nulls stripped |
| `task.outlinks` | Link[] | links on the task line only |
| `task.file.outlinksInProperties` / `outlinksInBody` / `outlinks` | Link[] | |

Frontmatter key lookup is **case-insensitive**, values are not
(`src/Scripting/TasksFile.ts:259`). `frontmatter.tags` always exists and always carries the `#`
prefix, even when the note has no frontmatter (`src/Scripting/TasksFile.ts:22`).

Beyond the documented surface, `task.file` is a live `TasksFile` and
`task.file.cachedMetadata` exposes Obsidian's raw `CachedMetadata`
(`src/Scripting/TasksFile.ts:109`). Treat anything not in the tables above as undocumented and
liable to change.

## `query` properties

`query` is the `QueryContext.query` object (`src/Scripting/QueryContext.ts:23`):

| Property | Notes |
|---|---|
| `query.file` | a `TasksFile` for the note containing the query — same members as `task.file`, plus `hasProperty`/`property` |
| `query.allTasks` | every task the plugin has indexed, after any global filter, **before** the global query (`docs/Scripting/Query Properties.md:73`) |

`query.allTasks` is a copy of the array taken once per search
(`src/Query/SearchInfo.ts:21`). Scanning it inside a per-task filter is O(n²) — fine for a few
thousand tasks, painful beyond that. There is also `query.searchCache`, a plain object shared for
the duration of one search (`src/Scripting/QueryContext.ts:27`), usable to memoise expensive work
across tasks; it is not covered by the user documentation.

`preset` is exposed to the placeholder layer (`{{preset.name}}`) but not to `by function`
expressions.

## Boolean combinations with `filter by function`

A `filter by function` sub-expression usually ends with `)`, which collides with `(…)` Boolean
delimiters (`docs/Queries/Combining Filters.md:310`). Three fixes:

```text
[filter by function task.tags.includes('#a')] AND [filter by function task.tags.includes('#b')]
(filter by function task.tags.includes('#a'); ) AND (filter by function task.tags.includes('#b'); )
filter by function task.tags.includes('#a') && task.tags.includes('#b')
```

The third is best: one expression, JavaScript operators (`&&`, `||`, `!`), no delimiter problem.

## Recipes worth remembering

```text
# Exactly this folder, no sub-folders
filter by function task.file.folder === query.file.folder

# Multiple status types without Boolean lines
filter by function 'TODO,IN_PROGRESS'.includes(task.status.type)

# Specific status symbols
filter by function 'PCQA'.includes(task.status.symbol)

# Symbols not supported by default settings
filter by function !' -x/'.includes(task.status.symbol)

# Broken recurrence rules
filter by function (!task.isRecurring) && task.originalMarkdown.includes('🔁')

# Due on any Tuesday
filter by function task.due.format('dddd') === 'Tuesday'

# Due today or earlier, null-safe
filter by function task.due.moment?.isSameOrBefore(moment(), 'day') || false

# Fall back to the heading when the task has no due date
filter by function \
    const taskDate = task.due.moment; \
    const now = moment(); \
    return taskDate?.isSame(now, 'day') || ( !taskDate && task.heading?.includes(now.format('YYYY-MM-DD')) ) || false

# Preserve file order, overriding the default sort
sort by function task.lineNumber

# Group by date bucket, in a sensible order
group by function task.due.category.groupText

# Group by description with tags removed
group by function task.descriptionWithoutTags
```

All of the above are drawn from the upstream examples embedded in
`docs/Queries/Filters.md`, `docs/Queries/Grouping.md` and `docs/Queries/Sorting.md`, which are
generated from the project's own approved test output — they are verified behaviour, not
illustrations.
