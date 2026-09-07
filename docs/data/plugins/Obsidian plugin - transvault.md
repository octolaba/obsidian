---
uid: ed17cbe4-d08a-5ec5-8e0b-a9e6ce53ee79
xid:
  - transvault
aliases:
  - transvault
  - Trans Vault
  - fnsign/transvault
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/transvault
alt:
  - https://github.com/fnsign/transvault
downloads: 477
updated at: "2026-07-31T12:10:36Z"
related to:
  - "[[GitHub - 1245773761]]"
remind me:
---

# Trans Vault

Trans Vault copies or moves notes, folders, attachments and reviewed direct note dependencies between local desktop vaults, with multi-selection and the folder structure preserved. Wiki and Markdown links are rewritten on transfer, conflicts resolved by skipping, auto-renaming or overwriting, transfers tagged in YAML frontmatter, and direct-link trees displayed in Obsidian style. Reading the destination vault's attachment settings needs file system access because no Obsidian API provides it, which raises a warning in the scorecard, so the attachment path may instead be entered manually.

```cue
plugin: {
    id:     "transvault"
    name:   "Trans Vault"
    author: "Fozi"
    repo:   "fnsign/transvault"

    html_url:    "https://community.obsidian.md/plugins/transvault"
    github_url:  "https://github.com/fnsign/transvault"
    description: "Copy or move notes, folders, attachments, and reviewed direct note dependencies between local desktop vaults. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Copy and move files and folders between local Obsidian vaults with multi-selection and preserved folder structure. Rewrite wiki/Markdown links on transfer, handle conflicts (skip/auto-rename/overwrite), tag transfers in YAML frontmatter, and display Obsidian-style direct-link trees. NOTE: To retrieve automatically the attachment settings of the destination vault, the plugin needs to use the file system, as currently no Obsidian provided API is available for that. Thus, you see a warning in the scorecard. Alternatively, you can enter the attachment path manually, too."

    stats: {
        downloads:  477
        updated_at: 1785499836000
    }
}
```

[^template]: [[Obsidian plugin]]
