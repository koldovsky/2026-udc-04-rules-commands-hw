---
description: "Add a new Action variant end-to-end (types → reducer → action creator → test)"
---

# Add Action

Add a new action for: $ARGUMENTS

1. Add a new variant to the `Action` discriminated union in
   `app/src/types.ts` (`type` + `payload` shape), following the existing
   variants' naming style (e.g. `"task/added"`).
2. Handle the new variant in `app/src/reducer.ts`, returning a new state
   object immutably (spread/`map`/`filter` — never mutate in place).
3. Add a matching action creator in `app/src/actions.ts` whose parameters map
   1:1 to the new `payload` fields.
4. Add a colocated test (`app/src/reducer.test.ts` and/or
   `app/src/actions.test.ts`) covering the new variant, in Arrange-Act-Assert
   style.
5. Do not edit `app/src/store.ts`, and do not change existing `Action`
   variants or existing action-creator signatures — only add.

Follow the project conventions in `.cursor/rules/` (custom store — NOT
Redux/Zustand; named exports; no `any`; immutable updates; do not touch
`app/src/store.ts` or existing `app/src/types.ts` entries beyond agreed
additions). Run `cd app && npm test` after and confirm it's green.
