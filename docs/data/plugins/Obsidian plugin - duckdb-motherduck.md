---
uid: 8c295ca5-21a6-5e36-ace7-319d155b897a
xid:
  - duckdb-motherduck
aliases:
  - duckdb-motherduck
  - DuckDB and MotherDuck
  - motherduckdb/obsidian-duckdb-motherduck
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/duckdb-motherduck
alt:
  - https://github.com/motherduckdb/obsidian-duckdb-motherduck
downloads: 634
updated at: "2026-06-06T19:08:20Z"
related to:
  - "[[GitHub - 1219929732]]"
remind me:
---

# DuckDB and MotherDuck

Queries local or remote files with DuckDB SQL from inside a note, covering Parquet, CSV, JSON, Excel, Iceberg, Delta and geospatial formats, and freezes the result inline as a plain Markdown table wrapped in sentinel comments. An optional MotherDuck token adds cloud databases and cloud compute, chosen per code block, and refreshes can be scheduled daily or weekly per note. A plugin API lets a shell or coding agent trigger a refresh from outside the app.

```cue
plugin: {
    id:     "duckdb-motherduck"
    name:   "DuckDB and MotherDuck"
    author: "Mehdi Ouazza"
    repo:   "motherduckdb/obsidian-duckdb-motherduck"

    html_url:    "https://community.obsidian.md/plugins/duckdb-motherduck"
    github_url:  "https://github.com/motherduckdb/obsidian-duckdb-motherduck"
    description: "Query files and cloud data with DuckDB SQL inside notes. Freeze results inline as markdown. Optional MotherDuck for cloud compute. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Bring external data into your Obsidian notes via DuckDB SQL, then freeze the results inline as plain markdown tables. * Query anything DuckDB reads — local or remote Parquet, CSV, JSON, Excel, Iceberg, Delta, and geospatial files. * Frozen results stay portable — regular markdown wrapped in sentinel comments. Diffs in git, renders in any editor, readable by any agent. * Optional MotherDuck connection — add a token to query cloud databases or push heavy SQL onto cloud compute. Both engines live side-by-side, picked per code block. * Scheduled refreshes — daily or weekly, per note. * Plugin API — trigger refreshes from a shell or coding agent (e.g Claude Code) via obsidian eval."

    stats: {
        downloads:  634
        updated_at: 1780772900000
    }
}
```

[^template]: [[Obsidian plugin]]
