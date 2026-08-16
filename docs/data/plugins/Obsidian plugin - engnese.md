---
uid: 4f94c3e8-d0d2-5da1-bb63-f73f1ee0ec2f
xid:
  - engnese
aliases:
  - engnese
  - Engnese
  - xxxgeorge/obsidian-engnese
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/engnese
alt:
  - https://github.com/xxxgeorge/obsidian-engnese
downloads: 97
updated at: "2026-04-16T15:34:43Z"
related to:
  - "[[GitHub - 1212504684]]"
remind me:
---

# Engnese

Lets Chinese be typed on an English input method by treating the current token as pinyin and replacing it once a candidate is accepted, which avoids switching input methods. Candidates come from local Rime dictionary files, imported tables included, with a fallback to the longest matching prefix. Candidate shortcuts, paging and optional double-space acceptance are supported, and fenced code, inline code and math are skipped.

```cue
plugin: {
    id:     "engnese"
    name:   "Engnese"
    author: "xxxgeorge"
    repo:   "xxxgeorge/obsidian-engnese"

    html_url:    "https://community.obsidian.md/plugins/engnese"
    github_url:  "https://github.com/xxxgeorge/obsidian-engnese"
    description: "input Chinese in English input method to avoid frequently input method switching. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Type English letters and convert the current token to Chinese by treating it as pinyin in the background, replacing the typed token when a candidate is accepted. Read local Rime .dict.yaml dictionaries (including import_tables), fall back to the longest matching prefix, support candidate shortcuts, paging and optional double-space acceptance, and skip fenced code, inline code, and math."

    stats: {
        downloads:  97
        updated_at: 1776353683000
    }
}
```

[^template]: [[Obsidian plugin]]
