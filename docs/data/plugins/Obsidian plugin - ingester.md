---
uid: c51789da-6417-5de6-9046-f2c9960096f0
xid:
  - ingester
aliases:
  - ingester
  - Ingester
  - shadielfares/ingester
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/ingester
alt:
  - https://github.com/shadielfares/ingester
downloads: 141
updated at: "2026-04-23T06:09:26Z"
related to:
  - "[[GitHub - 1208895364]]"
remind me:
---

# Ingester

Watches a folder for new web clippings and triggers the Claude Code ingest skill on each new file, to convert saved articles into a wiki knowledge graph. Processing happens outside Obsidian by opening tmux and running the claude command there, so the Claude CLI and tmux are required.

```cue
plugin: {
    id:     "ingester"
    name:   "Ingester"
    author: "shadielfares"
    repo:   "shadielfares/ingester"

    html_url:    "https://community.obsidian.md/plugins/ingester"
    github_url:  "https://github.com/shadielfares/ingester"
    description: "Watches a folder for new web clippings and automatically triggers Claude Code /ingest. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Watch a folder for new clippings and invoke Claude Code's /ingest skill to convert saved articles into your wiki knowledge graph. Open tmux and run claude /ingest on new files so processing occurs outside Obsidian; requires Claude CLI and tmux."

    stats: {
        downloads:  141
        updated_at: 1776924566000
    }
}
```

[^template]: [[Obsidian plugin]]
