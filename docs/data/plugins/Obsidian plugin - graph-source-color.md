---
uid: ac0ba85a-022e-5e9a-b8f2-34f00e270843
xid:
  - graph-source-color
aliases:
  - graph-source-color
  - Graph Source Color
  - karl-cn/graph-source-color
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/graph-source-color
alt:
  - https://github.com/karl-cn/graph-source-color
downloads: 227
updated at: "2026-05-22T13:11:07Z"
related to:
  - "[[GitHub - 1242179958]]"
remind me:
---

# Graph Source Color

Colours graph nodes according to source notes in configured folders, giving each folder a colour group and cascading a parent folder's colour to its subfolders. Outgoing and incoming links are traced recursively so linked notes inherit source colours, and a node tied to several sources is split in two or drawn as a pie for three or more. Obsidian's own graph.json is left unchanged and colours set in the graph settings are respected.

```cue
plugin: {
    id:     "graph-source-color"
    name:   "Graph Source Color"
    author: "Karl"
    repo:   "karl-cn/graph-source-color"

    html_url:    "https://community.obsidian.md/plugins/graph-source-color"
    github_url:  "https://github.com/karl-cn/graph-source-color"
    description: "根据源点笔记动态着色图谱节点 - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Color graph nodes based on source notes in configured folders, assigning each folder a color group and cascading parent folder colors to subfolders. Trace outgoing and incoming links recursively so linked notes inherit source colors and display split-color nodes when tied to multiple sources (left/right for two, pie for three+). Keep Obsidian's native graph.json unchanged and respect colors set in Obsidian's graph settings."

    stats: {
        downloads:  227
        updated_at: 1779455467000
    }
}
```

[^template]: [[Obsidian plugin]]
