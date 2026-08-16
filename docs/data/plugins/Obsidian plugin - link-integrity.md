---
uid: 68602134-59f9-52d8-a12a-7966a0e34c4e
xid:
  - link-integrity
aliases:
  - link-integrity
  - Link Integrity
  - zhyx91/obsidian-link-integrity
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/link-integrity
alt:
  - https://github.com/zhyx91/obsidian-link-integrity
downloads: 20
updated at: "2026-08-09T05:30:32Z"
related to:
  - "[[GitHub - 1320506512]]"
remind me:
---

# Link Integrity

Continuously inspects the vault for broken internal links and isolated files, reporting reference errors at file, heading and block level. Isolated files are flagged with self-links and external URLs excluded, and files that also carry broken outgoing links are downgraded. Each diagnostic can be opened at its source.

```cue
plugin: {
    id:     "link-integrity"
    name:   "Link Integrity"
    author: "ZhengYX"
    repo:   "zhyx91/obsidian-link-integrity"

    html_url:    "https://community.obsidian.md/plugins/link-integrity"
    github_url:  "https://github.com/zhyx91/obsidian-link-integrity"
    description: "Continuously find broken internal links and isolated files across your Vault. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Inspect your vault for broken internal links and isolated files, reporting file-, heading-, and block-level reference errors. Flag isolated files (excluding self-links and external URLs), downgrade those with broken outgoing links, and open diagnostics at their source."

    stats: {
        downloads:  20
        updated_at: 1786253432000
    }
}
```

[^template]: [[Obsidian plugin]]
