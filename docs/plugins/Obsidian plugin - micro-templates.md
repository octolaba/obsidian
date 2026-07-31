---
uid: f02cc4cc-a73d-5b7c-b353-37622befe0b6
xid:
  - micro-templates
aliases:
  - micro-templates
  - Micro templates
  - epszaw/obsidian-micro-templates
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/micro-templates
alt:
  - https://github.com/epszaw/obsidian-micro-templates
downloads: 4001
updated at: "2023-07-30T20:59:17Z"
related to:
  - "[[GitHub - 650678596]]"
remind me:
---

# Micro templates

Micro templates keeps reusable text snippets as templates in the vault and inserts them anywhere in a note. Templates are compiled with embedded JavaScript through the EJS engine, and dayjs is reachable as d() for date formatting. Placing $cur in a template sets the cursor position after insertion.

```cue
plugin: {
    id:     "micro-templates"
    name:   "Micro templates"
    author: "epszaw"
    repo:   "epszaw/obsidian-micro-templates"

    html_url:    "https://community.obsidian.md/plugins/micro-templates"
    github_url:  "https://github.com/epszaw/obsidian-micro-templates"
    description: "Flexible embedded micro templates powered by Javascript functions."
    about:       "Use templates stored in your vault as reusable text snippets and insert them anywhere in your notes. Compile templates with embedded JavaScript via the EJS engine and call dayjs using d() for date formatting. Place $cur in a template to set the cursor position after insertion."

    stats: {
        downloads:  4001
        updated_at: 1690750757000
    }
}
```

[^template]: [[Obsidian plugin]]
