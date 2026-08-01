---
uid: fbdf66f6-9375-5c60-ba86-ebd6e5118792
xid:
  - remove-unused-block-ids
aliases:
  - remove-unused-block-ids
  - Remove Unused Block IDs
  - isdmg/obsidian-remove-unused-block-ids
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/remove-unused-block-ids
alt:
  - https://github.com/isdmg/obsidian-remove-unused-block-ids
downloads: 500
updated at: "2024-10-09T04:29:11Z"
related to:
  - "[[GitHub - 861505468]]"
remind me:
---

# Remove Unused Block IDs

Removes unused block ids from the vault, clearing orphaned anchors and stray references. The vault is scanned and the deletion is confirmed before it happens. The recorded text advises backing the vault up first, since canvas cards and duplicate block ids may be misidentified.

```cue
plugin: {
    id:     "remove-unused-block-ids"
    name:   "Remove Unused Block IDs"
    author: "isdmg"
    repo:   "isdmg/obsidian-remove-unused-block-ids"

    html_url:    "https://community.obsidian.md/plugins/remove-unused-block-ids"
    github_url:  "https://github.com/isdmg/obsidian-remove-unused-block-ids"
    description: "Remove unused block ids in your vault."
    about:       "Remove unused block IDs from your vault to clean up orphaned anchors and stray references. Scan the vault and confirm deletion; back up your vault first, as canvas cards and duplicate block IDs may be misidentified."

    stats: {
        downloads:  500
        updated_at: 1728448151000
    }
}
```

[^template]: [[Obsidian plugin]]
