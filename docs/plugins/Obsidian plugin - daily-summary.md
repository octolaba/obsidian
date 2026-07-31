---
uid: dd6cb633-5b5a-5788-85c3-5498c83d2fd5
xid:
  - daily-summary
aliases:
  - daily-summary
  - Daily Summary
  - cslukkun/ob_daily_summary
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/daily-summary
alt:
  - https://github.com/cslukkun/ob_daily_summary
downloads: 1028
updated at: "2024-12-04T14:51:33Z"
related to:
  - "[[GitHub - 882287939]]"
remind me:
---

# Daily Summary

Collects the notes from the current day and asks a language model to write a summary report of them. The API endpoint is configurable for OpenAI or a local Ollama instance, as is the location where the report is saved, and the report is produced by a Generate Daily Report command. API and file errors are logged to debug-errors.md.

```cue
plugin: {
    id:     "daily-summary"
    name:   "Daily Summary"
    author: "cslukkun"
    repo:   "cslukkun/ob_daily_summary"

    html_url:    "https://community.obsidian.md/plugins/daily-summary"
    github_url:  "https://github.com/cslukkun/ob_daily_summary"
    description: "Use LLM to summarize what you did today."
    about:       "Collect notes from the current day and generate a concise daily report using an LLM (OpenAI or local Ollama). Configure API endpoint and report save location, then run Generate Daily Report from the command palette. Log API and file errors to debug-errors.md."

    stats: {
        downloads:  1028
        updated_at: 1733323893000
    }
}
```

[^template]: [[Obsidian plugin]]
