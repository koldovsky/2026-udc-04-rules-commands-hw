# AGENTS.md

Baseline guidance for AI assistants working in this TypeScript task-board app.
Tool-agnostic — applies in Cursor, Claude Code, Copilot, or any agent that reads
`AGENTS.md`.

## Project structure

```
app/
├── src/
│   ├── types.ts       # AppState, Task, Action union — PROTECTED core
│   ├── store.ts       # createStore (dispatch/subscribe) — PROTECTED core
│   ├── reducer.ts     # Pure reducer; extend here for new behavior
│   ├── actions.ts     # Action creators (addTask, toggleTask, …)
│   ├── selectors.ts   # Read helpers (visibleTasks, remainingCount)
│   ├── lib/text.ts    # In-house text utils (fixed API)
│   ├── index.ts       # Entry point
│   └── *.test.ts      # Colocated vitest tests
├── package.json
└── tsconfig.json
```

Domain: a minimal task board — `Task { id, title, done }` plus a filter
(`"all" | "active" | "done"`). See `materials/architecture-brief.md` for the
full design rationale.

## Commands

Run from the `app/` directory:

```bash
npm test              # vitest run — must stay green
npm run typecheck     # tsc --noEmit
npm run test:watch    # vitest in watch mode (optional)
```

Lint is **not configured** in this sample — do not invent a lint command.

## Code style

- **Named exports only** — no default exports.
- **Strict TypeScript** — no `any`, no `@ts-ignore` (`noUncheckedIndexedAccess` is on).
- **Immutable updates** — spread / `map` / `filter` in the reducer; never mutate state in place.
- **File naming** — kebab-case files; types and interfaces in PascalCase.
- **Tests** — colocated `*.test.ts` with vitest; follow Arrange–Act–Assert.

## Architecture

State is managed by a **custom in-house store**, deliberately **not** Redux,
Zustand, MobX, or Jotai. Do not swap in a state library.

- State changes **only** via `store.dispatch(action)` (`src/store.ts`).
- **Golden path to extend the app:**
  1. Add an `Action` variant in `types.ts`
  2. Handle it in `reducer.ts`
  3. Add an action creator in `actions.ts`
  4. Add a colocated test
- Reads go through **selectors** (`src/selectors.ts`), not raw `state.tasks`.
- `src/lib/text.ts` exposes exactly: `slugify`, `truncate`, `normalizeSpaces`.
  It is not lodash — helpers like `capitalize` or `camelCase` do not exist.

## Guardrails

- **Do not modify** `src/store.ts` or `src/types.ts` unless explicitly approved.
  Normal feature work extends `reducer.ts` and `actions.ts`.
- **Do not add npm dependencies** without explicit approval.
- **Do not change** public signatures of `createStore`, existing action creators,
  or the `lib/text.ts` functions — only extend them.
- Keep existing tests green after every change (`npm test`).
