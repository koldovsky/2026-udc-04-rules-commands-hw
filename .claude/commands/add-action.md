---
description: "Add a new Action variant end-to-end: types.ts -> reducer.ts -> actions.ts -> colocated test"
---

Add a new action to the task-board app for: $ARGUMENTS

Follow the golden path of this project — do NOT invent a new state mechanism.

1. **Restate the plan first** (one short list): the action `type` string, the
   payload shape, the reducer behavior, the creator name, the tests. If
   `$ARGUMENTS` is ambiguous (missing payload fields, unclear semantics), ask
   ONE clarifying question before writing code.
2. **`app/src/types.ts`** — add exactly one variant to the `Action`
   discriminated union, in the `domain/event` naming style
   (`"task/renamed"`, `"filter/set"`). Add an optional field to `Task`/
   `AppState` only if the feature truly needs stored data. This file is
   protected: the diff must be **purely additive** — never modify or remove
   existing members. If more than an additive change is needed, stop and ask.
3. **`app/src/reducer.ts`** — handle the new variant in the `switch`. Return
   new objects/arrays (spread / `map` / `filter`); never mutate. Unknown ids
   must leave the state effectively unchanged. Keep the reducer pure: no
   `Date.now()`, `Math.random()`, `fetch`, or logging — pass such values in
   via the payload.
4. **`app/src/actions.ts`** — add a named action creator returning `Action`,
   camelCase, named after the intent (`renameTask` for `"task/renamed"`), with
   explicit parameter types and no logic beyond building the payload.
5. **`app/src/selectors.ts`** — if the feature implies a derived read, add a
   pure selector here instead of filtering `state.tasks` in consumers.
6. **`app/src/reducer.test.ts`** (colocated, vitest) — add at least:
   - a happy-path test built via the new action creator;
   - an immutability test (`expect(next).not.toBe(prev)` and the previous
     state untouched);
   - an edge case (unknown id / no-op).
7. **Verify and report**: run `cd app && npm run typecheck && npm test`, paste
   the result, and list the changed files plus the exact `types.ts` diff for
   review.

Constraints: no new npm dependencies; no `any`/`@ts-ignore`; named exports
only; relative imports end in `.js`. Do not edit `app/src/store.ts`.

Follow the project conventions in `.cursor/rules/` (`architecture.mdc`,
`do-not-touch.mdc`, `conventions.mdc`, `state-access.mdc`, `testing.mdc`,
`dependencies.mdc`) and `app/AGENTS.md`.

