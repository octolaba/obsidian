---
uid: 88cd707d-288d-56ed-bceb-9cd7a2313c57
xid:
  - thai-bracket-remap
aliases:
  - thai-bracket-remap
  - Thai Bracket Remap
  - khunpoom/Thai-bracket-remap
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/thai-bracket-remap
alt:
  - https://github.com/khunpoom/Thai-bracket-remap
downloads: 34
updated at: "2026-07-12T02:00:20Z"
related to:
  - "[[GitHub - 1286920534]]"
remind me:
---

# Thai Bracket Remap

Thai Bracket Remap converts two Thai characters into the opening and closing square brackets as they are typed in the editor, replacing them immediately so no backspacing is needed. The character pairs live in a map inside the plugin's main script, and the plugin is reloaded to apply a change.

```cue
plugin: {
    id:     "thai-bracket-remap"
    name:   "Thai Bracket Remap"
    author: "Poom"
    repo:   "khunpoom/Thai-bracket-remap"

    html_url:    "https://community.obsidian.md/plugins/thai-bracket-remap"
    github_url:  "https://github.com/khunpoom/Thai-bracket-remap"
    description: "แปลงตัวอักษร ฃ ให้กลายเป็น [ และ ฅ ให้กลายเป็น ] ทันทีที่พิมพ์ในตัวแก้ไข - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Remap Thai characters ฃ and ฅ to [ and ] as you type in Obsidian's editor, replacing them immediately without needing to backspace. Edit the CHAR_MAP in main.js to change character pairs and reload the plugin to apply changes."

    stats: {
        downloads:  34
        updated_at: 1783821620000
    }
}
```

[^template]: [[Obsidian plugin]]
