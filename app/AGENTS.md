# AGENTS.md — task-board app

Baseline instructions for ANY AI coding agent (Cursor, Claude Code, Copilot,
etc.) working inside `app/`. Tool-specific rule files may add detail, but this
file is the source of truth all tools share.

## Project

A minimal task board in strict TypeScript: a list of `Task { id, title, done }`
plus a `filter` (`"all" | "active" | "done"`). No UI framework, no runtime
dependencies.

## Structure

```text
src/
  types.ts       # PROTECTED: domain types + Action union + initialState
  store.ts       # PROTECTED: custom store — createStore(): getState/dispatch/subscribe
  reducer.ts     # pure reducer (state, action) => new state
  actions.ts     # action creators — the only sanctioned way to build actions
  selectors.ts   # pure read helpers (visibleTasks, remainingCount)
  lib/text.ts    # in-house text lib with a FIXED API
  *.test.ts      # colocated vitest tests
```

## Commands

Run from the `app/` directory:

```bash
npm test           # vitest run — must stay green
npm run typecheck  # tsc --noEmit — must pass
```

Lint is deliberately NOT configured — do not invent or add one.

## Architecture

- State changes ONLY via `store.dispatch(action)`. The store is a small
  in-house implementation — NOT Redux/Zustand/MobX/Jotai; never replace it.
- Golden path for new behavior: add an `Action` variant in `types.ts` →
  handle it in `reducer.ts` → add a creator in `actions.ts` → add a colocated
  test.
- Reads go through `selectors.ts`, not `state.tasks` directly.

## Code style

- Named exports only — no `export default`.
- No `any`, no `@ts-ignore` / `@ts-expect-error` (strict mode with
  `noUncheckedIndexedAccess` is on).
- Immutable updates: spread / `map` / `filter`; never mutate state in place.
- Files kebab-case; types/interfaces PascalCase.
- Tests colocated `*.test.ts`, vitest, Arrange–Act–Assert.

## In-house lib — fixed API

`src/lib/text.ts` exports exactly three functions — nothing else exists:

- `slugify(input: string): string`
- `truncate(input: string, maxLength: number, suffix?: string): string`
  (maxLength includes the suffix)
- `normalizeSpaces(input: string): string`

It is not lodash — do not assume `capitalize`, `camelCase`, `deburr`, etc.
Need a new helper? Add it to `text.ts` with a test; never import a package.

## Guardrails

- Do NOT modify `src/store.ts`; do NOT modify `src/types.ts` except adding an
  `Action` variant or a task-required field. Anything else: ask first.
- Do NOT add npm dependencies (runtime or dev) or edit `package-lock.json`.
- Never delete or weaken existing tests to make a change pass.
- Finish every change with `npm test` and `npm run typecheck` green.
