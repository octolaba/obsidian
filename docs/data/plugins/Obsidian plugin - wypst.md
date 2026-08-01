---
uid: a3a41665-dbb2-5cd9-b6c9-82a954cea135
xid:
  - wypst
aliases:
  - wypst
  - Wypst
  - andredalbosco/obsidian-wypst
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/wypst
alt:
  - https://github.com/andredalbosco/obsidian-wypst
downloads: 4422
updated at: "2024-05-13T08:32:00Z"
related to:
  - "[[GitHub - 729231931]]"
remind me:
---

# Wypst

Renders math with Typst instead of the default engine, replacing the inline and block dollar-delimited math of a note with Typst output. LaTeX environments and backslash commands are handed to MathJax, so constructs Typst cannot handle still render.

```cue
plugin: {
    id:     "wypst"
    name:   "Wypst"
    author: "andredalbosco"
    repo:   "andredalbosco/obsidian-wypst"

    html_url:    "https://community.obsidian.md/plugins/wypst"
    github_url:  "https://github.com/andredalbosco/obsidian-wypst"
    description: "Render math blocks with Typst"
    about:       "Render Typst math directly in Obsidian by replacing inline and block math ($...$, $$...$$) with high-quality Typst output. Switch to MathJax for LaTeX environments or backslash commands and provide a fallback to LaTeX rendering for constructs Typst can't handle."

    stats: {
        downloads:  4422
        updated_at: 1715589120000
    }
}
```

[^template]: [[Obsidian plugin]]
