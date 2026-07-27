---
description: "Add a new Action end-to-end: types.ts union -> reducer.ts case -> actions.ts creator -> colocated test"
---

Add a new action for: $ARGUMENTS

1. Add the new variant to the `Action` discriminated union in `app/src/types.ts`
   (domain/event `type` string, e.g. `"task/somethingHappened"`, with a
   `payload` object). Do not change any existing union member or other shape
   in that file.
2. Handle the new case in the `switch` inside `app/src/reducer.ts`. Return a
   new state object built immutably (spread, `map`, `filter`) — never mutate
   `state` or `state.tasks` in place.
3. Add a matching action creator in `app/src/actions.ts` that builds and
   returns the new `Action`, following the existing creators' shape.
4. Add a colocated AAA-style test in `app/src/reducer.test.ts` (see the
   existing tests there for the pattern) that dispatches the new action
   creator through `reducer` and asserts the resulting state.
5. Run `cd app && npm test && npm run typecheck` and confirm both pass.

Follow `.cursor/rules/architecture.mdc`, `.cursor/rules/conventions.mdc`,
`.cursor/rules/testing.mdc`, and `.cursor/rules/do-not-touch.mdc`: state
changes only via `store.dispatch(action)`, no Redux/Zustand/MobX, named
exports only, no `any`/`@ts-ignore`, immutable updates, and do not touch
`app/src/store.ts` (don't change existing shapes in `app/src/types.ts` beyond
adding the new union member).
