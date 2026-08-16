---
uid: bc9e2fb0-0e13-5d0e-ae54-f4a7ab92d0c2
xid:
  - webhooks-server
aliases:
  - webhooks-server
  - Webhooks Server
  - khabaroff-studio/obsidian-webhooks-server
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/webhooks-server
alt:
  - https://github.com/khabaroff-studio/obsidian-webhooks-server
downloads: 189
updated at: "2026-05-22T15:28:36Z"
related to:
  - "[[GitHub - 1152471751]]"
remind me:
---

# Webhooks Server

Receives events from external services through a self-hosted server and turns them into Markdown notes in the vault. Delivery is real time over Server-Sent Events with polling as a fallback, and acknowledgements are used so an event arrives exactly once. Event data is stored encrypted at rest, and access uses passwordless email links.

```cue
plugin: {
    id:     "webhooks-server"
    name:   "Webhooks Server"
    author: "khabaroff"
    repo:   "khabaroff-studio/obsidian-webhooks-server"

    html_url:    "https://community.obsidian.md/plugins/webhooks-server"
    github_url:  "https://github.com/khabaroff-studio/obsidian-webhooks-server"
    description: "Receive webhooks from external services and create notes in your vault via a self-hosted server with real-time delivery. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Turn external HTTP events into Markdown notes in your vault in real time. Deliver events instantly via Server-Sent Events (SSE) with polling fallback, guarantee exactly-once delivery using ACKs, and store event data encrypted at rest for self-hosted control. Use passwordless email magic links for secure access."

    stats: {
        downloads:  189
        updated_at: 1779463716000
    }
}
```

[^template]: [[Obsidian plugin]]
