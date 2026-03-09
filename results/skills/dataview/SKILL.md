---
name: dataview
description: Deep expertise in the obsidian-dataview plugin — read a DQL query and say exactly what it returns, write one from a stated intent, debug wrong or missing rows, and find slow queries in a vault. Reach for this for anything inside a `dataview` / `dataviewjs` code block, for inline `` `= …` `` queries, for "why is this note/task not in my table?", and for "why is Dataview making Obsidian slow?".
source: blacksmithgu/obsidian-dataview
version: 0.5.70
basis: source
---

# Dataview: query language, data model, debugging and cost

## What this skill answers

**Given a `dataview` block, say exactly what it returns; given a stated intent, write the block;
given wrong results, find the cause; given a slow vault, find the queries responsible.** The last
two get the most machinery, because a Dataview query fails silently in more ways than it fails
loudly, and because its cost model is invisible from the query text.

## Scope

- **In scope:** the Dataview Query Language (DQL) — grammar, evaluation, sources, functions; the
  data model that decides what a query can even see; diagnosing wrong, missing and duplicated rows;
  the query cost model and how to rewrite an expensive query; the DataviewJS API surface.
- **Out of scope:** authoring metadata as a workflow (what to annotate and why), CSS and theming,
  the Obsidian plugin API in general, and other plugins that read Dataview fields (the Tasks plugin
  has its own separate query language — do not mix the two vocabularies).
- **Not covered:** Datacore (the successor project), and any Dataview version above the one below.

## Prerequisites

Before answering anything version- or environment-sensitive, establish:

1. **the plugin version** — Settings → Community plugins → Dataview, or `dataview.version.current`
   in DataviewJS. Claims here are read from `0.5.70`.
2. **whether the index has finished building** — Dataview logs `Dataview: all N files have been
   indexed in Ts` to the developer console on startup (`src/data-index/index.ts:153`). Queries run
   before that returns partial results.
3. **which of DataviewJS / inline queries are enabled** — all three JS-related toggles are **off by
   default** (`src/settings.ts:96`). A disabled `dataviewjs` block renders
   `Dataview JS queries are disabled…` (`src/ui/views/js-view.ts:19`) and a disabled inline JS query
   renders `(disabled; enable in settings)` (`src/ui/views/js-view.ts:58`).
4. **the query-affecting settings** — `renderNullAs` (default `\-`), `warnOnEmptyResult`,
   `refreshInterval` (default 2500 ms), `defaultDateFormat`, `tableIdColumnName`
   (`src/settings.ts:38`).
5. **the vault size and shape** — number of notes, and whether notes carry many list items. Both
   drive the cost model far more than the query text does.

## Source, evidence, and how claims are marked

Verified against the `blacksmithgu/obsidian-dataview` submodule at
`research/plugins/blacksmithgu/obsidian-dataview`, tag `0.5.70`, commit `77ab745`. All `path:line`
citations are relative to that root; there is no second source.

- A citation into `src/…` is **behaviour read from the implementation**.
- A citation into `docs/…` is a **documented contract**.
- `Measured:` marks a number produced by executing the pinned code (method in
  [reference/performance.md](reference/performance.md#2-how-these-numbers-were-produced)).
- Anything concluded rather than read is prefixed `Inference:`; anything unestablished,
  `Unverified:`. [Writing a query from an intent](#writing-a-query-from-an-intent) and
  [How to consult on this](#how-to-consult-on-this) are **recommendation**.
- Where documentation and implementation disagree, both are recorded with the consequence. See
  [Known conflicts](#known-conflicts-limitations-and-open-questions).

**Version boundaries.** The pin is tag `0.5.70`, but the tree still self-identifies as `0.5.68`
(`manifest.json:4`, `CHANGELOG.md:1`) — the release script bumps those at build time, and the three
commits from `0.5.68` to `0.5.70` only touch inline-field rendering and release scripts. So every
claim here holds for `0.5.68`–`0.5.70` alike. Older boundaries that change query results: `hash()`
and `slice()` arrived in 0.5.65, `unique()` / `display()` / `firstvalue()` in 0.5.68, the result
count toggle in 0.5.52 (`CHANGELOG.md`, `docs/docs/resources/faq.md:70`).

## The mental model in one page

A `dataview` block is **not** a database query and there is **no optimizer**. It is a *pipeline of
operations applied in written order* to rows that were materialized fresh from an in-memory index.

```
Obsidian metadata cache: frontmatter, tags, links, sections, listItems
        │   ← if Obsidian's cache doesn't see it, Dataview never sees it
        ▼
import worker → parsePage()                      (src/data-import/markdown-file.ts:13)
        │   frontmatter values RE-TYPED (dates, durations, links)
        │   `key:: value` scanned line by line; list items built and typed
        │   every key also gets a canonical alias: "Due Date" → "due-date"
        ▼
FullIndex.pages : Map<path, PageMetadata>        (src/data-index/index.ts:30)
   + tags / etags / links / prefix / csv / starred indices
        │
        │   ══ everything below re-runs for EVERY visible query on EVERY index revision ══
        ▼
FROM  →  matchingSourcePaths()                   (src/data-index/resolver.ts:12)
        │   no FROM  ⇒  Sources.folder("")  ⇒  the whole vault (src/query/parse.ts:205)
        ▼
page.serialize(index)  — ONE FRESH OBJECT PER PAGE PER QUERY   (src/data-model/markdown.ts:122)
        │   builds file.*, deep-copies frontmatter, serializes every list item
        ▼
rows: { id, data }[]
        ▼
operations, in the order you wrote them        (src/query/engine.ts:50)
   WHERE | SORT | LIMIT | GROUP BY | FLATTEN     — repeatable, no canonical order
        │   a row whose expression THROWS is silently dropped
        ▼
extract: TABLE columns / LIST format / CALENDAR date   (src/query/engine.ts:224)
        │   TASK skips this step entirely
        ▼
render (preact); TASK re-nests children under matching parents (src/ui/views/task-view.tsx:295)
```

Six consequences carry most of the weight:

1. **Clause order is execution order.** `LIMIT 5` then `SORT` sorts five rows; `SORT` then `LIMIT 5`
   sorts everything (`docs/docs/queries/data-commands.md:131`). Dataview will not reorder for you.
2. **A row can vanish because its expression errored, not because a filter rejected it.**
   `WHERE`, `SORT`, `GROUP BY` and `FLATTEN` each push the error onto a diagnostics list and drop
   the row (`src/query/engine.ts:61`, `:76`, `:124`, `:176`). Only when *every* row fails does the
   block show an error (`src/query/engine.ts:195`).
3. **`null` is the smallest value in the universe and compares against everything.** A missing field
   is `null` (`src/expression/context.ts:64`), and `null < x` is true for every non-null `x`
   (`src/data-model/value.ts:176`). So `WHERE due < date(today)` matches every page that has no
   `due` at all. This is the single most common wrong-results bug.
4. **Types are decided at index time, not at query time.** `2021-01-01` in frontmatter is a date;
   in a *query expression* the same characters are the arithmetic `2021 - 1 - 1 = 2019`.
5. **Many functions vectorize.** Passing an array where a scalar was expected silently returns an
   array, and every non-empty array is truthy (`src/expression/functions.ts:109`,
   `src/data-model/value.ts:294`). A `WHERE` that gets an array back is always true.
6. **Cost is dominated by two things you cannot see in the output**: how many pages `FROM` selects
   (each is serialized from scratch, every run) and whether you `FLATTEN` (each output row is a deep
   copy of the whole input row).

## Always do these three things first

Dataview has **no `explain`**. Build the instruments yourself.

**1. Ask what Dataview actually holds**, not what the file looks like. Run this next to the note in
question — it is the highest-yield diagnostic in the plugin:

````text
```dataview
TABLE WITHOUT ID file.link, typeof(due) AS "type", due, string(due) AS "as text"
WHERE file.name = "The Note That Is Missing"
```
````

`typeof(x) = "null"` means the field was never parsed under that name — a data problem, not a query
problem. Add `file.frontmatter` as a column to see the raw, un-retyped YAML
(`src/data-model/markdown.ts:145`).

**2. Bisect.** Strip the block down to `TABLE file.link FROM <your source>`, confirm the note
appears, then add clauses back one at a time. This separates *source* problems from *filter*
problems in one step.

**3. Count.** `TABLE` and `TASK` print the result count in the first header cell
(`src/ui/views/task-view.tsx:167`). A count that changes when you add a clause that "shouldn't"
change anything means rows are being dropped by errors.

## Fast triage: a note or task is missing from the results

Run this ladder in order. Stop at the first step that reproduces the problem.

| # | Probe | If it reproduces |
|---|-------|------------------|
| 1 | Is the file `.md` or `.markdown`? | Nothing else is indexed (`src/data-index/index.ts:296`). |
| 2 | Remove `FROM` entirely | `FROM` is a *path* filter, evaluated before anything else. Trailing slashes (`"Folder/"`) match nothing; `outgoing()` silently ignores unresolved links (`src/data-index/resolver.ts:36`). |
| 3 | Replace the whole `WHERE` with `WHERE true` | The row exists; a filter is at fault → go to 5. |
| 4 | Is there a `FLATTEN`? | `FLATTEN` over an **empty array deletes the row** (`src/query/engine.ts:180`). `FLATTEN file.tasks` silently removes every note with no tasks. |
| 5 | `TABLE typeof(x), x WHERE file.name = "…"` | `null` ⇒ the field is not there under that name. Check capitalisation, the canonical alias (`due-date`), and whether the value ever parsed. |
| 6 | Is the comparison cross-type? | `"5" = 5` is **false**; different types are never equal and sort by *type name* (`src/data-model/value.ts:188`). |
| 7 | Does the expression do arithmetic on a possibly-missing field? | `n + 1` where `n` is missing throws `No implementation found for 'number + null'` and the row is dropped without a message. |
| 8 | Is the field an array when you expected a scalar? | A key repeated in one note becomes a list (`src/data-import/markdown-file.ts:402`). |

The full cause catalogue, indexed by symptom, is in
[reference/debugging.md](reference/debugging.md). Read it before speculating.

## Writing a query from an intent

Seven decisions, in this order. Skipping any of them is how wrong queries get written.

**D1 — Level.** `LIST`, `TABLE`, `CALENDAR` operate on **pages**; `TASK` operates on **tasks**
(`docs/docs/queries/query-types.md:5`). In a `TASK` query, `FROM` still selects *pages* and then
every task in them is collected (`src/query/engine.ts:394`) — so `TASK FROM #shopping` returns all
tasks of every note that mentions `#shopping` anywhere. To filter *tasks* by tag, use
`WHERE contains(tags, "#shopping")`.

**D2 — Source.** Always write a `FROM` unless you truly mean the whole vault. It is both the
correctness filter and the single biggest lever on cost. `FROM #tag` includes subtags and is
case-**in**sensitive (`src/data-index/index.ts:545`); `FROM "folder"` includes subfolders, needs the
full vault path, and must not end in `/`.

**D3 — Missing-value policy, decided explicitly.** For every comparison, say out loud what should
happen to rows where the field is absent. `<` and `<=` include them; `>` and `>=` exclude them;
`!=` includes them. Guard deliberately:

| Intent | Write |
|---|---|
| has the field at all | `WHERE due` (truthiness) |
| has it **and** it is a date | `WHERE typeof(due) = "date"` (`docs/docs/reference/expressions.md:130`) |
| overdue, undated excluded | `WHERE due AND due < date(today)` |
| overdue **or** undated | `WHERE !due OR due < date(today)` |

**D4 — Types.** Compare like with like. `date(…)` / `dur(…)` for literals, `typeof()` to check,
`string()` / `number()` to coerce. Never compare a date field to a bare `2024-01-01`.

**D5 — Cardinality.** Decide whether the field holds one value or many, and whether you want
per-row or per-value semantics. `contains()` for "any of"; `FLATTEN` for "one output row per value";
`filter()`/`map()`/`any()`/`all()` to stay at one row per page. Remember that passing an array into a
vectorized function returns an array, which is truthy.

**D6 — Clause order (correctness *and* cost).** Cheap and selective first:

```
FROM      narrow to the smallest path set that can possibly contain the answer
WHERE     cheap scalar predicates first, regex / link-resolution last
FLATTEN   as late as possible, and never before a WHERE that would have removed the row
SORT      after filtering, not before
GROUP BY  after filtering
LIMIT     before a FLATTEN when you only need a sample; after SORT when you need the top N
```

**D7 — Output shape.** `TABLE a, b AS "Header"`; `LIST <one expression>`; `WITHOUT ID` drops the
first column / bullet link. **After `GROUP BY` the row is a different object**: only `key`, `rows`
and the group name exist (`src/query/engine.ts:143`). Bare field references become `null`; use
`rows.field` swizzling (`docs/docs/queries/data-commands.md:73`).

### Intent → DQL

| Intent phrase | Instruction |
|---|---|
| "notes in this folder and below" | `FROM "Projects"` |
| "tagged X, including sub-tags" | `FROM #x` |
| "tagged exactly X" | `WHERE contains(file.etags, "#x")` |
| "notes linking to this one" | `FROM [[]]` |
| "notes this one links to" | `FROM outgoing([[]])` |
| "in folder A but not B" | `FROM "A" and -"B"` |
| "has a due date" | `WHERE due` |
| "overdue" | `WHERE due AND due < date(today)` |
| "due in the next 7 days" | `WHERE due AND due >= date(today) AND due <= date(today) + dur(7 days)` |
| "modified in the last day" | `WHERE file.mtime >= date(today) - dur(1 day)` |
| "created this month" | `WHERE file.cday >= date(som)` |
| "field is one of several values" | `WHERE contains(list("a", "b"), status)` |
| "text contains, case-insensitively" | `WHERE icontains(file.name, "wip")` |
| "whole word only" | `WHERE containsword(text, "cat")` |
| "regex, unanchored" | `WHERE regextest("^\\d{4}", file.name)` |
| "one row per tag" | `FLATTEN file.etags AS tag` |
| "one row per task" | `FLATTEN file.tasks AS t` (drops notes with no tasks) |
| "count per group" | `GROUP BY x` then `TABLE length(rows) AS "Count"` |
| "sum a numeric field per group" | `TABLE sum(nonnull(rows.hours)) AS "Hours"` |
| "open tasks only" | `TASK WHERE !completed` |
| "tasks with any status char" | `TASK WHERE checked AND !completed` |
| "this note's own field" | `` `= this.field` `` (inline) |

### Worked examples

Overdue project work, grouped by project, cheap first:

````text
```dataview
TABLE WITHOUT ID file.link AS "Note", due, priority
FROM "Projects" and -"Projects/Archive"
WHERE !completed AND typeof(due) = "date" AND due < date(today)
SORT due ASC
LIMIT 50
```
````

One row per open task, with the note it came from — note that `WHERE` runs **before** `FLATTEN`
so the deep copy only happens for notes that survived:

````text
```dataview
TABLE WITHOUT ID file.link AS "Note", T.text AS "Task", T.due AS "Due"
FROM "Work"
WHERE file.tasks
FLATTEN file.tasks AS T
WHERE !T.completed AND T.due
SORT T.due ASC
```
````

Tag histogram over one folder:

````text
```dataview
TABLE length(rows) AS "Notes"
FROM "Zettel"
FLATTEN file.etags AS tag
GROUP BY tag
SORT length(rows) DESC
LIMIT 25
```
````

Aggregation that survives missing values — `sum(rows.hours)` alone throws the moment one note lacks
`hours`, and the whole query then errors out:

````text
```dataview
TABLE sum(nonnull(rows.hours)) AS "Hours", length(rows) AS "Notes"
FROM #timesheet
GROUP BY file.folder
```
````

## Traps that silently change results

Each produces plausible-but-wrong output, or an error message that points at the wrong place. All
verified by executing the pinned code.

| Trap | Effect |
|---|---|
| **`SORT` directly after a bare `LIST` / `TABLE`** | **Parse error.** The `LIST`/`TABLE` header greedily consumes one expression and `SORT` is not a reserved word (`src/query/parse.ts:135`, `src/expression/parse.ts:84`), so `SORT` becomes the output field and the rest of the line is unparsable. `LIST\nSORT file.name` fails; `LIST\nWHERE true\nSORT file.name`, `TASK\nSORT …` and `LIST file.link\nSORT …` all work. The error points at the `SORT` line and says "Expected one of the following", which reads like the sort syntax is wrong. |
| `2021-01-01` in an expression | Evaluates to **2019** — number minus number minus number. Always `date(2021-01-01)`. |
| `x-y` without spaces | One identifier named `x-y`, not subtraction (`src/expression/parse.ts:268` allows `-` inside identifiers). This is deliberate — it is how `due-date` works — but it makes `total-spent` a field name. |
| `a or b and c` | Parses as `(a or b) and c`. `and` and `or` share one precedence level and are left-associative (`src/expression/parse.ts:579`). Same for `FROM` sources. **Always parenthesise.** |
| `WHERE due < date(today)` | Matches every page with **no** `due`. See D3. |
| `WHERE status != "done"` | Matches every page with no `status`. |
| `WHERE n + 1 > 0` | Drops every row where `n` is missing, silently — `number + null` has no implementation (`src/expression/binaryop.ts:86`). |
| `sum(rows.x)` / `average(rows.x)` | Throws as soon as one row lacks `x`, which fails the whole query. Use `sum(nonnull(rows.x))`. |
| `contains(file.tags, "#proj")` | **True for `#project`.** For lists, `contains` recurses and ends in a *substring* test per element (`src/expression/functions.ts:454`). Docs say "equals" (`docs/docs/reference/functions.md`) — use `econtains` for equality. |
| `contains(someList, list("a","b"))` | Returns `[true,false]`, not a boolean. Vectorized on the needle (`src/expression/functions.ts:460`), and a non-empty array is truthy — so the `WHERE` passes everything. |
| `default(arr, "x")`, `choice(arr, a, b)` | Also vectorized: they map over the array instead of treating it as one value. `ldefault` is the non-vectorized `default`. |
| `split(s, ".")` | The delimiter is a **regular expression** (`src/expression/functions.ts:614`; documented at `docs/docs/reference/functions.md`). `split("a.b.c", ".")` returns six empty strings. `replace` is literal. |
| `regexmatch("Hello", x)` | **False** for `"Hello world"` — the pattern is auto-anchored to `^…$` unless it already starts with `^` or ends with `$` (`src/expression/functions.ts:569`). Use `regextest` for unanchored search. |
| `regextest(pattern, field)` vs `regexreplace(field, pattern, repl)` | Argument order is inverted between the two. |
| `d.week` | **Not** the ISO week: it is `floor(day / 7) + 1` (`src/expression/context.ts:190`). The ISO week number is `d.weekyear`. `d.quarter` is unsupported and returns `null`. |
| `truncate(s, n)` | Truncates strings that are already short enough: `truncate("abc", 5)` = `"ab..."` (`src/expression/functions.ts:679`). |
| `FLATTEN x` where `x` is an empty array | **Deletes the row.** `FLATTEN` over a missing field keeps it (wrapped as `[null]`). |
| `LIMIT -1` | Drops the **last** row (`Array.slice(0, -1)`); `LIMIT 1.9` keeps one row. |
| A second `FROM` after another clause | Parses, then fails at run time with `Unrecognized query operation 'folder'` (`src/query/parse.ts:196`, `src/query/engine.ts:191`). The docs say it is not allowed (`docs/docs/queries/structure.md:89`); the parser does not enforce it. |
| Fields named `from`, `where`, `limit`, `group`, `flatten` | Unusable as bare variables (`src/expression/parse.ts:84`); use `row["where"]`. `sort`, `table`, `list`, `task`, `as` are *not* reserved — which is exactly what causes the first row of this table. |
| `FROM #Project` vs `contains(file.tags, "#Project")` | The tag *index* is case-insensitive; `file.tags` holds original casing and string comparison is case-sensitive. |
| YAML `due: 2021-06-15` unquoted | If Obsidian's parser hands Dataview a JS `Date`, it is re-read in **local** time (`src/data-import/markdown-file.ts:338`), which shifts the calendar day west of UTC: in `America/New_York` the value becomes `2021-06-14T20:00`, and `due = date(2021-06-15)` is false. Quote the value to avoid it. |
| Frontmatter `version: 5 m` | Becomes a **duration** of five minutes. Any unquoted string that parses as a date, duration or link is retyped (`src/data-import/markdown-file.ts:355`). |
| Inline `key:: a, b, c` | A single **string**. Only quoted elements make a list: `key:: "a", "b", "c"` (`docs/docs/annotation/types-of-metadata.md:198`). |
| Task `completed` | A **boolean** (status is `x`/`X`). The completion *date* is `completion` (`src/data-model/markdown.ts:281`). `checked` is true for any non-blank status, so `[-]` is checked but not completed. |
| Inline fields on a task named `text`, `line`, `tags`, `status`, `path`, `children` | Ignored or overwritten — task built-ins win (`src/data-model/markdown.ts:255`, `:340`). |
| Inline fields on a **non-task** bullet | Propagate to the **page**, not to the parent task (`src/data-import/markdown-file.ts:279`; the code that would attach them to the task is commented out). |
| `TASK` results include unmatched children | The view re-nests children under any matching parent (`src/ui/views/task-view.tsx:308`; documented at `docs/docs/queries/query-types.md:430`). |
| Inline DQL stored in a field | The field keeps the literal text `= this.a - this.b`, not the computed value (`docs/docs/resources/faq.md:57`). |
| A path containing `?no-dataview` | Disables every Dataview render for that file (`src/api/plugin-api.ts:610`). |

## Performance in one paragraph

*Measured* on the pinned code with synthetic rows: a `WHERE` costs about **0.1–0.4 µs per row**;
`SORT` and `GROUP BY` about **5 µs per row**; `FLATTEN` about **6 µs per *output* row** for a narrow
row and **16 µs** for a 50-field row, because it deep-copies the entire row per element
(`src/query/engine.ts:182`). Before any of that, every page matched by `FROM` is serialized from
scratch — **8 µs** for a page with no list items, **121 µs** for one with fifty
(`src/data-model/markdown.ts:122`). So in a 5 000-note vault where notes average ten list items, a
`FROM`-less query pays roughly 160 ms of pure materialization *before the first clause runs*, and it
pays it again for **every visible query on every index revision**, debounced at 2 500 ms
(`src/main.ts:184`). The three levers, in order of effect: narrow `FROM`, keep `FLATTEN` after
`WHERE` (measured 31 ms vs 319 ms on the same data), and reduce the number of Dataview blocks
rendered on one screen. The full cost model, the rewrite catalogue, and an audit procedure for a
whole vault are in [reference/performance.md](reference/performance.md); a runnable scanner ships
with this skill at `scripts/audit-dataview-queries.mjs`.

## Validating the result

A query that looks right is not a verified query. Before handing one over:

1. **Check one row that must appear and one that must not.** A filter that was too broad and is now
   too narrow looks identical from a single example.
2. **Check the count** in the header. If adding a harmless-looking clause changes it, rows are being
   dropped by evaluation errors.
3. **Type-check every comparison** with a temporary `typeof(x)` column. Do this even when confident:
   it is how the null-comparison and cross-type traps are caught.
4. **Do not trust the absence of an error.** Vectorized functions, cross-type comparisons and
   null comparisons all succeed while meaning something else.
5. **Re-read the clause order** and ask whether each clause is operating on the row count you
   intended.

## Known conflicts, limitations and open questions

- **Documentation versus implementation**, recorded rather than reconciled:
  `contains(list, value)` is documented as an equality test but implemented as a recursive substring
  test; `FROM` is documented as impossible after other data commands but parses and then fails at
  run time; `docs/docs/annotation/metadata-tasks.md:57` says tasks inherit all page fields, which is
  true for `TASK` queries only and only for keys the task does not already define
  (`src/query/engine.ts:404`); `src/data-model/markdown.ts:191` comments that a task's fields
  include fields underneath the task, which the implementation does not do.
- **Three behaviours look like defects** and are the reason this skill insists on type checks:
  `truncate` mangling short strings, `d.week` not being a week number, and `SORT` being unusable
  directly after a bare `LIST`/`TABLE`. *Unverified:* whether any is a known upstream issue —
  settling that needs the GitHub tracker, which is outside the pinned tree.
- **Nothing here was run inside Obsidian.** Semantics and costs were verified by executing the
  pinned modules directly; anything requiring a live `FullIndex`, `MetadataCache` or renderer
  (tag-index case folding, `file.inlinks`, task rewriting, live refresh) is read from source and
  marked as such.
- **The YAML-date trap depends on Obsidian, not Dataview.** Dataview handles both a `Date` object
  and a string (`src/data-import/markdown-file.ts:338`, `:355`); which one arrives is decided by
  Obsidian's frontmatter parser, and `FrontMatterCache` is typed `[key: string]: any`, so the pinned
  trees cannot settle it. The diagnostic in [reference/debugging.md](reference/debugging.md) tells a
  user which path their vault is on.
- **Performance numbers are relative, not absolute.** They come from a synthetic harness on one
  machine and are meant for ranking operations against each other, not for predicting your vault.
- **Not systematically audited.** The traps table is what surfaced while mapping the language, not
  the output of exhaustive testing. Absence from it is not evidence of safety.

## Reference map

Load the file that matches the question; do not guess from memory. These files are part of this
skill and travel with it.

| File | Use it for |
|---|---|
| [reference/query-language.md](reference/query-language.md) | Complete DQL: grammar of every clause, source syntax and resolution, the expression language, operator precedence and the full binary-operator table, and the function catalogue with the traps per function. |
| [reference/data-model.md](reference/data-model.md) | What a query can see: frontmatter and inline-field parsing, key canonicalization, the type system and coercions, all implicit `file.*` fields, and the task / list-item model. |
| [reference/debugging.md](reference/debugging.md) | The triage protocols, the instruments to build (there is no `explain`), and a cause catalogue indexed by symptom. |
| [reference/performance.md](reference/performance.md) | The measured cost model, the rewrite catalogue, how to audit a whole vault, and how the bundled scanner works. |
| [reference/dataviewjs.md](reference/dataviewjs.md) | The `dv` API surface, `DataArray`, when JS beats DQL and when it does not, and the security and settings gates. |
| `scripts/audit-dataview-queries.mjs` | Runnable, dependency-free scanner: finds every Dataview block in a vault and ranks them by likely cost and by the traps above. `node scripts/audit-dataview-queries.mjs /path/to/vault`. |

## Self-containment

This skill is **self-contained**: `SKILL.md`, the five files under `reference/`, and the script under
`scripts/` carry everything needed to read, write, debug and cost a Dataview query. Nothing outside
the skill directory is required and no link leaves it, so the directory can be copied into another
project as-is.

Two consequences to preserve if you edit it:

- **Do not introduce load-bearing links to other artifacts.** Where deeper analysis exists elsewhere,
  name it in prose rather than linking to it, so an extracted copy has no dead references.
- **The section below is the only repository-only content**, and the only thing to delete when
  extracting.

### Reproducing the empirical claims (source repository only)

Every `Measured:` claim and every trap in this skill was produced by executing the pinned submodule
directly, not by reading it alone. To re-run, from
`research/plugins/blacksmithgu/obsidian-dataview` in the `octolaba/obsidian` research repository:

1. `npm install` (the submodule's `node_modules` is git-ignored, so the pin stays clean).
2. Write a Jest config outside the submodule with `rootDir` set to the submodule,
   `modulePaths: [<submodule>/src]`, `moduleNameMapper` mapping `^obsidian$` to
   `<submodule>/__mocks__/obsidian.ts` and `^web-worker:.*$` to a stub, and ts-jest in
   `isolatedModules` mode.
3. Import `EXPRESSION` / `parseQuery` from `expression/parse` and `query/parse`, `executeCore` from
   `query/engine`, `parseFrontmatter` from `data-import/markdown-file`, and evaluate expressions in a
   `Context` built with a link handler that resolves nothing.

**Deliberately dropped scope:** no verification harness is checked in beside this skill. One that
anchors on the submodule cannot travel inside a self-contained skill, and the repository's artifact
conventions put such a harness beside a deep dive — which does not exist for Dataview yet. The
recipe above is the stand-in, and a `results/deep-dives/dataview/` artifact with a real harness is
the natural follow-up.

## How to consult on this

- **Never answer a "why doesn't this work" question without three things**: the exact block source,
  the exact note content (frontmatter *and* the inline-field line), and the Dataview version. The
  bug is usually in the second one.
- **Ask what should happen to notes missing the field** before writing any comparison. Users almost
  never volunteer this, and it decides the query.
- **Quote what Dataview holds, not what the file says.** Paste the `typeof()` probe rather than
  arguing about the file.
- **Prefer DQL over DataviewJS.** JS is off by default, cannot be shared safely, and is slower to
  debug. Reach for it only when the reference confirms DQL cannot express the thing — recursive
  traversal, cross-page joins, custom rendering.
- **Say plainly when something cannot be expressed** (there is no `HAVING`, no join, no aggregate
  outside `GROUP BY`, no window function, no user-defined function in DQL, no way to sort group
  headings by anything but the group key) and give the nearest workable alternative rather than
  inventing syntax.
- **Volunteer the cost.** If a query has no `FROM`, or `FLATTEN`s `file.lists` over a whole vault,
  say so and offer the narrowed version even when the user only asked whether it was correct.
