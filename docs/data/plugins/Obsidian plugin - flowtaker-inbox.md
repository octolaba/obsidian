---
uid: 816e4b45-d9be-5b4f-a9d4-ed089a7096b1
xid:
  - flowtaker-inbox
aliases:
  - flowtaker-inbox
  - Flowtaker Inbox
  - reit5667/obsidian-flowtaker-inbox
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/flowtaker-inbox
alt:
  - https://github.com/reit5667/obsidian-flowtaker-inbox
downloads: 42
updated at: "2026-07-21T10:54:02Z"
related to:
  - "[[GitHub - 1240554949]]"
remind me:
---

# Flowtaker Inbox

Runs a Telegram bot inside Obsidian, with no external server, so messages sent to it land in the vault as local Markdown notes. Tags become YAML frontmatter, forwarded sources are recorded, and items tagged as todo are routed to a sprint or a backlog. Voice messages are transcribed through Groq Whisper.

```cue
plugin: {
    id:     "flowtaker-inbox"
    name:   "Flowtaker Inbox"
    author: "reit5667"
    repo:   "reit5667/obsidian-flowtaker-inbox"

    html_url:    "https://community.obsidian.md/plugins/flowtaker-inbox"
    github_url:  "https://github.com/reit5667/obsidian-flowtaker-inbox"
    description: "Save Telegram messages directly to your Obsidian vault inbox. No server required. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Run a Telegram bot inside Obsidian (no external server) to send messages to your vault as local Markdown notes. Save #tags as YAML frontmatter, record forwarded sources, route #todo tasks to sprint or backlog, and transcribe voice messages via Groq Whisper."

    stats: {
        downloads:  42
        updated_at: 1784631242000
    }
}
```

[^template]: [[Obsidian plugin]]
