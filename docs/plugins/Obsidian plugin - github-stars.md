---
uid: 1f14f009-1bb7-580c-b90d-ede0e50ef7d3
xid:
  - github-stars
aliases:
  - github-stars
  - GitHub Stars
  - flyingnobita/obsidian-github-stars
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/github-stars
alt:
  - https://github.com/flyingnobita/obsidian-github-stars
downloads: 585
updated at: "2026-07-21T05:55:54Z"
related to:
  - "[[GitHub - 948633251]]"
remind me:
---

# GitHub Stars

Displays the star count of GitHub repositories mentioned in notes, beside repository links in Reading View and Live Preview, and can embed the count into the Markdown itself so it remains visible outside Obsidian. Counts are cached to reduce API requests, abbreviated formatting is supported and an optional GitHub API token raises rate limits, with commands to refresh, embed or remove counts.

```cue
plugin: {
    id:     "github-stars"
    name:   "GitHub Stars"
    author: "flyingnobita"
    repo:   "flyingnobita/obsidian-github-stars"

    html_url:    "https://community.obsidian.md/plugins/github-stars"
    github_url:  "https://github.com/flyingnobita/obsidian-github-stars"
    description: "Displays the number of stars for GitHub repositories mentioned in notes."
    about:       "Display GitHub star counts next to repository links in Reading View and Live Preview, and embed star counts directly into Markdown for visibility outside Obsidian. Cache counts to reduce API requests, support abbreviated formatting and optional GitHub API token for higher rate limits, and provide commands to refresh, embed, or remove counts."

    stats: {
        downloads:  585
        updated_at: 1784613354000
    }
}
```

[^template]: [[Obsidian plugin]]
