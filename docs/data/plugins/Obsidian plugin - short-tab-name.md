---
uid: 7f33ff69-c5c8-5e17-89f7-869c381b5c80
xid:
  - short-tab-name
aliases:
  - short-tab-name
  - short tab name
  - shumpei-tanaka/obsidian-short-tab-name
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/short-tab-name
alt:
  - https://github.com/shumpei-tanaka/obsidian-short-tab-name
downloads: 2280
updated at: "2023-11-23T13:36:18Z"
related to:
  - "[[GitHub - 722583053]]"
remind me:
---

# short tab name

The short tab name plugin shortens tab titles by hiding filename prefixes such as zettel UIDs, which suits vaults whose filenames begin with an identifier. A regular expression controls which part of the filename is stripped from the tab.

```cue
plugin: {
    id:     "short-tab-name"
    name:   "short tab name"
    author: "shumpei-tanaka"
    repo:   "shumpei-tanaka/obsidian-short-tab-name"

    html_url:    "https://community.obsidian.md/plugins/short-tab-name"
    github_url:  "https://github.com/shumpei-tanaka/obsidian-short-tab-name"
    description: "Set tab name to short for UID user."
    about:       "Hide filename prefixes like zettel UIDs from tab titles to show concise, readable names. Specify a regular expression to control which parts of the filename get stripped from the tab."

    stats: {
        downloads:  2280
        updated_at: 1700746578000
    }
}
```

[^template]: [[Obsidian plugin]]
