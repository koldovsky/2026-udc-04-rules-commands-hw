# AGENTS.md

Baseline guidance for any agentic tool (Cursor, Claude Code, etc.) working in
this app. This file is tool-agnostic — see `CLAUDE.md` for a cross-tool
pointer used by Claude-specific tooling.

## Project structure

- `src/types.ts` — `AppState`, `Task`, `Action` union, `initialState`. The
  contract everything else depends on. **PROTECTED** (see Guardrails).
- `src/store.ts` — `createStore()`: minimal `dispatch`/`subscribe`/`getState`
  engine. **PROTECTED** (see Guardrails).
- `src/reducer.ts` — pure `(state, action) -> state` reducer. This is where
  the domain grows: add a variant to the `Action` union first, then handle it
  here.
- `src/actions.ts` — action creators (`addTask`, `toggleTask`, `removeTask`,
  `setFilter`). The only sanctioned way to build an `Action` object.
- `src/selectors.ts` — pure read helpers (`visibleTasks`, `remainingCount`).
  UI/consumers read state through selectors, not by poking `state.tasks`
  directly.
- `src/lib/text.ts` — in-house text utility with a fixed API: `slugify`,
  `truncate`, `normalizeSpaces`. Not lodash — don't assume other helpers
  exist; add them explicitly if needed.
- `src/index.ts` — example wiring showing how the pieces connect.
- Tests are colocated as `*.test.ts` next to the file they cover, using
  vitest.

## Commands

- `npm test` — run the vitest suite once (`vitest run`).
- `npm run test:watch` — run vitest in watch mode.
- `npm run typecheck` — `tsc --noEmit`.
- Lint is **not configured** in this package (no `lint` script, no ESLint
  config). Do not invent or run a lint command — rely on `typecheck` and
  `test` instead.

## Code style

- TypeScript `strict` mode is on (including `noUncheckedIndexedAccess`) —
  don't silence errors with `any` or `@ts-ignore`; narrow or handle the type
  properly instead.
- Named exports only — no default exports.
- State updates are always immutable: build new objects/arrays (`{ ...state,
  ... }`, `.map`/`.filter`), never mutate `state` or its nested fields in
  place.
- Actions are a discriminated union on `type` (e.g. `"task/added"`) with a
  `payload` object; follow this `domain/event` naming and shape for any new
  action.
- Local (relative) imports use explicit `.js` extensions (ESM/NodeNext style,
  e.g. `from "./types.js"`), even though the source files are `.ts`.

## Architecture

- State management is a **small custom store**, not Redux, Zustand, MobX, or
  any other library. It's an intentionally minimal `dispatch` + `subscribe`
  + `getState` implementation (`src/store.ts`).
- Data flow is one-directional: UI/consumer calls an action creator
  (`src/actions.ts`) → dispatches the `Action` to the store → the pure
  `reducer` (`src/reducer.ts`) computes new state → subscribed listeners are
  notified → consumers read state back out through `src/selectors.ts`.
- The only sanctioned path to change state is
  `store.dispatch(actionCreator(...))`. Nothing should mutate `AppState`
  directly or construct raw action objects outside `src/actions.ts`.
- Do not introduce a state-management library, a global mutable singleton
  outside `createStore`, or an alternative dispatch path — the custom store
  is the architecture this app is built to demonstrate.

## Guardrails

- Do not modify `src/store.ts` or `src/types.ts` without explicit approval —
  they are the protected core contract. To extend behavior, add an `Action`
  variant in `types.ts` and handle it in `reducer.ts`/`actions.ts`; you
  should almost never need to touch the dispatch/notify engine itself or
  change existing type shapes.
- Do not "modernize" the store into Redux/Zustand/MobX/Jotai.
- Do not add new dependencies (runtime or dev). This app intentionally has a
  minimal `package.json` (`typescript` + `vitest` only) — solve problems with
  what's already here.
- Do not change the public signatures of `createStore`, the action creators,
  or the `lib/text.ts` functions — only add to them.
- Don't break existing tests; when you change behavior, update or add tests
  alongside the change.
