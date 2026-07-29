# GraphQL coverage matrix

Decision 3.8: **GraphQL is the single capture approach.** A Data Contract field GraphQL cannot
serve is removed from the contract and from the template — there is no REST fallback. This file is
the field-by-field record, the measured cost, and the README discovery semantics.

Probed 2026-08-06 against the live API with a token from the `gh` CLI. Schema names come from a
`__type(name: "Repository")` introspection on the same day.

## Repository fields

| Contract field | GraphQL | Status | Note |
| --- | --- | --- | --- |
| `id` | `databaseId` | served | the immutable numeric id the catalog's filenames use |
| `node_id` | `id` | served | GraphQL's own node id |
| `name` | `name` | served | |
| `full_name` | `nameWithOwner` | served | canonical case; compare case-insensitively |
| `private` | `isPrivate` | served | |
| `fork` | `isFork` | served | |
| `html_url` | `url` | served | |
| `homepage` | `homepageUrl` | served | the **empty string** occurs and counts as absent |
| `description` | `description` | served | `null` occurs (2 of 26 pilot repositories) |
| `owner.login` | `owner.login` | served | |
| `owner.id` | `owner.databaseId` | served | needs `... on User` / `... on Organization` fragments |
| `owner.type` | `owner.__typename` | served | `User` / `Organization`, same spelling as REST |
| `owner.html_url` | `owner.url` | served | |
| `owner.site_admin` | `isSiteAdmin` on `User` only | **removed** | `Organization` has no equivalent, so the field cannot be served for every owner. Gone from the template and from every note's data block |
| `language` | `primaryLanguage.name` | served | `null` for content-less repositories |
| `default_branch` | `defaultBranchRef.name` | served | |
| `visibility` | `visibility` | served | GraphQL yields `PUBLIC`; lowercased at normalisation |
| `size` | `diskUsage` | served | kilobytes, as REST's `size` |
| `topics` | `repositoryTopics(first: 100).nodes.topic.name` | served | 100 is above any observed count |
| `license` | `licenseInfo { key name spdxId }` | served | `null` when unlicensed (2 of 26 pilot repositories) |
| `stats.stargazers_count` | `stargazerCount` | served | |
| `stats.watchers_count` | `watchers.totalCount` | served | **Real watchers.** 51 = 51 against REST's `subscribers_count` for `blacksmithgu/obsidian-dataview`. REST's own `watchers_count` is the trap: it duplicates `stargazers_count` (9,254 = 9,254 for the same repository) and is not used. The contract keeps the REST-shaped *name* and the GraphQL *meaning* |
| `stats.forks_count` | `forkCount` | served | |
| `stats.open_issues_count` | `issues(states: OPEN).totalCount` | served, **different semantics** | REST's `open_issues_count` counts open issues **plus** open pull requests; this counts issues only. The contract now means "open issues"; add `pullRequests(states: OPEN).totalCount` if the REST sense is ever wanted |
| `network_count` | — | **removed** (adjudication 3) | no equivalent, and it duplicates `forks_count` for network roots (553 = 553) |
| `features.has_issues` | `hasIssuesEnabled` | served | |
| `features.has_projects` | `hasProjectsEnabled` | served | |
| `features.has_downloads` | — | **removed** | no field in the schema |
| `features.has_wiki` | `hasWikiEnabled` | served | |
| `features.has_pages` | — | **removed** | no field in the schema |
| `features.has_discussions` | `hasDiscussionsEnabled` | served | |
| `features.archived` | `isArchived` | served | |
| `features.disabled` | `isDisabled` | served | |
| `features.is_template` | `isTemplate` | served | |
| `timestamps.created_at` | `createdAt` | served | |
| `timestamps.updated_at` | `updatedAt` | served | |
| `timestamps.pushed_at` | `pushedAt` | served | the only one a note renders |
| `ssh_url` | `sshUrl` | served | the `clone` block was flattened: `ssh_url` now sits beside `html_url` and `homepage` |
| `clone.git_url` | — | **removed** | no field in the schema |
| `clone.clone_url` | — | **removed** | derivable from `url`, but derivation is not capture |
| `clone.svn_url` | — | **removed** | no field in the schema |

## README fields

| Contract field | GraphQL | Status | Note |
| --- | --- | --- | --- |
| `path` | the expression the discovery rule chose | served | e.g. `HEAD:README.md` |
| `name` | basename of `path` | served | derived from the path, not a separate read |
| `sha` | `Blob.oid` | served | equals REST's `sha` (`4e365f3a…` for the dataview README) |
| `size` | `Blob.byteSize` | served | equals REST's `size` (7,828 bytes, same probe) |
| `content` | `Blob.text` | served, **not stored** | already decoded (REST returns base64). The text feeds the agent pass and is recorded as a hash; `readme.content` was **removed from the contract**, so no note ever carries README text |
| `encoding` | — | **removed** | GraphQL serves decoded text, so an encoding field describes nothing. `Blob.isBinary` replaces it: a binary blob returns `text: null` |
| `html_url` | — | **removed** | derivable from `url`, branch and path |
| `download_url` | — | **removed** | derivable from the raw host, branch and path |

## What the template no longer declares

Every removal above, gathered so a reader does not have to reassemble it from the tables:
`owner.site_admin`, `network_count`, `features.has_downloads`, `features.has_pages`,
`readme.encoding`, `readme.html_url`, `readme.download_url`, `readme.content`, and the whole `clone`
block except `ssh_url`, which was flattened up beside the other addresses (the https clone address
derives from `html_url`). `readme.is_binary` was added in `encoding`'s place. `watchers_count` was
re-added with the GraphQL meaning after the 2026-08-06 probe.

Because the Data Contract fence is now *filled* into every repository note rather than stripped, a
field removed here is a field that disappears from 26 notes on the next re-render — the removals are
visible in the catalog, not only in the template.

## Preferred-README discovery

REST's `/readme` endpoint resolves the *preferred* README; a literal `HEAD:README.md` object lookup
does not reproduce it. GraphQL has no equivalent endpoint, so discovery is done explicitly: the same
query that reads the repository also reads the root, `.github` and `docs` trees, and
`preferredReadmePath()` picks by an ordered rule.

**Rule as implemented** (`scripts/github.mjs`): directories in order `""`, `.github`, `docs`; inside
a directory, the first existing `readme{ext}` matched **case-insensitively** with `ext` in
`.md, .markdown, .mdown, .mkdn, .mkd, .rst, .textile, .rdoc, .org, .creole, .mediawiki, .wiki,
.asciidoc, .adoc, .asc, .pod, .txt, .html, ""`.

**Measured**, 2026-08-06: the rule's answer was compared against `GET /repos/{repo}/readme` for
**66 repositories** — the 26 pilot repositories plus 40 unrelated repositories chosen to vary the
shape. **66 of 66 agreed.**

Cases the measurement actually exercised:

| Case | Example | Result |
| --- | --- | --- |
| root `README.md` | most of the sample | agrees |
| lowercase / mixed case | `vercel/next.js` (`readme.md`), `expressjs/express` (`Readme.md`) | agrees — matching must be case-insensitive |
| non-Markdown root README | `python/cpython`, `home-assistant/core` (`README.rst`), `elastic/elasticsearch` (`README.asciidoc`) | agrees — extension order matters |
| root **and** `docs/` README | `hashicorp/terraform`, `django/django`, `pytorch/pytorch`, `cli/cli`, `gohugoio/hugo`, `probot/probot`, `jesseduffield/lazygit` | agrees — **root wins over `docs/`** |
| many localised root READMEs | `trekhleb/javascript-algorithms` (19 `README.*.md` files) | agrees — exact name match, not a prefix match |

**Unverified, and stated as such:** no repository in the sample carried a `.github/README.md`, so
the rule's placement of `.github` *between* root and `docs` is **not measured**. If a run ever
selects a `.github/…` path, treat that capture as evidence to check against REST once, and correct
the order here if it disagrees. The failure mode is bounded: the wrong README would be captured for
that repository, and a body would be grounded in it.

## Measured cost

| Measurement | Value |
| --- | --- |
| Cost of one batched repository query | **1 point**, independent of batch size (measured at 10 and at 20 repositories per request) |
| Cost of one batched README-blob query | **1 point** |
| `nodeCount` | 100 per repository in the metadata pass (three tree lookups included); 0 in the blob pass |
| Practical batch ceiling | 20 works; **40 fails** — the API answers HTTP 200 with an **empty body**, which the client turns into an explicit "reduce --batch-size" error rather than a parse crash |
| Pilot, 26 repositories at batch 10 | 3 + 3 requests, **6 points total** |
| Bulk scan, 2,820 repositories at batch 20 | 141 requests, **141 points** |
| Hourly budget | 5,000 points |

**Projection for a full backfill** (6,707 repositories, batch 20): ≈ 336 metadata requests + ≈ 336
blob requests ≈ **672 points**, about 13% of one hour's budget. The binding constraint is therefore
not GitHub but the Directory: 6,707 page captures at the default 1.5 s interval ≈ **2 h 50 m**
sequential. Both loops are checkpointed and resumable.

Every figure above is a dated observation of a mutable service, not a pinned fact.
