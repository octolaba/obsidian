---
uid: 441bdddc-d20d-5334-aede-35ec7c33609d
xid:
  - x86-flow-graphing
aliases:
  - x86-flow-graphing
  - x86 Assembly Flow Graphing
  - dwolfe884/obsidian-x86-flow-graph
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/x86-flow-graphing
alt:
  - https://github.com/dwolfe884/obsidian-x86-flow-graph
downloads: 4638
updated at: "2023-03-13T17:52:17Z"
related to:
  - "[[GitHub - 597036844]]"
remind me:
---

# x86 Assembly Flow Graphing

Converts a well formatted block of x86 assembly into a flow graph on an Obsidian canvas. Selecting the code block and running the x86-create-flow-diagram command generates the nodes and edges, treating jmp as an unconditional single-branch jump and other j-instructions as conditional two-branch jumps. The input must indent its instructions and keep jump labels free of leading spaces.

```cue
plugin: {
    id:     "x86-flow-graphing"
    name:   "x86 Assembly Flow Graphing"
    author: "dwolfe884"
    repo:   "dwolfe884/obsidian-x86-flow-graph"

    html_url:    "https://community.obsidian.md/plugins/x86-flow-graphing"
    github_url:  "https://github.com/dwolfe884/obsidian-x86-flow-graph"
    description: "Convert well formatted x86 assembly into appropriate flow graphs using Obsidian canvases."
    about:       "Convert x86 assembly blocks into flow diagrams on Obsidian Canvases. Highlight a properly formatted x86 code block and run the x86-create-flow-diagram command to generate nodes and edges, treating jmp as an unconditional single-branch jump and other j* instructions as conditional two-branch jumps; require indented instructions and jump labels with no leading spaces."

    stats: {
        downloads:  4638
        updated_at: 1678729937000
    }
}
```

[^template]: [[Obsidian plugin]]
