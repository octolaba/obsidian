---
uid: 199ef7f3-af74-5280-89b7-6051564f400f
xid:
  - adjacency-matrix-exporter
aliases:
  - adjacency-matrix-exporter
  - Adjacency Matrix Exporter
  - danielegrazzini/adjacency-matrix-exporter
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/adjacency-matrix-exporter
alt:
  - https://github.com/danielegrazzini/adjacency-matrix-exporter
downloads: 2372
updated at: "2023-10-29T22:29:17Z"
related to:
  - "[[GitHub - 711601552]]"
remind me:
---

# Adjacency Matrix Exporter

Adjacency Matrix Exporter writes an adjacency matrix of the vault to CSV in an absolute mode of raw link counts or a normalized mode dividing those counts by the source note's word count. Timestamped CSV files are saved into the vault, with a configurable separator and destination for external analysis.

```cue
plugin: {
    id:     "adjacency-matrix-exporter"
    name:   "Adjacency Matrix Exporter"
    author: "danielegrazzini"
    repo:   "danielegrazzini/adjacency-matrix-exporter"

    html_url:    "https://community.obsidian.md/plugins/adjacency-matrix-exporter"
    github_url:  "https://github.com/danielegrazzini/adjacency-matrix-exporter"
    description: "Create a numerical adjacency matrix of your vault in two ways: Absolute and Normalized."
    about:       "Export adjacency matrices of your vault as CSV in Absolute mode (raw link counts) or Normalized mode (counts divided by source note word count). Save timestamped CSV files to your vault and set the CSV separator and destination for easy external analysis."

    stats: {
        downloads:  2372
        updated_at: 1698618557000
    }
}
```

[^template]: [[Obsidian plugin]]
