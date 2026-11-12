---
version: alpha
name: ZZ
description: "Design system for Ziyuan Zhang's academic website: Untitled UI React on React Aria, warm paper neutrals, one cornflower-blue brand, an editorial serif for headings."
colors:
  primary: "#3B6BC0"
  primary-hover: "#3259A2"
  on-primary: "#FFFFFF"
  primary-container: "#EDF2FC"
  on-primary-container: "#3259A2"
  page: "#FAF9F6"
  surface: "#FFFFFF"
  surface-muted: "#F4F2ED"
  on-surface: "#1C1A17"
  on-surface-secondary: "#44403A"
  on-surface-variant: "#57524B"
  on-surface-muted: "#787269"
  outline: "#E7E4DD"
  inverse-surface: "#1A2744"
  on-inverse-surface: "#FFFFFF"
  tooltip: "#0F0E0C"
  infected: "#E9573B"
  recovered: "#0B6B5A"
  susceptible: "#B8B3AA"
  died: "#9B5FD0"
  page-dark: "#0F0E0C"
  surface-dark: "#181714"
  surface-muted-dark: "#1C1A17"
  on-surface-dark: "#FAF9F6"
  on-surface-variant-dark: "#A6A096"
typography:
  display:
    fontFamily: "Instrument Serif"
    fontSize: 96px
    fontWeight: 400
    lineHeight: 0.95
    letterSpacing: -0.02em
  page-title:
    fontFamily: "Instrument Serif"
    fontSize: 72px
    fontWeight: 400
    lineHeight: 1.05
    letterSpacing: -0.01em
  section-title:
    fontFamily: "Instrument Serif"
    fontSize: 36px
    fontWeight: 400
    lineHeight: 1.25
  stat:
    fontFamily: "Instrument Serif"
    fontSize: 36px
    fontWeight: 400
    lineHeight: 1
  title:
    fontFamily: "Geist"
    fontSize: 18px
    fontWeight: 600
    lineHeight: 1.375
  subtitle:
    fontFamily: "Geist"
    fontSize: 16px
    fontWeight: 600
    lineHeight: 1.375
  body-lg:
    fontFamily: "Geist"
    fontSize: 18px
    fontWeight: 400
    lineHeight: 28px
  body:
    fontFamily: "Geist"
    fontSize: 16px
    fontWeight: 400
    lineHeight: 24px
  body-sm:
    fontFamily: "Geist"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 20px
  label:
    fontFamily: "Geist"
    fontSize: 14px
    fontWeight: 600
    lineHeight: 20px
  caption:
    fontFamily: "Geist"
    fontSize: 12px
    fontWeight: 500
    lineHeight: 18px
  meta:
    fontFamily: "Geist Mono"
    fontSize: 12px
    fontWeight: 400
    lineHeight: 16px
    letterSpacing: 0.08em
rounded:
  xs: 2px
  sm: 6px
  lg: 8px
  xl: 12px
  2xl: 16px
  3xl: 24px
  portrait: 28px
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 20px
  2xl: 24px
  3xl: 32px
  4xl: 40px
  5xl: 48px
  6xl: 64px
  7xl: 80px
  gutter: 20px
  gutter-md: 32px
  header-height: 64px
  section-rail: 208px
  container: 1152px
components:
  page:
    backgroundColor: "{colors.page}"
    textColor: "{colors.on-surface-variant}"
    typography: "{typography.body}"
  page-dark:
    backgroundColor: "{colors.page-dark}"
    textColor: "{colors.on-surface-variant-dark}"
    typography: "{typography.body}"
  card-dark:
    backgroundColor: "{colors.surface-dark}"
    textColor: "{colors.on-surface-dark}"
    rounded: "{rounded.2xl}"
    padding: 24px
  nav-pill:
    backgroundColor: "{colors.surface-muted}"
    textColor: "{colors.on-surface-variant}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.full}"
  nav-pill-dark:
    backgroundColor: "{colors.surface-muted-dark}"
    textColor: "{colors.on-surface-variant-dark}"
  divider:
    backgroundColor: "{colors.outline}"
    height: 1px
  sir-susceptible:
    backgroundColor: "{colors.susceptible}"
    rounded: "{rounded.full}"
    size: 8px
  sir-infected:
    backgroundColor: "{colors.infected}"
    rounded: "{rounded.full}"
    size: 8px
  sir-recovered:
    backgroundColor: "{colors.recovered}"
    rounded: "{rounded.full}"
    size: 8px
  sir-died:
    textColor: "{colors.died}"
    size: 8px
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label}"
    rounded: "{rounded.lg}"
    height: 40px
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
    textColor: "{colors.on-primary}"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface-secondary}"
    typography: "{typography.label}"
    rounded: "{rounded.lg}"
    height: 40px
  button-secondary-hover:
    backgroundColor: "{colors.page}"
    textColor: "{colors.on-surface}"
  button-tertiary:
    textColor: "{colors.on-surface-variant}"
    typography: "{typography.label}"
    rounded: "{rounded.lg}"
    height: 40px
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.2xl}"
    padding: 24px
  chip:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface-secondary}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.full}"
    height: 32px
  chip-selected:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
  tag:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface-secondary}"
    typography: "{typography.caption}"
    rounded: "{rounded.sm}"
  highlight-badge:
    backgroundColor: "{colors.primary-container}"
    textColor: "{colors.on-primary-container}"
    typography: "{typography.caption}"
    rounded: "{rounded.full}"
  icon-tile:
    backgroundColor: "{colors.primary-container}"
    textColor: "{colors.primary}"
    rounded: "{rounded.xl}"
    size: 44px
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body}"
    rounded: "{rounded.lg}"
    height: 40px
  overline:
    textColor: "{colors.on-surface-muted}"
    typography: "{typography.meta}"
  tooltip:
    backgroundColor: "{colors.tooltip}"
    textColor: "{colors.on-inverse-surface}"
    typography: "{typography.caption}"
    rounded: "{rounded.lg}"
  cta-banner:
    backgroundColor: "{colors.inverse-surface}"
    textColor: "{colors.on-inverse-surface}"
    rounded: "{rounded.3xl}"
    padding: 48px
---

# ZZ design system

This file follows the [DESIGN.md format](https://github.com/google-labs-code/design.md/blob/main/docs/spec.md). The CSS in `src/styles/theme.css` (Untitled UI tokens, re-tuned) and `src/styles/site.css` (site tokens) is the source of truth for every value here; update both together. Lint with `npm run lint:design`. A live reference of every base component renders at `/design-system` (not linked from the navigation).

## Overview

ZZ is the system behind a personal academic site for an infectious disease epidemiologist. It should read like a well-set journal page that happens to be interactive: warm paper background, generous whitespace, an editorial serif (Instrument Serif) for names and headings, and a clean grotesque (Geist) for everything you read or click. One brand color, a clear cornflower blue (brand-600 `#3B6BC0`, tuned from `#4073C7` for 5:1 contrast with white text), marks actions and selection. The signature motif is an interactive stochastic SIR epidemic on a random contact network (`EpidemicSimulator`); its three compartment colors belong to that figure alone.

Components are Untitled UI React (copied into `src/components/base/`) on React Aria, styled with Tailwind v4 semantic utilities. Site-specific base components extend the same conventions: `sortCx` style maps, `size` and `color` variants, `cx` for class merging, kebab-case files.

## Using this system

- Style with semantic utilities (`bg-surface`, `bg-page`, `text-primary`, `text-tertiary`, `ring-secondary`, `bg-brand-solid`), never raw hex or ad-hoc ramp steps. Tailwind exposes `--color-*` tokens as utilities, so `--color-surface` becomes `bg-surface`.
- Dark mode is the `.dark-mode` class on `<html>`, set before first paint by the inline script in `index.html` and toggled by `ThemeToggle`. Site tokens (`page`, `surface`, `surface-muted`, `sir-*`) have dark values in `site.css`; Untitled tokens have theirs in `theme.css`. The `*-dark` colors in the front matter document the dark values of the main roles.
- Build pages from layout primitives (`PageHeader`, `Section`, `Container`) and base components before writing new markup. If a pattern repeats on two pages, promote it to `src/components/patterns/`.

## Content and copy

- Every user-facing string lives in `src/i18n/messages/en.json` and is read with `use-intl` (`useTranslations`, `useFormatter`). Components never hard-code copy. Keys are typed against the English catalog (`src/i18n/types.d.ts`), so a missing key fails `tsc`.
- Content structure (ids, dates, links, ordering) lives in `src/content/*.ts` and points at message keys by id. Bibliographic records (paper titles, author lists, venues, talk titles, award names) are reproduced as published and stay in `src/content/publications.ts`; they are not translated.
- Dates are stored as `YYYY` or `YYYY-MM` and formatted with `usePeriod()` (locale-aware ranges, UTC). People lists go through `usePeople()` so the conjunction follows the locale. Counts use ICU plurals.
- Voice: first person in the bio, plain and specific elsewhere. Buttons are verbs ("View research", "Download CV", "Copy citation"). Empty states say what is missing and offer the next step. No exclamation marks, no emoji.

## Colors

The palette is two ramps and a handful of roles.

Full 25–950 ramps live in `src/styles/theme.css` (`--color-brand-*`, `--color-neutral-*`); the front matter lists only the roles components use.

- **Cornflower (brand, 25–950).** `primary` (brand-600) fills primary buttons and selected chips; `primary-hover` (brand-700) is the hover step and the brand text color (`text-brand-secondary`). `primary-container` (brand-50) tints icon tiles and highlight badges. `inverse-surface` (brand-950) is the closing call-to-action panel.
- **Paper (neutral, 25–950).** Warm grays replace Tailwind's cool neutral everywhere. `page` (neutral-50) is the canvas, `surface` (white) raises cards above it, `surface-muted` (neutral-100) fills wells such as the nav pill and tag counts.
- **Text.** `on-surface` for headings and titles, `on-surface-secondary` for emphasized body, `on-surface-variant` (`text-tertiary`) for body copy, `on-surface-muted` (`text-quaternary`, 4.5:1 on `page`) only for meta labels and supporting lines.
- **Lines.** `outline` (`ring-secondary`, `border-secondary`) separates cards and sections; neutral-300 (`ring-primary`) is the hover state of interactive cards. The focus ring is brand-500 (`outline-focus-ring`).
- **SIRD.** `susceptible` gray `#B8B3AA`, `infected` red `#E9573B`, `recovered` green `#0B6B5A`, `died` violet `#9B5FD0` (dark mode `#67635C` / `#E14B39` / `#2AA884` / `#8C76C9`). Red and green are separated by lightness as well as hue, and the violet sits between the dark green and the red so recovered and died never read as the same dark line, and the four-colour set passes the dataviz palette validator's protanopia/deuteranopia check (worst pair ΔE 8.5 light, 6.7 dark). Gray deliberately fails the chroma check because it is the de-emphasized resting state. Identity never relies on colour alone: deaths are drawn as ✕ marks, infected nodes are enlarged, the infected line is painted on top, and the legend and direct end labels name every series. Susceptible nodes at rest use a 75% tint (`sir-s-muted`). Never reuse these colours for UI state, errors or links.

## Typography

- **Instrument Serif** (400, roman and italic) carries identity: the hero name (`display`), page titles (`page-title`), section titles (`section-title`), stats, and the italic field line under the name. Never set it below 24px or in bold.
- **Geist** (variable) carries reading and interaction: `title` for card and list titles, `body`/`body-lg` for prose, `body-sm` for supporting text, `label` for buttons.
- **Geist Mono** is the `meta` voice: dates, venues, indices, captions, citation details. Use it uppercase with 0.08em tracking through the `Overline` component; DOIs and volume/page strings stay in their published case.
- Use the `Heading` component (`display`, `page`, `section`, `title`, `subtitle`) rather than repeating type classes. Pass `as` to keep the outline correct. Responsive steps: `display` 56px → 72px → 96px, `page-title` 44px → 72px, `section-title` 30px → 36px.

## Layout

- Content sits in a 1152px container (`max-w-6xl`) with 20px gutters on mobile and 32px from `md`.
- The sticky header is 64px tall. Anchor targets clear it with `scroll-padding-top`.
- Pages open with a `PageHeader` (eyebrow, title, description, optional controls), then a stack of `Section`s. On large screens a section is two columns: a 208px sticky rail holding the title, and the content. On smaller screens the title stacks above.
- Sections are separated by a hairline top border and 48–64px of vertical padding. Within a section, cards stack with 16px gaps; list rows are divided by hairlines with 24–28px padding.
- Reading width stays near 70 characters: bios and descriptions cap at `max-w-2xl`.

## Elevation & Depth

Surfaces separate by a 1px inset ring (`ring-1 ring-secondary`), not by shadow. Shadows are reserved for things that float or respond: the sticky header's blur, interactive cards on hover (`shadow-md`), the portrait (`shadow-xl`), the location chip, tooltips and buttons' skeuomorphic inner edge from Untitled UI. Never stack more than one shadow level on a surface.

## Shapes

Radii grow with the size of the surface: 2px on inline focus targets, 6px on tags, 8px on buttons and inputs, 12px on icon tiles, 16px on cards, 24px on the CTA panel, 28px on the portrait. Chips, highlight badges, status badges and the nav pill are fully rounded. The logo tile is 8px on a 32px square.

## Components

All base components accept `className` and merge it with `cx`; prefer variants over overrides. The front matter's `components` entries record resting and hover colors.

**States.** Hover moves one step: neutral surfaces to `page`, brand fills to `primary-hover`, card rings from neutral-200 to neutral-300. Focus is `outline-2 outline-offset-2 outline-focus-ring`, keyboard-only via React Aria's `focus-visible`. Selected chips fill with `primary`. Disabled uses `opacity-50` and `cursor-not-allowed`.

**Motion.** Controls transition in 100ms linear. Page headers and the hero fade up once (`animate-fade-up`, 600ms). The simulator ticks every 240ms per simulated day and only runs while visible; under `prefers-reduced-motion` it waits for the visitor to press Play. The decorative network loops with CSS and shows a static snapshot under reduced motion, as does every other animation.

| Component | Path | Use |
|---|---|---|
| `Button` | `base/buttons/button.tsx` | Untitled UI. Primary, secondary, tertiary and link colors; `href` renders a router-aware link. One primary per view. |
| `ButtonUtility` | `base/buttons/button-utility.tsx` | Untitled UI. Icon-only action with a built-in tooltip that doubles as its accessible name. |
| `Badge` | `base/badges/badges.tsx` | Untitled UI badge shapes and colors used by `Tag`, `StatusBadge` and `HighlightBadge`. Badges carry no dot. |
| `Input` | `base/input/input.tsx` | Untitled UI text field with leading icon and shortcut hint. |
| `Tooltip` | `base/tooltip/tooltip.tsx` | Untitled UI. Dark label on hover or focus. |
| `Heading`, `Overline` | `base/heading/heading.tsx` | Type scale as components. `Overline` is the mono meta label, with `brand` tone and optional leading rule. |
| `Card`, `CardLink` | `base/card/card.tsx` | Raised surface with hairline ring; `CardLink` makes the whole card a link with hover lift. |
| `Tag`, `TagList`, `StatusBadge`, `HighlightBadge` | `base/tag/tag.tsx` | Keyword labels; affiliation status pills without dots (primary brand, active success, alumnus purple, prior gray; the word always carries the meaning); emphasis such as "First author". |
| `ChipGroup`, `Chip` | `base/chip-group/chip-group.tsx` | Single-select filters on a React Aria toggle-button group, with optional counts. Sync the value to the URL when the filter is shareable. |
| `CopyButton` | `base/copy-button/copy-button.tsx` | Copy-to-clipboard with tooltip and a polite live-region announcement. |
| `TextLink` | `base/text-link/text-link.tsx` | Inline link. External links open in a new tab, show an up-right arrow and announce it; internal "go to" links can show a right arrow. |
| `IconTile` | `base/icon-tile/icon-tile.tsx` | Phosphor duotone glyph on a tinted tile (`brand` or `gray`, `sm`/`md`/`lg`). Decorative. |
| `Toggle` | `base/toggle/toggle.tsx` | Untitled UI switch with label. Pair a setting that needs explanation with an `InfoTooltip`. |
| `InfoTooltip` | `base/info-tooltip/info-tooltip.tsx` | (i) icon beside a label that opens a titled tooltip on hover, keyboard focus or tap. Use it for extra context and citations; cite sources by their reference number, since tooltips can't hold links. |
| `Slider`, `SliderGroup` | `base/slider/slider.tsx` | Untitled UI slider, compacted: label and live value on one row, 6px track, 18px handle (the surface colour outlined in the fill colour, the same in light and dark mode); the value slot reserves the widest value so labels never re-wrap. `layout="inline"` puts label, track and value on one row, and `SliderGroup` stacks inline sliders under one heading for a setting split in parts (the infectious period by outcome), each with a `color` and legend `labelIcon`. Format values with `formatOptions` (percent, `unit: "day"`) so they localize. |
| `Timeline` | `base/timeline/timeline.tsx` | Hairline rail with ring markers; `current` fills the marker. Education, talks. |
| `EmptyState` | `base/empty-state/empty-state.tsx` | Dashed panel with icon tile, message and one recovery action. |
| `Container`, `PageHeader`, `Section` | `layout/` | Page scaffolding described under Layout. |
| `SiteHeader`, `SiteFooter`, `ThemeToggle` | `layout/` | Sticky blurred header with pill navigation and mobile disclosure menu; footer with secondary navigation. |
| `LogoMark` | `foundations/logo/logo-mark.tsx` | A Z traced as a tiny contact network on a brand tile: four people, three white links, the index case solid and the rest rings (as the simulator marks initial infected). `public/favicon.svg` draws the same geometry. Always beside the name in text. |
| `EpidemicSimulator` | `patterns/epidemic-simulator.tsx` | The home figure (view only). State and actions come from `useEpidemicSimulation` (`hooks/use-epidemic-simulation.ts`); the Reed–Frost SIRD model (each infection's outcome is decided when it starts, with the fatality rate, and it stays infectious for that outcome's own period, so diseases that kill quickly spread less from fatal cases), superspreader hubs, R₀ estimate, R₀→β inversion and deterministic SIRD live in `lib/sird.ts`. Every network has the same population (250 people) on every screen, preset and toggle; node spacing and dot size adapt so all of them fit the box. A visible five-digit seed decides the people, their contacts and who starts infected ("New network" re-rolls it); transmission luck is fresh on every run. Two phases: **setup** (day 0, paused), where presets, sliders, the superspreader toggle and clicking people shape the run, and **running**, which only Play starts. During setup, clicking a person adds or removes them as an initial infected (ink ring and label) and keeps the "Initial infected" slider in step; the slider itself takes the first *k* people in the seeded order, so dragging never re-draws them. Sliders ignore repeat values. Reset returns to day 0 with the same initial infected and new luck. The infectious period is set per outcome (recovers / dies, 1–30 days in tenths); presets other than Ebola have no outcome-specific estimate and say so. The share who die runs 0–90%. A Deaths readout sits beside Day and R₀. Disease presets (`content/epidemic-presets.ts`; `hidden` ones such as influenza B stay in the data but not the UI) set R₀, infectious period, fatality rate and contacts from published values, each with a numbered citation: COVID-19 ancestral (Liu 2020; He 2020; COVID-19 Forecasting Team 2022), Omicron (Liu & Rocklöv 2022; Boucau 2022; Liu, IJID 2022), influenza A and B (Biggerstaff 2014 / Thompson 2022; CDC; CDC 2023–24 burden), measles (Guerra 2017; CDC; CDC), mpox (Zhang 2024; CDC; WHO situation report 12), Ebola (WHO Ebola Response Team 2014; WHO fact sheet), the one preset where deaths dominate. A **Population** column (COVID-19 and influenza only) sets everyone's age — All ages, Infants, Adults, Middle-aged, Elderly (default) — and with it the fatality rate: COVID-19 from Levin et al. 2020 (age 25, 55, 75) and the COVID-19 Forecasting Team 2022 (age 1), scaled by Omicron's 79% reduction; influenza from CDC's 2023–24 age table (deaths per symptomatic illness). For diseases without age data the column's content is hidden but keeps its space. Disease presets, population and superspreaders each have an `InfoTooltip` with more detail and citations. Run controls: Play/Pause, Reset, New network (its tooltip shows the five-digit seed), **Share** (copies a link to the exact setup, or opens the system share sheet on touch devices) and an **Auto run** toggle, on by default, that starts another run on a freshly seeded network a moment after each one ends. Settings persist in the URL through `useSimulationUrl` (built on the generic `useUrlState` hook, `hooks/use-url-state.ts`): `disease`, `population`, `cases`, `seed`, plus `beta`, `recoveryDays`, `deathDays`, `ifr`, `contacts` for Custom, `hubs=1` and `auto=0` when set. Nothing is written on a plain visit; a shared link opens paused on its exact setup (the same seed draws the same network at the same canvas size). `/#simulation` is a page anchor that lines the network up under the header. The card is one two-column grid (presets and chart left; population and parameters right) so the column border is continuous. The reference list sits in a disclosure at the bottom of the card. The superspreader toggle adds 2–4 clusters, each centred on a haloed hub linked to 6–10 people. Every changing value has a reserved slot, so no interaction moves the layout. Pauses off screen; never autoplays under reduced motion. |
| `EpidemicChart` | `patterns/epidemic-chart.tsx` | Simulated S/I/R/D lines (2px, infected painted last) over the deterministic well-mixed SIRD with the same R₀ and fatality rate as light dashed lines; recessive hairline grid; direct end labels in ink with line keys; crosshair tooltip listing simulation and theory values on pointer and arrow keys. Drawn at true pixel size so labels stay legible on phones. |
| `TransmissionNetwork` | `shared-assets/transmission-network.tsx` | Decorative, CSS-animated version for backgrounds (CTA panel, 404). Never more than one per view. |

## Do's and Don'ts

- Do keep one primary button per view and pair it with secondary or tertiary actions.
- Do put every new string in the message catalog and reference it by key.
- Do keep the simulator's guarantees under test: `npm test` covers the model, URL codecs and preset data; `npm run test:e2e` checks that no control moves the layout.
- Do keep module-level constants in `UPPER_SNAKE_CASE`, and keep logic out of components (hooks in `src/hooks/`, model utilities in `src/lib/`, formatting helpers in `src/utils/format/`).
- Do use the serif only for identity and headings; keep titles, labels and body in Geist.
- Do pair status color with a word; never rely on hue alone.
- Do give every icon-only control an accessible name (the `tooltip` prop on `ButtonUtility` does this).
- Do mark external links with `TextLink` so the new-tab behavior is announced.
- Don't use the SIRD colours for anything but the epidemic figures.
- Don't add shadows to resting cards; use the ring.
- Don't use `text-quaternary` for body copy; it is for meta labels only.
- Don't override a component's size or color per call site with `className`; add or fix a variant.
- Don't use emoji as icons.

## Iconography

Two sets with separate jobs:

- **`@untitledui/icons`** for interface affordances: arrows, download, mail, copy, menu, close, theme. 24px grid, 2px stroke line icons, sized `size-4`/`size-5`, colored by the control (`text-fg-quaternary` at rest).
- **`@phosphor-icons/react`, duotone weight** for subject matter: virus, DNA, brain, chats, graph, envelope, file. Only inside `IconTile` (or `EmptyState`), so the duotone fill always sits on a tint. Import the `*Icon` names (`VirusIcon`), which tree-shake.

Decorative icons are `aria-hidden`; the adjacent text carries the meaning.
