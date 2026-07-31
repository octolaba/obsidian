---
uid: c8e0190f-a977-553d-81b7-be7a871debcb
xid:
  - tsdb
aliases:
  - tsdb
  - TSDB
  - dtkav/obsidian-tsdb
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/tsdb
alt:
  - https://github.com/dtkav/obsidian-tsdb
downloads: 650
updated at: "2026-07-10T23:50:30Z"
related to:
  - "[[GitHub - 1292919001]]"
remind me:
---

# TSDB

A local time series database that stores metrics from other plugins and renders real-time charts in notes from PromQL queries. Counters, gauges, histograms and summaries are registered through a TypeScript API, and external Prometheus endpoints can be scraped. Obsidian performance metrics and vault metrics are included.

```cue
plugin: {
    id:     "tsdb"
    name:   "TSDB"
    author: "Daniel Grossmann-Kavanagh"
    repo:   "dtkav/obsidian-tsdb"

    html_url:    "https://community.obsidian.md/plugins/tsdb"
    github_url:  "https://github.com/dtkav/obsidian-tsdb"
    description: "Local time series database for storing your plugin's metrics. Embed real-time charts into your notes with PromQL. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Embed real-time charts into your notes with PromQL. Register your own plugin's Counters, Gauges, Histograms and Summaries via the TypeScript API, or scrape external Prometheus endpoints. Includes Obsidian performance metrics, and vault metrics."

    stats: {
        downloads:  650
        updated_at: 1783727430000
    }
}
```

[^template]: [[Obsidian plugin]]
