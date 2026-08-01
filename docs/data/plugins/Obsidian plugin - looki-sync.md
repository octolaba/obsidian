---
uid: ad88dcf4-070a-5a7c-947f-c4657228a5de
xid:
  - looki-sync
aliases:
  - looki-sync
  - Looki Sync
  - kidd911-cmd/obsidian-looki-sync
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/looki-sync
alt:
  - https://github.com/kidd911-cmd/obsidian-looki-sync
downloads: 36
updated at: "2026-07-17T06:25:16Z"
related to:
  - "[[GitHub - 1298299937]]"
remind me:
---

# Looki Sync

Syncs Looki Moments and For You items into per-date Daily Memory Markdown notes, merging same-day items into Moments and For You sections. Metadata such as title, description, place and time is written, location JSON is parsed, and images and videos are optionally downloaded and embedded. The target folder is configurable and each day's note stays idempotent under incremental or full resync. The recorded description is in Chinese; this summary follows the English About text.

```cue
plugin: {
    id:     "looki-sync"
    name:   "Looki Sync"
    author: "Jeremy Jin"
    repo:   "kidd911-cmd/obsidian-looki-sync"

    html_url:    "https://community.obsidian.md/plugins/looki-sync"
    github_url:  "https://github.com/kidd911-cmd/obsidian-looki-sync"
    description: "将 Looki 的日常数据与即时提示同步进 Obsidian，合并为按日期的「每日记忆」笔记。可配置目标文件夹，并选择是否同步图片/视频。 - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Sync Looki Moments and For You into per-date Daily Memory Markdown notes, merging same‑day items into Moments and For You sections. Write metadata (title, description, place, time), parse location JSON, optionally download/embed images/videos, and keep each day's note idempotent with incremental or full resync."

    stats: {
        downloads:  36
        updated_at: 1784269516000
    }
}
```

[^template]: [[Obsidian plugin]]
