---
uid: 363e005a-355c-5ab8-a734-c2bd32287021
xid:
  - leader-hotkeys-obsidian
aliases:
  - leader-hotkeys-obsidian
  - Leader Hotkeys
  - tgrosinger/leader-hotkeys-obsidian
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/leader-hotkeys-obsidian
alt:
  - https://github.com/tgrosinger/leader-hotkeys-obsidian
downloads: 15160
updated at: "2026-05-13T18:10:29Z"
related to:
  - "[[GitHub - 316859979]]"
remind me:
---

# Leader Hotkeys

Leader Hotkeys binds a leader key that is pressed before a second hotkey to run any Obsidian command, in the manner of tmux or Vim. Core and third-party commands can both be chained this way, for instance j, k, h and l for pane focus. Its recorded inputs call the plugin experimental and possibly unstable, and advise backing up notes.

```cue
plugin: {
    id:     "leader-hotkeys-obsidian"
    name:   "Leader Hotkeys"
    author: "tgrosinger"
    repo:   "tgrosinger/leader-hotkeys-obsidian"

    html_url:    "https://community.obsidian.md/plugins/leader-hotkeys-obsidian"
    github_url:  "https://github.com/tgrosinger/leader-hotkeys-obsidian"
    description: "Add leader hotkey support to any command (like tmux or vim)."
    about:       "Assign a leader key to any Obsidian command and trigger actions by pressing the leader key followed by a hotkey, like tmux or Vim. Map core and third-party commands (e.g., j/k/h/l for pane focus) to chained hotkeys. Back up notes—plugin is experimental and may be unstable."

    stats: {
        downloads:  15160
        updated_at: 1778695829000
    }
}
```

[^template]: [[Obsidian plugin]]
