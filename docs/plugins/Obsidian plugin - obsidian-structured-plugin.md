---
uid: 2634b034-2a16-53ad-9402-fb79f129b7f3
xid:
  - obsidian-structured-plugin
aliases:
  - obsidian-structured-plugin
  - Structured
  - dobrovolsky/obsidian-structure
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/obsidian-structured-plugin
alt:
  - https://github.com/dobrovolsky/obsidian-structure
downloads: 6709
updated at: "2024-01-27T10:25:03Z"
related to:
  - "[[GitHub - 396278812]]"
remind me:
---

# Structured

Dot-separated names build a hierarchy among notes, so that aws, aws.ec2 and aws.ec2.security-groups form parent and child levels. Commands list parent or child notes, open the parent, rename notes correctly, and create new notes in the root or in the current file's folder.

```cue
plugin: {
    id:     "obsidian-structured-plugin"
    name:   "Structured"
    author: "dobrovolsky"
    repo:   "dobrovolsky/obsidian-structure"

    html_url:    "https://community.obsidian.md/plugins/obsidian-structured-plugin"
    github_url:  "https://github.com/dobrovolsky/obsidian-structure"
    description: "Structured plugin. Create hierarchy in notes using \".\""
    about:       "Build hierarchical note structures using dot-separated names (e.g., aws, aws.ec2, aws.ec2.security-groups). Navigate and list parent or child notes, open parent notes, rename notes correctly, and create new notes in root or the current file’s folder."

    stats: {
        downloads:  6709
        updated_at: 1706351103000
    }
}
```

[^template]: [[Obsidian plugin]]
