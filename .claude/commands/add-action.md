---
description: "Add a new Action variant end-to-end: types.ts union -> reducer case -> action creator -> colocated test"
---

# /add-action

Add a new state transition to the task board for: $ARGUMENTS

Walk the app's golden path in this exact order — do not skip a step, and do not
invent a shortcut such as a setter on the store or a second store.

1. **Ask before touching the protected core.** `app/src/types.ts` is protected;
   get explicit approval in this turn before editing it. Once approved the edit
   may ONLY ADD — append a variant to the `Action` union (`app/src/types.ts:33-38`)
   and, if the feature needs one, an optional field on `Task`. NEVER rename,
   reorder, retype, or narrow an existing member.
2. **Name the action `"domain/event"`, lowercase**, copying the closest sibling:
   task events are past tense (`task/added`, `task/toggled`, `task/removed`),
   filter stays imperative (`filter/set`). NEVER SCREAMING_SNAKE. Keep the payload
   shape inside the union — call sites must never encode it.
3. **Handle it in `app/src/reducer.ts`**, in a new `case` placed before the
   `default:` arm at `app/src/reducer.ts:48`. Update immutably: spread, `map`,
   `filter` — never `push`, `splice`, `sort`, or field assignment. The reducer
   stays pure and exhaustive.
4. **Add a named-export creator in `app/src/actions.ts`** with an explicit
   `Action` return type, modelled on `addTask` (`app/src/actions.ts:9-11`). It is
   the only sanctioned way to build this action — no hand-written object literals
   at call sites.
5. **Add a colocated test in `app/src/reducer.test.ts`.** Import explicitly
   (`import { describe, expect, it } from "vitest"` — globals are off at run
   time), use `it()` not `test()`, name the case as a lowercase behavioral
   sentence without "should", and follow arrange / act / assert. Assert the new
   behavior AND that the previous state object was not mutated.
6. **Verify:** `cd app && npm test && npm run typecheck` — both green, and no
   pre-existing test edited to fit the new behavior.

Hard constraints for this command: no `any`, `as any`, `@ts-ignore`,
`@ts-expect-error`, or non-null `!`; no `export default`; no new npm dependency;
no edits to `app/src/store.ts`; relative imports keep their `.js` extension.

Follow the project conventions in `.cursor/rules/` — `architecture.mdc` (the
golden path), `do-not-touch.mdc` (protected core), `state-access.mdc` (creators
and selectors are the only entry points), `conventions.mdc`, `testing.mdc`,
`dependencies.mdc`.
