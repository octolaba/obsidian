---
uid: 24ba00aa-6c60-537f-bafc-b847121a75b9
xid:
  - attachment-placement
aliases:
  - attachment-placement
  - Attachment Placement
  - hutnerr/obsidian-attachment-placement
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/attachment-placement
alt:
  - https://github.com/hutnerr/obsidian-attachment-placement
downloads: 513
updated at: "2026-05-26T16:06:14Z"
related to:
  - "[[GitHub - 1140065579]]"
remind me:
---

# Attachment Placement

Applies rules that decide where newly created attachments are placed, walking up the directory tree and using the first rule that matches the file or folder. Pasted images and other assets are therefore organized by the context they were added in, with a default location used when no rule matches.

```cue
plugin: {
    id:     "attachment-placement"
    name:   "Attachment Placement"
    author: "hutnerr"
    repo:   "hutnerr/obsidian-attachment-placement"

    html_url:    "https://community.obsidian.md/plugins/attachment-placement"
    github_url:  "https://github.com/hutnerr/obsidian-attachment-placement"
    description: "Define rules for more advanced and custom placement of newly created attachments. Useful for people who want to organize their assets based on where they are used or added into the vault. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Place new attachments according to file or folder-specific rules by walking up the directory tree and applying the first matching rule. Keep pasted images and other resources organized by context and fall back to a default location when no rule applies."

    stats: {
        downloads:  513
        updated_at: 1779811574000
    }
}
```

[^template]: [[Obsidian plugin]]
