---
uid: 12c7f0d6-108b-5d80-a2ab-2b8e8ddde077
xid:
  - save-modified-times
aliases:
  - save-modified-times
  - Save Modified Times
  - emklasson/obsidian-save-modified-times
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/save-modified-times
alt:
  - https://github.com/emklasson/obsidian-save-modified-times
downloads: 48
updated at: "2026-07-19T12:52:18Z"
related to:
  - "[[GitHub - 1098138316]]"
remind me:
---

# Save Modified Times

Save Modified Times saves and restores the last modified time of notes so that original file dates survive edits to frontmatter or content. The times are held either in the plugin settings or in a savedModifiedTime frontmatter property, and one or several files can be restored through a selection popup. Path prefixes can be excluded and updates can be scheduled automatically.

```cue
plugin: {
    id:     "save-modified-times"
    name:   "Save Modified Times"
    author: "emklasson"
    repo:   "emklasson/obsidian-save-modified-times"

    html_url:    "https://community.obsidian.md/plugins/save-modified-times"
    github_url:  "https://github.com/emklasson/obsidian-save-modified-times"
    description: "Save and restore notes' last modified times/dates (mtime). - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Save and restore notes' last modified times/dates (mtime) to preserve original file dates when editing frontmatter or content. Store times in plugin settings or a savedModifiedTime frontmatter property, restore single or multiple files via a selection popup, exclude path prefixes, and schedule automatic updates."

    stats: {
        downloads:  48
        updated_at: 1784465538000
    }
}
```

[^template]: [[Obsidian plugin]]
