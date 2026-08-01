---
uid: e8a60f9f-4beb-5070-ad4b-7cd406ca4839
xid:
  - google-drive-merge-sync
aliases:
  - google-drive-merge-sync
  - Google Drive Merge Sync
  - kebl3541/Obsidian-Google-Drive-Merge-Sync
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/google-drive-merge-sync
alt:
  - https://github.com/kebl3541/Obsidian-Google-Drive-Merge-Sync
downloads: 161
updated at: "2026-07-12T17:56:58Z"
related to:
  - "[[GitHub - 1292822691]]"
remind me:
---

# Google Drive Merge Sync

Syncs the vault with Google Drive using the user's own Google OAuth client and locally held tokens, restricted to the plugin's own Drive folder. Conflicting notes are merged word by word through a three-way merge against the last synced version instead of producing conflicted copies. The exact sync plan can be previewed before a run, and deletions go to trash rather than disappearing.

```cue
plugin: {
    id:     "google-drive-merge-sync"
    name:   "Google Drive Merge Sync"
    author: "kebl3541"
    repo:   "kebl3541/Obsidian-Google-Drive-Merge-Sync"

    html_url:    "https://community.obsidian.md/plugins/google-drive-merge-sync"
    github_url:  "https://github.com/kebl3541/Obsidian-Google-Drive-Merge-Sync"
    description: "Sync your vault with Google Drive using your own credentials. Text conflicts resolve by word level three way merge instead of conflicted copies, and deletes go to trash, never into the void. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Sync your vault with Google Drive using your own Google OAuth client and local tokens, restricting the plugin to its own Drive folder. Merge conflicting notes with a word-level three-way merge against the last synced version, preview the exact sync plan before running, and send deletions to trash so nothing is lost."

    stats: {
        downloads:  161
        updated_at: 1783879018000
    }
}
```

[^template]: [[Obsidian plugin]]
