---
uid: e5516d6a-0387-5704-832f-cf7310d0925d
xid:
  - link-forge
aliases:
  - link-forge
  - Link Forge
  - philpalmieri/obsidian-link-forge
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/link-forge
alt:
  - https://github.com/philpalmieri/obsidian-link-forge
downloads: 28
updated at: "2026-07-24T16:16:16Z"
related to:
  - "[[GitHub - 1224781696]]"
remind me:
---

# Link Forge

Creates the target file for an unresolved wikilink automatically, in real time, once the cursor leaves the line. Missing parent folders are created and the link is shortened to the basename when that resolves uniquely, while headings and aliases are preserved. Templater file-creation events are triggered so templates can be applied automatically.

```cue
plugin: {
    id:     "link-forge"
    name:   "Link Forge"
    author: "Phil Palmieri"
    repo:   "philpalmieri/obsidian-link-forge"

    html_url:    "https://community.obsidian.md/plugins/link-forge"
    github_url:  "https://github.com/philpalmieri/obsidian-link-forge"
    description: "Auto-creates linked files when they don't exist, in real-time. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Auto-create pages for unresolved wikilinks when you leave a line. Create missing parent folders and shorten links to the basename when it resolves uniquely. Preserve headings and aliases and trigger Templater file-creation events for automatic templates."

    stats: {
        downloads:  28
        updated_at: 1784909776000
    }
}
```

[^template]: [[Obsidian plugin]]
