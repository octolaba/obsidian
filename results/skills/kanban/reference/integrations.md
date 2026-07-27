# Integrations

This file owns how Kanban behaves next to other software — the Tasks plugin, Dataview, daily notes,
the template plugins, Obsidian's own file layer, and Kanban's own alternate views — and what each of
those relationships means for anyone editing a board by hand or from a script. The card line itself
belongs to the card anatomy reference and the file envelope to the board format reference; every
settings key named here is defined in the settings reference. This file owns only what crosses the
plugin boundary.

## Contents

- [Evidence boundary](#evidence-boundary)
- [Tasks plugin](#tasks-plugin)
- [Dataview](#dataview)
- [Daily notes](#daily-notes)
- [Templates and Templater](#templates-and-templater)
- [Obsidian itself](#obsidian-itself)
- [Other Kanban views](#other-kanban-views)
- [Known gaps](#known-gaps)

## Evidence boundary

Citation alias `kanban` is the Kanban plugin pin: `obsidian-community/obsidian-kanban`, tag `2.0.51`,
commit `8501981a1afacb4c8fc03ec60604aa5eedfbd857`. Citation alias `tasks` is the Tasks plugin pin:
`obsidian-tasks-group/obsidian-tasks`, tag `8.3.0`, commit `e16dbc2cf509420459ea04094a1d834ae89e0019`.
Both paths are relative to their own repository root.

Read for this file: on the Kanban side, `src/parsers/helpers/inlineMetadata.ts` in full,
`src/parsers/common.ts`, `src/parsers/parseMarkdown.ts`, `src/components/helpers.ts`,
`src/helpers.ts`, `src/KanbanView.tsx`, `src/StateManager.ts`, `src/main.ts`, and every call site of
`toggleTask`, `toggleTaskString`, `maybeCompleteForMove`, `getDataviewPlugin` and `applyTemplate`
found by grepping `src/`. On the Tasks side, only the toggle path was read:
`src/Api/index.ts`, `src/Commands/ToggleDone.ts`, the relevant parts of `src/Task/Task.ts`,
`src/Statuses/Status.ts`, `src/TaskSerializer/DefaultTaskSerializer.ts`,
`src/Task/TaskRegularExpressions.ts` and `src/Config/Settings.ts`.

**Dataview is not pinned in this repository.** Every claim about Dataview below is read from Kanban's
side of the call — what Kanban asks for and what it does with the answer. Dataview's own contracts
are **Unverified** here.

Not read: the Tasks query engine, the Tasks settings UI, Kanban's renderer beyond the two inline
metadata components, and the drag-and-drop geometry. No runtime experiment was performed. Nothing
here has been executed in Obsidian, and no agent-behaviour evaluation of this reference has been run
or is claimed.

## Tasks plugin

This is the deepest integration and the only one that changes card text through another plugin's
code. The single most important fact: **Kanban never writes a completion date itself.** It hands a
line to the Tasks API and stores whatever comes back.

### Detection, and what happens without Tasks

There are two independent detection paths, and they do not agree with each other.

`getTasksPlugin()` is the ordinary one: it requires `obsidian-tasks-plugin` to be in
`app.plugins.enabledPlugins` — **Observed** `kanban: src/parsers/helpers/inlineMetadata.ts:172` —
and then returns the plugin instance from `app.plugins.plugins` —
**Observed** `kanban: src/parsers/helpers/inlineMetadata.ts:176`.

`getTasksPluginSettings()` never touches `plugins.plugins`. It scans the editor-suggest registry for
the first suggester carrying a `settings.taskFormat` property and returns that suggester's `settings`
object — **Observed** `kanban: src/parsers/helpers/inlineMetadata.ts:180` and
`kanban: src/parsers/helpers/inlineMetadata.ts:181`. **Inference:** this reaches Tasks' live settings
without any public API and without checking the plugin id, so it breaks silently if Tasks stops
registering an editor suggest or renames `taskFormat`, and it would bind to any other plugin whose
suggester happens to expose a `taskFormat` setting. Classified as deliberate design that surprises —
there is no supported way to read another plugin's settings — not as a defect.

The status characters resolve through the second path:

| Function | With Tasks settings reachable | Without |
|---|---|---|
| `getTaskStatusDone()` | first `coreStatuses` entry of type `DONE`, else first such `customStatuses` entry, else `'x'` — `kanban: src/parsers/helpers/inlineMetadata.ts:190`, `kanban: src/parsers/helpers/inlineMetadata.ts:191` | `'x'` — `kanban: src/parsers/helpers/inlineMetadata.ts:188` |
| `getTaskStatusPreDone()` | first status whose `nextStatusSymbol` equals the done symbol — `kanban: src/parsers/helpers/inlineMetadata.ts:204` | `' '` — `kanban: src/parsers/helpers/inlineMetadata.ts:200` |
| `toggleTask(item, file)` | calls the Tasks API, returns `[lines, checkChars, which]` — `kanban: src/parsers/helpers/inlineMetadata.ts:247` | `null` — `kanban: src/parsers/helpers/inlineMetadata.ts:220` |

Both fallbacks coincide with the Tasks defaults, which is why the two plugins agree out of the box:
Tasks' core DONE status is symbol `x` — **Observed** `tasks: src/Statuses/Status.ts:23` — and its core
TODO status is symbol `' '` with next symbol `x` — **Observed** `tasks: src/Statuses/Status.ts:40`.
**Inference:** a vault whose Tasks configuration redefines the DONE symbol, but where the registry
scan fails for any reason, would have Kanban write `x` while Tasks expects something else, and the
disagreement would be silent.

When `toggleTask` returns `null`, every caller falls back to flipping `checked` and setting
`checkChar` to `getTaskStatusDone()` or `' '` directly — **Observed**
`kanban: src/components/helpers.ts:89`. No date is written in that branch.

### What the Tasks API actually does

Kanban builds `- [<checkChar>] ` plus **the first line of the card only** —
**Observed** `kanban: src/parsers/helpers/inlineMetadata.ts:223` and
`kanban: src/parsers/helpers/inlineMetadata.ts:224` — and passes it with the board's path —
**Observed** `kanban: src/parsers/helpers/inlineMetadata.ts:230`.

On the Tasks side, `executeToggleTaskDoneCommand` is a one-line wrapper over `toggleLine` —
**Observed** `tasks: src/Api/index.ts:23`. `toggleLine` parses the string into a `Task` —
**Observed** `tasks: src/Commands/ToggleDone.ts:12`. When it parses as a task, the result is
`task.toggleWithRecurrenceInUsersOrder()` serialised and joined by newlines —
**Observed** `tasks: src/Commands/ToggleDone.ts:20` and `tasks: src/Commands/ToggleDone.ts:22`. When
it does not — a plain checklist item, or a task lacking the configured global filter — Tasks only
swaps the status symbol through the status registry's `nextStatusSymbol` and **adds no done date** —
**Observed** `tasks: src/Commands/ToggleDone.ts:36`, `tasks: src/Commands/ToggleDone.ts:37`, with the
reason stated in the comment at `tasks: src/Commands/ToggleDone.ts:28`.

The done date is set in `handleNewStatus` — **Observed** `tasks: src/Task/Task.ts:380` — gated on the
`setDoneDate` setting — **Observed** `tasks: src/Task/Task.ts:386` and `tasks: src/Task/Task.ts:387` —
which defaults to `true` — **Observed** `tasks: src/Config/Settings.ts:119`. Serialisation writes the
symbol `✅` — **Observed** `tasks: src/TaskSerializer/DefaultTaskSerializer.ts:98` — followed by the
date in `YYYY-MM-DD` — **Observed** `tasks: src/TaskSerializer/DefaultTaskSerializer.ts:129` and
`tasks: src/Task/TaskRegularExpressions.ts:2`. That format is fixed by Tasks and is **not** Kanban's
`date-format`.

Tasks has two serialisation formats, not one: `tasksPluginEmoji` and `dataview` — **Observed**
`tasks: src/Config/Settings.ts:45` and `tasks: src/Config/Settings.ts:51`. The Dataview serializer
wraps non-description fields with two leading spaces and square brackets — **Observed**
`tasks: src/TaskSerializer/DataviewTaskSerializer.ts:118` and
`tasks: src/TaskSerializer/DataviewTaskSerializer.ts:121` — so the same done date becomes
`  [completion:: YYYY-MM-DD]`, from the symbol at
`tasks: src/TaskSerializer/DataviewTaskSerializer.ts:76`. Both parsers consume metadata from the end
of the line: the emoji field regex appends `$` (`tasks: src/TaskSerializer/DefaultTaskSerializer.ts:74`)
and the Dataview wrapper does the same (`tasks: src/TaskSerializer/DataviewTaskSerializer.ts:50`). A
literal `✅ 2026-08-03` followed by prose is therefore description, not a done-date field. The
boundary is a trailing *chain*, not necessarily the final raw field: Tasks repeatedly removes one
recognised suffix and starts again (`tasks: src/TaskSerializer/DefaultTaskSerializer.ts:306`,
`tasks: src/TaskSerializer/DefaultTaskSerializer.ts:373`), so a done date before a trailing due date
is still metadata. The bundled tool peels the same chain before replacing or removing that date.

`setDoneDate: false` prevents a date only on the transition into DONE: `newDate` assigns today only
inside the enabled branch — **Observed** `tasks: src/Task/Task.ts:438` and
`tasks: src/Task/Task.ts:441`. Moving out of DONE returns `null` regardless of that setting and the
serializer removes the previous field — **Observed** `tasks: src/Task/Task.ts:449`. An emulator that
uses the setting to preserve a date on uncomplete disagrees with Tasks.

Uncomplete also does not necessarily mean a blank checkbox. Tasks looks up the card's current status
and writes that status's `nextStatusSymbol` — **Observed** `tasks: src/Commands/ToggleDone.ts:34` and
`tasks: src/Commands/ToggleDone.ts:36`. The core DONE status cycles to a space, but a custom DONE
status may cycle to `/` or another configured symbol; the bundled tool reads that edge from
`--tasks-data`.

`onCompletion=delete` has another non-obvious consequence. For a non-recurring completion, Tasks
removes the one changed task from its returned array — **Observed** `tasks: src/Task/OnCompletion.ts:52`
and `tasks: src/Task/OnCompletion.ts:53`; `toggleLine` joins that empty array into an empty string
(`tasks: src/Commands/ToggleDone.ts:22`), which Kanban treats as no Tasks result and falls back to a
direct character change (`kanban: src/parsers/helpers/inlineMetadata.ts:231`,
`kanban: src/components/helpers.ts:82`). No completion metadata is written in that branch.

Finally, Kanban does not include a card's separate block id in the string sent to Tasks: it builds the
line from `titleRaw` only — **Observed** `kanban: src/parsers/helpers/inlineMetadata.ts:223` and
`kanban: src/parsers/helpers/inlineMetadata.ts:224` — then reconstructs the card from Tasks' returned
text (`kanban: src/parsers/helpers/inlineMetadata.ts:244`). **Inference:** a Tasks-mediated toggle
drops the old block id. The bundled card tool reports and deliberately avoids that upstream data
loss; this is a safety deviation, not a claim of byte-identical emulation.

Confirming the claim at the top of this section: the literal `✅` appears in exactly two places in
Kanban's source — the symbol table at `kanban: src/parsers/helpers/inlineMetadata.ts:78` and the
parsing regex at `kanban: src/parsers/helpers/inlineMetadata.ts:353` — plus one indirect reference
that maps the `completion` label to that constant for icon display at
`kanban: src/parsers/helpers/inlineMetadata.ts:98`. None of the three writes it. **Observed**;
reproduce with `grep -rn "✅" src/` from the Kanban repository root.

### Recurrence: one card becomes two

A recurring task returns more than one line, and the order of those lines is a Tasks setting.

`handleNewStatus` returns `[nextTask, toggledTask]` — the **new occurrence first** —
**Observed** `tasks: src/Task/Task.ts:419` and `tasks: src/Task/Task.ts:421`. A non-recurring toggle
returns the single toggled task — **Observed** `tasks: src/Task/Task.ts:411`.
`toggleWithRecurrenceInUsersOrder` then hands that array to `putRecurrenceInUsersOrder` —
**Observed** `tasks: src/Task/Task.ts:503` — which reverses it when `recurrenceOnNextLine` is set —
**Observed** `tasks: src/Task/Task.ts:520` and `tasks: src/Task/Task.ts:521`. The setting defaults to
`false` — **Observed** `tasks: src/Config/Settings.ts:128`.

Kanban reads the same setting through the registry scan —
**Observed** `kanban: src/parsers/helpers/inlineMetadata.ts:227` — and uses it to pick which returned
line is the card the user acted on. With `recurrenceOnNextLine` false, the index variable is
reassigned on every line after the first and therefore ends at the **last** index —
**Observed** `kanban: src/parsers/helpers/inlineMetadata.ts:237`. With it true, the variable is set on
index `0` and never again — **Observed** `kanban: src/parsers/helpers/inlineMetadata.ts:235`.

| `recurrenceOnNextLine` | Tasks returns | Kanban's selected index | The card that stays put |
|---|---|---|---|
| `false` (default) | `[next, toggled]` | last | the **completed** occurrence |
| `true` | `[toggled, next]` | `0` | the **completed** occurrence |

**Inference:** the two rules are complements, so in both configurations the card the user dragged or
checked becomes the completed one, and the other returned line becomes a new sibling card — the
`replacement` returned by `maybeCompleteForMove` — **Observed** `kanban: src/components/helpers.ts:66`
and `kanban: src/components/helpers.ts:78`. This inference is traced through both codebases but not
reproduced at runtime.

Two mechanical consequences of how Kanban reassembles the lines:

- **Multi-line cards duplicate their body.** Kanban strips the `- [x] ` prefix from each returned
  line and appends *the original card's remaining lines* to every one of them —
  **Observed** `kanban: src/parsers/helpers/inlineMetadata.ts:244`. A recurring card with a body
  therefore produces two cards that both carry that body.
- **`checkChars` is pushed conditionally.** A returned line is only contributed to the check-character
  array when it matches `/^- \[([^\]]+)\]/` — **Observed**
  `kanban: src/parsers/helpers/inlineMetadata.ts:241` and
  `kanban: src/parsers/helpers/inlineMetadata.ts:242` — while `resultLines` always receives an entry.
  **Inference:** if Tasks ever returns a line that is not a checkbox item, the two arrays fall out of
  alignment and the wrong character is applied. Not reproduced; recorded as a latent hazard rather
  than a confirmed defect.

### Which actions run the mechanic, and which do not

| Action | Calls Tasks? | Citation |
|---|:--:|---|
| Drag a card between lanes | yes | `kanban: src/DragDropApp.tsx:120`, `kanban: src/DragDropApp.tsx:208` |
| Drop external text into a complete lane | yes | `kanban: src/DragDropApp.tsx:61` |
| Click a card's checkbox | yes | `kanban: src/components/Item/ItemCheckbox.tsx:33` |
| Click a checkbox inside a card's body | yes | `kanban: src/components/Item/ItemContent.tsx:103` |
| Add a card through the lane form | no | `kanban: src/components/Lane/Lane.tsx:91`, `kanban: src/components/Lane/Lane.tsx:94` |
| "Move to list" from the card menu | no | `kanban: src/components/Item/ItemMenu.ts:280` |
| "Archive completed cards" | no | `kanban: src/StateManager.ts:392` |

**Observed.** The three "no" rows set `checkChar` directly from `getTaskStatusDone()` or compare
against it; none of them produce a `✅` date. The lane form is the row most easily misread: it is not
inert, it *does* force the new card's `checked` and `checkChar` to the lane's complete flag —
`kanban: src/components/Lane/Lane.tsx:91` and `kanban: src/components/Lane/Lane.tsx:94` — it simply
never asks Tasks for a date. That is the same statement the lanes and archive reference records as
"partly", under a column asking whether the complete mechanic is applied rather than whether Tasks is
called. **Recommendation:** treat the completion date as a property of *how* a card was completed, not
of the card's state, and do not assume that every card in a complete lane carries one.

### Emoji field parsing is gated on Tasks being enabled

The evidence brief that seeded this file asserted that Kanban parses Tasks emoji fields for display
even when Tasks is absent. **That is not true at this pin, and this file follows the source.**

`extractInlineFields(line, includeTaskFields)` performs two independent extractions, each gated on a
different plugin — **Observed** `kanban: src/parsers/helpers/inlineMetadata.ts:420` and
`kanban: src/parsers/helpers/inlineMetadata.ts:421`:

- Dataview-style `key:: value` fields are collected only when Dataview is enabled —
  **Observed** `kanban: src/parsers/helpers/inlineMetadata.ts:424`;
- Tasks emoji fields (`🔺 ⏫ 🔼 🔽 ⏬ 🛫 ➕ ⏳ 📅 ✅ ❌ ⛔ 🆔 🔁`) are collected only when Tasks is
  enabled **and** the caller passes `includeTaskFields` —
  **Observed** `kanban: src/parsers/helpers/inlineMetadata.ts:440`.

There is exactly one caller in the whole source, and it passes `true` —
**Observed** `kanban: src/parsers/formats/list.ts:197`. So `includeTaskFields` is never the limiting
factor; the enabled-plugin check is. **With neither plugin enabled, a card's emoji metadata and
inline fields stay in the card title as literal text and are never extracted.**

Two filters apply to what survives extraction:

- A **task** field is kept only when the card is single-line or the field ends before the first
  newline — **Observed** `kanban: src/parsers/formats/list.ts:202`. A `📅 2026-08-03` on the second
  line of a card is ignored. Non-task fields are kept from anywhere in the card —
  **Observed** `kanban: src/parsers/formats/list.ts:201`.
- Extracted fields are *removed from the displayed title* only when `move-task-metadata` (task
  fields) or a non-`body` `inline-metadata-position` (the rest) is set —
  **Observed** `kanban: src/parsers/formats/list.ts:207`,
  `kanban: src/parsers/formats/list.ts:208` and `kanban: src/parsers/formats/list.ts:212`. The raw
  title written back to disk is unaffected either way.

## Dataview

Dataview participates in three separate places.

**Inline field extraction.** As above, `key:: value` parsing inside a card is gated on
`app.plugins.enabledPlugins.has('dataview')` — **Observed**
`kanban: src/parsers/helpers/inlineMetadata.ts:456`, called at
`kanban: src/parsers/helpers/inlineMetadata.ts:420`. The parsing itself is Kanban's own port of
Dataview's algorithm — the file says so in its header comment,
`kanban: src/parsers/helpers/inlineMetadata.ts:2` — so Dataview's *code* is never called for this;
only its presence is checked.

**Value rendering.** Extracted values are passed through Dataview's `api.parse` when it is available
and used verbatim otherwise — **Observed** `kanban: src/components/Item/InlineMetadata.tsx:43` and
`kanban: src/components/Table/helpers.tsx:295`. **Inference:** without Dataview an inline value is
always a string, never a date object, so date-aware rendering and the table's date sorting degrade to
lexical string behaviour.

**Linked-page metadata.** `getLinkedPageMetadata` merges Obsidian's own frontmatter cache with a
Dataview page object — **Observed** `kanban: src/parsers/common.ts:102`. Three details matter:

- It returns immediately when `metadata-keys` is empty — **Observed**
  `kanban: src/parsers/common.ts:108` — so the whole path costs nothing until a key is configured.
- The Dataview cache is fetched through `api.page(linkedFile.path, sourceFile.path)`, guarded by both
  the enabled-plugins check and the presence of `plugins.dataview.api` —
  **Observed** `kanban: src/parsers/common.ts:74` and `kanban: src/parsers/common.ts:79`.
- **Frontmatter wins over Dataview for the same key.** The frontmatter value is tested first, and the
  Dataview value is only consulted in the `else if` branch —
  **Observed** `kanban: src/parsers/common.ts:169` and `kanban: src/parsers/common.ts:216`.

**Refresh.** Kanban subscribes to two Dataview events on the metadata cache: `dataview:metadata-change`
routes into the same debounced notifier as ordinary file changes —
**Observed** `kanban: src/main.ts:556` — and `dataview:api-ready` calls `forceRefresh()` on every open
board — **Observed** `kanban: src/main.ts:562`. **Inference:** boards opened before Dataview finishes
loading will re-render once it does; a script that reads a board file during that window sees no
difference, because none of this touches disk.

**Contract** (documented): linked-page metadata can display frontmatter *and* Dataview fields of the
first note linked in a card — `kanban: docs/Settings/Linked page metadata.md:2`, with a worked
example using an `inline-field::` at `kanban: docs/Settings/Linked page metadata.md:13`. **Contract**:
frontmatter values containing links or embeds must be quoted —
`kanban: docs/FAQs/Frontmatter limitations & gotchas.md:2`. Both agree with the implementation.
The documentation does not say that frontmatter takes precedence over Dataview for a shared key; that
comes from source.

## Daily notes

`link-date-to-daily-note` changes how a date is *written*, not how it is read.

With the setting off, the date picker appends `` `${date-trigger}{${formattedDate}}` `` —
**Observed** `kanban: src/components/Item/helpers.ts:114` and
`kanban: src/components/Item/helpers.ts:121`. With it on, the braces are replaced by a link built by
`buildLinkToDailyNote` — **Observed** `kanban: src/components/Item/helpers.ts:113`. That helper reads
the daily-notes folder from `obsidian-daily-notes-interface` and the vault's `useMarkdownLinks`
setting — **Observed** `kanban: src/helpers.ts:31` and `kanban: src/helpers.ts:32` — and emits either
a URL-encoded Markdown link — **Observed** `kanban: src/helpers.ts:35` — or a plain wikilink
`[[2021-04-26]]` — **Observed** `kanban: src/helpers.ts:40`.

Reading is more tolerant than writing. The parser always registers **both** a brace extension and a
wikilink extension for the date trigger, regardless of the setting —
**Observed** `kanban: src/parsers/parseMarkdown.ts:68` and
`kanban: src/parsers/parseMarkdown.ts:69` — and the list format maps both node types to the same
`dateStr` — **Observed** `kanban: src/parsers/formats/list.ts:145`. So a board written under one
setting still reads correctly under the other.

There is one asymmetry worth flagging, and it is narrower than it looks. `getExtensions` registers no
extension for the *Markdown-link* date form — the list at `kanban: src/parsers/parseMarkdown.ts:66`
through `kanban: src/parsers/parseMarkdown.ts:75` contains `date` (`@{`…`}`) and `dateLink`
(`@[[`…`]]`) and nothing else — yet `buildLinkToDailyNote` emits a Markdown link whenever the vault
has `useMarkdownLinks` enabled.

**It is the tokenizer alone that omits the form.** The rest of the plugin handles it. The renderer
carries a dedicated Markdown-link branch that parses the value with `date-format` and rewrites it into
the same date span the other forms produce — **Observed**
`kanban: src/parsers/helpers/hydrateBoard.ts:52-63` — so the card still *displays* a date. "Remove
date" builds its regex from `link-date-to-daily-note` and matches the Markdown-link form as well as
the wikilink one — **Observed** `kanban: src/components/Item/ItemMenu.ts:216` and
`kanban: src/components/Item/ItemMenu.ts:217`.

**Inference:** what is lost is the *model* value, and the consequences follow from that alone.
`item.data.metadata.date` stays unset, so nothing that reads the field sees a date: date sorting, date
colours and the metadata row skip the card, the menu label stays "Add date" rather than "Edit date"
because `hasDate` is derived from that field — **Observed**
`kanban: src/components/Item/ItemMenu.ts:44` — the "Remove date" item is never offered for the same
reason, and the next use of the picker appends a second date instead of replacing the first —
**Observed** `kanban: src/components/Item/helpers.ts:121`. Classified as an internal inconsistency
between the tokenizer and the three call sites that already know the form, not as a form the plugin
cannot read: the writer, the renderer and the remover agree, and only the extension list disagrees.
**Not reproduced**: it requires a vault with `useMarkdownLinks` on, and the whole chain was traced
statically.

Separately, Kanban forwards the daily-notes navigation hotkeys while a board is focused, resolving the
board's own filename as a date — **Observed** `kanban: src/KanbanView.tsx:63` and
`kanban: src/helpers.ts:7`. This only matters when the board file itself is named like a daily note.

**Contract** (documented): when the setting is active, dates and display dates link to the
corresponding daily note — `kanban: docs/Settings/Link dates to daily notes.md:2`. The documentation
does not mention the Markdown-link form.

## Templates and Templater

A template is applied in exactly one place and conspicuously not applied in two others.

**Applied: "New note from card".** The menu item reads `new-note-folder` and `new-note-template` —
**Observed** `kanban: src/components/Item/ItemMenu.ts:68` and
`kanban: src/components/Item/ItemMenu.ts:69` — creates the note, opens it in a split, and only then
calls `applyTemplate` — **Observed** `kanban: src/components/Item/ItemMenu.ts:86`. The card's first
line is afterwards rewritten into a link to the new note —
**Observed** `kanban: src/components/Item/ItemMenu.ts:88`.

`applyTemplate` forces the active Markdown view into source mode first —
**Observed** `kanban: src/components/helpers.ts:126` — then dispatches —
**Observed** `kanban: src/components/helpers.ts:142`:

| Enabled | Behaviour |
|---|---|
| Templates **and** Templater | `<%` anywhere in the template selects Templater, otherwise core Templates — `kanban: src/components/helpers.ts:143`, detection regex at `kanban: src/components/helpers.ts:114` |
| Templates only | core Templates `insertTemplate` — `kanban: src/components/helpers.ts:151` |
| Templater only | `append_template_to_active_file` — `kanban: src/components/helpers.ts:155` |
| Neither | the template file's **raw text** is written into the note with `vault.modify`, with no substitution at all — `kanban: src/components/helpers.ts:159` |

**Observed.** The last row is the surprising one: with no template plugin enabled a template is still
"applied", but `{{title}}` and `{{date}}` survive literally. The settings UI warns that no template
plugin is enabled — **Observed** `kanban: src/settingHelpers.ts:62` — but does not disable the
feature.

**Not applied: creating a new board.** `newKanban` calls Obsidian's `createNewMarkdownFile` and then
overwrites the whole file with the fixed frontmatter stub, unconditionally —
**Observed** `kanban: src/main.ts:345` and `kanban: src/main.ts:350`. **Inference:** any content that
Obsidian's folder templates or Templater's empty-file template placed in the new file is destroyed by
that `modify`. Supporting this reading: `getTemplatePlugins` computes a `templaterEmptyFileTemplate`
value — **Observed** `kanban: src/components/helpers.ts:207`, returned at
`kanban: src/components/helpers.ts:222` — that nothing in the source ever consumes, which looks like
an abandoned attempt to handle exactly this case. Classified as deliberate design that surprises: a
new board must start from a known-parsable stub.

**Not applied: converting a note.** `convert-to-kanban` refuses unless the file is exactly zero bytes
— **Observed** `kanban: src/main.ts:634` — and then writes the same stub —
**Observed** `kanban: src/main.ts:639`. A note that a template already populated cannot be converted.

**Contract** (documented): both the core Templates plugin and Templater are supported template
formats — `kanban: docs/Settings/Note template.md:6` and `kanban: docs/Settings/Note template.md:7` —
and new notes are created in the note folder using the note template —
`kanban: docs/How do I/Create notes from cards.md:6`. The documentation says nothing about the
no-plugin fallback or about board creation.

## Obsidian itself

**This is the section that matters if a board is ever edited by anything other than the plugin.**
It owns the *mechanism* — which code writes the file, when, and from what. The protocol for actually
performing an external edit, and the per-operation mechanics to imitate, are owned by the safe
mutation reference; read that one before writing anything.

### Every save is a whole-file rewrite from memory

`saveToDisk` serialises the entire in-memory board and hands the string to the view —
**Observed** `kanban: src/StateManager.ts:107` and `kanban: src/StateManager.ts:108`. The view stores
it and requests a save only when the string differs from what it holds **and** the view is primary —
**Observed** `kanban: src/KanbanView.tsx:205`. `getViewData()` — what Obsidian ultimately writes —
returns that stored string, with a source comment explaining that re-serialising on demand was
rejected as slow and error-prone — **Observed** `kanban: src/KanbanView.tsx:213` and
`kanban: src/KanbanView.tsx:218`.

There is **no mtime check, no diff against disk, and no conflict detection** anywhere on that path.
**Observed** as an absence across `kanban: src/StateManager.ts:99` through
`kanban: src/StateManager.ts:111` and `kanban: src/KanbanView.tsx:204` through
`kanban: src/KanbanView.tsx:218`. The practical rule: **an external write to an open board is lost
the moment the board saves for any reason.** Anything else in the file that the board model cannot
represent is lost with it, because the string is rebuilt from the model rather than patched.

The one protection is that a board in an error state refuses to write at all —
**Observed** `kanban: src/StateManager.ts:100`. A board that fails to parse therefore preserves the
file, which also means a malformed external edit is *safer* than a well-formed one.

### What re-parses, and what does not

Obsidian pushes new disk content in through `setViewData` —
**Observed** `kanban: src/KanbanView.tsx:221`. Two guards fire before anything else:

- If the raw text no longer contains the `kanban-plugin` frontmatter key, the leaf is silently
  converted to a Markdown view — **Observed** `kanban: src/KanbanView.tsx:222` and
  `kanban: src/KanbanView.tsx:225`. The test is a substring match over the first `---`…`---` block —
  **Observed** `kanban: src/helpers.ts:46` and `kanban: src/helpers.ts:52` — so removing or renaming
  the key while the board is open closes the board.
- Otherwise the view is re-registered with `shouldParseData = !clear && this.isPrimary` —
  **Observed** `kanban: src/KanbanView.tsx:239` — and only that flag causes a parse —
  **Observed** `kanban: src/StateManager.ts:62`.

`isPrimary` is simply whichever view happens to be first in the state manager's set —
**Observed** `kanban: src/KanbanView.tsx:44` and `kanban: src/StateManager.ts:47`. **Inference:** a
second pane on the same board holds state that is never refreshed from disk and can later be written,
so two panes plus one external edit is enough to lose data.

The board's own file is deliberately excluded from the change-notification re-parse: the debounced
notifier skips the manager whose file changed — **Observed** `kanban: src/main.ts:532`. And what that
notifier eventually calls, `reparseBoardFromMd`, re-parses the **in-memory** string from
`getAView().data`, not the file — **Observed** `kanban: src/StateManager.ts:358`. So a metadata-cache
change in a *linked* note refreshes the board's rendering of that note's metadata; a change to the
board file itself does not travel this path at all.

### Saves that happen with no user action

Three, all of which dirty the file without any edit intent:

- collapsing or expanding a lane — **Observed** `kanban: src/components/Lane/Lane.tsx:71`;
- resizing a table column, 500 ms after the drag ends —
  **Observed** `kanban: src/components/Table/Table.tsx:121`;
- archive trimming, which runs from a render effect whenever the archive exceeds `max-archive-size`
  and deletes the excess — **Observed** `kanban: src/components/Kanban.tsx:148` and
  `kanban: src/components/Kanban.tsx:158`.

**Recommendation:** for any programmatic edit of a board, close the board's views first, or accept
that the window between reading and writing is unbounded and that the plugin may write during it.

### A second, independent writer

`setView` writes the frontmatter key through `app.fileManager.processFrontMatter` —
**Observed** `kanban: src/KanbanView.tsx:120` — which edits the file directly rather than going
through the board serialiser. That is a genuinely separate write path with separate timing; see the
next section.

### View takeover

Kanban monkey-patches `WorkspaceLeaf.prototype.setViewState` so that opening a Markdown file whose
metadata cache carries the frontmatter key forces the Kanban view type —
**Observed** `kanban: src/main.ts:780`, with the frontmatter check at `kanban: src/main.ts:794`. The
per-leaf override that "Open as markdown" sets is respected — **Observed** `kanban: src/main.ts:789`.
**Inference:** adding the key to an existing note therefore changes how that note opens everywhere in
the vault, not just in one pane, and it takes effect as soon as the metadata cache updates.

## Other Kanban views

`kanban-plugin` names the renderer: `'basic' | 'board' | 'table' | 'list'` —
**Observed** `kanban: src/Settings.ts:50` — with `'basic'` normalised to `'board'` on read —
**Observed** `kanban: src/parsers/parseMarkdown.ts:175`. The three commands `view-board`, `view-table`
and `view-list` are registered at `kanban: src/main.ts:665`, `kanban: src/main.ts:681` and
`kanban: src/main.ts:697`, and a mobile pane menu offers the same choices —
**Observed** `kanban: src/main.ts:485`.

Switching views writes through **two channels at once** — **Observed**
`kanban: src/KanbanView.tsx:118`:

1. `setViewState(frontmatterKey, view)` updates the leaf's own `viewSettings` and requests a workspace
   layout save — **Observed** `kanban: src/KanbanView.tsx:264` and `kanban: src/KanbanView.tsx:267`.
   This is per-leaf state in `workspace.json`, not in the board file.
2. `processFrontMatter` writes `kanban-plugin: <view>` into the file's YAML —
   **Observed** `kanban: src/KanbanView.tsx:121`.

The per-leaf copy is seeded from the board's settings when a view registers —
**Observed** `kanban: src/KanbanView.tsx:271` — and thereafter takes precedence over the board value
on read — **Observed** `kanban: src/KanbanView.tsx:278`. **Inference:** two panes on the same board
can therefore render in different modes, and the file records only whichever pane last called
`setView`.

The second channel is the one to watch. `processFrontMatter` is an Obsidian-managed edit of the file
on disk, while the board's own `kanban-plugin` value lives in `board.data.frontmatter` in memory and
is re-emitted verbatim by the serialiser — **Observed** `kanban: src/parsers/formats/list.ts:448`.
**Inference:** between the frontmatter write and the next parse the two copies disagree, and a board
save landing in that window rewrites the file from the stale in-memory frontmatter. Traced
statically; not reproduced.

**Contract** (documented): the archive is only visible in Markdown mode —
`kanban: docs/How do I/View a Kanban's archive.md:2` — and the round trip back to the board is a
command — `kanban: docs/How do I/View a Kanban's archive.md:10`. The documentation vault predates
the table and list views and does not mention them at all; do not treat its silence as evidence
about them.

## Known gaps

- **Dataview is unpinned.** Every Dataview claim here is one-sided: it describes what Kanban calls and
  what it does with the result. `api.page` semantics, `api.parse` return types and the exact payload
  of `dataview:metadata-change` are **Unverified**. Pinning Dataview would be needed to promote any
  of them.
- **Nothing was executed.** The recurrence table, the Markdown-link date inconsistency, the
  two-writer window in view switching, and the `checkChars` misalignment hazard are all traced through source
  and marked **Inference**. Each needs a fixture vault with both plugins installed to confirm.
- **Only the Tasks toggle path was read.** Tasks' auto-suggest integration for extended editors, its
  query engine and its own settings UI were not examined. Whether Kanban's editor participates in
  `showTasksPluginAutoSuggest` was not investigated.
- **Templater's empty-file template is inferred, not observed.** The claim that board creation
  destroys template output rests on the unconditional `vault.modify` plus the dead
  `templaterEmptyFileTemplate` value; Templater itself is not pinned, and its timing relative to
  `createNewMarkdownFile` was not verified.
- **Mobile paths are thinly covered.** The mobile pane menu was read only far enough to confirm the
  view-switching entries; whether any mobile-only path bypasses the Tasks mechanic was not checked.
- **No agent-behaviour evaluation.** How reliably this reference triggers, which sections an agent
  loads, and how it routes against the settings and board format references have not been assessed,
  and no such claim is made.
