---
uid: 2b02e7c9-8ff1-58ac-83c8-1f1a1a1f9930
xid:
  - smart-linker
aliases:
  - smart-linker
  - Smart Linker
  - lemannrus/smart-linker
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/smart-linker
alt:
  - https://github.com/lemannrus/smart-linker
downloads: 240
updated at: "2025-12-17T13:23:27Z"
related to:
  - "[[GitHub - 1118133064]]"
remind me:
---

# Smart Linker

Smart Linker finds semantically related notes from pre-computed vector embeddings, ranked by cosine similarity, and inserts them into the note. The results go into a managed block at the end of the note, updated non-destructively and with duplicates removed, so the lookup stays local and fast. Its recorded description names the Vector Search plugin as the source of the embeddings.

```cue
plugin: {
    id:     "smart-linker"
    name:   "Smart Linker"
    author: "lemannrus"
    repo:   "lemannrus/smart-linker"

    html_url:    "https://community.obsidian.md/plugins/smart-linker"
    github_url:  "https://github.com/lemannrus/smart-linker"
    description: "Automatically finds and inserts semantically related notes using AI embeddings from Vector Search plugin. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Find and insert semantically related notes using pre-computed vector embeddings and cosine similarity. Insert results into a managed block at the end of the note for fast local lookup, with deduplication and non-destructive updates."

    stats: {
        downloads:  240
        updated_at: 1765977807000
    }
}
```

[^template]: [[Obsidian plugin]]
