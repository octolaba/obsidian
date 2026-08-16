---
uid: 6d6ce022-edcd-5b75-9e22-94703996f854
xid:
  - memos-sync
aliases:
  - memos-sync
  - Memos Sync
  - ryojerryyu/obsidian-memos-sync
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/memos-sync
alt:
  - https://github.com/ryojerryyu/obsidian-memos-sync
downloads: 3707
updated at: "2025-03-23T17:15:48Z"
related to:
  - "[[GitHub - 804956365]]"
remind me:
---

# Memos Sync

The plugin synchronises memos from a Memos server into daily notes, creating the daily note when it is missing and inserting memos under a chosen header. It records the last sync for incremental updates and can force a resync of all memos or of the current day, and it saves memo attachments into a chosen folder.

```cue
plugin: {
    id:     "memos-sync"
    name:   "Memos Sync"
    author: "ryojerryyu"
    repo:   "ryojerryyu/obsidian-memos-sync"

    html_url:    "https://community.obsidian.md/plugins/memos-sync"
    github_url:  "https://github.com/ryojerryyu/obsidian-memos-sync"
    description: "Syncing memos from a Memos server to your daily note. Fully compatible with official Daily Notes plugin, Calendar plugin and Periodic Notes plugin."
    about:       "Sync memos from a Memos server into Obsidian daily notes, creating the daily note if missing and inserting memos under a specified header. Remember the last sync and perform incremental updates, or force-resync all memos or only the current day. Save memo attachments to a chosen folder."

    stats: {
        downloads:  3707
        updated_at: 1742750148000
    }
}
```

[^template]: [[Obsidian plugin]]
