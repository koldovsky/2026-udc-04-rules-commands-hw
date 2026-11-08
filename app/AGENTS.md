# AGENTS.md — task-board app

## Structure

Stack: TypeScript (`strict`, `noUncheckedIndexedAccess`), vitest, ESM; no runtime dependencies.

- `src/types.ts` — `Task`, `AppState`, `Filter`, the `Action` union, `initialState` (protected).
- `src/store.ts` — `createStore()` dispatch/subscribe engine (protected).
- `src/reducer.ts` — pure `reducer(state, action)`; one `case` per action.
- `src/actions.ts` — action creators: `addTask`, `toggleTask`, `removeTask`, `setFilter`.
- `src/selectors.ts` — read helpers: `visibleTasks`, `remainingCount`.
- `src/lib/text.ts` — in-house text helpers with a fixed API.
- `src/index.ts` — example wiring of store, actions, and selectors.
- `src/**/*.test.ts` — colocated vitest tests (`reducer`, `store`, `lib/text`).

## Commands

Run from the repo root:

- `cd app; npm test` — run all tests once (vitest).
- `cd app; npm run typecheck` — `tsc --noEmit`.
- Lint: not configured — do not invent a lint command.

## Code style

- Use named exports only; never `export default`.
- Never use `any`, `as any`, or `@ts-ignore`; narrow `T | undefined` from indexed access instead.
- Update state immutably with spread, `map`, `filter`; never `push`, `splice`, or assign to state.
- Name files in kebab-case, types in PascalCase; use `.js` extensions in relative imports.
- Put tests in `<name>.test.ts` next to `<name>.ts`, using vitest.

## Architecture

- State lives in a custom store: `createStore()` returns `{ getState, dispatch, subscribe }`. Never replace it with Redux, Zustand, MobX, or Jotai.
- Change state only via `store.dispatch(action)`, building actions with creators from `src/actions.ts`.
- Add behavior in this order: `Action` variant in `src/types.ts` → `case` in `src/reducer.ts` → creator in `src/actions.ts` → colocated test.
- Read state through `src/selectors.ts`; add a selector rather than filtering `state.tasks` inline.
- `src/lib/text.ts` exports only `slugify`, `truncate`, `normalizeSpaces`; it is not lodash, so do not call helpers like `capitalize` or `camelCase`.

## Guardrails

- Do not edit `src/store.ts` without explicit approval.
- Edit `src/types.ts` only additively (new `Action` variant or field), and only with approval.
- Do not add npm dependencies or devDependencies without explicit approval.
- Keep public signatures of `createStore`, the action creators, and `src/lib/text.ts` unchanged; add new functions instead.
- Never commit secrets, `.env` files, or real personal/client data; use synthetic sample data only.

Detailed, scoped rules live in `.cursor/rules/` at the repo root.
