---
uid: 82ae4633-40ee-5ed4-8736-97de40ece14c
xid:
  - vector-search
aliases:
  - vector-search
  - Vector Search
  - ashwin271/obsidian-vector-search
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/vector-search
alt:
  - https://github.com/ashwin271/obsidian-vector-search
downloads: 3369
updated at: "2026-01-14T03:46:27Z"
related to:
  - "[[GitHub - 914950898]]"
remind me:
---

# Vector Search

Vector Search runs semantic search over the vault with Ollama and nomic-embed-text embeddings, finding notes by meaning rather than by keyword. An Ollama installation is required, and once embeddings are generated results are local and fast. Similarity thresholds are configurable and indexes update automatically as files change.

```cue
plugin: {
    id:     "vector-search"
    name:   "Vector Search"
    author: "ashwin271"
    repo:   "ashwin271/obsidian-vector-search"

    html_url:    "https://community.obsidian.md/plugins/vector-search"
    github_url:  "https://github.com/ashwin271/obsidian-vector-search"
    description: "Semantic search for your notes using Ollama and nomic-embed-text embeddings. Requires Ollama installation."
    about:       "Search your vault semantically using Ollama embeddings to find notes by meaning rather than keywords. Set similarity thresholds, get fast local results once embeddings are generated, and keep indexes updated automatically as files change."

    stats: {
        downloads:  3369
        updated_at: 1768362387000
    }
}
```

[^template]: [[Obsidian plugin]]
