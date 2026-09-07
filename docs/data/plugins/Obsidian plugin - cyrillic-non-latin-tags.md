---
uid: 5f26fe87-85ab-55ab-8be7-e5b535a3a923
xid:
  - cyrillic-non-latin-tags
aliases:
  - cyrillic-non-latin-tags
  - Cyrillic and Non-Latin Tags
  - javatutor-ru/obsidian-cyrillic-non-latin-tags
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/cyrillic-non-latin-tags
alt:
  - https://github.com/javatutor-ru/obsidian-cyrillic-non-latin-tags
downloads: 82
updated at: "2026-06-09T15:52:28Z"
related to:
  - "[[GitHub - 1257182061]]"
remind me:
---

# Cyrillic and Non-Latin Tags

Adds CSS classes to tags containing non-Latin letters, such as Cyrillic, hieroglyphs and diacritics, in Editing view: a generic class marking the tag as non-Latin and a personal class naming the tag itself. Latin tags are left unchanged, and the slashes of nested tags are collapsed into concatenated class names. The stated purpose is to make such tags styleable from CSS snippets and third-party plugins.

```cue
plugin: {
    id:     "cyrillic-non-latin-tags"
    name:   "Cyrillic and Non-Latin Tags"
    author: "Kirill Chokparov"
    repo:   "javatutor-ru/obsidian-cyrillic-non-latin-tags"

    html_url:    "https://community.obsidian.md/plugins/cyrillic-non-latin-tags"
    github_url:  "https://github.com/javatutor-ru/obsidian-cyrillic-non-latin-tags"
    description: "Adds custom CSS classes to tags containing any non-Latin letters (cyrillic, hieroglyphs, diacritics, etc.) in Editing view. Enables styling non-Latin tags via CSS snippets and third-party plugins. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "The plugin adds CSS classes to tags containing non-Latin characters in Editing view, giving a generic \"cm-tag-non-latin\" class and a personal \"cm-tag-[tag_name]\" class for targeted styling. Leaves Latin tags unchanged and collapses nested tag slashes (\"/\") into concatenated class names for compatibility."

    stats: {
        downloads:  82
        updated_at: 1781020348000
    }
}
```

[^template]: [[Obsidian plugin]]
