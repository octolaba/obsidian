---
uid: f16adef5-e3f9-5fa3-bf47-bac3d7116146
xid:
  - verilog-bitfield
aliases:
  - verilog-bitfield
  - Verilog Bitfield
  - aipyer/verilog-bitfield
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/verilog-bitfield
alt:
  - https://github.com/aipyer/verilog-bitfield
downloads: 88
updated at: "2026-06-04T13:52:35Z"
related to:
  - "[[GitHub - 1257816172]]"
remind me:
---

# Verilog Bitfield

Verilog Bitfield renders bitfield definitions written in a code block as interactive SVG diagrams and tables, reading name, width and description entries with indentation for sub-fields. It calculates bit ranges, pads reserved bits, detects overflow and assigns colors, and one block can define several bitfields. References compose definitions from modular pieces without duplication, with click-to-jump and hover preview. Diagrams choose a horizontal or vertical layout by width and each block can be toggled between diagram and table.

```cue
plugin: {
    id:     "verilog-bitfield"
    name:   "Verilog Bitfield"
    author: "aipyer"
    repo:   "aipyer/verilog-bitfield"

    html_url:    "https://community.obsidian.md/plugins/verilog-bitfield"
    github_url:  "https://github.com/aipyer/verilog-bitfield"
    description: "Render Verilog bitfield definitions as interactive SVG diagrams and tables - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Bitfield renders hardware bitfield definitions as interactive SVG diagrams and tables. Write name width description in a code block, indent sub-fields, and the plugin handles the rest — bit-range calculation, reserved padding, overflow detection, color assignment. Works for register maps, interface protocols, packet headers, and any fixed-width bit layout. One code block can define multiple blocks. Use @references to compose complex definitions from modular pieces without duplication. Click a reference to jump to its definition, hover for instant preview. Toggle between diagram and table per block. Diagrams auto-select horizontal or vertical layout based on width. Tables show field name, bit range, and description with nested indentation. Your bitfield spec lives in your notes, rendered live, always in sync with your design."

    stats: {
        downloads:  88
        updated_at: 1780581155000
    }
}
```

[^template]: [[Obsidian plugin]]
