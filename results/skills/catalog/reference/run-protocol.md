# Run protocol

How a run is driven under the state model (decision 3.11), what it records, and what it is
allowed to leave behind. There is no Ledger and there are no Run Reports: durable state that
would only restate the notes or git history is not kept.

## Catalog state is exactly three things

| Store | Holds | Versioned |
| --- | --- | --- |
| the notes | identity (`uid`, `xid`, aliases), lifecycle home (live or archived), and the captured baselines (the filled data block) | yes |
| the live state file | Sync State (`base pin`), the current run (`target pin`, `run`, `model`, `pacing`), the worklists, the standing exceptions | yes |
| receipts | one compact record per completed run | yes |

The injected support root contains two lifetimes: versioned `archive/`, and disposable direct
children such as `captures.json`, `queue.json`, `bodies.json` and `archive.json`. Losing only those
scratch files costs a re-capture of whatever the next run touches; there is nothing in them to
recover and no recovery stage exists. The one thing that is not re-derivable is the archive's move
manifest between the archive step and `finalize`: losing it there costs the receipt its hash table,
so the two run in one session. The archive itself is not cache and must survive.

## The live state file

One file, beside the receipts. Four stages write it, and no two of them run at once: `worklist`
opens the run and lays out the work, `render` ticks what it landed and records what it classified
bodyless — appending the line when the subject has none, which is how a repository gets one — the
archive step records what it moved and what it spared, and `finalize` resets it. Capture writes
nothing here: a terminal repository answer is evidence in the cache, and the archive step decides
what it means.

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

- [x] theme crafted — archived with repo component; absent from Theme Index at target pin
```

Grammar, deliberately strict (`scripts/state.mjs` rejects anything else): the three sections in
that order, items only of the form `- [M] <repo|plugin|theme> <id>` with an optional ` — reason`
tail. Markers: `[ ]` todo, `[/]` handed to a subagent (ephemeral — a resume reads it as todo),
`[x]` done, `[-]` failed or accepted-standing, `[>]` known miss retried next run.

**`[>]` and `[-]` lines are the standing exceptions.** They survive the post-run reset in place —
there is no separate exceptions section. Each line binds itself to its subject: the typed id, the
reason, and for `bodyless-no-input` the README blob sha that was judged ungroundable, so a moved
input re-opens it. The gate reads these lines as its excuse list and rejects a stale one (the note
gained a body or a link, or the line resolves to no note).

**One line per subject, across the whole file**, and one licensed reason for a line to move between
sections: a terminated lifecycle. When the classifier puts a subject in `Drop`, the retry its `[>]`
line promised has been answered and the archived note becomes the record, so the classifier deletes
the standing line and writes the subject as a `Drop` item. Nothing else moves. A file carrying two
lines for one subject is refused rather than repaired, because every later tick matches by typed id
and would act on both.

**`Dump` and `Drop` are enumerated; `Sync` is not.** Network work and archive moves are expensive
and stateful, and `Drop` is the only record of a relationship graph that render has already rewritten
by the time the archive step reads it. Sync work needs no list: the notes are the baseline, so an
entity is out of date exactly when its target-pin render differs from the file on disk, and the
render stage re-derives that set every run — which is also what makes resume and `--limit` correct
with no per-item bookkeeping, and what lets a note skipped by an earlier run still be recovered
after `base pin` has moved on. An empty `## Sync` on a clean run means "nothing is out of date".
Only a Sync failure earns a line; the receipt reports the counts, and the catalog diff records which
notes moved. Reconciliation therefore covers `Dump` and `Drop`.

## A run, in order

1. **Worklist** (`--stage worklist`) — offline. Sets `target pin`, diffs `base pin → target pin`
   with the base state injected as `--base-index-root`, and writes the classified items into the
   sections. On resume it re-derives the same list and reconciles it with the file, writing nothing;
   a mismatch aborts loudly (exit 5). `[>]` lines seed the worklist automatically. `Drop` contains
   archive moves, never deletions; each trigger expands to its complete baseline plugin/theme ↔
   repository relationship closure before any path changes, reduced by the repositories a live
   target-pin row still resolves to. That reduction is best effort here — the offline alias lookup
   cannot see a repository renamed upstream since the base pin — and is completed by the archive
   step on resolved numeric ids. Standing `github-missing` subjects are scheduled ahead of the
   refresh rotation. `--dry-run` prints the class histogram and the closure and writes nothing.
2. **Capture** (`--stage capture`) — the only networked stage. Its selection is the worklist,
   re-derived from the pin pair and reconciled against `Dump` rather than read off the file, and
   filtered to the classes that cost a round trip: added, relocated, an amendment that queues a
   body, and every standing `[>]` subject still present in the index, which a run re-probes ahead
   of its ordinary refresh rotation. Nothing else is captured, so **zero network calls are
   attributable to any `Sync` item** — the stage prints the selection and the excluded classes so
   that claim is read off its own output. `--plugin`/`--theme` is a pilot instead of a worklist,
   and passing both is a usage error. Batched GraphQL metadata, one REST `/readme` call per
   captured repository, paced Directory pages, and one paced HEAD probe per captured theme against
   the derived screenshot address. Change detection reads the note's own data block: a body task is
   queued exactly when the note is missing or a recorded input — About *or* the upstream
   `description` — moved. Evidence and the queue land in the cache. `--dry-run` prints the
   selection and its planned cost and issues no request.
3. **Agent pass.** Subagents receive the recorded inputs for a batch and return one body per
   queued task into a bodies file. They never touch disk or the state file.
4. **Render** (`--stage render`) — offline and mechanical, and the one path that writes a note.
   A landing comes either from a capture or from a live note whose target-pin render differs from
   the file on disk; both end in the same renderer, and a note landing synthesises its capture from
   the note itself, so it costs nothing. Every note landing is preceded by the three-armed no-op
   proof — already at target, or reproducible at the base pin and therefore safe to write, or
   refused as `render/not-reproducible` with the file untouched. Validates every body (captured
   landings only: a point-edit never needs a staged one), ticks `[x]` on what it landed, and writes
   `[-] … bodyless-no-input (readme sha …)` for what it classified — appending that line when the
   subject has none, which is the repository case, since repositories are not enumerated.
   `github-missing` and other capture-side lanes are printed and reach the exit status. A note that
   exists and does not parse is never written over: that entity is skipped, its file is left
   byte-identical, and the run reports the `note-unparsable` lane and finishes its other work.
   `--limit N` lands the first N in the deterministic order; `--dry-run` runs both renders per
   landing, writes nothing, and prints the diff histogram with every landing accounted for.
5. **Archive** (`--stage archive`) — offline, destructive, and the only all-or-nothing stage: a
   partial archive is the one failure mode that is expensive to undo. What moves is the recorded
   `Drop` set, unioned with what capture confirmed terminal, minus the repositories a live
   target-pin entity still claims. Every note goes to `--archive-root`'s `{plugins,repositories,
   themes}/` by class, keeping its basename and every byte, so bare links still resolve.

   The record is the authority: the closure is *not* recomputed from the tree, because render has
   created notes and re-pointed links by the time this runs. The reconciliation is independent of
   that record instead — the pin diff still says which subjects the indexes dropped, and the
   archived notes' own links still close their component, since a note whose row is gone is never a
   render landing. A missing move, an excess move, a subject that resolves to no note, a
   destination that already exists or sits outside the archive root, and a cross-device rename each
   abort at exit 5 before anything is renamed; `EXDEV` never degrades into copy-and-delete, because
   a copy is a second set of bytes and an archive move must leave exactly one.

   The final reduction belongs here because it needs resolved numeric ids, which arrive with the
   capture: a repository renamed upstream after the base pin is on no alias list, and only its id
   reveals that a live entity claims it. A live entity claims a repository through the capture's
   resolution of its `repo` string, through the alias lookup, or — only when neither answers — its
   note's own link, so a hand-written link never spares a component decision 3.3 means to archive.
   Every sparing is printed and recorded: a run that silently declined to do something it wrote
   down would be worse than one that fails.

   Each move is hashed on both sides and the hashes land in the run's move manifest, which
   `finalize` folds into the receipt. That is the archive's integrity guard: an archived note is
   exempt from the template and re-render checks, and "it is versioned, so a changed byte shows in
   the diff" is empty until the owner commits — which is exactly when a freshly moved note is least
   protected. `--dry-run` prints the move table and the subtraction table and touches nothing, and
   a run interrupted mid-move is re-runnable: a note already at its destination is counted, hashed
   and ticked rather than refused.
6. **Gate** — offline, must be green over the finished worklists and reconcile live plus archived
   coverage.
7. **Finalize** (`--stage finalize --gate-status <result>`) — refuses while any `[ ]`/`[/]` item
   remains or an exception lacks a reason; writes the receipt with exclusive-create semantics,
   folding in the archive's move manifest when the support root is given and it describes this run;
   resets the live file: `base pin` := `target pin`, target cleared, `[x]` dropped, exceptions
   kept. Idempotent: a crash before the receipt resumes normally; after it, the receipt's
   existence makes the reset re-runnable — a receipt carrying this run's label and pin pair means
   only the reset is left to do, while one carrying anything else is refused (exit 5) rather than
   overwritten.

The human reviews the working-tree diff — notes, state file, receipt — and commits. The agent
never commits.

The archive-aware gate is the target contract, not current script capability: the gate still scans
only the live class homes under `--catalog-root`, so it cannot yet prove archive closure,
live/archive coverage, or the recorded bytes of an archived note. The move itself is the archive
step's, never a hand edit.

Repository loss is not inferred from a single ambiguous request. A known repository first misses
in the normal GraphQL `owner/name` capture, then REST `GET /repositories/{databaseId}` decides in
the same Update Run: `200` is rename/re-resolution, `404`/`410` confirms loss. Without a numeric id,
the first terminal response is recorded as standing `github-missing`; the next Update Run re-probes
it ahead of rotation, and only a second terminal response in that distinct run confirms archival.
Timeouts, authentication failures, rate limits and `5xx` never count toward confirmation.

## The receipt

Compact by decision — the worked checklist is not archived, because the catalog diff in git
already records the work. Frontmatter: `run`, `base pin`, `target pin`, `started at`,
`finished at`, `model`, `pacing`, `gate`. Body: per-section done/failed/retry counts, the standing
exceptions as they were left, and — when the run archived anything — one row per moved note with
its class, archive-relative path and sha256, plus the repositories the reduction spared and who
claimed them. Those hashes are not bookkeeping: an archived note is exempt from the template and
re-render checks, so they are the only thing its bytes are ever checked against. Everything else
about a run stays out, because the catalog diff in git already records it. Exclusive create: a
receipt is never overwritten. Its `run`,
`base pin` and `target pin` are what identify the run behind it, so a second finalisation matching
all three continues into the reset, and one differing in any of them is refused — two different
runs may not finalise under one label.

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
leading `xid`, the REST README — completed on 2026-08-10. Of 6,700 repository notes, 6,697 were
rendered from fresh GraphQL plus REST captures. Three repositories had disappeared by refresh:
their prior recorded snapshots were translated one-to-one, while the three new GraphQL-only
feature fields were omitted rather than invented and the omissions became standing exceptions.
The double-render proof covered the complete repository tree and live state file.
