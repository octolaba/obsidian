---
uid: db6a5f5d-f47f-5f3e-95f2-c4c41baa2191
xid:
  - secret-notes
aliases:
  - secret-notes
  - Secret Notes
  - baendlorel/obsidian-secret-notes
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/secret-notes
alt:
  - https://github.com/baendlorel/obsidian-secret-notes
downloads: 82
updated at: "2026-07-05T06:43:34Z"
related to:
  - "[[GitHub - 1284551565]]"
remind me:
---

# Secret Notes

Secret Notes encrypts the contents of fenced secret code blocks with a password, writing only ciphertext back into the file so that plaintext is never left unencrypted. Entering the correct password reveals and edits the plaintext, and a block's password can be changed or the block permanently decrypted. Encryption runs locally with AES-256-GCM, so the password never leaves the device.

```cue
plugin: {
    id:     "secret-notes"
    name:   "Secret Notes"
    author: "Kasukabe Tsumugi"
    repo:   "baendlorel/obsidian-secret-notes"

    html_url:    "https://community.obsidian.md/plugins/secret-notes"
    github_url:  "https://github.com/baendlorel/obsidian-secret-notes"
    description: "Encrypt and preview editable secret code blocks. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Encrypt sensitive content inside secret fenced code blocks (```secret) with a password, writing only ciphertext back to the file so plaintext never stays unencrypted. Reveal and edit plaintext after entering the correct password, change passwords, or permanently decrypt; encryption runs locally (AES-256-GCM) so your password never leaves your device."

    stats: {
        downloads:  82
        updated_at: 1783233814000
    }
}
```

[^template]: [[Obsidian plugin]]
