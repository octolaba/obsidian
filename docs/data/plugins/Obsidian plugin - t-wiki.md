---
uid: da658883-f2a5-5023-84b4-5369f4ebb4ba
xid:
  - t-wiki
aliases:
  - t-wiki
  - T-Wiki
  - operationt00/T-wiki
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/t-wiki
alt:
  - https://github.com/operationt00/T-wiki
downloads: 42
updated at: "2026-08-11T15:32:32Z"
related to:
  - "[[GitHub - 1314680336]]"
remind me:
---

# T-Wiki

Compiles source files and URLs into an interlinked Markdown wiki whose statements stay traceable to their origins. Imported MD, TXT and PDF material is stored with a SHA-256 record of the original and parsed into unified Markdown, after which multi-turn agents running on a configurable LLM API merge it into the wiki. Writes are atomic and diffed with rollback, and coverage reports are produced for auditing.

```cue
plugin: {
    id:     "t-wiki"
    name:   "T-Wiki"
    author: "T00"
    repo:   "operationt00/T-wiki"

    html_url:    "https://community.obsidian.md/plugins/t-wiki"
    github_url:  "https://github.com/operationt00/T-wiki"
    description: "Turn source documents into a structured, traceable, LLM-powered wiki. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Compile raw files and URLs into a traceable, interlinked Markdown wiki using a TypeScript agent runtime and configurable LLM API. Import MD/TXT/PDFs, store originals with SHA‑256, parse to unified Markdown, run multi‑turn agents to merge knowledge, produce audit‑ready coverage reports, and apply atomic diffed writes with rollback."

    stats: {
        downloads:  42
        updated_at: 1786462352000
    }
}
```

[^template]: [[Obsidian plugin]]
