---
name: tasks
description: Deep expertise in the obsidian-tasks plugin's query language — read a query and say exactly what it matches, write a query from a stated intent, and debug queries that return the wrong tasks (especially tasks that are missing but should be there). Reach for this for anything inside a `tasks` code block, and for "why is this task not in my list?".
source: obsidian-tasks-group/obsidian-tasks
version: 8.3.0
basis: source
---

# Tasks: query language, search semantics, and debugging

## What this skill answers

**Given a `tasks` code block, say exactly what it matches; given a stated intent, write the block
that matches it; given a wrong result set, find the cause.** The third is the hardest and gets the
most machinery, because a Tasks query can be silently wrong in a dozen ways that produce no error.

## Scope

- **In scope:** the query language, the search semantics behind it, and diagnosing wrong results —
  including tasks that were never indexed and values that were never parsed.
- **Out of scope:** authoring and editing tasks (the Create/edit modal, auto-suggest, postponing,
  status toggling), recurrence arithmetic, styling and CSS, the `TasksApi`, and settings
  administration beyond the handful of settings that change what a query returns.
- **Not covered:** performance tuning. No timings exist for this plugin, so this skill makes no
  performance claims.

## Prerequisites

Before answering anything version-sensitive, establish:

1. **the plugin version** — `manifest.json` in the vault, or Obsidian → Community plugins;
2. **whether a global filter is set** — Settings → Tasks → Global filter;
3. **whether a global query is set** — Settings → Tasks → Global query;
4. **which task format is selected** — emoji or Dataview;
5. **whether custom searches are enabled** — Settings → Tasks → Searches, needed for any
   `by function` instruction since 8.0.0.

Any of the five changes the answer. The first two change it most often.

## Source, evidence, and how claims are marked

Verified against the `obsidian-tasks-group/obsidian-tasks` submodule at
`research/plugins/obsidian-tasks-group/obsidian-tasks`, tag `8.3.0`, commit `e16dbc2`. All
`path:line` citations are relative to that root; there is no second source.

- A citation into `src/…` is **behaviour read from the implementation**.
- A citation into `docs/…` is a **documented contract**.
- Anything concluded rather than read is prefixed `Inference:`; anything unestablished,
  `Unverified:`. Everything in [Writing a query from an intent](#writing-a-query-from-an-intent)
  and [How to consult on this](#how-to-consult-on-this) is **recommendation** — judgement about how
  to work, not upstream behaviour.
- Where documentation and implementation disagree, both are recorded with the consequence, not
  silently reconciled. See [Known conflicts](#known-conflicts-limitations-and-open-questions).

**Version boundaries.** Instructions and defaults changed materially in 2.0.0 (date ranges), 4.6.0
(`on or before` / `on or after`), 5.0.0 (trailing `\` became a line continuation), 7.0.0 (Boolean
delimiters may no longer be mixed) and 8.0.0 (JavaScript off by default). Claims here hold for
8.3.0. The single most consequential recent change: **since 8.0.0 JavaScript in queries is off by
default**, so `filter by function`, `sort by function` and `group by function` error out until the
user enables it, per device (`src/Config/EnableJsInTasksQueries.ts:4`,
`docs/Scripting/JavaScript in Tasks Queries.md`).

## The mental model in one page

A `tasks` block is not a database query — it is a **list of independent instructions applied in a
fixed order to a flat, pre-built array of `Task` objects**.

```
Obsidian metadata cache (listItems where listItem.task !== undefined)
        │   ← if Obsidian's cache doesn't see a checkbox here, Tasks never sees the task
        ▼
FileParser: one Task per task line, per file            (src/Obsidian/FileParser.ts:68)
        │   ← global filter rejected here → the line becomes a plain ListItem, invisible to all queries
        ▼
Serializer (emoji or dataview) reads signifiers BACKWARDS FROM END OF LINE
        │   ← unrecognised text stops the scan; everything to its left stays in the description
        ▼
Cache.tasks : Task[]                                    (src/Obsidian/Cache.ts:47)
        │
        ▼
Effective query = [global query] + [query file defaults] + [block source]
        │                                          (src/Query/QueryRendererHelper.ts:78)
        ▼
1. filters   — every filter must pass; lines are AND-ed  (src/Query/Query.ts:369)
2. sort      — your sorters, then 5 default sorters always appended (src/Query/Sort/Sort.ts:25)
3. limit     — plain slice of the sorted array           (src/Query/Query.ts:377)
4. group     — build the group tree                      (src/Query/Query.ts:384)
5. limit groups                                          (src/Query/Query.ts:386)
6. render    — flat list, or tree (which also draws non-matching children)
```

Four consequences carry most of the debugging weight:

1. **A task can be absent because it was never indexed**, not because a filter rejected it.
   Always establish which of the two it is before touching the query.
2. **Filtering happens on parsed fields, not on line text.** A task whose `📅 2025-07-01` was
   never parsed has `dueDate === null` and cannot match any `due` filter — while still *looking*
   dated in the editor.
3. **Lines are AND-ed.** Anything that reads like "or" in the request needs one line with
   delimiters and an explicit `OR`.
4. **`limit` runs before grouping, and grouping cannot change which tasks matched** — so a
   surprising count is a filter/limit question, never a grouping question.

## Always do these two things first

**1. Add `explain`.** It expands relative dates to real dates, shows the parse of Boolean logic,
shows placeholder expansion, and prints the global filter, global query and query-file-defaults
contributions that the user probably forgot about (`src/Query/QueryRendererHelper.ts:30`).
It is the cheapest, highest-yield instrument in the plugin. Nearly every "wrong results" report is
answered by reading its output.

**2. Bisect.** Replace the query with an empty block, confirm the task appears, then add
instructions back one at a time. This separates *indexing* problems from *filter* problems in one
step and costs 30 seconds.

## Fast triage: a task is missing from the results

Run this ladder in order. Stop at the first step that reproduces the problem.

| # | Probe | If the task appears | If it does not |
|---|-------|--------------------|----------------|
| 1 | An empty block in the **same note**, containing only `ignore global query` | It is indexed → the fault is in the query. Go to 5. | It is not indexed → go to 2. |
| 2 | Is the file `.md`, and is the line a real checkbox (`- [ ]`, `* [x]`, `1. [ ]`, `1) [ ]`)? | — | Non-`.md` files are skipped (`src/Obsidian/Cache.ts:291`); the line must match `taskRegex` (`src/Task/TaskRegularExpressions.ts:24`). |
| 3 | Is a **global filter** set in settings (Settings → Tasks → Global filter)? | — | A task line lacking that substring is not a Task at all (`src/Task/Task.ts:219`, `src/Obsidian/FileParser.ts:155`). |
| 4 | Is the task inside a **titled callout**, and was this vault ever opened in Obsidian 1.6.0–1.6.3? | — | Rebuild the vault metadata cache: Settings → Files and links → Advanced (`docs/Support and Help/Missing tasks in callouts with some Obsidian 1.6.x versions.md`). Also check for a multi-line task — only the first line is read. |
| 5 | Add `explain`, then add filters back one at a time | The last filter you added is the culprit | — |
| 6 | For the culprit filter, verify the **parsed value** with a grouping probe: `group by due`, `group by tags`, `group by status.name`, `group by priority`, `group by happens` | The heading shows the real value Tasks holds | If the heading says `No due date` while the line shows `📅 …`, the signifier was not parsed → [reference/debugging.md](reference/debugging.md#step-3a--the-backwards-signifier-scan) |

The full cause catalogue, indexed by symptom, plus the deeper instruments
(`showTaskHiddenData`, console logging, the unread-emoji sweep) is in
[reference/debugging.md](reference/debugging.md). Read it before speculating.

## Writing a query from an intent

Work through seven decisions in this order. Skipping any of them is how wrong queries get written.

**D1 — Scope.** Which files? `path includes`, `folder includes`, `root includes`,
`filename includes`, `heading includes`, or a preset (`preset this_file`, `preset this_folder`).
Note `folder includes X/` also matches sub-folders; exact-folder-only needs `filter by function`.

**D2 — Status.** `not done` = status types `TODO`, `IN_PROGRESS`, `ON_HOLD`.
`done` = `DONE`, `CANCELLED`, `NON_TASK` (`src/Task/Task.ts:537`). If the user means "only
untouched" or "only in progress", that is `status.type is TODO` / `status.type is IN_PROGRESS`,
not `not done`.

**D3 — Which date field.** `due` = deadline. `scheduled` = when I intend to work on it.
`start` = earliest I *can* work on it. `happens` = any of those three
(`src/Query/Filter/HappensDateField.ts:38`). `done`/`cancelled`/`created` are audit fields.
"Show me what to do today" is almost always `happens` or `due`, rarely `start`.

**D4 — Missing-value semantics.** Decide explicitly what should happen to tasks with no value.
`starts …` **matches tasks that have no start date** (`src/Query/Filter/StartDateField.ts:17`);
every other date field excludes them. If the intent is strictly "has a start date and it has
passed", write `(starts before tomorrow) AND (has start date)`.

**D5 — AND or OR.** Separate lines are AND. For OR, put everything on one line, wrap each
sub-filter in one consistent delimiter pair — `(…)`, `[…]`, `{…}` or `"…"` — and capitalise the
operator. Precedence is `NOT` > `XOR` > `AND` > `OR`; bracket liberally rather than relying on it
(`docs/Queries/Combining Filters.md:77`). Use `\` at end of line to wrap long Boolean lines.

**D6 — Order, grouping, limits.** Your `sort by` lines take priority, then five defaults are
always appended and cannot be disabled: `status.type`, `urgency`, `due`, `priority`, `path`
(`src/Query/Sort/Sort.ts:25`). Group headings sort by heading *text*, not by underlying value —
that is why the plugin hides `%%N%%` prefixes in some headings. `limit N` cuts before grouping;
`limit groups to N` is silently ignored when there is no `group by`
(`src/Query/Group/TaskGroups.ts:143`).

**D7 — Layout.** Hide noise (`hide backlink`, `hide task count`, `hide edit button`,
`hide postpone button`, `short mode`). Use `show tree` only if sub-items matter, and know that it
draws **all** children of a matching task, including children that do not match the query
(`src/Renderer/QueryResultsRendererBase.ts:155`).

Then **add `explain`, read the expansion, and check one known-good and one known-bad task** before
declaring the query correct.

### Intent → instruction

| Intent phrase | Instruction |
|---|---|
| "open / outstanding / not finished" | `not done` |
| "overdue" | `due before today` |
| "due today or overdue" | `due before tomorrow` |
| "in the next 7 days" (incl. today) | `due before in 8 days` — `due before in 7 days` stops at today+6 (`docs/How To/Find tasks for coming 7 days.md:62`) |
| "this week / next month / last quarter" | `due this week`, `due next month`, `due last quarter` — inclusive ranges, ISO weeks (Mon–Sun) |
| "in June 2025" / "in week 14 of 2022" | `due 2025-06`, `due 2022-W14` |
| "between two dates, inclusive" | `due 2025-06-01 2025-06-30` |
| "no deadline set" | `no due date` |
| "actionable now" | `happens before tomorrow` |
| "tagged X" | `tags include #X` (substring; `#X` also matches `#Xyz`) |
| "tagged exactly X, no sub-tags" | `tag regex matches /#X$/i` |
| "not tagged X" | `tags do not include #X` |
| "high priority or above" | `priority is above medium` |
| "has any priority" | `priority is not none` |
| "recurring" | `is recurring` |
| "waiting on something else" | `is blocked` |
| "unblocks other work" | `is blocking` |
| "top-level tasks only" | `exclude sub-items` |
| "in this note" | `path includes {{query.file.path}}` or `preset this_file` |
| "in this folder and below" | `folder includes {{query.file.folder}}` or `preset this_folder` |

### Worked examples

Next 7 days of work in one project, overdue first, capped, grouped by day:

````text
```tasks
not done
folder includes Work/Project Apollo/
due before in 8 days
tags do not include #someday
sort by due
group by due
limit 30
explain
```
````

"Either an inbox tag or an inbox file, and either due soon or completely undated" — two OR lines,
AND-ed together:

````text
```tasks
not done
(tags include #inbox) OR (path includes Inbox)
(due before in 8 days) OR (no due date)
explain
```
````

"Startable today, and it really does have a start date" — D4 applied:

````text
```tasks
not done
(starts before tomorrow) AND (has start date)
sort by start
```
````

Data-hygiene sweep, the upstream-blessed form, and worth offering to any user with mysterious
results (`docs/How To/Find tasks with invalid data.md:65`):

````text
```tasks
# All on one line:
(cancelled date is invalid) OR (created date is invalid) OR (done date is invalid) OR (due date is invalid) OR (scheduled date is invalid) OR (start date is invalid)
group by path
```
````

## Traps that silently change results

Each of these produces *plausible but wrong* output with no error message. Check them by reflex.

| Trap | Effect |
|---|---|
| Text after a signifier | Everything to its left is unparsed and stays in the description. `- [ ] check 📅 2022-12-29 ✅ 2023-01-09 > appointment` has **no dates at all** (`docs/How To/Find tasks with invalid data.md:20`). The single biggest cause of missing tasks. |
| `starts` includes undated tasks | See D4. |
| Global filter is a plain substring | `includedIn` uses `String.includes` (`src/Config/GlobalFilter.ts:52`), so filter `#task` is also satisfied by `#tasks`; and a tag global filter is stripped from `task.tags`, so never search for it. |
| Unregistered status symbols | Any symbol not in settings becomes name `Unknown`, type `TODO` (`src/Statuses/Status.ts:233`), so `[>]` and `[?]` show up in `not done`. Find them with `status.name includes unknown`. |
| `done` is wider than "completed" | It also matches `CANCELLED` and `NON_TASK`. |
| Relative-range regex is unanchored **(defect D1)** | `due next weekend` is silently read as `due next week`, because `/(last\|this\|next) (week\|month\|quarter\|year)/` matches inside the longer word (`src/DateTime/DateParser.ts:63`). Likewise `last quarterly review` → `last quarter`. |
| chrono picks the *closest* date | On a Wednesday, `due tuesday` means yesterday. Use `next tuesday`. Forward-dating is off (`src/DateTime/DateParser.ts:5`). |
| `priority is above low` includes no-priority tasks | Priority codes are `Highest=0 … Medium=2, None=3, Low=4, Lowest=5` (`src/Task/Priority.ts:11`), so "above low" spans Highest…None. |
| `path includes .md` | Matches every task; the extension is part of the value (`src/Query/Filter/PathField.ts:7`). |
| A sub-expression ending in the closing delimiter | `(description includes (maybe))` breaks the Boolean split. Switch delimiters, or append `;` (`docs/Queries/Combining Filters.md:264`). |
| Chained `XOR` | `a XOR b XOR c` also matches tasks matching all three (`docs/Queries/Combining Filters.md:229`). |
| First parse error aborts the rest of the query | Instructions after the bad line are never parsed and the block renders only the error (`src/Query/Query.ts:87`). Fix the top error first. |
| `sort by` is not end-anchored **(defect D3)** | `sort by due nonsense` silently parses as `sort by due`, and `sort by due reverssse` sorts non-reversed (`src/Query/Filter/Field.ts:175`). `group by` **is** anchored and will error. |
| `hide`/`show` match by prefix | `option.startsWith(key)` (`src/Layout/QueryLayoutOptions.ts:41`), so `hide backlinks` works; unknown options error. |
| An expression containing the word `return` **(defect D2)** | `filter by function` only auto-prepends `return` when the text lacks the substring `return` (`src/Scripting/Expression.ts:28`), so `task.description.includes('return')` compiles to a function returning `undefined`. Add an explicit `return`. |
| `show tree` | Draws non-matching children of matching tasks — extra rows that no filter selected. |
| A query in a Canvas card | Cannot use query file defaults; canvases have no frontmatter (`docs/Queries/Query File Defaults.md`). |

## Validating the result

A query that looks right is not a verified query. Before handing one over:

1. **Add `explain`** and read the expanded dates and the Boolean tree. Do this even when confident —
   it is how defect D1 and misplaced parentheses are caught.
2. **Check one task that must appear and one that must not.** A filter that was too broad and is now
   too narrow looks identical from a single example.
3. **Check the count.** `N of M tasks` in the footer means a limit is trimming the result
   (`src/Query/QueryResult.ts:37`).
4. **Do not trust the absence of an error.** `sort by` silently accepts trailing junk, so a
   misspelled `reverse` sorts the wrong way with no complaint (defect D3).
5. **Remove `explain`** only once satisfied, or leave it in if the block is a diagnostic.

## Known conflicts, limitations and open questions

- **Documentation versus implementation.** Two divergences are recorded rather than reconciled:
  placeholders inside `#` comments (docs say they are reported, the code skips them) and unicode
  variation selectors (docs say none are understood, the code tolerates one after a signifier).
  Both are analysed in full in the `query-language-defects` deep dive of this research repository.
- **Three defects change what a correct-looking query returns**, and are the reason this skill
  insists on `explain` and on two-directional validation: relative date ranges matching inside
  longer words, the `return` substring heuristic, and `sort by` accepting trailing junk.
- **Nothing here was executed inside Obsidian.** The claims come from reading the implementation,
  plus a pattern-level harness in the defect report. Reproduction steps are given so a reader can
  confirm any of it in a real vault.
- **Not systematically audited.** The traps table is what surfaced while mapping the language, not
  the output of exhaustive testing. Absence from it is not evidence of safety.
- *Unverified:* upstream issue status for the three defects — settling that needs the GitHub tracker,
  which is outside the pinned tree.

## Reference map

Load the file that matches the question; do not guess from memory. These three files are part of this
skill and travel with it.

| File | Use it for |
|---|---|
| [reference/query-language.md](reference/query-language.md) | The complete instruction set: exact grammar for every filter, sorter, grouper and layout option; how a date argument is resolved; the filter/sort/group support matrix; what has no built-in instruction. |
| [reference/debugging.md](reference/debugging.md) | The full triage protocol, the backwards signifier scan, all instruments, and a cause catalogue indexed by symptom. |
| [reference/scripting.md](reference/scripting.md) | `filter by`/`sort by`/`group by function`: the JS gate, the `task.*` and `query.*` property surface, return-value rules, and the traps. |

## Self-containment

This skill is **self-contained**: `SKILL.md` plus the three files under `reference/` carry everything
needed to read, write and debug a Tasks query. Nothing outside the skill directory is required, and no
link leaves it — so the directory can be copied into another project as-is.

Two consequences to preserve if you edit it:

- **Do not introduce load-bearing links to other artifacts.** Where deeper analysis exists elsewhere,
  name it in prose (as the defect IDs `D1`–`D5` and the two deep dives below do) rather than linking
  to it, so that an extracted copy has no dead references.
- **The one exception is the section below**, which is pure navigation within the research repository
  and is the only thing to delete when extracting.

### Where the underlying research lives (source repository only)

Both are in `results/deep-dives/tasks/` of the `octolaba/obsidian` research repository. Neither is
needed to use this skill.

| Deep dive | Adds |
|---|---|
| `search-pipeline.md` | Why the engine behaves this way: indexing and parsing stages, query assembly, order of operations, the Boolean and date engines, sorting and grouping internals, state ownership, constraints and architectural trade-offs. |
| `query-language-defects/` | The catalogued defects and documentation divergences — `D1`–`D5`, plus three surprising-but-intended behaviours — each with mechanism, reproduction steps and workaround, and a runnable verification harness. |

## How to consult on this

- **Never answer a "why doesn't this work" question without asking for, or reconstructing, three
  things**: the exact block source, the exact task line as it appears in the file, and the plugin
  version. The bug is usually in the second one.
- Quote the effective query, not the block source, when a global query or query file defaults are
  in play — the user is often unaware of them.
- Prefer built-in instructions over `filter by function`: they need no security opt-in, are
  explained by `explain`, and are faster. Reach for JS only when the reference confirms there is
  no built-in equivalent.
- Say plainly when something cannot be expressed (there is no `urgency` filter, no
  `group by description`, no time-of-day support, no configurable date format) and give the
  nearest workable alternative rather than inventing syntax.
