---
uid: 312811e8-4735-56be-befe-04571b9cbcc4
xid:
  - obsidian-handlebars
aliases:
  - obsidian-handlebars
  - Handlebars Template Plugin
  - sbquinlan/obsidian-handlebars
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/obsidian-handlebars
alt:
  - https://github.com/sbquinlan/obsidian-handlebars
downloads: 4534
updated at: "2024-02-06T04:28:35Z"
related to:
  - "[[GitHub - 558635151]]"
remind me:
---

# Handlebars Template Plugin

Adds Handlebars template blocks to notes, rendering frontmatter-driven templates into Markdown inline. A notes block helper iterates over vault files and a link partial creates internal links, using each note's name, path and frontmatter metadata.

```cue
plugin: {
    id:     "obsidian-handlebars"
    name:   "Handlebars Template Plugin"
    author: "sbquinlan"
    repo:   "sbquinlan/obsidian-handlebars"

    html_url:    "https://community.obsidian.md/plugins/obsidian-handlebars"
    github_url:  "https://github.com/sbquinlan/obsidian-handlebars"
    description: "Add support for Handlebars template blocks in notes."
    about:       "Add Handlebars templating to Obsidian to render frontmatter-driven templates and generate Markdown from inline template blocks. Iterate vault files with the notes block helper and create internal links with the link partial, using note metadata (name, path, frontmatter) for each item."

    stats: {
        downloads:  4534
        updated_at: 1707193715000
    }
}
```

[^template]: [[Obsidian plugin]]
