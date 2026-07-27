# A/B validation (Task D)

**Rule(s) under test:** `AGENTS.md`, `CLAUDE.md`, `app/AGENTS.md`, `app/CLAUDE.md`,
and all 8 `.cursor/rules/*.mdc` files — `action-creators.mdc`, `architecture.mdc`,
`conventions.mdc`, `custom-lib.mdc`, `dependencies.mdc`, `do-not-touch.mdc`,
`selectors.mdc`, `testing.mdc`.

**How rules were disabled for Result B:** in an isolated git worktree branched
from this PR's tip, every file listed above was renamed aside with a `.off`
suffix (e.g. `conventions.mdc` → `conventions.mdc.off`), per
`docs/templates/ab-validation.md`'s prescribed method, then a brand-new agent
session (no memory of this repo's rules) was given the prompt below with no
access to their content.

**Prompt (verbatim, same for A and B), from `materials/ab-task.md`:**

> Add a task **priority** to the task board:
>
> - Add a `priority` field to `Task`: `"low" | "normal" | "high"` (default
>   `"normal"` for newly added tasks).
> - Add a way to change a task's priority through the normal state flow.
> - Keep everything type-safe and the existing tests green.

**Tool used:** Claude Code.

## Result A — rules ON

**Files changed:** `app/src/types.ts`, `app/src/actions.ts`, `app/src/reducer.ts`,
`app/src/reducer.test.ts`, `app/src/actions.test.ts`.

Extended `Action` with a `task/prioritized` variant, added `priority: Priority`
to `Task`, handled it immutably in the reducer (`map`+spread), and added
`setTaskPriority(id, priority)` — name matches the `set*` precedent from
`setFilter`, and the action type keeps the past-tense pattern every other
`task/*` action already uses (`added`, `toggled`, `removed`, `cleared`). Added
2 reducer tests (happy path + unknown-id edge case) and 2 action-creator tests
(happy path + low-priority boundary), and fixed 2 stale `Task` literals in
existing tests to include the new field. Named exports, no `any`, no new
dependency, `store.ts` untouched.

## Result B — rules OFF

**Files changed:** the same five files: `app/src/types.ts`, `app/src/actions.ts`,
`app/src/reducer.ts`, `app/src/reducer.test.ts`, `app/src/actions.test.ts`.

Architecture converged with Result A end to end: `dispatch`+reducer, immutable
updates (`map`+spread), named exports only, no `any`, no new dependency,
`store.ts` untouched. The action creator was even named `setTaskPriority(id,
priority)` — identical to Result A — a strong, mechanical `set*` precedent the
agent picked up just from reading the existing `setFilter` in `actions.ts`.
Added 4 tests (1 action-creator test + 3 reducer tests: a happy path, an
unknown-id no-op edge case, and a check that new tasks default to
`"normal"` priority) — tied with Result A's raw count of 4, but less
disciplined in shape: the default-priority test duplicates ground already
covered by the updated `"adds a task"` literal (which itself asserts
`priority: "normal"`), and the creator test has no boundary-value
counterpart — Result A additionally covers a `"low"` priority boundary case
for `setTaskPriority`, Result B only covers `"high"`.

Where it diverged: the action **type string** was `"task/priority-set"` — it
mirrored the `"filter/set"` naming pattern instead of the past-tense pattern
every other `task/*` action uses (`task/added`, `task/toggled`,
`task/removed`, `task/cleared`). Nothing makes that inconsistency visible or
costly today, but it's exactly the drift `action-creators.mdc`'s explicit
past-tense rule exists to prevent.

## Difference table

| Aspect | A (rules ON) | B (rules OFF) |
|---|---|---|
| State change path | dispatch + reducer | dispatch + reducer |
| State library added | no | no |
| Export style | named | named |
| Type safety | strict, no `any` | strict, no `any` |
| Action creator name | `setTaskPriority` | `setTaskPriority` (same) |
| Action type string | `task/prioritized` (past tense, matches siblings) | `task/priority-set` (breaks past-tense pattern) |
| Test coverage | 4 new tests: happy path + edge/boundary case for *both* reducer and creator | 4 new tests, but 1 reducer test is redundant with an existing literal, and the creator has no boundary case |
| Touched protected core? | no | no |

## Conclusion

The ON/OFF gap was narrower than expected: this repo has no UI layer, so the
classic "rules OFF" traps (`useState`, direct mutation) couldn't occur — both
runs converged on the same architecture (dispatch + reducer, immutable, named
exports).

The real difference was naming and test rigor:

- **ON:** `setTaskPriority`, type `task/prioritized` — past tense, matches
  every sibling `task/*` action. 4 tests: happy path + boundary case, for
  both the reducer and the creator.
- **OFF:** same creator name, but type `task/priority-set` — breaks the
  past-tense convention. 4 tests too, but one re-asserts a default the
  updated literal already covers, and the creator has no boundary case.

`action-creators.mdc` and `testing.mdc` mattered most in this case — without them, the
naming drift and the missed boundary case are invisible today, but compound
as more actions get added.
