---
uid: 3b03ed65-a3ac-5d26-b6eb-e60ab5b2e390
xid:
  - note-bundler
aliases:
  - note-bundler
  - Note Bundler
  - jrockwar/note-bundler
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/note-bundler
alt:
  - https://github.com/jrockwar/note-bundler
downloads: 206
updated at: "2026-02-16T15:45:24Z"
related to:
  - "[[GitHub - 1146814955]]"
remind me:
---

# Note Bundler

Note Bundler exports a filtered set of notes into a single consolidated Markdown file, intended for LLM context, documentation or curated collections. Which notes are included is decided by tag- and directory-based include and exclude filters that accept regular expressions and combine with AND/OR logic. Exports run manually or on a schedule by minute, hour or day, writing to vault-relative or desktop absolute paths with device-specific configuration.

```cue
plugin: {
    id:     "note-bundler"
    name:   "Note Bundler"
    author: "jrockwar"
    repo:   "jrockwar/note-bundler"

    html_url:    "https://community.obsidian.md/plugins/note-bundler"
    github_url:  "https://github.com/jrockwar/note-bundler"
    description: "Export bundles of notes into a single markdown file. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Export filtered Obsidian notes into consolidated Markdown bundles for LLM context, documentation, or curated collections. Create tag- and directory-based include/exclude filters with regex and combine rules using AND/OR logic. Schedule manual or automatic exports (minute/hour/day) with vault-relative or desktop absolute output paths and device-specific configs."

    stats: {
        downloads:  206
        updated_at: 1771256724000
    }
}
```

[^template]: [[Obsidian plugin]]
