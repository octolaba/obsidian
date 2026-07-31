---
uid: 5ee62c58-8157-54d6-ba24-51b7c8149746
xid:
  - graph-depth-gradient
aliases:
  - graph-depth-gradient
  - Graph Depth Gradient
  - junghyunbak/graph-depth-gradient
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/graph-depth-gradient
alt:
  - https://github.com/junghyunbak/graph-depth-gradient
downloads: 140
updated at: "2026-06-29T11:39:54Z"
related to:
  - "[[GitHub - 1282013764]]"
remind me:
---

# Graph Depth Gradient

Colours graph nodes by depth, as a gradient interpolating between a start colour at depth 0 and an end colour at the configured maximum depth and beyond. The recorded inputs disagree on what depth means: the index description says hop distance from the active note, while the captured About says folder depth. It overrides other node-colouring schemes and applies to both the global and local graph, on desktop only.

```cue
plugin: {
    id:     "graph-depth-gradient"
    name:   "Graph Depth Gradient"
    author: "Jeonghyeon Park"
    repo:   "junghyunbak/graph-depth-gradient"

    html_url:    "https://community.obsidian.md/plugins/graph-depth-gradient"
    github_url:  "https://github.com/junghyunbak/graph-depth-gradient"
    description: "Color graph nodes by hop distance from the active note, as a gradient between two colors. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Color graph view nodes by folder depth using a gradient between two colors. Map depth 0 to the start color and the configured max depth (and deeper) to the end color, with intermediate depths interpolated. Override other node-coloring schemes and work in Global and Local graph (desktop-only)."

    stats: {
        downloads:  140
        updated_at: 1782733194000
    }
}
```

[^template]: [[Obsidian plugin]]
