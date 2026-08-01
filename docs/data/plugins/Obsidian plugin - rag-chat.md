---
uid: dc8e1267-123d-5d2e-be90-7966f393139e
xid:
  - rag-chat
aliases:
  - rag-chat
  - RAG Chat
  - a2fsa2k/obsidian-ask-my-vault-plugin
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/rag-chat
alt:
  - https://github.com/a2fsa2k/obsidian-ask-my-vault-plugin
downloads: 110
updated at: "2026-05-16T20:52:21Z"
related to:
  - "[[GitHub - 1109389991]]"
remind me:
---

# RAG Chat

Chats with the vault through any of several AI providers — OpenAI, Claude, Gemini, Mistral, Groq, Ollama and others — grounding answers in the notes with clickable citations that open the referenced file. Indexing runs locally on a built-in BM25 engine with no embeddings and no external indexing service, and the index updates as notes change. The top matching chunks are sent to the model as context.

```cue
plugin: {
    id:     "rag-chat"
    name:   "RAG Chat"
    author: "a2fsa2k"
    repo:   "a2fsa2k/obsidian-ask-my-vault-plugin"

    html_url:    "https://community.obsidian.md/plugins/rag-chat"
    github_url:  "https://github.com/a2fsa2k/obsidian-ask-my-vault-plugin"
    description: "Chat with your vault using local vector search (RAG) and any AI provider — OpenAI, Claude, Gemini, Mistral, Groq, Ollama, and more. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Chat with your Obsidian vault using any AI provider and get answers grounded in your notes, with clickable source citations that open the referenced files. Index your vault locally with a built-in BM25 engine (no embeddings or external indexing) and send top matching chunks as context to the LLM; index updates automatically as notes change."

    stats: {
        downloads:  110
        updated_at: 1778964741000
    }
}
```

[^template]: [[Obsidian plugin]]
