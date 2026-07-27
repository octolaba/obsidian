# Board format

This file owns the board **file** as a whole: its four regions, the two hand-rolled extractors that
find the first and the last of them, how a file is decided to be a board at all, the exact byte shape
a save writes, and what a save deletes because the board model cannot hold it. Card anatomy owns
everything inside a `- [ ] …` line; lanes and archive own lane titles, WIP limits, complete lanes and
archive semantics; settings owns the keys inside the JSON block.

## Contents

- [Evidence boundary](#evidence-boundary)
- [The four regions of a board file](#the-four-regions-of-a-board-file)
- [Frontmatter extraction](#frontmatter-extraction)
- [Settings-footer extraction](#settings-footer-extraction)
- [Frontmatter keys that migrate](#frontmatter-keys-that-migrate)
- [The serialisation contract](#the-serialisation-contract)
- [What a save deletes](#what-a-save-deletes)
- [Board detection](#board-detection)
- [The runtime envelope](#the-runtime-envelope)
- [Known gaps](#known-gaps)

## Evidence boundary

Citation alias `kanban` is the Kanban plugin pin: `obsidian-community/obsidian-kanban`, tag `2.0.51`,
commit `8501981a1afacb4c8fc03ec60604aa5eedfbd857`. Citation alias `tasks` is the Tasks plugin pin:
`obsidian-tasks-group/obsidian-tasks`, tag `8.3.0`, commit `e16dbc2cf509420459ea04094a1d834ae89e0019`.
Both paths are relative to their own repository root.

Read for this file: `src/parsers/parseMarkdown.ts` in full, `src/parsers/common.ts`,
`src/parsers/List.ts`, `src/parsers/formats/list.ts`, `src/parsers/helpers/ast.ts`,
`src/parsers/helpers/parser.ts`, `src/helpers.ts`, `src/lang/helpers.ts`, the load and save paths of
`src/StateManager.ts` and `src/KanbanView.tsx`, the detection sites in `src/main.ts`, both Kanban
boards in the Tasks sample vault. Not read: rendering, drag and drop, micromark extensions.

One runtime experiment was performed and is the only thing labelled **Experiment**. Reproduce it by
slicing `extractFrontmatter` (`kanban: src/parsers/parseMarkdown.ts:17`) and `extractSettingsFooter`
(`kanban: src/parsers/parseMarkdown.ts:39`) verbatim out of the pinned file — they need only a
`parseYaml`, stubbed to js-yaml's empty-document result `undefined` — and applying them to the
fixtures tabulated below on Node v26.5.0. Nothing ran inside Obsidian, so every claim about what a
*save* writes is read from source. Agent-behaviour evaluation has not been run and is not claimed.

The plugin's `docs/` vault documents no file-format detail — `kanban:settings`, `**Complete**` and
`## Archive` do not occur in it — so there is **no documented contract** here. Nothing below is
labelled **Contract**: every claim in this file is **Observed**, **Inference**, **Experiment** or
**Recommendation**.

## The four regions of a board file

Four regions in a fixed order. Only the first and the fourth are found by dedicated scanners.

| # | Region | Written delimiter | How reading finds it |
|---|---|---|---|
| 1 | YAML frontmatter | `---` first, `---` on its own line | forward character scan from byte 0 — `kanban: src/parsers/parseMarkdown.ts:17` |
| 2 | Lanes | `## Title`, blank line, a bullet list | every `heading` in `root.children` — `kanban: src/parsers/formats/list.ts:250` |
| 3 | Archive (optional) | `***`, blank, `## Archive`, blank, a bullet list | a heading whose text equals `t('Archive')` **and** whose previous sibling is a `thematicBreak` — `kanban: src/parsers/formats/list.ts:231`, `kanban: src/parsers/formats/list.ts:237` |
| 4 | Settings block | `%% kanban:settings`, ```` ``` ````, one JSON line, ```` ``` ````, `%%` | backwards character scan from the last byte — `kanban: src/parsers/parseMarkdown.ts:39` |

**Observed:** region 3 is emitted only when the archive is non-empty
(`kanban: src/parsers/formats/list.ts:430`, `kanban: src/parsers/formats/list.ts:440`), and its
delimiter is matched on AST node *type*, so any thematic break — `***`, a lone `---`, `___` —
satisfies it, though `archiveString` is always written as `***` — `kanban: src/parsers/common.ts:24`.

**Observed:** the whole file is `trim()`ed before any of this runs
(`kanban: src/StateManager.ts:305`), and a file empty after trimming skips parsing entirely, giving a
default board with no error (`kanban: src/StateManager.ts:313`, `kanban: src/StateManager.ts:321`).

**Observed:** two frontmatter parsers see the same file — the hand-rolled `extractFrontmatter`
(`kanban: src/parsers/parseMarkdown.ts:168`) and then micromark's, which builds the AST
(`kanban: src/parsers/parseMarkdown.ts:191`). **Inference:** the hand-rolled one is the gate; it can
fail the load before micromark runs, so its rules — not CommonMark's — decide whether a board opens.

## Frontmatter extraction

A single forward pass over the trimmed file — `kanban: src/parsers/parseMarkdown.ts:21` — in two
phases. **Opening fence:** until three `-` have been counted, *every* character must be `-`, or the
function throws `Error parsing frontmatter` (`kanban: src/parsers/parseMarkdown.ts:23`,
`kanban: src/parsers/parseMarkdown.ts:27`). **Closing fence:** from the next character on, the scan
looks for a `-` preceded by `\r` or `\n` and followed by two more `-`, then returns `parseYaml` of
everything between, trimmed — `kanban: src/parsers/parseMarkdown.ts:33`,
`kanban: src/parsers/parseMarkdown.ts:34`.

**Observed:** the two failure modes differ. A first non-`-` character arriving before three dashes
have been counted **throws** with the message above. If the closing fence is never found, the loop
ends and the function returns `undefined` implicitly; the caller immediately does
`Object.keys(mdFrontmatter)` (`kanban: src/parsers/parseMarkdown.ts:173`), throwing
`TypeError: Cannot convert undefined or null to object`. An **empty** frontmatter block reaches that
same TypeError by another route: the slice is the empty string and `parseYaml` of an empty document is
`undefined`.

**Experiment.**

| Fixture | `extractFrontmatter` | then `Object.keys` |
|---|---|---|
| U+FEFF prefix, **untrimmed** | `Error parsing frontmatter` | — |
| U+FEFF prefix or two blank lines, **trimmed** | parsed | ok |
| `x` prefix | `Error parsing frontmatter` | — |
| `---\n\nkanban-plugin: board\n\n## To Do\n` | `undefined` | `TypeError` |
| `---\n---\n\n## To Do\n` | `undefined` | `TypeError` |

**Observed:** a leading byte-order mark or blank line is therefore **not** fatal — `trim` strips
U+FEFF as whitespace and the plugin trims before parsing (`kanban: src/StateManager.ts:305`). What is
fatal is a leading character that is neither `-` nor whitespace, and the byte-0 requirement applies to
the *trimmed* text, not to the file's first byte.

**Observed:** a throw is pushed onto `board.data.errors` (`kanban: src/StateManager.ts:324`,
`kanban: src/StateManager.ts:330`), the view renders a bare `Error:` panel with the stack
(`kanban: src/components/Kanban.tsx:188`, `kanban: src/components/Kanban.tsx:191`), and `saveToDisk`
refuses to write while errors remain (`kanban: src/StateManager.ts:99`,
`kanban: src/StateManager.ts:100`). **Inference:** such a board is frozen, not corrupted.

## Settings-footer extraction

A backwards walk from the last byte — `kanban: src/parsers/parseMarkdown.ts:44` — in two phases.
**Tail phase:** until three backticks have been counted, every character must match ``/[`%\n\r]/``
(`kanban: src/parsers/parseMarkdown.ts:45`); the first character outside that class returns `{}`
(`kanban: src/parsers/parseMarkdown.ts:56`), and the third backtick sets `settingsEnd` just before it
(`kanban: src/parsers/parseMarkdown.ts:49`, `kanban: src/parsers/parseMarkdown.ts:51`). **Body phase:**
the scan continues backwards for three backticks preceded by a newline — the opening fence — and
returns `JSON.parse` of everything between, trimmed — `kanban: src/parsers/parseMarkdown.ts:59`,
`kanban: src/parsers/parseMarkdown.ts:60`.

**Observed:** the `%% kanban:settings` marker is **never tested**. It is written
(`kanban: src/parsers/common.ts:33`) and used only to stop the lane scanner walking into the footer
(`kanban: src/parsers/formats/list.ts:263`), but plays no part in locating the settings.
**Inference, load-bearing:** the settings block is *the last fenced code block in the file*, provided
nothing but backticks, percent signs and newlines follow it. Any board whose content ends in a fenced
code block hands that block to `JSON.parse`.

**Experiment.**

| Fixture (tail of the file) | Result |
|---|---|
| ````…\n```\n%%```` | settings parsed |
| the same plus one trailing space, untrimmed | `{}`, settings silently lost |
| the same plus one trailing space, **trimmed** | settings parsed |
| ````…\n```\n%% done```` | `{}`, settings silently lost |
| ````…\n```\nfoo\n``` ```` — no `%%`, an ordinary code block | `SyntaxError` from `JSON.parse` |
| no fence anywhere | `{}` |

**Observed:** trailing whitespace after the final `%%` is removed by the same trim as a leading BOM,
so it does **not** destroy the settings. **Non-whitespace** content after `%%` does: the tail phase
bails, every board-local setting reverts to its global value, and the next save rewrites the block
from the now-empty object. It is appended *text*, not appended blank space, that costs the settings.

**Observed:** a `JSON.parse` failure is not silent — it propagates out of `parseMarkdown`, is caught
by `getParsedBoard` (`kanban: src/StateManager.ts:324`) and freezes the board as above.
**Inference:** the two failures are opposites — a tolerated-class violation loses settings quietly and
keeps working, malformed JSON loses nothing and stops working entirely.

## Frontmatter keys that migrate

`parseMarkdown` seeds `settings` from the footer — `kanban: src/parsers/parseMarkdown.ts:170` — then
walks the YAML keys and routes each — `kanban: src/parsers/parseMarkdown.ts:173`:

- `kanban-plugin` goes into **both** `settings` and the surviving file frontmatter
  (`kanban: src/parsers/parseMarkdown.ts:176`, `kanban: src/parsers/parseMarkdown.ts:177`), which is
  why it is the one key that stays visible in the YAML. The value `basic` is normalised to `board` on
  the way (`kanban: src/parsers/parseMarkdown.ts:175`), although `basic` remains a legal member of the
  type — `kanban: src/Settings.ts:50`.
- Any other key in `settingKeyLookup`, the 40-key set at `kanban: src/Settings.ts:100`, goes into
  `settings` only — `kanban: src/parsers/parseMarkdown.ts:179`.
- Everything else stays frontmatter — `kanban: src/parsers/parseMarkdown.ts:181`.

**Inference:** because the footer is spread *first* and the YAML keys assigned *after*, a key written
in both places resolves to the YAML value — which then disappears on save, since `boardToMd`
regenerates the YAML from `board.data.frontmatter` alone
(`kanban: src/parsers/formats/list.ts:448`). The migration is one-way and silent. The Tasks sample
vault preserves the pre-normalisation state — `kanban-plugin: basic` in the YAML and
`{"kanban-plugin":"basic"}` in the block
(`tasks: resources/sample_vaults/Tasks-Demo/Test Data/example_kanban.md:3`,
`tasks: resources/sample_vaults/Tasks-Demo/Test Data/example_kanban.md:14`) — and saving it under this
pin rewrites both to `board`.

## The serialisation contract

`boardToMd` concatenates exactly four pieces and nothing else —
`kanban: src/parsers/formats/list.ts:443`, `kanban: src/parsers/formats/list.ts:450`. Newline counts
matter, because the result is compared against the previous save before the file is written.

**Frontmatter** — `['---', '', stringifyYaml(frontmatter), '---', '', ''].join('\n')`
(`kanban: src/parsers/formats/list.ts:448`). `stringifyYaml` supplies its own trailing newline, so the
region is `---`, blank, the YAML, blank, `---`, blank: six lines for a single-key board.

**Each lane** (`kanban: src/parsers/formats/list.ts:407`): the heading, always at depth two
(`kanban: src/parsers/formats/list.ts:410`); one blank line
(`kanban: src/parsers/formats/list.ts:412`); the complete marker when the lane is flagged
(`kanban: src/parsers/formats/list.ts:415`); one line per card
(`kanban: src/parsers/formats/list.ts:403`); then three empty strings
(`kanban: src/parsers/formats/list.ts:422` through `kanban: src/parsers/formats/list.ts:424`), joined
by `\n` (`kanban: src/parsers/formats/list.ts:426`). **The lane block ends with three newlines after
the last card**, i.e. two blank lines before whatever follows.

**Archive**, when non-empty: `***`, blank, `## Archive`, blank, one line per card, **no** trailing
newline — `kanban: src/parsers/formats/list.ts:431`. **Settings** —
````['', '', '%% kanban:settings', '```', json, '```', '%%'].join('\n')````
(`kanban: src/parsers/common.ts:29`); its two leading empty strings add two newlines on top of the
lane's three, so a board with no archive has **four blank lines** between its last card and
`%% kanban:settings`.

**Observed:** the output does **not** end with a newline. The last byte of a saved board is the second
`%` of the closing `%%`.

**Experiment.** Reconstructing this shape from the pinned templates and comparing it with the
plugin-written board in the Tasks vault gives a byte-exact match plus exactly one trailing newline —
expected 209 bytes, file 210, `actual === expected + '\n'` — with the four blank lines at 11–14 and
`%% kanban:settings` at
`tasks: resources/sample_vaults/Tasks-Demo/Manual Testing/Smoke test Kanban Integration.md:15`.

**Observed:** the two boards in that vault are an **audit corpus, not byte ground truth**: both carry
a trailing newline `boardToMd` never writes, and the second is a legacy `basic` board whose
lane-to-footer gap is two blank lines rather than four
(`tasks: resources/sample_vaults/Tasks-Demo/Test Data/example_kanban.md:12`). Sanity-check a parser
against them, never define the format from them.

**Inference:** because the YAML is regenerated by `stringifyYaml` from a plain object, YAML comments,
key order, quoting style, block scalars and anchors do not survive a save; only the key-value data
does.

## What a save deletes

The board model is `frontmatter`, `settings`, an array of lanes and an archive array. `boardToMd`
rebuilds the whole file from those four things, so **anything the model did not capture is gone on the
next save** — and saves happen without user action. `astToUnhydratedBoard`
(`kanban: src/parsers/formats/list.ts:240`) iterates `root.children`
(`kanban: src/parsers/formats/list.ts:249`), reacts **only** to `heading` nodes
(`kanban: src/parsers/formats/list.ts:250`) and takes for each the next `list` sibling via
`getNextOfType` (`kanban: src/parsers/formats/list.ts:257`, `kanban: src/parsers/helpers/ast.ts:57`,
`kanban: src/parsers/helpers/ast.ts:61`).

| What is written | What the model holds | What the next save produces |
|---|---|---|
| Text, a blockquote, a table or an HTML block before, between or after lanes | nothing | deleted |
| Prose between a heading and its list | nothing; the scan walks past it — `kanban: src/parsers/formats/list.ts:273` | deleted; the list still becomes the lane's cards |
| A second list under one heading | only the first list — `kanban: src/parsers/formats/list.ts:257` | deleted |
| A heading with no list before the next heading | an empty lane — `kanban: src/parsers/formats/list.ts:290` | `## Title`, blank line, two blank lines |
| `# H1` or `#### H4` at root | a lane; there is **no depth test** | rewritten as `##` — `kanban: src/parsers/formats/list.ts:410` |
| `**Complete**` as its own paragraph before the list | `shouldMarkItemsComplete` — `kanban: src/parsers/formats/list.ts:268` | re-emitted right after the heading's blank line |
| bare `Complete`, same position | the same flag — the test compares the *stringified* paragraph, so emphasis is invisible to it — `kanban: src/parsers/formats/list.ts:267` | rewritten as `**Complete**` — `kanban: src/parsers/common.ts:23` |
| `**Complete!**`, or the marker after the list, or inside a card | nothing; the equality test fails | deleted |
| `## Archive` **not** preceded by a thematic break | an ordinary lane titled `Archive` | a normal lane keeping its cards; what is lost is the archive **section**, not its contents |
| A thematic break with no `Archive` heading after it | nothing | deleted |
| An earlier `%% kanban:settings` block | nothing; settings come from the last fence | deleted, and it truncates the lane scan |
| Content after the final `%%` | nothing | deleted, **and** all board-local settings are reset |
| YAML comments, key order, quoting | key-value data only | normalised by `stringifyYaml` |
| A settings key in the YAML | routed into `settings` — `kanban: src/parsers/parseMarkdown.ts:179` | removed from the YAML, present in the JSON block |
| `kanban-plugin: basic` | `'board'` — `kanban: src/parsers/parseMarkdown.ts:175` | `kanban-plugin: board` in both places |
| A trailing newline at end of file | nothing | removed; output ends at `%%` |

**Recommendation:** treat a board file as a generated artefact — anything that is not a lane heading,
a card bullet, the archive or the frontmatter should be assumed lost. A tool that rewrites a board
should reproduce the byte shape above exactly, so the next in-app save produces no diff.

## Board detection

Two different tests decide whether a file is a board, and they do not agree.

**Observed — the substring test.** `hasFrontmatterKeyRaw` matches `/---\s+([\w\W]+?)\s+---/` against
the raw text and returns true when capture group 1 merely *contains* the string `kanban-plugin`
(`kanban: src/helpers.ts:43`, `kanban: src/helpers.ts:46`, `kanban: src/helpers.ts:52`); it parses no
YAML and checks no value. It runs on every push of file content into an open view, and when it returns
false the leaf reverts to Markdown (`kanban: src/KanbanView.tsx:222`, `kanban: src/KanbanView.tsx:225`).

**Observed — the metadata-cache test.** `hasFrontmatterKey` asks Obsidian's metadata cache for a
truthy `frontmatter['kanban-plugin']` (`kanban: src/helpers.ts:59`, `kanban: src/helpers.ts:62`). It
drives the file menus (`kanban: src/main.ts:387`, `kanban: src/main.ts:420`), and the same cache check
drives the `setViewState` patch that opens boards in Kanban mode by default
(`kanban: src/main.ts:792`, `kanban: src/main.ts:794`).

**Inference — the consequence.** The substring test accepts documents the parser rejects. A note whose
frontmatter holds `aliases: [kanban-plugin]`, or a commented-out `# kanban-plugin: board`, passes it:
the note is kept in the Kanban view instead of reverting to Markdown, then fails in `parseMarkdown` —
usually with the `TypeError` above — leaving the user at a stack trace with no obvious way back. The
asymmetry runs the other way too: the cache test needs a *truthy value*, so `kanban-plugin:` with an
empty value gets no menu item and no automatic Kanban view, yet passes the raw test once open.

**Observed:** a new board is `basicFrontmatter` written over a fresh file unconditionally
(`kanban: src/parsers/common.ts:25`, `kanban: src/main.ts:350`): `---`, blank,
`kanban-plugin: board`, blank, `---`, blank, blank — no lanes, no settings block.

## The runtime envelope

**Every claim in this file about what the next save writes is conditional on five inputs that cannot
be read from the board file.** Two vaults holding byte-identical boards can serialise them
differently. State the envelope before comparing two saves.

1. **UI language.** The complete marker and the archive heading are localised. `t()` resolves against
   a module-scope `const` read from `window.localStorage.getItem('language')` at plugin load
   (`kanban: src/lang/helpers.ts:53`, `kanban: src/lang/helpers.ts:54`), and `completeString` is
   itself a module-scope constant (`kanban: src/parsers/common.ts:23`). English is `Complete` /
   `Archive` (`kanban: src/lang/locale/en.ts:32`, `kanban: src/lang/locale/en.ts:33`); Russian is
   `Выполнено` / `Архивировать` (`kanban: src/lang/locale/ru.ts:28`,
   `kanban: src/lang/locale/ru.ts:29`); only eight of the twenty-four locales translate these two keys
   and the rest fall back to English (`kanban: src/lang/helpers.ts:61`). **Inference:** the marker
   language is whatever was in effect when the board was last saved, and a board written under one
   language loses its complete flags and its archive under another, because neither marker matches.
2. **Vault `useTab`.** Multi-line card bodies are re-indented with a tab or four spaces, chosen from
   the vault's editor config (`kanban: src/parsers/helpers/parser.ts:35`,
   `kanban: src/parsers/helpers/parser.ts:36`); reading accepts both
   (`kanban: src/parsers/helpers/parser.ts:57`), so this is a write-side divergence only.
3. **Date and time format.** Dates written into cards use `date-format`, whose default chains through
   the daily-notes core plugin, the Natural Language Dates plugin, the Templates core plugin and
   finally `YYYY-MM-DD` (`kanban: src/components/helpers.ts:170`,
   `kanban: src/components/helpers.ts:179`, `kanban: src/components/helpers.ts:182`); `time-format`
   chains similarly to `HH:mm` (`kanban: src/components/helpers.ts:186`). **Inference:** the default
   is a property of the vault, not of the plugin.
4. **Tasks plugin enabled — asked twice, by two different routes.** The *check characters* come from
   `getTaskStatusDone()` (`kanban: src/parsers/helpers/inlineMetadata.ts:185`), which reads Tasks'
   live settings out of the editor-suggest registry
   (`kanban: src/parsers/helpers/inlineMetadata.ts:179`) and never touches `enabledPlugins`; when that
   scan finds nothing the character falls back to `x`
   (`kanban: src/parsers/helpers/inlineMetadata.ts:188`). The *completion toggle* is the one that
   consults `enabledPlugins`: `toggleTask` returns early unless `getTasksPlugin()` resolves
   (`kanban: src/parsers/helpers/inlineMetadata.ts:218`,
   `kanban: src/parsers/helpers/inlineMetadata.ts:172`). **Inference:** the two degrade differently,
   so the envelope has to record both. A vault where Tasks is enabled but the registry scan fails
   still runs the toggle — and so still gets a done date — while writing `x` instead of a custom done
   symbol; a vault without Tasks at all gets `x` and no done date. Integrations and lanes and archive
   both build on this split.
5. **Dataview plugin enabled.** Inline-field extraction runs only when Dataview is enabled
   (`kanban: src/parsers/helpers/inlineMetadata.ts:420`,
   `kanban: src/parsers/helpers/inlineMetadata.ts:456`), and its API is consulted again when a re-read
   board is diffed against the in-memory one (`kanban: src/parsers/List.ts:51`).

**Recommendation:** when reporting a board-format bug, record all five. A reproduction that omits the
UI language or the enabled-plugin set is not reproducible.

## Known gaps

- **Nothing was executed in Obsidian.** The **Experiment** ran two extracted functions and a
  reconstructed byte shape on Node. Every serialisation claim is read from `boardToMd` and
  corroborated against one sample file; none was produced by an actual save.
- **`stringifyYaml`'s exact output is not pinned here.** Its escaping, line-width and flow-style rules
  were not investigated. That comments and key order are lost follows from the input being a plain
  object, which is certain; the rendering of unusual values is not.
- **`parseYaml` was stubbed** with js-yaml's documented behaviour, not Obsidian's build. If Obsidian's
  `parseYaml` returned `{}` rather than `undefined`, the empty-frontmatter row of the first table would
  not throw; the unterminated row is unaffected, since that path never reaches `parseYaml`.
- **Micromark's frontmatter rules were not compared against the hand-rolled scanner.** Cases where the
  two could disagree — indented fences, `\r\n` line endings, four or more dashes — were not enumerated.
- **Concurrency is out of scope.** How an external edit interacts with an open board, and when
  re-parsing happens, belong to whatever artifact covers the save lifecycle.
- **Agent-behaviour evaluation has not been run** for this reference or the skill that contains it,
  and no claim about how reliably it triggers or routes is made.
