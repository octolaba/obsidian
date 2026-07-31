---
uid: 96a9fb8f-5b85-5f74-a742-dd420917e384
xid:
  - folderandgraphs-plus
aliases:
  - folderandgraphs-plus
  - Folder and Graphs Plus
  - pilafdob/folderandgraphs-plus
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/folderandgraphs-plus
alt:
  - https://github.com/pilafdob/folderandgraphs-plus
downloads: 381
updated at: "2026-07-12T21:04:39Z"
related to:
  - "[[GitHub - 1275933270]]"
remind me:
---

# Folder and Graphs Plus

Colours the folder nodes produced by Folder2Graph to match the group colours of the native graph view, reading the groups of the open graph and falling back to the stored graph configuration. Folders sharing a basename are combined into one graph node while colour matching stays per path. The changes are visual only, so vault files and folders are unchanged.

```cue
plugin: {
    id:     "folderandgraphs-plus"
    name:   "Folder and Graphs Plus"
    author: "pilafdob"
    repo:   "pilafdob/folderandgraphs-plus"

    html_url:    "https://community.obsidian.md/plugins/folderandgraphs-plus"
    github_url:  "https://github.com/pilafdob/folderandgraphs-plus"
    description: "Colours Folder2Graph folder nodes with matching native Graph View group colours. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Colour Folder2Graph folder nodes to match native Graph View group colours by reading open graph groups (fallback to .obsidian/graph.json). Combine folders with the same basename into one graph node while preserving per-path colour matching, and keep all changes visual-only so vault files and folders remain unchanged."

    stats: {
        downloads:  381
        updated_at: 1783890279000
    }
}
```

[^template]: [[Obsidian plugin]]
