---
uid: b2b9e1c5-877f-52e8-a8d6-39d338009a37
xid:
  - random-list
aliases:
  - random-list
  - Random List Pick
  - keymasterr/obsidian-random-list
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/random-list
alt:
  - https://github.com/keymasterr/obsidian-random-list
downloads: 126
updated at: "2026-06-19T22:04:18Z"
related to:
  - "[[GitHub - 1273280328]]"
remind me:
---

# Random List Pick

Turns an inline rnd marker in a note into a button that picks a random item from the list below it. The modal that opens selects a random entry without repeating the current pick and respects heading boundaries. Checkbox items are marked done or undone, and checked items are optionally included in the pool.

```cue
plugin: {
    id:     "random-list"
    name:   "Random List Pick"
    author: "Roman Kliuchkovych"
    repo:   "keymasterr/obsidian-random-list"

    html_url:    "https://community.obsidian.md/plugins/random-list"
    github_url:  "https://github.com/keymasterr/obsidian-random-list"
    description: "Insert {{rnd}} in a note to get a button that picks a random item from the list below it. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Insert an inline {{rnd}} button in any note to pick a random item from the list in scope. Click to open a modal that selects a random entry (won't repeat the current pick), respects heading boundaries, and lets you mark checkbox items done/undone or include checked items in the pool."

    stats: {
        downloads:  126
        updated_at: 1781906658000
    }
}
```

[^template]: [[Obsidian plugin]]
