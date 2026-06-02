# Releasing and submitting

Cutting a release Obsidian can install, submitting it to the community directory, and keeping it
listed afterwards. This file owns `versions.json`, the release-asset contract, and the submission
procedure. It does **not** own the policies a submission is judged against — those live in the
security-and-policies reference — nor manifest anatomy and version bumping, which the project-setup
reference owns.

## Contents

- [Evidence boundary](#evidence-boundary)
- [Release mechanics](#release-mechanics)
- [`versions.json`](#versionsjson)
- [Release workflows: three templates, one recommendation](#release-workflows-three-templates-one-recommendation)
- [Submitting a plugin to the community directory](#submitting-a-plugin-to-the-community-directory)
- [Submitting a theme: the deltas](#submitting-a-theme-the-deltas)
- [Announcing a release](#announcing-a-release)
- [Beta distribution](#beta-distribution)
- [Maintenance after publication](#maintenance-after-publication)
- [Known gaps](#known-gaps)

## Evidence boundary

**The submission route changed, and the templates did not keep up.** Read this before anything else:

- **Current, and what to teach:** submission happens through the web directory at
  `community.obsidian.md` **Contract** (docs: en/Plugins/Releasing/Submit your plugin.md:46-51).
- **Stale:** the plugin template still says "Make a pull request at
  https://github.com/obsidianmd/obsidian-releases to add your plugin" **Observed**
  (sample: README.md:46), and its agent guidance still names a workflow file as canonical
  **Observed** (sample: AGENTS.md:78) — that file is not present in the pinned releases repository.
- **Why the pull request is pointless now:** the releases repository points submissions at the docs
  site **Contract** (rel: README.md:11), does not accept issues **Contract** (rel: README.md:7), and
  its directory JSON is regenerated hourly by pulling `community.obsidian.md` **Observed**
  (rel: .github/workflows/mirror-community-json.yml:6; rel: .github/workflows/mirror-community-json.yml:18).
  A pull request against those files would be overwritten by the next mirror run.

**Recommendation:** use the web directory; treat the releases repository as a read-only mirror; do not
copy the templates' submission instructions.

Citation aliases: `api`, `docs`, `sample`, `theme`, `rel`, `help` — defined in the skill's Sources
section.

## Release mechanics

Six rules. Each one has delisted somebody.

1. **The version is Semantic Versioning, `x.y.z` only.** "update `version` to a new version that
   follows the Semantic Versioning specification, for example `1.0.0` for your initial release.
   Versions supported only in the format `x.y.z`" **Contract**
   (docs: en/Plugins/Releasing/Submit your plugin.md:33). No pre-release suffixes, no build metadata.
2. **The tag must equal the manifest `version`, with no `v` prefix.** "The 'Tag version' of the
   release must match the version in your `manifest.json`" **Contract**
   (docs: en/Plugins/Releasing/Submit your plugin.md:34). The docs' own example tags `1.0.1`
   **Contract** (docs: en/Plugins/Releasing/Release your plugin with GitHub Actions.md:56), the
   template states the prefix rule outright — "Use the exact version number, don't include a prefix
   `v`" **Observed** (sample: README.md:34; sample: AGENTS.md:98) — and its `.npmrc` enforces it for
   `npm version` **Observed** (sample: .npmrc:1).
3. **The release name is free.** "Obsidian doesn't use the release name for anything, so feel free to
   name it however you like" **Contract** (docs: en/Plugins/Releasing/Submit your plugin.md:35).
4. **Assets are attached individually as binary attachments**: `main.js`, `manifest.json`, and
   `styles.css` (optional) **Contract**
   (docs: en/Plugins/Releasing/Submit your plugin.md:36-40). The template adds the detail people miss:
   "The manifest.json file must be in two places, first the root path of your repository and also in
   the release" **Observed** (sample: README.md:35).
5. **A draft release does not exist as far as Obsidian is concerned.** Both official workflows create
   a draft — `--draft` **Observed** (sample: .github/workflows/release.yml:49) and **Contract**
   (docs: en/Plugins/Releasing/Release your plugin with GitHub Actions.md:39) — and the documented
   procedure ends with a manual step: edit the draft, add release notes, "select **Publish release**"
   **Contract** (docs: en/Plugins/Releasing/Release your plugin with GitHub Actions.md:67-69).
   **Inference:** an unpublished draft is invisible to the installer, because installation looks for
   "GitHub releases tagged identically to the version inside `manifest.json`" **Contract**
   (rel: README.md:24). This is the single most common "my release did nothing" cause.
6. **Two places must agree.** The directory reads `manifest.json` at your default-branch HEAD only to
   learn the latest version **Contract** (rel: README.md:22); the files themselves come from the
   matching release **Contract** (rel: README.md:25; docs: en/Plugins/Releasing/Submit your plugin.md:55).
   Bumping the manifest without cutting the release advertises a version nobody can install.

The npm `version` lifecycle hook that keeps the manifest and `versions.json` in step is owned by the
project-setup reference; the order it imposes — edit `minAppVersion` by hand **first**, then
`npm version` — is worth restating because the script never touches `minAppVersion` **Observed**
(sample: README.md:38-39).

**Check the sync before you tag.** The bundled linter's release mode compares the versions declared
in `manifest.json`, `package.json`, and `versions.json`, and prints the tag and asset rules beside
the result:

```sh
node scripts/plugin-lint.mjs --plugin-root <dir> --release
```

A disagreement is reported as `ODP024` at `submission` tier, so the run exits `1`. Without
`--release` those three files are never compared against each other.

**Gap:** nothing in the pinned docs forbids zipping the assets. The string "zip" does not appear
anywhere under the docs' English tree; the rule is only implied by naming the three files as separate
binary attachments (docs: en/Plugins/Releasing/Submit your plugin.md:36). Say "attach them
individually", not "zips are rejected".

## `versions.json`

A per-repository compatibility map, and the most misunderstood file in the pipeline.

- **Shape.** "`versions.json` contains a JSON object, where the key is the plugin version, and the
  value is the corresponding `minAppVersion`" **Contract** (docs: en/Reference/Versions.md:7).
- **Where it is read from.** The **root of the repository**, not a release asset **Contract**
  (docs: en/Reference/Versions.md:9). Consistently, the official workflow attaches only `main.js`,
  `manifest.json`, and the optional `styles.css` **Observed**
  (sample: .github/workflows/release.yml:47-50) — `versions.json` is deliberately not among them.
- **When it is consulted.** Only on a mismatch: "If a user attempts to install a plugin where the
  Obsidian app version is lower than the `minAppVersion` in Manifest, then Obsidian looks for a
  `versions.json` file" **Contract** (docs: en/Reference/Versions.md:9). Restated from the directory
  side: your `versions.json` "will be consulted to find the latest version of your plugin that is
  compatible" **Contract** (rel: README.md:23).
- **What the fallback does — and does not do.** In the documented example the user runs app 1.1.0
  while the manifest demands 1.2.0 **Contract** (docs: en/Reference/Versions.md:11), and the map
  `{"0.1.0": "1.0.0", "0.12.0": "1.1.0"}` resolves to "the most recent plugin version for 1.1.0 is
  0.12.0" **Contract** (docs: en/Reference/Versions.md:35). **The mechanism only ever hands the user
  an *older* plugin version.** It never lets an out-of-date app install your newest release, and it
  cannot undo a `minAppVersion` bump for users who already have the new version. `minAppVersion`
  remains a hard install gate; the mobile-and-compatibility reference owns that gate.
- **When to touch it.** "You don't need to list every plugin release in the `versions.json`. You only
  need to update `versions.json` if you change the `minAppVersion` for your plugin" **Contract**
  (docs: en/Reference/Versions.md:38). A map with one entry per release is not wrong, just noise.

**Themes: undocumented, and the template contradicts itself.** The reference speaks only of plugins —
"the key is the plugin version" and "the root of the plugin repository" **Contract**
(docs: en/Reference/Versions.md:7; docs: en/Reference/Versions.md:9). The theme template nonetheless
ships `{"1.0.0": "1.0.0"}` **Observed** (theme: versions.json:2) while its own release walkthrough
presents `{"1.0.0": "0.16.0"}` as the correct content and explains it as "version 1.0.0 of your theme
is compatible with version 0.16.0 of Obsidian" **Observed**
(theme: README.md:67; theme: README.md:71).
**Inference:** the file is undocumented for themes and its shipped example does not match its own
prose. Keep it consistent with the theme manifest, and do not build a compatibility strategy on it.

## Release workflows: three templates, one recommendation

Three official artifacts describe the same job and disagree. All three are real; only one is current.

| | Plugin template (**recommended**) | Docs guide | Theme template |
|---|---|---|---|
| Trigger | any tag (sample: .github/workflows/release.yml:3-6) | any tag (docs: en/Plugins/Releasing/Release your plugin with GitHub Actions.md:8-11) | any tag (theme: .github/workflows/release-version.yml:3-7) |
| Checkout / Node | `checkout@v6`, `setup-node@v6`, Node 24, npm cache (sample: .github/workflows/release.yml:16-22) | `checkout@v3`, `setup-node@v3`, Node 18.x (docs: en/Plugins/Releasing/Release your plugin with GitHub Actions.md:19-24) | `checkout@v3`, no Node (theme: .github/workflows/release-version.yml:14) |
| Build | `npm ci` + `npm run build` (sample: .github/workflows/release.yml:26-27) | `npm install` + `npm run build` (docs: en/Plugins/Releasing/Release your plugin with GitHub Actions.md:28-29) | none — CSS ships as committed |
| `styles.css` | probed, added only when present (sample: .github/workflows/release.yml:29-32) | listed unconditionally (docs: en/Plugins/Releasing/Release your plugin with GitHub Actions.md:40) | n/a |
| Provenance | `actions/attest@v4` over the assets (sample: .github/workflows/release.yml:34-39) | none | none |
| Result | draft (sample: .github/workflows/release.yml:49) | draft (docs: en/Plugins/Releasing/Release your plugin with GitHub Actions.md:39) | published, `draft: false` (theme: .github/workflows/release-version.yml:29) |

**Recommendation: copy the plugin template's workflow.** Two concrete reasons beyond currency:

- The docs version lists `styles.css` unconditionally in `gh release create`
  (docs: en/Plugins/Releasing/Release your plugin with GitHub Actions.md:40). **Inference:** a plugin
  without a stylesheet fails the release step, which is exactly how a tag ends up with no installable
  release. The template's probe exists to prevent that **Observed**
  (sample: .github/workflows/release.yml:29-32).
- The docs version also requires a manual repository setting — Settings → Actions → General →
  Workflow permissions → "Read and write permissions" **Contract**
  (docs: en/Plugins/Releasing/Release your plugin with GitHub Actions.md:51) — which the in-file
  `permissions:` block already covers in both versions.

**The theme template's workflow is the oldest of the three.** Observable facts, without judging the
GitHub features involved (that assessment is outside the pin and is **Unverified** here): it emits its
computed tag through the `::set-output` workflow command **Observed**
(theme: .github/workflows/release-version.yml:19) and then never uses that output; it creates the
release with `actions/create-release@v1` **Observed**
(theme: .github/workflows/release-version.yml:22) and uploads each asset with
`actions/upload-release-asset@v1` **Observed**
(theme: .github/workflows/release-version.yml:33; theme: .github/workflows/release-version.yml:43);
and it passes `${{ github.ref }}` as both `tag_name` and `release_name` **Observed**
(theme: .github/workflows/release-version.yml:27-28),
which on a tag push is the full ref rather than the bare tag. **Inference:** that last detail is at
odds with the "tag equals the manifest version" rule, so verify the produced tag before relying on
it. Prefer the shape of the docs' theme guide, which uses `gh release create` with `--generate-notes`
and `--draft` over `manifest.json theme.css` **Contract**
(docs: en/Themes/App themes/Release your theme with GitHub Actions.md:26-30).

Whichever you use, the last step is human: **publish the draft**.

## Submitting a plugin to the community directory

You submit only the initial version: "You only need to submit the initial version of your plugin.
After your plugin has been published, users can download new releases from GitHub directly from
within Obsidian" **Contract** (docs: en/Plugins/Releasing/Submit your plugin.md:3).

**Prerequisites** — a GitHub account **and** an Obsidian account **Contract**
(docs: en/Plugins/Releasing/Submit your plugin.md:9-10). At the **root** of the repository
**Contract** (docs: en/Plugins/Releasing/Submit your plugin.md:14):

- `README.md` "that describes the purpose of the plugin, and how to use it"
  (docs: en/Plugins/Releasing/Submit your plugin.md:16);
- `LICENSE` (docs: en/Plugins/Releasing/Submit your plugin.md:17);
- `manifest.json` (docs: en/Plugins/Releasing/Submit your plugin.md:18).

Plus compliance with the policies and submission requirements **Contract**
(docs: en/Plugins/Releasing/Submit your plugin.md:20) — owned by the security-and-policies reference.

**The flow, as pinned** (docs: en/Plugins/Releasing/Submit your plugin.md:46-51):

1. Sign in at `community.obsidian.md` with your Obsidian account.
2. Link your GitHub account — this is how the directory verifies you own the repository.
3. Sidebar → **Plugins** → **New plugin**.
4. Enter the GitHub repository URL.
5. Review and agree to the developer policies, and confirm you will continue to support the plugin.
6. Select **Submit**.

**What happens next, and the four facts that surprise people:**

- **The manifest is read from your default branch, not your release.** "The directory processes the
  `manifest.json` at the HEAD of your repository's default branch, so make sure it's accurate and
  committed before submitting" **Contract**
  (docs: en/Plugins/Releasing/Submit your plugin.md:53). An uncommitted local manifest submits
  nothing.
- **`id` must be unique across all published plugins and cannot contain `obsidian`** **Contract**
  (docs: en/Plugins/Releasing/Submit your plugin.md:53). The full charset and naming rules are owned
  by the project-setup reference.
- **Review is automated, per version.** "After you submit, your plugin is reviewed automatically and
  the directory shows guidance for anything that needs to be corrected. To address feedback, update
  your repository and publish a new GitHub release with an incremented version" **Contract**
  (docs: en/Plugins/Releasing/Submit your plugin.md:59). **Pushing a fix is not enough** — every
  round trip costs a version number. Budget for that: fix everything you can find *before*
  submitting, using the code-review reference and the bundled linters.
- **You can edit and press Publish at any time; that is not the gate.** "You can edit the description
  and select **Publish** at any time, but your plugin won't be installable from within Obsidian until
  the automated review passes" **Contract**
  (docs: en/Plugins/Releasing/Submit your plugin.md:61).

## Submitting a theme: the deltas

Same shape, five differences.

1. **A screenshot is required at the repository root**, "Recommended image dimensions: 512 x 288
   pixels" **Contract** (docs: en/Themes/App themes/Submit your theme.md:18), alongside `README.md`,
   `LICENSE`, and `manifest.json` **Contract** (docs: en/Themes/App themes/Submit your theme.md:14).
   The theme checklist repeats the dimensions and adds "check your screenshot files are up-to-date.
   These screenshots are shown as thumbnails in the theme directory" **Contract**
   (docs: en/Obsidian October theme self-critique checklist.md:23; docs: en/Obsidian October theme self-critique checklist.md:25).
   **Observed conflict with practice:** 153 of the 650 listed themes record a screenshot path with a
   directory component — for example `images/demo1.png` (rel: community-css-themes.json:193),
   `img/reverie-2020-09-14-dark.png` (rel: community-css-themes.json:235). **Inference:** the
   directory accepts a screenshot anywhere in the repository, while the documented instruction says
   root. Put it at the root for a new submission; do not report a subdirectory screenshot as missing
   when reviewing a published theme.
2. **Sidebar → Themes → New theme** rather than Plugins → New plugin **Contract**
   (docs: en/Themes/App themes/Submit your theme.md:46).
3. **Release assets are `manifest.json` and `theme.css`** — no `main.js`, no `styles.css`
   **Contract** (docs: en/Themes/App themes/Submit your theme.md:37-38).
4. **The name is permanent.** "Theme names cannot be changed once the theme has been submitted to the
   community directory" **Contract** (docs: en/Reference/Manifest.md:37). A theme has no `id`, so the
   name *is* the identity, and the directory keys themes by it. Settle it before the first
   submission; the naming rules themselves are owned by the project-setup reference.
5. **Conflict on updates.** The theme submission page says users "can automatically download new
   releases from GitHub directly from within Obsidian" **Contract**
   (docs: en/Themes/App themes/Submit your theme.md:3), while the help site states "Themes don't
   update automatically" **Contract** (help: en/Extending Obsidian/Themes.md:24).
   **Recommendation:** follow the help site — it describes the user-facing behaviour — and never
   promise theme users an automatic update.

Everything else — tag equals version, HEAD manifest plus matching release, automated review, new
versioned release to address feedback — is identical **Contract**
(docs: en/Themes/App themes/Submit your theme.md:33; docs: en/Themes/App themes/Submit your theme.md:51; docs: en/Themes/App themes/Submit your theme.md:57-59).

## Announcing a release

Two channels, both documented for plugins **Contract**
(docs: en/Plugins/Releasing/Submit your plugin.md:67-68) and for themes **Contract**
(docs: en/Themes/App themes/Submit your theme.md:65-66), and restated by the releases repository
**Contract** (rel: README.md:29-31):

- The forum's **Share & showcase** category.
- The `#updates` channel on Discord — which needs the `developer` role; the pages link where to get
  it (docs: en/Plugins/Releasing/Submit your plugin.md:68).

Both are post-publication steps. There is no documented pre-announcement or listing-preview channel.

## Beta distribution

The **entire** official basis is two sentences: "While Obsidian doesn't officially support beta
releases, we recommend that you use the BRAT plugin to distribute your plugin to beta testers before
it's been published" **Contract** (docs: en/Plugins/Releasing/Beta-testing plugins.md:1), and "For
more information, refer to the BRAT documentation" — a link off-tree **Contract**
(docs: en/Plugins/Releasing/Beta-testing plugins.md:3). The releases repository adds the same
recommendation framed as acquiring testers before submitting **Contract** (rel: README.md:32).

**Unverified — say so explicitly if asked:** every BRAT procedure, the `manifest-beta.json`
convention, pre-release tag handling, and how BRAT resolves versions. None of it appears in any
pinned source. Do not reconstruct a BRAT workflow from memory; point the user at the linked
documentation instead.

What *is* safe to say: BRAT consumes ordinary GitHub releases, so the mechanics above — semver tag
equal to the manifest version, assets attached individually, draft published — apply to a beta
release too (**Inference** from the release contract, not from BRAT documentation).

## Maintenance after publication

**The deprecation list is a per-version blocklist with undocumented semantics.**
`community-plugin-deprecation.json` maps a plugin `id` to an array of version strings — for example
four versions of one plugin **Observed** (rel: community-plugin-deprecation.json:2) and two of another
**Observed** (rel: community-plugin-deprecation.json:3); seven plugins are listed at this pin, and one
entry spans 39 version strings (rel: community-plugin-deprecation.json:23). Nothing in the pinned tree
describes how the app consumes it — the install pipeline section of the releases README never mentions
it (rel: README.md:17-25). **Inference:** it records versions the team flagged. Never tell a user it
forces an update or blocks an install.

**The removed list is descriptive, not a gate.** Three ids appear on the removed list *and* in the
live catalogue:
`duplicate-line` (rel: community-plugins-removed.json:58; rel: community-plugins.json:3846),
`memos-sync` (rel: community-plugins-removed.json:138; rel: community-plugins.json:6170), and
`smart-gantt` (rel: community-plugins-removed.json:779; rel: community-plugins.json:41163).
**Inference:** presence there is a record, not an enforcement state; never read it as "this plugin
cannot be installed". The removal-reason taxonomy is owned by the security-and-policies reference.

**Renaming and re-identifying.**

- A plugin **name** can be changed by editing `manifest.json`, "If the new name is invalid, the
  directory delists the plugin until you resolve the problem" **Contract**
  (docs: en/Reference/Manifest.md:37). A rename is therefore a delisting risk, evaluated
  automatically.
- A plugin **`id`** must never change: the template calls it stable API **Observed**
  (sample: AGENTS.md:76), and the record contains a removal reading "ID changed, no response from
  developer after 30 days" **Observed** (rel: community-plugins-removed.json:630). Never advise
  changing a published `id`, whatever the current naming rules say.

**The releases repository is a mirror.** Its directory JSON is refreshed hourly from
`community.obsidian.md` **Observed**
(rel: .github/workflows/mirror-community-json.yml:6; rel: .github/workflows/mirror-community-json.yml:18),
and the repository does not accept issues
**Contract** (rel: README.md:7). Pull requests and issues there change nothing; fix the source of
truth — your repository, or your directory entry.

**Archiving your repository delists you.** It is by a wide margin the most common recorded removal
cause; see the taxonomy in the security-and-policies reference before you archive anything you still
want listed.

## Known gaps

- **Zipped assets** — no rule exists; see [Release mechanics](#release-mechanics).
- **Pre-release and beta semantics** — `x.y.z` is the only documented version shape
  (docs: en/Plugins/Releasing/Submit your plugin.md:33); nothing describes pre-release tags,
  `manifest-beta.json`, or how the directory treats a GitHub pre-release.
- **Monorepo submission** — the flow reads one manifest at one repository root
  (docs: en/Plugins/Releasing/Submit your plugin.md:53); several plugins in one repository is
  undocumented.
- **The automated review's criteria** are not published in any pinned source; never predict a
  verdict.
- **Unlisting on request** — nothing documents how an author voluntarily removes a published plugin
  or theme, though one removal reason reads "Removed by author" **Observed**
  (rel: community-plugins-removed.json:455).
- **Theme `versions.json`** — undocumented, and the template contradicts itself; see
  [`versions.json`](#versionsjson).
- **No release was executed.** Every claim here is read from pinned documentation, workflow files, and
  directory data; no submission, install, or review was performed.
