---
uid: d80b85cc-b607-5351-97fe-141f484e99c3
xid:
  - vault-telegram-bridge
aliases:
  - vault-telegram-bridge
  - Vault Telegram Bridge
  - n23eos/vault_telegram_bridge
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/vault-telegram-bridge
alt:
  - https://github.com/n23eos/vault_telegram_bridge
downloads: 91
updated at: "2026-07-17T01:06:24Z"
related to:
  - "[[GitHub - 1293553499]]"
remind me:
---

# Vault Telegram Bridge

Captures messages sent to a Telegram bot into the vault, with no server required. While Obsidian is open the plugin polls Telegram and appends new messages to the day's daily note, under the heading and line format that is configured — plain text, code block or callout. The recorded About states that the capture is duplicate-safe when a desktop and a phone share one vault, that only text is taken and photos, voice notes and files are skipped and reported, that the bot binds to the first chat writing to it and never reads other chats, and that Telegram drops undelivered messages after 24 hours.

```cue
plugin: {
    id:     "vault-telegram-bridge"
    name:   "Vault Telegram Bridge"
    author: "N23eos"
    repo:   "n23eos/vault_telegram_bridge"

    html_url:    "https://community.obsidian.md/plugins/vault-telegram-bridge"
    github_url:  "https://github.com/n23eos/vault_telegram_bridge"
    description: "Capture messages from a Telegram bot in your vault. No server required. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Your fastest way into Obsidian. Message this bot from anywhere — Telegram opens instantly, even when Obsidian on your phone doesn't — and the text lands in today's daily note. Requires the Vault Telegram Bridge plugin, configured with this bot's token. While Obsidian is open, the plugin polls Telegram and appends new messages under the heading and line format you set — plain, code block, or callout. Duplicate-safe: a desktop and a phone syncing one vault never write the same message twice. Privacy: the bot never sends messages, never reads other chats, and binds to the first chat that writes to it. Limits: text only (photos, voice notes and files are skipped and reported). Telegram drops undelivered messages after 24 hours, so open Obsidian at least once a day."

    stats: {
        downloads:  91
        updated_at: 1784250384000
    }
}
```

[^template]: [[Obsidian plugin]]
