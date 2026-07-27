---
description: "Add a new action to the task board: Action variant → reducer case → action creator → test"
---

Add the action `$ARGUMENTS` to the app following the project's golden path.

1. **types.ts** — append a new variant to the `Action` discriminated union:
   ```ts
   | { type: "namespace/verb"; payload: { /* typed fields */ } }
   ```
   Use `"namespace/verb"` format (e.g. `"task/pinned"`, `"filter/reset"`).
   Do NOT change any existing type shapes (`Task`, `AppState`, `Filter`).

2. **reducer.ts** — add an explicit `case` for the new action type. The case
   must return a new state object (spread/map/filter) — never mutate `state`
   directly (no `.push`, `.splice`, `.sort`).

3. **actions.ts** — add a named export action creator function:
   ```ts
   export function myAction(/* params */): Action {
     return { type: "namespace/verb", payload: { /* ... */ } };
   }
   ```

4. **reducer.test.ts** — add a Vitest test using the AAA pattern:
   - Arrange: define `initialState` or a suitable start state
   - Act: call `reducer(state, myAction(…))`
   - Assert: `expect(result).toEqual(…)` the expected new state

5. **Sanity check** — confirm that `app/src/store.ts` and the existing exports
   in `app/src/types.ts` are unchanged (no new fields on `Task` or `AppState`
   without approval).

Follow `.cursor/rules/`: custom store only (no Redux/Zustand), named exports,
immutable updates, no `any`, colocated Vitest tests.
