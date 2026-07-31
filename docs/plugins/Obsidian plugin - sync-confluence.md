---
uid: 767071e5-e2b6-563d-9423-9c02510e13fb
xid:
  - sync-confluence
aliases:
  - sync-confluence
  - Sync Confluence
  - dzplus/obsidian-sync-confluence
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/sync-confluence
alt:
  - https://github.com/dzplus/obsidian-sync-confluence
downloads: 216
updated at: "2026-07-24T03:54:18Z"
related to:
  - "[[GitHub - 1255842177]]"
remind me:
---

# Sync Confluence

Syncs notes to Confluence pages, binding each note to a page through a confluence_url field in its frontmatter. The note body is converted to Confluence storage format and pushed on demand or on a schedule. The recorded About text also describes uploading local attachments, pre-rendering Mermaid and PlantUML diagrams to images, creating child pages from a confluence_parent_url field, and skipping unchanged notes by content hash.

```cue
plugin: {
    id:     "sync-confluence"
    name:   "Sync Confluence"
    author: "duanzhang"
    repo:   "dzplus/obsidian-sync-confluence"

    html_url:    "https://community.obsidian.md/plugins/sync-confluence"
    github_url:  "https://github.com/dzplus/obsidian-sync-confluence"
    description: "Sync notes to Confluence pages on a schedule, bound by a confluence_url field in frontmatter. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Sync Obsidian notes to Confluence pages by adding a confluence_url in frontmatter; convert note body to Confluence storage format and push updates on demand or on a schedule. Upload local attachments, pre-render Mermaid and PlantUML diagrams to images, auto-create child pages from confluence_parent_url, and skip unchanged notes via content-hash."

    stats: {
        downloads:  216
        updated_at: 1784865258000
    }
}
```

[^template]: [[Obsidian plugin]]
