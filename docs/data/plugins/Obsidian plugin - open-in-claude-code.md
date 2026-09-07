---
uid: 277b44c1-3596-5076-913d-ff5546fee7bf
xid:
  - open-in-claude-code
aliases:
  - open-in-claude-code
  - Open in Claude Code
  - wepee/obsidian-open-in-claude-code
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/open-in-claude-code
alt:
  - https://github.com/wepee/obsidian-open-in-claude-code
downloads: 334
updated at: "2026-03-10T12:48:02Z"
related to:
  - "[[GitHub - 1177830062]]"
remind me:
---

# Open in Claude Code

Open in Claude Code launches Claude Code in the current note's directory or at the vault root, from a ribbon icon or the command palette. Before each launch it creates and syncs a .claude/settings.json so the target directory inherits the plugins enabled in the vault root's Claude settings.

```cue
plugin: {
    id:     "open-in-claude-code"
    name:   "Open in Claude Code"
    author: "wepee"
    repo:   "wepee/obsidian-open-in-claude-code"

    html_url:    "https://community.obsidian.md/plugins/open-in-claude-code"
    github_url:  "https://github.com/wepee/obsidian-open-in-claude-code"
    description: "Open the current note's directory or vault root in Claude Code from the command palette or ribbon. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Open Claude Code from Obsidian in the current note's directory or at the vault root via a ribbon icon or command palette. Ensure the target directory inherits enabled plugins from the vault root's Claude settings by auto-creating and syncing a .claude/settings.json before each launch."

    stats: {
        downloads:  334
        updated_at: 1773146882000
    }
}
```

[^template]: [[Obsidian plugin]]
