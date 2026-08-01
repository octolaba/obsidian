# Run protocol

How a run is driven under the state model (decision 3.11), what it records, and what it is
allowed to leave behind. There is no Ledger and there are no Run Reports: durable state that
would only restate the notes or git history is not kept.

## Catalog state is exactly three things

| Store | Holds | Versioned |
| --- | --- | --- |
| the notes | identity (`uid`, `xid`, aliases) and the captured baselines (the filled data block) | yes |
| the live state file | Sync State (`base pin`), the current run (`target pin`, `run`, `model`, `pacing`), the worklists, the standing exceptions | yes |
| receipts | one compact record per completed run | yes |

The cache (`docs/.catalog/`: `captures.json`, `queue.json`, `bodies.json`) is per-run scratch.
Losing it costs a re-capture of whatever the next run touches; there is nothing in it to recover
and no recovery stage exists.

## The live state file

One file, beside the receipts. The coordinator is its only writer.

```markdown
---
base pin: 8023933…       # Sync State: the pin the catalog reflects; advances only at finalize
target pin: 9a1b2c3…     # the pin being processed; absent while idle
run: 2026-08-11          # date label; a same-day second run appends -2; also the receipt filename
model: <short model id>
pacing: interval 1500ms, batch 20
---

## Dump

- [x] repo obsidianmd/obsidian-releases
- [/] plugin dataview
- [>] plugin daily-five — github-missing (repo 0libote/daily-five)
- [-] repo Quinta0/Northern-Sky — bodyless-no-input (readme sha 4ac31d79…)

## Sync

- [ ] plugin dataview — description changed, body queued

## Drop

- [x] theme crafted — removed at pin
```

Grammar, deliberately strict (`scripts/state.mjs` rejects anything else): the three sections in
that order, items only of the form `- [M] <repo|plugin|theme> <id>` with an optional ` — reason`
tail. Markers: `[ ]` todo, `[/]` handed to a subagent (ephemeral — a resume reads it as todo),
`[x]` done, `[-]` failed or accepted-standing, `[>]` known miss retried next run.

**`[>]` and `[-]` lines are the standing exceptions.** They survive the post-run reset in place —
there is no separate exceptions section and nothing moves between sections. Each line binds itself
to its subject: the typed id, the reason, and for `bodyless-no-input` the README blob sha that was
judged ungroundable, so a moved input re-opens it. The gate reads these lines as its excuse list
and rejects a stale one (the note gained a body or a link, or the line resolves to no note).

## A run, in order

1. **Worklist.** The coordinator sets `target pin`, diffs `base pin → target pin`, and writes the
   classified items into the sections. On resume it re-derives the same list and reconciles it
   with the file; a mismatch aborts loudly. `[>]` lines seed the worklist automatically.
2. **Capture** (`--stage capture`) — the only networked stage. Batched GraphQL metadata, one REST
   `/readme` call per captured repository, paced Directory pages. Change detection reads the
   note's own data block: a body task is queued exactly when the note is missing or a recorded
   input moved. Evidence and the queue land in the cache.
3. **Agent pass.** Subagents receive the recorded inputs for a batch and return one body per
   queued task into a bodies file. They never touch disk or the state file.
4. **Render** (`--stage render`) — offline and mechanical. Validates every body, lands notes,
   ticks `[x]` on what it wrote, and writes `[-] … bodyless-no-input (readme sha …)` for what it
   classified. `github-missing` and other capture-side lanes are the coordinator's lines.
5. **Gate** — offline, must be green over the finished worklists.
6. **Finalize** (`--stage finalize --gate-status <result>`) — refuses while any `[ ]`/`[/]` item
   remains or an exception lacks a reason; writes the receipt with exclusive-create semantics;
   resets the live file: `base pin` := `target pin`, target cleared, `[x]` dropped, exceptions
   kept. Idempotent: a crash before the receipt resumes normally; after it, the receipt's
   existence makes the reset re-runnable.

The human reviews the working-tree diff — notes, state file, receipt — and commits. The agent
never commits.

## The receipt

Compact by decision — the worked checklist is not archived, because the catalog diff in git
already records the work. Frontmatter: `run`, `base pin`, `target pin`, `started at`,
`finished at`, `model`, `pacing`, `gate`. Body: per-section done/failed/retry counts and the
standing exceptions as they were left. Exclusive create: finalising twice under one run label is
an error, not an overwrite.

## Pacing

Recorded run inputs, carried in the state file's frontmatter and into each receipt:

```json
{ "concurrency": 1, "intervalMs": 1500, "retries": 2, "backoffMs": 5000,
  "throttleAbortAfter": 3, "timeoutMs": 30000 }
```

Plus the user agent, which must be contactable. The Directory publishes no robots policy, so these
defaults err polite rather than fast. A 429 or a repeated 5xx counts as throttling; the third one
aborts the run cleanly with exit 5.

GitHub metadata is batched instead of throttled: one GraphQL query carries up to 20 repositories
for 1 point. At 40 the API answers HTTP 200 with an empty body, which the client reports as
"reduce --batch-size". The README pass is REST (`GET /repos/{owner}/{repo}/readme`, one call per
captured repository — decision 3.8) and counts against the separate
5,000-per-hour REST budget, so a full-catalog refresh spans budget windows; the worklist's
unchecked items make the pause a resume, not a loss.

Repository capture is lookup-first: a repository already in the catalog costs no call. A
**template migration is the exception**, because the note's data block is rendered from the
*record*, not from the note — `--refresh-repositories` re-captures every selected repository even
when its identity already resolves offline. Use it only when the rendered shape changes.

## Migrations

A change to a template — or to the renderer's output shape — is a migration, not drift: an
explicit catalog-wide re-render worklist in the state file, finalised like any run. Prove the
result by rendering twice and diffing: a migration owes its reviewer byte-identical output.

The repository-template migration — GraphQL field names, the grouped contract, the node id
leading `xid`, the REST README — is **pending**: every repository note rendered under the
previous contract awaits the re-render, and until that run lands the gate reports each one as
`catalog/bad-repository-xid` (xid order) and `catalog/data-block-drift`. That red state is the
migration signal working as designed, not a defect to silence.
