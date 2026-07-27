# AGENTS.md

Baseline instructions for any coding agent working in this application.

## Project context

This is a small TypeScript task-board application.

The application uses a custom state-management implementation rather than Redux or another external library.

Important files:

* `src/store.ts` — custom store implementation
* `src/types.ts` — application types and `Action` union
* `src/reducer.ts` — immutable state transitions
* `src/actions.ts` — action creators
* `src/selectors.ts` — derived state helpers
* `src/lib/text.ts` — shared text utility library

Tests are colocated with implementation files using Vitest.

## Development rules

* Follow the existing project structure and coding style.
* Use TypeScript with explicit types.
* Do not use `any` or `@ts-ignore`.
* Use named exports only.
* Keep state immutable.
* All state changes must go through the reducer and `dispatch()`.
* Reuse selectors instead of duplicating query logic.
* Add or update colocated `*.test.ts` files for behavior changes.
* Write comments only when the intent is not obvious from the code.

## Guardrails

* Do not replace the custom store with Redux, Zustand, MobX, Jotai, or another state-management library.
* Do not modify `src/store.ts` without explicit approval.
* Do not change existing types in `src/types.ts` unless required by the requested feature.
* Do not add, remove, or upgrade project dependencies without explicit approval.
* Only use APIs exported by `src/lib/text.ts`.

## Validation

Before considering a task complete, run:

```bash
npm test
npm run typecheck
```

Do not report tests as passing unless they were actually executed successfully.

This project does not include a lint configuration, so do not invent or report lint results.
