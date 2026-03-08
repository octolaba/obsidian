---
source: obsidian-tasks-group/obsidian-tasks
version: 8.3.0
basis: source
---

# Query language reference

Complete instruction set of a `tasks` code block.

Part of the [Tasks skill](../SKILL.md); its scope, prerequisites, evidence base and
claim-marking conventions apply here. Paths are relative to
`research/plugins/obsidian-tasks-group/obsidian-tasks` at tag `8.3.0`, commit `e16dbc2`.

## How a line is classified

`Query.parseLine` tests the line against these cases **in order** and takes the first that matches
(`src/Query/Query.ts:122`):

1. `preset <name>` — `/^preset +(.*)/i`
2. `short` (prefix match) → short mode
3. `full` (prefix match) → full mode
4. `explain` (prefix match)
5. `ignore global query`
6. `limit …` — `/^limit (groups )?(to )?(\d+)( tasks?)?/i` (`src/Query/Query.ts:62`)
7. `sort by …`
8. `group by …`
9. `view …`
10. `hide …` / `show …`
11. `#…` — comment, ignored (`src/Query/Query.ts:64`)
12. any filter
13. otherwise → error `do not understand query`

Instructions are case-insensitive, except: Boolean operators must be capitalised, regex patterns
and flags are case-sensitive, and JavaScript in `by function` instructions is case-sensitive
(`docs/Queries/About Queries.md:103`).

Filters are matched by trying each `Field` class in a fixed order and taking the first whose
`canCreateFilterForLine` returns true (`src/Query/FilterParser.ts:41`). `StatusNameField` and
`StatusTypeField` come before `StatusField` to avoid `status` swallowing `status.name`;
`BooleanField` is deliberately last. This is why an unbalanced Boolean line can produce a
confusing error: it is the last field asked.

## Filters

### Whole-line instructions

These use `FilterInstruction`, which requires the **entire line** to equal the instruction,
ignoring case (`src/Query/Filter/FilterInstruction.ts:30`). No extra words, no trailing text.

| Instruction | Meaning | Source |
|---|---|---|
| `done` | status type is `DONE`, `CANCELLED` or `NON_TASK` | `src/Query/Filter/StatusField.ts:20`, `src/Task/Task.ts:537` |
| `not done` | status type is `TODO`, `IN_PROGRESS` or `ON_HOLD` | `src/Query/Filter/StatusField.ts:21` |
| `is recurring` / `is not recurring` | has a **valid** recurrence rule | `src/Query/Filter/RecurringField.ts:9` |
| `is blocked` / `is not blocked` | depends on at least one not-done task that exists | `src/Query/Filter/BlockingField.ts:15`, `src/Task/Task.ts:552` |
| `is blocking` / `is not blocking` | some not-done task depends on this task's `id` | `src/Query/Filter/BlockingField.ts:7`, `src/Task/Task.ts:582` |
| `has id` / `no id` | `task.id` non-empty | `src/Query/Filter/IdField.ts:11` |
| `has depends on` / `no depends on` | `task.dependsOn` non-empty | `src/Query/Filter/DependsOnField.ts:11` |
| `has tag` / `has tags` / `no tag` / `no tags` | tag count | `src/Query/Filter/TagsField.ts:23` |
| `exclude sub-items` | task is not indented; indentation consisting only of blockquote/callout markers plus at most one space still counts as top-level | `src/Query/Filter/ExcludeSubItemsField.ts:10` |
| `has <field> date` / `no <field> date` / `<field> date is invalid` | for `cancelled`, `created`, `start`, `scheduled`, `due`, `done` | `src/Query/Filter/DateField.ts:30` |
| `has happens date` / `no happens date` | any / none of start, scheduled, due | `src/Query/Filter/HappensDateField.ts:14` |

Notes:

- `<field> date is invalid` means the value exists but is not a real calendar date (e.g.
  `2022-02-30`): `date !== null && !date.isValid()` (`src/Query/Filter/DateField.ts:32`).
- `happens` has **no** `happens date is invalid` variant — it replaces the default instruction set.
- Note the asymmetry: presence instructions use `start`, the comparison filter uses `starts`
  (`src/Query/Filter/StartDateField.ts:11`).
- `is blocked` / `is blocking` need the whole vault, supplied through `SearchInfo.allTasks`
  (`src/Query/SearchInfo.ts:19`). Only direct dependencies count, and done tasks are never blocked
  or blocking.

### Date comparison filters

```
(cancelled|created|starts|scheduled|due|done|happens) [<keyword>] <date>|<date range>
```

Keywords, from `src/Query/Filter/DateField.ts:147`: `on`, `in`, `before`, `after`,
`on or before`, `in or before`, `on or after`, `in or after`. Omitting the keyword means `on`/`in`.

Semantics (`src/Query/Filter/DateField.ts:108`), where the argument resolves to a range
`[start, end]` (a single date resolves to `start == end`):

| Keyword | Matches |
|---|---|
| `before` | `date < range.start` |
| `after` | `date > range.end` |
| `on or before`, `in or before` | `date <= range.end` |
| `on or after`, `in or after` | `date >= range.start` |
| `on`, `in`, omitted | `range.start <= date <= range.end` |

If the task has no value for that field, the result is `filterResultIfFieldMissing()`:
**`true` only for `starts`** (`src/Query/Filter/StartDateField.ts:17`), `false` for
`due`, `scheduled`, `done`, `cancelled`, `created`, `happens`.

`happens` is special twice over: the filter function returns true if **any** of start/scheduled/due
satisfies the predicate (`src/Query/Filter/HappensDateField.ts:57`), while `sort by happens` and
`group by happens` use the *earliest valid* of the three (`src/Task/Task.ts:742`).

#### How a date argument is resolved

`DateParser.parseDateRange` tries three parsers in order and takes the first that yields a valid
range (`src/DateTime/DateParser.ts:23`):

1. **relative range** — `/(last|this|next) (week|month|quarter|year)/` (`:63`), expanded to the whole
   period; weeks are ISO weeks, Monday to Sunday (`src/DateTime/DateRange.ts:37`);
2. **numbered range** — `YYYY`, `YYYY-Qq`, `YYYY-MM`, `YYYY-Www` (`:86`), expanded to the whole
   year, quarter, month or ISO week;
3. **absolute range via chrono** — if chrono finds two dates they become start and end, otherwise
   start = end (`:44`).

If all three fail, `DateField` re-parses the whole remainder *including the keyword* as a single date
(`src/Query/Filter/DateField.ts:80`). That fallback is what keeps `due in two weeks` working. If that
also fails: `do not understand <field> date`.

Properties of the resolution that change results:

- Every parsed date is normalised to local `startOf('day')` (`src/DateTime/DateParser.ts:5`), and a
  reversed pair is silently reordered (`src/DateTime/DateRange.ts:16`).
- chrono runs with `forwardDate: false`, so a bare weekday resolves to the **closest** one, which may
  be in the past. On a Wednesday, `due tuesday` means yesterday; use `next tuesday`.
- ⚠️ **The relative-range pattern is not anchored**, so it matches inside a longer word:
  `due next weekend` is silently read as `due next week`, and `last quarterly review` as
  `last quarter`. No error is raised. This is catalogued as defect D1 in the `query-language-defects`
  deep dive of this research repository; the workaround is an explicit date or `before in N days`.
- Free text is accepted (`25th May 2023`, `14 October`, `May`, `14 days ago`), but two adjacent
  non-numeric dates are ambiguous as a range — upstream recommends `YYYY-MM-DD`
  (`docs/Queries/Filters.md:178`).
- A date filter still containing unexpanded template text is rejected outright, to catch Templater
  placeholders that never rendered (`src/Query/Filter/DateField.ts:51`).

Always confirm the resolved dates with `explain`: it prints them as
`YYYY-MM-DD (dddd Do MMMM YYYY)`.

### Text filters

```
<field> (includes|does not include) <text>
<field> (regex matches|regex does not match) /<pattern>/[flags]
```

Operator set from `src/Query/Filter/TextField.ts:76`. `includes` is a case-insensitive substring
test (`src/Query/Matchers/SubstringMatcher.ts:27`). The negated forms are the plain negation of the
match, so a task with an empty value matches `does not include <anything>`.

Fields: `description`, `path`, `folder`, `root`, `filename`, `heading`, `status.name`,
`recurrence`, `id`.

| Field | Value searched | Source |
|---|---|---|
| `description` | description with all parsed signifiers already removed, then the global filter removed as a substring, trimmed. Tags stay in. | `src/Query/Filter/DescriptionField.ts:24` |
| `path` | full path **including `.md`** | `src/Query/Filter/PathField.ts:21` |
| `folder` | folder with trailing `/`; `/` for vault root | `src/Scripting/TasksFile.ts:186` |
| `root` | first path segment with trailing `/`; `/` for vault root | `src/Scripting/TasksFile.ts:172` |
| `filename` | file name **including `.md`**; empty string if unknown | `src/Query/Filter/FilenameField.ts:21` |
| `heading` | nearest preceding heading at any level, `''` if none — so `does not include X` matches tasks with no heading | `src/Query/Filter/HeadingField.ts:18` |
| `status.name` | the name configured for the status symbol; `Unknown` for unregistered symbols | `src/Query/Filter/StatusNameField.ts:16` |
| `recurrence` | the **standardised** rule text (`🔁 every Sunday` → `every week on Sunday`); `''` if absent or invalid | `src/Query/Filter/RecurrenceField.ts:10` |
| `id` | `task.id`, `''` if absent | `src/Query/Filter/IdField.ts:40` |

Tags additionally accept the plural field name and two extra operators
(`src/Query/Filter/MultiTextField.ts:30`):

```
(tag|tags) (includes|does not include|include|do not include) <text>
(tag|tags) (regex matches|regex does not match) /<pattern>/[flags]
```

The test is "any tag matches" (`src/Query/Filter/MultiTextField.ts:56`), and tag values are stored
**with** the leading `#` (`src/Task/TaskRegularExpressions.ts:67`). Consequences:

- `tags include home` matches `#home`, `#homework`, `#location/home`.
- `tags include #home` matches `#home` and `#homework`, but not `#location/home`.
- Exact tag, no sub-tags: `tag regex matches /#home$/i`.
- Tasks recognises a looser tag syntax than Obsidian: any characters except space and
  `` !@#$%^&*(),.?":{}|<> `` — so `#1234` is a tag to Tasks but not to Obsidian
  (`docs/Getting Started/Tags.md:49`).

Regex rules (`src/Query/Matchers/RegexMatcher.ts:30`): the argument must be
`/pattern/` or `/pattern/flags`, flags typically `i` (case-insensitive) or `u`. Since 8.3.0 patterns
longer than 500 characters, or with nested quantifiers such as `(a+)+`, are rejected outright
(`src/lib/RegExpTools.ts:17`). Lookahead/lookbehind is untested upstream and presumed broken on iOS
(`docs/Queries/Regular Expressions.md`).

### Priority

```
priority [is] [above|below|not] (lowest|low|none|medium|high|highest)
```

The regex is anchored at both ends (`src/Query/Filter/PriorityField.ts:15`), so nothing may follow.
Comparison is a string compare on the numeric priority code, where lower code = higher priority
(`src/Task/Priority.ts:11`):

```
Highest 0   High 1   Medium 2   None 3   Low 4   Lowest 5
```

`above X` means code `< X`, `below X` means code `> X`
(`src/Query/Filter/PriorityField.ts:53`). Because `None` sits between `Medium` and `Low`:

- `priority is above none` → Highest, High, Medium
- `priority is below none` → Low, Lowest
- `priority is above low` → Highest, High, Medium **and None**
- `priority is not none` → everything with an explicit priority signifier

### Status type

```
status.type (is|is not) (TODO|DONE|IN_PROGRESS|ON_HOLD|CANCELLED|NON_TASK)
```

Anchored, and the value must be a single token with no spaces
(`src/Query/Filter/StatusTypeField.ts:61`). Values are case-insensitive, so `in_progress` works.
There is a seventh internal type, `EMPTY`: the parser accepts `status.type is EMPTY` because the
lookup succeeds (`src/Query/Filter/StatusTypeField.ts:35`), but it is omitted from the help text and
no normally-parsed task carries it, so such a search matches nothing.

For multiple allowed types, either use several `status.type is not` lines (AND-ed), or one Boolean
line: `(status.type is TODO) OR (status.type is IN_PROGRESS)`.

### Boolean combinations

```
<sub-filter> <OP> <sub-filter> …        with each sub-filter wrapped in one delimiter pair
NOT <sub-filter>
```

Operators: `AND`, `OR`, `NOT`, `AND NOT`, `OR NOT`, `XOR`
(`src/Query/Filter/BooleanField.ts:31`). Must be capitalised. Delimiter pairs: `(…)`, `[…]`,
`{…}`, `"…"` — and they **cannot be mixed within one line**
(`src/Query/Filter/BooleanDelimiters.ts:7`, `:72`). Precedence `NOT` > `XOR` > `AND` > `OR`
(`docs/Queries/Combining Filters.md:77`). Spaces around operators are optional since 7.0.0;
missing ones are inserted (`src/Query/Filter/BooleanPreprocessor.ts:93`).

Known sharp edges:

- A sub-filter that itself **ends** with the closing delimiter breaks the split. The preprocessor
  separates operators and delimiter runs textually, and its own comment records the exception: spaces
  and `)` at the end of a sub-expression are taken as Boolean structure, not filter text
  (`src/Query/Filter/BooleanPreprocessor.ts:20`). So `(description includes (maybe))` splits as
  `(f1))` with `f1 = description includes (maybe`. Fix by switching to `[…]`, appending `;` before
  the closing delimiter, or moving the logic into one `filter by function` with `&&`/`||`/`!`.
- Chained `XOR` does not mean "exactly one": it is a two-argument operator applied left to right, so
  `a XOR b XOR c` is true for exactly one *and* for all three.
- `preset <name>` cannot be used inside a Boolean line (`docs/Queries/Presets.md`).
- There is no short-circuiting: every sub-expression is evaluated for every task
  (`src/Query/Filter/BooleanField.ts:150`).

When a Boolean line fails, the error prints the simplified line plus each sub-expression with an
`OK`/`ERROR` verdict (`src/Query/Filter/BooleanField.ts:263`). Read that instead of guessing.

### Custom filter

```
filter by function <JavaScript expression>
```

Requires the JS opt-in and must evaluate to a boolean. See [scripting.md](scripting.md).

### Not filterable

There is no built-in filter for: `urgency` (`src/Query/Filter/UrgencyField.ts:17`),
`backlink` (`src/Query/Filter/BacklinkField.ts:19`), status symbol, next status symbol,
`on completion`, list marker, line number, original markdown, `dependsOn` values beyond
`has`/`no depends on`, or `description without tags`. All are reachable via `filter by function`.

## Sorting

```
sort by <field> [reverse]
sort by tag [reverse] [<n>]
sort by function [reverse] <JavaScript expression>
```

The default regex is `^sort by <field>( reverse)?` with **no end anchor**
(`src/Query/Filter/Field.ts:175`), so trailing junk is silently ignored.

Supported fields (`supportsSorting() === true`): `status`, `status.name`, `status.type`,
`recurring`, `priority`, `urgency`, `random`, `description`, `tag`, `heading`, `path`, `filename`,
`id`, `function`, and all seven date fields `cancelled`, `created`, `start`, `scheduled`, `due`,
`done`, `happens`.

**Not** sortable: `folder`, `root`, `backlink`, `recurrence`.

Details worth knowing:

- Dates: tasks with a value sort before tasks without; invalid dates sort after valid ones
  (`src/DateTime/DateTools.ts:3`).
- `sort by status` collapses to Todo/Done only (`src/Query/Filter/StatusField.ts:36`); use
  `sort by status.type` for the finer order.
- `sort by urgency` is descending by design, highest urgency first
  (`src/Query/Filter/UrgencyField.ts:38`).
- `sort by tag <n>` sorts by the n-th tag, 1-based; tasks with fewer tags sort last
  (`src/Query/Filter/TagsField.ts:66`).
- `sort by random` is stable within a day: the key is a hash of the date plus the description
  (`src/Query/Filter/RandomField.ts:29`).
- `sort by description` compares a lightly de-marked-up description: a leading link, bold, italic
  or highlight is unwrapped first (`src/Query/Filter/DescriptionField.ts:57`).
- Five default sorters are always appended after yours and cannot be turned off
  (`src/Query/Sort/Sort.ts:25`).

## Grouping

```
group by <field> [reverse]
group by function [reverse] <JavaScript expression>
```

The grouper regex **is** anchored (`src/Query/Filter/Field.ts:287`), so unrecognised trailing text
is an error rather than being ignored.

Supported fields: `status`, `status.name`, `status.type`, `priority`, `urgency`, `recurring`,
`recurrence`, `tags` (plural only), `id`, `path`, `folder`, `root`, `filename`, `backlink`,
`heading`, `function`, and all seven date fields.

**Not** groupable: `description`, `random`. Use `group by function task.description` instead
(`docs/Queries/Grouping.md:541`).

Heading values:

| Grouper | Heading |
|---|---|
| date fields | `YYYY-MM-DD dddd`, or `No <field> date`, or `%%0%% Invalid <field> date` (`src/Query/Filter/DateField.ts:267`) |
| `status` | `Todo` / `Done` (`src/Query/Filter/StatusField.ts:67`) |
| `status.type` | `%%N%%TYPE`, N ordering IN_PROGRESS, TODO, ON_HOLD, DONE, CANCELLED, NON_TASK, EMPTY (`src/Statuses/Status.ts:150`) |
| `priority` | `%%N%%<Name> priority`, with `None` renamed `Normal` (`src/Task/Task.ts:620`) |
| `tags` | one heading per tag; `(No tags)` when none — a multi-tag task appears in several groups (`src/Query/Filter/TagsField.ts:134`) |
| `urgency` | the score to 2 decimals, ordered high→low by default (`src/Query/Filter/UrgencyField.ts:52`) |
| `heading` | the heading text, or `(No heading)` |
| `filename` | `[[filename]]`; `Unknown Location` if unknown |
| `backlink` | `[[file#heading\|file > heading]]` |
| `path`, `folder`, `root` | the value, with `\` and `_` escaped for Markdown (`src/Query/Filter/TextField.ts:126`) |
| `recurring` | `Recurring` / `Not Recurring` |

Multiple `group by` lines nest, rendered as `h4`, `h5`, then `h6`
(`docs/Queries/Grouping.md:1004`). Groups are ordered by comparing heading strings level by level
with `localeCompare(..., { numeric: true })`, negated per level when that level said `reverse`
(`src/Query/Group/TaskGroups.ts:102`). The `%%N%%` prefixes exist purely to force a sensible order
out of that string comparison; Obsidian hides them when rendering.

## Layout and display

```
short | full
hide <element> | show <element>
view list | view columns by <group-field> [reverse]
limit [to] <n> [tasks]
limit groups [to] <n> [tasks]
explain
ignore global query
preset <name>
# comment
```

Task elements (all shown by default) — `src/Layout/TaskLayoutOptions.ts:105`:
`id`, `depends on`, `priority`, `recurrence rule`, `on completion`, `created date`, `start date`,
`scheduled date`, `due date`, `cancelled date`, `done date`, `tags`.
Description and block link cannot be hidden.

Query elements — `src/Layout/QueryLayoutOptions.ts:6`:

| Element | Default |
|---|---|
| `toolbar` | shown |
| `edit button` | shown |
| `postpone button` | shown |
| `backlink` | shown |
| `nested backlink` | shown |
| `task count` | shown |
| `urgency` | **hidden** |
| `tree` | **hidden** |

Matching is by prefix — `option.startsWith(key)` — so `hide backlinks` and `hide backlink` both
work (`src/Layout/QueryLayoutOptions.ts:41`). An unrecognised element is an error.

`view columns by <field>` renders each top-level group as a column; the grouping expression uses
the same vocabulary as `group by`, and the column grouper is prepended to any `group by` lines
(`src/Layout/ViewLayoutOptions.ts:62`, `src/Query/Query.ts:381`).

`limit` slices the sorted list before grouping; `limit groups` applies per group and is ignored if
there is no `group by` (`src/Query/Group/TaskGroups.ts:143`). When a limit hides tasks, the footer
shows `N of M tasks` (`src/Query/QueryResult.ts:37`).

`short mode` renders each field as its bare symbol with no value
(`src/TaskSerializer/DefaultTaskSerializer.ts:119`). `full` reverses it. Later layout instructions
override earlier ones, which is how a block overrides the global query.

Comments: a line starting with `#` is dropped. Inline `{{! … }}` comments are removed during
placeholder expansion (`docs/Queries/Comments.md:18`).

## Presets

`preset <name>` looks the name up in settings and parses each of its lines as if written inline
(`src/Query/Query.ts:520`). `{{preset.<name>}}` inserts the text as a placeholder, which also
allows partial lines. Built-in presets (`src/Query/Presets/Presets.ts:2`):

| Name | Expansion |
|---|---|
| `this_file` | `path includes {{query.file.path}}` |
| `this_folder` | `folder includes {{query.file.folder}}` |
| `this_folder_only` | `filter by function task.file.folder === query.file.folder` (needs the JS opt-in) |
| `this_root` | `root includes {{query.file.root}}` |
| `hide_date_fields` | hides all six date fields |
| `hide_non_date_fields` | hides id, depends on, recurrence rule, on completion, priority |
| `hide_query_elements` | hides toolbar, postpone button, edit button, backlinks |
| `hide_everything` | the three `hide_*` presets combined |

An unknown preset name produces an error that lists every defined preset
(`src/Query/Presets/Presets.ts:41`) — a fast way to show a user what they actually have configured.
