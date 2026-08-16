---
uid: befaed83-95e8-5dd8-b5c6-2439254174cb
xid:
  - global-markdown-encrypt
aliases:
  - global-markdown-encrypt
  - Global Markdown Encryption
  - shlemiel/globaloe
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/global-markdown-encrypt
alt:
  - https://github.com/shlemiel/globaloe
downloads: 4216
updated at: "2023-12-09T04:23:30Z"
related to:
  - "[[GitHub - 702261184]]"
remind me:
---

# Global Markdown Encryption

Encrypts Markdown files in memory with a single password, using AES-256-GCM with PBKDF2-SHA512 at one million iterations. Files carrying the .aes256 extension have their Markdown encrypted, and the recorded inputs advise setting Editing view as the default and keeping backups to avoid data loss.

```cue
plugin: {
    id:     "global-markdown-encrypt"
    name:   "Global Markdown Encryption"
    author: "shlemiel"
    repo:   "shlemiel/globaloe"

    html_url:    "https://community.obsidian.md/plugins/global-markdown-encrypt"
    github_url:  "https://github.com/shlemiel/globaloe"
    description: "In-memory AES256-GCM Markdown encryption."
    about:       "Encrypt Obsidian Markdown files in-memory with a single password using AES-256-GCM and PBKDF2-SHA512 (1,000,000 iterations). Set Editing view as default and mark files with the .aes256 extension to have their Markdown encrypted; keep backups to avoid data loss."

    stats: {
        downloads:  4216
        updated_at: 1702095810000
    }
}
```

[^template]: [[Obsidian plugin]]
