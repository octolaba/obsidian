---
uid: 081ba811-85ef-51f8-99a7-d0d4021d5f8a
xid:
  - vault-sync-rest
aliases:
  - vault-sync-rest
  - "Vault Sync (REST)"
  - andrewboldi/obsidian-vault-sync
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/vault-sync-rest
alt:
  - https://github.com/andrewboldi/obsidian-vault-sync
downloads: 349
updated at: "2026-04-27T02:30:18Z"
related to:
  - "[[GitHub - 1221397927]]"
remind me:
---

# Vault Sync (REST)

Synchronizes a vault two ways with a GitHub repository through GitHub's REST API rather than the git wire protocol, producing real git commits on GitHub. The recorded inputs present this as the way to work on iOS, where git-protocol plugins are said to crash against WebView memory limits. Memory use is bounded by the largest single file, which is the stated reason vaults of any size, images included, are claimed to sync reliably.

```cue
plugin: {
    id:     "vault-sync-rest"
    name:   "Vault Sync (REST)"
    author: "andrewboldi"
    repo:   "andrewboldi/obsidian-vault-sync"

    html_url:    "https://community.obsidian.md/plugins/vault-sync-rest"
    github_url:  "https://github.com/andrewboldi/obsidian-vault-sync"
    description: "Two-way sync with a GitHub repo via REST API. Works on iOS for vaults of any size including images, where git-protocol plugins crash from WebView memory limits. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Sync your Obsidian vault to a GitHub repository via GitHub's REST API to avoid git wire-protocol failures on iOS and produce real git commits on GitHub. Keep memory use bounded by the largest single file so vaults of any size, including images, sync reliably."

    stats: {
        downloads:  349
        updated_at: 1777257018000
    }
}
```

[^template]: [[Obsidian plugin]]
