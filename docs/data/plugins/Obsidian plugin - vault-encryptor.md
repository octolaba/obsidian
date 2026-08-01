---
uid: 8af0fb06-66de-5d6d-a703-77edde033013
xid:
  - vault-encryptor
aliases:
  - vault-encryptor
  - Vault Encryptor
  - curiousabe/obsidian-vault-encryptor
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/vault-encryptor
alt:
  - https://github.com/curiousabe/obsidian-vault-encryptor
downloads: 167
updated at: "2026-03-13T16:49:07Z"
related to:
  - "[[GitHub - 1180674914]]"
remind me:
---

# Vault Encryptor

Encrypts and decrypts files and folders recursively from the context menu, using AES-256-GCM with PBKDF2-SHA256. Encryption writes an .enc file and removes the original, decryption reverses that, and an existing output path causes a failure rather than an overwrite. Opening an .enc file shows a blocked placeholder view so its contents cannot be edited.

```cue
plugin: {
    id:     "vault-encryptor"
    name:   "Vault Encryptor"
    author: "curiousabe"
    repo:   "curiousabe/obsidian-vault-encryptor"

    html_url:    "https://community.obsidian.md/plugins/vault-encryptor"
    github_url:  "https://github.com/curiousabe/obsidian-vault-encryptor"
    description: "Manual right-click encryption/decryption for files and folders with blocked .enc editing. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Encrypt and decrypt files and folders recursively using AES-256-GCM with PBKDF2-SHA256, produce .enc files and remove the original after encryption (and reverse on decryption). Open .enc files in a blocked placeholder view to prevent editing and fail on existing output paths to avoid accidental overwrites."

    stats: {
        downloads:  167
        updated_at: 1773420547000
    }
}
```

[^template]: [[Obsidian plugin]]
