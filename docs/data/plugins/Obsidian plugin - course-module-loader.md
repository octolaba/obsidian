---
uid: 1849e0d8-5d25-5f29-8572-68d910049356
xid:
  - course-module-loader
aliases:
  - course-module-loader
  - Course Module Loader
  - quintsmart/obsidian-course-module-loader
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/course-module-loader
alt:
  - https://github.com/quintsmart/obsidian-course-module-loader
downloads: 682
updated at: "2025-06-12T07:20:44Z"
related to:
  - "[[GitHub - 977058901]]"
remind me:
---

# Course Module Loader

Course Module Loader downloads a course ZIP file from a direct URL, including Dropbox direct links, and unzips it into a chosen folder in the vault. Subfolders are created as needed, files that already exist are skipped, and macOS metadata entries are ignored.

```cue
plugin: {
    id:     "course-module-loader"
    name:   "Course Module Loader"
    author: "quintsmart"
    repo:   "quintsmart/obsidian-course-module-loader"

    html_url:    "https://community.obsidian.md/plugins/course-module-loader"
    github_url:  "https://github.com/quintsmart/obsidian-course-module-loader"
    description: "Downloads and unzips course module zip files from a URL into a specified vault folder, skipping existing files."
    about:       "Download course ZIP files from a direct URL (including Dropbox direct links) into your vault. Unzip content into a chosen folder, auto-create subfolders, skip files that already exist, and ignore macOS metadata like __MACOSX and .DS_Store."

    stats: {
        downloads:  682
        updated_at: 1749712844000
    }
}
```

[^template]: [[Obsidian plugin]]
