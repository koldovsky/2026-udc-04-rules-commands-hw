---
description: "Add a new store action end-to-end: Action variant → reducer case → action creator → test"
---

# /add-action

Add a new action to the task-board store for: $ARGUMENTS

Follow the golden path from `materials/architecture-brief.md`, in this exact
order:

1. **types.ts** — add ONE new variant to the `Action` discriminated union in
   `app/src/types.ts` (name it `domain/eventPastTense`, e.g. `task/prioritized`).
   If the feature needs a new field on a domain type, add it here too with an
   explicit union type, not `string`. Touch nothing else in this file.
2. **reducer.ts** — handle the new variant in `app/src/reducer.ts` with an
   IMMUTABLE update (spread / `map` / `filter`; never mutate `state`).
3. **actions.ts** — add a named-export action creator in `app/src/actions.ts`
   returning the new `Action` object.
4. **Test** — add an Arrange–Act–Assert case to `app/src/reducer.test.ts`
   covering the new action, including that the previous state object is not
   mutated.
5. **Verify** — run `cd app && npm test` and `npm run typecheck`; both must be
   green before you finish.

Constraints (from `.cursor/rules/`): do not modify `app/src/store.ts`; no new
npm dependencies; no `any` / `@ts-ignore` / `@ts-expect-error`; named exports
only.
