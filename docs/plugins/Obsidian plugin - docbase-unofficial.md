---
uid: 7a9c2a87-c13c-5966-a9b9-af6689f8fc29
xid:
  - docbase-unofficial
aliases:
  - docbase-unofficial
  - "DocBase (Unofficial)"
  - kuvanov-2/obsidian-docbase
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/docbase-unofficial
alt:
  - https://github.com/kuvanov-2/obsidian-docbase
downloads: 229
updated at: "2024-07-05T23:32:17Z"
related to:
  - "[[GitHub - 823503250]]"
remind me:
---

# DocBase (Unofficial)

Pulls DocBase entries into the vault and pushes note updates back to DocBase. A pull imports the title, tags, draft status and content into notes marked with a docbase_note_id, while a push overwrites the DocBase note, so pulling first avoids losing data.

```cue
plugin: {
    id:     "docbase-unofficial"
    name:   "DocBase (Unofficial)"
    author: "kuvanov-2"
    repo:   "kuvanov-2/obsidian-docbase"

    html_url:    "https://community.obsidian.md/plugins/docbase-unofficial"
    github_url:  "https://github.com/kuvanov-2/obsidian-docbase"
    description: "Pull and push notes to DocBase"
    about:       "Sync notes between Obsidian and DocBase by pulling entries into Obsidian or pushing updates back to DocBase. Pull imports title, tags, draft status, and content into notes marked with docbase_note_id; push overwrites the DocBase note—pull first to avoid data loss."

    stats: {
        downloads:  229
        updated_at: 1720222337000
    }
}
```

[^template]: [[Obsidian plugin]]
