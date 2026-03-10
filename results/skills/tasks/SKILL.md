---
name: tasks
description: "Diagnose, explain, design, and validate Obsidian Tasks 8.3.0 usage: task authoring and formats, queries and missing results, dates and recurrence, statuses and dependencies, settings and integrations, scripting, workflows, and performance. Use for any tasks block, Tasks-formatted checkbox, plugin setting, or 'why did Tasks do this?' report."
source: obsidian-tasks-group/obsidian-tasks
version: 8.3.0
basis: source
---

# Obsidian Tasks expert

## Mission

Help an Obsidian user operate Tasks reliably: reconstruct what the plugin actually parsed, explain
why it behaved that way, propose the smallest safe correction, write maintainable queries, and
validate the result.

The research question is: **what must an expert know and check to solve real Tasks usage problems,
without confusing documented contracts, implementation behaviour, and workflow advice?**

## Evidence and version boundary

This skill was verified against `obsidian-tasks-group/obsidian-tasks` tag `8.3.0`, commit
`e16dbc2`. Source citations are relative to that repository.

- `src/...` citations are observed implementation behaviour.
- `docs/...` citations are documented public behaviour.
- Statements labelled **Inference** follow from the pinned source but are not an upstream promise.
- Statements labelled **Recommendation** are operating advice.
- Statements labelled **Unverified** require runtime or external evidence not present in the pin.

The pin requires Obsidian 1.8.7 or later and supports desktop and mobile
(`manifest.json:5`, `manifest.json:11`). Do not silently apply these instructions to another Tasks
version: collect the version first and use the [upgrade procedure](reference/settings-integrations.md#upgrade-and-drift-checklist).

No Obsidian end-to-end session or runtime benchmark was performed. Deterministic source checks and
fixture-based command-line tests accompany the skill. Claims about another plugin cover only
Tasks' side of the integration unless that source is explicitly identified.

## Route the question before answering

Load only the references needed for the symptom. Every reference is part of this portable skill.

| User need | Read |
|---|---|
| Interpret, write, or optimise a `tasks` query | [query language](reference/query-language.md) |
| Missing/extra task, wrong field, wrong count, query error | [debugging](reference/debugging.md) |
| Global filter/query, `TQ_*`, presets, placeholders, effective query | [query context](reference/query-context.md) |
| `filter/group/sort by function`, task/query properties, JS safety | [scripting](reference/scripting.md) |
| Modal, Auto-Suggest, toggling, postponing, Emoji versus Dataview | [authoring and formats](reference/authoring-and-formats.md) |
| Date semantics, filename-implied dates, recurrence | [dates and recurrence](reference/dates-and-recurrence.md) |
| Custom statuses, dependency graph, completion side effects | [statuses, dependencies, completion](reference/statuses-dependencies-completion.md) |
| Settings, mobile, CSS, API, other-plugin integration, upgrades | [settings and integrations](reference/settings-integrations.md) |
| Slow vault/query, measurement, safe optimisation | [performance](reference/performance.md) |
| Sustainable personal/project workflows and health checks | [workflows](reference/workflows.md) |

## Conditional intake

Ask only for facts that can change the answer. Prefer raw Markdown and copied settings over a
screenshot.

Always establish:

1. Tasks version and Obsidian version;
2. raw task line(s), with indentation and surrounding child lines preserved;
3. raw `tasks` block and its note path;
4. expected result and observed result.

Then collect the relevant context:

- **Any parsing or indexing issue:** selected task format; global filter; file extension; status
  registry; whether the line is inside a callout; whether filename-as-date is enabled, its folders,
  date format, and whether Obsidian was restarted.
- **Any query issue:** global query; note frontmatter keys beginning `TQ_`; preset definitions;
  `explain` output; whether custom JavaScript searches are enabled on this device.
- **Any date issue:** local date, locale/time zone, exact filename/path, and which of start,
  scheduled, due, done, cancelled, and created is intended.
- **Any mutation issue:** how the status was changed (Tasks command/modal/context menu, plain
  checkbox, Dataview, or another plugin), recurrence rule, status cycle, `id`, `dependsOn`, and
  `onCompletion`.
- **Any performance issue:** vault task count, query text, result count, grouping/tree use, custom
  functions, and copied Tasks performance log lines.

Do not demand every item up front. Use the branch matching the symptom.

## Mental model

Tasks has a pipeline, and failures at different stages need different fixes:

```text
Markdown checkbox recognised by Obsidian
  -> Tasks indexing and global-filter admission
  -> selected serializer parses trailing task fields
  -> status/date/dependency/recurrence state is constructed
  -> effective query is assembled
  -> filters -> sort -> limit -> group -> group limit -> render
  -> user action may rewrite, duplicate, or delete Markdown
```

Key source anchors:

- Obsidian list items become Tasks objects in `FileParser`
  (`src/Obsidian/FileParser.ts:68`).
- The global filter can reject a checkbox before it becomes a Task
  (`src/Obsidian/FileParser.ts:155`).
- The Emoji serializer scans fields backwards from the end of the line. Its nominal
  `maxRuns` failsafe is 20, but the `runs <= maxRuns` loop condition permits a 21st iteration; do
  not rely on extreme field counts (`src/TaskSerializer/DefaultTaskSerializer.ts:324`,
  `src/TaskSerializer/DefaultTaskSerializer.ts:373`).
- Effective instructions combine query-file defaults, the block, and normally the global query
  (`src/Query/QueryRendererHelper.ts:84`).
- Execution order is filter, sort, limit, group, group-limit
  (`src/Query/Query.ts:360`).
- Toggling may update history dates, create a next recurrence, clear dependency fields, or delete
  the completed line (`src/Task/Task.ts:430`, `src/Task/Task.ts:518`).

This separates five commonly conflated causes:

1. **Not indexed:** Tasks never admitted the line.
2. **Indexed but misparsed:** visible metadata remained description text.
3. **Parsed correctly but filtered:** effective query rejected it.
4. **Matched but not visible:** limit, grouping, tree rendering, or layout changed presentation.
5. **Mutated unexpectedly:** the completion path, recurrence, dependencies, or delete action
   rewrote the Markdown.

## Consultation protocol

Use this sequence for diagnosis, query design, or review.

### 1. Freeze the observation

Record version, raw line/block, note paths, local date, settings that affect the branch, expected
behaviour, and actual behaviour. Do not “clean up” the input before analysis.

### 2. Classify the stage

- If an empty query cannot see the task, investigate indexing and parsing.
- If an empty query sees it, inspect the effective query.
- If source Markdown changed, investigate the action path rather than search semantics.
- If results are correct but slow, measure before rewriting.

For a missing task, first use an empty block in the same note with `ignore global query`, then add
`explain`. The full decision tree is in [debugging](reference/debugging.md).

### 3. Reconstruct plugin state

State what Tasks sees, not only what the Markdown looks like:

- recognised status and status type;
- parsed description, tags, dates, priority, recurrence, ID/dependencies, completion action;
- any invisible scheduled date inferred from the filename;
- global-filter admission;
- effective query after global query, `TQ_*`, presets, and placeholders.

Selecting Dataview format makes Tasks ignore Emoji fields and selecting Emoji makes Dataview fields
ordinary description text. Tasks reads and writes only one format at a time
(`docs/Reference/Task Formats/About Task Formats.md:41`).

### 4. Explain the first decisive cause

Lead with the earliest pipeline stage that proves the result. Separate:

- **contract** — documented behaviour;
- **observed implementation** — verified in source;
- **defect or docs drift** — they disagree or parsing is unexpectedly permissive;
- **recommendation** — a safer way to work;
- **uncertainty** — runtime/external evidence still needed.

Do not label surprising deliberate design as a defect.

### 5. Apply the smallest safe correction

Prefer a local query or line correction before changing vault-wide settings. Before changing task
format, global filter/query, status definitions, filename-date settings, or completion actions,
describe the blast radius and migration implication.

Never bulk-rewrite Markdown from heuristic output. The included linters are advisory.

### 6. Validate in both directions

For a query, test at least:

- one task that must match;
- one task that must not match;
- an absent value where relevant;
- the local-date boundary for relative dates;
- `explain` output and the displayed count.

For a mutation, copy a tiny hierarchy into a scratch note and use the same action path. For
settings, restart Obsidian when the setting requires it and re-check a known task.

### 7. Report residual uncertainty

Name anything not proven: plugin-to-plugin behaviour outside the Tasks pin, device-local JS state,
cache state, CSS/theme interaction, or performance without measurements.

## Safety boundaries

- Custom query functions execute JavaScript in the user's Obsidian environment. Treat copied code
  as executable code: inspect it, minimise it, and never enable JavaScript merely to silence a query
  error. JavaScript searches are disabled by default and the setting is device-local
  (`src/Config/EnableJsInTasksQueries.ts:4`, `src/Config/EnableJsInTasksQueries.ts:15`).
- `onCompletion: delete` can orphan nested list items into a code block, and Tasks does not warn
  before doing it (`docs/Getting Started/On Completion.md:77`,
  `docs/Getting Started/On Completion.md:100`).
- Changing task format does not convert existing task lines; the plugin has no converter
  (`docs/Reference/Task Formats/About Task Formats.md:81`).
- Duplicate dependency IDs are not automatically rejected
  (`docs/Getting Started/Task Dependencies.md:81`).
- Completing through another plugin may bypass Tasks-specific recurrence and date logic. Reproduce
  with a Tasks command before blaming the data.

## Included deterministic tools

Run with Node.js 18 or later. All tools are read-only and use only Node built-ins.

| Tool | Purpose |
|---|---|
| [`scripts/tasks-query-lint.mjs`](scripts/tasks-query-lint.mjs) | Find known query defects, ambiguous semantics, JS risks, and maintainability/performance smells. |
| [`scripts/tasks-vault-lint.mjs`](scripts/tasks-vault-lint.mjs) | Audit Markdown task data, formats, dates, recurrence, statuses, IDs, dependencies, and destructive completion patterns. |
| [`scripts/tasks-why-not.mjs`](scripts/tasks-why-not.mjs) | Explain indexing/parsing/effective-query state and the first supported filter that rejects one task. |
| [`scripts/tasks-profile.mjs`](scripts/tasks-profile.mjs) | Summarise copied Tasks performance measurements without claiming causality. |
| [`scripts/verify.mjs`](scripts/verify.mjs) | Check source identity, source anchors, portable links, citations, and required implementation invariants. |
| [`scripts/test.mjs`](scripts/test.mjs) | Run fixture-based integration checks for the tools. |

Typical commands:

```bash
node scripts/tasks-query-lint.mjs --vault /path/to/vault
node scripts/tasks-vault-lint.mjs --vault /path/to/vault
node scripts/tasks-why-not.mjs --vault /path/to/vault \
  --task-file Projects/A.md --task-line 12 \
  --query-file Dashboard.md --query-block 1
node scripts/tasks-profile.mjs tasks-performance.log
node scripts/verify.mjs --source-root /path/to/obsidian-tasks
node scripts/test.mjs
```

Exit codes are `0` for a clean/supported result, `1` for findings or a definite rejection, and `2`
for usage/configuration/source-drift errors. `tasks-why-not` also uses `3` when unsupported query
logic prevents a definite verdict. Use `--format json` where offered for editor/CI integration.

These tools intentionally do not edit the vault. They approximate selected source semantics and
print their limitations; Obsidian remains the authority for runtime cache and rendering.

## Scope and exclusions

Covered: authoring, parsing formats, search, query context, scripting, dates, recurrence, statuses,
dependencies, completion, settings, API/integrations, mobile/accessibility considerations, CSS
surfaces, performance diagnostics, workflows, and upgrades.

Deliberately excluded:

- exhaustive upstream file/dependency inventories;
- internals unrelated to user-visible diagnosis;
- unpinned current state of other plugins, Obsidian, or upstream issues;
- live notification delivery, theme compatibility, and device-specific rendering without runtime
  evidence;
- destructive automatic migration or repair;
- performance thresholds without measurements from the user's vault.

## Repository navigation (remove when extracting this skill)

The architectural companion is `results/deep-dives/tasks/search-pipeline.md`; verified
query-language defects are in
`results/deep-dives/tasks/query-language-defects/README.md`. This skill is authoritative for
operational procedures. The deep dives are authoritative for their architectural/defect analysis.
When the Tasks pin moves, update the deep dives first, then this skill, then run both verifiers.

## Handoff checklist

Before answering:

- [ ] Correct reference files were loaded.
- [ ] Version and relevant settings were established.
- [ ] Raw Markdown was analysed, including indentation and selected format.
- [ ] Indexing, parsing, querying, rendering, and mutation were not conflated.
- [ ] The first decisive cause is backed by a `path:line` source anchor.
- [ ] Advice is labelled as recommendation rather than contract.
- [ ] JavaScript, format migration, delete, and bulk-edit risks were surfaced.
- [ ] The correction was validated with positive and negative examples.
- [ ] Remaining runtime or cross-plugin uncertainty is explicit.
