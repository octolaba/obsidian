---
uid: 07daaac6-a119-59a2-835a-db71f3e75cd8
xid:
  - evc-team-relay
aliases:
  - evc-team-relay
  - EVC Team Relay
  - entire-vc/evc-team-relay-obsidian-plugin
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/evc-team-relay
alt:
  - https://github.com/entire-vc/evc-team-relay-obsidian-plugin
downloads: 990
updated at: "2026-07-26T05:36:08Z"
related to:
  - "[[GitHub - 1150533792]]"
remind me:
---

# EVC Team Relay

Adds real-time collaborative editing through a conflict-free CRDT sync engine that works offline and reconciles on reconnection, so several people can edit one note at once. Folders are shared with viewer or editor permissions, and a note or folder is published to the web as public, protected by a link and token, or behind a login, optionally on a custom domain. AI agents read and write the shared notes over a Model Context Protocol connection. Sync, publishing and agent access run over a relay that is self-hosted or managed, and the notes stay plain files in the vault.

```cue
plugin: {
    id:     "evc-team-relay"
    name:   "EVC Team Relay"
    author: "entire-vc"
    repo:   "entire-vc/evc-team-relay-obsidian-plugin"

    html_url:    "https://community.obsidian.md/plugins/evc-team-relay"
    github_url:  "https://github.com/entire-vc/evc-team-relay-obsidian-plugin"
    description: "Real-time multiplayer editing, shared folders with permissions, one-click web publishing, and read and write access for AI agents through the MCP, over a self-hosted or managed relay. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Team Relay adds real-time collaboration, web publishing, and AI-agent access to your notes. Several people can edit the same note at once, with changes merged automatically through a conflict-free (CRDT) sync engine that works offline and reconciles when you reconnect. Share entire folders with viewer or editor permissions. Publish any note or folder to the web in one step, in three modes: public, protected by a link and token, or private behind a login, with optional custom domains. AI agents can read and write your shared notes through a Model Context Protocol connection: assistants such as Claude Code can fetch context and update notes automatically, and an OpenClaw skill wires this into agent workflows. So your vault becomes shared memory for both your team and your AI tools. Sync, publishing, and agent access run over a relay server you can self-host so all data stays on your own infrastructure, or use a managed instance. Either way your notes stay plain files in your vault."

    stats: {
        downloads:  990
        updated_at: 1785044168000
    }
}
```

[^template]: [[Obsidian plugin]]
