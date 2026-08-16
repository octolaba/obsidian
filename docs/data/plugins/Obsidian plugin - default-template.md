---
uid: 39af3489-4691-56f2-82cf-47fb7d895898
xid:
  - default-template
aliases:
  - default-template
  - Default Template
  - raeperd/obsidian-default-template
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/default-template
alt:
  - https://github.com/raeperd/obsidian-default-template
downloads: 6457
updated at: "2026-05-16T05:35:47Z"
related to:
  - "[[GitHub - 1043612720]]"
remind me:
---

# Default Template

Applies a selected template automatically to every newly created note, whatever created it, so that structure stays consistent without manual insertion. Templates can be assigned per folder with hierarchical fallback, paths can be excluded, and the date, time and title variables are processed with Moment.js format tokens.

```cue
plugin: {
    id:     "default-template"
    name:   "Default Template"
    author: "raeperd"
    repo:   "raeperd/obsidian-default-template"

    html_url:    "https://community.obsidian.md/plugins/default-template"
    github_url:  "https://github.com/raeperd/obsidian-default-template"
    description: "Automatically apply templates to new notes with user-configurable template selection."
    about:       "Apply a selected template automatically to every new note created by any method to ensure consistent structure without manual insertion. Assign folder-specific templates with hierarchical fallback, exclude paths from templating, and process {{date}}, {{time}} and {{title}} variables with Moment.js format tokens."

    stats: {
        downloads:  6457
        updated_at: 1778909747000
    }
}
```

[^template]: [[Obsidian plugin]]
