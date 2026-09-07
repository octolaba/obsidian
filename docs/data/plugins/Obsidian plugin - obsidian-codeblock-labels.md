---
uid: d74e5a6a-0090-51af-a14b-5e31fb63c75b
xid:
  - obsidian-codeblock-labels
aliases:
  - obsidian-codeblock-labels
  - Code Block Labels
  - stbowers/obsidian-codeblock-labels
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/obsidian-codeblock-labels
alt:
  - https://github.com/stbowers/obsidian-codeblock-labels
downloads: 5106
updated at: "2022-01-28T01:25:38Z"
related to:
  - "[[GitHub - 452872701]]"
remind me:
---

# Code Block Labels

Code Block Labels renders a label for a fenced code block, written in curly braces after the language specifier on the first line. A generated codeblock-label CSS class styles the label and the adjacent block, the language is used as the label when none is given, and live preview is not supported.

```cue
plugin: {
    id:     "obsidian-codeblock-labels"
    name:   "Code Block Labels"
    author: "stbowers"
    repo:   "stbowers/obsidian-codeblock-labels"

    html_url:    "https://community.obsidian.md/plugins/obsidian-codeblock-labels"
    github_url:  "https://github.com/stbowers/obsidian-codeblock-labels"
    description: "Add labels to fenced code blocks."
    about:       "Render labels for fenced code blocks by placing a label in curly braces after the language specifier on the first line. Style labels and adjacent code blocks with the generated codeblock-label CSS class, fall back to using the language as a label if none is provided, and note that live preview isn't supported."

    stats: {
        downloads:  5106
        updated_at: 1643333138000
    }
}
```

[^template]: [[Obsidian plugin]]
