---
uid: c26d9a8d-f989-584b-b5f0-efd57721baa6
xid:
  - phantom-cipher
aliases:
  - phantom-cipher
  - PhantomCipher
  - lumingtianze/obsidian-phantom-cipher
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/phantom-cipher
alt:
  - https://github.com/lumingtianze/obsidian-phantom-cipher
downloads: 146
updated at: "2026-05-19T15:51:55Z"
related to:
  - "[[GitHub - 1235309812]]"
remind me:
---

# PhantomCipher

PhantomCipher encrypts notes transparently with Argon2id and AES-GCM, so files stay encrypted on disk while they are edited normally. Data is compressed with Deflate to reduce Base64 bloat, and a session salt is used to limit the performance cost. Master passwords are stored in the system keychain.

```cue
plugin: {
    id:     "phantom-cipher"
    name:   "PhantomCipher"
    author: "Lumingtianze"
    repo:   "lumingtianze/obsidian-phantom-cipher"

    html_url:    "https://community.obsidian.md/plugins/phantom-cipher"
    github_url:  "https://github.com/lumingtianze/obsidian-phantom-cipher"
    description: "A high-performance transparent full-database encryption scheme based on Argon2id + AES-GCM. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Encrypt notes transparently using Argon2id + AES-GCM so files remain encrypted on disk while you edit them normally. Compress data with Deflate to reduce Base64 bloat, optimize performance with a session salt, and store master passwords in your system keychain."

    stats: {
        downloads:  146
        updated_at: 1779205915000
    }
}
```

[^template]: [[Obsidian plugin]]
