---
uid: 80e41453-190b-5f00-91aa-83863334d28b
xid:
  - my-desk-sync
aliases:
  - my-desk-sync
  - My Desk Sync
  - betheone314/my-desk-sync
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/my-desk-sync
alt:
  - https://github.com/betheone314/my-desk-sync
downloads: 21
updated at: "2026-08-07T00:52:28Z"
related to:
  - "[[GitHub - 1324933402]]"
remind me:
---

# My Desk Sync

Synchronizes My Desk notes with an Obsidian vault in both directions without a GitHub repository or personal access tokens, keeping the files as editable Markdown in the same 10_WIKI layout. A three-way merge preserves frontmatter and resolves conflicts in favor of the later edit, favoring recent local touches. Files deleted on the server are moved to trash and files deleted locally are restored from the server; a My Desk subscription is required.

```cue
plugin: {
    id:     "my-desk-sync"
    name:   "My Desk Sync"
    author: "Thinkingfanny"
    repo:   "betheone314/my-desk-sync"

    html_url:    "https://community.obsidian.md/plugins/my-desk-sync"
    github_url:  "https://github.com/betheone314/my-desk-sync"
    description: "Sync your knowledge notes between My Desk and your vault — no GitHub repo or access tokens. Requires a My Desk account with a Library subscription; the plugin itself is free. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Sync your My Desk notes with your Obsidian vault bidirectionally without GitHub or personal access tokens, keeping files as editable Markdown in the same 10_WIKI/<uuid>.md format. Merge changes with a three-way algorithm that preserves frontmatter, resolves conflicts to the later edit (favoring recent local touches), moves server-deleted files to trash, and restores locally deleted files from the server. Require a My Desk subscription."

    stats: {
        downloads:  21
        updated_at: 1786063948000
    }
}
```

[^template]: [[Obsidian plugin]]
