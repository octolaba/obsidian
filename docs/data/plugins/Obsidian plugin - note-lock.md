---
uid: 11d9ba59-c545-5c6c-8692-11c62d19f0e6
xid:
  - note-lock
aliases:
  - note-lock
  - Note Lock
  - pyh1107/obsidian-note-lock
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/note-lock
alt:
  - https://github.com/pyh1107/obsidian-note-lock
downloads: 386
updated at: "2026-02-12T08:38:23Z"
related to:
  - "[[GitHub - 1152892239]]"
remind me:
---

# Note Lock

Note Lock requires a password before a protected Markdown note can be opened, storing that password as a SHA-256 hash. Notes lock again after a configurable idle time or when their tab closes, and access is tracked per session on desktop and mobile. The recorded description states that note contents stay unencrypted on disk, so the protection applies only within Obsidian's interface.

```cue
plugin: {
    id:     "note-lock"
    name:   "Note Lock"
    author: "pyh1107"
    repo:   "pyh1107/obsidian-note-lock"

    html_url:    "https://community.obsidian.md/plugins/note-lock"
    github_url:  "https://github.com/pyh1107/obsidian-note-lock"
    description: "Password-protect individual notes with per-file idle auto-lock. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Lock individual Markdown notes with a password to require verification before opening protected files. Store passwords as SHA-256 hashes, auto-lock notes after configurable idle time or on tab close, and track access per session across desktop and mobile. Keep note contents unencrypted on disk — protection applies only within Obsidian's UI."

    stats: {
        downloads:  386
        updated_at: 1770885503000
    }
}
```

[^template]: [[Obsidian plugin]]
