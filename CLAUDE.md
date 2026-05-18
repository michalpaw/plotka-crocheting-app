# PlotkaCrocheting — Crochet Pattern Designer

## Stack
- Vue 3 + TypeScript + Ionic Vue + Capacitor
- Pinia (UI state), RxDB (local-first storage)
- pattern-core jako czysty TypeScript bez zależności UI
- SVG renderer dla canvas

## Zasady architektoniczne
- Local-first: aplikacja musi działać offline.
- Pattern model jest źródłem prawdy, nie canvas.
- pattern-core NIE importuje: Vue, Ionic, Pinia, RxDB, Capacitor, browser API.
- Validation i instruction generation NIE w komponentach Vue.
- Pinia tylko do orkiestracji UI state.
- Repository/service classes do persistence.

## Struktura repo
- `client/` — aplikacja Vue/Ionic (właściwy MVP)
- `backend/` — przyszły FastAPI (jeszcze nie implementujemy)
- `docs/` — dokumentacja architektoniczna

## Workflow gita
- Nigdy nie commituj bezpośrednio na `main`.
- Feature'y → branch `feature/<nazwa>`.
- Bugfixy → branch `fix/<nazwa>`.
- Eksperymenty → branch `spike/<nazwa>`.
- Po skończonej pracy: push branch i otwórz PR przez `gh pr create`.

## Komendy
- `npm run dev` — uruchom Vite dev server (client/)
- `npm run build` — produkcyjny build
- `npm run lint` — ESLint + Prettier check
- `npm run test` — Vitest unit testy

## Dokumenty referencyjne
- Architektura: `docs/ARCHITECTURE.md`
- Model domenowy: `docs/DOMAIN_MODEL.md`
- DSL wzorów: `docs/PATTERN_DSL.md`

## Czego nie robić
- Nie dodawaj zależności bez pytania.
- Nie zmieniaj konfiguracji Vite/TypeScript bez wyraźnej prośby.
- Nie commituj plików `.env` ani kluczy.
- Nie nadpisuj migracji bazy danych.