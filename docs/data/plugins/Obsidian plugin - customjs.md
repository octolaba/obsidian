---
uid: 05c2501e-067c-5dea-9e8b-02ffa796e176
xid:
  - customjs
aliases:
  - customjs
  - CustomJS
  - saml-dev/obsidian-custom-js
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/customjs
alt:
  - https://github.com/saml-dev/obsidian-custom-js
downloads: 68545
updated at: "2024-06-07T01:04:57Z"
related to:
  - "[[GitHub - 395444944]]"
remind me:
---

# CustomJS

Loads custom JavaScript classes from files or folders and makes them callable from any JS context, including dataviewjs and templater, through a global customJS object. Scripts can be registered as invocable or startup scripts, and each file must contain exactly one class. The recorded inputs state that it is reusable across desktop and mobile.

```cue
plugin: {
    id:     "customjs"
    name:   "CustomJS"
    author: "saml-dev"
    repo:   "saml-dev/obsidian-custom-js"

    html_url:    "https://community.obsidian.md/plugins/customjs"
    github_url:  "https://github.com/saml-dev/obsidian-custom-js"
    description: "Reuse custom JavaScript across desktop and mobile."
    about:       "Write and load custom JavaScript classes and call them from any JS context in Obsidian, including dataviewjs and templater. Load scripts from files or folders, register invocable and startup scripts, and access instances via the global customJS object; each file must contain exactly one class."

    stats: {
        downloads:  68545
        updated_at: 1717722297000
    }
}
```

[^template]: [[Obsidian plugin]]
