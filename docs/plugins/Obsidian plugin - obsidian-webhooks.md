---
uid: bee4d13b-e595-5a6e-8d35-85a2c08cb351
xid:
  - obsidian-webhooks
aliases:
  - obsidian-webhooks
  - Webhook Plugin
  - trashhalo/obsidian-webhooks
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/obsidian-webhooks
alt:
  - https://github.com/trashhalo/obsidian-webhooks
downloads: 9533
updated at: "2022-07-13T12:37:02Z"
related to:
  - "[[GitHub - 417881444]]"
remind me:
---

# Webhook Plugin

The editor is connected to webhooks so that events from external services append to or update notes. Rules defined on the companion webhook service send POST requests carrying markdown, which create or modify notes from actions such as a saved Spotify track, a voice command or a Slack reaction.

```cue
plugin: {
    id:     "obsidian-webhooks"
    name:   "Webhook Plugin"
    author: "trashhalo"
    repo:   "trashhalo/obsidian-webhooks"

    html_url:    "https://community.obsidian.md/plugins/obsidian-webhooks"
    github_url:  "https://github.com/trashhalo/obsidian-webhooks"
    description: "Connect your editor to the internet of things through webhooks."
    about:       "Connect Obsidian to webhooks and external apps to capture events and append or update notes with incoming markdown. Define rules on the companion webhook service to send POST requests that create or modify notes from actions like saved Spotify tracks, voice commands, or Slack reactions."

    stats: {
        downloads:  9533
        updated_at: 1657715822000
    }
}
```

[^template]: [[Obsidian plugin]]
