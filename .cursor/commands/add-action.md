---
description: "Add a new store action via the golden path (types → reducer → creator → test) for the request in $ARGUMENTS"
---

Add a new action to the task-board app for this feature request: $ARGUMENTS

If $ARGUMENTS is empty, ask for the feature request and stop.

1. Read `app/src/types.ts`, `app/src/reducer.ts`, `app/src/actions.ts`, `app/src/reducer.test.ts`, and the rules `architecture.mdc`, `do-not-touch.mdc`, `conventions.mdc`, `testing.mdc` in `.cursor/rules/`. Work from the code as it is now; do not assume known defects.
2. Stop and ask before continuing if the request needs any change to `app/src/store.ts`, a non-additive change to `app/src/types.ts`, or a new npm dependency (`no-new-deps.mdc`).
3. In `app/src/types.ts`, add one variant to the `Action` union only, with `type: "domain/pastTense"` (e.g. `"task/renamed"`) and a typed `payload`. Do not edit existing variants or types. Running this command counts as approval for this additive edit only.
4. In `app/src/reducer.ts`, add a `case` for the new type that returns a new state object (spread, `map`, `filter`); never mutate `state`.
5. In `app/src/actions.ts`, add a named-export creator (e.g. `renameTask(id, title): Action`). Keep existing creator signatures unchanged.
6. In `app/src/reducer.test.ts`, add Arrange-Act-Assert tests that build actions via the new creator:
   - the happy path;
   - an edge case (e.g. unknown id leaves the tasks unchanged);
   - purity: the input state is unchanged and `expect(next).not.toBe(prev)`.
7. Run `cd app; npm test; npm run typecheck`. Fix failures in your own changes and re-run until both pass.

Final report:
- the files changed, each with a one-line summary;
- the new `Action` type and creator signature;
- the test and typecheck results (pass/fail counts).
