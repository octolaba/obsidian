---
uid: 42194d92-d92d-5083-92a7-9ff28cfaa6aa
xid:
  - onedrive-bidirectional-sync
aliases:
  - onedrive-bidirectional-sync
  - OneDrive Bidirectional Sync
  - naipi11/onedrive-bidirectional-sync
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/onedrive-bidirectional-sync
alt:
  - https://github.com/naipi11/onedrive-bidirectional-sync
downloads: 229
updated at: "2026-06-15T16:58:59Z"
related to:
  - "[[GitHub - 1270360541]]"
remind me:
---

# OneDrive Bidirectional Sync

OneDrive Bidirectional Sync keeps vault files in step across devices through a private OneDrive app folder, using Microsoft Graph rather than the OneDrive client, on Windows, macOS, Linux, iOS and Android. Vaults are stored inside the app folder scope granted by Files.ReadWrite.AppFolder, changes are detected against local snapshots, concurrent edits produce a local conflict copy, and the .obsidian folder is skipped by default.

```cue
plugin: {
    id:     "onedrive-bidirectional-sync"
    name:   "OneDrive Bidirectional Sync"
    author: "naipi11"
    repo:   "naipi11/onedrive-bidirectional-sync"

    html_url:    "https://community.obsidian.md/plugins/onedrive-bidirectional-sync"
    github_url:  "https://github.com/naipi11/onedrive-bidirectional-sync"
    description: "Synchronize vault files across devices through a private OneDrive app folder. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Sync your Obsidian vault bidirectionally with OneDrive via Microsoft Graph without the OneDrive client, running on Windows, macOS, Linux, iOS and Android. Use Files.ReadWrite.AppFolder to store vaults in OneDrive/Apps/<app>/vaults/<id>, detect changes with local snapshots, create \"local conflict\" copies on concurrent edits, and skip .obsidian by default."

    stats: {
        downloads:  229
        updated_at: 1781542739000
    }
}
```

[^template]: [[Obsidian plugin]]
