---
uid: 9b76f9ae-e4a4-5979-ab53-9f57337cb517
xid:
  - wispr-flow-sync
aliases:
  - wispr-flow-sync
  - Wispr Flow Sync
  - madforstrength/obsidian-wispr-flow-sync
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/wispr-flow-sync
alt:
  - https://github.com/madforstrength/obsidian-wispr-flow-sync
downloads: 32
updated at: "2026-08-09T20:25:31Z"
related to:
  - "[[GitHub - 1329067658]]"
remind me:
---

# Wispr Flow Sync

Imports Wispr Flow meeting notes and transcripts into the vault as Markdown, writing one note per meeting with a wispr_id field in YAML frontmatter and optional separate transcript files. Only local Wispr Flow files are read and no network connection is made; it runs on Obsidian desktop and requires the macOS Notetaker. A sync can be incremental or a full re-import of every meeting.

```cue
plugin: {
    id:     "wispr-flow-sync"
    name:   "Wispr Flow Sync"
    author: "Muhammad Bilal"
    repo:   "madforstrength/obsidian-wispr-flow-sync"

    html_url:    "https://community.obsidian.md/plugins/wispr-flow-sync"
    github_url:  "https://github.com/madforstrength/obsidian-wispr-flow-sync"
    description: "Sync Wispr Flow meeting notes and transcripts into your vault. Reads local files only and never connects to the network. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Sync Wispr Flow meeting notes and transcripts into your vault as Markdown, creating one note per meeting with YAML frontmatter (wispr_id) and optional transcript files. Read only local Wispr Flow files—no network connections; runs on Obsidian desktop (macOS Notetaker required). Perform incremental or full re-syncs to import new, changed, or all meetings."

    stats: {
        downloads:  32
        updated_at: 1786307131000
    }
}
```

[^template]: [[Obsidian plugin]]
