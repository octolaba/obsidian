---
uid: 89ae159a-6fd3-5702-8ca8-59c34e08baf4
xid:
  - auto-refresh-explorer
aliases:
  - auto-refresh-explorer
  - Auto Refresh Explorer
  - mathieubonvaletpro-commits/auto-refresh-explorer
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/auto-refresh-explorer
alt:
  - https://github.com/mathieubonvaletpro-commits/auto-refresh-explorer
downloads: 450
updated at: "2026-04-28T22:21:10Z"
related to:
  - "[[GitHub - 1223996119]]"
remind me:
---

# Auto Refresh Explorer

Auto Refresh Explorer makes files created in the vault by external sync tools appear in the file explorer without a reload, by injecting them into Obsidian's index. It detects changes by polling folder modification times about every three seconds and creates proper file entries, so the explorer and the metadata cache update immediately.

```cue
plugin: {
    id:     "auto-refresh-explorer"
    name:   "Auto Refresh Explorer"
    author: "mathieubonvaletpro-commits"
    repo:   "mathieubonvaletpro-commits/auto-refresh-explorer"

    html_url:    "https://community.obsidian.md/plugins/auto-refresh-explorer"
    github_url:  "https://github.com/mathieubonvaletpro-commits/auto-refresh-explorer"
    description: "Automatically refreshes the file explorer when external sync tools create new files in the vault. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Refresh the file explorer automatically when external sync tools add files, injecting new files into Obsidian's index so they appear instantly without reloading. Detect changes by polling folder mtimes every ~3 seconds and create proper TFile entries so the explorer and metadata cache update immediately."

    stats: {
        downloads:  450
        updated_at: 1777414870000
    }
}
```

[^template]: [[Obsidian plugin]]
