---
uid: c8157983-1eb1-59fd-b004-47c8ba85d34c
xid:
  - mochi-cards-pro
aliases:
  - mochi-cards-pro
  - Mochi Cards Pro
  - xhayden/obsidian-mochi-cards-pro
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/mochi-cards-pro
alt:
  - https://github.com/xhayden/obsidian-mochi-cards-pro
downloads: 3067
updated at: "2025-09-24T18:45:28Z"
related to:
  - "[[GitHub - 643039140]]"
remind me:
---

# Mochi Cards Pro

Mochi Cards Pro creates flashcards on Mochi.cards through the API that comes with Mochi's Pro subscription, so a Mochi Pro API key must be supplied to enable exports. Cards are authored as headings naming the card, with any Markdown or LaTeX content beneath, then selected singly or in groups and sent with the Export Card from Text command. Mochi templates that begin with a name in double angle brackets followed by an input element are supported.

```cue
plugin: {
    id:     "mochi-cards-pro"
    name:   "Mochi Cards Pro"
    author: "xhayden"
    repo:   "xhayden/obsidian-mochi-cards-pro"

    html_url:    "https://community.obsidian.md/plugins/mochi-cards-pro"
    github_url:  "https://github.com/xhayden/obsidian-mochi-cards-pro"
    description: "Create flashcards on Mochi.cards using the API provided by Mochi's Pro subscription."
    about:       "Create Mochi flashcards from Markdown notes using Mochi Pro's premium API; supply your Mochi Pro API key to enable exports. Author cards as headings like # Card Name with any Markdown or LaTeX content, select one or many, then run the Export Card from Text command to send them to Mochi. Use Mochi templates that start with << Name >> <input value=\"\">."

    stats: {
        downloads:  3067
        updated_at: 1758739528000
    }
}
```

[^template]: [[Obsidian plugin]]
