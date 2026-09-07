---
uid: 027f5587-8026-5050-aeea-09026ff64bb4
xid:
  - bitwarden
aliases:
  - bitwarden
  - Bitwarden
  - toki1703/bitwarden
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/bitwarden
alt:
  - https://github.com/toki1703/bitwarden
downloads: 134
updated at: "2026-06-17T08:00:55Z"
related to:
  - "[[GitHub - 1243614274]]"
remind me:
---

# Bitwarden

This read-only plugin browses a Bitwarden vault in Obsidian's side panel, decrypting on the client once the master password unlocks it. Entries are searched by name, username or URL and viewed by type or by folder, with favorites and favicons, and usernames, passwords and auto-updating TOTP codes can be copied. Both cloud and self-hosted servers are supported.

```cue
plugin: {
    id:     "bitwarden"
    name:   "Bitwarden"
    author: "ときくん"
    repo:   "toki1703/bitwarden"

    html_url:    "https://community.obsidian.md/plugins/bitwarden"
    github_url:  "https://github.com/toki1703/bitwarden"
    description: "サイドパネルから Bitwarden の Vault を閲覧できる、読み取り専用のコミュニティプラグインです。 - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Browse your Bitwarden vault in Obsidian's side panel with client-side decryption and master-password unlock. Search by name, username or URL, switch between type and folder views, show favorites and favicons, and quick-copy usernames, passwords and auto-updating TOTP codes while supporting cloud and self-hosted servers."

    stats: {
        downloads:  134
        updated_at: 1781683255000
    }
}
```

[^template]: [[Obsidian plugin]]
