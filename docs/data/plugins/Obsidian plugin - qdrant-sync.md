---
uid: 719378ad-32cc-5995-b58d-54f9219378ab
xid:
  - qdrant-sync
aliases:
  - qdrant-sync
  - Qdrant Sync
  - lanjak/obsidian-qdrant-sync
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/qdrant-sync
alt:
  - https://github.com/lanjak/obsidian-qdrant-sync
downloads: 12
updated at: "2026-07-18T00:30:16Z"
related to:
  - "[[GitHub - 1304463705]]"
remind me:
---

# Qdrant Sync

Syncs the vault across devices through a self-hosted Qdrant instance instead of Obsidian Sync or CouchDB, using direct HTTP or HTTPS transfer on desktop and mobile. Every note is embedded into the Qdrant collection, so the same store doubles as a semantic search index that agent tooling can query from outside Obsidian.

```cue
plugin: {
    id:     "qdrant-sync"
    name:   "Qdrant Sync"
    author: "lanjak"
    repo:   "lanjak/obsidian-qdrant-sync"

    html_url:    "https://community.obsidian.md/plugins/qdrant-sync"
    github_url:  "https://github.com/lanjak/obsidian-qdrant-sync"
    description: "Syncs this vault to a self-hosted Qdrant collection instead of Obsidian Sync/CouchDB - every note is embedded for semantic search from agent tooling too. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Sync your Obsidian vault across devices using a self-hosted Qdrant instance instead of cloud sync services. Embed each note into a Qdrant collection to build a semantic search index you can query from outside Obsidian, with direct HTTP(S) sync that works on desktop and mobile."

    stats: {
        downloads:  12
        updated_at: 1784334616000
    }
}
```

[^template]: [[Obsidian plugin]]
