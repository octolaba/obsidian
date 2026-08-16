---
uid: f5e23dee-15bb-5615-8ff5-1c697adee252
xid:
  - encrypted-folders
aliases:
  - encrypted-folders
  - Encrypted Folders
  - eng618/obsidian-encrypted-folders
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/encrypted-folders
alt:
  - https://github.com/eng618/obsidian-encrypted-folders
downloads: 678
updated at: "2026-05-24T23:26:23Z"
related to:
  - "[[GitHub - 1079557737]]"
remind me:
---

# Encrypted Folders

Encrypts whole folder trees recursively with AES-256-GCM and stores the result as locked files. While a folder is unlocked the plaintext is restored so search, graph and backlinks keep working; locking shreds the plaintext again. Access is maintained through an encrypted master key and a recovery key.

```cue
plugin: {
    id:     "encrypted-folders"
    name:   "Encrypted Folders"
    author: "eng618"
    repo:   "eng618/obsidian-encrypted-folders"

    html_url:    "https://community.obsidian.md/plugins/encrypted-folders"
    github_url:  "https://github.com/eng618/obsidian-encrypted-folders"
    description: "Encrypt and decrypt entire folders within your vault with AES-256-GCM. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Encrypt folder trees recursively and store .locked files to protect data. Restore plaintext for Search, Graph and Backlinks while unlocked, then auto-lock and securely shred plaintext; maintain access with an encrypted master key and recovery key."

    stats: {
        downloads:  678
        updated_at: 1779665183000
    }
}
```

[^template]: [[Obsidian plugin]]
