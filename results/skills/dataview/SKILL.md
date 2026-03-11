---
name: obsidian-dataview-plugin
description: Deep, source-verified expertise in the Obsidian Dataview plugin. Use for DQL, DataviewJS, inline queries, metadata/schema design, tasks, CSV, settings and rendering, wrong or missing results, slow dashboards, upgrades, and writing or reviewing an optimal query.
source: blacksmithgu/obsidian-dataview
version: 0.5.70
basis: source
---

# Dataview expert

## Research question and scope

Act as a practical expert for someone who has installed Dataview: explain exactly what a query sees
and returns, write the smallest correct query from an intent, diagnose missing/wrong/duplicated
results, review cost and maintainability, and help the user design metadata that stays queryable.

In scope are DQL, inline DQL, DataviewJS, the index and value model, page/list/task metadata, CSV,
settings, rendering modes, refresh behaviour, performance, upgrades, and coexistence with task
plugins. Datacore, general Obsidian plugin development, CSS design, and undocumented behaviour after
the pinned release are excluded. A live Obsidian run is required for renderer, cache, rewrite, or
device-specific claims that source inspection cannot reproduce.

This skill is the authoritative operational artifact with identifier `dataview`; no paired deep dive
currently exists.

## Sources and evidence

- **Primary, authoritative:** `blacksmithgu/obsidian-dataview`, tag `0.5.70`, commit
  `77ab745aee787d519642a87ed8f68be12fdc4b0d`. Implementation, bundled documentation, tests,
  manifest, and changelog were inspected. Citations such as `src/query/engine.ts:50` are relative to
  that checkout.
- **Supplementary:** `obsidian-api`, commit
  `cc1744324150c632416857c98964f87b1574a5fc`, for the host metadata-cache contract; citations use
  `obsidian-api@cc174432:obsidian.d.ts:3242`.
- **Supplementary:** `obsidian-help`, commit
  `a97de34c1a9f2381586f4f51070aeb9207c8a457`, for user-facing Properties behaviour; citations use
  `obsidian-help@a97de34c:Editing and formatting/Properties.md:206`.

The release tag is the reproducible identity. This tree's `manifest.json` and `package.json` still
say `0.5.68`; the release tag contains later release/rendering commits, so never infer the checkout
identity from the manifest alone (`manifest.json:4`, `package.json:3`, `CHANGELOG.md:1`).

Evidence labels used here and in the references:

- **Contract:** bundled documentation or public API.
- **Observed:** implementation or an executed pinned test.
- **Inference:** a conclusion from those facts.
- **Recommendation:** how to work safely or efficiently.
- **Unverified:** requires a live vault, another release, or mutable external evidence.

## Intake before answering

Obtain or state assumptions for:

1. exact Dataview version (`dv.api.version.current` inside DataviewJS);
2. exact query block, including fence language and clause order;
3. one row/page/task that must appear and one that must not;
4. the target note's frontmatter and relevant inline/task line;
5. observed indexed values (`typeof(field)`, `field`, and `file.frontmatter`);
6. relevant Dataview settings and whether the issue occurs in Source, Live Preview, or Reading view;
7. vault/source size when performance is involved.

Do not treat visually identical Markdown values as identical indexed values.

## Mental model

```text
Obsidian MetadataCache
        ↓
Dataview importer: parse pages, inline fields, lists/tasks; re-type values; add aliases
        ↓
FullIndex: pages + tag/link/prefix/CSV indices
        ↓                         every visible query re-runs after index revisions
FROM resolves paths → pages are freshly serialized → operations execute in written order
        ↓
TABLE/LIST/CALENDAR extraction or TASK collection → renderer
```

Operational consequences:

- If Obsidian's cache never reports a Markdown file or metadata, Dataview cannot index it
  (`src/data-index/index.ts:296`, `src/data-import/markdown-file.ts:13`).
- No `FROM` means the whole vault (`src/query/parse.ts:205`). There is no optimizer: `WHERE`,
  `SORT`, `LIMIT`, `GROUP BY`, and `FLATTEN` run in written order (`src/query/engine.ts:50`).
- Pages are serialized afresh per query; list items are serialized with them
  (`src/data-model/markdown.ts:122`).
- A row whose expression throws during several operations is dropped and recorded internally; if
  other rows survive, the rendered output can look plausible (`src/query/engine.ts:61`,
  `src/query/engine.ts:76`, `src/query/engine.ts:124`, `src/query/engine.ts:176`).
- Missing fields evaluate as `null`; `null` sorts below non-null values. Therefore
  `WHERE due < date(today)` includes undated notes (`src/expression/context.ts:64`,
  `src/data-model/value.ts:176`).
- `FLATTEN` changes cardinality and deep-copies each output row; an empty array deletes the input row
  (`src/query/engine.ts:176`).
- `GROUP BY` changes row shape to a group key plus `rows`; later operations and output may use those
  values and can sort groups by expressions such as `length(rows)` (`src/query/engine.ts:143`).

Use [reference/data-model.md](reference/data-model.md) whenever a field's name, origin, type,
cardinality, link, date, tag, list, or task semantics matter.

## Diagnose in layers

Test the earliest failing layer; do not rewrite the final query blindly.

| Layer | Cheapest decisive probe | Meaning of failure |
|---|---|---|
| Host/cache | Is it `.md`/`.markdown`; does Obsidian Properties/metadata cache see it? | Not a DQL problem. |
| Index | `TABLE typeof(x), x, file.frontmatter WHERE file.path = "…"` | Import, alias, type, or cardinality problem. |
| Source | Reduce to `TABLE file.link FROM <source>` | `FROM`, path, tag, or link resolution problem. |
| Page filter | Replace operations with one `WHERE` at a time | Null/type/precedence/vectorization/evaluation problem. |
| Row shape | Re-add `FLATTEN` and `GROUP BY` separately | Cardinality or post-transform scope problem. |
| Output | Re-add columns, sorting, limiting, then rendering | Extraction/order/settings/view problem. |

For a missing page/task:

1. remove `FROM`; if it appears, inspect source syntax and path resolution;
2. use `WHERE true`; if it appears, bisect each predicate;
3. inspect `typeof(x)` and the actual value, not just raw YAML;
4. state whether missing values should match;
5. check scalar versus list and exact versus substring membership;
6. move `FLATTEN`/`GROUP BY` out, then restore them;
7. for `TASK`, distinguish page selection from task filtering and child re-nesting;
8. if source text and index disagree, trigger a Dataview refresh/restart and inspect settings/cache.

The symptom-indexed catalogue and precise probes are in
[reference/debugging.md](reference/debugging.md). For live target inspection, use the bundled
[Dataview doctor](assets/dataview-doctor/view.js).

## Write a query from intent

Make these decisions explicitly:

1. **Level:** page (`TABLE`, `LIST`, `CALENDAR`) or task (`TASK`).
2. **Positive source:** the narrowest tag/folder/link source that can contain the answer.
3. **Missing-value policy:** include, exclude, or separately display missing values.
4. **Type:** compare date with date, duration with duration, number with number.
5. **Cardinality:** scalar/list; keep a page row or intentionally `FLATTEN`.
6. **Pipeline order:** cheap selective filters before link traversal/regex, `FLATTEN`, sort, and group.
7. **Output shape:** page rows, transformed rows, or grouped rows; stable order and meaningful limit.
8. **Validation examples:** one required inclusion and exclusion plus observed types.

Default skeleton:

````text
```dataview
TABLE WITHOUT ID file.link AS "Note", due, status
FROM "Projects"
WHERE typeof(due) = "date" AND status = "open"
SORT due ASC
LIMIT 50
```
````

Intent translations:

| Intent | DQL |
|---|---|
| exact tag on a page | `WHERE econtains(file.etags, "#project")` |
| overdue, undated excluded | `WHERE typeof(due) = "date" AND due < date(today)` |
| status is one of several | `WHERE econtains(list("open", "blocked"), status)` |
| one row per tag | `FLATTEN file.etags AS tag` |
| groups by size | `GROUP BY status` then `SORT length(rows) DESC` |
| grouped numeric sum, null ignored | `sum(nonnull(rows.hours))` |
| open tasks | `TASK ... WHERE !completed` |
| exact tag on the task itself | `TASK ... WHERE econtains(tags, "#next")` |

`TASK FROM #next` first selects pages tagged `#next`, then returns tasks from those pages; it does
not mean “tasks carrying exactly this tag” (`src/query/engine.ts:394`). Read
[reference/tasks-and-mutation.md](reference/tasks-and-mutation.md) before advising on status
characters, completion-date writing, child tasks, or interoperability with Obsidian Tasks.

The full grammar, sources, operation semantics, expressions, operators, and functions are in
[reference/query-language.md](reference/query-language.md).

## High-risk correctness traps

- Bare `2026-08-01` in DQL is subtraction; use `date(2026-08-01)`.
- `and` and `or` share a precedence level and associate left-to-right; parenthesize mixed logic
  (`src/expression/parse.ts:579`).
- `<`, `<=`, and `!=` can include missing values because of null ordering.
- `contains()` on string list elements performs substring matching; use `econtains()` for exact
  membership (`src/expression/functions.ts:454`).
- Many functions vectorize. A non-empty returned array is truthy, even if it contains `false`
  (`src/expression/functions.ts:109`, `src/data-model/value.ts:294`).
- `sum(rows.x)`/`average(rows.x)` can fail on missing group values; use `nonnull` only if ignoring
  absence matches the intent.
- A bare field after `GROUP BY` is not a page field; use `key`, the group alias, or `rows.field`.
- `LIST`/`TABLE` with no output expression followed immediately by `SORT` can be parsed as a header
  expression; add an expression or a semantics-preserving operation first (`src/query/parse.ts:135`).
- YAML quotes do not guarantee “text” because Dataview performs a second parse for dates, durations,
  and links. Quoting an ISO date may also change whether Obsidian supplies a JS `Date` or a string;
  inspect `typeof()` rather than prescribing quotes as a universal fix
  (`src/data-import/markdown-file.ts:338`, `src/data-import/markdown-file.ts:355`).
- Canonical names can merge spellings such as `Due Date` and `due-date`; repeated values can become a
  list (`src/util/normalize.ts:100`, `src/data-import/markdown-file.ts:387`).

## Performance review

Review in this order:

1. add/narrow a positive `FROM`;
2. place cheap selective `WHERE` operations before `SORT`, `GROUP BY`, link resolution, and regex;
3. filter page rows before `FLATTEN`, and avoid Cartesian products from repeated `FLATTEN`;
4. bound output only when the chosen `LIMIT` position preserves semantics;
5. reduce concurrently visible query blocks;
6. profile repeated live runs under the same cache and view conditions.

Static warnings are candidates, not proof: a whole-vault query may be intentional, and an incoming
link source may be the correct expression of intent. See
[reference/performance.md](reference/performance.md) for the source-derived cost model and rewrite
catalogue.

## DQL, DataviewJS, CSV, and settings boundaries

Prefer DQL when it expresses the result. Use DataviewJS for recursive traversal, joins, custom
rendering, or programmatic composition. Treat it as executable vault code: it can reach `dv.app`,
filesystem adapters, network APIs, and the DOM; await asynchronous APIs and bind cleanup to
`dv.component`. See [reference/dataviewjs.md](reference/dataviewjs.md).

For CSV path resolution, typing, joins, cache behaviour, and `dv.io.csv`, use
[reference/csv.md](reference/csv.md). For metadata naming, locations, schema contracts, and
migrations, use [reference/metadata-design.md](reference/metadata-design.md).

Regular inline DQL is enabled by default. The two JavaScript enable booleans are disabled by default;
the DataviewJS fence keyword is a configurable string, not a third toggle (`src/settings.ts:96`).
Rendering, refresh, date formats, result counts, Live Preview differences, and export boundaries are
covered in [reference/settings-and-rendering.md](reference/settings-and-rendering.md). Version,
mobile, upgrade, and plugin-boundary checks are in
[reference/compatibility.md](reference/compatibility.md).

## Bundled tools

All tools are read-only. Run from the copied skill directory:

| Tool | Purpose |
|---|---|
| [`dataview-query-lint.mjs`](scripts/dataview-query-lint.mjs): `node scripts/dataview-query-lint.mjs /vault` | Settings-aware DQL/inline/DataviewJS static lint with location, severity, confidence, and fix safety. |
| Exact query lint: `node scripts/dataview-query-lint.mjs /vault --source-root /checkout --format sarif` | Adds exact syntax and AST checks using the supplied upstream parser; needs that checkout's installed dev dependencies. |
| [`dataview-vault-lint.mjs`](scripts/dataview-vault-lint.mjs): `node scripts/dataview-vault-lint.mjs /vault --all` | Audits field spelling, types, cardinality, authoring location, duplicate YAML keys, reserved task fields, and tag casing. |
| [`audit-dataview-queries.mjs`](scripts/audit-dataview-queries.mjs): `node scripts/audit-dataview-queries.mjs /vault` | Compatibility entry point for the original scanner; new automation should use the query linter. |
| `assets/dataview-doctor/` | Copy into the vault and call with `await dv.view("path/dataview-doctor", input)` for indexed target snapshots, DQL expression checks, full-query target presence, and repeated timings. |
| [`test.mjs`](scripts/test.mjs): `node scripts/test.mjs` | Cheap fixture integration tests; add `--source-root /checkout` for exact parser coverage. |
| [`verify.mjs`](scripts/verify.mjs): `node scripts/verify.mjs --source-root /checkout` | Formal artifact, citation, source-identity, link, script, and invariant verification. |

The static modes are portable and dependency-free on Node 18+. They deliberately do not parse all
YAML or execute queries against Obsidian's live index. Never auto-apply intent-sensitive rewrites;
use findings to formulate a corrected query and validate it against examples.

## Validate before handoff

1. lint the exact note/query and inspect every warning, including false-positive rationale;
2. run the source-only query, then restore one operation at a time;
3. check observed type/cardinality for every compared or flattened field;
4. assert one positive and one negative example and compare result count;
5. rerun in the user's rendering mode after refresh;
6. for optimization, compare repeated median timings and verify identical result paths/order;
7. state version, settings assumptions, remaining uncertainty, and any live-only check not performed.

## Limitations and conflicts

- Source-backed behaviour is not a substitute for a live Obsidian renderer or MetadataCache. Task
  rewriting, refresh races, CSS, export, and mobile UI require a controlled vault check.
- Dataview's documentation describes `contains(list, value)` as equality-like while implementation
  recurses to substring matching; this skill follows the observed implementation and recommends
  `econtains` for exact membership.
- The static metadata auditor intentionally covers flat scalar/list frontmatter and Dataview inline
  fields, not the full YAML specification. It labels schema inference rather than claiming live
  indexed truth.
- Static cost rules cannot know source cardinality, view visibility, device load, or user intent.
- The checked-in live doctor is syntax-checked and mock-executed, but not E2E-tested in Obsidian.
- Behaviour after `0.5.70`, Datacore migration, and upstream issue status are unverified here.

## Reference map

Load only what the question needs:

| Reference | Use |
|---|---|
| [query-language](reference/query-language.md) | Complete DQL grammar, sources, pipeline, expressions, operators, and functions. |
| [data-model](reference/data-model.md) | Indexed page/list/task values, aliases, types, dates, links, and implicit fields. |
| [debugging](reference/debugging.md) | Symptom-led diagnosis and minimal probes. |
| [performance](reference/performance.md) | Cost model, profiling, and semantics-preserving rewrites. |
| [DataviewJS](reference/dataviewjs.md) | API, DataArray, async/rendering/lifecycle/security. |
| [metadata design](reference/metadata-design.md) | Naming, schema contracts, properties, migration, and intake. |
| [settings and rendering](reference/settings-and-rendering.md) | Defaults, refresh, formats, views, export, and troubleshooting profiles. |
| [tasks and mutation](reference/tasks-and-mutation.md) | Task model, source rewriting, completion settings, and plugin coexistence. |
| [CSV](reference/csv.md) | DQL/JS loading, typing, paths, joins, and cache. |
| [compatibility](reference/compatibility.md) | Version identity, mobile, upgrade procedure, and boundaries. |
| [tooling](reference/tooling.md) | Linter modes/rules, live-doctor input, exit codes, CI, and safe interpretation. |

## Repository-only verification

This is the only section to remove when extracting the directory. From the research repository root:

```sh
node results/skills/dataview/scripts/test.mjs \
  --source-root research/plugins/blacksmithgu/obsidian-dataview
node results/skills/dataview/scripts/verify.mjs \
  --source-root research/plugins/blacksmithgu/obsidian-dataview
```

The verifier anchors identity in source contents rather than Git state and checks every local link and
line citation. The fixture test is the cheap integration boundary; no Obsidian E2E claim is made.
Update order after a pin move: verify source invariants, update references, update this operational
summary, regenerate the source fingerprint, then rerun both commands.
