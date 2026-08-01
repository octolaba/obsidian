---
uid: ce242191-7fcc-5ed9-8609-83987532bc4c
xid:
  - obsidian-random-todo
aliases:
  - obsidian-random-todo
  - Random To-Do
  - natiaris/obsidian-random-todo
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/obsidian-random-todo
alt:
  - https://github.com/natiaris/obsidian-random-todo
downloads: 5013
updated at: "2021-11-20T15:01:43Z"
related to:
  - "[[GitHub - 389214653]]"
remind me:
---

# Random To-Do

This plugin opens a random file containing a custom to-do marker, or jumps directly to a random marker at its position in the file. A status-bar counter shows the total number of todo items, and the randomness can be weighted per file or per item. The todo pattern itself is set with a JavaScript regular expression.

```cue
plugin: {
    id:     "obsidian-random-todo"
    name:   "Random To-Do"
    author: "natiaris"
    repo:   "natiaris/obsidian-random-todo"

    html_url:    "https://community.obsidian.md/plugins/obsidian-random-todo"
    github_url:  "https://github.com/natiaris/obsidian-random-todo"
    description: "Open a random file containing your custom to-do marker, or a random marker at its position."
    about:       "Open a random file that contains at least one todo mark, or jump directly to a random todo item at its position in the file. Display a status-bar counter of total todo items and choose file-based (files equal weight) or item-based (items equal weight) randomness. Set your todo pattern using a JavaScript regular expression to match custom marks."

    stats: {
        downloads:  5013
        updated_at: 1637420503000
    }
}
```

[^template]: [[Obsidian plugin]]
