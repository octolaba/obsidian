---
uid: 1ec48b20-0a8f-58d2-af14-a6b97dd854aa
xid:
  - vk-group-notifier
aliases:
  - vk-group-notifier
  - Vk group notifier
  - filichev-evgeny/obsidianvkupdatenotifier
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/vk-group-notifier
alt:
  - https://github.com/filichev-evgeny/obsidianvkupdatenotifier
downloads: 1272
updated at: "2023-12-26T11:48:39Z"
related to:
  - "[[GitHub - 711534947]]"
remind me:
---

# Vk group notifier

Vk group notifier tracks news posts from vk.com groups and shows them in the vault. Access is granted by authorizing a VK account, and authentication is handled by vk.com itself. A group is tracked by adding a vk-group-notifier codeblock naming it by name or id, with per-block options such as maxDays, pinLast and maxTextLength.

```cue
plugin: {
    id:     "vk-group-notifier"
    name:   "Vk group notifier"
    author: "filichev-evgeny"
    repo:   "filichev-evgeny/obsidianvkupdatenotifier"

    html_url:    "https://community.obsidian.md/plugins/vk-group-notifier"
    github_url:  "https://github.com/filichev-evgeny/obsidianvkupdatenotifier"
    description: "Track news posts from vk.com groups."
    about:       "Monitor new posts from vk.com groups and display them in your vault. Authorize with your VK account to grant group access; authentication is handled by vk.com. Add vk-group-notifier codeblocks with a group name or id in notes to track groups and set per-block options like maxDays, pinLast, and maxTextLength."

    stats: {
        downloads:  1272
        updated_at: 1703591319000
    }
}
```

[^template]: [[Obsidian plugin]]
