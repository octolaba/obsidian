# Changing a board from outside Obsidian

This file owns the contract for writing to a Kanban board that Obsidian may also be writing to, and
the per-operation mechanics an external editor has to reproduce so the result is the board the plugin
would have produced. Read it before any programmatic edit. The board format reference owns the file
grammar, the card anatomy reference owns what a card line means, and the lanes and archive reference
owns lane semantics; this file owns the act of changing them.

## Contents

- [Evidence boundary](#evidence-boundary)
- [The concurrency contract](#the-concurrency-contract)
- [Preconditions, ranked](#preconditions-ranked)
- [The write protocol](#the-write-protocol)
- [Operation mechanics](#operation-mechanics)
- [The done column, in detail](#the-done-column-in-detail)
- [What an external editor cannot imitate](#what-an-external-editor-cannot-imitate)
- [A safer route: writing through Obsidian](#a-safer-route-writing-through-obsidian)
- [Known gaps](#known-gaps)

## Evidence boundary

Read for this file: the state machine, the view, the board modifiers, the drag-and-drop application,
the lane and item components and menus, and the Tasks completion path on both sides. Not read: the
drag-and-drop hit-testing internals, the table view, and the flatpickr vendor tree.

Citation alias `kanban` is `obsidian-community/obsidian-kanban` at tag `2.0.51`; alias `tasks` is
`obsidian-tasks-group/obsidian-tasks` at tag `8.3.0`. No Obsidian session was run; every statement
below is read from those pinned sources, and the ones that need a running app to confirm are marked
**Unverified**.

## The concurrency contract

There is no contract. That is the finding.

**Observed.** Every save serialises the entire board out of memory and hands the string to the view;
nothing reads the file first, compares an mtime, or detects a conflict
(`kanban: src/StateManager.ts:99`, `kanban: src/StateManager.ts:107`). The view stores that string
and asks Obsidian to save it (`kanban: src/KanbanView.tsx:204`), and `getViewData` returns the stored
string rather than re-serialising, deliberately (`kanban: src/KanbanView.tsx:218`).

**Observed.** The board's own file is excluded from the plugin's change notification: the handler
loops over state managers and skips the one whose file changed (`kanban: src/main.ts:532`). The
re-parse it would otherwise trigger reads the in-memory string anyway, not the disk
(`kanban: src/StateManager.ts:358`).

**Observed.** The only path from disk into the model is Obsidian pushing new content into the view,
which parses it only when the view is the primary one (`kanban: src/KanbanView.tsx:239`), and that
parse is explicitly told not to save (`kanban: src/StateManager.ts:93`). "Primary" means whichever
view happens to be first in the set (`kanban: src/KanbanView.tsx:43`, `kanban: src/StateManager.ts:47`).

**Observed.** Saves happen with no user action at all. Collapsing a lane writes the whole file
(`kanban: src/components/Lane/Lane.tsx:71`). Resizing a table column writes it half a second later
(`kanban: src/components/Table/Table.tsx:121`). An archive longer than `max-archive-size` is trimmed
on render, which is a state change and therefore a save (`kanban: src/components/Kanban.tsx:153`).

**Inference.** Put together: a board open in Obsidian can overwrite an external edit at an
unpredictable moment, with no user involvement, and the external edit leaves no trace. A second pane
on the same board is worse, because it holds state that predates the edit and never re-reads disk.

**Observed.** One more trap: if an external edit removes or renames the `kanban-plugin` frontmatter
key while the board is open, the leaf silently turns into a Markdown editor
(`kanban: src/KanbanView.tsx:222`).

## Preconditions, ranked

**Recommendation.** In descending order of safety:

| Situation | Verdict |
|---|---|
| The board is not open in any Obsidian window | Safe. Write, then verify. |
| Obsidian is running but the board is not open | Safe in practice; the plugin builds no state for a file it has not opened. **Unverified** without a session. |
| The board is open in exactly one pane | Risky. Compare-and-swap plus a settle check catches most losses, but not all. |
| The board is open in more than one pane, or in a popout window | Refuse. The non-primary pane never re-reads disk and can republish the pre-edit board later. |
| The board is open and its settings are being edited | Refuse. The settings modal writes on a one-second debounce of its own (`kanban: src/Settings.ts:177`). |

**Observed.** Nothing in the plugin exposes which of these is true. Kanban publishes no API of its
own: it only *calls* other plugins' — the Tasks toggle
(`kanban: src/parsers/helpers/inlineMetadata.ts:214`) and Dataview's page lookup
(`kanban: src/parsers/common.ts:79`). There is no lock file and no marker. A tool that claims to
detect an open board is claiming something it cannot know.

## The write protocol

[`scripts/kanban-card.mjs`](../scripts/kanban-card.mjs) and
[`scripts/kanban-migrate.mjs`](../scripts/kanban-migrate.mjs) implement the following, and a hand-written
edit should do the same.

1. **Read once, and remember the bytes.** Record size and a content hash at read time.
2. **Refuse to act on a board that does not parse.** A board with a frontmatter or settings error
   will not be saved by the plugin either (`kanban: src/StateManager.ts:100`), so editing it is
   editing something Obsidian is not reading.
3. **Compute the whole edit before touching the file.** Every operation below is a pure
   transformation of the parsed model into a new set of lines.
4. **Compare and swap.** Immediately before writing, re-read and re-hash. If anything moved, refuse
   and start again. This is the only defence available from outside the app.
5. **Keep the previous contents.** The tools write a `.bak` sibling by default. It is deliberately not
   a `.md` file, so Obsidian does not index it as a note.
6. **Read back, then settle.** Read the file again immediately, and again after a window longer than
   Obsidian's save debounce. The default settle is three seconds. If the bytes changed in between, an
   open board overwrote the edit — report that, and point at the backup.
7. **Validate the result.** Run the board linter over the edited file and confirm no new finding.

**Recommendation.** Refuse rather than write, in each of these cases. The bundled tools do, and a
hand-written edit should:

| Case | Why writing would lose something |
|---|---|
| Bytes that are not valid UTF-8 | Everything here works on decoded strings; a byte that does not survive the decode is replaced on write, and in the backup too, because the backup is written from the same string |
| A file mixing CRLF and bare LF | No single join reproduces both, so lines nobody edited change as well |
| A path that leaves the vault once its links are followed | A link inside a vault can point anywhere; the containment check has to resolve it, not just compare strings |
| A construct the port declines to model — a setext heading, an indented code block, a settings block with no blank line above it | The model would be wrong, and every line number derived from it with it |
| A whole-file rewrite of a board holding content the model cannot carry | Obsidian would delete it eventually; a tool that does it first has taken the blame and the timing away from the user |
| A whole-file rewrite of a board whose frontmatter is richer than flat scalars | The frontmatter is regenerated, and a value this port only partly read comes back wrong |
| A whole-file rewrite under a language whose markers the board does not use | The complete marker and the archive heading would be dropped as unrecognised content |

**Recommendation.** Prefer many small edits, each verified, over one large rewrite. A lost small edit
is cheap to redo and easy to notice; a lost migration is neither.

## Operation mechanics

The plugin is not consistent about applying its own mechanics: two paths that look identical to a
user do different things to the file. An external editor has to choose which path it is imitating and
say so.

| Operation | What the plugin writes | Applies the complete mechanic? |
|---|---|---|
| Add a card through the lane form | Prepends or appends per `new-card-insertion-method`, and forces the new card's check state to the lane's (`kanban: src/components/Lane/Lane.tsx:84`, `kanban: src/components/Lane/Lane.tsx:91`) | Sets the character only; never asks Tasks for a date (`kanban: src/components/Lane/Lane.tsx:94`) |
| Drag a card into another lane | Moves the item, running the completion logic (`kanban: src/components/helpers.ts:36`) | Yes |
| Move to list, from the card menu | Inserts at index 0 of the target lane (`kanban: src/components/Item/ItemMenu.ts:280`) | **No** |
| Move to top or bottom | Reorders within the lane (`kanban: src/helpers/boardModifiers.ts:82`) | No |
| Tick the card checkbox | Toggles through the Tasks path when available (`kanban: src/components/Item/ItemCheckbox.tsx:33`) | Yes |
| Edit card text | Re-parses the card from `- [char] text` (`kanban: src/parsers/formats/list.ts:336`) | No |
| Archive one card | Removes it and appends to the end of the archive (`kanban: src/helpers/boardModifiers.ts:240`) | No |
| Archive a whole lane, or all its cards | Prepends them to the front of the archive (`kanban: src/helpers/boardModifiers.ts:157`, `kanban: src/helpers/boardModifiers.ts:185`) | No |
| Archive completed cards | Appends to the end (`kanban: src/StateManager.ts:411`) | Uses the flag to decide what to take |
| Delete a card | Removes the lines; nothing is archived (`kanban: src/helpers/boardModifiers.ts:217`) | No |
| Duplicate a card | Copies the card, block id included (`kanban: src/helpers/boardModifiers.ts:256`) | No |

**Observed.** The archive timestamp, when `archive-with-date` is on, is built as date, optional
separator, card text, and the array is reversed when `append-archive-date` is set
(`kanban: src/helpers/boardModifiers.ts:45`, `kanban: src/helpers/boardModifiers.ts:51`). The default
format is the board's date format followed by its time format, and the default separator is the empty
string (`kanban: src/StateManager.ts:231`, `kanban: src/StateManager.ts:248`), which is pushed only
when it is truthy (`kanban: src/helpers/boardModifiers.ts:47`). So on defaults the same setting pair
yields `2026-08-03 09:15 Card` or `Card 2026-08-03 09:15`, with no separator between the two; a
board that sets `archive-date-separator` to `-` gets `Card - 2026-08-03 09:15` instead.

**Observed.** Archiving can delete what it just archived: a lane archived into a full archive
unshifts to the front (`kanban: src/helpers/boardModifiers.ts:157`) while the size cap keeps the last
N (`kanban: src/components/Kanban.tsx:158`). The cards nearest the front are the ones removed.

## The done column, in detail

This is the mechanic most worth getting right, and the one most often described wrongly.

**Observed.** A lane is a done column when a paragraph between its heading and its cards stringifies
to the localised word for "Complete" (`kanban: src/parsers/formats/list.ts:267`). The plugin writes
it as `**Complete**` (`kanban: src/parsers/common.ts:23`), but because the comparison runs on
rendered text, a bare `Complete` sets the flag just as well.

**Observed.** Moving a card in or out of such a lane by dragging runs one decision procedure
(`kanban: src/components/helpers.ts:36`):

1. If neither the source nor the destination marks cards complete, nothing changes
   (`kanban: src/components/helpers.ts:52`).
2. If the card already matches the destination, nothing changes
   (`kanban: src/components/helpers.ts:57`).
3. Moving into the done column, the card is first set to the status that precedes done, so a custom
   Tasks status cycle lands on the right symbol (`kanban: src/components/helpers.ts:60`).
4. The toggle is then delegated to the Tasks plugin (`kanban: src/components/helpers.ts:63`).
5. If Tasks is not installed, the fallback sets the check state directly and nothing else
   (`kanban: src/components/helpers.ts:82`).

**Observed.** **Kanban never writes a completion date.** The delegation returns immediately when the
Tasks plugin is absent (`kanban: src/parsers/helpers/inlineMetadata.ts:219`), and the done character
falls back to a literal `x` (`kanban: src/parsers/helpers/inlineMetadata.ts:188`). The `✅` character
appears in the Kanban source only in a symbol table and a parsing pattern
(`kanban: src/parsers/helpers/inlineMetadata.ts:78`,
`kanban: src/parsers/helpers/inlineMetadata.ts:353`).

**Observed.** With Tasks installed, the date comes from Tasks' own toggle
(`tasks: src/Api/index.ts:23`, `tasks: src/Commands/ToggleDone.ts:20`), which sets a done date while
building the new task (`tasks: src/Task/Task.ts:401`) and renders it after the `✅` symbol
(`tasks: src/TaskSerializer/DefaultTaskSerializer.ts:98`). Tasks' core done status is the symbol `x`
(`tasks: src/Statuses/Status.ts:23`).

**Observed.** A recurring card is not one card. Tasks returns two lines, and Kanban decides which one
is the moved card from the Tasks `recurrenceOnNextLine` setting
(`kanban: src/parsers/helpers/inlineMetadata.ts:235`), whose default is off
(`tasks: src/Config/Settings.ts:128`). The other line is spliced back into the source lane. An
external editor that writes only one card has silently dropped the next occurrence — which is why
`kanban-card.mjs` refuses a card carrying a recurrence rule unless told otherwise.

**Recommendation.** When imitating completion from outside:

- Decide whether the vault has the Tasks plugin. Without it, write only the check character.
- With it, `--tasks-emoji` appends `✅ YYYY-MM-DD`. That is an imitation of another plugin's output,
  not that plugin's output: the real one is produced against the status registry and settings in
  effect in that vault. Say so when reporting the change.
- Never assume the done character is `x` if the vault defines custom statuses; pass `--done-char`.

## What an external editor cannot imitate

**Observed.** These need the running app, and a tool outside it should decline rather than guess:

- The Tasks completion date under custom statuses or recurrence, for the reasons above.
- Anything that depends on the vault's link style: setting a date on a board with
  `link-date-to-daily-note` writes a link built from the daily-note settings
  (`kanban: src/helpers.ts:31`), so `kanban-card.mjs` refuses `set-date` on such a board.
- Creating a note from a card, which resolves a template through the Templates or Templater plugin
  (`kanban: src/components/helpers.ts:136`).
- Linked-page metadata, which is read out of Obsidian's metadata cache
  (`kanban: src/parsers/common.ts:116`).
- The continuation-indent style, which comes from the vault's `useTab` configuration
  (`kanban: src/parsers/helpers/parser.ts:35`). The tools infer it from the board and fall back to a
  tab.

## A safer route: writing through Obsidian

**Recommendation.** If an agent is going to manage cards continuously rather than occasionally, the
file-level protocol above is a mitigation, not a solution. Writing through Obsidian's own vault layer
puts the change where the primary view's reload path can see it, which removes the whole class of
lost writes. Two community plugins expose that surface — a local REST API, and a URI handler that
takes vault operations as parameters. Neither was studied here, so this is a direction rather than a
recommendation with evidence behind it. **Unverified**.

**Recommendation.** Whichever route is taken, keep the board closed during migrations. A migration
rewrites lane order and `list-collapse`, and an open view holds its own copy of the view settings
(`kanban: src/KanbanView.tsx:272`) that it will write back afterwards.

## Known gaps

- No Obsidian session was run. The settle window of three seconds is chosen to exceed the plugin's
  observed debounce, not measured against a running app. **Unverified**.
- Whether a board that is not open can be safely written while Obsidian runs is **Unverified**; the
  reasoning is that no state manager exists for an unopened file, which follows from the source but
  was not observed.
- The alternative write routes named above were not studied at any pin.
- How reliably this guidance is followed by an agent in a clean context has not been evaluated, here
  or anywhere.
