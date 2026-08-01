---
uid: 3807cb16-984e-5a7e-8da6-067bfffc7949
xid:
  - acorny-sync
aliases:
  - acorny-sync
  - Acorny Sync
  - acornyio/acorny-obsidian
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/acorny-sync
alt:
  - https://github.com/acornyio/acorny-obsidian
downloads: 89
updated at: "2026-06-26T07:08:03Z"
related to:
  - "[[GitHub - 1279373204]]"
remind me:
---

# Acorny Sync

Acorny Sync imports Acorny highlights into the vault as one Markdown note per source, appending idempotently so manual edits survive. Each note carries frontmatter with title, source and acorny-source-id plus optional author and tags, and a Highlights list whose block IDs prevent duplicates. Notes are anchored by acorny-source-id, and syncs run manually, at startup or on an interval.

```cue
plugin: {
    id:     "acorny-sync"
    name:   "Acorny Sync"
    author: "Acorny"
    repo:   "acornyio/acorny-obsidian"

    html_url:    "https://community.obsidian.md/plugins/acorny-sync"
    github_url:  "https://github.com/acornyio/acorny-obsidian"
    description: "Sync your Acorny highlights into your vault as Markdown notes. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Sync Acorny highlights into your vault as one Markdown note per source, appending idempotently so manual edits are preserved. Include frontmatter (title, source, acorny-source-id, optional author/tags) and a ## Highlights list with block IDs to avoid duplicates; anchor notes by acorny-source-id and run syncs manually, on startup, or on an interval."

    stats: {
        downloads:  89
        updated_at: 1782457683000
    }
}
```

[^template]: [[Obsidian plugin]]
