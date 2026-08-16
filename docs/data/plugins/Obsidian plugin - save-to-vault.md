---
uid: 55336e65-194d-5da5-b87a-15f7be8d770b
xid:
  - save-to-vault
aliases:
  - save-to-vault
  - Save2Vault
  - notesynchelper/save2obsidian
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/save-to-vault
alt:
  - https://github.com/notesynchelper/save2obsidian
downloads: 33
updated at: "2026-07-24T07:21:57Z"
related to:
  - "[[GitHub - 1309660618]]"
remind me:
---

# Save2Vault

Save2Vault imports posts and threads from X into the vault as Markdown notes. Mentioning @save2obsidian under a post queues it, and a sync then pulls the prepared Markdown, with Mustache templates for filename and frontmatter, deduplication through a save2obsidian_id value, optional automatic sync and preserved remote links.

```cue
plugin: {
    id:     "save-to-vault"
    name:   "Save2Vault"
    author: "save2obsidian"
    repo:   "notesynchelper/save2obsidian"

    html_url:    "https://community.obsidian.md/plugins/save-to-vault"
    github_url:  "https://github.com/notesynchelper/save2obsidian"
    description: "Save posts and threads from X into your Obsidian as clean Markdown notes. Mention @save2obsidian under any post on X. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Import posts and threads from X into your Obsidian vault as clean Markdown notes. Mention @save2obsidian on X to queue items, then sync to pull prepared Markdown with Mustache filename/frontmatter templates, deduplication via save2obsidian_id, optional automatic sync, and preserved remote links. Homepage https://www.save2obsidian.com/"

    stats: {
        downloads:  33
        updated_at: 1784877717000
    }
}
```

[^template]: [[Obsidian plugin]]
