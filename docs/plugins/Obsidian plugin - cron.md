---
uid: 2d5f438b-eeb8-520a-a9b1-85fae04b02ea
xid:
  - cron
aliases:
  - cron
  - Cron
  - cdloh/obsidian-cron
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/cron
alt:
  - https://github.com/cdloh/obsidian-cron
downloads: 5960
updated at: "2023-08-24T10:26:27Z"
related to:
  - "[[GitHub - 609801144]]"
remind me:
---

# Cron

Runs Obsidian commands or custom JavaScript scripts on a schedule expressed in cron syntax. Jobs are added and managed through the plugin API, and locking prevents duplicate runs. The plugin states that its Obsidian Sync integration makes a job execute once across devices.

```cue
plugin: {
    id:     "cron"
    name:   "Cron"
    author: "cdloh"
    repo:   "cdloh/obsidian-cron"

    html_url:    "https://community.obsidian.md/plugins/cron"
    github_url:  "https://github.com/cdloh/obsidian-cron"
    description: "Simple CRON / scheduler to regularly run user scripts or commands."
    about:       "Schedule Obsidian commands or custom JavaScript scripts to run automatically using cron syntax. Add and manage jobs via the plugin API, use locking to prevent duplicate runs, and integrate with Obsidian Sync to ensure jobs execute once across devices."

    stats: {
        downloads:  5960
        updated_at: 1692872787000
    }
}
```

[^template]: [[Obsidian plugin]]
