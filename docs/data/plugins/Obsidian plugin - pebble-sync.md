---
uid: c19b3de9-dba7-511d-b6b3-1db67869c240
xid:
  - pebble-sync
aliases:
  - pebble-sync
  - Pebble Sync
  - sapienskid/pebble-sync
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/pebble-sync
alt:
  - https://github.com/sapienskid/pebble-sync
downloads: 65
updated at: "2026-06-23T10:46:33Z"
related to:
  - "[[GitHub - 1065346156]]"
remind me:
---

# Pebble Sync

Pebble Sync imports notes from a Pebble API into atomic Markdown files and can embed them into the matching daily note beneath a configurable heading. Notes are generated from templates, with folder and tag-derived naming, and imports run on demand or on an interval. An on-disk history deduplicates repeated imports, and a forced overwrite is available when needed.

```cue
plugin: {
    id:     "pebble-sync"
    name:   "Pebble Sync"
    author: "Sabin Pokharel"
    repo:   "sapienskid/pebble-sync"

    html_url:    "https://community.obsidian.md/plugins/pebble-sync"
    github_url:  "https://github.com/sapienskid/pebble-sync"
    description: "Import Pebble notes into atomic notes and link them back to your daily notes. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Import notes from a Pebble API into atomic Markdown files and optionally embed them into matching Daily Notes beneath a configurable heading. Generate notes from templates with folder and tag-derived naming, run imports on demand or an interval, deduplicate via on-disk history, or force-overwrite when needed."

    stats: {
        downloads:  65
        updated_at: 1782211593000
    }
}
```

[^template]: [[Obsidian plugin]]
