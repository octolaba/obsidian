---
uid: 310cb49a-0bae-5180-8fb2-297fbf13db85
xid:
  - on-demand-plugins
aliases:
  - on-demand-plugins
  - On-Demand
  - 22-2/obsidian-on-demand-plugins
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/on-demand-plugins
alt:
  - https://github.com/22-2/obsidian-on-demand-plugins
downloads: 1451
updated at: "2026-07-10T05:13:33Z"
related to:
  - "[[GitHub - 1147367511]]"
remind me:
---

# On-Demand

On-Demand delays plugin activation so plugins load only when they are needed, keeping startup shorter. It registers lightweight placeholder commands and loads the real plugin when one of its commands, a configured view or a specific file is used. Each plugin is set to on-demand, layout-ready, always enabled or disabled.

```cue
plugin: {
    id:     "on-demand-plugins"
    name:   "On-Demand"
    author: "22-2"
    repo:   "22-2/obsidian-on-demand-plugins"

    html_url:    "https://community.obsidian.md/plugins/on-demand-plugins"
    github_url:  "https://github.com/22-2/obsidian-on-demand-plugins"
    description: "Lazy load plugins by caching their commands. Plugins are enabled on-demand when you trigger their commands (or open specific views), keeping startup fast. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Delay plugin activation and load plugins only when needed to reduce Obsidian startup time. Register lightweight placeholders (dummy commands) and load the real plugin when its command, a configured view, or a specific file is used; choose per-plugin modes like on-demand, layout-ready, always enabled, or disabled."

    stats: {
        downloads:  1451
        updated_at: 1783660413000
    }
}
```

[^template]: [[Obsidian plugin]]
