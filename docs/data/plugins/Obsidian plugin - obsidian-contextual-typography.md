---
uid: 1f5aa7e6-42d9-5e1b-907a-7a7d8746d069
xid:
  - obsidian-contextual-typography
aliases:
  - obsidian-contextual-typography
  - Contextual Typography
  - mgmeyers/obsidian-contextual-typography
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/obsidian-contextual-typography
alt:
  - https://github.com/mgmeyers/obsidian-contextual-typography
downloads: 111351
updated at: "2023-05-07T02:14:24Z"
related to:
  - "[[GitHub - 321754030]]"
remind me:
---

# Contextual Typography

Contextual Typography adds a data-tag-name attribute to every top-level div in preview mode, carrying the tag name of the child it wraps. That attribute lets CSS target preview blocks by their surrounding heading tag for context-aware typography; the plugin adds no styles itself.

```cue
plugin: {
    id:     "obsidian-contextual-typography"
    name:   "Contextual Typography"
    author: "mgmeyers"
    repo:   "mgmeyers/obsidian-contextual-typography"

    html_url:    "https://community.obsidian.md/plugins/obsidian-contextual-typography"
    github_url:  "https://github.com/mgmeyers/obsidian-contextual-typography"
    description: "Add a data-tag-name attribute to all top-level divs in preview mode containing the child's tag name, allowing contextual typography styling."
    about:       "Add a data-tag-name attribute to every top-level markdown preview div to enable contextual CSS targeting. Target preview blocks by surrounding heading tags for precise, context-aware typography; the plugin does not add styles itself."

    stats: {
        downloads:  111351
        updated_at: 1683425664000
    }
}
```

[^template]: [[Obsidian plugin]]
