---
uid: f965912f-4919-5e17-812a-2eb240982e6f
xid:
  - inline-properties
aliases:
  - inline-properties
  - Inline Properties
  - zizouet/obsidian-dynamic-variables
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/inline-properties
alt:
  - https://github.com/zizouet/obsidian-dynamic-variables
downloads: 235
updated at: "2026-07-13T12:23:59Z"
related to:
  - "[[GitHub - 1274578035]]"
remind me:
---

# Inline Properties

Inline Properties references frontmatter properties anywhere in the vault through a double-brace variable syntax, covering nested fields and paths into other notes. Values render inline in Live Preview and Reading mode, and hovering reveals the raw token so it can be edited. Autocomplete triggers on the opening braces, and a resolved value can be copied for pasting.

```cue
plugin: {
    id:     "inline-properties"
    name:   "Inline Properties"
    author: "fr4nc0i5"
    repo:   "zizouet/obsidian-dynamic-variables"

    html_url:    "https://community.obsidian.md/plugins/inline-properties"
    github_url:  "https://github.com/zizouet/obsidian-dynamic-variables"
    description: "Reference note properties as inline variables anywhere in your vault using {{variable}} syntax. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Reference frontmatter properties anywhere using {{variable}} syntax, including nested fields and cross-note paths. Render values inline in Live Preview and Reading mode, hover to reveal and edit the raw token, autocomplete on '{{', and copy to paste resolved values."

    stats: {
        downloads:  235
        updated_at: 1783945439000
    }
}
```

[^template]: [[Obsidian plugin]]
