---
uid: d0db0695-0027-5ac6-abe7-6f336c971d06
xid:
  - supabase-vault-sync
aliases:
  - supabase-vault-sync
  - Supabase Vault Sync
  - dsnbyte/obsidian-supabase-sync
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/supabase-vault-sync
alt:
  - https://github.com/dsnbyte/obsidian-supabase-sync
downloads: 139
updated at: "2026-07-01T14:49:59Z"
related to:
  - "[[GitHub - 1261452089]]"
remind me:
---

# Supabase Vault Sync

Notes with their frontmatter are synced bidirectionally with Supabase Postgres, and attachments with Supabase Storage. Changes made offline are queued and sync automatically once a connection returns. Sessions are authenticated by email and password, and the recorded inputs describe strict row-level security, per-vault isolation and device tracking.

```cue
plugin: {
    id:     "supabase-vault-sync"
    name:   "Supabase Vault Sync"
    author: "DSN"
    repo:   "dsnbyte/obsidian-supabase-sync"

    html_url:    "https://community.obsidian.md/plugins/supabase-vault-sync"
    github_url:  "https://github.com/dsnbyte/obsidian-supabase-sync"
    description: "Sync your Obsidian vault notes and attachments to Supabase. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Sync your Obsidian vault bidirectionally with Supabase Postgres (notes and frontmatter) and Supabase Storage (attachments). Work offline with queued changes that sync automatically, secure sessions via email/password, enforce strict row-level security, per-vault isolation and device tracking."

    stats: {
        downloads:  139
        updated_at: 1782917399000
    }
}
```

[^template]: [[Obsidian plugin]]
