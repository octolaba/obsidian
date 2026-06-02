# Mobile support and version compatibility

The two compatibility axes a plugin has to survive: **platform** (does it run on the mobile app at
all) and **version** (which Obsidian builds may install it). Both are decided in `manifest.json`
before a single line of your code runs, and both are effectively irreversible once users have your
plugin installed.

## Contents

- [Evidence boundary](#evidence-boundary)
- [`isDesktopOnly`: the install gate](#isdesktoponly-the-install-gate)
- [Platform gates and dynamic `require`](#platform-gates-and-dynamic-require)
- [Adapters: never cast to `FileSystemAdapter`](#adapters-never-cast-to-filesystemadapter)
- [Network access](#network-access)
- [Mobile-only failure modes](#mobile-only-failure-modes)
- [Desktop-only API surfaces](#desktop-only-api-surfaces)
- [`minAppVersion` discipline](#minappversion-discipline)
- [Installer version versus app version](#installer-version-versus-app-version)
- [Pre-release compatibility checklist](#pre-release-compatibility-checklist)
- [Known gaps](#known-gaps)

## Evidence boundary

Everything here is read from the typings, the developer docs, and the user-facing help pages at the
pin. **No mobile device, no emulator, and no installer downgrade was exercised** — runtime behaviour
beyond a documented sentence is Unverified. How to *test* on mobile belongs to the debugging
reference; this file owns the *contracts*.

Citation aliases: `api`, `docs`, `sample`, `theme`, `rel`, `help` — defined in the skill's Sources
section. Every API named states its `@since` and its tier at this pin: **stable** at or below 1.12.7,
**insider-only** above it.

## `isDesktopOnly`: the install gate

`isDesktopOnly` is a **required** plugin manifest field, described as "Whether your plugin uses
NodeJS or Electron APIs" **Contract** (docs: en/Reference/Manifest.md:28). The typings declare it
optional and describe it differently — "Whether the plugin can be used only on desktop" **Contract**
(api: obsidian.d.ts:5137-5140). Treat the docs as the schema: emit it always.

What it actually does: setting it to `true` "prevent[s] users from installing the plugin on mobile
devices" **Contract** (docs: en/Plugins/Getting started/Mobile development.md:58;
docs: en/Plugins/Getting started/Mobile development.md:60). That is the whole documented mechanism —
an install gate, not a runtime switch.

Three consequences worth stating explicitly:

1. `isDesktopOnly: true` does **not** change any API's behaviour on desktop. The typings state no
   runtime relationship between the manifest field and `Platform` — **Inference**, from the field's
   one-line JSDoc (api: obsidian.d.ts:5137-5140).
2. `isDesktopOnly: false` is a promise you must keep in code — nothing enforces it. Every rule in
   this file applies from that moment on.
3. Themes have no `isDesktopOnly` at all; the field is plugin-only
   **Contract** (docs: en/Reference/Manifest.md:22-28). A theme cannot opt out of mobile.

## Platform gates and dynamic `require`

`Platform` is a const object of boolean flags, `@since 0.12.2`, **stable at pin**
(api: obsidian.d.ts:4821-4823). The documented detection idiom is a plain import and an `if`
**Contract** (docs: en/Plugins/Getting started/Mobile development.md:42-53).

Read the flags in two groups — they are not interchangeable:

| Group | Flags | Meaning |
|---|---|---|
| UI mode | `isDesktop` (api: obsidian.d.ts:4828), `isMobile` (api: obsidian.d.ts:4833), `isPhone` (api: obsidian.d.ts:4858), `isTablet` (api: obsidian.d.ts:4863) | How the interface is laid out |
| Runtime | `isDesktopApp` "electron-based desktop app" (api: obsidian.d.ts:4835-4838), `isMobileApp` "capacitor-js mobile app" (api: obsidian.d.ts:4840-4843), `isIosApp` (api: obsidian.d.ts:4848), `isAndroidApp` (api: obsidian.d.ts:4853) | Which binary you are inside |
| OS | `isMacOS` — "or a device that pretends to be one (like iPhones and iPads)" (api: obsidian.d.ts:4864-4869), `isWin` (api: obsidian.d.ts:4874), `isLinux` (api: obsidian.d.ts:4879), `isSafari` (api: obsidian.d.ts:4885) | Host platform |

**Gate Node and Electron on the runtime flag, not the UI flag.** Mobile emulation changes UI mode
while the runtime stays Electron (**Inference** from the two documented groups above plus the
emulation command in the debugging reference), so `Platform.isMobile` is the wrong guard for a
`require('fs')`.

The documented pattern for reaching Node at all: "Don't use Node.js modules such as `fs`, `path`, or
`electron` at the **top level**. If needed, gate the functionality behind `Platform.isDesktopApp` and
`require()` them dynamically at runtime" **Contract**
(docs: en/Obsidian October plugin self-critique checklist.md:28). A top-level `import fs from 'fs'`
is evaluated when your bundle loads — before any gate can run.

Also on the checklist: "Don't use `process.platform`, use Obsidian's `Platform` instead"
**Contract** (docs: en/Obsidian October plugin self-critique checklist.md:31).

`Platform.resourcePathPrefix` differs by platform — `file:///` on mobile, `app://random-id/` on
desktop **Contract** (api: obsidian.d.ts:4886-4893). Never hardcode either.

## Adapters: never cast to `FileSystemAdapter`

`Vault.adapter` is typed `DataAdapter`, whose own JSDoc says "If possible prefer using the `Vault`
API over this" **Contract** (api: obsidian.d.ts:2001-2006). Two concrete implementations exist:

- `FileSystemAdapter` — "Implementation of the vault adapter for desktop", no `@since` tag in the
  typings, **availability unknown** (api: obsidian.d.ts:2992-2996). Only it declares `getBasePath()`
  (api: obsidian.d.ts:3005) and `getFilePath()` `@since 0.14.3` (api: obsidian.d.ts:3057-3062).
- `CapacitorAdapter` — "Implementation of the vault adapter for mobile devices", `@since 1.7.2`,
  **stable at pin** (api: obsidian.d.ts:1478-1483). It has `getFullPath` (api: obsidian.d.ts:1589)
  but **no** `getBasePath`.

The rule is explicit: "Don't cast `Vault.adapter` to `FileSystemAdapter`. All usages of
`FileSystemAdapter` should be gated behind an `instanceof` check. On mobile, `Vault.adapter` will be
an instance of `CapacitorAdapter`" **Contract**
(docs: en/Obsidian October plugin self-critique checklist.md:30). The general form of the same rule —
test with `instanceof` before casting into `TFile`, `TFolder`, or `FileSystemAdapter` — is a separate
checklist line **Contract** (docs: en/Obsidian October plugin self-critique checklist.md:41).

A cast compiles, runs fine on your desktop, and throws on the first mobile user. That is exactly the
class of bug `isDesktopOnly: false` invites.

## Network access

**This file owns the `requestUrl` contract.** Other references point here.

`requestUrl(request)` — "Similar to `fetch()`, request a URL using HTTP/HTTPS, **without any CORS
restrictions**"; no `@since` tag in the typings, **availability unknown**
(api: obsidian.d.ts:5438-5442). Its sibling `request(request): Promise<string>` carries the same
sentence plus "Returns the text value of the response", `@since 0.12.11`, **stable at pin**
(api: obsidian.d.ts:5430-5436).

Four things to get right:

1. **`throw` defaults to `true`.** `RequestUrlParam.throw` is documented "Whether to throw an error
   when the status code is 400+ / Defaults to true" **Contract** (api: obsidian.d.ts:5456-5461). If
   you want to *handle* a 404 rather than crash on it, pass `throw: false` and read
   `response.status` yourself (api: obsidian.d.ts:5464-5467). This is the single most surprising
   default in the network surface.
2. **CORS bypass is the point.** Both helpers explicitly bypass CORS
   (api: obsidian.d.ts:5431; api: obsidian.d.ts:5439). That is why the checklist says "Don't use
   `fetch` or `axios.get`, use Obsidian's `requestUrl` instead" **Contract**
   (docs: en/Obsidian October plugin self-critique checklist.md:32) — `fetch` from the renderer is
   subject to CORS, `requestUrl` is not.
3. **`request()` is not deprecated at this pin.** It carries no `@deprecated` tag
   (api: obsidian.d.ts:5430-5436). **Recommendation:** still prefer `requestUrl` — you get status,
   headers, and typed bodies (api: obsidian.d.ts:5464-5476) — but do not tell anyone `request` is
   removed or deprecated, because at this pin it is neither.
4. **The response promise is pre-projected.** `RequestUrlResponsePromise` exposes `arrayBuffer`,
   `json`, and `text` as promise properties (api: obsidian.d.ts:5478-5486), so
   `await requestUrl(...).json` works without a second `await`.

Whether you are *allowed* to make the request — disclosure duties, telemetry bans, theme asset rules
— is policy, and lives in the security-and-policies reference.

## Mobile-only failure modes

Each of these compiles, passes review on desktop, and only fails for mobile users.

| Failure | Rule | Evidence |
|---|---|---|
| Plugin crashes on load | "The Node.js API, and the Electron API aren't available on mobile devices. Any calls to these libraries made by your plugin **or it's dependencies** can cause your plugin to crash" | (docs: en/Plugins/Getting started/Mobile development.md:68) |
| Regex silently mismatches or throws on older iPhones | "Lookbehind in regular expressions is only supported on iOS 16.4 and above" — implement a fallback | (docs: en/Plugins/Getting started/Mobile development.md:72; docs: en/Obsidian October plugin self-critique checklist.md:29) |
| Status bar item never appears | `addStatusBarItem()` is "Not available on mobile", `@since 0.9.7` | (api: obsidian.d.ts:4939-4947; docs: en/Plugins/User interface/Status bar.md:3-4) |

The dependency clause is the trap most reviews miss: a transitive dependency that touches `path` or
`fs` crashes your plugin even though your own source is clean
(docs: en/Plugins/Getting started/Mobile development.md:68). Auditing this means reading the
dependency tree, not grepping your `src/`.

The lookbehind rule interacts with `minAppVersion` in a way that catches people out: `minAppVersion`
gates the **Obsidian** version, not the **iOS** version. A user on a current Obsidian build and iOS
16.3 passes every gate you can set and still hits the regex failure — **Inference**, from the install
gate below plus the lookbehind rule
(docs: en/Plugins/Getting started/Mobile development.md:72).

## Desktop-only API surfaces

Beyond the status bar, three declared APIs are documented desktop-only. Calling them on mobile is a
design error, not a runtime feature test:

- `Workspace.moveLeafToPopout` — "Only works on the desktop app", "@throws Error if the app does not
  support popout windows (i.e. on mobile or if Electron version is too old)", `@since 0.15.4`,
  **stable at pin** (api: obsidian.d.ts:7910-7917).
- `Workspace.openPopoutLeaf` — "Only works on the desktop app", `@since 0.15.4`, **stable at pin**
  (api: obsidian.d.ts:7919-7925).
- `Menu.setUseNativeMenu` — "(Only works on the desktop app)", `@since 0.16.0`, **stable at pin**
  (api: obsidian.d.ts:4256-4262).

Note the second half of the pop-out throw clause: "or if Electron version is too old"
(api: obsidian.d.ts:7914). That is the installer version, not the app version — see below.

## `minAppVersion` discipline

`minAppVersion` is a required manifest field for **both** plugins and themes, "The minimum required
Obsidian version" **Contract** (docs: en/Reference/Manifest.md:14).

**It is a hard install gate.** "If a user attempts to install a plugin where the Obsidian app version
is lower than the `minAppVersion` in [the manifest], then Obsidian looks for a `versions.json` file
at the root of the plugin repository" **Contract** (docs: en/Reference/Versions.md:9). The same
fallback is described from the app's side: "If your `manifest.json` requires a version of Obsidian
that's higher than the running app, your `versions.json` will be consulted to find the latest version
of your plugin that is compatible" **Contract** (rel: README.md:23).

**`versions.json` rescues only *older* plugin versions** — the fallback hands the user "the most
recent plugin version" their app still satisfies, never a newer one **Contract**
(docs: en/Reference/Versions.md:35). Its shape, when to update it, and the theme-side ambiguity are
owned by the releasing reference.

**Neither plugins nor themes auto-update.** "For security purposes, community plugins don't update
automatically" **Contract** (help: en/Extending Obsidian/Community plugins.md:41) and "Themes don't
update automatically" **Contract** (help: en/Extending Obsidian/Themes.md:24).

Put those three together and the operational consequence is blunt (**Inference**): raising
`minAppVersion` is **effectively irreversible for the users it excludes**. They cannot receive your
fix automatically, and the only thing the app will offer them is an older build of your plugin — the
one whose `minAppVersion` they still satisfy. Raise it only when you actually consume an API that
requires it, and state which API.

**Recommendation:** set `minAppVersion` to the highest `@since` you genuinely depend on, and prefer a
runtime guard over a bump when the feature is optional. `requireApiVersion(version)` — "Returns true
if the API version is equal or higher than the requested version. Use this to limit functionality
that require specific API versions to avoid crashing on older Obsidian builds", no `@since` tag,
**availability unknown** (api: obsidian.d.ts:5488-5494) — is the documented instrument, and the deferred-view
guide is the worked example of it **Contract**
(docs: en/Plugins/Guides/Defer views.md:77-78). The current app version is readable as `apiVersion`,
"the API version of the app, which follows the release cycle of the desktop app"
(api: obsidian.d.ts:395-400).

Because the guard and `apiVersion` are themselves untagged, the 1.13.2 typings alone do not prove
they exist at an older target floor. Verify that floor independently before using the guard as the
compatibility mechanism; otherwise raise the floor or choose a dated alternative (**Recommendation**).

## Installer version versus app version

Obsidian has **two** versions, and only one of them is what `minAppVersion` checks.

- The **app** version updates itself: desktop "regularly checks for new updates. If automatic updates
  are enabled, the application will update on restart" **Contract**
  (help: en/Getting started/Update Obsidian.md:10).
- The **installer** version is the Electron version, and "it cannot be updated by the automatic update
  process" **Contract** (help: en/Getting started/Update Obsidian.md:33). Updating it means
  downloading and running the installer again **Contract**
  (help: en/Getting started/Update Obsidian.md:10;
  help: en/Getting started/Update Obsidian.md:37-42). Both numbers are shown at the top of
  **Settings → General** **Contract** (help: en/Getting started/Update Obsidian.md:16-18).

Upstream states the consequence directly: "A community plugin or theme may require an installer
update to access newer features that are not available in older versions of Electron, and may ask you
to update the installer version of Obsidian before Obsidian itself asks" **Contract**
(help: en/Getting started/Update Obsidian.md:35).

Three answers depend on this distinction:

1. **CLI availability.** The Obsidian CLI "requires the Obsidian 1.12 installer" **Contract**
   (help: en/Extending Obsidian/Obsidian CLI.md:11-12) and the install step is "Upgrade to the latest
   Obsidian installer version (1.12.7+)" **Contract**
   (help: en/Extending Obsidian/Obsidian CLI.md:16). A user on app 1.12.7 with an old installer has
   no CLI. The full gate list is in the debugging reference.
2. **CSS feature guarding.** "Some users may be using older Obsidian installers that do not include
   the latest versions of Chromium", therefore newer selectors "should be guarded by `@supports` to
   prevent the entire block from breaking", and partially supported properties are split into a
   fallback line plus a new-value line **Contract**
   (docs: en/Plugins/User interface/Right-to-left.md:64-67). This applies to plugin `styles.css` and
   theme CSS alike; the theme-side application is in the themes-and-CSS reference.
3. **Mobile equality.** On mobile "The installer version is the same as the app version"
   **Contract** (help: en/Getting started/Update Obsidian.md:12). So the split above is a
   desktop-only problem — a mobile user on app version X has Chromium from build X
   (**Inference** from that sentence).

**The named trap:** `minAppVersion` is checked against the *app* version only. A plugin whose CSS or
JavaScript needs a newer Chromium can install cleanly on a satisfying app version and still break,
because the installer underneath it is old (**Inference** from the three facts above). There is no
manifest field for a minimum installer version at the pin
(docs: en/Reference/Manifest.md:11-28) — the only defences are `@supports`, feature detection, and
saying so in your README.

## Pre-release compatibility checklist

Run this whenever `isDesktopOnly` is `false` — it is the upstream mobile-support checklist
(docs: en/Obsidian October plugin self-critique checklist.md:26), re-stated with the local
consequence:

1. No `fs` / `path` / `electron` import at module top level; runtime-gated dynamic `require` behind
   `Platform.isDesktopApp` instead (docs: en/Obsidian October plugin self-critique checklist.md:28).
2. No regex lookbehind, or a documented fallback
   (docs: en/Obsidian October plugin self-critique checklist.md:29).
3. Every `FileSystemAdapter` use behind `instanceof`
   (docs: en/Obsidian October plugin self-critique checklist.md:30).
4. No `process.platform` (docs: en/Obsidian October plugin self-critique checklist.md:31).
5. No `fetch` / `axios` — `requestUrl` instead
   (docs: en/Obsidian October plugin self-critique checklist.md:32).
6. No `addStatusBarItem()` on a path mobile can reach (api: obsidian.d.ts:4939-4947).
7. Dependency tree audited for Node reach, not just your own source
   (docs: en/Plugins/Getting started/Mobile development.md:68).
8. `minAppVersion` justified by a specific `@since`, and `versions.json` updated if you raised it
   (docs: en/Reference/Versions.md:38).

The bundled `plugin-lint.mjs` automates items 1–6 as heuristics; a clean run is not a substitute for
reading the dependency tree.

## Known gaps

- **No runtime verification.** Nothing here was executed on a phone, a tablet, or an emulator. The
  mobile testing procedures live in the debugging reference and are likewise unexecuted.
- **`isDesktopOnly` runtime semantics.** The typings state no relationship between the manifest field
  and `Platform` (api: obsidian.d.ts:5137-5140); whether the app enforces anything beyond the install
  gate is **Unverified**.
- **No minimum-installer manifest field.** The manifest schema has no way to express "needs Electron
  ≥ N" (docs: en/Reference/Manifest.md:11-28). Communicating it is a README problem.
- **Mobile settings layout** — the way declarative settings rows and list `addItem` affordances change
  shape on mobile is owned by the settings reference, not repeated here.
- **`versions.json` for themes** is undocumented; see the releasing reference for both sides of that
  conflict.
