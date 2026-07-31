---
uid: 20f3bbd5-1fd5-543c-8113-d36f720d5f2f
xid:
  - obsidian-user-plugins
aliases:
  - obsidian-user-plugins
  - User Plugins
  - mnowotnik/obsidian-user-plugins
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/obsidian-user-plugins
alt:
  - https://github.com/mnowotnik/obsidian-user-plugins
downloads: 6088
updated at: "2024-11-16T14:59:07Z"
related to:
  - "[[GitHub - 488729461]]"
remind me:
---

# User Plugins

JavaScript files or snippets run with direct access to Obsidian's plugin API, so commands and small automations can be written without building a full plugin. Scripts are loaded from a designated folder and enabled individually with toggles. The recorded caution is to run only code that is fully trusted, since a script can modify or delete notes.

```cue
plugin: {
    id:     "obsidian-user-plugins"
    name:   "User Plugins"
    author: "mnowotnik"
    repo:   "mnowotnik/obsidian-user-plugins"

    html_url:    "https://community.obsidian.md/plugins/obsidian-user-plugins"
    github_url:  "https://github.com/mnowotnik/obsidian-user-plugins"
    description: "Use js files or snippets to code your own quick and dirty plugins."
    about:       "Run JavaScript snippets with direct access to Obsidian's plugin API to add commands, automate workflows, and prototype plugins without building full plugins. Load scripts from a designated folder and enable them with toggles to test behavior, and run only code you fully trust because scripts can modify or delete notes."

    stats: {
        downloads:  6088
        updated_at: 1731769147000
    }
}
```

[^template]: [[Obsidian plugin]]
