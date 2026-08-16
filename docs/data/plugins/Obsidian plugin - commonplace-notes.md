---
uid: fda6b3cc-566b-5211-8b48-ed435051f669
xid:
  - commonplace-notes
aliases:
  - commonplace-notes
  - Commonplace Notes
  - zachmueller/commonplace-notes
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/commonplace-notes
alt:
  - https://github.com/zachmueller/commonplace-notes
downloads: 406
updated at: "2026-07-20T04:03:22Z"
related to:
  - "[[GitHub - 926199916]]"
remind me:
---

# Commonplace Notes

Commonplace Notes publishes a curated subset of the vault as a static site with sliding, stacked panes, so a reader follows a train of thought through notes opened in adjacent columns. Publishing is opt-in per note, each note carries a stable UID, and the site is hosted on AWS S3 with CloudFront. The Markdown to HTML pipeline is extensible.

```cue
plugin: {
    id:     "commonplace-notes"
    name:   "Commonplace Notes"
    author: "zachmueller"
    repo:   "zachmueller/commonplace-notes"

    html_url:    "https://community.obsidian.md/plugins/commonplace-notes"
    github_url:  "https://github.com/zachmueller/commonplace-notes"
    description: "Publish your notes with sliding panes and link to others notes - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Publish a curated subset of your vault as a fast, stacked-panes static site that opens notes in adjacent columns so readers can follow a train of thought. Host on AWS S3 + CloudFront with per-note stable UIDs, opt-in publishing per note, and an extensible Markdown→HTML pipeline."

    stats: {
        downloads:  406
        updated_at: 1784520202000
    }
}
```

[^template]: [[Obsidian plugin]]
