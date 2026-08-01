---
uid: a884330c-27c7-5e76-9045-b286cb53c868
xid:
  - mysync
aliases:
  - mysync
  - MySync
  - henriquemanduca/mysync-plugin
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/mysync
alt:
  - https://github.com/henriquemanduca/mysync-plugin
downloads: 172
updated at: "2026-07-15T18:15:07Z"
related to:
  - "[[GitHub - 1231380455]]"
remind me:
---

# MySync

Syncs the vault with a CouchDB server the user runs, pushing local changes up or pulling remote state back down. A local PouchDB index tracks Markdown files, PDFs and common images. The CouchDB connection can be tested, and sync progress and the last push time appear in the status bar.

```cue
plugin: {
    id:     "mysync"
    name:   "MySync"
    author: "Henrique Manduca"
    repo:   "henriquemanduca/mysync-plugin"

    html_url:    "https://community.obsidian.md/plugins/mysync"
    github_url:  "https://github.com/henriquemanduca/mysync-plugin"
    description: "Sync notes to your home CouchDB database with MySync. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Sync your Obsidian vault with your own CouchDB server, pushing local changes or pulling remote state back into the vault. Keep a local PouchDB index, track Markdown files, PDFs and common images, test the CouchDB connection, and view sync progress and last push time in the status bar."

    stats: {
        downloads:  172
        updated_at: 1784139307000
    }
}
```

[^template]: [[Obsidian plugin]]
