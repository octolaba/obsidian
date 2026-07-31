---
uid: 4843919c-fbe7-513f-bfa8-b61c0793da4e
xid:
  - auto-file-extension
aliases:
  - auto-file-extension
  - Auto File Extension
  - sec-ml/obsidian-auto-file-extension
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/auto-file-extension
alt:
  - https://github.com/sec-ml/obsidian-auto-file-extension
downloads: 88
updated at: "2026-06-03T19:14:05Z"
related to:
  - "[[GitHub - 1168935501]]"
remind me:
---

# Auto File Extension

Auto File Extension renames file extensions from a trickle-down ruleset whose rules match a directory path, file content by regular expression, or both, applying the first rule that matches. It reads file content from disk to decide the extension and runs on save or on demand from a command, so processing can be chained through other plugins. Its recorded About notes that Obsidian does not show non-Markdown files by default, so a further plugin is needed for that.

```cue
plugin: {
    id:     "auto-file-extension"
    name:   "Auto File Extension"
    author: "sec-ml"
    repo:   "sec-ml/obsidian-auto-file-extension"

    html_url:    "https://community.obsidian.md/plugins/auto-file-extension"
    github_url:  "https://github.com/sec-ml/obsidian-auto-file-extension"
    description: "Automatically change file extensions based on a trickle-down ruleset. Rules can match directory path, file content (using RegEx), or both. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Rename file extensions automatically using a trickle-down ruleset that matches by directory path, file content (RegEx), or both. Apply the first matching rule and read file content from disk to decide the correct extension. Plugin can automatically run on file saves/modifications, or can be triggered manually with a command, allowing processing to be chained through multiple plugins. Note: By default, Obsidian can't see non-md files (another plugin will be needed to enable this, such as 'Anything as Markdown')."

    stats: {
        downloads:  88
        updated_at: 1780514045000
    }
}
```

[^template]: [[Obsidian plugin]]
