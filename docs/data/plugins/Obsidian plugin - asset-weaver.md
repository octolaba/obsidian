---
uid: 8326a320-8434-5b9f-913c-570da7a6ce4d
xid:
  - asset-weaver
aliases:
  - asset-weaver
  - AssetWeaver
  - 0xkz1/obsidian-asset-weaver
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/asset-weaver
alt:
  - https://github.com/0xkz1/obsidian-asset-weaver
downloads: 118
updated at: "2026-05-15T19:52:40Z"
related to:
  - "[[GitHub - 1234921251]]"
remind me:
---

# AssetWeaver

Scans the vault for untagged images and generates a Markdown sidecar file for each one using a local vision-language model. A sidecar carries YAML frontmatter with title, category, keywords and a short description, plus backlinks to the notes that reference the image. All processing stays local.

```cue
plugin: {
    id:     "asset-weaver"
    name:   "AssetWeaver"
    author: "Kazuki Yunome"
    repo:   "0xkz1/obsidian-asset-weaver"

    html_url:    "https://community.obsidian.md/plugins/asset-weaver"
    github_url:  "https://github.com/0xkz1/obsidian-asset-weaver"
    description: "Automatically generates markdown sidecars for images using a local Vision-Language Model. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Scan your vault for untagged images and generate structured markdown sidecar files using a local Vision-Language Model. Create YAML frontmatter with title, category, keywords and a short description, and list backlinks to notes that reference each image while keeping all processing local for privacy."

    stats: {
        downloads:  118
        updated_at: 1778874760000
    }
}
```

[^template]: [[Obsidian plugin]]
