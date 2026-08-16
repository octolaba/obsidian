---
uid: 54fe15b9-62a7-5115-bcd5-a6b7f7abde34
xid:
  - indent
aliases:
  - indent
  - Indent
  - pixerojan/obsidian-indent
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/indent
alt:
  - https://github.com/pixerojan/obsidian-indent
downloads: 1692
updated at: "2026-05-14T12:24:53Z"
related to:
  - "[[GitHub - 1136792220]]"
remind me:
---

# Indent

Disables indented code blocks so that lines starting with a tab or four or more spaces appear as ordinary, editable indentation in Live Preview. Affected line starts are rewritten with an invisible zero-width non-joiner to break the indented-code rule, while YAML, fenced code blocks, lists and blockquotes are left untouched.

```cue
plugin: {
    id:     "indent"
    name:   "Indent"
    author: "Jan Sandström"
    repo:   "pixerojan/obsidian-indent"

    html_url:    "https://community.obsidian.md/plugins/indent"
    github_url:  "https://github.com/pixerojan/obsidian-indent"
    description: "Disable indented code blocks so tabs/spaces become normal indentation. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Disable indented code blocks so lines starting with tabs or four+ spaces appear as normal, editable indentation in Live Preview. Rewrite affected line starts with an invisible zero-width non-joiner (U+200C) to break the indented-code rule while leaving YAML, fenced code blocks, lists, and blockquotes untouched."

    stats: {
        downloads:  1692
        updated_at: 1778761493000
    }
}
```

[^template]: [[Obsidian plugin]]
