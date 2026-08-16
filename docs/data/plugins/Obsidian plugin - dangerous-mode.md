---
uid: 592cce9f-a6e6-51d0-94b2-03a9866cea81
xid:
  - dangerous-mode
aliases:
  - dangerous-mode
  - Dangerous Mode
  - vanshkumar/dangerous-obsidian
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/dangerous-mode
alt:
  - https://github.com/vanshkumar/dangerous-obsidian
downloads: 360
updated at: "2025-11-26T00:42:10Z"
related to:
  - "[[GitHub - 1063637391]]"
remind me:
---

# Dangerous Mode

Starts a timed writing session that erases the active note's body when no text is inserted for five seconds, leaving YAML frontmatter in place. A red edge warning intensifies as the pause grows, and selection, copy, cut, paste, undo, redo and drag-and-drop are blocked while the session runs. The session ends by itself once the chosen duration elapses and typing has continued.

```cue
plugin: {
    id:     "dangerous-mode"
    name:   "Dangerous Mode"
    author: "vanshkumar"
    repo:   "vanshkumar/dangerous-obsidian"

    html_url:    "https://community.obsidian.md/plugins/dangerous-mode"
    github_url:  "https://github.com/vanshkumar/dangerous-obsidian"
    description: "Dangerous writing mode: keep typing or after 5 seconds of inactivity the current note is erased."
    about:       "Start a timed writing session that wipes the active note's body if you stop inserting text for 5 seconds, preserving YAML frontmatter. Show a red-edge warning that intensifies during idleness, block selection, copy/cut/paste, undo/redo and drag-drop while active, and end automatically after the chosen duration if typing continues."

    stats: {
        downloads:  360
        updated_at: 1764117730000
    }
}
```

[^template]: [[Obsidian plugin]]
