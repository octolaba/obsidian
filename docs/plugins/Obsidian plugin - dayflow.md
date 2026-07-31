---
uid: e6a1f2fa-1ec5-5857-a9e0-3fb83716fc72
xid:
  - dayflow
aliases:
  - dayflow
  - Dayflow
  - caezium/obsidian-dayflow-plugin
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/dayflow
alt:
  - https://github.com/caezium/obsidian-dayflow-plugin
downloads: 141
updated at: "2026-06-05T09:31:28Z"
related to:
  - "[[GitHub - 1259044359]]"
remind me:
---

# Dayflow

Reads the chunks.sqlite database of the Dayflow application and generates daily and weekly notes carrying frontmatter and inline SVG charts, among them treemap, heatmap and Sankey. A Today side pane refreshes after each sync, Bases dashboards are included, and local ActivityWatch data can optionally enrich the result with per-application minutes. The project describes the plugin as local-first, reading the activity timeline read-only and making no network calls.

```cue
plugin: {
    id:     "dayflow"
    name:   "Dayflow"
    author: "caezium"
    repo:   "caezium/obsidian-dayflow-plugin"

    html_url:    "https://community.obsidian.md/plugins/dayflow"
    github_url:  "https://github.com/caezium/obsidian-dayflow-plugin"
    description: "Read your Dayflow activity timeline read-only and write daily + weekly notes into your vault, with inline SVG charts, Bases dashboards, and optional ActivityWatch enrichment. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Import Dayflow's chunks.sqlite to generate daily and weekly notes with rich frontmatter and inline SVG charts (treemap, heatmap, Sankey). Show a live Today side pane that auto-refreshes after sync, include Bases dashboards, and opt into local ActivityWatch enrichment for precise per-app minutes — all local-first with no network calls."

    stats: {
        downloads:  141
        updated_at: 1780651888000
    }
}
```

[^template]: [[Obsidian plugin]]
