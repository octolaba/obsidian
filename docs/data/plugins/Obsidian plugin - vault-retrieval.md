---
uid: 9f684711-816d-51a9-ba00-cc954fe7c00d
xid:
  - vault-retrieval
aliases:
  - vault-retrieval
  - Vault Retrieval
  - johannes-kaindl/vault-rag
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/vault-retrieval
alt:
  - https://github.com/johannes-kaindl/vault-rag
downloads: 366
updated at: "2026-08-09T16:21:41Z"
related to:
  - "[[GitHub - 1275566246]]"
remind me:
---

# Vault Retrieval

Indexes the vault into a compact embedding index stored in the vault itself, so related notes and semantic search work offline. Chat is grounded in linked sources against a local LLM endpoint, answers stream token by token, and the live context is editable beside a collapsible thinking stream. Notes are re-embedded on save and edits made offline are queued for catch-up.

```cue
plugin: {
    id:     "vault-retrieval"
    name:   "Vault Retrieval"
    author: "Johannes Kaindl"
    repo:   "johannes-kaindl/vault-rag"

    html_url:    "https://community.obsidian.md/plugins/vault-retrieval"
    github_url:  "https://github.com/johannes-kaindl/vault-rag"
    description: "Local, offline retrieval over your vault: related notes, semantic search, and grounded chat with a local LLM — nothing leaves your machine. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Search your vault by meaning and rank related notes offline using a compact embedding index stored in-vault. Chat with your vault using grounded, source-linked RAG against a local LLM endpoint, stream answers token-by-token and inspect editable live context with a collapsible thinking stream. Re-embed notes on save and queue offline edits for automatic catch-up."

    stats: {
        downloads:  366
        updated_at: 1786292501000
    }
}
```

[^template]: [[Obsidian plugin]]
