# AGENTS.md — task-board app

Baseline context for any AI coding agent (Cursor, Claude Code, Copilot, …)
working inside `app/`. Tool-agnostic on purpose: no tool-specific syntax here.

Deeper rationale lives in `../materials/architecture-brief.md`. Enforceable
rules live in `../.cursor/rules/*.mdc` (Claude Code loads the same files via the
imports in the root `CLAUDE.md`). This file is the shared summary both read.

## Stack

TypeScript 5.6 (strict, `noUncheckedIndexedAccess`), ESM (`"type": "module"`),
vitest 2.1. No framework, no UI, no build step — Node 22+ only.

## Structure

```text
app/
├── src/
│   ├── types.ts        AppState, Task, TaskId, Filter, Priority, Action union, initialState  [PROTECTED]
│   ├── store.ts        createStore() -> { getState, dispatch, subscribe }          [PROTECTED]
│   ├── reducer.ts      pure (state, action) => newState — where the domain grows
│   ├── actions.ts      action creators: addTask, toggleTask, setTaskPriority, removeTask, setFilter
│   ├── selectors.ts    pure read helpers: visibleTasks, taskPriority, remainingCount
│   ├── index.ts        example wiring of the store (demo, not production entry)
│   ├── lib/text.ts     in-house text lib, fixed API (see below)
│   └── *.test.ts       colocated tests (reducer.test.ts, store.test.ts, selectors.test.ts,
│                       lib/text.test.ts)
├── package.json
└── tsconfig.json
```

## Commands

Run from `app/`:

```bash
npm test            # vitest run — 20 tests, must stay green
npm run test:watch  # vitest watch mode
npm run typecheck   # tsc --noEmit
```

**Lint is NOT configured** in this sample — there is no ESLint/Prettier setup and
no `npm run lint`. Do not invent one or add a linter to satisfy a request; match
the style of the surrounding file instead.

## Architecture

State lives in a **custom in-house store**, deliberately **not** Redux, Zustand,
MobX, or Jotai. Do not "modernize" it by swapping in a library — that store *is*
the architecture this repo is about.

- `store.dispatch(action)` is the **only** sanctioned way state changes. Never
  assign to state, never mutate `state.tasks`, never expose a setter.
- `Action` in `types.ts` is a **discriminated union** on `type`
  (`"task/added"`, `"task/toggled"`, `"task/removed"`, `"task/prioritized"`,
  `"filter/set"`). Nothing outside that union may be dispatched.
- Reads go through `selectors.ts`, not `state.tasks` directly. `Task.priority` is
  optional and an absent value means `"normal"` — resolve it with the
  `taskPriority` selector instead of reading the field.

**Golden path to extend the app** — all four steps, in order:

1. add an `Action` variant in `types.ts` (needs approval, see Guardrails),
2. handle it in `reducer.ts`, immutably,
3. add an action creator in `actions.ts`,
4. add a colocated test in `*.test.ts`.

## Code style

- **Named exports only** — no `export default` anywhere.
- **No `any`, no `@ts-ignore`, no non-null `!`** — strict mode is on; fix the
  type instead. `noUncheckedIndexedAccess` means indexed access is
  `T | undefined`, so guard it.
- **Immutable updates** in the reducer — spread / `map` / `filter`, never
  `push`, `splice`, or field assignment.
- **kebab-case** file names; PascalCase types/interfaces; camelCase functions.
- Comments explain *why*, not *what*. Match the density already in the file.

## In-house library — `src/lib/text.ts`

This is a custom lib, **not lodash**. Its entire supported surface is:

```ts
slugify(input: string): string
truncate(input: string, maxLength: number, suffix?: string): string  // suffix defaults to "…"
normalizeSpaces(input: string): string
```

Helpers like `capitalize`, `camelCase`, `deburr`, `kebabCase` **do not exist**.
Do not call them. If one is genuinely needed, add it here explicitly with a test.

## Guardrails

- **PROTECTED files — do not edit without explicit approval:** `src/store.ts`
  and `src/types.ts`. They are load-bearing contracts; changes ripple through
  the whole app. If a task needs a new `Action` variant, say so and ask first.
- **No new dependencies.** Do not add anything to `package.json` — no state
  library, no lodash, no uuid, no test framework swap. Use the standard library
  or add a local helper.
- **Do not change public signatures** of `createStore`, the action creators, or
  the `lib/text.ts` functions — only add alongside them.
- **Do not break existing tests.** 20 tests are green; keep them green without
  editing them to fit new behavior.

## How to verify

```bash
cd app && npm test && npm run typecheck
```

Both must pass. Then sanity-check the diff: no `any`/`@ts-ignore`, no default
exports, no mutation in `reducer.ts`, no edits to `store.ts`/`types.ts` you were
not asked for, and `package.json` untouched.
