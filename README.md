# Crochet Pattern Designer

A local-first, cross-platform crochet pattern designer.

- Symbol-based pattern editor — place crochet symbols on a grid; each symbol
  is a structured operation, not just an icon.
- Color grid editor — pixel-style color charts for blankets, scarves, panels.
- Automatic written instructions, validation, and stitch counts.
- 2D preview rendered from the structured pattern model.
- Works offline on web, PWA, Android, iOS, and (via Electron) desktop.

## Stack

- Vue 3 + TypeScript + Vite
- Ionic Vue (cross-platform UI) + Capacitor (Android/iOS native runtime)
- Pinia (state)
- Local-first storage abstraction (`LocalCollection<T>`) — currently backed
  by `localStorage`; designed to be swapped for RxDB without touching stores.
- Pure-TypeScript `pattern-core` domain module (no UI / framework imports).
- SVG rendering for the symbol editor; 2D `<canvas>` for the color grid.
- Electron scaffold for desktop packaging.

## Architecture at a glance

```
src/
  pattern-core/      Pure TS — domain model, validation, instruction generator
  renderers/         SVG renderer + 2D preview service
  services/          Auth, storage, export, sync stubs
  stores/            Pinia stores (auth, project, editor, grid, symbols, settings)
  components/        UI building blocks (editor, grid, preview, project, common)
  views/             Page-level Ionic views
  app/router         Route definitions
  app/layouts        Auth + main layouts
  theme/             CSS variables + global styles
electron/            Desktop wrapper
public/              PWA manifest + icons
```

`pattern-core` must not import Vue, Ionic, Pinia, Capacitor, RxDB, or
browser APIs. It's the single source of truth for the pattern model.

## Run

```bash
npm install
npm run dev
# open http://localhost:5173
```

Production build:

```bash
npm run build
npm run preview
```

Mobile (after running `npm run build`):

```bash
npx cap add android   # or ios
npm run cap:sync
npm run cap:android
```

Desktop (Electron):

```bash
npm run electron:dev
```

## Status

MVP scaffold. Auth is local-only and accepts any email/password (no real
security). Cloud sync is stubbed — interfaces are in place behind
`services/sync/syncService.stub.ts` so the editor stays cloud-agnostic.

See `docs/DEVELOPMENT.md` and `docs/BUILD_AND_RUN.md` for more.
