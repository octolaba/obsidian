---
uid: 8330b24d-f670-5fa6-8806-79894998a39a
xid:
  - cleanshot-embed
aliases:
  - cleanshot-embed
  - CleanShot Embed
  - janacm/cleanshot-embed-obsidian
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/cleanshot-embed
alt:
  - https://github.com/janacm/cleanshot-embed-obsidian
downloads: 84
updated at: "2026-03-05T15:29:01Z"
related to:
  - "[[GitHub - 1173633924]]"
remind me:
---

# CleanShot Embed

Renders CleanShot share URLs as inline images in Reading view by fetching a fresh signed image URL at render time. Nothing is written into the vault, and the original link is shown if the fetch fails. It runs on desktop only because it bypasses CORS.

```cue
plugin: {
    id:     "cleanshot-embed"
    name:   "CleanShot Embed"
    author: "janacm"
    repo:   "janacm/cleanshot-embed-obsidian"

    html_url:    "https://community.obsidian.md/plugins/cleanshot-embed"
    github_url:  "https://github.com/janacm/cleanshot-embed-obsidian"
    description: "Renders CleanShot share URLs as inline images by fetching fresh signed URLs at render time. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Render CleanShot share URLs (cln.sh/XXXX) as inline images in Reading view. Fetch fresh signed image URLs at render time and display images without saving files to your vault, falling back to the original link if fetching fails. Run on desktop only due to CORS bypass requirements."

    stats: {
        downloads:  84
        updated_at: 1772724541000
    }
}
```

[^template]: [[Obsidian plugin]]
