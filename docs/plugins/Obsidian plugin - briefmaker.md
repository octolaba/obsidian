---
uid: fb1cbca3-1dca-514c-8bfc-2d60797c04b5
xid:
  - briefmaker
aliases:
  - briefmaker
  - Briefmaker
  - eugeny-dementev/briefmaker
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/briefmaker
alt:
  - https://github.com/eugeny-dementev/briefmaker
downloads: 156
updated at: "2026-01-10T14:12:42Z"
related to:
  - "[[GitHub - 1128261841]]"
remind me:
---

# Briefmaker

Briefmaker assembles an AI agent brief from the current note and copies the rendered prompt to the clipboard, without calling an AI service or modifying files. Notes are matched to path-based templates through ordered regular-expression rules, and the brief can include unchecked tasks, file metadata, frontmatter, the current selection and the note content, with a preview before copying.

```cue
plugin: {
    id:     "briefmaker"
    name:   "Briefmaker"
    author: "eugeny-dementev"
    repo:   "eugeny-dementev/briefmaker"

    html_url:    "https://community.obsidian.md/plugins/briefmaker"
    github_url:  "https://github.com/eugeny-dementev/briefmaker"
    description: "Generate AI agent briefs from the current note using path-based templates and task extraction. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Prepare AI agent briefs from the current note and copy the rendered prompt to the clipboard without running AI or modifying your files. Match notes to path-based templates using ordered regex rules, extract unchecked tasks, include file metadata, frontmatter, selection and content, and preview before copying."

    stats: {
        downloads:  156
        updated_at: 1768054362000
    }
}
```

[^template]: [[Obsidian plugin]]
