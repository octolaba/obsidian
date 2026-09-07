---
uid: 429cceda-d36b-596f-9146-8adcd7668b0a
xid:
  - cloudflare-rdo-sync
aliases:
  - cloudflare-rdo-sync
  - R2DO Sync
  - pc418/cloudflare-r2do-sync
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/cloudflare-rdo-sync
alt:
  - https://github.com/pc418/cloudflare-r2do-sync
downloads: 21
updated at: "2026-08-10T00:29:59Z"
related to:
  - "[[GitHub - 1328292415]]"
remind me:
---

# R2DO Sync

Synchronizes a vault through a Worker deployed to the user's own Cloudflare account and R2 storage, with no third-party service in between. Notes and file paths are encrypted on the device with a master key that stays on the hardware, so the server holds only ciphertext and cannot read a filename. Every sync publishes a content-addressed snapshot commit that the server accepts only if nothing newer arrived, so a losing device pulls, merges with a three-way diff3 and retries; decisions come from content hashes rather than timestamps. Unmergeable conflicts keep both sides behind a picker, any snapshot can be browsed and restored, a sync can be previewed before it runs, and a guard asks before large deletions.

```cue
plugin: {
    id:     "cloudflare-rdo-sync"
    name:   "R2DO Sync"
    author: "pc418"
    repo:   "pc418/cloudflare-r2do-sync"

    html_url:    "https://community.obsidian.md/plugins/cloudflare-rdo-sync"
    github_url:  "https://github.com/pc418/cloudflare-r2do-sync"
    description: "Versioned vault sync to Cloudflare R2 with content-addressed snapshots and serialized commits. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Sync your vault through a Worker you deploy to your own Cloudflare account in five minutes — no third-party service, no subscription; the free plan is enough for a text vault. Notes and file paths are encrypted on the device with a master key that never leaves your hardware; the server stores ciphertext and cannot read a filename. Syncing works like version control, not file copying. Every sync publishes a snapshot commit; the server accepts it only if nothing new arrived since, so two devices can never overwrite each other — the loser pulls, merges (true three-way diff3), and retries. Two devices appending to the same daily note both keep their lines, in order. Decisions come from content hashes, never timestamps. Unmergeable conflicts keep both sides and open a picker: keep either, keep both, or combine with markers. Browse and restore any snapshot, preview a sync before it runs, and a mass-delete guard asks before large changes. QR-code setup adds a new device without typing."

    stats: {
        downloads:  21
        updated_at: 1786321799000
    }
}
```

[^template]: [[Obsidian plugin]]
