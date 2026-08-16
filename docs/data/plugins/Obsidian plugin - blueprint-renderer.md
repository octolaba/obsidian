---
uid: bb6704cc-c228-56e9-a46d-06a4405eea2f
xid:
  - blueprint-renderer
aliases:
  - blueprint-renderer
  - Blueprint Renderer
  - goderyu/obsidian-blueprint-renderer
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/blueprint-renderer
alt:
  - https://github.com/goderyu/obsidian-blueprint-renderer
downloads: 862
updated at: "2025-08-02T08:56:52Z"
related to:
  - "[[GitHub - 997743898]]"
remind me:
---

# Blueprint Renderer

The plugin renders Unreal Engine Blueprint text pasted into a blueprint code block as an interactive node diagram inside a note. It uses the original BlueprintUE render script and stylesheet for compatibility with node types, connections and interactions, scoping the styles so they do not conflict with the rest of the app.

```cue
plugin: {
    id:     "blueprint-renderer"
    name:   "Blueprint Renderer"
    author: "goderyu"
    repo:   "goderyu/obsidian-blueprint-renderer"

    html_url:    "https://community.obsidian.md/plugins/blueprint-renderer"
    github_url:  "https://github.com/goderyu/obsidian-blueprint-renderer"
    description: "Render Unreal Engine Blueprint nodes as interactive visual diagrams using BlueprintUE rendering engine"
    about:       "Render Unreal Engine Blueprint text pasted into a blueprint code block as interactive node diagrams inside Obsidian notes. Use original BlueprintUE render.js and render.css for full compatibility with all node types, connections, and interactions while scoping styles to avoid conflicts."

    stats: {
        downloads:  862
        updated_at: 1754125012000
    }
}
```

[^template]: [[Obsidian plugin]]
