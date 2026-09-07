---
uid: 4fe017dc-98f5-5965-bdb8-c1282ad623f0
xid:
  - add-to-vault
aliases:
  - add-to-vault
  - Add To Vault
  - epicylon/add-to-vault-plugin
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/add-to-vault
alt:
  - https://github.com/epicylon/add-to-vault-plugin
downloads: 124
updated at: "2026-06-23T21:10:48Z"
related to:
  - "[[GitHub - 1275507296]]"
remind me:
---

# Add To Vault

Add To Vault pairs the vault with a self-hosted backend, sending filenames so an LLM can propose internal links and concise summaries. Generated Markdown notes, among them articles, comments and finds, are pulled back into the vault and removed from the server afterwards.

```cue
plugin: {
    id:     "add-to-vault"
    name:   "Add To Vault"
    author: "CLINCH"
    repo:   "epicylon/add-to-vault-plugin"

    html_url:    "https://community.obsidian.md/plugins/add-to-vault"
    github_url:  "https://github.com/epicylon/add-to-vault-plugin"
    description: "Companion plugin to securely sync articles, summarize content with LLMs, and provide vault context to your self-hosted backend. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Push your vault's filenames to a paired backend LLM to generate intelligent internal links and concise summaries securely. Pull generated markdown notes—articles, comments, and finds—into your vault automatically and remove them from the server to minimize retained data."

    stats: {
        downloads:  124
        updated_at: 1782249048000
    }
}
```

[^template]: [[Obsidian plugin]]
