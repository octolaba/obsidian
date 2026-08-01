---
uid: 2170877c-61c2-5863-974a-494c2120ccdb
xid:
  - sql-viewer
aliases:
  - sql-viewer
  - SQL Viewer
  - viggomeesters/obsidian-sql-viewer
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/sql-viewer
alt:
  - https://github.com/viggomeesters/obsidian-sql-viewer
downloads: 214
updated at: "2026-06-13T19:55:45Z"
related to:
  - "[[GitHub - 1262620543]]"
remind me:
---

# SQL Viewer

Local SQLite database files are opened read-only in a dedicated view listing tables, views and indexes together with metadata such as page count, size, encoding and the schema, user and application identifiers. Rows are previewed with lazy loading and caps, and objects and previews are filtered. A query runner accepts a single SELECT or WITH statement, blocks mutating keywords, and limits both the rows returned and the execution time.

```cue
plugin: {
    id:     "sql-viewer"
    name:   "SQL Viewer"
    author: "Viggo Meesters"
    repo:   "viggomeesters/obsidian-sql-viewer"

    html_url:    "https://community.obsidian.md/plugins/sql-viewer"
    github_url:  "https://github.com/viggomeesters/obsidian-sql-viewer"
    description: "Open SQLite database files as read-only schema, preview, and query views. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Inspect local .sqlite/.sqlite3/.db files in a dedicated view and browse tables, views, indexes, and metadata (page count, size, encoding, schema/user/app IDs). Preview rows with lazy loading and caps, filter objects and previews, and run a read-only single SELECT/WITH runner that blocks mutating keywords and limits rows and execution time."

    stats: {
        downloads:  214
        updated_at: 1781380545000
    }
}
```

[^template]: [[Obsidian plugin]]
