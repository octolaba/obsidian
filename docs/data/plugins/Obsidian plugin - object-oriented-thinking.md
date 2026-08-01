---
uid: ea106c5d-7b04-5991-a946-eadf261e7e8f
xid:
  - object-oriented-thinking
aliases:
  - object-oriented-thinking
  - Object Oriented Thinking
  - tiagojacinto/obsidian-object-oriented-thinking
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/object-oriented-thinking
alt:
  - https://github.com/tiagojacinto/obsidian-object-oriented-thinking
downloads: 640
updated at: "2025-08-27T15:11:25Z"
related to:
  - "[[GitHub - 949934706]]"
remind me:
---

# Object Oriented Thinking

Gives notes inheritance-like behavior by pointing an extends frontmatter link at a parent note. The relationships can be queried programmatically through oot.getObjectFileByLink and oot.getObjectFileByPath, and the isDescendantOf method on the returned object filters pages in Dataview queries or custom scripts.

```cue
plugin: {
    id:     "object-oriented-thinking"
    name:   "Object Oriented Thinking"
    author: "tiagojacinto"
    repo:   "tiagojacinto/obsidian-object-oriented-thinking"

    html_url:    "https://community.obsidian.md/plugins/object-oriented-thinking"
    github_url:  "https://github.com/tiagojacinto/obsidian-object-oriented-thinking"
    description: "Add inheritance-like behavior to notes."
    about:       "Add inheritance-like behavior to notes by setting an extends frontmatter link to a parent note (e.g., extends: [[ParentNote]]). Query relationships programmatically with oot.getObjectFileByLink and oot.getObjectFileByPath, and use the returned isDescendantOf method to filter pages in Dataview or custom scripts."

    stats: {
        downloads:  640
        updated_at: 1756307485000
    }
}
```

[^template]: [[Obsidian plugin]]
