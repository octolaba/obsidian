---
uid: 8e8824bf-7453-5264-bfce-99bc5ca144c2
xid:
  - heading-aligner
aliases:
  - heading-aligner
  - H1Aligner
  - aiken884/obsidian-h1aligner
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/heading-aligner
alt:
  - https://github.com/aiken884/obsidian-h1aligner
downloads: 52
updated at: "2026-07-15T10:20:24Z"
related to:
  - "[[GitHub - 1253955752]]"
remind me:
---

# H1Aligner

H1Aligner keeps a note's filename synchronized with its first H1, renaming the file from the heading while backlinks are preserved. Five triggers decide when a rename runs: on open, on edit, on both, on leave, or manually. A note is locked against renaming by a single-line frontmatter entry, and changes can be previewed or undone.

```cue
plugin: {
    id:     "heading-aligner"
    name:   "H1Aligner"
    author: "Aiken Lin"
    repo:   "aiken884/obsidian-h1aligner"

    html_url:    "https://community.obsidian.md/plugins/heading-aligner"
    github_url:  "https://github.com/aiken884/obsidian-h1aligner"
    description: "Keep note filenames aligned with the first H1 — automatically and safely. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Keep filenames synchronized to each note's first H1 by renaming files H1 → filename automatically while preserving Obsidian backlinks. Choose when renames run with five triggers (open, edit, both, leave, manual), lock notes via a single-line frontmatter, and preview or undo changes for safe, predictable behavior."

    stats: {
        downloads:  52
        updated_at: 1784110824000
    }
}
```

[^template]: [[Obsidian plugin]]
