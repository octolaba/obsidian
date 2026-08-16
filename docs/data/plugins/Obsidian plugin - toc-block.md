---
uid: de9a7f9d-7b85-5752-a6fa-1f718d077b79
xid:
  - toc-block
aliases:
  - toc-block
  - TOC Block
  - grmartin/obsidian-toc-block-plugin
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/toc-block
alt:
  - https://github.com/grmartin/obsidian-toc-block-plugin
downloads: 92
updated at: "2026-07-18T19:57:34Z"
related to:
  - "[[GitHub - 1305159297]]"
remind me:
---

# TOC Block

The plugin turns a Typora-style TOC tag into a live table of contents built from the headings of the note it sits in. Custom tag patterns, including a code-fence marker, are recognized, and the table updates as headings change while keeping real links in Reading View. In Live Preview it can be shown as links or hidden.

```cue
plugin: {
    id:     "toc-block"
    name:   "TOC Block"
    author: "Glenn R. Martin"
    repo:   "grmartin/obsidian-toc-block-plugin"

    html_url:    "https://community.obsidian.md/plugins/toc-block"
    github_url:  "https://github.com/grmartin/obsidian-toc-block-plugin"
    description: "Type a Typora-style [TOC] tag — or your own regex patterns, even a code-fence marker — anywhere in a note to render a live table of contents built from its headings. Choose to show it as links or hide it in Live Preview. Insert it via the command palette or right-click menu, and it stays in sync as headings change, with real links in Reading View. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Insert a Typora-style [TOC] tag to render an inline table of contents built from the note’s headings. Render a live, clickable TOC in Live Preview and Reading View that updates automatically as headings change. Recognize custom tag patterns and keep the raw marker editable in source mode."

    stats: {
        downloads:  92
        updated_at: 1784404654000
    }
}
```

[^template]: [[Obsidian plugin]]
