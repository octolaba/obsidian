---
uid: 95d54d6e-9295-51b0-9335-4395c9b65882
xid:
  - auto-replacer
aliases:
  - auto-replacer
  - Auto Replacer
  - alecell/auto-replacer
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/auto-replacer
alt:
  - https://github.com/alecell/auto-replacer
downloads: 2038
updated at: "2025-09-17T04:56:55Z"
related to:
  - "[[GitHub - 989851867]]"
remind me:
---

# Auto Replacer

Auto Replacer rewrites text in notes from regex rules paired with JavaScript transform functions, for uses such as formatting units, highlighting keywords or injecting dynamic content like the note title. Rules are created and managed in a visual UI and run on editor change with a debounce, with access to the editor and file context and to the file basename.

```cue
plugin: {
    id:     "auto-replacer"
    name:   "Auto Replacer"
    author: "alecell"
    repo:   "alecell/auto-replacer"

    html_url:    "https://community.obsidian.md/plugins/auto-replacer"
    github_url:  "https://github.com/alecell/auto-replacer"
    description: "Replace text in your notes automatically using regex rules and JavaScript functions."
    about:       "Replace text automatically in notes using custom regex patterns and JavaScript transform functions to format units, highlight keywords, or inject dynamic content like the note title. Create and manage rules in a visual UI; run rules on editor change with debounce and access editor/file context and {{file.basename}}."

    stats: {
        downloads:  2038
        updated_at: 1758085015000
    }
}
```

[^template]: [[Obsidian plugin]]
