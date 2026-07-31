---
uid: cfefbd92-f3b8-5c18-89f6-808bd68ed35d
xid:
  - inline-secret-block
aliases:
  - inline-secret-block
  - Inline Secret Block
  - vnrtmnv/obsidian-inline-secret-block
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/inline-secret-block
alt:
  - https://github.com/vnrtmnv/obsidian-inline-secret-block
downloads: 131
updated at: "2026-06-22T06:44:13Z"
related to:
  - "[[GitHub - 1266154215]]"
remind me:
---

# Inline Secret Block

Inline Secret Block encrypts fenced secret blocks with AES-256-GCM and a passphrase, replacing them with opaque secret-lock blocks so passwords and tokens are not left in plaintext. In reading view those blocks appear as compact cards with Show, Edit and Copy controls, and multiple passphrases are remembered per session. Its stated purpose is keeping secrets out of sync, backups and AI agents that read the vault.

```cue
plugin: {
    id:     "inline-secret-block"
    name:   "Inline Secret Block"
    author: "Vladimir Artamonov"
    repo:   "vnrtmnv/obsidian-inline-secret-block"

    html_url:    "https://community.obsidian.md/plugins/inline-secret-block"
    github_url:  "https://github.com/vnrtmnv/obsidian-inline-secret-block"
    description: "Auto-encrypt fenced secret blocks inside notes with AES-256-GCM. Multi-key passphrase support keeps passwords and tokens safe from sync, backups, and AI agents reading the vault. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Encrypt fenced code blocks with AES-256-GCM and a passphrase, replacing them with opaque secret-lock blocks to keep passwords, tokens, and other secrets out of plaintext. Render secret-lock blocks as compact cards in reading view with Show, Edit, and Copy controls and remember multiple passphrases per session."

    stats: {
        downloads:  131
        updated_at: 1782110653000
    }
}
```

[^template]: [[Obsidian plugin]]
