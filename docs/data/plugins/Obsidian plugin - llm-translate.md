---
uid: 22dc48f0-400a-5e21-90d2-2bef0a9d70ef
xid:
  - llm-translate
aliases:
  - llm-translate
  - LLM Translate
  - chenyuxiaojin/obsidian-llm-translate
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/llm-translate
alt:
  - https://github.com/chenyuxiaojin/obsidian-llm-translate
downloads: 283
updated at: "2026-07-06T07:36:59Z"
related to:
  - "[[GitHub - 1207647248]]"
remind me:
---

# LLM Translate

Translates selected text or a whole note while preserving the YAML frontmatter, using DeepSeek, OpenAI, Gemini, other OpenAI-compatible providers, or a custom endpoint. Translations stream into the editor as they arrive and an in-progress request can be cancelled, and the system prompt is customizable through a target-language placeholder.

```cue
plugin: {
    id:     "llm-translate"
    name:   "LLM Translate"
    author: "陈与小金"
    repo:   "chenyuxiaojin/obsidian-llm-translate"

    html_url:    "https://community.obsidian.md/plugins/llm-translate"
    github_url:  "https://github.com/chenyuxiaojin/obsidian-llm-translate"
    description: "Translate selected text or full notes using DeepSeek, OpenAI, Gemini, and other OpenAI-compatible LLM providers. Preserves YAML frontmatter and supports streaming with cancellation. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Translate selected text or entire notes while preserving YAML frontmatter and choose from OpenAI-compatible providers or custom endpoints. Stream translations live into the editor, cancel in-progress requests, and customize the system prompt with {{targetLanguage}}."

    stats: {
        downloads:  283
        updated_at: 1783323419000
    }
}
```

[^template]: [[Obsidian plugin]]
