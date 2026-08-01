---
uid: 2a3aaa3b-c1bd-5e78-a970-57c676fae50d
xid:
  - wayfinder-maps
aliases:
  - wayfinder-maps
  - Wayfinder Maps
  - ocuclaw/obsidian-wayfinder
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/wayfinder-maps
alt:
  - https://github.com/ocuclaw/obsidian-wayfinder
downloads: 23
updated at: "2026-07-20T23:53:27Z"
related to:
  - "[[GitHub - 1301713826]]"
remind me:
---

# Wayfinder Maps

Reads a GitHub repository's issues and renders each issue labelled wayfinder:map as a head card whose tickets form a dependency-layered tree built from GitHub's blocked-by edges, so open, verified-unblocked and unassigned tickets stand out as the frontier. Ticket types are colour-coded, and each card records whether it is delegable to an agent, needs a human, or either. Frontier tickets can be batch-selected for handoffs, a detail modal shows rendered descriptions and live comments, and several repositories are tracked with per-repo tokens and a view filter. Tree and list modes, zoom and a compact mobile layout are offered, and the view syncs every two minutes while open.

```cue
plugin: {
    id:     "wayfinder-maps"
    name:   "Wayfinder Maps"
    author: "Matthew Ford"
    repo:   "ocuclaw/obsidian-wayfinder"

    html_url:    "https://community.obsidian.md/plugins/wayfinder-maps"
    github_url:  "https://github.com/ocuclaw/obsidian-wayfinder"
    description: "Wayfinder Maps turns a GitHub repo's issues into a live picture of what to work on next. Each issue labeled wayfinder:map renders as a head card with its tickets laid out in a dependency-layered tree, - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Wayfinder Maps turns a GitHub repo's issues into a live picture of what to work on next. Each issue labeled wayfinder:map renders as a head card with its tickets laid out in a dependency-layered tree, drawn from GitHub's native blocked-by edges — so the frontier (open, verified-unblocked, unassigned tickets) is always one glance away. Built for the wayfinder workflow from Matt Pocock's skills repo: ticket types (research, prototype, grilling, task) are color-coded, and each card shows whether it's delegable to an agent (AFK), needs a human (HITL), or either. Copy a /wayfinder command with one click — a live claim check makes sure you never grab a ticket someone just took. Batch-select frontier tickets for handoffs, open a detail modal with rendered descriptions and live comments, and track multiple repos with per-repo tokens and a view filter. Tree and list modes, zoom, and a compact mobile layout; syncs every 2 minutes while open."

    stats: {
        downloads:  23
        updated_at: 1784591607000
    }
}
```

[^template]: [[Obsidian plugin]]
