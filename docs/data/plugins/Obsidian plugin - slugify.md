---
uid: 3c61688d-5e89-5cf3-9b1e-d1e6f9c109b5
xid:
  - slugify
aliases:
  - slugify
  - Slugify
  - ansango/obsidian-slugify
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/slugify
alt:
  - https://github.com/ansango/obsidian-slugify
downloads: 82
updated at: "2026-07-09T21:56:33Z"
related to:
  - "[[GitHub - 1295774137]]"
remind me:
---

# Slugify

Slugify renames files to slug-case — lowercase, without accents, hyphen-separated — and updates the links pointing at them through the Obsidian rename API, so every wiki link follows. Proposed renames are previewed before they are applied, and the operation targets a single file, a folder, a selection or the whole vault. Name collisions are skipped and reported.

```cue
plugin: {
    id:     "slugify"
    name:   "Slugify"
    author: "ansango"
    repo:   "ansango/obsidian-slugify"

    html_url:    "https://community.obsidian.md/plugins/slugify"
    github_url:  "https://github.com/ansango/obsidian-slugify"
    description: "Rename files to slug-case (lowercase, no accents, hyphens) and automatically update links using fileManager.renameFile. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Rename files and update every wiki link to slug-case (lowercase, no accents, hyphens) directly from Obsidian. Preview all proposed renames before applying, run on a file, folder, selection or the whole vault, and skip or report name collisions."

    stats: {
        downloads:  82
        updated_at: 1783634193000
    }
}
```

[^template]: [[Obsidian plugin]]
