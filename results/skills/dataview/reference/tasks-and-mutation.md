# Reference: task queries, checkbox mutation and Tasks-plugin boundaries

Operational behaviour of task/list rows and interactive TASK views at
`blacksmithgu/obsidian-dataview` tag `0.5.70`.

## Contents

1. [Task selection model](#1-task-selection-model)
2. [Task status semantics](#2-task-status-semantics)
3. [Children and grouping](#3-children-and-grouping)
4. [What checking a box writes](#4-what-checking-a-box-writes)
5. [Completion settings](#5-completion-settings)
6. [Interoperability with the Tasks plugin](#6-interoperability-with-the-tasks-plugin)
7. [Safe task-query workflow](#7-safe-task-query-workflow)

---

## 1. Task selection model

`TASK` has two levels:

1. `FROM` selects **pages**.
2. Every task from those pages becomes a row, with page fields merged for keys the task does not
   define (`src/query/engine.ts:388`).

Therefore:

```dataview
TASK
FROM #work
```

returns every task in every page that carries `#work` anywhere. For a task tag use:

```dataview
TASK
FROM "Work"
WHERE econtains(tags, "#work")
```

Use `contains(tags, "#work")` only for intentional substring membership. Task `tags` contains tags
from that list item's own text; it is not the page's `file.tags`.

In a page TABLE query, tasks remain inside `file.tasks`. Use `FLATTEN file.tasks AS task` only when
one output row per task is actually needed.

## 2. Task status semantics

| Field | Meaning |
|---|---|
| `status` | Character between brackets; blank task is `" "`. |
| `checked` | Any non-blank status, including `-`, `/`, `>`. |
| `completed` | Only `x` or `X`. |
| `fullyCompleted` | This task and all descendant tasks completed. |
| `completion` | Completion **date**, if parsed. |

These are deliberate Dataview semantics (`src/data-model/markdown.ts:251`). Do not use `checked`
as a synonym for completed when custom checkbox states exist.

Task built-ins are written after inline fields. An inline `[completed:: 2024-01-01]` cannot replace
the boolean; the date alias is exposed as `completion` (`src/data-model/markdown.ts:281`).

## 3. Children and grouping

The query filters raw task rows, then the renderer re-nests matching roots and children
(`src/ui/views/task-view.tsx:295`). A matching parent brings its children into the rendered tree even
when a child did not match. A matching child whose parent was rejected can become a root.

Consequences:

- visual task count can exceed the number of rows that passed `WHERE`;
- `LIMIT` applies before visual re-nesting;
- grouping changes group rows, then task nesting happens inside them;
- inspect a flat TABLE over `file.tasks` when exact row membership matters more than interactive
  task rendering.

## 4. What checking a box writes

A TASK view is the one DQL output that mutates the vault. On click, Dataview:

1. reads the complete source file;
2. locates the original line number;
3. confirms the current first-line text still matches the indexed task;
4. rewrites the checkbox status and, optionally, the task text;
5. writes the whole file through the vault adapter (`src/ui/views/task-view.tsx:404`).

The guards reduce stale-index writes: if the line or text no longer matches, the rewrite returns
without writing. They do not make concurrent edits transactional.

**Recommendation.** Do not click tasks in an old rendered dashboard while another tool is
rewriting the same file. Let the index refresh first. Keep backups/version history for automation
heavy vaults.

## 5. Completion settings

All are off by default (`src/settings.ts:38`):

| Setting | Effect |
|---|---|
| `taskCompletionTracking` | Append/remove a completion date when toggled in a Dataview view. |
| `taskCompletionUseEmojiShorthand` | Use `✅ yyyy-MM-dd` instead of an inline field. |
| `taskCompletionText` | Inline key, default `completion`. |
| `taskCompletionDateFormat` | Luxon format, default `yyyy-MM-dd`. |
| `recursiveSubTaskCompletion` | Toggle descendant tasks with their parent. |

Emoji completion always writes `yyyy-MM-dd`; the configurable date format applies to the inline
form (`src/ui/views/task-view.tsx:358`).

When unchecking:

- inline completion is removed through `setInlineField`;
- emoji completion is removed through the emoji shorthand rewriter;
- a block ID is preserved at the end of the line.

Before enabling recursive completion, confirm that child tasks are not independent work items and
that another task plugin does not assign a different meaning to custom statuses.

## 6. Interoperability with the Tasks plugin

Dataview and Tasks have independent parsers and query languages.

Dataview recognises these list-item date shorthands:

- `➕` created;
- `🛫` start;
- `⏳`/`⌛` scheduled;
- `📅` variants due;
- `✅` completion.

It does not parse Tasks priority, recurrence, dependency, ID or cancellation signifiers into
dedicated Dataview task fields at this pin (`src/data-import/inline-field.ts:182`). They remain in
`text` unless separately annotated with a Dataview inline field.

Safe interoperability recommendations:

- query Tasks-native dates through Dataview's recognised aliases only;
- do not assume Tasks recurrence or priority exists as `task.recurrence`/`task.priority`;
- choose one plugin to own checkbox completion annotations;
- test a copied task before enabling recursive completion in both plugins;
- never paste a Tasks query instruction into a `dataview` block, or DQL into a `tasks` block.

## 7. Safe task-query workflow

1. Establish whether intent is page selection or task selection.
2. Use the narrowest positive page `FROM`.
3. Filter exact task tags with `econtains(tags, ...)`.
4. Distinguish `checked`, `completed` and `completion`.
5. Inspect one parent/child example before trusting visual counts.
6. State that rendered checkboxes write source files.
7. Record completion and recursion settings.
8. Validate one task that must appear and one that must not.
9. If another plugin owns task syntax, inspect the raw task line and assign ownership explicitly.
