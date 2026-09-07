---
uid: d7ab80ba-f8a0-5dd3-8669-6764a65ecf76
xid:
  - base-settings
aliases:
  - base-settings
  - Base Settings
  - jaidetree/obsidian-base-settings
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/base-settings
alt:
  - https://github.com/jaidetree/obsidian-base-settings
downloads: 279
updated at: "2026-03-22T02:21:05Z"
related to:
  - "[[GitHub - 1173590977]]"
remind me:
---

# Base Settings

Base Settings enforces shared Obsidian settings across multi-user vaults by deeply merging partial JSON templates into the config files on startup and whenever settings change. Template values take precedence, per-key merge directives select array and concat strategies, and a template whose target config does not yet exist is skipped so user customizations are kept.

```cue
plugin: {
    id:     "base-settings"
    name:   "Base Settings"
    author: "Jay"
    repo:   "jaidetree/obsidian-base-settings"

    html_url:    "https://community.obsidian.md/plugins/base-settings"
    github_url:  "https://github.com/jaidetree/obsidian-base-settings"
    description: "Enforce shared base settings across multi-user vaults by deeply merging template JSON files into config files. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Enforce shared Obsidian settings across multi-user vaults by merging partial JSON templates into .obsidian config files on startup and whenever settings change. Give template values precedence while deep-merging objects, apply per-key merge directives for array/concat strategies, and skip templates for configs that don't yet exist so users keep their customizations."

    stats: {
        downloads:  279
        updated_at: 1774146065000
    }
}
```

[^template]: [[Obsidian plugin]]
