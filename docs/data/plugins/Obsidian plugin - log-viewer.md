---
uid: 14ff862e-80b0-584d-9686-f3a9dcb067a9
xid:
  - log-viewer
aliases:
  - log-viewer
  - Log Viewer
  - viggomeesters/obsidian-log-viewer
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/log-viewer
alt:
  - https://github.com/viggomeesters/obsidian-log-viewer
downloads: 185
updated at: "2026-06-07T19:45:27Z"
related to:
  - "[[GitHub - 1262269214]]"
remind me:
---

# Log Viewer

Opens .log files in a dedicated read-only view that shows a structured log table and falls back to the raw source so unstructured lines and stack traces are preserved. Common timestamps and severity labels are detected, and entries are filtered by text, by severity and by whether a timestamp is present. Line, timestamp and severity counts are shown, and rendering is capped at 10,000 lines for responsiveness.

```cue
plugin: {
    id:     "log-viewer"
    name:   "Log Viewer"
    author: "Viggo Meesters"
    repo:   "viggomeesters/obsidian-log-viewer"

    html_url:    "https://community.obsidian.md/plugins/log-viewer"
    github_url:  "https://github.com/viggomeesters/obsidian-log-viewer"
    description: "Open .log files as a read-only viewer with filters, timestamps, severity badges, and raw source. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Browse .log files in a dedicated read-only Obsidian view that shows a structured log table with a raw source fallback to preserve unstructured lines and stack traces. Detect common timestamps and severity labels, filter by text, severity and timestamp presence, and view line, timestamp and severity counts with a 10,000-line render cap for responsiveness."

    stats: {
        downloads:  185
        updated_at: 1780861527000
    }
}
```

[^template]: [[Obsidian plugin]]
