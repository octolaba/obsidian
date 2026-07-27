# Validation and diagnosis

This reference owns two questions: whether a board is correct, and — given a board that has already
surprised someone — what caused it. It defines the consequence model every rule in the bundled board
linter derives its severity from, catalogues all thirty-three rules against the pinned line each one
stands on, gives the by-hand procedure for when the tool is unavailable, and maps symptoms to causes.
The file grammar belongs to the board format reference, the card line to the card anatomy reference,
lane and archive semantics to the lanes and archive reference, keys to the settings reference,
cross-plugin behaviour to the integrations reference, and writing to a board to the reference on
changing a board from outside Obsidian. This file only decides whether what they describe is what is
there.

## Contents

- [Evidence boundary](#evidence-boundary)
- [The consequence model](#the-consequence-model)
- [The rule catalogue](#the-rule-catalogue)
- [Rules whose evidence did not survive re-reading](#rules-whose-evidence-did-not-survive-re-reading)
- [Validating a board by hand](#validating-a-board-by-hand)
- [Symptom to cause](#symptom-to-cause)
- [Reading the linter output](#reading-the-linter-output)
- [What the linter cannot decide](#what-the-linter-cannot-decide)
- [Known gaps](#known-gaps)

## Evidence boundary

Citation alias `kanban` is the Kanban plugin pin: `obsidian-community/obsidian-kanban`, tag `2.0.51`,
commit `8501981a1afacb4c8fc03ec60604aa5eedfbd857`. Citation alias `tasks` is the Tasks plugin pin:
`obsidian-tasks-group/obsidian-tasks`, tag `8.3.0`, commit `e16dbc2cf509420459ea04094a1d834ae89e0019`.
Both paths are relative to their own repository root.

Read for this file: every line the linter rule table cites, re-opened one by one in the pinned tree
rather than trusted from the table; the frontmatter and settings-footer scanners; both halves of the
list format; the language helper; the board modifiers, the item and lane menus, the card checkbox and
the drag-and-drop entry points; archive trimming; and on the Tasks side the toggle API, the status
table, the serializer symbols and the settings that decide whether a done date is written. Not read:
the Markdown renderer, the table and list views, drag-and-drop hit testing, and the LESS sources.
Nothing here was executed inside Obsidian, and the linter was exercised only against its own
fixtures. Agent-behaviour evaluation has not been run for this reference or the skill that contains
it, and none is claimed.

## The consequence model

**Contract** (of the tooling, not of the plugin): a rule never picks its severity. It declares what
happens to the board, and the severity follows. Two rules with the same consequence therefore cannot
disagree about how serious they are, and none can be made louder than what it costs the reader.

| Consequence | Severity | What it means |
|---|---|---|
| `board-does-not-load` | `error` | Obsidian refuses to build the board — and then refuses to save it, because saving is skipped while the board carries errors: `kanban: src/StateManager.ts:100` |
| `content-lost` | `error` | the board loads, but text the author can see is deleted by the next save |
| `meaning-differs` | `warning` | the text survives, but the board means something other than it looks like |
| `bytes-change-on-save` | `info` | nothing is lost and nothing changes meaning; the next save rewrites bytes anyway |
| `informational` | `info` | true of this board and worth knowing, with no consequence for it |

Three rules follow, and they decide how a run is read. `error` and `warning` are the failing
severities; `info` never fails a run, however many `info` findings it produces. Confidence — `high`,
`medium`, `low` — is orthogonal: it says how sure the tool is that the rule fired on the right
construct, never how much the finding costs, and never affects the exit code. And the mapping lives
in one table in the shared library, which the bundled verify script uses to re-derive every severity
and re-resolve every rule citation against the pin, so a rule written with a severity it did not earn
fails verification rather than shipping.

## The rule catalogue

Ids are stable and are not reused. `KB001`–`KB010` cover the file envelope, `KB011`–`KB020` the body
and the card line, `KB021`–`KB030` lanes, block ids, language and settings, and `KB031`–`KB033`
whole-file drift.

| Rule | Consequence | What it means | Evidence |
|---|---|---|---|
| `KB001` | `board-does-not-load` | the file does not begin with `---` | `kanban: src/parsers/parseMarkdown.ts:27` |
| `KB002` | `board-does-not-load` | the frontmatter block never closes | `kanban: src/parsers/parseMarkdown.ts:33` |
| `KB003` | `board-does-not-load` | the frontmatter block is empty, so reading its keys throws | `kanban: src/parsers/parseMarkdown.ts:173` |
| `KB004` | `board-does-not-load` | the trailing fenced block is not valid JSON | `kanban: src/parsers/parseMarkdown.ts:60` |
| `KB005` | `content-lost` | content after the settings block makes every board-local setting unreadable | `kanban: src/parsers/parseMarkdown.ts:55` |
| `KB006` | `informational` | there is no settings block; the first save appends one | `kanban: src/parsers/common.ts:29` |
| `KB007` | `meaning-differs` | a trailing fence is read as settings although the marker line is missing | `kanban: src/parsers/parseMarkdown.ts:59` |
| `KB008` | `board-does-not-load` | the frontmatter does not mention `kanban-plugin` | `kanban: src/helpers.ts:52` |
| `KB009` | `bytes-change-on-save` | the legacy `basic` value is rewritten to `board` | `kanban: src/parsers/parseMarkdown.ts:175` |
| `KB010` | `meaning-differs` | the `kanban-plugin` value is not a recognised format | `kanban: src/Settings.ts:50` |
| `KB011` | `content-lost` | content belongs to no lane and no card, so the next save deletes it | `kanban: src/parsers/formats/list.ts:250` |
| `KB012` | `content-lost` | only the first list under a heading becomes cards; a second list is dropped | `kanban: src/parsers/helpers/ast.ts:57` |
| `KB013` | `content-lost` | a complete marker after the cards is ignored and then deleted | `kanban: src/parsers/formats/list.ts:267` |
| `KB014` | `meaning-differs` | an archive section with no cards degrades into an ordinary lane | `kanban: src/parsers/formats/list.ts:276` |
| `KB015` | `bytes-change-on-save` | any accepted archive separator is rewritten as `***` | `kanban: src/parsers/common.ts:24` |
| `KB016` | `bytes-change-on-save` | a lane heading is rewritten at level two whatever level it was written at | `kanban: src/parsers/formats/list.ts:410` |
| `KB017` | `bytes-change-on-save` | a card is rewritten with a `-` bullet whatever marker it used | `kanban: src/parsers/formats/list.ts:404` |
| `KB018` | `meaning-differs` | a checked box with no text is not a task, and becomes an unchecked card whose text is the box | `kanban: src/parsers/extensions/taskList.ts:79` |
| `KB019` | `bytes-change-on-save` | a list item with no checkbox gains one | `kanban: src/parsers/formats/list.ts:404` |
| `KB020` | `meaning-differs` | a continuation line indented by anything but one tab or four spaces keeps that indentation | `kanban: src/parsers/helpers/parser.ts:57` |
| `KB021` | `bytes-change-on-save` | a `(0)` limit means no limit and is deleted from the title | `kanban: src/helpers.ts:66` |
| `KB022` | `meaning-differs` | a title ending in a parenthesised number is read as a WIP limit; the linter flags only numbers of 100 or more, treating smaller ones as intended limits | `kanban: src/parsers/helpers/parser.ts:63` |
| `KB023` | `meaning-differs` | two cards carry the same block id, because duplicating a card copies it | `kanban: src/helpers/boardModifiers.ts:276` |
| `KB024` | `meaning-differs` | a block id outside `[a-zA-Z0-9-]` is not stripped back out, so it can be duplicated | `kanban: src/parsers/helpers/parser.ts:51` |
| `KB025` | `content-lost` | a structural marker is written in a language other than the one given | `kanban: src/lang/helpers.ts:61` |
| `KB026` | `content-lost` | structural markers come from more than one language | `kanban: src/lang/helpers.ts:53` |
| `KB027` | `informational` | the lane exceeds its WIP limit; the limit only styles the counter, and nothing consults it before an insert | `kanban: src/components/Lane/LaneTitle.tsx:40` |
| `KB028` | `content-lost` | the archive is longer than `max-archive-size`, so opening the board deletes entries from the front of the archive | `kanban: src/components/Kanban.tsx:153` |
| `KB029` | `meaning-differs` | a settings key in the YAML frontmatter migrates into the settings block and vanishes from the YAML | `kanban: src/parsers/parseMarkdown.ts:178` |
| `KB030` | `meaning-differs` | `list-collapse` has a different length than the lane count | `kanban: src/helpers/boardModifiers.ts:99` |
| `KB031` | `bytes-change-on-save` | the next save rewrites blank lines and spacing only | `kanban: src/parsers/formats/list.ts:443` |
| `KB032` | `content-lost` | the next save changes visible content | `kanban: src/parsers/formats/list.ts:443` |
| `KB033` | `bytes-change-on-save` | the file uses CRLF and the plugin writes LF | `kanban: src/parsers/formats/list.ts:450` |

## Rules whose evidence did not survive re-reading

Every one of the thirty-three citations resolves to a non-blank line at the pin, and no rule message
was found false. An audit of what each cited line actually *proves*, rather than only that it exists,
found seven rules citing a line one step away from the one that decides their claim, one message
claiming more than either pin evidences, and one consequence class that was too loud. **The rule
table has been corrected**; this section records what was wrong, because a table that changed
quietly would be a table nobody could check.

| Rule | Cited line, before | Now | Why the new line decides it |
|---|---|---|---|
| `KB011` | line 249 | `kanban: src/parsers/formats/list.ts:250` | the heading test is what gives a block a representation at all |
| `KB013` | line 414 | `kanban: src/parsers/formats/list.ts:267` | the serialiser proves the deletion; this line proves the marker is ignored in the first place |
| `KB019` | line 110 | `kanban: src/parsers/formats/list.ts:404` | the box is written here, not where the character is defaulted |
| `KB023` | line 256 | `kanban: src/helpers/boardModifiers.ts:276` | the copy carrying the block id is inserted here; `:256` only regenerates the runtime id |
| `KB025` | line 56 | `kanban: src/lang/helpers.ts:61` | the signature proves nothing; this line is the lookup with its English fallback |
| `KB030` | line 97 | `kanban: src/helpers/boardModifiers.ts:99` | one entry is pushed per added lane, positionally, with no lane identifier |
| `KB033` | line 426 | `kanban: src/parsers/formats/list.ts:450` | `:426` joins one lane; this is where the whole file is concatenated |

`KB018` was declared `content-lost` and is now `meaning-differs`: nothing is deleted. `- [x]` with no
text is not recognised as a task at all, the empty-task guard compares against the literal `[ ]` and
therefore misses it (`kanban: src/parsers/formats/list.ts:71`), and the next save writes `- [ ] [x]`.
The text survives; only the apparent check state does not.

Two claims remain weaker than the rest and are marked as such rather than removed. **`KB023`**
previously said a duplicated block id makes links resolve to one card only; that is Obsidian's link
resolution, not the plugin's, and neither pin evidences it — **Unverified**. Its message now states
only what the pins prove: both cards are written back carrying the same id, through
`kanban: src/parsers/helpers/parser.ts:43`. **`KB027`** no longer rests on documentation alone.
Upstream states one consequence, a bold counter (`kanban: docs/How do I/Set a WIP Limit.md:10`), and
the implementation agrees: the parsed limit reaches exactly one CSS modifier
(`kanban: src/components/Lane/LaneTitle.tsx:40`) and one counter label
(`kanban: src/components/Lane/LaneTitle.tsx:48`). That nothing *enforces* the limit is still
**Inference**, but it now follows from reading every consumer of `maxItems` rather than from a page
not saying so — the lanes and archive reference records the search and the two insertion paths that
do not test it (`kanban: src/components/Lane/Lane.tsx:84`, `kanban: src/DragDropApp.tsx:120`). The
rule's own citation was moved onto that source line for the same reason, so the table above and the
linter now name the same evidence.

## Validating a board by hand

Finite, ordered, fail-fast. Steps 1 to 4 are the four file regions in the order the plugin resolves
them; **if any of them fails, stop** — the board does not load, everything below is a parse nobody
performs, and Obsidian will not save the file either (`kanban: src/StateManager.ts:100`). The file is
trimmed first (`kanban: src/StateManager.ts:305`), so surrounding whitespace is never the defect.

1. **Frontmatter opens at the first byte.** The first three non-whitespace characters are `---`. What
   throws is a leading character that is neither `-` nor whitespace
   (`kanban: src/parsers/parseMarkdown.ts:27`). A byte-order mark is **not** such a character: the
   file is trimmed first (`kanban: src/StateManager.ts:305`) and `trim()` strips U+FEFF, so a BOM and
   leading blank lines are both harmless.
2. **Frontmatter closes and is populated.** A later `---` preceded by a line break ends the block
   (`kanban: src/parsers/parseMarkdown.ts:33`); the YAML is not empty
   (`kanban: src/parsers/parseMarkdown.ts:173`) and carries `kanban-plugin` with one of `basic`,
   `board`, `table`, `list` (`kanban: src/Settings.ts:50`) and no other settings key
   (`kanban: src/parsers/parseMarkdown.ts:178`).
3. **The tail is reachable.** Reading backwards from the last non-whitespace character, only
   backticks, percent signs and line breaks appear before the closing fence
   (`kanban: src/parsers/parseMarkdown.ts:55`); one stray character discards every board-local
   setting.
4. **The settings block parses.** The last fenced block is valid JSON
   (`kanban: src/parsers/parseMarkdown.ts:60`) and `%% kanban:settings` sits above the fence — that
   marker is never checked, so any trailing fence is fed to the parser
   (`kanban: src/parsers/parseMarkdown.ts:59`).
5. **The body carries nothing else.** Only lane headings, one complete marker directly under a
   heading, card lists, and the archive separator, heading and list have a representation; every
   other top-level block is deleted by the next save (`kanban: src/parsers/formats/list.ts:250`).
6. **Lanes.** Each heading is level two (`kanban: src/parsers/formats/list.ts:410`); a trailing
   `(N)` is a WIP limit, not text (`kanban: src/parsers/helpers/parser.ts:63`), and `(0)` is deleted
   (`kanban: src/helpers.ts:66`); the cards are the *first* list after the heading and nothing else
   (`kanban: src/parsers/helpers/ast.ts:57`), bulleted with `-`
   (`kanban: src/parsers/formats/list.ts:404`).
7. **The archive.** A `***` separator immediately precedes a heading equal to the archive marker for
   the board's language, and at least one card follows (`kanban: src/parsers/formats/list.ts:231`,
   `kanban: src/parsers/formats/list.ts:237`, `kanban: src/parsers/formats/list.ts:276`).
8. **Markers agree on one language**, and it is the language Obsidian will be running in
   (`kanban: src/lang/helpers.ts:54`).
9. **Cards.** Each is `- [c] text`, with whitespace and then a non-space character after the closing
   bracket (`kanban: src/parsers/extensions/taskList.ts:79`); continuation lines are indented by one
   tab or exactly four spaces (`kanban: src/parsers/helpers/parser.ts:57`); a block id uses only
   letters, digits and hyphens (`kanban: src/parsers/helpers/parser.ts:51`) and is unique across
   lanes and archive.
10. **Line endings are LF** (`kanban: src/parsers/formats/list.ts:450`) and the archive is no longer
    than `max-archive-size` (`kanban: src/components/Kanban.tsx:153`).

## Symptom to cause

### The board does not render

| Symptom | Discriminating check | Cause | Evidence |
|---|---|---|---|
| Error banner instead of lanes | is byte 0 a `-`? | anything precedes the frontmatter | `kanban: src/parsers/parseMarkdown.ts:27` |
| Error banner instead of lanes | is there a second `---` line? | frontmatter never closes | `kanban: src/parsers/parseMarkdown.ts:33` |
| Error banner instead of lanes | is there a key between the fences? | empty frontmatter, and its keys are read unguarded | `kanban: src/parsers/parseMarkdown.ts:173` |
| Error banner instead of lanes | does the last fenced block parse as JSON? | the settings block is malformed | `kanban: src/parsers/parseMarkdown.ts:60` |
| Opens as plain Markdown | does `kanban-plugin` appear inside the first `---` … `---` region? | the raw substring test fails | `kanban: src/helpers.ts:52` |
| Opens as plain Markdown | does the metadata cache show the key? | the view takeover reads the cache, not the text | `kanban: src/main.ts:794` |
| Opens as plain Markdown | was "Open as markdown" used on this leaf? | the file mode is pinned to markdown until reopened | `kanban: src/main.ts:442` |
| Board turned into Markdown while open | was the key edited on disk? | new content without the key switches the leaf | `kanban: src/KanbanView.tsx:222` |

### Content changed or vanished

| Symptom | Discriminating check | Cause | Evidence |
|---|---|---|---|
| A card vanished after opening | was it in the first list under its heading? | only the first list becomes cards | `kanban: src/parsers/helpers/ast.ts:57` |
| A card vanished after opening | was it outside any lane, or under a bullet that changed? | the model carries no such content, so the save drops it | `kanban: src/parsers/formats/list.ts:250` |
| A card vanished after opening | was it an old archive entry, with `max-archive-size` set? | trimming runs on render and saves | `kanban: src/components/Kanban.tsx:158` |
| Board-local settings reverted | is anything but backticks, `%` and line breaks after the block? | the backwards scan bails and returns no settings | `kanban: src/parsers/parseMarkdown.ts:55` |
| Board-local settings reverted | was the key written in the YAML frontmatter? | settings keys migrate into the block and leave the YAML | `kanban: src/parsers/parseMarkdown.ts:178` |
| Board-local settings reverted | does an unrelated fenced block end the file? | it is read as the settings block | `kanban: src/parsers/parseMarkdown.ts:59` |
| A card gained a date | is the added text `@{…}` or a daily-note link? | the date picker appends the trigger and value to the title | `kanban: src/components/Item/helpers.ts:121` |
| A card gained a `✅` | was the card checked or moved into a complete lane? | Kanban delegates the toggle to Tasks, which stamps the done date | `kanban: src/parsers/helpers/inlineMetadata.ts:230` |
| A card gained a `✅` | is Tasks configured to set a done date? | that setting defaults to on, and the symbol is Tasks's | `tasks: src/Config/Settings.ts:119` |
| A card gained a leading timestamp | was it archived? | archiving splices a formatted date into the title | `kanban: src/StateManager.ts:374-385` |

### The done column

| Symptom | Discriminating check | Cause | Evidence |
|---|---|---|---|
| Stopped stamping done dates | is `obsidian-tasks-plugin` in the enabled set? | without it the toggle path returns null and Kanban only flips the box | `kanban: src/parsers/helpers/inlineMetadata.ts:219` |
| Stopped stamping done dates | does an editor suggester expose Tasks settings? | the status lookup reads the suggest registry, not the plugin list, and falls back to `x` | `kanban: src/parsers/helpers/inlineMetadata.ts:180` |
| Stopped stamping done dates | is the check character the Tasks DONE symbol? | a custom DONE symbol changes what counts as complete | `kanban: src/parsers/helpers/inlineMetadata.ts:188` |
| Stopped stamping done dates | is `setDoneDate` still on in Tasks? | Tasks decides the date, Kanban never writes one | `tasks: src/Task/Task.ts:387` |
| Moved cards are not checked | was the card moved by "Move to list"? | that path moves the entity directly, bypassing the completion hook | `kanban: src/components/Item/ItemMenu.ts:280` |
| Moved cards are not checked | was it "Move to top" or "Move to bottom"? | same bypass | `kanban: src/helpers/boardModifiers.ts:83` |
| Moved cards are not checked | does the destination lane carry the complete marker? | with neither lane complete the hook returns the card unchanged | `kanban: src/components/helpers.ts:52` |
| Moved cards are not checked | was the lane's complete setting toggled after the cards arrived? | toggling only flips the lane flag; existing cards are untouched | `kanban: src/components/Lane/LaneSettings.tsx:30` |
| Cards added to a done lane are checked but undated | was the card created by the lane's add form? | the form sets the state directly and never asks Tasks | `kanban: src/components/Lane/Lane.tsx:91` |

### Structure read differently than written

| Symptom | Discriminating check | Cause | Evidence |
|---|---|---|---|
| Archive became an ordinary column | is there a `***` immediately above the heading? | the archive requires a thematic break as previous sibling | `kanban: src/parsers/formats/list.ts:237` |
| Archive became an ordinary column | does the heading text equal the archive marker for the running language? | the comparison is exact, and the marker is localised | `kanban: src/parsers/formats/list.ts:231` |
| Archive became an ordinary column | does at least one card follow it? | an empty archive falls through to the lane branch | `kanban: src/parsers/formats/list.ts:276` |
| Lane title lost its trailing number | was the number `(0)`? | a zero limit is dropped on write | `kanban: src/helpers.ts:66` |
| Lane title lost its trailing number | is the number now shown as a WIP limit? | any trailing parenthesised integer is parsed as a limit | `kanban: src/parsers/helpers/parser.ts:63` |
| Two cards share one block link | was one card duplicated? | duplication regenerates the runtime id only | `kanban: src/helpers/boardModifiers.ts:276` |
| Two cards share one block link | does the id contain an underscore or a dot? | such an id is not stripped from the title and is re-appended | `kanban: src/parsers/helpers/parser.ts:51` |
| A copied card link points elsewhere | did the card already have a block id? | "Copy link to card" reuses an existing id and only writes one when absent | `kanban: src/components/Item/ItemMenu.ts:100` |

## Reading the linter output

The tool takes `--vault` (required), zero or more `--file` paths inside that vault, `--locale` and
`--format`. Without `--file` it scans every Markdown note whose first `---` … `---` region contains
`kanban-plugin`, the plugin's own recognition test (`kanban: src/helpers.ts:52`); with `--file` it
lints exactly what it is given, board or not.

**Exit codes.** `0` clean — nothing of a failing severity, which includes a run that printed only
`info` findings. `1` findings — at least one `error` or `warning`. `2` usage error — an unknown flag,
a missing value, a positional argument, a `--vault` that is not a directory, a `--file` escaping the
vault, or an unsupported `--format`; that message goes to standard error with the usage block. The
shared vocabulary reserves `3` for missing material and `4` for identity mismatch, but the linter
never returns them: it reads the board file and never touches the pinned trees at run time.

**The header** carries the tool and version, the vault, `mode: locale <code>` and a `scanned:` line.
Findings are sorted by severity, then file, line and rule id, so a diff between two runs is stable.
Each prints as `file:line SEVERITY KBxxx [confidence] message`, then `cite:`, `fix:`, and — when the
rule captured a detail such as the offending value or a count — `note:`.

**`assumptions` and `limitations` are part of the result, not decoration.** The assumptions say which
board the tool believes it read: boards recognised by the substring test, markers read for the
requested locale *and* every other locale the plugin translates — compared only against top-level
paragraphs and headings, the constructs the plugin compares, so a card body spelling a marker word is
never a marker — continuation indentation inferred from the board because the vault setting is
unreadable, and the file trimmed before parsing. A
finding is only as true as the assumption under it — pass the wrong `--locale` and a correct board
produces a wave of `KB025`. The limitations say what was not examined at all: the port is not
micromark, no vault or plugin configuration was read, another plugin can change what a card means,
and agent behaviour is not evaluated anywhere.

**Formats.** `text` (default) is the report above. `json` is the whole report object: header,
per-severity counts, both blocks, and every finding with its consequence, severity, confidence,
citation and fix. `sarif` is SARIF 2.1.0, mapping `error`, `warning` and `info` to `error`, `warning`
and `note`, with the rule table as the driver's rules and every limitation repeated as a
tool-execution notification, because a SARIF viewer cannot ask a follow-up question.

**Suppression is deliberate and changes what a short report means.** When a board carries `KB001`,
`KB002`, `KB003` or `KB004`, every other finding is dropped: a board that does not load has no lane
structure worth describing, so a short report on a broken board is not evidence that the rest of it
is fine — fix the fatal finding and run again. Less drastically, `KB011` is suppressed on lines a
more specific rule already explains and after an unreachable settings marker; the replacing rule
carries the same consequence, so nothing is quietly downgraded.

## What the linter cannot decide

Everything below is invisible from a board file. Some can be supplied explicitly; when they are not,
a rule depending on them would be guessing. Each unresolved item is a reason to confirm a finding —
or a clean run — inside Obsidian.

- **Whether the Tasks plugin is enabled.** It changes what a check character means, whether a done
  date appears, and which symbol counts as done (`kanban: src/parsers/helpers/inlineMetadata.ts:172`).
  A board full of `- [x]` cards is either Tasks-managed or not, and the file looks identical.
- **Whether Dataview is enabled.** Inline fields in a card body render differently, or are stripped
  from the title in memory, depending on it and on `inline-metadata-position`.
- **The vault's indentation setting.** The plugin reads `useTab` from the vault configuration
  (`kanban: src/parsers/helpers/parser.ts:35`); the tool infers it from the board's own continuation
  lines and falls back to a tab, so a board with no multi-line card is unclassifiable here.
- **The UI language.** The marker language is whatever Obsidian was running in when the board was
  last saved (`kanban: src/lang/helpers.ts:53`). `--locale` is an assertion by the caller, not a
  discovery, and an unrecognised code falls back to English markers exactly as the plugin does — the
  accepted codes are the values Obsidian stores, so `pt-BR` and `zh` work while `pt-br` does not.
- **Global plugin settings, unless supplied.** Pass Kanban's `data.json` with `--kanban-data` and the
  linter resolves local-over-global settings before tokenising cards and before applying rules such as
  `KB028`. Without it, an inherited `max-archive-size`, `date-trigger` or `time-trigger` remains
  unknown; a non-default trigger can also make a block id or date token parse differently.
- **Date and time defaults from other plugins, unless supplied.** Daily Notes, Natural Language Dates
  and Templates can determine the formats Kanban compiles (`kanban: src/components/helpers.ts:178`,
  `kanban: src/components/helpers.ts:192`). `--vault-date-format` and `--vault-time-format` bind those
  values; otherwise the port uses the stock forms and reports the assumption.
- **Anything about the live session.** Which view is primary, whether a second pane holds stale state
  that will be written later, whether the board is in an error state, and what the last save actually
  wrote. A file can be correct on disk and about to be overwritten.
- **Whether a rule's advice suits this vault.** The tool reports what the plugin will do, not what
  the author wants; `KB022` on a lane genuinely named after a year is a true finding with a
  wrong-headed fix.

## Known gaps

- **Not executed.** No claim here was reproduced inside Obsidian. The error banner, the fatal-parse
  behaviour and the done-date path are read from source and from the Tasks pin, not observed at
  runtime; promoting them would need a fixture vault and a manual pass.
- **The catalogue is checked for resolution, not for truth.** Verification proves each cited line
  exists and is non-blank at the pin; the judgement that it says what the rule claims is this file's
  re-reading, recorded above, and is not machine-checkable.
- **Symptom coverage is partial.** The tables cover failures reachable from the file format and the
  completion mechanic; rendering, search, the table and list views, mobile behaviour and performance
  were not studied.
- **No corpus of real broken boards.** The rules were derived from the pinned parser and exercised
  against fixtures written for them, so the relative frequency of these causes is unknown and no rule
  is claimed to be the common case.
- **Agent-behaviour evaluation has not been run** for this reference or the skill that contains it,
  so nothing here says how reliably it is reached, which sibling an agent loads next, or whether a
  diagnosis it produces cites the right rule.
