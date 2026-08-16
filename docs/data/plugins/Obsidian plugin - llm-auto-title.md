---
uid: 823d9491-1638-5301-b695-751266ff63ed
xid:
  - llm-auto-title
aliases:
  - llm-auto-title
  - LLM Auto Title
  - slow-coding/obsidian-llm-auto-title
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/llm-auto-title
alt:
  - https://github.com/slow-coding/obsidian-llm-auto-title
downloads: 133
updated at: "2026-07-10T17:06:03Z"
related to:
  - "[[GitHub - 1295012676]]"
remind me:
---

# LLM Auto Title

Generates note titles with a local LLM, LMStudio by default or any OpenAI-compatible server, and renames the file so backlinks update automatically. Titling runs on demand through a hotkey or in batch over timestamped notes, the system prompt and patterns are customizable, and the interface localizes itself between English and Chinese. The recorded inputs state that it runs on desktop vaults able to reach a local server.

```cue
plugin: {
    id:     "llm-auto-title"
    name:   "LLM Auto Title"
    author: "Darren Zheng"
    repo:   "slow-coding/obsidian-llm-auto-title"

    html_url:    "https://community.obsidian.md/plugins/llm-auto-title"
    github_url:  "https://github.com/slow-coding/obsidian-llm-auto-title"
    description: "Generate note titles via a local LLM (LMStudio by default; any OpenAI-compat server). Hotkey to title the current note; batch-rename timestamp notes. UI auto-localizes (English / 中文). - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Generate note titles with a local LLM (default LMStudio) or any OpenAI-compatible server and rename files so backlinks update automatically. Batch-rename timestamped notes, run titling on demand, customize the system prompt and patterns, and run on desktop vaults that can reach a local server."

    stats: {
        downloads:  133
        updated_at: 1783703163000
    }
}
```

[^template]: [[Obsidian plugin]]
