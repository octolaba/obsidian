---
uid: b47a931c-ae9c-5a38-b70f-0034bd02d713
xid:
  - diffzip
aliases:
  - diffzip
  - Differential ZIP Backup
  - vrtmrz/diffzip
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/diffzip
alt:
  - https://github.com/vrtmrz/diffzip
downloads: 12928
updated at: "2026-07-15T07:04:51Z"
related to:
  - "[[GitHub - 736483110]]"
remind me:
---

# Differential ZIP Backup

Creates differential ZIP backups of modified vault files and writes a backupinfo.md manifest describing them. Backups can run automatically at launch, and archives can be stored inside the vault, in a desktop folder or on S3, with large archives split. Individual files can be restored from a chosen backup, and a lightweight synchronisation mode is also available.

```cue
plugin: {
    id:     "diffzip"
    name:   "Differential ZIP Backup"
    author: "vrtmrz"
    repo:   "vrtmrz/diffzip"

    html_url:    "https://community.obsidian.md/plugins/diffzip"
    github_url:  "https://github.com/vrtmrz/diffzip"
    description: "Back our vault up with lesser storage."
    about:       "Create differential ZIP backups of modified vault files and generate a backupinfo.md manifest. Trigger automatic backups on launch, store archives inside the vault, on desktop folders or S3, split large archives, and restore individual files from chosen backups. Lightweight synchronisation is also available."

    stats: {
        downloads:  12928
        updated_at: 1784099091000
    }
}
```

[^template]: [[Obsidian plugin]]
