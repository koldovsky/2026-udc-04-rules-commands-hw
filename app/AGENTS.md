# AGENTS.md

Baseline context for any AI coding tool working in this `app/` directory.
It's a tiny TypeScript "task board" with a custom state store, used as the target project for a rules/commands exercise.

## Structure

- `src/types.ts` — `AppState`, `Task`, `Filter`, and the `Action`
  discriminated union, plus `initialState`. **Protected core.**
- `src/store.ts` — `createStore()` returning `{ getState, dispatch,
  subscribe }`. The only sanctioned way state changes. **Protected core.**
- `src/reducer.ts` — pure `(state, action) => newState` reducer. This is
  where new domain behavior is implemented.
- `src/actions.ts` — action creators (`addTask`, `toggleTask`, `removeTask`,
  `clearCompleted`, `setTaskPriority`, `setFilter`). Callers build actions via
  these, not by hand.
- `src/selectors.ts` — pure read helpers (`visibleTasks`, `remainingCount`).
- `src/lib/text.ts` — in-house text helpers with a **fixed API**: `slugify`,
  `truncate`, `normalizeSpaces`. Nothing else exists in this module.
- `src/*.test.ts` — colocated vitest tests next to the code they cover.

## Commands

```bash
npm test            # vitest run — must stay green
npm run test:watch  # vitest in watch mode
npm run typecheck   # tsc --noEmit (strict mode, noUncheckedIndexedAccess)
```

Lint is **not configured** in this project — don't invent or assume an
`npm run lint` command.

## Code style

- Named exports only — no `export default`.
- No `any`, no `@ts-ignore`. TypeScript strict mode is on.
- Immutable state updates — spread/`map`/`filter` to produce new
  objects/arrays; never mutate `state`, `state.tasks`, or a `Task` in place.
- Files: kebab-case (e.g. `text-utils.ts`); types/interfaces: PascalCase.
- Tests are colocated `*.test.ts`, written with vitest, one behavior per test.

## Architecture

State is managed by a small **in-house store**, deliberately not Redux,
Zustand, MobX, or Jotai. The golden path to add behavior:

1. Add an `Action` variant to `src/types.ts`.
2. Handle it in `src/reducer.ts` (pure, immutable).
3. Add an action creator in `src/actions.ts`.
4. Add a colocated test.

State is only ever changed via `store.dispatch(action)` — never mutated
directly, and never routed through a state-management library.

## Guardrails

- Do not edit `src/store.ts` or `src/types.ts` (beyond additive `Action`
  variants) without explicit approval — they're the protected core everything
  else depends on.
- Do not add new npm dependencies without the user explicitly naming the
  package first.
- Do not assume `src/lib/text.ts` has helpers beyond `slugify`, `truncate`,
  `normalizeSpaces` — add new ones explicitly (with a test) instead of
  guessing.
- Keep `npm test` green; don't delete or weaken existing tests to make them
  pass.
