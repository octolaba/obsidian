---
uid: ba9a96b2-c5e5-5e80-8bad-e92c8d5823b2
xid:
  - plantuml-integrator
aliases:
  - plantuml-integrator
  - PlantUML Integrator
  - fangface-hub/obsidian_plantuml_integrator
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/plantuml-integrator
alt:
  - https://github.com/fangface-hub/obsidian_plantuml_integrator
downloads: 161
updated at: "2026-07-19T03:08:02Z"
related to:
  - "[[GitHub - 1192787589]]"
remind me:
---

# PlantUML Integrator

PlantUML Integrator renders PlantUML diagrams from plantuml and puml code blocks and from embedded .puml files in Markdown preview. Include dependency trees are cached and diagrams re-render automatically when an included file changes. Rendering runs against a remote HTTP endpoint or a local PlantUML server, and a right-click clears a diagram's cache and re-renders it.

```cue
plugin: {
    id:     "plantuml-integrator"
    name:   "PlantUML Integrator"
    author: "fangface-hub"
    repo:   "fangface-hub/obsidian_plantuml_integrator"

    html_url:    "https://community.obsidian.md/plugins/plantuml-integrator"
    github_url:  "https://github.com/fangface-hub/obsidian_plantuml_integrator"
    description: "Render PlantUML code blocks and .puml embeds with dependency-aware cache invalidation. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Render PlantUML diagrams from code blocks (plantuml, puml) and embedded .puml files in Markdown preview. Cache include dependency trees and auto re-render on included-file changes; pick a remote HTTP endpoint or a running local PlantUML server, and right-click a diagram to clear its cache and re-render."

    stats: {
        downloads:  161
        updated_at: 1784430482000
    }
}
```

[^template]: [[Obsidian plugin]]
