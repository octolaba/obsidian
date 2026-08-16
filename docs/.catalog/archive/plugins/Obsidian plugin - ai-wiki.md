---
uid: 5a610bdc-ad46-550e-880c-7b6b98c69cd2
xid:
  - ai-wiki
aliases:
  - ai-wiki
  - AI Wiki
  - ikeniborn/obsidian-llm-wiki
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/ai-wiki
alt:
  - https://github.com/ikeniborn/obsidian-llm-wiki
downloads: 855
updated at: "2026-07-16T04:54:15Z"
related to:
  - "[[GitHub - 1222425216]]"
remind me:
---

# AI Wiki

Builds and maintains a local wiki knowledge base from notes using LLMs, keeping the data on your own machine. Ingesting a note extracts entities and creates or updates the matching pages, and queries against the wiki can be saved as answers carrying wiki links. Domains can be linted and initialized, formatting edits are suggested rather than forced, and Ollama-compatible or Claude Code backends drive the agent with real-time progress.

```cue
plugin: {
    id:     "ai-wiki"
    name:   "AI Wiki"
    author: "Ilya"
    repo:   "ikeniborn/obsidian-llm-wiki"

    html_url:    "https://community.obsidian.md/plugins/ai-wiki"
    github_url:  "https://github.com/ikeniborn/obsidian-llm-wiki"
    description: "AI-powered compoundable knowledge base — extracts, synthesizes and maintains a wiki from raw sources. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Build and maintain a local wiki knowledge base from your notes using LLMs and keep data on your machine. Ingest notes to extract entities and auto-create or update pages, query the wiki and save answers as [[WikiLinks]], lint and init domains, and suggest safe formatting edits with real-time agent progress and Ollama/compatible or Claude Code backends."

    stats: {
        downloads:  855
        updated_at: 1784177655000
    }
}
```

[^template]: [[Obsidian plugin]]
