---
uid: a0e46299-78c2-50cd-95d6-79a4898d0542
xid:
  - canvas-css-class
aliases:
  - canvas-css-class
  - Canvas CSS class
  - mara-li/obsidian-canvas-css-class
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/canvas-css-class
alt:
  - https://github.com/mara-li/obsidian-canvas-css-class
downloads: 30869
updated at: "2024-06-06T13:26:26Z"
related to:
  - "[[GitHub - 582003271]]"
remind me:
---

# Canvas CSS class

Canvas CSS class adds a canvas-file class and a data attribute carrying the file path to each Canvas DOM element, so CSS can target a specific canvas. Custom CSS classes are assigned or removed per canvas through commands or settings, file moves and renames are followed automatically, and classes attach either to the body or to the workspace view.

```cue
plugin: {
    id:     "canvas-css-class"
    name:   "Canvas CSS class"
    author: "Mara"
    repo:   "mara-li/obsidian-canvas-css-class"

    html_url:    "https://community.obsidian.md/plugins/canvas-css-class"
    github_url:  "https://github.com/mara-li/obsidian-canvas-css-class"
    description: "Add a CSS class to the canvas, but also other attributes."
    about:       "Add a .canvas-file class and a data-canvas-path=\"filepath\" attribute to each Canvas DOM element for precise CSS targeting. Assign or remove custom CSS classes per canvas via commands or settings, auto-follow file moves/renames, and choose whether classes attach to the body or workspace view."

    stats: {
        downloads:  30869
        updated_at: 1717680386000
    }
}
```

[^template]: [[Obsidian plugin]]
