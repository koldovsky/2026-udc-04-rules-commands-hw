---
description: "Add a new store action end-to-end via the golden path (types → reducer → actions → test)"
---

Add a new action to the task-board store for: $ARGUMENTS

Follow the golden path from `.cursor/rules/architecture.mdc` in exactly this
order. Do not skip a step and do not reorder them.

1. **Name it.** Derive an action `type` in `domain/pastTense` form, matching the
   existing `task/added`, `task/toggled`, `task/removed`, `filter/set`. State the
   chosen name and payload shape before editing anything.
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
   the happy path, a no-op case (unknown id), and immutability: assert untouched
   items keep identity, `expect(next.tasks[1]).toBe(prev.tasks[1])`.
7. **Verify and report.** Run `cd app && npm run typecheck && npm test`. Both
   must be green — a clean typecheck alone is not proof. Then list the files you
   touched and the new action's `type` string.

Constraints (from `.cursor/rules/`): never touch `app/src/store.ts`; no new npm
dependency; no Redux/Zustand/MobX; named exports only; relative imports end in
`.js`; no `any`, `@ts-ignore`, or `@ts-expect-error`.

If $ARGUMENTS is empty or too vague to name a payload, ask one clarifying
question instead of guessing a shape.
