# Reference: CSV sources and external data

CSV behaviour in DQL and DataviewJS at `blacksmithgu/obsidian-dataview` tag `0.5.70`.

## Contents

1. [DQL CSV sources](#1-dql-csv-sources)
2. [Typing and field names](#2-typing-and-field-names)
3. [Path resolution and caching](#3-path-resolution-and-caching)
4. [DataviewJS I/O](#4-dataviewjs-io)
5. [Joins and shaping](#5-joins-and-shaping)
6. [CSV troubleshooting](#6-csv-troubleshooting)

---

## 1. DQL CSV sources

Use a CSV as the row source:

```dataview
TABLE name, amount
FROM csv("Data/ledger.csv")
WHERE typeof(amount) = "number"
SORT amount DESC
```

CSV rows are not pages:

- their row ID is `<csv-path>#<zero-based-row-index>`;
- they have column fields, not `file.*`;
- page-only sources cannot be joined to them in DQL;
- `TASK FROM csv(...)` yields no task rows because task execution only serializes paths found in the
  page index (`src/query/engine.ts:400`);
- `CALENDAR` can use a CSV column when its expression evaluates to a date.

The source parser accepts local paths, `http(s)://` and `file://`
(`src/data-index/index.ts:350`).

## 2. Typing and field names

Papaparse runs with `dynamicTyping`, then each value goes through Dataview's frontmatter retyping
(`src/data-import/csv.ts:13`). A column can therefore contain a mixture of numbers, dates,
durations, booleans and strings across rows.

Every column is available under:

- its raw header;
- its canonical Dataview name, unless that alias collides.

**Recommendation.**

- keep one type per column;
- use stable non-empty headers;
- avoid duplicate headers;
- inspect `typeof(column)` before numeric/date comparisons;
- add an explicit unique ID column when rows need stable identity across CSV reorderings.

The generated `<path>#<index>` ID changes when rows are inserted or reordered.

## 3. Path resolution and caching

CSV paths are resolved relative to the note containing the query
(`src/data-index/resolver.ts:23`). Moving the query note can therefore change which file it reads.

The CSV cache:

- retains an entry for five minutes;
- flushes local CSV entries on vault modify/delete;
- cannot receive vault events for remote URLs (`src/data-index/index.ts:306`).

If a local CSV is stale, modify/save it or rebuild the current view. If a remote CSV is stale, wait
for cache expiry or reload Dataview. Do not treat a five-minute remote result as real-time data.

Remote and `file://` sources expand the trust boundary. A query can disclose a URL in the note and
depends on network, host permissions and remote availability. Prefer vault-local data for durable
dashboards.

## 4. DataviewJS I/O

```js
const rows = await dv.io.csv("Data/ledger.csv");
if (!rows) {
    dv.paragraph("CSV could not be loaded");
} else {
    dv.table(["Name", "Amount"], rows.map(row => [row.name, row.amount]));
}
```

- `dv.io.csv` returns `Promise<DataArray | undefined>`;
- `dv.io.load` returns raw text and can load non-CSV files;
- `dv.io.normalize` resolves a path without reading it;
- all paths default relative to the current note.

Always `await` I/O and handle `undefined`. DataviewJS errors otherwise replace the whole block with
an evaluation error.

## 5. Joins and shaping

DQL has no general join between CSV rows and pages. Use DataviewJS:

```js
const rows = await dv.io.csv("Data/ledger.csv") ?? dv.array([]);
const pagesById = new Map(dv.pages("#account").map(page => [page["account-id"], page]));
const joined = rows
    .map(row => ({ row, page: pagesById.get(row["account-id"]) }))
    .where(item => item.page);
dv.table(
    ["Account", "Amount"],
    joined.map(item => [item.page.file.link, item.row.amount])
);
```

Normal JavaScript object identity is not Dataview equality. For link/date join keys use a stable
string key or `dv.equal`.

For large data, build a `Map` once as above. Repeated `.find()` over all pages for every CSV row is
quadratic.

## 6. CSV troubleshooting

1. Resolve the path with `dv.io.normalize(path)`.
2. Confirm whether it is relative to the current query note.
3. Run `TABLE WITHOUT ID typeof(column), column FROM csv("...")`.
4. Check header spelling and canonical name.
5. Check whether mixed column values changed type.
6. Distinguish a cached remote result from a failed refresh.
7. In DataviewJS, confirm `await` and handle `undefined`.
8. For joins, log both key types and normalized values.
9. Do not expect `file.*` on CSV rows.
