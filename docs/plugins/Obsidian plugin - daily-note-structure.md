---
uid: ba35bff1-4a03-52f2-8386-e9d125efe5e8
xid:
  - daily-note-structure
aliases:
  - daily-note-structure
  - Daily Note Structure
  - db-developer/daily-note-structure
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/daily-note-structure
alt:
  - https://github.com/db-developer/daily-note-structure
downloads: 600
updated at: "2026-01-18T22:22:05Z"
related to:
  - "[[GitHub - 816754339]]"
remind me:
---

# Daily Note Structure

Creates a structure of nested folders and files for daily notes from date-driven name patterns and templates. A FolderStructure definition in JSON-style form, moment.js date formats and custom week and month tokens such as MOW and MoW drive how the multi-file setup is generated.

```cue
plugin: {
    id:     "daily-note-structure"
    name:   "Daily Note Structure"
    author: "db-developer"
    repo:   "db-developer/daily-note-structure"

    html_url:    "https://community.obsidian.md/plugins/daily-note-structure"
    github_url:  "https://github.com/db-developer/daily-note-structure"
    description: "One-Click create a structure for and including your daily notes."
    about:       "Automate creation of nested folders and files for daily notes based on date-driven name patterns and templates. Define a FolderStructure (JSON-style) and use moment.js date formats plus custom week/month tokens (e.g., MOW, MoW) to generate consistent multi-file daily note setups."

    stats: {
        downloads:  600
        updated_at: 1768774925000
    }
}
```

[^template]: [[Obsidian plugin]]
