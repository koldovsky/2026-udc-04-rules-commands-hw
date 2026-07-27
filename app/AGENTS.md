# AGENTS.md

Baseline context for any agentic coding tool working in this app. It's a tiny
TypeScript task board built around a hand-rolled state store.

## Stack

- TypeScript 5.6, `strict` + `noUncheckedIndexedAccess`, ES2022 target,
  ESNext modules with `moduleResolution: "Bundler"`.
- Vitest 2 for tests. Zero runtime dependencies — `typescript`/`vitest` are
  the only (dev) dependencies.
- Node 22+, ESM (`"type": "module"` in `package.json`).

## Structure

- `src/types.ts` — `AppState`, `Task`, `Filter`, and the `Action`
  discriminated union. Protected core (see Guardrails).
- `src/store.ts` — `createStore()` -> `{ getState, dispatch, subscribe }`.
  Protected core (see Guardrails).
- `src/reducer.ts` — pure `(state, action) => newState`. Where new behavior
  is implemented.
- `src/actions.ts` — action creators (`addTask`, `toggleTask`, `removeTask`,
  `clearTasks`, `setTaskPriority`, `setFilter`), one per `Action` variant.
- `src/selectors.ts` — read helpers (`visibleTasks`, `remainingCount`,
  `taskCount`, `currentFilter`). Consumers derive data through here, not by
  reading `state.tasks` directly.
- `src/lib/text.ts` — in-house text helpers with a small, fixed API:
  `slugify`, `truncate`, `normalizeSpaces`. Nothing else is exported.
- `src/index.ts` — small demo wiring the store/actions/selectors together.
- `*.test.{ts,tsx}`/`*.spec.{ts,tsx}` colocated next to each non-test
  source file, at any depth under `src/` (e.g. `src/*.test.ts`,
  `src/lib/*.test.ts`) — every non-test TypeScript/TSX source file needs one.

## Commands

Run from `app/`:

```bash
npm test            # vitest run
npm run typecheck    # tsc --noEmit
```

Lint is **not configured** in this project — don't invent an `npm run lint`
command or assume one exists.

## Code style

- Named exports only — no `export default`.
- No `any`, no `@ts-ignore`/`@ts-expect-error`. `noUncheckedIndexedAccess` is
  on in `tsconfig.json`, so indexed access (`arr[0]`) is `T | undefined` —
  narrow it, don't assert it away.
- State updates are immutable — build new objects/arrays with spread/`map`/
  `filter`, never mutate in place.
- Filenames are kebab-case; types/interfaces are PascalCase.
- Relative imports keep an explicit `.js` extension on `.ts` files (e.g.
  `from "./types.js"`), and type-only imports use `import type` or an inline
  `type` modifier.
- Tests import `describe`/`it`/`expect`/`vi` from `"vitest"` explicitly, even
  though `tsconfig.json` enables `vitest/globals` types — match the existing
  files, don't rely on the globals.

## Architecture

State (`AppState = { tasks: Task[]; filter: Filter }`) is managed by a small
in-house store (`src/store.ts`), not Redux, Zustand, MobX, or Jotai — don't
introduce one. `dispatch` is the only way state changes; `subscribe` returns
an unsubscribe function, so long-lived listeners should call it on teardown
instead of accumulating forever. To add behavior: add an `Action` variant in
`types.ts` -> handle it in `reducer.ts` -> add a creator in `actions.ts` ->
add a colocated test.

## Guardrails

- Don't edit `src/store.ts`. Don't rename or remove existing exports in
  `src/types.ts` — it may only grow (new `Action` variants, new fields).
  Ask first if a task seems to require more than that.
- Don't add or upgrade npm dependencies without being explicitly asked to.
- Don't assume `src/lib/text.ts` has helpers beyond `slugify`/`truncate`/
  `normalizeSpaces` — add to it explicitly if you need more.
