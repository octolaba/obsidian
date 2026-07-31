---
uid: 7a26cfe1-948a-59be-a041-90a9ea346dfe
xid:
  - caldav-sync
aliases:
  - caldav-sync
  - CalDAV Task Sync
  - speze88/obsidian-caldav-sync
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/caldav-sync
alt:
  - https://github.com/speze88/obsidian-caldav-sync
downloads: 192
updated at: "2026-03-12T19:31:23Z"
related to:
  - "[[GitHub - 1173446240]]"
remind me:
---

# CalDAV Task Sync

CalDAV Task Sync synchronizes Markdown tasks tagged with the caldav tag bidirectionally against CalDAV VTODO servers such as Nextcloud, SOGo and mailcow. Calendars are mapped to tags to route tasks, completions are pushed, and remote title and status changes are pulled when a file is saved. CalDAV UIDs are stored in invisible HTML comments so notes stay readable.

```cue
plugin: {
    id:     "caldav-sync"
    name:   "CalDAV Task Sync"
    author: "speze88"
    repo:   "speze88/obsidian-caldav-sync"

    html_url:    "https://community.obsidian.md/plugins/caldav-sync"
    github_url:  "https://github.com/speze88/obsidian-caldav-sync"
    description: "Bidirectionally synchronize markdown tasks tagged with #caldav to/from a CalDAV server. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Sync markdown tasks bidirectionally with CalDAV VTODO servers (Nextcloud, SOGo, mailcow). Map calendars to tags to route tasks, push completions and pull remote title/status changes on file save. Store CalDAV UIDs in invisible HTML comments to keep notes readable."

    stats: {
        downloads:  192
        updated_at: 1773343883000
    }
}
```

[^template]: [[Obsidian plugin]]
