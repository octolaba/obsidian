---
uid: 17ba5208-880a-52f8-9053-1d5922df75fb
xid:
  - graph-context-for-claude-code
aliases:
  - graph-context-for-claude-code
  - Graph Context for Claude Code
  - senna-lang/graph-context-for-claude-code
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/graph-context-for-claude-code
alt:
  - https://github.com/senna-lang/graph-context-for-claude-code
downloads: 398
updated at: "2026-06-04T02:06:22Z"
related to:
  - "[[GitHub - 1256612400]]"
remind me:
---

# Graph Context for Claude Code

Attaches expanded vault context to Claude Code's IDE integration through the MCP IDE picker, so the edited note and the selected text are visible to it. Embeds are resolved and inlined, wikilinked notes are summarized from their frontmatter and first paragraph, and the heading path, frontmatter and backlinks are included. The whole context is pushed together with the selection in a single payload.

```cue
plugin: {
    id:     "graph-context-for-claude-code"
    name:   "Graph Context for Claude Code"
    author: "senna-lang"
    repo:   "senna-lang/graph-context-for-claude-code"

    html_url:    "https://community.obsidian.md/plugins/graph-context-for-claude-code"
    github_url:  "https://github.com/senna-lang/graph-context-for-claude-code"
    description: "Claude Code's /ide, with your knowledge graph attached. Select text and it's pushed to Claude with the graph expanded: embeds inlined, linked notes summarized, heading path and backlinks. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Attach Obsidian's expanded graph context to Claude Code IDE via the MCP IDE picker so Claude Code sees the note you're editing and the text you select. Resolve and inline ![[embeds]], summarize [[wikilinks]] (frontmatter + first paragraph), include heading path, frontmatter and backlinks, and push the full context with the selection in a single payload."

    stats: {
        downloads:  398
        updated_at: 1780538782000
    }
}
```

[^template]: [[Obsidian plugin]]
