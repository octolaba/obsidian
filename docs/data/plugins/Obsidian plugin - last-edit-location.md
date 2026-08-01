---
uid: 95624ddd-6eaa-5d52-86b6-58ea54514a54
xid:
  - last-edit-location
aliases:
  - last-edit-location
  - Last Edit Location
  - awfrok/obsidian-plugin-last-edit-location
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/last-edit-location
alt:
  - https://github.com/awfrok/obsidian-plugin-last-edit-location
downloads: 531
updated at: "2025-11-05T04:50:04Z"
related to:
  - "[[GitHub - 1010442437]]"
remind me:
---

# Last Edit Location

This plugin returns the cursor to the position of the last edit when a note is reopened, applying the jump once per note so that it works with several notes open. The note is identified by a plugin-generated UUID, a frontmatter field or the file path, and the behaviour can be restricted to chosen folders with an adjustable restore delay.

```cue
plugin: {
    id:     "last-edit-location"
    name:   "Last Edit Location"
    author: "awfrok"
    repo:   "awfrok/obsidian-plugin-last-edit-location"

    html_url:    "https://community.obsidian.md/plugins/last-edit-location"
    github_url:  "https://github.com/awfrok/obsidian-plugin-last-edit-location"
    description: "Put the cursor at the last edit location when opening a note. Work well with multiple notes."
    about:       "Restore the cursor to the last edit position when opening a note, applying the jump once per note. Use a plugin-generated UUID, a frontmatter field, or the file path as the note identifier, and restrict behavior to chosen folders with an adjustable restore delay."

    stats: {
        downloads:  531
        updated_at: 1762318204000
    }
}
```

[^template]: [[Obsidian plugin]]
