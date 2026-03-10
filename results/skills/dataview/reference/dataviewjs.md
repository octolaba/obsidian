# Reference: DataviewJS

The JavaScript API at `blacksmithgu/obsidian-dataview` tag `0.5.70`. Citations are `path:line` in
that repository.

## Contents

1. [Settings and security gates](#1-gates-and-what-a-user-sees-when-they-are-closed)
2. [Choosing DQL or DataviewJS](#2-choosing-between-dql-and-dataviewjs)
3. [The `dv` API](#3-the-dv-surface)
4. [`DataArray`](#4-dataarray)
5. [Patterns](#5-patterns)
6. [JavaScript-specific traps](#6-traps-specific-to-js)
7. [External API access](#7-using-the-api-from-another-plugin-or-from-the-console)

---

## 1. Gates, and what a user sees when they are closed

The execution gates at their defaults (`src/settings.ts:96`):

| Setting | Governs |
|---|---|
| `enableInlineDataview` | Inline DQL; **on** by default. |
| `enableDataviewJs` | ` ```dataviewjs ` blocks; **off** by default. |
| `enableInlineDataviewJs` | `` `$= …` ``; **off** by default and requires `enableDataviewJs` as well (`src/ui/views/js-view.ts:56`). |
| `dataviewJsKeyword` | Fence keyword, default `dataviewjs`; it is a string setting, not an enable switch. Changing it needs a reload. |

Closed gates are visible, not silent: a block renders
`Dataview JS queries are disabled. You can enable them in the Dataview settings.`
(`src/ui/views/js-view.ts:19`); an inline query is replaced by the text
`(disabled; enable in settings)` (`src/ui/views/js-view.ts:58`).

A file whose path contains `?no-dataview` renders every Dataview construct as inert code, JS
included (`src/api/plugin-api.ts:461`, `src/api/plugin-api.ts:610`).

**Security.** The block body is `eval`'d in the Obsidian renderer process with `this` bound to the
API object (`src/api/inline-api.ts:413`, `src/api/inline-api.ts:422` — the async wrapper kicks in when the script contains
`await`), preceded by `const dataview = this; const dv = this;` (`src/ui/views/js-view.ts:7`).
`dv.view` instead compiles its file with `new Function("dv", "input", …)`
(`src/api/inline-api.ts:350`). Either way it has the full Electron surface: `dv.app`, the vault adapter,
`require`, network access. Treat a `dataviewjs` block copied from a forum exactly like an
unsigned script (`docs/docs/queries/dql-js-inline.md:94`). Never hand a user a JS block when DQL
expresses the same thing.

---

## 2. Choosing between DQL and DataviewJS

**Use DQL unless one of these is true.** DQL needs no opt-in, is safe to share, is easier to debug,
and — because DataviewJS re-runs the same materialization plus your code — is not automatically
slower.

Reach for JS when you need:

- **recursion or graph traversal** — following links N hops, building a tree;
- **cross-source joins** — combining a CSV with pages, or pages with pages, on a key;
- **custom rendering** — arbitrary HTML, headers between sections, conditional output;
- **reusable views** — `dv.view(path, input)` loads a `.js` (plus optional `.css`) from the vault
  and runs it (`src/api/inline-api.ts:317`), the only real "saved query" mechanism;
- **imperative aggregation** DQL cannot express — running totals, windowed calculations, anything
  needing intermediate state;
- **asynchronous IO** — `dv.io.load`, `dv.io.csv`.

Do **not** reach for JS merely to work around a DQL trap: null comparisons, vectorization and
type mismatches all reappear in JS, because `dv.pages()` returns the same values.

---

## 3. The `dv` surface

Constructed per block as `DataviewInlineApi` (`src/api/inline-api.ts:40`), delegating to the shared
`DataviewApi` (`src/api/plugin-api.ts:77`).

### Data access

| Call | Returns |
|---|---|
| `dv.current()` | The serialized page containing the block. |
| `dv.page(path\|link)` | One serialized page, or `undefined`. Resolves like a wiki link, relative to the current file. |
| `dv.pages(source?)` | `DataArray` of pages. **The argument is a `FROM` source string**, not a predicate: `dv.pages('#book and -"archive"')`. Empty/omitted means the whole vault. |
| `dv.pagePaths(source?)` | `DataArray` of path strings — cheaper than `pages()` when you only need paths, because it skips serialization. |
| `dv.io.csv(path)` | `Promise<DataArray>`; the `await` is required. |
| `dv.io.load(path)` | `Promise<string>` — raw file contents. This is the only way to reach note **body text**. |
| `dv.io.normalize(path)` | Resolve a relative path against the current file. |

`dv.pages()` wraps `file.*` array fields in `DataArray`s (`src/api/plugin-api.ts:162`), so
`page.file.tasks.where(...)` works directly.

### Query execution from JS

| Call | Returns |
|---|---|
| `await dv.query(dql)` | `Result<QueryResult, string>` — check `.successful`, then `.value`. Shape depends on query type (`src/api/plugin-api.ts:584`). |
| `await dv.tryQuery(dql)` | Same, throwing on failure. |
| `await dv.queryMarkdown(dql)` | The rendered result as a Markdown string. |
| `await dv.tryQueryMarkdown(dql)` | Throwing form of `queryMarkdown`. |
| `dv.evaluate(expr, ctx?)` | Evaluate a DQL **expression** with optional variable bindings; returns a `Result`. |
| `dv.tryEvaluate(expr, ctx?)` | Throwing version. |
| `await dv.execute(dql)` | Run a DQL query and render it **into this block**. |
| `await dv.executeJs(js)` | Execute and render another JavaScript fragment; retain the same security warning as the containing block. |

`dv.query` is the pragmatic bridge: express the filtering in DQL, post-process in JS.

### Rendering

`dv.list(values)`, `dv.table(headers, rows)`, `dv.taskList(tasks, groupByFile?)`,
`dv.header(level, text)`, `dv.paragraph(text)`, `dv.span(text)`, `dv.el(tag, text, options?)`,
`dv.view(path, input)`, `dv.container` (the raw `HTMLElement`), `dv.markdownTable/List/TaskList(...)`
for producing Markdown strings instead of DOM.

Values are rendered with Dataview's own renderer, so links, dates and durations format correctly and
Markdown inside strings is rendered (`src/ui/markdown.tsx:92`).

### Utilities

`dv.array(x)`, `dv.isArray`, `dv.isDataArray`, `dv.fileLink/sectionLink/blockLink`, `dv.date(x)`,
`dv.duration(x)`, `dv.parse(text)` (inline-field typing), `dv.literal(x)` (frontmatter typing),
`dv.clone(x)`, `dv.compare(a, b)`, `dv.equal(a, b)`, `dv.value` (the `Values` namespace),
`dv.widget`, `dv.luxon`, `dv.func.<name>` (every DQL function, context-bound —
`src/api/plugin-api.ts:98`), `dv.api.version.current` / `.compare(op, v)` / `.satisfies(range)`,
`dv.app`, `dv.index`, `dv.component`, `dv.currentFilePath`, `dv.settings`.

`dv.func` is the escape hatch worth remembering: `dv.func.striptime`, `dv.func.dateformat`,
`dv.func.contains` behave exactly as in DQL, vectorization included.

---

## 4. `DataArray`

A proxy-wrapped immutable array (`src/api/data-array.ts:185`). Every method returns a new
`DataArray`, except `mutate` and `sortInPlace`.

| Method | Notes |
|---|---|
| `where(f)` / `filter(f)` | Aliases. |
| `map(f)`, `flatMap(f)` | `flatMap` skips empty results. |
| `limit(n)`, `slice(s, e)`, `concat(other)` | |
| `sort(key, "asc"\|"desc", cmp?)` | Uses Dataview's comparator by default — so `null` first, cross-type by type name. |
| `sortInPlace(key, dir, cmp?)` | Mutates; faster. |
| `groupBy(key, cmp?)` | Sort-then-merge, like DQL's `GROUP BY`. Produces `{ key, rows }`. |
| `groupIn(key)` | Groups **inside** existing groups — recursive grouping without rebuilding. |
| `distinct(key?, cmp?)` | |
| `every`, `some`, `none`, `find`, `findIndex`, `includes`, `indexOf` | `includes`/`indexOf` use Dataview's comparator, so they match by value, including links and dates. |
| `first()`, `last()` | `undefined` when empty. |
| `sum()`, `avg()`, `min()`, `max()` | Added in 0.5.67 (`CHANGELOG.md:17`). |
| `to(key)` | Map to a field **and flatten** — the swizzle. |
| `into(key)` | Map to a field without flattening. |
| `expand(key)` | Recursively flatten a tree by a key — the idiomatic way to walk `children`. |
| `array()` | Back to a plain JS array. |
| `join(sep?)`, `forEach(f)`, `length` | |

**Any unknown property access is `to(prop)`** (`src/api/data-array.ts:193`). That is how
`pages.file.name` works — and it means a typo returns an array of `undefined`s rather than throwing.
It also means a field whose name collides with a method name (`map`, `sort`, `limit`, `first`,
`join`, `length`, `values`, `array`, `settings`, …) is **shadowed by the method**
(`src/api/data-array.ts:144`). Reach such a field with `page["sort"]` or `.into("sort")`.

---

## 5. Patterns

**Group and render with headers:**

```js
for (let group of dv.pages("#book").groupBy(b => b.genre)) {
    dv.header(3, group.key);
    dv.table(["Title", "Rating"], group.rows.map(b => [b.file.link, b.rating]));
}
```

**Let DQL do the filtering, JS do the shaping:**

```js
const res = await dv.query(`
    TABLE file.link, due
    FROM "Projects"
    WHERE due AND due < date(today)
`);
if (!res.successful) { dv.paragraph("Query failed: " + res.error); }
else { dv.table(res.value.headers, res.value.values); }
```

**Walk a link graph (not expressible in DQL):**

```js
function descendants(path, seen = new Set()) {
    if (seen.has(path)) return seen;
    seen.add(path);
    for (const link of dv.page(path)?.file.outlinks ?? []) descendants(link.path, seen);
    return seen;
}
dv.list([...descendants(dv.current().file.path)].map(p => dv.fileLink(p)));
```

**Read body text — the only way:**

```js
const text = await dv.io.load(dv.current().file.path) ?? "";
dv.paragraph("Words: " + text.split(/\s+/).length);
```

**A reusable view** — put `Views/tagcloud/view.js` (and optionally `view.css`) in the vault, then
`await dv.view("Views/tagcloud", { folder: "Zettel" })`. The file body is wrapped in an async IIFE
if it contains `await` (`src/api/inline-api.ts:348`), and receives `dv` and `input`.

---

## 6. Traps specific to JS

| Trap | Effect |
|---|---|
| Forgetting `await` on `dv.query`, `dv.io.*`, `dv.view` | Renders `[object Promise]` or nothing. |
| `dv.pages("status = 'open'")` | The argument is a **source**, not a predicate; this throws a parse error. Filter with `.where(...)`. |
| Field named like a `DataArray` method | Shadowed. Use `["name"]`. |
| Typo in a swizzle (`pages.flie.name`) | Returns an array of `undefined` — no error. |
| Comparing links or dates with JavaScript equality operators | Use `dv.equal(a, b)`; JavaScript compares object identity. |
| `.sort()` expectations | Dataview's comparator puts `null` first and orders cross-type by type name, not JS's string sort. |
| Mutating `dv.current()` or a page object | The outer serialized page is fresh, and `file.frontmatter` is deep-copied, but custom nested field values may still share index references (`src/data-model/markdown.ts:145`, `src/data-model/markdown.ts:154`). Use `dv.clone()` before mutation rather than relying on which layer was copied. |
| `console.log` of a `DataArray` | Prints the proxy. Use `.array()`. |
| Throwing inside the block | The whole block is replaced by `Evaluation Error: <stack>` (`src/ui/views/js-view.ts:32`). Wrap risky sections in `try/catch` and `dv.paragraph` the message. |
| Long loops | Run on the UI thread, on every refresh. Add your own `limit()`. |
| `dv.el`/`dv.container` DOM built outside the component lifecycle | Register cleanups on `dv.component` or they leak across refreshes. |

---

## 7. Using the API from another plugin or from the console

`window.DataviewAPI` is registered on load and removed on unload (`src/main.ts:63`); the plugin
object also exposes `app.plugins.plugins.dataview.api`. Both are the same `DataviewApi` documented
above minus the rendering helpers that need a container. `dv.index.revision` is the change counter
to poll; `metadataCache.on("dataview:index-ready")` and `"dataview:metadata-change"` are the events
(`src/data-index/index.ts:85`, `src/data-index/index.ts:152`).

For diagnosing a data question, `console.log(DataviewAPI.page("Some Note"))` in the developer
console is the ground truth about what any query can see.
