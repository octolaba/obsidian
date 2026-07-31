---
uid: 504bd7b4-cdf4-5a73-8891-f6b8c72e2b7d
xid:
  - slop-chop
aliases:
  - slop-chop
  - dcadolph/slop-chop-obsidian
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/slop-chop
alt:
  - https://github.com/dcadolph/slop-chop-obsidian
downloads: 15
updated at: "2026-07-13T22:06:19Z"
related to:
remind me:
---

# slop-chop

slop-chop rewrites the active note or a selection in place with a rules engine compiled to WebAssembly that runs locally in the app, so the text never leaves the vault. Rewrites are deterministic and each one reports a slop score before and after the chop. Voice presets of keep, prefer and avoid are applied to every rewrite.

```cue
plugin: {
    id:     "slop-chop"
    name:   "slop-chop"
    author: "dcadolph"
    repo:   "dcadolph/slop-chop-obsidian"

    html_url:    "https://community.obsidian.md/plugins/slop-chop"
    github_url:  "https://github.com/dcadolph/slop-chop-obsidian"
    description: "Chop AI slop from your notes. The rules engine runs locally in the app; your text never leaves the vault. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Chop notes using a local WebAssembly rules engine that rewrites the active note or selected text in place so your text never leaves the vault. Produce deterministic results, display slop scores before and after each chop, and apply voice presets (keep, prefer, avoid) to every rewrite."

    stats: {
        downloads:  15
        updated_at: 1783980379000
    }
}
```

[^template]: [[Obsidian plugin]]
