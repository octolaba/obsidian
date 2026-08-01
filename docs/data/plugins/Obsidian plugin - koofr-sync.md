---
uid: c076ba77-953e-5dab-a10c-d5f00a2b3668
xid:
  - koofr-sync
aliases:
  - koofr-sync
  - Koofr Sync
  - bartekmp/koofr-obsidian-sync
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/koofr-sync
alt:
  - https://github.com/bartekmp/koofr-obsidian-sync
downloads: 2
updated at: "2026-07-23T21:24:49Z"
related to:
  - "[[GitHub - 1298544848]]"
remind me:
---

# Koofr Sync

Syncs the vault with Koofr cloud storage using event-driven, bidirectional sync on desktop and mobile. Authentication uses an app-specific password rather than OAuth, and conflicts can be handled by overwriting, duplicating or reviewing a manual diff. Any mount or folder can be synced, pull-only backups are supported, and workspace UI files are skipped.

```cue
plugin: {
    id:     "koofr-sync"
    name:   "Koofr Sync"
    author: "bartekmp"
    repo:   "bartekmp/koofr-obsidian-sync"

    html_url:    "https://community.obsidian.md/plugins/koofr-sync"
    github_url:  "https://github.com/bartekmp/koofr-obsidian-sync"
    description: "Sync your vault with Koofr cloud storage. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Sync your Obsidian vault with Koofr cloud storage using event-driven, bidirectional sync that works on desktop and mobile. Use simple app-specific password auth (no OAuth), choose conflict handling (overwrite, duplicate, or manual diff review), sync any mount/folder or use pull-only backups, and skip workspace UI files."

    stats: {
        downloads:  2
        updated_at: 1784841889000
    }
}
```

[^template]: [[Obsidian plugin]]
