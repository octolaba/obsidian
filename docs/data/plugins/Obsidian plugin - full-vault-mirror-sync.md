---
uid: 2b9c70f3-c17e-520c-9b2b-64f940861a2e
xid:
  - full-vault-mirror-sync
aliases:
  - full-vault-mirror-sync
  - Full Vault Mirror Sync
  - lesteraiagent/obsidian-full-vault-mirror-sync
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/full-vault-mirror-sync
alt:
  - https://github.com/lesteraiagent/obsidian-full-vault-mirror-sync
downloads: 79
updated at: "2026-06-02T09:07:08Z"
related to:
  - "[[GitHub - 1256771738]]"
remind me:
---

# Full Vault Mirror Sync

Mirrors a source folder to a target folder on Windows using robocopy in mirror mode, a one-way source-to-target sync. Paths are validated and the first non-empty sync is confirmed before it runs; syncing is manual or automatic on a timer or at startup, with post-sync metadata checks and automatic retries.

```cue
plugin: {
    id:     "full-vault-mirror-sync"
    name:   "Full Vault Mirror Sync"
    author: "Lester Lai"
    repo:   "lesteraiagent/obsidian-full-vault-mirror-sync"

    html_url:    "https://community.obsidian.md/plugins/full-vault-mirror-sync"
    github_url:  "https://github.com/lesteraiagent/obsidian-full-vault-mirror-sync"
    description: "Mirror a source folder to a target folder using Windows robocopy. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Mirror your Obsidian vault to a local Windows folder using robocopy /MIR for one-way source-to-target sync. Validate paths and confirm before the first non-empty sync; offer manual or timer/startup automatic sync with post-sync metadata checks and automatic retries."

    stats: {
        downloads:  79
        updated_at: 1780391228000
    }
}
```

[^template]: [[Obsidian plugin]]
