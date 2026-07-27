---
description: "Add a new Action variant end-to-end: types.ts -> reducer.ts -> actions.ts -> test"
---

# Add a new Action variant

Add a new `Action` variant for: $ARGUMENTS

1. Add the variant to the `Action` discriminated union in `app/src/types.ts`
   — additive only, don't rename/remove existing variants.
2. Handle it in `app/src/reducer.ts`: add a `case` arm that returns a new
   state object (immutable — spread/`map`/`filter`, never mutate in place).
3. Add a matching creator in `app/src/actions.ts`, named like the existing
   ones (`addTask`, `toggleTask`, `removeTask`, `setFilter`), with a `type`
   string of `"<domain>/<lowercase verb>"`.
4. Add colocated tests: a happy-path + edge-case test for the new creator in
   `app/src/actions.test.ts`, and a happy-path + edge-case test for the
   reducer case in `app/src/reducer.test.ts`.
5. Run `cd app && npm test && npm run typecheck` — both must pass.

Follow `.cursor/rules/` — especially `architecture.mdc`, `action-creators.mdc`,
`do-not-touch.mdc` (never edit `app/src/store.ts`), `conventions.mdc`, and
`testing.mdc`. No new npm dependency (`dependencies.mdc`).
