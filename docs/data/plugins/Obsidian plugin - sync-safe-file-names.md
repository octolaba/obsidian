---
uid: 4d0b8817-ad68-5945-842f-1699d75e9be4
xid:
  - sync-safe-file-names
aliases:
  - sync-safe-file-names
  - Sync-safe file names
  - j-maas/sync-safe-file-names
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/sync-safe-file-names
alt:
  - https://github.com/j-maas/sync-safe-file-names
downloads: 718
updated at: "2026-05-14T08:20:22Z"
related to:
  - "[[GitHub - 1038510595]]"
remind me:
---

# Sync-safe file names

Renames files so they use only characters that sync across platforms, replacing unsafe characters with hyphens. The recorded About text gives the example of a file named with a question mark becoming one with a hyphen, and states that newly created and renamed files are sanitized automatically. A report of unsafe filenames can be generated before changes are applied, and existing files are never overwritten.

```cue
plugin: {
    id:     "sync-safe-file-names"
    name:   "Sync-safe file names"
    author: "j-maas"
    repo:   "j-maas/sync-safe-file-names"

    html_url:    "https://community.obsidian.md/plugins/sync-safe-file-names"
    github_url:  "https://github.com/j-maas/sync-safe-file-names"
    description: "Ensures all file names can be synced accross all platforms."
    about:       "Rename files to only use sync-safe characters by replacing unsafe characters with hyphens, e.g., \"Invalid?.md\" → \"Invalid-.md\". Sanitize newly created or renamed files automatically and generate a report of unsafe filenames before applying changes; never overwrite existing files."

    stats: {
        downloads:  718
        updated_at: 1778746822000
    }
}
```

[^template]: [[Obsidian plugin]]
