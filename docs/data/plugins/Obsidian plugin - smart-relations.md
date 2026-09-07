---
uid: 9e25e200-2d74-5283-bc56-1f46b57e7a01
xid:
  - smart-relations
aliases:
  - smart-relations
  - Smart Relations
  - dmderelyn/Obsidian-smart-relations
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/smart-relations
alt:
  - https://github.com/dmderelyn/Obsidian-smart-relations
downloads: 306
updated at: "2026-05-18T15:02:44Z"
related to:
  - "[[GitHub - 1204921904]]"
remind me:
---

# Smart Relations

Smart Relations builds deterministic, local vector-like indexes over the vault for retrieval and relation discovery, with no external API calls. Related notes are scored and ranked using BM25, tag and term overlap, and graph proximity. Six interconnected indexes back this: UUID, term, tag co-occurrence, n-gram, relation graph and document statistics.

```cue
plugin: {
    id:     "smart-relations"
    name:   "Smart Relations"
    author: "dmderelyn"
    repo:   "dmderelyn/Obsidian-smart-relations"

    html_url:    "https://community.obsidian.md/plugins/smart-relations"
    github_url:  "https://github.com/dmderelyn/Obsidian-smart-relations"
    description: "Build local vectorization indexes for RAG-style retrieval and relation discovery. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Build deterministic, local vector-like indexes over your vault to enable semantic-style retrieval and relation discovery entirely offline with no external API calls. Score and rank related notes using BM25, tag and term overlap, and graph proximity, backed by six interconnected indexes: UUID, term, tag co‑occurrence, n‑gram, relation graph, and document stats."

    stats: {
        downloads:  306
        updated_at: 1779116564000
    }
}
```

[^template]: [[Obsidian plugin]]
