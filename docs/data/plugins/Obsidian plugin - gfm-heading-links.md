---
uid: 00407d8b-0630-5b5b-970a-75a68bed416a
xid:
  - gfm-heading-links
aliases:
  - gfm-heading-links
  - GFM Heading Links
  - lucasgaldinos/obsidian-gfm-headers
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/gfm-heading-links
alt:
  - https://github.com/lucasgaldinos/obsidian-gfm-headers
downloads: 19
updated at: "2026-07-21T17:04:08Z"
related to:
  - "[[GitHub - 1288758368]]"
remind me:
---

# GFM Heading Links

Resolves GFM-style kebab-case heading links at runtime, so clicking one or hovering it with Ctrl jumps to the matching heading in Live Preview, Source and Reading views. It intercepts navigation and hover events to map slugs, including duplicate slugs, and updates editor autocomplete so completions insert GFM slugs while preserving aliases.

```cue
plugin: {
    id:     "gfm-heading-links"
    name:   "GFM Heading Links"
    author: "Lucas Galdino"
    repo:   "lucasgaldinos/obsidian-gfm-headers"

    html_url:    "https://community.obsidian.md/plugins/gfm-heading-links"
    github_url:  "https://github.com/lucasgaldinos/obsidian-gfm-headers"
    description: "Resolve GFM-style kebab-case heading links (e.g. #my-heading) at runtime — no export hacks, works in Live Preview and Reading view. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Resolve GFM-style kebab-case heading links at runtime so clicks and Ctrl+hover previews jump to the correct heading across Live Preview, Source, and Reading views. Intercept navigation and hover events to map slugs (including duplicate slugs) and update editor autocomplete to insert GFM slugs while preserving aliases."

    stats: {
        downloads:  19
        updated_at: 1784653448000
    }
}
```

[^template]: [[Obsidian plugin]]
