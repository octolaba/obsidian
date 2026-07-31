---
uid: 5194f205-2749-5043-b7aa-7e1ac63bafe5
xid:
  - stacktube
aliases:
  - stacktube
  - StackTube
  - bije0327/obsidian-stacktube
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/stacktube
alt:
  - https://github.com/bije0327/obsidian-stacktube
downloads: 78
updated at: "2026-07-05T09:35:11Z"
related to:
  - "[[GitHub - 1259349536]]"
remind me:
---

# StackTube

Notes for monitored YouTube channels are pulled from the StackTube API into the vault as Markdown files with YAML frontmatter carrying video_id, channel, title, video_url, published_at, language and tags. The summaries are AI-structured, duplicates are avoided on repeated syncs, and the resulting notes remain searchable and usable with Dataview and the graph view.

```cue
plugin: {
    id:     "stacktube"
    name:   "StackTube"
    author: "unstackd"
    repo:   "bije0327/obsidian-stacktube"

    html_url:    "https://community.obsidian.md/plugins/stacktube"
    github_url:  "https://github.com/bije0327/obsidian-stacktube"
    description: "Sync your StackTube YouTube knowledge notes into your vault. Pulls AI-structured notes for monitored YouTube channels via the StackTube API. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Sync YouTube video notes into your vault as clean Markdown files with YAML frontmatter for video_id, channel, title, video_url, published_at, language, and tags. Pull AI‑structured summaries from StackTube, avoid duplicates, and keep notes searchable and compatible with Dataview and graph view."

    stats: {
        downloads:  78
        updated_at: 1783244111000
    }
}
```

[^template]: [[Obsidian plugin]]
