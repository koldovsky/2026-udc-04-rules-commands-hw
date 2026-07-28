---
description: "Add a new Action end-to-end: types union -> reducer -> action creator -> test"
---

Add a new action to the task-board store for: $ARGUMENTS

1. Add a new variant to the `Action` discriminated union in
   `app/src/types.ts` — additive only, do not change existing variants. Name
   it `"<domain>/<verb>"` following the existing style (`task/added`,
   `filter/set`).
2. Handle the new action in `app/src/reducer.ts`: return a new state object
   immutably (spread/`map`/`filter` — never mutate `state` or a `Task` in
   place).
3. Add a matching action creator in `app/src/actions.ts` — named export,
   same style as `addTask`/`toggleTask`.
4. If the change adds a derived read (a count, a filtered view), add it as a
   named selector in `app/src/selectors.ts` rather than inlining it at the
   call site.
5. Add a colocated test covering the new reducer case (and the action
   creator's output shape, if non-trivial).
6. Run `cd app && npm test` and `cd app && npm run typecheck` — both must be
   green before you're done.

Follow `.cursor/rules/`, especially `architecture.mdc`, `conventions.mdc`,
and `do-not-touch.mdc`: never edit `app/src/store.ts`, never remove/rename an
existing `Action` variant, no new npm dependencies, no `any`/`@ts-ignore`.
