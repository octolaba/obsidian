---
uid: dfee1f47-7399-5472-8725-f6aaf9191581
xid:
  - relation-sync
aliases:
  - relation-sync
  - Relation Sync
  - casungo/relation-sync-plugin
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/relation-sync
alt:
  - https://github.com/casungo/relation-sync-plugin
downloads: 338
updated at: "2026-05-20T19:21:49Z"
related to:
  - "[[GitHub - 1205368851]]"
remind me:
---

# Relation Sync

Keeps inverse relations in frontmatter in sync automatically: when a link is added, changed, or removed, the matching field on the other note is updated. Relation pairs such as parent and child or spouse can be defined, or chosen from more than fifty defaults, and both single-value and multi-value fields are handled. A bulk sync updates the whole vault at once.

```cue
plugin: {
    id:     "relation-sync"
    name:   "Relation Sync"
    author: "Alessandro Casnigo"
    repo:   "casungo/relation-sync-plugin"

    html_url:    "https://community.obsidian.md/plugins/relation-sync"
    github_url:  "https://github.com/casungo/relation-sync-plugin"
    description: "Automatically syncs inverse relations in frontmatter. Define relation pairs like parent-child or spouse and the plugin keeps both sides in sync. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Sync bidirectional YAML frontmatter relations automatically across your vault, updating inverse links when you add, change, or remove links. Define custom relation pairs or choose from 50+ defaults, handle single or multi-value fields, and run a bulk sync to update the whole vault."

    stats: {
        downloads:  338
        updated_at: 1779304909000
    }
}
```

[^template]: [[Obsidian plugin]]
