---
uid: 29d60a3f-b08a-5279-85f7-0af4cb6ecd29
xid:
  - tsconfig-alias
aliases:
  - tsconfig-alias
  - Tsconfig Alias Image Resolver
  - cmsz001/obsidian-tsconfig-alias
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/tsconfig-alias
alt:
  - https://github.com/cmsz001/obsidian-tsconfig-alias
downloads: 24
updated at: "2026-07-31T10:06:08Z"
related to:
  - "[[GitHub - 1318163650]]"
remind me:
---

# Tsconfig Alias Image Resolver

Resolves tsconfig.json path aliases used in image references so that @/ style paths render in Reading View and Live Preview. It reads compilerOptions.paths from the vault root and rewrites rendered image elements and internal-embed placeholders at render time, leaving the note files on disk unmodified. Aliases reload automatically when tsconfig.json changes.

```cue
plugin: {
    id:     "tsconfig-alias"
    name:   "Tsconfig Alias Image Resolver"
    author: "CMSZ"
    repo:   "cmsz001/obsidian-tsconfig-alias"

    html_url:    "https://community.obsidian.md/plugins/tsconfig-alias"
    github_url:  "https://github.com/cmsz001/obsidian-tsconfig-alias"
    description: "Read tsconfig.json compilerOptions.paths and resolve @/… style image paths in real time so images render in Obsidian. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Resolve @/… tsconfig.json path-alias image references in real time so images render in Reading View and Live Preview without modifying note files. Read compilerOptions.paths at the vault root and rewrite rendered <img> elements and internal-embed placeholders at render time. Auto-reload aliases when tsconfig.json changes and never edit notes on disk."

    stats: {
        downloads:  24
        updated_at: 1785492368000
    }
}
```

[^template]: [[Obsidian plugin]]
