---
uid: b88855b0-2792-5ee6-b0d8-c500dc31a5f1
xid:
  - single-choice-property
aliases:
  - single-choice-property
  - Single Choice Property
  - moyf/single-choice-property
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/single-choice-property
alt:
  - https://github.com/moyf/single-choice-property
downloads: 227
updated at: "2026-06-04T12:32:27Z"
related to:
  - "[[GitHub - 1259155734]]"
remind me:
---

# Single Choice Property

Single Choice Property trims selected list properties to their latest value by keeping only the last item, defaulting to the status property. It watches the configured property names and updates metadata after changes, optionally showing a notification naming the note, the property and the value kept. It runs locally and only modifies arrays holding more than one item.

```cue
plugin: {
    id:     "single-choice-property"
    name:   "Single Choice Property"
    author: "Moy"
    repo:   "moyf/single-choice-property"

    html_url:    "https://community.obsidian.md/plugins/single-choice-property"
    github_url:  "https://github.com/moyf/single-choice-property"
    description: "Keep selected list properties to only their latest value. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Keep list-style properties to a single latest value by trimming lists to their last item (defaults to status). Watch configured property names and update metadata precisely after changes, optionally showing a notification with note, property and kept value. Run locally and only modify arrays with more than one item."

    stats: {
        downloads:  227
        updated_at: 1780576347000
    }
}
```

[^template]: [[Obsidian plugin]]
