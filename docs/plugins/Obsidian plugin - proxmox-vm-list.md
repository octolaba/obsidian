---
uid: 2624fd20-f11d-59b7-9b9f-c0947377c146
xid:
  - proxmox-vm-list
aliases:
  - proxmox-vm-list
  - Proxmox VM List
  - psalkiewicz/obsidian-proxmox-vm-list
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/proxmox-vm-list
alt:
  - https://github.com/psalkiewicz/obsidian-proxmox-vm-list
downloads: 23
updated at: "2026-07-06T21:29:57Z"
related to:
  - "[[GitHub - 1291499435]]"
remind me:
---

# Proxmox VM List

Connects to a Proxmox VE host or cluster and writes an inventory of every virtual machine and LXC container across all nodes into a Markdown table in the vault. The table records VMID, name, type, host, status, CPU and RAM, disks, operating system and notes, marks templates and running or stopped state, and is regenerated on each update.

```cue
plugin: {
    id:     "proxmox-vm-list"
    name:   "Proxmox VM List"
    author: "Pawel Salkiewicz"
    repo:   "psalkiewicz/obsidian-proxmox-vm-list"

    html_url:    "https://community.obsidian.md/plugins/proxmox-vm-list"
    github_url:  "https://github.com/psalkiewicz/obsidian-proxmox-vm-list"
    description: "Fetches virtual machines and containers from a Proxmox VE host/cluster and writes them into a Markdown table in the vault. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Connect to Proxmox VE and generate a Markdown inventory of all VMs and LXC containers across every node. Output a table with VMID, name, type, host, status, CPU/RAM, disks, OS and notes; mark templates and running/stopped state for quick review and regenerate the note on each update."

    stats: {
        downloads:  23
        updated_at: 1783373397000
    }
}
```

[^template]: [[Obsidian plugin]]
