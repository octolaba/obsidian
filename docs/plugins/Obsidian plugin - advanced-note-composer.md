---
uid: 8458eae0-a915-5a81-8905-66124ca54933
xid:
  - advanced-note-composer
aliases:
  - advanced-note-composer
  - Advanced Note Composer
  - mnaoumov/obsidian-advanced-note-composer
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/advanced-note-composer
alt:
  - https://github.com/mnaoumov/obsidian-advanced-note-composer
downloads: 7855
updated at: "2026-07-21T22:15:11Z"
related to:
  - "[[GitHub - 951022118]]"
remind me:
---

# Advanced Note Composer

Advanced Note Composer extends the Note composer core plugin so relative links are fixed when notes are merged or extracted and remain valid. Invalid filename characters are replaced or removed, with the original title optionally added to frontmatter aliases, and a title containing a slash is treated as a nested path when a heading is split into its own file.

```cue
plugin: {
    id:     "advanced-note-composer"
    name:   "Advanced Note Composer"
    author: "Michael Naumov"
    repo:   "mnaoumov/obsidian-advanced-note-composer"

    html_url:    "https://community.obsidian.md/plugins/advanced-note-composer"
    github_url:  "https://github.com/mnaoumov/obsidian-advanced-note-composer"
    description: "Enhances Note composer core plugin."
    about:       "Fix relative links when merging or extracting notes so links are adjusted and remain valid. Replace or remove invalid filename characters and optionally add the original invalid title to aliases in frontmatter for quick access. Treat titles containing '/' as nested paths when splitting headings into files."

    stats: {
        downloads:  7855
        updated_at: 1784672111000
    }
}
```

[^template]: [[Obsidian plugin]]
