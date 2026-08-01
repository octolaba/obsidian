---
uid: 9ede9aa3-07ca-588e-9e76-61c8aa2073a7
xid:
  - tvault
aliases:
  - tvault
  - Trust Vault
  - namelesscorp/tvault-obsidian-plugin
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/tvault
alt:
  - https://github.com/namelesscorp/tvault-obsidian-plugin
downloads: 20
updated at: "2026-07-19T22:03:54Z"
related to:
  - "[[GitHub - 1303269653]]"
remind me:
---

# Trust Vault

Locks the notes of a vault into an encrypted container and unlocks them again, driven by the tvault-core command-line tool; locking removes the plaintext and unlocking restores the notes from the container. A side panel handles locking and unlocking, passphrases and Shamir token shares, and the configuration folder is left intact so settings persist. Desktop only.

```cue
plugin: {
    id:     "tvault"
    name:   "Trust Vault"
    author: "NameLess"
    repo:   "namelesscorp/tvault-obsidian-plugin"

    html_url:    "https://community.obsidian.md/plugins/tvault"
    github_url:  "https://github.com/namelesscorp/tvault-obsidian-plugin"
    description: "Lock your notes into an encrypted container and unlock them again, powered by the tvault-core CLI. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Turn your vault into a lockable safe by encrypting notes into a secure container and removing plaintext; unlock to restore notes from the container. Use the side panel to lock/unlock, manage passphrases or Shamir token shares, and keep the .obsidian folder intact so settings persist (desktop only)."

    stats: {
        downloads:  20
        updated_at: 1784498634000
    }
}
```

[^template]: [[Obsidian plugin]]
