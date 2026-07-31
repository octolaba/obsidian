---
uid: 9e812168-49c4-557a-a90b-de2e9664b88f
xid:
  - markdown2html
aliases:
  - markdown2html
  - Content Copy
  - blotspot/obsidian-markdown2html
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/markdown2html
alt:
  - https://github.com/blotspot/obsidian-markdown2html
downloads: 1165
updated at: "2026-06-12T20:03:30Z"
related to:
  - "[[GitHub - 910157634]]"
remind me:
---

# Content Copy

Content Copy copies a document to the clipboard as HTML or as plain text. Selected text or a whole document is converted through Obsidian's own renderer, all tag attributes and classes are stripped, internal images below a size limit are inlined as base64, and empty paragraphs are removed. Content contributed by other plugins is preserved in the copy.

```cue
plugin: {
    id:     "markdown2html"
    name:   "Content Copy"
    author: "blotspot"
    repo:   "blotspot/obsidian-markdown2html"

    html_url:    "https://community.obsidian.md/plugins/markdown2html"
    github_url:  "https://github.com/blotspot/obsidian-markdown2html"
    description: "Copies a document as HTML or text and saves it to the clipboard. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Copy notes as clean HTML or plain text to the clipboard. Convert selected text or whole documents to HTML using Obsidian's renderer, strip all tag attributes and classes, inline internal images as base64 (up to a certain size), remove empty paragraphs, and preserve content added by other plugins."

    stats: {
        downloads:  1165
        updated_at: 1781294610000
    }
}
```

[^template]: [[Obsidian plugin]]
