---
uid: eef0ea45-3368-5a4a-9034-0b1c1363bcb6
xid:
  - markdown-password
aliases:
  - markdown-password
  - Markdown Password
  - hoyin258/markdown-password
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/markdown-password
alt:
  - https://github.com/hoyin258/markdown-password
downloads: 288
updated at: "2026-01-20T12:21:45Z"
related to:
  - "[[GitHub - 1135593779]]"
remind me:
---

# Markdown Password

Markdown Password keeps secrets in notes as bracketed vault placeholders that carry only an identifier, so the .md files themselves contain no secret text. Typed secrets are encrypted with AES-256-GCM and the ciphertext is stored in a local vault.json, while the master and vault keys are held only in RAM. Secrets are revealed inside Obsidian only when authorized.

```cue
plugin: {
    id:     "markdown-password"
    name:   "Markdown Password"
    author: "hoyin258"
    repo:   "hoyin258/markdown-password"

    html_url:    "https://community.obsidian.md/plugins/markdown-password"
    github_url:  "https://github.com/hoyin258/markdown-password"
    description: "Securely manage secrets in your notes using standard [|vault:id|] placeholders and local AES-256-GCM encryption. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Embed encrypted secrets directly in Markdown using [|vault:id|] placeholders, leaving only IDs in your .md files. Keep master and vault keys only in RAM while auto-encrypting typed secrets with AES-256-GCM and storing ciphertext in a local vault.json, revealing secrets in Obsidian only when authorized."

    stats: {
        downloads:  288
        updated_at: 1768911705000
    }
}
```

[^template]: [[Obsidian plugin]]
