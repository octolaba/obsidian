# Themes and CSS

A theme is a variable-override sheet first and a selector sheet second. Everything here follows from
that: what ships, which selector a value belongs under, which variables exist, what the four review
rules actually say, and where Obsidian Publish inverts the advice.

## Contents

- [Evidence boundary](#evidence-boundary)
- [Theme anatomy](#theme-anatomy)
- [Scope discipline](#scope-discipline)
- [The CSS variable system](#the-css-variable-system)
- [The four theme guidelines](#the-four-theme-guidelines)
- [The October theme checklist](#the-october-theme-checklist)
- [Embedding fonts and images](#embedding-fonts-and-images)
- [CSS snippets](#css-snippets)
- [Publish themes](#publish-themes)
- [Style Settings](#style-settings)
- [The `legacy` flag](#the-legacy-flag)
- [Known gaps](#known-gaps)

## Evidence boundary

This reference leans on two weaker sources than the rest of the skill: the theme template, which is
**Observed** template material and not a rule, and the help pages, which describe user-facing
behaviour. `app.css` is not vendored, so every default value is read from documentation rather than
from the stylesheet that defines it, and **nothing here was observed rendering** — no theme was
loaded, and no selector was checked against a running app.

Citation aliases: `api`, `docs`, `sample`, `theme`, `rel`, `help` — defined in the skill's Sources
section.

## Theme anatomy

**What ships is two files.** A theme release carries `manifest.json` and `theme.css` as binary
attachments, and nothing else **Contract** (docs: en/Themes/App themes/Submit your theme.md:35-38).

**One CSS file, but only as the released artifact.** "All of your CSS needs to be inside the file
`theme.css` which is located at root of your repository" **Observed** (theme: README.md:25) — that
sentence exists only in the template's README; the developer docs never state a one-file rule
(**Gap**). For multi-file authoring, upstream's own answer is a preprocessor: "Consider breaking up
your theme into multiple files using a CSS preprocessor, such as Sass or Less" **Contract**
(docs: en/Themes/App themes/Embed fonts and images in your theme.md:52). Repository shape and the
commit-the-generated-file consequence belong to the project setup reference.

**The theme manifest has no `id`, no `description`, and no `isDesktopOnly`** — all three are listed
as plugin-specific properties **Contract** (docs: en/Reference/Manifest.md:20-28), and the template's
manifest holds exactly five keys: `name`, `version`, `minAppVersion`, `author`, `authorUrl`
**Observed** (theme: manifest.json:2-6). Consequence: **a theme's identity is its name plus its
repository**, with no stable machine identifier behind it. The full field table is owned by the
project setup reference.

That makes two naming facts load-bearing rather than cosmetic:

- **The name cannot change after submission.** "Theme names cannot be changed once the theme has
  been submitted to the community directory" **Contract** (docs: en/Reference/Manifest.md:37) —
  unlike a plugin name, which can be edited in the manifest.
- **Themes may not contain the word "Theme"** **Contract** (docs: en/Reference/Manifest.md:45). The
  rest of the naming rules are shared with plugins and are owned by the project setup reference.

**Folder name equals manifest name is an install rule, not a repository rule.** "The name of the
theme directory must exactly match the `name` property in `manifest.json`" **Contract**
(docs: en/Themes/App themes/Build a theme.md:55), stated as a step performed inside the vault's
`themes` directory **Contract** (docs: en/Themes/App themes/Build a theme.md:24-27). The tutorial
itself clones the repository into a directory chosen at clone time **Observed**
(docs: en/Themes/App themes/Build a theme.md:33), and nothing in the pinned sources constrains the
repository's own directory name (**Inference**). Do not report a repository whose folder differs
from the theme name as a defect.

**Manifest edits need a restart.** "Restart Obsidian to load the new changes to the manifest", and
again: "Remember to restart Obsidian whenever you make changes to `manifest.json`" **Contract**
(docs: en/Themes/App themes/Build a theme.md:61; docs: en/Themes/App themes/Build a theme.md:65).
CSS edits do not. The reload loop, and the conflict about when CSS changes need one, are owned by
the debugging reference.

**Nothing updates for the user.** "Themes don't update automatically" **Contract**
(help: en/Extending Obsidian/Themes.md:24). A bad release lives in installed vaults until each user
updates by hand, so treat every release as effectively permanent for part of your audience. Release
mechanics, screenshots, and `versions.json` for themes are owned by the releasing reference.

## Scope discipline

The canonical split is one sentence and one code block: "Override general variables under `body`,
and colors under `.theme-light` or `.theme-dark`" **Contract**
(docs: en/Themes/App themes/Theme guidelines.md:9), illustrated with `:root`, `body`, `.theme-light`,
and `.theme-dark` blocks **Contract** (docs: en/Themes/App themes/Theme guidelines.md:11-27).

| Selector | Put here | Evidence |
|---|---|---|
| `body` | Anything identical in light and dark | (docs: en/Themes/App themes/Build a theme.md:143-144) |
| `.theme-light` / `.theme-dark` | **Only** values that must change with the colour scheme | (docs: en/Themes/App themes/Build a theme.md:146) |
| `:root` | Sparingly — a small input-variable family is the documented example | (docs: en/Themes/App themes/Build a theme.md:113; docs: en/Themes/App themes/Build a theme.md:148) |

The `:root` rule is explicit: "It's also important to use `:root` with caution and consideration. If
your variable can be placed within `body`, `.theme-dark`, or `.theme-light` selectors instead, it is
recommended to do so" **Contract** (docs: en/Themes/App themes/Build a theme.md:148). Its documented
purpose is variables that must be "accessible by every child element within the theme", a selector
"often filled with Plugin variables" **Contract** (docs: en/Themes/App themes/Build a theme.md:113).

The official template follows the rule exactly: every variable override sits under `body`, and there
is no `:root` block at all **Observed** (theme: theme.css:1-11).

**Two things the user owns; do not take them.** The accent colour "can be overridden by the user
under Settings → Appearance" and is exposed as an HSL triplet **Contract**
(docs: en/Reference/CSS variables/Foundations/Colors.md:28) — hard-coding accent colours silently
disables that setting (**Inference**). And the black/white masks carry a direct warning: "Avoid
changing the value of black and white variables" **Contract**
(docs: en/Reference/CSS variables/Foundations/Colors.md:80-81).

## The CSS variable system

"Obsidian exposes more than 400 different CSS variables" **Contract**
(docs: en/Themes/App themes/Build a theme.md:152), organised into six documented groups:

| Group | Covers | Evidence |
|---|---|---|
| Foundations | "Abstracted variables for colors, spacing, typography and more" | (docs: en/Reference/CSS variables/CSS variables.md:1-3) |
| Components | "Interactive components used throughout the app" | (docs: en/Reference/CSS variables/CSS variables.md:14-16) |
| Editor | "Content types and variables used for editing and reading text files" | (docs: en/Reference/CSS variables/CSS variables.md:33-35) |
| Plugins | "Variables related to interface elements in core plugins" | (docs: en/Reference/CSS variables/CSS variables.md:53-55) |
| Window | "Variables related to the window chrome for the Obsidian app" | (docs: en/Reference/CSS variables/CSS variables.md:62-64) |
| Obsidian Publish | "Variables for Obsidian Publish sites" | (docs: en/Reference/CSS variables/CSS variables.md:73-75) |

**Navigate by folder, not by that index.** Seven reference pages exist in the tree but appear in no
index list **Observed**: Components → Dropdowns (docs: en/Reference/CSS variables/Components/Dropdowns.md:5)
and Prompt (docs: en/Reference/CSS variables/Components/Prompt.md:5); Editor → Bases
(docs: en/Reference/CSS variables/Editor/Bases.md:4); Plugins → Sync
(docs: en/Reference/CSS variables/Plugins/Sync.md:5); Window → Sidebar
(docs: en/Reference/CSS variables/Window/Sidebar.md:5) and Vault profile
(docs: en/Reference/CSS variables/Window/Vault profile.md:5); Publish → Site footer
(docs: en/Reference/CSS variables/Publish/Site footer.md:4). The index itself lists 8, 14, 15, 4, 6,
and 6 pages per group — 53 in all (docs: en/Reference/CSS variables/CSS variables.md:5-12; docs: en/Reference/CSS variables/CSS variables.md:18-31; docs: en/Reference/CSS variables/CSS variables.md:37-51; docs: en/Reference/CSS variables/CSS variables.md:57-60; docs: en/Reference/CSS variables/CSS variables.md:66-71; docs: en/Reference/CSS variables/CSS variables.md:77-82).
Reproduce inside the `docs` checkout — 63 files is 53 listed, plus the 7 above, plus the three index
pages (`CSS variables.md`, `About styling.md`, `Publish/Publish.md`):

```sh
find "en/Reference/CSS variables" -name '*.md' | wc -l   # 63 at this pin
```

An agent that follows only the index misses Bases, Sync, and the two Window components entirely.

**Every documented default value is documentation, not implementation.** `app.css` is not vendored
in any pinned source, so no "Default value" column in that reference can be checked against the app
(**Gap**); treat all of them as `basis: docs`. The documented way to read the real values is
DevTools: **Sources → Page → top → obsidian.md → app.css**, then search `"  --ribbon-"` with two
leading spaces so you match definitions rather than uses **Contract**
(docs: en/Themes/App themes/Build a theme.md:158-162), or pick an element and read
`background-color: var(--ribbon-background)` from the Styles pane **Contract**
(docs: en/Themes/App themes/Build a theme.md:166-169). The CLI's CSS-inspection command is owned by
the debugging reference.

**Naming conventions**, readable across the whole CSS-variables reference **Observed**:
`--<component>-<property>`;
state suffixes such as `-hover`, `-active`, `-focused`; a `-rgb` twin for every extended colour, "an
additional RGB variable with a `-rgb` suffix that you can use to create colors with opacity, using
the `rgba` function" **Contract** (docs: en/Reference/CSS variables/Foundations/Colors.md:43); and
`-s`/`-m`/`-l`/`-xl` size scales **Contract**
(docs: en/Reference/CSS variables/Foundations/Radiuses.md:9-12).

The foundations worth knowing before touching anything else:

- **Base ramp.** A neutral scale whose values "should typically only be defined by themes"
  **Contract** (docs: en/Reference/CSS variables/Foundations/Colors.md:9). Semantic colours are then
  "derived from the base color palette based on their intended use" **Contract**
  (docs: en/Reference/CSS variables/Foundations/Colors.md:85) — redefine the ramp and the rest
  follows, which is what makes variable-first theming cheap.
- **Typography.** Three theme-facing families, `--font-interface-theme`, `--font-text-theme`,
  `--font-monospace-theme` **Contract**
  (docs: en/Reference/CSS variables/Foundations/Typography.md:8-10), and a size rule: "Use `--font-*`
  (relative) variables in the editor. Use `--font-ui-*` (fixed) variables for UI elements"
  **Contract** (docs: en/Reference/CSS variables/Foundations/Typography.md:16-17).
- **Spacing.** A 4-pixel grid where "all elements should use the predefined `--size` CSS variables"
  **Contract** (docs: en/Reference/CSS variables/Foundations/Spacing.md:10-12); a finer 2-pixel set
  exists — "use these sparingly" **Contract**
  (docs: en/Reference/CSS variables/Foundations/Spacing.md:20).
- **Layers.** A published z-index ladder from `--layer-cover` to `--layer-dragged-item` **Contract**
  (docs: en/Reference/CSS variables/Foundations/Layers.md:9-18). Reuse it instead of inventing
  z-indexes **Recommendation**.

**One system, three consumers.** Plugins use the variables so their own elements stay
theme-compatible **Contract** (docs: en/Reference/CSS variables/About styling.md:5-15); themes and
snippets override the same variables **Contract**
(docs: en/Reference/CSS variables/About styling.md:17-33). A theme that styles by class instead of
by variable therefore also fails to reach plugin surfaces built on the variables (**Inference**).

**One inconsistency no theme can fully fix:** "Since Obsidian uses two different libraries for syntax
highlighting—one for Editing view and another for Reading view—styling may not match perfectly
between the two" **Contract** (docs: en/Reference/CSS variables/Editor/Code.md:18).

## The four theme guidelines

The whole guidelines page is 43 lines and contains exactly four rules. These are the review criteria
that exist for app themes.

1. **Use CSS variables.** "You can create highly expressive themes by merely overriding the built-in
   CSS variables" **Contract** (docs: en/Themes/App themes/Theme guidelines.md:7), with the selector
   split above.
2. **Use selectors with low specificity.** "Avoid overly complex selectors targeting specific
   classes" **Contract** (docs: en/Themes/App themes/Theme guidelines.md:31). The rationale is the
   important part: "The most common issues when maintaining a theme are due to broken selectors as a
   result of new versions of Obsidian, which may change class names and how elements are nested"
   **Contract** (docs: en/Themes/App themes/Theme guidelines.md:33). **Obsidian's DOM structure and
   class names are explicitly not a contract** — every class selector in a theme is a maintenance
   liability the author accepted.
3. **Keep assets local.** Community themes "must not load remote assets, such as fonts and images,
   that are unavailable when the user is offline. Even if the user has access to the internet,
   loading remote assets may violate user privacy" **Contract**
   (docs: en/Themes/App themes/Theme guidelines.md:37), and to be listed "your theme must not make
   network calls, and therefore all resources must be bundled into your theme" **Contract**
   (docs: en/Themes/App themes/Theme guidelines.md:39). The policy restates it as a flat ban:
   "Themes may not load assets from the network" **Contract** (docs: en/Developer policies.md:20).
4. **Avoid `!important` declarations.** "Declaring styles as `!important` prevents users from
   overriding styles from your theme using snippets" **Contract**
   (docs: en/Themes/App themes/Theme guidelines.md:43). That is the entire rationale, and it is
   exact: snippets are the user's override channel — "you can override parts of a theme using
   snippets" **Contract** (help: en/Getting started/Glossary.md:106) — so every `!important` removes
   a user's ability to adjust your theme without editing it. Note the wording is *avoid*, not
   *never*, and no exception list is given (**Gap**); a count of occurrences is a review signal, not
   a pass/fail threshold **Recommendation**.

**Documentation defect worth knowing:** the embedding guide links to
`[[Theme guidelines#Keep resources local]]` **Observed**
(docs: en/Themes/App themes/Embed fonts and images in your theme.md:4) while the heading is actually
"Keep assets local" **Observed** (docs: en/Themes/App themes/Theme guidelines.md:35) — a dead anchor
at this pin, not a missing rule.

## The October theme checklist

A separate self-critique checklist adds advisory items the guidelines page does not carry. It is
advisory: use it to review, not to fail a theme **Recommendation**.

- **`:has()` is a performance rule.** "Don't use `:has()` unless absolutely necessary. It causes
  performance issues especially in Canvas" **Contract**
  (docs: en/Obsidian October theme self-critique checklist.md:16). This is the only performance
  statement about app themes anywhere in the pinned sources.
- **Vertical margins in Live Preview.** "Don't change vertical margins in classes used in live
  preview editor, use padding instead" **Contract**
  (docs: en/Obsidian October theme self-critique checklist.md:11).
- **Experimental CSS features** must be flagged: "mention the minimal installer version required in
  the README" **Contract** (docs: en/Obsidian October theme self-critique checklist.md:12). The
  installer-versus-app-version distinction behind that is owned by the mobile and compatibility
  reference.
- The checklist restates the variable rule (docs: en/Obsidian October theme self-critique checklist.md:9),
  the `!important` rule (docs: en/Obsidian October theme self-critique checklist.md:10), and the
  local-assets rule (docs: en/Obsidian October theme self-critique checklist.md:17); its
  screenshot, README, and licence items are owned by the releasing reference.

## Embedding fonts and images

Assets go into the CSS as data URLs: `url("data:<MIME_TYPE>;base64,<BASE64_DATA>")` **Contract**
(docs: en/Themes/App themes/Embed fonts and images in your theme.md:8-13), with a worked
`background-image` example **Observed**
(docs: en/Themes/App themes/Embed fonts and images in your theme.md:21-25). The stated reason is the
same one behind the guideline: "For Obsidian to work offline and to preserve user privacy, themes
aren't allowed to load remote content over the network" **Contract**
(docs: en/Themes/App themes/Embed fonts and images in your theme.md:3-4).

Upstream names encoders for fonts and images **Observed**
(docs: en/Themes/App themes/Embed fonts and images in your theme.md:34-43); all are external,
unpinned web tools, so treat any claim about their behaviour as unverified.

**The cost is real and documented in three places it lands:** downloading and updating from the
directory, loading the theme in the app, and editing the file **Contract**
(docs: en/Themes/App themes/Embed fonts and images in your theme.md:46-52). **No size limit is
documented anywhere** (**Gap**) — so "the theme is too big" is never a citable finding, only an
observation.

**Why this rule matters more than the others:** loading remote resources is the most common recorded
reason for a theme being removed from the community directory **Observed**
(rel: community-css-themes-removed.json:4). The count and its reproduction command are in the
skill's conflicts section; do not restate them from memory.

**Conflict.** The Help site records an exception the developer docs do not: "We require bundling of
assets in CSS snippets and themes. However, we have made an exception for Google Fonts to maintain
performance on mobile devices, where the impact of bundling fonts is more noticeable" **Contract**
(help: en/Teams/Security considerations for teams.md:22), against the flat ban above
(docs: en/Developer policies.md:20; docs: en/Themes/App themes/Theme guidelines.md:39). Neither page
cross-references the other. **Recommendation:** for a community app theme, bundle everything — the
carve-out sits on a Teams security page, not on any developer page, and the delisting record follows
the ban.

Licensing of what you embed is governed by the developer policies' copyright rules, which are owned
by the security and policies reference; there is no font-specific licensing clause anywhere in the
pinned sources (**Gap**).

## CSS snippets

Snippets are the user's channel into the same variable system, and the fastest CSS loop that exists.

- **Location.** "Obsidian looks for CSS snippets inside the vault's configuration folder"
  **Contract** (help: en/Extending Obsidian/CSS snippets.md:14); the settings page names the path
  `/vault/.obsidian/snippets/` **Contract** (help: en/User interface/Settings.md:360). The config
  folder is user-overridable **Contract** (help: en/Files and folders/Configuration folder.md:14), so
  never hardcode `.obsidian` in tooling.
- **Enable, desktop.** Settings → Appearance → CSS snippets → **Open snippets folder**, create the
  `.css` file, **Reload snippets**, toggle it on **Contract**
  (help: en/Extending Obsidian/CSS snippets.md:18-24). On mobile the folder is created by hand in a
  file manager first **Contract** (help: en/Extending Obsidian/CSS snippets.md:26-35).
- **Load behaviour.** "Once enabled, Obsidian will automatically detect changes to CSS snippets and
  apply them when you save the file" **Contract**
  (help: en/Extending Obsidian/CSS snippets.md:41), with the caveat that you "might need to use the
  Command palette command to Reload Obsidian without saving to see changes in the current theme or
  note" **Contract** (help: en/Extending Obsidian/CSS snippets.md:43). A conflicting classification
  of CSS as reload-requiring, and the practical reload loop, are owned by the debugging reference.
- **Snippets stack; themes do not.** "Unlike themes, you can apply multiple snippets at the same
  time" **Contract** (help: en/Getting started/Glossary.md:85). The choice between shipping a snippet
  and shipping a theme is owned by the decision guides.
- **Per-note scoping** uses the `cssclasses` property: a snippet rule such as `.red-border img { … }`
  applies only in notes carrying that value **Contract**
  (help: en/Extending Obsidian/CSS snippets.md:65-82). Themes can key off the same classes.
- **Validate the CSS.** Upstream advises a validator "as invalid CSS will not work" **Contract**
  (help: en/Extending Obsidian/CSS snippets.md:84) — a single malformed rule can silently drop the
  rest of a block.

**Gap:** the cascade order between the active theme and enabled snippets, and among several enabled
snippets, is documented nowhere. "Override parts of a theme using snippets" implies snippets load
last, but that is inference, not contract.

## Publish themes

Everything in this section is Publish-only, and several rules are the **inverse** of the app rules.
Branch on context before applying any of them.

**Deliverable.** A single `publish.css` at the **vault root**, not in `.obsidian/themes` — "You need
to use a external editor to create this file, as Obsidian does not support editing CSS files" —
then publish it to take effect **Contract**
(docs: en/Themes/Obsidian Publish themes/Build a Publish theme.md:7-9). The publishable static assets
are `publish.css`, `publish.js`, and a favicon **Contract**
(help: en/Obsidian Publish/Customize your site.md:14-16); both scripts must sit in the root directory
`/` **Contract** (help: en/Obsidian Publish/Customize your site.md:22) and are hidden from the file
explorer but publishable from the **Publish changes** dialog **Contract**
(help: en/Obsidian Publish/Customize your site.md:23). There is no manifest, no release, and **no
submission process for Publish themes anywhere in the pinned sources** (**Gap**).

**Selector model.** App variables keep their app selectors; Publish-specific variables "are to be
inserted within the `.published-container` selector" **Contract**
(docs: en/Reference/CSS variables/Publish/Publish.md:3), as the worked example shows with
`.published-container`, `.theme-light`, and `.theme-dark` blocks side by side **Contract**
(docs: en/Themes/Obsidian Publish themes/Build a Publish theme.md:14-32). The two groups are named
explicitly: app variables "inherited from the Obsidian app theme" versus "Publish-specific variables"
**Contract** (docs: en/Themes/Obsidian Publish themes/About Obsidian Publish themes.md:25-28).

**Start from scratch.** "Most App themes are designed to target CSS classes that are not present in
the Publish context. For this reason, we recommend building Publish themes from the ground up"
**Contract** (docs: en/Themes/Obsidian Publish themes/Best practices for Publish themes.md:16).

**Inverted rules — the three that catch people:**

| Topic | App theme | Publish theme |
|---|---|---|
| Remote fonts | Banned (docs: en/Themes/App themes/Theme guidelines.md:39) | **Recommended** — "To load remote fonts we recommend using CSS with `@import` or defining your fonts with `@font-face` and an absolute URL" (docs: en/Reference/CSS variables/Publish/Site fonts.md:4) |
| Base64 embedding | Acceptable | "We recommend that you avoid this approach, especially if it leads to larger file sizes (multiple megabytes) that may block rendering" (docs: en/Themes/Obsidian Publish themes/Best practices for Publish themes.md:24) |
| Browser targets | "A narrow scope of rendering engines (recent versions of Chromium/Blink)" | Visitors "may use older browsers"; be conservative (docs: en/Themes/Obsidian Publish themes/Best practices for Publish themes.md:28) |

If you use `@import`, "`@import` must always be at the top of your publish.css file" **Contract**
(docs: en/Reference/CSS variables/Publish/Site fonts.md:9). App-level font variables are set on
`body` even in Publish **Contract** (docs: en/Reference/CSS variables/Publish/Site fonts.md:19),
while Publish-specific ones go on `.published-container` **Contract**
(docs: en/Reference/CSS variables/Publish/Site fonts.md:28).

**File size is a rendering concern, not just a download concern.** Publish CSS "loaded each time a
user vists the site", so keeping it small "will avoid flashes of unstyled content" **Contract**
(docs: en/Themes/Obsidian Publish themes/Best practices for Publish themes.md:20-22).

**Two breakpoints exist by default** — 1000px hides the right sidebar, 750px hides both sidebars and
moves navigation into a hamburger menu **Contract**
(docs: en/Themes/Obsidian Publish themes/Best practices for Publish themes.md:32-37) — targeted with
`@media screen and (min-width|max-width: …)`, and "any rules defined outside of the `@media` query
will apply to all devices" **Contract**
(docs: en/Themes/Obsidian Publish themes/Best practices for Publish themes.md:39).

**Site options can be off.** Readable line length, theme toggle, stacked notes, navigation, search,
backlinks, graph, and table of contents are all switchable **Contract**
(docs: en/Themes/Obsidian Publish themes/About Obsidian Publish themes.md:5-19), and when the
components that create a sidebar are off "the following variables have no effect" **Contract**
(docs: en/Reference/CSS variables/Publish/Site sidebars.md:4). Design for both states. The footer is
one variable: set `--footer-display` to `none` to hide "Powered by Obsidian Publish" **Contract**
(docs: en/Reference/CSS variables/Publish/Site footer.md:4).

**Reusing an app theme on Publish is a documented user path** — copy the theme's CSS out of
`.obsidian/themes`, put it at the vault root, rename it `publish.css`, publish **Contract**
(help: en/Obsidian Publish/Customize your site.md:46-54). Expect it to be partial, given the
class-targeting caveat above.

## Style Settings

**Unverified:** nothing in the pinned sources specifies the Style Settings plugin or its
`/* @settings */` convention — the only mention anywhere is the note that these settings "do not work
on Obsidian Publish" (help: en/Obsidian Publish/Customize your site.md:60), so this skill has no
operational rules for it.

## The `legacy` flag

Community theme entries carry `name`, `author`, `repo`, `screenshot`, `modes`, and an optional
`legacy` boolean **Observed** (rel: community-css-themes.json:2-9). At this pin 17 of 650 entries
set it **Observed** (rel: community-css-themes.json:8). Reproduce inside the `rel` checkout:

```sh
jq '{legacy: [.[]|select(.legacy)]|length, total: length}' community-css-themes.json
```

**Unverified:** the flag is documented in none of the pinned sources — not in the manifest
documentation, not in the theme guides, not in the help site — so its semantics cannot be
established from this pin.
The nearest dated anchor is that theme GitHub releases were "Introduced in v0.16 of Obsidian"
**Observed** (theme: README.md:42), which makes "predates release-based theme distribution" a
plausible reading (**Inference**), but nothing in evidence confirms it. Never treat the flag as an
install gate, a deprecation signal, or a review finding.

## Known gaps

Absent from every pinned source; do not fill these from memory.

- **Accessibility.** No contrast ratio, WCAG, or colour-blindness criterion exists for themes; it is
  not a documented review criterion at this pin.
- **App-theme performance budgets.** Beyond the `:has()` item above, there is no animation,
  transition, selector-count, or file-size budget.
- **Mobile.** Breakpoints are documented for Publish only; there is no mobile guidance for app
  themes.
- **Cascade order** between theme and snippets, and among snippets.
- **DOM and class-name stability** — explicitly disclaimed
  (docs: en/Themes/App themes/Theme guidelines.md:33).
- **Default values.** `app.css` is not vendored, so every documented default is `basis: docs`.
- **Publish theme distribution.** No manifest, versioning, or submission process is documented.
- **The `legacy` directory flag** — see above.
- **The automated review** that gates directory installs is never enumerated; what it checks in a
  theme is unknown.
- No live Obsidian or Publish run was performed for this reference. Nothing here has been observed
  rendering.
