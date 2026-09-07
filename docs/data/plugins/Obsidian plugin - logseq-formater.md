---
uid: 38599aa5-695a-58a3-b76e-348c49f9d657
xid:
  - logseq-formater
aliases:
  - logseq-formater
  - Logseq Formater
  - fengshuzi/logseq-formater
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/logseq-formater
alt:
  - https://github.com/fengshuzi/logseq-formater
downloads: 117
updated at: "2026-08-04T03:47:14Z"
related to:
  - "[[GitHub - 1043611958]]"
remind me:
---

# Logseq Formater

Converts Logseq syntax to Markdown automatically when a Markdown file is opened, following the rules of a provided Python script. Block references render as inline previews, an id:: property becomes a block anchor, and clock summaries are appended to DONE tasks. TODO handling offers three modes: keep the original, display as visual tasks, or convert to Markdown checkboxes.

```cue
plugin: {
    id:     "logseq-formater"
    name:   "Logseq Formater"
    author: "fengshuzi"
    repo:   "fengshuzi/logseq-formater"

    html_url:    "https://community.obsidian.md/plugins/logseq-formater"
    github_url:  "https://github.com/fengshuzi/logseq-formater"
    description: "Automatically converts Logseq syntax to Markdown when opening MD files, based on provided Python script rules. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Convert Logseq syntax to Markdown automatically when opening Markdown files. Render ((block-id)) as inline block previews, translate id:: block-id to ^block-id, append :LOGBOOK: clock summaries to DONE tasks, and offer three TODO modes: keep original, display as visual tasks, or convert to Markdown checkboxes."

    stats: {
        downloads:  117
        updated_at: 1785815234000
    }
}
```

[^template]: [[Obsidian plugin]]
