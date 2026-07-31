---
uid: 38e54016-88d2-5875-9ac1-532ff2b3ffea
xid:
  - vault-file-renamer
aliases:
  - vault-file-renamer
  - Vault File Renamer
  - louanfontenele/obsidian-vault-file-renamer
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/vault-file-renamer
alt:
  - https://github.com/louanfontenele/obsidian-vault-file-renamer
downloads: 1806
updated at: "2026-04-27T23:43:56Z"
related to:
  - "[[GitHub - 938280048]]"
remind me:
---

# Vault File Renamer

Standardizes file names to a GitHub style: lowercase, accents removed, spaces turned into dashes, and characters restricted to letters, digits, dash, underscore and dot. Folder structure and file contents are preserved. Renaming runs automatically on create and rename or as a manual sweep, and extension allow and exclude lists together with folder and file blacklists decide what is touched.

```cue
plugin: {
    id:     "vault-file-renamer"
    name:   "Vault File Renamer"
    author: "louanfontenele"
    repo:   "louanfontenele/obsidian-vault-file-renamer"

    html_url:    "https://community.obsidian.md/plugins/vault-file-renamer"
    github_url:  "https://github.com/louanfontenele/obsidian-vault-file-renamer"
    description: "Automatically standardizes file names to GitHub style (lowercase, no accents, only -, ., _) while preserving folder structure and file contents."
    about:       "Standardize vault filenames to lowercase, remove accents, convert spaces to dashes, and restrict characters to a-z, 0-9, -, _, . while preserving folder paths. Apply changes automatically on create/rename or run a manual sweep, and target or skip files using extension allow/exclude lists plus folder and file blacklists."

    stats: {
        downloads:  1806
        updated_at: 1777333436000
    }
}
```

[^template]: [[Obsidian plugin]]
