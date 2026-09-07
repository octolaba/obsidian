---
uid: c5404a40-5434-5cb5-90aa-0fe2590a74ee
xid:
  - local-image-generator
aliases:
  - local-image-generator
  - Local Image Generator
  - johannes-kaindl/local-image-generator
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/local-image-generator
alt:
  - https://github.com/johannes-kaindl/local-image-generator
downloads: 24
updated at: "2026-08-06T18:59:16Z"
related to:
  - "[[GitHub - 1305986071]]"
remind me:
---

# Local Image Generator

Generates images on the local machine with no cloud service or API key, using SD-Turbo for fast 512 by 512 output or FLUX.2 klein 4B through a local mflux install for higher quality and several aspect ratios. Prompt, seed and step count are adjustable, style chips can be applied, and results are rerolled and browsed as history. Images are saved to the vault or turned into a note with the image and its metadata embedded.

```cue
plugin: {
    id:     "local-image-generator"
    name:   "Local Image Generator"
    author: "Johannes Kaindl"
    repo:   "johannes-kaindl/local-image-generator"

    html_url:    "https://community.obsidian.md/plugins/local-image-generator"
    github_url:  "https://github.com/johannes-kaindl/local-image-generator"
    description: "Generate images locally inside Obsidian — SD-Turbo via WebGPU, no external software, no cloud. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Generate images locally in Obsidian with no cloud or API key via SD-Turbo (fast 512×512) or FLUX.2 klein 4B (higher-quality, multiple aspect ratios via local mflux). Adjust prompt, seed and steps, apply style chips, reroll and browse history, then save images or create notes with embedded image and metadata."

    stats: {
        downloads:  24
        updated_at: 1786042756000
    }
}
```

[^template]: [[Obsidian plugin]]
