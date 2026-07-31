---
uid: 246f9f0a-4ad1-5800-a596-fc2269338b83
xid:
  - archive-viewer
aliases:
  - archive-viewer
  - Archive Viewer
  - viggomeesters/obsidian-archive-viewer
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/archive-viewer
alt:
  - https://github.com/viggomeesters/obsidian-archive-viewer
downloads: 144
updated at: "2026-06-08T06:54:07Z"
related to:
  - "[[GitHub - 1262621417]]"
remind me:
---

# Archive Viewer

Inspects zip archives stored in the vault without extracting them, showing a folder and file tree beside a table of central-directory metadata such as path, type, size, compressed size, modified date and compression method. Entries are filtered by path or extension and the listing refreshes after external changes. Suspicious entries are flagged, among them path traversal, absolute or hidden paths, encrypted entries, very large uncompressed sizes and odd compression ratios; the view stays read-only and caps at 2,000 entries.

```cue
plugin: {
    id:     "archive-viewer"
    name:   "Archive Viewer"
    author: "Viggo Meesters"
    repo:   "viggomeesters/obsidian-archive-viewer"

    html_url:    "https://community.obsidian.md/plugins/archive-viewer"
    github_url:  "https://github.com/viggomeesters/obsidian-archive-viewer"
    description: "Inspect .zip archive contents as read-only metadata trees with search and safety warnings. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Inspect .zip archives inside your vault without extracting files by viewing a folder/file tree and a detailed table of ZIP central-directory metadata (path, type, size, compressed size, modified date, compression method, warnings). Filter by path or extension, refresh after external changes, flag suspicious entries (path traversal, absolute/hidden paths, encrypted entries, huge uncompressed sizes, odd compression ratios), and cap listings at 2,000 entries to keep the view responsive and read-only."

    stats: {
        downloads:  144
        updated_at: 1780901647000
    }
}
```

[^template]: [[Obsidian plugin]]
