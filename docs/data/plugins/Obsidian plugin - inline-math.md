---
uid: 922bda91-a0dc-542c-bca4-c7ced7eb842f
xid:
  - inline-math
aliases:
  - inline-math
  - No more flickering inline math
  - ryotaushio/obsidian-inline-math
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/inline-math
alt:
  - https://github.com/ryotaushio/obsidian-inline-math
downloads: 9176
updated at: "2024-10-29T11:00:22Z"
related to:
  - "[[GitHub - 679682386]]"
remind me:
---

# No more flickering inline math

No more flickering inline math prevents the flicker Obsidian shows around inline LaTeX by inserting hidden braces around the dollar-delimited math, so it is recognized consistently. The added braces are hidden in the editor and removed automatically when the cursor leaves the math zone, which keeps the note text clean.

```cue
plugin: {
    id:     "inline-math"
    name:   "No more flickering inline math"
    author: "ryotaushio"
    repo:   "ryotaushio/obsidian-inline-math"

    html_url:    "https://community.obsidian.md/plugins/inline-math"
    github_url:  "https://github.com/ryotaushio/obsidian-inline-math"
    description: "Remove flickering inline math."
    about:       "Prevent flickering of inline LaTeX by inserting hidden braces around $...$ so Obsidian consistently recognizes math without visible flashes. Hide the added braces in the editor and remove them automatically when you exit the math zone to keep notes clean."

    stats: {
        downloads:  9176
        updated_at: 1730199622000
    }
}
```

[^template]: [[Obsidian plugin]]
