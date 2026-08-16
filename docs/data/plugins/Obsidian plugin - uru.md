---
uid: 6fae04a3-eac7-5f5a-99ee-a5de7b3e6e04
xid:
  - uru
aliases:
  - uru
  - Uru
  - arsenije/Uru
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/uru
alt:
  - https://github.com/arsenije/Uru
downloads: 48
updated at: "2026-07-20T19:40:34Z"
related to:
  - "[[GitHub - 1281225639]]"
remind me:
---

# Uru

Answers questions about the vault from what the user has actually written, with citations linking back to the passages used. Search works by meaning rather than by keyword, and new or edited notes are picked up as they are written. The recorded About states that the first run sets up a small local backend (llama.cpp and Khora) and downloads a chat model and an embedding model, that this is the only time the plugin touches the network, and that no account or API key is needed.

```cue
plugin: {
    id:     "uru"
    name:   "Uru"
    author: "Arsenije Catic"
    repo:   "arsenije/Uru"

    html_url:    "https://community.obsidian.md/plugins/uru"
    github_url:  "https://github.com/arsenije/Uru"
    description: "Find notes by meaning and ask questions about what you wrote. Fully local AI, nothing leaves your machine. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Ask your vault a question and get an answer built from what you actually wrote, with citations linking back to the exact passages. Search works by meaning, not keywords, so you can find a note without remembering the words you used. New and edited notes are picked up as you write — nothing to re-sync. The first run sets up a small local backend (llama.cpp + Khora) and downloads a chat model and an embedding model; that’s the only time Uru touches the network. No account, no API keys, fully offline after that — and your notes are never uploaded or edited."

    stats: {
        downloads:  48
        updated_at: 1784576434000
    }
}
```

[^template]: [[Obsidian plugin]]
