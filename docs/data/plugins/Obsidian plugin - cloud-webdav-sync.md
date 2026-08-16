---
uid: 2eb89097-237f-5094-b026-928e817fe75d
xid:
  - cloud-webdav-sync
aliases:
  - cloud-webdav-sync
  - Cloud WebDAV Sync
  - seventeen-tan/cloud-webdav-sync
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/cloud-webdav-sync
alt:
  - https://github.com/seventeen-tan/cloud-webdav-sync
downloads: 36
updated at: "2026-07-16T06:27:12Z"
related to:
  - "[[GitHub - 1302263284]]"
remind me:
---

# Cloud WebDAV Sync

Stores notes and attachments in a WebDAV-backed repository as content-addressed objects with verified commit snapshots rather than overwriting files in a plain remote folder, adding file-tree planning, server capability checks and guarded remote head updates to reduce accidental data loss. Checks run from the ribbon or command palette, or automatically while the app is open, with state shown in a desktop status bar and a cross-platform sync center that covers pending changes, history, diagnostics, capability reports and conflicts. Markdown conflicts are reviewed with line-numbered local and remote previews, diff highlighting and synchronized scrolling before a resolution is chosen explicitly. Passwords are held in the app's secret storage, logs redact credentials and tokens, HTTPS is enforced, and the plugin is described as experimental.

```cue
plugin: {
    id:     "cloud-webdav-sync"
    name:   "Cloud WebDAV Sync"
    author: "SEVENTEEN"
    repo:   "seventeen-tan/cloud-webdav-sync"

    html_url:    "https://community.obsidian.md/plugins/cloud-webdav-sync"
    github_url:  "https://github.com/seventeen-tan/cloud-webdav-sync"
    description: "Cloud WebDAV Sync is an experimental WebDAV sync plugin with content-addressed storage, commit snapshots, capability checks, guarded updates, sync history, diagnostics, and local/remote conflict resol - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Cloud WebDAV Sync is an experimental synchronization plugin that stores notes and attachments in a WebDAV-backed repository. Instead of directly overwriting files in a plain remote folder, it uses content-addressed objects, verified commit snapshots, file-tree planning, server capability checks, and guarded remote HEAD updates to reduce accidental data loss. It can run manual checks from the ribbon or command palette, perform automatic checks while the app is running, and show sync state through a desktop status bar and a cross-platform sync center. The sync center includes pending changes, history, diagnostics, server capability reports, and conflict handling. Markdown conflicts can be reviewed with local and remote line-numbered previews, diff highlighting, synchronized scrolling, and explicit local/remote resolution choices before sync continues. Passwords are stored with the app’s SecretStorage API, logs redact credentials and tokens, HTTPS is enforced for remote servers, and large"

    stats: {
        downloads:  36
        updated_at: 1784183232000
    }
}
```

[^template]: [[Obsidian plugin]]
