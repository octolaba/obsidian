---
uid: 29cf5864-4a1a-5864-af4c-8ef9a5343489
xid:
  - update-time
aliases:
  - update-time
  - Update Time
  - dsebastien/obsidian-update-time
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/update-time
alt:
  - https://github.com/dsebastien/obsidian-update-time
downloads: 4715
updated at: "2026-07-18T06:53:42Z"
related to:
  - "[[GitHub - 791644272]]"
remind me:
---

# Update Time

Writes the file's creation and last update times into the note's front matter. It runs automatically in the background, preserves an existing created value, and debounces the updated timestamp to avoid conflicting with an edit in progress. Excluded folders, Excalidraw and Canvas files and non-Markdown files are skipped.

```cue
plugin: {
    id:     "update-time"
    name:   "Update Time"
    author: "Sébastien Dubois"
    repo:   "dsebastien/obsidian-update-time"

    html_url:    "https://community.obsidian.md/plugins/update-time"
    github_url:  "https://github.com/dsebastien/obsidian-update-time"
    description: "Update front matter to include creation and last update times"
    about:       "Update note front-matter to reflect the file's creation (ctime) and last modification (mtime) timestamps. Run automatically in the background, preserve existing created values, debounce updated timestamps to avoid edit conflicts, and skip excluded folders, Excalidraw, Canvas, and non‑Markdown files locally."

    stats: {
        downloads:  4715
        updated_at: 1784357622000
    }
}
```

[^template]: [[Obsidian plugin]]
