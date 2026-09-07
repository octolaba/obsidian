---
uid: 82b84d4d-c8f9-5d2a-b07f-a864cb161456
xid:
  - tasks-packrat-plugin
aliases:
  - tasks-packrat-plugin
  - Packrat
  - therden/packrat
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/tasks-packrat-plugin
alt:
  - https://github.com/therden/packrat
downloads: 6095
updated at: "2024-01-02T21:20:48Z"
related to:
  - "[[GitHub - 485556519]]"
remind me:
---

# Packrat

Packrat manages the completed instances that recurring tasks leave behind when they are created and completed with the Tasks plugin. Working on the active note, it deletes unwanted completions, moves retained ones to the bottom of the source note, or archives them into a separate note, according to per-task triggers. It expects Tasks-style recurring items and Dataview-format inline fields.

```cue
plugin: {
    id:     "tasks-packrat-plugin"
    name:   "Packrat"
    author: "therden"
    repo:   "therden/packrat"

    html_url:    "https://community.obsidian.md/plugins/tasks-packrat-plugin"
    github_url:  "https://github.com/therden/packrat"
    description: "Manage completed instances of recurring tasks that were created and completed using the Tasks plugin."
    about:       "Process completed recurring tasks in the active note and tidy them based on per-task triggers. Delete unwanted completions, move retained ones to the bottom of the source note, or archive them into a separate note. Work with Tasks-style recurring items and Dataview-format inline fields."

    stats: {
        downloads:  6095
        updated_at: 1704230448000
    }
}
```

[^template]: [[Obsidian plugin]]
