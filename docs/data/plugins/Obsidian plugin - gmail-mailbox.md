---
uid: c2419e91-fb4d-53c5-a6c6-39c271904d20
xid:
  - gmail-mailbox
aliases:
  - gmail-mailbox
  - Gmail Mailbox
  - nabheetcloud/obsidian-gmail
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/gmail-mailbox
alt:
  - https://github.com/nabheetcloud/obsidian-gmail
downloads: 225
updated at: "2026-07-05T11:53:59Z"
related to:
  - "[[GitHub - 1289898492]]"
remind me:
---

# Gmail Mailbox

Syncs Gmail into the vault as one Markdown note per message, with frontmatter carrying sender, recipients, date, labels, thread and a web link, and regenerates per-label thread indexes grouped by conversation. Google Calendar is mirrored into a rolling upcoming-meetings sidebar with one note per event and links from events to related emails. Gmail syncs run incrementally over history, authentication uses PKCE, labels are configurable, and attachments can be downloaded under a size cap.

```cue
plugin: {
    id:     "gmail-mailbox"
    name:   "Gmail Mailbox"
    author: "Nabheet Madan"
    repo:   "nabheetcloud/obsidian-gmail"

    html_url:    "https://community.obsidian.md/plugins/gmail-mailbox"
    github_url:  "https://github.com/nabheetcloud/obsidian-gmail"
    description: "Sync Gmail into your vault as one note per email plus a per-label thread index. Incremental history sync, PKCE auth, configurable labels, and a Google Calendar upcoming-meetings sidebar. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Sync Gmail into your vault as one Markdown note per message with YAML frontmatter (from/to/cc/date/labels/thread/web link) and regenerate per-label thread indexes grouped by conversation. Mirror Google Calendar into a rolling upcoming-meetings sidebar with one note per event and auto-link events to related emails; run incremental Gmail syncs and optionally download attachments with a size cap."

    stats: {
        downloads:  225
        updated_at: 1783252439000
    }
}
```

[^template]: [[Obsidian plugin]]
