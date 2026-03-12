# Query context: what surrounds a `tasks` block

Use this reference when a block behaves differently between notes, an empty block is not actually
empty, a preset/placeholder fails, or frontmatter changes the result.

## Contents

- [Effective-query order](#effective-query-order)
- [Line continuations](#line-continuations)
- [Global filter](#global-filter)
- [Global query](#global-query)
- [Query-file defaults](#query-file-defaults)
- [Presets](#presets)
- [Placeholders](#placeholders)
- [Fast reconstruction checklist](#fast-reconstruction-checklist)
- [Failure modes](#failure-modes)
- [Validation](#validation)

## Effective-query order

Tasks constructs a query from three layers:

1. query-file defaults from the note's `TQ_*` frontmatter;
2. the literal code block;
3. the global query, normally prepended to the combined result.

The helper first generates file defaults, appends the block, and then prepends the global query
unless either local source contains `ignore global query`
(`src/Query/QueryRendererHelper.ts:78`). Instruction order matters for display options because later
options override earlier ones; filters remain conjunctive regardless of order.

`explain` reports global filter, global query, file defaults, preset expansion, placeholders, and
relative-date expansion (`src/Query/QueryRendererHelper.ts:30`). Use its output as the runtime
ground truth.

## Line continuations

Before anything is parsed, each source is split into **logical statements**, not physical lines
(`src/Query/Scanner.ts:68`). A backslash as the very last character of a line joins that line to the
next one:

- the continuation backslash and the whitespace around it collapse to a single space;
- leading whitespace on the continued line is discarded, so the second line may be indented freely;
- **two** trailing backslashes are not a continuation: they are reduced to one literal backslash;
- a statement that is empty or whitespace-only after joining is discarded;
- a query whose final line ends in a backslash still yields that statement
  (`src/Query/Scanner.ts:80`).

This happens for each source separately — the global query, the query-file defaults and the block —
and again for the text of every preset, before preset expansion and before any diagnostic looks at
an instruction. So this block contains one filter, not two:

````text
```tasks
(priority is highest) OR       \
    (priority is lowest)
```
````

The consequence when debugging: a reported line number is the *first physical line* of a statement,
and `explain` shows the joined form. If an instruction looks unrecognised, check whether the line
above it ends in a stray backslash.

## Global filter

The global filter is an indexing gate, not an invisible query filter. A task line must contain its
plain substring to become a Tasks task (`src/Config/GlobalFilter.ts:52`,
`src/Obsidian/FileParser.ts:155`).

Consequences:

- `#task` also admits `#tasks` because matching uses `String.includes`.
- Description filters remove the global-filter substring from the value they search
  (`src/Query/Filter/DescriptionField.ts:28`), and an exact global-filter tag is removed from
  `task.tags` during parsing (`src/Task/Task.ts:265`). The raw task description itself is retained.
- A query cannot recover a checkbox rejected by the global filter.
- Changing the global filter changes vault-wide indexing; restart/reload and revalidate.

**Diagnostic:** put an empty block in the same note with `ignore global query`. If the line still
does not appear, inspect global-filter admission before query filters.

## Global query

The global query applies to every block unless the local source says `ignore global query`.
Configuration rejects instructions that would make the global query recursively or globally
unsafe, including `ignore global query` itself (`src/Config/GlobalQuery.ts:55`).

Use a global query for an invariant such as `not done`, not for note-specific layout or a fragile
date window. A hidden global query is a common cause of “the block contains no filter but the task is
missing”.

## Query-file defaults

Frontmatter keys are mapped into Tasks instructions by `QueryFileDefaults`
(`src/Query/QueryFileDefaults.ts:51`). Supported keys in 8.3.0 include:

| Frontmatter family | Generated instruction |
|---|---|
| `TQ_show_*: true/false` | `show ...` / `hide ...` |
| `TQ_explain: true` | `explain` |
| `TQ_short_mode: true/false` | `short mode` / `full mode` |
| `TQ_extra_instructions: |-` | inserted query lines |

The exact property mapping and generated text live in
`src/Query/QueryFileDefaults.ts:51` and `src/Query/QueryFileDefaults.ts:193`.

Rules:

- Keys are note frontmatter, not plugin settings.
- `TQ_extra_instructions` may contain filters, sorting, grouping, and layout. Treat it as hidden
  query source during debugging.
- A Canvas card has no note frontmatter, so query-file defaults are unavailable
  (`docs/Queries/Query File Defaults.md:23`).
- Prefer `explain` over mentally merging the layers.

## Presets

`preset <name>` expands configured lines and parses them as ordinary instructions
(`src/Query/Query.ts:520`). `{{preset.<name>}}` inserts preset text as a placeholder, including
inside a line. Unknown names produce an error listing available presets
(`src/Query/Presets/Presets.ts:41`).

Built-ins are defined in `src/Query/Presets/Presets.ts:2`:

| Preset | Operational meaning |
|---|---|
| `this_file` | path equals/includes the query note path |
| `this_folder` | query note folder and descendants |
| `this_folder_only` | exact folder via custom JS; requires JavaScript opt-in |
| `this_root` | query note root folder |
| `hide_date_fields` | hide date components |
| `hide_non_date_fields` | hide ID/dependency/recurrence/completion/priority |
| `hide_query_elements` | hide toolbar and action/backlink UI |
| `hide_everything` | combined hide presets |

The whole-line `preset <name>` instruction cannot itself be a Boolean sub-filter. The placeholder
form `{{preset.<name>}}` can insert a partial Boolean expression
(`docs/Queries/Presets.md:62`). For a portable block, prefer built-ins or include the preset
definition in the handoff.

**Which map is in force.** Those eight are *defaults*, not a floor. Loaded settings replace the
preset map wholesale rather than merging into it (`src/Config/Settings.ts:218`), so:

| Vault `data.json` | Presets in force |
|---|---|
| has a `presets` key | exactly that map — a built-in the user deleted stays deleted |
| has only the legacy `includes` key | that map, migrated (`src/Config/Settings.ts:286`) |
| has neither key | the eight pinned defaults (`src/Config/Settings.ts:113`) |

Both directions produce a wrong answer if you assume the wrong map: a valid built-in looks unknown
when you assume an empty map, and a deleted built-in looks available when you assume the defaults.
Ask for `data.json`, or read the `presetsOrigin` field the bundled linters report.

**Presets are not a blind spot.** A preset body is ordinary instruction text, so a risky
instruction — a `filter by function`, an unsupported keyword, a second `limit` — is exactly as
consequential inside a preset as in the block, and `explain` is what shows it. The bundled linters
diagnose every effective statement and name its origin for the same reason. Note that nested
presets recurse without a cycle guard in the plugin (`src/Query/Query.ts:520`); a cyclic definition
is a vault-level defect to fix, not something to trigger.

## Placeholders

Known `query.*` placeholders resolve from the note containing the block. The implementation exposes
file path/folder/root/name, links/tags, and case-insensitive frontmatter property lookup
(`src/Scripting/KnownPlaceholderResolver.ts:19`, `src/Scripting/TasksFile.ts:218`).

Common forms:

```text
{{query.file.path}}
{{query.file.folder}}
{{query.file.root}}
{{query.file.filename}}
{{query.file.property('project')}}
{{query.file.hasProperty('project')}}
```

The documented property and preset forms are listed in
`docs/Scripting/Placeholders.md:71`. Unknown placeholders error; unavailable query-file context
also errors (`docs/Scripting/Placeholders.md:88`).

### Comment divergence

Inline `{{! ... }}` comments are removed. For whole-line `#` comments, source checks whether the
line is a comment after the no-file placeholder guard (`src/Query/Query.ts:174`). In a normal note,
placeholder-looking text in a `#` comment is skipped; without file context it may error first — so
the same comment behaves differently depending on whether query-file context exists. This is
finding **D4** of the paired query-language defect analysis. Treat it as implementation behaviour,
not a portable technique.

## Fast reconstruction checklist

When two identical blocks differ:

1. confirm both note paths and file types;
2. copy each note's `TQ_*` frontmatter;
3. copy the global filter and global query;
4. confirm preset definitions on that device/vault;
5. add `explain`;
6. compare the expanded queries line by line;
7. only then inspect cache or task parsing.

The included query linter assembles this context for Markdown notes when configuration is available,
but Obsidian's rendered `explain` remains authoritative.

## Failure modes

| Symptom | Likely cause | Probe |
|---|---|---|
| Empty block excludes completed tasks | global query contains `not done` | `ignore global query`, then `explain` |
| Same block differs by note | `TQ_*`, path placeholder, or file preset | compare frontmatter and expansion |
| Preset works only on one device | custom preset/settings differ | copy preset definition |
| `this_folder_only` errors | JavaScript searches disabled | enable only after security review, or use a non-JS path design |
| Placeholder has no value | missing property or no query-file context | `hasProperty`, inspect note type |
| Query in Canvas ignores defaults | Canvas has no frontmatter | put instructions in block/global query |

## Validation

Use one block containing `explain` in each relevant note. Verify that the printed effective query
contains the expected global query, `TQ_extra_instructions`, preset expansion, and concrete
placeholder values. Then test one task that each hidden layer should admit and one it should reject.
