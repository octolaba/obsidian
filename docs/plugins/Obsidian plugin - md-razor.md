---
uid: 6ab3c8af-48c6-575f-b1e5-913fecd34e3a
xid:
  - md-razor
aliases:
  - md-razor
  - MDRazor
  - dyse-sofqi/MDRazor
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/md-razor
alt:
  - https://github.com/dyse-sofqi/MDRazor
downloads: 643
updated at: "2026-07-23T09:54:25Z"
related to:
  - "[[GitHub - 1278228623]]"
remind me:
---

# MDRazor

Hides Markdown formatting markers for bold, italic, highlight, strikethrough and inline code, showing them again when the cursor enters the range. List markers are treated as atomic units, so cursor movement skips them and backspace removes a whole marker, while Enter inside a list item inserts a soft break with indentation instead of a new item. A list focus option expands an item's descendants and collapses unrelated content; the recorded text also names vertical tabs, directory focus, workspace auto-save and picture cleanup.

```cue
plugin: {
    id:     "md-razor"
    name:   "MDRazor"
    author: "Sofqi"
    repo:   "dyse-sofqi/MDRazor"

    html_url:    "https://community.obsidian.md/plugins/md-razor"
    github_url:  "https://github.com/dyse-sofqi/MDRazor"
    description: "Hide formatting markers, list enhancement with soft-break, dir focus, vertical tabs, auto save workspace, auto pic clean. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Format Marker Hiding Hide markers for bold, italic, ==highlight==, strikethrough, inline code (**, *, ==, ~~, `). Markers reappear when the cursor enters the range. List Integration Treats list markers (-, 1., *) as atomic units: cursor navigation skips the marker, backspace removes the entire marker at once. Editing experience closer to WYSIWYG. Enter Soft Break Pressing Enter inside a list item inserts a line break, indentation, and two trailing spaces (equivalent to native Shift+Enter behavior), without creating a new list item. Press Enter again to create a new list item — consecutive Enter presses create new items. List Focus Option When the cursor enters a list item, automatically expand all its descendants and collapse all non-directly-related content (siblings, parent siblings, etc.). Only the focus chain (itself + ancestors + descendants) stays visible. Deeply nested list navigation no longer overwhelming. Vertical tabs"

    stats: {
        downloads:  643
        updated_at: 1784800465000
    }
}
```

[^template]: [[Obsidian plugin]]
