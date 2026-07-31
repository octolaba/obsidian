---
uid: 6253dea1-2d8c-58d5-a83e-db77e2b8da4e
xid:
  - wikilink-types
aliases:
  - wikilink-types
  - Wikilink Types
  - penfieldlabs/obsidian-wikilink-types
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/wikilink-types
alt:
  - https://github.com/penfieldlabs/obsidian-wikilink-types
downloads: 3046
updated at: "2026-05-19T23:02:32Z"
related to:
  - "[[GitHub - 1186587910]]"
remind me:
---

# Wikilink Types

Adds typed relationships to wikilinks: typing an at sign inside a link alias opens an autocomplete of relationship types. The chosen types are synced into YAML frontmatter on save, so Dataview, Graph Link Types, Breadcrumbs and similar tools can consume them. Several types can be attached to one link while the displayed text stays readable.

```cue
plugin: {
    id:     "wikilink-types"
    name:   "Wikilink Types"
    author: "penfieldlabs"
    repo:   "penfieldlabs/obsidian-wikilink-types"

    html_url:    "https://community.obsidian.md/plugins/wikilink-types"
    github_url:  "https://github.com/penfieldlabs/obsidian-wikilink-types"
    description: "Type @ inside wikilink aliases to add relationship types, auto-synced to YAML frontmatter. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Add typed relationships to wikilinks by typing @ in a link alias and picking a relationship from the autocomplete. Sync selections into YAML frontmatter on save so Dataview, Graph Link Types, Breadcrumbs, and other tools can consume them. Allow multiple types per link while keeping display text readable."

    stats: {
        downloads:  3046
        updated_at: 1779231752000
    }
}
```

[^template]: [[Obsidian plugin]]
