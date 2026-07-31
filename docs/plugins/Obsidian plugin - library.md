---
uid: 0ac30651-cfd5-5d27-a3d2-93fcc7627a12
xid:
  - library
aliases:
  - library
  - Library
  - kigrok/obsidian-library-plugin
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/library
alt:
  - https://github.com/kigrok/obsidian-library-plugin
downloads: 708
updated at: "2026-07-13T14:20:11Z"
related to:
  - "[[GitHub - 1170018076]]"
remind me:
---

# Library

Library collects movies, series, books, anime, comics, games and music as a visual card gallery, fetching metadata from OMDb, Open Library, Google Books, RAWG, Deezer, Jikan and Comic Vine, or accepting manual entries. Each item becomes a card with cover art, metadata and progress tracking, episode and season counts are kept in sync for series, and duplicate URLs are detected. A statistics panel ranks genres, creators and items per category, while every note links to its category, genres and creators through a Related frontmatter property that feeds the graph view. Custom categories, sorting, collapsing and 31 interface languages are recorded, and search queries go only to the APIs that are enabled.

```cue
plugin: {
    id:     "library"
    name:   "Library"
    author: "kigrok"
    repo:   "kigrok/obsidian-library-plugin"

    html_url:    "https://community.obsidian.md/plugins/library"
    github_url:  "https://github.com/kigrok/obsidian-library-plugin"
    description: "Organize movies, series, books, anime, comics, games, and music into a visual card gallery inside Obsidian. Auto-fetch metadata, track progress, and graph everything. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Library transforms your Obsidian vault into a visual media gallery. Search and add titles directly in-app using OMDb for movies and series, Open Library and Google Books for books, RAWG for games, Deezer for music, Jikan for anime, and Comic Vine for comics — or add entries manually. Each item becomes a card with cover art, metadata, and progress tracking. Smart series handling keeps episode and season counts in sync. Rich note headers display all key metadata at a glance. A Statistics panel shows top genres, top creators, and top items per category with medal rankings. Duplicate detection prevents adding the same URL twice. Every note is automatically linked to its category, genres, and creators through a Related frontmatter property, building a beautiful graph view. Custom categories let you organize any type of content. Sort cards by name, year, rating, or date. Collapse categories you don't need. Fully offline — search queries are sent only to the APIs you enable. Available in 31 l"

    stats: {
        downloads:  708
        updated_at: 1783952411000
    }
}
```

[^template]: [[Obsidian plugin]]
