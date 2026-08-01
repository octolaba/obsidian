---
uid: e46f1769-cdf5-5234-bf30-6949d2ef3159
xid:
  - ghcat-reminder
aliases:
  - ghcat-reminder
  - GChat Reminder
  - anil-e/obsidian_gchat_plugin
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/ghcat-reminder
alt:
  - https://github.com/anil-e/obsidian_gchat_plugin
downloads: 3176
updated at: "2025-01-26T16:30:18Z"
related to:
  - "[[GitHub - 705906811]]"
remind me:
---

# GChat Reminder

Sends reminders to a Google Chat webhook based on due dates recorded in tasks. A task is marked with a gChat marker carrying a date and time, and notes are scanned every three minutes so that only the marked reminder content and its due date are transmitted when the item becomes due.

```cue
plugin: {
    id:     "ghcat-reminder"
    name:   "GChat Reminder"
    author: "anil-e"
    repo:   "anil-e/obsidian_gchat_plugin"

    html_url:    "https://community.obsidian.md/plugins/ghcat-reminder"
    github_url:  "https://github.com/anil-e/obsidian_gchat_plugin"
    description: "Send notifications to Google Chat Webhook based on due dates in tasks."
    about:       "Mark tasks using (gChat@YYYY-MM-DD HH:MM) to trigger automatic Google Chat reminders via webhook when they become due. Scan notes every 3 minutes and transmit only the marked reminder content and its due date."

    stats: {
        downloads:  3176
        updated_at: 1737909018000
    }
}
```

[^template]: [[Obsidian plugin]]
