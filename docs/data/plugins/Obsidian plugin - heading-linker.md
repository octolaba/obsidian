---
uid: 1e1977b4-934d-512f-a8f8-93179ae4bb3c
xid:
  - heading-linker
aliases:
  - heading-linker
  - Heading Linker
  - max-fluff/obsidian-heading-linker
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/heading-linker
alt:
  - https://github.com/max-fluff/obsidian-heading-linker
downloads: 25
updated at: "2026-07-23T15:58:44Z"
related to:
  - "[[GitHub - 1301968629]]"
remind me:
---

# Heading Linker

Heading Linker matches words in notes against headings kept in glossary files and turns them into links, matching every grammatical form such as plurals, declensions and verb endings through morphological stemming in English, Russian, Ukrainian, Spanish, German and French. Matches render as virtual links that change nothing on disk, with hover preview, click to open and right-click actions, and each heading can carry aliases in a comment beneath it. Unlinked mentions are converted into permanent wiki links in one note, a selection or the whole vault, previewed before anything is written, after which they count in the graph and in backlinks. Acronyms stay case-sensitive, and when two files share a heading the plugin asks which one was meant.

```cue
plugin: {
    id:     "heading-linker"
    name:   "Heading Linker"
    author: "max-fluff"
    repo:   "max-fluff/obsidian-heading-linker"

    html_url:    "https://community.obsidian.md/plugins/heading-linker"
    github_url:  "https://github.com/max-fluff/obsidian-heading-linker"
    description: "Auto-link unlinked mentions in your notes to headings in your glossary files, in any word form: plurals, declensions, verb endings, with stemming for six languages. Convert them to real wiki links. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Heading Linker finds words in your notes that match a heading inside the files you keep as glossaries, and turns them into links. Where virtual-link plugins match literal text, this one matches every grammatical form — plurals, declensions, verb endings — through morphological stemming in six languages: English, Russian, Ukrainian, Spanish, German, and French. Write \"projectiles\" and the heading \"Projectile\" still links. A heading is the term, so one file holds a hundred: a glossary, an index for a wiki or knowledge base. Each heading can carry aliases in a comment beneath it. Matches render as virtual links that change nothing on disk: hover to preview, click to open, right-click for actions. Convert unlinked mentions into permanent wiki links in one note, a selection, or the whole vault — previewed before anything is written — and they count in the graph and backlinks. Acronyms stay case-sensitive, and when two files share a heading, the plugin asks which you meant."

    stats: {
        downloads:  25
        updated_at: 1784822324000
    }
}
```

[^template]: [[Obsidian plugin]]
