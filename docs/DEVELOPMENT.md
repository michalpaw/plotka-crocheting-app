# Development guide

## Layering rules

1. `pattern-core/` — pure TypeScript. No Vue/Ionic/Pinia/Capacitor/DOM imports.
2. `renderers/` — pure TypeScript renderers. May depend on `pattern-core/`.
3. `services/` — repositories, auth, export, sync. Talks to `pattern-core/`
   and platform APIs (localStorage, fetch, canvas). No Vue.
4. `stores/` — Pinia stores. Orchestrate services + domain. No DOM access.
5. `components/` and `views/` — Vue components. Read state via stores; never
   call repositories or `pattern-core/` mutators directly.

Breaking these rules will quickly turn the editor into a pile of mud.

## Adding a new symbol

1. Add the operation type (if new) in
   `pattern-core/symbols/symbolTypes.ts`.
2. Add a glyph in `pattern-core/symbols/crochetSymbols.ts` (just SVG paths).
3. Register a `SymbolDefinition` entry in
   `pattern-core/symbols/defaultSymbolLibrary.ts`.
4. If it produces stitches, add it to
   `pattern-core/model/stitch.ts`.

The palette/keyboard pick it up automatically — no UI changes required.

## Adding a new export format

Drop a service into `src/services/export/`. Use `downloadFile()` to push the
blob to the user. Don't bake export logic into Vue components — keep the
view layer thin.

## Cloud sync

`services/sync/syncService.stub.ts` defines the interface. When the FastAPI
backend is ready, swap the stub for a real implementation that calls
`/sync/push` and `/sync/pull`. The Pinia stores never reference cloud APIs
directly — they only see project documents — so no store code should need
to change.

## Local storage swap (RxDB)

`services/storage/localDatabase.ts` exposes a `LocalCollection<T>` interface
and a `getLocalDatabase()` factory. To switch to RxDB:

1. Install `rxdb` and `rxdb-quickstart` or the storage of your choice.
2. Implement `LocalCollection<T>` against an RxDB collection.
3. Replace the body of `getLocalDatabase()` with the RxDB-backed instance.

Repositories and stores keep working unchanged.

## Coding style

- Prefer composables/computed over imperative DOM mutation.
- Domain logic — validation, instruction generation, stitch counting —
  must live in `pattern-core/` so it remains testable and platform-agnostic.
- Don't import from `@/` inside `pattern-core/`. Anything `pattern-core/`
  needs has to be defined inside it.
