---
uid: 8981c63e-49d8-58e4-9ef6-11913b1a0ada
xid:
  - code-workbench
aliases:
  - code-workbench
  - Code Workbench
  - vitaly-andr/obsidian-code-workbench
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/code-workbench
alt:
  - https://github.com/vitaly-andr/obsidian-code-workbench
downloads: 694
updated at: "2026-08-09T20:13:06Z"
related to:
  - "[[GitHub - 1274068174]]"
remind me:
---

# Code Workbench

Code Workbench turns Obsidian into a code editor and gives the Claude Code CLI tools for maintaining the vault. Vault tools are exposed as MCP tools over Obsidian's own link graph, so backlinks, wikilinks and frontmatter are read and edited with link-preserving create, append, rename and trash operations that you approve before they apply. The editor side adds tree-sitter syntax highlighting and inline diagnostics for 50 or more languages, Prettier formatting, a launcher that starts the CLI already connected, a Keep or Reject diff for every agent edit, a branch graph and inline git blame.

```cue
plugin: {
    id:     "code-workbench"
    name:   "Code Workbench"
    author: "Vitaly Andrianov"
    repo:   "vitaly-andr/obsidian-code-workbench"

    html_url:    "https://community.obsidian.md/plugins/code-workbench"
    github_url:  "https://github.com/vitaly-andr/obsidian-code-workbench"
    description: "Claude Code IDE for your knowledge base: a real code editor with syntax highlighting, Prettier formatting, diagnostics, diffs, code review, and inline git  blame, MCP tools for an AI agent - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Code Workbench gives Claude the tools to maintain your Obsidian vault, and turns Obsidian into a real code editor. Turn on the vault tools and Claude reads and edits your notes through Obsidian's own link graph as MCP tools (backlinks, wikilinks, frontmatter), making link-preserving changes (create, append, rename, delete to trash) that you approve before they apply, so it can file new notes and fix links across a PARA or Zettelkasten system without breaking them. Because it drives the Claude Code CLI you already run, it works on your Claude subscription, not a metered API key. On the code side: syntax highlighting and inline diagnostics for 50+ languages via tree-sitter (Python, Go, Rust, TypeScript, JSON, YAML), one-command formatting with Prettier, and a one-click launcher that starts the CLI connected, no /ide. Claude's edits open as a Keep/Reject diff you control; a branch graph and inline git blame let you review what changed. Model-agnostic: Claude, Kimi K2, DeepSeek, GLM."

    stats: {
        downloads:  694
        updated_at: 1786306386000
    }
}
```

[^template]: [[Obsidian plugin]]
