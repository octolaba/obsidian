# Decision guides

Technical choosers for the four decisions that are expensive to reverse: what kind of artifact to
build, which extension point to attach to, where to put data, and how to distribute. Plus the
decision people skip — whether to build at all.

## Contents

- [How to use these guides](#how-to-use-these-guides)
- [Evidence boundary](#evidence-boundary)
- [1. Plugin, theme, or snippet](#1-plugin-theme-or-snippet)
- [2. Extension-point chooser](#2-extension-point-chooser)
- [3. Storage chooser](#3-storage-chooser)
- [4. Distribution chooser](#4-distribution-chooser)
- [5. When not to build](#5-when-not-to-build)
- [Version-gate summary](#version-gate-summary)
- [Known gaps](#known-gaps)

## How to use these guides

Each guide gives a decision rule, then the evidence behind it. Availability is stated for every API
as `@since <app version>` plus its tier at this pin: **stable** at or below 1.12.7, or
**insider-only** above it. That distinction is not decoration — a plugin whose `minAppVersion` is at
or below the stable release cannot use an insider-only API at all.

Citation aliases: `api`, `docs`, `sample`, `theme`, `rel`, `help` — defined in the skill's Sources
section. Where a table gives an API's `@since`, the citation points at the declaration; the
`@since` tag sits in the JSDoc block directly above it, and the
[version-gate summary](#version-gate-summary) cites those tag lines directly.

## Evidence boundary

Every decision rule is derived from a documented sentence or a declaration at this pin; the
weightings between options — when a chooser says "prefer" — are this skill's **Recommendation**.
Nothing was executed: no plugin was built, installed, or measured to compare two options.

## 1. Plugin, theme, or snippet

Decide by **what has to change** and **who has to install it**.

| You need to… | Build | Why |
|---|---|---|
| Restyle the app, comprehensively and shareably | Theme | A theme is a single CSS file plus a manifest, installed and updated through the directory |
| Restyle a few elements, for yourself or one vault | Snippet | A `.css` file in the vault's snippets folder — no manifest, no release, no directory |
| Change behaviour, add commands, read or write notes, add views | Plugin | Only plugins execute code |
| Restyle *and* add behaviour | Plugin (which may ship `styles.css`) | A theme cannot run code |

Evidence and consequences:

- **Snippets** live inside the vault's configuration folder **Contract**
  (help: en/Extending Obsidian/CSS snippets.md:14) and Obsidian "will automatically detect changes
  to CSS snippets and apply them when you save the file" **Contract**
  (help: en/Extending Obsidian/CSS snippets.md:41). That auto-apply behaviour makes a snippet the
  fastest CSS iteration loop that exists. **Recommendation:** develop theme CSS as a snippet, ship it
  as a theme.
- The directory data at this pin contains a **single, dormant** snippet entry pointing at a test
  repository **Observed** (rel: community-snippets.json:2-7). **Inference:** there is no working
  community snippet directory — do not present one as a distribution channel.
- **Themes** are CSS only: the release assets are `manifest.json` and `theme.css`, with no `main.js`
  **Contract** (docs: en/Themes/App themes/Submit your theme.md:35-38). A theme has no lifecycle, no
  settings tab, and no API access.
- **Plugins** ship `main.js` plus `manifest.json` and an optional `styles.css` **Contract**
  (docs: en/Plugins/Releasing/Submit your plugin.md:36-40). If your feature needs CSS *and* code,
  one plugin is the answer, not a plugin plus a theme.
- A plugin's manifest requires three fields a theme's does not — `description`, `id`, and
  `isDesktopOnly` **Contract** (docs: en/Reference/Manifest.md:26-28) — and only plugins carry an `id`
  at all. Theme identity is the **name**, which cannot be changed after submission **Contract**
  (docs: en/Reference/Manifest.md:37). Choosing a theme name is therefore a one-way door.

## 2. Extension-point chooser

Start from the user-visible surface, not from the API list.

| Surface you want | Extension point | `@since` | Tier at pin |
|---|---|---|---|
| An entry in the command palette | `addCommand` (api: obsidian.d.ts:4955) | 0.9.7 | stable |
| An icon in the left ribbon | `addRibbonIcon` (api: obsidian.d.ts:4938) | 0.9.7 | stable |
| Text in the status bar (desktop only) | `addStatusBarItem` (api: obsidian.d.ts:4947) | 0.9.7 | stable |
| A settings page | `addSettingTab` (api: obsidian.d.ts:4969) | 0.9.7 | stable |
| A custom tab, sidebar panel, or pop-out | `registerView` (api: obsidian.d.ts:4974) | 0.9.7 | stable |
| Open a **new file extension** in your own view | `registerExtensions` (api: obsidian.d.ts:4985) | 0.9.7 | stable |
| Change rendered HTML in Reading view | `registerMarkdownPostProcessor` (api: obsidian.d.ts:4992) | 0.9.7 | stable |
| Own a fenced code-block language | `registerMarkdownCodeBlockProcessor` (api: obsidian.d.ts:5001) | 0.9.7 | stable |
| Change how the editor looks or behaves in Live Preview | `registerEditorExtension` (api: obsidian.d.ts:5019) | 0.12.8 | stable |
| Inline autocomplete while typing | `registerEditorSuggest` (api: obsidian.d.ts:5034) | 0.12.7 | stable |
| Handle an `obsidian://` URL | `registerObsidianProtocolHandler` (api: obsidian.d.ts:5028) | 0.11.0 | stable |
| Emit hover previews from your view | `registerHoverLinkSource` (api: obsidian.d.ts:4980) | 1.1.0 | stable |
| A custom Bases view | `registerBasesView` (api: obsidian.d.ts:5009) | 1.10.0 | stable |
| A terminal command | `registerCliHandler` (api: obsidian.d.ts:5048) | 1.12.2 | stable |

Decision rules that resolve the usual confusions:

- **Reading view versus Live Preview is the first question, not the last.** "If you want to change
  how to convert Markdown to HTML in the Reading view, consider building a Markdown post processor.
  If you want to change how the document looks and feels in Live Preview, you need to build an editor
  extension" **Contract** (docs: en/Plugins/Editor/Editor extensions.md:15-16). These are two
  different implementations of the same visual idea; covering both means writing both.
- **Code-block processor over post-processor** when you own a fence language: it strips the
  `<pre><code>` wrapper and hands you a `<div>` **Contract** (api: obsidian.d.ts:4995-4996).
- **Editor extension is a CodeMirror 6 extension** — the same object, no Obsidian-specific wrapper
  **Contract** (docs: en/Plugins/Editor/Editor extensions.md:7). Budget for CM6 concepts before
  choosing it, and note the cost of reconfiguring one: pass an array, mutate that same array, and
  call `updateOptions` **Contract** (api: obsidian.d.ts:5013-5014), which "is fairly expensive, so it
  should not be called frequently" **Contract** (api: obsidian.d.ts:8055).
- **`registerBasesView` can fail by design**: it "@returns false if bases are not enabled in this
  vault" **Contract** (api: obsidian.d.ts:5005). Branch on the return value; never assume registration
  succeeded.
- **`registerCliHandler` ids are global.** "Command IDs must be globally unique. Attempting to
  register a command that is already registered will throw an Error", and the documented convention is
  `<plugin-id>` for the default command and `<plugin-id>:<action>` for sub-commands **Contract**
  (api: obsidian.d.ts:5037-5039). It is also gated on the user having the CLI installed and enabled
  **Contract** (help: en/Extending Obsidian/Obsidian CLI.md:16; help: en/Extending Obsidian/Obsidian CLI.md:20-22),
  so it can never be the only entry point to a feature.
- **Protocol handlers are an integration surface, not a UI.** A valueless query parameter arrives as
  the literal string `'true'` **Contract** (api: obsidian.d.ts:4745), so validate before trusting a
  parameter's type.
- **Commands are cheap; views are not.** A custom view's constructor runs at startup for any view
  saved in the workspace unless it is deferred **Contract**
  (docs: en/Plugins/Guides/Optimize plugin load time.md:22). Prefer a command until a persistent
  surface is genuinely required.
- **There is no plugin-to-plugin extension point.** `App` exposes `workspace`, `vault`,
  `metadataCache`, `fileManager`, `secretStorage`, and a few more — and no plugin registry
  **Contract** (api: obsidian.d.ts:406-482). Anything you have seen that reaches other plugins is
  unofficial and unsupported here.

## 3. Storage chooser

Ask two questions: **who owns the data**, and **must it travel between devices?**

| Data | Put it in | API | `@since` | Tier |
|---|---|---|---|---|
| Plugin settings and plugin-owned state | `data.json` in the plugin folder | `loadData`/`saveData` (api: obsidian.d.ts:5056; api: obsidian.d.ts:5064) | 0.9.7 | stable |
| Metadata that belongs to a note and users should see | Note frontmatter | `FileManager.processFrontMatter` (api: obsidian.d.ts:2954) | 1.4.4 | stable |
| User-visible content the plugin generates | Ordinary vault files | `Vault.create`/`process` (api: obsidian.d.ts:7402; api: obsidian.d.ts:7526) | 0.9.7 / 1.1.0 | stable |
| API keys, tokens, credentials | Secret storage | `App.secretStorage` (api: obsidian.d.ts:458), `SecretStorage` (api: obsidian.d.ts:5635) | 1.11.4 | stable |
| Deliberately **per-device** state (window sizes, last device path) | Vault-scoped local storage | `loadLocalStorage`/`saveLocalStorage` (api: obsidian.d.ts:472; api: obsidian.d.ts:480) | 1.8.7 | stable |

Rules:

- **Do not hand-roll plugin data.** "Don't manage reading and write plugin data yourself. Use
  `Plugin.loadData()` and `Plugin.saveData()` instead" **Contract**
  (docs: en/Obsidian October plugin self-critique checklist.md:57). Data lands in `data.json` inside
  the plugin folder **Contract** (api: obsidian.d.ts:5051).
- **Do not hand-parse YAML.** `processFrontMatter` reads, mutates, and saves atomically; its callback
  must mutate **synchronously**, it throws `YAMLParseError` on bad YAML, and it rethrows whatever your
  callback throws **Contract** (api: obsidian.d.ts:2934-2943). Handle those errors.
- **Choose the write API by target.** For the active note prefer the `Editor` API over
  `Vault.modify`, which loses cursor position, selection, and folded content; for a background file
  prefer `Vault.process`, which is atomic **Contract**
  (docs: en/Plugins/Releasing/Plugin guidelines.md:194-206). `Vault.process` also requires a
  synchronous callback **Contract** (api: obsidian.d.ts:7514).
- **Prefer the Vault API over the Adapter API** — the Vault has a read cache and serialises file
  operations to avoid races **Contract** (docs: en/Plugins/Releasing/Plugin guidelines.md:219-222).
  Reach for `app.vault.adapter` only for something the Vault genuinely cannot express.
- **Never resolve a path by scanning.** `getFiles().find(...)` is called out explicitly as the
  anti-pattern; use `getFileByPath`, `getFolderByPath`, or `getAbstractFileByPath` **Contract**
  (docs: en/Plugins/Releasing/Plugin guidelines.md:224-231).
- **Delete through the user's preference.** "Don't use `vault.delete` to delete files. Use
  `trashFile` instead" **Contract**
  (docs: en/Obsidian October plugin self-critique checklist.md:55).
- **Secrets are local to the vault.** The value "is stored in local storage, keyed to the specific
  vault" **Contract** (docs: en/Plugins/Guides/Store secrets.md:96) — so a user who moves between
  devices re-enters it **Inference**. The point of the API is that your
  settings store a secret's **name**, never its value **Contract**
  (docs: en/Plugins/Guides/Store secrets.md:30; docs: en/Plugins/Guides/Store secrets.md:36).
  `getSecret` returns `null` when nothing is stored **Contract** (api: obsidian.d.ts:5650), so handle
  the empty case rather than assuming setup happened.
- **Local storage is per-device on purpose.** Values are vault-scoped, must be serialisable, and
  writing `null` clears the entry **Contract** (api: obsidian.d.ts:474; api: obsidian.d.ts:476). Use
  it when per-device divergence is the *intent*; use `data.json` when it is a bug.
- **External edits happen.** `data.json` can be rewritten under you by a sync tool; the optional
  `onExternalSettingsChange` hook exists for exactly that, and locally it only fires when the plugin
  `id` matches the folder name **Contract** (docs: en/Reference/Manifest.md:31).

## 4. Distribution chooser

| Audience | Channel | What it costs you |
|---|---|---|
| Everyone, discoverable, in-app install | Community directory | Full policy compliance and an automated review |
| Named beta testers, before publication | BRAT | Nothing official beyond a GitHub release |
| One machine, or a private/internal plugin | Manual copy | Nothing; also no updates and no discovery |

- **Directory.** Submission is a one-time web-directory action, not a pull request: sign in, link
  GitHub, **Plugins → New plugin**, enter the repository URL, agree to the policies, submit
  **Contract** (docs: en/Plugins/Releasing/Submit your plugin.md:46-51). You submit only the initial
  version; afterwards users pull new GitHub releases from inside Obsidian **Contract**
  (docs: en/Plugins/Releasing/Submit your plugin.md:3). The directory reads the manifest at your
  default branch HEAD **Contract** (docs: en/Plugins/Releasing/Submit your plugin.md:53), review is
  automatic, and addressing feedback needs a **new release with an incremented version** **Contract**
  (docs: en/Plugins/Releasing/Submit your plugin.md:59).
- **Requirements delta.** Plugins need `README.md`, `LICENSE`, and `manifest.json` at the repository
  root **Contract** (docs: en/Plugins/Releasing/Submit your plugin.md:16-18). Themes need those three
  **plus a screenshot**, recommended 512 × 288 px **Contract**
  (docs: en/Themes/App themes/Submit your theme.md:16-19). Release assets differ too: `main.js` +
  `manifest.json` + optional `styles.css` for plugins, versus `manifest.json` + `theme.css` for
  themes **Contract** (docs: en/Plugins/Releasing/Submit your plugin.md:38-40; docs: en/Themes/App themes/Submit your theme.md:37-38).
- **BRAT.** "While Obsidian doesn't officially support beta releases, we recommend that you use the
  BRAT plugin to distribute your plugin to beta testers before it's been published" **Contract**
  (docs: en/Plugins/Releasing/Beta-testing plugins.md:1), and it is recommended again from the
  directory side as a way to gather testers pre-submission **Contract** (rel: README.md:32). That is
  the **entire** official basis: two sentences, with all further documentation off-tree **Contract**
  (docs: en/Plugins/Releasing/Beta-testing plugins.md:3). **Unverified:** any specific BRAT
  procedure, `manifest-beta.json` convention, or pre-release semantics — none is in evidence here.
- **Manual.** Copy `main.js`, `styles.css`, and `manifest.json` into the vault's plugin folder
  **Observed** (sample: README.md:57). Nothing updates it afterwards.
- **Nothing auto-updates, on any channel.** Community plugins do not update automatically, for
  security reasons **Contract** (help: en/Extending Obsidian/Community plugins.md:41), and neither do
  themes **Contract** (help: en/Extending Obsidian/Themes.md:24). **Consequence:** users sit on old
  versions indefinitely, so a breaking change is effectively permanent for part of your user base.

## 5. When not to build

Run this list before writing code. Every item is cheaper now than after release.

- **Someone may already have built it.** The template's own first step is to check the existing
  plugin directory: "There might be an existing plugin similar enough that you can partner up with"
  **Observed** (sample: README.md:20).
- **Fewer, better projects are the stated preference.** "We encourage developers to collaborate on
  fewer high-quality projects than many low-quality ones. Consider contributing to existing projects
  rather than creating new projects that duplicate existing functionality" **Contract**
  (docs: en/Developer policies.md:44).
- **Forking is restricted.** Forks are not allowed in the directory unless the original author gave
  publicly verifiable written approval, or you can show the author is unreachable and has not updated
  the project for at least 6 months; in both cases the original author must be credited **Contract**
  (docs: en/Developer policies.md:46-51). A project that has genuinely diverged "should not be a
  fork. Start fresh with a new repository and your own code" **Contract**
  (docs: en/Developer policies.md:53).
- **The feature may be core.** Core plugin and feature names are not acceptable plugin names on their
  own — "Live Preview" and "Bases" are the given examples **Contract**
  (docs: en/Reference/Manifest.md:41). If naming your plugin after the feature is banned, check
  whether the feature already exists before reimplementing it.
- **CSS may be enough.** If nothing needs to *execute*, a snippet or theme carries none of a
  plugin's review, security, or maintenance burden — see
  [guide 1](#1-plugin-theme-or-snippet).
- **The decision may be irreversible.** A published plugin `id` is stable API **Observed**
  (sample: AGENTS.md:76) and a theme name cannot change after submission **Contract**
  (docs: en/Reference/Manifest.md:37). Settle identity before the first release.

## Version-gate summary

Every gate a chooser above depends on, in one place. Tier is measured against stable 1.12.7 at this
pin (rel: desktop-releases.json:3).

| Capability | `@since` | Tier at pin |
|---|---|---|
| `registerEditorExtension` | 0.12.8 (api: obsidian.d.ts:5017) | stable |
| `registerObsidianProtocolHandler` | 0.11.0 (api: obsidian.d.ts:5026) | stable |
| Deferred views (`isDeferred`, `loadIfDeferred`) | 1.7.2 (docs: en/Plugins/Guides/Defer views.md:6) | stable |
| `getLanguage` | 1.8.7 (api: obsidian.d.ts:3363) | stable |
| `loadLocalStorage` / `saveLocalStorage` | 1.8.7 (api: obsidian.d.ts:470) | stable |
| `registerBasesView` | 1.10.0 (api: obsidian.d.ts:5007) | stable |
| `SecretStorage` | 1.11.4 (api: obsidian.d.ts:5633) | stable |
| `registerCliHandler` | 1.12.2 (api: obsidian.d.ts:5046) | stable |
| Declarative settings (`getSettingDefinitions`) | 1.13.0 (api: obsidian.d.ts:5157) | **insider-only** (docs: en/Plugins/User interface/Settings.md:8) |
| `Plugin.settings` field | 1.13.0 (api: obsidian.d.ts:4917) | **insider-only** |

For anything insider-only, the default recommendation is the pre-1.13 imperative path, or the
documented dual-support pattern that keeps `display()` alongside `getSettingDefinitions()` **Contract**
(docs: en/Plugins/Guides/Migrate to declarative settings.md:98-100). Choosing the 1.13-only path
means bumping `minAppVersion` to `1.13.0` **Contract**
(docs: en/Plugins/Guides/Migrate to declarative settings.md:110) and shutting out every user on the
stable channel at this pin.

## Known gaps

These choosers cannot decide what the pinned sources never describe.

- **Third-party extension points.** A plugin that exposes an API to other plugins is outside every
  pinned contract: `App` declares no plugin registry, so interop has no supported shape to choose.
- **Style Settings.** Themes commonly offer configuration through it; no pinned source specifies it,
  so the storage chooser cannot rank it against a plugin's own settings (**Unverified**).
- **Testing frameworks.** Nothing upstream recommends one, so "how will you test this" is not a
  branch any chooser here can take.
- **Alternative bundlers and monorepos.** Only the esbuild template is in evidence, and the
  submission flow reads one manifest at one repository root.
- No option was built or measured; the rankings are read from documentation, not from experience.
