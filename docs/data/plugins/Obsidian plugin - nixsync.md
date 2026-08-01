---
uid: 15341c3a-9ca5-5c2c-bc58-1d4b75d562a4
xid:
  - nixsync
aliases:
  - nixsync
  - Nixsync
  - rowmayne/nixsync
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/nixsync
alt:
  - https://github.com/rowmayne/nixsync
downloads: 109
updated at: "2026-04-21T14:48:10Z"
related to:
  - "[[GitHub - 1216953414]]"
remind me:
---

# Nixsync

Nixsync exports vault settings and plugin data into a single .nix manifest covering the app, appearance, hotkeys, and the manifests and settings of core and community plugins. Importing such a file writes the configuration and plugin data back into .obsidian/, and an optional NixOS activation script applies an export system-wide. Plugin JavaScript files are not included, so the plugins themselves must be installed separately.

```cue
plugin: {
    id:     "nixsync"
    name:   "Nixsync"
    author: "rowmayne"
    repo:   "rowmayne/nixsync"

    html_url:    "https://community.obsidian.md/plugins/nixsync"
    github_url:  "https://github.com/rowmayne/nixsync"
    description: "Export and import vault settings and plugins as Nix. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Export vault settings and plugin data to a single .nix manifest capturing app, appearance, hotkeys, core and community plugin manifests and settings. Import a .nix file to write config and plugin data into .obsidian/ and restore your setup. Generate an optional NixOS activation script to apply exports system-wide; plugin JS files are not included, so plugins must be installed separately."

    stats: {
        downloads:  109
        updated_at: 1776782890000
    }
}
```

[^template]: [[Obsidian plugin]]
