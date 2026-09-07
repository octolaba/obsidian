---
uid: ea429166-0368-59bc-ba1f-c73830b1a89b
xid:
  - file-name-length-limit
aliases:
  - file-name-length-limit
  - File name length limit
  - dmitrievdmitriya/obsidian-file-name-length-limit
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/file-name-length-limit
alt:
  - https://github.com/dmitrievdmitriya/obsidian-file-name-length-limit
downloads: 91
updated at: "2026-07-19T19:00:41Z"
related to:
  - "[[GitHub - 766311719]]"
remind me:
---

# File name length limit

File name length limit flags filenames and paths that break the filesystem rules of Windows, Linux, Android or iOS, which is where cross-device sync tends to fail. It checks per-name length in UTF-16 and UTF-8, full path length, forbidden characters, reserved names, trailing dots and spaces, and collisions that differ only in case. Each finding reports the platforms it affects.

```cue
plugin: {
    id:     "file-name-length-limit"
    name:   "File name length limit"
    author: "Dmitrii Dmitriev"
    repo:   "dmitrievdmitriya/obsidian-file-name-length-limit"

    html_url:    "https://community.obsidian.md/plugins/file-name-length-limit"
    github_url:  "https://github.com/dmitrievdmitriya/obsidian-file-name-length-limit"
    description: "Keeps file names compatible across Windows, Linux, Android, and iOS. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Prevent sync failures by flagging filenames and paths that violate Windows, Linux, Android, or iOS filesystem rules. Check per-name length in UTF-16 and UTF-8, full path length, forbidden characters, reserved names, trailing dots/spaces, and case-only collisions, and report affected platforms."

    stats: {
        downloads:  91
        updated_at: 1784487641000
    }
}
```

[^template]: [[Obsidian plugin]]
