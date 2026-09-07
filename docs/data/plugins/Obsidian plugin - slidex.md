---
uid: 2b97547a-6352-5df3-b835-f09daa758b48
xid:
  - slidex
aliases:
  - slidex
  - SlideX
  - zz41354899/slidex-obsidian
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/slidex
alt:
  - https://github.com/zz41354899/slidex-obsidian
downloads: 34
updated at: "2026-08-02T08:05:01Z"
related to:
  - "[[GitHub - 1318514465]]"
remind me:
---

# SlideX

Connects a vault to SlideX and sends a read-only snapshot of explicitly selected folders, tags, dates and files into a deck import job. Only the chosen Markdown files and the images they reference are transferred; the full vault is not indexed and notes are not modified. Access is granted by vault-scoped tokens, which can be revoked in SlideX to stop further reads.

```cue
plugin: {
    id:     "slidex"
    name:   "SlideX"
    author: "Noct"
    repo:   "zz41354899/slidex-obsidian"

    html_url:    "https://community.obsidian.md/plugins/slidex"
    github_url:  "https://github.com/zz41354899/slidex-obsidian"
    description: "Send explicitly selected Obsidian notes to SlideX deck import jobs. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Connect your Obsidian Vault to SlideX and export a read-only snapshot of selected folders, tags, dates, and files. Send only the chosen Markdown files and their referenced images; do not index the full vault or modify notes. Revoke Vault-scoped tokens in SlideX to stop future reads."

    stats: {
        downloads:  34
        updated_at: 1785657901000
    }
}
```

[^template]: [[Obsidian plugin]]
