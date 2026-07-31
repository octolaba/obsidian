---
uid: e74c4276-45cf-5dd2-a9ca-cfc1ea9d7db5
xid:
  - live-preview
aliases:
  - live-preview
  - HTML Preview
  - hxwguang/obsidian-live-preview
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/live-preview
alt:
  - https://github.com/hxwguang/obsidian-live-preview
downloads: 412
updated at: "2026-06-10T09:15:37Z"
related to:
  - "[[GitHub - 1237022485]]"
remind me:
---

# HTML Preview

Previews HTML files live, either in an embedded pane or in the system browser, served by a local HTTP server so that relative paths, CSS, scripts, fonts, and images resolve correctly. Edits reload automatically over a WebSocket, served files are restricted to the chosen directory, and the port is incremented automatically when it is busy. The recorded description compares the behaviour to VSCode Live Preview.

```cue
plugin: {
    id:     "live-preview"
    name:   "HTML Preview"
    author: "HxGuang"
    repo:   "hxwguang/obsidian-live-preview"

    html_url:    "https://community.obsidian.md/plugins/live-preview"
    github_url:  "https://github.com/hxwguang/obsidian-live-preview"
    description: "Live HTML preview with local HTTP server and auto-reload, like VSCode Live Preview. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Preview HTML files live in Obsidian using an embedded pane or open them in your system browser, served by a local HTTP server so relative paths, CSS/JS, fonts, and images work correctly. Reload edits automatically via WebSocket, restrict served files to the chosen directory, and auto-increment ports if busy."

    stats: {
        downloads:  412
        updated_at: 1781082937000
    }
}
```

[^template]: [[Obsidian plugin]]
