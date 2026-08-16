---
uid: 0691a4d8-066c-5112-9342-9421adb97d83
xid:
  - style-importer
aliases:
  - style-importer
  - Style Importer
  - joshrouwhorst/style-importer
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/style-importer
alt:
  - https://github.com/joshrouwhorst/style-importer
downloads: 4683
updated at: "2023-06-12T14:08:20Z"
related to:
  - "[[GitHub - 652272353]]"
remind me:
---

# Style Importer

A stylesheet is fetched from a URL and written into the snippets folder as a single file named style-importer.css, which keeps the same styles across several vaults. The recorded inputs state that requests are restricted to the URLs supplied by the user and that only that one snippet file is written.

```cue
plugin: {
    id:     "style-importer"
    name:   "Style Importer"
    author: "joshrouwhorst"
    repo:   "joshrouwhorst/style-importer"

    html_url:    "https://community.obsidian.md/plugins/style-importer"
    github_url:  "https://github.com/joshrouwhorst/style-importer"
    description: "Import a stylesheet from a URL into your snippets folder."
    about:       "Import CSS from a URL and save it as .obsidian/snippets/style-importer.css to keep styles synced across multiple vaults. Keep requests restricted to the URLs you provide and write only that single snippet file."

    stats: {
        downloads:  4683
        updated_at: 1686578900000
    }
}
```

[^template]: [[Obsidian plugin]]
