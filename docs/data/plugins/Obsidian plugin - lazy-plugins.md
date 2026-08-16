---
uid: b9de812b-d015-5128-ae09-a49cf255fbdd
xid:
  - lazy-plugins
aliases:
  - lazy-plugins
  - Lazy Loader
  - alangrainger/obsidian-lazy-plugins
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/lazy-plugins
alt:
  - https://github.com/alangrainger/obsidian-lazy-plugins
downloads: 129308
updated at: "2026-05-31T10:48:05Z"
related to:
  - "[[GitHub - 838057218]]"
remind me:
---

# Lazy Loader

Lazy Loader delays plugin loading at startup so that nonessential plugins move into timed background loads and the initial launch drops towards sub-second times. Its recorded inputs note that the settings take up to two restarts to reach full speed, and that a plugin disabled from inside Lazy Loader stays disabled across restarts.

```cue
plugin: {
    id:     "lazy-plugins"
    name:   "Lazy Loader"
    author: "Alan Grainger"
    repo:   "alangrainger/obsidian-lazy-plugins"

    html_url:    "https://community.obsidian.md/plugins/lazy-plugins"
    github_url:  "https://github.com/alangrainger/obsidian-lazy-plugins"
    description: "Load plugins with a delay on startup, so that you can get your app startup down into the sub-second loading time."
    about:       "Delay plugin loading on Obsidian startup to push nonessential plugins into timed background loads and reduce initial app launch to sub-second times. Apply changes over up to two restarts to reach full speed; disable plugins inside Lazy Loader settings to keep them disabled across restarts."

    stats: {
        downloads:  129308
        updated_at: 1780224485000
    }
}
```

[^template]: [[Obsidian plugin]]
