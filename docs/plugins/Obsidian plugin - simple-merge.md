---
uid: 7ca34b48-7a24-592d-a453-22df97160243
xid:
  - simple-merge
aliases:
  - simple-merge
  - SimpleMerge
  - mss051/obsidian-simple-merge
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/simple-merge
alt:
  - https://github.com/mss051/obsidian-simple-merge
downloads: 221
updated at: "2026-06-17T14:00:15Z"
related to:
  - "[[GitHub - 1232391196]]"
remind me:
---

# SimpleMerge

SimpleMerge merges an index note and the files it links to into a single Markdown document, converting the internal links into anchors and stripping child frontmatter while keeping the index frontmatter. Selected link blocks can be compiled, missing top-level headings injected and custom separators added. A Live Sync option keeps the merged file tied to its source notes.

```cue
plugin: {
    id:     "simple-merge"
    name:   "SimpleMerge"
    author: "mss051"
    repo:   "mss051/obsidian-simple-merge"

    html_url:    "https://community.obsidian.md/plugins/simple-merge"
    github_url:  "https://github.com/mss051/obsidian-simple-merge"
    description: "Merges linked notes into a single document, keeping them perfectly synced and formatted. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Merge an Index note and its linked files into a single, clean Markdown document, converting [[Note]] links to internal anchors and stripping child YAML while preserving the Index frontmatter. Compile selected link blocks, inject missing H1 headings, add custom separators, or enable Live Sync to keep the merged file tied to its sources."

    stats: {
        downloads:  221
        updated_at: 1781704815000
    }
}
```

[^template]: [[Obsidian plugin]]
