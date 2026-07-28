---
paths:
  - "app/**/*.test.ts"
---

# Testing

## Context

Tests live next to source as colocated `*.test.ts` files using vitest. Run the suite with `cd app && npm test`. Examples: `app/src/reducer.test.ts`, `app/src/store.test.ts`, `app/src/lib/text.test.ts`.

## Rule

- Colocate tests: `foo.ts` → `foo.test.ts` in the same directory.
- Use vitest imports: `describe`, `it`, `expect` from `"vitest"`.
- Follow **Arrange–Act–Assert**: set up state/data, call the function under test, assert the outcome.
- Every new behavior (reducer case, action creator, util function) gets at least one test.
- Import modules with `.js` extensions: `import { reducer } from "./reducer.js"`.
- Run `cd app && npm test` before finishing any feature work.

## How to verify

1. New feature has a corresponding `*.test.ts` file or new `it(...)` block.
2. `cd app && npm test` exits 0.
3. Tests use vitest (`describe`/`it`/`expect`), not another test runner.
