---
uid: c2a33119-cd63-538a-86f4-cd5f80ca39ed
xid:
  - native-search
aliases:
  - native-search
  - Native Search
  - gyroid-eth/obsidian-native-search
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/native-search
alt:
  - https://github.com/gyroid-eth/obsidian-native-search
downloads: 78
updated at: "2026-07-29T02:37:40Z"
related to:
  - "[[GitHub - 1315595163]]"
remind me:
---

# Native Search

Searches the vault through the operating system's own index, macOS Spotlight, covering note text, PDF full text, text recognized inside images by Apple Live Text, and Office documents. Because there is no plugin-side index or cache, there is no indexing cost or startup delay inside Obsidian, which suits very large or document-heavy vaults. The trade-off is some loss of relevance ranking and typo tolerance.

```cue
plugin: {
    id:     "native-search"
    name:   "Native Search"
    author: "gyroid"
    repo:   "gyroid-eth/obsidian-native-search"

    html_url:    "https://community.obsidian.md/plugins/native-search"
    github_url:  "https://github.com/gyroid-eth/obsidian-native-search"
    description: "Zero-index search powered by the OS-native index (macOS Spotlight): PDF full-text, OCR'd text inside images, Office documents and notes — no indexing cost inside Obsidian. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Search the full text of PDFs, OCR’d images (via Apple Live Text), Office documents, and notes using your OS’s existing Spotlight index. Keep Obsidian’s footprint minimal with no plugin-side index, cache, or startup delay—ideal for very large or document-heavy vaults, at the cost of some relevance ranking and typo tolerance."

    stats: {
        downloads:  78
        updated_at: 1785292660000
    }
}
```

[^template]: [[Obsidian plugin]]
