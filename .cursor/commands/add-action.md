---
description: "Add a new Action: types → reducer → action creator → colocated test"
---

# Add action

Add a new store action for: $ARGUMENTS

Follow the golden path and project rules in `.cursor/rules/` (especially
`architecture.mdc`, `do-not-touch.mdc`, `conventions.mdc`, `testing.mdc`,
`actions-selectors.mdc`). Custom store only — NOT Redux/Zustand/MobX.

1. Clarify the action name (`type` discriminant) and payload shape from
   `$ARGUMENTS`. If unclear, ask before editing.
2. Add a new variant to the `Action` union in `app/src/types.ts` (this is an
   agreed addition for this command — keep existing variants unchanged).
3. Handle the new case in `app/src/reducer.ts` with an **immutable** update
   (spread / `map` / `filter`). No in-place mutation.
4. Add a named action creator in `app/src/actions.ts` that returns the new
   `Action`. Do not change existing creators' signatures.
5. Add or extend a colocated vitest test (`app/src/reducer.test.ts` or a new
   `*.test.ts`) using AAA and the new creator. Cover the happy path; if state
   changes, assert immutability (previous state unchanged / not the same ref).
6. Do **not** edit `app/src/store.ts`. Do **not** add npm packages. No `any` /
   `@ts-ignore`. Named exports only.
7. Run `cd app && npm test` (and `npm run typecheck` if practical) and fix until
   green.

Summarize: files touched, action `type`, creator name, and test coverage.
