# AGENTS.md

Baseline instructions for any coding agent working in this application.

## Project context

This is a small TypeScript task-board application tested with Vitest.

The application uses a custom state-management implementation rather than Redux or another external state-management library.

## Structure

- `src/store.ts` — custom store implementation
- `src/types.ts` — application types and the `Action` union
- `src/reducer.ts` — immutable state transitions
- `src/actions.ts` — action creators
- `src/selectors.ts` — derived state helpers
- `src/lib/text.ts` — shared text utility library
- `src/**/*.test.ts` — colocated Vitest tests

## Architecture

Application state is managed through the existing custom store.

State changes must follow this flow:

1. An action is created using an action creator from `src/actions.ts`.
2. The action is sent through `dispatch()`.
3. The reducer in `src/reducer.ts` returns a new immutable state.
4. Selectors from `src/selectors.ts` are used for derived state and queries.

Do not mutate state directly or bypass the action → dispatch → reducer flow.

## Commands

- Run the test suite with `npm test`.
- Run the TypeScript type check with `npm run typecheck`.

Do not report a command as successful unless it was actually executed successfully.

This project does not include a lint configuration, so do not invent or report lint results.

## Conventions

- Use TypeScript with explicit types; do not use `any` or `@ts-ignore`.
- Use named exports only.
- Reuse existing selectors instead of duplicating query logic.
- Add or update colocated `*.test.ts` files for behavior changes.
- Write comments only when the intent is not obvious from the code.

## Guardrails

- Do not replace the custom store with Redux, Zustand, MobX, Jotai, or another state-management library.
- Do not modify `src/store.ts` or `src/types.ts` without explicit user approval.
- If a requested change requires editing either protected file, explain why the change is necessary and wait for explicit approval before making it.
- Do not add, remove, or upgrade project dependencies without explicit user approval.
- Only use APIs exported by `src/lib/text.ts`.