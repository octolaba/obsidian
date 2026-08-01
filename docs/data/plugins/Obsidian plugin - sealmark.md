---
uid: 6d92ca21-08c4-5271-a9aa-0c43898969d0
xid:
  - sealmark
aliases:
  - sealmark
  - Sealmark
  - jdh847/sealmark
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/sealmark
alt:
  - https://github.com/jdh847/sealmark
downloads: 76
updated at: "2026-06-16T13:09:58Z"
related to:
  - "[[GitHub - 1257033558]]"
remind me:
---

# Sealmark

Sealmark hashes a note's raw bytes locally and anchors the digest to Bitcoin through OpenTimestamps, so that existence can be proved without publishing the content. Proofs are stored as .ots sidecar files, pending proofs are upgraded into confirmed seals, and verification works offline or with standard ots and Bitcoin tools, which also detects drift when a file changes.

```cue
plugin: {
    id:     "sealmark"
    name:   "Sealmark"
    author: "Yitebeier Aikebaier"
    repo:   "jdh847/sealmark"

    html_url:    "https://community.obsidian.md/plugins/sealmark"
    github_url:  "https://github.com/jdh847/sealmark"
    description: "Private proof of existence for your notes. Hash locally, anchor to Bitcoin via OpenTimestamps, verify offline. Your content never leaves your machine; only a hash is published. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Seal notes locally by hashing their raw bytes and anchor the digest to Bitcoin via OpenTimestamps to prove existence without publishing content. Store proofs as .ots sidecars, upgrade pending proofs into confirmed seals, and verify seals offline or with standard ots/Bitcoin tools to detect drift when files change."

    stats: {
        downloads:  76
        updated_at: 1781615398000
    }
}
```

[^template]: [[Obsidian plugin]]
