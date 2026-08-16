---
uid: d8f06ac3-ffde-57d9-8b8f-b1ef44005ff9
xid:
  - sync-db-os
aliases:
  - sync-db-os
  - ketd/obsidian-sync-DB-OS
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/sync-db-os
alt:
  - https://github.com/ketd/obsidian-sync-DB-OS
downloads: 317
updated at: "2024-07-05T01:36:20Z"
related to:
  - "[[GitHub - 822007833]]"
remind me:
---

# sync-db-os

Intended for synchronization between multiple platforms. Local images pasted into notes are uploaded to a configured object storage and their links rewritten to the remote URL. The recorded About text also describes resolving cross-device conflicts by manually choosing a version, and keeping large files such as PDFs in object storage while the database holds only their hash to track changes.

```cue
plugin: {
    id:     "sync-db-os"
    name:   "sync-db-os"
    author: "ketd"
    repo:   "ketd/obsidian-sync-DB-OS"

    html_url:    "https://community.obsidian.md/plugins/sync-db-os"
    github_url:  "https://github.com/ketd/obsidian-sync-DB-OS"
    description: "For synchronization between multiple platforms"
    about:       "Upload local images to your configured object storage when pasting into notes and update links to point to the remote URL. Compare and resolve cross-device conflicts by manually choosing versions, and store large files (PDFs) in object storage while keeping only their hash in the database to track changes."

    stats: {
        downloads:  317
        updated_at: 1720143380000
    }
}
```

[^template]: [[Obsidian plugin]]
