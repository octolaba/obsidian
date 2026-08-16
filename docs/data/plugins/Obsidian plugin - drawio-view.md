---
uid: e7f0011f-63e3-56fd-a832-b0ef8b385f8f
xid:
  - drawio-view
aliases:
  - drawio-view
  - Draw.io View
  - sdkay/obsidian-drawio-view
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/drawio-view
alt:
  - https://github.com/sdkay/obsidian-drawio-view
downloads: 537
updated at: "2026-08-11T09:49:15Z"
related to:
  - "[[GitHub - 1269885401]]"
remind me:
---

# Draw.io View

Renders .drawio diagrams inline in a note through a fenced code block, with parameters for the page, the height and the initial zoom and pan. The rendered diagram can be panned, zoomed and resized interactively, and the current page, zoom and offset can be written back into the code block so the view is restored later. Multi-page diagrams are supported.

```cue
plugin: {
    id:     "drawio-view"
    name:   "Draw.io View"
    author: "sdking"
    repo:   "sdkay/obsidian-drawio-view"

    html_url:    "https://community.obsidian.md/plugins/drawio-view"
    github_url:  "https://github.com/sdkay/obsidian-drawio-view"
    description: "Render draw.io diagrams inline in your notes with zoom, pan, and multi-page support. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Render .drawio diagrams inline in notes by embedding them with a fenced code block. Switch pages and set height, initial zoom and pan via parameters, interactively pan/zoom/resize, and write the current page/zoom/offset back into the code block to restore the view."

    stats: {
        downloads:  537
        updated_at: 1786441755000
    }
}
```

[^template]: [[Obsidian plugin]]
