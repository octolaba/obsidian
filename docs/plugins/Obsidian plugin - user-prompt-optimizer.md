---
uid: a4337e70-e5ca-55a7-a9b0-00e4d38dfd2e
xid:
  - user-prompt-optimizer
aliases:
  - user-prompt-optimizer
  - User Prompt Optimizer
  - chuanqq/user-prompt-optimizer
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/user-prompt-optimizer
alt:
  - https://github.com/chuanqq/user-prompt-optimizer
downloads: 17
updated at: "2026-07-19T09:44:41Z"
related to:
  - "[[GitHub - 1305020821]]"
remind me:
---

# User Prompt Optimizer

Refines a selected prompt with an LLM, streaming the optimized text back into the selection character by character. Two modes are recorded: template-driven structured optimization, and template-free light polishing that disambiguates, removes duplication and marks missing information with placeholders. Code, JSON, URLs and examples are preserved, progress is shown through in-editor banners, a status ribbon and request logs, and OpenAI- or Anthropic-compatible providers are used.

```cue
plugin: {
    id:     "user-prompt-optimizer"
    name:   "User Prompt Optimizer"
    author: "chuanqz"
    repo:   "chuanqq/user-prompt-optimizer"

    html_url:    "https://community.obsidian.md/plugins/user-prompt-optimizer"
    github_url:  "https://github.com/chuanqq/user-prompt-optimizer"
    description: "Select a prompt and refine it with an LLM. Two modes: template-driven structured optimization, and template-free light polishing (disambiguate / dedupe / mark missing info with placeholders). - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Select a prompt and refine it with an LLM, streaming the optimized text back into your selection character by character. Choose template or lite optimization, preserve code, JSON, URLs and examples, and monitor progress with in-editor banners, a status ribbon and request logs while using OpenAI- or Anthropic-compatible providers."

    stats: {
        downloads:  17
        updated_at: 1784454281000
    }
}
```

[^template]: [[Obsidian plugin]]
