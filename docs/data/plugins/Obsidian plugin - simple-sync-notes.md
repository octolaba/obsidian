---
uid: 0afa8208-07d4-5109-b892-1fdb6e77aacd
xid:
  - simple-sync-notes
aliases:
  - simple-sync-notes
  - Simple Sync Notes
  - devkirkir/obsidian-simple-sync-plugin
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/simple-sync-notes
alt:
  - https://github.com/devkirkir/obsidian-simple-sync-plugin
downloads: 50
updated at: "2026-07-27T14:46:59Z"
related to:
  - "[[GitHub - 1271958004]]"
remind me:
---

# Simple Sync Notes

Simple Sync Notes syncs notes between the vault and a CouchDB database, tracking creations, edits, renames and deletions. Credentials are stored through Obsidian's secret storage, and a local record of file state is maintained. Its recorded About text asks that it be used with caution while the plugin remains in development.

```cue
plugin: {
    id:     "simple-sync-notes"
    name:   "Simple Sync Notes"
    author: "devkirkir"
    repo:   "devkirkir/obsidian-simple-sync-plugin"

    html_url:    "https://community.obsidian.md/plugins/simple-sync-notes"
    github_url:  "https://github.com/devkirkir/obsidian-simple-sync-plugin"
    description: "Syncs notes between your vault and a CouchDB. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Sync notes between your Obsidian vault and a CouchDB database, tracking creations, edits, renames, and deletions. Store CouchDB credentials securely via Obsidian's secret storage, maintain a local record of file state, and use with caution while the plugin remains in development."

    stats: {
        downloads:  50
        updated_at: 1785163619000
    }
}
```

[^template]: [[Obsidian plugin]]
