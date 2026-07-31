---
uid: 7c5a658f-e114-5b93-8020-eba30262534b
xid:
  - replicate
aliases:
  - replicate
  - Replicate
  - dsebastien/obsidian-replicate
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/replicate
alt:
  - https://github.com/dsebastien/obsidian-replicate
downloads: 448
updated at: "2026-07-18T12:34:13Z"
related to:
  - "[[GitHub - 844032658]]"
remind me:
---

# Replicate

Replicate sends selected text or a typed prompt to a model hosted on Replicate.com, such as Stable Diffusion or FLUX.1, to generate images. The model and version are chosen in the plugin and free-form JSON can be sent as model input; generated URLs can be copied or appended to the current note as Markdown image embeds. The recorded text states that images persist on Replicate for only one hour.

```cue
plugin: {
    id:     "replicate"
    name:   "Replicate"
    author: "Sébastien Dubois"
    repo:   "dsebastien/obsidian-replicate"

    html_url:    "https://community.obsidian.md/plugins/replicate"
    github_url:  "https://github.com/dsebastien/obsidian-replicate"
    description: "Replicate.com integration. Generate images using AI."
    about:       "Generate images from selected text or a typed prompt using any Replicate.com model like Stable Diffusion or FLUX.1. Select model/version, send free-form JSON as model input, and optionally copy generated URLs or append markdown image embeds to the current note; images persist on Replicate for only one hour."

    stats: {
        downloads:  448
        updated_at: 1784378053000
    }
}
```

[^template]: [[Obsidian plugin]]
