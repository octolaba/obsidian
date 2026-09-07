---
uid: d1f03647-93c8-5116-bd69-a2d9c4d61b98
xid:
  - document-merge-dedupe
aliases:
  - document-merge-dedupe
  - Document Merge and Dedupe
  - jusevi/document-merge-dedupe
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/document-merge-dedupe
alt:
  - https://github.com/jusevi/document-merge-dedupe
downloads: 30
updated at: "2026-07-27T17:22:39Z"
related to:
  - "[[GitHub - 1314085704]]"
remind me:
---

# Document Merge and Dedupe

Combines overlapping Markdown clips and paginated documents into one ordered file by aligning repeated paragraphs and dropping the duplicates, while keeping tables, code blocks, links and attachments intact. Candidate files are grouped by normalized URL, conversation ID or pagination pattern, and can also be chosen from a searchable picker. Each merge produces a verification report covering coverage, anchors, conflicts and gaps, and validated sources can optionally be moved to trash.

```cue
plugin: {
    id:     "document-merge-dedupe"
    name:   "Document Merge and Dedupe"
    author: "Hz"
    repo:   "jusevi/document-merge-dedupe"

    html_url:    "https://community.obsidian.md/plugins/document-merge-dedupe"
    github_url:  "https://github.com/jusevi/document-merge-dedupe"
    description: "Merge overlapping Markdown clips and paginated documents without duplicated content. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Merge overlapping Markdown clips and paginated documents into a single ordered file by aligning overlapping paragraphs and removing duplicates. Preserve tables, code blocks, links and attachments, group files by normalized URL, conversation IDs or pagination patterns, and generate a verification report of coverage, anchors, conflicts and gaps. Select notes from a searchable picker or merge detected groups, and optionally move validated sources to trash."

    stats: {
        downloads:  30
        updated_at: 1785172959000
    }
}
```

[^template]: [[Obsidian plugin]]
