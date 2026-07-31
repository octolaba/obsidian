---
uid: 7a7c233e-f417-53bc-a1ec-fc3888636637
xid:
  - okf-enforcer
aliases:
  - okf-enforcer
  - OKF Enforcer
  - martinforreal/okf-enforcer
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/okf-enforcer
alt:
  - https://github.com/martinforreal/okf-enforcer
downloads: 517
updated at: "2026-07-18T09:33:13Z"
related to:
  - "[[GitHub - 1279155871]]"
remind me:
---

# OKF Enforcer

OKF Enforcer validates and enforces the Open Knowledge Format across a vault, checking that every non-reserved note carries parseable frontmatter with a non-empty type and the expected index.md and log.md structure. Errors and warnings are reported in a collapsible side panel and a status-bar indicator, alongside quick-fixes, on-save checks and a vault-wide report. Missing frontmatter is inserted or repaired non-destructively.

```cue
plugin: {
    id:     "okf-enforcer"
    name:   "OKF Enforcer"
    author: "MartinForReal"
    repo:   "martinforreal/okf-enforcer"

    html_url:    "https://community.obsidian.md/plugins/okf-enforcer"
    github_url:  "https://github.com/martinforreal/okf-enforcer"
    description: "Validate and enforce the Open Knowledge Format (OKF v0.1): required type frontmatter, index.md/log.md structure, quick-fixes, on-save checks, and a vault-wide report. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Validate and enforce OKF v0.2 across your vault, ensuring every non-reserved note has parseable frontmatter with a non-empty type and correct index.md/log.md structure. Report errors and warnings in a collapsible side panel and status-bar indicator, and auto-fix or insert missing frontmatter non-destructively."

    stats: {
        downloads:  517
        updated_at: 1784367193000
    }
}
```

[^template]: [[Obsidian plugin]]
