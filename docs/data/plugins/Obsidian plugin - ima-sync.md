---
uid: d641fdd7-768f-5232-ba88-143b9ef856be
xid:
  - ima-sync
aliases:
  - ima-sync
  - IMA Sync
  - cmzhangxin/obsidian-ima-sync
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/ima-sync
alt:
  - https://github.com/cmzhangxin/obsidian-ima-sync
downloads: 402
updated at: "2026-05-05T10:30:03Z"
related to:
  - "[[GitHub - 1224132096]]"
remind me:
---

# IMA Sync

IMA Sync connects the vault to Tencent IMA through its official OpenAPI, pushing Markdown notes into IMA notebooks by folder and pulling plaintext notes back into the vault. Bidirectional sync pulls and then pushes in one step, syncing runs manually, on save or on a timer, and a wizard configures which folder maps to which notebook.

```cue
plugin: {
    id:     "ima-sync"
    name:   "IMA Sync"
    author: "cmzhangxin"
    repo:   "cmzhangxin/obsidian-ima-sync"

    html_url:    "https://community.obsidian.md/plugins/ima-sync"
    github_url:  "https://github.com/cmzhangxin/obsidian-ima-sync"
    description: "Sync your notes to Tencent IMA (ima.qq.com) via the official OpenAPI. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Sync your Obsidian vault with Tencent IMA via the official OpenAPI, pushing Markdown notes into IMA notebooks by folder and pulling plaintext notes back into your vault. Run bidirectional sync to pull then push in one step, enable auto-sync on save or a timer, trigger sync manually, and configure folder-to-notebook routing with the built-in wizard."

    stats: {
        downloads:  402
        updated_at: 1777977003000
    }
}
```

[^template]: [[Obsidian plugin]]
