---
uid: e32e00e9-2524-5e4b-b324-398b243417e5
xid:
  - lkmavi-smart-git-sync
aliases:
  - lkmavi-smart-git-sync
  - Smart Git Sync
  - lkmavi/smart-git-sync
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/lkmavi-smart-git-sync
alt:
  - https://github.com/lkmavi/smart-git-sync
downloads: 172
updated at: "2026-06-27T17:33:19Z"
related to:
  - "[[GitHub - 1280200897]]"
remind me:
---

# Smart Git Sync

Syncs the vault with a Git remote, committing and pushing after every save with debouncing and running a rebase pull before pushing to keep changes conflict-safe. Background pulls run periodically, an immediate pull can be triggered through a local webhook, and an action menu offers quick controls or a temporary pause.

```cue
plugin: {
    id:     "lkmavi-smart-git-sync"
    name:   "Smart Git Sync"
    author: "lkmavi"
    repo:   "lkmavi/smart-git-sync"

    html_url:    "https://community.obsidian.md/plugins/lkmavi-smart-git-sync"
    github_url:  "https://github.com/lkmavi/smart-git-sync"
    description: "Auto git sync — commit & push on every save - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Sync your vault with a Git remote, committing and pushing after every save (debounced) and running git pull --rebase before pushes to keep changes conflict-safe. Perform periodic background pulls, trigger immediate pulls via a local webhook, use the action menu for quick controls, or pause syncing temporarily."

    stats: {
        downloads:  172
        updated_at: 1782581599000
    }
}
```

[^template]: [[Obsidian plugin]]
