---
uid: 29308065-850d-5209-ad9b-49a5032e46d1
xid:
  - duckdata
aliases:
  - duckdata
  - DuckData
  - atliuhui/obsidian-duckdata
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/duckdata
alt:
  - https://github.com/atliuhui/obsidian-duckdata
downloads: 94
updated at: "2026-06-20T16:52:18Z"
related to:
  - "[[GitHub - 1275223342]]"
remind me:
---

# DuckData

Runs SQL over data reachable from a note - inline CSV, Markdown tables, vault files in CSV, TSV, JSON or Parquet, and remote URLs - and renders the result as a table or an ECharts visualization inside a duckdata code block. Queries execute locally with DuckDB-WASM on desktop only, each source is exposed as a query-scoped CTE named data, and several blocks run in parallel.

```cue
plugin: {
    id:     "duckdata"
    name:   "DuckData"
    author: "atliuhui"
    repo:   "atliuhui/obsidian-duckdata"

    html_url:    "https://community.obsidian.md/plugins/duckdata"
    github_url:  "https://github.com/atliuhui/obsidian-duckdata"
    description: "Query and visualize vault/markdown data with embedded duckdata code blocks, powered by DuckDB-WASM. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Run SQL against data in your notes — inline CSV, markdown tables, vault files (CSV/TSV/JSON/Parquet), or remote URLs — and render results as tables or ECharts visualizations inside a code block. Execute queries locally with DuckDB-WASM (desktop only) so data stays in your vault, expose each source as a query-scoped CTE named data, and run multiple blocks in parallel."

    stats: {
        downloads:  94
        updated_at: 1781974338000
    }
}
```

[^template]: [[Obsidian plugin]]
