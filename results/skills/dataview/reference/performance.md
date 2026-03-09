# Reference: cost model, rewrites, and auditing a vault

Where Dataview spends time, at `blacksmithgu/obsidian-dataview` tag `0.5.70`. Citations are
`path:line` in that repository. Numbers marked *Measured* were produced by executing the pinned
modules; see §2 for the method and its limits.

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

*Measured* (500 synthetic pages, 10 string fields, 3 frontmatter keys):

| List items per page | Per page | Per 1 000 pages |
|---|---|---|
| 0 | 8 µs | 8 ms |
| 10 | 32 µs | 32 ms |
| 50 | 121 µs | 121 ms |

So a 5 000-note vault where notes average ten list items pays **≈160 ms per query execution before
the first clause runs**. A query with no `FROM` pays it over the whole vault. This is why "narrow the
`FROM`" is the first and largest lever, and why it matters even when the `WHERE` would have filtered
everything anyway.

### 1.2 Per-operation cost

*Measured* on 5 000 synthetic rows, each with a numeric field, a string field and a 10-element array
of small objects:

| Operation | Time | Per row | Relative to `WHERE` |
|---|---|---|---|
| `WHERE n > 2500` | 2.0 ms | 0.4 µs | 1× |
| `WHERE contains(name, "9")` | 1.2 ms | 0.24 µs | ~1× |
| `WHERE regexmatch(".*9.*", name)` | 1.6 ms | 0.32 µs | ~1× |
| `WHERE any(map(items, (x) => x.done))` | 33.2 ms | 6.6 µs | ~17× |
| `GROUP BY (n % 10)` | 17.4 ms | 3.5 µs | ~9× |
| `SORT n` | 25.2 ms | 5.0 µs | ~13× |
| `SORT s` (strings) | 26.8 ms | 5.4 µs | ~13× |
| `FLATTEN items AS i` → 50 000 rows | 301.6 ms | 6.0 µs **per output row** | ~150× |
| the same on 50-field rows | 813.2 ms | 16.3 µs per output row | ~400× |

Scaling check (*Measured*): `SORT` on 1 000 / 5 000 / 20 000 rows takes 4.4 / 25.2 / 122.4 ms —
n·log n as expected.

Why the numbers look like this:

- **`WHERE` is nearly free.** A predicate is one expression evaluation per row.
- **`SORT` and `GROUP BY` cost ~13× a filter** because each comparison evaluates the operator table
  **twice** — once for `<`, once for `>` (`src/query/engine.ts:90`, `:133`) — and every comparison
  goes through the universal comparator.
- **`FLATTEN` is the expensive one**: it `Values.deepCopy`s the entire row for every output element
  (`src/query/engine.ts:182`). Cost scales with output rows **and** with how wide each row is, which
  is why the same `FLATTEN` is 2.7× slower on rows carrying more fields. Serialized pages are wide.
- **Lambdas** (`map`, `filter`, `any`, `all`) allocate a copy of the row's variable scope per call
  (`src/expression/context.ts:91`), so they cost more than the equivalent built-in.

### 1.3 Refresh amplification

Every index change bumps `revision` and fires `dataview:refresh-views`, debounced by
`refreshInterval` (default 2 500 ms, `src/main.ts:184`). Each mounted view recomputes if its
container is visible (`src/ui/markdown.tsx:261`). So:

> Editing one note re-runs **every Dataview block currently rendered**, not just the ones that
> depend on it. A dashboard with twelve `FROM`-less tables is twelve full-vault materializations
> every 2.5 seconds while you type.

Blocks in collapsed panes, other tabs, or scrolled far off-screen are skipped until shown.

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

## 2. How these numbers were produced

Executed against the pinned submodule, not inside Obsidian: `executeCore` from `src/query/engine.ts`
driven with synthetic `Pagerow[]`, and `PageMetadata.serialize` driven with synthetic pages and a stub
index, each measured as the mean of five runs after a warm-up, under Node with the jsdom test
environment on one Apple-silicon machine.

**Limits, stated plainly.** These are *relative* costs for ranking operations against one another.
They exclude Obsidian's own markdown rendering, preact reconciliation, IndexedDB, and the worker
import pipeline — all of which a real vault pays as well. Do not quote them as predictions of wall
time in a user's vault. When a user reports slowness, use the *shape* of the model (materialization
× blocks-on-screen, `FLATTEN` late, `SORT` after filtering) rather than these constants.

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
*Measured:* 318.6 ms → 31.4 ms on 5 000 rows, same output. Note `WHERE file.tasks` before the
`FLATTEN` also removes notes with no tasks — which `FLATTEN` would have dropped anyway
(`src/query/engine.ts:180`), so behaviour is unchanged.

### R3 — sort and group after filtering

```diff
- SORT file.mtime DESC
- WHERE contains(file.tags, "#active")
+ WHERE contains(file.tags, "#active")
+ SORT file.mtime DESC
```
`SORT` costs ~13× a filter per row; sorting the rows you are about to discard is pure waste.
This changes nothing about the result — sort is applied to whatever set reaches it.

### R4 — `LIMIT` early when you only need a sample

```diff
- FLATTEN file.lists AS L
- LIMIT 10
+ LIMIT 10
+ FLATTEN file.lists AS L
```
*Measured:* 344.6 ms → 0.8 ms. **This changes the result** (ten notes' worth of list items rather
than the first ten list items), so only apply it when the user wants a sample. When they want the
top N of a sorted list, `LIMIT` must stay after `SORT`.

### R5 — avoid `FLATTEN` when you only need a predicate or a count

```diff
- FLATTEN file.tasks AS T
- WHERE !T.completed
- GROUP BY file.link
+ WHERE any(map(file.tasks, (t) => !t.completed))
```
One row per note instead of one per task, and no deep copies. *Measured:* the lambda form costs
~6.6 µs/row against ~6 µs per *output* row for `FLATTEN` — a win whenever the array is longer than
one element and you do not need per-element rows.

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
On a 5 000-note vault with ten list items each this is ~160 ms of materialization plus ~300 ms of
copying, per refresh, per visible block. If the user needs it, at minimum add a `FROM` and a
`WHERE` before the `FLATTEN`.

---

## 4. Auditing a whole vault

### 4.1 Procedure

1. **Inventory.** Run the bundled scanner:
   `node scripts/audit-dataview-queries.mjs /path/to/vault`.
   It finds every ` ```dataview ` / ` ```dataviewjs ` block and every inline `` `= ` `` /
   `` `$= ` `` query, and ranks them by a static cost heuristic plus correctness traps.
2. **Confirm the shape**, not the scanner's guess: for the top offenders, check the actual size of
   the `FROM` (`TABLE length(rows) FROM <source> GROUP BY true` gives the page count) and whether
   any `FLATTEN` runs before its filters.
3. **Count blocks per note.** A note with many blocks pays all of them on every refresh; the scanner
   reports this.
4. **Check what is on screen**, not what exists. Only visible blocks recompute
   (`src/ui/markdown.tsx:261`), so a dashboard note matters far more than an archive note with the
   same query.
5. **Apply R1–R7 in order**, re-measuring perceived latency after each. R1 and R2 usually account
   for most of it.
6. **Only then** consider R9 (settings) or moving work to DataviewJS.

### 4.2 What the scanner flags

Cost signals: no `FROM`; a negated source; an incoming-link source; `FLATTEN` before a `WHERE`;
`FLATTEN` of `file.lists`/`file.tasks`; more than one `FLATTEN`; `SORT`/`GROUP BY` before `WHERE`;
no `LIMIT` on an unfiltered query; link indexing inside a filter; many blocks in one note.

Correctness signals (from `SKILL.md` §"Traps"): `SORT` directly after a bare `LIST`/`TABLE`; a bare
`YYYY-MM-DD` used as an expression; `<`/`<=`/`!=` against a field with no null guard; mixed
`and`/`or` without parentheses; `sum`/`average` over `rows.x` without `nonnull`; a second `FROM`;
a folder source with a trailing slash; `contains` where `econtains` is meant; `regexmatch` with an
unanchored-looking pattern; hyphenated arithmetic (`a-b`).

Everything it reports is a **candidate**, not a verdict. It parses text, not queries; confirm before
rewriting.
