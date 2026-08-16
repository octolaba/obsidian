---
uid: 7c47f120-7eac-5115-90c7-efcf9be08888
xid:
  - sequencer
aliases:
  - sequencer
  - Sequencer
  - alieron/obsidian-sequencer
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/sequencer
alt:
  - https://github.com/alieron/obsidian-sequencer
downloads: 388
updated at: "2026-05-17T13:48:40Z"
related to:
  - "[[GitHub - 882787633]]"
remind me:
---

# Sequencer

Sequencer organises notes into sequences using a system that behaves like a doubly-linked list. Each note declares prev and next links in its frontmatter, and those links build linear chains that can be traversed forward or backward.

```cue
plugin: {
    id:     "sequencer"
    name:   "Sequencer"
    author: "alieron"
    repo:   "alieron/obsidian-sequencer"

    html_url:    "https://community.obsidian.md/plugins/sequencer"
    github_url:  "https://github.com/alieron/obsidian-sequencer"
    description: "Organise and traverse through notes as a sequence using a doubly-linked list like system. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Navigate notes sequentially by adding prev and next frontmatter links to your files. Define prev and next in each note's frontmatter to build linear chains and move forward or backward through the sequence."

    stats: {
        downloads:  388
        updated_at: 1779025720000
    }
}
```

[^template]: [[Obsidian plugin]]
