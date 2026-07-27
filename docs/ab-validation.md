# A/B validation (Task D)

**Rule(s) under test:** the full guidance stack from Task A/B — `.cursor/rules/*.mdc`
(`architecture.mdc`, `conventions.mdc`, `custom-lib.mdc`, `do-not-touch.mdc`,
`state-access.mdc`, `testing.mdc`) plus root `CLAUDE.md`/`AGENTS.md` and
`app/AGENTS.md`/`app/CLAUDE.md`.

**Prompt (identical for A and B, verbatim from `materials/ab-task.md`):**

> Add a task priority to the task board:
> - Add a `priority` field to `Task`: `"low" | "normal" | "high"` (default
>   `"normal"` for newly added tasks).
> - Add a way to change a task's priority through the normal state flow.
> - Keep everything type-safe and the existing tests green.

**Tool used:** Claude Code

## Result A — rules ON

- Touched: `app/src/types.ts`, `app/src/reducer.ts`, `app/src/actions.ts`,
  `app/src/reducer.test.ts`.
- Added a `Priority` type and a `priority` field to `Task`; extended the
  `Action` union with `{ type: "task/priority-set"; payload: { id, priority } }`
  and handled it in `reducer.ts` with `state.tasks.map(...)` + object spread.
- Added `setTaskPriority(id, priority)` in `actions.ts`.
- Added 3 tests in the colocated `reducer.test.ts` (default priority on add,
  setting priority, no-op on unknown id). `npm test`: 17/17 passed.
  `npm run typecheck`: clean.
- No new dependency, named exports only, no `any`/`@ts-ignore`,
  `store.ts`/`lib/text.ts` untouched, no existing signature changed.
- Self-reported attribution: `architecture.mdc` + `app/AGENTS.md`'s "Action →
  reducer → actions → test" flow drove the implementation path;
  `do-not-touch.mdc` confirmed a new `Action` variant needs no approval while
  `store.ts` does; `conventions.mdc` drove the immutable spread/map choice,
  named exports, and — notably — the **kebab-style** action type string
  (`priority-set`); `testing.mdc` drove colocating tests in AAA style.

## Result B — rules OFF

- Touched: the same four files — `app/src/types.ts`, `app/src/reducer.ts`,
  `app/src/actions.ts`, `app/src/reducer.test.ts`.
- Added the same `Priority` type and `priority` field; extended `Action` with
  `{ type: "task/priority_set"; payload: { id, priority } }` and handled it in
  `reducer.ts`, also via `.map()` + spread.
- Added `setTaskPriority(id, priority)` in `actions.ts`, dispatched normally
  (no bypass).
- Added 2 tests in `reducer.test.ts` (set priority, no-op on unknown id) and
  updated 2 existing tests for the new required field. `npm test`: 17/17
  passed. `npm run typecheck`: clean.
- No new dependency, named exports only, no `any`/`@ts-ignore`,
  `store.ts`/`lib/text.ts` untouched.
- Self-reported basis: purely the **in-file header comments** already present
  in `types.ts` ("discriminated union... add new variants here first"),
  `reducer.ts` ("NEVER mutates state in place"), and `actions.ts`
  ("action creators... call these helpers") — plus pattern-matching the
  existing `task/toggled` case. No project doc was consulted; it did not
  reach for `useState`, a state library, or direct mutation.

## Difference table

| Aspect | A (rules ON) | B (rules OFF) |
|---|---|---|
| State change path | `Action` union → `reducer.ts` → `setTaskPriority` action creator | Same |
| Immutability | `map` + spread | `map` + spread |
| State library added | No | No |
| Export style | Named | Named |
| Type safety | Strict, no `any` | Strict, no `any` |
| Touched protected core? | No (`store.ts`, `lib/text.ts` untouched) | No |
| New action type string | `"task/priority-set"` (kebab, matches `conventions.mdc`'s explicit kebab-case rule) | `"task/priority_set"` (snake_case, a generic/Redux-y default) |
| Tests added/updated | 3 new | 2 new + 2 updated |
| Reasoning basis (self-reported) | Named specific rule files (`architecture.mdc`, `do-not-touch.mdc`, `conventions.mdc`, `testing.mdc`) as driving each decision | Inferred entirely from in-code header comments + pattern-matching a neighboring `switch` case |

## Conclusion

Both runs got the architecture right — no `useState`, no direct mutation, no
default export. That surprised me; I expected rules-OFF to break something.
It didn't, because the code's own comments already explain the conventions.

The rules did change one thing: naming. ON picked `"task/priority-set"`
(kebab-case, per `conventions.mdc`). OFF picked `"task/priority_set"`
(snake_case) — nothing was there to stop it.

So here, rules mostly help with small style choices, not big mistakes. They'd
probably matter more on a prompt that touches `lib/text.ts` or `store.ts`,
where the code comments don't already cover you.

There's also a second benefit that doesn't show up in the diff: with rules
ON, the agent could say *why* — "conventions.mdc says kebab-case" — instead of
just doing something and hoping it matched. That's worth more once the app
grows past the size where every file has a helpful header comment; comments
drift out of date, rules are what you actually maintain.

Takeaway: don't judge this rule-set only by "did it stop a disaster." On a
small, well-commented app like this one, judge it by whether it makes the
AI's choices consistent and explainable — it does.
