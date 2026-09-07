---
uid: fe365494-62a9-5a49-b3a9-3552f132c8a1
xid:
  - mubu-sync
aliases:
  - mubu-sync
  - Mubu Sync
  - bopan3/mubu-obsidian-sync
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/mubu-sync
alt:
  - https://github.com/bopan3/mubu-obsidian-sync
downloads: 68
updated at: "2026-07-23T01:12:02Z"
related to:
  - "[[GitHub - 1308923119]]"
remind me:
---

# Mubu Sync

Syncs Mubu documents one way into the vault, writing one Markdown file per document and preserving the Mubu folder hierarchy. Renames are tracked by document ID and hash checks limit rewriting to changed files. Sync runs at startup or periodically, and remote content stays between mubu-sync markers so local additions outside them are untouched.

```cue
plugin: {
    id:     "mubu-sync"
    name:   "Mubu Sync"
    author: "Bo Pan"
    repo:   "bopan3/mubu-obsidian-sync"

    html_url:    "https://community.obsidian.md/plugins/mubu-sync"
    github_url:  "https://github.com/bopan3/mubu-obsidian-sync"
    description: "One-way sync Mubu documents into an Obsidian vault. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Sync Mubu documents one-way into Obsidian, creating a Markdown file per document and preserving Mubu folder hierarchy. Track renames by document ID and update only changed files via hash checks; sync at startup or periodically and confine remote content between mubu-sync markers so local additions outside stay untouched."

    stats: {
        downloads:  68
        updated_at: 1784769122000
    }
}
```

[^template]: [[Obsidian plugin]]
