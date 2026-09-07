---
uid: 315ecb62-dd60-5d5a-b2c6-842cfc479dc2
xid:
  - basalt-causeway
aliases:
  - basalt-causeway
  - Basalt Causeway
  - kpndevroot/obsidian-basalt-causeway
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/basalt-causeway
alt:
  - https://github.com/kpndevroot/obsidian-basalt-causeway
downloads: 30
updated at: "2026-08-10T06:36:49Z"
related to:
  - "[[GitHub - 1320478336]]"
remind me:
---

# Basalt Causeway

Publishes a vault to a GitHub repository so its notes can be read and synced with Basalt on a phone. Each sync is written as a single atomic commit through the Git Data Trees API, which lets it run on desktop and mobile without a git binary. Conflicts are detected and surfaced for two-way syncing.

```cue
plugin: {
    id:     "basalt-causeway"
    name:   "Basalt Causeway"
    author: "kpndevroot"
    repo:   "kpndevroot/obsidian-basalt-causeway"

    html_url:    "https://community.obsidian.md/plugins/basalt-causeway"
    github_url:  "https://github.com/kpndevroot/obsidian-basalt-causeway"
    description: "Publish this vault to a GitHub repo so Basalt can read it on mobile. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Publish your Obsidian vault to a GitHub repository and sync notes with Basalt on your phone. Create one atomic commit per sync via the Git Data Trees API, run on desktop and mobile without a git binary, and detect and surface conflicts for reliable two-way syncing."

    stats: {
        downloads:  30
        updated_at: 1786343809000
    }
}
```

[^template]: [[Obsidian plugin]]
