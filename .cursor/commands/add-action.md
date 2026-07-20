---
description: "Add a new Action variant through types → reducer → creator → test"
---

Add a new store action for: $ARGUMENTS

Follow the golden path and project rules in `.cursor/rules/` (architecture,
conventions, do-not-touch, testing, no-new-deps). Custom store only — NOT
Redux/Zustand.

1. Read `app/src/types.ts`, `app/src/reducer.ts`, `app/src/actions.ts`, and
   existing `*.test.ts` to match current patterns
2. Add a new variant to the `Action` discriminated union in `app/src/types.ts`
   (and domain fields only if the request clearly needs them)
3. Handle the new action in `app/src/reducer.ts` with an **immutable** update
   (spread / `map` / `filter` — never mutate `state` in place)
4. Add a named-export action creator in `app/src/actions.ts` (no default export;
   do not change existing creator signatures — only add)
5. Add or extend a colocated vitest test (AAA: Arrange → Act → Assert), e.g. in
   `app/src/reducer.test.ts`
6. Do **not** edit `app/src/store.ts`. Do **not** add npm packages. No `any`,
   no `@ts-ignore`
7. Run `cd app && npm test` (and `npm run typecheck` if useful) and fix until green

Summarize what you changed and how to dispatch the new action.
