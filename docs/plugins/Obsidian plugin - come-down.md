---
uid: 1ea1f4f8-95dd-5727-873b-84016a573f55
xid:
  - come-down
aliases:
  - come-down
  - Come Down
  - mntno/obsidian-come-down
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/come-down
alt:
  - https://github.com/mntno/obsidian-come-down
downloads: 1179
updated at: "2026-04-28T18:35:08Z"
related to:
  - "[[GitHub - 942482302]]"
remind me:
---

# Come Down

Come Down downloads the external images embedded in notes and keeps them in a local cache, so they load offline or on a synced copy of the vault. The note text is left unchanged, and the cached files live in the plugin folder, where file-sync services carry them along but Git excludes them.

```cue
plugin: {
    id:     "come-down"
    name:   "Come Down"
    author: "mntno"
    repo:   "mntno/obsidian-come-down"

    html_url:    "https://community.obsidian.md/plugins/come-down"
    github_url:  "https://github.com/mntno/obsidian-come-down"
    description: "Maintains a cache of your notes’ embedded external images."
    about:       "Download external images embedded in notes and cache them locally so images load offline or on synced copies of your vault. Keep note text unchanged and store cached files in the plugin folder so they sync with file-sync services but remain excluded from Git."

    stats: {
        downloads:  1179
        updated_at: 1777401308000
    }
}
```

[^template]: [[Obsidian plugin]]
