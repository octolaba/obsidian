---
uid: 1a912bb9-b2aa-51ce-9934-58ed7d61359c
xid:
  - folder-bases
aliases:
  - folder-bases
  - Folder Bases
  - scotttomaszewski/obsidian-folder-bases
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/folder-bases
alt:
  - https://github.com/scotttomaszewski/obsidian-folder-bases
downloads: 388
updated at: "2026-06-02T21:24:08Z"
related to:
  - "[[GitHub - 1253910671]]"
remind me:
---

# Folder Bases

Opens the base file associated with a folder by clicking that folder in the file explorer, in the way Folder Notes does for notes. The base filename is configured with folder-name and folder-path tokens, a base can be created from a template with a modifier click, and right-click options open or create one. The collapse chevron is preserved so normal folder navigation still works.

```cue
plugin: {
    id:     "folder-bases"
    name:   "Folder Bases"
    author: "Scott Tomaszewski"
    repo:   "scotttomaszewski/obsidian-folder-bases"

    html_url:    "https://community.obsidian.md/plugins/folder-bases"
    github_url:  "https://github.com/scotttomaszewski/obsidian-folder-bases"
    description: "Open a folder's associated Base by clicking it in the file explorer, like Folder Notes but for Bases. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Open a folder's associated .base file directly from the file explorer with a click. Configure base filename using {{folder_name}} and {{folder_path}} tokens, optionally create a base from a template via modifier+click, and use right-click options to open or create bases. Keep normal folder navigation intact by preserving the collapse chevron."

    stats: {
        downloads:  388
        updated_at: 1780435448000
    }
}
```

[^template]: [[Obsidian plugin]]
