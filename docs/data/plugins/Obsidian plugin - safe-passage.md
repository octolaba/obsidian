---
uid: 15962e8d-4de0-59af-b64e-4c0d679a790d
xid:
  - safe-passage
aliases:
  - safe-passage
  - SafePassage
  - search5/safe-passage
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/safe-passage
alt:
  - https://github.com/search5/safe-passage
downloads: 64
updated at: "2026-08-11T16:14:09Z"
related to:
  - "[[GitHub - 1308349911]]"
remind me:
---

# SafePassage

SafePassage integrates KeePass .kdbx databases into Obsidian, rendering masked credential chips and structured credential tables inside notes. Databases are decrypted by a WebAssembly Argon2 engine, master keys are cached in protected session memory, and masked secrets can be revealed or copied with an auto-clearing clipboard. Secrets can also be inserted into or autocompleted from the KeePass database.

```cue
plugin: {
    id:     "safe-passage"
    name:   "SafePassage"
    author: "Ji-ho Lee"
    repo:   "search5/safe-passage"

    html_url:    "https://community.obsidian.md/plugins/safe-passage"
    github_url:  "https://github.com/search5/safe-passage"
    description: "A secure, lightweight, and high-performance KeePass integration plugin for Obsidian, featuring WebAssembly Argon2 decryption, masked inline chips, and interactive credential tables. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Integrate KeePass .kdbx databases into Obsidian to render masked credential chips and structured tables directly inside notes. Decrypt databases with a WASM-based Argon2 engine, cache master keys in protected session memory, reveal or copy masked secrets with auto-clear clipboard, and insert or autocomplete secrets into your KeePass database."

    stats: {
        downloads:  64
        updated_at: 1786464849000
    }
}
```

[^template]: [[Obsidian plugin]]
