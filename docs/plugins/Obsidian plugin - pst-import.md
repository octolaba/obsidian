---
uid: 4d76d468-2c47-5828-a0be-030e07d76fb3
xid:
  - pst-import
aliases:
  - pst-import
  - PST Import
  - wenciara/obsidian-pst-importer
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/pst-import
alt:
  - https://github.com/wenciara/obsidian-pst-importer
downloads: 171
updated at: "2026-06-29T00:36:50Z"
related to:
  - "[[GitHub - 1262640887]]"
remind me:
---

# PST Import

Imports Outlook PST email archives as Markdown files, preserving the folder hierarchy and writing full email metadata into YAML frontmatter. Embedded images are converted to Obsidian embed wikilinks and attachments are stored in attachments subfolders. It runs entirely in JavaScript with no Outlook or external executables, and the recorded description states that PST files of any size, including Unicode files above 2GB, are supported.

```cue
plugin: {
    id:     "pst-import"
    name:   "PST Import"
    author: "wenjunzhu"
    repo:   "wenciara/obsidian-pst-importer"

    html_url:    "https://community.obsidian.md/plugins/pst-import"
    github_url:  "https://github.com/wenciara/obsidian-pst-importer"
    description: "Import Outlook PST email archives as Markdown files with metadata, attachments, and Obsidian wikilinks. Supports PST files of any size (including >2GB Unicode PST) via pure JavaScript. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Import Outlook PST archives into Obsidian as Markdown files, preserving folder hierarchy and adding full email metadata in YAML frontmatter. Convert embedded images to Obsidian ![[wikilink]] format, store attachments in attachments/ subfolders, and run entirely in JavaScript with no Outlook or external executables."

    stats: {
        downloads:  171
        updated_at: 1782693410000
    }
}
```

[^template]: [[Obsidian plugin]]
