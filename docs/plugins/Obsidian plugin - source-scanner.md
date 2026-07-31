---
uid: d8ea6b02-7fcc-51cb-ab3d-2066d8680329
xid:
  - source-scanner
aliases:
  - source-scanner
  - Source Scanner
  - gerrie-myburgh/source-scanner
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/source-scanner
alt:
  - https://github.com/gerrie-myburgh/source-scanner
downloads: 342
updated at: "2026-03-29T11:16:49Z"
related to:
  - "[[GitHub - 658334089]]"
remind me:
---

# Source Scanner

Text and source files are scanned for marked comment blocks, which are extracted into Markdown notes. A user-defined folder hierarchy, for instance EPIC over ITEM over TEST, is preserved in the generated documentation, and the recorded inputs state that parsing is done by Rust executables.

```cue
plugin: {
    id:     "source-scanner"
    name:   "Source Scanner"
    author: "gerrie-myburgh"
    repo:   "gerrie-myburgh/source-scanner"

    html_url:    "https://community.obsidian.md/plugins/source-scanner"
    github_url:  "https://github.com/gerrie-myburgh/source-scanner"
    description: "Scanner that extracts comments from source and places it in Markdown files."
    about:       "Scan any text or source files for marked comment blocks and extract them as Markdown notes. Preserve a user-defined folder hierarchy (e.g., EPIC/ITEM/TEST) when generating documentation and parse quickly with Rust executables."

    stats: {
        downloads:  342
        updated_at: 1774783009000
    }
}
```

[^template]: [[Obsidian plugin]]
