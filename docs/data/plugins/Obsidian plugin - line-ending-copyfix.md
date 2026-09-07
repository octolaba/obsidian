---
uid: 3c93fecc-6ca7-580e-9a35-e7d7767186e4
xid:
  - line-ending-copyfix
aliases:
  - line-ending-copyfix
  - Fix Line Endings on Copy
  - kiwijanus/obsidian-line-ending-copyfix
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/line-ending-copyfix
alt:
  - https://github.com/kiwijanus/obsidian-line-ending-copyfix
downloads: 358
updated at: "2025-10-14T10:16:04Z"
related to:
  - "[[GitHub - 1018774014]]"
remind me:
---

# Fix Line Endings on Copy

Converts Unix-style LF to Windows CRLF when text is copied on Windows, so formatting survives in applications that expect carriage returns. The conversion applies to manual selections, code-block copy buttons, current-line copies, and pop-out windows, and the recorded inputs state that the Markdown files themselves are not modified.

```cue
plugin: {
    id:     "line-ending-copyfix"
    name:   "Fix Line Endings on Copy"
    author: "kiwijanus"
    repo:   "kiwijanus/obsidian-line-ending-copyfix"

    html_url:    "https://community.obsidian.md/plugins/line-ending-copyfix"
    github_url:  "https://github.com/kiwijanus/obsidian-line-ending-copyfix"
    description: "Change line endings to CRLF when copying text on Windows (add carriage return)."
    about:       "Convert Unix-style LF (\\n) to Windows CRLF (\\r\\n) when copying text on Windows to preserve formatting in apps that expect CRLF. Apply conversion to manual selections, code-block copy buttons, current-line copies and pop-out windows without modifying your .md files."

    stats: {
        downloads:  358
        updated_at: 1760436964000
    }
}
```

[^template]: [[Obsidian plugin]]
