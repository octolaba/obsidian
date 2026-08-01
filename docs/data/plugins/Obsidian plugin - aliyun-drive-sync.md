---
uid: de03408e-354b-5d58-8c8f-13949671ca0c
xid:
  - aliyun-drive-sync
aliases:
  - aliyun-drive-sync
  - Aliyun Drive Sync
  - wjiajie/obsidian-aliyun-sync
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/aliyun-drive-sync
alt:
  - https://github.com/wjiajie/obsidian-aliyun-sync
downloads: 119
updated at: "2026-06-27T04:01:19Z"
related to:
  - "[[GitHub - 1275752380]]"
remind me:
---

# Aliyun Drive Sync

Syncs the vault to a chosen Aliyun Drive folder through the Aliyun Drive API, authenticating with an OpenList refresh_token. Sync is two-way and incremental across devices, with SHA-1 content checks, parallel transfers and deletion protection. Conflicts are handled with a three-way merge for Markdown, and status and progress are surfaced in the interface.

```cue
plugin: {
    id:     "aliyun-drive-sync"
    name:   "Aliyun Drive Sync"
    author: "Wjiajie"
    repo:   "wjiajie/obsidian-aliyun-sync"

    html_url:    "https://community.obsidian.md/plugins/aliyun-drive-sync"
    github_url:  "https://github.com/wjiajie/obsidian-aliyun-sync"
    description: "Sync an Obsidian vault to a selected Aliyun Drive cloud folder. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Sync your Obsidian vault to a specified Aliyun Drive cloud folder via the Aliyun Drive API using OpenList refresh_token authentication. Perform two-way, incremental sync across devices with SHA-1 content checks, parallel transfers, conflict handling (three-way merge for Markdown), deletion protection and status/progress integration."

    stats: {
        downloads:  119
        updated_at: 1782532879000
    }
}
```

[^template]: [[Obsidian plugin]]
