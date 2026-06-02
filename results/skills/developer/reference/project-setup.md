# Project setup and toolchain

Everything needed to stand up a plugin or theme project and keep it buildable: scaffolds, the
manifest, naming, the build pipeline, TypeScript, linting, version bumping, and CI.

## Contents

- [Evidence boundary](#evidence-boundary)
- [Scaffold a plugin](#scaffold-a-plugin)
- [Scaffold a theme](#scaffold-a-theme)
- [Manifest anatomy](#manifest-anatomy)
- [Naming rules](#naming-rules)
- [The build pipeline](#the-build-pipeline)
- [TypeScript configuration](#typescript-configuration)
- [Linting](#linting)
- [Scripts, version bumping, and tags](#scripts-version-bumping-and-tags)
- [Continuous integration](#continuous-integration)
- [Using a different bundler](#using-a-different-bundler)
- [Known gaps](#known-gaps)

## Evidence boundary

The two official templates are **Observed**, not normative: they show one working configuration, and
plenty of published plugins differ legitimately. Manifest and naming rules from the developer docs
are **Contract**. Where the templates and the docs disagree, both are shown.

Citation aliases: `api`, `docs`, `sample`, `theme`, `rel`, `help` — defined in the skill's Sources
section.

## Scaffold a plugin

The plugin template is a GitHub template repository; use **Use this template** rather than forking
**Observed** (sample: README.md:21). Cloning it directly into a vault's plugin folder is offered as a
convenience so the built `main.js` lands where Obsidian looks **Observed** (sample: README.md:22).

**Never develop against your real vault** — one mistake can change or destroy notes **Contract**
(docs: en/Plugins/Getting started/Build a plugin.md:23). Create an empty vault, or use the bundled
`dev-vault.mjs`.

First run: install Node, `npm i`, then `npm run dev`, which compiles `src/main.ts` to `main.js` and
keeps watching **Observed** (sample: README.md:23-25). Enable the plugin in settings, and reload
Obsidian to pick up a new build **Observed** (sample: README.md:26-27).

What the template commits — and what it does not:

| Committed | Not committed |
|---|---|
| `manifest.json`, `versions.json`, `styles.css` | `main.js` — build output |
| `src/main.ts`, `src/settings.ts` | `node_modules/` |
| `package.json`, `package-lock.json`, `tsconfig.json` | `*.map` source maps |
| `esbuild.config.mjs`, `eslint.config.mts`, `version-bump.mjs` | `data.json` — plugin runtime data |
| `.npmrc`, `.editorconfig`, `.gitignore`, `README.md`, `AGENTS.md`, `LICENSE` | |
| `.github/workflows/lint.yml`, `.github/workflows/release.yml` | |

The exclusions are deliberate and documented in place: "Don't include the compiled main.js file in
the repo. They should be uploaded to GitHub releases instead" **Observed**
(sample: .gitignore:11-13), plus `*.map` and `data.json` **Observed**
(sample: .gitignore:16; sample: .gitignore:19). The agent guidance states it as a rule: never commit
`node_modules/`, `main.js`, or other generated files **Observed** (sample: AGENTS.md:62).

Source layout: split functionality across modules and keep `main.ts` focused on lifecycle — loading,
unloading, registering **Observed** (sample: AGENTS.md:44-45). The shipped template already does this,
with settings living in their own module **Observed** (sample: src/settings.ts:4-10).

House style in the template: tabs, width 4, UTF-8, LF, single quotes, final newline **Observed**
(sample: .editorconfig:4-11).

## Scaffold a theme

The theme template is cloned straight into the vault's themes folder, and the clone target is
quoted because the folder name matters **Contract** (docs: en/Themes/App themes/Build a theme.md:33).

Two rules that trip people up:

1. **The theme folder name must exactly match the manifest `name`** **Contract**
   (docs: en/Themes/App themes/Build a theme.md:55). This is an *install-time* rule about the folder
   inside a vault, not a rule about your repository's directory name.
2. **Restart Obsidian after any `manifest.json` change** **Contract**
   (docs: en/Themes/App themes/Build a theme.md:61; docs: en/Themes/App themes/Build a theme.md:65).
   CSS edits do not need a restart; manifest edits do.

The template ships `manifest.json`, `theme.css`, `versions.json`, `version-bump.mjs`,
`package.json`, and `README.md` (Observed). The released artifact is just two files: the manifest and
`theme.css`. There is no bundler and no build step — `theme.css` at the repository root is what
ships. Preprocessing (Sass, PostCSS) is possible, but then the *generated* `theme.css` must still be
committed and released, because nothing builds it downstream (Inference).

Scope discipline, the variable system, and the guideline rules belong to the themes-and-CSS
reference. This section covers only project shape.

## Manifest anatomy

Shared fields, required for **both** plugins and themes **Contract**
(docs: en/Reference/Manifest.md:13-16):

| Field | Type | Notes |
|---|---|---|
| `author` | string | The author's name |
| `minAppVersion` | string | Minimum required Obsidian version — a hard install gate |
| `name` | string | Display name; see [naming rules](#naming-rules) |
| `version` | string | Semantic Versioning, `x.y.z` only |

Shared optional fields: `authorUrl` and `fundingUrl` **Contract**
(docs: en/Reference/Manifest.md:17-18).

Plugin-only, all **required** **Contract** (docs: en/Reference/Manifest.md:26-28): `description`,
`id`, and `isDesktopOnly` (whether the plugin uses Node.js or Electron APIs). Themes have none of
these three — compare the plugin template's manifest **Observed** (sample: manifest.json:2-10) with
the theme template's **Observed** (theme: manifest.json:2-6).

`fundingUrl` may be a single URL string or an object mapping labels to URLs **Contract**
(docs: en/Reference/Manifest.md:49-68), and the plugin template ships one **Observed**
(sample: manifest.json:9). It exists only for financial-support services; remove it if you do not
take donations — that rule lives with the submission requirements.

**Typings conflict.** `PluginManifest` declares `dir?`, `id`, `name`, `author`, `version`,
`minAppVersion`, `description`, `authorUrl?`, and `isDesktopOnly?` **Contract**
(api: obsidian.d.ts:5094-5141) — but **not** `fundingUrl`, even though the API README documents it
**Contract** (api: README.md:27). Consequence: `this.manifest.fundingUrl` does not type-check. Read
the field from your own copy of the manifest, or widen the type locally.

Two `id` rules, both easy to get wrong:

- **Locally**, the `id` should match the plugin's folder name; otherwise some methods, such as
  `onExternalSettingsChange`, are never called **Contract** (docs: en/Reference/Manifest.md:31).
- **After release**, the `id` is stable API — never change it **Observed** (sample: AGENTS.md:76).
  The `id` must also be unique across all published plugins and cannot contain `obsidian`
  **Contract** (docs: en/Plugins/Releasing/Submit your plugin.md:53).

Charset: "The ID must contain only lowercase letters and hyphens, can't end with `plugin`, and can't
contain `obsidian`" **Contract** (docs: en/Reference/Manifest.md:27). Note the asymmetry — `plugin` is
banned only as a suffix, `obsidian` anywhere. The published directory does not match this rule —
uppercase, a dot, and underscores all occur in live ids **Observed**
(rel: community-plugins.json:185; rel: community-plugins.json:4301; rel: community-plugins.json:6926)
— because the rule binds new submissions while old ids are grandfathered. Apply it strictly to
anything unreleased; never "fix" a published id.

Description content rules (length, punctuation, capitalisation) are submission requirements and are
owned by the security-and-policies reference.

## Naming rules

`name` rules apply to **plugins and themes alike** **Contract**
(docs: en/Reference/Manifest.md:39-45):

- Short and descriptive.
- Prefer English, Basic Latin characters only. No punctuation except hyphens, plus sign, and
  parentheses; no emoji; no special characters.
- Do not reuse the name of an Obsidian core plugin or feature — "Live Preview" and "Bases" are given
  as unacceptable names on their own.
- Do not include "Obsidian", or variations like "Obsi-" and "-sidian".
- Every plugin and theme must have a unique name.
- No profanity or explicit language.
- **Themes may not contain the word "Theme", and plugins may not contain the word "Plugin".**

Mutability differs by artifact type **Contract** (docs: en/Reference/Manifest.md:37): theme names
**cannot** be changed after submission; plugin names can be changed by editing `manifest.json`, but
an invalid new name delists the plugin until it is fixed.

The October self-critique checklist softens the "Obsidian" rule to "unless it absolutely makes sense"
**Contract** (docs: en/Obsidian October plugin self-critique checklist.md:10). **Recommendation:**
follow the manifest reference — the checklist is advisory, and the manifest page is the schema.

## The build pipeline

The official pipeline is esbuild, driven by a single config file at the repository root.
The essentials, and why each matters:

| Setting | Value | Why |
|---|---|---|
| `entryPoints` | `['src/main.ts']` (sample: esbuild.config.mjs:17) | Source lives under `src/`, not the repository root |
| `bundle` | `true` (sample: esbuild.config.mjs:18) | Obsidian loads exactly one file |
| `format` | `'cjs'` (sample: esbuild.config.mjs:35) | Obsidian loads CommonJS |
| `target` | `'es2021'` (sample: esbuild.config.mjs:36) | Matches the TypeScript target |
| `outfile` | `'main.js'` (sample: esbuild.config.mjs:40) | Plugin root, not `dist/` |
| `sourcemap` | `prod ? false : 'inline'` (sample: esbuild.config.mjs:38) | Inline maps while developing, none shipped |
| `minify` | `prod` (sample: esbuild.config.mjs:41) | Smaller file loads faster at startup |
| `treeShaking` | `true` (sample: esbuild.config.mjs:39) | Drops unused code from dependencies |

Production mode is selected by a positional argument, `process.argv[2] === 'production'` **Observed**
(sample: esbuild.config.mjs:11). One `esbuild.context` serves both modes: production calls
`rebuild()` then exits, development calls `watch()` **Observed** (sample: esbuild.config.mjs:44-49).
Top-level `await` works because the package is an ES module **Observed** (sample: package.json:6).

A banner is injected into the output pointing readers at the repository, since production ships no
source map **Observed** (sample: esbuild.config.mjs:5-9; sample: esbuild.config.mjs:14-16). That
banner is also the most reliable way to recognise a built bundle when reviewing an installed plugin.

**Externals are the highest-leverage part of the config.** The list is `obsidian`, `electron`, eight
`@codemirror/*` packages, three `@lezer/*` packages, and `...builtinModules` **Observed**
(sample: esbuild.config.mjs:19-34), where `builtinModules` is imported from `node:module` so the
Node builtin list is derived at build time rather than hard-coded **Observed**
(sample: esbuild.config.mjs:3).

Why it matters: a second copy of `@codemirror/state` inside your bundle makes your extension
register successfully and then do nothing, with no error and no warning. That failure mechanism —
CodeMirror's object-identity model — and its diagnostic are owned by the editor-extensions
reference. The build-side rule is the one here: the typings pin those peers at `@codemirror/state`
6.7.0 and `@codemirror/view` 6.43.5 **Contract** (api: package.json:20-23); match them, and keep them
external.

## TypeScript configuration

Compiler options in the template **Observed** (sample: tsconfig.json:3-16): `inlineSourceMap`,
`inlineSources`, `module: ESNext`, `target: ES2021`, `strict`, `noImplicitReturns`,
`noFallthroughCasesInSwitch`, `noUncheckedIndexedAccess`, `moduleResolution: node`,
`isolatedModules`, `skipLibCheck`, `forceConsistentCasingInFileNames`,
`allowSyntheticDefaultImports`, and `lib: ["ES2021", "DOM"]`.

Two details worth noticing:

- `lib` is `ES2021` + `DOM` only, with **no Node types**, even though `@types/node` is installed
  **Observed** (sample: tsconfig.json:16; sample: package.json:17). That is the mobile-safe surface:
  reaching for `fs` or `process` fails at compile time unless you opt in deliberately (Inference).
- `include` is `["src/**/*.ts"]` **Observed** (sample: tsconfig.json:18), so the config files
  themselves are outside the program.

`tsc` is used purely as a type-checker: the build script runs `tsc -noEmit -skipLibCheck` before
esbuild **Observed** (sample: package.json:9). Consequence: the `inlineSourceMap` and `inlineSources`
options never affect the shipped bundle — esbuild's `sourcemap` setting is the only one that does
(Inference).

`strict: true` is also stated as a coding convention for plugins generally **Observed**
(sample: AGENTS.md:132), alongside "Bundle everything into `main.js` (no unbundled runtime deps)"
**Observed** (sample: AGENTS.md:136).

## Linting

The template uses ESLint flat config written in TypeScript, `eslint.config.mts` **Observed**
(sample: eslint.config.mts:1-5), with the first-party rule set `eslint-plugin-obsidianmd` declared
as a dev dependency **Observed** (sample: package.json:20).

Key positioning fact: `...obsidianmd.configs.recommended` is spread as the **last** element of the
config array **Observed** (sample: eslint.config.mts:31), so it wins over the local block. The local
block sets **no rules at all** — only ignores, globals, and parser options **Observed**
(sample: eslint.config.mts:5-32). If you need to disable an Obsidian rule, add your override *after*
that spread, not before.

Other details:

- `globalIgnores` covers `node_modules`, `dist`, the config and script `.mjs` files, `versions.json`,
  `main.js`, `package.json`, `package-lock.json`, and `tsconfig.json` **Observed**
  (sample: eslint.config.mts:6-16). **`manifest.json` is deliberately absent** — it is linted.
- Parser options enable type-aware linting and route `.json` through the parser via
  `extraFileExtensions: ['.json']`, with `allowDefaultProject` listing the config and the manifest
  **Observed** (sample: eslint.config.mts:22-28). That is how manifest rules can run at all.
- Globals are browser-only **Observed** (sample: eslint.config.mts:18-21) — consistent with the
  `lib` choice above.
- `jiti` is a dev dependency purely so ESLint can load the TypeScript config **Inference**
  (sample: package.json:22).

**Gap:** the rule bodies of `eslint-plugin-obsidianmd` are not part of any pinned source here, so no
individual rule id can be quoted. Treat "the plugin catches this" as unverified; the bundled
`plugin-lint.mjs` covers the rules that *are* traceable to pinned documentation.

## Scripts, version bumping, and tags

Scripts **Observed** (sample: package.json:8-11):

| Script | Command | Use |
|---|---|---|
| `dev` | `node esbuild.config.mjs` | Watch build with inline source maps |
| `build` | `tsc -noEmit -skipLibCheck && node esbuild.config.mjs production` | Type-check, then minified bundle |
| `version` | `node version-bump.mjs && git add manifest.json versions.json` | npm `version` lifecycle hook |
| `lint` | `eslint .` | Lint everything not globally ignored |

`version-bump.mjs` reads the target from `process.env.npm_package_version` **Observed**
(sample: version-bump.mjs:3), so it is only meaningful inside an npm lifecycle run, after npm has
already bumped `package.json`. It writes `manifest.version`, preserving tab indentation **Observed**
(sample: version-bump.mjs:6-9), then adds `versions[target] = minAppVersion` **only when the key is
absent** **Observed** (sample: version-bump.mjs:13-17) — re-running is idempotent.

It never touches `minAppVersion`. Bumping that is a manual edit you make **before** running
`npm version patch|minor|major` **Observed** (sample: README.md:38-39).

The theme template's script differs: it assigns `versions[target]` unconditionally, overwriting an
existing mapping **Observed** (theme: version-bump.mjs:24-26).

`.npmrc` contains exactly `tag-version-prefix=""` **Observed** (sample: .npmrc:1), so `npm version`
creates the tag `1.0.1`, not `v1.0.1`. That is not cosmetic: Obsidian looks for the release whose tag
equals the manifest `version` **Contract** (rel: README.md:24). Release mechanics beyond this belong to
the releasing reference.

## Continuous integration

The lint workflow runs on **every branch and every pull request** **Observed**
(sample: .github/workflows/lint.yml:3-7) across Node 20, 22, and 24 **Observed**
(sample: .github/workflows/lint.yml:15), executing `npm ci`, `npm run build --if-present`, and
`npm run lint` **Observed** (sample: .github/workflows/lint.yml:25-27). Because `build` type-checks and
bundles, CI enforces type-safety, bundleability, and lint on every push.

**Minor conflict, worth knowing:** the README states a Node floor of v18 **Observed**
(sample: README.md:51) and the agent guidance says "Node 18+ recommended" **Observed**
(sample: AGENTS.md:11), while CI tests only 20/22/24 and releases build on Node 24 **Observed**
(sample: .github/workflows/release.yml:21). **Recommendation:** develop on a version CI actually
exercises.

## Using a different bundler

esbuild is required *by this template*, not by Obsidian: "Alternative bundlers like Rollup or webpack
are acceptable for other projects if they bundle all external dependencies into `main.js`" **Observed**
(sample: AGENTS.md:13), and choosing different tools means replacing the build configuration
**Observed** (sample: AGENTS.md:16). The API README states the same requirement independently: a
plugin "Must bundle all external dependencies into this file, using Rollup, Webpack, or another
javascript bundler" **Contract** (api: README.md:35).

Whatever you use, reproduce these five properties (Recommendation):

1. A single CommonJS `main.js` at the plugin root.
2. `obsidian`, `electron`, every `@codemirror/*`/`@lezer/*` package, and all Node builtins external.
3. ES2021 output.
4. Minified, source-map-free production output.
5. A type-check step, since most bundlers strip types without checking them.

## Known gaps

- **Monorepos.** The submission flow reads one `manifest.json` at the repository default-branch HEAD
  **Contract** (docs: en/Plugins/Releasing/Submit your plugin.md:53), and nothing in the pinned sources
  describes a repository holding several plugins. Publishing several plugins from one repository is
  **undocumented**; do not present it as supported.
- **Test harness.** Neither template ships tests, and no pinned source prescribes a testing
  framework. Any testing advice here would be unsourced.
- **ESLint rule ids** — see [Linting](#linting).
- **Dependency versions** in the template drift with upstream and are not a contract; read them from
  the project in front of you rather than quoting them.
