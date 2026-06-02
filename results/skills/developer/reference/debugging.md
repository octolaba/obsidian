# Debugging and the development loop

How to reproduce a problem safely, how to get a change in front of your eyes fastest, and how to go
from a symptom to the one fact that explains it. This file owns the reload loop, the Obsidian CLI,
mobile testing, and the failure-signature catalogue.

## Contents

- [Evidence boundary](#evidence-boundary)
- [Rule zero: never the main vault](#rule-zero-never-the-main-vault)
- [Where plugins, themes, and snippets live](#where-plugins-themes-and-snippets-live)
- [The classic reload loop](#the-classic-reload-loop)
- [Theme and CSS reload](#theme-and-css-reload)
- [Hot-Reload (third party)](#hot-reload-third-party)
- [The Obsidian CLI](#the-obsidian-cli)
- [CLI gates](#cli-gates)
- [Per-OS registration failure modes](#per-os-registration-failure-modes)
- [Development command set](#development-command-set)
- [A scripted loop](#a-scripted-loop)
- [Testing on mobile](#testing-on-mobile)
- [Failure signatures](#failure-signatures)
- [`dev-vault.mjs`](#dev-vaultmjs)
- [Known gaps](#known-gaps)

## Evidence boundary

Every procedure here is transcribed from the pinned developer docs and help pages. **Nothing was
executed**: no Obsidian was launched, no CLI was registered, no plugin was reloaded, no device was
attached. Commands, flags, gates, and failure modes are documented contracts; whether they behave as
documented on your machine is **Unverified**. Where a step is this skill's own synthesis it is marked
**Recommendation** or **Inference**.

Citation aliases: `api`, `docs`, `sample`, `theme`, `rel`, `help` — defined in the skill's Sources
section. The Obsidian CLI page in `help` is the CLI's primary documentation, not user-facing colour.

## Rule zero: never the main vault

"When developing plugins, one mistake can lead to unintended changes to your vault. To prevent data
loss, **you should never develop plugins in your main vault**. Always use a separate vault dedicated
to plugin development" **Contract** (docs: en/Plugins/Getting started/Build a plugin.md:23). The same
warning is repeated in the Bases-view guide **Contract**
(docs: en/Plugins/Guides/Build a Bases view.md:27).

This is not hygiene advice. A plugin under development runs unsandboxed with the app's privileges and
can rewrite or delete notes; the security-and-policies reference covers why no sandbox exists. Create
an empty vault **Contract** (docs: en/Plugins/Getting started/Build a plugin.md:25), or use
[`dev-vault.mjs`](#dev-vaultmjs).

Turning on community plugins at all means leaving Restricted Mode: "By default, Obsidian runs in
Restricted Mode to prevent third-party code execution" **Contract**
(help: en/Extending Obsidian/Plugin security.md:8), turned off under
**Settings → Community plugins → Turn on community plugins** **Contract**
(help: en/Extending Obsidian/Plugin security.md:12-14). Installed plugins stay in the vault but are
ignored while Restricted Mode is on **Contract** (help: en/Extending Obsidian/Plugin security.md:22).

## Where plugins, themes, and snippets live

| Artifact | Location | Naming rule |
|---|---|---|
| Plugin | `<vault>/.obsidian/plugins/<plugin-id>/` (docs: en/Plugins/Getting started/Build a plugin.md:29; docs: en/Plugins/Getting started/Build a plugin.md:36-38) | Folder **must** match manifest `id`, or methods such as `onExternalSettingsChange` are never called (docs: en/Reference/Manifest.md:31; docs: en/Plugins/Getting started/Build a plugin.md:94) |
| Theme | `<vault>/.obsidian/themes/<Theme name>/` (docs: en/Themes/App themes/Build a theme.md:26-33) | Folder name "must exactly match the `name` property in `manifest.json`" (docs: en/Themes/App themes/Build a theme.md:55) |
| Snippet | A `snippets` folder inside the vault's configuration folder (help: en/Extending Obsidian/CSS snippets.md:14; help: en/Extending Obsidian/CSS snippets.md:29) | No manifest; enable under **Appearance → CSS snippets** (help: en/Extending Obsidian/CSS snippets.md:20-24) |

**The `.obsidian` nuance.** Every path above is written with the literal `.obsidian`, but the config
folder name is configurable: `Vault.configDir` is "typically `.obsidian` but it could be different",
`@since 0.11.1`, **stable at pin** (api: obsidian.d.ts:7344-7350), and the checklist forbids
hardcoding it in plugin code **Contract**
(docs: en/Obsidian October plugin self-critique checklist.md:22). Obsidian's own headless tooling
takes a `--config-dir` naming the "Config directory name (default: `.obsidian`)" **Contract**
(help: en/Obsidian Sync/Headless Sync.md:82). Consequence for debugging: when a user reports "the
plugin folder isn't there", ask for their config folder name before assuming a bug — and any tool you
write, including [`dev-vault.mjs`](#dev-vaultmjs), must take the name as a parameter.

Plugin runtime data lands in `data.json` inside the plugin folder (api: obsidian.d.ts:5049-5056),
which is why a whole-directory symlink from a source tree is the wrong way to install a dev build.

## The classic reload loop

Watch build once, then classify each change:

```text
npm run dev            keeps running, rebuilds main.js on every source change
  source change    →   reload the PLUGIN
  manifest change  →   RESTART the app
  CSS change       →   see "Theme and CSS reload"
```

- **Watch build.** `npm run dev` "keeps running in the terminal and rebuilds the plugin when you
  modify the source code"; the plugin directory then contains a compiled `main.js` **Contract**
  (docs: en/Plugins/Getting started/Build a plugin.md:68-74).
- **Enable it once.** **Settings → Community plugins → Turn on community plugins**, then toggle your
  plugin under **Installed plugins** **Contract**
  (docs: en/Plugins/Getting started/Build a plugin.md:80-83).
- **Source change → reload the plugin.** "you need to **reload your plugin after changing the source
  code**, either by disabling it then enabling it again in the community plugins panel, or using the
  command palette" **Contract** (docs: en/Plugins/Getting started/Build a plugin.md:125). The palette
  command is **"Reload app without saving"** **Contract**
  (docs: en/Plugins/Getting started/Build a plugin.md:121). The toggle-off/toggle-on route is spelled
  out step by step **Contract** (docs: en/Plugins/Getting started/Development workflow.md:5-11).
- **Manifest change → restart Obsidian.** "Restart Obsidian to load the new changes to the plugin
  manifest" and, in case it was missed, "Remember to restart Obsidian whenever you make changes to
  `manifest.json`" **Contract** (docs: en/Plugins/Getting started/Build a plugin.md:95;
  docs: en/Plugins/Getting started/Build a plugin.md:99).

**Why the asymmetry matters.** A plugin reload re-runs your `main.js`; it does not re-read the
manifest. So renaming the plugin, changing `minAppVersion`, or flipping `isDesktopOnly` looks like it
did nothing until you restart (**Inference** from the two contracts above). When a change "has no
effect", the first question is always: source or manifest?

Console access: "Toggle the Developer Tools by pressing Ctrl+Shift+I in Windows and Linux, or
Cmd-Option-I on macOS", then the Console tab **Contract**
(docs: en/Plugins/Getting started/Anatomy of a plugin.md:26-27).

## Theme and CSS reload

Three documented behaviours that do not agree, and you need all three:

1. **Snippets auto-apply.** "Once enabled, Obsidian will automatically detect changes to CSS snippets
   and apply them when you save the file" **Contract**
   (help: en/Extending Obsidian/CSS snippets.md:41).
2. **But the current theme may not.** The very next line: "You don't need to restart Obsidian for
   changes to take effect. However, you might need to use the Command palette command to **Reload
   Obsidian without saving** to see changes in the current theme or note" **Contract**
   (help: en/Extending Obsidian/CSS snippets.md:43).
3. **Sync classifies all CSS as reload-requiring.** Under "Reloading of settings", CSS changes —
   snippets and themes both — are listed under **"Requires reload"**, not hot-reloadable **Contract**
   (help: en/Obsidian Sync/Sync settings and selective syncing.md:147).

**Conflict, stated rather than resolved:** (1) says snippet edits apply on save; (3) says CSS changes
require a reload. Both are pinned upstream sentences and they describe different situations — a local
file save versus settings arriving over Sync — but neither page says so. **Recommendation:** develop
CSS as a snippet for the fast path, and when a change does not appear, run **Reload Obsidian without
saving** before believing your selector is wrong.

Theme manifest edits follow the plugin rule: "Restart Obsidian to load the new changes to the
manifest" and "Remember to restart Obsidian whenever you make changes to `manifest.json`"
**Contract** (docs: en/Themes/App themes/Build a theme.md:61;
docs: en/Themes/App themes/Build a theme.md:65).

## Hot-Reload (third party)

Upstream points at a community plugin: "Install the [Hot-Reload] plugin to automatically reload your
plugin while developing" **Contract** (docs: en/Plugins/Getting started/Build a plugin.md:128), and
"The Hot-Reload plugin reloads your plugin whenever the source code changes" **Contract**
(docs: en/Plugins/Getting started/Development workflow.md:17).

**Unverified.** That is the entirety of the pinned evidence. Its installation, its trigger file, its
behaviour with manifest changes, and its current maintenance status are **not** in any pinned source
here. Mention it as an option, never as a procedure, and never claim it removes the manifest-restart
rule.

## The Obsidian CLI

The CLI is a separate process that drives a **running** Obsidian: "Obsidian CLI is a command line
interface that lets you control Obsidian from your terminal for scripting, automation, and
integration with external tools" **Contract** (help: en/Extending Obsidian/Obsidian CLI.md:5). It
carries a developer command group explicitly aimed at automation: "These commands allow agentic
coding tools to automatically test and debug" **Contract**
(help: en/Extending Obsidian/Obsidian CLI.md:90).

It runs one-shot (`obsidian help`) or as a TUI (`obsidian`, then bare commands) **Contract**
(help: en/Extending Obsidian/Obsidian CLI.md:37-52). Parameters are `name=value`, flags are bare
words **Contract** (help: en/Extending Obsidian/Obsidian CLI.md:110-128). Vault targeting: the
current working directory wins if it is a vault, otherwise the active vault, and `vault=<name>`
overrides — "This must be the first parameter before your command" **Contract**
(help: en/Extending Obsidian/Obsidian CLI.md:139-141).

## CLI gates

All four must hold. Check them in this order before debugging anything else.

1. **The 1.12 installer.** "Using the CLI requires the Obsidian 1.12 installer" **Contract**
   (help: en/Extending Obsidian/Obsidian CLI.md:11-12). This is the *installer* version, not the app
   version — see the mobile-and-compat reference for why they differ.
2. **Installer 1.12.7 or above.** "Upgrade to the latest Obsidian installer version (1.12.7+)"
   **Contract** (help: en/Extending Obsidian/Obsidian CLI.md:16), restated in troubleshooting: "Make
   sure you are using the latest Obsidian installer version (1.12.7 or above)" **Contract**
   (help: en/Extending Obsidian/Obsidian CLI.md:1480).
3. **The setting, plus the registration prompt.** "Go to **Settings → General**. Enable **Command
   line interface**. Follow the prompt to register Obsidian CLI" **Contract**
   (help: en/Extending Obsidian/Obsidian CLI.md:20-22). Registration is a separate step from the
   toggle; skipping the prompt leaves you with a setting on and no binary on `PATH`.
4. **Obsidian must be running.** "Obsidian CLI requires the Obsidian app to be running. If Obsidian
   is not running, **the first command you run launches Obsidian**" **Contract**
   (help: en/Extending Obsidian/Obsidian CLI.md:30-31), and "The CLI connects to the running Obsidian
   instance" **Contract** (help: en/Extending Obsidian/Obsidian CLI.md:1483). Consequence for
   scripting: your first command may be slow and may have side effects, because it starts an app.

Two more from the troubleshooting list: after upgrading from an earlier version, "turn off the CLI
setting and turn it back on again, then allow Obsidian to perform the automatic PATH registration",
and "Restart your terminal after registering the CLI for the PATH changes to take effect"
**Contract** (help: en/Extending Obsidian/Obsidian CLI.md:1481-1482).

## Per-OS registration failure modes

Registration is where this actually breaks, and it breaks differently on each platform.

**macOS.** "The CLI registration creates a symlink at `/usr/local/bin/obsidian` pointing to the CLI
binary bundled inside the app. This requires administrator privileges — you will be prompted via a
system dialog" **Contract** (help: en/Extending Obsidian/Obsidian CLI.md:1495). Verify with
`ls -l /usr/local/bin/obsidian` **Contract** (help: en/Extending Obsidian/Obsidian CLI.md:1497-1501);
recreate it with
`sudo ln -sf /Applications/Obsidian.app/Contents/MacOS/obsidian-cli /usr/local/bin/obsidian`
**Contract** (help: en/Extending Obsidian/Obsidian CLI.md:1503-1507). If you registered under an
older Obsidian you may have "a leftover PATH entry in `~/.zprofile`"; the new registration removes it
automatically, and if it remains you can delete the lines starting with `# Added by Obsidian`
**Contract** (help: en/Extending Obsidian/Obsidian CLI.md:1509). A stale `~/.zprofile` entry pointing
at an old binary is the classic "wrong version answers" symptom.

**Windows.** The CLI "requires the Obsidian 1.12.7+ installer" **Contract**
(help: en/Extending Obsidian/Obsidian CLI.md:1487). It works through a redirector: "Windows uses a
terminal redirector that connects Obsidian to stdin/stdout properly … When you install Obsidian
1.12.7+ the `Obsidian.com` terminal redirector will be added in the folder where you installed the
`Obsidian.exe` file" **Contract** (help: en/Extending Obsidian/Obsidian CLI.md:1489). Registration
"adds Obsidian into your user's PATH variable, which … takes effect after you re-start the terminal"
**Contract** (help: en/Extending Obsidian/Obsidian CLI.md:1491). An installer older than 1.12.7 has
no `Obsidian.com`, so no amount of `PATH` editing helps.

**Linux.** "The CLI registration **copies** the CLI binary to `~/.local/bin/obsidian`. This is done
because some Linux installation methods run from temporary directories that cannot be symlinked
persistently" **Contract** (help: en/Extending Obsidian/Obsidian CLI.md:1513). Ensure `~/.local/bin`
is on `PATH`, adding `export PATH="$PATH:$HOME/.local/bin"` to `~/.bashrc` or `~/.zshrc` if not
**Contract** (help: en/Extending Obsidian/Obsidian CLI.md:1515-1518); verify with
`ls -l ~/.local/bin/obsidian` and copy the binary manually if missing **Contract**
(help: en/Extending Obsidian/Obsidian CLI.md:1521-1531). Because it is a **copy**, not a symlink, it
goes stale after an app update — re-register after upgrading (**Inference** from the copy semantics).

## Development command set

Everything below is documented on the CLI page. Parameters use `name=value`; bare words are flags.

| Command | What it does | Evidence |
|---|---|---|
| `devtools` | Toggle Electron dev tools | (help: en/Extending Obsidian/Obsidian CLI.md:1337-1339) |
| `dev:debug on\|off` | "Attach/detach Chrome DevTools Protocol debugger" | (help: en/Extending Obsidian/Obsidian CLI.md:1341-1348) |
| `dev:cdp method=<CDP.method> [params=<json>]` | "Run a Chrome DevTools Protocol command" | (help: en/Extending Obsidian/Obsidian CLI.md:1350-1357) |
| `dev:errors [clear]` | "Show captured JavaScript errors" | (help: en/Extending Obsidian/Obsidian CLI.md:1359-1365) |
| `dev:console [limit=<n>] [level=…] [clear]` | "Show captured console messages" (default limit 50) | (help: en/Extending Obsidian/Obsidian CLI.md:1375-1384) |
| `dev:dom selector=<css> [attr=] [css=] [total\|text\|inner\|all]` | "Query DOM elements" | (help: en/Extending Obsidian/Obsidian CLI.md:1395-1408) |
| `dev:css selector=<css> [prop=<name>]` | "Inspect CSS with source locations" | (help: en/Extending Obsidian/Obsidian CLI.md:1386-1393) |
| `dev:screenshot [path=<filename>]` | "Take a screenshot (returns base64 PNG)" | (help: en/Extending Obsidian/Obsidian CLI.md:1367-1373) |
| `dev:mobile on\|off` | "Toggle mobile emulation" | (help: en/Extending Obsidian/Obsidian CLI.md:1410-1417) |
| `eval code=<javascript>` | "Execute JavaScript and return result" | (help: en/Extending Obsidian/Obsidian CLI.md:1419-1425) |
| `plugin:reload id=<id>` | "Reload a plugin (for developers)" | (help: en/Extending Obsidian/Obsidian CLI.md:712-718) |
| `plugin:enable id=<id>` / `plugin:disable id=<id>` | Enable / disable a plugin | (help: en/Extending Obsidian/Obsidian CLI.md:676-683; help: en/Extending Obsidian/Obsidian CLI.md:685-692) |
| `plugin:install id=<id> [enable]` | "Install a community plugin" | (help: en/Extending Obsidian/Obsidian CLI.md:694-702) |
| `plugins:restrict on\|off` | "Toggle or check restricted mode" | (help: en/Extending Obsidian/Obsidian CLI.md:659-666) |
| `theme:set name=<name>` | "Set active theme" (empty for default) | (help: en/Extending Obsidian/Obsidian CLI.md:1140-1146) |
| `snippet:enable name=<n>` / `snippet:disable name=<n>` | Enable / disable a CSS snippet | (help: en/Extending Obsidian/Obsidian CLI.md:1174-1180; help: en/Extending Obsidian/Obsidian CLI.md:1182-1188) |
| `vault info=path` | Return the targeted vault's path only | (help: en/Extending Obsidian/Obsidian CLI.md:1208-1214) |
| `reload` / `restart` | "Reload the app window" / "Restart the app" | (help: en/Extending Obsidian/Obsidian CLI.md:187-193) |

**`dev:debug` is the one to reach for first when `console.log` is not enough.** It is the only
documented path to a real breakpoint debugger in the pinned material — the developer docs otherwise
describe console logging as the sole inspection technique
(docs: en/Plugins/Getting started/Anatomy of a plugin.md:22). It is also the framing for `dev:cdp`:
attach the protocol debugger, then drive it with individual CDP methods.

**`restart` versus `reload`.** `reload` reloads the window; `restart` restarts the app
(help: en/Extending Obsidian/Obsidian CLI.md:187-193). Given the manifest rule above, a manifest
change wants `restart`, a source change wants `plugin:reload` (**Recommendation**).

## A scripted loop

Once the gates hold, the whole loop is scriptable without touching the GUI (**Recommendation**;
every command is cited in the table above). First change into the **absolute path of the throwaway
vault** and run the read-only check below. The CLI otherwise falls back to the active vault, so do
not continue unless the printed path is the throwaway vault.

```shell
cd -- '/absolute/path/to/throwaway-dev-vault'
obsidian vault info=path
```

Only after the output matches:

```shell
obsidian plugins:restrict off            # leave Restricted Mode
obsidian plugin:enable id=my-plugin      # first time only
obsidian dev:errors clear                # clean slate
obsidian plugin:reload id=my-plugin      # after each source rebuild
obsidian dev:errors                      # did it throw?
obsidian dev:console limit=100 level=error
obsidian eval code="app.plugins.enabledPlugins.has('my-plugin')"
```

Two cautions. `eval` runs arbitrary JavaScript inside the app
(help: en/Extending Obsidian/Obsidian CLI.md:1419-1425) — the objects you reach that way, such as
`app.plugins`, are **not** declared in the typings and are not a supported API. **Observed:** the
`App` class body declares no plugin registry (api: obsidian.d.ts:406-482). Use them for
inspection, never in shipped code. And `plugins:restrict off` turns off a security control
(help: en/Extending Obsidian/Plugin security.md:8) — appropriate in a throwaway dev vault, nowhere
else.

For a theme or snippet loop, swap in `theme:set name="My Theme"` and
`snippet:enable name=my-snippet`, then `dev:css selector=… prop=…` to see which rule actually won.

## Testing on mobile

**Emulation from the console.** "Open the **Developer Tools** … Select the **Console** tab" and enter
`this.app.emulateMobile(true)`; `this.app.emulateMobile(false)` disables it, and
`this.app.emulateMobile(!this.app.isMobile)` toggles **Contract**
(docs: en/Plugins/Getting started/Mobile development.md:5-13;
docs: en/Plugins/Getting started/Mobile development.md:15-18;
docs: en/Plugins/Getting started/Mobile development.md:22-27).

**Label this precisely.** `emulateMobile` and `app.isMobile` are documented **only in docs prose** —
neither appears anywhere in `obsidian.d.ts` at this pin. **Observed:** zero occurrences in the
typings, and the `App` class body declares neither (api: obsidian.d.ts:406-482). So they are a
documented console affordance, not a typed API: they will not type-check, and nothing guarantees them
across versions. Never call `emulateMobile` from shipped plugin code.

**The CLI equivalent** is `dev:mobile on|off`, "Toggle mobile emulation" **Contract**
(help: en/Extending Obsidian/Obsidian CLI.md:1410-1417) — same effect, scriptable, and it does not
require you to have DevTools open.

**Emulation is not a device.** It changes UI mode; the runtime stays Electron, so Node and Electron
APIs still resolve and a mobile-only crash will not reproduce — **Inference**, from the UI-mode versus
runtime flag split in `Platform` (api: obsidian.d.ts:4824-4843). Emulation catches layout and
`Platform.isMobile` branches; only a device catches the Node-reach crash.

**On-device inspection.**

- **Android:** "enable USB Debugging in Developer settings of Android. Then go to a chromium based
  browser on your desktop/laptop and navigate to `chrome://inspect/`" **Contract**
  (docs: en/Plugins/Getting started/Mobile development.md:33).
- **iOS:** "You can inspect Obsidian on an iOS device running **16.4 or later** and a **macOS based
  computer**" **Contract** (docs: en/Plugins/Getting started/Mobile development.md:38). Both
  conditions, not either — no macOS means no iOS inspection at this pin.

What to *check* on mobile — Node reach, lookbehind, status bar, adapter casts — is the
mobile-and-compat reference; this section only covers how to look.

## Failure signatures

Symptom → the one fact that decides it → the fix. Each row is reproducible from the pin.

| Symptom | Decisive cause | Fix |
|---|---|---|
| Plugin never loads; the toggle flips itself off | No `main.js` beside `manifest.json` in the plugin folder — the build output is what Obsidian loads (docs: en/Plugins/Getting started/Build a plugin.md:74) — or the folder name does not equal the manifest `id` (docs: en/Reference/Manifest.md:31) | Run the watch build; rename the folder to the `id` (docs: en/Plugins/Getting started/Build a plugin.md:94), then **restart** |
| "Requires a newer version of Obsidian"; not installable | `minAppVersion` is above the user's app version — a hard install gate (docs: en/Reference/Versions.md:9) | Lower `minAppVersion`, or add a `versions.json` entry; it only ever offers an **older** plugin version (docs: en/Reference/Versions.md:35) |
| Command missing from the palette | `checkCallback` returned false/undefined — "causes the command to be hidden from the command palette" (api: obsidian.d.ts:1741-1745); or it is an editor command with no active editor (docs: en/Plugins/User interface/Commands.md:76); or a higher-precedence callback shadows yours: `editorCheckCallback` > `editorCallback` > `checkCallback` > `callback` (api: obsidian.d.ts:1776-1778; api: obsidian.d.ts:1795-1797) | Return `true` from the checking pass; declare only one callback kind |
| Command id or name appears doubled | "The command id and name will be automatically prefixed with this plugin's id and name" (api: obsidian.d.ts:4948-4951) | Drop your own prefix (docs: en/Obsidian October plugin self-critique checklist.md:11-12) |
| Settings changes vanish after reload | A `render` callback mutated settings — "Obsidian only saves automatically for `control` bindings" (docs: en/Plugins/User interface/Settings.md:740-741); or an overridden `setControlValue` "replaces the default write path, including the automatic `saveData()` call" (docs: en/Plugins/User interface/Settings.md:377) — declarative API, `@since 1.13.0`, insider-only at pin (docs: en/Plugins/User interface/Settings.md:8) | `await this.plugin.saveData(...)` in `render`; persist and return the promise in the override |
| `instanceof` is false for an element or event that clearly is one | A pop-out window has "fresh copies of all global constructors" (docs: en/Plugins/Guides/Support pop-out windows.md:10; docs: en/Plugins/Guides/Support pop-out windows.md:20-21) | `element.instanceOf(HTMLElement)` / `event.instanceOf(MouseEvent)`, and anchor DOM writes on `someElement.doc` (docs: en/Plugins/Guides/Support pop-out windows.md:37) |
| `leaf.view` is not my view class | Deferred views: since 1.7.2 all views start as a `DeferredView` (docs: en/Plugins/Guides/Defer views.md:6); `WorkspaceLeaf.isDeferred` confirms it (api: obsidian.d.ts:8288-8295) | `await workspace.revealLeaf(leaf)` then `instanceof` (docs: en/Plugins/Guides/Defer views.md:59); or `await leaf.loadIfDeferred()` sparingly (docs: en/Plugins/Guides/Defer views.md:77-78; docs: en/Plugins/Guides/Defer views.md:84-85) |
| CodeMirror 6 extension does nothing — no error, no warning | A second copy of `@codemirror/state` in your bundle; the official config keeps every `@codemirror/*` and `@lezer/*` package **external** (sample: esbuild.config.mjs:19-34), against peers pinned at 6.7.0 / 6.43.5 (api: package.json:20-23) | Add the externals; match the peer versions. **Inference** — facet identity is object identity |
| Extension will not reconfigure at runtime | A new array was passed instead of mutating the registered one, or `Workspace.updateOptions()` was never called — "an array should be passed in, and modified dynamically. Once this array is modified, calling `Workspace.updateOptions` will apply the changes" (api: obsidian.d.ts:5011-5019) | Mutate in place, then call `updateOptions()` once — it is "fairly expensive" (api: obsidian.d.ts:8053-8059) |
| `requestUrl` throws on a 404 you meant to handle | `RequestUrlParam.throw` "Defaults to true" for status 400+ (api: obsidian.d.ts:5456-5461) | Pass `throw: false` and branch on `response.status` (api: obsidian.d.ts:5464-5467) |
| `processFrontMatter` throws, or your edits are lost | It "@throws YAMLParseError if the YAML parsing fails" and the callback "mutates the frontmatter object **synchronously**" (api: obsidian.d.ts:2933-2954); **Inference:** an async callback's mutations therefore land after the write | Wrap in try/catch; keep the callback synchronous; mutate the object, do not return a new one |
| A file gets clobbered under concurrent edits | `read` + `modify` is not atomic; `Vault.process()` "guarantees that the file doesn't change between reading the current content and writing the updated content" (docs: en/Plugins/Vault.md:84) | Use `process`; for async work, `cachedRead` → async → `process`, comparing `data` against what `cachedRead` returned (docs: en/Plugins/Vault.md:88-94) |
| Icon renders nothing at all | Lucide support is capped: "Only icons up to v0.446.0 are supported at this time" (docs: en/Plugins/User interface/Icons.md:7), and `setIcon` "Does nothing if no icon associated with the iconId" — a silent no-op (api: obsidian.d.ts:5682-5689) | Pick an icon that existed at or before v0.446.0, or register your own with `addIcon` |
| Theme or snippet edits are not visible | Snippet saves auto-apply (help: en/Extending Obsidian/CSS snippets.md:41) but the current theme "might need … **Reload Obsidian without saving**" (help: en/Extending Obsidian/CSS snippets.md:43); Sync classifies CSS under "Requires reload" (help: en/Obsidian Sync/Sync settings and selective syncing.md:147) | Run **Reload Obsidian without saving** before suspecting the selector; use `dev:css` to see which rule won (help: en/Extending Obsidian/Obsidian CLI.md:1386-1393) |
| `manifest.json` edits appear ignored | A plugin reload does not re-read the manifest — "Remember to restart Obsidian whenever you make changes to `manifest.json`" (docs: en/Plugins/Getting started/Build a plugin.md:99); themes identical (docs: en/Themes/App themes/Build a theme.md:65) | Restart the app, or `restart` from the CLI (help: en/Extending Obsidian/Obsidian CLI.md:191-193) |
| Release exists on GitHub but Obsidian will not install it | Both official workflows create a **draft** (sample: .github/workflows/release.yml:47-50; docs: en/Plugins/Releasing/Release your plugin with GitHub Actions.md:37-40) and a draft must be published manually (docs: en/Plugins/Releasing/Release your plugin with GitHub Actions.md:69); or the tag does not equal the manifest `version` (docs: en/Plugins/Releasing/Submit your plugin.md:34; rel: README.md:24) — `tag-version-prefix=""` exists so `npm version` emits `1.0.1`, not `v1.0.1` (sample: .npmrc:1); or assets are missing, because the **documented** workflow uploads `styles.css` unconditionally and fails when the file is absent (docs: en/Plugins/Releasing/Release your plugin with GitHub Actions.md:40) while the sample guards it (sample: .github/workflows/release.yml:29-32) | Publish the draft; retag without a `v`; attach `main.js`, `manifest.json`, and optionally `styles.css` individually (docs: en/Plugins/Releasing/Submit your plugin.md:36-40) |
| Works on desktop, crashes only on mobile | Node or Electron reached by your code **or a dependency** (docs: en/Plugins/Getting started/Mobile development.md:68); regex lookbehind on iOS below 16.4 (docs: en/Plugins/Getting started/Mobile development.md:72); a status bar item, which is "Not available on mobile" (api: obsidian.d.ts:4939-4947) | Gate behind `Platform.isDesktopApp` with dynamic `require` (docs: en/Obsidian October plugin self-critique checklist.md:28); drop the lookbehind; move the status bar UI to a command |

**Empirical weight on the release row:** five entries in the removed-plugin list were delisted for
exactly this class of problem — missing files, a wrong release name, a missing release. The entries,
their reason strings, and the reproduction command are owned by the removal taxonomy in the
security-and-policies reference; release mechanics themselves belong to the releasing reference.

## `dev-vault.mjs`

The bundled [`dev-vault.mjs`](../scripts/dev-vault.mjs) exists to make [rule zero](#rule-zero-never-the-main-vault)
cheap — a throwaway vault in one command, with your artifact already in place and content that
exercises real surfaces.

```shell
node scripts/dev-vault.mjs <vault-dir> \
  (--plugin <dir> | --theme <dir> | --snippet <file>)... \
  [--copy | --link] [--config-dir NAME] [--refresh]
```

Contract:

- **Creates a fresh vault.** An existing **empty** directory is accepted; a non-empty one is refused
  with exit `2`. It never writes outside the new vault: the `id` and `name` it reads out of a target
  manifest must each be a single directory name, and every write is re-checked against the vault
  root, so a manifest carrying `..` is refused with exit `2` before anything is created.
- **Refresh is explicit and owned.** `--refresh` updates the listed installed files and its own
  Welcome/marker metadata only when the vault carries that marker. An arbitrary vault is refused. The
  seeded and user-created notes are not rewritten. Copy mode prints the exact refresh command to run
  after each rebuild; this closes the Windows copy-mode loop.
- **Several targets at once** — repeat `--plugin`, `--theme`, `--snippet` as needed.
- **Layout** is `<vault>/<config-dir>/plugins/<id>` (id read from the target manifest),
  `<config-dir>/themes/<Name>`, `<config-dir>/snippets/`. `--config-dir` defaults to `.obsidian`,
  matching the documented default (help: en/Obsidian Sync/Headless Sync.md:82).
- **Linking, per file.** `--link` is the default on macOS and Linux, `--copy` on Windows. Links are
  per **file**, never whole-directory, and the tool prints why: Obsidian writes `data.json` into the
  real vault folder (api: obsidian.d.ts:5049-5056), so a directory symlink would route plugin-written
  files back into your source tree.
- **Exit codes.** `2` — usage error or the target has no `manifest.json`. `3` — the target has a
  manifest but no built `main.js` / `theme.css`: build it first, or keep `npm run dev` running
  (docs: en/Plugins/Getting started/Build a plugin.md:68).
- **Seeded content** exercises frontmatter property types, wikilinks including one unresolved, an
  embed, tasks, headings, a fenced code block, an RTL note, a subfolder note with an attachment, a
  long note, and a schema-valid `.canvas` file.
- **A Welcome note** carries the enable steps, a shell-quoted CLI block that first changes into this
  exact vault, and the reload-versus-restart asymmetry — the same rules where you need them.
- **It never writes Obsidian configuration JSON** into the config folder. Those files have no documented
  schema in any pinned source, so the tool prints the manual steps instead of guessing.

## Known gaps

- **Nothing here was executed.** No app launch, no CLI registration, no reload, no device attach. All
  of it is documented contract; treat first-run behaviour as unverified.
- **No test framework.** No pinned source prescribes one, and neither official template ships tests —
  so there is no unit or integration testing procedure to give. Debugging here is manual plus CLI.
- **Hot-Reload** is two sentences of upstream evidence and nothing more; see above.
- **CDP methods.** `dev:cdp` takes any Chrome DevTools Protocol method
  (help: en/Extending Obsidian/Obsidian CLI.md:1350-1357), but no pinned source lists which ones
  Obsidian supports.
- **`emulateMobile` semantics** beyond "toggles mobile emulation" are undocumented, and the function
  is absent from the typings entirely.
- **CLI on mobile.** The page never states whether the CLI exists on mobile platforms at all; assume
  desktop only and say so (**Unverified**).
- **Startup profiling** has one instrument and no thresholds — see the performance reference.
