---
uid: ab831b68-87a8-5fc0-89a8-2bfab1915274
xid:
  - abbrlink
aliases:
  - abbrlink
  - Abbrlink
  - hoshino-yumetsuki/obsidian-plugin-abbrlink
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/abbrlink
alt:
  - https://github.com/hoshino-yumetsuki/obsidian-plugin-abbrlink
downloads: 656
updated at: "2025-09-25T12:37:28Z"
related to:
  - "[[GitHub - 890790564]]"
remind me:
---

# Abbrlink

Abbrlink generates permanent short links for Markdown files by writing an abbrlink field into each file's frontmatter. Generation runs automatically or as a manual batch, with a configurable hash length or a random SHA256 mode. Collisions are detected and prevented, and files that already carry an abbrlink are skipped.

```cue
plugin: {
    id:     "abbrlink"
    name:   "Abbrlink"
    author: "hoshino-yumetsuki"
    repo:   "hoshino-yumetsuki/obsidian-plugin-abbrlink"

    html_url:    "https://community.obsidian.md/plugins/abbrlink"
    github_url:  "https://github.com/hoshino-yumetsuki/obsidian-plugin-abbrlink"
    description: "Automatically generate permanent short links for your markdown files."
    about:       "Generate permanent unique links for Markdown files by adding an abbrlink field to each file's frontmatter. Use automatic or manual batch generation, choose hash length or random SHA256 mode, detect and prevent collisions, and skip files that already have abbrlinks."

    stats: {
        downloads:  656
        updated_at: 1758803848000
    }
}
```

[^template]: [[Obsidian plugin]]
