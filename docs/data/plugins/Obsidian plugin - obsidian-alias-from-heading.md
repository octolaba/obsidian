---
uid: 2dfd1f2f-62f0-58c9-bb24-e626f362a32a
xid:
  - obsidian-alias-from-heading
aliases:
  - obsidian-alias-from-heading
  - Alias from heading
  - basham/obsidian-alias-from-heading
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/obsidian-alias-from-heading
alt:
  - https://github.com/basham/obsidian-alias-from-heading
downloads: 5933
updated at: "2024-07-18T19:27:21Z"
related to:
  - "[[GitHub - 500891583]]"
remind me:
---

# Alias from heading

Alias from heading implicitly adds an alias matching a document's first heading and makes it available wherever YAML aliases are accepted. Link display names stay in step with heading changes while manually customized display names are preserved, in both wikilink and Markdown formats. Aliases declared in YAML keep their normal behaviour and their links are not auto-updated.

```cue
plugin: {
    id:     "obsidian-alias-from-heading"
    name:   "Alias from heading"
    author: "Chris Basham"
    repo:   "basham/obsidian-alias-from-heading"

    html_url:    "https://community.obsidian.md/plugins/obsidian-alias-from-heading"
    github_url:  "https://github.com/basham/obsidian-alias-from-heading"
    description: "Implicitly add an alias matching the first heading in a document."
    about:       "Add an implicit alias to each note based on its first heading and make it available wherever YAML aliases are accepted. Keep link display names synced with heading changes while preserving manually customized display names; support both Wikilink and Markdown formats. Preserve YAML aliases' normal behavior without auto-updating their associated links."

    stats: {
        downloads:  5933
        updated_at: 1721330841000
    }
}
```

[^template]: [[Obsidian plugin]]
