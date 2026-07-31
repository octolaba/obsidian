---
uid: e769d105-3e07-5516-9f03-0639a2ea9238
xid:
  - extensions-sync-manager
aliases:
  - extensions-sync-manager
  - Extensions Sync Manager
  - diegomarzaa/obsidian-extensions-sync-manager
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/extensions-sync-manager
alt:
  - https://github.com/diegomarzaa/obsidian-extensions-sync-manager
downloads: 64
updated at: "2026-07-05T18:22:40Z"
related to:
  - "[[GitHub - 1290187675]]"
remind me:
---

# Extensions Sync Manager

Extensions Sync Manager compares the two configuration profiles a vault can hold - the desktop .obsidian folder and the mobile .obsidian_mobile folder - showing their extension folders and base JSON configs side by side. Extensions are copied, installed, removed and enabled or disabled, single JSON properties are synced, and targets are backed up before changes. Differences are tracked with content hashes, and an extension can be marked as both, PC-only, mobile-only, frozen or ignored.

```cue
plugin: {
    id:     "extensions-sync-manager"
    name:   "Extensions Sync Manager"
    author: "diegomarzaa"
    repo:   "diegomarzaa/obsidian-extensions-sync-manager"

    html_url:    "https://community.obsidian.md/plugins/extensions-sync-manager"
    github_url:  "https://github.com/diegomarzaa/obsidian-extensions-sync-manager"
    description: "Manage desktop and mobile extensions and configuration profiles. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Manage two Obsidian configuration profiles in one vault by comparing desktop (.obsidian) and mobile (.obsidian_mobile) extension folders and base JSON configs side-by-side. Copy, install, remove, enable/disable extensions, sync single JSON properties, and back up targets before changes while tracking differences with content hashes and marking extensions as both/PC-only/mobile-only/frozen/ignored."

    stats: {
        downloads:  64
        updated_at: 1783275760000
    }
}
```

[^template]: [[Obsidian plugin]]
