# AGENTS.md — Task Board App

Cross-tool baseline for any AI coding agent (Cursor, Claude Code, Copilot,
etc.) working in this directory. Tool-specific rule files
(`.cursor/rules/`, `.claude/rules/`) add detail and path-scoping on top of
this baseline; this file is the one all tools can read.

## Structure

```
app/
├── package.json         # scripts + the only two devDependencies
├── tsconfig.json
└── src/
    ├── types.ts          # AppState, Task, Action union — PROTECTED
    ├── store.ts          # createStore (dispatch/subscribe engine) — PROTECTED
    ├── reducer.ts         # pure reducer — extend behavior here
    ├── actions.ts          # action creators (addTask, toggleTask, removeTask, setFilter)
    ├── selectors.ts         # read helpers (visibleTasks, remainingCount)
    ├── index.ts              # entry point
    └── lib/
        └── text.ts            # fixed-API text utils (slugify, truncate, normalizeSpaces)
```

Tests are colocated next to the source they cover: `reducer.test.ts`,
`store.test.ts`, `lib/text.test.ts`.

## Commands

```bash
cd app
npm test           # vitest run
npm run typecheck  # tsc --noEmit
```

Lint is **not configured** in this project — don't invent or run a lint
command that doesn't exist.

## Code style

- **Named exports only** — no `export default`.
- **No `any` or `@ts-ignore`** — TypeScript strict mode is on
  (`noUncheckedIndexedAccess`); use proper types or narrow with guards.
- **Immutable updates** — the reducer returns new objects/arrays via
  spread, `map`, or `filter`; never mutate state in place.
- **File naming** — kebab-case for files (e.g. `text-utils.ts`); PascalCase
  for types/interfaces (`Task`, `AppState`).
- **Imports** — use `.js` extensions in relative imports (ESM), e.g.
  `import { reducer } from "./reducer.js"`.

## Architecture

State is managed by a small **in-house store** — deliberately not Redux,
Zustand, MobX, or Jotai. `store.ts` exposes `createStore()` → `{ getState,
dispatch, subscribe }`; this is the **only** way state changes.

The golden path to add behavior:

1. Add an `Action` variant in `types.ts`.
2. Handle it in `reducer.ts` (pure, immutable).
3. Add an action creator in `actions.ts`.
4. Add a colocated test.

Read derived state through `selectors.ts` — avoid ad-hoc filtering on raw
`state.tasks` elsewhere.

`lib/text.ts` is a small custom text library, not lodash/underscore. Its
entire supported API is `slugify`, `truncate`, and `normalizeSpaces` — don't
assume or invent helpers like `capitalize` or `camelCase`.

## Guardrails

- Do not modify `store.ts` or restructure `types.ts` without explicit user
  approval — they're load-bearing protected core. Adding a new `Action`
  variant or domain field to `types.ts` as part of the golden path is fine.
- Do not add npm packages, or swap the custom store for an external state
  library, without explicit user approval.
- Keep changes scoped to `reducer.ts`, `actions.ts`, `selectors.ts`, and
  tests for normal feature work.
- Run `cd app && npm test` before finishing any feature work; don't break
  existing tests.
