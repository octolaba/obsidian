---
uid: c31fafa4-e712-56aa-b491-bba8c31b86b3
xid:
  - discord-export
aliases:
  - discord-export
  - Discord Export
  - malweis/obsidian-discord-export
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/discord-export
alt:
  - https://github.com/malweis/obsidian-discord-export
downloads: 168
updated at: "2026-05-27T22:33:22Z"
related to:
  - "[[GitHub - 1251583777]]"
remind me:
---

# Discord Export

Prepares a note for posting on Discord by opening a modal that splits it into numbered, copy-ready chunks within the 2,000 or 4,000 character limit, each with a copy button and a character count. Splits fall on paragraph boundaries, and a line containing only plus signs forces a split at that point. Indent mode adds Discord-compatible paragraph indentation while splitter mode only splits; both strip frontmatter, tags and horizontal rules, and content wrapped in curly braces is excluded.

```cue
plugin: {
    id:     "discord-export"
    name:   "Discord Export"
    author: "malweis"
    repo:   "malweis/obsidian-discord-export"

    html_url:    "https://community.obsidian.md/plugins/discord-export"
    github_url:  "https://github.com/malweis/obsidian-discord-export"
    description: "Prepares your note for posting on Discord: adds paragraph indentation, strips frontmatter and tags, and splits into 2,000 or 4,000 character chunks with copy buttons. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Opens a modal showing your note split into numbered, copy-ready chunks that fit within Discord's 2,000 or 4,000 character limit. Each chunk has a Copy button and a character count. Chunks always split at paragraph boundaries. Indent mode adds Discord-compatible indentation to each paragraph. Splitter mode splits only, with no indentation added. Both modes strip frontmatter, tags, and horizontal rules from the output. Wrap content in curly braces to exclude it from the output. Place +++ on its own line to force a chunk split at that point."

    stats: {
        downloads:  168
        updated_at: 1779921202000
    }
}
```

[^template]: [[Obsidian plugin]]
