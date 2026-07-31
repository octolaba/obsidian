---
uid: aef25d1d-36c0-59a4-9050-2969cb658402
xid:
  - smart-link-formatter
aliases:
  - smart-link-formatter
  - Smart Link Formatter
  - ccmdi/smart-link-formatter
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/smart-link-formatter
alt:
  - https://github.com/ccmdi/smart-link-formatter
downloads: 2047
updated at: "2026-05-13T19:06:52Z"
related to:
  - "[[GitHub - 983040482]]"
remind me:
---

# Smart Link Formatter

Smart Link Formatter fetches page metadata when a link is pasted, with explicit handling for YouTube, Twitter or X, Reddit, YouTube Music, GitHub and image links as well as ordinary URLs, making the first bracket pair the clickable link. The output is shaped with variables such as title, url, channel, duration, views, upload date and description, together with date formats, regular-expression replacements and domain blacklists.

```cue
plugin: {
    id:     "smart-link-formatter"
    name:   "Smart Link Formatter"
    author: "ccmdi"
    repo:   "ccmdi/smart-link-formatter"

    html_url:    "https://community.obsidian.md/plugins/smart-link-formatter"
    github_url:  "https://github.com/ccmdi/smart-link-formatter"
    description: "Automatically fetches page metadata from pasted links, with explicit support for specific websites."
    about:       "Format pasted links with metadata for YouTube, Twitter/X, Reddit, YouTube Music, GitHub, image links and regular URLs, making the first [] the clickable link. Use variables (title, url, channel, duration, views, upload_date, description, timestamp), date formats, regex replacements and domain blacklists to customize output."

    stats: {
        downloads:  2047
        updated_at: 1778699212000
    }
}
```

[^template]: [[Obsidian plugin]]
