---
uid: dc603305-9903-57b3-8d9e-b7f012e37ede
xid:
  - koi-sync
aliases:
  - koi-sync
  - KOI Sync
  - metagov/koi-obsidian-plugin
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/koi-sync
alt:
  - https://github.com/metagov/koi-obsidian-plugin
downloads: 284
updated at: "2026-04-09T21:57:58Z"
related to:
  - "[[GitHub - 900669428]]"
remind me:
---

# KOI Sync

Synchronizes knowledge objects from a KOI-net Telescope node into the vault by listening to RID events from a remote KOI-net server. Raw JSON is turned into readable Markdown through a Handlebars template that can be modified, and notes are kept updated automatically. A KOI API URL and API key identify the node to connect to.

```cue
plugin: {
    id:     "koi-sync"
    name:   "KOI Sync"
    author: "metagov"
    repo:   "metagov/koi-obsidian-plugin"

    html_url:    "https://community.obsidian.md/plugins/koi-sync"
    github_url:  "https://github.com/metagov/koi-obsidian-plugin"
    description: "Synchronizes data from a Slack Telescope instance using the KOI-net protocol."
    about:       "Sync knowledge objects from a KOI-net Telescope node into your Obsidian vault by listening to RID events from a remote KOI-net server. Generate human-readable Markdown from raw JSON using a modifiable Handlebars template and keep notes updated automatically. Set the KOI API URL and API key to connect to a specific node."

    stats: {
        downloads:  284
        updated_at: 1775771878000
    }
}
```

[^template]: [[Obsidian plugin]]
