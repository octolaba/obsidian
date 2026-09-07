---
uid: 244bf19d-6a4e-5121-8763-53ad33059b7b
xid:
  - hackernews-comments
aliases:
  - hackernews-comments
  - Hacker News Comments
  - gapmiss/hackernews-comments
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/hackernews-comments
alt:
  - https://github.com/gapmiss/hackernews-comments
downloads: 116
updated at: "2026-07-17T22:48:33Z"
related to:
  - "[[GitHub - 986691213]]"
remind me:
---

# Hacker News Comments

Fetches the comments of a Hacker News post and saves them as a Markdown note, preserving thread indentation and including post metadata and comment counts. HTML is converted to safe Markdown, usernames are linked and timestamps kept, and filenames are built from template variables.

```cue
plugin: {
    id:     "hackernews-comments"
    name:   "Hacker News Comments"
    author: "gapmiss"
    repo:   "gapmiss/hackernews-comments"

    html_url:    "https://community.obsidian.md/plugins/hackernews-comments"
    github_url:  "https://github.com/gapmiss/hackernews-comments"
    description: "Scrape comments from Hacker News posts and create markdown notes with threaded comments. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Fetch and save Hacker News comments as Markdown notes. Preserve threaded indentation and include post metadata and comment counts. Convert HTML to safe Markdown, add linked usernames and timestamps, and customize filenames with template variables."

    stats: {
        downloads:  116
        updated_at: 1784328513000
    }
}
```

[^template]: [[Obsidian plugin]]
