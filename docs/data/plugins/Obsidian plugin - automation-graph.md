---
uid: a63fe1b2-a564-5143-88f9-1a7ec43956ca
xid:
  - automation-graph
aliases:
  - automation-graph
  - Automation Graph
  - emilbob/obsidian-automation-graph
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/automation-graph
alt:
  - https://github.com/emilbob/obsidian-automation-graph
downloads: 77
updated at: "2026-08-09T17:21:15Z"
related to:
  - "[[GitHub - 1322892554]]"
remind me:
---

# Automation Graph

Draws a repository's automation as a live graph generated from the workflow files themselves and from optional declared automation notes, rather than from a hand-maintained diagram. Edges are inferred from matching facts across workflows, and automation that is external or only declared is drawn as a dashed, unverifiable node.

```cue
plugin: {
    id:     "automation-graph"
    name:   "Automation Graph"
    author: "Emil Bob"
    repo:   "emilbob/obsidian-automation-graph"

    html_url:    "https://community.obsidian.md/plugins/automation-graph"
    github_url:  "https://github.com/emilbob/obsidian-automation-graph"
    description: "Draws your repository's automation as a live graph, derived from the workflow files themselves rather than from a diagram you have to maintain. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Draw your repository's automation as a live graph generated from workflow files and optional declared automation notes. Infer edges from matching workflow facts and mark external or declared automation as dashed, unverifiable nodes to keep the diagram in sync."

    stats: {
        downloads:  77
        updated_at: 1786296075000
    }
}
```

[^template]: [[Obsidian plugin]]
