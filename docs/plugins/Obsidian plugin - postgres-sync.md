---
uid: af25027c-9531-5264-a5fe-d90e760b6128
xid:
  - postgres-sync
aliases:
  - postgres-sync
  - Postgres Sync
  - lanjak/obsidian-postgres-sync
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/postgres-sync
alt:
  - https://github.com/lanjak/obsidian-postgres-sync
downloads:
updated at:
related to:
  - "[[GitHub - 1311640199]]"
remind me:
---

# Postgres Sync

Syncs the vault across devices through a self-hosted Postgres database reached via PostgREST, instead of Obsidian Sync or CouchDB. Every note is also embedded into a vector column, so the same table doubles as a semantic search index that can be queried outside Obsidian, including from agent tooling. It works on desktop and mobile over HTTP or HTTPS.

```cue
plugin: {
    id:     "postgres-sync"
    name:   "Postgres Sync"
    author: "lanjak"
    repo:   "lanjak/obsidian-postgres-sync"

    html_url:    "https://community.obsidian.md/plugins/postgres-sync"
    github_url:  "https://github.com/lanjak/obsidian-postgres-sync"
    description: "Syncs this vault to a self-hosted Postgres database (via PostgREST) instead of Sync or CouchDB - every note is embedded for semantic search from agent tooling too. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Sync your Obsidian vault across devices through a self-hosted Postgres database accessed via PostgREST. Embed each note into a vector column so the same table doubles as a semantic search index you can query outside Obsidian. Work on desktop and mobile over HTTP(S)."
}
```

[^template]: [[Obsidian plugin]]
