---
uid: 28f6e33a-d244-53b3-933a-2bd0323ef74a
xid:
  - plugin-share-linker
aliases:
  - plugin-share-linker
  - Share Linker
  - tyronewj/Plugin-Share-Linker
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/plugin-share-linker
alt:
  - https://github.com/tyronewj/Plugin-Share-Linker
downloads: 177
updated at: "2026-06-18T04:23:22Z"
related to:
  - "[[GitHub - 1272926626]]"
remind me:
---

# Share Linker

Share Linker shares selected community plugins from the current vault with another vault, either by copying the plugin folders or by creating symbolic links back to the source. Plugins are listed and selected in bulk across paginated lists, and existing or conflicting targets are skipped rather than overwritten. It runs on Obsidian desktop, and symlink mode requires filesystem support for symbolic links.

```cue
plugin: {
    id:     "plugin-share-linker"
    name:   "Share Linker"
    author: "Sean local"
    repo:   "tyronewj/Plugin-Share-Linker"

    html_url:    "https://community.obsidian.md/plugins/plugin-share-linker"
    github_url:  "https://github.com/tyronewj/Plugin-Share-Linker"
    description: "Share selected plugins from the current vault to another Obsidian vault by creating symbolic links. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Share community plugins from the current vault to another by copying plugin folders or creating symlinks that point back to the source. List and select multiple plugins across paginated lists, skip existing or conflicting targets to avoid overwriting, and run on Obsidian desktop (symlink mode requires filesystem support for symbolic links)."

    stats: {
        downloads:  177
        updated_at: 1781756602000
    }
}
```

[^template]: [[Obsidian plugin]]
