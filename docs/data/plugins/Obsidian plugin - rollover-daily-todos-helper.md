---
uid: ae594ca5-4728-5f46-a69c-b59d567f6ca5
xid:
  - rollover-daily-todos-helper
aliases:
  - rollover-daily-todos-helper
  - Rollover Daily Todos Helper
  - eugenschmalz/obsidian-rollover-daily-todos-helper
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/rollover-daily-todos-helper
alt:
  - https://github.com/eugenschmalz/obsidian-rollover-daily-todos-helper
downloads: 128
updated at: "2026-05-06T20:49:38Z"
related to:
  - "[[GitHub - 1231179965]]"
remind me:
---

# Rollover Daily Todos Helper

Rollover Daily Todos Helper opens today's daily note after a configurable startup delay of 0 to 120 seconds, so that Rollover Daily Todos reliably catches the note-creation event. Opening can be skipped when today's note is already open, an optional rollover command can run afterwards, and fallback command resolution covers custom daily-note commands on desktop and mobile. The recorded description presents it as an unofficial companion to that plugin.

```cue
plugin: {
    id:     "rollover-daily-todos-helper"
    name:   "Rollover Daily Todos Helper"
    author: "eugenschmalz"
    repo:   "eugenschmalz/obsidian-rollover-daily-todos-helper"

    html_url:    "https://community.obsidian.md/plugins/rollover-daily-todos-helper"
    github_url:  "https://github.com/eugenschmalz/obsidian-rollover-daily-todos-helper"
    description: "Unofficial companion for Rollover Daily Todos. Opens today's daily note after a startup delay so rollover workflows run reliably on desktop and mobile. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Delay opening today's daily note at startup so Rollover Daily Todos reliably catches the note-creation event; set a 0–120s startup delay and optionally skip if today's note is already open. Run an optional rollover command after opening and use fallback command resolution for custom daily-note commands, with desktop and mobile support."

    stats: {
        downloads:  128
        updated_at: 1778100578000
    }
}
```

[^template]: [[Obsidian plugin]]
