# Note contracts

Every property a catalog note carries, where its value comes from, and what a run is allowed to do
to it. The templates are the shape of record; this file is the mapping and the merge rule.

A note is laid out in one fixed order: frontmatter, H1, the agent-written body, the screenshot embed
(themes only), the **filled data block**, the template footnote.

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

Owner decision, 2026-08-06: the template's CUE fence is **filled**, not stripped. Every note
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
| Repository | `repository`, `readme` | the captured repository record, with `ssh_url` flat beside `html_url` and `homepage`, `owner.type` as the `"User" \| "Organization"` union, and `stats` = `stargazers_count`, `watchers_count` (real watchers), `forks_count`, `open_issues_count`; then the README **identity** — `name`, `path`, `sha` (blob oid), `size`, `is_binary` |

**The README text is never stored in a note.** It feeds the agent pass and is recorded as a hash; the
block keeps only its identity. There is no `content` field and no `clone` block, and `owner`
carries no `site_admin` — see `graphql-coverage.md` for why each was removed.

The block is machine-owned in full: a run overwrites it, and a hand edit shows up as a
`catalog/not-byte-stable` or `catalog/data-block-drift` finding rather than surviving unnoticed.

## Repository note — `GitHub - {numeric id}.md`

| Property | Source | Rule |
| --- | --- | --- |
| `uid` | derived | UUIDv5 of `github-repository:{numeric id}`; write-once |
| `xid` | repository record | numeric `databaseId`, then the GraphQL node `id` |
| `aliases` | repository record | current `nameWithOwner`, then `name`; **former full names stay forever** |
| `tags` | template | `type/bookmark`, `bookmark/github`, `github/repository` |
| `url` | repository record | `url` |
| `alt` | repository record | `homepageUrl` when present; the empty string counts as absent |
| `stars`, `forks` | repository record | `stargazerCount`, `forkCount`, raw integers |
| `pushed at` | repository record | `pushedAt`, ISO 8601 UTC |
| `related to`, `remind me` | human | never written by the machine |
| H1 | repository record | current `nameWithOwner` |
| Body | agent | grounded in README content and the repository `description` |
| Data block | captured | the `repository` and `readme` records, filled; overwritten on refresh |
| Footnote | template | identity marker; not required to resolve in-vault |

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
| Agent | the body | replaced wholesale by a queued rewrite, which the Run Report lists first |

A template change is a migration: an explicit catalog-wide re-render task recorded in the Run
Report, never incidental drift. The gate enforces this by comparing every note's frontmatter key
order and tag list against the template, and the record names inside its data block against the
records the template's contract declares.
