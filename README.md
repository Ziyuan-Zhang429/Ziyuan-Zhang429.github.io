# Ziyuan Zhang — personal website

Academic site for Ziyuan Zhang (PhD candidate in Epidemiology, UC Berkeley). Rebuild of [ziyuan-zhang429.github.io](https://ziyuan-zhang429.github.io/).

**Stack:** Vite, React 19, TypeScript, React Router, Tailwind CSS v4, [Untitled UI React](https://www.untitledui.com/react) on React Aria, `use-intl` for copy.
**Type:** Instrument Serif (headings), Geist (UI and body), Geist Mono (meta), self-hosted via Fontsource.
**Icons:** `@untitledui/icons` for interface controls, Phosphor duotone for subject-matter glyphs.

## Develop

```bash
npm install
npm run dev          # http://localhost:5173
npm run build        # type-check + production build into dist/ (pages are code-split; React, React Aria and i18n ship as separate cached chunks)
npm run lint         # Rules of React, including the React Compiler's checks (ESLint)
npm run lint:design  # lint DESIGN.md
npm test             # unit tests (Vitest): model, URL state, preset data, formatters
npm run test:coverage
npm run test:e2e     # browser tests (Playwright): simulator behaviour, URL sharing, layout stability, site navigation
```

## Where things live

| What                                                           | Where                                                                     |
| -------------------------------------------------------------- | ------------------------------------------------------------------------- |
| Design system rules and tokens                                 | [`DESIGN.md`](./DESIGN.md), `src/styles/theme.css`, `src/styles/site.css` |
| Live component reference                                       | `/design-system` (not linked in the nav)                                  |
| All copy (English)                                             | `src/i18n/messages/en.json`                                               |
| Content structure: projects, publications, education, teaching | `src/content/*.ts`                                                        |
| Base components                                                | `src/components/base/`                                                    |
| Page layout (header, footer, sections)                         | `src/components/layout/`                                                  |
| Page-specific composites                                       | `src/components/patterns/`                                                |
| Routes                                                         | `src/main.tsx`, pages in `src/pages/`                                     |
| CV PDF                                                         | `public/CV_Ziyuan_Zhang.pdf`                                              |

### Common edits

- **Add a publication:** append a record to `src/content/publications.ts`. Set `featured: true` to show it on the home page.
- **Add a project:** add an entry to `src/content/research.ts`, then its `title`, `organization` and `description` under `research.projects.<id>` in `en.json`. New tags go under `tags`.
- **Update a disease preset:** edit `src/content/epidemic-presets.ts` (target R₀, recovery and death infectious periods, fatality rate, contacts, and a source for each) and the matching `home.simulator.presets.details` text in `en.json`. Every number shown must have a source in `PRESET_SOURCES`.
- **Change any wording:** edit `en.json`. Keys are type-checked, so a typo fails the build.
- **Add a language later:** add `src/i18n/messages/<locale>.json` with the same keys, register it in `src/i18n/config.ts`, and choose the locale in `AppIntlProvider`.

### Simulator URLs

The epidemic simulator keeps its settings in the query string, so any setup can be shared, e.g.
`/?disease=custom&beta=0.5&recoveryDays=3&deathDays=2.5&ifr=0.05&contacts=6&cases=3&hubs=1&seed=12345&auto=0#simulation`.
Keys: `disease` (a preset id or `custom`), `population`, `cases`, `seed`, and for `custom` also `beta`, `recoveryDays`, `deathDays`, `ifr`, `contacts`; `hubs=1` turns on superspreaders, `auto=0` turns off auto run. Invalid values are ignored. The simulator's **Share** button copies such a link for the current setup. The schema lives in `src/hooks/use-simulation-url.ts`; the generic hook is `src/hooks/use-url-state.ts`.

## Conventions

- Files are kebab-case; React Aria imports are prefixed `Aria*` (Untitled UI convention).
- Module-level constants (content arrays, lookup tables, style maps, config) are `UPPER_SNAKE_CASE`. Files copied from Untitled UI (`base/buttons`, `base/badges`, `base/input`, `base/tooltip`, `base/toggle`) keep upstream naming so they can be re-synced.
- [React Compiler](https://react.dev/learn/react-compiler) memoizes components and hooks at build time, so don't add `useMemo`, `useCallback` or `memo` for speed. Keep them only where a value's identity matters (an effect dependency, or the simulator's network, whose replacement starts a fresh run). Code has to follow the Rules of React for the compiler to optimize it; `npm run lint` flags what it would skip.
- Components render; logic lives in hooks (`src/hooks/`) and plain utilities (`src/lib/`). Formatting helpers (citations, dates, search text) live in `src/utils/format/`; `src/content/` holds data and simple lookups only. The SIRD simulator is split into `lib/sird.ts` (model), `hooks/use-epidemic-simulation.ts` (state and actions) and `components/patterns/epidemic-simulator.tsx` (view).

## Deploy

`.github/workflows/deploy.yml` builds on every push and PR and publishes `main` to GitHub Pages (set **Settings → Pages → Source** to _GitHub Actions_). The build writes `research.html`, `publications.html`, etc. and a `404.html` alongside `index.html`, so clean URLs, old `*.html` links and deep links all load the app.
