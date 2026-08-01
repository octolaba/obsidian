---
uid: 94ad42e4-a563-54dd-8508-4e87fc085f37
xid:
  - windows-file-explorer-links
aliases:
  - windows-file-explorer-links
  - Open in File Explorer
  - disciple-dev/obsidian-plugin-open-file-explorer
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/windows-file-explorer-links
alt:
  - https://github.com/disciple-dev/obsidian-plugin-open-file-explorer
downloads: 153
updated at: "2025-11-17T05:16:39Z"
related to:
  - "[[GitHub - 1091862149]]"
remind me:
---

# Open in File Explorer

Prompts to convert a pasted local Windows file path into a clickable link in the editor. The path becomes a Markdown link pointing at the file protocol address, so it opens in File Explorer, and a shortcut target is launched like an application when it is clicked.

```cue
plugin: {
    id:     "windows-file-explorer-links"
    name:   "Open in File Explorer"
    author: "disciple-dev"
    repo:   "disciple-dev/obsidian-plugin-open-file-explorer"

    html_url:    "https://community.obsidian.md/plugins/windows-file-explorer-links"
    github_url:  "https://github.com/disciple-dev/obsidian-plugin-open-file-explorer"
    description: "Convert links to local Windows filesystem so they can be opened in File Explorer. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Prompt to convert pasted local file paths into clickable file:// links in the editor. Create Markdown links from paths (e.g., C:\\Users\\Public → [Public](file:///C:/Users/Public)) and open .lnk targets like apps when clicked."

    stats: {
        downloads:  153
        updated_at: 1763356599000
    }
}
```

[^template]: [[Obsidian plugin]]
