---
uid: 87de75b0-0331-5d64-9505-3bcf3b6e38b6
xid:
  - obsidian-old-note-admonitor
aliases:
  - obsidian-old-note-admonitor
  - Old Note Admonitor
  - tadashi-aikawa/obsidian-old-note-admonitor
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/obsidian-old-note-admonitor
alt:
  - https://github.com/tadashi-aikawa/obsidian-old-note-admonitor
downloads: 5177
updated at: "2023-10-14T08:39:10Z"
related to:
  - "[[GitHub - 535178246]]"
remind me:
---

# Old Note Admonitor

This plugin shows a warning admonition on notes that have not been updated for more than a set number of days. The date it compares against comes from the file modified time, a front-matter key, or a regex capture group. The warning template accepts placeholders for the number of days and the date, the update trigger can be note open or save, path prefixes can be excluded, and the admonition is styled through CSS.

```cue
plugin: {
    id:     "obsidian-old-note-admonitor"
    name:   "Old Note Admonitor"
    author: "tadashi-aikawa"
    repo:   "tadashi-aikawa/obsidian-old-note-admonitor"

    html_url:    "https://community.obsidian.md/plugins/obsidian-old-note-admonitor"
    github_url:  "https://github.com/tadashi-aikawa/obsidian-old-note-admonitor"
    description: "Show warnings if the note has not been updated for over specific days."
    about:       "Show admonitions on notes not updated within a set number of days, using file modified time, a front-matter key, or a regex capture group to determine the date. Customize the warning template with ${numberOfDays} and ${date}, choose update triggers (open/save), exclude path prefixes, and style the admonition via CSS."

    stats: {
        downloads:  5177
        updated_at: 1697272750000
    }
}
```

[^template]: [[Obsidian plugin]]
