---
uid: f6585712-8ad4-587f-be42-3a35c229df93
xid:
  - cloudflare-media-sync
aliases:
  - cloudflare-media-sync
  - R2 Media Sync
  - fab34/cloudflare-media-sync
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/cloudflare-media-sync
alt:
  - https://github.com/fab34/cloudflare-media-sync
downloads: 130
updated at: "2026-06-18T14:58:37Z"
related to:
  - "[[GitHub - 1264834537]]"
remind me:
---

# R2 Media Sync

Detects local image links in notes, uploads the referenced files to Cloudflare R2 and rewrites the links to their public URLs. Markdown image links and wiki embeds are both recognized, the scan scope is configurable, local files can be cleaned up after upload, and R2 settings can be imported from EzImage. The recorded inputs aim it at vaults where PDF converters, importers or AI assistants leave local media behind.

```cue
plugin: {
    id:     "cloudflare-media-sync"
    name:   "R2 Media Sync"
    author: "Chiang Shun Fan"
    repo:   "fab34/cloudflare-media-sync"

    html_url:    "https://community.obsidian.md/plugins/cloudflare-media-sync"
    github_url:  "https://github.com/fab34/cloudflare-media-sync"
    description: "Upload local Obsidian media to Cloudflare R2 and rewrite note links automatically. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Automatically detect local image links in Markdown notes, upload the referenced files to Cloudflare R2, and replace them with public URLs. Designed for workflows where tools like PDF converters, importers, or AI assistants generate local media files inside your vault. Supports Markdown image links and wiki embeds, configurable scan scope, optional cleanup of local files after upload, and importing R2 settings from EzImage."

    stats: {
        downloads:  130
        updated_at: 1781794717000
    }
}
```

[^template]: [[Obsidian plugin]]
