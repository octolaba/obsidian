# Reference: settings, editor modes, rendering and export

User-visible settings and rendering behaviour at `blacksmithgu/obsidian-dataview` tag `0.5.70`.
Defaults are implementation facts; recommended profiles are recommendations.

## Contents

1. [Execution settings](#1-execution-settings)
2. [View and refresh settings](#2-view-and-refresh-settings)
3. [Formatting and table settings](#3-formatting-and-table-settings)
4. [Reading View and Live Preview](#4-reading-view-and-live-preview)
5. [Rendering and export boundaries](#5-rendering-and-export-boundaries)
6. [Recommended profiles](#6-recommended-profiles)
7. [Settings troubleshooting](#7-settings-troubleshooting)

---

## 1. Execution settings

Defaults come from `src/settings.ts:96`.

| Setting | Default | Operational effect |
|---|---:|---|
| `enableInlineDataview` | `true` | Executes inline DQL using `inlineQueryPrefix`. |
| `enableDataviewJs` | `false` | Enables DataviewJS blocks. |
| `enableInlineDataviewJs` | `false` | Enables inline JS only when block JS is enabled too (`src/ui/views/js-view.ts:56`). |
| `inlineQueryPrefix` | `=` | Prefix inside an inline code span. |
| `inlineJsQueryPrefix` | `$=` | Prefix inside an inline code span. |
| `inlineQueriesInCodeblocks` | `true` | Allows inline query code spans inside full code blocks. |
| `dataviewJsKeyword` | `dataviewjs` | Fence language for JS; changing it requires reload (`src/main.ts:385`). |

The portable query linter reads `.obsidian/plugins/dataview/data.json` when present, so custom
prefixes and the custom JS keyword are discovered rather than guessed.

**Security recommendation.** Keep both JS switches off unless the vault contains reviewed code.
DataviewJS executes in the Obsidian renderer process with access to `dv.app`, filesystem adapters,
network and `require` (`src/api/inline-api.ts:413`).

## 2. View and refresh settings

| Setting | Default | Effect |
|---|---:|---|
| `showResultCount` | `true` | Adds result count to TABLE and TASK output. |
| `warnOnEmptyResult` | `true` | Shows “No results” instead of an empty view. |
| `renderNullAs` | `\-` | Markdown rendered for `null`. |
| `refreshEnabled` | `true` | Re-runs mounted views after index changes. |
| `refreshInterval` | `2500` ms | Debounce after files stop changing. Minimum accepted in UI is 100 ms (`src/main.ts:487`). |
| `maxRecursiveRenderDepth` | `4` | Object/array nesting rendered before `...`. |

Automatic refresh only updates a view whose container is shown
(`src/ui/markdown.tsx:261`). A correct query in a hidden tab can therefore look stale until shown.
The setting description warns that automatic refresh can interfere with embeds
(`src/main.ts:474`).

Commands available from the command palette:

- **Force refresh all views and blocks** — bumps the index revision and refreshes views
  (`src/main.ts:108`);
- **Drop all cached file metadata** — reinitializes the index (`src/main.ts:118`);
- **Rebuild current view** — reconstructs the active Markdown view (`src/main.ts:130`).

Use them in that order only as needed: render refresh, then index rebuild, then full Obsidian reload.

## 3. Formatting and table settings

| Setting | Default |
|---|---|
| `defaultDateFormat` | `MMMM dd, yyyy` |
| `defaultDateTimeFormat` | `h:mm a - MMMM dd, yyyy` |
| `tableIdColumnName` | `File` |
| `tableGroupColumnName` | `Group` |
| `allowHtml` | `true` for Markdown export |

The two date formats affect rendering and `string(date)`, not the stored Luxon value. Use
`dateformat()` when a query needs an explicit stable display independent of user settings.

`WITHOUT ID` removes the generated ID column; changing `tableIdColumnName` only renames it.
After `GROUP BY`, the default ID heading comes from the group field or group setting
(`src/query/engine.ts:350`).

## 4. Reading View and Live Preview

Two independent switches control pretty inline-field rendering:

- `prettyRenderInlineFields` for Reading View;
- `prettyRenderInlineFieldsInLivePreview` for Live Preview.

The editor extension for inline query execution is registered regardless of enable settings and
checks the switches when deciding what to render (`src/main.ts:214`, `src/ui/lp-render.ts:302`).
Consequences:

- Source Mode shows source markup.
- Live Preview may replace a code span or field only when the cursor/selection is not editing it.
- Reading View uses Markdown post-processors and can differ from Live Preview around nested markup,
  embeds and callouts.
- A path containing `?no-dataview` disables all Dataview rendering for that file
  (`src/api/plugin-api.ts:610`).

When a report is mode-specific, ask for the exact mode and whether the cursor is inside the field.

## 5. Rendering and export boundaries

DQL results are live views, not stored Markdown. Dataview is read-only except for checking tasks in
TASK views.

DataviewJS can produce Markdown strings with `dv.markdownTable`, `dv.markdownList`,
`dv.markdownTaskList` or `dv.queryMarkdown`. Exported tables use HTML lists for nested arrays and
objects when `allowHtml` is true (`src/ui/export/markdown.ts:57`).

Styling is outside DQL semantics:

- scope CSS with a note `cssclasses` property when possible;
- use `dv.container.classList.add(...)` for one DataviewJS view;
- avoid depending on undocumented DOM structure when a normal table/list selector suffices;
- test light/dark themes and narrow mobile widths;
- do not use CSS to hide data that should have been filtered from the query.

Large result sets cost twice: query execution and Markdown rendering per cell. Prefer a meaningful
`LIMIT`, summary rows, or drill-down links over a dashboard containing thousands of rendered cells.

## 6. Recommended profiles

**Safe default**

- inline DQL on;
- both JS modes off;
- automatic refresh on at 2500 ms;
- empty-result warning on;
- task completion tracking off.

**Large dashboard**

- narrow every `FROM`;
- increase refresh interval;
- keep automatic refresh only if live updates matter;
- reduce visible blocks and rendered rows;
- keep JS off unless it replaces several redundant DQL materializations.

**Reviewed automation**

- enable block JS only;
- leave inline JS off unless required;
- keep reusable code in `dv.view` files;
- review filesystem, network, `require`, DOM listeners and unbounded loops with the linter.

## 7. Settings troubleshooting

1. Read `.obsidian/plugins/dataview/manifest.json` and `data.json`.
2. Confirm the actual fence keyword and inline prefixes.
3. Confirm whether the problem occurs in Source Mode, Live Preview or Reading View.
4. For stale output, check `refreshEnabled`, container visibility and the index-ready console line.
5. For a plain code block, check plugin enablement, fence keyword and `?no-dataview`.
6. For inline output, distinguish regular inline DQL from inline JS; their gates differ.
7. For task checkbox behaviour, read `reference/tasks-and-mutation.md` before changing settings.

