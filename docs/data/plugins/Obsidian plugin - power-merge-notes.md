---
uid: 7190ac89-d121-5841-afc0-329b7938c065
xid:
  - power-merge-notes
aliases:
  - power-merge-notes
  - Power Merge Notes
  - kpieper876/Power-Merge-Notes
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/power-merge-notes
alt:
  - https://github.com/kpieper876/Power-Merge-Notes
downloads: 75
updated at: "2026-07-27T17:21:33Z"
related to:
  - "[[GitHub - 1313270605]]"
remind me:
---

# Power Merge Notes

Merges Markdown notes into one file, preserving heading structure and combining duplicate content under matching headings. Frontmatter is reconciled by keeping the preferred title and date and deduplicating aliases and tags, and duplicate Dataview blocks are collapsed to the most recent view. Merges can be run manually, over a selection, across duplicates in a folder, as part of a rename, or automatically for same-name notes.

```cue
plugin: {
    id:     "power-merge-notes"
    name:   "Power Merge Notes"
    author: "Keith Pieper"
    repo:   "kpieper876/Power-Merge-Notes"

    html_url:    "https://community.obsidian.md/plugins/power-merge-notes"
    github_url:  "https://github.com/kpieper876/Power-Merge-Notes"
    description: "Merge Markdown notes with heading-aware content, frontmatter, and Dataview handling, including automatic same-name duplicate cleanup. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Merge Markdown notes into a single file while preserving heading structure and combining duplicate content under matching headings. Reconcile frontmatter by retaining the preferred title and date and deduplicating aliases and tags, deduplicate Dataview blocks by preferring the most recent view, and run manual, selection-based, folder-duplicate, rename-with-merge or automatic same-name merges."

    stats: {
        downloads:  75
        updated_at: 1785172893000
    }
}
```

[^template]: [[Obsidian plugin]]
