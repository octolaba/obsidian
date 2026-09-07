---
uid: 02ad9eb5-dec8-5536-94b6-9f53af00628e
xid:
  - automatic-installation-of-plugins
aliases:
  - automatic-installation-of-plugins
  - Community Install Manager
  - skilletron/obsidian-automatic-installation-of-plugins
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/automatic-installation-of-plugins
alt:
  - https://github.com/skilletron/obsidian-automatic-installation-of-plugins
downloads: 1029
updated at: "2026-08-08T15:33:01Z"
related to:
  - "[[GitHub - 1033836383]]"
remind me:
---

# Community Install Manager

Reads a list of plugin IDs and optional settings from JSON files in the vault's .obsidian folder, then installs the missing community plugins from the Obsidian registry, enables them and applies the recorded configuration. The plugin list comes from community-plugins-list.json and per-plugin settings from community-plugins-settings.json, so one setup can be reproduced on another device or shared. Release assets are downloaded from GitHub during installation, and the plugin is desktop only.

```cue
plugin: {
    id:     "automatic-installation-of-plugins"
    name:   "Community Install Manager"
    author: "Konstantin Volobuev"
    repo:   "skilletron/obsidian-automatic-installation-of-plugins"

    html_url:    "https://community.obsidian.md/plugins/automatic-installation-of-plugins"
    github_url:  "https://github.com/skilletron/obsidian-automatic-installation-of-plugins"
    description: "Install, enable, and configure community plugins from JSON files to sync vault setups across devices. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Community Install Manager reads a list of plugin IDs and optional settings from JSON files in your vault's .obsidian folder, then installs missing community plugins from the Obsidian registry, enables them, and applies configuration. Use it to sync the same plugin setup across devices, bootstrap a new vault, or share a predefined stack with others. You control what gets installed through community-plugins-list.json and per-plugin settings through community-plugins-settings.json. Desktop only. The plugin downloads release assets from GitHub when installing. Only use it with vaults and JSON configs you trust, and review the plugin list before enabling auto-install."

    stats: {
        downloads:  1029
        updated_at: 1786203181000
    }
}
```

[^template]: [[Obsidian plugin]]
