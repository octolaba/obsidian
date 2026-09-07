---
uid: 8a3f59dd-ffb4-5570-8231-d66207839dd1
xid:
  - ollama-chat
aliases:
  - ollama-chat
  - Ollama Chat
  - brumik/obsidian-ollama-chat
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/ollama-chat
alt:
  - https://github.com/brumik/obsidian-ollama-chat
downloads: 11927
updated at: "2024-10-12T06:50:01Z"
related to:
  - "[[GitHub - 729849696]]"
remind me:
---

# Ollama Chat

Ollama Chat asks a locally run model about notes in the vault, serving the model through Ollama and indexing the notes with LlamaIndex. Files are indexed on startup and again when notes change, and a modal opened by command or shortcut sends queries to the model.

```cue
plugin: {
    id:     "ollama-chat"
    name:   "Ollama Chat"
    author: "brumik"
    repo:   "brumik/obsidian-ollama-chat"

    html_url:    "https://community.obsidian.md/plugins/ollama-chat"
    github_url:  "https://github.com/brumik/obsidian-ollama-chat"
    description: "Chat with your notes using Ollama and LlamaIndex."
    about:       "Ask your local LLM about notes in your vault and run a model locally via Ollama. Index files on startup and when notes change, and open a modal via command or shortcut to query the model."

    stats: {
        downloads:  11927
        updated_at: 1728715801000
    }
}
```

[^template]: [[Obsidian plugin]]
