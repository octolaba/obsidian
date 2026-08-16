---
uid: 6c8ffdfc-d612-5c6c-ba7d-ee61f7b40280
xid:
  - book-exporter
aliases:
  - book-exporter
  - Book Exporter
  - dsebastien/obsidian-book-exporter
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/book-exporter
alt:
  - https://github.com/dsebastien/obsidian-book-exporter
downloads: 1124
updated at: "2026-07-29T07:43:12Z"
related to:
  - "[[GitHub - 1223549746]]"
remind me:
---

# Book Exporter

Book Exporter compiles a manuscript spread over several notes into EPUB or PDF through Pandoc, driven by a manifest note. Headings and bulleted wikilinks assemble and nest parts, chapters and scenes, linked notes are inlined where they are listed, and other content is preserved verbatim. Export runs locally on desktop only; Pandoc is required and Typst is recommended for PDF.

```cue
plugin: {
    id:     "book-exporter"
    name:   "Book Exporter"
    author: "Sébastien Dubois"
    repo:   "dsebastien/obsidian-book-exporter"

    html_url:    "https://community.obsidian.md/plugins/book-exporter"
    github_url:  "https://github.com/dsebastien/obsidian-book-exporter"
    description: "Export books (one manifest note + linked chapter notes) to EPUB and PDF via Pandoc. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Compile a multi-note manuscript from a manifest note into EPUB or PDF via Pandoc. Use headings and bulleted wikilinks to assemble and nest parts, chapters, and scenes, inline linked notes where listed, preserve other content verbatim, and export locally (desktop only); Pandoc required, Typst recommended for PDF."

    stats: {
        downloads:  1124
        updated_at: 1785310992000
    }
}
```

[^template]: [[Obsidian plugin]]
