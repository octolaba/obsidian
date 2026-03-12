# Settings, integrations, mobile, styling, and upgrades

Use this reference when behaviour differs by device, another plugin participates, CSS is involved,
the Tasks API is requested, or a version/settings change is planned.

## Contents

- [Settings that change semantics](#settings-that-change-semantics)
- [Compatibility and mobile](#compatibility-and-mobile)
- [Tasks API boundary](#tasks-api-boundary)
- [Other-plugin integrations](#other-plugin-integrations)
- [Styling boundary](#styling-boundary)
- [Integration diagnostic](#integration-diagnostic)
- [Upgrade and drift checklist](#upgrade-and-drift-checklist)
- [Validation](#validation)

## Settings that change semantics

Most settings apply immediately, but some require a restart
(`docs/Getting Started/Settings.md:9`). Capture the actual vault configuration rather than relying
on defaults.

High-impact families:

| Setting | What it changes |
|---|---|
| Global filter | which checkboxes Tasks indexes |
| Global query | hidden instructions added to every block |
| Task format | which metadata syntax is read/written |
| Status definitions | type, name, and toggle cycle for every checkbox symbol |
| Date tracking | automatic created/done/cancelled dates |
| Filename-as-scheduled | invisible scheduled dates; requires restart |
| Recurrence options | new occurrence position and scheduled-date handling |
| Auto-Suggest | trigger, minimum text, suggestion count |
| JavaScript searches | permits custom code; device-local and off by default |
| Presets | named query fragments available to blocks |

The implementation defaults and schema are in `src/Config/Settings.ts:66` and
`src/Config/Settings.ts:112`. Status presets and definitions are managed separately
(`src/Config/StatusSettings.ts:20`).

Do not treat `.obsidian/plugins/obsidian-tasks-plugin/data.json` as the complete runtime state:
JavaScript enablement is stored in device-local storage
(`src/Config/EnableJsInTasksQueries.ts:15`).

## Compatibility and mobile

The pinned manifest requires Obsidian 1.8.7 and is not desktop-only
(`manifest.json:5`, `manifest.json:11`). “Supported on mobile” does not prove every workflow is
equally ergonomic:

- the edit modal may require scrolling on small screens
  (`docs/Editing/Create or edit Task.md:278`);
- keyboard access keys/hotkeys are desktop-oriented and can conflict
  (`docs/Editing/Create or edit Task.md:289`);
- custom regular-expression features may differ by JavaScript engine;
- plugin load order/editor integrations can differ.

**Recommendation:** validate create, edit, toggle, query render, and any custom JS/regex on every
device class that matters.

## Tasks API boundary

Tasks exposes `apiV1` at
`app.plugins.plugins['obsidian-tasks-plugin'].apiV1`
(`docs/Advanced/Tasks Api.md:14`). It has three operations:

1. open the create modal and return Markdown;
2. open the edit modal for supplied Markdown and return Markdown;
3. transform/toggle a supplied line and path
   (`src/Api/TasksApiV1.ts:4`).

It does **not** edit the caller's file automatically, and it has no search API
(`docs/Advanced/Tasks Api.md:182`). `editTaskLineModal()` returning an empty string is ambiguous
between cancel and deletion by completion action (`docs/Advanced/Tasks Api.md:184`).

For automation, preserve the caller's file/line update transaction, handle cancellation, and test
recurrence returning multiple lines.

## Other-plugin integrations

Claims below are limited to the pinned Tasks documentation/source.

### Dataview

Tasks' Dataview **format** is only a serializer choice; it does not delegate indexing to Dataview.
If a Dataview-rendered checkbox is completed, a done date may be added, but the next recurrence is
not created; use a Tasks toggle path for recurrence
(`docs/Other Plugins/Dataview.md:29`, `docs/Other Plugins/Dataview.md:41`).

### Kanban and extended editors

Extended editors can implement `showTasksPluginAutoSuggest` to request/hide/defer Tasks
Auto-Suggest (`docs/Advanced/Tasks Api.md:139`). Outside a `MarkdownView`, dependency suggestions
cannot create `id`/`dependsOn` fields (`docs/Advanced/Tasks Api.md:167`).

Do not claim current Kanban behaviour without separately pinning and inspecting Kanban.

### QuickAdd and other scripts

The create-modal API can provide a task line to QuickAdd-style automation
(`docs/Advanced/Tasks Api.md:60`). The automation still owns insertion, path choice, escaping, and
error handling.

### Meta Bind and query builders

Tasks documents Meta Bind as a way to generate interactive query inputs. Treat generated text as an
ordinary Tasks query: lint it, inspect `explain`, and preserve the same security boundary for
custom functions.

### Reminder/notifications

Notifications are outside Tasks' date model, which has no times
(`docs/Getting Started/Dates.md:216`). Compatibility claims about Reminder or notification plugins
are mutable external evidence. Mark them **Unverified** unless that plugin/version is pinned and
tested.

## Styling boundary

Rendered Tasks results and Reading view expose plugin CSS classes and data attributes
(`docs/Advanced/Styling.md:14`). Prefer documented stable surfaces such as:

- `.plugin-tasks-query-result`;
- `.task-list-item`;
- `.task-description`, `.task-priority`, `.task-due`, and other field classes;
- `data-task-status-type`, `data-task-status-name`, `data-task-priority`, and date attributes
  (`docs/Advanced/Styling.md:106`, `docs/Advanced/Styling.md:169`).

Limitations:

- these plugin classes are not present on ordinary Markdown in Source/Live Preview;
- filename-inferred scheduled dates are not exposed to CSS
  (`docs/Advanced/Styling.md:179`, `docs/Advanced/Styling.md:184`).

Diagnose CSS by disabling snippets/theme, inspecting the rendered element, and checking whether the
target view actually receives Tasks classes. Avoid undocumented DOM-position selectors when a
documented class/data attribute exists.

## Integration diagnostic

When another plugin is in the path:

1. identify which plugin parsed the line and which rendered it;
2. identify which plugin handled the click/status change;
3. reproduce using Tasks alone;
4. compare raw Markdown before/after;
5. capture both versions and settings;
6. state whether evidence covers Tasks, the other plugin, or the combination;
7. do not infer current external behaviour from Tasks' old documentation.

## Upgrade and drift checklist

For a Tasks upgrade:

1. record old/new Tasks and Obsidian versions;
2. back up or commit the vault;
3. review release notes for query grammar, settings, formats, statuses, and API;
4. run `tasks-vault-lint.mjs` on the old state;
5. run `tasks-query-lint.mjs` on all blocks;
6. upgrade on one device and restart;
7. validate indexing, a date query, a recurrence, a custom status transition, a dependency, and an
   integration;
8. re-run linters and compare findings;
9. validate mobile separately;
10. update any copied skill only after `scripts/verify.mjs` passes against the new source.

When maintaining this research artifact, source identity mismatch is staleness by definition. The
verifier checks version plus selected implementation invariants; it is a drift detector, not a
substitute for reviewing changed source.

## Validation

Maintain a tiny compatibility note containing: one task per format, one custom status, one
recurrence, one dependency pair, one filename-implied date, one query with `TQ_*`, and one API or
integration action that matters. A cheap smoke pass over that note catches semantic setting drift
without requiring full end-to-end automation.
