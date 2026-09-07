---
uid: b9a6ad93-9bf4-5a7d-b55a-1841499cf40e
xid:
  - css-resource-variables
aliases:
  - css-resource-variables
  - CSS Resource Variables
  - chrisairbrown-del/CSS-Resource-Variables
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/css-resource-variables
alt:
  - https://github.com/chrisairbrown-del/CSS-Resource-Variables
downloads: 67
updated at: "2026-07-21T17:31:49Z"
related to:
  - "[[GitHub - 1307098697]]"
remind me:
---

# CSS Resource Variables

Maps a local vault file, such as an image or a font, to a CSS custom property so any theme or snippet can reference it through a var() call. The recorded inputs state that this avoids network calls and base64 embedding, and that paths resolve automatically and follow the file when it is renamed or moved.

```cue
plugin: {
    id:     "css-resource-variables"
    name:   "CSS Resource Variables"
    author: "valleytheknight"
    repo:   "chrisairbrown-del/CSS-Resource-Variables"

    html_url:    "https://community.obsidian.md/plugins/css-resource-variables"
    github_url:  "https://github.com/chrisairbrown-del/CSS-Resource-Variables"
    description: "Map a local vault file (image, font, anything) to a CSS custom property, so any theme or snippet can reference your own local files with var(). - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Map a vault file to a CSS custom property so themes and snippets can reference it via var(--name). Provide local images, fonts, or other assets to theme/snippet CSS without network calls or base64 embedding; paths auto-resolve and follow files when renamed or moved."

    stats: {
        downloads:  67
        updated_at: 1784655109000
    }
}
```

[^template]: [[Obsidian plugin]]
