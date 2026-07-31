---
uid: ac804387-37fa-5493-9311-647ac2a91ff4
xid:
  - mockup-viewer
aliases:
  - mockup-viewer
  - Mockup Viewer
  - twrusstw/mockup-viewer
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/mockup-viewer
alt:
  - https://github.com/twrusstw/mockup-viewer
downloads: 127
updated at: "2026-05-26T17:58:59Z"
related to:
  - "[[GitHub - 1248325492]]"
remind me:
---

# Mockup Viewer

Mockup Viewer previews HTML mockups from the vault inside an isolated iframe with Obsidian's app.css, the active theme and the developer's own plugin CSS injected, so the visuals mirror the real plugin without building or reloading. Edits hot-reload and the preview re-renders on a theme switch, and host classes such as is-phone can be simulated without affecting the app. Embedded scripts run, so the recorded text warns that only trusted mockups should be opened.

```cue
plugin: {
    id:     "mockup-viewer"
    name:   "Mockup Viewer"
    author: "Russell"
    repo:   "twrusstw/mockup-viewer"

    html_url:    "https://community.obsidian.md/plugins/mockup-viewer"
    github_url:  "https://github.com/twrusstw/mockup-viewer"
    description: "Preview HTML mockups from your vault with your plugin's CSS injected into an isolated iframe, for design-time UI prototyping. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Preview HTML mockups inside an isolated iframe with Obsidian's app.css, the active theme, and your plugin CSS injected so visuals mirror the real plugin without building or reloading. Hot-reload edits and re-render on theme switch, simulate host classes (like is-phone) without affecting the app, and run embedded scripts — open only mockups you trust."

    stats: {
        downloads:  127
        updated_at: 1779818339000
    }
}
```

[^template]: [[Obsidian plugin]]
