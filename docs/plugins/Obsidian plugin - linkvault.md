---
uid: fcd6b97e-8a47-5e9e-ba17-a6be8a3f486c
xid:
  - linkvault
aliases:
  - linkvault
  - LinkVault
  - calghar/LinkVault
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/linkvault
alt:
  - https://github.com/calghar/LinkVault
downloads: 220
updated at: "2026-07-19T14:31:54Z"
related to:
  - "[[GitHub - 1179282074]]"
remind me:
---

# LinkVault

Saves and categorises web-clipped links in a knowledge base using an LLM, which extracts a title and a one-sentence summary. Three-tier fuzzy matching selects the best knowledge-base file and H2 section, a new file is created when none fits, and a table row with the link is inserted. Anthropic, Ollama, and OpenRouter are the recorded providers, and transient errors are retried automatically.

```cue
plugin: {
    id:     "linkvault"
    name:   "LinkVault"
    author: "calghar"
    repo:   "calghar/LinkVault"

    html_url:    "https://community.obsidian.md/plugins/linkvault"
    github_url:  "https://github.com/calghar/LinkVault"
    description: "Save and categorise links into your knowledge base using AI. Supports Claude, Ollama, and OpenRouter. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Save web-clipped links into your vault with AI-extracted titles and one-sentence summaries. Select the best KB file and H2 section using three-tier fuzzy matching, create new files when none fit, and insert a table row with the link. Use Anthropic, Ollama, or OpenRouter for AI calls and retry transient errors automatically."

    stats: {
        downloads:  220
        updated_at: 1784471514000
    }
}
```

[^template]: [[Obsidian plugin]]
