---
uid: a7178251-b384-538e-b7a0-c9c338549bfd
xid:
  - embed-metadata
aliases:
  - embed-metadata
  - Embed Metadata
  - schemen/embed-metadata
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/embed-metadata
alt:
  - https://github.com/schemen/embed-metadata
downloads: 2345
updated at: "2026-08-02T18:58:41Z"
related to:
  - "[[GitHub - 1125239221]]"
remind me:
---

# Embed Metadata

Renders frontmatter properties inline at lightweight markers placed in the note body. Markers are replaced in reading view and live preview while source mode keeps them as written, inline code and code blocks are ignored, and a marker whose key is missing is left unchanged. Built-in keys expose file metadata such as filename, path, ctime and mtime.

```cue
plugin: {
    id:     "embed-metadata"
    name:   "Embed Metadata"
    author: "schemen"
    repo:   "schemen/embed-metadata"

    html_url:    "https://community.obsidian.md/plugins/embed-metadata"
    github_url:  "https://github.com/schemen/embed-metadata"
    description: "Render frontmatter metadata (Properties) inside your notes with a lightweight inline syntax. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Render frontmatter metadata inline using [%key] or {{key}} markers. Replace markers in reading view and live preview while preserving source mode, ignore inline code and code blocks, leave markers unchanged if keys are missing, and offer built-in file metadata keys like filename, path, ctime and mtime."

    stats: {
        downloads:  2345
        updated_at: 1785697121000
    }
}
```

[^template]: [[Obsidian plugin]]
