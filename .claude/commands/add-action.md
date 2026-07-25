---
description: "Add a new Action variant following the golden path (types → reducer → actions → test)"
---

Add a new store action for: **$ARGUMENTS**

Follow the golden path in order:

1. **`app/src/types.ts`** — add a new variant to the `Action` discriminated union
   (`type` string + typed `payload`). This is the approved change to the protected
   core for new behavior.
2. **`app/src/reducer.ts`** — handle the new `case` with an **immutable** update
   (spread / `map` / `filter`; never mutate `state` in place).
3. **`app/src/actions.ts`** — add a named-export action creator that returns the
   new action object. UI must call this helper, not build actions by hand.
4. **Colocated test** — add or extend a `*.test.ts` (vitest, AAA pattern) that
   dispatches the action and asserts the resulting state.

Constraints:

- Follow `.cursor/rules/` — especially `architecture.mdc`, `conventions.mdc`,
  `testing.mdc`, and `do-not-touch.mdc`.
- Do **not** modify `app/src/store.ts`.
- Do **not** introduce Redux/Zustand/MobX or mutate state outside `dispatch`.
- Do **not** add npm dependencies.
- No `any`, no `@ts-ignore`.

When done, run `cd app && npm test && npm run typecheck` and confirm both pass.
