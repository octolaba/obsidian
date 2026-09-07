---
uid: fc3a6112-45f7-52db-ade1-ed1cc4074c1a
xid:
  - smart-review
aliases:
  - smart-review
  - Smart Review
  - jaycelu/Smart-Review
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/smart-review
alt:
  - https://github.com/jaycelu/Smart-Review
downloads: 323
updated at: "2026-06-29T06:13:06Z"
related to:
  - "[[GitHub - 1252880574]]"
remind me:
---

# Smart Review

Review queues are built from YAML frontmatter — the recorded inputs name a next_review property — and spaced-review sessions run inside Obsidian. Feedback is recorded as again, hard, good or easy, review metadata is written back to the note's frontmatter, and events are appended to a review-history.jsonl file. AI review-card payloads can be exported, or a daily review note generated as Markdown.

```cue
plugin: {
    id:     "smart-review"
    name:   "Smart Review"
    author: "Jayce"
    repo:   "jaycelu/Smart-Review"

    html_url:    "https://community.obsidian.md/plugins/smart-review"
    github_url:  "https://github.com/jaycelu/Smart-Review"
    description: "Smart review system based on Obsidian Properties / YAML frontmatter with Review Center, spaced review feedback, history, and AI payload export. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Build review queues from YAML frontmatter (next_review) and run spaced-review sessions directly inside Obsidian. Record feedback (again, hard, good, easy), write review metadata back to note frontmatter, append events to review-history.jsonl, and export AI review-card payloads or generate daily review Markdown."

    stats: {
        downloads:  323
        updated_at: 1782713586000
    }
}
```

[^template]: [[Obsidian plugin]]
