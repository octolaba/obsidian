---
uid: 913fb04f-f07a-57e3-ae4e-8c62e188ec76
xid:
  - silica-bridge
aliases:
  - silica-bridge
  - Silica Bridge
  - kiycoh/obsidian-silica
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/silica-bridge
alt:
  - https://github.com/kiycoh/obsidian-silica
downloads: 32
updated at: "2026-08-04T23:53:56Z"
related to:
  - "[[GitHub - 1313025330]]"
remind me:
---

# Silica Bridge

A panel reports what the vault already knows about the open note: which notes cover the same thing, judged by stem overlap rather than backlinks, which say it twice, which orphans nobody links to overlap it, and which of its own links point at a note sharing none of its vocabulary or at nothing at all. A Next button walks the whole vault worst-first, one note per press, and says why each note came up. Search ranks by BM25 fused with a title match and gives each hit a line of context, while Autolink writes the wikilinks a note implies but never made, skipping frontmatter, code, math and headings. A Louvain graph colors the vault by community and labels each one with the stems only it carries.

```cue
plugin: {
    id:     "silica-bridge"
    name:   "Silica Bridge"
    author: "Kiycoh"
    repo:   "kiycoh/obsidian-silica"

    html_url:    "https://community.obsidian.md/plugins/silica-bridge"
    github_url:  "https://github.com/kiycoh/obsidian-silica"
    description: "Chat with the Silica knowledge-graph agent and let it read and edit your vault, over a local (loopback-only) WebSocket bridge. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "A panel tells you what your vault already knows about the note you have open: which notes are about the same thing, found by stem overlap and not by backlinks; which ones say it twice; which orphans nobody links to overlap it; which of its own links point at a note sharing none of its vocabulary; and which point at nothing at all. - A Next button walks the whole vault worst-first, one note per press, and says why each note came up. - Search ranks by BM25 fused with a title match, so the best hit is first rather than merely present, and each hit carries a line of context. - Autolink writes the wikilinks a note implies but never made, skipping frontmatter, code, math and headings. - A Louvain graph colours the vault by community and labels each one with the stems only it carries."

    stats: {
        downloads:  32
        updated_at: 1785887636000
    }
}
```

[^template]: [[Obsidian plugin]]
