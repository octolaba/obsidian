---
uid: 2eb511e9-985a-5291-b098-3461a59b333d
xid:
  - auto-llm-wiki
aliases:
  - auto-llm-wiki
  - Auto LLM Wiki
  - youzhixiaomutou/auto-llm-wiki
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/auto-llm-wiki
alt:
  - https://github.com/youzhixiaomutou/auto-llm-wiki
downloads: 1291
updated at: "2026-07-13T06:02:47Z"
related to:
  - "[[GitHub - 1252131252]]"
remind me:
---

# Auto LLM Wiki

Auto LLM Wiki builds a Karpathy-style wiki out of raw Markdown sources, turning notes into a persistent, structured knowledge base. It scans source folders and sends only new or changed files to an OpenAI-compatible chat endpoint, which answers with JSON change plans. The proposed updates are previewed in a card modal and only confirmed changes are applied, while the sources themselves stay read-only.

```cue
plugin: {
    id:     "auto-llm-wiki"
    name:   "Auto LLM Wiki"
    author: "youzhixiaomutou"
    repo:   "youzhixiaomutou/auto-llm-wiki"

    html_url:    "https://community.obsidian.md/plugins/auto-llm-wiki"
    github_url:  "https://github.com/youzhixiaomutou/auto-llm-wiki"
    description: "Maintain a Karpathy-style LLM Wiki with AI-assisted ingest, query, lint, and previewed file changes. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Create a Karpathy-style LLM wiki from raw Markdown sources, turning notes into a persistent, structured knowledge base. Scan source folders, send only new or changed files to an OpenAI-compatible chat endpoint to generate JSON change plans, preview updates in a card modal, and apply confirmed changes while keeping sources read-only."

    stats: {
        downloads:  1291
        updated_at: 1783922567000
    }
}
```

[^template]: [[Obsidian plugin]]
