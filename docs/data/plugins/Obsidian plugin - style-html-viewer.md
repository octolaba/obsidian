---
uid: cd8ef67a-87be-5417-830b-b1846ad44689
xid:
  - style-html-viewer
aliases:
  - style-html-viewer
  - Style HTML Viewer
  - taihoe/obisidian-html-viewer
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/style-html-viewer
alt:
  - https://github.com/taihoe/obisidian-html-viewer
downloads: 223
updated at: "2026-06-30T06:17:56Z"
related to:
  - "[[GitHub - 1283831549]]"
remind me:
---

# Style HTML Viewer

HTML documents are rendered in Obsidian workspace tabs inside a sandboxed iframe under a strict Content Security Policy. The view switches between a live, auto-reloading preview and the raw source. Relative assets such as stylesheets, images and scripts are resolved to vault URIs, and links are intercepted so local targets open in native tabs while external ones go to the browser.

```cue
plugin: {
    id:     "style-html-viewer"
    name:   "Style HTML Viewer"
    author: "Robin Tan"
    repo:   "taihoe/obisidian-html-viewer"

    html_url:    "https://community.obsidian.md/plugins/style-html-viewer"
    github_url:  "https://github.com/taihoe/obisidian-html-viewer"
    description: "Renders HTML documents natively in Obsidian workspace tabs with local CSS, image, and script asset resolution, CSP security, and link interception. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Render HTML files inside Obsidian workspace tabs using a sandboxed iframe with a strict Content Security Policy. Toggle between live, auto-reloading rendered preview and raw source, convert relative assets to vault URIs, and open local links in native tabs while external links launch your browser."

    stats: {
        downloads:  223
        updated_at: 1782800276000
    }
}
```

[^template]: [[Obsidian plugin]]
