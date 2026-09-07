---
uid: 4c931c34-6f4a-5e82-82ef-dae04c7c71ef
xid:
  - name-guard
aliases:
  - name-guard
  - NameGuard
  - toadfans/NameGuard
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/name-guard
alt:
  - https://github.com/toadfans/NameGuard
downloads: 148
updated at: "2026-06-08T03:11:18Z"
related to:
  - "[[GitHub - 1261825816]]"
remind me:
---

# NameGuard

Enforces unique note names across the vault so Obsidian never silently rewrites shortest-format wikilinks when a duplicate appears. New notes, create-from-link, templates, moves and renames that would introduce a collision are blocked, and the check is aware of shortest-path resolution. The recorded text states that it runs locally with no network access and no telemetry.

```cue
plugin: {
    id:     "name-guard"
    name:   "NameGuard"
    author: "astroyhs"
    repo:   "toadfans/NameGuard"

    html_url:    "https://community.obsidian.md/plugins/name-guard"
    github_url:  "https://github.com/toadfans/NameGuard"
    description: "Strictly enforce vault-wide unique note names. Blocks new notes (and moves/renames) that would collide with an existing name, so shortest-format links are never silently rewritten. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Keep every note name unique and prevent Obsidian from silently rewriting wikilinks when a duplicate appears. Block new-note creation, create-from-link, templates, moves, and renames that would introduce name collisions (shortest-path-aware) so links stay stable and diffs stay clean. Run locally with no network or telemetry."

    stats: {
        downloads:  148
        updated_at: 1780888278000
    }
}
```

[^template]: [[Obsidian plugin]]
