---
uid: 9d848441-133f-5652-b7cf-2300fb616f72
xid:
  - igdb-game-search
aliases:
  - igdb-game-search
  - IGDB Game Search
  - tetsuya-dev-jp/igdb-game-search
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/igdb-game-search
alt:
  - https://github.com/tetsuya-dev-jp/igdb-game-search
downloads: 230
updated at: "2026-08-11T05:44:43Z"
related to:
  - "[[GitHub - 1178710309]]"
remind me:
---

# IGDB Game Search

IGDB Game Search looks up games by title in IGDB and creates notes populated with the returned metadata. A Twitch Client ID and secret authorize the requests, and notes are written to a chosen folder with customizable filenames and an optional template file.

```cue
plugin: {
    id:     "igdb-game-search"
    name:   "IGDB Game Search"
    author: "tetsuya-dev-jp"
    repo:   "tetsuya-dev-jp/igdb-game-search"

    html_url:    "https://community.obsidian.md/plugins/igdb-game-search"
    github_url:  "https://github.com/tetsuya-dev-jp/igdb-game-search"
    description: "Search IGDB and create game notes. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Search IGDB by game title and create new game notes populated with IGDB metadata. Use a Twitch Client ID and Secret to fetch IGDB data and save notes to a chosen folder with customizable filenames and optional template files."

    stats: {
        downloads:  230
        updated_at: 1786427083000
    }
}
```

[^template]: [[Obsidian plugin]]
