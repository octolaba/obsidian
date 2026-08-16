---
uid: 1c026af7-cbb8-542f-a71a-3dd3ccb231f6
xid:
  - embedded-omnisearch
aliases:
  - embedded-omnisearch
  - Embedded-Omnisearch
  - fnsign/embedded-omnisearch
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/embedded-omnisearch
alt:
  - https://github.com/fnsign/embedded-omnisearch
downloads: 2130
updated at: "2026-07-31T12:14:43Z"
related to:
  - "[[GitHub - 1233857466]]"
remind me:
---

# Embedded-Omnisearch

Embeds an Omnisearch-powered search interface inside any note through a fenced code block, switching a note that contains such a block into read mode when needed. Term matching is accent-insensitive with inline highlights, and the highlight colour and opacity are configurable. Results are paginated at a configurable page size and rendered as a compact table of file name, relevance score and excerpt, with the full file path shown when Alt is held over a row.

```cue
plugin: {
    id:     "embedded-omnisearch"
    name:   "Embedded-Omnisearch"
    author: "Fozi"
    repo:   "fnsign/embedded-omnisearch"

    html_url:    "https://community.obsidian.md/plugins/embedded-omnisearch"
    github_url:  "https://github.com/fnsign/embedded-omnisearch"
    description: "Inline search UI powered by Omnisearch, with configurable page size, highlight color, and highlight opacity. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Embed a compact Omnisearch-powered search UI inside any note via a fenced code block and switch the note to preview mode when a search block is present. Search accent-insensitively with inline highlights, browse paginated results in a compact table showing file name, relevance and excerpt, and open matches in preview. Key Features: - Inline vault search inside any note via a fenced code block. - Automatically switches notes containing an embedded search block into read mode when needed. - Accent-insensitive term matching with configurable highlight color and opacity. - Paginated results with configurable page size. - Results rendered as a compact table with file name, relevance score, and excerpt preview. - Hold Alt over a result row to show the full file path as a popover."

    stats: {
        downloads:  2130
        updated_at: 1785500083000
    }
}
```

[^template]: [[Obsidian plugin]]
