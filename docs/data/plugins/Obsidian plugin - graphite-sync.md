---
uid: 14b2305d-c317-5579-b797-fad18d2625c7
xid:
  - graphite-sync
aliases:
  - graphite-sync
  - Graphite Sync
  - omaryazeedi/graphite-sync
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/graphite-sync
alt:
  - https://github.com/omaryazeedi/graphite-sync
downloads: 19
updated at: "2026-07-31T12:30:00Z"
related to:
  - "[[GitHub - 1313901992]]"
remind me:
---

# Graphite Sync

Synchronizes the vault with a self-hosted Graphite (Life Planner) server, pulling Spaces down as single Markdown files for local editing. Pushing runs a validate-first merge that either returns line-numbered errors or rewrites the file into the server's form, and freeform regions of the note are preserved. A sync panel shows per-file status, pulls can be limited to selected modules and routed to a destination vault, and pushing can optionally be automatic.

```cue
plugin: {
    id:     "graphite-sync"
    name:   "Graphite Sync"
    author: "Omar Yazeedi"
    repo:   "omaryazeedi/graphite-sync"

    html_url:    "https://community.obsidian.md/plugins/graphite-sync"
    github_url:  "https://github.com/omaryazeedi/graphite-sync"
    description: "Two-way sync with your self-hosted Graphite (Life Planner) server: pull Spaces into any vault as Markdown, edit in Obsidian, push back through a validate-first merge. Sync panel with per-file status, destination-vault routing, optional auto-push. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Sync Obsidian with a self-hosted Graphite server. Pull Spaces as single Markdown files, edit locally, and push via a validated merge that returns line-numbered errors or rewrites to the server form; inspect sync state in a sidebar, run selective-module pulls, and keep freeform note regions."

    stats: {
        downloads:  19
        updated_at: 1785501000000
    }
}
```

[^template]: [[Obsidian plugin]]
