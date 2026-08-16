---
uid: 4327c6f3-44b4-52e2-b98e-c7a7b2bf3aa4
xid:
  - graph-color-propagation
aliases:
  - graph-color-propagation
  - Graph Color Propagation
  - tacitustus/obsidian-graph-color-propagation
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/graph-color-propagation
alt:
  - https://github.com/tacitustus/obsidian-graph-color-propagation
downloads: 46
updated at: "2026-08-02T16:27:45Z"
related to:
  - "[[GitHub - 1320325574]]"
remind me:
---

# Graph Color Propagation

Colors uncolored notes in the graph by blending the hues of nearby grouped notes, weighting each contribution by closeness and by the number of link paths. The result is applied to the open Graph view and updates live as Graph view groups change. Spread and strength are adjustable, and the colors can also be applied manually.

```cue
plugin: {
    id:     "graph-color-propagation"
    name:   "Graph Color Propagation"
    author: "Tacitustus"
    repo:   "tacitustus/obsidian-graph-color-propagation"

    html_url:    "https://community.obsidian.md/plugins/graph-color-propagation"
    github_url:  "https://github.com/tacitustus/obsidian-graph-color-propagation"
    description: "Propagates graph node colors to uncolored nodes based on their connections. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Propagate graph node colors to uncolored notes by blending hues from nearby grouped notes, weighted by closeness and number of link paths, and apply the result to the open Graph view. Sync changes live with Graph view groups and offer adjustable spread/strength plus manual apply controls."

    stats: {
        downloads:  46
        updated_at: 1785688065000
    }
}
```

[^template]: [[Obsidian plugin]]
