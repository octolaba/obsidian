# Reference: debugging Dataview queries

Protocols and a cause catalogue for wrong results, at `blacksmithgu/obsidian-dataview` tag `0.5.70`.
Citations are `path:line` in that repository.

The governing fact: **Dataview has no `explain`, no query plan, and no way to see per-row errors.**
Diagnostics are collected during execution and then discarded (`src/query/engine.ts:206`). You must
build the instruments yourself, and they are all cheap.

---

## 1. The instruments

### I1 — the type probe (use this first, always)

````text
```dataview
TABLE WITHOUT ID
  file.link AS "Note",
  typeof(due) AS "type",
  due AS "value",
  string(due) AS "rendered"
WHERE file.name = "The Note In Question"
```
````

`typeof` returning `"null"` means the field does not exist **under that name** — a data problem.
Anything else tells you which comparison operators can possibly work. Add `file.frontmatter` as a
column to see the raw YAML Dataview was handed, before retyping.

### I2 — the bisect

Reduce to `TABLE file.link FROM <source>` and add clauses back one at a time, checking the count in
the header each time. This separates a source problem from a filter problem in one step. If the
count drops when you add a clause that "should not" change anything, rows are being dropped by
**evaluation errors**, not by the filter.

### I3 — the error-rate probe

There is no way to ask "how many rows errored". Approximate it: a clause that keeps rows should
never reduce the count, so

````text
```dataview
TABLE file.link
FROM "Folder"
SORT some.possibly.missing.field
```
````

losing rows relative to the same query without `SORT` proves the sort key throws for those rows
(`src/query/engine.ts:77`).

### I4 — the whole-object dump

````text
```dataview
TABLE WITHOUT ID file.link, file.frontmatter, file.tasks
WHERE file.name = "The Note"
```
````

Objects and arrays render as nested lists up to `maxRecursiveRenderDepth` (default 4,
`src/settings.ts:50`), then as `...`.

### I5 — inline expression scratchpad

`` `= <expression>` `` in a scratch note evaluates a single expression against that note's context
(`src/query/engine.ts:436`). Fastest way to settle a precedence, coercion or function-argument
question without building a table.

### I6 — the console

Dataview logs the index build to the developer console (`Ctrl/Cmd-Shift-I`):
`Dataview: all N files have been indexed in Ts (C cached, S skipped)`
(`src/data-index/index.ts:153`). It also logs `Dataview: Encountered a circular list (line number …)`
when a list item's `children` form a cycle (`src/data-model/markdown.ts:325`) — that item is dropped
from `file.lists`.

### I7 — DataviewJS, when DQL cannot show you

If JS is enabled, `console.log(dv.page("Note"))` prints the exact serialized object a query sees.
This is the ground truth, and it ends most arguments.

---

## 2. Protocol A — a row is missing

Stop at the first step that reproduces it.

| # | Check | Cause if it reproduces |
|---|---|---|
| 1 | Is the file `.md`/`.markdown`? | Nothing else is indexed (`src/data-index/index.ts:296`). |
| 2 | Has indexing finished? Reload Obsidian, watch the console line. | Queries executed during startup see a partial index. |
| 3 | Remove `FROM`. | The source excluded it — see §3 "Source" rows. |
| 4 | Replace the whole `WHERE` with `WHERE true`. | A filter. Go to 6. |
| 5 | Is there a `FLATTEN`? Remove it. | `FLATTEN` over an **empty array deletes the row** (`src/query/engine.ts:180`). `FLATTEN file.tasks` removes every note with no tasks. |
| 6 | I1 on the missing note. `typeof` is `"null"`? | The field was never parsed under that name. Go to Protocol C. |
| 7 | `typeof` differs from what the comparison assumes? | Cross-type comparisons are never equal and order by type name (`src/data-model/value.ts:188`). |
| 8 | Does any clause do arithmetic or call a function on that field? | The row is dropped by an evaluation error, silently (`src/query/engine.ts:61`). |
| 9 | Is the field an array where a scalar was expected? | Duplicate keys collapse to an array (`src/data-import/markdown-file.ts:402`). Use `contains`/`econtains`. |
| 10 | For `TASK`: is the task a **child** of a task the filter rejected? | Children are only rendered under a matching parent; a matching child of a rejected parent is rendered on its own (`src/ui/views/task-view.tsx:308`). |
| 11 | Is `LIMIT` earlier in the block than you think? | `LIMIT` executes where it is written. |

## Protocol B — rows appear that should not

| Symptom | Cause |
|---|---|
| Notes with **no** value for the field pass a `<` or `<=` filter | `null` is smaller than everything (`src/data-model/value.ts:176`). Add `WHERE field AND …` or `typeof(field) = "date"`. |
| Notes with no value pass `!=` | Same comparator: `null != "x"` is true. |
| A `WHERE` with `contains(...)` matches everything | The call vectorized and returned an array; every non-empty array is truthy (`src/expression/functions.ts:109`). |
| `contains(file.tags, "#proj")` matches `#project` | For arrays `contains` ends in a substring test per element (`src/expression/functions.ts:454`). Use `econtains`. |
| `FROM #a` returns notes tagged only `#a/b` | Tag sources include subtags by design (`src/data-model/markdown.ts:104`). Filter with `econtains(file.etags, "#a")`. |
| `FROM #Work` returns `#work` notes | Tag index lookups are case-folded (`src/data-index/index.ts:545`). |
| A mixed `and`/`or` filter matches too much | One precedence level, left-associative: `y or a and b` is `(y or a) and b` (`src/expression/parse.ts:579`). Parenthesise. |
| `TASK FROM #x` returns untagged tasks | `FROM` selects **pages**; all their tasks are collected (`src/query/engine.ts:394`). Use `WHERE contains(tags, "#x")`. |
| Child tasks appear that do not match | By design (`docs/docs/queries/query-types.md:430`). |
| Duplicate rows after `FLATTEN` | One output row per array element — that is what it does. Check whether the source array itself has duplicates (`file.outlinks` can, `src/data-model/markdown.ts:114`). |

## Protocol C — the value is wrong, blank, or renders as `-`

`-` (or whatever `renderNullAs` is set to, default `\-`) means **null**, not "empty".

| Symptom | Cause |
|---|---|
| `typeof = "null"` although the line looks right | The line was never scanned: it is in a `list`/`ruling` section, has no `::`, is over 32 768 chars, or is a task line written as a full-line field instead of `[k:: v]` (`src/data-import/markdown-file.ts:156`, `:257`). |
| Field name works in one note, not another | Capitalisation. Query the canonical alias (`due-date`) instead (`src/util/normalize.ts:100`). |
| The value is an array, not a scalar | The key appears more than once in the note. |
| A date is one day off | Unquoted YAML date re-read in local time (`src/data-import/markdown-file.ts:338`). See `reference/data-model.md` §2.1. |
| A version string became a duration | `parseFrontmatter` retypes anything that parses whole: `5 m` → 5 minutes. Quote it. |
| A number is treated as text | Quoted in YAML, or has a unit. `number(x)` extracts the first number. |
| `completed` is `true`/`false` instead of a date | `completed` is the checkbox boolean; the date is `completion` (`src/data-model/markdown.ts:281`). |
| A task field named `text`/`line`/`tags`/`status` has the wrong value | Task built-ins overwrite inline fields of the same name (`src/data-model/markdown.ts:255`). |
| A bullet's `[k:: v]` under a task is not on the task | It went to the **page** (`src/data-import/markdown-file.ts:279`). |
| A field holds the literal text `= this.a - this.b` | Inline DQL stored in a field is not evaluated at index time (`docs/docs/resources/faq.md:57`). |
| Everything is `null` after `GROUP BY` | Grouped rows only have `key`, `rows` and the group name (`src/query/engine.ts:143`). Use `rows.field`. |
| `d.week` is a small number | It is `floor(day/7)+1`, not the week number. Use `d.weekyear` or `dateformat(d, "WW")`. |
| `regexmatch` never matches | Auto-anchored to `^…$` (`src/expression/functions.ts:569`). Use `regextest`. |
| `split` returns empty strings | The delimiter is a regex; escape it. |
| A short string got truncated | `truncate` mangles strings shorter than the limit (`src/expression/functions.ts:679`). |

## Protocol D — the block shows an error

| Message | Meaning and fix |
|---|---|
| `-- PARSING FAILED --` with a caret on a `SORT` line | Almost always `SORT` directly after a bare `LIST`/`TABLE`: the header ate the word `SORT` (`src/query/parse.ts:135`). Give the header a field, or put `WHERE`/`FROM` first. |
| `-- PARSING FAILED --` elsewhere | Read the caret column, not the line. Common causes: unbalanced `(`, a bare date, `AS` with an unquoted multi-word header, a field named after a reserved word. |
| `Every row during operation 'where' failed with an error; first 3: …` | Every row threw. The listed messages are the real cause (`src/query/engine.ts:195`). Usually a null in arithmetic or an aggregate. |
| `Every row during final data extraction failed …` | A **column expression** throws for every row (`src/query/engine.ts:252`). |
| `No implementation found for 'number + null'` | Arithmetic on a missing field. Guard with `default(x, 0)` or `nonnull()`. |
| `No implementation of 'length' found for arguments: number` | Wrong argument type for a function variant. |
| `Unrecognized function name 'x'` | Typo, or a DataviewJS-only helper used in DQL. |
| `Failed to execute 'limit' statement: limit should be a number, but got 'null'` | `LIMIT` is evaluated with **no row context** (`src/query/engine.ts:107`) — it cannot reference fields. |
| `Unrecognized query operation 'folder'` (or `'tag'`, `'link'`) | A second `FROM` after another clause. It parses, then fails (`src/query/parse.ts:196`). |
| `Could not find file "X" during link lookup - does it exist?` | `outgoing([[X]])` where `X` does not resolve (`src/data-index/resolver.ts:57`). |
| `can only index into objects with strings (a.b or a["b"])` | Indexing an object with a number. |
| `Array indexing requires either a number … or a string …` | Indexing an array with a date or boolean. |
| `Can't handle format (F) on date string (D)` | `date(str, fmt)` mismatch — this variant **throws** instead of returning null. |
| `Dataview: No results to show for … query.` | Zero rows, not an error (`src/ui/views/list-view.tsx:70`, `table-view.tsx:63`, `task-view.tsx:154`). Turn off with **Warn on empty result**. |
| `Evaluation Error: …` with a JS stack | A `dataviewjs` block threw (`src/ui/views/js-view.ts:32`). |
| `Dataview JS queries are disabled. You can enable them in the Dataview settings.` | The default state (`src/ui/views/js-view.ts:19`, `src/settings.ts:104`). |
| An inline query renders the literal `(disabled; enable in settings)` | Inline JS needs **both** `enableDataviewJs` and `enableInlineDataviewJs` (`src/ui/views/js-view.ts:56`). |
| The block renders as plain code, no error at all | The file path contains `?no-dataview` (`src/api/plugin-api.ts:610`). |

## Protocol E — results are stale, flicker, or do not update

| Symptom | Cause |
|---|---|
| Edits take a couple of seconds to show | `refreshInterval`, default 2 500 ms, debounced (`src/main.ts:184`). |
| Nothing updates at all | **Automatic view refreshing** is off (`src/settings.ts:47`), or the container is not visible — refresh only runs when `container.isShown()` (`src/ui/markdown.tsx:261`). |
| Results changed after a plugin update, or are wrong after a crash | The IndexedDB cache is keyed by plugin version (`src/data-import/persister.ts:20`); a partial write survives otherwise. Run **Drop all cached file metadata**, then **Force refresh all views** (`src/main.ts:109`, `:118`). |
| A renamed file keeps the old path in results | Renames are handled explicitly (`src/data-index/index.ts:166`), but embedded/`this`-relative queries in the moved note need a re-render: **Rebuild current view**. |
| Embeds inside a Dataview view misbehave | Known interaction with automatic refresh; the setting description itself recommends turning refresh off (`src/main.ts:477`). |
| `file.starred` is wrong for up to 30 s | Polled, not evented (`src/data-index/index.ts:397`). |
| A CSV source is stale for up to 5 minutes | `CsvCache` expiry (`src/data-index/index.ts:307`); it is flushed on modify/delete of local files, but remote URLs are not. |

## Protocol F — "it worked before"

Establish, in this order: the plugin version; whether the note changed; whether a **key was
duplicated** (turning a scalar into an array); whether a value gained text after it (turning a date
into a string); whether Obsidian's Properties UI rewrote the frontmatter and changed quoting; and
whether the block was moved into a note whose path or folder changed a `this.`/`FROM` reference.

---

## 3. Cause catalogue, indexed by symptom

| Symptom | First suspect | Confirm with |
|---|---|---|
| One note missing, everything else fine | field never parsed | I1 |
| Many notes missing | `FROM`, or a `FLATTEN` over an empty array | I2 |
| Everything missing, no error | filter always false; or the source is empty (trailing `/` in a folder path) | I2 |
| Everything missing, "Every row failed" | null in arithmetic / aggregate | read the three quoted messages |
| Too many rows | null comparison, or a vectorized call in `WHERE` | I1 plus `typeof` on the comparison result |
| Row count changes when adding `SORT` | sort key throws for some rows | I3 |
| Column shows `-` | value is null | I1 |
| Column shows an array where a scalar was expected | duplicate key | I1 |
| Dates one day off | unquoted YAML date | `dateformat(x, "yyyy-MM-dd HH:mm ZZZZ")` |
| Counts double after `GROUP BY` | a `FLATTEN` earlier in the block | count before and after |
| `sum()` breaks the whole query | nulls in the array | `sum(nonnull(...))` |
| Query is correct but the vault is slow | see `reference/performance.md` | the bundled scanner |

---

## 4. What to ask the user, and in what order

1. **The exact block source**, as text, not a screenshot.
2. **The exact note content** — frontmatter *and* the inline-field line, verbatim. The bug is here
   more often than in the query.
3. **The Dataview version** and whether the index has finished building.
4. **What should happen to notes that lack the field.** Users almost never volunteer this and it
   decides half the query.
5. **Whether the block sits in the same note as the data** — `this.`, `[[]]` and relative CSV paths
   all depend on it.

Then reproduce with I1 before proposing anything. Quote what Dataview holds, not what the file says.
