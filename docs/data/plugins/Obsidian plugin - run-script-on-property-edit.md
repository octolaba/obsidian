---
uid: 6969f7b7-e867-5002-8235-2d317976a291
xid:
  - run-script-on-property-edit
aliases:
  - run-script-on-property-edit
  - Run Script on Property Edit
  - oneautumnmango/run-script-on-property-edit
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/run-script-on-property-edit
alt:
  - https://github.com/oneautumnmango/run-script-on-property-edit
downloads: 226
updated at: "2025-12-15T12:09:05Z"
related to:
  - "[[GitHub - 1116781025]]"
remind me:
---

# Run Script on Property Edit

Run Script on Property Edit watches YAML frontmatter properties and runs a supplied script when one is edited. The property name, its new and previous values, the file path, the file name and the vault path are passed to the script as environment variables, so the script can take conditional file actions.

```cue
plugin: {
    id:     "run-script-on-property-edit"
    name:   "Run Script on Property Edit"
    author: "oneautumnmango"
    repo:   "oneautumnmango/run-script-on-property-edit"

    html_url:    "https://community.obsidian.md/plugins/run-script-on-property-edit"
    github_url:  "https://github.com/oneautumnmango/run-script-on-property-edit"
    description: "Detects when YAML frontmatter properties are edited and runs supplied scripts. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Detect edits to YAML frontmatter properties and run specified scripts automatically. Pass property name, new and previous values, file path, file name and vault path as environment variables to your script for conditional file actions."

    stats: {
        downloads:  226
        updated_at: 1765800545000
    }
}
```

[^template]: [[Obsidian plugin]]
