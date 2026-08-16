---
uid: d3d8e6d5-8f41-5d2f-81af-162a60e0f3ee
xid:
  - leetlog-bridge
aliases:
  - leetlog-bridge
  - LeetLog Bridge
  - yzyhhhstudy/leetlog
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/leetlog-bridge
alt:
  - https://github.com/yzyhhhstudy/leetlog
downloads: 60
updated at: "2026-07-06T06:50:22Z"
related to:
  - "[[GitHub - 1288597438]]"
remind me:
---

# LeetLog Bridge

LeetLog Bridge receives events from the LeetLog browser extension and writes LeetCode practice notes into the vault. A timer starts on the first keystroke, submissions are counted, and accepted code together with runtime and memory statistics is saved automatically. Every attempt accumulates in the same note and all of the data stays local to the vault.

```cue
plugin: {
    id:     "leetlog-bridge"
    name:   "LeetLog Bridge"
    author: "YzYhhhstudy"
    repo:   "yzyhhhstudy/leetlog"

    html_url:    "https://community.obsidian.md/plugins/leetlog-bridge"
    github_url:  "https://github.com/yzyhhhstudy/leetlog"
    description: "Receives events from the LeetLog browser extension and auto-writes LeetCode practice notes (timing, submissions, accepted code) into your vault. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Capture LeetCode sessions into structured Obsidian notes, auto-saving code plus runtime and memory stats when a submission is accepted. Start a timer on first keystroke, count submissions and accumulate every attempt in the same note while keeping all data local to your vault."

    stats: {
        downloads:  60
        updated_at: 1783320622000
    }
}
```

[^template]: [[Obsidian plugin]]
