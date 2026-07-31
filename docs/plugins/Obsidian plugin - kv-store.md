---
uid: 549dd24e-e490-589c-af0f-d2a304a8f0e3
xid:
  - kv-store
aliases:
  - kv-store
  - KV Store
  - darren-project/obsidian-kv
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/kv-store
alt:
  - https://github.com/darren-project/obsidian-kv
downloads: 873
updated at: "2025-01-27T04:24:17Z"
related to:
  - "[[GitHub - 751255744]]"
remind me:
---

# KV Store

Adds a key-value store to the vault, backed by a JSON file. The data can be edited directly in a settings textarea, with JSON validation and saving handled automatically. The store is also reachable programmatically through kv.set, kv.get, kv.delete, kv.has, kv.keys, kv.values and kv.entries.

```cue
plugin: {
    id:     "kv-store"
    name:   "KV Store"
    author: "darren-project"
    repo:   "darren-project/obsidian-kv"

    html_url:    "https://community.obsidian.md/plugins/kv-store"
    github_url:  "https://github.com/darren-project/obsidian-kv"
    description: "Adds a key-value store. Use it to store and retrieve key-value pairs in your vault."
    about:       "Store and retrieve key-value pairs in your vault using a JSON-based store. Edit data directly in a Settings textarea with automatic JSON validation and saving. Access the store programmatically via kv.set, kv.get, kv.delete, kv.has, kv.keys, kv.values and kv.entries."

    stats: {
        downloads:  873
        updated_at: 1737951857000
    }
}
```

[^template]: [[Obsidian plugin]]
