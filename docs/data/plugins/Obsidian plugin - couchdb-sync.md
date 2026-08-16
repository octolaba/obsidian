---
uid: cc6272f2-2c42-5169-9a32-036a3a05c720
xid:
  - couchdb-sync
aliases:
  - couchdb-sync
  - CouchDB Sync
  - chrisurf/obsidian-couchdb-sync
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/couchdb-sync
alt:
  - https://github.com/chrisurf/obsidian-couchdb-sync
downloads: 36
updated at: "2026-08-08T15:13:47Z"
related to:
  - "[[GitHub - 1327877059]]"
remind me:
---

# CouchDB Sync

Replicates the vault continuously in both directions with a self-hosted CouchDB server. Note content and metadata such as file paths, sizes and timestamps are encrypted end-to-end with AES-256-GCM by default, and filenames are obfuscated using HMAC-based document IDs. Large files are streamed as content-addressed 1 MiB chunks so they are never loaded into memory whole.

```cue
plugin: {
    id:     "couchdb-sync"
    name:   "CouchDB Sync"
    author: "Chris Oguntolu"
    repo:   "chrisurf/obsidian-couchdb-sync"

    html_url:    "https://community.obsidian.md/plugins/couchdb-sync"
    github_url:  "https://github.com/chrisurf/obsidian-couchdb-sync"
    description: "Simple, reliable live synchronization of your vault with a self-hosted CouchDB server. End-to-end encrypted with AES-256-GCM: note content and metadata (file paths, sizes, timestamps). - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Sync your Obsidian vault live with a self-hosted CouchDB server via continuous two-way replication. Encrypt note content and metadata end-to-end by default, obfuscate filenames with HMAC-based IDs, and stream large files as chunked, content-addressed 1 MiB pieces to avoid loading files into memory."

    stats: {
        downloads:  36
        updated_at: 1786202027000
    }
}
```

[^template]: [[Obsidian plugin]]
