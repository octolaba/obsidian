---
uid: f024d7b0-b98a-5785-93d5-19b0ed4a1d07
xid:
  - whisperer-sync
aliases:
  - whisperer-sync
  - Whisperer Sync
  - shakhbanov/whisperer-obsidian
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/whisperer-sync
alt:
  - https://github.com/shakhbanov/whisperer-obsidian
downloads: 11
updated at: "2026-08-09T16:27:16Z"
related to:
  - "[[GitHub - 1328672843]]"
remind me:
---

# Whisperer Sync

Sends notes one way from the vault to a Whisperer knowledge base so the assistant can answer from them, leaving local files unmodified. Only each note's vault path and text are transmitted, and edits, deletions and renames are propagated. Excluded folders are skipped, and syncing is limited to .md, .markdown, .txt and .canvas files.

```cue
plugin: {
    id:     "whisperer-sync"
    name:   "Whisperer Sync"
    author: "Shakhbanov Zurab"
    repo:   "shakhbanov/whisperer-obsidian"

    html_url:    "https://community.obsidian.md/plugins/whisperer-sync"
    github_url:  "https://github.com/shakhbanov/whisperer-obsidian"
    description: "Synchronizes your notes with the Whisperer knowledge base so the assistant can respond to them. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Sync your Obsidian vault one-way to your Whisperer knowledge base so the assistant answers from your notes without modifying local files. Send only each note's vault path and text, handle edits, deletions and renames, skip excluded folders, and limit synced files to .md, .markdown, .txt and .canvas."

    stats: {
        downloads:  11
        updated_at: 1786292836000
    }
}
```

[^template]: [[Obsidian plugin]]
