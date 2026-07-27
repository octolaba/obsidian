# Migrating a board from one workflow to another

This file owns changing a board's *shape* rather than its contents: renaming and reordering lanes,
merging two columns into one, moving which column is the done column, adding or removing
work-in-progress limits, changing board-local settings, and lifting a legacy board to the current
format. The safe-mutation reference owns the write protocol every migration depends on; the lanes and
archive reference owns what a lane means; this file owns planning the change and surviving it.

## Contents

- [Evidence boundary](#evidence-boundary)
- [What a migration is, and is not](#what-a-migration-is-and-is-not)
- [The plan format](#the-plan-format)
- [Order of operations](#order-of-operations)
- [Things a plan cannot do](#things-a-plan-cannot-do)
- [Recipes](#recipes)
- [Procedure](#procedure)
- [Known gaps](#known-gaps)

## Evidence boundary

Read for this file: the parser and serialiser, the settings key set, the lane data model, the board
modifiers that maintain collapsed state, and the view's copy of the view settings. Not read: the
drag-and-drop internals and the rendering layer, which no migration touches.

Citation alias `kanban` is `obsidian-community/obsidian-kanban` at tag `2.0.51`. No Obsidian session
was run.

## What a migration is, and is not

**Observed.** A migration is always a whole-file rewrite. Renaming a lane changes a heading, merging
two lanes moves list items between lists, and reordering lanes moves every line in the file — there
is no minimal edit for that. [`scripts/kanban-migrate.mjs`](../scripts/kanban-migrate.mjs) therefore
re-serialises the board through the same shape the plugin emits
(`kanban: src/parsers/formats/list.ts:443`).

**Recommendation.** Accept the consequence: a migrated board also loses any spacing the plugin would
not have written. Run the board linter first, so the reformatting is a decision rather than a
surprise.

**Observed.** A migration is not a card edit. Nothing in a plan rewrites card text, so a change of
date trigger or a bulk retag is a job for the card tool or a hand edit, not for this one.

## The plan format

A plan is a JSON object. Every field is optional.

| Field | Type | Meaning |
|---|---|---|
| `format` | `"board"`, `"table"`, `"list"` | Sets the `kanban-plugin` value in both the frontmatter and the settings block, which is where the plugin keeps the two copies — the settings copy at `kanban: src/parsers/parseMarkdown.ts:176` and the frontmatter copy on the next line, `kanban: src/parsers/parseMarkdown.ts:177` |
| `lanes` | array of steps | Lane operations, applied in array order |
| `order` | array of titles | Final lane order; lanes not named keep their relative order at the end |
| `settings` | object | Merged into the settings block |
| `unsetSettings` | array of keys | Removed from the settings block |
| `onMissingLane` | `"skip"` or `"error"` | What to do when a step names a lane the board does not have; `skip` is the default, and is what makes one plan safe to run across a vault of differently shaped boards |

A lane step is one of:

| Step | Effect |
|---|---|
| `{"from": "Doing", "to": "In Progress"}` | Rename. Refuses if a lane already carries the new title, unless `merge` is set |
| `{"from": "Review", "to": "In Progress", "merge": true}` | Move every card into the destination lane, in order, and delete the source lane |
| `{"from": "Icebox", "delete": true}` | Delete a lane. Refuses while it still holds cards unless `discardCards` is set, because deleting a lane deletes its cards with it |
| `{"to": "Blocked", "create": true, "after": "In Progress"}` | Create an empty lane, optionally positioned after a named one |
| `{"to": "In Progress", "maxItems": 3}` | Set or clear the work-in-progress limit, which lives in the lane title as a trailing `(N)` (`kanban: src/parsers/helpers/parser.ts:63`) |
| `{"to": "Done", "marksComplete": true}` | Set or clear the complete flag, which is the `**Complete**` line under the heading (`kanban: src/parsers/common.ts:23`) |

**Observed.** Setting `marksComplete` does not re-check or un-check the cards already in that lane.
Neither does the plugin: toggling the lane setting only flips the flag
(`kanban: src/components/Lane/LaneSettings.tsx:30`). A lane that becomes the done column keeps a
column of unchecked cards until something moves them.

**Recommendation.** When moving the done column, do it in two passes: first complete the cards that
should be complete, using the card tool, then move the flag. Doing it the other way round leaves a
done column that disagrees with itself, and "Archive completed cards" will then archive every card in
it regardless of its checkbox (`kanban: src/StateManager.ts:393`).

## Order of operations

The tool applies a plan in a fixed order, and a plan should be written expecting it:

1. `format`
2. each `lanes` step, in array order
3. `order`
4. `settings`, then `unsetSettings`
5. `list-collapse` is rebuilt

**Observed.** That last step is not cosmetic. `list-collapse` is a positional array of booleans, one
per lane in lane order, written into the settings block whenever a lane is added, inserted or
archived (`kanban: src/helpers/boardModifiers.ts:105`, `kanban: src/helpers/boardModifiers.ts:122`,
`kanban: src/helpers/boardModifiers.ts:148`) — and, on a different code path, whenever a lane is
*moved*: dragging a lane splices its entry to the new index and writes the array back with the board
(`kanban: src/DragDropApp.tsx:157`, `kanban: src/DragDropApp.tsx:158`,
`kanban: src/DragDropApp.tsx:164`). A migration that reorders lanes without rebuilding it leaves every
collapsed state attached to the wrong lane. The tool re-derives the array by lane title.

**Observed.** An open board defeats this. The view seeds its own copy of the view settings when it
registers (`kanban: src/KanbanView.tsx:272`) and writes that copy back on its next save. **Close the
board before migrating it.**

## Things a plan cannot do

- **Move cards into or out of the archive.** The archive is carried through unchanged. Archiving is a
  card operation, and un-archiving is not an operation the plugin has at all.
- **Rewrite card text**, including dates, times, tags and inline metadata.
- **Change the language of the structural markers.** A board written under one Obsidian language
  carries that language's `**Complete**` and `## Archive` (`kanban: src/lang/helpers.ts:53`); a
  migration reads and writes in the language it is told to use, so running it with the wrong
  `--locale` will not translate a board, it will fail to see its markers. Confirm the language first
  with the board linter.
- **Split one lane into several by card content.** That is a sequence of card moves.
- **Repair a board that does not parse.** The tool refuses those and names why.

## Recipes

**Rename a column across a whole vault.** `{"lanes": [{"from": "Doing", "to": "In Progress"}],
"onMissingLane": "skip"}` — run without `--write` first and read the diffs; boards that do not have
the lane are reported as unchanged.

**Adopt a work-in-progress policy.**
`{"lanes": [{"to": "In Progress", "maxItems": 3}, {"to": "Review", "maxItems": 2}]}`. Remember the
limit is advisory: nothing in the plugin blocks a lane from exceeding it, it only styles the counter
(`kanban: docs/How do I/Set a WIP Limit.md:10`).

**Consolidate two columns.** `{"lanes": [{"from": "Review", "to": "In Progress", "merge": true}],
"order": ["Backlog", "In Progress", "Done"]}`. Cards keep their order and land after the destination
lane's existing cards.

**Lift a legacy board.** `{"format": "board"}`. A board still carrying `kanban-plugin: basic` is
normalised on read anyway (`kanban: src/parsers/parseMarkdown.ts:175`), so the first time anyone opens
it in Obsidian the value changes under them; doing it deliberately keeps the diff out of a later,
unrelated change.

**Retire a column.** Complete or move its cards first, then
`{"lanes": [{"from": "Icebox", "delete": true}]}`.

## Procedure

1. Close every Obsidian window that has the boards open.
2. Run the board linter over the target boards and fix anything at `error` first. A migration of a
   board that already loses content on save will look like the migration caused the loss.
3. Write the plan. Run without `--write` and read every diff, not just the first.
4. Run with `--write`. The tool keeps a `.bak` beside each board it changes.
5. Run the linter again and compare the finding set. New findings mean the plan was wrong, not that
   the board was.
6. Open one board in Obsidian, confirm the lanes look right, and confirm the done column still marks
   cards complete.
7. Delete the backups only after step 6.

## Known gaps

- No Obsidian session was run: that a migrated board opens correctly is inferred from the pinned
  serialiser, not observed. **Unverified**.
- The tool cannot tell whether a board is open, so step 1 is a discipline rather than a guard.
- Plans are not validated against a schema beyond the field checks the tool performs; an unknown
  field is ignored rather than rejected.
- How reliably this procedure is followed by an agent in a clean context has not been evaluated.
