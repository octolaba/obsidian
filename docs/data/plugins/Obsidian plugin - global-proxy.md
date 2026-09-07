---
uid: d22ddb0d-9972-54a9-9939-92dd6ddde84a
xid:
  - global-proxy
aliases:
  - global-proxy
  - Global Proxy
  - windingblack/obsidian-global-proxy
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/global-proxy
alt:
  - https://github.com/windingblack/obsidian-global-proxy
downloads: 16444
updated at: "2025-06-17T13:28:27Z"
related to:
  - "[[GitHub - 724984936]]"
remind me:
---

# Global Proxy

Configures global SOCKS, HTTP and HTTPS proxies for Obsidian's network requests, aimed at users on restricted networks. When a proxy fails it falls back from SOCKS to HTTP or HTTPS and then to a direct connection. Plugin Tokens can be declared so plugins with their own connections are proxied too, and a comma-separated bypass list excludes URLs.

```cue
plugin: {
    id:     "global-proxy"
    name:   "Global Proxy"
    author: "windingblack"
    repo:   "windingblack/obsidian-global-proxy"

    html_url:    "https://community.obsidian.md/plugins/global-proxy"
    github_url:  "https://github.com/windingblack/obsidian-global-proxy"
    description: "Configure network proxies for users in areas with restricted networks."
    about:       "Configure global SOCKS, HTTP, and HTTPS proxies to route Obsidian network requests, automatically falling back from SOCKS to HTTP/HTTPS to direct when a proxy fails. Declare Plugin Tokens to proxy plugins with their own connections and set a comma-separated bypass list to exclude URLs."

    stats: {
        downloads:  16444
        updated_at: 1750166907000
    }
}
```

[^template]: [[Obsidian plugin]]
