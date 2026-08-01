---
uid: 822902a9-d8fb-58f7-9d58-c780270e4025
xid:
  - claude-vault-assistant
aliases:
  - claude-vault-assistant
  - Claude Vault Assistant
  - copperbox/obsidian-claude-vault-assistant
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/claude-vault-assistant
alt:
  - https://github.com/copperbox/obsidian-claude-vault-assistant
downloads: 620
updated at: "2026-07-01T05:28:02Z"
related to:
  - "[[GitHub - 1174655639]]"
remind me:
---

# Claude Vault Assistant

Runs reusable prompt files against the whole vault or the active note through the Claude Code CLI in headless mode. Prompts are kept as files with a fixed naming pattern, and a conventions file records how the vault is organized, so notes are processed, analyzed and updated from inside Obsidian.

```cue
plugin: {
    id:     "claude-vault-assistant"
    name:   "Claude Vault Assistant"
    author: "copperbox"
    repo:   "copperbox/obsidian-claude-vault-assistant"

    html_url:    "https://community.obsidian.md/plugins/claude-vault-assistant"
    github_url:  "https://github.com/copperbox/obsidian-claude-vault-assistant"
    description: "Define reusable prompt files and run them against your vault or active note using Claude Code CLI. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Run predefined Claude prompts (PROMPT-*.md) against your vault or the active note using the Claude Code CLI in headless mode. Define reusable prompts and a CLAUDE.md with vault conventions to process, analyze, and update notes directly inside Obsidian."

    stats: {
        downloads:  620
        updated_at: 1782883682000
    }
}
```

[^template]: [[Obsidian plugin]]
