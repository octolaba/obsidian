---
uid: de20f07a-9742-5ea8-afd1-e793e18d7093
xid:
  - alias-linker
aliases:
  - alias-linker
  - Alias Linker
  - johannrichard/alias-linker
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/alias-linker
alt:
  - https://github.com/johannrichard/alias-linker
downloads: 118
updated at: "2026-07-12T17:30:01Z"
related to:
  - "[[GitHub - 778476402]]"
remind me:
---

# Alias Linker

An experimental plugin that resolves a bare alias wikilink to the note defining that alias, used whenever no file matches the link text. A filename match still wins, and when several notes share an alias the nearest one is chosen. The resolution also applies in graph view, backlinks, embeds and previews.

```cue
plugin: {
    id:     "alias-linker"
    name:   "Alias Linker"
    author: "johannrichard"
    repo:   "johannrichard/alias-linker"

    html_url:    "https://community.obsidian.md/plugins/alias-linker"
    github_url:  "https://github.com/johannrichard/alias-linker"
    description: "An experimental Obsidian plugin that resolves bare alias links. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Link to notes by alias using bare [[alias]] wikilinks and resolve them to the note that defines that alias whenever a matching filename doesn’t exist. Keep standard filename links when a file matches, pick the nearest note if multiple share an alias, and apply alias resolution across graph view, backlinks, embeds, and previews."

    stats: {
        downloads:  118
        updated_at: 1783877401000
    }
}
```

[^template]: [[Obsidian plugin]]
