---
uid: 961f604e-b486-50a1-b7d4-728b5879e7dc
xid:
  - agent-skill-graph
aliases:
  - agent-skill-graph
  - Agent Skill Graph
  - hanamizuki/obsidian-skill-graph
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/agent-skill-graph
alt:
  - https://github.com/hanamizuki/obsidian-skill-graph
downloads: 470
updated at: "2026-05-17T11:10:57Z"
related to:
  - "[[GitHub - 1198057072]]"
remind me:
---

# Agent Skill Graph

Agent Skill Graph shows agent skill structures in Obsidian's graph view by parsing SKILL.md frontmatter to label skill root nodes and by auto-linking the files a skill references. Nodes are color-coded by type, distinguishing a skill root from a referenced file, and every change stays read-only and in memory.

```cue
plugin: {
    id:     "agent-skill-graph"
    name:   "Agent Skill Graph"
    author: "hanamizuki"
    repo:   "hanamizuki/obsidian-skill-graph"

    html_url:    "https://community.obsidian.md/plugins/agent-skill-graph"
    github_url:  "https://github.com/hanamizuki/obsidian-skill-graph"
    description: "Visualize AI agent skill structures in graph view. Renames SKILL.md nodes from frontmatter, draws reference edges, and colors nodes by type. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Visualize OpenClaw and Claude Code agent skill structures in Obsidian's graph view by parsing SKILL.md frontmatter to label skill root nodes and auto-link referenced files. Color-code nodes by type (skill root vs referenced) and keep all changes read-only and in-memory."

    stats: {
        downloads:  470
        updated_at: 1779016257000
    }
}
```

[^template]: [[Obsidian plugin]]
