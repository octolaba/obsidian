---
uid: 022b947e-9522-5a84-b27e-29bcddba1893
xid:
  - lark-knowledge-ai
aliases:
  - lark-knowledge-ai
  - Lark Knowledge AI
  - iamtheozzz/lark-knowledge-ai
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/lark-knowledge-ai
alt:
  - https://github.com/iamtheozzz/lark-knowledge-ai
downloads: 60
updated at: "2026-08-05T09:12:13Z"
related to:
  - "[[GitHub - 1315879816]]"
remind me:
---

# Lark Knowledge AI

Answers natural-language questions about the vault from a search box, running semantic and keyword search in parallel so that acronyms and proper nouns which vectors alone miss still surface. References come from the passages actually used, and clicking one jumps to the exact line in a note or page in a PDF. Queries can be scoped to the open file, to the PDF page on screen, or filtered by date, and the conversation can be moved into the right sidebar or a center tab. It talks only to a configured endpoint, by default Ollama on localhost, and is desktop-only, requiring Obsidian 1.7.2 or newer and a local model runner.

```cue
plugin: {
    id:     "lark-knowledge-ai"
    name:   "Lark Knowledge AI"
    author: "7heozzz"
    repo:   "iamtheozzz/lark-knowledge-ai"

    html_url:    "https://community.obsidian.md/plugins/lark-knowledge-ai"
    github_url:  "https://github.com/iamtheozzz/lark-knowledge-ai"
    description: "Ask AI questions about your vault in natural language. Semantic search over notes and PDFs, answers with clickable citations, running entirely on your own machine. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Lark-styled Knowledge AI brings the search-box-first feel of enterprise knowledge assistants into Obsidian, and runs it entirely on your own machine. Click the main page and go — no sidebar to open, no files to pick first. The conversation can be moved into the right sidebar or a center tab to read alongside. Semantic and keyword search run in parallel, so acronyms and proper nouns that vectors alone miss still surface. References come from the passages actually used, not from the model, and clicking one jumps to the exact line in a note or page in a PDF. It follows what you are reading: \"this paper\" scopes the search to the open file, \"this page\" reads only the PDF page on screen, \"last week\" filters by date. Nothing leaves your computer — the plugin talks only to an endpoint you configure, by default Ollama on localhost. No telemetry, no account, no limits. Requires Obsidian 1.7.2+ and a local model runner. Desktop only, MIT licensed."

    stats: {
        downloads:  60
        updated_at: 1785921133000
    }
}
```

[^template]: [[Obsidian plugin]]
