# Build & run

## Prerequisites

- Node.js 18+
- npm 9+
- For Android: Android Studio + JDK 17
- For iOS: Xcode on macOS
- For desktop builds: nothing extra (Electron pulled in via npm)

## Web / PWA

```bash
npm install
npm run dev                # http://localhost:5173
npm run build              # outputs dist/
npm run preview            # serves dist/ at :4173
```

The PWA manifest is in `public/manifest.json`. Service worker registration
is intentionally not part of MVP — add `vite-plugin-pwa` when you want
real offline caching of the app shell.

## Android / iOS via Capacitor

```bash
npm run build
npx cap add android        # or: npx cap add ios
npm run cap:sync           # copies dist/ into the native project
npm run cap:android        # opens Android Studio
npm run cap:ios            # opens Xcode (macOS only)
```

`capacitor.config.ts` sets:

- appId: `com.plotka.crochetdesigner`
- webDir: `dist`

## Desktop (Electron)

```bash
npm run build
npm run electron:start
```

Or, for a one-shot dev loop:

```bash
npm run electron:dev
```

For installer-style desktop builds, configure `electron-builder` in
`package.json` (placeholder script `electron:build` is already wired up).

## TypeScript / sanity check

```bash
npm run typecheck
```
