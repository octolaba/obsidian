# User workflows and maintenance

This reference contains **recommendations**, not upstream contracts. Use it to turn verified Tasks
semantics into sustainable personal/project workflows.

## Contents

- [Design principles](#design-principles)
- [Minimal task vocabulary](#minimal-task-vocabulary)
- [Capture and triage](#capture-and-triage)
- [Daily agenda](#daily-agenda)
- [Project dashboard](#project-dashboard)
- [Waiting and dependencies](#waiting-and-dependencies)
- [Recurring responsibilities](#recurring-responsibilities)
- [Data-health dashboard](#data-health-dashboard)
- [Mobile-first design](#mobile-first-design)
- [Query maintenance](#query-maintenance)
- [Quarterly health review](#quarterly-health-review)
- [Validation](#validation)

## Design principles

1. Give each field one meaning.
2. Keep capture easier than classification.
3. Separate actionable, waiting, scheduled, and deadline concepts.
4. Prefer visible, portable Markdown over hidden global logic.
5. Keep global settings minimal and reviewable.
6. Add custom JavaScript only when built-ins cannot express the intent.
7. Schedule data-health queries, not only work queries.
8. Test mutation workflows, not just search output.

## Minimal task vocabulary

A maintainable default:

- status type for lifecycle;
- due only for deadlines;
- scheduled for committed work day;
- start for “not before”;
- tags or folder for domain/project, not both unless they answer different questions;
- dependency only for a concrete finish-to-start edge;
- recurrence only for a series stored outside auto-generated daily notes.

Avoid adding every available field to every task.

## Capture and triage

Capture with only the global-filter marker if one is required:

```text
- [ ] #task Describe the outcome
```

During triage, decide:

1. delete/not a task;
2. project/domain location;
3. next status;
4. deadline, committed day, or not-before date;
5. dependency/waiting state;
6. recurrence if it is a true series.

Inbox query:

```tasks
not done
tags include #inbox
sort by created
group by path
```

If created-date tracking is off, choose another deterministic order rather than assuming timestamps.

## Daily agenda

Use `happens` for any of start/scheduled/due, then distinguish overdue and undated work deliberately:

```tasks
not done
happens before tomorrow
sort by due
sort by scheduled
sort by start
group by happens
```

Remember: a `starts` filter alone includes undated tasks, but `happens` does not. Filename-implied
scheduled dates can make daily-note tasks appear without visible metadata.

For a rolling seven calendar days including today:

```tasks
not done
happens before in 8 days
sort by happens
group by happens
```

Validate the concrete end date with `explain`; relative phrasing depends on the local day.

## Project dashboard

Prefer a path/folder scope plus explicit status/date semantics:

```tasks
not done
folder includes Projects/Apollo/
(is not blocked) AND ((happens before tomorrow) OR (no happens date))
sort by priority
sort by happens
group by status.type
```

This treats actionable undated work as intentional. If all project tasks must be dated, remove the
`no happens date` branch and add a separate hygiene query.

## Waiting and dependencies

Blocked work:

```tasks
not done
is blocked
group by path
```

Tasks with missing/duplicate IDs may not behave as intended, so pair dependency views with the vault
linter. Use statuses for “waiting on a person/time” when there is no concrete blocking task; use
dependencies for an actual edge.

## Recurring responsibilities

Store one series in a stable note rather than in every daily-note template. Give it the minimum
reference dates needed, test the month-boundary behaviour, and expect the next occurrence to lose
ID/dependency fields.

For habit logs where each daily note independently contains a checkbox, use the template to create
non-recurring instances.

## Data-health dashboard

Invalid dates:

```tasks
(cancelled date is invalid) OR (created date is invalid) OR (done date is invalid) OR (due date is invalid) OR (scheduled date is invalid) OR (start date is invalid)
group by path
```

Unknown statuses:

```tasks
status.name includes unknown
group by path
```

Recurring without a happens date:

```tasks
is recurring
no happens date
group by path
```

Supplement these runtime queries with:

```bash
node scripts/tasks-vault-lint.mjs --vault /path/to/vault
node scripts/tasks-query-lint.mjs --vault /path/to/vault
```

Review findings; do not blindly bulk-repair.

## Mobile-first design

- Keep queries short and put shared read-only layout defaults in note frontmatter only when the
  hidden behaviour is documented.
- Prefer modal/Auto-Suggest over manual multi-field typing.
- Avoid JavaScript-only core dashboards unless each mobile device enables and can safely run them.
- Test status controls and recurring completion on mobile.
- Keep an emergency plain-Markdown view: tasks remain checkboxes even if the plugin is unavailable.

## Query maintenance

For every important dashboard:

1. write a one-sentence intent above it;
2. include one fixture task that must match and one that must not in a test note or documented
   checklist;
3. run the query linter after Tasks upgrades;
4. temporarily add `explain` when changing relative dates, presets, or frontmatter;
5. review global query/filter and `TQ_*` quarterly;
6. measure before performance rewrites.

## Quarterly health review

- inventory unknown status symbols;
- validate status cycles;
- check invalid/unread/mixed-format fields;
- check duplicate/dangling/cyclic dependencies;
- check recurrence without dates and unsupported rules;
- inspect parent tasks with `onCompletion delete`;
- inspect stale presets and custom JavaScript;
- verify format and filename-date settings on all devices;
- run fixture integration tests after skill/source updates.

## Validation

An effective workflow is not merely syntactically valid. Verify:

- capture friction on desktop and mobile;
- no important task disappears behind global/context rules;
- dashboards have positive and negative examples;
- completion uses a Tasks-owned path where mutation matters;
- date fields carry distinct meanings;
- maintenance findings are reviewed at a sustainable cadence.
