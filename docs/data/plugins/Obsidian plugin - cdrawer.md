---
uid: e1ba8e85-ad33-57b6-ab59-5defc047f1ce
xid:
  - cdrawer
aliases:
  - cdrawer
  - Commutative Diagram Editor
  - hxuanwang/obsidian-cdrawer
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/cdrawer
alt:
  - https://github.com/hxuanwang/obsidian-cdrawer
downloads: 91
updated at: "2026-07-20T09:07:51Z"
related to:
  - "[[GitHub - 1303571862]]"
remind me:
---

# Commutative Diagram Editor

Commutative Diagram Editor places commutative diagrams on a fixed grid, with LaTeX labels and drag-to-draw arrows that commit when the editor is clicked away. Each diagram is stored as an inline SVG inside a cd-fenced JSON block, so it stays plain text and diff-clean and can be reopened in the grid editor, and it renders to match native CD styling. Diagrams export to and import from tikz-cd and AMS CD.

```cue
plugin: {
    id:     "cdrawer"
    name:   "Commutative Diagram Editor"
    author: "Wang Haoxuan"
    repo:   "hxuanwang/obsidian-cdrawer"

    html_url:    "https://community.obsidian.md/plugins/cdrawer"
    github_url:  "https://github.com/hxuanwang/obsidian-cdrawer"
    description: "Insert and edit commutative diagrams on a fixed grid. Renders to SVG matching native CD styling. Export to tikz-cd and AMS CD. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Create commutative diagrams on a fixed grid with LaTeX labels and drag-to-draw arrows, then click away to commit edits. Store diagrams as inline SVGs inside cd-fenced JSON blocks so they remain plain-text, diff-clean, and reopenable in the grid editor. Export and import to tikz-cd or AMS CD for paper use."

    stats: {
        downloads:  91
        updated_at: 1784538471000
    }
}
```

[^template]: [[Obsidian plugin]]
