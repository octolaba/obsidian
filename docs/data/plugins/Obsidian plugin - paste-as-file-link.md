---
uid: 521b03f3-62a5-5675-be59-17c3eea3a9b3
xid:
  - paste-as-file-link
aliases:
  - paste-as-file-link
  - Paste as file link
  - mbedded/obsidian-paste-file-link
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/paste-as-file-link
alt:
  - https://github.com/mbedded/obsidian-paste-file-link
downloads: 461
updated at: "2026-05-14T08:20:25Z"
related to:
  - "[[GitHub - 1015849648]]"
remind me:
---

# Paste as file link

Pastes clipboard text as a link to a note that already exists under that name in the vault, turning the selected text into the link alias. The link syntax follows the vault settings, a prompt appears when several files match, and a normal paste happens when no file is found.

```cue
plugin: {
    id:     "paste-as-file-link"
    name:   "Paste as file link"
    author: "mbedded"
    repo:   "mbedded/obsidian-paste-file-link"

    html_url:    "https://community.obsidian.md/plugins/paste-as-file-link"
    github_url:  "https://github.com/mbedded/obsidian-paste-file-link"
    description: "Paste clipboard content as file links into existing notes, when a file with this name is existing."
    about:       "Paste clipboard text as a link to a note in your vault, turning the selected text into the link alias. Choose link syntax based on vault settings and prompt to pick the correct file when multiple matches exist; fall back to a normal paste if no file is found."

    stats: {
        downloads:  461
        updated_at: 1778746825000
    }
}
```

[^template]: [[Obsidian plugin]]
