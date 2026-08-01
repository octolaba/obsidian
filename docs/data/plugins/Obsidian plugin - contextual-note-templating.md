---
uid: 6cd228c1-37d4-5c90-bd76-9adb2df75f50
xid:
  - contextual-note-templating
aliases:
  - contextual-note-templating
  - Contextual note templating
  - balibaloo/obsidian-contextual-note-templating
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/contextual-note-templating
alt:
  - https://github.com/balibaloo/obsidian-contextual-note-templating
downloads: 9478
updated at: "2024-07-22T20:37:02Z"
related to:
  - "[[GitHub - 678128129]]"
remind me:
---

# Contextual note templating

This plugin configures note templates in a note's frontmatter and fills their field values through interactive prompts. Templates are grouped into intents that represent note types, and global intents are merged into a context-aware template before it runs. Notes can be selected through Filtered Opener in order to run their intents.

```cue
plugin: {
    id:     "contextual-note-templating"
    name:   "Contextual note templating"
    author: "balibaloo"
    repo:   "balibaloo/obsidian-contextual-note-templating"

    html_url:    "https://community.obsidian.md/plugins/contextual-note-templating"
    github_url:  "https://github.com/balibaloo/obsidian-contextual-note-templating"
    description: "Prompts for values and templates to create notes."
    about:       "Configure note templates in a note's frontmatter and insert field values through interactive prompts. Group templates into intents representing note types and merge global intents into a context-aware template before running. Select notes via Filtered Opener to run note intents."

    stats: {
        downloads:  9478
        updated_at: 1721680622000
    }
}
```

[^template]: [[Obsidian plugin]]
