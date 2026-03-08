---
source: obsidian-tasks-group/obsidian-tasks
version: 8.3.0
basis: source
---

# Debugging Tasks queries

A protocol, the available instruments, and a cause catalogue indexed by symptom.

Part of the [Tasks skill](../SKILL.md); its scope, prerequisites, evidence base and
claim-marking conventions apply here. Paths are relative to
`research/plugins/obsidian-tasks-group/obsidian-tasks` at tag `8.3.0`, commit `e16dbc2`.

## Rules of engagement

1. **Never reason about the query alone.** Wrong results have three possible homes: the task line,
   the index, and the query. Establish which before theorising.
2. **Collect three facts first**: the exact block source, the exact task line copied verbatim from
   the `.md` file (not retyped — whitespace and non-breaking spaces matter), and the plugin
   version.
3. **Bisect, don't stare.** Empty the query, confirm, then add instructions back one at a time.
4. **Trust `explain` over your own reading of dates and Boolean logic.**
5. **Change one thing at a time**, and re-check after each change.

## The protocol

### Step 0 — Restart Obsidian once

Upstream's own first instruction, and it resolves a real class of problems: the global filter and
some other settings only take effect after a restart
(`docs/Getting Started/Getting Started.md`, `docs/Getting Started/Global Filter.md:36`).
If the block shows a loading message, the cache has not reached `Warm` yet
(`src/Renderer/QueryResultsRendererBase.ts:45`).

### Step 1 — Is the task in the index at all?

Put an empty block in the **same note** as the failing query (same note, because query file
defaults and placeholders are note-scoped):

````text
```tasks
```
````

That matches every indexed task (`src/Query/Explain/Explainer.ts:61`). If the global query filters
it, add `ignore global query`:

````text
```tasks
ignore global query
```
````

- **Task absent** → indexing or parsing problem. Go to Step 2.
- **Task present** → query problem. Go to Step 3.

If the vault is large, scope without risking a false negative — path filters are cheap and
independent of the task's own fields:

````text
```tasks
ignore global query
path includes <part of the file name>
show tree
explain
```
````

`show tree` matters here: if the line is a *list item* rather than a Task — the outcome when the
global filter rejects it or when `taskRegex` does not match — it can still appear as a child under
its parent task, which distinguishes "not a Task" from "not in the file at all".

### Step 2 — Why is it not indexed?

Work down; each is a single yes/no check.

| Check | Detail |
|---|---|
| File extension is `.md`? | Non-`.md` is skipped, Canvas included (`src/Obsidian/Cache.ts:291`). |
| Line is a real checkbox? | Must match `taskRegex` (`src/Task/TaskRegularExpressions.ts:24`). Watch for a missing space after the marker, a missing space inside `[ ]`, or `[]` with nothing between the brackets. |
| Description on one line? | Only the first line is read. |
| Global filter set, and present in the line? | Substring test (`src/Config/GlobalFilter.ts:52`). Check Settings → Tasks → Global filter; `explain` prints it. |
| Task inside a **titled callout**, and this vault ever ran Obsidian 1.6.0–1.6.3? | Rebuild vault cache: Settings → Files and links → Advanced. Per vault, per device (`docs/Support and Help/Missing tasks in callouts with some Obsidian 1.6.x versions.md`). |
| Does Obsidian itself see the checkbox? | Toggle it in Reading view. If Obsidian toggles the *wrong* line, its cache is stale — rebuild it. |
| Anything else odd about the file? | A cache reporting a line past end-of-file makes the parser abandon the remainder of that file (`src/Obsidian/FileParser.ts:82`). Make a trivial edit to force a re-read. |

If none apply, enable `showTaskHiddenData` (Instrument 3) and check whether the task appears at all
with a plausible line number.

### Step 3 — Which instruction rejects it?

Start from the empty block and add instructions one at a time, in query order, with `explain`
present throughout. The first instruction that makes the task disappear is the culprit.

For the culprit, ask **"is the filter wrong, or is the value not what I think?"** Answer it with a
grouping probe — group headings print the value Tasks actually holds, and need no JS opt-in:

````text
```tasks
ignore global query
path includes <the file>
group by due
group by tags
group by status.name
group by priority
group by happens
group by recurrence
explain
```
````

Read the nested headings for your task. `No due date` under a line that clearly shows `📅` is a
parsing failure, not a filter failure — go to [Step 3a](#step-3a--the-backwards-signifier-scan).

### Step 3a — the backwards signifier scan

The rule that explains most parsing failures, and the one to reach for whenever a value on the line
is not the value the query sees.

Every signifier pattern is anchored at the **end of the line**
(`src/TaskSerializer/DefaultTaskSerializer.ts:68`): the field regex is built as
`symbol + optional U+FE0F + ' *' + value + '$'`. `deserialize` then loops, each pass matching a
pattern against the current end of the line and stripping what it matched, up to 20 passes
(`src/TaskSerializer/DefaultTaskSerializer.ts:327`). Trailing tags are stripped by the same loop,
held aside, and re-appended to the description afterwards (`:355`, `:386`).

**So the scan stops at the first text that is neither a signifier nor a tag, and every signifier to
the left of that text stays in the description as literal characters.**

```text
- [ ] check 📅 2022-12-29 ✅ 2023-01-09 > appointment 19.1.
```

That task has **no due date and no done date**. Its description is the whole string after the
checkbox (`docs/How To/Find tasks with invalid data.md:20`). It can never match `due …`, and
`no due date` matches it.

Corollaries worth checking in order:

1. **Trailing prose** — the case above. Move any prose before the first signifier.
2. **Tags are exempt**, and only tags: they may be interleaved freely
   (`docs/Getting Started/Tags.md:78`).
3. **Non-breaking spaces** — separators are matched with ordinary ` *`, so an NBSP pasted from the
   web silently breaks the field (upstream issue #606).
4. **Variation selectors** — exactly one `U+FE0F` directly after the symbol is tolerated
   (`src/TaskSerializer/DefaultTaskSerializer.ts:70`); anything else is not. Note the upstream
   limitations page states that none are understood, which is broader than the code.
5. **Invalid calendar dates** — `📅 2022-02-30` parses to an *invalid* date, not a missing one. Find
   these with `<field> date is invalid`, not with `no <field> date`.

Confirm any of these with the [unread-emoji sweep](#instrument-4--the-unread-emoji-sweep), or on a
single task by opening it in the Create/edit modal: a signifier still visible in the Description box
was not parsed.

### Step 4 — Confirm the fix against both directions

Re-check a task that **should** match and one that **should not**. A filter that was too broad and
is now too narrow looks identical from one example.

## Instruments

### Instrument 1 — `explain`

Add `explain` anywhere in the block. It prints, in order: any global filter, the global query
explanation, the query-file-defaults explanation, then this block's explanation
(`src/Query/QueryRendererHelper.ts:30`).

What to look for:

- **Real dates.** `due before in 7 days` becomes `due date is before 2022-09-15 (Thursday …)`.
  Compare against the task's date arithmetically, not by eye.
- **`OR no <field> date` suffixes.** This is how a `starts` filter admits undated tasks
  (`src/Query/Filter/DateField.ts:234`).
- **Boolean shape.** `AND (All of)` / `OR (At least one of)` / `NOT` trees show where the
  parentheses actually landed.
- **Filters you did not write.** Anything under the global-query or query-file-defaults headings.
- **`No filters supplied. All tasks will match the query.`** — the query is emptier than intended,
  often because a `#` comment swallowed a line.
- **The regex actually compiled**, printed as `using regex: '…' with flag 'i'`.
- **Placeholder expansion**, printed as `instruction => expanded instruction`.
- Continuation-line handling, printed as the `raw => joined => expanded` chain
  (`src/Query/Statement.ts:56`).

### Instrument 2 — the toolbar "copy results"

The toolbar above results (shown by default) copies the rendered result set as Markdown, plus any
error text (`docs/Queries/Layout.md:104`). Use it to capture exact output for comparison after a
change, or to paste into a bug report. Its filter box also lets you narrow results by description
temporarily, without editing the query — note that it is case-insensitive but word-order sensitive.

### Instrument 3 — `data.json` debug switches

Not exposed in the settings UI. Edit `<vault>/.obsidian/plugins/obsidian-tasks-plugin/data.json`
and restart Obsidian. Defaults come from `src/Config/DebugSettings.ts:1`:

```json
"debugSettings": {
  "ignoreSortInstructions": false,
  "showTaskHiddenData": false,
  "recordTimings": false
}
```

- **`showTaskHiddenData: true`** — the best single instrument for parsing problems. Under every
  rendered task it appends line number, section start, section index, the **original markdown**, the
  path, and the preceding header (`src/Renderer/TaskLineRenderer.ts:326`). Comparing
  `originalMarkdown` with the rendered fields shows immediately what was and was not parsed.
- **`ignoreSortInstructions: true`** — disables all sorting, including the five defaults, so tasks
  appear in file order (`src/Query/Query.ts:376`). Useful when diagnosing sort surprises; `explain`
  reports that it is on (`src/Query/Explain/Explainer.ts:108`).
- **`recordTimings: true`** — enables `PerformanceTracker`, for "why is this slow" questions
  (`src/lib/PerformanceTracker.ts:71`).

Back up `data.json` before editing, and remove the switches afterwards.

### Instrument 4 — the unread-emoji sweep

Finds every task whose signifiers were not parsed, vault-wide, because an unparsed emoji stays in
the description (`docs/How To/Find tasks with invalid data.md:31`):

````text
```tasks
# All on one line:
(description includes 🔺) OR (description includes ⏫) OR (description includes 🔼) OR (description includes 🔽) OR (description includes ⏬) OR (description includes 🛫) OR (description includes ➕) OR (description includes ⏳) OR (description includes 📅) OR (description includes ✅) OR (description includes ❌) OR (description includes 🔁) OR (description includes 🏁) OR (description includes ⛔) OR (description includes 🆔)

# Optionally exclude templates:
# path does not include _templates

group by path
```
````

Companion sweeps:

````text
```tasks
# Invalid calendar dates such as 2022-02-30, all on one line:
(cancelled date is invalid) OR (created date is invalid) OR (done date is invalid) OR (due date is invalid) OR (scheduled date is invalid) OR (start date is invalid)
group by path
```
````

````text
```tasks
# Status symbols not registered in settings:
status.name includes unknown
group by path
```
````

````text
```tasks
# Broken recurrence rules (needs the JavaScript opt-in):
is not recurring
filter by function task.originalMarkdown.includes('🔁')
```
````

### Instrument 5 — console logging

Log levels live in `data.json` under `loggingOptions.minLevels` and are not in the settings UI
(`src/Config/Settings.ts:162`). Set the modules you care about to `debug`:

```json
"loggingOptions": {
  "minLevels": {
    "": "info",
    "tasks": "info",
    "tasks.Cache": "debug",
    "tasks.Query": "debug",
    "tasks.Task": "info",
    "tasks.File": "info",
    "tasks.Events": "info"
  }
}
```

Restart, then open the developer console (macOS `Cmd+Opt+I`). Useful lines:

- `tasks.Cache`: `Cache.indexFile: <path>: read N task(s)` — proves whether a file was read and how
  many tasks came out (`src/Obsidian/Cache.ts:359`); also `state = Warm` transitions
  (`src/Obsidian/Cache.ts:258`).
- `tasks.Query`: `[search] Executing query:` with the full effective source between marker lines
  (`src/Query/Query.ts:361`) — **this is how you see the concatenation of global query, query file
  defaults and block source as one text**. And `[render] N tasks displayed`
  (`src/Renderer/QueryResultsRendererBase.ts:92`).
- `[render][observer] Became visible …` — confirms the visibility-driven re-render
  (`src/Renderer/QueryRenderer.ts:217`).

Each query execution is tagged with a stable per-block id so concurrent blocks can be told apart
(`src/Query/Query.ts:556`).

### Instrument 6 — `Tasks: Show debug info`

Referenced by the plugin's own error text as the thing to attach to a bug report
(`src/Obsidian/Cache.ts:397`). Run it from the command palette when escalating upstream.

## Cause catalogue

### Symptom: a task is missing, and no query finds it

| Cause | Confirm | Fix |
|---|---|---|
| Global filter absent from the line | Settings → Tasks → Global filter; `explain` header | Add the filter text to the line, or clear the setting and restart |
| Not a valid checkbox line | Compare against `taskRegex` | Fix the marker/brackets/spacing |
| Multi-line description | Look at the file | Put it on one line |
| Titled callout + stale Obsidian cache | Obsidian version history; toggling checks the wrong line | Rebuild vault cache, per device |
| Non-`.md` file (Canvas card) | File extension | Convert the card to a note |
| Task inside a code fence | Obsidian does not report it as a list item | Move it out |

### Symptom: a task is missing from one specific query

| Cause | Confirm | Fix |
|---|---|---|
| A signifier was never parsed | `group by due` etc. says `No … date`; edit modal shows the emoji in Description | Move trailing prose before the signifiers |
| Invalid calendar date | `<field> date is invalid` finds it; renders as `Invalid date` | Fix the date via the backlink, not the edit modal (which discards the bad value) |
| Wrong date field | `group by happens` vs `group by due` | Use `happens`, or the right field |
| Date filter is off by one | Read the expanded date in `explain` | `before in 8 days` for a 7-day window including today; `before tomorrow` for "today or earlier" |
| Relative range matched a longer word | `explain` shows a Mon–Sun range for `next weekend` | Use an explicit date or `before in N days` |
| chrono chose the past | `explain` shows a past date for a bare weekday | Say `next tuesday` |
| Status not registered | `status.name includes unknown` finds it | Register the symbol in settings, or search by `status.type` |
| `not done` excluded it | The status type is `DONE`/`CANCELLED`/`NON_TASK` | `status.type is …`, or fix the status |
| Tag search too strict | `group by tags` shows the real tags | `#` is optional but if given must be present literally; a global filter tag is stripped |
| Boolean brackets landed elsewhere | The `AND/OR` tree in `explain` | Add explicit parentheses |
| Boolean split broke on a trailing `)` | Error output shows `(f1))` and truncated sub-expressions | Switch delimiters or append `;` |
| Global query or `TQ_extra_instructions` narrows it | The corresponding `explain` sections | `ignore global query`, or remove the frontmatter property |
| `limit` cut it off | Footer says `N of M tasks` | Raise or drop the limit |
| Earlier parse error | Block renders an error, not results | Fix the topmost error |
| `filter by function` disabled | Error mentioning JavaScript being disabled | Settings → Tasks → Searches → Enable custom searches, per device |

### Symptom: unexpected extra tasks

| Cause | Confirm | Fix |
|---|---|---|
| `starts …` admits undated tasks | `explain` shows `OR no start date` | `(starts before X) AND (has start date)` |
| `show tree` draws non-matching children | Remove `show tree` | Accept, or use flat mode |
| Unregistered status symbols count as `TODO` | `status.name includes unknown` | Register them |
| `done` includes cancelled and non-task | `group by status.type` | `status.type is DONE` |
| Substring matching is broader than intended | `explain` shows the plain instruction | Use `regex matches` with `^`/`$`, or `filter by function` with `===` |
| `path includes .md` | — | Use a real path fragment |
| `priority is above low` includes no-priority | Priority codes place `None` between Medium and Low | `priority is above none` |
| `group by tags` duplicates rows | Task count is lower than the visible rows | Expected: one row per tag |
| Global filter matched as a substring | `#tasks` satisfies filter `#task` | Use a more distinctive filter |

### Symptom: results are stale or do not update

| Cause | Confirm | Fix |
|---|---|---|
| Block was off-screen | `[render][observer]` messages | Scroll it into view; it re-renders on visibility (`src/Renderer/QueryRenderer.ts:200`) |
| Relative dates did not roll over | Query still uses yesterday's dates after a sleep at midnight | Reopen the note (upstream issue #1289) |
| Cache still initialising | Loading message | Wait, or restart |
| Settings changed | Global filter and format changes need a restart | Restart Obsidian |
| Edited the query's own note, no re-run | Only path or frontmatter changes retrigger (`src/Renderer/QueryRenderer.ts:230`) | Reopen the note |
| Changed a `data.json` switch | Not read live | Restart |

### Symptom: an error message

| Message | Meaning |
|---|---|
| `do not understand query` | No field claimed the line. Check spelling, and whether the instruction exists at all (there is no `urgency` filter, no `group by description`). |
| `do not understand query filter (<field>)` | The field matched but the operator or value did not. Check the operator spelling exactly: `includes`, `does not include`, `regex matches`, `regex does not match` — plus `include`/`do not include` for tags only. |
| `do not understand <field> date` | The date argument resolved to nothing. Prefer `YYYY-MM-DD`. |
| `All filters in a Boolean instruction must be inside one of these pairs of delimiter characters` | Mixed or missing delimiters (`src/Query/Filter/BooleanDelimiters.ts:72`). |
| `malformed boolean query -- Invalid token` | The preprocessor split badly. Read the `simplified line` and per-sub-expression `OK`/`ERROR` list in the error (`src/Query/Filter/BooleanField.ts:263`). |
| `couldn't parse sub-expression '…'` | A Boolean sub-expression is not a valid filter on its own. Test it as a standalone line. |
| `Invalid status.type instruction` | The value is not one of the six types, or has a space in it. |
| `do not understand hide/show option` | Unknown layout element; see the element lists in [query-language.md](query-language.md#layout-and-display). |
| `There was an error expanding one or more placeholders. … Unknown property: …` | Placeholder names are case-sensitive; check against the known list. |
| `Cannot find preset "x" in the Tasks settings` | The message lists every defined preset — read it. |
| `JavaScript is now disabled in Tasks queries by default` | The 8.0.0 opt-in (`src/Scripting/JsInTasksQueriesDisabledError.ts:2`). |
| `filtering function must return true or false. This returned "undefined"` | A `filter by function` body with no value — often the `return`-substring trap (`src/Scripting/Expression.ts:28`). |
| `Search failed` | A filter threw at runtime; the offending instruction is quoted (`src/Query/Query.ts:391`). |
| `Regular expression /…/ may cause performance problems` | Nested quantifiers rejected since 8.3.0 (`src/lib/RegExpTools.ts:22`). |
| `Regular expression pattern is too long` | Over 500 characters (`src/lib/RegExpTools.ts:18`). |
| `There was an error reading one of the tasks in this vault` | A parse exception; the notice names file, line and text (`src/Obsidian/Cache.ts:384`). Worth an upstream bug report. |
| `Loading Tasks ...` that never finishes | Historically a stale metadata cache; rebuild it (`src/Obsidian/FileParser.ts:71`). |

## Escalating to upstream

Before filing, gather: plugin version, Obsidian version, OS, the block source, the offending task
line copied verbatim, the `explain` output, the output of `Tasks: Show debug info`, and console
output with `tasks.Query` and `tasks.Cache` at `debug`
(`docs/Support and Help/Report a Bug.md`). Reproduce in the upstream sample vault if you can —
it eliminates the user's other plugins and CSS as variables.
