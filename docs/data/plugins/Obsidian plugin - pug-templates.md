---
uid: 3907c7d5-f6ca-5823-b88e-6e7d55917cf2
xid:
  - pug-templates
aliases:
  - pug-templates
  - Pug Templates
  - nicholas-wilcox/pug-templates-obsidian-plugin
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/pug-templates
alt:
  - https://github.com/nicholas-wilcox/pug-templates-obsidian-plugin
downloads: 312
updated at: "2024-09-08T16:09:52Z"
related to:
  - "[[GitHub - 667240389]]"
remind me:
---

# Pug Templates

Renders Pug templates written inside pug code blocks and injects the current note's front matter into the template context as fm. Reusable partials are supported through include and extend, resolved from a configurable includes folder that defaults to a pug-includes directory under the Obsidian configuration folder.

```cue
plugin: {
    id:     "pug-templates"
    name:   "Pug Templates"
    author: "nicholas-wilcox"
    repo:   "nicholas-wilcox/pug-templates-obsidian-plugin"

    html_url:    "https://community.obsidian.md/plugins/pug-templates"
    github_url:  "https://github.com/nicholas-wilcox/pug-templates-obsidian-plugin"
    description: "Use the Pug templating engine in your vault."
    about:       "Render Pug templates inside pug code blocks and inject the current note's front matter as fm into the template context. Support include/extend partials via a configurable includes folder (defaults to .obsidian/pug-includes) for reusable templates."

    stats: {
        downloads:  312
        updated_at: 1725811792000
    }
}
```

[^template]: [[Obsidian plugin]]
