---
uid: 1dea177d-99c8-5984-b0fb-a21c189988ff
xid:
  - manex-brain
aliases:
  - manex-brain
  - Manex Brain
  - krcnow/manex-brain
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/manex-brain
alt:
  - https://github.com/krcnow/manex-brain
downloads: 148
updated at: "2026-05-12T20:51:04Z"
related to:
  - "[[GitHub - 1236108062]]"
remind me:
---

# Manex Brain

Indexes the whole vault in the background and answers questions from it with a local Apple Silicon MLX model, which the recorded text says needs no cloud and no API keys and keeps data on the machine. On first load it installs the mlx-lm inference engine and starts a local server that then starts silently with Obsidian; a question retrieves the most relevant chunks along with the open note, its linked notes, backlinks and shared-tag notes. Answers, corrections and decisions are saved back as memory notes that later sessions retrieve, and comments on answers refine how it responds. The recorded text states that it requires macOS on Apple Silicon and Python 3 installed through Homebrew.

```cue
plugin: {
    id:     "manex-brain"
    name:   "Manex Brain"
    author: "Manex"
    repo:   "krcnow/manex-brain"

    html_url:    "https://community.obsidian.md/plugins/manex-brain"
    github_url:  "https://github.com/krcnow/manex-brain"
    description: "Local AI brain for your Obsidian vault. Indexes all your notes and answers questions privately using a local Apple Silicon MLX model — no cloud, no API keys. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Turns your vault into a private, local AI knowledge base powered by Apple Silicon MLX. No cloud, no API keys, no data leaving your machine. On first load, it automatically installs the mlx-lm inference engine and starts a local server. After that, the server starts silently every time Obsidian opens. Your entire vault is indexed in the background. When you ask a question, the most relevant chunks from across all your notes are retrieved and used as context, alongside the note you currently have open. Linked notes, backlinks, and shared-tag notes are also included automatically. Save useful answers, corrections, and decisions directly back into your vault as memory notes. The brain retrieves these saved memories in future sessions, so it gets smarter the more you use it. You can also leave comments on answers to refine how the brain responds over time. Requires macOS with Apple Silicon (M1 or later) and Python 3 installed via Homebrew."

    stats: {
        downloads:  148
        updated_at: 1778619064000
    }
}
```

[^template]: [[Obsidian plugin]]
