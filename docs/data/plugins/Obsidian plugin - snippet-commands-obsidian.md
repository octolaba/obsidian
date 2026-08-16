---
uid: 953ab1dd-214c-5269-99ab-245a25af5346
xid:
  - snippet-commands-obsidian
aliases:
  - snippet-commands-obsidian
  - Snippet Commands
  - deathau/snippet-commands-obsidian
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/snippet-commands-obsidian
alt:
  - https://github.com/deathau/snippet-commands-obsidian
downloads: 8120
updated at: "2021-10-12T06:45:18Z"
related to:
  - "[[GitHub - 414393579]]"
remind me:
---

# Snippet Commands

Every CSS snippet is registered as a command in the command palette, so a hotkey can be bound to toggling it. A dedicated command reloads all snippet commands after the snippets themselves have changed.

```cue
plugin: {
    id:     "snippet-commands-obsidian"
    name:   "Snippet Commands"
    author: "deathau"
    repo:   "deathau/snippet-commands-obsidian"

    html_url:    "https://community.obsidian.md/plugins/snippet-commands-obsidian"
    github_url:  "https://github.com/deathau/snippet-commands-obsidian"
    description: "Register custom CSS snippets as commands (which you can bind hotkeys to)."
    about:       "Expose all CSS snippets as commands in the command palette and assign hotkeys to toggle them. Reload updated snippets on demand with a dedicated \"Reload all snippet commands\" action."

    stats: {
        downloads:  8120
        updated_at: 1634021118000
    }
}
```

[^template]: [[Obsidian plugin]]
