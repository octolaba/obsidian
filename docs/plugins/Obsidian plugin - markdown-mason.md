---
uid: 308ffb3b-cda4-507c-b5bb-47e14ab3f22c
xid:
  - markdown-mason
aliases:
  - markdown-mason
  - Markdown Mason
  - mmomm-org/obsidian-markdown-mason
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/markdown-mason
alt:
  - https://github.com/mmomm-org/obsidian-markdown-mason
downloads: 197
updated at: "2026-07-13T07:24:27Z"
related to:
  - "[[GitHub - 1271052309]]"
remind me:
---

# Markdown Mason

Markdown Mason reshapes pasted or whole-note Markdown to fit the structure of the target note. Headings are cascaded relative to the cursor position, inline citations become real footnotes that are renumbered and deduplicated against the footnotes already present and filed into a Resources section. The transforms run as small scripts managed by the plugin, installed from a curated library or imported from the vault and gated by consent, rather than as loose files.

```cue
plugin: {
    id:     "markdown-mason"
    name:   "Markdown Mason"
    author: "Marcus Breiden"
    repo:   "mmomm-org/obsidian-markdown-mason"

    html_url:    "https://community.obsidian.md/plugins/markdown-mason"
    github_url:  "https://github.com/mmomm-org/obsidian-markdown-mason"
    description: "Reshape pasted or whole-note Markdown to fit a note's structure — heading cascade, footnote renumbering and dedup — plus a runnable, consent-gated script library. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Markdown Mason helps you to keep your notes formatted in a way you like. When you paste a web source into an existing note, the heading levels rarely match and citation numbers restart from [1], colliding with footnotes you already have. Mason fits the incoming text into the target note instead: it cascades headings relative to where the cursor sits, turns inline citations into real footnotes, renumbers and deduplicates them against what's already there, and files them into a Resources section. The transforms run as small scripts managed by the plugin — installed from a curated, reviewed library or imported from your own vault — not as loose files scattered through your notes. This allows you to configure Mason in a way you want, to format your notes in the way you want."

    stats: {
        downloads:  197
        updated_at: 1783927467000
    }
}
```

[^template]: [[Obsidian plugin]]
