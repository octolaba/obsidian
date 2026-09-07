---
uid: d1445a72-ff63-5229-84c4-1009c44c8f67
xid:
  - tag-toggler
aliases:
  - tag-toggler
  - Tag Toggler
  - studiogamma/tag-toggler
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/tag-toggler
alt:
  - https://github.com/studiogamma/tag-toggler
downloads: 345
updated at: "2026-06-02T05:16:12Z"
related to:
  - "[[GitHub - 1162332310]]"
remind me:
---

# Tag Toggler

Tag Toggler hides tag nodes from Graph View by adding a configurable prefix to tags in the files, which makes them inactive while the tagged files stay visible. Per-tag and global hide and unhide controls clean a cluttered graph and restore the original text again. Because the plugin performs bulk edits across files, the recorded text advises running a vault backup first.

```cue
plugin: {
    id:     "tag-toggler"
    name:   "Tag Toggler"
    author: "studiogamma"
    repo:   "studiogamma/tag-toggler"

    html_url:    "https://community.obsidian.md/plugins/tag-toggler"
    github_url:  "https://github.com/studiogamma/tag-toggler"
    description: "Hide specific tag nodes from Graph View by converting tags to plain text (e.g. #Year → —#Year). Unhide to restore them. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Toggle tag-node visibility in Graph View by adding a configurable prefix to tags in your files, making them inactive while keeping the tagged files visible. Use per-tag and global hide/unhide controls to clean cluttered graphs; run a vault backup first since the plugin performs bulk edits."

    stats: {
        downloads:  345
        updated_at: 1780377372000
    }
}
```

[^template]: [[Obsidian plugin]]
