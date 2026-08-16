---
uid: dcbf809d-a5e9-5645-8285-d5bfeaa3a4f9
xid:
  - token-usage
aliases:
  - token-usage
  - Token Usage
  - beolatn/TokenUsage
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/token-usage
alt:
  - https://github.com/beolatn/TokenUsage
downloads: 71
updated at: "2026-08-09T17:32:02Z"
related to:
  - "[[GitHub - 1317531774]]"
remind me:
---

# Token Usage

Reads Claude Code's local JSONL session files and reports token statistics in an Obsidian sidebar, with no API key and no external service. The sidebar breaks out four token types across five ranges (last five-hour session, this session, today, 7 days and 30 days), gives Cache Write and Cache Read their own rows, and reports their ratio as a Reuse Factor. A stacked bar under the 7-day chart shows model distribution across Haiku, Sonnet, Opus and Fable, while an HTML dashboard opens in the default browser with 30-day charts, a model donut, a request-size histogram, top sessions and cache-efficiency analysis. A built-in glossary explains each metric without leaving the sidebar.

```cue
plugin: {
    id:     "token-usage"
    name:   "Token Usage"
    author: "Björn-Olaf Lange"
    repo:   "beolatn/TokenUsage"

    html_url:    "https://community.obsidian.md/plugins/token-usage"
    github_url:  "https://github.com/beolatn/TokenUsage"
    description: "Real-time Claude Code token tracking inside Obsidian — sidebar with 5 time ranges, Cache Write/Read split, 7-day model chart, HTML dashboard and built-in glossary. No API key needed. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Token Usage reads Claude Code's local JSONL session files and displays real-time token statistics inside Obsidian. No API key, no external service, no cloud. The sidebar shows all four token types across five time ranges: Last 5 Hour Session (matching Claude Code's rate-limit window), This Session, Today, 7 Days, and 30 Days. Cache Write (C.Write, ~1.25× input) and Cache Read (C.Read, ~0.10× input) each have their own row — because they carry very different cost implications. Their ratio is the Reuse Factor: a measure of cache efficiency. A stacked bar below the 7-day chart shows model distribution, color-coded by Haiku, Sonnet, Opus, and Fable. The HTML dashboard opens in your default browser and adds 30-day charts, a model donut, a request size histogram, your top sessions, and a cache efficiency section with Reuse Factor analysis. The built-in glossary explains every metric — accessible via the ? button, without leaving the sidebar."

    stats: {
        downloads:  71
        updated_at: 1786296722000
    }
}
```

[^template]: [[Obsidian plugin]]
