---
uid: 294709a9-e01a-5806-801a-9addbedbe259
xid:
  - openloops-hidden-files
aliases:
  - openloops-hidden-files
  - OpenLoops Hidden Files
  - tonymio/openloops-hidden-files
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/openloops-hidden-files
alt:
  - https://github.com/tonymio/openloops-hidden-files
downloads: 30
updated at: "2026-07-17T17:17:49Z"
related to:
  - "[[GitHub - 1304165672]]"
remind me:
---

# OpenLoops Hidden Files

OpenLoops Hidden Files reveals a chosen list of dot-folders such as .claude or .github in the native file explorer, and in search, graph and the metadata cache, by injecting them into the vault index rather than writing to disk. Only the folders named explicitly are shown, which avoids scanning heavy directories. It is desktop only, deactivates itself if Obsidian internals change, and revealed folders become visible to other Obsidian features and plugins.

```cue
plugin: {
    id:     "openloops-hidden-files"
    name:   "OpenLoops Hidden Files"
    author: "Tony Maltais"
    repo:   "tonymio/openloops-hidden-files"

    html_url:    "https://community.obsidian.md/plugins/openloops-hidden-files"
    github_url:  "https://github.com/tonymio/openloops-hidden-files"
    description: "Reveal a chosen list of dot-folders such as .claude or .github in the native file explorer tree. Desktop only, with per-folder opt-in. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Reveal chosen dot-folders (e.g. .github, .obsidian) in Obsidian's file explorer, search, graph, and metadata cache by injecting them into the vault index — no disk writes. Show only folders you name to avoid scanning heavy directories; desktop only and auto-deactivates if Obsidian internals change. Be aware revealed folders become visible to Obsidian features and plugins."

    stats: {
        downloads:  30
        updated_at: 1784308669000
    }
}
```

[^template]: [[Obsidian plugin]]
