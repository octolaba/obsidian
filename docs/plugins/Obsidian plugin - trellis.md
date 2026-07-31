---
uid: 67b6e544-5928-509e-aa14-e343bfcb0fb8
xid:
  - trellis
aliases:
  - trellis
  - Trellis
  - cocapls/obsidian-trellis
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/trellis
alt:
  - https://github.com/cocapls/obsidian-trellis
downloads: 80
updated at: "2026-07-08T09:51:46Z"
related to:
  - "[[GitHub - 1282972501]]"
remind me:
---

# Trellis

Keeps a hierarchical location tag as the source of truth and syncs it into a filename prefix, rewriting names through Obsidian's link-safe rename so wikilinks stay intact. Tag renames cascade across a subtree, a collapsible sidebar tree shows the tags, and an existing vault can be bootstrapped with a dry run and an undo. Separators can be changed in batch.

```cue
plugin: {
    id:     "trellis"
    name:   "Trellis"
    author: "CocaPls"
    repo:   "cocapls/obsidian-trellis"

    html_url:    "https://community.obsidian.md/plugins/trellis"
    github_url:  "https://github.com/cocapls/obsidian-trellis"
    description: "Sync a hierarchical location tag (source of truth) into the filename prefix (tagkey). Cascade rename, sidebar tree view, vault bootstrap, and separator batch-change — all link-safe. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Sync hierarchical location tags into a filename prefix and keep the tag as the source of truth, rewriting filenames via Obsidian's link-safe rename so wikilinks remain intact. Cascade tag renames across subtrees, inspect tags in a collapsible sidebar tree, and bootstrap existing vaults with a dry-run and undo."

    stats: {
        downloads:  80
        updated_at: 1783504306000
    }
}
```

[^template]: [[Obsidian plugin]]
