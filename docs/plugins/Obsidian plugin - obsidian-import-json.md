---
uid: a88bd080-0fd1-515f-8b77-6250b7a3ab50
xid:
  - obsidian-import-json
aliases:
  - obsidian-import-json
  - JSON-CSV Importer
  - farling42/obsidian-import-json
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/obsidian-import-json
alt:
  - https://github.com/farling42/obsidian-import-json
downloads: 75015
updated at: "2026-07-07T15:43:51Z"
related to:
  - "[[GitHub - 442504460]]"
remind me:
---

# JSON-CSV Importer

Imports a JSON file containing an array of data, or a CSV table, and creates one note per JSON object or CSV row. Handlebars templates with optional JavaScript helpers map fields into note content and build note titles from fields or from code. The JSON is read from a local file or fetched from a URL.

```cue
plugin: {
    id:     "obsidian-import-json"
    name:   "JSON-CSV Importer"
    author: "farling42"
    repo:   "farling42/obsidian-import-json"

    html_url:    "https://community.obsidian.md/plugins/obsidian-import-json"
    github_url:  "https://github.com/farling42/obsidian-import-json"
    description: "Import a JSON file containing an array of data, creating notes from a Handlebars template file."
    about:       "Import JSON or CSV tables and create one Obsidian note per CSV row or JSON object. Use Handlebars templates and optional JS helpers to map fields, build note titles from fields or code, and pull JSON from local files or URLs."

    stats: {
        downloads:  75015
        updated_at: 1783439031000
    }
}
```

[^template]: [[Obsidian plugin]]
