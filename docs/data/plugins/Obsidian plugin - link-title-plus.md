---
uid: 89bdef10-b416-5873-b37e-9379a2698186
xid:
  - link-title-plus
aliases:
  - link-title-plus
  - Link Title Plus
  - abnerzhao/obsidian-link-title-plus
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/link-title-plus
alt:
  - https://github.com/abnerzhao/obsidian-link-title-plus
downloads: 39
updated at: "2026-07-30T15:59:57Z"
related to:
  - "[[GitHub - 1311153152]]"
remind me:
---

# Link Title Plus

Converts a pasted HTTP or HTTPS URL into a configurable Markdown link by fetching the page title and favicon. The title is taken from Open Graph or Twitter metadata and falls back to the page title element, YouTube links go through oEmbed, and the favicon is embedded as inline data rather than hotlinked. Metadata can be fetched through an HTTP, HTTPS or SOCKS5 proxy.

```cue
plugin: {
    id:     "link-title-plus"
    name:   "Link Title Plus"
    author: "Abnerzhao"
    repo:   "abnerzhao/obsidian-link-title-plus"

    html_url:    "https://community.obsidian.md/plugins/link-title-plus"
    github_url:  "https://github.com/abnerzhao/obsidian-link-title-plus"
    description: "将粘贴的 URL 转换为带标题和图标的链接。 - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Paste an HTTP(S) URL to automatically fetch the page title and favicon and generate a configurable Markdown link. Prefer Open Graph/Twitter titles with fallback to the page <title>, embed favicon as inline data to avoid hotlinking, use oEmbed for YouTube, and support HTTP/HTTPS/SOCKS5 proxies for metadata fetching."

    stats: {
        downloads:  39
        updated_at: 1785427197000
    }
}
```

[^template]: [[Obsidian plugin]]
