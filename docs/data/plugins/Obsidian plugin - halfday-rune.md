---
uid: 990a8b18-7c32-5873-89d3-55f45b610ac0
xid:
  - halfday-rune
aliases:
  - halfday-rune
  - Halfday Rune
  - halfday-dev/halfday-rune
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/halfday-rune
alt:
  - https://github.com/halfday-dev/halfday-rune
downloads: 105
updated at: "2026-06-21T20:48:06Z"
related to:
  - "[[GitHub - 1214722321]]"
remind me:
---

# Halfday Rune

Encrypts vault files at rest with age X25519 keys, keeping plaintext only in editor memory so notes never remain unencrypted on disk. Files with the age extension open inline: they are decrypted in memory and shown in a CodeMirror editor with live Markdown preview, then re-encrypted on save. Multi-recipient encryption and key rotation are supported.

```cue
plugin: {
    id:     "halfday-rune"
    name:   "Halfday Rune"
    author: "Halfday.dev"
    repo:   "halfday-dev/halfday-rune"

    html_url:    "https://community.obsidian.md/plugins/halfday-rune"
    github_url:  "https://github.com/halfday-dev/halfday-rune"
    description: "Born-encrypted notes for Obsidian. age (X25519) at rest, live-preview markdown in memory. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Encrypt vault files at rest with age (X25519) keys and keep plaintext only in editor memory so notes never remain unencrypted on disk. Open .age files inline: decrypt in memory, show a CodeMirror editor with live Markdown preview, then re-encrypt on save while supporting multi-recipient encryption and key rotation."

    stats: {
        downloads:  105
        updated_at: 1782074886000
    }
}
```

[^template]: [[Obsidian plugin]]
