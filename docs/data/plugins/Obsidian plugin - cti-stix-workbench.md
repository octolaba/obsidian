---
uid: 4a573971-6783-5a37-95b6-0027acdf03c3
xid:
  - cti-stix-workbench
aliases:
  - cti-stix-workbench
  - CTI STIX Workbench
  - rx4747/cti-stix-workbench
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/cti-stix-workbench
alt:
  - https://github.com/rx4747/cti-stix-workbench
downloads: 44
updated at: "2026-07-28T16:23:04Z"
related to:
  - "[[GitHub - 1312991923]]"
remind me:
---

# CTI STIX Workbench

Creates and edits STIX 2.1 objects, connects them through Markdown notes and Canvas files, and shows an investigation as an interactive icon-based graph with relationships, references, filtering, pan, zoom and property inspection. Notes, folders, Canvas files or a whole vault are validated against pinned local schemas and exported as deterministic JSON Bundles. The viewer also opens STIX JSON directly. Everything runs locally on desktop, without accounts, telemetry or a cloud dependency.

```cue
plugin: {
    id:     "cti-stix-workbench"
    name:   "CTI STIX Workbench"
    author: "rx4747"
    repo:   "rx4747/cti-stix-workbench"

    html_url:    "https://community.obsidian.md/plugins/cti-stix-workbench"
    github_url:  "https://github.com/rx4747/cti-stix-workbench"
    description: "Create, visualize, validate, and export local STIX 2.1 intelligence from Obsidian notes, Canvas files, folders, or JSON Bundles. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Create and edit standard STIX 2.1 objects, connect them through Markdown notes and Canvas, and inspect investigations in an interactive icon-based graph. Validate notes, folders, Canvas files, or a complete vault against pinned local schemas, then export deterministic JSON Bundles. The viewer supports STIX JSON and connected typed notes with relationships, references, filtering, pan, zoom, and property inspection. Everything runs locally with no accounts, telemetry, cloud dependency, or runtime network requests. The scorecard's three reported network calls are a scanner false positive: they are local parser token-buffer methods named fetch, not HTTP requests. No vault data leaves the device. Desktop only. Use the separate CTI Investigation Vault repository for ready-made analyst templates."

    stats: {
        downloads:  44
        updated_at: 1785255784000
    }
}
```

[^template]: [[Obsidian plugin]]
