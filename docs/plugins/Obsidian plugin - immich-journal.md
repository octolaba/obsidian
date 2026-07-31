---
uid: ec1db9e9-935f-52ce-87c2-c7ba69f9b4ac
xid:
  - immich-journal
aliases:
  - immich-journal
  - Immich Journal
  - fcandi/obsidian-immich-journal
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/immich-journal
alt:
  - https://github.com/fcandi/obsidian-immich-journal
downloads: 113
updated at: "2026-07-12T11:06:51Z"
related to:
  - "[[GitHub - 1290152540]]"
remind me:
---

# Immich Journal

Connects a daily note to a self-hosted Immich photo library, where one command opens a picker holding every photo taken on that note's date, parsed from the title or a frontmatter field; from any other note it opens on the latest day with photos. Selected photos are inserted at the cursor as resized local copies, each with an optional caption rendered from Immich metadata and a link back to the original asset. The recorded inputs describe day matching as timezone-safe, state that re-inserting a photo reuses the existing file, and list English, German, Spanish, French, Japanese and Chinese interface languages.

```cue
plugin: {
    id:     "immich-journal"
    name:   "Immich Journal"
    author: "fcandi"
    repo:   "fcandi/obsidian-immich-journal"

    html_url:    "https://community.obsidian.md/plugins/immich-journal"
    github_url:  "https://github.com/fcandi/obsidian-immich-journal"
    description: "Insert photos taken on a daily note's date from a self-hosted Immich server, resized, captioned, and linked back to Immich. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Immich Journal connects your daily notes to your self-hosted Immich photo library. From a daily note, one command opens a picker with every photo taken on that date (parsed from the note title or a frontmatter field); from any other note it opens on the latest day with photos. Selected photos are inserted at the cursor as resized local copies that keep your vault small, each with an optional caption rendered from Immich metadata and a link back to the original asset. Day matching is timezone-safe, so travel photos appear on the correct day, and re-inserting a photo reuses the existing file instead of creating a duplicate. Works on desktop and mobile, including servers only reachable through a VPN such as Tailscale, with no CORS setup required. The UI is available in English, German, Spanish, French, Japanese, and Chinese."

    stats: {
        downloads:  113
        updated_at: 1783854411000
    }
}
```

[^template]: [[Obsidian plugin]]
