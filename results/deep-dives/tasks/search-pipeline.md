---
source: obsidian-tasks-group/obsidian-tasks
version: 8.3.0
basis: source
---

# The Tasks search pipeline

## Research question

**How does the Tasks plugin turn a vault of Markdown files and a `tasks` code block into a rendered
list of tasks, and at which points can a task be dropped or a value be misread?**

The pipeline is reconstructed end to end because every practical question about Tasks searches —
"why is this task missing", "why is this date ignored", "why did my sort order not apply" — resolves
to a specific stage of it.

## Scope

- **In scope:** indexing, task-line parsing, query assembly, filter/sort/group/limit execution, and
  the render lifecycle, including the state each stage owns.
- **Out of scope:** the editing surfaces (Create/edit modal, auto-suggest, postpone, status toggling),
  recurrence arithmetic, the public `TasksApi`, i18n, styling, and the settings UI. Each is a separate
  subsystem that consumes the model described here rather than shaping the search result.
- **Deliberately dropped:** performance measurement. `PerformanceTracker` exists
  (`src/lib/PerformanceTracker.ts:71`) but no timings were gathered, so no performance claims are
  made beyond algorithmic shape.
- The complete instruction vocabulary is not repeated here; it lives in the skill's
  [query language reference](../../skills/tasks/reference/query-language.md).

## Source and evidence

Single primary source: the `obsidian-tasks-group/obsidian-tasks` submodule at
`research/plugins/obsidian-tasks-group/obsidian-tasks`, tag `8.3.0`, commit `e16dbc2`. Every
`path:line` citation is relative to that root.

**How claims are marked.** A citation into `src/…` is behaviour read from the implementation. A
citation into `docs/…` is a documented contract. Reasoning I did not read directly or execute is
prefixed `Inference:`. What I could not establish is prefixed `Unverified:`. No empirical claims are
made in this artifact; the reproducible checks live in
[the defect report's harness](query-language-defects/verify.mjs).

## System context

Tasks owns no storage. It is a read-model built on top of Obsidian's own index, and a Markdown
code-block renderer on top of that read-model.

```
                  ┌──────────────────────────────────────────────┐
                  │ Obsidian                                     │
                  │  vault (files)      metadataCache (listItems,│
                  │                      sections, headings,     │
                  │                      frontmatter, links)     │
                  └───────┬──────────────────────┬───────────────┘
                          │ read + events        │ read
                          ▼                      ▼
                  ┌───────────────┐      ┌────────────────────┐
                  │ Cache         │      │ TasksFile          │
                  │ Task[]        │      │ per-file metadata  │
                  └───────┬───────┘      └─────────┬──────────┘
                          │ TasksEvents            │
                          ▼                        ▼
                  ┌──────────────────────────────────────────────┐
                  │ QueryRenderChild  (one per ```tasks block)   │
                  │   Query  →  QueryResult  →  DOM              │
                  └──────────────────────────────────────────────┘
```

Three integration points with Obsidian, all read-only for search purposes:

| Interface | Used for | Citation |
|---|---|---|
| `metadataCache.getFileCache(file).listItems` | discovering candidate task lines | `src/Obsidian/Cache.ts:302` |
| `metadataCache` `resolved` / `changed`, vault `create` / `delete` / `rename` | knowing when to re-index | `src/Obsidian/Cache.ts:146`, `:170` |
| `registerMarkdownCodeBlockProcessor('tasks', …)` | mounting a renderer per block | `src/Renderer/QueryRenderer.ts:45` |

The consequence that shapes everything downstream: **Tasks never scans Markdown for candidates
itself.** If Obsidian's cache does not report a line as a checkbox list item, no query can ever find
it. That single dependency is the root of the callout bug described under
[constraints](#constraints).

## Lifecycle and execution flow

### Stage 1 — indexing

`Cache` holds the whole vault's tasks in one flat array (`src/Obsidian/Cache.ts:47`) and moves
through `Cold → Initializing → Warm` (`src/Obsidian/Cache.ts:26`). Queries render a loading message
until `Warm` (`src/Renderer/QueryResultsRendererBase.ts:45`).

A full load runs on `onLayoutReady`, and again on the first `metadataCache` `resolved` event, because
the plugin cannot know whether it was activated during Obsidian startup or afterwards
(`src/Obsidian/Cache.ts:55`, `:101`). Files are read four at a time
(`src/Obsidian/Cache.ts:24`, `:270`).

Per file, `indexFile` (`src/Obsidian/Cache.ts:285`):

1. skips the file when there is no `CachedMetadata` at all;
2. skips anything not ending in `.md` — Canvas included (`:291`);
3. skips reading the file entirely unless some list item has `task !== undefined` (`:307`);
4. reads via `vault.cachedRead`, and on failure **keeps the previously cached tasks** rather than
   deleting them (`:313`);
5. compares old and new task lists and returns early if nothing changed (`:333`);
6. otherwise replaces that file's tasks and notifies subscribers (`:354`).

Deletion and rename are handled without re-parsing: delete filters the array by path, rename rewrites
each task's location and re-derives any filename-inferred scheduled date
(`src/Obsidian/Cache.ts:184`, `:200`).

### Stage 2 — parsing a line into a `Task`

`FileParser` walks the cached list items in file order (`src/Obsidian/FileParser.ts:68`) and drops a
candidate at any of these points:

| Guard | Effect | Citation |
|---|---|---|
| cached line number ≥ number of lines in file | abandons the rest of the file | `src/Obsidian/FileParser.ts:70` |
| no `SectionCache` contains the line | skips the item | `:94` |
| `listItem.task === undefined` | plain `ListItem`, not a `Task` | `:125` |
| line does not match `taskRegex` | `Task.fromLine` returns null | `src/Task/Task.ts:213` |
| body does not contain the global filter | plain `ListItem`, not a `Task` | `src/Task/Task.ts:219`, `src/Obsidian/FileParser.ts:155` |

The line shape (`src/Task/TaskRegularExpressions.ts:24`, composed from `:6`, `:9`, `:12`, `:15`):

```js
/^([\s\t>]*)([-*+]|[0-9]+[.)]) +\[(.)\] *(.*)/u
```

Indentation may contain `>`, which is how blockquote and callout tasks work. List markers are `-`,
`*`, `+`, `1.`, `1)`. The status is any single character. A trailing block link is stripped before
field parsing (`src/Task/Task.ts:301`). **Only the first physical line is read**
(`docs/Getting Started/Getting Started.md`).

#### The global filter gate

`GlobalFilter.includedIn` is a raw substring test (`src/Config/GlobalFilter.ts:52`), applied before
any other parsing for performance (`src/Task/Task.ts:219`). Contract consequences: filter `#task` is
satisfied by `#tasks`; the filter need not be a tag; a tag filter is removed from `task.tags`
(`src/Task/Task.ts:266`) and from `description` searches
(`src/Query/Filter/DescriptionField.ts:24`), so searching for it finds nothing
(`docs/Getting Started/Tags.md:94`).

#### Signifiers are read backwards from the end of the line

The defining property of the parser. Every field pattern is anchored at `$`
(`src/TaskSerializer/DefaultTaskSerializer.ts:68`):

```js
function fieldRegex(symbols, valueRegexString) {
    let source = symbols + '\uFE0F?';
    if (valueRegexString !== '') source += ' *' + valueRegexString;
    source += '$';                       // matched and removed from the END until none are left
    return new RegExp(source);
}
```

`deserialize` loops, each pass trying every pattern against the current end of the line and stripping
what matches, up to 20 passes (`src/TaskSerializer/DefaultTaskSerializer.ts:327`). Trailing tags are
stripped by the same loop, held aside, and re-appended to the description afterwards (`:355`, `:386`).
The recurrence rule is captured but parsed only after the loop, because it needs a reference date
(`:376`).

**Therefore the moment the scan meets text that is neither a signifier nor a tag, it stops, and every
signifier to the left of it remains literal text in the description.** Upstream states the same rule
and tracks it as a limitation (`docs/Editing/Auto-Suggest.md`, issue #1505). This is the largest
single cause of tasks that look dated but are not.

Tags may be interleaved with signifiers freely; nothing else may.

#### Field vocabulary per format

Emoji format (`src/TaskSerializer/DefaultTaskSerializer.ts:84`): priority `🔺 ⏫ 🔼 🔽 ⏬`;
start `🛫`; created `➕`; scheduled `⏳` or `⌛`; due `📅`, `📆` or `🗓`; done `✅`; cancelled `❌`;
recurrence `🔁`; on-completion `🏁`; depends-on `⛔`; id `🆔`. Dates are **only** `YYYY-MM-DD`
(`docs/Getting Started/Dates.md`). Separators use ordinary spaces, so a non-breaking space breaks
parsing (issue #606). One optional `U+FE0F` after the symbol is tolerated (`:70`).

Dataview format (`src/TaskSerializer/DataviewTaskSerializer.ts:62`) replaces the symbols with inline
fields — `start::`, `created::`, `scheduled::`, `due::`, `completion::`, `cancelled::`, `repeat::`,
`onCompletion::`, `id::`, `dependsOn::`, `priority:: high` — each wrapped in `[…]` or `(…)` with
matched brackets (`:16`). The done-date key is `completion` while the query instruction remains
`done`. Fields are read only from task lines, only at the end, never from frontmatter
(`docs/Reference/Task Formats/Dataview Format.md`).

#### Derived values

**Statuses.** The bracket character is looked up in the registry; an unregistered symbol becomes a
synthetic status named `Unknown` with type `TODO` (`src/Statuses/StatusRegistry.ts:119`,
`src/Statuses/Status.ts:233`). The default registry contains only `' '`, `x`, `/`, `-`
(`src/Config/StatusSettings.ts:21`). `isDone` covers `DONE`, `CANCELLED` and `NON_TASK`
(`src/Task/Task.ts:537`), while `Status.isCompleted()` covers only `DONE` and governs recurrence
(`src/Statuses/Status.ts:254`).

**Tags.** `/(^|\s)#[^ !@#$%^&*(),.?":{}|<>]+/g` (`src/Task/TaskRegularExpressions.ts:67`) — looser
than Obsidian's own syntax, so `#1234` is a tag here and `#12.34` becomes `#12`
(`docs/Getting Started/Tags.md:47`, issue #929).

**Filename date fallback.** Off by default. When enabled, and the file matches a configured folder,
and the task has no start, scheduled or due date, the date in the basename becomes an *inferred*
scheduled date (`src/DateTime/DateFallback.ts:15`, `:72`). Inferred dates are flagged and never
written back to the line (`src/TaskSerializer/DefaultTaskSerializer.ts:213`), so a task can satisfy
`has scheduled date` while showing no `⏳`.

**Location and hierarchy.** `path` includes `.md`; `filename` drops it
(`src/Task/ListItem.ts:220`); `folder` and `root` end in `/` and are `/` at the vault root
(`src/Scripting/TasksFile.ts:172`, `:186`); `precedingHeader` is the nearest heading above at any
level (`src/Obsidian/Cache.ts:426`). Parent/child links come from `listItem.parent`
(`src/Obsidian/FileParser.ts:140`) and drive tree rendering.

### Stage 3 — query assembly

The query that runs is **not** the code block. `getQueryForQueryRenderer`
(`src/Query/QueryRendererHelper.ts:78`):

```
queryFileDefaults = QueryFileDefaults().query(tasksFile)     // from the note's frontmatter
blockQuery        = queryFileDefaults.append(new Query(source, tasksFile))

if (blockQuery.ignoreGlobalQuery)  → blockQuery
else                               → globalQuery.append(blockQuery)
```

`append` concatenates the two **sources** and re-parses the result; appending to or from an empty
source returns the other query untouched (`src/Query/Query.ts:273`). The effective source is
therefore, in order: global query, query-file-defaults instructions, block source.

Contract consequences:

- Single-valued instructions — `limit`, `short`/`full`, each `hide`/`show`, `view` — are last-wins, so
  a block overrides the global query.
- Filters accumulate. A filter set in the global query cannot be removed, only discarded wholesale
  with `ignore global query` (`docs/Queries/Global Query.md`, issue #2074).
- `ignore global query` is honoured from the block or from query file defaults
  (`src/Query/QueryRendererHelper.ts:50`), and is stripped from a global query that contains it
  (`src/Query/Query.ts:107`).

**Query file defaults** convert `TQ_`-prefixed frontmatter properties of the query's own note into
instructions (`src/Query/QueryFileDefaults.ts:51`). A `show`/`hide` property emits its instruction
only when the property is present at all (`:206`). `TQ_extra_instructions` injects arbitrary text and
is a common invisible source of filters.

**Line continuations** are applied first: a trailing `\` joins the next line, collapsing the
backslash and surrounding whitespace to one space; `\\` means a literal backslash
(`src/Query/Scanner.ts:19`, `src/Query/Query.ts:73`).

**Placeholders** are expanded with Mustache, repeatedly, until stable or 10 iterations
(`src/Query/Query.ts:204`); a multi-line substitution becomes several instructions (`:228`). Known
placeholders resolve without JavaScript (`src/Scripting/KnownPlaceholderResolver.ts:23`); a plain
dotted lookup goes to Mustache; anything else needs the JavaScript opt-in
(`src/Scripting/ExpandPlaceholders.ts:88`).

**Parsing stops at the first error**: the constructor returns as soon as `error` is set
(`src/Query/Query.ts:84`), so later lines are never examined and the block renders only the message
(`src/Renderer/QueryResultsRendererBase.ts:45`).

### Stage 4 — search execution

`Query.applyQueryToTasks` (`src/Query/Query.ts:360`), in this fixed order:

1. build `SearchInfo` with a copy of all vault tasks — the basis for `is blocked`, `is blocking` and
   `query.allTasks` (`src/Query/SearchInfo.ts:19`);
2. **filter** — `filters.forEach(f => tasks = tasks.filter(...))`, a logical AND across lines, each
   narrowing the previous result (`:369`);
3. **sort** — user sorters then the five defaults (`:376`);
4. **limit** — `slice(0, limit)` (`:377`);
5. **group** — build the group tree from the already-limited list (`:384`);
6. **limit groups** — per-group truncation (`:386`);
7. record the pre-limit count, which produces `N of M tasks` (`src/Query/QueryResult.ts:37`).

Because limiting precedes grouping, `limit 10` yields ten tasks spread across whatever groups they
fall into. Grouping never changes membership (`docs/Queries/Grouping.md:1051`). An exception inside a
filter aborts the search and renders `Search failed` with the offending instruction
(`src/Query/Query.ts:391`).

### Stage 5 — rendering and re-render triggers

Two modes (`src/Renderer/QueryResultsRendererBase.ts:119`):

- **flat** — the default, `hideTree = true` (`src/Layout/QueryLayoutOptions.ts:14`): matching tasks
  only, in sort order;
- **tree** — `show tree`: matching tasks in sort order, each followed by **all** of its children,
  tasks and plain list items alike, in file order, whether or not they match
  (`:155`); a child that matched independently is drawn once, under its parent (`:197`).

Re-render triggers, and the reasons results can look stale:

| Trigger | Note | Citation |
|---|---|---|
| cache update | debounced 100 ms in `Cache`, 300 ms in the renderer | `src/Obsidian/Cache.ts:49`, `src/Renderer/QueryRenderer.ts:155` |
| block becomes visible | an off-screen block records that the cache changed and redraws only when scrolled into view | `src/Renderer/QueryRenderer.ts:200` |
| just after midnight | the `Query` is rebuilt so relative dates roll over; a machine asleep at midnight keeps yesterday's dates (issue #1289) | `src/Renderer/QueryRenderer.ts:275` |
| edit to the query's own note | only a changed path or changed frontmatter re-runs the query | `src/Renderer/QueryRenderer.ts:230` |

## State and data flow

| State | Owner | Lifetime | Notes |
|---|---|---|---|
| `Task[]` for the whole vault | `Cache` | plugin session | single flat array; no per-file index |
| `State` (Cold/Initializing/Warm) | `Cache` | plugin session | gates rendering |
| parsed `Query` | `QueryRenderChild` | per block, rebuilt at midnight and on frontmatter change | holds filters, sorters, groupers, layout, limits |
| `SearchInfo` | per search | one execution | copy of `Task[]` plus the query's `TasksFile` |
| `QueryContext.searchCache` | per search | one execution | a shared plain object available to `by function` expressions; not covered by user documentation |
| settings | `Config/Settings` module singleton | plugin session | `data.json`; includes global filter/query, format, presets, debug switches |
| JavaScript opt-in | Obsidian vault-local app storage | per device | deliberately **not** in `data.json` (`src/Config/EnableJsInTasksQueries.ts:64`) |

Concurrency is guarded by a single mutex around all cache mutation (`src/Obsidian/Cache.ts:88`).

*Inference:* because the task array is flat and unindexed, every filter is a full scan of the vault's
tasks, and `query.allTasks` scans inside a per-task filter make it quadratic. No measurements were
taken.

## Subsystem mechanics

### The Boolean engine

`BooleanField` (`src/Query/Filter/BooleanField.ts`) in four steps:

1. **detect the delimiter pair** from the first and last non-operator characters
   (`src/Query/Filter/BooleanDelimiters.ts:51`) — only `(…)`, `[…]`, `{…}`, `"…"`, no mixing (`:72`).
   Because only the outermost characters are inspected, mixing inside the line fails later with a
   different message;
2. **preprocess** into a simplified line plus a placeholder map `f1`, `f2`, …, inserting any missing
   spaces around operators and normalising delimiters (`src/Query/Filter/BooleanPreprocessor.ts:14`,
   `:93`);
3. **parse** the simplified line into postfix form with `boon-js`, and parse each sub-expression as an
   ordinary filter — recursively, since a sub-expression may itself be Boolean (`:94`);
4. **evaluate** per task on a boolean stack, with no short-circuiting (`:150`).

Operators are `AND`, `OR`, `NOT`, `AND NOT`, `OR NOT`, `XOR` (`:31`), precedence
`NOT > XOR > AND > OR` (`docs/Queries/Combining Filters.md:77`). `XOR` is a two-argument operator
applied left to right, so a chain does not mean "exactly one".

The acknowledged limitation is in the code itself
(`src/Query/Filter/BooleanPreprocessor.ts:20`): spaces and `)` at the end of a sub-expression are
taken as Boolean structure, not filter text. On failure the error prints the simplified line and each
sub-expression's status (`:263`), which is the fastest way to see where the split went wrong.

### The date engine

`DateParser.parseDateRange` tries three parsers and takes the first valid range
(`src/DateTime/DateParser.ts:23`):

1. **relative range** — `/(last|this|next) (week|month|quarter|year)/` (`:63`), ISO weeks
   (`src/DateTime/DateRange.ts:37`). **The pattern is unanchored**; see
   [defect D1](query-language-defects/README.md#d1--relative-date-ranges-match-inside-longer-words);
2. **numbered range** — `YYYY`, `YYYY-Qq`, `YYYY-MM`, `YYYY-Www` (`:86`);
3. **absolute range via chrono** — two found dates become start and end, otherwise start = end
   (`:44`).

If all three fail, `DateField` re-parses the whole remainder including the keyword as a single date
(`src/Query/Filter/DateField.ts:80`), which is what keeps `due in two weeks` working.

Keyword semantics (`src/Query/Filter/DateField.ts:108`) resolve against the range: `before` uses the
start, `after` the end, `on or before` the end, `on or after` the start, and the default form is
inclusive between both. Missing values return `filterResultIfFieldMissing()`, which is `true` **only**
for `starts` (`src/Query/Filter/StartDateField.ts:17`).

All dates normalise to local `startOf('day')` (`src/DateTime/DateParser.ts:5`); `DateRange` reorders reversed pairs
(`src/DateTime/DateRange.ts:16`); chrono runs with `forwardDate: false`, so a bare weekday resolves to
the closest one, possibly in the past. Date filters containing unexpanded template text are rejected
outright to catch Templater placeholders that never rendered (`src/Query/Filter/DateField.ts:51`).

### Sorting

`Sort.by` composes comparators — user sorters in query order, then five defaults that cannot be
disabled (`src/Query/Sort/Sort.ts:13`, `:25`):

```
sort by status.type      # IN_PROGRESS, TODO, ON_HOLD, DONE, CANCELLED, NON_TASK
sort by urgency
sort by due
sort by priority
sort by path
```

The composite returns on the first non-zero result (`:35`). Status type leads deliberately, so
actionable tasks come first in unfiltered searches; the order is carried by hidden `%%N%%` prefixes in
`typeGroupText` (`src/Statuses/Status.ts:150`).

Urgency is computed (`src/Task/Urgency.ts:12`): due-date proximity ×12 over a 21-day window, +5 when
scheduled today or earlier, −3 when the start date is in the future, plus a priority term (Highest
×1.5, High ×1.0, Medium ×0.65, None ×0.325, Low 0, Lowest ×−0.3, all ×6). An undated, unprioritised
task therefore scores 1.95, and every urgency-sorted list reorders itself daily.

### Grouping

`TaskGroupingTree` builds one level per `group by` line
(`src/Query/Group/TaskGroupingTree.ts:59`). A grouper returns a **list** of names, so a task can land
in several sibling groups — `group by tags` multiplies multi-tag tasks. An empty list gets a synthetic
`''` group so nothing is lost (`:73`).

Groups are ordered by comparing heading **strings** level by level with
`localeCompare(…, { numeric: true })`, negated at levels marked `reverse`
(`src/Query/Group/TaskGroups.ts:102`). There is no value-aware ordering — hence the `%%N%%` prefixes,
which Obsidian hides on render. `reverse` reorders headings only; task order inside a group still
comes from `sort by` (`docs/Queries/Grouping.md:1023`). `totalTasksCount` counts unique tasks, so with
`group by tags` the visible rows can exceed the reported count (`:71`).

## Contracts

Behaviour other plugins, themes and user queries depend on:

- **Instruction language.** Case-insensitive except Boolean operators, regex patterns and flags, and
  JavaScript (`docs/Queries/About Queries.md:103`). Filters are resolved by trying field classes in a
  fixed order and taking the first match (`src/Query/FilterParser.ts:41`).
- **Query composition order.** Global query, then query file defaults, then block; later single-valued
  instructions win; filters accumulate (`src/Query/QueryRendererHelper.ts:78`).
- **Order of operations.** Filter, sort, limit, group, limit groups — documented as a guarantee that
  grouping cannot change which tasks appear (`docs/Queries/Grouping.md:1051`).
- **`explain` output shape.** Global filter note, global query, query file defaults, then the block,
  each with filters, groups, sorters, layout, limits (`src/Query/QueryRendererHelper.ts:30`,
  `src/Query/Explain/Explainer.ts:22`). Users script against this text; it is stable enough that
  upstream snapshot-tests it.
- **Scripting surface.** `task.*` and `query.*` as documented in `docs/Scripting/Task Properties.md`
  and `docs/Scripting/Query Properties.md`. `query.searchCache` exists but is undocumented, so it is
  not a contract.
- **Task line formats.** Emoji and Dataview symbol sets, with dates strictly `YYYY-MM-DD`.

## Constraints

| Constraint | Consequence |
|---|---|
| `minAppVersion` 1.8.7, `isDesktopOnly` false (`manifest.json`) | must work on mobile; iOS regex support drove removal of the `u` flag from field patterns (`src/TaskSerializer/DefaultTaskSerializer.ts:77`) and makes lookahead unsafe (`docs/Queries/Regular Expressions.md`) |
| Obsidian's metadata cache is the only source of candidates | a wrong cache silently hides tasks; the 1.6.0–1.6.3 titled-callout bug required users to rebuild the vault cache per device (`docs/Support and Help/Missing tasks in callouts with some Obsidian 1.6.x versions.md`) |
| Single flat task array, no secondary index | every filter is a full scan |
| Dates carry no time | no time-of-day scheduling (`docs/Getting Started/Dates.md`) |
| Only the first line of a list item is parsed | multi-line descriptions unsupported (issue #2061) |
| JavaScript disabled by default since 8.0.0 | `by function` instructions and non-plain placeholders fail closed, per device (`src/Config/EnableJsInTasksQueries.ts:4`) |
| Regex patterns ≤ 500 chars, no nested quantifiers | ReDoS defence added in 8.3.0 (`src/lib/RegExpTools.ts:17`) |

## Architectural trade-offs

- **Delegating discovery to Obsidian's cache** buys correctness with Obsidian's own parser and avoids
  a second Markdown scanner, at the cost of inheriting its bugs with no recourse — the plugin cannot
  detect or repair a wrong cache, only log a symptom (`src/Obsidian/FileParser.ts:82`).
- **Parsing signifiers backwards from the end of the line** is what makes parsing a bounded, fast
  loop over a handful of anchored patterns instead of a general grammar. The price is that free text
  after a signifier silently invalidates everything to its left. Upstream chose speed and accepted
  the failure mode explicitly (issue #1505; the "For performance reasons, Tasks is stricter … than
  some users expect" note in `docs/How To/Find tasks with invalid data.md:9`).
- **Global filter checked before parsing** is the same trade: one substring test rejects most lines
  cheaply, at the cost of substring surprises and of tasks silently demoted to list items.
- **Five always-appended default sorters** give sensible output for a bare ```` ```tasks ```` block,
  at the cost of a documented inability to turn them off.
- **Group ordering by heading string** keeps the grouping code independent of field types, and forces
  the `%%N%%` hidden-prefix convention to recover natural ordering — a workaround visible in the
  scripting surface (`task.priorityNameGroupText`, `task.status.typeGroupText`,
  `TasksDate.category.groupText`).
- **Limit before group** guarantees that grouping never changes membership, at the cost of the
  frequently-expected "N per group" reading, which needs `limit groups` instead.
- **Fail-closed JavaScript** trades a breaking change in 8.0.0 for removing an arbitrary
  code-execution path from synced Markdown.

## Conflicts between documentation and implementation

Recorded rather than resolved; the consequence of each is stated so a reader can choose.

1. **Placeholders in comments.** `docs/Scripting/Placeholders.md:142` lists "complains about any
   unrecognised placeholders in comments" as a known limitation. `src/Query/Query.ts:186` returns
   comment statements unexpanded. An earlier guard at `:176` still errors when no query file was
   supplied, which never happens in the plugin (`src/Renderer/QueryRenderer.ts:76`). Consequence: the
   documented limitation does not apply to users; it does apply to code constructing a `Query`
   without a file. See
   [D4](query-language-defects/README.md#d4--documentation-says-placeholders-in-comments-are-reported-the-code-skips-them).
2. **Variation selectors.** `docs/Reference/Task Formats/Tasks Emoji Format.md` says they are not
   understood; `src/TaskSerializer/DefaultTaskSerializer.ts:70` tolerates one `U+FE0F` directly after
   the symbol. Consequence: exactly one selector in exactly one position works; the documentation is
   correct about every other case. See
   [D5](query-language-defects/README.md#d5--documentation-says-variation-selectors-are-not-understood-the-code-allows-one).

## Limitations and open questions

- Reconstructed by reading the implementation. **Nothing here was executed inside Obsidian**, and the
  upstream jest suite was not run — that needs a dependency install in the submodule, avoided to keep
  the pin clean. Claims about runtime behaviour follow from the code paths cited.
- No performance data. The "full scan per filter" and "quadratic with `query.allTasks`" statements are
  algorithmic inference, not measurements.
- Editing paths are out of scope, so how a task is *written back* — field ordering, recurrence
  creation, `onCompletion` — is not covered, even though it determines whether a task remains
  parseable.
- *Unverified:* whether `metadataCache` guarantees `listItems` order matches file order. `FileParser`
  relies on it for section tracking and parent resolution (`src/Obsidian/FileParser.ts:87`, `:140`).
- Open: how much of the 300 ms render debounce plus the visibility observer is felt in large vaults
  with many blocks per note.

## Related artifacts

- [Defects and divergences in the Tasks query language](query-language-defects/README.md) —
  the failure modes of the mechanisms described above, with a reproduction harness.
- [Tasks skill](../../skills/tasks/SKILL.md) — the operational counterpart: how to write and debug
  queries using this model.

**On the overlap between the two.** The skill deliberately restates the operational subset of three
mechanisms described here — the backwards signifier scan, how a date argument is resolved, and the
Boolean sharp edges — because the skill is designed to be extracted into another project as a
self-contained directory, and a rule needed to act cannot live behind a link that the copy will not
have. This artifact remains the authoritative treatment: it adds the lifecycle, state ownership,
contracts, constraints and trade-offs that the skill omits. When a mechanism changes upstream, update
this artifact first, then the skill's restatement of it.
