---
uid: 0532f815-656f-5154-a1f6-09876c3a9416
xid:
  - symbol-linking
aliases:
  - symbol-linking
  - Symbol linking
  - mara-li/obsidian-symbol-linking
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/symbol-linking
alt:
  - https://github.com/mara-li/obsidian-symbol-linking
downloads: 4139
updated at: "2025-03-24T22:46:33Z"
related to:
  - "[[GitHub - 813008008]]"
remind me:
---

# Symbol linking

Adds linking triggered by any symbol, such as an at sign or a hash, with each trigger limited to particular directories, files or file extensions. The recorded inputs state that aliases defined in note metadata are respected, that missing targets can be created from a template or appended as headings in a single file, and that image links can be embedded automatically. The trigger symbol can optionally be kept in the final link text.

```cue
plugin: {
    id:     "symbol-linking"
    name:   "Symbol linking"
    author: "Mara"
    repo:   "mara-li/obsidian-symbol-linking"

    html_url:    "https://community.obsidian.md/plugins/symbol-linking"
    github_url:  "https://github.com/mara-li/obsidian-symbol-linking"
    description: "Adds ability to link with any trigger. Each trigger can limit linking to specific folders or file."
    about:       "Link using any trigger symbol (e.g., @, #) and target specific directories, files, or file extensions while respecting aliases defined in note metadata. Create missing targets from a template or append them as headings in a single file, embed image links automatically, and optionally keep the trigger symbol in the final link text."

    stats: {
        downloads:  4139
        updated_at: 1742856393000
    }
}
```

[^template]: [[Obsidian plugin]]
