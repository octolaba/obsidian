---
uid: a4deb5db-d320-521f-bafd-f39477be10eb
xid:
  - drivesync
aliases:
  - drivesync
  - DriveSync
  - lcjury/obsidian-drivesync
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/drivesync
alt:
  - https://github.com/lcjury/obsidian-drivesync
downloads: 98
updated at: "2026-07-11T20:46:48Z"
related to:
  - "[[GitHub - 1269365552]]"
remind me:
---

# DriveSync

Synchronizes the vault with Google Drive in both directions, including .obsidian while excluding a few workspace and graph files. A full reconciliation runs at startup, edits upload after a short debounce, and remote changes arrive by polling or a manual sync. Conflicts resolve newest-wins and the older version is kept as a separate conflicted file, using your own Google Cloud project and account.

```cue
plugin: {
    id:     "drivesync"
    name:   "DriveSync"
    author: "lcjury"
    repo:   "lcjury/obsidian-drivesync"

    html_url:    "https://community.obsidian.md/plugins/drivesync"
    github_url:  "https://github.com/lcjury/obsidian-drivesync"
    description: "Two-way sync your vault with Google Drive. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Sync your Obsidian vault bidirectionally with Google Drive, including .obsidian while excluding a few workspace/graph files. Perform full reconciliation on startup, upload edits after a short debounce, poll Drive for remote changes or run manual sync; newest wins and older versions are saved as (conflicted).md, using your own Google Cloud project and account."

    stats: {
        downloads:  98
        updated_at: 1783802808000
    }
}
```

[^template]: [[Obsidian plugin]]
