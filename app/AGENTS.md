# AGENTS.md

Baseline context for any agentic tool (Cursor, Claude Code, Copilot, etc.)
working in this app.

## Structure

- `src/types.ts` — `AppState`, `Task`, and the `Action` discriminated union.
  Protected core.
- `src/store.ts` — `createStore()` → `{ getState, dispatch, subscribe }`.
  Protected core; the only way state changes.
- `src/reducer.ts` — pure reducer `(state, action) => newState`. Where new
  behavior is handled.
- `src/actions.ts` — action creators (`addTask`, `toggleTask`, `removeTask`,
  `setFilter`).
- `src/selectors.ts` — read helpers (`visibleTasks`, `remainingCount`).
- `src/lib/text.ts` — custom text lib with a fixed API: `slugify`,
  `truncate`, `normalizeSpaces`. Not lodash — no other helpers exist.
- `src/*.test.ts` — colocated vitest tests.

## Commands

```bash
cd app
npm test             # vitest run
npm run typecheck    # tsc --noEmit
```

Lint is **not configured** in this app — don't invent a lint command.

## Code style

- Named exports only — no default exports.
- Strict TypeScript: no `any`, no `@ts-ignore`.
- Immutable updates — spread/`map`/`filter`, never mutate state in place.
- Naming: kebab-case filenames, PascalCase types/interfaces.

## Architecture

Custom state store (`src/store.ts`) — not Redux/Zustand/MobX/Jotai. State
changes only via `store.dispatch(action)`.

To add behavior: `Action` in `types.ts` → handle in `reducer.ts` → creator in
`actions.ts` → test.

## Guardrails

- Don't edit `src/store.ts`, or change existing signatures in `src/types.ts`
  or `src/lib/text.ts`, without explicit approval. Adding a new `Action`
  variant is fine; changing an existing one is not.
- Don't add new npm dependencies without approval.
- Don't break existing tests — `cd app && npm test` must stay green.
