---
uid: fd3e48e9-0fb8-53ff-952d-c30dd2b55108
xid:
  - external-file-embed-and-link
aliases:
  - external-file-embed-and-link
  - External File Embed and Link
  - oylbin/obsidian-external-file-embed-and-link
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/external-file-embed-and-link
alt:
  - https://github.com/oylbin/obsidian-external-file-embed-and-link
downloads: 7416
updated at: "2026-04-11T01:45:23Z"
related to:
  - "[[GitHub - 902702448]]"
remind me:
---

# External File Embed and Link

External File Embed and Link embeds Markdown, PDF, image, audio and video files stored outside the vault and creates links to local files that open in the system's default applications. Local folders are mapped to virtual directory IDs such as home:// or vault:// or a custom one, and files are then referenced as VirtualDirectoryId://relative/path. The relative paths are what carry the links across devices and platforms.

```cue
plugin: {
    id:     "external-file-embed-and-link"
    name:   "External File Embed and Link"
    author: "oylbin"
    repo:   "oylbin/obsidian-external-file-embed-and-link"

    html_url:    "https://community.obsidian.md/plugins/external-file-embed-and-link"
    github_url:  "https://github.com/oylbin/obsidian-external-file-embed-and-link"
    description: "Embed and link local files outside your vault with relative paths for cross-device and multi-platform compatibility."
    about:       "Embed external files (Markdown, PDF, images, audio, video) and create links to local files outside your vault that open with your system's default apps. Map local folders to virtual directory IDs (home://, vault:// or custom) and reference files as VirtualDirectoryId://relative/path for cross-device compatibility."

    stats: {
        downloads:  7416
        updated_at: 1775871923000
    }
}
```

[^template]: [[Obsidian plugin]]
