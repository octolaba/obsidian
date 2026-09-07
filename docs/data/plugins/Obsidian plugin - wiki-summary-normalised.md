---
uid: 37928d89-6f63-5205-89eb-3123059b7444
xid:
  - wiki-summary-normalised
aliases:
  - wiki-summary-normalised
  - Vault Graph Summary
  - pflanzmann/obsidian-summary-plugin
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/wiki-summary-normalised
alt:
  - https://github.com/pflanzmann/obsidian-summary-plugin
downloads: 168
updated at: "2026-03-22T22:43:10Z"
related to:
  - "[[GitHub - 1126894931]]"
remind me:
---

# Vault Graph Summary

Crawls the note graph and concatenates many Markdown files, or the whole vault, into a single consolidated text document intended as input for a language model. Traversal follows outgoing links and backlinks to a chosen recursion depth, and an interactive tree previews and selects the files included, while exclusion patterns keep templates and archives out. Primary notes can be paired with mirror copies, and recent summaries are kept in a history for reuse.

```cue
plugin: {
    id:     "wiki-summary-normalised"
    name:   "Vault Graph Summary"
    author: "pflanzmann"
    repo:   "pflanzmann/obsidian-summary-plugin"

    html_url:    "https://community.obsidian.md/plugins/wiki-summary-normalised"
    github_url:  "https://github.com/pflanzmann/obsidian-summary-plugin"
    description: "Generates a consolidated summary text file by crawling your notes. Supports outgoing links, backlinks, recursion depth, exclusion patterns, and 'Mirror' folder logic for handling Primary vs. Public note versions. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Compile multiple Markdown files—or your entire vault—into a single, well-structured text document tailored for LLM inputs. Traverse your note graph to gather outgoing links and backlinks, preview and select included files in an interactive tree, and exclude templates or archives for clean concatenation. Pair primary notes with mirror copies and keep a smart history of recent summaries for quick reuse."

    stats: {
        downloads:  168
        updated_at: 1774219390000
    }
}
```

[^template]: [[Obsidian plugin]]
