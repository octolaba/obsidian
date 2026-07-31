---
uid: d278924b-d8d8-5e2e-8b6e-25ca95dc4d70
xid:
  - hidden-folders-access
aliases:
  - hidden-folders-access
  - Hidden Folders Access
  - dsebastien/obsidian-hidden-folders-access
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/hidden-folders-access
alt:
  - https://github.com/dsebastien/obsidian-hidden-folders-access
downloads: 8791
updated at: "2026-07-17T07:38:22Z"
related to:
  - "[[GitHub - 1211521735]]"
remind me:
---

# Hidden Folders Access

Hidden Folders Access makes dot-prefixed root-level folders visible to Obsidian's interface and index while their names on disk stay unchanged. The chosen hidden folders are injected into the vault cache, so the explorer, search, graph, Bases, Dataview and other plugins see live files. A filesystem watcher keeps those entries updated, and disabling the plugin removes them cleanly.

```cue
plugin: {
    id:     "hidden-folders-access"
    name:   "Hidden Folders Access"
    author: "Sébastien Dubois"
    repo:   "dsebastien/obsidian-hidden-folders-access"

    html_url:    "https://community.obsidian.md/plugins/hidden-folders-access"
    github_url:  "https://github.com/dsebastien/obsidian-hidden-folders-access"
    description: "Make Obsidian index hidden root-level folders (e.g. .claude) so they appear in the file tree, metadata cache, and Bases. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Expose dot-prefixed root folders to Obsidian's UI and index while keeping their on-disk names unchanged. Inject chosen hidden folders into the vault cache so explorer, search, graph, Bases, Dataview and other plugins see live files, with filesystem-watcher updates and clean removal when disabled."

    stats: {
        downloads:  8791
        updated_at: 1784273902000
    }
}
```

[^template]: [[Obsidian plugin]]
