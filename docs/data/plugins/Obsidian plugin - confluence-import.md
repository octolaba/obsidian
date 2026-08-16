---
uid: f200a7db-a859-5d52-9fba-e68222752d60
xid:
  - confluence-import
aliases:
  - confluence-import
  - Confluence Page Import
  - hikosalaidarkcommit/confluence-import
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/confluence-import
alt:
  - https://github.com/hikosalaidarkcommit/confluence-import
downloads: 64
updated at: "2026-07-29T04:16:30Z"
related to:
  - "[[GitHub - 1308427473]]"
remind me:
---

# Confluence Page Import

Confluence Page Import pulls Confluence pages into notes as a manual, one-way import that never writes back to Confluence. A read-only diff is previewed first, changes and empty-page conversions are detected, and you choose to replace the note or keep the local version. The pulled page version is recorded in a confluence-version frontmatter key.

```cue
plugin: {
    id:     "confluence-import"
    name:   "Confluence Page Import"
    author: "hikosalaidarkcommit"
    repo:   "hikosalaidarkcommit/confluence-import"

    html_url:    "https://community.obsidian.md/plugins/confluence-import"
    github_url:  "https://github.com/hikosalaidarkcommit/confluence-import"
    description: "Import Confluence pages into Obsidian notes (one-way pull) with a read-only diff preview before anything is written. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Pull Confluence pages into Obsidian notes with a manual, one-way import that never writes back to Confluence. Preview read-only diffs, detect changes and empty-page conversions, choose to replace or keep local, and record pulled page versions in confluence-version frontmatter."

    stats: {
        downloads:  64
        updated_at: 1785298590000
    }
}
```

[^template]: [[Obsidian plugin]]
