---
uid: a9ff3121-5d57-568c-a746-20b221765296
xid:
  - semantic-auto-linker
aliases:
  - semantic-auto-linker
  - Semantic Auto-Linker
  - ysf-ad/semantic-auto-linker
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/semantic-auto-linker
alt:
  - https://github.com/ysf-ad/semantic-auto-linker
downloads: 886
updated at: "2026-05-26T20:09:17Z"
related to:
  - "[[GitHub - 1194232892]]"
remind me:
---

# Semantic Auto-Linker

Semantic Auto-Linker proposes missing wiki-links and shows how accepting them would change the graph, with every suggestion reviewed before anything is written. Analysis runs over the current note or the whole vault, combining deterministic matching of titles, aliases and acronyms with local semantic retrieval for conceptual links that exact matching would miss. An embedding explorer projects notes and concepts into a semantic space so that related ideas appear closer together even before they are linked, and noisy targets can be excluded, generic terms ignored, suggestions retargeted by hand, and insertion placed inline or in a footer. Semantic mode is local-first with a built-in model and optional Ollama support.

```cue
plugin: {
    id:     "semantic-auto-linker"
    name:   "Semantic Auto-Linker"
    author: "ysf-ad"
    repo:   "ysf-ad/semantic-auto-linker"

    html_url:    "https://community.obsidian.md/plugins/semantic-auto-linker"
    github_url:  "https://github.com/ysf-ad/semantic-auto-linker"
    description: "Suggest missing wiki-links, preview graph impact, and explore your vault as a local semantic space. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Semantic Auto-Linker helps you find missing wiki-links and understand the hidden structure of your Obsidian vault. Review suggestions before anything is written, run current-note or whole-vault analysis, and preview how accepted links would change your graph. It supports deterministic matching for titles, aliases, and acronyms, plus local semantic retrieval for conceptual links that exact matching can miss. The embedding explorer projects notes and concepts into a semantic space, so related ideas appear closer together even when they are not linked yet. You can exclude noisy targets, ignore generic terms, manually retarget suggestions, and choose inline or footer insertion. Semantic mode is local-first with a built-in model and optional Ollama support."

    stats: {
        downloads:  886
        updated_at: 1779826157000
    }
}
```

[^template]: [[Obsidian plugin]]
