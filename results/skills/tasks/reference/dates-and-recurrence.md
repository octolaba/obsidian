# Dates, filename inference, and recurrence

Use this reference when a task appears on the wrong day, has an invisible date, recurs incorrectly,
loses recurrence, or needs a maintainable date model.

## Contents

- [Date fields are not synonyms](#date-fields-are-not-synonyms)
- [The `starts` exception](#the-starts-exception)
- [Filename-implied scheduled dates](#filename-implied-scheduled-dates)
- [Relative query dates](#relative-query-dates)
- [Recurrence model](#recurrence-model)
- [Preconditions and edge cases](#preconditions-and-edge-cases)
- [Custom statuses and recurrence](#custom-statuses-and-recurrence)
- [Debugging sequence](#debugging-sequence)
- [Recommendation: minimal date model](#recommendation-minimal-date-model)
- [Validation](#validation)

## Date fields are not synonyms

| Field | User meaning | Search implication |
|---|---|---|
| Start | earliest date work becomes available | `starts` comparisons include undated tasks |
| Scheduled | intended work date | participates in `happens` |
| Due | deadline | highest recurrence/postpone priority |
| Created | history/audit | optional automatic tracking |
| Done | successful completion history | status transition may add/remove |
| Cancelled | cancellation history | status transition may add/remove |

Upstream recommends choosing fields by actual planning meaning rather than duplicating every date
(`docs/Getting Started/Dates.md:9`). Tasks supports calendar dates in `YYYY-MM-DD`, not times
(`docs/Getting Started/Dates.md:206`, `docs/Getting Started/Dates.md:216`).

An invalid-looking calendar value can remain present but invalid. Use the six
`<field> date is invalid` filters (`docs/Getting Started/Dates.md:196`) before debugging ordinary
date comparisons.

## The `starts` exception

For a missing start date, date comparisons return true
(`src/Query/Filter/StartDateField.ts:19`). Other date fields reject missing values. Therefore:

```tasks
starts before tomorrow
```

means “start date is before tomorrow **or no start date exists**”. To require an explicit start:

```tasks
(starts before tomorrow) AND (has start date)
```

This is deliberate implementation behaviour, not a parser defect.

## Filename-implied scheduled dates

The setting “Use filename as Scheduled date for undated tasks” can assign an in-memory scheduled
date without changing or displaying the task line. It requires an Obsidian restart
(`docs/Getting Started/Use Filename as Default Date.md:14`).

It applies only when:

- the task has no start, scheduled, or due date;
- the built-in `YYYY-MM-DD` or `YYYYMMDD` occurs in the filename, or the entire filename matches the
  configured additional format;
- the file is inside any configured folder scope
  (`docs/Getting Started/Use Filename as Default Date.md:38`).

The implementation checks setting, path/folder, filename, and absence of all three happens fields
(`src/DateTime/DateFallback.ts:15`, `src/DateTime/DateFallback.ts:72`).

The date is invisible in Markdown and ordinary views. It appears in the modal and in grouping/query
semantics (`docs/Getting Started/Use Filename as Default Date.md:32`). CSS cannot access it
(`docs/Advanced/Styling.md:184`).

**Diagnostic branch:** when an undated task matches `scheduled`/`happens`, collect the filename,
folder settings, additional format, and restart state before claiming cache corruption.

## Relative query dates

Relative expressions resolve using the local day. Bare weekdays use chrono with forward dating off,
so the closest weekday may be in the past (`src/DateTime/DateParser.ts:5`). `explain` prints the
concrete expansion.

Known implementation defect: the `last|this|next` range regex is not anchored, so `next weekend`
can be parsed as `next week` (`src/DateTime/DateParser.ts:63`). Prefer a supported range phrase or
an explicit date.

For reproducible consultation, record the user's local date, locale, and time zone. Tasks dates have
no time component, but “today”, weekday names, and completion time cross local-day boundaries.

## Recurrence model

A recurring task stores one rule plus one or more reference dates. Completing it through Tasks may:

1. mark the current occurrence;
2. choose a reference date;
3. calculate the next occurrence;
4. preserve offsets among start/scheduled/due;
5. insert the next task according to settings;
6. remove `id` and `dependsOn` from the new occurrence.

Reference-date priority is normally due, scheduled, then start. With “remove scheduled date on
recurrence”, the source uses due, start, then scheduled
(`src/Task/Occurrence.ts:69`). Relative offsets are shifted with day-aware logic
(`src/Task/Occurrence.ts:104`).

`when done` bases calculation on completion; otherwise rules normally advance from the original
reference date (`docs/Getting Started/Recurring Tasks.md:76`).

## Preconditions and edge cases

- A useful recurring task needs at least one start/scheduled/due date
  (`docs/Getting Started/Recurring Tasks.md:262`).
- A daily-note template should usually generate non-recurring copies; recurrence inside every daily
  note duplicates the series (`docs/Getting Started/Recurring Tasks.md:288`).
- The next recurrence intentionally loses `id` and `dependsOn`
  (`docs/Getting Started/Recurring Tasks.md:301`).
- `every month` may move back to the last valid day; an explicit “on the 31st” style skips months
  without that date (`docs/Getting Started/Recurring Tasks.md:325`,
  `docs/Getting Started/Recurring Tasks.md:332`).
- Count-limited recurrence and `until` are unsupported
  (`docs/Getting Started/Recurring Tasks.md:348`,
  `docs/Getting Started/Recurring Tasks.md:352`).
- If the highest-priority reference date is invalid, completion can remove the rule without
  creating a next occurrence (`docs/Getting Started/Recurring Tasks.md:357`).
- `onCompletion delete` is applied alongside recurrence so the next occurrence can remain while the
  completed one disappears (`src/Task/Task.ts:518`).

## Custom statuses and recurrence

Recurrence depends on status type and the configured next-status cycle, not just checkbox glyph.
`NON_TASK` never gets completion history or recurrence. The next occurrence is reset to an
appropriate not-done status; see
[statuses, dependencies, completion](statuses-dependencies-completion.md).

## Debugging sequence

1. Copy raw task line and child lines.
2. Confirm selected format and that the rule/date fields parsed.
3. Group by recurrence and each happens date.
4. Check all date fields for invalid values.
5. Check filename-implied scheduled date.
6. Confirm the action path was Tasks-owned.
7. Confirm status type and next-status configuration.
8. Confirm recurrence settings: insertion order and remove-scheduled option.
9. Reproduce on a scratch copy with one completion.
10. Inspect raw output for current/next occurrence, IDs, dependencies, and completion action.

## Recommendation: minimal date model

Use only the fields that answer distinct questions:

- due for an external deadline;
- scheduled for a committed work day;
- start for “not actionable before”;
- history dates only when the history is useful.

Do not copy the same date into all three happens fields. It complicates recurrence, postponing, and
queries without adding information.

## Validation

Before deploying a recurrence rule, test three occurrences in a scratch note, including a
month/year boundary if relevant. Test both early and late completion for `when done`, verify status
cycling, and inspect preserved date offsets. A parser-only linter can catch missing/invalid dates
and unsupported rule fragments, but only a Tasks-owned toggle validates mutation behaviour.
