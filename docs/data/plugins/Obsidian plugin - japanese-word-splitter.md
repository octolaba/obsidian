---
uid: aef84e96-f91b-5ce5-81fb-cbff6c457f2a
xid:
  - japanese-word-splitter
aliases:
  - japanese-word-splitter
  - Word Splitting for Japanese in Edit Mode
  - sonarait/cm-japanese-patch
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/japanese-word-splitter
alt:
  - https://github.com/sonarait/cm-japanese-patch
downloads: 6869
updated at: "2022-02-14T03:55:44Z"
related to:
  - "[[GitHub - 458159232]]"
remind me:
---

# Word Splitting for Japanese in Edit Mode

Word Splitting for Japanese in Edit Mode patches Obsidian's built-in CodeMirror editor so Japanese text is split into words in edit mode. Tokenization uses tiny-segmenter, so cursor movement, selection and text operations respect word boundaries.

```cue
plugin: {
    id:     "japanese-word-splitter"
    name:   "Word Splitting for Japanese in Edit Mode"
    author: "sonarait"
    repo:   "sonarait/cm-japanese-patch"

    html_url:    "https://community.obsidian.md/plugins/japanese-word-splitter"
    github_url:  "https://github.com/sonarait/cm-japanese-patch"
    description: "A patch for Obsidian's built-in CodeMirror Editor to support Japanese word splitting."
    about:       "Patch Obsidian's built-in CodeMirror editor to support Japanese word splitting in edit mode. Use tiny-segmenter for Japanese tokenization so cursor movement, selection, and text operations respect word boundaries."

    stats: {
        downloads:  6869
        updated_at: 1644810944000
    }
}
```

[^template]: [[Obsidian plugin]]
