---
uid: 52e8f96c-ff9e-5c43-816e-6a240b8838e4
xid:
  - auto-remove
aliases:
  - auto-remove
  - Auto Remove
  - bahinkor/obsidian-auto-remove-plugin
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/auto-remove
alt:
  - https://github.com/bahinkor/obsidian-auto-remove-plugin
downloads: 28
updated at: "2026-08-02T18:29:36Z"
related to:
  - "[[GitHub - 1318702573]]"
remind me:
---

# Auto Remove

Gives notes and folders an expiry date through frontmatter or folder rules, so files carry a time-to-live. A vault scan collects everything that has expired and presents it in a folder-tree dialog, then trashes or moves only what is confirmed. A file's TTL resets when the file is modified, and an explicit auto-remove value of true or false is respected.

```cue
plugin: {
    id:     "auto-remove"
    name:   "Auto Remove"
    author: "Reza Bahinkor"
    repo:   "bahinkor/obsidian-auto-remove-plugin"

    html_url:    "https://community.obsidian.md/plugins/auto-remove"
    github_url:  "https://github.com/bahinkor/obsidian-auto-remove-plugin"
    description: "Automatically expire notes and files using a time-to-live, then trash or move them after a preview. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Assign expiry dates to notes and folders via frontmatter or folder rules to control how long files should live. Scan the vault for expired files and present them in a folder-tree dialog, removing only what you confirm. Reset a file's TTL when modified and respect explicit auto-remove:true/false."

    stats: {
        downloads:  28
        updated_at: 1785695376000
    }
}
```

[^template]: [[Obsidian plugin]]
