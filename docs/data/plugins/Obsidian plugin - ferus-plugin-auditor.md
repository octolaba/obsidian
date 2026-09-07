---
uid: 77e226b3-94b5-5255-837d-de63f0be69d4
xid:
  - ferus-plugin-auditor
aliases:
  - ferus-plugin-auditor
  - Ferusnet Security Audit
  - ferusnet/obsidian-ferus-plugin-auditor
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/ferus-plugin-auditor
alt:
  - https://github.com/ferusnet/obsidian-ferus-plugin-auditor
downloads: 28
updated at: "2026-08-07T10:55:49Z"
related to:
  - "[[GitHub - 1321943740]]"
remind me:
---

# Ferusnet Security Audit

Scans the main.js of installed community plugins for dangerous API patterns and verifies its SHA-256 against the corresponding GitHub release. Each plugin is scored from 0 to 100 and rated safe, caution, warning or danger, presented in a sortable in-vault report with details. Everything runs locally with no telemetry, and the scan is audit-only: it does not disable or sandbox anything.

```cue
plugin: {
    id:     "ferus-plugin-auditor"
    name:   "Ferusnet Security Audit"
    author: "Ferusnet"
    repo:   "ferusnet/obsidian-ferus-plugin-auditor"

    html_url:    "https://community.obsidian.md/plugins/ferus-plugin-auditor"
    github_url:  "https://github.com/ferusnet/obsidian-ferus-plugin-auditor"
    description: "Static-analysis security audit for your installed community plugins. Flags dangerous APIs, verifies release hashes against GitHub, and scores plugin risk. Fully local — no data leaves your vault. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Scan installed community plugins' main.js for dangerous patterns and verify SHA-256 against GitHub releases. Score plugins 0–100 (safe/caution/warning/danger) and show a sortable in‑vault report with details. Run locally with no telemetry; audit-only and won't disable or sandbox plugins."

    stats: {
        downloads:  28
        updated_at: 1786100149000
    }
}
```

[^template]: [[Obsidian plugin]]
