---
uid: 41bfcf9e-fa20-5b4f-bbe1-17b04e95553c
xid:
  - native-git-bridge
aliases:
  - native-git-bridge
  - Native Git Bridge
  - maxkalem/obsidian-native-git-bridge
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/native-git-bridge
alt:
  - https://github.com/maxkalem/obsidian-native-git-bridge
downloads: 45
updated at: "2026-08-11T02:29:18Z"
related to:
  - "[[GitHub - 1322188970]]"
remind me:
---

# Native Git Bridge

Runs the real git binary against an Android vault by calling Termux through a companion app, with first-class awareness of sparse-checkout. Status, pull, commit, push, fetch and sync, rename-aware per-file history, diffs and commit restores are covered, with conflict handling and hard blocks on unsafe sparse changes. It is Android-only and marked work in progress, and runs no background service, server or open port.

```cue
plugin: {
    id:     "native-git-bridge"
    name:   "Native Git Bridge"
    author: "Kalem"
    repo:   "maxkalem/obsidian-native-git-bridge"

    html_url:    "https://community.obsidian.md/plugins/native-git-bridge"
    github_url:  "https://github.com/maxkalem/obsidian-native-git-bridge"
    description: "WIP. Android only. Run Git on your vault through the real Git binary in Termux, with sparse-checkout safety. No background services, no servers, no open ports. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Run native Git from Obsidian on Android via Termux and a companion app, executing the real git binary with first-class sparse-checkout awareness. Handle status, pull, commit, push, fetch/sync, per-file (rename-aware) history, diffs and commit restores with conflict handling and hard blocks for unsafe sparse changes."

    stats: {
        downloads:  45
        updated_at: 1786415358000
    }
}
```

[^template]: [[Obsidian plugin]]
