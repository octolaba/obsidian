---
uid: 98f43c6e-17cb-5b47-b821-fb09bac028dc
xid:
  - viewer-ftags
aliases:
  - viewer-ftags
  - Viewer ftags
  - d7sd6u/obsidian-viewer-ftags
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/viewer-ftags
alt:
  - https://github.com/d7sd6u/obsidian-viewer-ftags
downloads: 869
updated at: "2025-05-28T21:22:32Z"
related to:
  - "[[GitHub - 937966258]]"
remind me:
---

# Viewer ftags

Viewer ftags displays a file's ftags as chips at the top of the Markdown view, with brightness indicating ancestor distance so immediate parents appear brightest. Each chip carries a remove button that sends the file to the inbox when no non-inbox ftags remain. Child chips appear below, limited to five with an ellipsis for the rest, and tooltips, explorer-like right-click menus and an add-tag button when crosslink-advanced is enabled complete the view.

```cue
plugin: {
    id:     "viewer-ftags"
    name:   "Viewer ftags"
    author: "d7sd6u"
    repo:   "d7sd6u/obsidian-viewer-ftags"

    html_url:    "https://community.obsidian.md/plugins/viewer-ftags"
    github_url:  "https://github.com/d7sd6u/obsidian-viewer-ftags"
    description: "Add file's ftags as chips at the top of the markdown view."
    about:       "Display tag-style chips above each file view to show all ftags (clones/symlinks) with brightness indicating ancestor distance. Render immediate parents brightest and include a remove button that sends files to the inbox if no non-inbox ftags remain. Show child chips below (limit to five with an ellipsis for more), add tooltips and explorer-like right-click menus, and surface an add-tag button when crosslink-advanced is enabled."

    stats: {
        downloads:  869
        updated_at: 1748467352000
    }
}
```

[^template]: [[Obsidian plugin]]
