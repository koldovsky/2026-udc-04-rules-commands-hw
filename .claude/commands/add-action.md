---
description: "Add a new store Action end-to-end (types → reducer → creator → test)"
---

Add a new store action for: $ARGUMENTS

Walk the golden path for the custom store — do NOT reach for a state library and
do NOT mutate state:

1. **types.ts** — add a new variant to the `Action` discriminated union in
   `app/src/types.ts` (e.g. `{ type: "task/…"; payload: { … } }`). If the feature
   needs a new field on `Task`, add it here too. This is the only sanctioned edit
   to the protected core — keep it additive.
2. **reducer.ts** — handle the new `action.type` in the `switch` in
   `app/src/reducer.ts`, returning a new state **immutably** (spread / `map` /
   `filter`, never in-place mutation). Keep the `default: return state` branch.
3. **actions.ts** — add a named action-creator in `app/src/actions.ts` that
   returns the action object (match the style of `addTask` / `toggleTask`).
4. **test** — add/extend a colocated `app/src/reducer.test.ts` case in vitest AAA
   style (Arrange initial state → Act dispatch/reduce → Assert new state), and a
   creator test if useful.
5. **verify** — run `cd app && npm run typecheck && npm test`; both must be green.

Constraints: named exports only; no `any` / `@ts-ignore`; no new npm
dependencies; do not edit `app/src/store.ts`.

Follow the project conventions in `.cursor/rules/` (custom store — NOT
Redux/Zustand; named exports; immutable updates; do not touch `app/src/store.ts`
or `app/src/types.ts` beyond agreed additions).
