---
uid: 5386b560-de74-5983-9236-49fa0be0d202
xid:
  - quick-reads-sync
aliases:
  - quick-reads-sync
  - Quick Reads Sync
  - mattbirchler/quick-reads-obsidian
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/quick-reads-sync
alt:
  - https://github.com/mattbirchler/quick-reads-obsidian
downloads: 333
updated at: "2026-08-11T12:19:19Z"
related to:
  - "[[GitHub - 1141273857]]"
remind me:
---

# Quick Reads Sync

Syncs highlights from Quick Reads into the vault, grouping them by article and creating one note per article. New highlights are appended to the existing article note, and duplicate imports are prevented. The sync runs at startup or on a configurable interval, and the notes follow a customizable template.

```cue
plugin: {
    id:     "quick-reads-sync"
    name:   "Quick Reads Sync"
    author: "mattbirchler"
    repo:   "mattbirchler/quick-reads-obsidian"

    html_url:    "https://community.obsidian.md/plugins/quick-reads-sync"
    github_url:  "https://github.com/mattbirchler/quick-reads-obsidian"
    description: "Sync your highlights from Quick Reads into your vault. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Sync Quick Reads highlights into Obsidian notes, grouping by article and creating one note per article. Append new highlights to existing article notes, prevent duplicate imports, and run on startup or at a configurable interval using a customizable note template."

    stats: {
        downloads:  333
        updated_at: 1786450759000
    }
}
```

[^template]: [[Obsidian plugin]]
