---
uid: 6f133cae-ba67-56cb-bdfd-a47bd82ec7c1
xid:
  - ai-providers
aliases:
  - ai-providers
  - AI Providers
  - pfrankov/obsidian-ai-providers
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/ai-providers
alt:
  - https://github.com/pfrankov/obsidian-ai-providers
downloads: 54179
updated at: "2026-04-18T19:48:43Z"
related to:
  - "[[GitHub - 890505758]]"
remind me:
---

# AI Providers

Collects AI provider settings and API keys in one control panel so other Obsidian plugins can connect without each re-entering credentials. Configuration for multiple services is stored and shared, compatible with OpenAI-style APIs as well as Ollama. The plugin performs no AI processing itself and acts only as an extendable provider hub.

```cue
plugin: {
    id:     "ai-providers"
    name:   "AI Providers"
    author: "pfrankov"
    repo:   "pfrankov/obsidian-ai-providers"

    html_url:    "https://community.obsidian.md/plugins/ai-providers"
    github_url:  "https://github.com/pfrankov/obsidian-ai-providers"
    description: "A hub for setting AI providers (OpenAI-like, Ollama and more) in one place."
    about:       "Manage AI provider settings and API keys from a single control panel. Store and share credentials and configuration for multiple AI services so other Obsidian plugins can connect without re-entering details. Do not perform AI processing; serve as a centralized, extendable provider hub compatible with OpenAI-style APIs."

    stats: {
        downloads:  54179
        updated_at: 1776541723000
    }
}
```

[^template]: [[Obsidian plugin]]
