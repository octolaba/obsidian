# Reference: cost model, rewrites, and auditing a vault

Where Dataview spends time, at `blacksmithgu/obsidian-dataview` tag `0.5.70`. Citations are
`path:line` in that repository. The cost model is derived from implementation; live timing is a
separate, user-run diagnostic described in §2.

## Contents

1. [Cost model](#1-the-cost-model)
2. [Live measurement](#2-how-to-measure-a-users-vault)
3. [Rewrite catalogue](#3-rewrite-catalogue)
4. [Vault-wide auditing](#4-auditing-a-whole-vault)

---

## 1. The cost model

There is **no optimizer and no incremental evaluation**. Every visible query re-executes in full,
from the index, on every refresh. The cost of one execution is:

```
cost  ≈   |FROM|  × serialize_cost(page)          ← materialization, unavoidable, often dominant
        + |rows|  × Σ per-operation cost           ← the clauses, in written order
        + |output| × render cost                   ← preact + Obsidian markdown rendering
```

and the cost of a *vault* is that, multiplied by **every Dataview block currently on screen**, every
time the index revision changes.

### 1.1 Materialization is the floor

`resolveSource` calls `page.serialize(index)` for every matched path
(`src/data-index/resolver.ts:136`, `src/data-model/markdown.ts:122`). That builds a fresh object:
all `file.*` fields, a deep copy of the frontmatter, the reverse-link lookup, and a **full
serialization of every list item in the note**, recursively. Nothing is cached between queries.

A query with no `FROM` pays this cost for every indexed page before `WHERE` can reject anything.
The floor therefore grows with matched pages, page-field width, and serialized list-item trees.
This is why narrowing `FROM` is the first lever even when the later predicate is selective.

### 1.2 Per-operation cost

| Operation | Source-derived scaling and allocation |
|---|---|
| `WHERE expression` | One expression evaluation per incoming row; survivors retain their row. |
| `SORT expression` | Evaluate keys, then comparison sort: roughly `n log n` comparisons. |
| `GROUP BY expression` | Evaluate keys, sort them, then merge equal adjacent keys and build `rows`. |
| `LIMIT n` | Array slicing at that point in the pipeline; it cannot recover earlier work. |
| `FLATTEN array` | One output per element and a deep copy of the whole input row per output. |
| `map`/`filter`/`any` lambdas | One lambda-context copy and evaluation per visited element. |

Why operation order matters:

- **A cheap `WHERE` reduces every later input.**
- **`SORT` and `GROUP BY`** compare through the operator table using `<` and then `>`
  (`src/query/engine.ts:90`, `src/query/engine.ts:133`).
- **`FLATTEN` is the expensive one**: it `Values.deepCopy`s the entire row for every output element
  (`src/query/engine.ts:182`). Cost scales with output rows **and** row width. Serialized pages are
  wide.
- **Lambdas** (`map`, `filter`, `any`, `all`) allocate a copy of the row's variable scope per call
  (`src/expression/context.ts:91`), so they cost more than the equivalent built-in.

### 1.3 Refresh amplification

Every index change bumps `revision` and fires `dataview:refresh-views`, debounced by
`refreshInterval` (default 2 500 ms, `src/main.ts:184`). Each mounted view recomputes if its
container is visible (`src/ui/markdown.tsx:261`). So:

> Editing one note re-runs **every Dataview block currently rendered**, not just the ones that
> depend on it. A dashboard with twelve `FROM`-less tables is twelve full-vault materializations
> every 2.5 seconds while you type.

Blocks whose containers Obsidian reports as hidden are skipped until shown. Do not infer viewport
visibility from source alone; `isShown()` is a host-provided DOM predicate.

### 1.4 Source-resolution costs

| Source | Cost |
|---|---|
| `"folder"` | Walks the `TFolder` tree live (`src/data-index/index.ts:251`) — proportional to the folder. |
| `#tag` | One reverse-index lookup — the cheapest source. |
| `[[Note]]` (incoming) | **Full scan of `metadataCache.resolvedLinks`** (`src/data-index/resolver.ts:45`), i.e. proportional to the whole vault; the code carries a `TODO` about it. |
| `outgoing([[Note]])` | One lookup. |
| `-X` (negation) | Enumerates **every markdown file** and subtracts (`src/data-index/resolver.ts:86`). Most expensive form; the code carries a `TODO`. |
| `csv(...)` | File read + parse, cached 5 minutes; a URL is an HTTP request. |
| *(no `FROM`)* | The whole vault. |

Prefer `#tag and "folder"` over `-"other folder"` when both express the intent.

---

## 2. How to measure a user's vault

Copy `assets/dataview-doctor/` into the vault and call the view with the same full query at least
three times. It reports result size, target presence, median and p95. Compare one change at a time:

1. warm the index and CSV cache;
2. keep the note, rendering mode, visible dashboards and device constant;
3. record the original result paths/order and positive/negative target;
4. run the original and candidate query with the same repeat count;
5. compare medians, not the first run;
6. reject an optimization if result membership/order changed unintentionally.

These timings include the user's actual source resolution, page serialization and query execution,
but also current cache and UI conditions. They are observations for that vault, not portable
constants. Renderer profiling and mobile/desktop comparisons remain live experiments outside this
artifact's formal test.

---

## 3. Rewrite catalogue

Each rewrite preserves results unless noted.

### R1 — add a `FROM`

```diff
- TABLE due FROM ...            (missing entirely)
+ TABLE due
+ FROM "Projects"
```
The single biggest win. Even a `FROM` that excludes only attachments and archives cuts
materialization proportionally.

### R2 — filter before flattening

```diff
- FLATTEN file.tasks AS T
- WHERE !T.completed AND file.folder = "Work"
+ WHERE file.folder = "Work" AND file.tasks
+ FLATTEN file.tasks AS T
+ WHERE !T.completed
```
`WHERE file.tasks` before the `FLATTEN` also removes notes with no tasks — which `FLATTEN` would
have dropped anyway
(`src/query/engine.ts:180`), so behaviour is unchanged.

### R3 — sort and group after filtering

```diff
- SORT file.mtime DESC
- WHERE econtains(file.etags, "#active")
+ WHERE econtains(file.etags, "#active")
+ SORT file.mtime DESC
```
Sorting rows that a later independent filter discards is avoidable work. This changes nothing about
the result — sort is applied to whatever set reaches it.

### R4 — `LIMIT` early when you only need a sample

```diff
- FLATTEN file.lists AS L
- LIMIT 10
+ LIMIT 10
+ FLATTEN file.lists AS L
```
**This changes the result** (ten notes' worth of list items rather than the first ten list items),
so only apply it when the user wants a sample. When they want the top N of a sorted list, `LIMIT`
must stay after `SORT`.

### R5 — avoid `FLATTEN` when you only need a predicate or a count

```diff
- FLATTEN file.tasks AS T
- WHERE !T.completed
- GROUP BY file.link
+ WHERE any(map(file.tasks, (t) => !t.completed))
```
One row per note instead of one per task, and no deep copies. The lambda still visits task elements,
but it avoids materializing a wide page-row copy for each one.

### R6 — hoist link resolution out of the row loop

Indexing through a link (`author.file.name`, `[[X]].field`) calls
`metadataCache.getFirstLinkpathDest` **per row** (`src/query/engine.ts:451`). Filter on cheap local
fields first so fewer rows reach the link-resolving expression.

### R7 — one block instead of many

Three tables over the same source cost three materializations. A single `TABLE` with more columns,
or one `GROUP BY`, costs one. On dashboards this is usually the largest available win after R1.

### R8 — narrow what a dashboard renders

`LIMIT` the visible rows. Rendering is Obsidian's markdown renderer per cell
(`src/ui/markdown.tsx:56`); a 2 000-row table is expensive to *draw* even when it is cheap to
compute.

### R9 — settings, when the query cannot be fixed

- Raise **Refresh interval** (`src/settings.ts:47`) — the cheapest global mitigation for "Obsidian
  lags while I type".
- Turn off **Automatic view refreshing** for vaults where dashboards need not be live.
- Neither changes correctness; both change how often the cost is paid.

### R10 — pin a self-referencing query to its own file

`WHERE file = this.file` — the idiom used by upstream's own documentation
(`docs/docs/annotation/types-of-metadata.md:20`) — still materializes **every note in the vault** and
then compares whole `file` objects key by key (`src/data-model/value.ts:243`). When the note's path
is stable, name it:

```diff
- TABLE due, status
- WHERE file = this.file
+ TABLE due, status
+ FROM "Projects/This Note.md"
```

There is no path-independent way to avoid the scan; `WHERE file.path = this.file.path` is cheaper per
row than the object comparison but still materializes everything.

### R11 — the anti-pattern to name out loud

```text
TABLE file.link, T.text
FLATTEN file.lists AS T          ← whole vault, every list item, deep-copied
```
This materializes the whole vault and deep-copies every output list row, per refresh, per visible
block. If the user needs it, at minimum add a `FROM` and a page-level `WHERE` before the
`FLATTEN`.

---

## 4. Auditing a whole vault

### 4.1 Procedure

1. **Inventory.** Run
   `node scripts/dataview-query-lint.mjs /path/to/vault --format json --all`. The extractor reads
   the vault's custom JS fence keyword, inline prefixes, enable switches and code-block setting.
   Add `--source-root /path/to/obsidian-dataview` when a compatible source checkout with installed
   development dependencies is available; this augments the portable checks with the upstream
   parser and AST.
2. **Prioritise without auto-fixing.** Start with cost warnings in visible dashboards, then notes
   with several extracted blocks. Severity, confidence and `fixSafety` are independent: a
   high-confidence whole-vault scan can still be intentional.
3. **Confirm actual shape and size.** For a candidate, check the live source row count and whether
   any `FLATTEN` runs before its page filters. The bundled live doctor runs a complete query
   repeatedly and reports median/p95 timing, result size and target presence.
4. **Check what is on screen**, not what exists. Only visible blocks recompute
   (`src/ui/markdown.tsx:261`), so a dashboard note matters far more than an archive note with the
   same query.
5. **Apply R1–R7 in order**, rerunning the same positive/negative fixtures and comparing repeated
   medians after each rewrite. R1 and R2 usually account for most of it.
6. **Only then** consider R9 (settings) or moving work to DataviewJS.

### 4.2 What the linter flags

Cost signals include no `FROM`, a negated or incoming-link source, `SORT` before a later `WHERE`,
wide `file.lists`/`file.tasks` flattening before page narrowing, a post-flatten predicate that does
not use the flattened alias, repeated/unbounded `FLATTEN`, and per-row link resolution.

Correctness signals include the bare-header `SORT` parse trap, a bare date, comparisons with an
unstated null policy, mixed `and`/`or`, unsafe grouped aggregates, a second `FROM`, trailing folder
slashes, substring membership where exact membership is likely, post-group field scope, and unusual
`LIMIT` values. DataviewJS checks cover missing `await`, passing a `WHERE` expression to
`dv.pages()`, repeated/whole-vault materialisation, unbounded loops, object equality, privileged
surfaces and event-listener cleanup.

Everything reported is a **candidate**, not a verdict. Static mode uses a conservative structural
model and regular-expression rules. Exact mode validates DQL syntax/AST but still cannot infer user
intent, live source cardinality, renderer cost or whether a rewrite preserves the desired result.
