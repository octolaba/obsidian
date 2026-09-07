---
uid: 7f1b6d39-c1df-51d4-82ae-7a5cc38df040
xid:
  - telegram-bridge
aliases:
  - telegram-bridge
  - Telegram Bridge
  - tmlnv/obsidian-telegram-bridge
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/telegram-bridge
alt:
  - https://github.com/tmlnv/obsidian-telegram-bridge
downloads: 153
updated at: "2026-06-30T09:31:46Z"
related to:
  - "[[GitHub - 1171093184]]"
remind me:
---

# Telegram Bridge

Telegram Bridge syncs the messages of a Telegram bot into the vault in real time, converting chats, forum topics, attached files and message edits into Markdown notes. Flexible routing rules decide where a message lands. Raw data is stored in a self-hosted Supabase backend for persistence, and new content is then fetched into the vault as Markdown files.

```cue
plugin: {
    id:     "telegram-bridge"
    name:   "Telegram Bridge"
    author: "tmlnv"
    repo:   "tmlnv/obsidian-telegram-bridge"

    html_url:    "https://community.obsidian.md/plugins/telegram-bridge"
    github_url:  "https://github.com/tmlnv/obsidian-telegram-bridge"
    description: "Sync messages from Telegram into your vault through a self-hosted Supabase backend. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Sync messages from a Telegram bot into your Obsidian vault in real time, converting chats, forum topics, attached files, and message edits into Markdown notes. Route messages with flexible rules, store raw data in Supabase for persistence, and fetch new content into your vault as .md files."

    stats: {
        downloads:  153
        updated_at: 1782811906000
    }
}
```

[^template]: [[Obsidian plugin]]
