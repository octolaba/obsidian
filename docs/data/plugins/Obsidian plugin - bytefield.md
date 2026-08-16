---
uid: aefe5722-577a-5a19-a5f2-f3769b14878d
xid:
  - bytefield
aliases:
  - bytefield
  - Byte Field Diagrams
  - natri0/obsidian-bytefield
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/bytefield
alt:
  - https://github.com/natri0/obsidian-bytefield
downloads: 344
updated at: "2025-05-01T14:07:36Z"
related to:
  - "[[GitHub - 961483979]]"
remind me:
---

# Byte Field Diagrams

Byte Field Diagrams renders byte-field diagrams from Markdown code blocks, parsing lines of the form name: length to show how a structure is laid out in memory or on the network. It displays byte offsets and field sizes, and supports custom start offsets, unnamed padding fields, comment lines, and automatic wrapping for fields that exceed a row.

```cue
plugin: {
    id:     "bytefield"
    name:   "Byte Field Diagrams"
    author: "natri0"
    repo:   "natri0/obsidian-bytefield"

    html_url:    "https://community.obsidian.md/plugins/bytefield"
    github_url:  "https://github.com/natri0/obsidian-bytefield"
    description: "Adds diagrams that show how structures are laid out in memory / network."
    about:       "Render byte-field diagrams from Markdown code blocks by parsing lines like name: length to display byte offsets and field sizes. Support custom start offsets, unnamed padding fields, comment lines, and automatic wrapping for fields that exceed a row."

    stats: {
        downloads:  344
        updated_at: 1746108456000
    }
}
```

[^template]: [[Obsidian plugin]]
