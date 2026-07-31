---
uid: aa2d2a22-2d96-50f7-8d92-a3a6d4c1c0e4
xid:
  - code-graph
aliases:
  - code-graph
  - Code Graph
  - mrjw717/obsidian-code-graph
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/code-graph
alt:
  - https://github.com/mrjw717/obsidian-code-graph
downloads: 112
updated at: "2026-07-08T23:14:26Z"
related to:
  - "[[GitHub - 1293030416]]"
remind me:
---

# Code Graph

Draws code files and note links as one interactive force-directed graph beside the notes. TypeScript, JavaScript and Python are parsed with tree-sitter to extract imports, calls, inheritance, containment and documentation-comment edges, while many other languages contribute imports only. Nodes can be drilled into at symbol level, and TODO and FIXME markers and dead code are surfaced.

```cue
plugin: {
    id:     "code-graph"
    name:   "Code Graph"
    author: "Joshua Williams"
    repo:   "mrjw717/obsidian-code-graph"

    html_url:    "https://community.obsidian.md/plugins/code-graph"
    github_url:  "https://github.com/mrjw717/obsidian-code-graph"
    description: "Visualize how your code files connect — imports, calls, inheritance, implements, comment-links, ADRs, and tests — as an interactive graph alongside your notes. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Visualize codebase connections and note links as an interactive force-directed graph alongside your notes. Parse TypeScript, JavaScript and Python with tree-sitter (imports-only for many languages) to extract imports, calls, inheritance, containment and documentation-comment edges; drill into symbol-level nodes and spot TODO/FIXME and dead code."

    stats: {
        downloads:  112
        updated_at: 1783552466000
    }
}
```

[^template]: [[Obsidian plugin]]
