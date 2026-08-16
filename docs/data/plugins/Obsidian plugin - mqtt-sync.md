---
uid: 9a639df9-8075-5f85-9a8d-46cf3966e5a0
xid:
  - mqtt-sync
aliases:
  - mqtt-sync
  - MQTT Sync
  - vuecwiz/obsidian-mqtt-sync
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/mqtt-sync
alt:
  - https://github.com/vuecwiz/obsidian-mqtt-sync
downloads: 22
updated at: "2026-08-01T02:27:55Z"
related to:
  - "[[GitHub - 1318131201]]"
remind me:
---

# MQTT Sync

Connects Obsidian on desktop to an MQTT broker and turns publications from devices, gateways, scripts, applications and automation into Markdown notes. Messages are normalized and persisted before being routed by ordered, first-match rules that can match delivery metadata, message content, envelope fields, URLs and attachments, while templates control the target note, the inserted block, the insertion mode and the attachment path. MQTT 3.1.1 and MQTT 5 are supported over TCP, TLS, WebSocket and secure WebSocket, with durable recovery, vault idempotency markers, bounded attachment downloads, redacted diagnostics, runtime status and optional result publication. It is desktop-only and requires Obsidian 1.12.7 or newer.

```cue
plugin: {
    id:     "mqtt-sync"
    name:   "MQTT Sync"
    author: "vuecwiz"
    repo:   "vuecwiz/obsidian-mqtt-sync"

    html_url:    "https://community.obsidian.md/plugins/mqtt-sync"
    github_url:  "https://github.com/vuecwiz/obsidian-mqtt-sync"
    description: "Receive MQTT messages and route them into deterministic, recoverable Markdown notes. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "MQTT Sync connects Obsidian desktop to an MQTT Broker. Publications from devices, gateways, scripts, applications, and automation are normalized and persisted before they are routed into Markdown notes by ordered, first-match rules. Rules can match MQTT delivery metadata, message content, envelope fields, URLs, and attachments; templates control the target note, inserted block, insertion mode, and attachment path. The plugin supports MQTT 3.1.1 and MQTT 5 over TCP, TLS, WebSocket, and secure WebSocket transports. It includes durable recovery, Vault idempotency markers, bounded attachment downloads, redacted diagnostics, runtime status, and optional result publication. MQTT Sync is desktop-only and requires Obsidian 1.12.7 or newer."

    stats: {
        downloads:  22
        updated_at: 1785551275000
    }
}
```

[^template]: [[Obsidian plugin]]
