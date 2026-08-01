---
uid: 92c1d86e-6755-548e-ba1f-f12039f0e6de
xid:
  - google-drive-mirror
aliases:
  - google-drive-mirror
  - Google Drive Mirror
  - laupas/google-drive-mirror
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/google-drive-mirror
alt:
  - https://github.com/laupas/google-drive-mirror
downloads: 107
updated at: "2026-07-23T06:53:00Z"
related to:
  - "[[GitHub - 1305668967]]"
remind me:
---

# Google Drive Mirror

Syncs the vault or a subfolder bidirectionally with a Google Drive folder, reconciling edits, additions and deletions and mirroring the folder structure recursively, including empty folders and all file types. Several pairings can be configured, Shared Drives included, conflicts are resolved by a newer-wins policy, and deletions are protected by local and Drive trash. Sync runs manually or automatically on desktop and mobile, with a live sync tree and a persistent log.

```cue
plugin: {
    id:     "google-drive-mirror"
    name:   "Google Drive Mirror"
    author: "Pascal  Lauener"
    repo:   "laupas/google-drive-mirror"

    html_url:    "https://community.obsidian.md/plugins/google-drive-mirror"
    github_url:  "https://github.com/laupas/google-drive-mirror"
    description: "Sync multiple vault folders to multiple Google Drive folders, including Shared Drives. Each pairing syncs a subfolder or the whole vault two-way, mirrors the folder structure, and picks up files created directly in Drive. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Sync your Obsidian vault or a subfolder bidirectionally with a Google Drive folder, reconciling edits, additions, and deletions. Mirror files recursively (including empty folders) and all file types, resolve conflicts with a newer-wins policy, and protect deletions via local and Drive trash. Use manual or automatic sync, browse a live sync tree and persistent log, and run on desktop and mobile with Shared Drive support."

    stats: {
        downloads:  107
        updated_at: 1784789580000
    }
}
```

[^template]: [[Obsidian plugin]]
