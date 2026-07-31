---
uid: a6dc8085-a3f1-5a10-8468-f39e0b54250f
xid:
  - plugin-update-locker
aliases:
  - plugin-update-locker
  - Update Locker
  - lemon695/obsidian-plugin-update-locker
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/plugin-update-locker
alt:
  - https://github.com/lemon695/obsidian-plugin-update-locker
downloads: 738
updated at: "2026-06-10T06:21:39Z"
related to:
  - "[[GitHub - 902672985]]"
remind me:
---

# Update Locker

Update Locker prevents specified plugins from updating by changing the version in their manifest so Obsidian's update checks skip them. A configuration page toggles the lock per plugin and restores the original versions when normal updates should resume.

```cue
plugin: {
    id:     "plugin-update-locker"
    name:   "Update Locker"
    author: "lemon695"
    repo:   "lemon695/obsidian-plugin-update-locker"

    html_url:    "https://community.obsidian.md/plugins/plugin-update-locker"
    github_url:  "https://github.com/lemon695/obsidian-plugin-update-locker"
    description: "Prevent specific plugins from being updated"
    about:       "Lock specified plugins to prevent automatic updates by changing their manifest.json version so Obsidian's update checks skip them. Use the configuration page to toggle lock/unlock per plugin and restore original versions for normal updates."

    stats: {
        downloads:  738
        updated_at: 1781072499000
    }
}
```

[^template]: [[Obsidian plugin]]
