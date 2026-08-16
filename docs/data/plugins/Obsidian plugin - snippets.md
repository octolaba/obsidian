---
uid: 52cac2f9-5f27-5851-8105-e24deefe5cdc
xid:
  - snippets
aliases:
  - snippets
  - Snippets plugin
  - cristianvasquez/obsidian-snippets-plugin
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/snippets
alt:
  - https://github.com/cristianvasquez/obsidian-snippets-plugin
downloads: 6662
updated at: "2021-06-22T09:23:50Z"
related to:
  - "[[GitHub - 322821110]]"
remind me:
---

# Snippets plugin

Code snippets written in a note — the recorded inputs name Python, JavaScript and shell — are executed and their output appended after the code fence or shown in a modal. In preview a recognized snippet carries a run button, and in edit mode the Run command does the same. Placeholders such as vault_path, folder, file_name and file_path are substituted before the snippet runs, and the plugin describes itself as experimental.

```cue
plugin: {
    id:     "snippets"
    name:   "Snippets plugin"
    author: "cristianvasquez"
    repo:   "cristianvasquez/obsidian-snippets-plugin"

    html_url:    "https://community.obsidian.md/plugins/snippets"
    github_url:  "https://github.com/cristianvasquez/obsidian-snippets-plugin"
    description: "Execute simple scripts/snippets. This plugin is experimental."
    about:       "Run code snippets (Python, JavaScript, shell, etc.) directly from notes and append their output after the code fence or display it in a modal. Recognize and run snippets in preview via a run button or invoke the Run command in edit mode; use placeholders like {{vault_path}}, {{folder}}, {{file_name}} and {{file_path}}."

    stats: {
        downloads:  6662
        updated_at: 1624353830000
    }
}
```

[^template]: [[Obsidian plugin]]
