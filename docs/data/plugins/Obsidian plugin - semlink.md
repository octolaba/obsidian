---
uid: 4058bf42-987c-5c91-80cd-c2fec9ed95ce
xid:
  - semlink
aliases:
  - semlink
  - Semlink
  - ouou365/Semlink
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/semlink
alt:
  - https://github.com/ouou365/Semlink
downloads: 137
updated at: "2026-08-09T09:36:49Z"
related to:
  - "[[GitHub - 1248360288]]"
remind me:
---

# Semlink

Adds an AI chat panel that answers questions about notes with sources, keeps conversation history and switches between model providers; a note dragged in is attached for question-and-answer on its content. Questions are also suggested from recent notes. Separately, notes are vectorized and exposed through a local MCP HTTP server, so clients such as Claude and Cursor can search them semantically, fetch a specific note or section, find similar notes, see the currently open note and trigger a reindex.

```cue
plugin: {
    id:     "semlink"
    name:   "Semlink"
    author: "Ouzhongyuan"
    repo:   "ouou365/Semlink"

    html_url:    "https://community.obsidian.md/plugins/semlink"
    github_url:  "https://github.com/ouou365/Semlink"
    description: "AI assistant for Obsidian: chat with your notes, drag in notes for Q&A, semantic search via MCP - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Semlink is an AI assistant built into Obsidian. Chat with your notes in a built-in panel with conversation history and multi-provider model switching: ask questions and the AI answers with sources, or drag in any note from your Vault and it is attached for instant Q&A on its content. AI also suggests questions based on your recent notes and helps you organize your knowledge base. MCP support is included as an extra: your notes are vectorized and exposed via a local MCP HTTP server, so AI clients like Claude and Cursor can semantically search and read your notes with natural language — fetch the exact note or section, find similar notes, see the currently open note, and reindex on demand."

    stats: {
        downloads:  137
        updated_at: 1786268209000
    }
}
```

[^template]: [[Obsidian plugin]]
