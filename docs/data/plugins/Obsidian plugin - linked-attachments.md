---
uid: ee91a113-f369-5a88-9004-74285650ed4f
xid:
  - linked-attachments
aliases:
  - linked-attachments
  - Linked Attachments
  - ckelsoe/obsidian-linked-attachments
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/linked-attachments
alt:
  - https://github.com/ckelsoe/obsidian-linked-attachments
downloads: 145
updated at: "2026-07-08T17:34:26Z"
related to:
  - "[[GitHub - 1270615279]]"
remind me:
---

# Linked Attachments

Offloads large, cold binaries to an S3-compatible bucket or an external local folder and leaves a small resolvable pointer note in the vault in their place. Every move is verified with byte-for-byte checks, and the readable Markdown pointers can open, reveal, or restore the file, with optional mirroring to both local storage and S3. The recorded inputs state that local folder access is desktop-only.

```cue
plugin: {
    id:     "linked-attachments"
    name:   "Linked Attachments"
    author: "Charles Kelsoe"
    repo:   "ckelsoe/obsidian-linked-attachments"

    html_url:    "https://community.obsidian.md/plugins/linked-attachments"
    github_url:  "https://github.com/ckelsoe/obsidian-linked-attachments"
    description: "Offload large, cold files to your own S3-compatible bucket or a local folder, keeping a resolvable pointer note in your vault. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Offload large binaries to an S3-compatible bucket or an external local folder and replace them with small, resolvable pointer notes in your vault. Verify every move with byte-for-byte checks and keep readable Markdown pointers that let you open, reveal, or restore files; optionally mirror to both local and S3 for fast reads plus durable backup. Run on desktop only when using local folder access."

    stats: {
        downloads:  145
        updated_at: 1783532066000
    }
}
```

[^template]: [[Obsidian plugin]]
