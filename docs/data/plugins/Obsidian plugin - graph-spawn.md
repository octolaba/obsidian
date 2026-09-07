---
uid: b18f7029-6815-5fae-b9c3-7ffbc6b75b20
xid:
  - graph-spawn
aliases:
  - graph-spawn
  - Graph Spawn
  - tjqscott/obsidian-graph-spawn
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/graph-spawn
alt:
  - https://github.com/tjqscott/obsidian-graph-spawn
downloads: 30
updated at: "2026-08-03T20:49:34Z"
related to:
  - "[[GitHub - 1322224038]]"
remind me:
---

# Graph Spawn

Seeds node positions in the graph before the force simulation starts, so disconnected clusters do not spawn on top of one another. Connected components are detected, each component's center is placed on a ring, and its nodes are scattered into discs scaled to the component's size. The effect is that separate components begin apart rather than tangled.

```cue
plugin: {
    id:     "graph-spawn"
    name:   "Graph Spawn"
    author: "Taylor Scott"
    repo:   "tjqscott/obsidian-graph-spawn"

    html_url:    "https://community.obsidian.md/plugins/graph-spawn"
    github_url:  "https://github.com/tjqscott/obsidian-graph-spawn"
    description: "Seeds each disconnected cluster of the graph at its own starting position, so components do not spawn on top of each other and stay tangled. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Spread graph components apart by seeding node positions before the force simulation. Detect connected components, place each component's center on a ring and scatter its nodes into size-scaled discs so disconnected clusters start separated and avoid becoming tangled in the graph."

    stats: {
        downloads:  30
        updated_at: 1785790174000
    }
}
```

[^template]: [[Obsidian plugin]]
