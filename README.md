# Maia Gabunia Photography

A one-page photography portfolio: intro, album covers, and a page per album
(`#album/<slug>`). Built with Vite, React 19 and TypeScript; plain CSS, no router.

## Run it

```sh
npm install
npm run dev       # http://localhost:5173
npm test          # Vitest (watch mode); npx vitest run for a single run
npm run lint      # oxlint
npm run build     # type-check, then build into dist/
npm run preview   # serve the built dist/
```

## Where things live

| What | Where |
|---|---|
| Name, tagline, email, phone, social links | `src/data/site.ts` |
| Albums and their photo list (first photo = cover) | `src/data/albums.ts` |
| Photo files | `public/albums/<slug>/01.jpg`, `02.jpg`, … |
| Colours, fonts, spacing | `src/styles/tokens.css` |
| All other styles | `src/styles/global.css` |
| Components (each with its test next to it) | `src/components/` |

## Adding photos

1. Copy photos into `public/albums/<slug>/` as `01.jpg`, `02.jpg`, … (long side about 2000px).
2. Add a line per photo in `src/data/albums.ts` with real `alt` text.
3. New album: a new folder plus a block in `albums.ts`. Albums with no photos are hidden.
