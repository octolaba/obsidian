---
uid: 1c5a04ee-8928-58c2-a388-af2f40b152cc
xid:
  - lark-wiki-sync
aliases:
  - lark-wiki-sync
  - Lark Wiki Sync
  - fszlnwr/obsidian-lark-wiki-sync
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/lark-wiki-sync
alt:
  - https://github.com/fszlnwr/obsidian-lark-wiki-sync
downloads: 461
updated at: "2026-05-13T14:32:40Z"
related to:
  - "[[GitHub - 1219907057]]"
remind me:
---

# Lark Wiki Sync

Lark Wiki Sync mirrors one or more Lark Wiki spaces into the vault through lark-cli, reproducing the folder structure and converting Lark markup into native Markdown with GFM tables. Inline images are downloaded as local attachments, and three-way conflicts are detected and reconciled through a pre-sync plan modal. Each space is managed separately with live progress and selective pull or push, and a setup wizard covers the initial configuration.

```cue
plugin: {
    id:     "lark-wiki-sync"
    name:   "Lark Wiki Sync"
    author: "Faiszal Anwar"
    repo:   "fszlnwr/obsidian-lark-wiki-sync"

    html_url:    "https://community.obsidian.md/plugins/lark-wiki-sync"
    github_url:  "https://github.com/fszlnwr/obsidian-lark-wiki-sync"
    description: "Two-way sync between your Obsidian vault and a Lark Wiki space. Uses lark-cli under the hood. Includes setup wizard, one-click sync, and three-way conflict resolution. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Sync one or more Lark Wiki spaces into your Obsidian vault via lark-cli, mirroring folders and converting Lark markup to native Markdown with GFM tables. Download inline images to local attachments, detect and reconcile three-way conflicts with a pre-sync plan modal, and manage per-space syncs with live progress and selective pull/push."

    stats: {
        downloads:  461
        updated_at: 1778682760000
    }
}
```

[^template]: [[Obsidian plugin]]
