---
uid: 5de6e3a5-1dfb-5403-8755-a38738f7495c
xid:
  - lockblock
aliases:
  - lockblock
  - Lockblock
  - joshua-walls/lockblock
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/lockblock
alt:
  - https://github.com/joshua-walls/lockblock
downloads: 156
updated at: "2026-07-20T20:14:15Z"
related to:
  - "[[GitHub - 1273428440]]"
remind me:
---

# Lockblock

Keeps sensitive sections of a note encrypted until they are revealed. Fenced lockblock code blocks are encrypted with a random vault key whose wrapped key material is kept in secretStorage, and sealed blocks render as locked cards in reading view where plaintext is revealed or copied on demand without being written back into the note. Sealed ciphertext cannot be edited while the vault is locked, and editing is allowed only when it is unlocked.

```cue
plugin: {
    id:     "lockblock"
    name:   "Lockblock"
    author: "Joshua Walls"
    repo:   "joshua-walls/lockblock"

    html_url:    "https://community.obsidian.md/plugins/lockblock"
    github_url:  "https://github.com/joshua-walls/lockblock"
    description: "Keep sensitive Obsidian note sections encrypted until you choose to reveal them. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Encrypt fenced lockblock code blocks with a random vault key and store wrapped key material in secretStorage. Render sealed blocks as locked cards in reading view and reveal or copy plaintext on demand without writing it back to the note. Prevent edits to sealed ciphertext while the vault is locked and allow editing only when unlocked."

    stats: {
        downloads:  156
        updated_at: 1784578455000
    }
}
```

[^template]: [[Obsidian plugin]]
