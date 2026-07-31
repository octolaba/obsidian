---
uid: 0da102fb-b6bf-577e-aa54-c374622dbb89
xid:
  - view-mode-rules
aliases:
  - view-mode-rules
  - View Mode Rules
  - jochenbernard/obsidian-view-mode-rules
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/view-mode-rules
alt:
  - https://github.com/jochenbernard/obsidian-view-mode-rules
downloads: 157
updated at: "2026-04-24T08:55:25Z"
related to:
  - "[[GitHub - 1217056190]]"
remind me:
---

# View Mode Rules

View Mode Rules sets a default Editing or Reading view per note or folder from the file explorer, without using frontmatter. Folder rules apply to everything they contain and the deepest folder wins, with a global default as fallback. Rules survive renames and moves and are reapplied on navigation or workspace restore.

```cue
plugin: {
    id:     "view-mode-rules"
    name:   "View Mode Rules"
    author: "jochenbernard"
    repo:   "jochenbernard/obsidian-view-mode-rules"

    html_url:    "https://community.obsidian.md/plugins/view-mode-rules"
    github_url:  "https://github.com/jochenbernard/obsidian-view-mode-rules"
    description: "Set a default view (editing or reading) per note or folder, without using frontmatter. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Set a default view (Editing or Reading) for any note or folder from the file explorer without using frontmatter; folder rules apply to all contained notes, with the deepest folder winning. Use a global default as fallback and persist rules across renames and moves. Reapply rules automatically on navigation or workspace restore."

    stats: {
        downloads:  157
        updated_at: 1777020925000
    }
}
```

[^template]: [[Obsidian plugin]]
