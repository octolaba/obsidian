---
uid: 049f4f71-140a-50f6-a45f-bdd6aa232787
xid:
  - cloud-kms-encryption
aliases:
  - cloud-kms-encryption
  - Cloud KMS Encryption
  - viktoruj/obsidian-cloud-kms
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/cloud-kms-encryption
alt:
  - https://github.com/viktoruj/obsidian-cloud-kms
downloads: 92
updated at: "2026-05-12T21:23:03Z"
related to:
  - "[[GitHub - 1233621395]]"
remind me:
---

# Cloud KMS Encryption

Encrypts secret Markdown blocks and binary files with AWS KMS envelope encryption, so only ciphertext reaches the disk and any remote storage. Decryption happens locally in memory under the current AWS identity, which keeps reads and writes transparent inside Obsidian. Nested code fences inside a secret block are preserved.

```cue
plugin: {
    id:     "cloud-kms-encryption"
    name:   "Cloud KMS Encryption"
    author: "Viktar Mikalayeu"
    repo:   "viktoruj/obsidian-cloud-kms"

    html_url:    "https://community.obsidian.md/plugins/cloud-kms-encryption"
    github_url:  "https://github.com/viktoruj/obsidian-cloud-kms"
    description: "Transparent encryption of secret blocks and binary files using AWS KMS. Zero plaintext on disk. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Encrypt secret markdown blocks and binary files with AWS KMS envelope encryption so only ciphertext lives on disk and in remote storage. Decrypt content locally in memory using your AWS identity for transparent reads and writes in Obsidian, while preserving nested code fences inside secret blocks."

    stats: {
        downloads:  92
        updated_at: 1778620983000
    }
}
```

[^template]: [[Obsidian plugin]]
