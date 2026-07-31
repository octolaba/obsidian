---
uid: 73b37166-655f-5311-8bfa-a165a9d440d3
xid:
  - real-pin
aliases:
  - real-pin
  - Real Pin
  - gregbrown1229/obsidian-real-pin
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/real-pin
alt:
  - https://github.com/gregbrown1229/obsidian-real-pin
downloads: 207
updated at: "2026-07-06T00:18:55Z"
related to:
  - "[[GitHub - 1278367255]]"
remind me:
---

# Real Pin

Intercepts the Close current tab command so that closing a pinned tab asks for confirmation or is blocked outright. This covers keyboard shortcuts and the command palette, so a stray close hotkey cannot lose a pinned tab; mouse-based closes are left unchanged.

```cue
plugin: {
    id:     "real-pin"
    name:   "Real Pin"
    author: "Greg Brown"
    repo:   "gregbrown1229/obsidian-real-pin"

    html_url:    "https://community.obsidian.md/plugins/real-pin"
    github_url:  "https://github.com/gregbrown1229/obsidian-real-pin"
    description: "Confirms before closing a pinned tab via any close hotkey or command, so a stray Cmd+W can't lose your pinned tab. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Intercept the Close current tab command to protect pinned tabs by prompting for confirmation or blocking the close when the active tab is pinned. Apply to keyboard shortcuts and the command palette while leaving mouse-based closes unchanged."

    stats: {
        downloads:  207
        updated_at: 1783297135000
    }
}
```

[^template]: [[Obsidian plugin]]
