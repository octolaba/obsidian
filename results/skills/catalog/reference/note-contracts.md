# Note contracts

Every property a catalog note carries, where its value comes from, and what a run is allowed to do
to it. The templates are the shape of record; this file is the mapping and the merge rule.

A note is laid out in one fixed order: frontmatter, H1, the agent-written body, the screenshot embed
(themes only), the **filled data block**, the template footnote.

## Live and archive placement

The note contract is independent of lifecycle state. Live notes occupy `plugins/`, `themes/` and
`repositories/` under the injected catalog root; archived notes keep the same class split under
`<support-root>/archive/{plugins,repositories,themes}/`. An archive operation is a path-only move: it preserves
the filename and every byte of the note, including `uid`, aliases, human fields, body, data block
and template footnote. Bare repository links continue to resolve by unchanged basename after both
ends move.

The archive trigger and unit come from decision 3.3: a plugin or theme leaving its authoritative
index, or a repository confirmed unavailable by terminal GitHub `404`/`410`, moves the complete
baseline plugin/theme ↔ repository relationship component. Archived notes are historical evidence,
not refresh targets. Restoration is deliberately unspecified and must be queued for the owner.

## Quoting and byte stability

The renderer's output must be reproducible byte for byte, so the quoting policy is fixed rather
than clever (`scripts/note.mjs`):

- A string is written **plain** only when it is unambiguous under any YAML reader: it matches
  `^[A-Za-z0-9][A-Za-z0-9 _./-]*$`, is not a boolean/null lookalike, and is not a bare number — or
  it is an `http(s)` URL with no whitespace or quotes.
- Everything else is **double-quoted**, with `\`, `"` and newlines escaped. Upstream controls plugin
  and theme names, so anything carrying a colon, an emoji, leading punctuation, or a non-ASCII
  letter is quoted by rule rather than by inspection.
- Integers and booleans are written raw. An absent value writes the bare key (`downloads:`), never
  `null`, `""` or `none`.
- Lists are always block sequences indented by two spaces. An empty list writes the bare key.

The gate re-serializes every note's frontmatter *and* its data block from its own parse and compares
bytes; a mismatch is `catalog/not-byte-stable`.

Timestamps are ISO 8601 UTC at second precision (`2026-07-25T11:04:07Z`). Epoch milliseconds from
Plugin Stats are converted; counters stay raw integers.

## The data block

The template's CUE fence is **filled**, not stripped. Every note
therefore carries its own recorded inputs beside the prose and is readable without the cache, the
mirror or the network. The frontmatter and the block do two different jobs on the same values — the
frontmatter *renders* them for a reader, the block *records* them as the source served them. Plugin
`stats.updated_at` is the clearest case: `updated at` is ISO 8601, the block keeps the raw epoch
integer.

Emission rules (`scripts/datablock.mjs`), all deterministic, because the gate re-emits and compares:

- 4-space indentation; one blank line between the groups the template declares; values aligned
  inside each contiguous run of scalar fields, and a gap or a nested mapping ends the run.
- Strings are **single-line** CUE quoted literals. `\` is escaped first, then `"`, newline, carriage
  return, tab, and every remaining control character as `\uXXXX`. Escaping the backslash first is
  what disarms CUE's `\(` interpolation.
- Integers and booleans are raw; lists are inline (`["dark", "light"]`).
- An absent optional value is **omitted**, never written as `null` — `about` when the Directory
  carries none, `stats` for the 73 ids without a stats entry, `legacy` unless the index row carries
  the rare key, `license`, `homepage`, `language`, `description`, and `readme` for a repository with
  no README.

**Fence safety is a property, not a hope.** Because every string is one line and every line begins
with an indented key, no upstream value can start a line — and a run of backticks only closes a
Markdown fence at the start of one. The emitter asserts this on its own output before returning, and
the tests drive it with hostile fixtures (a value containing ```` ``` ````, a trailing backslash,
`\(`, quotes, newlines, control characters).

A filled plugin block, for shape. The no-stats variant is the same block without its `stats`
record — nothing is written as zero or `null`:

```cue
plugin: {
    id:     "dataview"
    name:   "Dataview"
    author: "blacksmithgu"
    repo:   "blacksmithgu/obsidian-dataview"

    html_url:    "https://community.obsidian.md/plugins/dataview"
    github_url:  "https://github.com/blacksmithgu/obsidian-dataview"
    description: "Run advanced queries over your vault."
    about:       "Query your Obsidian vault as a database …"

    stats: {
        downloads:  4625655
        updated_at: 1744053450000
    }
}
```

What each block records:

| Class | Records | Contents |
| --- | --- | --- |
| Plugin | `plugin` | the index row (`id`, `name`, `author`, `repo`, `description`), the derived `html_url` and `github_url`, `about` when captured, and `stats` (`downloads`, raw-epoch `updated_at`) when the id has an entry |
| Theme | `theme` | the index row (`name`, `author`, `repo`, `modes`, and `legacy` only when carried), the derived `slug`, `html_url`, `github_url` and `screenshot_url`, and `about` when captured |
| Repository | `repository` | the captured record under its GraphQL field names: `id` (node id) and `databaseId`; `name`, `nameWithOwner`, `description`, `language`, `topics`, `url`, `sshUrl`, `homepageUrl`; `owner` with `type` as the `"User" \| "Organization"` union; a nested `readme` — `sha`, `size`, `htmlUrl` from REST `/readme` — when the repository has one; `license`; and the semantic groups `stats` (`stargazerCount`, `watcherCount` — real watchers, `forkCount`, `openIssueCount` — issues only, `diskUsage`), `features` (the seven `has*Enabled`/`forkingAllowed` toggles), `state` (`visibility` in GraphQL enum case, `defaultBranch`, the five `is*` flags), `timestamps` |

**The README text is never stored in a note.** It feeds the agent pass and is recorded as a hash;
the block keeps only `sha`, `size` and the `htmlUrl` jump address. There is no `content` field and
no `clone` block, `owner` carries no `site_admin`, and the README's `name`, `path` and `is_binary`
are deliberately absent — see `graphql-coverage.md` for why each is out.

The block is machine-owned in full: a run overwrites it, and a hand edit shows up as a
`catalog/not-byte-stable` or `catalog/data-block-drift` finding rather than surviving unnoticed.

## Repository note — `GitHub - {numeric id}.md`

| Property | Source | Rule |
| --- | --- | --- |
| `uid` | derived | UUIDv5 of `github-repository:{numeric id}`; write-once |
| `xid` | repository record | the GraphQL node `id`, then the numeric `databaseId` (pre-migration notes carry the reverse order until the re-render) |
| `aliases` | repository record | bare `name`, then current `nameWithOwner`, then former names in the order first recorded; **former names stay forever** |
| `tags` | template | `type/bookmark`, `bookmark/github`, `github/repository` |
| `url` | repository record | `url` |
| `alt` | repository record | `homepageUrl` when present; the empty string counts as absent |
| `stars`, `forks` | repository record | `stargazerCount`, `forkCount`, raw integers |
| `pushed at` | repository record | `pushedAt`, ISO 8601 UTC |
| `related to`, `remind me` | human | never written by the machine |
| H1 | repository record | current `nameWithOwner` |
| Body | agent | grounded in README content and the repository `description` |
| Data block | captured | the `repository` record, filled, `readme` nested inside it; overwritten on refresh |
| Footnote | template | identity marker; not required to resolve in-vault |

**The alias order is a contract, not a formatting preference.** Obsidian offers a note's aliases to
the author in list order, so the bare `name` — the string a human actually types — leads; the current
`nameWithOwner` follows and disambiguates it against every other repository sharing that bare name;
former names sit below, where they still resolve a stale index row offline but never surface ahead
of the two live ones. Rendering is deterministic from the record alone: positions one and two are
recomputed on every render, and history keeps the order in which each name was first recorded, so a
re-render of an unchanged repository is byte-identical. The gate asserts positions one and two
against the note's own H1; a note whose first two aliases are not `name` then `nameWithOwner` is
`catalog/mapping-drift`.

## Plugin note — `Obsidian plugin - {id}.md`

| Property | Source | Rule |
| --- | --- | --- |
| `uid` | derived | UUIDv5 of `obsidian-plugin:{id}`; write-once |
| `xid` | Plugin Index | `id` |
| `aliases` | Plugin Index | `id`, `name`, `repo`; exact duplicates dropped, order kept |
| `tags` | template | `type/bookmark`, `bookmark/obsidian`, `obsidian/plugin` |
| `url` | derived | `https://community.obsidian.md/plugins/{id}` |
| `alt` | derived | `https://github.com/{repo}` |
| `downloads` | Plugin Stats | raw integer; **empty while the id has no stats entry** (73 at the pin) |
| `updated at` | Plugin Stats | epoch ms → ISO 8601 UTC; empty while absent |
| `related to` | derived | `[[GitHub - {numeric id}]]`, bare, machine-guaranteed; human additions preserved |
| `remind me` | human | never written |
| H1 | Plugin Index | `name` |
| Body | agent | grounded in the index `description` and About |
| Data block | captured | the `plugin` record, filled; overwritten on refresh |

## Theme note — `Obsidian theme - {slug}.md`

| Property | Source | Rule |
| --- | --- | --- |
| `uid` | derived | UUIDv5 of `obsidian-theme:{slug}`; write-once |
| `xid` | derived | slug |
| `aliases` | derived + Theme Index | `slug`, `name`, `repo`; exact duplicates dropped |
| `tags` | template | `type/bookmark`, `bookmark/obsidian`, `obsidian/theme` |
| `url` | derived | `https://community.obsidian.md/themes/{slug}` |
| `alt` | derived | `https://github.com/{repo}` |
| `modes` | Theme Index | copied verbatim, **upstream order preserved** — both orderings occur |
| `legacy` | Theme Index | boolean; `false` when the rare key is absent |
| `related to` | derived | repository link; human additions preserved |
| `remind me` | human | never written |
| H1 | Theme Index | `name` |
| Body | agent + derived | description, then the screenshot embed below it |
| Data block | captured | the `theme` record, filled, below the embed; overwritten on refresh |

The screenshot embed is `![{name} screenshot](https://raw.githubusercontent.com/{repo}/HEAD/{path})`
with each path segment URL-encoded — eleven pinned paths carry spaces or other URL-hostile
characters, for example `preview_Blue Topaz.png` → `preview_Blue%20Topaz.png`. An address that
answers 404 omits the embed and records the lane.

Themes have no stats source, so no download or update properties exist. A theme rename that changes
the slug is removal plus addition and is queued for the owner (rename-suspect); a rename that keeps
the slug is an amendment landing on H1 and the name alias.

## Ownership summary

| Kind | Examples | On update |
| --- | --- | --- |
| Machine scalar | `url`, `alt`, `stars`, `downloads`, `updated at`, `modes`, `legacy`, H1, screenshot embed, **the data block** | overwritten |
| Machine list | `aliases`, `xid`, `tags`, `related to` | guaranteed members written; recognised-stale members removed; unrecognised members preserved |
| Write-once | `uid` | never regenerated |
| Human | `remind me`, extra `related to` members | never touched |
| Agent | the body | replaced wholesale by a queued rewrite, listed in the cache queue and the state file's worklist first |
| Lifecycle | live or archived home | path-only move of the complete related component; note bytes stay unchanged |

A template change is a migration: an explicit catalog-wide re-render worklist in the live state
file, never incidental drift. The gate enforces this by comparing every note's frontmatter key
order and tag list against the template, and the record names inside its data block against the
records the template's contract declares.

Archive-aware gate support is pending. Until it lands, do not move notes by hand: the current gate
scans only live class homes and cannot yet prove archive closure or live/archive coverage.
