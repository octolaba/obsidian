---
uid: b8117045-c98b-5fc7-8bb0-30354adf7d98
xid:
  - update-time-on-edit
aliases:
  - update-time-on-edit
  - Update time on edit
  - beaussan/update-time-on-edit-obsidian
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/update-time-on-edit
alt:
  - https://github.com/beaussan/update-time-on-edit-obsidian
downloads: 74645
updated at: "2024-01-11T12:35:10Z"
related to:
  - "[[GitHub - 358609766]]"
remind me:
---

# Update time on edit

Keeps frontmatter in sync with the last edit time, writing the file's last-modified and creation times on save. The keys default to updated and created and can be renamed, and the value is a customisable date format or a Unix timestamp. Folders can be ignored, and it works on mobile as well as desktop.

```cue
plugin: {
    id:     "update-time-on-edit"
    name:   "Update time on edit"
    author: "beaussan"
    repo:   "beaussan/update-time-on-edit-obsidian"

    html_url:    "https://community.obsidian.md/plugins/update-time-on-edit"
    github_url:  "https://github.com/beaussan/update-time-on-edit-obsidian"
    description: "Keep frontmatter in sync with the last edit time."
    about:       "Update file metadata on save with the file's last-modified time and creation time. Keep keys (default \"updated\" and \"created\") synced with the file system, support customizable date formats or Unix timestamps, ignore specified folders, and work on mobile and desktop."

    stats: {
        downloads:  74645
        updated_at: 1704976510000
    }
}
```

[^template]: [[Obsidian plugin]]
