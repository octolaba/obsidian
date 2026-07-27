# Card anatomy

This reference owns the single card line: how Kanban 2.0.51 decides that a Markdown list item is a
card, what every part of that line becomes in the board model, and what survives the next save.
Lane headings, the complete marker and the archive belong to the lanes and archive reference; the
frontmatter block, the settings footer and whole-file save behaviour belong to the board format
reference; every settings key named here is defined in the settings reference, and everything that
crosses the boundary to another plugin belongs to the integrations reference.

## Contents

- [Evidence boundary](#evidence-boundary)
- [The card line](#the-card-line)
- [Checkbox recognition](#checkbox-recognition)
- [Raw text versus display text](#raw-text-versus-display-text)
- [Multi-line card bodies](#multi-line-card-bodies)
- [Dates and times](#dates-and-times)
- [Tags](#tags)
- [Block ids](#block-ids)
- [Inline metadata](#inline-metadata)
- [What a card loses on save](#what-a-card-loses-on-save)
- [Known gaps](#known-gaps)

## Evidence boundary

Citation alias `kanban` is the Kanban pin: `obsidian-community/obsidian-kanban` at tag `2.0.51`,
commit `8501981a1afacb4c8fc03ec60604aa5eedfbd857`. Citation alias `tasks` is the Tasks pin:
`obsidian-tasks-group/obsidian-tasks` at tag `8.3.0`, commit
`e16dbc2cf509420459ea04094a1d834ae89e0019`. Every path inside a citation is relative to the root of
the checkout its alias names.

Read for this file: the parser entry point and the Markdown extensions under `kanban: src/parsers/`,
the card components under `kanban: src/components/Item/`, the settings surface in
`kanban: src/Settings.ts` and `kanban: src/StateManager.ts`, every page under `kanban: docs/`, and
the six Tasks files this skill pins.

Not read, and therefore not claimed: micromark and mdast themselves. The pin declares them as
dependencies but does not vendor them, so every statement about tokenizer behaviour below is traced
through Kanban's own constructs and the micromark helpers they call by name. Nothing in this file
was executed. There are no runtime measurements, and no claim rests on the rendered appearance of a
card in the app.

Kanban's own `docs/` describes settings, not the file format: it never shows a card line, a check
character, a block id or a wrapped date. Claims labelled **Contract** below are therefore limited to
what those settings pages actually say. Nothing about the shape of the line itself is a documented
contract; it is all **Observed** in implementation source, or **Inference** composed from it.

## The card line

**Observed** — every card, in every lane and in the archive, is written by one function:
`` `- [${checkChar}] ${addBlockId(indentNewLines(titleRaw), item)}` `` at
`kanban: src/parsers/formats/list.ts:404`. Lane serialisation calls it at
`kanban: src/parsers/formats/list.ts:419` and archive serialisation at
`kanban: src/parsers/formats/list.ts:434`. There is no second writer and no per-card formatting
option.

Three consequences follow directly from that template.

- The bullet marker is always `- `. A card written with `*` or `+` comes back as `-`.
- There is always exactly one space between `]` and the body, and the check character always occupies
  exactly one column.
- A card whose `titleRaw` is empty is written as `- [ ] ` with a trailing space, because the template
  interpolates an empty string after the space. **Observed** — "Insert card before/after" creates
  exactly such a card, seeded with an empty string at
  `kanban: src/components/Item/ItemMenu.ts:154`.

## Checkbox recognition

Kanban does not use a checkbox regex on the line. It ships its own micromark construct
(`kanban: src/parsers/extensions/taskList.ts:13`) and registers it for every parse
(`kanban: src/parsers/parseMarkdown.ts:67`). Reading that construct is the only reliable way to
predict what counts as a card.

**Observed** — the construct accepts a checkbox only when all of the following hold.

| Rule | Where |
|---|---|
| The `[` is the first content of the list item, with nothing consumed before it | `kanban: src/parsers/extensions/taskList.ts:21` |
| Exactly one character sits between the brackets, consumed once before the closing state | `kanban: src/parsers/extensions/taskList.ts:42` |
| A space or tab in that position means unchecked | `kanban: src/parsers/extensions/taskList.ts:38` |
| Any other character means checked, and that character is kept | `kanban: src/parsers/extensions/taskList.ts:45` |
| `]` cannot itself be the character, so `- []` is never a checkbox | `kanban: src/parsers/extensions/taskList.ts:52` |
| After `]` the construct runs a lookahead named `spaceThenNonSpace` | `kanban: src/parsers/extensions/taskList.ts:62` |
| That lookahead requires whitespace | `kanban: src/parsers/extensions/taskList.ts:80` |
| **and then** a character that is neither end-of-input nor a line ending nor a space | `kanban: src/parsers/extensions/taskList.ts:82` |
| On success, `checked` and `checkChar` are attached to the list item | `kanban: src/parsers/extensions/taskList.ts:101` |

The lookahead is the surprising rule and it does most of the damage: **a checkbox with no text after
it is not a checkbox at all**. `- [ ]` and `- [x]` on their own fail it, the construct backtracks,
and the brackets survive as ordinary text in an ordinary list item.

Two guards in the board builder then decide what that ordinary list item becomes.

- **Observed** — `checkChar` is forced to a single space whenever `checked` is falsy, so an
  unrecognised checkbox can never carry a check character
  (`kanban: src/parsers/formats/list.ts:110`).
- **Observed** — an empty-task guard compares the item's content against the literal string built
  from `'['`, the check character *or a space when `checked` is falsy*, and `']'`, and blanks the
  content when they are equal (`kanban: src/parsers/formats/list.ts:71`). Because `checked` is falsy
  for an unrecognised checkbox, the comparison string is always `[ ]`. That is why `- [ ]` becomes an
  empty card and `- [x]` does not.

**Inference** — composing the construct, the two guards and the writer gives the following
round trips. None of them was executed; each is read off the cited lines.

| On disk | `checked` | `checkChar` | `titleRaw` | Written back as |
|---|---|---|---|---|
| `- [ ] Ship it` | false | `' '` | `Ship it` | `- [ ] Ship it` |
| `- [x] Ship it` | true | `x` | `Ship it` | `- [x] Ship it` |
| `- [X] Ship it` | true | `X` | `Ship it` | `- [X] Ship it` |
| `- [/] Ship it` | true | `/` | `Ship it` | `- [/] Ship it` |
| `- Ship it` | not set | `' '` | `Ship it` | `- [ ] Ship it` |
| `* Ship it` | not set | `' '` | `Ship it` | `- [ ] Ship it` |
| `- [ ]` | not set | `' '` | *(empty)* | `- [ ] ` |
| `- [x]` | not set | `' '` | `[x]` | `- [ ] [x]` |
| `- [] x` | not set | `' '` | `[] x` | `- [ ] [] x` |

"Not set" is deliberate: Kanban only ever tests `item.checked` for truthiness
(`kanban: src/parsers/formats/list.ts:71`, `kanban: src/parsers/formats/list.ts:110`), so whatever
mdast leaves there for a plain list item never reaches the board model as a distinguishable value.

**Recommendation** — never hand-write a bare `- [ ]` or `- [x]` into a board file expecting an empty
card in that state. Write `- [ ] ` with real text, or let the UI create the card. When a board file
comes back from a diff with `- [ ] [x]` in it, this construct is the cause, not a corrupted save.

Any non-space character counts as checked, but not every checked character counts as *done*.
Archiving and the complete mechanic compare `checkChar` against a specific done character, so
`- [X]` and `- [/]` are checked and yet not complete. That comparison lives in the lanes and archive
reference.

## Raw text versus display text

Each card carries two strings, and only one of them is ever written to disk.

| Field | Built at | Used for |
|---|---|---|
| `titleRaw` | `kanban: src/parsers/formats/list.ts:93` | serialisation (`kanban: src/parsers/formats/list.ts:404`) and the editor's initial value (`kanban: src/components/Item/ItemContent.tsx:266`) |
| `title` | `kanban: src/parsers/formats/list.ts:194` | rendering only (`kanban: src/components/Item/ItemContent.tsx:283`, `kanban: src/KanbanView.tsx:85`) |

**Observed** — `titleRaw` is a raw slice of the file with three mechanical transforms applied in
order: `replaceBrs`, then `dedentNewLines`, then `removeBlockId`
(`kanban: src/parsers/formats/list.ts:93`). `title` starts from the same slice but additionally runs
through a deletion pass and `preprocessTitle` (`kanban: src/parsers/formats/list.ts:194`), which
replaces recognised dates and times with `<span>` markup
(`kanban: src/parsers/helpers/hydrateBoard.ts:72`).

The deletion pass is what the four "move" settings drive. **Observed** — deletion is performed by
overwriting a character range with NUL bytes (`kanban: src/parsers/helpers/parser.ts:19`) and then
collapsing them (`kanban: src/parsers/helpers/parser.ts:23`). Only the `title` branch calls
`executeDeletion`; the `titleRaw` branch never does.

| Setting | Removes from `title` | Cited at | Touches disk |
|---|---|---|---|
| `move-tags` | recognised `#tag` runs | `kanban: src/parsers/formats/list.ts:137` | no |
| `move-dates` | recognised date and time constructs | `kanban: src/parsers/formats/list.ts:149`, `kanban: src/parsers/formats/list.ts:160` | no |
| `move-task-metadata` | the Tasks emoji fields | `kanban: src/parsers/formats/list.ts:207` | no |
| `inline-metadata-position` | Dataview inline fields, unless set to `body` | `kanban: src/parsers/formats/list.ts:208` | no |

**Observed** — the tags setting at this pin is named "Move tags to card footer"
(`kanban: src/Settings.ts:476`) and describes itself as displaying tags "in the card's footer instead
of the card's body" (`kanban: src/Settings.ts:478`); the key it writes is `move-tags`
(`kanban: src/Settings.ts:487`). That matches the deletion pass above: the tags stay in `titleRaw`
and are removed only from `title`. There is **no documented contract** here: the four
`docs/Settings/Hide *` pages describe four withdrawn toggles — two for dates, two for tags — whose
nearest surviving equivalents are the single `move-dates` and `move-tags` keys. The settings
reference records that drift, and none of those pages may be used to reason about this behaviour.

**Observed** — the settings tab and the parser disagree about the *dates* default, and both sides are
source. The reset button beside "Move dates to card footer" (`kanban: src/Settings.ts:595`) falls back
to `true` (`kanban: src/Settings.ts:627`), while the plugin builds its settings object from stored
data with no defaults merged in (`kanban: src/main.ts:63`) and `compileSettings` passes `move-dates`
through unchanged (`kanban: src/StateManager.ts:244`). **Inference** — on an untouched install the
value is absent and therefore falsy, so the setting's visible state and the parser's effective state
can disagree. The consequence is display-only; nothing on disk differs.

**Documentation drift, not a conflict** — `kanban: docs/Settings/Hide dates in card titles.md:8`
captions its screenshot "On (default)". That page is one of the four withdrawn `Hide *` pages, so it
is evidence about a toggle this pin does not have, not about `move-dates`. Do not read a default out
of it.

**Observed** — changing any of these four settings forces a full reparse rather than a re-render,
because they appear in `shouldRefreshBoard` (`kanban: src/parsers/common.ts:239`,
`kanban: src/parsers/common.ts:251`, `kanban: src/parsers/common.ts:254`).

## Multi-line card bodies

A card may span several lines. The continuation lines belong to the card only if they are indented,
and Kanban recognises exactly two indent widths.

**Observed** — on write, every newline in `titleRaw` becomes a newline followed by one tab or four
spaces, chosen from the vault's own `useTab` configuration, and the whole string is trimmed
(`kanban: src/parsers/helpers/parser.ts:35`, `kanban: src/parsers/helpers/parser.ts:36`). On read,
`dedentNewLines` strips a single tab or a single run of exactly four spaces after each newline, and
trims (`kanban: src/parsers/helpers/parser.ts:57`).

**Inference** — three things follow.

- The indent character in the file follows the vault setting, not the file. A tab-indented board
  opened in a spaces vault is rewritten with four-space indents on the first save, and the reverse.
- Exactly one level is stripped. Eight spaces round-trip as eight; the extra four stay inside
  `titleRaw` and are re-indented on top of.
- Two- or three-space continuations are never stripped, so their spaces stay inside `titleRaw` and a
  full indent level is added in front of them on the next save.

**Observed** — `<br>` is handled asymmetrically. On read, `replaceBrs` replaces the four-character
string `<br>` globally with a newline and trims
(`kanban: src/parsers/helpers/parser.ts:31`), applied before dedenting
(`kanban: src/parsers/formats/list.ts:93`). On write there is no inverse: `indentNewLines` emits
indented lines, never `<br>`.

**Inference** — a hand-written `a<br>b` therefore becomes two indented lines on the first save, and
never comes back. `<br/>`, `<br />` and `<BR>` do not match the literal and stay in the card text
untouched, so they survive but never become line breaks.

Nested content inside the body survives as text. **Observed** — the item's content boundary runs to
the end of the item's last child, not the end of its first paragraph
(`kanban: src/parsers/formats/list.ts:56`, `kanban: src/parsers/helpers/ast.ts:28`), so a
nested sub-list is part of `titleRaw` and is dedented and re-indented like any other continuation.
Checkboxes inside that body are separately toggleable: `checkCheckbox` rewrites the matching line of
`titleRaw` and saves (`kanban: src/components/Item/ItemContent.tsx:87`,
`kanban: src/components/Item/ItemContent.tsx:248`).

**Observed** — "Split card" turns each line into its own card and gives every fragment the check
character `' '` (`kanban: src/components/Item/ItemMenu.ts:135`), so check state and block id are
lost for all fragments including the first.

**Contract** — which key inserts a line break rather than committing the card is a setting:
`kanban: docs/Settings/New line trigger.md:2`.

## Dates and times

Dates and times are not fields. They are wrapped constructs inside the card text, registered as
micromark extensions built from the current settings
(`kanban: src/parsers/parseMarkdown.ts:68`, `kanban: src/parsers/parseMarkdown.ts:69`,
`kanban: src/parsers/parseMarkdown.ts:70`).

| Construct | Shape with default triggers | Registered at |
|---|---|---|
| `date` | `@{2024-01-31}` | `kanban: src/parsers/parseMarkdown.ts:68` |
| `dateLink` | `@[[2024-01-31]]` | `kanban: src/parsers/parseMarkdown.ts:69` |
| `time` | `@@{09:30}` | `kanban: src/parsers/parseMarkdown.ts:70` |

**Observed** — there is no fourth construct. The time trigger is only ever combined with `{`, so
there is no `@@[[...]]` form; a time cannot be linked to a note the way a date can.

**Contract** — the triggers default to `@` and `@@` (`kanban: docs/Settings/Date trigger.md:2`,
`kanban: docs/Settings/Time trigger.md:2`), which matches the constants at
`kanban: src/settingHelpers.ts:9` and `kanban: src/settingHelpers.ts:10`, applied as fallbacks in
`kanban: src/StateManager.ts:238` and `kanban: src/StateManager.ts:242`.

**Observed** — because the trigger string is interpolated into the tokenizer, the trigger is part of
the grammar rather than a display preference. Changing it re-parses every card
(`kanban: src/parsers/common.ts:246`, `kanban: src/parsers/common.ts:247`), and text that was a date
under `@` is ordinary text under `!`, and vice versa. **Recommendation** — treat a trigger change as
a migration of the whole vault's boards, not a cosmetic setting.

**Observed** — the wrapper itself is strict.

| Rule | Where |
|---|---|
| The value may not contain a line ending, and end-of-input aborts the construct | `kanban: src/parsers/extensions/genericWrapped.ts:45`, `kanban: src/parsers/extensions/genericWrapped.ts:63` |
| The value ends at the first character of the end marker, so wrappers do not nest | `kanban: src/parsers/extensions/genericWrapped.ts:55` |
| The value needs at least one character that is neither a space nor a line ending | `kanban: src/parsers/extensions/genericWrapped.ts:56`, `kanban: src/parsers/extensions/genericWrapped.ts:67` |
| No preceding character is examined at all | `kanban: src/parsers/extensions/genericWrapped.ts:20` |

**Inference** — an unterminated wrapper produces no node: the construct returns `nok`, micromark
backtracks, and `@{2024-01-31` stays literal text with no error and no visual cue. `@{}` and `@{ }`
are literal for the same reason. `@{a{b}c}` yields the value `a{b` and leaves `c}` as text.

The last rule in the table causes a divergence worth knowing by heart. **Observed** — the tokenizer
starts on any `@` (`kanban: src/parsers/extensions/genericWrapped.ts:20`), while the renderer's
regexes all require start-of-string or whitespace before the trigger
(`kanban: src/parsers/helpers/hydrateBoard.ts:41`,
`kanban: src/parsers/helpers/hydrateBoard.ts:53`,
`kanban: src/parsers/helpers/hydrateBoard.ts:65`,
`kanban: src/parsers/helpers/hydrateBoard.ts:77`).

**Inference** — `foo@{2024-01-01}` is therefore parsed as a date: the node is created and
`metadata.dateStr` is set (`kanban: src/parsers/formats/list.ts:146`), which feeds date sorting,
date colours and the metadata row. But `preprocessTitle` does not match it, so it is not rewritten
into a date span and keeps looking like plain text inside the word. An email address or a mention
followed by `{` is the realistic way to hit this.

Writing dates and times only ever appends or replaces inside `titleRaw`.

| Action | Effect on `titleRaw` | Where |
|---|---|---|
| Add date | appends `` ` ${dateTrigger}${wrappedDate}` `` | `kanban: src/components/Item/helpers.ts:121` |
| Edit date | replaces the existing match in place | `kanban: src/components/Item/helpers.ts:119` |
| Add time | appends `` ` ${timeTrigger}{${time}}` `` | `kanban: src/components/Item/helpers.ts:269` |
| Edit time | replaces the existing match in place | `kanban: src/components/Item/helpers.ts:267` |
| Remove date | deletes the match and trims | `kanban: src/components/Item/ItemMenu.ts:223` |
| Remove time | deletes the match and trims | `kanban: src/components/Item/ItemMenu.ts:259` |

**Observed** — with `link-date-to-daily-note` on, the wrapped value becomes a wikilink or a Markdown
link to the daily note instead of `{...}` (`kanban: src/components/Item/helpers.ts:113`,
`kanban: src/helpers.ts:30`). The stored date string is parsed with `date-format`
(`kanban: src/parsers/helpers/hydrateBoard.ts:103`); a value that does not match simply yields an
invalid moment and is left on disk untouched.

## Tags

**Observed** — tags are a construct too (`kanban: src/parsers/extensions/tag.ts:7`), with rules that
differ from the date wrapper in exactly the way that matters.

| Rule | Where |
|---|---|
| The character before `#` must be absent or whitespace | `kanban: src/parsers/extensions/tag.ts:21` |
| The tag ends at the first character in a fixed class: whitespace, line ending, general punctuation and CJK punctuation blocks, and the literal set ``'!"#$%&()*+,.:;<=>?@^`{|}~[]\`` | `kanban: src/parsers/extensions/tag.ts:58` |
| At least one character must follow `#` | `kanban: src/parsers/extensions/tag.ts:62` |

**Inference** — `-`, `_` and `/` are absent from that class, so `#in-progress`, `#in_progress` and
nested `#a/b/c` are single tags. `#` is present in the class, so `#a#b` yields the tag `a` and stops
at the second `#`. Digits pass, so `#2024` is a tag.

**Observed** — recognised tags are collected into `metadata.tags` with the `#` re-attached
(`kanban: src/parsers/formats/list.ts:134`), skipped when the enclosing node's first child starts
with a fence (`kanban: src/parsers/formats/list.ts:128`), and sorted for display only
(`kanban: src/parsers/formats/list.ts:225`). Nothing here rewrites `titleRaw`.

**Inference, and partly unverified** — a tag that opens a continuation line is doubtful. The guard
applies `String.fromCharCode` to the previous code and tests the result against `/\s/`
(`kanban: src/parsers/extensions/tag.ts:21`). A literal newline, code 10, would pass that test, but
micromark represents line endings with its own dedicated code values rather than the raw character.
Which of the two the tokenizer sees at a line start cannot be settled from the pinned tree, because
micromark is not vendored there. **Unverified** — not reproduced at runtime.
**Recommendation** — put at least one space or word before a tag that starts a continuation line, so
the outcome does not depend on this.

## Block ids

Block ids are the sharpest edge on the card line, because three pieces of code disagree about what a
block id is.

| Piece | Rule | Where |
|---|---|---|
| Tokenizer | `^` followed by one or more non-space characters, running to end of line; no preceding character is examined | `kanban: src/parsers/extensions/blockid.ts:18`, `kanban: src/parsers/extensions/blockid.ts:49`, `kanban: src/parsers/extensions/blockid.ts:53` |
| Content boundary | a block id that is the item's last inline node is excluded from the card text | `kanban: src/parsers/helpers/ast.ts:12` |
| `removeBlockId` | strips whitespace plus `^` plus `[a-zA-Z0-9-]+` at end of **line 0 only** | `kanban: src/parsers/helpers/parser.ts:51` |
| `addBlockId` | appends `' ^' + blockId` to **line 0 only** | `kanban: src/parsers/helpers/parser.ts:43` |

**Observed** — the board model keeps one block id per card, assigned by a document-order walk, so a
card containing several `^`-runs keeps the last one (`kanban: src/parsers/formats/list.ts:122`).

**Inference** — the practical consequences:

- **A block id migrates to the first line.** An id found on a continuation line is captured, removed
  from the text by whichever of the two removal paths applies, and re-added to line 0 on the next
  save.
- **`2^10` is read as a block id.** With no preceding-whitespace requirement, `- [ ] Compute 2^10`
  yields the id `10`; the content boundary drops `^10` from the card text; `addBlockId` puts it back
  with a space in front. The line becomes `- [ ] Compute 2 ^10`. Any trailing caret expression —
  exponents, footnote-like markers, regex fragments — behaves this way.
- **An id outside `[a-zA-Z0-9-]` can be duplicated.** When the id is not the item's last inline node
  — a multi-line card whose first line ends with `^abc_def` — the content boundary does not remove
  it and `removeBlockId` does not match it, yet `blockId` is set. `addBlockId` then appends a second
  copy on the next save.

**Observed** — "Copy link to card" mints a six-character id when the card has none and writes it
into the file immediately (`kanban: src/components/Item/ItemMenu.ts:109`). "Duplicate card" copies
the card data verbatim and regenerates only the in-memory instance id
(`kanban: src/helpers/boardModifiers.ts:256`), so the block id is duplicated and the file ends up
with two identical `^id` anchors.

**Recommendation** — treat `^` in card text as reserved. If a card must contain a caret expression,
keep it away from the end of a line.

## Inline metadata

Kanban reads two foreign metadata dialects out of the card text, and reads neither unless the
owning plugin is enabled.

**Observed** — `extractInlineFields` resolves both plugins first
(`kanban: src/parsers/helpers/inlineMetadata.ts:420`,
`kanban: src/parsers/helpers/inlineMetadata.ts:421`). Dataview-style fields are scanned only when
Dataview is present (`kanban: src/parsers/helpers/inlineMetadata.ts:424`), and the Tasks emoji
fields only when Tasks is present and the caller opts in
(`kanban: src/parsers/helpers/inlineMetadata.ts:440`). Presence means the plugin id is in
`enabledPlugins` (`kanban: src/parsers/helpers/inlineMetadata.ts:172`,
`kanban: src/parsers/helpers/inlineMetadata.ts:456`) — installed but disabled counts as absent. The
card parser is the caller that opts in (`kanban: src/parsers/formats/list.ts:197`).

| Dialect | Shape | Recognised keys |
|---|---|---|
| Dataview | `[key:: value]` or `(key:: value)`, wrappers at `kanban: src/parsers/helpers/inlineMetadata.ts:266`, parsed at `kanban: src/parsers/helpers/inlineMetadata.ts:322` | any key without a bracket character |
| Tasks | emoji signifier plus value, regexes at `kanban: src/parsers/helpers/inlineMetadata.ts:348` | the ten keys listed at `kanban: src/parsers/helpers/inlineMetadata.ts:359` |

**Observed** — Kanban carries its own copy of the Tasks symbol table
(`kanban: src/parsers/helpers/inlineMetadata.ts:65`) rather than asking Tasks for it. That copy is
narrower than the pinned Tasks release: Tasks 8.3.0 defines an on-completion signifier
(`tasks: src/TaskSerializer/DefaultTaskSerializer.ts:101`) that has no entry in Kanban's table or in
its regex list, while the done signifier is shared
(`tasks: src/TaskSerializer/DefaultTaskSerializer.ts:98`,
`kanban: src/parsers/helpers/inlineMetadata.ts:78`).

**Inference** — an on-completion action on a card is invisible to Kanban's *extraction*: it is never
extracted, so it can never be moved out of the displayed title and never appears in the metadata row,
and because `titleRaw` is a raw slice it survives a save as literal text.

**Invisible is not inert, and this is the case worth knowing.** With `🏁 delete`, Tasks prunes the
completed instance from the array it returns — the pruning runs inside
`putRecurrenceInUsersOrder` before the result is handed back
(`tasks: src/Task/Task.ts:519`) — so a non-recurring card toggles to an empty array,
`toggleLine` joins zero lines, and the API returns the empty string
(`tasks: src/Commands/ToggleDone.ts:21`, `tasks: src/Commands/ToggleDone.ts:22`,
`tasks: src/Api/index.ts:23`). Kanban's `toggleTask` treats a falsy result as "no Tasks plugin" and
returns `null` (`kanban: src/parsers/helpers/inlineMetadata.ts:231`), so the caller drops into the
no-Tasks branch and sets the check character directly (`kanban: src/components/helpers.ts:89`).
**Inference** — the card is left checked with **no done date**, indistinguishable on disk from the
same card in a vault where Tasks is not installed, while the deletion Tasks intended never happens.
**Unverified** — traced through both pins and not reproduced; the pruning helper itself lives in
`src/Task/OnCompletion.ts` on the Tasks side, which this skill names but does not pin file by file,
so only the call site above is covered by the recorded source identity.

**Observed** — placement matters for Tasks fields but not for Dataview fields: a Tasks field is kept
only when it sits on the card's first line, whereas other inline fields are kept wherever they are
(`kanban: src/parsers/formats/list.ts:202`). Overlapping matches are dropped so that a field cannot
be counted twice (`kanban: src/parsers/helpers/inlineMetadata.ts:447`), and a recurrence value is
normalised through RRule for display (`kanban: src/parsers/helpers/inlineMetadata.ts:399`).

**Observed** — none of this changes the file. Extraction reads from `itemData.title`
(`kanban: src/parsers/formats/list.ts:197`) and any removal slices `itemData.title`
(`kanban: src/parsers/formats/list.ts:218`). `titleRaw`, built at
`kanban: src/parsers/formats/list.ts:93`, is untouched, and it alone is serialised.

## What a card loses on save

Everything on the line that is not covered below is preserved, because `titleRaw` is a raw slice of
the file. **Inference** — each row composes cited rules from the sections above; none was executed.

| Written by hand | After the next save | Cause |
|---|---|---|
| `- foo`, `* foo`, `+ foo` | `- [ ] foo` | one writer, one marker (`kanban: src/parsers/formats/list.ts:404`) |
| `- [x]` alone | `- [ ] [x]` | lookahead fails, empty-task guard does not match (`kanban: src/parsers/extensions/taskList.ts:82`, `kanban: src/parsers/formats/list.ts:71`) |
| `- [ ]` alone | `- [ ] ` | lookahead fails, empty-task guard matches (`kanban: src/parsers/formats/list.ts:71`) |
| leading or trailing spaces in the card text | trimmed | `kanban: src/parsers/helpers/parser.ts:36`, `kanban: src/parsers/helpers/parser.ts:57` |
| `a<br>b` | two lines, the second indented | `kanban: src/parsers/helpers/parser.ts:31` with no inverse |
| tab-indented body in a spaces vault | four-space indents | `kanban: src/parsers/helpers/parser.ts:35` |
| a two-space continuation | gains a full indent level in front of the two spaces | `kanban: src/parsers/helpers/parser.ts:57` |
| `^id` on a continuation line | moved to the first line | `kanban: src/parsers/helpers/parser.ts:43` |
| `2^10` at end of line | `2 ^10` | `kanban: src/parsers/extensions/blockid.ts:18`, `kanban: src/parsers/helpers/ast.ts:12` |

What is **not** lost, and is worth stating because it is often assumed to be: the check character
itself for any non-space value, wikilinks and embeds, Dataview and Tasks inline metadata, tags,
wrapped dates and times, code spans, and every continuation line indented with one tab or exactly
four spaces.

**Recommendation** — before editing a board file by hand, open it in the Kanban view once and let it
save, then diff. The first save applies every normalisation above at once; later saves are quiet.

## Known gaps

- **No runtime execution.** Every claim here is read from the pinned source. micromark and mdast are
  not vendored in the pin, so tokenizer outcomes are traced through Kanban's constructs and the
  helper names they call, not observed. The round-trip tables are labelled Inference for that reason.
- **A tag opening a continuation line is unresolved.** See the tags section; settling it requires
  running micromark against the pinned extension.
- **No documented contract for the line format.** `kanban: docs/` covers settings and workflows only.
  Anyone treating the card line as a stable public format is relying on implementation behaviour that
  upstream has never promised.
- **Rendering is out of scope.** How `title` is turned into DOM, how tag and date colours are
  applied, and how the metadata table is laid out are not covered here.
- **Table and list board views are out of scope.** They read the same card model but present it
  differently.
- **No agent-behaviour evaluation has been run.** Nothing here has been tested for how reliably an
  assistant retrieves or applies it in a clean context.
