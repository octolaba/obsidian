# Lanes and archive

This reference owns everything above the card line: how a heading becomes a lane, how a WIP limit is
encoded in the lane title, what the complete marker means and which operations honour it, and how
the archive is written, ordered and trimmed. The card line itself belongs to the card anatomy
reference; the frontmatter block, the settings footer and whole-file save behaviour belong to the
board format reference; every settings key named here is defined in the settings reference, and the
Tasks relationship in full belongs to the integrations reference.

## Contents

- [Evidence boundary](#evidence-boundary)
- [Lane recognition](#lane-recognition)
- [Lane titles and WIP limits](#lane-titles-and-wip-limits)
- [The complete marker](#the-complete-marker)
- [The complete mechanic](#the-complete-mechanic)
- [The archive](#the-archive)
- [Archive completed cards](#archive-completed-cards)
- [Lane operations and what they write](#lane-operations-and-what-they-write)
- [Known gaps](#known-gaps)

## Evidence boundary

Citation alias `kanban` is the Kanban pin: `obsidian-community/obsidian-kanban` at tag `2.0.51`,
commit `8501981a1afacb4c8fc03ec60604aa5eedfbd857`. Citation alias `tasks` is the Tasks pin:
`obsidian-tasks-group/obsidian-tasks` at tag `8.3.0`, commit
`e16dbc2cf509420459ea04094a1d834ae89e0019`. Every path inside a citation is relative to the root of
the checkout its alias names.

Read for this file: the board builder and serialiser in `kanban: src/parsers/formats/list.ts`, the
shared constants in `kanban: src/parsers/common.ts`, the AST helpers in
`kanban: src/parsers/helpers/`, the whole of `kanban: src/lang/` including all twenty-four locale
files, the lane and drag components under `kanban: src/components/`, the board mutators in
`kanban: src/helpers/boardModifiers.ts` and `kanban: src/StateManager.ts`, the command and menu
registrations in `kanban: src/main.ts` and `kanban: src/KanbanView.tsx`, every page under
`kanban: docs/`, and the six Tasks files this skill pins.

Not read, and therefore not claimed: micromark and mdast, which the pin declares but does not
vendor. Statements about how a paragraph or heading is stringified are traced through the call sites
in Kanban's own source, not observed. Nothing here was executed, and there are no runtime
measurements. The two boards inside the Tasks sample vault are the only plugin-written board files
present in either pin, and neither contains an archive, so the archive shape below is read from the
serialiser rather than from a sample.

`kanban: docs/` documents settings and user-facing workflows. It never shows a lane heading, the
complete marker, or the archive separator. Claims labelled **Contract** below are limited to what
those pages actually say.

## Lane recognition

**Observed** — the board builder walks the document's top-level children once and reacts only to
headings (`kanban: src/parsers/formats/list.ts:249`,
`kanban: src/parsers/formats/list.ts:250`). For each heading it scans forward for the first `list`
node, stopping early on a second heading or on the settings footer paragraph
(`kanban: src/parsers/formats/list.ts:257`, `kanban: src/parsers/formats/list.ts:258`,
`kanban: src/parsers/formats/list.ts:263`). Anything else between the heading and the list is
skipped and the scan continues (`kanban: src/parsers/formats/list.ts:273`). The scan returns at the
first node whose type matches (`kanban: src/parsers/helpers/ast.ts:57`).

The rules that follow from that walk:

| Rule | Consequence | Where |
|---|---|---|
| Heading depth is never tested | `#`, `###` and `######` all become lanes | `kanban: src/parsers/formats/list.ts:250` |
| Lanes are always written back as level two | depth is normalised on the first save | `kanban: src/parsers/formats/list.ts:410` |
| Only top-level children are visited | a heading inside a blockquote, callout or list item is not a lane | `kanban: src/parsers/formats/list.ts:249` |
| Only the first list after the heading is taken | a second list under the same heading is never reached | `kanban: src/parsers/helpers/ast.ts:57` |
| Non-list nodes in between are skipped, not captured | prose, code blocks, tables and images between a heading and its cards have no place in the model | `kanban: src/parsers/formats/list.ts:273` |
| A heading with no list at all still becomes a lane | an empty lane, not a dropped one | `kanban: src/parsers/formats/list.ts:290` |

**Observed** — the lane model holds only a title, an optional maximum, a complete flag and transient
UI fields (`kanban: src/components/types.ts:16`). **Inference** — anything the model cannot hold is
absent from the in-memory board, and because saving regenerates the whole file from that board
(`kanban: src/parsers/formats/list.ts:443`), it is deleted on the next save. That includes the second
list under one heading: it is never visited, never represented, and disappears silently — with no
error, no notice and no undo beyond Obsidian's file recovery.

**Recommendation** — keep board files free of anything the model cannot carry. A note that needs
prose next to its board should keep the prose in a different file and link to it from a card.

## Lane titles and WIP limits

**Observed** — a lane title is read by `parseLaneTitle`
(`kanban: src/parsers/helpers/parser.ts:60`), which first turns any `<br>` back into a newline
(`kanban: src/parsers/helpers/parser.ts:61`) and then matches
`` /^(.*?)\s*\((\d+)\)$/ `` (`kanban: src/parsers/helpers/parser.ts:63`). A match splits the title
from the limit (`kanban: src/parsers/helpers/parser.ts:66`); no match yields the whole string with a
limit of zero (`kanban: src/parsers/helpers/parser.ts:64`).

**Observed** — the inverse, `laneTitleWithMaxItems`, returns the title unchanged when the limit is
falsy and otherwise appends exactly one space, the number in parentheses
(`kanban: src/helpers.ts:66`, `kanban: src/helpers.ts:67`). It is used both when serialising
(`kanban: src/parsers/formats/list.ts:410`) and when seeding the title editor
(`kanban: src/components/Lane/LaneTitle.tsx:95`), and the editor's result is re-parsed on commit
(`kanban: src/components/Lane/LaneHeader.tsx:109`).

**Inference** — the round trips that matter:

| On disk | Title | Limit | Written back as |
|---|---|---|---|
| `## To Do` | `To Do` | none | `## To Do` |
| `## To Do (3)` | `To Do` | 3 | `## To Do (3)` |
| `## To Do    (3)` | `To Do` | 3 | `## To Do (3)` |
| `## To Do (0)` | `To Do` | none | `## To Do` |
| `## Sprint (2024)` | `Sprint` | 2024 | `## Sprint (2024)` |
| `## Done (v2)` | `Done (v2)` | none | `## Done (v2)` |
| `#### Later` | `Later` | none | `## Later` |
| `## A<br>B` | `A` newline `B` | none | `## A<br>B` |

`(0)` is deleted because zero is falsy at `kanban: src/helpers.ts:66`. Spacing before the
parentheses is normalised to one space because the regex consumes it. Only digits qualify, so a
parenthesised year is silently read as a limit while a parenthesised version string is not.

**Observed** — newlines cannot survive in a heading, so `replaceNewLines` converts them to the
literal `<br>` on write (`kanban: src/parsers/helpers/parser.ts:27`, applied at
`kanban: src/parsers/formats/list.ts:410`). The lane title editor is a full Markdown editor and does
permit a newline (`kanban: src/components/Lane/LaneTitle.tsx:75`), which is how one gets there.

**Contract** — the limit is advisory. Upstream describes it as a display: the counter's text turns
bold once the number of cards exceeds it (`kanban: docs/How do I/Set a WIP Limit.md:2`,
`kanban: docs/How do I/Set a WIP Limit.md:10`). **Observed** — the implementation matches: the limit
drives one CSS modifier (`kanban: src/components/Lane/LaneTitle.tsx:40`) and the counter can be
hidden entirely (`kanban: src/components/Lane/LaneTitle.tsx:31`).

**Inference — nothing blocks exceeding a WIP limit.** This is an absence, so it is recorded with the
search that establishes it rather than with examples. `grep -rn 'maxItems' src/` from the Kanban
repository root returns nineteen lines and no more, and every one of them is accounted for: the title
parser and its inverse (`kanban: src/helpers.ts:66`, `kanban: src/parsers/helpers/parser.ts:64`,
`kanban: src/parsers/helpers/parser.ts:66`), the serialiser
(`kanban: src/parsers/formats/list.ts:410`), the title editor's commit path
(`kanban: src/components/Lane/LaneHeader.tsx:109`, `kanban: src/components/Lane/LaneHeader.tsx:115`),
the model field (`kanban: src/components/types.ts:19`), the two props that hand the value to the
header (`kanban: src/components/Lane/LaneHeader.tsx:148`,
`kanban: src/components/Lane/LaneHeader.tsx:157`), and the counter component that renders it
(`kanban: src/components/Lane/LaneTitle.tsx:40`, `kanban: src/components/Lane/LaneTitle.tsx:48`). No
insertion path appears in that set — not the lane form
(`kanban: src/components/Lane/Lane.tsx:84`), not any drop path
(`kanban: src/DragDropApp.tsx:120`) — because neither reads the field at all. The search is over the
identifier, so a limit enforced under a different name would escape it; nothing else in the pinned
source suggests one exists.

## The complete marker

**Observed** — the marker is the constant `` `**${t('Complete')}**` ``
(`kanban: src/parsers/common.ts:23`). It is written immediately after the lane heading and its blank
line, before the first card, and only when the lane's flag is set
(`kanban: src/parsers/formats/list.ts:414`, `kanban: src/parsers/formats/list.ts:415`).

**Observed** — matching is not textual. The candidate paragraph is stringified first and the
resulting plain text is compared with `t('Complete')`
(`kanban: src/parsers/formats/list.ts:261`, `kanban: src/parsers/formats/list.ts:267`).

**Inference** — because the comparison runs on stringified inline content, emphasis is invisible to
it: `**Complete**`, `*Complete*`, `__Complete__` and a bare `Complete` all match. And because this
call site does not pass `includeImageAlt: false` — unlike the archive check, which does
(`kanban: src/parsers/formats/list.ts:231`) — an image whose alt text is `Complete` matches too.

**Observed** — the marker is localised. `t()` resolves against the locale selected by
`window.localStorage.getItem('language')`, which is Obsidian's UI language
(`kanban: src/lang/helpers.ts:53`, `kanban: src/lang/helpers.ts:54`), and falls back to English for
any key a locale does not define (`kanban: src/lang/helpers.ts:61`). Both the lookup and the marker
constant are evaluated at module scope (`kanban: src/lang/helpers.ts:53`,
`kanban: src/parsers/common.ts:23`). **Inference** — the locale is therefore fixed when the plugin
loads, so changing Obsidian's display language does not change what the plugin writes until the
plugin is reloaded.

Exactly eight locales define `Complete` and `Archive` — English itself and seven translations. This
list was read from every file in `kanban: src/lang/locale/`; the other sixteen define neither key
and therefore fall back to English.

| Obsidian language value | Complete | Archive | Where |
|---|---|---|---|
| `de` | `Fertiggestellt` | `Archiv` | `kanban: src/lang/locale/de.ts:29`, `kanban: src/lang/locale/de.ts:30` |
| `en` | `Complete` | `Archive` | `kanban: src/lang/locale/en.ts:32`, `kanban: src/lang/locale/en.ts:33` |
| `it` | `Completato` | `Archivio` | `kanban: src/lang/locale/it.ts:22`, `kanban: src/lang/locale/it.ts:23` |
| `ja` | `完了` | `アーカイブ` | `kanban: src/lang/locale/ja.ts:29`, `kanban: src/lang/locale/ja.ts:30` |
| `ko` | `완료됨` | `보관됨` | `kanban: src/lang/locale/ko.ts:28`, `kanban: src/lang/locale/ko.ts:29` |
| `pt-BR` | `Concluído` | `Arquivado` | `kanban: src/lang/locale/pt-br.ts:22`, `kanban: src/lang/locale/pt-br.ts:23` |
| `ru` | `Выполнено` | `Архивировать` | `kanban: src/lang/locale/ru.ts:28`, `kanban: src/lang/locale/ru.ts:29` |
| `zh` | `完成` | `归档` | `kanban: src/lang/locale/zh-cn.ts:28`, `kanban: src/lang/locale/zh-cn.ts:29` |

**Observed** — the language value is the key in the locale map, not the filename. Simplified Chinese
is registered under `zh`, not `zh-cn` (`kanban: src/lang/helpers.ts:50`); Brazilian Portuguese is
registered under `pt-BR` (`kanban: src/lang/helpers.ts:42`); traditional Chinese is a separate entry
that defines neither key (`kanban: src/lang/helpers.ts:49`).

**Observed, upstream defect, harmless here** — the Ukrainian entry imports the Turkish locale file
(`kanban: src/lang/helpers.ts:22`). It does not affect these two keys, because Turkish defines
neither and both fall back to English either way.

**Inference** — a board is therefore not portable across Obsidian UI languages. A board written
under `ru` carries `**Выполнено**`; opened under `en`, the stringified paragraph does not equal
`Complete`, the lane's flag stays false, and the next save drops the paragraph entirely because
`laneToMd` writes the marker only when the flag is set
(`kanban: src/parsers/formats/list.ts:414`). The lane silently stops being a complete lane. The same
applies to `## Архивировать`, which stops being the archive and becomes an ordinary lane.

**Observed** — placement is equally strict. The forward scan stops at the first `list`
(`kanban: src/parsers/helpers/ast.ts:57`), so a marker paragraph written *after* the cards is never
examined. **Inference** — it is not represented in the model and is therefore deleted on the next
save, while the lane is not marked complete.

**Recommendation** — treat a shared board as language-bound. Before switching Obsidian's display
language, convert markers by hand, or accept that every complete lane and the archive heading will
be demoted on first save. When a board loses its complete flags after a machine change, check the
UI language before suspecting corruption.

## The complete mechanic

Marking a lane complete does not itself change any card
(`kanban: src/components/Lane/LaneSettings.tsx:30` toggles the flag and nothing else). What changes
cards is a small set of operations, and the set is smaller than users expect.

| Operation | Applies the mechanic | Where |
|---|---|---|
| Drag a card within one board | yes | `kanban: src/DragDropApp.tsx:120`, `kanban: src/DragDropApp.tsx:135` |
| Drag a card between two boards | yes | `kanban: src/DragDropApp.tsx:208` |
| Drop external text into a lane | yes | `kanban: src/DragDropApp.tsx:60`, `kanban: src/DragDropApp.tsx:61` |
| Click the card checkbox | yes | `kanban: src/components/Item/ItemCheckbox.tsx:33` |
| Add a card through the lane form | partly — sets the check character from the lane's flag, never asks Tasks for a date | `kanban: src/components/Lane/Lane.tsx:91`, `kanban: src/components/Lane/Lane.tsx:94` |
| "Move to list" menu item | **no** | `kanban: src/components/Item/ItemMenu.ts:280` |
| "Move to top" / "Move to bottom" | **no** | `kanban: src/helpers/boardModifiers.ts:83`, `kanban: src/helpers/boardModifiers.ts:90` |
| Toggling the lane's complete setting | **no** | `kanban: src/components/Lane/LaneSettings.tsx:30` |

**Observed** — the shared implementation is `maybeCompleteForMove`
(`kanban: src/components/helpers.ts:36`). It returns the card untouched when neither the source nor
the destination lane is complete (`kanban: src/components/helpers.ts:52`) and when the card's state
already matches the destination (`kanban: src/components/helpers.ts:57`). Completeness is defined as
checked **and** carrying the Tasks done character
(`kanban: src/components/helpers.ts:54`). Moving into a complete lane first sets the pre-done
character (`kanban: src/components/helpers.ts:60`) and then hands the line to Tasks
(`kanban: src/components/helpers.ts:63`); without Tasks it simply flips `checked` and `checkChar`
(`kanban: src/components/helpers.ts:89`).

**Observed** — "Move to list" and the two move-to-end commands call the raw entity mover instead.
**Inference** — dragging a card into a Done lane completes it and can add a done date, while
choosing that same lane from the card's own menu does not. Two visibly identical outcomes on the
board correspond to two different lines on disk.

**Observed** — adding a card to a complete lane sets `checked` and sets `checkChar` to
`getTaskStatusDone()` directly (`kanban: src/components/Lane/Lane.tsx:94`) and never calls
`toggleTask`. **Inference** — the card is born checked with no completion date, even with Tasks
installed and configured to record one.

Where the characters come from:

| Value | Without Tasks | With Tasks | Where |
|---|---|---|---|
| done character | `x` | the symbol of the first `DONE` status | `kanban: src/parsers/helpers/inlineMetadata.ts:188`, `kanban: src/parsers/helpers/inlineMetadata.ts:194` |
| pre-done character | `' '` | the symbol whose next status is the done symbol | `kanban: src/parsers/helpers/inlineMetadata.ts:200` |
| completion date | never written | written by Tasks | `kanban: src/parsers/helpers/inlineMetadata.ts:230` |

**Observed** — Kanban locates Tasks twice, by two different routes: the plugin object comes from
`enabledPlugins` (`kanban: src/parsers/helpers/inlineMetadata.ts:172`), while its settings are found
by scanning the editor-suggest registry for a suggester that carries a `taskFormat`
(`kanban: src/parsers/helpers/inlineMetadata.ts:180`). **Inference** — the second route is
undocumented and fragile; if it fails while the first succeeds, the done character silently reverts
to `x` and the pre-done character to a space, even though Tasks is running with custom statuses.

**Observed** — Kanban never writes a completion date itself. The done emoji appears in its source
only in a copied symbol table, an icon map and a parsing regex
(`kanban: src/parsers/helpers/inlineMetadata.ts:78`,
`kanban: src/parsers/helpers/inlineMetadata.ts:98`,
`kanban: src/parsers/helpers/inlineMetadata.ts:353`). Dates come from Tasks: Kanban passes the card's
first line only (`kanban: src/parsers/helpers/inlineMetadata.ts:230`), Tasks toggles it
(`tasks: src/Api/index.ts:23`, `tasks: src/Commands/ToggleDone.ts:20`,
`tasks: src/Task/Task.ts:503`), a new done date is computed during the status change
(`tasks: src/Task/Task.ts:387`) and written with the done signifier
(`tasks: src/TaskSerializer/DefaultTaskSerializer.ts:98`). The Tasks core done status uses the
symbol `x` and the core todo status advances to `x`
(`tasks: src/Statuses/Status.ts:23`, `tasks: src/Statuses/Status.ts:40`).

**Observed** — only the first line is sent to Tasks; every other line of a multi-line card is
re-attached afterwards (`kanban: src/parsers/helpers/inlineMetadata.ts:244`). When Tasks returns two
lines — a recurrence — which one stays in place depends on the Tasks
`recurrenceOnNextLine` setting (`kanban: src/parsers/helpers/inlineMetadata.ts:227`), which defaults
to false (`tasks: src/Config/Settings.ts:128`).

**Recommendation** — when completion dates or recurrence matter, complete cards by dragging them or
by clicking the checkbox. Do not use "Move to list", and do not create cards directly into a
complete lane.

## The archive

**Observed** — the archive is written as a fixed four-line prelude followed by the cards, and only
when the archive is non-empty (`kanban: src/parsers/formats/list.ts:429`,
`kanban: src/parsers/formats/list.ts:430`, `kanban: src/parsers/formats/list.ts:431`). The separator
constant is `***` (`kanban: src/parsers/common.ts:24`). The whole block is placed after every lane
and before the settings footer (`kanban: src/parsers/formats/list.ts:450`).

The written shape is therefore a thematic break, a blank line, `## ` plus the localised word, a
blank line, then one card line per archived card.

**Observed** — recognition is looser than the written shape. A heading counts as the archive when
its stringified content equals `t('Archive')`, with image alt text excluded
(`kanban: src/parsers/formats/list.ts:231`), and when its immediately preceding sibling is a
thematic break (`kanban: src/parsers/formats/list.ts:235`,
`kanban: src/parsers/formats/list.ts:237`).

**Inference** — three things follow. Any thematic break satisfies the separator, so `---`, `___`,
`- - -` and `****` all work, not only the `***` the plugin writes. Heading depth is not tested, so
`# Archive` is recognised and rewritten as `## Archive`. And an archive written above the lanes
migrates to the bottom of the file on the next save, because the serialiser fixes its position.

**Observed** — an archive heading with no list after it does not become an archive. The builder only
diverts into the archive branch when both the archive test and a list are present
(`kanban: src/parsers/formats/list.ts:276`); otherwise it falls through to the empty-lane branch
(`kanban: src/parsers/formats/list.ts:290`). **Inference** — the board silently gains an ordinary
lane named `Archive`, and on the next save the `***` above it is gone, because the serialiser emits
nothing at all for an empty archive.

**Contract** — the archive is only visible in Markdown mode
(`kanban: docs/How do I/View a Kanban's archive.md:2`), which is why these degradations are easy to
miss from the board view.

Insertion order differs by operation, and it is not cosmetic.

| Operation | Position in the archive | Where |
|---|---|---|
| Archive card (menu item, or modifier-click on the checkbox) | end | `kanban: src/helpers/boardModifiers.ts:240` |
| Archive completed cards | end | `kanban: src/StateManager.ts:411` |
| Archive cards in this list | **front** | `kanban: src/helpers/boardModifiers.ts:185` |
| Archive list | **front** | `kanban: src/helpers/boardModifiers.ts:157` |

**Contract** — the archive grows without bound unless `max-archive-size` is set, and once the cap is
reached "old cards will be deleted as new cards are added"
(`kanban: docs/Settings/Maximum number of archived cards.md:2`,
`kanban: docs/Settings/Maximum number of archived cards.md:4`).

**Observed** — trimming is not an operation the user invokes. It is a render effect that skips only
an undefined value or `-1` (`kanban: src/components/Kanban.tsx:149`) and otherwise keeps the last N
entries (`kanban: src/components/Kanban.tsx:158`) through `setState`, which saves by default
(`kanban: src/StateManager.ts:138`, `kanban: src/StateManager.ts:165`). Keeping the last N means
deleting from the front.

**Inference** — the two facts compose badly. "Archive list" and "Archive cards in this list" insert
at the front; trimming deletes from the front. Archive a forty-card lane into an archive that
already holds its cap of fifty, and the new forty sit at positions 0 to 39 while `slice(-50)` keeps
positions 40 to 89 — every card just archived is deleted in the same render, with no prompt and no
notice. **Recommendation** — leave `max-archive-size` unset, or archive whole lanes only when the
cap is comfortably larger than the archive plus the lane.

**Observed** — the archive timestamp is optional and is composed as an array before joining. The
formatted date goes in first, the separator is appended only when it is non-empty, the card's raw
title goes last, and the whole array is reversed when `append-archive-date` is set, then joined with
single spaces (`kanban: src/helpers/boardModifiers.ts:45`,
`kanban: src/helpers/boardModifiers.ts:47`, `kanban: src/helpers/boardModifiers.ts:51`,
`kanban: src/helpers/boardModifiers.ts:53`). The same routine is duplicated verbatim for the
completed-cards path (`kanban: src/StateManager.ts:374`, `kanban: src/StateManager.ts:381`,
`kanban: src/StateManager.ts:383`).

**Inference** — reversal moves the separator too, so the two layouts are `date separator title` and
`title separator date`; the separator is never left stranded at one end. With an empty separator the
layouts are simply `date title` and `title date`.

| Setting | Default | Where |
|---|---|---|
| `archive-with-date` | off — gates the whole timestamp | `kanban: src/helpers/boardModifiers.ts:241`, `kanban: src/StateManager.ts:369` |
| `archive-date-format` | the board's date format, a space, the board's time format | `kanban: src/StateManager.ts:231` |
| `archive-date-separator` | empty string | `kanban: src/StateManager.ts:248` |
| `append-archive-date` | off — timestamp goes before the title | `kanban: src/helpers/boardModifiers.ts:51` |

**Observed** — only the format and the separator get a compiled default
(`kanban: src/StateManager.ts:231`, `kanban: src/StateManager.ts:248`). The two booleans have none,
and the plugin merges no defaults object into its stored settings
(`kanban: src/main.ts:63`), so "off" here means "absent, and therefore falsy".

**Contract** — upstream describes exactly this: the timestamp is placed at the beginning by default
and can be moved after the title (`kanban: docs/Settings/Add date and time to archived cards.md:1`,
`kanban: docs/Settings/Archive date time position.md:2`), with a separate separator setting
(`kanban: docs/Settings/Archive date time separator.md:2`) and format setting
(`kanban: docs/Settings/Archive date time format.md:2`).

**Observed** — the timestamp is written into the card's own text, through the same content-update
path any edit uses (`kanban: src/helpers/boardModifiers.ts:54`). **Inference** — it is therefore
re-parsed as card text: a format string containing the date trigger would make the archived card
carry a date, and a format string containing a `#` could produce a tag.

**Observed** — archiving a lane discards the lane title. Only the lane's children move into the
archive (`kanban: src/helpers/boardModifiers.ts:139`), so nothing records where an archived card came
from unless the timestamp is enabled — and the timestamp records when, not where.

**Observed** — the confirmation prompt is skipped entirely for an empty lane; the action fires
immediately from an effect (`kanban: src/components/Lane/LaneMenu.tsx:41`,
`kanban: src/components/Lane/LaneMenu.tsx:42`).

## Archive completed cards

**Observed** — this operation uses a two-part test per card
(`kanban: src/StateManager.ts:392`, `kanban: src/StateManager.ts:393`,
`kanban: src/StateManager.ts:397`):

- a card is *complete* when it is checked **and** its check character equals the Tasks done
  character;
- a card is archived when it is complete **or** when its lane carries the complete flag, regardless
  of its own check state;
- a card is kept only when both conditions are false.

**Inference** — the practical reading: **"Archive completed cards" empties every complete lane
entirely**, including cards that were never checked, and additionally sweeps checked cards out of
ordinary lanes. Users who keep a Done lane as a visible record lose that record on the first
invocation.

**Inference** — the check-character comparison is exact, so `- [X]`, `- [/]` and `- [-]` are checked
but not complete under the default done character `x`
(`kanban: src/parsers/helpers/inlineMetadata.ts:188`). With Tasks installed and a custom `DONE`
status whose symbol is not `x`, ordinary `- [x]` cards stop qualifying.

**Observed** — four entry points reach the same method: the command
(`kanban: src/main.ts:583`), the board header action when `show-archive-all` is on
(`kanban: src/KanbanView.tsx:450`, `kanban: src/KanbanView.tsx:453`), the view's pane menu
(`kanban: src/KanbanView.tsx:344`), and the mobile file menu — where the item is registered twice in
the same menu (`kanban: src/main.ts:466`, `kanban: src/main.ts:475`), an upstream defect that makes
the entry appear duplicated on phones.

**Contract** — a modifier-click on a card's checkbox archives that single card
(`kanban: docs/Settings/Display card checkbox.md:2`); **Observed** — it routes to the single-card
archive path, which appends (`kanban: src/components/Item/ItemCheckbox.tsx:114`,
`kanban: src/helpers/boardModifiers.ts:240`).

## Lane operations and what they write

**Observed** — every row below writes through `setState`, which serialises and saves the whole file
unless explicitly told not to (`kanban: src/StateManager.ts:138`,
`kanban: src/StateManager.ts:165`).

| Operation | Entry point | What lands in the file |
|---|---|---|
| Add a list | board footer form | a new `## ` heading, complete marker if the form's toggle was on (`kanban: src/components/Lane/LaneForm.tsx:39`, `kanban: src/helpers/boardModifiers.ts:104`) |
| Insert list before / after | lane menu | a `## ` heading with an empty title, never complete (`kanban: src/components/Lane/LaneMenu.tsx:115`, `kanban: src/components/Lane/LaneMenu.tsx:135`) |
| Edit list title | lane title editor | heading text; `(N)` re-derived, `(0)` dropped, newlines become `<br>` (`kanban: src/components/Lane/LaneHeader.tsx:109`, `kanban: src/parsers/formats/list.ts:410`) |
| Mark cards in this list as complete | lane settings toggle | adds or removes the marker paragraph; existing card lines are untouched (`kanban: src/components/Lane/LaneSettings.tsx:30`) |
| Add a card | lane form | one card line, prepended or appended per `new-card-insertion-method`, forced to the lane's complete state (`kanban: src/components/Lane/Lane.tsx:84`, `kanban: src/components/Lane/Lane.tsx:94`) |
| Sort by … | lane menu | the reordered card lines, immediately; the chosen sort is **not** persisted (`kanban: src/components/Lane/LaneMenu.tsx:173`, `kanban: src/components/Lane/LaneMenu.tsx:312`, `kanban: src/parsers/formats/list.ts:418`) |
| Archive cards | lane menu | cards move to the **front** of the archive; the heading stays (`kanban: src/helpers/boardModifiers.ts:170`, `kanban: src/helpers/boardModifiers.ts:185`) |
| Archive list | lane menu | heading removed, cards to the **front** of the archive, title lost (`kanban: src/helpers/boardModifiers.ts:139`, `kanban: src/helpers/boardModifiers.ts:157`) |
| Delete list | lane menu | heading and every card removed, nothing archived (`kanban: src/helpers/boardModifiers.ts:199`) |
| Collapse / expand a list | lane header | no lane text changes, but the settings footer is rewritten with a new `list-collapse` array, and the file is saved (`kanban: src/components/Lane/Lane.tsx:71`) |

**Observed** — the lane sort mode has a field in the model
(`kanban: src/components/types.ts:22`) but no representation in the serialised heading
(`kanban: src/parsers/formats/list.ts:410`). **Inference** — a sort is a one-off reordering of lines,
not a live view: new cards land wherever the insertion method puts them.

**Contract** — new cards are appended by default
(`kanban: docs/Settings/Prepend append new cards.md:2`), which matches the branch at
`kanban: src/components/Lane/Lane.tsx:84`.

**Observed** — there is no lane-duplication command: the duplicate mutator exists
(`kanban: src/helpers/boardModifiers.ts:253`) and handles lanes, but only the card menu calls it
(`kanban: src/components/Item/ItemMenu.ts:148`).

## Known gaps

- **No runtime execution.** Every claim here is read from the pinned source. Statements about
  stringified headings and paragraphs depend on mdast behaviour that the pin does not vendor, and are
  labelled Inference for that reason.
- **The complete marker's image-alt case is not reproduced.** The asymmetry between the two
  stringification call sites is visible in source; the resulting behaviour was not tested.
- **No archived board file exists in either pin.** The archive shape is read from the serialiser, not
  confirmed against a plugin-written sample.
- **Locale coverage is a snapshot.** The eight-locale list was read from `kanban: src/lang/locale/` at
  this pin and will change if upstream translates the keys in more locales.
- **Cross-board drag is only partly traced.** The single call site is cited; the surrounding
  two-state-manager bookkeeping was not audited.
- **Table and list board views are out of scope.** They present the same lane model differently.
- **No agent-behaviour evaluation has been run.** Nothing here has been tested for how reliably an
  assistant retrieves or applies it in a clean context.
