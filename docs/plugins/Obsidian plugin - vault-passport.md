---
uid: 71c63974-f7a0-5a88-bb7e-5c9d57be3b69
xid:
  - vault-passport
aliases:
  - vault-passport
  - Vault Passport
  - one-wheeled-driver/obsidian-passport
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/vault-passport
alt:
  - https://github.com/one-wheeled-driver/obsidian-passport
downloads: 155
updated at: "2026-05-12T20:39:14Z"
related to:
  - "[[GitHub - 1213596366]]"
remind me:
---

# Vault Passport

Exports notes to self-contained PDFs by resolving vault-internal links into Pandoc citations and generating a BibTeX bibliography. Linked notes and transclusions become citation entries, rendering goes through Pandoc and citeproc, and embedded files are included. A missing link is replaced with readable text so the exported document stands on its own without the vault.

```cue
plugin: {
    id:     "vault-passport"
    name:   "Vault Passport"
    author: "Dominik Lorenz"
    repo:   "one-wheeled-driver/obsidian-passport"

    html_url:    "https://community.obsidian.md/plugins/vault-passport"
    github_url:  "https://github.com/one-wheeled-driver/obsidian-passport"
    description: "Give your notes a passport to the outside world. Exports documents to polished PDFs, resolving [[wiki-links]] into proper citations so they stand alone without the vault. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Export Obsidian notes to self-contained PDFs by resolving [[wiki-links]] into proper Pandoc citations and generating a BibTeX bibliography. Convert linked notes and transclusions into citation entries, render with Pandoc/citeproc, include embedded files, and replace missing links with readable text so the PDF can be shared without the vault."

    stats: {
        downloads:  155
        updated_at: 1778618354000
    }
}
```

[^template]: [[Obsidian plugin]]
