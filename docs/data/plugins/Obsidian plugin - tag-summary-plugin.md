---
uid: c911277b-8a75-5d19-a04a-e073bfbc9712
xid:
  - tag-summary-plugin
aliases:
  - tag-summary-plugin
  - Tag Summary
  - macrojd/tag-summary
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/tag-summary-plugin
alt:
  - https://github.com/macrojd/tag-summary
downloads: 15521
updated at: "2023-03-04T20:17:41Z"
related to:
  - "[[GitHub - 494924176]]"
remind me:
---

# Tag Summary

Tag Summary builds summaries out of the paragraphs or blocks of text that share the same tags. It scans notes for blocks separated by blank lines and inserts the combined blocks through an add-summary code block. A tags list matches any of the given tags, while an include list requires all of them.

```cue
plugin: {
    id:     "tag-summary-plugin"
    name:   "Tag Summary"
    author: "macrojd"
    repo:   "macrojd/tag-summary"

    html_url:    "https://community.obsidian.md/plugins/tag-summary-plugin"
    github_url:  "https://github.com/macrojd/tag-summary"
    description: "Create summaries with paragraphs or blocks of text that share the same tag(s)."
    about:       "Create summaries by aggregating paragraphs or text blocks that share specified tag(s) across your vault. Scan notes for blank-line-separated blocks and insert the combined blocks via an add-summary code block, using tags: for OR matching or include: for AND matching."

    stats: {
        downloads:  15521
        updated_at: 1677961061000
    }
}
```

[^template]: [[Obsidian plugin]]
