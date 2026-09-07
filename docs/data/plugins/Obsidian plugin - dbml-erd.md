---
uid: aedfbc19-011f-5a6a-b666-05394c9e0615
xid:
  - dbml-erd
aliases:
  - dbml-erd
  - DBML ER Diagrams
  - wrojasa/obsidian-dbml-erd
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/dbml-erd
alt:
  - https://github.com/wrojasa/obsidian-dbml-erd
downloads: 380
updated at: "2026-07-07T23:12:06Z"
related to:
  - "[[GitHub - 1272397852]]"
remind me:
---

# DBML ER Diagrams

Renders fenced dbml blocks as interactive entity-relationship diagrams in the style of dbdiagram.io, with orthogonal edge routing, crow's-foot and bar cardinality markers and primary- and foreign-key indicators. Tables are dragged to arrange the layout, route vertices added, moved, deleted or reset to automatic, and cardinality changed from the diagram itself. Renaming tables and columns, changing types, setting header colors and deleting tables are written back to the dbml source, while positions, zoom, pan and custom routes persist with the block. The project states that it works on desktop and mobile.

```cue
plugin: {
    id:     "dbml-erd"
    name:   "DBML ER Diagrams"
    author: "Wilmar Rojas Avendaño"
    repo:   "wrojasa/obsidian-dbml-erd"

    html_url:    "https://community.obsidian.md/plugins/dbml-erd"
    github_url:  "https://github.com/wrojasa/obsidian-dbml-erd"
    description: "Render dbml code blocks as interactive entity-relationship diagrams with dbdiagram.io-style orthogonal routing. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Render DBML code blocks as clean, interactive ER diagrams - styled after dbdiagram.io, right in Obsidian. Write a fenced dbml block describing your tables and relationships, and the plugin draws an ERD with orthogonal (90°) edge routing, crow's-foot / bar cardinality markers, and primary-key ( ) / foreign-key ( ) indicators. Features: - Live rendering of dbml blocks into ER diagrams. - Orthogonal edge routing (90° elbows) with rounded corners. - Drag tables to arrange the layout; positions persist with the note. - Editable connections: add, move, delete route vertices, or reset to automatic. - Change cardinality from the diagram (one-to-many, one-to-one, many-to-many). - Edit from the canvas: rename tables/columns, change types, set header colors, delete tables — all written back to the dbml source. - Persistent layout: positions, zoom/pan, and custom routes saved in the block. - Works on desktop and mobile."

    stats: {
        downloads:  380
        updated_at: 1783465926000
    }
}
```

[^template]: [[Obsidian plugin]]
