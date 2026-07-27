---
description: "Add a new Action variant end-to-end along the golden path"
---

# Add action

Add a new state action for: $ARGUMENTS

1. Add an `Action` variant (a new `type` + `payload`) to the `Action` union in
   `app/src/types.ts`. If the feature needs a new field on `Task` or `AppState`,
   add it here too (additive only).
2. Handle the new action in `app/src/reducer.ts` with a new `case`, returning a
   NEW state object immutably (spread / `map` / `filter` — no mutation).
3. Add a named action creator in `app/src/actions.ts` that returns the typed
   `Action`.
4. Add colocated tests covering the happy path and immutability (AAA style,
   vitest): put the action-creator test in `app/src/actions.test.ts` beside
   `actions.ts`, while the reducer-case test may stay in `app/src/reducer.test.ts`.
5. Run `cd app && npm test` and `npm run typecheck`; both must be green.

Follow the project conventions in `.cursor/rules/` (custom store — NOT
Redux/Zustand; named exports; immutable updates; no `any`/`@ts-ignore`; do not
touch `app/src/store.ts` or edit `app/src/types.ts` beyond agreed additions).
