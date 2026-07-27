---
name: obsidian-kanban-plugin
description: "Explain, validate, migrate, and safely edit Obsidian Kanban 2.0.51 boards: the Markdown board format and what a save rewrites or deletes, lane and card mechanics, the done column and its completion date, the archive, board settings, and programmatic card operations from outside Obsidian. Use for any note carrying `kanban-plugin` frontmatter or a `%% kanban:settings %%` block, any question about how a Kanban board behaves, and any script or agent that edits one. For Tasks-format checkbox fields and `tasks` queries use the Obsidian Tasks skill; for `dataview` fences use the Obsidian Dataview skill."
source: obsidian-community/obsidian-kanban
version: 2.0.51
basis: source
---

# Obsidian Kanban expert

## Research question, scope, and exclusions

**What must an expert know to decide whether a Kanban board file is correct, to change its shape
without losing anything, and to let a program manage cards on it so the result is the board the
plugin itself would have written?**

In scope: the board file format and its round-trip contract; lanes, work-in-progress limits, the
complete marker and the archive; card anatomy from the checkbox to inline metadata; the settings
model and where each setting physically lives; the completion mechanic Kanban delegates to the Tasks
plugin; what an external write races against; validation, diagnosis and migration.

Deliberately excluded, with the owner named where one exists:

- Tasks query syntax, task field semantics and Tasks' own settings — the Obsidian Tasks skill owns
  those. This skill covers only Kanban's side of the integration.
- Dataview query languages — the Obsidian Dataview skill owns those.
- Plugin and theme development — a separate skill owns that.
- Rendering, drag-and-drop internals, the table and list views beyond how they change the file, CSS
  and theming.
- Anything requiring a running Obsidian session. None was performed.

This skill is authoritative for everything in scope. **No paired deep dive exists**; nothing here
defers to another artifact.

## Sources and evidence

| Alias | Repository | Commit | Role |
|---|---|---|---|
| `kanban` | obsidian-community/obsidian-kanban, tag 2.0.51 | `8501981a1afacb4c8fc03ec60604aa5eedfbd857` | Primary. Authoritative. |
| `tasks` | obsidian-tasks-group/obsidian-tasks, tag 8.3.0 | `e16dbc2cf509420459ea04094a1d834ae89e0019` | Supporting. Authoritative only for the completion behaviour Kanban delegates to. |

Citations are backtick code spans carrying the alias and a line, as in
`` `kanban: src/parsers/formats/list.ts:404` ``. Within the primary source there are two bases:
`src/…` is implementation read directly, and `docs/…` is the plugin's own documentation vault. **The
documentation predates this version and documents no file-format detail at all** — not the
frontmatter key, not the settings block, not the complete marker, not the date syntax. Where the two
disagree, the code wins and the disagreement is recorded.

Every claim is labelled: **Contract** (documented in `docs/`), **Observed** (read in implementation
source), **Inference** (follows from the pin but is not promised), **Recommendation** (operating
advice), and **Unverified** (needs evidence this skill does not have). Because the documentation
covers so little, most of what follows is **Observed**; a code-derived invariant is never a
**Contract**, however reliable it looks.

The pin declares a minimum Obsidian version of 1.0.0 and is not desktop-only
(`kanban: manifest.json:5`, `kanban: manifest.json:10`). No behaviour here was checked on mobile.

## Intake before answering

Ask only for what changes the answer.

Always establish:

1. the raw Markdown of the board, including its frontmatter and its settings block;
2. what was expected and what happened.

Then the branch that matches:

- **Anything about what a save will do:** Obsidian's UI language, whether the Tasks and Dataview
  plugins are enabled, and whether the vault indents with tabs or spaces. These change what a board
  *means*, and none of them can be read from the file. The language in particular lives in the app's
  own `localStorage` under `language`, not anywhere in the vault, and an unset value resolves to
  English (`kanban: src/lang/helpers.ts:53`, `kanban: src/lang/helpers.ts:54`). Ask the user, or read
  a marker off an existing board and work backwards; there is nothing to grep for.
- **A missing or mangled card:** the lane it was in, whether the board was open at the time, and
  whether anything edited the file from outside Obsidian.
- **The done column:** whether the Tasks plugin is installed, which lane carries the complete marker,
  and how the card was moved — dragging, the card menu, or the checkbox. They do different things.
- **A settings problem:** the settings block verbatim, and whether any Kanban key is in the YAML
  frontmatter instead.
- **A migration:** the current and target lane sets, and whether every board shares the same shape.

## Mental model

```text
file bytes
  -> trimmed, then frontmatter parsed from byte 0     (throws if it does not start with ---)
  -> settings read by scanning backwards for a fence  (any trailing fence, marker never checked)
  -> block scan: every root heading is a lane; the first list after it is its cards
  -> hydration: dates and times parsed, links resolved, other plugins consulted
  -> in-memory board  <- every UI action mutates this
  -> boardToMd rewrites the WHOLE file from the model
```

Operational consequences, in the order they bite:

1. **The model is the file.** Anything the model cannot hold — prose between lanes, a second list
   under one heading, a complete marker in the wrong place — is gone the next time the board saves.
2. **A save is a whole-file rewrite from memory.** No diff, no mtime check, no conflict detection.
3. **Saves happen with no user action.** Collapsing a lane, resizing a table column, or exceeding
   the archive size limit each write the file.
4. **The structural markers are localised.** `**Complete**` and `## Archive` are written in
   Obsidian's UI language, resolved once when the plugin loads.
5. **Kanban never writes a completion date.** That is the Tasks plugin, invoked by Kanban.

## Route the question

Load only what the question needs. Every reference is part of this portable skill.

| Need | Read |
|---|---|
| The file's four regions, what a save rewrites, what it deletes | [board format](reference/board-format.md) |
| A card line: checkbox, text, dates, tags, links, block ids, inline metadata | [card anatomy](reference/card-anatomy.md) |
| Lanes, work-in-progress limits, the complete marker, the archive | [lanes and archive](reference/lanes-and-archive.md) |
| A setting's key, scope, default, and whether it changes parsing | [settings](reference/settings.md) |
| Editing a board from a script or an agent, and the done-column mechanic | [safe mutation](reference/safe-mutation.md) |
| Changing lane shape, merging columns, moving the done column | [migrations](reference/migrations.md) |
| Is this board correct, and why did it do that | [validation and diagnosis](reference/validation-and-diagnosis.md) |
| Tasks, Dataview, daily notes, templates, and the other board views | [integrations](reference/integrations.md) |

## Consultation protocols

### Answering a question about behaviour

1. Establish the version and the runtime envelope from the intake list above.
2. Name the pipeline stage the question lives in: parsing, hydration, a UI action, or serialisation.
   Most confusion comes from conflating "what the file says" with "what the model holds".
3. Answer from the pinned source, with a `path:line` citation, and label the claim.
4. Say explicitly when the answer depends on something outside the file, and on what.

### Deciding whether a board is correct

1. Run [`scripts/kanban-board-lint.mjs`](scripts/kanban-board-lint.mjs) with the vault's UI language.
2. Fix `error` findings before anything else: they mean the board does not load, or the next save
   deletes something.
3. Read the `assumptions` block before acting on a `warning`. Several rules depend on the language
   and on which other plugins are installed.
4. Re-run and compare the finding set, not the count.

### Editing cards

1. Read the safe mutation reference. The concurrency contract is the part that loses work.
2. Confirm the board is closed in Obsidian; if it cannot be, accept that the edit may be overwritten.
3. Run [`scripts/kanban-card.mjs`](scripts/kanban-card.mjs) without `--write` and read the diff and
   the mechanics it lists.
4. Re-run with `--write`. The tool compares the file against the bytes it read, keeps a backup, and
   re-checks after `--settle-seconds` that the write survived.
5. Lint the board again.

### Recovering an edit that was lost anyway

The plugin has no undo for a save it made from memory, so recovery is entirely outside it. In order
of how much they preserve:

1. **The `.bak` sibling** the writing tools leave, which holds the file exactly as it was read. A
   refusal after a lost write names it.
2. **Obsidian's own File Recovery**, which keeps periodic snapshots of every note and is the only
   route that survives a loss nobody noticed at the time. That is an Obsidian feature, outside both
   pins and not verified here — check that it is enabled before relying on it. **Unverified**.
3. **Version control**, if the vault is under it. A board is a text file; a migration is a diff.

Before any of them: stop touching the board and close it in Obsidian, because an open board can
overwrite the recovered file the same way it overwrote the original.

### Migrating a workflow

1. Close the boards.
2. Lint first, so a pre-existing defect is not blamed on the migration.
3. Write a plan, run [`scripts/kanban-migrate.mjs`](scripts/kanban-migrate.mjs) without `--write`,
   and read every diff.
4. Apply, lint again, then open one board and confirm the done column still marks cards complete.

## High-risk traps

- **An open board overwrites external edits.** There is no lock and no conflict detection, and the
  overwrite can arrive seconds later with no user action. This is the single largest risk in
  everything this skill does.
- **Content the model cannot carry is deleted on save**, silently and without a prompt.
- **A complete marker after the cards is ignored and then deleted**, taking the lane's done-column
  behaviour with it.
- **The markers are language-dependent.** Eight of the twenty-four languages the plugin knows
  translate the complete and archive markers; the rest fall back to English. Moving a board between
  two languages that spell them differently loses its done column and its archive.
- **No Tasks plugin, no completion date.** A skill or script that promises a `✅` date on a vault
  without Tasks is promising something the plugin does not do.
- **A recurring card is two cards.** Completing one through Tasks creates the next occurrence; an
  external edit that writes one card has dropped it.
- **`max-archive-size` deletes archived cards on render**, without asking. It keeps the tail of the
  archive, so it deletes from the front — which is the oldest entries only when they all arrived by
  archiving one card at a time. Archiving a whole lane puts its cards at the front, so those are the
  ones the very next render deletes.
- **A lane title ending in `(12)` is a work-in-progress limit**, not part of the title.
- **Kanban settings written into YAML frontmatter migrate into the settings block** on the next save
  and disappear from the YAML.

## Bundled tools

Node 18 or later, no dependencies, no network. All paths are given by the caller; there is no default
that silently scans the working directory.

| Tool | Purpose and invocation |
|---|---|
| [`kanban-board-lint.mjs`](scripts/kanban-board-lint.mjs) | Find every board in a vault and report what is wrong and what the next save changes. `node scripts/kanban-board-lint.mjs --vault /path/to/vault --locale ru --format sarif` |
| [`kanban-card.mjs`](scripts/kanban-card.mjs) | Inspect and change cards, imitating the plugin's own mechanics. `node scripts/kanban-card.mjs move --vault V --board Board.md --lane Doing --index 0 --to-lane Done --tasks-emoji --write` |
| [`kanban-migrate.mjs`](scripts/kanban-migrate.mjs) | Apply a declarative workflow migration to one board or a whole vault. `node scripts/kanban-migrate.mjs --plan plan.json --vault V --write` |
| [`verify.mjs`](scripts/verify.mjs) | Check source identity, citations, portability and the values this skill ported out of the pin. |
| [`test.mjs`](scripts/test.mjs) | Run the fixture-based integration checks for the tools. |

Severity is derived, never chosen. A rule declares what happens to the board — the board does not
load, content is lost, the meaning differs, bytes change on save, or it is informational — and the
severity follows from that. What this buys is consistency: two rules with the same consequence cannot
disagree about how serious they are, and `verify.mjs` re-derives every severity from its declaration.
What it does not buy is correctness of the declaration itself; a rule that names the wrong
consequence is still wrong, and only reading it against the pinned source catches that.

Exit codes are shared across the bundled harnesses: `0` clean, `1` findings or a failed check, `2`
usage error, `3` required material missing, `4` source-identity mismatch. The two writing tools
document one extension, `5`, for a request that was understood and refused — an unparseable board, an
ambiguous card, a recurrence this tool will not fake, or a file that changed underneath it.

`kanban-card.mjs` and `kanban-migrate.mjs` are the only tools that write, and only with `--write`.
Both compare the file against the bytes they read before touching it, keep a `.bak` sibling unless
`--no-backup` says otherwise, and read the file back afterwards. `--strategy normalize` additionally
rewrites the whole file the way the plugin would; the default splices only the lines it changed, and
both refuse a frontmatter richer than flat key-and-value lines rather than rewriting one they only
partly read.

Because the plugin itself is inconsistent about when the complete mechanic runs, a move has to say
which path it imitates: `--via drag` applies it, as dragging and the checkbox do, and `--via menu`
does not, as the card menu's move-to-list does not.

Every report carries an `assumptions` block naming what could not be read from the file, and a
`limitations` block naming what the tool cannot decide.

## Validate before handoff

1. The version was established, and the answer is not silently applied to a different one.
2. The runtime envelope was established: language, Tasks, Dataview, indentation.
3. Every material claim carries a `path:line` citation and a label.
4. Contract, observed behaviour, inference and recommendation are not blended together.
5. A proposed edit was shown as a diff before being applied.
6. After any write, the board was linted again and the finding set compared.
7. Remaining uncertainty is named, including anything that needs a running Obsidian.

## Limitations and conflicts

- **No Obsidian session was run.** Everything here is read from pinned source. Runtime behaviour,
  timing, mobile behaviour and theme interaction are **Unverified**.
- **Upstream ships no test suite.** The parser this skill ports has no upstream oracle; the fixtures
  beside the tools are the only check that the port agrees with the pin.
- **The port is a port, not a Markdown implementation.** Block structure is recognised for the
  constructs a board contains. Anything it cannot classify is reported, and the writing tools refuse
  rather than guess.
- **A citation check proves a line exists, not that the sentence beside it is true.**
- **The two pins move together or not at all.** The completion claims join Kanban's delegation to
  Tasks' behaviour; bumping one without re-reading the other invalidates them.
- **Agent behaviour is not evaluated.** How this skill triggers and routes in a clean context has not
  been measured, and nothing here is evidence about it.

| Conflict | Sides | Resolution |
|---|---|---|
| Whether the plugin's documentation describes this version | `docs/` predates the pin and documents no file format | Follow `src/`; treat `docs/` as evidence of intent and of user-facing naming only |
| The note folder setting | `kanban: docs/Settings/Note folder.md:2` says the *template* setting picks the folder | A documentation defect; the folder setting picks the folder |
| Whether a trailing space after `%%` destroys the settings | A plausible reading of the footer scanner says yes | It does not: the board text is trimmed before parsing. Non-whitespace content after `%%` does destroy them |
| Which move applies the complete mechanic | Dragging and the checkbox do; the card menu's move-to-list does not | Both are the plugin; say which path is being imitated |

## Reference map

| Reference | Owns |
|---|---|
| [board format](reference/board-format.md) | The file as a whole: regions, parsing, serialisation, what is dropped, the runtime envelope |
| [card anatomy](reference/card-anatomy.md) | One card line and everything inside it |
| [lanes and archive](reference/lanes-and-archive.md) | Lanes, limits, the complete marker, the archive |
| [settings](reference/settings.md) | Every settings key, its scope, default and effect |
| [safe mutation](reference/safe-mutation.md) | Writing from outside Obsidian, and per-operation mechanics |
| [migrations](reference/migrations.md) | Changing board shape, and the plan format |
| [validation and diagnosis](reference/validation-and-diagnosis.md) | The rule catalogue and symptom-to-cause routes |
| [integrations](reference/integrations.md) | Tasks, Dataview, daily notes, templates, other views |

## Repository-only verification (remove when extracting this skill)

This section is the only place in this skill that names repository paths, and extraction deletes it.

The aggregate gate is `make lint`; this skill contributes two entries to its summary,
`kanban-test` and `kanban-verify`. Directly:

```sh
node results/skills/kanban/scripts/test.mjs \
  --source-root research/plugins/obsidian-community/obsidian-kanban \
  --tasks-root research/plugins/obsidian-tasks-group/obsidian-tasks

node results/skills/kanban/scripts/verify.mjs \
  --source-root research/plugins/obsidian-community/obsidian-kanban \
  --tasks-root research/plugins/obsidian-tasks-group/obsidian-tasks
```

Identity is anchored on the content of the checkouts, not on their paths: the primary source is
accepted only when `src`, `docs` and the three manifest files hash to the reviewed fingerprint, and
the supporting source only when every cited file matches its recorded hash. A moved pin exits `4`;
an unhydrated submodule exits `3`.

When either pin moves: re-read the citations that touch the changed files, update `version` and the
commits recorded above, run `verify.mjs --write-fingerprints`, then run both gates. The recorded
commits are provenance metadata — content identity comes from the fingerprints, not from them.

The two research submodules are read-only material and are left at their pins with clean worktrees.
