---
uid: baf27d39-8469-51bc-a52d-ae19d80f8e3b
xid:
  - voicenote-image-migrator
aliases:
  - voicenote-image-migrator
  - Voicenote Image Migrator
  - kageetai/obsidian-voicenote-image-migrator-plugin
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/voicenote-image-migrator
alt:
  - https://github.com/kageetai/obsidian-voicenote-image-migrator-plugin
downloads: 19
updated at: "2026-08-04T12:43:58Z"
related to:
  - "[[GitHub - 1322773302]]"
remind me:
---

# Voicenote Image Migrator

Moves image embeds from Voicenotes into existing daily notes by scanning each note's Attachments section, copying the referenced files into the daily note's attachments folder and inserting the original embeds after the frontmatter. Size and alias markers and inline groups are preserved, filenames are deduplicated, and copied bytes are verified before any note is edited. A dry-run and a confirmed-run command are provided, and a migration report is written into the vault.

```cue
plugin: {
    id:     "voicenote-image-migrator"
    name:   "Voicenote Image Migrator"
    author: "kageetai"
    repo:   "kageetai/obsidian-voicenote-image-migrator-plugin"

    html_url:    "https://community.obsidian.md/plugins/voicenote-image-migrator"
    github_url:  "https://github.com/kageetai/obsidian-voicenote-image-migrator-plugin"
    description: "Migrate Voicenotes image attachments into existing daily notes. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Move image embeds from Voicenotes into existing daily notes by scanning each note's ## Attachments section, copying referenced files into the daily note's attachments folder, and inserting the original embeds after the frontmatter. Preserve size/alias markers and inline groups, deduplicate filenames, verify copied bytes before editing, offer dry-run and confirmed-run commands, and write an in-vault migration report."

    stats: {
        downloads:  19
        updated_at: 1785847438000
    }
}
```

[^template]: [[Obsidian plugin]]
