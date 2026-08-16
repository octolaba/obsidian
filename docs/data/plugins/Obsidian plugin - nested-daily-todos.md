---
uid: b2ef36fe-a358-560a-9730-18b4307e2307
xid:
  - nested-daily-todos
aliases:
  - nested-daily-todos
  - Nested Daily Todos
  - thomasbrezinski/obsidian-nested-daily-todos
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/nested-daily-todos
alt:
  - https://github.com/thomasbrezinski/obsidian-nested-daily-todos
downloads: 4232
updated at: "2024-07-30T15:37:08Z"
related to:
  - "[[GitHub - 593168051]]"
remind me:
---

# Nested Daily Todos

Nested Daily Todos carries incomplete todos from earlier Daily Notes into today's note, keeping nested children intact and grouping the carried items by header. It searches previous days for outstanding items, recognises alternative checkbox styles, and prefers the more recently updated version when the same todo appears twice.

```cue
plugin: {
    id:     "nested-daily-todos"
    name:   "Nested Daily Todos"
    author: "thomasbrezinski"
    repo:   "thomasbrezinski/obsidian-nested-daily-todos"

    html_url:    "https://community.obsidian.md/plugins/nested-daily-todos"
    github_url:  "https://github.com/thomasbrezinski/obsidian-nested-daily-todos"
    description: "Carry over incomplete todos from Daily Notes grouped by headers, with support for nesting and flexible todo states."
    about:       "Parse previous Daily Notes for incomplete todos and insert them into today's Daily Note, preserving nested todos and their children intact. Group carried todos by headers, recognize alternative checkbox styles, search previous days for outstanding items, and prefer more recently updated versions when conflicts arise."

    stats: {
        downloads:  4232
        updated_at: 1722353828000
    }
}
```

[^template]: [[Obsidian plugin]]
