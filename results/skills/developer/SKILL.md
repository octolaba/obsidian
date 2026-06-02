---
name: obsidian-developer
description: "Source-verified expertise in Obsidian plugin and theme development, pinned to the obsidian API 1.13.2 typings and official developer docs (stable app 1.12.7 at the pin): architecture and extension-point decisions, project setup, lifecycle and API contracts, debugging and the Obsidian CLI, mobile compatibility, performance, security, review, and release. Use when explaining how Obsidian extension development works or when designing, building, debugging, reviewing, or shipping a plugin or theme. Selecting an existing third-party plugin or theme to install is outside this skill; for vault-side Dataview or Tasks use, use the Obsidian Dataview or Obsidian Tasks skill instead."
source: obsidianmd/obsidian-api
version: 1.13.2
basis: source
---

# Obsidian plugin and theme developer

## Research question, scope, and exclusions

**What must an expert know and check to design, build, debug, review, and ship an Obsidian plugin
or theme correctly — without confusing documented contracts, observed template behaviour, and
advice?**

In scope: architecture and extension-point selection; project setup and toolchain; the plugin and
component lifecycle; workspace, view, vault, metadata, settings, UI, and editor contracts; theme CSS
architecture; mobile and version compatibility; startup and runtime performance; security and the
developer policies; debugging loops including the Obsidian CLI; code review; releasing, versioning,
and submission to the community directory.

Deliberately excluded, with the owner named where one exists:

- **Selecting or using** an existing third-party plugin or theme. This skill supports *building*
  extensions; Dataview and Tasks usage belongs to their respective skills.
- Vault design, note-taking workflow, and general Obsidian usage.
- App behaviour after this pin, and any behaviour of insider builds beyond what the pinned docs and
  typings state.
- Operating a Publish site, and `publish.d.ts` scripting.
- Obsidian Headless and Obsidian Sync operations.
- Monorepo submission (one repository, several plugins): **Gap** — the pinned submission flow reads
  one manifest at one repository root and never addresses this.

This skill is authoritative for Obsidian plugin and theme development questions. **No paired deep
dive exists**; nothing here defers to another artifact.

## Sources and evidence

Six pinned upstream sources. Citations are written `(alias: path:line)`, and every path is relative
to that alias's repository root.

| Alias | Repository | Commit | Role |
|---|---|---|---|
| `api` | `obsidianmd/obsidian-api` | `cc1744324150c632416857c98964f87b1574a5fc` | **Primary.** `obsidian.d.ts` declarations, JSDoc, `@since` tags |
| `docs` | `obsidianmd/obsidian-developer-docs` | `2d0e942f03b23ed94ebda3c610ed074662ed63db` | Normative policies, requirements, guidelines, narrative guides |
| `sample` | `obsidianmd/obsidian-sample-plugin` | `23c165fd362d4049330cb3edad6a52914ff2007a` | Official plugin template — observed, not normative |
| `theme` | `obsidianmd/obsidian-sample-theme` | `be9db886ee504a5b261304a072efed8dd95477d9` | Official theme template — observed, not normative |
| `rel` | `obsidianmd/obsidian-releases` | `80239338536205c598b72ed46c77ecb86831bc57` | Directory data and app release manifest — a downstream mirror |
| `help` | `obsidianmd/obsidian-help` | `a97de34c1a9f2381586f4f51070aeb9207c8a457` | User-facing behaviour; primary documentation for the Obsidian CLI |

`obsidianmd/obsidian-api` publishes no git tags. `1.13.2` is the **npm typings version** recorded at
(api: package.json:3) — never an app version. Commit `cc1744324150c632416857c98964f87b1574a5fc`
is the reproducibility ground truth; "primary" identifies the version anchor, while normative weight
follows the authority order below.

**Authority order**, highest first: Developer policies and Submission requirements → Plugin and Theme
guidelines → `obsidian.d.ts` JSDoc and `@since` → developer-docs narrative → the two sample templates
(observed templates, not rules) → help (user-facing context, except the CLI page, which is the CLI's
primary documentation). `CHANGELOG.md` stops at v1.7.2 (api: CHANGELOG.md:5) and is stale by
several minor versions; prefer `@since`.

**Availability-tier rule.** The stable desktop app at this pin is **1.12.7**
(rel: desktop-releases.json:3); 1.13.x is the beta channel (rel: desktop-releases.json:9). The
typings and docs already describe 1.13 features. For a dated `@since`, compare that version with
1.12.7 and state *stable at pin* or *insider-only at pin*. An **untagged** declaration proves only
that the symbol exists in the 1.13.2 typings; its introduction version and availability tier are
**unknown**. Do not recommend one below the target floor unless another pinned official source or a
runtime check establishes compatibility; otherwise label it **Unverified** and give a dated fallback. Never recommend an insider-only or availability-unknown API as the default path.

**Basis boundary.** `basis: source` means the typings, sample sources, build configs, CI workflows,
theme CSS, and directory data were read. The Obsidian app itself is closed source
(rel: README.md:5), so app runtime behaviour beyond a documented contract is **Unverified** here.

**Sources deliberately excluded.** Third-party plugins and themes are not sources for this skill.
The consequence is binding: testing frameworks, i18n file layouts, BRAT internals, non-esbuild build
configurations, and Style Settings have **no operational rules here** — only labelled gaps.

Evidence labels: **Contract** (documented public rule or declaration), **Observed** (read from
pinned template, config, or directory data), **Inference**, **Recommendation**, **Unverified**.

## Intake before answering

Establish, or state as an assumption:

1. **Plugin or theme**, and whether it is pre-first-release or already published.
2. Target **`minAppVersion`**, and the app version the user actually runs (stable is 1.12.7 at this
   pin; 1.13.x is insider-only).
3. **`isDesktopOnly`**, and whether mobile is genuinely supported.
4. The exact `manifest.json`, and `versions.json` if present.
5. Toolchain: bundler, whether externals are configured, whether a production build is used.
6. For a bug: the exact symptom, whether it survives a plugin reload versus an app restart, and the
   developer-console output.
7. For a review: which tier floor the user wants — policy, submission, guideline, checklist, or
   convention.
8. For release trouble: the tag, the release assets, and whether the release is still a draft.

Do not assume the sample template's shape. Many published plugins predate it.

## Mental model

```text
Vault/
  <configDir, default .obsidian>/     configDir is not guaranteed to be ".obsidian"
    plugins/<plugin-id>/              main.js + manifest.json + optional styles.css + data.json
    themes/<Theme name>/              theme.css + manifest.json
    snippets/*.css                    user CSS, no manifest, no directory

Repository (what you commit)          Release (what Obsidian downloads)
  src/**.ts, manifest.json,      →      tag == manifest version, assets attached individually
  versions.json, styles.css             main.js, manifest.json, styles.css (themes: theme.css)
  (main.js is NOT committed)
```

Lifecycle: app start → **all** plugins load before the user can interact → `onload` (registrations
only) → `onLayoutReady` (startup work) → `onUserEnable` on explicit enable → `onunload`
(synchronous). Object graph: `Plugin.app` reaches `workspace`, `vault`, `metadataCache`,
`fileManager`, `secretStorage`; there is **no** plugin registry on `App`, so plugin-to-plugin
interop has no supported contract.

Operational consequences:

- `configDir` is "typically `.obsidian` but it could be different" **Contract**
  (api: obsidian.d.ts:7346) — never hardcode the path.
- Obsidian loads every plugin before the user can interact with the app **Contract**
  (docs: en/Plugins/Guides/Optimize plugin load time.md:6); your `onload` is on that critical path.
- A theme is a variable override sheet first and a selector sheet second: override general variables
  under `body`, colours under `.theme-light`/`.theme-dark` **Contract**
  (docs: en/Themes/App themes/Theme guidelines.md:9). Low-specificity selectors are the documented
  defence against Obsidian changing class names **Contract**
  (docs: en/Themes/App themes/Theme guidelines.md:33).
- Community pipeline: submit once through the web directory **Contract**
  (docs: en/Plugins/Releasing/Submit your plugin.md:46-51); afterwards the app reads your
  repository's `manifest.json` only to learn the latest version and downloads the files from the
  matching GitHub release **Contract** (rel: README.md:22; rel: README.md:24). The directory JSON in
  the releases repository is an hourly downstream mirror **Observed**
  (rel: .github/workflows/mirror-community-json.yml:6; rel: .github/workflows/mirror-community-json.yml:18),
  so pull requests against it are pointless.
- The Obsidian CLI sits beside a running app, not inside your build: it needs the 1.12 installer,
  1.12.7+ **Contract** (help: en/Extending Obsidian/Obsidian CLI.md:11-12; help: en/Extending Obsidian/Obsidian CLI.md:16),
  the **Command line interface** toggle under Settings → General **Contract**
  (help: en/Extending Obsidian/Obsidian CLI.md:20-22). The first command launches the app if needed
  **Contract** (help: en/Extending Obsidian/Obsidian CLI.md:30-31), so it may be slow or stateful.

## Route the question

Load only what the question needs. Every file below is part of this portable skill.

| Need | Read |
|---|---|
| Scaffold, bundler, tsconfig, ESLint, manifest anatomy, naming | [project setup](reference/project-setup.md) |
| Choose plugin/theme/snippet, extension point, storage, distribution | [decision guides](reference/decision-guides.md) |
| `onload`/`onunload`, `register*`, commands, protocol and CLI handlers, events | [lifecycle and registration](reference/lifecycle-and-registration.md) |
| Leaves, custom views, view state, deferred views, pop-out windows | [workspace, views, and state](reference/workspace-views-and-state.md) |
| Reading/writing files, frontmatter, metadata cache, secrets, canvas | [vault and metadata](reference/vault-and-metadata.md) |
| Settings tab, declarative settings, settings UI copy, settings-data migration | [settings](reference/settings.md) |
| Ribbon, status bar, menus, modals, suggesters, icons, DOM helpers, RTL, i18n, Bases views | [UI surfaces](reference/ui-surfaces.md) |
| `Editor` API, CodeMirror 6 extensions, decorations, post-processors, code blocks | [editor extensions](reference/editor-extensions.md) |
| Theme anatomy, CSS variables, scope discipline, snippets, Publish themes | [themes and CSS](reference/themes-and-css.md) |
| `isDesktopOnly`, `Platform`, network, `minAppVersion`, installer version | [mobile and compatibility](reference/mobile-and-compat.md) |
| Slow startup, expensive runtime work, measurement | [performance](reference/performance.md) |
| Policies, submission requirements and description rules, disclosures, sanitisation, dependencies, secrets | [security and policies](reference/security-and-policies.md) |
| Release mechanics, `versions.json`, workflows, submission, BRAT, maintenance | [releasing](reference/releasing.md) |
| Run a review and write the report | [code review](reference/code-review.md) |
| Dev vault, reload loop, Obsidian CLI, failure signatures | [debugging](reference/debugging.md) |

The five bundled tools, with their invocations, are in [Bundled tools](#bundled-tools) below.

## Consultation protocols

**Design / architecture.** Establish the target surface and the compatibility floor first, then pick
the extension point (decision guides), then the storage (decision guides), then confirm every API is
compatible with the target. State a dated `@since` and tier, or say **untagged; availability unknown**
and name the independent verification, guard, or fallback. Only then discuss code shape.

**Build from scratch.** Scaffold and toolchain (project setup) → lifecycle registrations
(lifecycle and registration) → the one surface the feature needs → settings → mobile and performance
review before first release → releasing.

**Debug.** Classify before fixing: source change (reload the plugin) versus manifest change (restart
the app) versus app-state problem. Reproduce in a throwaway dev vault, never the user's main vault
**Contract** (docs: en/Plugins/Getting started/Build a plugin.md:23). Use the debugging reference
for the failure-signature table and the CLI loop.

**Review.** Run the bundled linters first, then sweep manually by tier, then write the report. The
procedure and report format live in the code-review reference; the rules themselves live in the
reference that owns them. Escalation rationale: plugins run unsandboxed with the app's privileges,
so a security finding is never "style".

**Release / submit.** Version sync (`plugin-lint.mjs --release` compares manifest, `package.json`,
and `versions.json`) → build → tag → release → publish the draft → submit once. The
directory reads the manifest at your default branch HEAD **Contract**
(docs: en/Plugins/Releasing/Submit your plugin.md:53) and review is automatic; fixing feedback needs
a **new release with an incremented version**, not just a push **Contract**
(docs: en/Plugins/Releasing/Submit your plugin.md:59).

**Migrate.** Name the version boundary before recommending anything: deferred views (1.7.2),
declarative settings (1.13.0, insider-only at pin), `SecretStorage` (1.11.4), Bases views (1.10.0),
CLI handlers (1.12.2).

## High-risk traps

Each is reproducible from the pin.

- Obsidian prefixes command **id and name** with your plugin's id and name — embedding either
  duplicates it (api: obsidian.d.ts:4951; docs: en/Plugins/Releasing/Submission requirements for plugins.md:48).
- `onunload` is declared `void`, not async, so `await` in it is never awaited — even though the docs
  example writes `async onunload()` (api: obsidian.d.ts:1862; docs: en/Plugins/Getting started/Anatomy of a plugin.md:10).
- `addStatusBarItem()` is not available on mobile (api: obsidian.d.ts:4941).
- `registerBasesView` returns `false` when Bases is disabled in the vault — check the return value
  (api: obsidian.d.ts:5005).
- CLI command ids are **global**; registering one that already exists throws
  (api: obsidian.d.ts:5037).
- `requestUrl` throws on HTTP status 400+ unless you pass `throw: false`
  (api: obsidian.d.ts:5457-5461).
- `ObsidianProtocolData` declares every value `string | 'true'` — treat protocol parameters as
  strings; **Inference:** the `'true'` member exists for valueless ones (api: obsidian.d.ts:4745).
- `vault.on('create')` also fires once for **every existing file** during vault load; register it
  inside `onLayoutReady` (api: obsidian.d.ts:7569-7570).
- `metadataCache.on('changed')` is **not** fired on rename; hook the vault `rename` event
  (api: obsidian.d.ts:4449-4450).
- `revealLeaf` must be awaited or the view may still be deferred (api: obsidian.d.ts:8041).
- `Vault.process` and `FileManager.processFrontMatter` callbacks must return/mutate **synchronously**
  (api: obsidian.d.ts:7514; api: obsidian.d.ts:2940).
- `ListItemCache.parent` is the parent's line number, or the **negative** of the list's first line
  when there is no parent (api: obsidian.d.ts:3760-3763).
- Locally, the plugin `id` must match its folder name or `onExternalSettingsChange` is never called
  (docs: en/Reference/Manifest.md:31).
- `minAppVersion` is a hard install gate; `versions.json` only rescues users by offering an **older**
  plugin version (docs: en/Reference/Versions.md:9; docs: en/Reference/Versions.md:35).
- The release tag must equal the manifest `version` exactly — "tagged identically" — with no `v`
  prefix (rel: README.md:24; docs: en/Plugins/Releasing/Submit your plugin.md:34; sample: .npmrc:1).
- Both official release workflows pass `--draft`, and the draft must be published by hand or it stays
  invisible to the installer (sample: .github/workflows/release.yml:49; docs: en/Plugins/Releasing/Release your plugin with GitHub Actions.md:39; docs: en/Plugins/Releasing/Release your plugin with GitHub Actions.md:69).
- Never change a published `id` — the template calls it stable API (sample: AGENTS.md:76).
- Themes must not load network assets — the dominant recorded theme-delisting reason, 16 of 26
  entries (docs: en/Developer policies.md:20; rel: community-css-themes-removed.json:4).
- `!important` in a theme prevents users from overriding it with a snippet
  (docs: en/Themes/App themes/Theme guidelines.md:43).
- Keep `obsidian`, `electron`, and every `@codemirror/*` and `@lezer/*` package **external**: a
  second copy of `@codemirror/state` in your bundle breaks facet identity silently **Inference**
  (sample: esbuild.config.mjs:19-34).
- Lucide icon names newer than v0.446.0 are not supported and fail silently — `setIcon` "Does
  nothing" for an unknown id (docs: en/Plugins/User interface/Icons.md:7; api: obsidian.d.ts:5682-5689).
- Neither plugins nor themes auto-update for users (help: en/Extending Obsidian/Community plugins.md:41; help: en/Extending Obsidian/Themes.md:24).

## Bundled tools

Node 18+, zero dependencies, no network. Read-only except `dev-vault.mjs`, which writes only inside
the vault it creates, and `verify.mjs --write-fingerprints`, which rewrites its own fixture. Every
tool requires explicit inputs; a missing argument is a usage error, never a silent scan.

| Tool | Purpose and invocation |
|---|---|
| [`plugin-lint.mjs`](scripts/plugin-lint.mjs) | Manifest, repository, and source rules for a plugin. `node scripts/plugin-lint.mjs --plugin-root <dir> [--new\|--published] [--release] [--format text\|json\|sarif]` — `--release` adds the version-sync check and the release notes |
| [`theme-lint.mjs`](scripts/theme-lint.mjs) | Manifest, `theme.css`, remote-asset, `!important`, and `:has()` rules. `node scripts/theme-lint.mjs --theme-root <dir> [--new\|--published] [--format text\|json\|sarif]` |
| [`dev-vault.mjs`](scripts/dev-vault.mjs) | Create or explicitly refresh a throwaway dev vault. `node scripts/dev-vault.mjs <vault-dir> (--plugin <dir> \| --theme <dir> \| --snippet <file>)... [--copy\|--link] [--config-dir NAME] [--refresh]` |
| [`verify.mjs`](scripts/verify.mjs) | Source identity, citation, structure, and invariant verification of this skill. `node scripts/verify.mjs [--<source>-root <dir>]... [--format text\|json] [--write-fingerprints]` |
| [`test.mjs`](scripts/test.mjs) | Fixture tests for the tools. `node scripts/test.mjs [--sample-plugin-root <dir>] [--sample-theme-root <dir>]` |

**Finding tiers** are derived mechanically from the source class of each rule's citation:
`policy` | `submission` | `guideline` | `checklist` | `convention`. Shared exit codes: `0` clean
**or advisory-only findings** — `checklist` and `convention` are printed and still exit `0`;
`1` findings at `policy`, `submission`, or `guideline`; `2` usage error; `3` required material
missing; `4` source-identity mismatch. CI must read the report, not the status.

**Trust model.** The linters read files: they never execute the project, install dependencies, or
write to it. Findings are candidates, not proof; each report states its scan scope and blind spots.

**Bundle mode.** Pointed at an installed plugin folder rather than a repository, `plugin-lint.mjs`
detects a bundled `main.js` and runs **only the manifest and `versions.json` checks** — every source
rule and every repository rule (LICENSE, README, committed build, lock file) is skipped, and the
printed limitation names them. Do not read a clean bundle-mode report as a clean review.

**`dev-vault.mjs` boundary.** It creates a new vault or explicitly refreshes listed files in one
carrying its marker, and writes only inside it. Unsafe path components are refused before creation;
refresh never reseeds notes or edits Obsidian configuration JSON; commands are quoted and vault-targeted.

## Validate before handoff

1. Every recommended API states its dated `@since` and tier, or says **untagged; availability
   unknown** and names the independent verification, runtime guard, or dated fallback.
2. Nothing insider-only is presented as the default path for a plugin whose `minAppVersion` is at or
   below 1.12.7.
3. Claims are labelled: Contract, Observed, Inference, Recommendation, or Unverified.
4. Any Source-mode editor claim is labelled **Inference** — the pinned editor docs cover Reading view
   and Live Preview only (docs: en/Plugins/Editor/Editor extensions.md:15-16).
5. Linter output was interpreted, not pasted: false-positive rationale is given for anything dropped.
6. Mobile, performance, and security implications were considered or explicitly declared irrelevant.
7. Release advice names the draft-publish step and the tag format.
8. Remaining uncertainty — live-app behaviour, insider builds, third-party plugins — is stated.

## Limitations and conflicts

Known limitations:

- **No live Obsidian run, no end-to-end test.** Every claim comes from the pinned trees. Rendering,
  installation, CLI registration, mobile behaviour, and the directory's automated review were not
  executed.
- **Agent behaviour is not evaluated.** How this skill triggers and routes in a clean context has not
  been measured, and nothing here is evidence about it.
- **The app is closed source.** Enforcement behaviour — deprecation handling, review automation,
  install gating — is inferred from data and docs, never read from an implementation.
- **The six pins move together.** A partial pin bump makes cross-source claims incomparable; re-verify
  the whole set.
- Third-party tooling (testing frameworks, alternative bundlers, Style Settings, BRAT internals) is
  out of evidence and appears only as a labelled gap.

Conflicts. Both sides are cited; **Resolution** lines are this skill's synthesis, not upstream text.

| Conflict | Sides | Resolution |
|---|---|---|
| Submission route | Web directory (docs: en/Plugins/Releasing/Submit your plugin.md:46-51) vs "make a pull request" (sample: README.md:46) vs a workflow file that no longer exists (sample: AGENTS.md:78) | **Recommendation:** use the web directory; the templates are stale |
| Leaf cleanup | "Plugins are responsible for removing any leaves they add" (docs: en/Plugins/User interface/Workspace.md:124) vs "Don't detach leaves in `onunload`" (docs: en/Plugins/Releasing/Plugin guidelines.md:119) | **Recommendation:** do not detach in `onunload`; detach only from a user-invoked action such as a command. The typings carry no warning either way (api: obsidian.d.ts:8037) |
| Declarative settings persistence | `PluginSettingTab` reads/writes `this.plugin.settings` (api: obsidian.d.ts:5161-5173) vs base `SettingTab` defaulting to `vault.getConfig`/`setConfig` (api: obsidian.d.ts:6612; api: obsidian.d.ts:6625), which `Vault` never declares (api: obsidian.d.ts:7337-7350) | **Inference:** affects direct `SettingTab` subclassers only; plugin authors extending `PluginSettingTab` are unaffected |
| `fundingUrl` | Documented in the manifest reference (docs: en/Reference/Manifest.md:18) and the API README (api: README.md:27) but absent from `PluginManifest` (api: obsidian.d.ts:5094-5141) | **Inference:** the field is real; the typings are incomplete — do not read it off `this.manifest` |
| Theme remote assets | Blanket ban (docs: en/Developer policies.md:20; docs: en/Themes/App themes/Theme guidelines.md:37) vs a Google Fonts carve-out (help: en/Teams/Security considerations for teams.md:22) vs Publish guidance against embedding (docs: en/Themes/Obsidian Publish themes/Best practices for Publish themes.md:24) | **Recommendation:** for app themes, bundle everything; the carve-out and the Publish guidance are different contexts |
| "Obsidian" in the name | Unconditional ban (docs: en/Reference/Manifest.md:42) vs "unless it absolutely makes sense" (docs: en/Obsidian October plugin self-critique checklist.md:10) | **Recommendation:** follow the manifest reference; the checklist is advisory |
| `editorCallback` second argument | Example types it `MarkdownView` (api: obsidian.d.ts:1784) vs signature `MarkdownView \| MarkdownFileInfo` (api: obsidian.d.ts:1794) | **Recommendation:** follow the signature and narrow with `instanceof` |
| Release workflow | Docs: checkout/setup-node v3, Node 18, unconditional `styles.css` (docs: en/Plugins/Releasing/Release your plugin with GitHub Actions.md:19-40) vs sample: v6, Node 24, conditional asset plus attestation (sample: .github/workflows/release.yml:16-50) vs the theme template (theme: .github/workflows/release-version.yml:19-22) | **Recommendation:** teach the sample workflow; the docs version fails when `styles.css` is absent |
| Theme `versions.json` | The theme template ships `{"1.0.0": "1.0.0"}` (theme: versions.json:1-3) while its own worked example says `{"1.0.0": "0.16.0"}` (theme: README.md:65-69); the docs document the mechanism for plugins only (docs: en/Reference/Versions.md:7) | **Inference:** the file is undocumented for themes — keep it consistent with the manifest and do not rely on it |
| Removed list | Descriptive, not a gate: `duplicate-line` appears on the removed list (rel: community-plugins-removed.json:58) and still in the live catalogue (rel: community-plugins.json:3846) — 3 ids do | **Inference:** never treat presence or absence there as an install gate |
| Deprecation list | Per-version blocklist with no documented semantics (rel: community-plugin-deprecation.json:2-3) | **Inference:** describes versions the team flagged; never claim it forces an update |
| `id` charset | "only lowercase letters and hyphens" (docs: en/Reference/Manifest.md:27) vs published ids with uppercase, dots, and underscores (rel: community-plugins.json:185; rel: community-plugins.json:4301; rel: community-plugins.json:6926) | **Recommendation:** obey the rule for new plugins; never "fix" a published id (sample: AGENTS.md:76) |
| Editor mode coverage | Docs cover Reading view and Live Preview only (docs: en/Plugins/Editor/Editor extensions.md:15-16); `getMode()` returns `'source' \| 'preview'` (api: obsidian.d.ts:4214; api: obsidian.d.ts:4240) | **Inference:** Live Preview reports `'source'`; use `editorLivePreviewField` to distinguish (api: obsidian.d.ts:2609) |
| Network helpers | `requestUrl` throws on 400+ by default (api: obsidian.d.ts:5457-5458); `request()` is still declared and not deprecated (api: obsidian.d.ts:5436) | **Recommendation:** use `requestUrl` and handle the throw explicitly |
| Style Settings | No specification in any pinned source | **Unverified:** the plugin is widely used by themes, but nothing about it can be stated here |
| CSS reload | Snippets are applied automatically on save (help: en/Extending Obsidian/CSS snippets.md:41) while a theme manifest change needs a restart (docs: en/Themes/App themes/Build a theme.md:65) | **Recommendation:** develop as a snippet, ship as a theme |
| Feature availability | Docs teach 1.13 features (docs: en/Plugins/User interface/Settings.md:8) while stable is 1.12.7 (rel: desktop-releases.json:3) | **Recommendation:** the availability-tier rule above exists for exactly this |

The two counted claims above — 16 of 26 theme removals citing remote resources, and 3 removed ids
still present in the live catalogue — are reproducible with `jq` inside the `rel` checkout:

```sh
jq '[.[].reason]|group_by(.)|map({r:.[0],n:length})' community-css-themes-removed.json
jq -n --slurpfile p community-plugins.json --slurpfile r community-plugins-removed.json \
   '[$r[0][]|select(.id as $i|($p[0]|map(.id)|index($i))!=null)|.id]'
```

## Reference map

| Reference | Owns |
|---|---|
| [project setup](reference/project-setup.md) | Scaffolds, bundler and TypeScript config, ESLint, continuous integration, npm scripts, version bumping, manifest anatomy and naming |
| [decision guides](reference/decision-guides.md) | Plugin vs theme vs snippet, extension point, storage, distribution, when not to build, and the version-gate summary |
| [lifecycle and registration](reference/lifecycle-and-registration.md) | App graph, `Plugin`/`Component` lifecycle, every `register*`/`add*` contract, commands, protocol and CLI handlers, events, file extensions, plugin interop as a negative contract |
| [workspace, views, and state](reference/workspace-views-and-state.md) | Workspace tree, leaf acquisition, view lifecycle and state, layout persistence, view-scoped hotkeys, workspace events, deferred views, pop-out windows |
| [vault and metadata](reference/vault-and-metadata.md) | Vault vs adapter, read/write contracts, paths, `FileManager`, metadata cache, storage APIs, canvas format |
| [settings](reference/settings.md) | Imperative and declarative settings tabs, migration paths, settings UI copy rules, settings-data versioning |
| [UI surfaces](reference/ui-surfaces.md) | Ribbon, status bar, menus, notices, modals and suggesters, icons, tooltips, RTL, i18n, Bases views, and the DOM-helper API surface — the sanitisation rule and its policy tier belong to security and policies |
| [editor extensions](reference/editor-extensions.md) | Editor API vs CodeMirror 6 vs post-processors, decorations, view plugins and state fields, code blocks |
| [themes and CSS](reference/themes-and-css.md) | Theme anatomy, scope discipline, variable system, guideline rules, assets, snippets, Publish themes, Style Settings, the `legacy` flag |
| [mobile and compatibility](reference/mobile-and-compat.md) | `isDesktopOnly`, `Platform`, network APIs, `minAppVersion`, installer versus app version |
| [performance](reference/performance.md) | Startup cost, runtime cost, measurement |
| [security and policies](reference/security-and-policies.md) | Full policy set, submission requirements including the description rules, removal process and its empirical taxonomy, forks, copyright and licensing, the sanitisation rule and its policy tier, dependency hygiene, secrets handling |
| [releasing](reference/releasing.md) | Release mechanics, `versions.json`, workflows, submission, announcements, beta, maintenance |
| [code review](reference/code-review.md) | Review procedure, automated pass, manual sweep order, report format |
| [debugging](reference/debugging.md) | Dev vault discipline, reload loops, Obsidian CLI, mobile testing procedure, failure signatures |

## Repository-only verification (remove when extracting this skill)

This section is the only place in this skill that names repository paths, and extraction deletes it.

From the research repository root:

```sh
make lint                 # runs every gate; read the printed summary, not the shell status
```

The two gates this skill adds print as `developer-test` and `developer-verify` in that summary
(`make lint-developer-test`, `make lint-developer-verify`). Run either directly:

```sh
node results/skills/developer/scripts/test.mjs \
  --sample-plugin-root research/core/obsidian-sample-plugin \
  --sample-theme-root research/core/obsidian-sample-theme

node results/skills/developer/scripts/verify.mjs \
  --obsidian-api-root research/core/obsidian-api \
  --developer-docs-root research/core/obsidian-developer-docs \
  --sample-plugin-root research/core/obsidian-sample-plugin \
  --sample-theme-root research/core/obsidian-sample-theme \
  --releases-root research/core/obsidian-releases \
  --obsidian-help-root research/core/obsidian-help
```

`verify.mjs` anchors identity in file contents rather than Git state and exits `4` when a pin has
moved, before it checks any citation.

Update order after a pin move: move **all six** pins together → re-verify the sources → update the
reference files → update this file → regenerate the identity fingerprints
(`verify.mjs --write-fingerprints`) → `make lint`.

Further study of surfaces this skill deliberately excludes: the vendored third-party plugins under
`research/plugins/` and themes under `research/themes/` are evidence about the ecosystem, not sources
for this skill. `research/plugins/obsidian-tasks-group/obsidian-tasks` carries a Jest layout
(`jest.config.js`, `jest.integration.config.js`, `tests/`, `integration_tests/`) and is the closest
vendored exemplar for the testing gap named above; `research/plugins/TfTHacker/obsidian42-brat` is
the only concrete BRAT evidence available locally. Neither is a source for this skill.
