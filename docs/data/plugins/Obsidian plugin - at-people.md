---
uid: 8458cf06-2c56-5826-8742-3d280780e282
xid:
  - at-people
aliases:
  - at-people
  - At People
  - backmind/obsidian-at-people
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/at-people
alt:
  - https://github.com/backmind/obsidian-at-people
downloads: 3040
updated at: "2026-06-30T21:56:16Z"
related to:
  - "[[GitHub - 1082530000]]"
remind me:
---

# At People

Inserts links to people files when a name is typed after the at sign. Suggestions use fuzzy matching that tolerates typos, initials and accents, also match frontmatter aliases, and are ranked by backlinks and recency. Selected text can be linked to a person by command, and person files can optionally be created automatically.

```cue
plugin: {
    id:     "at-people"
    name:   "At People"
    author: "backmind"
    repo:   "backmind/obsidian-at-people"

    html_url:    "https://community.obsidian.md/plugins/at-people"
    github_url:  "https://github.com/backmind/obsidian-at-people"
    description: "Use the @ to create links to people files with smart fuzzy search, accent-insensitive matching, and backlink-based ranking."
    about:       "Mention people with @ and insert wiki-links automatically into your notes. Get smart fuzzy suggestions (typos, initials, accents), match frontmatter aliases, rank results by backlinks and recency, link selected text to a person via command, and optionally auto-create person files."

    stats: {
        downloads:  3040
        updated_at: 1782856576000
    }
}
```

[^template]: [[Obsidian plugin]]
