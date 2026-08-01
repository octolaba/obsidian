---
uid: 39dfd14b-3e5a-5d49-b02c-7097240b2fb0
xid:
  - obsidian-toggle-list
aliases:
  - obsidian-toggle-list
  - ToggleList
  - thingnotok/obsidian-toggle-list
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/obsidian-toggle-list
alt:
  - https://github.com/thingnotok/obsidian-toggle-list
downloads: 20362
updated at: "2024-09-08T11:09:22Z"
related to:
  - "[[GitHub - 530527097]]"
remind me:
---

# ToggleList

Obsidian's default checkbox toggle is overridden so that list items cycle through custom state groups, such as unchecked, in-progress and done, from a hotkey or command. States carry prefixes, suffixes and timestamps, and the configured groups appear in a suggestion window. The same states apply to tasks, highlights and journal entries.

```cue
plugin: {
    id:     "obsidian-toggle-list"
    name:   "ToggleList"
    author: "thingnotok"
    repo:   "thingnotok/obsidian-toggle-list"

    html_url:    "https://community.obsidian.md/plugins/obsidian-toggle-list"
    github_url:  "https://github.com/thingnotok/obsidian-toggle-list"
    description: "Toggle the checklist states (paragraph/list/checklist/custom styles)."
    about:       "Override Obsidian's default checkbox toggle and cycle list items through custom state groups (e.g., unchecked → in-progress → done) via hotkey or command. Set prefixes, suffixes and timestamps ({time:: YYYY-MM-DD}), show state groups in a suggestion window, and apply states to tasks, highlights and journal entries."

    stats: {
        downloads:  20362
        updated_at: 1725793762000
    }
}
```

[^template]: [[Obsidian plugin]]
