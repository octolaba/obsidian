---
uid: dbeed4c3-a754-552c-af84-6ba943f13a7f
xid:
  - bbawj-semantic-search
aliases:
  - bbawj-semantic-search
  - Semantic Search
  - bbawj/obsidian-semantic-search
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/bbawj-semantic-search
alt:
  - https://github.com/bbawj/obsidian-semantic-search
downloads: 7299
updated at: "2025-06-20T13:36:09Z"
related to:
  - "[[GitHub - 620411670]]"
remind me:
---

# Semantic Search

Semantic Search finds notes by meaning using OpenAI text embeddings, with a file switcher built on Rust compiled to WASM. Input CSVs are generated from note sections and embeddings created through your own API access. Queries run in a modal or from the current selection and can insert the recommended notes as Markdown links.

```cue
plugin: {
    id:     "bbawj-semantic-search"
    name:   "Semantic Search"
    author: "bbawj"
    repo:   "bbawj/obsidian-semantic-search"

    html_url:    "https://community.obsidian.md/plugins/bbawj-semantic-search"
    github_url:  "https://github.com/bbawj/obsidian-semantic-search"
    description: "Semantic search for files using OpenAI's text embeddings."
    about:       "Search notes by meaning using semantic embeddings with a WASM/Rust-powered file switcher. Generate input CSVs from note sections, create embeddings via your API, and query notes in a modal or from selection to insert recommended markdown links."

    stats: {
        downloads:  7299
        updated_at: 1750426569000
    }
}
```

[^template]: [[Obsidian plugin]]
