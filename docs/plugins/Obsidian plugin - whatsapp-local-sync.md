---
uid: 5bc606b4-b0d1-53cf-a3e2-78329c6ffac6
xid:
  - whatsapp-local-sync
aliases:
  - whatsapp-local-sync
  - WhatsApp Local Sync
  - nabheetcloud/Obsidian-Whatsapp
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/whatsapp-local-sync
alt:
  - https://github.com/nabheetcloud/Obsidian-Whatsapp
downloads: 75
updated at: "2026-07-04T03:34:07Z"
related to:
  - "[[GitHub - 1288840912]]"
remind me:
---

# WhatsApp Local Sync

Reads the local SQLite database of WhatsApp Desktop and mirrors each conversation into the vault as one transcript note. Syncing is incremental and read-only: new messages are appended under dated headers, and every note carries YAML frontmatter. The process stays local, with no network, no cloud and no API keys, and it runs on desktop only.

```cue
plugin: {
    id:     "whatsapp-local-sync"
    name:   "WhatsApp Local Sync"
    author: "Nabheet Madan"
    repo:   "nabheetcloud/Obsidian-Whatsapp"

    html_url:    "https://community.obsidian.md/plugins/whatsapp-local-sync"
    github_url:  "https://github.com/nabheetcloud/Obsidian-Whatsapp"
    description: "Read your local WhatsApp Desktop message database and mirror chats into your vault as one transcript note per conversation. Read-only, incremental, fully local — no network, no cloud, no API keys. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Mirror WhatsApp Desktop chats into your vault by reading the app's local SQLite database and creating one transcript note per conversation. Sync incrementally and append new messages under YYYY-MM-DD headers with YAML frontmatter while keeping the process fully local and read-only (desktop only)."

    stats: {
        downloads:  75
        updated_at: 1783136047000
    }
}
```

[^template]: [[Obsidian plugin]]
