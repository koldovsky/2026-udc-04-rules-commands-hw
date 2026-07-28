---
description: "Add a new Action variant end-to-end: types -> reducer -> action creator -> test"
---

Add a new action for: $ARGUMENTS

1. Add a new variant to the `Action` discriminated union in
   `app/src/types.ts` (do not remove or change existing variants). Give it a
   `"domain/event"`-style `type` string and a typed `payload`.
2. Handle the new variant with a `case` in `app/src/reducer.ts`. The reducer
   must stay pure — return a new object/array, never mutate `state` or
   `state.tasks` in place.
3. Add a matching action creator to `app/src/actions.ts` that builds and
   returns the action object (this is how callers dispatch it, not by
   constructing the object by hand).
4. If the new action affects what's readable from state, consider whether
   `app/src/selectors.ts` needs a new/updated selector.
5. Add a colocated test in `app/src/reducer.test.ts` (and/or
   `app/src/store.test.ts`) covering the new behavior, following the
   Arrange-Act-Assert pattern already used there.
6. Run `cd app && npm test` and `npm run typecheck` — both must pass.

Follow `.cursor/rules/` — especially `architecture.mdc` (dispatch-only, no
Redux/Zustand), `do-not-touch.mdc` (`app/src/store.ts` and the *existing*
shape of `app/src/types.ts` are protected — only additive changes), and
`testing.mdc` (colocated vitest, AAA).
