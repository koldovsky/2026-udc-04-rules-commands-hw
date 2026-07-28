# AGENTS.md

## Project Overview

This is a small TypeScript task-board application. 

The application manages: 

- a list of tasks with the shape `{ id, title, done }` 
- a filter with one of the values `"all"`, `"active"`, or `"done"` 

Use the existing project architecture and conventions. Prefer small, focused changes over broad refactors.

## Project Structure

The main application code lives in `app/src/`.

Key files:

- `app/src/types.ts`: defines `Task`, `AppState`, and the `Action` discriminated union.
- `app/src/store.ts`: implements the custom store and exposes `getState`, `dispatch`, and `subscribe`.
- `app/src/reducer.ts`: contains the pure reducer responsible for state transitions.
- `app/src/actions.ts`: contains action creators such as `addTask`, `toggleTask`, `removeTask`, and `setFilter`.
- `app/src/selectors.ts`: contains pure read helpers such as `visibleTasks` and `remainingCount`.
- `app/src/lib/text.ts`: contains the supported custom text helpers:
    `slugify`, `truncate`, and `normalizeSpaces`.
- `app/src/**/*.test.ts`: colocated Vitest tests.

## Commands

Run commands from the `app/` directory.

```bash
cd app
npm test
npm run typecheck
```

Available commands:

npm test           - Runs the Vitest test suite.
npm run typecheck  - Runs TypeScript with tsc --noEmit.

Lint is not configured in this project. Do not invent or document a lint
command.

Before completing a change, run:

cd app && npm test && npm run typecheck

## Code Style

- Use TypeScript strict mode conventions and handle potentially missing values explicitly.
- Use named exports only. Do not add default exports.
- Do not use any or @ts-ignore.
- Use immutable updates for application state. Prefer object spread, array spread, map, and filter.
- Use kebab-case for filenames and PascalCase for types and interfaces.

Follow the style of the surrounding file when it is consistent with these project rules.

Add comments only when the reason behind the code is not obvious. Do not add
comments that merely restate what the code does.

## Architecture

The application uses a custom in-house state store.

app/src/store.ts exposes:

getState
dispatch
subscribe

This custom store is the only supported state-management mechanism.

State changes must follow this flow:

1. Define or extend an Action variant in app/src/types.ts.
2. Handle the action in app/src/reducer.ts.
3. Add an action creator in app/src/actions.ts.
4. Dispatch the action through store.dispatch(...).
5. Add or update a colocated test.

The reducer must remain pure and must return new state objects rather than mutating existing state.

Consumers should use action creators rather than constructing action objects manually.

Derived reads should go through selectors in app/src/selectors.ts rather than duplicating filtering or counting logic.

Do not replace the custom store with Redux, Zustand, MobX, Jotai, or another state-management library.

## Guardrails
- Treat app/src/store.ts and app/src/types.ts as protected core files.
- Do not modify app/src/store.ts or app/src/types.ts unless the task explicitly requires it or the user gives clear approval.
- Prefer implementing normal feature work in app/src/reducer.ts, app/src/actions.ts, app/src/selectors.ts, and colocated tests.
- Do not add new npm dependencies without explicit approval.
- Do not introduce Redux, Zustand, MobX, Jotai, Lodash, Underscore, or similar libraries.
- Do not mutate application state directly.
- Do not bypass action creators by manually constructing action objects in consumer code.
- Do not call text helpers that are not exported by app/src/lib/text.ts.

The complete supported text helper API is:

slugify(input: string): string
truncate(input: string, maxLength: number, suffix?: string): string 
normalizeSpaces(input: string): string

Helpers such as capitalize, camelCase, deburr, kebabCase, and startCase do not exist.

## Testing

Tests use Vitest and are colocated with the code under test.

- Name test files *.test.ts.
- Use the Arrange, Act, Assert pattern.
- Add tests for new reducer behavior, action creators, selectors, and utility functions.
- Verify reducer changes do not mutate the original state.
- Keep tests deterministic and independent.
- Do not use Jest-specific APIs or configuration.


## Change Reporting

After making changes, provide a concise summary that includes:

- what changed
- why it changed
- which files were modified
- which verification commands were run
- whether tests and type checking passed

Do not claim that a command passed unless it was actually run.