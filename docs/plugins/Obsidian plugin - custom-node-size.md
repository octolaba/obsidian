---
uid: 7c4f361a-a191-52f1-af15-33cae4bef210
xid:
  - custom-node-size
aliases:
  - custom-node-size
  - Custom Node Size
  - jackvonhouse/custom-node-size
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/custom-node-size
alt:
  - https://github.com/jackvonhouse/custom-node-size
downloads: 9120
updated at: "2024-09-24T17:45:41Z"
related to:
  - "[[GitHub - 861029801]]"
remind me:
---

# Custom Node Size

Sets a fixed graph node size for a note by giving it a numeric node_size file property. This overrides the link-weighted sizing of Obsidian, with a visual range of roughly 6 to 100; the recorded inputs warn that a non-numeric value leads to unexpected behavior.

```cue
plugin: {
    id:     "custom-node-size"
    name:   "Custom Node Size"
    author: "jackvonhouse"
    repo:   "jackvonhouse/custom-node-size"

    html_url:    "https://community.obsidian.md/plugins/custom-node-size"
    github_url:  "https://github.com/jackvonhouse/custom-node-size"
    description: "Customize nodes size for improved graph understanding."
    about:       "Set fixed graph node sizes by adding a numeric node_size file property to notes. Override Obsidian's link-weighted sizing so nodes display the value you choose (visual range ~6–100); keep the property numeric to avoid unexpected behavior."

    stats: {
        downloads:  9120
        updated_at: 1727199941000
    }
}
```

[^template]: [[Obsidian plugin]]
