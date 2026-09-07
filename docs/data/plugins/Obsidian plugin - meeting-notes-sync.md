---
uid: 87807e20-efb2-5581-ad56-6ac8aab8c21e
xid:
  - meeting-notes-sync
aliases:
  - meeting-notes-sync
  - Meeting Notes Sync
  - andreagrandi/obsidian-meeting-notes-sync
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/meeting-notes-sync
alt:
  - https://github.com/andreagrandi/obsidian-meeting-notes-sync
downloads: 151
updated at: "2026-06-26T13:53:47Z"
related to:
  - "[[GitHub - 1267268348]]"
remind me:
---

# Meeting Notes Sync

Syncs meeting transcripts, notes and AI summaries from MacParakeet and Fellow into the vault, creating one folder per meeting with a folder-note index and source-tagged artifacts. Duplicate recordings are merged into a single folder when their time intervals overlap, and low-confidence matches are flagged. Syncs are incremental and non-destructive, skipping meetings that have not changed.

```cue
plugin: {
    id:     "meeting-notes-sync"
    name:   "Meeting Notes Sync"
    author: "Andrea Grandi"
    repo:   "andreagrandi/obsidian-meeting-notes-sync"

    html_url:    "https://community.obsidian.md/plugins/meeting-notes-sync"
    github_url:  "https://github.com/andreagrandi/obsidian-meeting-notes-sync"
    description: "Sync meeting transcripts, notes, and AI summaries from MacParakeet and Fellow into your vault. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Sync meeting transcripts, notes, and AI summaries from MacParakeet and Fellow into your vault, creating one folder per meeting with a folder-note index and source-tagged artifacts. Merge duplicate recordings into a single folder by time-interval overlap, flag low-confidence matches, and run incremental, non-destructive syncs that skip unchanged meetings."

    stats: {
        downloads:  151
        updated_at: 1782482027000
    }
}
```

[^template]: [[Obsidian plugin]]
