---
uid: 1b109f77-ef3e-58e5-9f16-6a4e9d9a8d1c
xid:
  - encrypted-datasafe-notes
aliases:
  - encrypted-datasafe-notes
  - Encrypted Datasafe Notes
  - xauravww/obsidian-encrypted-datasafe-notes
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/encrypted-datasafe-notes
alt:
  - https://github.com/xauravww/obsidian-encrypted-datasafe-notes
downloads: 218
updated at: "2026-07-11T06:13:35Z"
related to:
  - "[[GitHub - 1245574145]]"
remind me:
---

# Encrypted Datasafe Notes

Encrypts Markdown files on disk with AES under a password, with the vault lock toggled from a ribbon icon and a status bar indicator. Locking happens automatically on window blur or after an idle timer, single files are encrypted or decrypted from the file explorer, and a protected folder is locked in bulk. Recovery tools scan for and repair double-encrypted files, and the password can be changed.

```cue
plugin: {
    id:     "encrypted-datasafe-notes"
    name:   "Encrypted Datasafe Notes"
    author: "xauravww"
    repo:   "xauravww/obsidian-encrypted-datasafe-notes"

    html_url:    "https://community.obsidian.md/plugins/encrypted-datasafe-notes"
    github_url:  "https://github.com/xauravww/obsidian-encrypted-datasafe-notes"
    description: "AES-encrypt markdown notes with lock/unlock vault, auto-lock timer, right-click encrypt/decrypt, corruption recovery, search decrypt, status bar indicator, file explorer decorations, and password change. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Encrypt Markdown files on disk with AES using a password and toggle vault lock from a dynamic ribbon icon or status bar indicator. Lock automatically on window blur or after idle, encrypt/decrypt single files from the file explorer or bulk-lock a protected folder, and scan or repair double-encrypted files with built-in recovery tools."

    stats: {
        downloads:  218
        updated_at: 1783750415000
    }
}
```

[^template]: [[Obsidian plugin]]
