# AGENTS.md — task-board app

Cross-tool baseline for any Agentic IDE (Cursor, Claude Code, GitHub Copilot)
working inside `app/`. Keep changes small, typed, and on the golden path.

## Project structure

- `app/src/types.ts` — `AppState`, `Task`, `Filter`, and the `Action`
  discriminated union. **Protected core.**
- `app/src/store.ts` — `createStore()` → `{ getState, dispatch, subscribe }`.
  A custom store, **not** Redux/Zustand. **Protected core.**
- `app/src/reducer.ts` — pure `(state, action) => newState`. Where the domain grows.
- `app/src/actions.ts` — action creators (`addTask`, `toggleTask`, `removeTask`,
  `setFilter`).
- `app/src/selectors.ts` — pure read helpers (`visibleTasks`, `remainingCount`).
- `app/src/lib/text.ts` — in-house text lib with a fixed API (`slugify`,
  `truncate`, `normalizeSpaces`).
- Tests are colocated `*.test.ts` (vitest).

## Commands

```bash
cd app
npm test          # vitest run — the test suite
npm run typecheck # tsc --noEmit — strict type check
```

Lint is **not** configured in this sample. Do not invent a lint command; rely on
`typecheck` and the conventions below.

## Code style

- Named exports only (no `export default`).
- No `any`, no `@ts-ignore`/`@ts-expect-error` — strict TypeScript
  (`noUncheckedIndexedAccess` is on).
- Immutable state updates (spread / `map` / `filter`); never mutate in place.
- Files kebab-case; types/interfaces PascalCase; functions/variables camelCase.
- ESM relative imports keep the `.js` extension; use `import type` for types.

## Architecture

State changes flow **only** through `store.dispatch(action)`. The custom store
is deliberately not a library — do not "modernize" it. The golden path to extend
the app:

1. Add an `Action` variant in `app/src/types.ts`.
2. Handle it immutably in `app/src/reducer.ts`.
3. Add an action creator in `app/src/actions.ts`.
4. Add a colocated `*.test.ts`; keep `npm test` green.

## Guardrails

- Do not edit the protected core (`app/src/store.ts`, `app/src/types.ts`) beyond
  additive `Action`/field changes — ask before deeper edits.
- Do not add npm dependencies or a state/utility library without approval.
- Do not call helpers that don't exist in `app/src/lib/text.ts`.
- Never commit secrets or PII (this repo uses synthetic sample data only).
