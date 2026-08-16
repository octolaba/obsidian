---
uid: 9806917d-40bc-5a39-b12d-8167c3d13069
xid:
  - readingrate
aliases:
  - readingrate
  - ReadingRate
  - simonsbookclub/readingrate-obsidian
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/readingrate
alt:
  - https://github.com/simonsbookclub/readingrate-obsidian
downloads: 135
updated at: "2026-07-07T15:49:48Z"
related to:
  - "[[GitHub - 1292368291]]"
remind me:
---

# ReadingRate

Syncs a ReadingRate library into the vault as linked Markdown notes: a note per book and per author, the reading journal, saved quotes with block references, AI reading insights, domain mastery, themes, and a reading timeline, all joined by wikilinks. The sync is one-directional, from ReadingRate into the vault, and never touches anything written below the notes marker in a file. Commands insert quotes or quote embeds into any note, Bases dashboards cover the library, and per-note-type graph colors are optional. A ReadingRate account is required; the free tier syncs everything, while AI synthesis notes and vault lint need a subscription.

```cue
plugin: {
    id:     "readingrate"
    name:   "ReadingRate"
    author: "ReadingRate"
    repo:   "simonsbookclub/readingrate-obsidian"

    html_url:    "https://community.obsidian.md/plugins/readingrate"
    github_url:  "https://github.com/simonsbookclub/readingrate-obsidian"
    description: "Sync your ReadingRate reading data — books, quotes, journal entries, insights, and domain mastery — into your Obsidian vault - This plugin has not been manually reviewed by Obsidian staff."
    about:       "ReadingRate is a reading tracker. This plugin syncs your ReadingRate library into your vault as linked Markdown notes: a note per book and author, your reading journal, saved quotes with block references, AI reading insights, domain mastery, themes, and a reading timeline — all connected with wikilinks, so the graph view becomes a map of your reading. Sync is one-directional (ReadingRate → vault) and never touches anything you write below the notes marker in each file. It also adds commands to insert quotes or quote embeds into any note, Bases dashboards for your library, and optional graph colors per note type. Requires a ReadingRate account; the free tier syncs everything, while AI synthesis notes and vault lint require a ReadingRate subscription."

    stats: {
        downloads:  135
        updated_at: 1783439388000
    }
}
```

[^template]: [[Obsidian plugin]]
