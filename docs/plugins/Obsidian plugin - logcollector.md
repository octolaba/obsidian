---
uid: 1810e269-5326-51fa-b15a-9737f04beddb
xid:
  - logcollector
aliases:
  - logcollector
  - Logcollector
  - awkman00/obsidian-logcollector
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/logcollector
alt:
  - https://github.com/awkman00/obsidian-logcollector
downloads: 91
updated at: "2026-06-07T18:40:35Z"
related to:
  - "[[GitHub - 1261361549]]"
remind me:
---

# Logcollector

Proxies console calls so log messages and uncaught exceptions are copied to a file inside or outside the vault, including messages from async code and promises on the main thread. Logs are written as NDJSON, plain text or Markdown, either a table or a code block, with timestamps in local time or UTC. Storing the file outside the vault is offered to avoid vault-size issues.

```cue
plugin: {
    id:     "logcollector"
    name:   "Logcollector"
    author: "AwkMan"
    repo:   "awkman00/obsidian-logcollector"

    html_url:    "https://community.obsidian.md/plugins/logcollector"
    github_url:  "https://github.com/awkman00/obsidian-logcollector"
    description: "A simple proxy for `console.*()` calls which copies log messages and uncaught exceptions to a file (inside or outside the vault). - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Log all console output and uncaught exceptions to a note inside or outside your vault, capturing messages from async code and promises on the main thread. Write logs as NDJSON, plain text, or Markdown (table or code block), record timestamps in local or UTC, and optionally store files outside the vault to avoid vault-size issues."

    stats: {
        downloads:  91
        updated_at: 1780857635000
    }
}
```

[^template]: [[Obsidian plugin]]
