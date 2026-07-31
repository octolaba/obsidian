---
uid: 0ada46c4-3547-5c0f-8be4-9f0a45137c4e
xid:
  - vault-stats
aliases:
  - vault-stats
  - Vault Stats
  - blueheron786/obsidian-stats-plugin
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/vault-stats
alt:
  - https://github.com/blueheron786/obsidian-stats-plugin
downloads: 1300
updated at: "2025-07-01T00:36:54Z"
related to:
  - "[[GitHub - 1005273503]]"
remind me:
---

# Vault Stats

Exposes vault statistics to notes and scripts rather than to a fixed view. One call returns a Markdown summary of note count, word count, links and tags; another returns a Markdown list of the most recently modified notes, taking an item count and a folder to exclude.

```cue
plugin: {
    id:     "vault-stats"
    name:   "Vault Stats"
    author: "blueheron786"
    repo:   "blueheron786/obsidian-stats-plugin"

    html_url:    "https://community.obsidian.md/plugins/vault-stats"
    github_url:  "https://github.com/blueheron786/obsidian-stats-plugin"
    description: "Provides methods to retrieve statistics about the vault, such as the number of notes, total word count, recently modified notes, and more."
    about:       "Show vault statistics and recent edits directly inside notes or scripts. Call showStats() to return a markdown summary of note count, word count, links, and tags, or call showLastModifiedNotes(numItems, excludeFolder) to return a markdown list of the most recently modified notes with optional item count and folder exclusion."

    stats: {
        downloads:  1300
        updated_at: 1751330214000
    }
}
```

[^template]: [[Obsidian plugin]]
