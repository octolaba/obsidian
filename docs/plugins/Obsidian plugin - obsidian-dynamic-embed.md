---
uid: b40a6f74-f2fe-5a22-9874-6459055b4ff2
xid:
  - obsidian-dynamic-embed
aliases:
  - obsidian-dynamic-embed
  - Dynamic Embed
  - dabravin/obsidian-dynamic-embed
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/obsidian-dynamic-embed
alt:
  - https://github.com/dabravin/obsidian-dynamic-embed
downloads: 8942
updated at: "2022-03-09T09:18:37Z"
related to:
  - "[[GitHub - 464891147]]"
remind me:
---

# Dynamic Embed

Dynamic Embed embeds a file's contents into the current note and delegates the current scope to the embedded file, so it is treated as content instead of a reference. Whole files are imported for snippets, templates and other linkable material; heading and block anchors are not supported.

```cue
plugin: {
    id:     "obsidian-dynamic-embed"
    name:   "Dynamic Embed"
    author: "dabravin"
    repo:   "dabravin/obsidian-dynamic-embed"

    html_url:    "https://community.obsidian.md/plugins/obsidian-dynamic-embed"
    github_url:  "https://github.com/dabravin/obsidian-dynamic-embed"
    description: "Embed snippets, templates and any linkable by delegating the current scope to the embedded file, treating it as content instead of a reference."
    about:       "Embed file contents into the current note, delegating scope to the embedded file so it behaves as content instead of a reference. Import whole files for snippets, templates and other linkables; heading or block anchors (e.g. [[file#heading]]) aren’t supported."

    stats: {
        downloads:  8942
        updated_at: 1646817517000
    }
}
```

[^template]: [[Obsidian plugin]]
