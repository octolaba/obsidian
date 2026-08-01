# GraphQL coverage matrix

Decision 3.8: **GraphQL captures repository metadata; the README alone is REST** — the one REST
call in the pipeline is `GET /repos/{owner}/{repo}/readme`, which owns preferred-README discovery
server-side. A Data Contract field the API cannot serve is absent from the contract and from the
template rather than approximated. The contract carries the GraphQL field names verbatim, grouped
into `stats`, `features`, `state`, `timestamps`. This file is the field-by-field record, the
measured cost, and the README semantics.

Probed 2026-08-06 and 2026-08-10 against the live API with a token from the `gh` CLI; schema names
come from `__type(name: "Repository")` introspection, and the oversized-README behaviour was
verified against the live REST documentation.

## Repository fields

Contract names now equal the GraphQL names, so the matrix records the source selection and the
semantics instead of a rename table:

| Contract field | GraphQL source | Note |
| --- | --- | --- |
| `id` | `id` | the GraphQL node id; leads `xid` |
| `databaseId` | `databaseId` | the immutable numeric id the catalog's filenames, uids and links use |
| `name` | `name` | |
| `nameWithOwner` | `nameWithOwner` | canonical case; compare case-insensitively (was `full_name`) |
| `description` | `description` | `null` occurs (2 of 26 pilot repositories) |
| `language` | `primaryLanguage.name` | `null` for content-less repositories |
| `topics` | `repositoryTopics(first: 20).nodes[].topic.name` | one page is exhaustive: GitHub caps topics at 20 per repository (verified 2026-08-10) |
| `url` | `url` | was `html_url` |
| `sshUrl` | `sshUrl` | flat beside the other addresses since the `clone` block was removed |
| `homepageUrl` | `homepageUrl` | the **empty string** occurs and counts as absent |
| `owner.id` | `owner.databaseId` | needs `... on User` / `... on Organization` fragments |
| `owner.type` | `owner.__typename` | `User` / `Organization`, same spelling as REST |
| `owner.login` | `owner.login` | |
| `owner.url` | `owner.url` | |
| `license.key`, `license.name`, `license.spdxId` | `licenseInfo { key name spdxId }` | `null` when unlicensed (2 of 26 pilot repositories); `spdxId` itself may be null and is then omitted |
| `stats.stargazerCount` | `stargazerCount` | |
| `stats.watcherCount` | `watchers.totalCount` | **Real watchers.** 51 = 51 against REST's `subscribers_count` for `blacksmithgu/obsidian-dataview` (2026-08-06 probe). REST's own `watchers_count` is the trap: it duplicates the star count and is not used |
| `stats.forkCount` | `forkCount` | |
| `stats.openIssueCount` | `issues(states: OPEN).totalCount` | open issues only, pull requests excluded by decision — REST's `open_issues_count` counted both, and its denormalised counter can also go stale |
| `stats.diskUsage` | `diskUsage` | kilobytes; moved into `stats` by the grouping rules |
| `features.hasIssuesEnabled` … `features.hasDiscussionsEnabled` | same-named fields | |
| `features.hasPullRequestsEnabled`, `features.hasSponsorshipsEnabled`, `features.forkingAllowed` | same-named fields | pull requests are a disableable feature on GitHub |
| `state.visibility` | `visibility` | kept in GraphQL enum case — `PUBLIC` \| `PRIVATE` \| `INTERNAL`; never lowercased |
| `state.defaultBranch` | `defaultBranchRef.name` | `null` for an empty repository; lives in `state` by owner decision |
| `state.isPrivate`, `state.isFork`, `state.isArchived`, `state.isDisabled`, `state.isTemplate` | same-named fields | |
| `timestamps.createdAt`, `timestamps.updatedAt` | same-named fields | |
| `timestamps.pushedAt` | `pushedAt` | the only one a note renders; `null` for a never-pushed repository |

## README fields — REST `GET /repos/{owner}/{repo}/readme`

| Contract field | REST source | Note |
| --- | --- | --- |
| `readme.sha` | `sha` | the blob sha; equals the GraphQL `Blob.oid` (verified 2026-08-10, `bcc35a1c…` both ways) |
| `readme.size` | `size` | bytes; equals `Blob.byteSize` (2,877 = 2,877, same probe) |
| `readme.htmlUrl` | `html_url` | the rendered-README jump address; with `path` not stored it is not derivable, so it is recorded |
| — | `name`, `path` | known (discovery is server-side) but **not stored**; the body queue records the path so a task can name what grounded it |
| — | `content` | base64, decoded at capture, **not stored**: the text feeds the agent pass and is recorded as a hash |
| — | `encoding` | consumed as the oversize guard: a README of 1–100 MB answers `encoding: "none"` with empty `content` (documented REST contents behaviour, verified 2026-08-10; over 100 MB the endpoint refuses entirely). The capture records the `readme-oversized` lane and the README is skipped as a summary input by owner decision |

A repository with no README answers 404 and the note simply omits the `readme` record. The retired
`is_binary` flag has no replacement: a binary file named like a README would decode to mojibake, an
edge accepted as vanishingly rare when the flag was dropped.

## What the template no longer declares

Every field deliberately absent, gathered so a reader does not have to reassemble it from the
tables: `owner.site_admin`, `network_count`, `features.has_downloads`, `features.has_pages`,
`readme.encoding`, `readme.download_url`, `readme.content`, `readme.name`, `readme.path`,
`readme.is_binary` (valueless for a note), and the whole `clone` block except the ssh address.
The REST-shaped spellings are not contract names either: `watcherCount` carries the real-watchers
meaning `watchers_count` never had in REST, and `openIssueCount` counts issues only.

Because the Data Contract fence is *filled* into every repository note rather than stripped, a
field that moves here moves in every note on the next re-render — the removals are visible in the
catalog, not only in the template.

## Preferred-README discovery — server-side

REST's `/readme` endpoint resolves the *preferred* README itself; that is the discovery mechanism,
not a semantics to reproduce. A retired client-side rule — three trees read over GraphQL,
directories `""`, `.github`, `docs` in order, a fixed extension list matched case-insensitively —
once reproduced it, minus one slot no sample ever exercised (`.github/README.md` precedence). Its
measurement (2026-08-06) stands as evidence that the two approaches agree: **66 of 66**
repositories answered identically from the rule and from `GET /repos/{repo}/readme`, across
lowercase and mixed-case names, non-Markdown extensions (`README.rst`, `README.asciidoc`),
root-beats-`docs/` layouts, and 19 localised `README.*.md` siblings.

## Measured cost

| Measurement | Value |
| --- | --- |
| Cost of one batched repository metadata query | **1 point**, independent of batch size (measured 2026-08-06 at 10 and at 20 repositories per request) |
| `nodeCount` of the tree-era metadata pass (2026-08-06) | 100 per repository, three tree lookups included; the current fragment carries no trees, so the count falls — re-measure on the first run |
| Practical batch ceiling | 20 works; **40 fails** — the API answers HTTP 200 with an **empty body**, which the client turns into an explicit "reduce --batch-size" error rather than a parse crash |
| README pass | one REST request per captured repository against the 5,000-per-hour REST budget — a projection, not yet a measured run |
| Pilot, 26 repositories at batch 10 (2026-08-06, retired blob pass) | 3 + 3 requests, 6 GraphQL points total |
| Bulk scan, 2,820 repositories at batch 20 (2026-08-06) | 141 requests, **141 points** |
| Hourly budgets | 5,000 GraphQL points; 5,000 REST requests |

**Projection for a full catalog refresh** (6,707 repositories, batch 20): ≈ 336 metadata requests ≈
**336 points**, far inside one hour's GraphQL budget — plus ≈ **6,707 REST readme requests**, which
exceeds one REST hour and therefore spans budget windows; the state file's unchecked worklist
items make the pause a resume, not a loss. The Directory remains the binding constraint for a full backfill:
6,707 page captures at the default 1.5 s interval ≈ **2 h 50 m** sequential.

Every figure above is a dated observation of a mutable service, not a pinned fact.
