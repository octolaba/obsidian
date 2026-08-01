---
uid: 85a2861f-ac1e-5ec1-a310-e2ba2e8cd2ad
xid:
  - ghost-writer-manager
aliases:
  - ghost-writer-manager
  - Ghost Writer Manager
  - diegoeis/ghost-writer-manager-plugin
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/ghost-writer-manager
alt:
  - https://github.com/diegoeis/ghost-writer-manager-plugin
downloads: 254
updated at: "2026-05-16T23:25:31Z"
related to:
  - "[[GitHub - 1153214442]]"
remind me:
---

# Ghost Writer Manager

Syncs notes one way from Obsidian to Ghost CMS, converting Markdown into Ghost's Lexical format with image support and optional members-only previews. Ghost metadata is managed through YAML frontmatter, posts can be scheduled with a published-at field, and an editorial calendar sidebar lists the scheduled and published posts of the month. Sync runs on save with a short debounce or on a configurable interval, and the recorded inputs state that API keys are stored securely.

```cue
plugin: {
    id:     "ghost-writer-manager"
    name:   "Ghost Writer Manager"
    author: "Diego Eis"
    repo:   "diegoeis/ghost-writer-manager-plugin"

    html_url:    "https://community.obsidian.md/plugins/ghost-writer-manager"
    github_url:  "https://github.com/diegoeis/ghost-writer-manager-plugin"
    description: "Sync notes to Ghost CMS with post scheduling, YAML metadata control, and periodic sync. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Sync notes from Obsidian to Ghost CMS one-way, converting Markdown to Ghost Lexical format with image support and optional members-only previews. Manage Ghost metadata via YAML frontmatter, schedule posts with g_published_at, view an editorial calendar sidebar, and run automatic or periodic syncs with API keys stored securely. - **One-way sync** from Obsidian to Ghost (keeps Ghost as your publishing platform) - **Editorial calendar** - Sidebar view of all scheduled and published posts for the month - **YAML frontmatter control** - Manage all Ghost metadata directly in Obsidian - **Post scheduling** - Schedule posts for future publication with `g_published_at` - **Automatic sync** - Debounced sync on file save (2s delay) - **Periodic sync** - Configurable interval sync (default: 15 minutes) - **Markdown to Lexical conversion** - Full markdown support including images - **Paywall marker** - Control the public preview line with `--members-only--`"

    stats: {
        downloads:  254
        updated_at: 1778973931000
    }
}
```

[^template]: [[Obsidian plugin]]
