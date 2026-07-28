# AGENTS.md — app/

Baseline guidance for any Agentic IDE (Cursor, Claude Code, GitHub Copilot,
…) working inside this app. Mirrors `.cursor/rules/*.mdc` at the repo root;
those files carry the full "How to verify" detail per topic, this is the
single-file summary a tool without rule support can still read.

## Stack

TypeScript 5 (strict mode, `noUncheckedIndexedAccess` on), Node 22+ ESM
(`"type": "module"`), vitest 2. No UI framework and **zero runtime
dependencies** — `devDependencies` are exactly `typescript` and `vitest`.

## Structure

- `src/types.ts` — `AppState`, `Task`, `Action` discriminated union,
  `initialState`. **Protected core.**
- `src/store.ts` — `createStore()` → `{ getState, dispatch, subscribe }`.
  **Protected core.**
- `src/reducer.ts` — pure `(state, action) => newState`. Where new behavior
  is handled.
- `src/actions.ts` — action creators (`addTask`, `toggleTask`, `removeTask`,
  `setFilter`).
- `src/selectors.ts` — read helpers (`visibleTasks`, `remainingCount`).
- `src/lib/text.ts` — in-house text utils with a **fixed API**: `slugify`,
  `truncate`, `normalizeSpaces`. Nothing else exists here (no `capitalize`,
  `camelCase`, etc.).
- `src/*.test.ts`, `src/lib/*.test.ts` — colocated vitest tests.

## Commands

```bash
cd app
npm install
npm test           # vitest run
npm run typecheck  # tsc --noEmit
```

Lint is **not configured** in this sample — don't invent an `npm run lint`
command.

## Code style

- Named exports only — no `export default` anywhere in `src`.
- No `any`, no `@ts-ignore` (TypeScript strict, `noUncheckedIndexedAccess` is
  on).
- Immutable state updates — spread/`map`/`filter`, never mutate `state` or a
  `Task` in place.
- Files kebab-case; types/interfaces PascalCase.
- Tests colocated as `*.test.ts`, vitest, Arrange-Act-Assert style.

## Architecture

A minimal task board: a list of `Task { id, title, done }` plus a `filter`
(`"all" | "active" | "done"`). State is managed by a small **custom,
hand-rolled store** (`createStore`/`dispatch`/`subscribe`) — this is
deliberately **NOT Redux, Zustand, MobX, or Jotai**. Do not "modernize" it
into one of those.

**Golden path to add behavior:** add an `Action` variant in `types.ts` →
handle it in `reducer.ts` (immutably) → add an action creator in
`actions.ts` → add a colocated test. Reads go through `selectors.ts`, not
inline `state.tasks` filtering elsewhere.

## Guardrails

- Do not edit `src/store.ts`'s dispatch/notify engine, and do not remove or
  rename existing fields/`Action` variants in `src/types.ts`, without
  explicit approval. Additive changes to `types.ts` (a new `Action` variant,
  a new field) are normal feature work.
- No new npm dependencies (runtime or dev) without explicit approval — solve
  with the existing store, `lib/text.ts`, and the standard library.
- Don't invent methods on `lib/text.ts` beyond `slugify`/`truncate`/
  `normalizeSpaces`; add new ones explicitly, with a test, if genuinely
  needed.
- Keep `cd app && npm test` green.
