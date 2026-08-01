---
uid: 2ed5151f-800b-5c2f-b2aa-bed8efdd48c2
xid:
  - attachments-library
aliases:
  - attachments-library
  - Attachments Library
  - compadrejunior/attachments-library
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/attachments-library
alt:
  - https://github.com/compadrejunior/attachments-library
downloads: 182
updated at: "2026-06-28T17:45:15Z"
related to:
  - "[[GitHub - 1282385621]]"
remind me:
---

# Attachments Library

Indexes files dropped into the attachments folder by creating sidecar notes in a parallel library folder, leaving the attachments themselves unmodified. PDF metadata is extracted locally and can be enriched through CrossRef and OpenLibrary, the folder structure is mirrored, and renames and deletions are synced. A generated base file allows spreadsheet-like browsing of the library.

```cue
plugin: {
    id:     "attachments-library"
    name:   "Attachments Library"
    author: "José Compadre Junior"
    repo:   "compadrejunior/attachments-library"

    html_url:    "https://community.obsidian.md/plugins/attachments-library"
    github_url:  "https://github.com/compadrejunior/attachments-library"
    description: "Automatically indexes Attachments folder files with user-defined metadata via sidecar notes. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Index files dropped into your Attachments folder by creating sidecar notes in a parallel Library folder without modifying attachments. Extract PDF metadata locally and optionally enrich via CrossRef/OpenLibrary, mirror folder structure, sync renames/deletes, and generate an Attachments Library.base for spreadsheet-like browsing."

    stats: {
        downloads:  182
        updated_at: 1782668715000
    }
}
```

[^template]: [[Obsidian plugin]]
