---
description: "Add a new store action end-to-end via the golden path (types → reducer → actions → test)"
---

# Add Action

Add a new action to the task-board store for: $ARGUMENTS

Follow the golden path from `.cursor/rules/architecture.mdc` in exactly this
order. Do not skip a step and do not reorder them.

1. **Name it.** Derive an action `type` as `<domain>/<verb>`, matching the
   existing set: past tense for something that happened to an entity
   (`task/added`, `task/toggled`, `task/removed`), or the established
   `filter/set` shape for setting a state-level value. State the chosen name and
   payload shape before editing anything.
2. **`app/src/types.ts` — additive only.** Add the variant to the `Action` union:
   `| { type: "<name>"; payload: { ... } }`. If the request also needs a new
   field on `Task` or `AppState`, add it here too. This file is PROTECTED
   (`.cursor/rules/do-not-touch.mdc`): additions are allowed, but renaming or
   removing an existing member is not — if the request seems to need that, stop
   and ask first.
3. **`app/src/reducer.ts`.** Add a `case` to the `switch`, above `default`.
   Return a new object immutably — `{ ...state, tasks: state.tasks.map(...) }`.
   Never `push`/`splice`/assign in place. Keep the reducer pure: no `Date.now()`,
   no `Math.random()`, no I/O — anything variable arrives in the payload.
4. **`app/src/actions.ts`.** Add a creator named after the intent in camelCase,
   returning `Action` (not a narrowed literal type). It is a pure argument →
   payload mapping: no ID generation, no defaults read from global state.
5. **`app/src/selectors.ts` — only if the request implies a new derived read.**
   Pure `(state: AppState) => T`. Never mutate; `sort` needs `[...state.tasks]`.
6. **Colocated test** in `app/src/reducer.test.ts` (or a new `*.test.ts` beside
   its subject). Import explicitly: `import { describe, expect, it } from "vitest";`
   — bare globals typecheck but throw at runtime. Arrange → Act → Assert. Cover
   the happy path, the no-op case, and immutability — what the last two mean
   depends on what the action targets:
   - **task-targeting** (the payload carries a `TaskId`): the no-op case is an
     unknown id leaving `state.tasks` unchanged; for immutability assert the
     untouched task keeps identity, `expect(next.tasks[1]).toBe(prev.tasks[1])`,
     and the changed one does not, `expect(next.tasks[0]).not.toBe(prev.tasks[0])`.
   - **state-level** (`filter/set` and anything like it): the no-op case is
     dispatching the value already in state; for immutability assert the members
     the action does not own keep identity, `expect(next.tasks).toBe(prev.tasks)`.
     The reducer still returns a new state object, so never assert
     `expect(next).toBe(prev)`.
7. **Verify and report.** Run `cd app && npm run typecheck && npm test`. Both
   must be green — a clean typecheck alone is not proof. Then list the files you
   touched and the new action's `type` string.

Constraints (from `.cursor/rules/`): never touch `app/src/store.ts`; no new npm
dependency; no Redux/Zustand/MobX; named exports only; relative imports end in
`.js`; no `any`, `@ts-ignore`, or `@ts-expect-error`.

If $ARGUMENTS is empty or too vague to name a payload, ask one clarifying
question instead of guessing a shape.
