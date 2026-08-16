---
uid: 3eadb535-1081-5ce8-a7f2-50e7eb947426
xid:
  - index-checker
aliases:
  - index-checker
  - Index Checker
  - pavlodeshko/obsidian-index-checker
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/index-checker
alt:
  - https://github.com/pavlodeshko/obsidian-index-checker
downloads: 5818
updated at: "2025-02-28T10:36:52Z"
related to:
  - "[[GitHub - 637389781]]"
remind me:
---

# Index Checker

Checks index or MOC files, both notes and Canvas files, for links to files they should reference but do not, including nested folders and multiple index types. Missing links are added to the index itself or to a dedicated file, keeping Markdown link formatting and Canvas card placement. Checks run manually or automatically when the vault is opened.

```cue
plugin: {
    id:     "index-checker"
    name:   "Index Checker"
    author: "pavlodeshko"
    repo:   "pavlodeshko/obsidian-index-checker"

    html_url:    "https://community.obsidian.md/plugins/index-checker"
    github_url:  "https://github.com/pavlodeshko/obsidian-index-checker"
    description: "Make sure your index \"MOC\" files (notes or Canvas) contain all links they should contain."
    about:       "Check index (MOC) notes and Canvas files for missing links to files they should reference, including nested folders and multiple index types. Add missing links directly to the index or to a dedicated file while keeping Markdown link formatting and Canvas card placement. Run checks manually or automatically on vault open."

    stats: {
        downloads:  5818
        updated_at: 1740739012000
    }
}
```

[^template]: [[Obsidian plugin]]
