---
uid: 4cf864e9-c9e1-55e2-8267-45476146bb99
xid:
  - inbox-sync
aliases:
  - inbox-sync
  - inBox Sync
  - maoruibin/obsidian-inbox-sync
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/inbox-sync
alt:
  - https://github.com/maoruibin/obsidian-inbox-sync
downloads: 227
updated at: "2026-08-08T15:10:50Z"
related to:
  - "[[GitHub - 1212340855]]"
remind me:
---

# inBox Sync

Pulls notes from the inBox app into the vault over WebDAV or S3 as a one-way, incremental sync. Images, video, audio and other attachments are included, hierarchical tags are extracted into YAML frontmatter, and the result mirrors a notes and assets folder structure. The sync interval and conflict handling are configurable.

```cue
plugin: {
    id:     "inbox-sync"
    name:   "inBox Sync"
    author: "maoruibin"
    repo:   "maoruibin/obsidian-inbox-sync"

    html_url:    "https://community.obsidian.md/plugins/inbox-sync"
    github_url:  "https://github.com/maoruibin/obsidian-inbox-sync"
    description: "Sync notes from inBox app to your vault via WebDAV/S3. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Sync inBox notes into your Obsidian vault over WebDAV or S3 with one-way, incremental updates. Include images, videos, audio and attachments, extract hierarchical tags into YAML frontmatter, and mirror a tidy notes/assets folder structure with configurable sync interval and conflict handling."

    stats: {
        downloads:  227
        updated_at: 1786201850000
    }
}
```

[^template]: [[Obsidian plugin]]
