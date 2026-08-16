---
uid: 2335a4a9-2ca6-5f30-a026-f4490665cf32
xid:
  - semoi
aliases:
  - semoi
  - Semoi
  - gjtorikian/semoi-obsidian
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/semoi
alt:
  - https://github.com/gjtorikian/semoi-obsidian
downloads: 120
updated at: "2026-05-28T23:39:23Z"
related to:
  - "[[GitHub - 1244636879]]"
remind me:
---

# Semoi

Semoi records keystroke evidence while you write, storing edit atoms for insert, delete and replace with counts and timestamps but not the characters typed. An Ed25519-signed proof is minted through semoi.net, its reference is written into the note's frontmatter, and a public verification page can be opened from there.

```cue
plugin: {
    id:     "semoi"
    name:   "Semoi"
    author: "gjtorikian"
    repo:   "gjtorikian/semoi-obsidian"

    html_url:    "https://community.obsidian.md/plugins/semoi"
    github_url:  "https://github.com/gjtorikian/semoi-obsidian"
    description: "Capture keystroke evidence as you write and mint cryptographic proof-of-writing certificates via semoi.net. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Capture keystroke evidence while you write by recording edit atoms (insert/delete/replace) with counts and timestamps, without storing the characters you typed. Mint an Ed25519-signed proof via semoi.net, write the proof reference into the note's frontmatter, and open a public verification page."

    stats: {
        downloads:  120
        updated_at: 1780011563000
    }
}
```

[^template]: [[Obsidian plugin]]
