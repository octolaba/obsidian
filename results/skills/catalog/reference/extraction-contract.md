# The About extraction contract

About is the one field with no pinned source. It is read from the Directory's server-rendered
markup, which is mutable and unversioned, so extraction is written as a contract with ordered
obligations rather than as a scrape. Implementation: `scripts/about.mjs`.

## Why markup at all

Probed 2026-08-06:

- Directory Pages are server-rendered and content-bearing without JavaScript.
- `og:description` equals the **index** `description`, not About.
- A payload request against the same address returns a React flight stream with no discrete `about`
  or `downloads` strings; the search endpoint answers Not Found.
- In a ten-plugin probe every sampled About differed from the index `description`. For `dataview`
  the About matches neither the README nor the `description` — all three are distinct prose.

So About is not derivable from any pinned source, as a rule rather than an exception, and the page
markup is the only place it exists.

## The contract, in order

1. **Is this a Directory page at all?** `og:url` must begin with `https://community.obsidian.md`
   and a `<title>` must exist. Otherwise: `contract-mismatch`.
2. **Is it the not-found shell?** A missing entity answers **HTTP 200** with a small shell carrying
   `og:site_name`, the title `Plugin not found`, no `<link rel="canonical">` and no About block.
   Otherwise: `not-found` — a normal failure lane, not drift.
3. **Is it *this* entity's page?** `<link rel="canonical">` **and** `og:url` must both equal the
   requested address exactly, and the `<title>` must end with `- Obsidian Plugin` or
   `- Obsidian Theme` to match the requested kind. Otherwise: `identity-mismatch`, and the text is
   never trusted — a redirect or a cached neighbour cannot donate its About.
4. **Only then**, the About block:
   ```html
   <div class="… border-b border-gray-800">About</div>TEXT</div>
   ```
   The text runs from the end of that marker to the next `</div>`. If the marker is absent but the
   sibling `Details` block is present, the author simply wrote no About: `absent`, not a break. If
   neither is present, or the block is unclosed, carries markup, or is empty: `contract-mismatch`.
5. Entities are decoded and whitespace is collapsed. The result is hashed; the hash is what decides
   whether a body task is queued.

Statuses map to lanes: `ok` and `absent` are success; `not-found`, `identity-mismatch` and
`contract-mismatch` are recorded, retried, and never allowed to overwrite a note's body input.

## Observed markers, 2026-08-06

| Marker | Plugin page | Theme page | Not-found shell |
| --- | --- | --- | --- |
| `og:site_name` | absent | absent | `Obsidian Community` |
| `link rel="canonical"` | the page address | the page address | **absent** |
| `og:url` | the page address | the page address | site root |
| `<title>` | `Dataview - Obsidian Plugin` | `Rose Pine - Obsidian Theme` | `Plugin not found` |
| About block | present | present | absent |
| Details block | present | present | absent |
| HTTP status | 200 | 200 | **200** |

The theme row settles an open question: theme pages carry an About block in the same markup shape
as plugin pages. The README fallback for theme bodies is therefore not needed for a page that
renders, and remains only for a theme whose page is absent.

## Fixtures

`scripts/fixtures/directory/` holds sanitized excerpts of four live captures, with
`provenance.json` recording each source URL, the access date, and the **sha256 and byte length of
the full capture** — the fixture itself is a reduction, and its own bytes are not the evidence.
Each fixture keeps the identity markers the extractor validates, the About block verbatim, and a
stubbed Details block; navigation, scripts, styles and the React payload are removed.

| Fixture | Case it pins |
| --- | --- |
| `plugin-dataview.html` | the About counterexample — About matches neither README nor index description |
| `plugin-canvas-loom.html` | a plugin with no stats entry, About present |
| `theme-rose-pine.html` | a theme page carrying About; non-ASCII text inside the block |
| `plugin-not-found.html` | the 200-with-shell case |

`scripts/test.mjs` runs the extractor against all four and asserts the exact status and, for the
two `ok` cases, the exact text. If the Directory redesigns, the fixtures keep proving what the
extractor *was* written against; the live capture in the next run is what reports the drift.

## Re-fixing the contract after drift

1. Capture the page again and diff it against the fixture's markers.
2. Fix `about.mjs` so identity validation still precedes content, and never widen the About match
   to something that could also match a neighbouring block.
3. Replace the fixture, re-record its provenance hash and access date.
4. Re-run the tests, then re-run the affected captures; changed hashes queue body rewrites, which
   the Run Report lists before they land.
