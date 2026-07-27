# AGENTS.md — task board (`app/`)

Baseline context for any AI coding agent working in this directory. Tool-neutral
on purpose: Cursor, Claude Code, Copilot and others all read it the same way.

Detailed, glob-scoped rules live in `.cursor/rules/*.mdc` at the repo root. This
file is the summary an agent needs before touching anything; the rules are the
enforcement.

## Stack

TypeScript 5.6 (strict, ESM) · vitest 2.1 · Node 22+. No framework, no UI, no
runtime dependencies — `app/package.json` lists exactly two devDependencies.

## Structure

```
app/
  src/
    types.ts        AppState, Task, Filter, the Action union, initialState   [PROTECTED]
    store.ts        createStore() -> { getState, dispatch, subscribe }       [PROTECTED]
    reducer.ts      pure (state, action) => newState — where the domain grows
    actions.ts      action creators: addTask, toggleTask, removeTask, setFilter
    selectors.ts    pure read helpers: visibleTasks, remainingCount
    index.ts        example wiring of the store — not an entry point to build
    lib/text.ts     in-house text helpers with a FIXED API
    *.test.ts       colocated vitest specs (reducer, store, lib/text)
  tsconfig.json     strict + noUncheckedIndexedAccess, include: ["src"]
  package.json      scripts: test, test:watch, typecheck
```

## Commands

```bash
cd app
npm install         # first run only
npm test            # vitest run — 3 files, 15 tests, must stay green
npm run test:watch  # vitest in watch mode
npm run typecheck   # tsc --noEmit
```

**There is no linter and no formatter configured in this sample** — no ESLint,
no Prettier, no `lint` script. This is deliberate. If asked to "run the linter",
say it does not exist rather than inventing a command or adding the tooling.
There is no build script either; the code is run through vitest/tsc only.

## Architecture

State lives in a **custom in-house store**, deliberately NOT Redux, Zustand,
MobX or Jotai. `store.ts` is a ~40-line dispatch/notify engine, and
`store.dispatch(action)` is the only sanctioned way state changes.

**The golden path to extend the app**, in this order:

1. Add a variant to the `Action` union in `types.ts` — `{ type: "domain/pastTense"; payload: {...} }`, matching the existing `task/added`, `task/toggled`, `task/removed`, `filter/set`.
2. Handle it in the `switch` in `reducer.ts`, immutably.
3. Add an action creator in `actions.ts` returning `Action`.
4. Add a colocated test; keep `npm test` green.

The reducer is pure: no `Date.now()`, no `Math.random()`, no I/O. IDs and
timestamps arrive in the action payload. Derived reads go through
`selectors.ts`, not `state.tasks` at the call site.

## Code style

- **Named exports only** — no `export default` anywhere.
- **Relative imports carry `.js`** (ESM): `import type { Action } from "./types.js";`. Type-only imports use `import type`.
- **No `any`, no `@ts-ignore`, no `@ts-expect-error`.** `noUncheckedIndexedAccess` is on, so `tasks[0]` is `Task | undefined` — guard it instead of asserting with `!`.
- **Immutable updates**: `{ ...state, tasks: state.tasks.map(...) }`. Never `push`/`splice`/in-place `sort` on state.
- **Naming**: files kebab-case, types/interfaces PascalCase, functions camelCase.
- **Comments explain why, not what** — match the density of the file you are editing.

## Testing

Specs are colocated as `<name>.test.ts` and run with vitest. Import the helpers
explicitly — `import { describe, expect, it } from "vitest";` — in every file.

> Trap: `tsconfig.json` sets `"types": ["vitest/globals"]`, so TypeScript will
> happily accept a bare `describe(...)`, but there is no vitest config enabling
> `globals: true`, so it fails at runtime. Typecheck passing is not proof here;
> always run `npm test`.

Structure tests Arrange → Act → Assert. For reducer tests also assert that
untouched items keep their identity (`expect(next.tasks[1]).toBe(prev.tasks[1])`)
— that is what proves immutability. No `__tests__/`, no `*.spec.ts`, no jest,
no `.skip`.

## In-house library — `lib/text.ts`

The complete supported API is exactly three functions:

| Function | Behavior |
|---|---|
| `slugify(input: string): string` | `"Buy Milk!"` → `"buy-milk"` |
| `truncate(input: string, maxLength: number, suffix = "…"): string` | `maxLength` **includes** the suffix; input that fits is returned unchanged |
| `normalizeSpaces(input: string): string` | trim + collapse internal whitespace runs |

This is **not** lodash. `capitalize`, `camelCase`, `kebabCase`, `deburr`,
`startCase` **do not exist** — do not import or call them. Need one? Add it to
`text.ts` as a named export with a test, in the same change.

## Guardrails

- **Protected core.** Three cases, kept in sync with
  `.cursor/rules/do-not-touch.mdc`:
  1. `store.ts` — no edits at all without approval. Say what you want to change
     and why the reducer/actions layer cannot absorb it, then wait for a yes.
  2. `types.ts`, **additive** (new `Action` variant, new field, new exported
     type) — proceed **without** approval, but list every addition by name in
     your reply. Extending `types.ts` silently is itself the violation.
  3. `types.ts`, **non-additive** (rename, remove, retype, narrow, or make an
     optional field required) — stop and ask.
- **Never swap the custom store for a library.** No `redux`, `@reduxjs/toolkit`,
  `zustand`, `mobx`, `jotai`, `recoil`, `valtio`. That store is the architecture.
- **No new dependencies without approval.** Never run `npm install <pkg>` or
  edit the dependency blocks on your own initiative; never hand-edit
  `package-lock.json`.
- **Never change public signatures** of `createStore`, the action creators, or
  the `lib/text.ts` functions. Extend, do not redefine.
- **No secrets, no real data.** Everything here is synthetic sample data on
  purpose. Never commit `.env` files or API keys.
- **Windows + Git Bash:** use `2>/dev/null`, never `2>nul` — the latter creates
  a literal `nul` file.

## Definition of done for a change here

`npm run typecheck` clean · `npm test` green · a colocated test covers the new
behavior · no new dependency · `store.ts` untouched · no `any` and no default
export introduced.
