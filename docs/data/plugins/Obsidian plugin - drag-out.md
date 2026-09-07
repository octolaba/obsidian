---
uid: 5458ff13-bd3a-533c-9ecf-b7cc8446a31d
xid:
  - drag-out
aliases:
  - drag-out
  - Drag Out
  - xwberry/obsidian-drag-out
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/drag-out
alt:
  - https://github.com/xwberry/obsidian-drag-out
downloads: 208
updated at: "2026-04-25T07:13:50Z"
related to:
  - "[[GitHub - 1220606964]]"
remind me:
---

# Drag Out

Drags files out of the file explorer into other applications using native operating-system drag-and-drop, so the actual file on disk is transferred rather than an obsidian URI. Holding a modifier key while dragging exposes the real file path for uploads, email, chat or a file manager, and normal drag behavior returns when the modifier is not held. The project describes it as desktop-only and experimental, tested primarily on Windows.

```cue
plugin: {
    id:     "drag-out"
    name:   "Drag Out"
    author: "xwberry"
    repo:   "xwberry/obsidian-drag-out"

    html_url:    "https://community.obsidian.md/plugins/drag-out"
    github_url:  "https://github.com/xwberry/obsidian-drag-out"
    description: "Drag files from file explorer to other applications (local filesystem, browser uploads, email attachments, etc.) with native OS drag handles instead of application URIs. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Drag files from Obsidian's file explorer to other apps using native OS drag-and-drop to send the actual on-disk files instead of obsidian:// URLs. Hold a modifier key while dragging to expose real file paths for uploads, email, chat, or file managers; normal drag behavior remains when the modifier isn't held. Use on desktop; experimental and primarily tested on Windows."

    stats: {
        downloads:  208
        updated_at: 1777101230000
    }
}
```

[^template]: [[Obsidian plugin]]
