---
uid: 4d007041-184c-5357-9426-ad15c131849f
xid:
  - ssh-terminal
aliases:
  - ssh-terminal
  - SSH Terminal
  - justinzzc/obsidian-ssh-terminal
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/ssh-terminal
alt:
  - https://github.com/justinzzc/obsidian-ssh-terminal
downloads: 23
updated at: "2026-08-09T01:29:36Z"
related to:
  - "[[GitHub - 1308303875]]"
remind me:
---

# SSH Terminal

Embeds an interactive SSH terminal in desktop notes, usable in reading view and live preview. Connections are started manually and server host keys are confirmed on first use; passwords can be saved in profiles backed by the system keychain, or supplied inline, in which case they are stored in the Markdown. It runs on Obsidian desktop only, and password authentication is the only supported method.

```cue
plugin: {
    id:     "ssh-terminal"
    name:   "SSH Terminal"
    author: "Zechen Zhou"
    repo:   "justinzzc/obsidian-ssh-terminal"

    html_url:    "https://community.obsidian.md/plugins/ssh-terminal"
    github_url:  "https://github.com/justinzzc/obsidian-ssh-terminal"
    description: "Interactive SSH terminals embedded in Markdown documents. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Embed a full interactive SSH terminal in Obsidian desktop notes, usable in reading view and live preview. Initiate connections manually and confirm server host keys on first use; save passwords securely via profiles and the system keychain or supply inline credentials (inline stores passwords in the Markdown). Use on Obsidian desktop only; supports password authentication only."

    stats: {
        downloads:  23
        updated_at: 1786238976000
    }
}
```

[^template]: [[Obsidian plugin]]
