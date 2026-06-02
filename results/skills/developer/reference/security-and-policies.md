# Security and developer policies

The normative rule set every community plugin and theme is measured against, the security model that
makes those rules load-bearing, and the handling rules for DOM construction, dependencies, and
secrets. This file owns the rules; the review procedure that applies them lives in the code-review
reference.

## Contents

- [Evidence boundary](#evidence-boundary)
- [Not allowed](#not-allowed)
- [Disclosures](#disclosures)
- [Copyright, licensing, and trademark](#copyright-licensing-and-trademark)
- [Forks](#forks)
- [Submission requirements for plugins](#submission-requirements-for-plugins)
- [The security model: there is no sandbox](#the-security-model-there-is-no-sandbox)
- [Building DOM safely](#building-dom-safely)
- [Dependency hygiene](#dependency-hygiene)
- [Handling secrets](#handling-secrets)
- [Reporting, removal, and what actually gets removed](#reporting-removal-and-what-actually-gets-removed)
- [Known gaps](#known-gaps)

## Evidence boundary

Two pinned pages are normative for policy purposes:

1. **Developer policies** — binds plugins **and** themes. Violations are removal-grade: "All community
   plugins and themes added to the Obsidian directory must respect the following policies. Plugins and
   themes that don't follow these policies will be removed from the directory." **Contract**
   (docs: en/Developer policies.md:3).
2. **Submission requirements for plugins** — plugin-only, and explicitly an extension of the first:
   "This page lists extends the [[Developer policies]] with plugin-specific requirements that all
   plugins must follow to be published" **Contract** (sic — the sentence is malformed upstream)
   (docs: en/Plugins/Releasing/Submission requirements for plugins.md:1).

Scope limit worth stating to users: "These policies only apply to plugins listed in the official
Obsidian Community directory. These policies do not apply to plugins installed outside of the
Obsidian directory, but they are nonetheless good practices to follow" **Contract**
(docs: en/Developer policies.md:5). A private or manually installed plugin is not policed — but the
security model below applies to it identically.

Lower-tier rule corpora (Plugin guidelines, Theme guidelines, the October checklists) are **not**
owned here; each rule lives with the reference for its subject, and the code-review reference defines
the tier vocabulary that separates them.

Citation aliases: `api`, `docs`, `sample`, `theme`, `rel`, `help` — defined in the skill's Sources
section.

## Not allowed

Introduced by "Plugins and themes must not:" **Contract** (docs: en/Developer policies.md:13). Quoted
verbatim, because the wording is the rule:

| Rule | Citation |
|---|---|
| "Obfuscate code to hide its purpose." | (docs: en/Developer policies.md:15) |
| "Insert dynamic ads that are loaded over the internet." | (docs: en/Developer policies.md:16) |
| "Insert static ads outside a plugin’s own interface." | (docs: en/Developer policies.md:17) |
| "Include client-side telemetry." | (docs: en/Developer policies.md:18) |
| "Include a mechanism that updates the plugin." | (docs: en/Developer policies.md:19) |
| "Themes may not load assets from the network." | (docs: en/Developer policies.md:20) |

Four consequences that are easy to miss:

- **Telemetry is asymmetric.** Client-side telemetry is banned outright
  (docs: en/Developer policies.md:18); *server-side* telemetry is merely disclosure-gated and needs a
  linked privacy policy (docs: en/Developer policies.md:31). "Anonymous" does not move a client-side
  collector into the allowed column.
- **The self-update ban has a sharp edge.** Nothing updates automatically for the user either — not
  plugins **Contract** (help: en/Extending Obsidian/Community plugins.md:41) and not themes
  **Contract** (help: en/Extending Obsidian/Themes.md:24). So you may neither push a fix nor rely on
  users pulling one. **Consequence:** a shipped defect lives in the wild indefinitely; treat every
  release as final for some fraction of your users.
- **"Ads" is scoped by location, not by kind.** Static ads *inside* the plugin's own interface are
  disclosure-gated (docs: en/Developer policies.md:30); the same ad outside that interface is banned
  (docs: en/Developer policies.md:17).
- **The theme network ban is the most-enforced policy in the directory** — see the removal taxonomy
  below. The bundling procedure, the Publish-theme counter-guidance, and the Google Fonts carve-out
  conflict are owned by the themes-and-CSS reference.

**Gap — no remote-code clause.** No pinned policy sentence bans downloading and evaluating code. The
nearest normative hooks are the obfuscation ban (docs: en/Developer policies.md:15) and the
self-update ban (docs: en/Developer policies.md:19). The plugin template *does* state the rule —
"Never execute remote code, fetch and eval scripts, or auto-update plugin code outside of normal
releases" **Observed** (sample: AGENTS.md:108) — but that is template guidance, not policy. Report
fetch-and-eval as a high-severity finding reasoned from the two policy hooks; do not quote a policy
sentence that does not exist.

**Gap — no cryptocurrency clause.** Nothing in the pinned policy page addresses crypto, wallets, or
paid tokens beyond the ads, payment-disclosure, and telemetry rules.

## Disclosures

Gate sentence: "The following are only allowed if clearly indicated in your README:" **Contract**
(docs: en/Developer policies.md:24).

- "Payment is required for full access." (docs: en/Developer policies.md:26)
- "An account is required for full access." (docs: en/Developer policies.md:27)
- "Network use. Clearly explain which remote services are used and why they're needed."
  (docs: en/Developer policies.md:28)
- "Accessing files outside of Obsidian vaults. Clearly explain why this is needed."
  (docs: en/Developer policies.md:29)
- "Static ads such as banners and pop-up messages within the plugin's own interface."
  (docs: en/Developer policies.md:30)
- "Server-side telemetry. Link to a privacy policy that explains how the data is handled must be
  included." (docs: en/Developer policies.md:31)
- "Close sourced code. This will be handled on a case by case basis."
  (docs: en/Developer policies.md:32)

**Why the README, specifically.** When a user opens your plugin's detail page, Obsidian pulls
`manifest.json` **and** `README.md` from the GitHub repository and renders them in-app **Contract**
(rel: README.md:21). The README is the disclosure surface users actually see; a privacy page on your
own website is not a substitute. The October checklist restates the whole set as a single review
prompt **Contract** (docs: en/Obsidian October plugin self-critique checklist.md:46).

**Recommendation.** Give disclosures their own README heading with a stable name, and make the
sentence answer *which* service, *what* data, and *why*. "Network use" as a bare bullet satisfies
nothing in the wording above, which demands an explanation.

## Copyright, licensing, and trademark

All three are MUSTs **Contract** (docs: en/Developer policies.md:36):

- Include a LICENSE file "and clearly indicate the license of your plugin or theme"
  (docs: en/Developer policies.md:38). It is also a submission prerequisite for plugins
  (docs: en/Plugins/Releasing/Submit your plugin.md:17) and for themes
  (docs: en/Themes/App themes/Submit your theme.md:17), and the theme checklist repeats it
  (docs: en/Obsidian October theme self-critique checklist.md:26). A missing LICENSE is therefore a
  policy finding, not a nicety.
- "Comply with the original licenses of any code your plugin or theme makes use of, including
  attribution in the README if required" (docs: en/Developer policies.md:39). This binds vendored
  snippets and copied CSS as much as npm dependencies.
- "Respect Obsidian's trademark policy. Don't use the 'Obsidian' trademark in a way that could
  confuse users into thinking your plugin or theme is a first-party creation"
  (docs: en/Developer policies.md:40). The naming rules that implement this — the `Obsidian` bans in
  `id` and `name` — are owned by the project-setup reference.

## Forks

"Forks are not allowed in the Community directory unless they meet one of the following criteria"
**Contract** (docs: en/Developer policies.md:46):

- "The fork has received explicit written approval from the original author in a publicly verifiable
  way." (docs: en/Developer policies.md:48)
- "The fork author can show proof that the original author is unreachable and has not updated the
  project for at least 6 months." (docs: en/Developer policies.md:49)

In both cases "the original author must be credited as a contributor to the new project" **Contract**
(docs: en/Developer policies.md:51). And if the work has genuinely diverged: "it should not be a
fork. Start fresh with a new repository and your own code. It should inherit no code from the
original repo without explicit permission" **Contract** (docs: en/Developer policies.md:53).

The stated preference behind the rule — "collaborate on fewer high-quality projects than many
low-quality ones" **Contract** (docs: en/Developer policies.md:44) — is rationale, not a gate. The
"should I build this at all" chooser that uses it lives in the decision-guides reference.

## Submission requirements for plugins

Plugin-only MUSTs. Themes are covered by the policies above plus the theme guidelines.

| Requirement | Rule | Citation |
|---|---|---|
| `fundingUrl` | Only for financial-support services; "If you don't accept donations, remove `fundingUrl` from your manifest." | (docs: en/Plugins/Releasing/Submission requirements for plugins.md:5-7) |
| `minAppVersion` | The minimum app version you are compatible with; "If you don't know what an appropriate version number is, use the latest stable build number." | (docs: en/Plugins/Releasing/Submission requirements for plugins.md:11-12) |
| `isDesktopOnly` | If the plugin uses Node.js or Electron APIs you "**must** set `isDesktopOnly` to `true`". | (docs: en/Plugins/Releasing/Submission requirements for plugins.md:38) |
| Command ids | "Obsidian automatically prefixes command IDs with your plugin ID. You don't need to include the plugin ID yourself." | (docs: en/Plugins/Releasing/Submission requirements for plugins.md:48-49) |
| Sample code | "sample code should be removed from your plugin before submission." | (docs: en/Plugins/Releasing/Submission requirements for plugins.md:54) |

**Description rules** — the highest-frequency source of submission findings, all from one list
**Contract** (docs: en/Plugins/Releasing/Submission requirements for plugins.md:26):

- Follow the Obsidian style guide (docs: en/Plugins/Releasing/Submission requirements for plugins.md:28).
- "Have 250 characters maximum." (docs: en/Plugins/Releasing/Submission requirements for plugins.md:29)
- "End with a period `.`." (docs: en/Plugins/Releasing/Submission requirements for plugins.md:30)
- "Avoid using emoji or special characters." (docs: en/Plugins/Releasing/Submission requirements for plugins.md:31)
- "Use correct capitalization for acronyms, proper nouns and trademarks such as 'Obsidian',
  'Markdown', 'PDF'." (docs: en/Plugins/Releasing/Submission requirements for plugins.md:32)
- Do not open with "This is a plugin" — redundant inside the directory
  (docs: en/Plugins/Releasing/Submission requirements for plugins.md:24).
- **Should** open with an action statement; the five canonical openers are given as examples
  (docs: en/Plugins/Releasing/Submission requirements for plugins.md:16-22).

Pointers, so nothing is duplicated: the Node/Electron substitutes (`SubtleCrypto`,
`navigator.clipboard`) at
(docs: en/Plugins/Releasing/Submission requirements for plugins.md:43-44) and the `isDesktopOnly`
consequences are owned by the mobile-and-compatibility reference; the command auto-prefix contract is
owned by the lifecycle-and-registration reference; `manifest.json` field shapes and naming are owned
by the project-setup reference.

## The security model: there is no sandbox

This section is why security findings are never "style".

- **Restricted mode is the default.** "By default, Obsidian runs in Restricted Mode to prevent
  third-party code execution. Only disable Restricted mode if you trust the authors of the plugins
  that you install." **Contract** (help: en/Extending Obsidian/Plugin security.md:8). Installed
  plugins "remain in your vault even if you turn on Restricted mode, but are ignored by Obsidian"
  **Contract** (help: en/Extending Obsidian/Plugin security.md:22).
- **No permission model exists.** "Due to technical limitations, Obsidian cannot reliably restrict
  plugins to specific permissions or access levels. This means that plugins will inherit Obsidian's
  access levels." **Contract** (help: en/Extending Obsidian/Plugin security.md:26). Users are told
  plugins can access files on the computer, connect to the internet, and install additional programs
  **Contract** (help: en/Extending Obsidian/Plugin security.md:28-30), and the community-plugins page
  carries a standing warning that plugins "run third-party code on your behalf that could potentially
  do harm" **Contract** (help: en/Extending Obsidian/Community plugins.md:11).
- **Review is automated per version, and public.** "Obsidian automatically scans every plugin version
  for security vulnerabilities, code quality issues, and malware. Each plugin's page in the plugin
  directory displays the results as a safety scorecard." **Contract**
  (help: en/Extending Obsidian/Plugin security.md:37). Every release you cut is scanned, and the
  result is visible to users on your directory page.
- **Manual review is targeted, not universal.** "Manual reviews continue for popular, featured, and
  flagged plugins." **Contract** (help: en/Extending Obsidian/Plugin security.md:39). Passing the
  automated gate is not evidence that a human read your code.
- **Repository hygiene the help page assumes.** Users are told to consult your `security.md` or
  `readme.md` for how to report a vulnerability **Contract**
  (help: en/Extending Obsidian/Plugin security.md:41), and can flag a suspected-malicious plugin
  directly from its directory page **Contract** (help: en/Extending Obsidian/Plugin security.md:42).
  **Recommendation:** ship a `SECURITY.md`, or a README section with a reporting address.

**Consequence for review severity.** Because a plugin inherits the app's privileges, any finding that
lets untrusted input reach code execution, the filesystem, or the network is a top-tier finding
regardless of how small the diff is.

## Building DOM safely

The guideline is titled "Avoid `innerHTML`, `outerHTML` and `insertAdjacentHTML`" **Contract**
(docs: en/Plugins/Releasing/Plugin guidelines.md:78), and its scope sentence is precise: "Building DOM
elements from user-defined input, using `innerHTML`, `outerHTML` and `insertAdjacentHTML` can pose a
security risk" **Contract** (docs: en/Plugins/Releasing/Plugin guidelines.md:80). The stated
consequence is the strongest in the whole guidelines page: injected markup "can allow a potential
attacker to execute arbitrary code on the user's computer" **Contract**
(docs: en/Plugins/Releasing/Plugin guidelines.md:82).

Treat the three shapes differently — they are not one rule:

| Shape | Treatment | Basis |
|---|---|---|
| `el.innerHTML = ''` (empty string) | Not a security problem. Use `el.empty()` instead. | "To cleanup a HTML elements contents use `el.empty();`" **Contract** (docs: en/Plugins/Releasing/Plugin guidelines.md:94) |
| RHS is user input, a variable, a template literal, or any value not visible at the call site | **Blocking security finding.** This is exactly the documented case. | (docs: en/Plugins/Releasing/Plugin guidelines.md:80; docs: en/Plugins/Releasing/Plugin guidelines.md:82) |
| RHS is a static string literal with no interpolation | Advisory only. The documented rule is scoped to user-defined input, so the literal case is not covered by the sentence; prefer the builders for consistency. **Recommendation** | (docs: en/Plugins/Releasing/Plugin guidelines.md:92) |

Reporting a static literal as an arbitrary-code-execution risk is a false positive, and it costs you
credibility on the middle row, which is the one that matters.

**The sanctioned construction path** is the DOM API or the Obsidian helpers: "use the DOM API or the
Obsidian helper functions, such as `createEl()`, `createDiv()` and `createSpan()` to build the DOM
element programmatically" **Contract** (docs: en/Plugins/Releasing/Plugin guidelines.md:92).
`createEl` is declared as a global `HTMLElement` augmentation (api: obsidian.d.ts:187) and `empty()`
on `Node` (api: obsidian.d.ts:51); neither carries an `@since` tag, so the pin supplies **no**
availability tier for them — they are long-standing DOM augmentations, and that reading is
**Inference**. The HTML-helper surface itself is owned by the UI-surfaces reference.

**When you genuinely hold an HTML string** — Markdown rendered elsewhere, a fixture, an API response
— the typings expose `sanitizeHTMLToDom(html: string): DocumentFragment` **Contract**
(api: obsidian.d.ts:5525). Three caveats, stated together:

1. It is declared `@public` with **no `@since` tag** (api: obsidian.d.ts:5524), so no availability
   tier can be derived from the pin.
2. No pinned guideline, policy, or narrative page names it as the remedy. Recommending it is a
   **Recommendation** of this skill, reasoned from the signature, not a documented contract.
3. What it strips is **Unverified**: the pin contains no allowlist, threat model, or test corpus for
   it. Do not present it as a guarantee; prefer building the DOM yourself whenever the structure is
   known at the call site.

**Observed, useful in review:** the first-party lint set depends on `eslint-plugin-no-unsanitized`
(sample: package-lock.json:2343), so the automated pass plausibly flags this family already — see the
code-review reference for how that is positioned.

## Dependency hygiene

Three rules, all from the October checklist, all advisory-tier by source but load-bearing given the
no-sandbox model:

- **Less is safer.** "Do be mindful of all dependencies you add to your plugin. Remember that less is
  safer." **Contract** (docs: en/Obsidian October plugin self-critique checklist.md:47).
- **Commit a lock file.** "Do commit and use a lock file (package-lock.json, pnpm-lock.yaml, or
  yarn.lock) when using a package manager." **Contract**
  (docs: en/Obsidian October plugin self-critique checklist.md:49).
- **Telemetry usually arrives transitively.** "Do not include any client-side telemetry. Libraries
  that offer usage tracking and metrics will often collect information that users could consider
  sensitive." **Contract** (docs: en/Obsidian October plugin self-critique checklist.md:48). This is
  the sentence that turns the outright ban at (docs: en/Developer policies.md:18) into a *dependency*
  question: an analytics SDK three levels down the tree violates the policy exactly as a first-party
  collector does, and nothing in the tree exempts you for not knowing.

A fourth consequence sits in mobile territory but is a dependency problem: "The Node.js API, and the
Electron API aren't available on mobile devices. Any calls to these libraries made by your plugin or
it's dependencies can cause your plugin to crash" **Contract**
(docs: en/Plugins/Getting started/Mobile development.md:68). The mobile-and-compatibility reference
owns the handling; the point here is that auditing dependencies is the only way to know.

Bundling requirements (single `main.js`, externals) are owned by the project-setup reference.

## Handling secrets

`SecretStorage` is `@since` **1.11.4** (api: obsidian.d.ts:5633) — **stable at pin (≤1.12.7)**. The
API mechanics and the storage chooser are owned by the vault-and-metadata reference; the rules below
are the security half.

- **Never persist a secret value in `data.json`.** The documented failure modes are plaintext storage
  beside ordinary plugin data, duplication across plugins, and manual rotation **Contract**
  (docs: en/Plugins/Guides/Store secrets.md:24-28).
- **Store the secret's *name*, not its value.** "The `mySetting` property will store the *name* of a
  secret, not the secret value itself" **Contract** (docs: en/Plugins/Guides/Store secrets.md:36), and
  "When saved, your plugin settings contain the *name* of the secret, not the actual secret value"
  **Contract** (docs: en/Plugins/Guides/Store secrets.md:81). Users save each secret under a name and
  any plugin can reference it by that name **Contract** (docs: en/Plugins/Guides/Store secrets.md:30).
- **Handle `null` on every read.** `getSecret(id)` returns "The secret value or null if not found"
  **Contract** (api: obsidian.d.ts:5650), and the guide's own example guards it **Contract**
  (docs: en/Plugins/Guides/Store secrets.md:91). A plugin that assumes setup already happened throws
  on a fresh install.
- **Ids are constrained and `setSecret` throws.** The id is a "Lowercase alphanumeric ID with optional
  dashes" and the method "@throws Error if ID is invalid" **Contract**
  (api: obsidian.d.ts:5639; api: obsidian.d.ts:5641).
- **Secrets are local to one vault on one device.** "The actual secret is stored in local storage,
  keyed to the specific vault" **Contract** (docs: en/Plugins/Guides/Store secrets.md:96).
  **Inference:** they therefore do not travel with a synced vault, so a user on a second device
  re-enters the secret — design the empty state as a normal path, not an error.
- **The store is shared between plugins.** Any plugin can read a secret by name
  (docs: en/Plugins/Guides/Store secrets.md:30), which given the no-sandbox model means
  `SecretStorage` protects against accidental disclosure in `data.json`, **not** against a malicious
  co-installed plugin. **Inference**, stated because the guide's "secure way to store" wording
  (docs: en/Plugins/Guides/Store secrets.md:6) invites the stronger reading.

**Recommendation, unsourced but implied by the disclosure rules:** if a secret is sent anywhere, that
remote service is "Network use" and needs a README disclosure
(docs: en/Developer policies.md:28).

## Reporting, removal, and what actually gets removed

**Reporting path** (for anyone reporting someone else's plugin): open a GitHub issue on the offending
repository first, checking existing issues to avoid duplicates **Contract**
(docs: en/Developer policies.md:57). "If the developer doesn't respond after 7 days, contact the
Obsidian team. For serious violations, you can contact our team immediately." **Contract**
(docs: en/Developer policies.md:59). A security issue in Obsidian itself, or a plugin you suspect is
malicious, goes to the team by email **Contract** (help: en/Help and support.md:84).

**Removal process.** Normally the team "may attempt to contact the developer and provide a reasonable
timeframe for them to resolve the problem"; if it is unresolved by then, the item is removed from the
directory **Contract** (docs: en/Developer policies.md:63-65). Three conditions bypass the grace
period entirely — removal "may" be immediate if **Contract** (docs: en/Developer policies.md:67):

- "The plugin or theme appears to be malicious." (docs: en/Developer policies.md:69)
- "The developer is uncooperative." (docs: en/Developer policies.md:70)
- "This is a repeated violation." (docs: en/Developer policies.md:71)

Separately, items "that have become unmaintained or severely broken" may also be removed **Contract**
(docs: en/Developer policies.md:73) — being blameless is not a defence.

**What the record actually shows.** Two files record delistings: one for plugins, first entry
`advanced-toolbar` (rel: community-plugins-removed.json:3), and one for themes, first entry
`Molecule` (rel: community-css-themes-removed.json:3). Grouping every `reason` string at this pin
gives 175 plugin entries and 26 theme entries **Observed** — reproduce both counts with the commands
below:

| Cause (grouped by `reason` string) | Plugins | Themes |
|---|---|---|
| Repository archived, repository deleted, or account deleted | 115 | 10 |
| Redundancy — features now in the app or in another plugin | 24 | 0 |
| Unmaintained, broken, abandoned, deprecated | 19 | 0 |
| Developer banned from GitHub | 9 | 0 |
| Broken release assets or tag (5 entries, 4 distinct reason strings) | 5 | 0 |
| Explicit developer-policy violation | **1** | **16** |
| Identity change (`id` changed, no response after 30 days) | 1 | 0 |
| Removed by author | 1 | 0 |
| **Total** | **175** | **26** |

Read it as four operational facts:

1. **Repository lifecycle dominates for plugins.** "Repository archived" (48) and "Archived
   repository" (47) are the same reason under two spellings **Observed**; archiving your repository
   delists you.
2. **Policy enforcement against plugins is rare but real.** Exactly one entry names a policy: it cites
   client-side telemetry and a self-update mechanism together **Observed**
   (rel: community-plugins-removed.json:856) — the two bans at
   (docs: en/Developer policies.md:18) and (docs: en/Developer policies.md:19).
3. **For themes the ratio inverts.** 16 of 26 theme removals are "Developer policies violation: Remote
   resources", each with a public issue link **Observed**
   (rel: community-css-themes-removed.json:4). **The no-remote-assets rule is the single most enforced
   policy in the directory.**
4. **Release mechanics delist people.** Five entries were removed purely because the release could not
   be installed — missing files, a missing release, a wrong release name **Observed**
   (rel: community-plugins-removed.json:95; rel: community-plugins-removed.json:120; rel: community-plugins-removed.json:135; rel: community-plugins-removed.json:175; rel: community-plugins-removed.json:585).
   That is five times as many plugin removals as the policy list produced. The release-mechanics
   checks in the releasing reference are not bureaucracy.

Reproduce the counts inside a checkout of the `rel` source:

```sh
jq -r '[.[].reason]|group_by(.)|map({r:.[0],n:length})|sort_by(-.n)|.[]|"\(.n)\t\(.r)"' \
  community-plugins-removed.json
jq -r '[.[].reason]|group_by(.)|map({r:.[0],n:length})|.[]|"\(.n)\t\(.r)"' \
  community-css-themes-removed.json
```

The removed list is **descriptive, not a gate**, and the deprecation list has undocumented semantics;
both are owned by the releasing reference.

## Known gaps

- **No remote-code-execution policy sentence** and **no cryptocurrency clause** — see
  [Not allowed](#not-allowed). Reason from the obfuscation and self-update bans, and say so.
- **`sanitizeHTMLToDom` behaviour is unverified.** No pinned source documents what it removes, and it
  carries no `@since`.
- **The automated review's rule set is not published in any pinned source.** "Reviewed automatically"
  is all the evidence there is (docs: en/Plugins/Releasing/Submit your plugin.md:59); the scorecard's
  criteria at (help: en/Extending Obsidian/Plugin security.md:37) are named only as categories. Never
  claim a submission will pass or fail.
- **The removal-reason strings are free text**, written by maintainers over years, with at least one
  typo and one duplicated reason under two spellings. The groupings above are this skill's reading of
  those strings, not a published taxonomy.
- **No live enforcement was observed.** Nothing here was tested against the directory; the app is
  closed source, so scanning, gating, and delisting behaviour is inferred from data and docs.
