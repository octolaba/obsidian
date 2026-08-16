---
uid: 130e3127-40c9-5eab-b9f5-7f6bd4cabef6
xid:
  - encoding-autofix
aliases:
  - encoding-autofix
  - Encoding Auto-Fix
  - kathar0s/obsidian-encoding-autofix
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/encoding-autofix
alt:
  - https://github.com/kathar0s/obsidian-encoding-autofix
downloads: 299
updated at: "2026-06-16T08:32:37Z"
related to:
  - "[[GitHub - 1270972187]]"
remind me:
---

# Encoding Auto-Fix

Detects text files that are not UTF-8 — UTF-16 LE and BE, UTF-8 with a BOM, and legacy encodings such as EUC-KR and CP949 — as they are added to the vault and rewrites them as clean UTF-8. Catching a file before Obsidian or a sync plugin touches it is meant to prevent mojibake, replacement characters and sync errors in Korean and other CJK text. A command converts a file manually.

```cue
plugin: {
    id:     "encoding-autofix"
    name:   "Encoding Auto-Fix"
    author: "kathar0s"
    repo:   "kathar0s/obsidian-encoding-autofix"

    html_url:    "https://community.obsidian.md/plugins/encoding-autofix"
    github_url:  "https://github.com/kathar0s/obsidian-encoding-autofix"
    description: "Detects non-UTF-8 files (UTF-16 LE/BE, UTF-8 BOM, EUC-KR/CP949) on creation and rewrites them as clean UTF-8, preventing Korean/CJK text corruption in Obsidian. Includes a manual convert command. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Convert non-UTF-8 text files to clean UTF-8 as they are added to the vault, handling UTF-16 and legacy encodings like EUC-KR/CP949. Prevent mojibake, replacement � characters, and sync errors by catching and re-encoding files before Obsidian or sync plugins touch them."

    stats: {
        downloads:  299
        updated_at: 1781598757000
    }
}
```

[^template]: [[Obsidian plugin]]
