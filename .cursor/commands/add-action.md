---
description: "Add a new Action end-to-end: types.ts -> reducer.ts -> actions.ts -> test"
---

# Add Action

Add a new action for: $ARGUMENTS

1. Add a new variant to the `Action` union in `app/src/types.ts` (discriminated
   on `type`, with a `payload` if needed).
2. Handle it with a new `case` in the reducer in `app/src/reducer.ts`,
   returning a new state object immutably (spread/`map`/`filter` — never
   mutate `state` in place).
3. Add a matching action creator in `app/src/actions.ts`.
4. Add a colocated test (`app/src/reducer.test.ts` and/or
   `app/src/actions.test.ts`) covering the new behavior.
5. Run `cd app && npm test` and `npm run typecheck` and confirm both pass.

Follow `.cursor/rules/`: dispatch-only state changes, no state library, no
`any`/`@ts-ignore`, and do not change existing signatures in `app/src/store.ts`
or `app/src/types.ts` beyond this new addition.
