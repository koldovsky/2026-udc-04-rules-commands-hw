# AGENTS.md

Baseline context for any Agentic IDE (Cursor, Claude Code, GitHub Copilot, ...)
working in this `app/`. Tool-neutral on purpose: it is the shared language for
the project. The enforced version of these expectations lives in the repo's
`.cursor/rules/*.mdc`.

## Structure

A tiny TypeScript "task board" — a list of `Task { id, title, done }` plus a
`filter`, managed by a custom in-house store.

- `src/types.ts` — `AppState`, `Task`, `Filter`, and the `Action` discriminated
  union; `initialState`. **Protected core.**
- `src/store.ts` — `createStore()` → `{ getState, dispatch, subscribe }`.
  **Protected core.**
- `src/reducer.ts` — pure `(state, action) => newState`; where the domain grows.
- `src/actions.ts` — action creators (`addTask`, `toggleTask`, `removeTask`,
  `setFilter`).
- `src/selectors.ts` — pure read helpers (`visibleTasks`, `remainingCount`).
- `src/lib/text.ts` — in-house text util with a fixed API.
- `src/*.test.ts`, `src/lib/*.test.ts` — colocated vitest specs.

## Commands

Run from `app/`:

- `npm test` — run the suite once (`vitest run`).
- `npm run test:watch` — watch mode (`vitest`).
- `npm run typecheck` — type-check without emitting (`tsc --noEmit`).
- **Lint: not configured** in this sample. There is no lint script — do not
  invent one or assume ESLint/Prettier is set up.

## Code style

- **Named exports only** — no default exports.
- **No `any`, no `@ts-ignore`/`@ts-expect-error`** — TypeScript is strict
  (`noUncheckedIndexedAccess` on). Model types precisely.
- **Immutable state updates** — spread / `map` / `filter`; never mutate in place.
- **Naming** — kebab-case filenames; PascalCase types/interfaces; camelCase
  functions and variables.
- **Colocated tests** — `foo.ts` → `foo.test.ts`, written vitest AAA style
  (Arrange / Act / Assert).

## Architecture

State is managed by a small **custom store**, deliberately NOT a library:

- `createStore()` returns `{ getState, dispatch, subscribe }`; changing state is
  done **only** via `store.dispatch(action)`.
- **Golden path** to add behavior: add an `Action` variant in `src/types.ts` →
  handle it immutably in `src/reducer.ts` → add an action creator in
  `src/actions.ts` → add a colocated test. Reads go through `src/selectors.ts`.
- This is **NOT** Redux, Zustand, MobX, or Jotai. Do not "modernize" the store by
  swapping in a state library — that store is the architecture the project is about.

## Guardrails

- **Protected core** — do not edit `src/store.ts` or `src/types.ts` without
  explicit approval. Normal feature work extends `reducer.ts`/`actions.ts`.
  Additive changes to `types.ts` (a new `Action` variant, a new `Task` field)
  when a request needs them are the sanctioned exception. Never change the public
  signatures of `createStore` or the action creators.
- **No new dependencies** — do not add npm packages or edit `package.json` deps
  without approval. Use the standard library and the in-house utilities.
- **Fixed `lib/text.ts` API** — the only supported functions are `slugify`,
  `truncate`, `normalizeSpaces`. It is not lodash; helpers like `capitalize` or
  `camelCase` do not exist. Add new helpers explicitly (with a test) rather than
  assuming them.
- **Keep tests green** — `npm test` must pass before opening a PR.
