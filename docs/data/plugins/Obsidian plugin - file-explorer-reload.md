---
uid: f16abecf-69ff-59b4-a39d-64dfa9a7987f
xid:
  - file-explorer-reload
aliases:
  - file-explorer-reload
  - File Explorer Reload
  - mnaoumov/obsidian-file-explorer-reload
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/file-explorer-reload
alt:
  - https://github.com/mnaoumov/obsidian-file-explorer-reload
downloads: 5298
updated at: "2026-08-08T18:15:05Z"
related to:
  - "[[GitHub - 729922003]]"
remind me:
---

# File Explorer Reload

File Explorer Reload re-reads the file explorer pane so its listing matches the filesystem after bulk moves, copies or deletes made outside the app, without restarting Obsidian. A folder is reloaded, optionally recursively, from a command or the context menu. The same operation is available programmatically as reloadDirectory, taking a directory path and a recursion flag.

```cue
plugin: {
    id:     "file-explorer-reload"
    name:   "File Explorer Reload"
    author: "Michael Naumov"
    repo:   "mnaoumov/obsidian-file-explorer-reload"

    html_url:    "https://community.obsidian.md/plugins/file-explorer-reload"
    github_url:  "https://github.com/mnaoumov/obsidian-file-explorer-reload"
    description: "Reloads file explorer pane - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Reload the File Explorer to sync its listings with the filesystem after external bulk moves, copies, or deletes without restarting Obsidian. Use commands or context-menu options to reload a folder or reload recursively, or call reloadDirectory(directoryPath, isRecursive) programmatically."

    stats: {
        downloads:  5298
        updated_at: 1786212905000
    }
}
```

[^template]: [[Obsidian plugin]]
