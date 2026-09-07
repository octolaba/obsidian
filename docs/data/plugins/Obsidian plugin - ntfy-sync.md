---
uid: 37598585-b024-51b9-8a6c-21ad23532d9f
xid:
  - ntfy-sync
aliases:
  - ntfy-sync
  - Ntfy Sync
  - vuecwiz/obsidian-ntfy-sync
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/ntfy-sync
alt:
  - https://github.com/vuecwiz/obsidian-ntfy-sync
downloads: 71
updated at: "2026-08-01T12:30:45Z"
related to:
  - "[[GitHub - 1317384378]]"
remind me:
---

# Ntfy Sync

Receives messages from a configured ntfy server, public or self-hosted and optionally authenticated, over a streaming connection or by polling, and routes them into Markdown notes using ordered first-match rules. A rule can match on topic, title, message content, tags, priority, URLs and attachment metadata, while templates decide the destination note, the inserted content, the insertion mode and the attachment path. Accepted messages are persisted before processing and idempotency markers prevent duplicate vault writes during reconnects or replay, with dead-letter retries and redacted diagnostics. Processing results can optionally be published to a separate ntfy topic; the plugin is desktop-only.

```cue
plugin: {
    id:     "ntfy-sync"
    name:   "Ntfy Sync"
    author: "vuecwiz"
    repo:   "vuecwiz/obsidian-ntfy-sync"

    html_url:    "https://community.obsidian.md/plugins/ntfy-sync"
    github_url:  "https://github.com/vuecwiz/obsidian-ntfy-sync"
    description: "Receive ntfy messages in Obsidian and route them into Markdown notes with configurable rules, templates, attachments, durable recovery, and optional processing results. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Ntfy Sync connects Obsidian desktop to a user-configured ntfy server. Messages published from mobile apps, browser extensions, scripts, or other ntfy clients can be received through streaming or polling and routed into Markdown notes using ordered, first-match rules. Each rule can match topics, titles, message content, tags, priority, URLs, and attachment metadata. Configurable templates control the destination note, inserted content, insertion mode, and attachment path. Accepted messages are persisted before processing, and idempotency markers prevent duplicate Vault writes during reconnects or replay. The plugin supports authenticated public or self-hosted ntfy servers, guarded same-origin attachment downloads, durable recovery, dead-letter retries, redacted diagnostics, and optional publication of processing results to a separate ntfy topic. Ntfy Sync is desktop-only."

    stats: {
        downloads:  71
        updated_at: 1785587445000
    }
}
```

[^template]: [[Obsidian plugin]]
