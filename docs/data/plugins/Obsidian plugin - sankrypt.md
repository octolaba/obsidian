---
uid: 5805c3d9-bb09-57d3-9f9d-e8b552e8d821
xid:
  - sankrypt
aliases:
  - sankrypt
  - Sankrypt
  - hgiorgis/sankryptidian
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/sankrypt
alt:
  - https://github.com/hgiorgis/sankryptidian
downloads: 132
updated at: "2026-01-20T12:36:49Z"
related to:
  - "[[GitHub - 1138212214]]"
remind me:
---

# Sankrypt

Sankrypt encrypts individual vault files with AES-256-GCM, deriving keys from a single master password with PBKDF2 and relying on the built-in Web Crypto API without external dependencies. Passwords are cleared automatically after inactivity, encrypted .skenc files are marked with a lock icon, and filename conflicts are resolved to prevent data loss.

```cue
plugin: {
    id:     "sankrypt"
    name:   "Sankrypt"
    author: "hgiorgis"
    repo:   "hgiorgis/sankryptidian"

    html_url:    "https://community.obsidian.md/plugins/sankrypt"
    github_url:  "https://github.com/hgiorgis/sankryptidian"
    description: "Professional file-level encryption with military-grade AES-256-GCM security. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Encrypt individual vault files using AES-256-GCM with a single master password and PBKDF2-derived keys. Clear passwords automatically after inactivity, display lock icons for .skenc files, and resolve filename conflicts to prevent data loss. Rely on the built-in Web Crypto API with no external dependencies."

    stats: {
        downloads:  132
        updated_at: 1768912609000
    }
}
```

[^template]: [[Obsidian plugin]]
