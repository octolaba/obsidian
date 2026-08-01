---
uid: c74a83c4-45fb-58a7-92b7-1fad07f8fd24
xid:
  - canvas-dailynote
aliases:
  - canvas-dailynote
  - Canvas Daily Note
  - andrewmcgivery/obsidian-canvas-dailynote
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/canvas-dailynote
alt:
  - https://github.com/andrewmcgivery/obsidian-canvas-dailynote
downloads: 3488
updated at: "2024-02-14T20:52:22Z"
related to:
  - "[[GitHub - 731872024]]"
remind me:
---

# Canvas Daily Note

Canvas Daily Note adds a node to a canvas that always shows today's daily note and updates when the canvas is opened. The node is inserted from a Canvas button, and the daily note is created if it does not yet exist. The inputs note that the node is replaced when it updates, so connections drawn from it are not preserved.

```cue
plugin: {
    id:     "canvas-dailynote"
    name:   "Canvas Daily Note"
    author: "andrewmcgivery"
    repo:   "andrewmcgivery/obsidian-canvas-dailynote"

    html_url:    "https://community.obsidian.md/plugins/canvas-dailynote"
    github_url:  "https://github.com/andrewmcgivery/obsidian-canvas-dailynote"
    description: "Add a daily note node to the canvas that will always show today's note."
    about:       "Add a daily note node to Canvas that always displays today's note and updates automatically when you open the canvas. Insert the node via a Canvas button and let the plugin create the daily note if it doesn't exist. Expect the node to be replaced when updated, so connections from it are not preserved."

    stats: {
        downloads:  3488
        updated_at: 1707943942000
    }
}
```

[^template]: [[Obsidian plugin]]
