---
uid: cf8ee0f9-3bb3-5446-af8f-b19b95dc20dc
xid:
  - ling-sync
aliases:
  - ling-sync
  - Ling Sync
  - zavixai/ling-sync-obsidian
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/ling-sync
alt:
  - https://github.com/zavixai/ling-sync-obsidian
downloads: 28
updated at: "2026-07-17T13:34:32Z"
related to:
  - "[[GitHub - 1303934890]]"
remind me:
---

# Ling Sync

Syncs selected Markdown notes from the vault to Ling through a provider-neutral notes integration API, using whole-vault or folder manifests. Pairing runs through an obsidian URL scheme, credentials are kept in SecretStorage and device state in vault-local app storage, and the recorded inputs describe debounced batched updates, strict server cursors, idempotent retries, and startup reconciliation for single-writer sync. A minimum Obsidian version is recorded, and both desktop and mobile are supported.

```cue
plugin: {
    id:     "ling-sync"
    name:   "Ling Sync"
    author: "Ling"
    repo:   "zavixai/ling-sync-obsidian"

    html_url:    "https://community.obsidian.md/plugins/ling-sync"
    github_url:  "https://github.com/zavixai/ling-sync-obsidian"
    description: "Sync selected Markdown notes from Obsidian to Ling. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Sync selected Markdown notes from Obsidian to Ling via the provider‑neutral Notes Integration API with whole‑vault or folder manifests and mobile-safe operation. Pair via obsidian://ling-sync and keep credentials in SecretStorage and device state in vault-local app storage; use debounced batched updates, strict server cursors, idempotent retries and startup reconciliation for reliable single-writer sync. Require Obsidian 1.11.4+ and run on desktop and mobile."

    stats: {
        downloads:  28
        updated_at: 1784295272000
    }
}
```

[^template]: [[Obsidian plugin]]
