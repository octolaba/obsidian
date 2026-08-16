---
uid: 1ec7a54e-1d69-596c-b203-bf5d2cec99e1
xid:
  - ord-updater
aliases:
  - ord-updater
  - ORDupdater
  - ordnungen/ord-updater
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/ord-updater
alt:
  - https://github.com/ordnungen/ord-updater
downloads: 37
updated at: "2026-07-27T17:40:49Z"
related to:
  - "[[GitHub - 1312398302]]"
remind me:
---

# ORDupdater

Maintains frontmatter properties on each Markdown file according to where it sits in the vault folder structure, updating them on create, modify and rename events or in one full pass from the ribbon icon, the file context menu or the command palette. It also creates and maintains folder index files named after the folder, listing subfolders and notes with their metadata and refreshing them when files are created, renamed or deleted. Excalidraw notes and hidden folders such as .obsidian and .git are skipped and existing frontmatter is respected, while an optional overwrite mode strips non-standard fields. The interface follows the Obsidian language setting in English or Russian.

```cue
plugin: {
    id:     "ord-updater"
    name:   "ORDupdater"
    author: "Ordnung"
    repo:   "ordnungen/ord-updater"

    html_url:    "https://community.obsidian.md/plugins/ord-updater"
    github_url:  "https://github.com/ordnungen/ord-updater"
    description: "Updates frontmatter properties based on folder structure. Creates folder index files. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "ORDupdater automatically manages frontmatter properties for your notes based on their location in the vault folder structure. For each markdown file, ORDupdater adds and maintains: Additionally, ORDupdater creates and maintains folder index files (FolderName.md) that list all subfolders and notes with their metadata. The index files are automatically updated when files are created, renamed, or deleted. The plugin works automatically on file create/modify/rename events. You can also trigger a full vault update from the ribbon icon, the file context menu, or the command palette. ORDupdater skips Excalidraw notes, hidden folders (.obsidian, .git), and respects your existing frontmatter. Optional overwrite mode can strip non-standard fields. Supports i18n — interface adapts to Obsidian language (English/Russian)."

    stats: {
        downloads:  37
        updated_at: 1785174049000
    }
}
```

[^template]: [[Obsidian plugin]]
