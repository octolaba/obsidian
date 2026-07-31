---
uid: 69085a0f-d47c-5e97-88fd-fb43392f3a53
xid:
  - file-name-history
aliases:
  - file-name-history
  - File Name History
  - davidvkimball/obsidian-file-name-history
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/file-name-history
alt:
  - https://github.com/davidvkimball/obsidian-file-name-history
downloads: 5174
updated at: "2026-05-30T19:45:52Z"
related to:
  - "[[GitHub - 1053593438]]"
remind me:
---

# File Name History

File Name History records renames of a Markdown file and of its parent folder, storing the old names in a configurable frontmatter property, aliases by default, so earlier names keep resolving. Which renames are recorded is controlled by ignore patterns, folder filters, case-sensitivity options and a list of extensions. Updates are debounced.

```cue
plugin: {
    id:     "file-name-history"
    name:   "File Name History"
    author: "David V. Kimball"
    repo:   "davidvkimball/obsidian-file-name-history"

    html_url:    "https://community.obsidian.md/plugins/file-name-history"
    github_url:  "https://github.com/davidvkimball/obsidian-file-name-history"
    description: "Store file name or folder name change history into note properties. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Track file and parent-folder renames for Markdown files and store old names in a configurable frontmatter property (default aliases) to preserve history for redirects. Apply ignore patterns, folder filters, debounced updates, case-sensitivity options, and custom extensions to control which renames get recorded."

    stats: {
        downloads:  5174
        updated_at: 1780170352000
    }
}
```

[^template]: [[Obsidian plugin]]
