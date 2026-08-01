---
uid: 43d252df-a261-58b1-88b9-31167744e330
xid:
  - ioc-lens
aliases:
  - ioc-lens
  - IOC Lens
  - acgabbert/IOC-Lens
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/ioc-lens
alt:
  - https://github.com/acgabbert/IOC-Lens
downloads: 972
updated at: "2024-12-11T11:47:21Z"
related to:
  - "[[GitHub - 879667350]]"
remind me:
---

# IOC Lens

IOC Lens extracts security-relevant indicators from a note, covering IP addresses, domains and SHA256 and MD5 hashes, and lists them in a read-only sidebar. Defanged forms are recognized, and an indicator can be defanged or refanged while staying non-clickable in the note. From the sidebar an indicator pivots into VirusTotal, Shodan, GreyNoise, AbuseIPDB or Google as a one-click search.

```cue
plugin: {
    id:     "ioc-lens"
    name:   "IOC Lens"
    author: "acgabbert"
    repo:   "acgabbert/IOC-Lens"

    html_url:    "https://community.obsidian.md/plugins/ioc-lens"
    github_url:  "https://github.com/acgabbert/IOC-Lens"
    description: "Extracts and displays security-relevant indicators such as IP addresses, domains, and file hashes to enhance your cyber security note-taking process."
    about:       "Extract and organize indicators of compromise (IP addresses, domains, SHA256, MD5) from your Obsidian notes into a clean, read-only sidebar view. Defang or refang IOCs, recognize defanged formats like evil[.]com, and pivot to security engines (VirusTotal, Shodan, GreyNoise, AbuseIPDB, Google) for one-click searches while keeping IOCs non-clickable."

    stats: {
        downloads:  972
        updated_at: 1733917641000
    }
}
```

[^template]: [[Obsidian plugin]]
