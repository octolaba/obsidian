---
uid: 6dcfc927-663c-5497-a37b-96c8ad1401ba
xid:
  - no-dupe-leaves
aliases:
  - no-dupe-leaves
  - No dupe leaves
  - scambier/obsidian-no-dupe-leaves
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/no-dupe-leaves
alt:
  - https://github.com/scambier/obsidian-no-dupe-leaves
downloads: 13940
updated at: "2024-07-13T10:55:26Z"
related to:
  - "[[GitHub - 485508174]]"
remind me:
---

# No dupe leaves

No dupe leaves stops a note that is already open from being opened again, switching focus to the existing pane instead. Deliberate open-in-new-pane actions, such as a middle-click, are still respected. The recorded description notes that it modifies link-opening behaviour, which may affect other plugins calling the same function.

```cue
plugin: {
    id:     "no-dupe-leaves"
    name:   "No dupe leaves"
    author: "Simon Cambier"
    repo:   "scambier/obsidian-no-dupe-leaves"

    html_url:    "https://community.obsidian.md/plugins/no-dupe-leaves"
    github_url:  "https://github.com/scambier/obsidian-no-dupe-leaves"
    description: "Don't reopen notes that are already open."
    about:       "Prevent duplicate panes by switching focus to an already-open note instead of reopening it. Respect deliberate \"open in new pane\" actions (e.g., middle-click). Modify link-opening behavior, which may affect other plugins that call the same function."

    stats: {
        downloads:  13940
        updated_at: 1720868126000
    }
}
```

[^template]: [[Obsidian plugin]]
