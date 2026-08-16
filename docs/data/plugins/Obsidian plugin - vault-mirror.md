---
uid: 14af00de-6ee3-5927-8418-6f30eb88170e
xid:
  - vault-mirror
aliases:
  - vault-mirror
  - Vault Mirror
  - ttsstchou/obsidian-vault-mirror
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/vault-mirror
alt:
  - https://github.com/ttsstchou/obsidian-vault-mirror
downloads: 16
updated at: "2026-08-08T11:29:13Z"
related to:
  - "[[GitHub - 1327649415]]"
remind me:
---

# Vault Mirror

Mirrors the vault open in Obsidian on macOS to another local folder, such as one inside iCloud Drive, as a deliberate one-way copy. A live change plan can be previewed first, and notes, attachments, hidden files and the .obsidian settings folder are copied. The commit is atomic with rollback and deletion safeguards; it is neither a two-way sync nor a backup tool.

```cue
plugin: {
    id:     "vault-mirror"
    name:   "Vault Mirror"
    author: "boogiemia"
    repo:   "ttsstchou/obsidian-vault-mirror"

    html_url:    "https://community.obsidian.md/plugins/vault-mirror"
    github_url:  "https://github.com/ttsstchou/obsidian-vault-mirror"
    description: "Safely mirror the current macOS Vault to a local folder, such as iCloud Drive. 安全地将当前 Vault 单向镜像到本地文件夹。 - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Mirror the vault open in Obsidian on macOS to another local folder (for example, an iCloud Drive vault) as a deliberate, one-way copy. Preview a live change plan, copy notes, attachments, hidden files and .obsidian settings, and commit atomically with rollback and deletion safeguards — not a two-way sync or backup."

    stats: {
        downloads:  16
        updated_at: 1786188553000
    }
}
```

[^template]: [[Obsidian plugin]]
