---
source: obsidian-tasks-group/obsidian-tasks
version: 8.3.0
basis: source
---

# Defects and divergences in the Tasks query language

## Research question

While building [the Tasks skill](../../../skills/tasks/SKILL.md), reading the query engine surfaced
behaviours that are neither documented nor obviously intended. **Which of them are genuine defects,
which are documentation that no longer matches the implementation, and which are deliberate design
that merely surprises users?** For each, what is the mechanism, how is it reproduced, and what
should a user do about it?

## Scope

- **In scope:** durable behaviours of the query language and task parser, reproducible from the
  pinned commit, that cause a query to silently return the wrong tasks or to silently ignore part of
  an instruction.
- **Out of scope:** performance, the editing UI, recurrence arithmetic, rendering and CSS, mobile
  behaviour, and anything requiring a running Obsidian instance to observe.
- **Deliberately excluded:** bugs already tracked upstream and already documented as limitations.
  They are listed in [Known upstream issues, not findings here](#known-upstream-issues-not-findings-here)
  so this artifact is not mistaken for a complete bug list.
- The guidelines exclude "transient bugs" from research artifacts. Everything below is a property of
  the pinned source, reproducible on demand, and independent of any particular vault — not a
  transient failure. Three items are behaviour-by-design and recorded here precisely so they are
  *not* reported upstream as bugs.

## Source and evidence

Single primary source: the `obsidian-tasks-group/obsidian-tasks` submodule at
`research/plugins/obsidian-tasks-group/obsidian-tasks`, tag `8.3.0`, commit `e16dbc2`. All
`path:line` citations are relative to that root. No web or secondary sources were used; upstream
issue numbers quoted below come from the pinned documentation, not from GitHub.

**How claims are marked.** A citation into `src/…` is behaviour read from the implementation. A
citation into `docs/…` is a documented contract. Anything I concluded rather than read or executed
is prefixed `Inference:`. Anything I could not establish is prefixed `Unverified:`. Advice is
prefixed `Recommendation:`.

**Empirical verification.** `verify.mjs` beside this file reproduces the mechanism of each finding.
It reads the relevant patterns and heuristics *out of the pinned source* instead of copying them, so
it exits with status 2 if the pin moves and upstream has changed that code.

```console
$ node results/deep-dives/tasks/query-language-defects/verify.mjs
pinned plugin version: 8.3.0
node: v26.5.0
...
All expectations held.
$ echo $?
0
```

Observed on node v26.5.0. The harness exercises the patterns in isolation; it does not run the
plugin. Where a finding's end-to-end effect inside Obsidian was not executed, it is marked
`Inference:` and an in-Obsidian reproduction is given for the reader to run.

## Summary

| ID | Finding | Classification |
|---|---|---|
| [D1](#d1--relative-date-ranges-match-inside-longer-words) | `due next weekend` is silently read as `due next week` | **Defect** — silent misinterpretation |
| [D2](#d2--return-is-detected-by-substring-not-by-syntax) | An expression containing the word `return` breaks `filter by function` | **Defect** — heuristic misfires |
| [D3](#d3--sort-by-accepts-trailing-junk-group-by-does-not) | `sort by due reverssse` silently sorts non-reversed | **Defect** — silent acceptance of malformed input |
| [D4](#d4--documentation-says-placeholders-in-comments-are-reported-the-code-skips-them) | Docs claim placeholders in comments are reported; the code skips comments | **Divergence** — stale documentation |
| [D5](#d5--documentation-says-variation-selectors-are-not-understood-the-code-allows-one) | Docs claim variation selectors are not understood; one trailing VS16 is allowed | **Divergence** — documentation narrower than code |
| [N1](#n1--priority-is-above-low-includes-tasks-with-no-priority) | `priority is above low` includes tasks with no priority | **By design** — consistent with documented ordering |
| [N2](#n2--starts--matches-tasks-with-no-start-date) | `starts …` matches tasks with no start date | **By design** — documented and intentional |
| [N3](#n3--boolean-sub-expressions-cannot-end-with-the-closing-delimiter) | A sub-expression ending in `)` breaks a Boolean line | **Known limitation** — acknowledged in code and docs |

---

## D1 — relative date ranges match inside longer words

**Classification.** Defect. A supported-looking instruction is silently reinterpreted as a
different, valid instruction, with no error and no warning.

**Evidence.** The relative-range pattern has no anchors on either side
(`src/DateTime/DateParser.ts:63`):

```js
const relativeDateRangeRegexp = /(last|this|next) (week|month|quarter|year)/;
```

`DateParser.parseDateRange` tries this parser **first**, before numbered ranges and before chrono
(`src/DateTime/DateParser.ts:23`), and returns as soon as one yields a valid range. The date-field
regex hands it everything after the optional keyword (`src/Query/Filter/DateField.ts:149`).

**Mechanism.** For `due next weekend`, no keyword matches, so `next weekend` reaches
`parseDateRange`. The unanchored pattern matches the `next week` prefix, a Monday–Sunday ISO range is
built (`src/DateTime/DateRange.ts:37`), and chrono — which would have resolved `next weekend` to a
specific Saturday — is never consulted.

**Documented contract.** `docs/Queries/Filters.md:203` states that "Relative date ranges support
only the exact keywords specified above", giving `next semester` as an unsupported example. The
implementation does not enforce "exact": it enforces "contains".

**Reproduction — mechanism.** `verify.mjs`, section D1. Confirmed: `next weekend` → `next week`,
`this weekend` → `this week`, `last quarterly review` → `last quarter`, `next yearly planning` →
`next year`; `next semester` correctly does not match.

**Reproduction — end to end, in Obsidian.** Run on any vault with the plugin at 8.3.0:

````text
```tasks
explain
due next weekend
```
````

Expected if the instruction were rejected or passed to chrono: an error, or a single Saturday.
Observed per the source: `explain` prints `due date is between:` the coming Monday and Sunday.

*Inference:* the end-to-end result follows from the parser order and the regex behaviour, both
verified; the Obsidian run itself was not executed here.

**Consequence.** Silently wrong result sets for any date instruction whose text happens to contain
`last|this|next` followed by `week|month|quarter|year` as a prefix of a longer word. `weekend` is the
realistic case: it is natural phrasing, chrono understands it, and Tasks quietly answers a different
question. `explain` exposes it, which is why the skill insists on `explain`.

**Workaround.** *Recommendation:* use an explicit date, a numbered range, or `before in N days`. For
"this coming weekend", `due 2025-07-26 2025-07-27`.

**Upstream status.** *Unverified:* not found in the pinned documentation as a known limitation; no
issue number is quoted for it. Whether it is reported upstream was not checked, since that requires a
web source.

**Suggested fix, if reported.** Anchor the pattern (`/^(last|this|next) (week|month|quarter|year)$/`)
so unsupported text falls through to chrono as the docs imply.

---

## D2 — `return` is detected by substring, not by syntax

**Classification.** Defect. A convenience heuristic misfires on valid input and produces a runtime
error rather than the intended result.

**Evidence.** `src/Scripting/Expression.ts:28`:

```js
const input = arg.includes('return') ? arg : `return ${arg}`;
```

`filter by function` insists on a real boolean and reports what it got instead
(`src/Query/Filter/FunctionField.ts:267`).

**Mechanism.** The test is a substring test on the whole expression, not a check for a `return`
statement. Any expression that merely *contains* the letters `return` — inside a string literal, a
property name, or a longer word — is compiled unwrapped, so the function body is an expression
statement whose value is discarded and the function returns `undefined`.

**Reproduction — mechanism.** `verify.mjs`, section D2. Confirmed: a plain expression yields a
boolean; `task.description.includes('return')` yields `undefined`; adding an explicit `return` fixes
it; `includes("returned")` fails the same way.

**Reproduction — end to end, in Obsidian.** Enable Settings → Tasks → Searches → Enable custom
searches, then:

````text
```tasks
filter by function task.description.includes('return')
```
````

Observed per the source: the error `filtering function must return true or false. This returned
"undefined".`

**Consequence.** Narrow but sharp. It fails loudly rather than silently, so no wrong result set —
but the error text points at the return value rather than at the cause, and the fix is
non-discoverable. `sort by function` and `group by function` are affected by the same wrapper;
there, the symptom is an invalid sort key or an error heading instead.

**Workaround.** *Recommendation:* add an explicit `return` whenever the expression text contains the
substring `return` anywhere, or avoid the literal (`/retur./` style tricks are worse than an explicit
`return`).

**Upstream status.** *Unverified:* the pinned documentation explains that multi-statement bodies need
`return` (`docs/Queries/Filters.md:410`) but does not mention this failure mode.

**Suggested fix, if reported.** Attempt `new Function` with the expression wrapped, and fall back to
the raw body on `SyntaxError`; or require `return` unconditionally in a future major version.

---

## D3 — `sort by` accepts trailing junk, `group by` does not

**Classification.** Defect. Malformed input is silently accepted with a different meaning; the
matching instruction family rejects it correctly, so the inconsistency is not deliberate.

**Evidence.** The sorter pattern has no end anchor (`src/Query/Filter/Field.ts:175`); the grouper
pattern does, with a comment explaining why it was needed (`src/Query/Filter/Field.ts:287`):

```js
return new RegExp(`^sort by ${this.fieldNameSingularEscaped()}( reverse)?`, 'i');
return new RegExp(`^group by ${this.fieldNameSingularEscaped()}( reverse)?$`, 'i');
```

**Rationale, from upstream.** The comment above the grouper pattern states the `$` "is required to
distinguish between group by status and status.name". For sorting the same ambiguity is resolved by
field ordering instead (`src/Query/FilterParser.ts:41`), so the anchor was never added.

**Mechanism.** `sort by due reverssse` matches `^sort by due( reverse)?`, capture group 1 is
`undefined`, and the query sorts ascending. `sort by due nonsense` behaves the same way. No error is
produced, and `explain` echoes the user's own line back, so the typo is invisible in the explanation
too.

**Reproduction — mechanism.** `verify.mjs`, section D3. Confirmed: `sort by due nonsense` matches;
`sort by due reverssse` matches with no `reverse` capture; `group by due nonsense` is rejected.

**Reproduction — end to end, in Obsidian.**

````text
```tasks
explain
sort by due reverssse
```
````

Observed per the source: no error, tasks sorted oldest-due first, and the `explain` output shows the
instruction verbatim rather than flagging it.

**Consequence.** A misspelled `reverse` reverses nothing, and a wrong or extra word is discarded.
The user sees a plausible list in the wrong order. Compare `group by due reverssse`, which errors
immediately — the asymmetry means users cannot rely on "if it did not error, I typed it right".

**Workaround.** *Recommendation:* verify sort order against a known-first and known-last task rather
than trusting the absence of an error. This is why the skill's validation step checks both
directions.

**Upstream status.** *Unverified:* not described in the pinned documentation.

**Suggested fix, if reported.** Anchor the sorter pattern like the grouper one, keeping the field
ordering that already disambiguates `status` from `status.name`.

---

## D4 — documentation says placeholders in comments are reported, the code skips them

**Classification.** Divergence. Documentation describes a limitation that the implementation no
longer has on the path the plugin actually uses.

**Documented contract.** `docs/Scripting/Placeholders.md:142`, under "Known Limitations": "It
complains about any unrecognised placeholders in comments, even though comments are then ignored."

**Observed implementation.** `Query.expandPlaceholders` returns the statement unchanged when it is a
comment, before any expansion, and the code comment gives the reason — avoiding "pointless error
messages for any harmless unknown placeholders" (`src/Query/Query.ts:186`).

**The consequence, and the caveat that keeps the doc partly true.** There is an earlier guard: if the
statement contains `{{` and `}}` and no query file was supplied, the query errors before the comment
check runs (`src/Query/Query.ts:176`). In the plugin a query file is always supplied — `QueryRenderer`
constructs a `TasksFile` for every block (`src/Renderer/QueryRenderer.ts:76`) — so for users the
documented limitation does not apply. It still applies in contexts with no file, such as unit tests
constructing a `Query` without one.

*Inference:* the ordering of the two guards is read from source; that no plugin code path reaches
`expandPlaceholders` with an undefined file follows from `getTasksFile` always returning an object,
which was read but not executed.

**Reproduction, in Obsidian.**

````text
```tasks
# {{query.file.nonexistentProperty}} this comment is ignored
not done
```
````

Expected per the documentation: an error about an unknown property. Observed per the source: the
query runs normally.

**Consequence.** Low. Users who trusted the doc may avoid a harmless and useful pattern — commenting
out a placeholder line while debugging.

**Recommendation.** Treat the code as authoritative for plugin use, and treat the doc as accurate for
the no-file case. Both statements are recorded in the skill rather than one being chosen.

---

## D5 — documentation says variation selectors are not understood, the code allows one

**Classification.** Divergence. Documentation is broader than the actual limitation.

**Documented contract.** `docs/Reference/Task Formats/Tasks Emoji Format.md`, under "Limitations of
Tasks Emoji Format": "Tasks does not understand unicode Variation Selectors", with a report that
this prevented the high-priority emoji (`⏫`) from being read when added manually, tracked as issue
#2273.

**Observed implementation.** `fieldRegex` appends an optional `U+FE0F` immediately after the
signifier symbol, with a comment saying exactly that
(`src/TaskSerializer/DefaultTaskSerializer.ts:70`):

```js
let source = symbols + '\uFE0F?';
```

**Reproduction — mechanism.** `verify.mjs`, section D5, rebuilds the due-date pattern the way
`dateFieldRegex` composes it. Confirmed: a plain emoji parses; one trailing VS16 parses; two VS16 do
not; a non-breaking space before the value does not; trailing prose after the value blocks parsing
entirely.

**Consequence.** Narrow. Exactly one variation selector, in exactly one position — directly after the
symbol — is tolerated. Selectors elsewhere, repeated selectors, and other invisible characters still
break parsing.

**Unverified:** whether the specific case in issue #2273 is the single-trailing-VS16 case, and
therefore whether that issue is fixed, cannot be settled from the pinned tree. The report may concern
a different codepoint sequence. This artifact claims only what the pattern does.

**Recommendation.** Do not tell users that variation selectors work. Tell them that one trailing
selector is tolerated and that invisible characters remain a real hazard — the practical advice is
unchanged: retype the signifier rather than pasting it.

---

## N1 — `priority is above low` includes tasks with no priority

**Classification.** By design. Not a defect. Recorded here so it is not reported as one.

**Evidence.** Priority codes place `None` between `Medium` and `Low`
(`src/Task/Priority.ts:11`), and `above`/`below` compare those codes
(`src/Query/Filter/PriorityField.ts:52`).

**Rationale, from upstream.** The file's own header comment: "When sorting, make sure low always
comes after none. This way any tasks with low will be below any existing tasks that have no priority
which would be the default."

**Documented contract.** `docs/Queries/Filters.md:996` lists the priorities in order and places "use
no signifier to indicate no priority" between medium and low, so the query behaviour matches the
documented ordering.

**Reproduction — mechanism.** `verify.mjs`, section N1: `above low` spans Highest, High, Medium,
None; `above none` spans Highest, High, Medium.

**Recommendation.** Belongs in user-facing guidance as a surprise, not in a bug report. Use
`priority is above none` when the intent is "has an above-default priority".

---

## N2 — `starts …` matches tasks with no start date

**Classification.** By design, documented, and deliberate.

**Evidence.** `StartDateField` is the only date field whose
`filterResultIfFieldMissing()` returns `true` (`src/Query/Filter/StartDateField.ts:17`), and the
override carries a link to the documentation that specifies it.

**Documented contract.** `docs/Queries/Filters.md:752` warns about it explicitly and supplies the
`(starts before tomorrow) AND (has start date)` idiom for the strict reading. `explain` prints
`OR no start date` on such filters (`src/Query/Filter/DateField.ts:234`), so the behaviour is
visible.

**Recommendation.** A user-education item. It is the highest-frequency "why is this task here"
question and it belongs in the skill's decision procedure, which it does.

---

## N3 — Boolean sub-expressions cannot end with the closing delimiter

**Classification.** Known limitation, acknowledged in both code and documentation.

**Evidence.** `src/Query/Filter/BooleanPreprocessor.ts:20`: "The one current exception is that any
Spaces and `)` at the end of sub-expressions/filters are interpreted as part of the Boolean
condition, not the filter."

**Documented contract.** `docs/Queries/Combining Filters.md:264` documents the symptom, the error
output, and three workarounds — a different delimiter pair, a trailing `;`, or moving the logic into
one `filter by function`.

**Consequence.** Reported with a good error message that prints the simplified line and each
sub-expression's status (`src/Query/Filter/BooleanField.ts:263`), so it is discoverable.

**Recommendation.** Nothing to report upstream; the skill's Boolean section carries the workarounds.

---

## Known upstream issues, not findings here

Quoted from the pinned documentation so this artifact is not read as an exhaustive bug list. Each is
already tracked upstream and already documented as a limitation.

| Issue | Effect |
|---|---|
| Obsidian 1.6.0–1.6.3 metadata cache | Tasks inside titled callouts are not found at all (`docs/Support and Help/Missing tasks in callouts with some Obsidian 1.6.x versions.md`). An Obsidian bug, fixed by rebuilding the vault cache. |
| #606 | Non-breaking spaces are not treated as spaces, so signifiers next to them are unread. |
| #1505 | Text mixed among signifiers stops the backward scan — the single largest cause of unparsed dates. Documented, with a detection query. |
| #2061 | Only the first line of a multi-line checklist item is read. |
| #1289 | Relative dates do not roll over if the machine slept at midnight (a Chrome bug). |
| #2571 | Footnotes on task lines are not carried into results. |
| #2074 | A filter set in the global query cannot be overridden by a block. |
| #929 | Tasks recognises a looser tag syntax than Obsidian. |
| #2273 | Variation selectors — see [D5](#d5--documentation-says-variation-selectors-are-not-understood-the-code-allows-one) for what the code actually does. |

## Limitations of this artifact

- Findings were reached by reading the implementation and exercising extracted patterns in
  isolation. **No finding was reproduced inside a running Obsidian instance**, and the plugin's own
  jest suite was not run: that needs a dependency install in the submodule, which was avoided to keep
  the pin clean. Each end-to-end claim is marked `Inference:` and carries steps a reader can run.
- Upstream issue trackers were not consulted, so "not documented as a known limitation" means "absent
  from the pinned documentation", not "unreported".
- Coverage is bounded by the research question: this is what surfaced while mapping the query
  language for the skill, not the output of a systematic audit. Absence from this list is not
  evidence of correctness.

## Open questions

1. Does anchoring the relative-range pattern (D1) break any existing user query that currently
   depends on the prefix match? A search of upstream tests would answer this.
2. Is issue #2273 (D5) resolved by the `\uFE0F?` tolerance, or does it concern a different sequence?
3. Are there other unanchored patterns in the date and filter parsers with the same silent-prefix
   behaviour as D1? Only `parseRelativeDateRange` was examined closely.

## Related artifacts

- [Tasks search pipeline](../search-pipeline.md) — how indexing, parsing and query execution
  fit together; the mechanisms referenced above are described there in full.
- [Tasks skill](../../../skills/tasks/SKILL.md) — the operational counterpart; every finding here that
  changes user behaviour is reflected in its traps table and debugging protocol. The skill cites the
  finding IDs (`D1`–`D5`) as plain text rather than linking to them, because it is designed to be
  extracted as a self-contained directory; the IDs are the join key between the two artifacts.
