---
uid: 30519afe-4926-5e49-adec-133e23a2a4e4
xid:
  - say
aliases:
  - say
  - Say
  - 1yx/obsidian-plugin-say
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/say
alt:
  - https://github.com/1yx/obsidian-plugin-say
downloads: 125
updated at: "2026-05-16T06:29:22Z"
related to:
  - "[[GitHub - 1219101894]]"
remind me:
---

# Say

Say reads a note's H1 heading aloud when you hover over an internal link to it, falling back to the filename when the note has no H1. It drives the system text-to-speech engine, such as say on macOS, spd-say or espeak on Linux and PowerShell on Windows, with a selectable command, voice, speech rate and trigger delay, or a custom argument template for finer control.

```cue
plugin: {
    id:     "say"
    name:   "Say"
    author: "1yx"
    repo:   "1yx/obsidian-plugin-say"

    html_url:    "https://community.obsidian.md/plugins/say"
    github_url:  "https://github.com/1yx/obsidian-plugin-say"
    description: "Read aloud the H1 heading of a note when hovering over its internal link, using the system's built-in text-to-speech engine (e.g. macOS say). - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Read aloud a note's H1 heading when you hover over an internal link, falling back to the filename if no H1 exists. Configure system TTS (macOS say, Linux spd-say/espeak, Windows PowerShell) with selectable command, voice, speech rate, trigger delay, or supply a custom argument template for advanced control."

    stats: {
        downloads:  125
        updated_at: 1778912962000
    }
}
```

[^template]: [[Obsidian plugin]]
