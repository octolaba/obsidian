---
uid: 9f06e315-dcd0-5c62-99ea-589c4eaedd14
xid:
  - title-renamer
aliases:
  - title-renamer
  - Title renamer
  - stroiman/obsidian-title-sync
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/title-renamer
alt:
  - https://github.com/stroiman/obsidian-title-sync
downloads: 2089
updated at: "2024-03-06T09:02:52Z"
related to:
  - "[[GitHub - 766062651]]"
remind me:
---

# Title renamer

Title renamer keeps the top heading of a note synced with its file name, rewriting the first H1 when the file is renamed. The replacement happens only when that heading matches the old filename, which prevents template-generated Untitled or out-of-sync inline titles. The plugin is restricted to desktop environments.

```cue
plugin: {
    id:     "title-renamer"
    name:   "Title renamer"
    author: "stroiman"
    repo:   "stroiman/obsidian-title-sync"

    html_url:    "https://community.obsidian.md/plugins/title-renamer"
    github_url:  "https://github.com/stroiman/obsidian-title-sync"
    description: "Keep top heading in note synced with file name."
    about:       "Sync the first H1 inside a note with its file name when you rename the file. Replace only the first H1 if it matches the old filename to prevent template-generated \"Untitled\" or out-of-sync inline titles. Restrict to desktop environments."

    stats: {
        downloads:  2089
        updated_at: 1709715772000
    }
}
```

[^template]: [[Obsidian plugin]]
