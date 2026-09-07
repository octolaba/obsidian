---
uid: b380718d-5e91-58ce-87b5-5f0370a74cab
xid:
  - wechat-diary
aliases:
  - wechat-diary
  - WeChat Diary
  - artemislin/obsidian-wechat-diary
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/wechat-diary
alt:
  - https://github.com/artemislin/obsidian-wechat-diary
downloads: 1
updated at: "2026-08-11T15:58:07Z"
related to:
  - "[[GitHub - 1330984278]]"
remind me:
---

# WeChat Diary

Streams text and WeChat-transcribed voice messages from a bound WeChat bot into daily Markdown files at Diary/YYYY/YYYY-MM-DD.md in the vault. The bot switches between casual chat and diary modes, the last entry can be undone, and a day can be sealed. Writes are append-only and atomic plain text held locally, with optional polishing through OpenAI.

```cue
plugin: {
    id:     "wechat-diary"
    name:   "WeChat Diary"
    author: "artemislin"
    repo:   "artemislin/obsidian-wechat-diary"

    html_url:    "https://community.obsidian.md/plugins/wechat-diary"
    github_url:  "https://github.com/artemislin/obsidian-wechat-diary"
    description: "Capture diary entries and quick notes by chatting to a WeChat bot. Messages land in your vault as daily Markdown files. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Bind a WeChat bot once to stream texts and WeChat‑transcribed voice messages into daily Markdown files in Diary/YYYY/YYYY-MM-DD.md inside your vault. Switch between casual chat and diary modes, undo the last entry, seal the day, and keep append-only, atomic plain-text notes with optional OpenAI polishing while maintaining local data sovereignty."

    stats: {
        downloads:  1
        updated_at: 1786463887000
    }
}
```

[^template]: [[Obsidian plugin]]
