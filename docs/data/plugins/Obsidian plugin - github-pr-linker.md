---
uid: 955019be-ee77-5fd5-8562-b35dbb6eb15f
xid:
  - github-pr-linker
aliases:
  - github-pr-linker
  - GitHub PR Linker
  - thequietmind/obsidian-github-linker
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/github-pr-linker
alt:
  - https://github.com/thequietmind/obsidian-github-linker
downloads: 33
updated at: "2026-07-23T16:10:11Z"
related to:
  - "[[GitHub - 1309298885]]"
remind me:
---

# GitHub PR Linker

Converts GitHub pull request references written as repo#123 or owner/repo#123 into Markdown links. A reference is selected and a command replaces it with a link to the pull request URL, keeping the original text as the label. References without an owner use the configured default GitHub owner.

```cue
plugin: {
    id:     "github-pr-linker"
    name:   "GitHub PR Linker"
    author: "Quiet Mind Creative"
    repo:   "thequietmind/obsidian-github-linker"

    html_url:    "https://community.obsidian.md/plugins/github-pr-linker"
    github_url:  "https://github.com/thequietmind/obsidian-github-linker"
    description: "Turn GitHub pull request references like repo#123 into Markdown links. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Turn GitHub pull request references like repo#123 or owner/repo#123 into Markdown links. Select a reference and run the command to replace it with a link to the PR URL. Preserve the original text as the link label and use your configured default GitHub owner for ownerless references."

    stats: {
        downloads:  33
        updated_at: 1784823011000
    }
}
```

[^template]: [[Obsidian plugin]]
