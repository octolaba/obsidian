---
uid: ad88fa8b-b43b-5149-9df0-736b6c839da1
xid:
  - secret-placeholders
aliases:
  - secret-placeholders
  - Secret Placeholders
  - lai2301/obsidian-secret-placeholders
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/secret-placeholders
alt:
  - https://github.com/lai2301/obsidian-secret-placeholders
downloads: 255
updated at: "2026-07-07T05:42:03Z"
related to:
  - "[[GitHub - 1244507386]]"
remind me:
---

# Secret Placeholders

Secret Placeholders keeps credentials out of Markdown files by embedding placeholders that reference a password manager and resolving them to live values only inside Obsidian. Because the file holds only the placeholder, the secret never appears on disk, in git history or in backups. OpenBao and HashiCorp Vault, 1Password Connect, and Bitwarden and Vaultwarden are supported.

```cue
plugin: {
    id:     "secret-placeholders"
    name:   "Secret Placeholders"
    author: "Liam"
    repo:   "lai2301/obsidian-secret-placeholders"

    html_url:    "https://community.obsidian.md/plugins/secret-placeholders"
    github_url:  "https://github.com/lai2301/obsidian-secret-placeholders"
    description: "Embed password-manager secrets in notes as placeholders so the .md never contains the actual credential. Supports OpenBao/Vault, 1Password Connect, and Bitwarden/Vaultwarden. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Reference secrets from your password manager using inline placeholders and display live values only inside Obsidian. Keep only placeholders in Markdown files so secrets never appear on disk, in git history, or backups; supports OpenBao/HashiCorp Vault, 1Password Connect, and Bitwarden/Vaultwarden."

    stats: {
        downloads:  255
        updated_at: 1783402923000
    }
}
```

[^template]: [[Obsidian plugin]]
