---
uid: ad9814a0-ca14-5f4c-900c-1ce42b38a714
xid:
  - llm-token-count
aliases:
  - llm-token-count
  - LLM Token Count
  - hardes11/llm-token-count
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/llm-token-count
alt:
  - https://github.com/hardes11/llm-token-count
downloads: 57
updated at: "2026-07-19T20:20:04Z"
related to:
  - "[[GitHub - 1305182880]]"
remind me:
---

# LLM Token Count

Shows LLM token counts in the status bar beside word and character counts, so a note's context budget can be checked before it is sent. Counts are recorded as exact for GLM, GPT, Qwen, and DeepSeek and approximate for Claude and Gemini, with approximate models labelled as such. HuggingFace tokenizers are cached locally so counting works offline after the first fetch.

```cue
plugin: {
    id:     "llm-token-count"
    name:   "LLM Token Count"
    author: "William Hardesty"
    repo:   "hardes11/llm-token-count"

    html_url:    "https://community.obsidian.md/plugins/llm-token-count"
    github_url:  "https://github.com/hardes11/llm-token-count"
    description: "Accurate LLM token counts in the status bar — GLM-5.2/GPT/Qwen/DeepSeek exact, Claude/Gemini approx. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Display real LLM token counts for GLM, GPT, Qwen and DeepSeek in Obsidian's status bar alongside word and character counts to check context budget before sending. Cache HuggingFace tokenizers locally for instant offline counts after the first fetch, apply exact HuggingFace tokenization for GLM‑5.2, and clearly label models that are approximate."

    stats: {
        downloads:  57
        updated_at: 1784492404000
    }
}
```

[^template]: [[Obsidian plugin]]
