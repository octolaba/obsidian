---
uid: d4ccf8f9-a370-58c4-a4a1-18219fb02fad
xid:
  - journal-recap
aliases:
  - journal-recap
  - Journal Recap
  - aegerita/journal-recap
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/journal-recap
alt:
  - https://github.com/aegerita/journal-recap
downloads: 75
updated at: "2026-05-26T02:44:09Z"
related to:
  - "[[GitHub - 917781236]]"
remind me:
---

# Journal Recap

Journal Recap summarizes a daily journal entry into a single sentence and inserts it into the note's frontmatter. The note's content, excluding its frontmatter, is sent to the configured OpenAI Responses API, and the returned summary is saved back into frontmatter.

```cue
plugin: {
    id:     "journal-recap"
    name:   "Journal Recap"
    author: "Jenny Tai"
    repo:   "aegerita/journal-recap"

    html_url:    "https://community.obsidian.md/plugins/journal-recap"
    github_url:  "https://github.com/aegerita/journal-recap"
    description: "Recap your journal entries with AI generated summaries. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Summarize daily journal entries into a single sentence and insert it into the note's frontmatter. Send the current note's content (excluding frontmatter) to your configured OpenAI Responses API and save the returned summary back into frontmatter."

    stats: {
        downloads:  75
        updated_at: 1779763449000
    }
}
```

[^template]: [[Obsidian plugin]]
