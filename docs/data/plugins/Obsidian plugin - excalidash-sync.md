---
uid: 9b356535-63f1-5ca6-b0f3-22a1cf69b6ee
xid:
  - excalidash-sync
aliases:
  - excalidash-sync
  - ExcaliDash sync
  - siredvin/excalidash-obsidian-sync
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/excalidash-sync
alt:
  - https://github.com/siredvin/excalidash-obsidian-sync
downloads: 160
updated at: "2026-05-16T21:51:10Z"
related to:
  - "[[GitHub - 1237575553]]"
remind me:
---

# ExcaliDash sync

Sends Excalidraw notes that opt in through an excalidash-destination frontmatter key to an ExcaliDash instance. Targets are configured with bearer-token authentication and their connections can be tested, bidirectional sync pulls remote changes back when the local file is unchanged, and both Excalidraw file forms are handled alongside an optional excalidash-collection key.

```cue
plugin: {
    id:     "excalidash-sync"
    name:   "ExcaliDash sync"
    author: "SirEdvin"
    repo:   "siredvin/excalidash-obsidian-sync"

    html_url:    "https://community.obsidian.md/plugins/excalidash-sync"
    github_url:  "https://github.com/siredvin/excalidash-obsidian-sync"
    description: "Sync Excalidraw drawings from vault frontmatter into ExcaliDash. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Sync selected Excalidraw notes to ExcaliDash by opting in with frontmatter (excalidash-destination). Configure targets with bearer-token auth and test connections. Enable bidirectional sync to pull remote changes when the local file is unchanged, and support .excalidraw/.excalidraw.md files plus optional excalidash-collection frontmatter."

    stats: {
        downloads:  160
        updated_at: 1778968270000
    }
}
```

[^template]: [[Obsidian plugin]]
