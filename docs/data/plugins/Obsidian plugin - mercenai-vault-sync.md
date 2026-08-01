---
uid: fb42f806-e7fa-5b69-9f6a-cf7d0a6f966a
xid:
  - mercenai-vault-sync
aliases:
  - mercenai-vault-sync
  - MERCENAI Vault Sync
  - xmachinesai/mercenai-vault-sync
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/mercenai-vault-sync
alt:
  - https://github.com/xmachinesai/mercenai-vault-sync
downloads: 11
updated at: "2026-07-23T03:29:52Z"
related to:
  - "[[GitHub - 1309044398]]"
remind me:
---

# MERCENAI Vault Sync

Connects the vault to a MERCENAI knowledge base and sends approved Markdown notes to it through Obsidian's Vault API. A sync runs when the dashboard connection starts and again on note create, modify, rename and delete, sending each note's vault-relative path and its Markdown content. Tokens are kept in Obsidian SecretStorage, and the recorded text states that the files themselves are left unmodified.

```cue
plugin: {
    id:     "mercenai-vault-sync"
    name:   "MERCENAI Vault Sync"
    author: "George Tasan"
    repo:   "xmachinesai/mercenai-vault-sync"

    html_url:    "https://community.obsidian.md/plugins/mercenai-vault-sync"
    github_url:  "https://github.com/xmachinesai/mercenai-vault-sync"
    description: "Synchronizes approved Markdown notes from an Obsidian vault into a MERCENAI knowledge base. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Connect your Obsidian vault to a MERCENAI knowledge base and sync Markdown notes via Obsidian's Vault API. Run sync immediately when the dashboard connection starts and on note create/modify/rename/delete, sending each note's vault-relative path and Markdown content to MERCENAI while keeping tokens in Obsidian SecretStorage and leaving files unmodified."

    stats: {
        downloads:  11
        updated_at: 1784777392000
    }
}
```

[^template]: [[Obsidian plugin]]
