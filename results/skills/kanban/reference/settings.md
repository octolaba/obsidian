# Settings

This file owns every Kanban setting: its exact JSON key, its type, where it can be set, its effective
default, what it changes, and — the part that matters most when a board is edited by anything other
than the plugin — which keys change how a board **file** is written or parsed. The card line itself
belongs to the card anatomy reference and the file envelope to the board format reference; this file
only marks the keys that move them.

## Contents

- [Evidence boundary](#evidence-boundary)
- [Where a setting physically lives](#where-a-setting-physically-lives)
- [Resolution order](#resolution-order)
- [Compiled defaults](#compiled-defaults)
- [Every settings key](#every-settings-key)
- [Keys that change parsing](#keys-that-change-parsing)
- [Keys that change what is written](#keys-that-change-what-is-written)
- [Settings that are really UI state](#settings-that-are-really-ui-state)
- [Documentation drift](#documentation-drift)
- [Known gaps](#known-gaps)

## Evidence boundary

Citation alias `kanban` is the Kanban plugin pin: `obsidian-community/obsidian-kanban`, tag `2.0.51`,
commit `8501981a1afacb4c8fc03ec60604aa5eedfbd857`. Citation alias `tasks` is the Tasks plugin pin:
`obsidian-tasks-group/obsidian-tasks`, tag `8.3.0`, commit `e16dbc2cf509420459ea04094a1d834ae89e0019`.
Both paths are relative to their own repository root.

Read for this file: `src/Settings.ts` in full, `src/StateManager.ts` in full, `src/settingHelpers.ts`,
`src/components/helpers.ts`, `src/parsers/common.ts`, `src/parsers/parseMarkdown.ts`,
`src/parsers/formats/list.ts` (serialisation half), every consumer site of every non-compiled key
found by grepping `src/` for the quoted key, and the whole `docs/` vault.

Not read for this file: the drag-and-drop subsystem, the Markdown renderer, the editor suggesters
beyond the one line that registers them, and the LESS sources beyond the single lane-width custom
property. No runtime experiment was performed: every claim below is read from the pinned tree, and
nothing here has been executed in Obsidian. Agent-behaviour evaluation of this reference has not been
run and is not claimed.

## Where a setting physically lives

There are three physical homes, and only two of them survive a save.

**The board's own settings block.** `settingsToCodeblock` emits an HTML-comment-wrapped fenced JSON
object at the very end of the file — **Observed** `kanban: src/parsers/common.ts:29`. `boardToMd`
appends it after the lanes and the archive — **Observed** `kanban: src/parsers/formats/list.ts:450`.
The payload is `JSON.stringify(board.data.settings)`: one line, no whitespace, no key ordering
guarantee — **Observed** `kanban: src/parsers/common.ts:35`.

**Plugin `data.json`.** Global defaults are the plugin's own persisted data, read with `loadData()`
and written with `saveData()` — **Observed** `kanban: src/main.ts:63` and `kanban: src/main.ts:67`.
Those are Obsidian's per-plugin data helpers, so the file is
`<vault>/.obsidian/plugins/obsidian-kanban/data.json`: `.obsidian` is the vault's configuration
directory and `obsidian-kanban` is this plugin's manifest id — **Observed**
`kanban: manifest.json:2`. It is a flat JSON object keyed by the same `KanbanSettings` names the
board block uses — `getGlobalSetting` indexes it by `keyof KanbanSettings` —
**Observed** `kanban: src/StateManager.ts:294`, and it is the layer every board falls through to when
neither the compiled defaults nor the board's own block answer. Changing a global setting writes it
and then calls
`forceRefresh()` on every open board — **Observed** `kanban: src/main.ts:119`.
**Unverified** — the directory name is Obsidian's default and a vault may be opened with a different
configuration directory, in which case the `.obsidian` component changes with it.

**Bundled-tool boundary.** The linter and card tool never guess that configuration path. Pass the
actual file, relative to the declared vault, through `--kanban-data`; they validate that it is a JSON
object inside the vault, resolve local values over it, compile the derived trigger and format values,
and keep the inherited object separate from `board.settings` so a card write never copies global
defaults into the board's footer. When Daily Notes, Natural Language Dates or Templates supply the
vault-level date/time fallback, bind those separately with `--vault-date-format` and
`--vault-time-format`.

**YAML frontmatter — read, never written.** `parseMarkdown` walks the parsed frontmatter and routes
any key present in `settingKeyLookup` into `settings` rather than into the file frontmatter —
**Observed** `kanban: src/parsers/parseMarkdown.ts:178`. Everything else stays frontmatter —
**Observed** `kanban: src/parsers/parseMarkdown.ts:181`. `boardToMd` then regenerates the frontmatter
block from `board.data.frontmatter` alone with `stringifyYaml` —
**Observed** `kanban: src/parsers/formats/list.ts:448`. The consequence is a silent one-way migration:
a settings key hand-written into a board's YAML takes effect on the next load and then vanishes from
the YAML on the next save, reappearing inside the JSON block.

`kanban-plugin` is the single exception. It is written into both `settings` and the file frontmatter —
**Observed** `kanban: src/parsers/parseMarkdown.ts:176` and
`kanban: src/parsers/parseMarkdown.ts:177` — so it stays in the YAML. The same branch normalises the
legacy value `basic` to `board` — **Observed** `kanban: src/parsers/parseMarkdown.ts:175`.

Board-local edits go through a modal whose updates are debounced by one second before
`onSettingsChange` fires — **Observed** `kanban: src/Settings.ts:177`. That handler replaces
`board.data.settings` and calls `stateManager.setState(updatedBoard)`, which saves the file —
**Observed** `kanban: src/KanbanView.tsx:309`.

**Contract** (documented): settings exist globally and per board, and the per-board set overrides the
global set — `kanban: docs/Settings/Local vs. global settings.md:2` and
`kanban: docs/Settings/Local vs. global settings.md:6`. The documentation names no storage location
and no JSON key; see [Documentation drift](#documentation-drift).

## Resolution order

`getSetting(key, suppliedLocalSettings?)` resolves in exactly three steps —
**Observed** `kanban: src/StateManager.ts:264`:

1. `suppliedLocalSettings[key]`, if it is not `undefined` — `kanban: src/StateManager.ts:268`;
2. `compiledSettings[key]`, if it is not `undefined` — `kanban: src/StateManager.ts:272`;
3. otherwise `getSettingRaw(key)` — `kanban: src/StateManager.ts:276`.

`getSettingRaw` is itself three steps — **Observed** `kanban: src/StateManager.ts:279`: supplied
local, then `state.data.settings` (the board's own JSON block), then `getGlobalSetting` —
`kanban: src/StateManager.ts:283`, `kanban: src/StateManager.ts:287`,
`kanban: src/StateManager.ts:291`. `getGlobalSetting` returns `null`, not `undefined`, when the global
object has no such key — **Observed** `kanban: src/StateManager.ts:301`.

Two consequences follow from the `!== undefined` test, and both are easy to get wrong:

- `null`, `false`, `0` and `""` all count as *set*. Only a literally absent key falls through. So a
  board that stores `"lane-width": 0` shadows the global value with zero rather than inheriting it.
- For every key that `compileSettings` writes, step 2 always hits. Several compiled entries are raw
  pass-throughs that can hold `null` — for example `link-date-to-daily-note` —
  **Observed** `kanban: src/StateManager.ts:243`. **Inference:** step 3 of `getSetting` is therefore
  unreachable for compiled keys; the board-and-global lookup for those keys happens once, inside
  `compileSettings`, not on each read. The observable behaviour is unchanged because
  `compileSettings` performs the same lookup, but a reader tracing a value must look there, not at
  `getSetting`.

`compileSettings` runs from three places: at parse time with the freshly parsed board settings —
**Observed** `kanban: src/parsers/parseMarkdown.ts:185`; on every `setState` —
**Observed** `kanban: src/StateManager.ts:156`; and on `forceRefresh` —
**Observed** `kanban: src/StateManager.ts:123`.

One compiled entry is inconsistent with its neighbours: `archive-date-separator` calls
`getSettingRaw` **without** forwarding `suppliedSettings`, while every other line in the same object
forwards it — **Observed** `kanban: src/StateManager.ts:248`. **Inference:** this is an omitted
argument rather than a design choice, and its blast radius is narrow — during the parse-time
`compileSettings(settings)` call the not-yet-committed board settings are ignored for that one key,
and the steady-state value is correct because the next `setState` recompiles with no supplied
settings at all. Classified as a probable implementation defect, not as documentation drift.

## Compiled defaults

`compileSettings` builds `compiledSettings` — **Observed** `kanban: src/StateManager.ts:217`. Only
the keys in the table below get a compiled value; every other key has no default at this layer and
falls through to whatever its consumer does.

| JSON key | Compiled default | Derivation |
|---|---|---|
| `kanban-plugin` | `'board'` | `\|\|` fallback — `kanban: src/StateManager.ts:234` |
| `date-format` | `getDefaultDateFormat(app)` | chained, see below — `kanban: src/StateManager.ts:223` |
| `date-display-format` | the resolved `date-format` | **derived** — `kanban: src/StateManager.ts:225` |
| `date-time-display-format` | `dateDisplayFormat + ' ' + timeFormat` | **derived, always overwritten** — `kanban: src/StateManager.ts:237` |
| `time-format` | `getDefaultTimeFormat(app)` | chained, see below — `kanban: src/StateManager.ts:228` |
| `archive-date-format` | `` `${dateFormat} ${timeFormat}` `` | **derived** date-plus-time — `kanban: src/StateManager.ts:231` |
| `archive-date-separator` | `''` | `kanban: src/StateManager.ts:248` |
| `date-trigger` | `'@'` | `kanban: src/StateManager.ts:238`, constant at `kanban: src/settingHelpers.ts:9` |
| `time-trigger` | `'@@'` | `kanban: src/StateManager.ts:242`, constant at `kanban: src/settingHelpers.ts:10` |
| `inline-metadata-position` | `'body'` | `kanban: src/StateManager.ts:240`, constant at `kanban: src/settingHelpers.ts:11` |
| `metadata-keys` | union of global and local, deduplicated | `kanban: src/StateManager.ts:218` |
| `link-date-to-daily-note` | none (raw pass-through) | `kanban: src/StateManager.ts:243` |
| `move-dates` | none (raw pass-through) | `kanban: src/StateManager.ts:244` |
| `move-tags` | none (raw pass-through) | `kanban: src/StateManager.ts:245` |
| `move-task-metadata` | none (raw pass-through) | `kanban: src/StateManager.ts:246` |
| `show-add-list` | `true` | `??` — `kanban: src/StateManager.ts:250` |
| `show-archive-all` | `true` | `??` — `kanban: src/StateManager.ts:251` |
| `show-view-as-markdown` | `true` | `??` — `kanban: src/StateManager.ts:253` |
| `show-board-settings` | `true` | `??` — `kanban: src/StateManager.ts:254` |
| `show-search` | `true` | `??` — `kanban: src/StateManager.ts:255` |
| `show-set-view` | `true` | `??` — `kanban: src/StateManager.ts:256` |
| `tag-colors` | `[]` | `??` — `kanban: src/StateManager.ts:257` |
| `tag-sort` | `[]` | `??` — `kanban: src/StateManager.ts:258` |
| `date-colors` | `[]` | `??` — `kanban: src/StateManager.ts:259` |
| `tag-action` | `'obsidian'` | `??` — `kanban: src/StateManager.ts:260` |

The `||` versus `??` split is load-bearing. Format and trigger keys use `||`, so an empty string in
the board JSON is discarded in favour of the derived default. The `show-*`, colour and sort keys use
`??`, so a stored `false` is honoured while the `null` that `getGlobalSetting` returns for an absent
global correctly falls through to `true` or `[]`.

`date-format` chains through four sources, in order — **Observed**
`kanban: src/components/helpers.ts:178`: the daily-notes core plugin's `format` when that plugin is
enabled (`kanban: src/components/helpers.ts:179`), then the Natural Language Dates plugin's `format`
(`kanban: src/components/helpers.ts:180`), then the Templates core plugin's `dateFormat` when
enabled (`kanban: src/components/helpers.ts:181`), then the literal `'YYYY-MM-DD'`
(`kanban: src/components/helpers.ts:182`). `time-format` chains through the same Natural Language
Dates and Templates sources before `'HH:mm'` — **Observed** `kanban: src/components/helpers.ts:192`.
The practical consequence: **the default date format of a board is a property of the vault, not of
the plugin**, and two vaults can serialise the same card differently.

`date-time-display-format` deserves its own note. It is a real key — it is in `KanbanSettings`
(`kanban: src/Settings.ts:62`) and in `settingKeyLookup` (`kanban: src/Settings.ts:110`), so a value
written into a board's JSON is preserved across saves — but `compileSettings` never reads it back and
unconditionally overwrites it (`kanban: src/StateManager.ts:237`), and no UI writes it. **Inference:**
setting it by hand has no effect on rendering; its only consumer reads the compiled value —
**Observed** `kanban: src/components/Item/MetadataTable.tsx:96`.

## Every settings key

All forty keys, exactly as they appear in `KanbanSettings` (`kanban: src/Settings.ts:52`) and in
`settingKeyLookup` (`kanban: src/Settings.ts:100`). The two lists agree key for key at this pin.
"View" marks the two keys that are also in `KanbanViewSettings` (`kanban: src/Settings.ts:95`) and so
additionally live in per-leaf workspace state. "File" marks keys that change how a board file is
written or parsed; those are expanded in the two sections that follow. Every key is optional, and
every key can be set globally, per board, or (subject to the migration above) in the board's YAML.

| JSON key | Type | View | File | Effective default | What it changes |
|---|---|:--:|:--:|---|---|
| `kanban-plugin` | `'basic' \| 'board' \| 'table' \| 'list'` | ✔ | ✔ | `'board'` | which renderer the board uses; `'basic'` is read as `'board'` — `kanban: src/Settings.ts:50` |
| `append-archive-date` | `boolean` | | ✔ | `false` | puts the archive timestamp after the card title instead of before — `kanban: src/StateManager.ts:381` |
| `archive-date-format` | `string` | | ✔ | `` `${date-format} ${time-format}` `` | moment format of the archive timestamp — `kanban: src/StateManager.ts:375` |
| `archive-date-separator` | `string` | | ✔ | `''` | text inserted between timestamp and title; omitted entirely when empty — `kanban: src/StateManager.ts:377` |
| `archive-with-date` | `boolean` | | ✔ | `false` | whether archiving prefixes a timestamp at all — `kanban: src/StateManager.ts:369` |
| `date-colors` | `DateColor[]` | | | `[]` | per-date-range colouring of the rendered date — `kanban: src/Settings.ts:923` |
| `date-display-format` | `string` | | | falls back to `date-format` | moment format used when *displaying* a date — `kanban: src/Settings.ts:788` |
| `date-format` | `string` | | ✔ | vault-derived, else `YYYY-MM-DD` | moment format used when *writing* a date into the card — `kanban: src/components/Item/helpers.ts:111` |
| `date-picker-week-start` | `number` | | | unset | first day of week in the date picker; see the `0` caveat below — `kanban: src/Settings.ts:1142` |
| `date-time-display-format` | `string` | | | derived, inert | see the note above — `kanban: src/StateManager.ts:237` |
| `date-trigger` | `string` | | ✔ | `'@'` | the characters that open the date picker **and** the date token in the file — `kanban: src/parsers/parseMarkdown.ts:68` |
| `full-list-lane-width` | `boolean` | | | `false` | in `list` view only, stretches a lane to 100% width — `kanban: src/components/Lane/Lane.tsx:51` |
| `hide-card-count` | `boolean` | | | `false` | hides the per-lane card counter — `kanban: src/components/Lane/LaneTitle.tsx:31` |
| `inline-metadata-position` | `'body' \| 'footer' \| 'metadata-table'` | | | `'body'` | where Dataview inline fields render; anything but `body` strips them from the card title in memory — `kanban: src/parsers/formats/list.ts:208` |
| `lane-width` | `number` (px) | | | `272` | lane width; the CSS custom property carries the same number — `kanban: src/Settings.ts:342`, `kanban: src/styles.less:15` |
| `link-date-to-daily-note` | `boolean` | | ✔ | unset (falsy) | writes dates as daily-note links instead of `{...}` — `kanban: src/components/Item/helpers.ts:112` |
| `list-collapse` | `boolean[]` | ✔ | ✔ | `[]` | persisted per-lane collapsed state, positional — `kanban: src/components/Lane/Lane.tsx:75` |
| `max-archive-size` | `number` | | ✔ | `-1` (unlimited) | trims the archive to the last N entries on render — `kanban: src/components/Kanban.tsx:149` |
| `metadata-keys` | `DataKey[]` | | | `[]` | which linked-page metadata keys a card shows; empty disables the whole lookup — `kanban: src/parsers/common.ts:108` |
| `move-dates` | `boolean` | | | unset (falsy) | moves the date **and the time** out of the card body into the footer, deleting them from the rendered title — `kanban: src/parsers/formats/list.ts:148`, `kanban: src/parsers/formats/list.ts:159` |
| `move-tags` | `boolean` | | | unset (falsy) | same, for tags — `kanban: src/parsers/formats/list.ts:136` |
| `move-task-metadata` | `boolean` | | | unset (falsy) | same, for Tasks emoji fields — `kanban: src/parsers/formats/list.ts:207` |
| `new-card-insertion-method` | `'prepend' \| 'prepend-compact' \| 'append'` | | ✔ | `'append'` | whether a new card goes to the top or bottom of a lane — `kanban: src/DragDropApp.tsx:198` |
| `new-line-trigger` | `'enter' \| 'shift-enter'` | | | `'shift-enter'` | which key inserts a newline rather than committing the card — `kanban: src/components/Editor/MarkdownEditor.tsx:32` |
| `new-note-folder` | `string` (vault path) | | | vault default | destination folder for "New note from card" — `kanban: src/components/Item/ItemMenu.ts:68` |
| `new-note-template` | `string` (vault path) | | | none | template applied to that new note — `kanban: src/components/Item/ItemMenu.ts:69` |
| `show-add-list` | `boolean` | | | `true` | header button — `kanban: src/StateManager.ts:250` |
| `show-archive-all` | `boolean` | | | `true` | header button — `kanban: src/StateManager.ts:251` |
| `show-board-settings` | `boolean` | | | `true` | header button — `kanban: src/StateManager.ts:254` |
| `show-checkboxes` | `boolean` | | | `false` | renders a checkbox on each card — `kanban: src/components/Item/ItemCheckbox.tsx:27` |
| `show-relative-date` | `boolean` | | | `false` | renders "in 3 days" beside the date — `kanban: src/components/Item/DateAndTime.tsx:40` |
| `show-search` | `boolean` | | | `true` | header button — `kanban: src/StateManager.ts:255` |
| `show-set-view` | `boolean` | | | `true` | header button — `kanban: src/StateManager.ts:256` |
| `show-view-as-markdown` | `boolean` | | | `true` | header button — `kanban: src/StateManager.ts:253` |
| `table-sizing` | `Record<string, number>` | | ✔ | `{}` | persisted table column widths, keyed by column id — `kanban: src/components/Table/helpers.tsx:160` |
| `tag-action` | `'kanban' \| 'obsidian'` | | | `'obsidian'` | whether clicking a tag searches the board or the vault — `kanban: src/components/Item/ItemContent.tsx:153` |
| `tag-colors` | `TagColor[]` | | | `[]` | per-tag colouring — `kanban: src/Settings.ts:567` |
| `tag-sort` | `TagSort[]` | | | `[]` | explicit tag display order — `kanban: src/Settings.ts:541` |
| `time-format` | `string` | | ✔ | vault-derived, else `HH:mm` | moment format of the values offered by the time picker — `kanban: src/components/Item/helpers.ts:129` |
| `time-trigger` | `string` | | ✔ | `'@@'` | the characters that open the time picker **and** the time token in the file — `kanban: src/parsers/parseMarkdown.ts:70` |

Four keys have no settings UI at all and can only be produced by the plugin itself or written by
hand: `kanban-plugin`, `date-time-display-format`, `list-collapse` and `table-sizing`.

`date-picker-week-start` carries a quirk worth naming. The dropdown offers Sunday as the string
`'0'` — **Observed** `kanban: src/Settings.ts:1134` — and stores it as the number `0` —
**Observed** `kanban: src/Settings.ts:1149`. The consumer guards with a plain truthiness test —
**Observed** `kanban: src/components/Editor/datePickerLocale.ts:39`. **Inference:** choosing Sunday
explicitly is therefore indistinguishable from choosing "default", and the locale's own first day
wins. Classified as a probable implementation defect; not reproduced at runtime.

## Keys that change parsing

Five keys must be known **before** a single card can be read, because they are compiled into the
micromark extension set that parses the file.

`date-trigger` and `time-trigger` are the grammar. `getExtensions` builds three wrapped-token
extensions from them — **Observed** `kanban: src/parsers/parseMarkdown.ts:68`,
`kanban: src/parsers/parseMarkdown.ts:69`, `kanban: src/parsers/parseMarkdown.ts:70`: `@{`…`}` for a
plain date, `@[[`…`]]` for a linked date, and `@@{`…`}` for a time. Anything reading a board
independently must resolve these two settings first, through the full order in
[Resolution order](#resolution-order), or it will silently misread every dated card. Both link and
brace forms are always registered, so reading is tolerant of a board written under the other
`link-date-to-daily-note` setting even though writing is not.

**Contract** (documented): the date trigger is `@` by default —
`kanban: docs/Settings/Date trigger.md:2` — and the time trigger is `@@` —
`kanban: docs/Settings/Time trigger.md:2`. The documentation states these as user-facing characters
and never as a JSON key.

`metadata-keys`, `move-dates`, `move-tags`, `move-task-metadata` and `inline-metadata-position` do
not change the grammar but do change what the parser leaves in a card's title. Dates are excised from
the rendered title when `move-dates` is set — **Observed**
`kanban: src/parsers/formats/list.ts:148` — and so are **times**, because the time branch tests the
same setting and there is no `move-times` key — **Observed**
`kanban: src/parsers/formats/list.ts:159`. Inline fields are excised when `move-task-metadata` (for
Tasks emoji fields) or a non-`body` `inline-metadata-position` (for Dataview fields) is set —
**Observed** `kanban: src/parsers/formats/list.ts:207` and
`kanban: src/parsers/formats/list.ts:208`, with the removal loop at
`kanban: src/parsers/formats/list.ts:212`. This affects the in-memory title only; the raw title that
gets written back is untouched.

**Changing any of thirteen keys forces a full reparse of the board.** `shouldRefreshBoard` compares
old and new settings across a fixed list — **Observed** `kanban: src/parsers/common.ts:239` — and
`setState` responds by recompiling and calling `parser.reparseBoard()` instead of taking the new
state as-is — **Observed** `kanban: src/StateManager.ts:144` and `kanban: src/StateManager.ts:153`.
The list is `metadata-keys`, `date-trigger`, `time-trigger`, `link-date-to-daily-note`, `date-format`,
`time-format`, `move-dates`, `move-tags`, `inline-metadata-position`, `move-task-metadata`,
`hide-card-count`, `tag-colors`, `date-colors` — `kanban: src/parsers/common.ts:244` through
`kanban: src/parsers/common.ts:257`. The comparison is `===` per key —
**Observed** `kanban: src/parsers/common.ts:261` — so the four array-valued members of that list
(`metadata-keys`, `tag-colors`, `date-colors`, and `tag-sort`'s absence from the list) compare by
reference. **Inference:** any settings update that rebuilds those arrays triggers a reparse whether
or not the contents changed, and `tag-sort` — which is not in the list at all — never triggers one.

## Keys that change what is written

These keys change bytes on disk, so they matter to anything that reads or diffs a board file.

| Key | Effect on the file |
|---|---|
| `date-trigger`, `time-trigger` | the literal token that wraps a date or time in a card — `kanban: src/components/Item/helpers.ts:121`, `kanban: src/components/Item/helpers.ts:269` |
| `date-format`, `time-format` | the moment format of the value inside that token — `kanban: src/components/Item/helpers.ts:111`, `kanban: src/components/Item/helpers.ts:129` |
| `link-date-to-daily-note` | whether the value is `{2021-04-26}` or a daily-note link — `kanban: src/components/Item/helpers.ts:112` |
| `archive-with-date`, `archive-date-format`, `archive-date-separator`, `append-archive-date` | whether and how a timestamp is spliced into an archived card's title — `kanban: src/StateManager.ts:374` |
| `max-archive-size` | deletes archive entries beyond the last N, on render, with a save — `kanban: src/components/Kanban.tsx:153` |
| `new-card-insertion-method` | which end of a lane a new card is written to — `kanban: src/DragDropApp.tsx:198` |
| `kanban-plugin` | written to both the JSON block and the YAML frontmatter — `kanban: src/KanbanView.tsx:118` |
| `list-collapse`, `table-sizing` | written into the JSON block as a side effect of UI interaction — see below |

**Contract** (documented): the archive timestamp is placed at the start of the card by default —
`kanban: docs/Settings/Add date and time to archived cards.md:1` — and the position toggle appends it
after the title instead — `kanban: docs/Settings/Archive date time position.md:2`. **Contract**: the
archive grows without limit until a maximum is set, after which old cards are deleted as new ones
arrive — `kanban: docs/Settings/Maximum number of archived cards.md:2` and
`kanban: docs/Settings/Maximum number of archived cards.md:4`. **Contract**: new cards are appended
by default — `kanban: docs/Settings/Prepend append new cards.md:2`. All three agree with the
implementation.

## Settings that are really UI state

Two keys in `settingKeyLookup` are not preferences at all. They are view state that the plugin
persists into the board file, which means ordinary interaction dirties the file.

`list-collapse` is a `boolean[]` **indexed by lane position**. Collapsing a lane writes the whole
array — **Observed** `kanban: src/components/Lane/Lane.tsx:75` and
`kanban: src/components/Lane/Lane.tsx:77` — and adding or inserting a lane pushes or splices a
`false` into it at the matching index — **Observed** `kanban: src/helpers/boardModifiers.ts:99`,
`kanban: src/helpers/boardModifiers.ts:105` and
`kanban: src/helpers/boardModifiers.ts:115`. The hazard is direct: **any external edit that reorders,
inserts or deletes a lane without updating this array silently reassigns collapsed state to the wrong
lanes.** There is no lane identifier in the array and no length check on read. It is also the only
key in both `KanbanSettings` and `KanbanViewSettings` besides `kanban-plugin`
(`kanban: src/Settings.ts:97`), so it exists simultaneously in the file and in per-leaf workspace
state, seeded from the file on view registration — **Observed** `kanban: src/KanbanView.tsx:272`.

`table-sizing` is a map of column id to pixel width, written 500 ms after the user stops dragging a
table column divider — **Observed** `kanban: src/components/Table/Table.tsx:121` and
`kanban: src/components/Table/Table.tsx:127` — and read back through the ordinary settings path —
**Observed** `kanban: src/components/Table/helpers.tsx:160`. It is keyed, so it is safe against
reordering.

**Recommendation:** a tool that rewrites a board file should preserve both keys verbatim when it does
not change lane order; when it does, it should either drop `list-collapse` entirely — an absent key
resolves to the global value or `[]` and costs the user only the collapsed state — or remap it by
each lane's tracked original position, which is what the bundled migration tool does. A stale array
mislabels lanes.

## Documentation drift

The plugin's `docs/` vault predates this pin and **names no JSON settings key anywhere**. Grepping
the whole vault for every key in `settingKeyLookup`, and for `kanban:settings`, matches exactly one
file, and it is not documentation prose — **Observed**, reproduce from the Kanban repository root
with the whole key set alternated:

```sh
grep -rlE 'kanban-plugin|append-archive-date|archive-date-format|archive-date-separator|archive-with-date|date-colors|date-display-format|date-format|date-picker-week-start|date-time-display-format|date-trigger|full-list-lane-width|hide-card-count|inline-metadata-position|lane-width|link-date-to-daily-note|list-collapse|max-archive-size|metadata-keys|move-dates|move-tags|move-task-metadata|new-card-insertion-method|new-line-trigger|new-note-folder|new-note-template|show-add-list|show-archive-all|show-board-settings|show-checkboxes|show-relative-date|show-search|show-set-view|show-view-as-markdown|table-sizing|tag-action|tag-colors|tag-sort|time-format|time-trigger|kanban:settings' docs/
# docs/.obsidian/themes/California Coast.css
```

`kanban-plugin` is the only one of the forty that hits at all — 93 times in that one CSS file, every
occurrence a `.kanban-plugin__…` class-name prefix. The other thirty-nine keys and the
`kanban:settings` marker occur nowhere in the vault: narrower probes such as
`grep -rn 'date-trigger\|max-archive-size\|kanban:settings' docs/` print nothing and exit `1`.
Treat `docs/` as evidence for user-facing names, defaults and intent only; take every key, type and
storage claim in this file from source.

Where the two disagree, this file follows the implementation and says so.

Two documentation defects are worth naming as drift rather than as plugin bugs, because the
implementation is correct in both cases:

- `kanban: docs/Settings/Note folder.md:2` states that the `Note template` setting determines the
  folder in which new notes are created. It does not: `new-note-folder` selects the folder and
  `new-note-template` selects the template, read on adjacent lines —
  **Observed** `kanban: src/components/Item/ItemMenu.ts:68` and
  `kanban: src/components/Item/ItemMenu.ts:69`. The sibling page gets it right —
  **Contract** `kanban: docs/How do I/Create notes from cards.md:6`.
- `kanban: docs/Settings/Add date and time to archived cards.md:1` links to
  `[[Add archive date/time after card title]]`. No such note exists in the vault; the page that
  documents that toggle is `kanban: docs/Settings/Archive date time position.md:2`. The link also
  embeds a `/`, which Obsidian reads as a path separator. The other three wikilinks on the same line
  resolve.

A third, broader drift is worth flagging without calling it a defect: four documentation pages —
`kanban: docs/Settings/Hide card display dates.md:2`,
`kanban: docs/Settings/Hide dates in card titles.md:2`,
`kanban: docs/Settings/Hide card display tags.md:2` and
`kanban: docs/Settings/Hide tags in card titles.md:2` — describe four independent hide toggles that
do not exist at this pin. The nearest surviving equivalents are the single `move-dates` and
`move-tags` keys. Do not use those pages to reason about current behaviour.

One in-app description carries information the docs do not: relative dates are not shown for dates
originating from the Tasks and Dataview plugins — **Observed**, the setting's own description string
at `kanban: src/Settings.ts:842`. The corresponding page,
`kanban: docs/Settings/Show relative date.md:2`, does not mention the exclusion.

## Known gaps

- **Not executed.** Nothing here was run in Obsidian. The three claims labelled **Inference** in
  [Resolution order](#resolution-order), the `date-picker-week-start` Sunday quirk, and the
  reference-comparison consequence of `shouldRefreshBoard` are traced through source but not
  reproduced. Each would need a fixture vault and a manual pass to promote to **Observed** behaviour
  at runtime.
- **Consumer defaults are per-site, not central.** For the fifteen keys `compileSettings` does not
  touch, the "effective default" column is the behaviour of the single consumer found by grep. If a
  second consumer exists on a code path not searched — for example a mobile-only menu — its default
  could differ. The grep covered `src/` for the quoted key string only.
- **`DataKey`, `TagColor`, `TagSort` and `DateColor` shapes are not documented here.** They are
  structured records defined in `kanban: src/components/types.ts`, and a full field-by-field account
  of each belongs to whatever artifact covers card rendering.
- **No migration history.** How keys were named in earlier releases, and whether old boards carry
  keys no longer in `settingKeyLookup`, was not investigated. A key absent from the lookup set stays
  in the YAML frontmatter rather than migrating — **Observed** `kanban: src/parsers/parseMarkdown.ts:181` —
  so obsolete keys are inert but visible.
- **Agent-behaviour evaluation has not been run** for this reference or the skill that contains it,
  and no claim about how reliably it triggers or routes is made.
