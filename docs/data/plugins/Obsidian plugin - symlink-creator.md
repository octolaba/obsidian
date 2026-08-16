---
uid: 902287ed-2960-5e32-9e6e-6c91965a12d8
xid:
  - symlink-creator
aliases:
  - symlink-creator
  - Symlink Creator
  - pteridin/obsidian_symlink_plugin
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/symlink-creator
alt:
  - https://github.com/pteridin/obsidian_symlink_plugin
downloads: 1535
updated at: "2024-10-31T12:24:00Z"
related to:
  - "[[GitHub - 861267951]]"
remind me:
---

# Symlink Creator

Creates symlinks and junctions for files and folders inside or outside the vault. The recorded About text states that it uses native commands on desktop, naming ln -s on macOS and Linux, mklink on Windows with administrator rights required for cross-drive symlinks, and mklink /J for junctions, and that it runs in desktop mode only. It also carries a caution that symlinks can cause data loss.

```cue
plugin: {
    id:     "symlink-creator"
    name:   "Symlink Creator"
    author: "pteridin"
    repo:   "pteridin/obsidian_symlink_plugin"

    html_url:    "https://community.obsidian.md/plugins/symlink-creator"
    github_url:  "https://github.com/pteridin/obsidian_symlink_plugin"
    description: "Create symlinks to files and folders inside and outside of your vault."
    about:       "Create symlinks and junctions for files and folders inside or outside your vault. Use OS-native commands on Desktop: ln -s on macOS/Linux, mklink (admin required for cross-drive symlinks) and mklink /J on Windows. Run only in Desktop mode and exercise caution—symlinks can cause data loss."

    stats: {
        downloads:  1535
        updated_at: 1730377440000
    }
}
```

[^template]: [[Obsidian plugin]]
