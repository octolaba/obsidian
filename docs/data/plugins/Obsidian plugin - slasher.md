---
uid: 5f95770f-58e5-53a8-af93-3f80560c1497
xid:
  - slasher
aliases:
  - slasher
  - Slasher
  - binnyva/obsidian-slasher
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/slasher
alt:
  - https://github.com/binnyva/obsidian-slasher
downloads: 191
updated at: "2026-04-16T16:45:27Z"
related to:
  - "[[GitHub - 1211797804]]"
remind me:
---

# Slasher

Slasher defines custom editor commands built from template strings, which then appear in the Obsidian command palette and among the slash commands. A template combines plain text, dynamic tokens such as dates, clipboard content and file metadata, and embedded shell commands, so the inserted text can be computed or formatted as it is written into the note.

```cue
plugin: {
    id:     "slasher"
    name:   "Slasher"
    author: "binnyva"
    repo:   "binnyva/obsidian-slasher"

    html_url:    "https://community.obsidian.md/plugins/slasher"
    github_url:  "https://github.com/binnyva/obsidian-slasher"
    description: "Create custom slash commands that insert custom text based on templates. Insert dates, shell command output, processed clipboard content, and more. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Create custom editor commands that appear in Obsidian’s command palette and Slash commands using template strings. Compose templates from plain text, dynamic tokens (dates, clipboard, file metadata) and embedded shell commands to insert computed or formatted content directly into notes."

    stats: {
        downloads:  191
        updated_at: 1776357927000
    }
}
```

[^template]: [[Obsidian plugin]]
