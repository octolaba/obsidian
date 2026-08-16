---
uid: e324e891-9b4c-580d-8ead-af346e3132e1
xid:
  - footprint-map
aliases:
  - footprint-map
  - Footprint Map
  - evanwong89/footprint-map
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/footprint-map
alt:
  - https://github.com/evanwong89/footprint-map
downloads: 59
updated at: "2026-07-27T16:35:52Z"
related to:
  - "[[GitHub - 1304575810]]"
remind me:
---

# Footprint Map

Renders a time-ordered travel diary from photos embedded in notes, drawing photo markers, places and dashed straight arrows that indicate visit order rather than routes. Footprints are stored as portable GeoJSON next to the note, each place links to local photos, and consecutive photos within 200 metres are grouped into one place. JPEG, HEIC and PNG metadata extraction, several basemap sources or none at all, and a static SVG fallback export are supported.

```cue
plugin: {
    id:     "footprint-map"
    name:   "Footprint Map"
    author: "evanwong"
    repo:   "evanwong89/footprint-map"

    html_url:    "https://community.obsidian.md/plugins/footprint-map"
    github_url:  "https://github.com/evanwong89/footprint-map"
    description: "Render local photo footprints as interactive time-ordered maps. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Render a time-ordered travel diary from photos embedded in notes, showing photo markers, places, and dashed straight arrows that indicate visit order rather than routes. Store footprints as portable GeoJSON next to the note and link each place to local photos; group consecutive photos within 200 metres into one place. Support JPEG, HEIC, and PNG metadata extraction, multiple basemap sources or no basemap, and export a static SVG fallback."

    stats: {
        downloads:  59
        updated_at: 1785170152000
    }
}
```

[^template]: [[Obsidian plugin]]
