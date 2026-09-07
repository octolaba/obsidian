---
uid: 0c4b9aa9-90a1-5ad9-95bf-6d1e801c5c44
xid:
  - zettelgpt
aliases:
  - zettelgpt
  - ZettelGPT
  - overraddit/ZettelGPT
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/zettelgpt
alt:
  - https://github.com/overraddit/ZettelGPT
downloads: 5208
updated at: "2023-04-20T15:37:33Z"
related to:
  - "[[GitHub - 628411360]]"
remind me:
---

# ZettelGPT

ZettelGPT generates ChatGPT answers inside Obsidian and keeps each question and its answer as self-contained notes, so a thread preserves context across follow-up questions. Only the relevant part of the conversation history is sent, which reduces token use, and the linked question and answer notes are visible in the graph view. The plugin records that note content is uploaded to OpenAI.

```cue
plugin: {
    id:     "zettelgpt"
    name:   "ZettelGPT"
    author: "overraddit"
    repo:   "overraddit/ZettelGPT"

    html_url:    "https://community.obsidian.md/plugins/zettelgpt"
    github_url:  "https://github.com/overraddit/ZettelGPT"
    description: "Effortlessly generate context-aware answers from ChatGPT, while maintaining a visually clear and organized conversation history."
    about:       "Generate ChatGPT answers directly inside Obsidian and maintain self-contained question–answer threads to preserve context across follow-ups. Reduce token use by sending only relevant conversation history. Visualize linked question and answer notes in the graph view and be aware note content is uploaded to OpenAI."

    stats: {
        downloads:  5208
        updated_at: 1682005053000
    }
}
```

[^template]: [[Obsidian plugin]]
