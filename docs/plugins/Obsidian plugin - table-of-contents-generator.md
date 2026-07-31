---
uid: 06823e23-8c31-5eb4-b1f1-4a8a9f11b6fb
xid:
  - table-of-contents-generator
aliases:
  - table-of-contents-generator
  - Table of Contents Generator
  - m-kk/toc
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/table-of-contents-generator
alt:
  - https://github.com/m-kk/toc
downloads: 56
updated at: "2026-07-10T17:35:49Z"
related to:
  - "[[GitHub - 1053702596]]"
remind me:
---

# Table of Contents Generator

Generates a table of contents tracked in YAML frontmatter rather than in the note body, which the recorded About text describes as keeping the source file uncluttered. The table sits at the top of the note or after the last top-level heading and is updated as headings change. Duplicate headings are handled, Obsidian's metadata cache is used, and headings are excluded by a regex the About text describes as hardened against denial of service.

```cue
plugin: {
    id:     "table-of-contents-generator"
    name:   "Table of Contents Generator"
    author: "m-kk"
    repo:   "m-kk/toc"

    html_url:    "https://community.obsidian.md/plugins/table-of-contents-generator"
    github_url:  "https://github.com/m-kk/toc"
    description: "Generate a table of contents for your notes. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Generate a clean, invisible table of contents tracked in YAML frontmatter to keep your source files uncluttered. Position the TOC at the top or after the last H1, update it as headings change, handle duplicate headings correctly, integrate with Obsidian's metadata cache, and exclude headings via ReDoS-hardened regex."

    stats: {
        downloads:  56
        updated_at: 1783704949000
    }
}
```

[^template]: [[Obsidian plugin]]
