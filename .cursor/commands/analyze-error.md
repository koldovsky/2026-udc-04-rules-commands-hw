---
description: "Diagnose a TypeScript or test error in the app and propose a safe fix"
---

Analyze the following error and propose a fix: $ARGUMENTS

1. **Identify the error type** — TypeScript compile error, Vitest test failure,
   or runtime exception. Read the full error message and note the file and line.

2. **Find the root cause** — read the relevant source file(s). Look for:
   - Type mismatches (e.g. wrong payload shape, missing field)
   - Mutation in the reducer (`.push`, `.splice` — should use spread/map)
   - Missing case in the reducer `switch`
   - Import from a function that doesn't exist in `lib/text.ts`

3. **Propose a minimal fix** — change only what is necessary to resolve the
   error. Do not refactor surrounding code. Do not install new packages.

4. **Respect protected files** — if the fix seems to require changing the
   `createStore` signature in `store.ts` or the `Task`/`AppState` shapes in
   `types.ts`, STOP and explain why the change is risky. Ask for approval
   before touching those shapes.

5. **Verify** — after applying the fix, confirm:
   - `cd app && npm test` passes (all tests green)
   - No new `any` or `@ts-ignore` was introduced
   - The fix uses named exports (no `export default`)

Follow `.cursor/rules/`: immutable reducer updates, no external state libraries,
only `slugify`/`truncate`/`normalizeSpaces` from `lib/text.ts`.
