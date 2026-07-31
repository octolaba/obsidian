---
uid: 57409f16-5e00-5737-b22b-509d1b8b6678
xid:
  - eccirian
aliases:
  - eccirian
  - Eccirian Encrypt
  - enthalpiex/Eccirian-Encrypt
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/eccirian
alt:
  - https://github.com/enthalpiex/Eccirian-Encrypt
downloads: 3435
updated at: "2026-07-13T03:54:05Z"
related to:
  - "[[GitHub - 967210153]]"
remind me:
---

# Eccirian Encrypt

Encrypts notes and their linked attachments at file level with AES-256-GCM or ECC P-256, which combines ECDH with AES, covering file types beyond Markdown. A file is locked either temporarily or permanently, each mode with its own extension, and locked files are shown through a read-only preview. Keys are derived with PBKDF2 or Argon2id, and all linked attachments can be encrypted in one action.

```cue
plugin: {
    id:     "eccirian"
    name:   "Eccirian Encrypt"
    author: "enthalpiex"
    repo:   "enthalpiex/Eccirian-Encrypt"

    html_url:    "https://community.obsidian.md/plugins/eccirian"
    github_url:  "https://github.com/enthalpiex/Eccirian-Encrypt"
    description: "Next-generation file encryption solution based on modern cryptography."
    about:       "Encrypt notes and linked attachments with file-level AES-256-GCM or ECC-P-256 (ECDH + AES) protection, securing common file types beyond .md. Lock files in temporary (.eccirian) or permanent (.peccirian) modes, use read-only previews for locked files, apply PBKDF2 or Argon2id key derivation, and encrypt all linked attachments with one click."

    stats: {
        downloads:  3435
        updated_at: 1783914845000
    }
}
```

[^template]: [[Obsidian plugin]]
