---
uid: 84ebb457-42bc-5572-bea5-2290bd7f4614
xid:
  - investment-tracker
aliases:
  - investment-tracker
  - Investment Tracker
  - joelam2023/investment-tracker
tags:
  - type/bookmark
  - bookmark/obsidian
  - obsidian/plugin
url: https://community.obsidian.md/plugins/investment-tracker
alt:
  - https://github.com/joelam2023/investment-tracker
downloads: 35
updated at: "2026-07-15T10:31:54Z"
related to:
  - "[[GitHub - 1298410203]]"
remind me:
---

# Investment Tracker

Investment Tracker keeps portfolio records inside the vault, recording account-level contributions, withdrawals and valuations and calculating XIRR, cumulative profit, yearly returns and monthly Modified Dietz returns. The same cash flows are compared with the S&P 500 Price Index, and an optional automatic benchmark mode requests only public market and exchange-rate series from FRED. Records are encrypted with AES-256-GCM in the vault, and the plugin states that it has no backend, account, telemetry, analytics or ads, that user-created exports are plaintext, and that it neither connects to brokerages nor tracks live holdings.

```cue
plugin: {
    id:     "investment-tracker"
    name:   "Investment Tracker"
    author: "Lam"
    repo:   "joelam2023/investment-tracker"

    html_url:    "https://community.obsidian.md/plugins/investment-tracker"
    github_url:  "https://github.com/joelam2023/investment-tracker"
    description: "Private, local-first portfolio tracker with encrypted records in your vault. Track investment cash flows, returns, and S&P 500 benchmarks without an account or telemetry. - This plugin has not been manually reviewed by Obsidian staff."
    about:       "Investment Tracker is a private, local-first portfolio management tool for Obsidian. Record account-level contributions, withdrawals, and valuations; calculate XIRR, cumulative profit, yearly returns, and monthly Modified Dietz returns; and compare the same cash flows with the S&P 500 Price Index. Investment records are encrypted with AES-256-GCM and stored in your own vault. No developer backend, account, telemetry, analytics, ads, or automatic portfolio upload. Optional automatic benchmark mode requests only public market and exchange-rate series from FRED. User-created JSON and CSV exports are plaintext, and any sync is controlled by the vault sync service you choose. It does not connect to brokerages or track live holdings."

    stats: {
        downloads:  35
        updated_at: 1784111514000
    }
}
```

[^template]: [[Obsidian plugin]]
