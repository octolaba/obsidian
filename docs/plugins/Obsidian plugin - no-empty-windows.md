---
uid: 1de05ed3-f2a4-53ed-b625-1661b3d90f3d
xid:
  - no-empty-windows
aliases:
  - no-empty-windows
  - No Empty Windows
  - popscallion/obsidian-no-empty-windows
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/no-empty-windows
alt:
  - https://github.com/popscallion/obsidian-no-empty-windows
downloads: 4108
updated at: "2023-02-27T01:31:44Z"
related to:
  - "[[GitHub - 603540179]]"
remind me:
---

# No Empty Windows

No Empty Windows closes the focused tab and, when that tab is the last one, closes the window while leaving the app running in the background for a quicker relaunch. Pinned tabs are unpinned or closed depending on a toggle, and tab groups and popouts are cycled through until one tab remains in the main window.

```cue
plugin: {
    id:     "no-empty-windows"
    name:   "No Empty Windows"
    author: "popscallion"
    repo:   "popscallion/obsidian-no-empty-windows"

    html_url:    "https://community.obsidian.md/plugins/no-empty-windows"
    github_url:  "https://github.com/popscallion/obsidian-no-empty-windows"
    description: "Close the window with cmd+W on macOS when the last tab is closed."
    about:       "Close the focused tab or, when it's the last open tab, close the window while keeping the app running in the background for quicker relaunch. Respect pinned tabs by unpinning or closing them (toggleable) and cycle through tab groups and popouts until only one tab remains in the main window."

    stats: {
        downloads:  4108
        updated_at: 1677461504000
    }
}
```

[^template]: [[Obsidian plugin]]
