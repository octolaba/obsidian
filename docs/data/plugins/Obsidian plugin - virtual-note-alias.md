---
uid: 2878f817-eecb-565a-a36a-c99cf1ff600e
xid:
  - virtual-note-alias
aliases:
  - virtual-note-alias
  - "Virtual Note (Alias) Creator"
  - kpieper876/Virtual-Note-Alias-Creator
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/virtual-note-alias
alt:
  - https://github.com/kpieper876/Virtual-Note-Alias-Creator
downloads: 28
updated at: "2026-07-27T17:22:54Z"
related to:
  - "[[GitHub - 1313272123]]"
remind me:
---

# Virtual Note (Alias) Creator

Creates a lightweight virtual note from the file explorer context menu, so the same content appears in another folder without being duplicated. The generated Markdown file contains only an embed of the source and is named after the source basename with a virtual suffix. Recursive virtualization is prevented and edits stay centralized in the original note.

```cue
plugin: {
    id:     "virtual-note-alias"
    name:   "Virtual Note (Alias) Creator"
    author: "Keith Pieper"
    repo:   "kpieper876/Virtual-Note-Alias-Creator"

    html_url:    "https://community.obsidian.md/plugins/virtual-note-alias"
    github_url:  "https://github.com/kpieper876/Virtual-Note-Alias-Creator"
    description: "Create a lightweight virtual note from a File Explorer context menu; the new note embeds the original without extra metadata. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Create lightweight virtual notes in any folder by embedding an existing Markdown file so the same content appears without duplication. Generate a plain Markdown file containing only the embed, named Source Basename (virtual).md; prevent recursive virtualization and keep edits centralized in the original."

    stats: {
        downloads:  28
        updated_at: 1785172974000
    }
}
```

[^template]: [[Obsidian plugin]]
