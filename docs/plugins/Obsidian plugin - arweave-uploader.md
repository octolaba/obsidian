---
uid: 28b345f2-1810-5543-b65c-5563bb50e563
xid:
  - arweave-uploader
aliases:
  - arweave-uploader
  - Arweave Uploader
  - konfuzz/arweave-uploader-plugin
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/arweave-uploader
alt:
  - https://github.com/konfuzz/arweave-uploader-plugin
downloads: 279
updated at: "2024-11-01T20:01:07Z"
related to:
  - "[[GitHub - 875506200]]"
remind me:
---

# Arweave Uploader

Converts notes to HTML and uploads them to the Arweave blockchain, embedding images in the document as base64. The estimated transaction cost in AR and USD and the wallet balance can be checked before publishing. The recorded inputs note that the private key is stored in plaintext and that only image attachments are supported.

```cue
plugin: {
    id:     "arweave-uploader"
    name:   "Arweave Uploader"
    author: "konfuzz"
    repo:   "konfuzz/arweave-uploader-plugin"

    html_url:    "https://community.obsidian.md/plugins/arweave-uploader"
    github_url:  "https://github.com/konfuzz/arweave-uploader-plugin"
    description: "Convert your notes to HTML and upload to Arweave."
    about:       "Upload Obsidian notes as HTML to the Arweave blockchain, converting embedded images to base64 and including them in the document. Get estimated AR/USD transaction costs and check wallet balance before publishing; note private key is stored in plaintext and only image attachments are supported."

    stats: {
        downloads:  279
        updated_at: 1730491267000
    }
}
```

[^template]: [[Obsidian plugin]]
