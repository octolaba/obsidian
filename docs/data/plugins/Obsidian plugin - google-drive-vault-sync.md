---
uid: 8c1d4d4c-7e7e-587b-b742-da4416650db8
xid:
  - google-drive-vault-sync
aliases:
  - google-drive-vault-sync
  - Google Drive Vault Sync
  - haniewicz/ObsidianGoogleDriveSync
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/google-drive-vault-sync
alt:
  - https://github.com/haniewicz/ObsidianGoogleDriveSync
downloads: 541
updated at: "2026-07-04T07:10:42Z"
related to:
  - "[[GitHub - 1284711760]]"
remind me:
---

# Google Drive Vault Sync

Syncs a vault two ways with Google Drive, authenticating through the OAuth 2.0 device authorization flow. Local changes are detected with a debounce and the cloud is watched for remote updates, sync can also be run manually, and conflicts are handled according to configurable policies. Per-device status is shown, and reset or restore operations work from manifest snapshots.

```cue
plugin: {
    id:     "google-drive-vault-sync"
    name:   "Google Drive Vault Sync"
    author: "Haniewicz"
    repo:   "haniewicz/ObsidianGoogleDriveSync"

    html_url:    "https://community.obsidian.md/plugins/google-drive-vault-sync"
    github_url:  "https://github.com/haniewicz/ObsidianGoogleDriveSync"
    description: "Two-way auto/manual sync for an Obsidian vault using Google Drive. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Sync your Obsidian vault two-way with Google Drive via the OAuth 2.0 Device Authorization Flow. Detect local changes with debounce, watch the cloud for remote updates, run manual syncs, handle conflicts with policy options, view per-device status, and perform safe reset/restore with manifest snapshots."

    stats: {
        downloads:  541
        updated_at: 1783149042000
    }
}
```

[^template]: [[Obsidian plugin]]
