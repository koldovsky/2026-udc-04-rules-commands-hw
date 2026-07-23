---
description: "Add a new Action variant + reducer + action creator + test"
---

Do the following for: $ARGUMENTS

1. Add a new `Action` variant in `app/src/types.ts` describing the behavior.
2. Handle the action in `app/src/reducer.ts` immutably.
3. Add an action creator in `app/src/actions.ts`.
4. Add a colocated test in `app/src/*.test.ts` verifying the new behavior.

Constraints:
- Follow `.cursor/rules/` (do not edit `app/src/store.ts`; use named exports;
  keep tests green).
- Do not add new npm dependencies.