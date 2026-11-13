# photo-portfolio

## What this is
A photographer's portfolio site: one page (header, intro, album covers, footer).
Each album opens as its own view at `#album/<slug>` (hash routing via `src/hooks/useHash.ts`, no router).
Nika's **own** project and a learning project: parts marked `TODO(Nika)` are Nika's to write (`/tutor`).

## Commands (run from the repo root; Windows-safe)
- `npm run dev`: dev server on http://localhost:5173
- `npm test`: Vitest in watch mode. Use `npx vitest run` for a single run (Claude, CI, `!` commands).
- `npm run lint`: oxlint (`.oxlintrc.json`: react + typescript + oxc plugins)
- `npm run build`: type-check (`tsc -b`) then production build into `dist/`
- `npx tsc -b`: type-check only (strict mode)
- `npm run preview`: serve the built `dist/`

## Stack
Vite 8 + React 19, TypeScript 7 in strict mode (`.tsx`/`.ts`), plain CSS, no router, no state library.
Tests: Vitest 5 + React Testing Library + jest-dom (jsdom; setup in `src/test/setup.ts`).

## Conventions
- Components: `src/components/PascalCase.tsx`, one default export each, props typed with an `interface <Name>Props`, test next to it (`Header.test.tsx`).
  Keep the filename's case exact: Windows ignores case, Linux builds don't.
- Content and data live in `src/data/`: `site.ts` (name, tagline, email: change them in one place),
  `albums.ts` (albums and their photos; the first photo is the cover; exports the `Album`/`Photo` types). Components read from these
  and never hard-code copy.
- CSS: a single `src/styles/global.css` (imports `tokens.css`), BEM-style classes
  (`.gallery__grid`, `.site-header__links`). No inline `style={}`, no CSS-in-JS, no Tailwind.
- Semantic HTML first: `header`/`nav`/`main`/`section`/`footer`, real `<a href>` links;
  tests query by role (`getByRole('banner')`), not by class.
- Photos: `src`, real `alt`, `width`, `height`; the first row `eager`, the rest `loading="lazy"`.
- Keep render pure (lint flags `new Date()` and other impure calls inside a component).

## Design system
- `src/styles/tokens.css` is the **only** place for colours, fonts, the type scale and the
  space scale (`--space-*`, `--text-*`, `--color-*`). Light only (no dark mode, Nika's call 2026-11-13).
- Warm classic palette (Nika's call 2026-11-13, "cozy but classic"): linen page `#efe6d8`, espresso text
  and header/footer `#2b211c`. Space Grotesk (display) + Archivo (body) + Bodoni Moda (About name, logo MG),
  loaded in `index.html`.
- Shared helpers in `global.css`: `.container` (page width + gutter), `.visually-hidden`.
- Tap targets use `--tap-target` (44px). The first `EAGER_PHOTOS` photos (`albums.ts`) load eagerly.

## Done means
1. `npm run lint` clean, `npx vitest run` green, `npm run build` passes (it includes `tsc -b`).
2. UI changes: screenshots at **390 px and 1280 px** (also with a dark-mode device: it must still show light), with no sideways
   scroll (`scrollWidth === innerWidth`). Playwright isn't a project dep: use `playwright-core`
   from the scratchpad with `channel: 'msedge'`.

## Never
- Hard-code colours, spacing or font values: use or add a token in `tokens.css`.
  (Structural values like `1px` borders or an aspect ratio are fine.)
- Commit, push, deploy, or add an npm dependency without asking first.
- Write a `TODO(Nika)` part unless Nika says "watch" or "show me".

## Gotchas
- `!` commands run once and exit, so `! npm test` doesn't stay in watch mode. Watch mode
  needs Nika's own terminal.
- Photos live in `public/albums/<slug>/NN.jpg` (generated placeholders until Nika swaps in real ones).
  New album = new folder + a block in `albums.ts`. Empty albums are hidden.
- jsdom has no scrolling: `src/test/setup.ts` stubs `scrollTo`/`scrollIntoView`; spy on them to assert.
- Kill the dev server by port (5173), never by `taskkill /IM node.exe`.
