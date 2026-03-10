# Statuses, dependencies, and completion side effects

Use this reference for custom checkbox symbols, unexpected “done” membership, status cycles,
blocked/blocking queries, duplicate IDs, recurrence dependencies, or `onCompletion`.

## Status is symbol + registry entry + type

A checkbox glyph alone does not define semantics. The status registry maps a symbol to:

- name;
- type;
- next symbol in the toggle cycle.

Tasks has six user-facing types: `TODO`, `IN_PROGRESS`, `ON_HOLD`, `DONE`, `CANCELLED`, and
`NON_TASK`. Types control searching, completion dates, cancellation dates, and recurrence
(`docs/Getting Started/Statuses/Status Types.md:13`).

An unregistered symbol becomes name `Unknown` and type `TODO`
(`src/Statuses/Status.ts:233`, `src/Statuses/StatusRegistry.ts:119`). Consequently an unknown `[?]`
can match `not done`; find these with:

```tasks
status.name includes unknown
group by status.type
group by path
```

`done` is broader than successful completion: it includes `DONE`, `CANCELLED`, and `NON_TASK`
(`src/Task/Task.ts:537`). Use `status.type is DONE` when cancelled/non-task items must not match.

## Transition behaviour

Tasks resolves the next registered status, updates done/cancelled dates according to type, and may
create a recurring occurrence (`src/Task/Task.ts:345`, `src/Task/Task.ts:430`).

Important distinctions:

- `ON_HOLD` is still not done.
- `NON_TASK` is treated as done by broad search but does not receive normal completion history or
  recurrence (`docs/Getting Started/Statuses/Status Types.md:67`).
- Completing a recurrence does not preserve arbitrary status state; the next occurrence is reset to
  a suitable TODO/IN_PROGRESS status
  (`docs/Getting Started/Statuses/Recurring Tasks and Custom Statuses.md:145`).
- A broken next-symbol cycle can make toggling appear stuck or surprising.

Audit duplicate symbols, missing next symbols, unknown task symbols, and semantic type choices
before changing query logic.

## Dependencies

Tasks implements direct finish-to-start dependencies
(`docs/Getting Started/Task Dependencies.md:17`). A task with `dependsOn` is blocked when a referenced
task exists and is not done. A task is blocking when at least one not-done task directly references
its ID (`src/Task/Task.ts:552`, `src/Task/Task.ts:582`).

The model is a vault-wide directed graph:

```text
blocking task (id: A)  --->  blocked task (dependsOn: A)
```

Only direct edges count. There is no built-in transitive `is blocked` traversal.

### ID rules and hazards

IDs use a restricted token syntax; dependencies may list several IDs. The modal/Auto-Suggest can
create fields and warn about some cycles, but uniqueness is intended rather than globally enforced
(`docs/Getting Started/Task Dependencies.md:63`,
`docs/Getting Started/Task Dependencies.md:81`).

Audit for:

- duplicate IDs;
- dangling references;
- self-dependency;
- cycles;
- references to already-done/nonexistent tasks;
- mixed selected/ignored task formats.

Duplicate IDs make a dependency ambiguous. A dangling reference does not prove the intended task is
complete; it may indicate rename/deletion/format drift.

### Recurrence boundary

The next recurring occurrence deliberately removes `id` and `dependsOn` to avoid permanent blocking
and duplicated IDs (`src/Task/Task.ts:452`,
`docs/Getting Started/Recurring Tasks.md:299`). Dependencies describe an occurrence, not
automatically an entire recurring series.

## On-completion actions

8.3.0 supports `keep` and `delete` (`docs/Getting Started/On Completion.md:25`). The source parses
the action and deletes only on a transition into `DONE`
(`src/Task/OnCompletion.ts:4`, `src/Task/OnCompletion.ts:30`,
`src/Task/OnCompletion.ts:52`).

### Destructive nested-item hazard

Never place `delete` on a parent with nested tasks/list items. Removing the parent line leaves
indented children that Markdown may render as a code block, and Tasks does not warn
(`docs/Getting Started/On Completion.md:77`,
`docs/Getting Started/On Completion.md:100`). The vault linter reports this pattern.

The modal does not edit on-completion in 8.3.0; use Auto-Suggest or carefully edit raw Markdown
(`docs/Getting Started/On Completion.md:102`).

### Recurrence plus delete

With a recurring task, Tasks can create the next occurrence and remove the just-completed instance.
Validate the exact transition on a scratch copy, because another plugin's checkbox handler may not
execute the same sequence.

## Diagnostic sequence

1. Capture raw parent/child lines and selected format.
2. Map the checkbox symbol through the configured status registry.
3. Record current type and next-symbol cycle.
4. Determine how the change was invoked.
5. Parse current ID, dependencies, recurrence, and completion action.
6. Build the direct dependency graph; check duplicates, missing nodes, self-edges, and cycles.
7. Predict history-date and recurrence effects.
8. Reproduce one transition on a scratch copy.
9. Compare raw Markdown, not only rendered state.

## Safe status migration

**Recommendation:** before changing status definitions:

1. inventory every checkbox symbol in the vault;
2. identify unknown and duplicate configured symbols;
3. draw each next-symbol cycle;
4. state type semantics for search/history/recurrence;
5. test `not done`, `done`, and exact `status.type` queries;
6. test one recurring transition;
7. only then update definitions or bulk-convert glyphs.

Changing the registry can reinterpret existing Markdown without changing a line.

## Validation queries

Unknown statuses:

```tasks
status.name includes unknown
group by path
```

Blocked versus blocking:

```tasks
not done
(is blocked) OR (is blocking)
group by function task.isBlocked ? 'Blocked' : (task.isBlocking ? 'Blocking' : 'Neither')
```

The second query requires reviewed custom JavaScript and the device opt-in. For a no-JS audit, run
`tasks-vault-lint.mjs` and inspect its dependency findings.
