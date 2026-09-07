---
uid: 0c280c17-867d-55e0-86fa-549d7eae0d6f
xid:
  - current-file
aliases:
  - current-file
  - Current File
  - 2shortplanks/current-file
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/current-file
alt:
  - https://github.com/2shortplanks/current-file
downloads: 412
updated at: "2024-07-20T11:43:46Z"
related to:
  - "[[GitHub - 831357571]]"
remind me:
---

# Current File

Writes the active note's file name, vault and full path into a JSON file in the home directory or a chosen directory. The JSON is updated whenever the active note changes, so external scripts and programs can tell which file the desktop app is viewing.

```cue
plugin: {
    id:     "current-file"
    name:   "Current File"
    author: "2shortplanks"
    repo:   "2shortplanks/current-file"

    html_url:    "https://community.obsidian.md/plugins/current-file"
    github_url:  "https://github.com/2shortplanks/current-file"
    description: "Allows external applications to know what file the desktop app is currently viewing."
    about:       "Write the active note's file name, vault, and full path to a JSON file in your home or a chosen directory. Update the JSON whenever you switch notes so external scripts and programs can detect and act on the current Obsidian desktop file."

    stats: {
        downloads:  412
        updated_at: 1721475826000
    }
}
```

[^template]: [[Obsidian plugin]]
