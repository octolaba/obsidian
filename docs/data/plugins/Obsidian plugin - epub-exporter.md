---
uid: c237bb7f-e2db-51cb-8067-35651155c242
xid:
  - epub-exporter
aliases:
  - epub-exporter
  - EPUB Exporter
  - johannes-kaindl/epub-exporter
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/epub-exporter
alt:
  - https://github.com/johannes-kaindl/epub-exporter
downloads: 132
updated at: "2026-07-24T15:54:25Z"
related to:
  - "[[GitHub - 1306506891]]"
remind me:
---

# EPUB Exporter

Exports a note as an EPUB3 file, or assembles a book from a note whose embeds form the chapter spine. The book note is the only source: its frontmatter supplies the metadata and its embeds set the chapters. A chapter title is overridden with a chapter_title field and a chapter excluded with epub_exclude.

```cue
plugin: {
    id:     "epub-exporter"
    name:   "EPUB Exporter"
    author: "Johannes Kaindl"
    repo:   "johannes-kaindl/epub-exporter"

    html_url:    "https://community.obsidian.md/plugins/epub-exporter"
    github_url:  "https://github.com/johannes-kaindl/epub-exporter"
    description: "Export a note — or a book note with embedded chapters — as an EPUB. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Export notes as EPUB3—individually or as a complete book of ordered, embedded chapters. Use a book note as the sole source of truth: Frontmatter provides metadata and embeds form the chapter spine; override chapters with `chapter_title` or exclude them with `epub_exclude`."

    stats: {
        downloads:  132
        updated_at: 1784908465000
    }
}
```

[^template]: [[Obsidian plugin]]
