---
uid: 86175e29-72e5-5b77-a111-2adffc17c2bd
xid:
  - pkvs
aliases:
  - pkvs
  - Persistent Key-Value Store
  - iamrecursion/obsidian-pkvs
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/pkvs
alt:
  - https://github.com/iamrecursion/obsidian-pkvs
downloads: 1654
updated at: "2026-04-23T17:05:58Z"
related to:
  - "[[GitHub - 738182810]]"
remind me:
---

# Persistent Key-Value Store

Persistent Key-Value Store exposes a persistent key-value store as a window property for use from scripts in Templater, Dataview and custom JavaScript. Values persist across template and query runs and across synced devices, and the state can be inspected in a built-in portable web inspector. The recorded About text warns against storing or loading untrusted data because serialization is eval-based.

```cue
plugin: {
    id:     "pkvs"
    name:   "Persistent Key-Value Store"
    author: "iamrecursion"
    repo:   "iamrecursion/obsidian-pkvs"

    html_url:    "https://community.obsidian.md/plugins/pkvs"
    github_url:  "https://github.com/iamrecursion/obsidian-pkvs"
    description: "Provides a persistent key-value store for use in scripts in Obsidian."
    about:       "Expose a persistent key-value store as window.pkvs for use in Obsidian scripts (Templater, Dataview, custom JS). Persist values across template/query runs and synced devices, and inspect state with a built-in portable web inspector. Avoid storing or loading untrusted data due to eval-based serialization."

    stats: {
        downloads:  1654
        updated_at: 1776963958000
    }
}
```

[^template]: [[Obsidian plugin]]
