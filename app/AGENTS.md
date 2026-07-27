# AGENTS.md

Baseline context for any AI coding tool (Cursor, Claude Code, Copilot, …)
working in this app. See `../materials/architecture-brief.md` for the full
design rationale.

## Structure

- `src/types.ts` — `AppState`, `Task`, `Filter`, `Action` (discriminated
  union), `initialState`. **Protected core.**
- `src/store.ts` — `createStore()` returning `{ getState, dispatch,
  subscribe }`. Custom, minimal store. **Protected core.**
- `src/reducer.ts` — pure `(state, action) => newState`. Where the domain
  grows: add cases here for new `Action` variants.
- `src/actions.ts` — action creators (`addTask`, `toggleTask`, `removeTask`,
  `setFilter`, `setPriority`). The only sanctioned way to build action
  objects. Every `Action` variant in `src/types.ts` has exactly one matching
  creator here.
- `src/selectors.ts` — pure read helpers (`visibleTasks`, `remainingCount`).
  UI reads state through these, not `state.tasks` directly.
- `src/lib/text.ts` — in-house text utilities with a fixed API: `slugify`,
  `truncate`, `normalizeSpaces`. Nothing else exists in this lib.
- `src/*.test.ts` — colocated vitest tests, next to the code they cover.

## Commands

```bash
cd app
npm test            # vitest run
npm run typecheck    # tsc --noEmit
```

Lint is **not configured**.

## Code style

- Named exports only — no default exports.
- No `any`, no `@ts-ignore` / `@ts-expect-error` (TypeScript strict mode,
  `noUncheckedIndexedAccess` is on).
- Immutable state updates only — spread/`map`/`filter`, never mutate `state`
  or its nested arrays/objects in place.
- Files: kebab-case (e.g. `lib/text.ts`). Types/interfaces: PascalCase.
- Local imports use explicit `.js` extensions (e.g. `from "./types.js"`),
  matching the existing code.

## Architecture

State is managed by a small custom store — **not** Redux, Zustand, MobX, or
Jotai, and it should not be replaced by one. The only way state changes is
`store.dispatch(action)`, which runs the pure `reducer` and notifies
subscribers.

The golden path to add new behavior:

1. Add a variant to the `Action` union in `src/types.ts`.
2. Handle it in `src/reducer.ts` (immutably).
3. Add a matching action creator in `src/actions.ts`.
4. Add a colocated `*.test.ts` covering it.

## Guardrails

- Do not edit `src/store.ts` or change existing fields/variants in
  `src/types.ts` without explicit approval — these are the protected core.
- Do not change the public signatures of existing action creators
  (`src/actions.ts`) or existing functions in `src/lib/text.ts` — only add
  new ones.
- Do not add new npm dependencies without explicit approval.
- Do not introduce a state-management library (Redux/Zustand/MobX/Jotai).
