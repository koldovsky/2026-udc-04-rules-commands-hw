---
description: "Add a new Action variant to the custom store (types → reducer → action creator → test)"
---

Add a new store action for: $ARGUMENTS

Follow these steps in order:

1. **types.ts** — Add a new variant to the `Action` discriminated union in
   `app/src/types.ts`. Use the existing `"domain/verb"` naming convention
   (e.g. `"task/added"`, `"filter/set"`). Define the `payload` shape inline.

2. **reducer.ts** — Add a `case` for the new action type in `app/src/reducer.ts`.
   The handler MUST return a new state object (immutable update via spread) —
   never mutate `state` in place.

3. **actions.ts** — Add a named action creator function in `app/src/actions.ts`
   that returns the correctly typed `Action` object. Use a descriptive function
   name matching the action's intent.

4. **Test** — Add or extend `app/src/reducer.test.ts` with at least one test for
   the new action. Follow the AAA pattern (Arrange / Act / Assert). Use vitest
   imports (`describe`, `it`, `expect`).

5. **Selector (if needed)** — If the action introduces new derived data, add a
   selector in `app/src/selectors.ts` (pure function from `AppState`).

6. **Verify** — Run `npm run typecheck` and `npm test` from `app/`. Both must
   pass with zero errors.

Constraints (from `.cursor/rules/`):
- Named exports only, no `export default`.
- No `any` or `@ts-ignore`.
- Immutable state updates — no `.push()`, `.splice()`, or direct assignment.
- Do not modify `app/src/store.ts` (protected core).
- Do not install new dependencies.
