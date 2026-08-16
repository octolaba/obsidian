---
uid: eec4337e-7742-551a-a7ba-e31bc68088f3
xid:
  - cm-chs-patch
aliases:
  - cm-chs-patch
  - Simplified Chinese Word Splitting
  - aidenlx/cm-chs-patch
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/cm-chs-patch
alt:
  - https://github.com/aidenlx/cm-chs-patch
downloads: 66910
updated at: "2026-05-16T15:48:01Z"
related to:
  - "[[GitHub - 353938578]]"
remind me:
---

# Simplified Chinese Word Splitting

Adds Simplified Chinese word splitting to Obsidian's CodeMirror editor, so double-clicking selects a Chinese word in Edit Mode and word-wise cursor motions work in Vim Mode. Segmentation uses the system engine by default, with jieba-wasm as an option for finer splitting, new-word discovery and custom dictionaries.

```cue
plugin: {
    id:     "cm-chs-patch"
    name:   "Simplified Chinese Word Splitting"
    author: "Aiden Liu"
    repo:   "aidenlx/cm-chs-patch"

    html_url:    "https://community.obsidian.md/plugins/cm-chs-patch"
    github_url:  "https://github.com/aidenlx/cm-chs-patch"
    description: "Adds Simplified Chinese word splitting support for the editor and Vim mode."
    about:       "Add Simplified Chinese word splitting to Obsidian's CodeMirror editor, enabling double-click selection of Chinese words in Edit Mode and word-wise cursor motions in Vim Mode. Default to the system segmentation engine, with optional jieba-wasm for finer segmentation, new-word discovery and custom dictionaries."

    stats: {
        downloads:  66910
        updated_at: 1778946481000
    }
}
```

[^template]: [[Obsidian plugin]]
