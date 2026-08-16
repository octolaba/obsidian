---
uid: cebd128f-e65a-5761-8801-1f3aaacbbb81
xid:
  - entity-notes
aliases:
  - entity-notes
  - Entity Notes
  - bartvw/entity-notes
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/entity-notes
alt:
  - https://github.com/bartvw/entity-notes
downloads: 1195
updated at: "2026-04-13T19:26:51Z"
related to:
  - "[[GitHub - 1188596497]]"
remind me:
---

# Entity Notes

Watches the editor for trigger tags such as person or project and shows an inline button beside each match. Pressing it creates a Markdown note with pre-filled YAML frontmatter and replaces the line with a wikilink, or converts an unresolved one, then renders a coloured pill badge beside the link. Several entity buttons can appear on one line, and each tag and link pair converts on its own.

```cue
plugin: {
    id:     "entity-notes"
    name:   "Entity Notes"
    author: "bartvw"
    repo:   "bartvw/entity-notes"

    html_url:    "https://community.obsidian.md/plugins/entity-notes"
    github_url:  "https://github.com/bartvw/entity-notes"
    description: "Convert tagged lines into structured Markdown notes with one click. Supports custom entity types with configurable frontmatter and color-coded pill in the editor. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Watch your editor for trigger tags like #person or #project and display inline buttons next to matches. Create a dedicated Markdown note with pre-filled YAML frontmatter, replace the line with a wikilink or convert an unresolved wikilink, and render a colored pill badge beside the link. Support multiple entity buttons on a line so each wikilink+tag pair converts independently."

    stats: {
        downloads:  1195
        updated_at: 1776108411000
    }
}
```

[^template]: [[Obsidian plugin]]
