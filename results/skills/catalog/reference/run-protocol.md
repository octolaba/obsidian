# Run protocol

How a run is driven, what it records, and what it is allowed to leave behind.

## Three stages, on purpose

| Stage | Network | Writes | Refuses to run without |
| --- | --- | --- | --- |
| `capture` | yes | the cache only (`docs/.catalog/`) | a recorded user agent |
| `render` | no | notes and the Run Report | a bodies file and a Release Pin |
| `rebaseline` | yes (re-capture only) | the cache and a Run Report | a latest successful Run Report |

Splitting them is what makes the semantic step reviewable: after `capture`, everything a body may
be grounded in sits in `queue.json` as recorded evidence, and `render` refuses any body that fails
validation. A run that cannot write a body leaves the note unwritten rather than writing a note
with an invented one.

Every run starts from a clean committed working tree, and **the agent never commits**. The working
tree is the staging area; the human's diff review is the apply gate.

## Pacing

Recorded run inputs, reported in every Run Report:

```json
{ "concurrency": 1, "intervalMs": 1500, "retries": 2, "backoffMs": 5000,
  "throttleAbortAfter": 3, "timeoutMs": 30000 }
```

Plus the user agent, which must be contactable. The Directory publishes no robots policy, so these
defaults err polite rather than fast. A 429 or a repeated 5xx counts as throttling; the third one
aborts the run cleanly with exit 5 rather than pushing through.

GitHub is batched instead of throttled: one query carries up to 20 repositories for 1 point. At 40
the API answers HTTP 200 with an empty body, which the client reports as "reduce --batch-size".

Repository capture is lookup-first: a repository already in the catalog costs no call. A **template
migration is the exception**, because the note's data block is rendered from the *record*, not from
the note — `--refresh-repositories` re-captures every selected repository even when its identity
already resolves offline. Use it only when the rendered shape changes; a normal run must not.

## What the cache holds, and why losing it is cheap

`docs/.catalog/` is gitignored and disposable (decision 3.10):

| File | Holds | Recovered by |
| --- | --- | --- |
| `ledger.json` | repository identity mappings, capture hashes, batch checkpoints | note frontmatter; a re-baseline pass |
| `captures.json` | the run's captured records and costs | re-capturing |
| `queue.json` | the body tasks and their recorded inputs | re-capturing |
| `bodies.json` | staged bodies for one render | the notes themselves already carry the landed bodies |

Sync State does **not** live here. Its durable copy is the `sync state` field in the frontmatter of
the latest successful Run Report, and the gate reads it from there.

### The recovery rehearsal (§7.3), performed 2026-08-06

```sh
rm -rf docs/.catalog
node scripts/run.mjs --stage rebaseline --release-mirror-root … --templates-root … \
  --catalog-root <catalog tree> --runs-root <Run Report directory> --user-agent '…'
```

Result, recorded in the run report `2026-08-06T163657Z-rebaseline`: Ledger absent at start; Sync
State recovered from the previous successful report; 26 repository identities rebuilt from note
frontmatter; **26 capture baselines recorded, 0 body tasks queued, 0 notes changed**. The run after
it captured 0 repositories and queued 0 bodies — the double-run proof.

One thing the rehearsal exposed and the pipeline now fixes: a repository that GitHub answers under
a **new name** (`obsidian-community/obsidian-kanban` → `community-archive/obsidian-kanban`) could
be re-resolved offline only through the Ledger, because the note's aliases carried the current name
and the index carried the old one. The resolver now records the index string as a former full name
on the repository note, so after a cache loss the row resolves from the catalog with no network call
at all. Verified: the same selection re-captured 0 repositories on the following run.

## The Run Report

Versioned Markdown under the injected runs root, named for its UTC start. The frontmatter is the machine
surface:

```yaml
run: 2026-08-06T163517Z-backfill-pilot
kind: backfill-pilot
status: success          # only a successful run advances Sync State
pin: 8023933…
sync state: 8023933…     # empty unless status is success
started at / finished at: ISO 8601 UTC
model: claude-opus-5-medium   # the short model id, and nothing else
```

Owner decision, 2026-08-06: the frontmatter stays scalar and machine-facing. `model` carries the
short model id alone; the **prompt identity and the pacing parameters live in the body**, in a
`Parameters` section holding one formatted JSON block — model, prompt, user agent, pacing. An
escaped one-line JSON string in a YAML property was neither readable nor diffable, and nothing
parses it.

The prose carries: scope, tasks by class, per-entity capture statuses with access dates, GraphQL
cost, failure lanes, rejected bodies, the `Parameters` block, and the two fenced blocks the gate
parses:

````text
```unresolved-repository-links
plugins/Obsidian plugin - example.md
```

```bodyless-no-input
repositories/GitHub - 290488477.md
```
````

Each line is a catalog-relative note path. A note listed in the first fence is allowed to have no
repository link; a note listed in the second is allowed to have no body. A note missing either and
listed in neither is a gate finding — that is how a knowing miss stays distinguishable from a broken
render, and an entity whose recorded inputs carry no usable semantic content from a body pass that
never ran.

**Every report-writing stage recomputes both fences over the whole catalog**, not over the notes it
happened to touch: the gate reads the latest successful report alone, so a stage that left a fence
empty would erase the record. The two are recomputed differently, because only one of them is
visible on disk. `unresolved-repository-links` is derived from the catalog. `bodyless-no-input` is a
*reason*, so an entry is written only when this run classified the entity as having no usable
recorded input, or a previous report already recorded it — and either way only while the note is
still body-less. A note awaiting a body pass is therefore never fenced, and its empty body stays a
loud `catalog/block-order` finding.

**The file name is the report's clock, and it decides ordering.** `latestSuccessfulRun` sorts by file
name, so a report stamped ahead of the host clock silently makes itself current. A report whose name
disagrees materially with its file mtime is repaired: renamed to the mtime in the same UTC scheme and
annotated with a `clock note` in its frontmatter. Recorded data, counts, fences and prose are never
edited by that repair, and `run` keeps the value the writer stamped.

## Resumption and abort

- A Ledger checkpoint is written after every GraphQL batch, so an interrupted capture restarts at
  the batch boundary and repeats no captures.
- Failures are queued in the versioned Run Report and retried on later runs regardless of whether
  the pin moved.
- Sync State advances only on success. A failed run leaves the previous Sync State in place, which
  keeps the gate's staleness answer correct.
- Executed deletions must reconcile exactly with the classifier's Removed set; any excess aborts.

## Migrations

A change to a template — or to the renderer's output shape — is a migration, not drift: an explicit
catalog-wide re-render recorded in its own Run Report. The data-block migration of 2026-08-06 is the
worked example. It re-captured the 26 pilot repositories (`--refresh-repositories`, 3 metadata + 3
blob requests, 6 GraphQL points) because the filled block is rendered from the record, re-captured
the 27 Directory pages at the recorded pacing, queued **zero** body tasks (no recorded input moved,
so no prose was allowed to change), and re-rendered all 53 notes. Rendering twice produced identical
bytes — the proof a migration owes its reviewer.
