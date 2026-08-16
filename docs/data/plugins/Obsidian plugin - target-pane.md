---
uid: 07aa2d3b-8a09-5d62-9f44-ef0d5efb0782
xid:
  - target-pane
aliases:
  - target-pane
  - Target Pane
  - mjsharkey/obsidian_target_pane
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/target-pane
alt:
  - https://github.com/mjsharkey/obsidian_target_pane
downloads: 211
updated at: "2026-06-29T03:56:58Z"
related to:
  - "[[GitHub - 1281497078]]"
remind me:
---

# Target Pane

Target Pane designates one pane as the destination for note links, so wikilinks, Markdown links and embedded-note links open there instead of in the pane they were clicked from. In-page heading and block links and external links keep their usual behaviour, a click replaces the target pane's active tab, and a modifier click opens a new tab. The designation persists across restarts and disables itself if the target pane is closed.

```cue
plugin: {
    id:     "target-pane"
    name:   "Target Pane"
    author: "Michael Sharkey"
    repo:   "mjsharkey/obsidian_target_pane"

    html_url:    "https://community.obsidian.md/plugins/target-pane"
    github_url:  "https://github.com/mjsharkey/obsidian_target_pane"
    description: "Designate a target pane, then open links to other notes (including embedded-note links) there instead of in the current pane. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Set a pane as the destination for note links so every [[wikilink]], Markdown link, or embedded-note link opens there instead of the pane you clicked from. Preserve in-page (#heading/^block) and external links; click replaces the target pane's active tab while Cmd/Ctrl-click opens a new tab, and the target persists across restarts and auto-disables if closed."

    stats: {
        downloads:  211
        updated_at: 1782705418000
    }
}
```

[^template]: [[Obsidian plugin]]
