# Authoring, editing, and task formats

Use this reference for creating/editing tasks, Auto-Suggest, checkbox actions, postponing, mobile
input, accessibility, field ordering, or Emoji/Dataview confusion.

## Choose an authoring path

| Need | Preferred Tasks path | Important boundary |
|---|---|---|
| Create or comprehensively edit one task | `Tasks: Create or edit task` modal | writes the selected format |
| Add/change one field while typing | Tasks Auto-Suggest | only on recognised task lines; ordering still matters |
| Change status with Tasks semantics | Tasks command, rendered checkbox, or context menu | plain/other-plugin toggles may bypass recurrence/date logic |
| Move a task's work date | Postpone button/context menu in query result | only for a task with a valid happens date |
| Integrate another script/plugin | Tasks API modal/toggle methods | no search API |

The modal supports description, priority, recurrence, dates, dependencies, and status; fields can
be hidden in its settings (`docs/Editing/Create or edit Task.md:23`). Hidden does
not mean absent from an existing task.

### Keyboard and mobile

Modal access keys can be disabled immediately if they conflict with shortcuts or assistive
technology (`docs/Editing/Create or edit Task.md:55`). On phone-sized screens the modal may require
scrolling to reach fields (`docs/Editing/Create or edit Task.md:278`). For mobile workflows,
minimise required fields and prefer Auto-Suggest abbreviations or the modal over manually entering
multi-emoji metadata.

## Recognition before suggestion

Auto-Suggest appears only when the editor position and line satisfy its rules. A real task checkbox
and the global-filter substring are normally prerequisites. A status configured as `NON_TASK` is
not treated as an actionable task. In Dataview format, type `[` or `(` before the field name
(`docs/Reference/Task Formats/Dataview Format.md:117`).

The serializer reads metadata from the end of the line backwards. Intervening prose stops the scan.
Upstream documents the ordering constraint and a malformed-task sweep
(`docs/Editing/Auto-Suggest.md:258`, `docs/Editing/Auto-Suggest.md:279`).

**Recommendation:** let Auto-Suggest or the modal place fields; keep ordinary description text
before task metadata; use a grouping/query sweep after bulk imports.

## One selected format at a time

Tasks 8.3.0 supports:

- **Tasks Emoji format**, the default;
- **Dataview format**, using bracketed inline fields.

Only the selected format is read and written. If Dataview is selected, Emoji metadata is ignored;
if Emoji is selected, Dataview fields remain description text
(`docs/Reference/Task Formats/About Task Formats.md:24`,
`docs/Reference/Task Formats/About Task Formats.md:41`).

The choice controls file parsing, writing, Live Preview, modal output, and Auto-Suggest
(`docs/Reference/Task Formats/About Task Formats.md:49`). Reading view and Tasks query results still
display Emoji regardless of the selected storage format
(`docs/Reference/Task Formats/About Task Formats.md:63`).

There is no built-in format converter (`docs/Reference/Task Formats/About Task Formats.md:81`).
Changing the setting without migration can make an entire vault's existing dates, priorities, and
recurrence rules appear to vanish from Tasks.

## Emoji format

Canonical fields are trailing signifier/value pairs. Source recognises IDs/dependencies and the
standard priority, recurrence, completion, and date signifiers
(`src/TaskSerializer/DefaultTaskSerializer.ts:58`). The parser:

1. starts at line end;
2. runs a fixed sequence of field extractors, each against the current line end;
3. temporarily removes trailing tags;
4. can remove several different field types in one run, then repeats with a nominal 20-run
   failsafe (the source's `<=` condition permits a 21st iteration);
5. stops at the first unrecognised suffix
   (`src/TaskSerializer/DefaultTaskSerializer.ts:324`,
   `src/TaskSerializer/DefaultTaskSerializer.ts:373`).

Consequences:

- prose after metadata can make every earlier field unread;
- duplicate fields may be consumed but yield surprising state;
- extreme numbers of repeated trailing fields can exceed the scan failsafe;
- a non-breaking space can look like a normal space but prevent matching;
- the implementation accepts an optional variation selector after a signifier
  (`src/TaskSerializer/DefaultTaskSerializer.ts:69`), despite stricter wording in the format docs.

Use raw Markdown, not rendered Emoji, for diagnosis.

## Dataview format

Tasks uses bracketed inline fields, writes square brackets, and recognises a defined subset
(`docs/Reference/Task Formats/Dataview Format.md:23`,
`src/TaskSerializer/DataviewTaskSerializer.ts:121`).

Supported concepts include dates, priority, recurrence, completion action, ID, and dependencies
(`docs/Reference/Task Formats/Dataview Format.md:38`). Boundaries:

- fields must be on the task line;
- Tasks does not read task metadata from frontmatter;
- arbitrary Dataview inline fields are not Tasks fields;
- Auto-Suggest expects opening brackets;
- query/reading display remains Emoji
  (`docs/Reference/Task Formats/Dataview Format.md:130`,
  `docs/Reference/Task Formats/About Task Formats.md:63`).

Do not infer that installing Dataview or choosing Dataview format makes Tasks query Dataview's
index. Tasks still parses its own task objects.

## Status-changing paths

The rendered checkbox works in Reading view, Live Preview, and query results, but not as a Tasks
control in Source mode. The Tasks context menu can select a specific registered status and applies
Tasks' completion logic. The toggle command works in Source/Live Preview
(`docs/Editing/Toggling and Editing Statuses.md:23`,
`docs/Editing/Toggling and Editing Statuses.md:37`,
`docs/Editing/Toggling and Editing Statuses.md:70`).

When recurrence or tracked dates matter, reproduce through a Tasks-owned path. Dataview's checkbox
can add a completion date but does not create the next recurrence
(`docs/Other Plugins/Dataview.md:29`, `docs/Other Plugins/Dataview.md:41`).

## Postponing

The Postpone control is available in Tasks query results only
(`docs/Editing/Postponing.md:67`). It selects the first valid field in priority order:

1. due;
2. scheduled;
3. start
   (`docs/Editing/Postponing.md:51`, `src/DateTime/Postponer.ts:26`).

It is hidden when the task has no happens date or contains any invalid date
(`docs/Editing/Postponing.md:61`). It cannot add a date to an undated task. A scheduled date inferred
from the filename can participate even though no signifier is visible; inspect with the modal or
`group by scheduled`.

## Format diagnostic

When a visible value is “ignored”:

1. copy the raw line;
2. confirm selected format;
3. inspect the very end for trailing prose, non-breaking spaces, or an unsupported field;
4. group by the suspected field;
5. edit via the modal and compare the rewritten line;
6. run `tasks-vault-lint.mjs` for mixed-format and invalid-field findings.

Do not switch formats as a diagnostic shortcut. That changes parsing for the entire vault.

## Safe format migration

**Recommendation:** because Tasks has no converter:

1. back up or commit the vault;
2. inventory both format families with the vault linter;
3. choose one canonical format;
4. convert a small fixture note;
5. switch the setting and restart if needed;
6. validate dates, recurrence, IDs, dependencies, and completion actions;
7. convert in reviewable batches;
8. keep the source format until queries and mutation tests pass.

The included linter is advisory and deliberately does not rewrite task lines.

## Validation

For each authoring path, create a scratch task containing every field you rely on. Re-open it in the
modal, render it in a Tasks query, toggle it using the production action path, and inspect the raw
Markdown. On mobile, repeat the minimal create/edit/toggle path on the device; desktop success does
not establish keyboard, viewport, or plugin-load behaviour on mobile.
