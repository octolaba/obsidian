---
uid: 7900f443-6970-538f-bf5d-12e7793a46bd
xid:
  - waymark
aliases:
  - waymark
  - Waymark
  - walktalkmeditate/pilgrim-obsidian
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/waymark
alt:
  - https://github.com/walktalkmeditate/pilgrim-obsidian
downloads: 90
updated at: "2026-06-02T00:18:22Z"
related to:
  - "[[GitHub - 1256399635]]"
remind me:
---

# Waymark

Imports Pilgrim exports and turns each walk into a Markdown note whose body is the transcribed voice reflection. A note carries namespaced waymark frontmatter such as date, distance, pace, steps and moon phase, labeled waypoints as wiki links, a timeline, weather, a sky section, embedded photos and an optional interactive route map that needs a Mapbox token. Place backlinks come from OpenStreetMap so walks in the same area cluster in the graph, and a generated dashboard collects Dataview tables of all walks, full-moon walks and longest reflections. Re-import is idempotent: existing notes update in place, and anything written outside the managed region is left alone.

```cue
plugin: {
    id:     "waymark"
    name:   "Waymark"
    author: "momentmaker"
    repo:   "walktalkmeditate/pilgrim-obsidian"

    html_url:    "https://community.obsidian.md/plugins/waymark"
    github_url:  "https://github.com/walktalkmeditate/pilgrim-obsidian"
    description: "Import Pilgrim (.pilgrim) walks as Markdown notes — your transcribed voice reflections become searchable, linkable text, with stats, waypoints, weather, and an optional route map. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Yours is accurate but dense. Lead with the value, bullet the features, and close with the two real differentiators — the safe-edit guarantee and local-first: Waymark imports your Pilgrim (.pilgrim) exports and turns each walk into a Markdown note you own — the transcribed voice reflection becomes the searchable, linkable body of the note. Each note carries: • Namespaced waymark-* frontmatter (date, distance, pace, steps, moon phase, and more) — Dataview-friendly • Labeled waypoints as [[wiki-links]], a timeline, weather, and a \"Sky\" section (moon phase, planetary hour, season) • Embedded photos, plus an optional interactive route map (bring your own free Mapbox token) • Place backlinks via OpenStreetMap, so walks from the same area cluster in your graph • A generated dashboard with Dataview tables: all walks, full-moon walks, longest reflections Re-import is idempotent: existing notes update in place and anything you write outside the managed region is never overwritten."

    stats: {
        downloads:  90
        updated_at: 1780359502000
    }
}
```

[^template]: [[Obsidian plugin]]
