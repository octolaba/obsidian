---
uid: c85b22da-621b-5080-8d5e-1c7553558613
xid:
  - jamie-sync
aliases:
  - jamie-sync
  - Jamie Sync
  - meetjamie/obsidian-sync
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/jamie-sync
alt:
  - https://github.com/meetjamie/obsidian-sync
downloads: 104
updated at: "2026-07-08T11:48:16Z"
related to:
  - "[[GitHub - 1272313868]]"
remind me:
---

# Jamie Sync

Jamie Sync polls the Jamie API and writes meeting notes and transcripts into the vault as Markdown, with frontmatter, a short-summary callout, action items as checkboxes and linked transcript files. The destination is chosen between a dedicated folder, per-day folders, or blocks appended to the daily note. Syncing runs on load or at intervals and is idempotent and edit-aware, so re-syncing avoids duplicates.

```cue
plugin: {
    id:     "jamie-sync"
    name:   "Jamie Sync"
    author: "Jamie"
    repo:   "meetjamie/obsidian-sync"

    html_url:    "https://community.obsidian.md/plugins/jamie-sync"
    github_url:  "https://github.com/meetjamie/obsidian-sync"
    description: "Sync your Jamie meeting notes and transcripts into your vault. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Sync Jamie meeting notes and transcripts into an Obsidian vault by polling Jamie's API and writing Markdown notes with frontmatter, a short-summary callout, action-item checkboxes, and linked transcript files. Pick a destination mode—dedicated folder, per-day folders, or append blocks to the daily note—and run auto-sync on load or at intervals with idempotent, edit-aware re-sync to avoid duplicates."

    stats: {
        downloads:  104
        updated_at: 1783511296000
    }
}
```

[^template]: [[Obsidian plugin]]
