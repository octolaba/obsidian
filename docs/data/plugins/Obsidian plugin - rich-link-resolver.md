---
uid: 9a026bc3-77eb-5149-92e3-7acf0b9ce043
xid:
  - rich-link-resolver
aliases:
  - rich-link-resolver
  - Rich Link Resolver
  - almeidazs/rich-link-obsidian
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/rich-link-resolver
alt:
  - https://github.com/almeidazs/rich-link-obsidian
downloads: 165
updated at: "2026-05-26T18:56:11Z"
related to:
  - "[[GitHub - 1249130000]]"
remind me:
---

# Rich Link Resolver

Rich Link Resolver converts a pasted or selected URL into a Markdown rich link carrying the page title and favicon. Resolution runs automatically from the clipboard or through a command or context action, showing a loading placeholder while fetching. Favicons are cached as stable 16x16 local images, and the plugin falls back to a plain Markdown link when a favicon cannot be used.

```cue
plugin: {
    id:     "rich-link-resolver"
    name:   "Rich Link Resolver"
    author: "Almeida"
    repo:   "almeidazs/rich-link-obsidian"

    html_url:    "https://community.obsidian.md/plugins/rich-link-resolver"
    github_url:  "https://github.com/almeidazs/rich-link-obsidian"
    description: "Converts pasted or selected URLs into markdown rich links with favicon and title. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Convert pasted or selected URLs into Markdown rich links that include the page title and favicon. Resolve links automatically from the clipboard or via command/context action, show a Loading URL... placeholder while fetching, cache favicons as stable 16×16 local images, and fall back to plain Markdown links if a favicon can't be used."

    stats: {
        downloads:  165
        updated_at: 1779821771000
    }
}
```

[^template]: [[Obsidian plugin]]
