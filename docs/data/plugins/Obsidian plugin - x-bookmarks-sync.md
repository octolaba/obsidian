---
uid: 86ba6e42-b64f-54f8-9cc4-e64e8801638c
xid:
  - x-bookmarks-sync
aliases:
  - x-bookmarks-sync
  - X Bookmarks Sync
  - hfknight/x-bookmarks-sync
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/x-bookmarks-sync
alt:
  - https://github.com/hfknight/x-bookmarks-sync
downloads: 1029
updated at: "2026-07-22T16:01:19Z"
related to:
  - "[[GitHub - 1181989433]]"
remind me:
---

# X Bookmarks Sync

Saves X bookmarks into the vault as structured Markdown notes whose frontmatter carries id, author, url, tags and date, plus a deep link back to the tweet. It reuses the existing browser session, so no API key or OAuth flow is involved, and imports selectively or incrementally while skipping duplicates. Viewed tweets and articles are also copied as Markdown from the embedded webview, which is desktop only.

```cue
plugin: {
    id:     "x-bookmarks-sync"
    name:   "X Bookmarks Sync"
    author: "feinix"
    repo:   "hfknight/x-bookmarks-sync"

    html_url:    "https://community.obsidian.md/plugins/x-bookmarks-sync"
    github_url:  "https://github.com/hfknight/x-bookmarks-sync"
    description: "Save your X (Twitter) bookmarks as structured Markdown notes, with selective import, incremental sync, and no API key needed. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Sync X (Twitter) bookmarks into your Obsidian vault as structured Markdown notes with YAML frontmatter (id, author, url, tags, date) and an obsidian:// deep-link back to the tweet. Use your existing browser session (no API key or OAuth), import selectively or incrementally, skip duplicates, and copy viewed tweets/articles as Markdown from the embedded webview (desktop only)."

    stats: {
        downloads:  1029
        updated_at: 1784736079000
    }
}
```

[^template]: [[Obsidian plugin]]
