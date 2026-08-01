---
uid: 887e15c0-62c3-59bc-ad1c-85f2a4980f10
xid:
  - clojure-plugin-host
aliases:
  - clojure-plugin-host
  - Clojure Plugin Host
  - farcaller/obsidian-clojure-plugin-host
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/clojure-plugin-host
alt:
  - https://github.com/farcaller/obsidian-clojure-plugin-host
downloads: 177
updated at: "2024-10-06T20:18:59Z"
related to:
  - "[[GitHub - 867988662]]"
remind me:
---

# Clojure Plugin Host

Hosts small Clojure plugins written as notes inside the editor, evaluated through SCI. A note tagged as a clojure plugin carries a single Clojure code block whose on-load form initializes the behaviour and interacts with the Obsidian interface. Dataview is required for it to run.

```cue
plugin: {
    id:     "clojure-plugin-host"
    name:   "Clojure Plugin Host"
    author: "farcaller"
    repo:   "farcaller/obsidian-clojure-plugin-host"

    html_url:    "https://community.obsidian.md/plugins/clojure-plugin-host"
    github_url:  "https://github.com/farcaller/obsidian-clojure-plugin-host"
    description: "A Clojure plugin host, allowing the creation of simple Clojure-based plugins right inside the editor."
    about:       "Author simple Clojure (SCI) plugins directly inside Obsidian as notes. Tag a note clojure-plugin and include a single Clojure code block with an on-load form to initialize behavior and interact with the Obsidian UI. Require Dataview to run."

    stats: {
        downloads:  177
        updated_at: 1728245939000
    }
}
```

[^template]: [[Obsidian plugin]]
