---
uid: ab3cf6ed-bcec-50d2-b7be-6a2f0e735334
xid:
  - note-api
aliases:
  - note-api
  - Note API
  - fengshuzi/note-api
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/note-api
alt:
  - https://github.com/fengshuzi/note-api
downloads: 29
updated at: "2026-07-30T05:49:15Z"
related to:
  - "[[GitHub - 1316853866]]"
remind me:
---

# Note API

Exposes the vault through an HTTP API bound to 127.0.0.1 and protected by an auto-generated API key, for viewing, creating, editing and deleting Markdown notes. Obsidian wiki links are resolved exactly, and binary assets such as images, PDFs and audio or video are served over the same interface. The daily-notes configuration is read so journal clients can follow it.

```cue
plugin: {
    id:     "note-api"
    name:   "Note API"
    author: "fengshuzi"
    repo:   "fengshuzi/note-api"

    html_url:    "https://community.obsidian.md/plugins/note-api"
    github_url:  "https://github.com/fengshuzi/note-api"
    description: "Expose a localhost HTTP API (API-key protected) to view, create, edit and delete vault notes. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Expose your vault via a localhost HTTP API bound to 127.0.0.1 and protected by an auto-generated API key to view, create, edit, and delete Markdown notes. Resolve Obsidian wiki links exactly, serve binary assets (images, PDFs, audio/video) over HTTP, and read daily-notes config for journal clients."

    stats: {
        downloads:  29
        updated_at: 1785390555000
    }
}
```

[^template]: [[Obsidian plugin]]
