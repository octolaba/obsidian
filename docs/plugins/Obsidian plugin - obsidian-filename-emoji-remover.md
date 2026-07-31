---
uid: 97b76544-f8d8-5fa9-8a29-b8b1e1297354
xid:
  - obsidian-filename-emoji-remover
aliases:
  - obsidian-filename-emoji-remover
  - Filename Emoji Remover
  - ytolun/obsidian-filename-emoji-remover
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/obsidian-filename-emoji-remover
alt:
  - https://github.com/ytolun/obsidian-filename-emoji-remover
downloads: 4282
updated at: "2022-05-01T15:26:55Z"
related to:
  - "[[GitHub - 486118648]]"
remind me:
---

# Filename Emoji Remover

Removes emojis from filenames across the vault and strips them automatically when notes are created or renamed. Existing files are scanned and cleaned in batch, and a safe random name is generated when removal would otherwise leave a filename empty. Its recorded purpose is avoiding Dropbox sync issues with Readwise imported content.

```cue
plugin: {
    id:     "obsidian-filename-emoji-remover"
    name:   "Filename Emoji Remover"
    author: "ytolun"
    repo:   "ytolun/obsidian-filename-emoji-remover"

    html_url:    "https://community.obsidian.md/plugins/obsidian-filename-emoji-remover"
    github_url:  "https://github.com/ytolun/obsidian-filename-emoji-remover"
    description: "Automatically remove emojis from filenames. Main purpose is to get rid of Dropbox sync issues for Readwise imported content."
    about:       "Remove emojis from filenames across your vault and auto-strip emojis when notes are created or renamed. Scan and batch-clean existing files, and generate a safe random name if emoji removal would leave a filename empty."

    stats: {
        downloads:  4282
        updated_at: 1651418815000
    }
}
```

[^template]: [[Obsidian plugin]]
