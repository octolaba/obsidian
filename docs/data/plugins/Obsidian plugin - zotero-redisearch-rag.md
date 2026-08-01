---
uid: 26d018ec-1c6d-54d1-8899-83a1cf76349d
xid:
  - zotero-redisearch-rag
aliases:
  - zotero-redisearch-rag
  - Zotero Research Assistant
  - jmiba/zotero-redisearch-rag
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/zotero-redisearch-rag
alt:
  - https://github.com/jmiba/zotero-redisearch-rag
downloads: 1449
updated at: "2026-05-28T21:05:43Z"
related to:
  - "[[GitHub - 1120222664]]"
remind me:
---

# Zotero Research Assistant

This plugin imports Zotero items, OCRs their PDFs through a Docling pipeline, and syncs metadata including annotations. Chunks are indexed in Redis Stack for local retrieval, so a Zotero library can be queried from Obsidian and answers arrive with clickable chunk-level citations that jump to the exact passage in the note or in Zotero. Chunks can be edited inline, with reindexing done incrementally.

```cue
plugin: {
    id:     "zotero-redisearch-rag"
    name:   "Zotero Research Assistant"
    author: "Jens Mittelbach"
    repo:   "jmiba/zotero-redisearch-rag"

    html_url:    "https://community.obsidian.md/plugins/zotero-redisearch-rag"
    github_url:  "https://github.com/jmiba/zotero-redisearch-rag"
    description: "Import and OCR Zotero PDFs using a Docling pipeline, sync metadata including annotations, and chat with your research literature using local Redis-powered RAG. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Query your Zotero library from Obsidian and get answers with clickable chunk-level citations that jump to the exact passage in your note or Zotero. Import items, OCR PDFs, index chunks in Redis Stack for local retrieval, and edit chunks inline with incremental reindexing."

    stats: {
        downloads:  1449
        updated_at: 1780002343000
    }
}
```

[^template]: [[Obsidian plugin]]
