---
uid: 8170ed35-d0f0-5671-8b90-8dc4cc6dc9ab
xid:
  - folder-crypto
aliases:
  - folder-crypto
  - Folder Crypto
  - jasonsting622-netizen/folder-crypto
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/folder-crypto
alt:
  - https://github.com/jasonsting622-netizen/folder-crypto
downloads: 221
updated at: "2026-05-13T07:47:08Z"
related to:
  - "[[GitHub - 1230829147]]"
remind me:
---

# Folder Crypto

Locks folders and can encrypt the Markdown files inside them. Folder lock restricts access within Obsidian, marks the folder in the file explorer, prompts for a password and can hide the underlying folder in Finder. Encryption uses AES-256-GCM with a key derived by PBKDF2, passwords are never saved, and plaintext backup files can optionally be written.

```cue
plugin: {
    id:     "folder-crypto"
    name:   "Folder Crypto"
    author: "jasonsting622-netizen"
    repo:   "jasonsting622-netizen/folder-crypto"

    html_url:    "https://community.obsidian.md/plugins/folder-crypto"
    github_url:  "https://github.com/jasonsting622-netizen/folder-crypto"
    description: "Lock folders and optionally encrypt Markdown files inside selected folders. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Protect folders with two modes: folder lock locks access inside Obsidian, marks folders in the file explorer, prompts for a password, and can optionally hide the underlying folder in Finder. Encrypt folder contents with AES-256-GCM using a PBKDF2-derived key, never save passwords, and optionally write plaintext .ofc-backup files."

    stats: {
        downloads:  221
        updated_at: 1778658428000
    }
}
```

[^template]: [[Obsidian plugin]]
