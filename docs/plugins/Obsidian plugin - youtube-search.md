---
uid: 3f466919-f0d5-5f2e-af94-6e69899af8bd
xid:
  - youtube-search
aliases:
  - youtube-search
  - YouTube Search
  - plasch/obsidian-youtube-search-plugin
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/youtube-search
alt:
  - https://github.com/plasch/obsidian-youtube-search-plugin
downloads: 205
updated at: "2026-05-31T12:56:14Z"
related to:
  - "[[GitHub - 1254280585]]"
remind me:
---

# YouTube Search

Creates a note from any YouTube URL with frontmatter holding title, url, videoId, channelName, channelUrl, thumbnailUrl, publishedAt, viewCount and tags. The URL is auto-filled from the clipboard, metadata and thumbnail are previewed first, thumbnails are optionally downloaded locally, and the note comes from a customizable template with placeholders.

```cue
plugin: {
    id:     "youtube-search"
    name:   "YouTube Search"
    author: "plasch"
    repo:   "plasch/obsidian-youtube-search-plugin"

    html_url:    "https://community.obsidian.md/plugins/youtube-search"
    github_url:  "https://github.com/plasch/obsidian-youtube-search-plugin"
    description: "Search YouTube videos by link and automatically create notes with video metadata. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Create Obsidian notes from any YouTube URL with rich frontmatter (title, url, videoId, channelName, channelUrl, thumbnailUrl, publishedAt, viewCount, tags). Auto-fill the URL from your clipboard, preview video metadata and thumbnail, optionally download thumbnails locally, and use a fully customizable note template with {{placeholders}}."

    stats: {
        downloads:  205
        updated_at: 1780232174000
    }
}
```

[^template]: [[Obsidian plugin]]
