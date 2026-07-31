---
uid: 12f4389a-0367-5ab8-ade0-7195f1c9540c
xid:
  - tiktoken-tokenizer
aliases:
  - tiktoken-tokenizer
  - TikToken Tokenizer
  - s3ga1ov/obsidian-tiktoken-tokenizer
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/tiktoken-tokenizer
alt:
  - https://github.com/s3ga1ov/obsidian-tiktoken-tokenizer
downloads: 272
updated at: "2026-05-19T13:08:44Z"
related to:
  - "[[GitHub - 1030235270]]"
remind me:
---

# TikToken Tokenizer

TikToken Tokenizer displays the active note's token count in the status bar and updates it as you type. Two tokenizer modes are switchable in settings: exact counts for gpt-4o and the gpt-5 family through the o200k_base encoding, and an approximate Claude mode using cl100k_base with a fifteen percent safety margin. It runs entirely in JavaScript, with no WebAssembly and no network calls.

```cue
plugin: {
    id:     "tiktoken-tokenizer"
    name:   "TikToken Tokenizer"
    author: "s3ga1ov"
    repo:   "s3ga1ov/obsidian-tiktoken-tokenizer"

    html_url:    "https://community.obsidian.md/plugins/tiktoken-tokenizer"
    github_url:  "https://github.com/s3ga1ov/obsidian-tiktoken-tokenizer"
    description: "Displays the token count of the active note in the status bar using TikToken - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Display the token count for the active note in the status bar and update it as you type. Two tokenizer modes, switchable in plugin settings: exact counts for `gpt-4o` and the `gpt-5` family via the `o200k_base` encoding, plus an approximate Claude mode that uses `cl100k_base` with a 15% safety margin. Runs entirely in JavaScript — no WebAssembly, no network calls."

    stats: {
        downloads:  272
        updated_at: 1779196124000
    }
}
```

[^template]: [[Obsidian plugin]]
