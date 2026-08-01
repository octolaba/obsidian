---
uid: 432a08af-78b8-5a96-84fa-ab0142d6eb57
xid:
  - janitor
aliases:
  - janitor
  - Janitor
  - canna71/obsidian-janitor
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/janitor
alt:
  - https://github.com/canna71/obsidian-janitor
downloads: 56952
updated at: "2026-05-03T17:21:50Z"
related to:
  - "[[GitHub - 524479621]]"
remind me:
---

# Janitor

Janitor performs cleanup over a vault, finding orphan attachments, empty or whitespace-only files, oversized files and notes expired by a frontmatter date. Files can be excluded through Obsidian's own settings or custom rules, and scans run on demand or at startup. Each file is handled by a chosen action behind a confirmation prompt.

```cue
plugin: {
    id:     "janitor"
    name:   "Janitor"
    author: "canna71"
    repo:   "canna71/obsidian-janitor"

    html_url:    "https://community.obsidian.md/plugins/janitor"
    github_url:  "https://github.com/canna71/obsidian-janitor"
    description: "Perform cleanup tasks on your vault."
    about:       "Clean your vault by finding and removing orphan attachments, empty or whitespace-only files, oversized files, and notes expired by a frontmatter date. Exclude files via Obsidian or custom rules, run scans on demand or at startup, and choose per-file actions with confirmation prompts."

    stats: {
        downloads:  56952
        updated_at: 1777828910000
    }
}
```

[^template]: [[Obsidian plugin]]
