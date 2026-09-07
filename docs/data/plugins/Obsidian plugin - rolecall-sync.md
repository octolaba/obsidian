---
uid: 8542a76e-f300-5dcc-baec-fb244c2f24fc
xid:
  - rolecall-sync
aliases:
  - rolecall-sync
  - RoleCall Sync
  - rolecall-games/rolecall-obsidian-sync
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/rolecall-sync
alt:
  - https://github.com/rolecall-games/rolecall-obsidian-sync
downloads: 20
updated at: "2026-08-06T19:52:43Z"
related to:
  - "[[GitHub - 1237368829]]"
remind me:
---

# RoleCall Sync

Syncs tabletop campaign notes to a Role Call game, converting Markdown notes and published media into renderable pages. Changes are pushed manually as incremental JSON batches authenticated with a per-game API token. Only files under the Published root are uploaded and GM or private folders stay local; the sync is upload-only, with no background syncing and no pull.

```cue
plugin: {
    id:     "rolecall-sync"
    name:   "RoleCall Sync"
    author: "rolecall.games"
    repo:   "rolecall-games/rolecall-obsidian-sync"

    html_url:    "https://community.obsidian.md/plugins/rolecall-sync"
    github_url:  "https://github.com/rolecall-games/rolecall-obsidian-sync"
    description: "Sync your Published/ notes to a Role Call game. GM notes stay private. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Sync TTRPG campaign notes to a Role Call game, converting Markdown notes and published media into renderable pages. Push changes manually as incremental JSON batches authenticated by a per-game API token; only files under your Published/ root are uploaded and GM/private folders stay local, upload-only with no background sync or pull."

    stats: {
        downloads:  20
        updated_at: 1786045963000
    }
}
```

[^template]: [[Obsidian plugin]]
