---
uid: 49adfbbe-2004-5e8b-9153-41e369bcad15
xid:
  - import-fixer
aliases:
  - import-fixer
  - Import Fixer
  - tonylee2016/obsidian-import-fixer
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/import-fixer
alt:
  - https://github.com/tonylee2016/obsidian-import-fixer
downloads: 169
updated at: "2026-05-04T01:50:46Z"
related to:
  - "[[GitHub - 1227725685]]"
remind me:
---

# Import Fixer

Cleans notes produced by web clippers such as Evernote, Reddit and Zhihu by removing oversized favicons, avatars, badges, tracking pixels and leftover resource folders. Broken resource wiki links are repaired by relinking to the best matching resources folder, known interface icons are shrunk with a size modifier, and image embeds nested inside link text are stripped.

```cue
plugin: {
    id:     "import-fixer"
    name:   "Import Fixer"
    author: "tonylee2016"
    repo:   "tonylee2016/obsidian-import-fixer"

    html_url:    "https://community.obsidian.md/plugins/import-fixer"
    github_url:  "https://github.com/tonylee2016/obsidian-import-fixer"
    description: "Cleans up web-clipped notes (Evernote, Reddit, Zhihu, etc.): repairs broken resource links and shrinks oversized header favicons, avatars, and UI icons. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Clean notes imported from web clippers by removing oversized favicons, avatars, badges, tracking pixels and leftover resource folders. Repair broken ![[.../.resources/...]] wiki links by relinking to the best res_*.resources folder, shrink known UI icons with a size modifier, and strip image embeds nested inside link text."

    stats: {
        downloads:  169
        updated_at: 1777859446000
    }
}
```

[^template]: [[Obsidian plugin]]
