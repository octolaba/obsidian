---
uid: 996cbd91-3e7f-5b23-b8f1-b617e1b690b3
xid:
  - copy-on-selection
aliases:
  - copy-on-selection
  - Copy on Selection
  - cofuente/obsidian-copy-selection
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/copy-on-selection
alt:
  - https://github.com/cofuente/obsidian-copy-selection
downloads: 104
updated at: "2026-04-23T18:38:38Z"
related to:
  - "[[GitHub - 1219296671]]"
remind me:
---

# Copy on Selection

Copy on Selection writes highlighted text to the clipboard automatically whenever the selection changes, mirroring X11 primary-selection behaviour on every platform. Rapid selections are debounced so the clipboard is not flooded, and both mouse and keyboard selections are supported. On iOS, clipboard restrictions may prevent selection-triggered writes.

```cue
plugin: {
    id:     "copy-on-selection"
    name:   "Copy on Selection"
    author: "cofuente"
    repo:   "cofuente/obsidian-copy-selection"

    html_url:    "https://community.obsidian.md/plugins/copy-on-selection"
    github_url:  "https://github.com/cofuente/obsidian-copy-selection"
    description: "Automatically copies highlighted text to the clipboard when the selection changes, mirroring Linux primary-selection behavior. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Copy highlighted text to the clipboard automatically whenever the selection changes, bringing X11-style primary selection to Obsidian on all platforms. Debounce rapid selections to avoid spamming the clipboard and support mouse and keyboard selection; respect iOS clipboard restrictions that may prevent selection-triggered writes."

    stats: {
        downloads:  104
        updated_at: 1776969518000
    }
}
```

[^template]: [[Obsidian plugin]]
