---
uid: 374db33e-d47f-53a2-98b4-119d70409ff9
xid:
  - soc-toolkit
aliases:
  - soc-toolkit
  - SOC Toolkit
  - michaelmassoni/obsidian-soc-toolkit
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/soc-toolkit
alt:
  - https://github.com/michaelmassoni/obsidian-soc-toolkit
downloads: 704
updated at: "2025-12-05T11:48:42Z"
related to:
  - "[[GitHub - 996099416]]"
remind me:
---

# SOC Toolkit

IPv4 and IPv6 addresses found in notes are checked for reputation against VirusTotal and AbuseIPDB, defanged formats included. Addresses are defanged in place, either fully or at the last dot, and checks run from the right-click menu or the command palette. Results are cached to reduce the number of API calls.

```cue
plugin: {
    id:     "soc-toolkit"
    name:   "SOC Toolkit"
    author: "michaelmassoni"
    repo:   "michaelmassoni/obsidian-soc-toolkit"

    html_url:    "https://community.obsidian.md/plugins/soc-toolkit"
    github_url:  "https://github.com/michaelmassoni/obsidian-soc-toolkit"
    description: "A collection of tools for cyber security analysts."
    about:       "Analyze IPv4 and IPv6 addresses in notes for reputation using VirusTotal and AbuseIPDB, including defanged formats. Defang IPs in-place (full or last-dot), run quick checks from the right-click menu or command palette, and cache results to reduce API calls."

    stats: {
        downloads:  704
        updated_at: 1764935322000
    }
}
```

[^template]: [[Obsidian plugin]]
