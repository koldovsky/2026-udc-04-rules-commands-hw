# A/B validation (Task D)

**Rule(s) under test:** all 7 rules in `.cursor/rules/*.mdc` (`architecture.mdc`,
`conventions.mdc`, `do-not-touch.mdc`, `testing.mdc`, `custom-lib.mdc`,
`dependencies.mdc`, `selectors.mdc`).
**Prompt (same for A and B, verbatim from `materials/ab-task.md`):**

> Add a task priority to the task board:
> - Add a `priority` field to `Task`: `"low" | "normal" | "high"` (default
>   `"normal"` for newly added tasks).
> - Add a way to change a task's priority through the normal state flow.
> - Keep everything type-safe and the existing tests green.

**Tool used:** Claude Code, via two independent, context-free subagents (no
memory of each other or of this repo's chat history; both powered by the
same model, Claude Sonnet 5) — the practical equivalent of "a new chat" for
each run, since only one Agentic IDE was available in this environment (see
the methodology note below).

## Methodology note

This exercise assumes Cursor, where `.cursor/rules/*.mdc` auto-attach by
`globs`/`alwaysApply` and "rules OFF" is just renaming them. Working from
Claude Code instead, the same ON/OFF contrast was reproduced explicitly:

- **Run A (ON):** a fresh subagent was told to read all 7 `.mdc` files under
  `.cursor/rules/` and treat them as binding, and explicitly told *not* to
  read `AGENTS.md`/`CLAUDE.md` (root or `app/`) — so only the Task A
  rule-set, not Task B's baseline doc, is the variable under test.
- **Run B (OFF):** the `.mdc` files were physically renamed to `*.mdc.off`
  (identical to the walkthrough's own recipe), and a fresh subagent was told
  no project rules exist and to disregard any `AGENTS.md`/`CLAUDE.md` content
  even if auto-surfaced by the harness.
- Both subagents got the byte-identical prompt above, ran for real against
  the actual `app/` source (not a description of a plan), and were not shown
  `materials/ab-task.md`'s "what correct looks like" answer key.
- I independently verified every claimed change with `git diff`/`git status`
  myself after each run rather than trusting the subagent's self-report, then
  reverted (`git checkout -- app/src/...`) before the next run so the two
  trials couldn't contaminate each other.
- Both trials' code changes were reverted after capturing results — per the
  walkthrough, this write-up is the graded artifact, not the code change.
  `cd app && npm test` is green at 15 tests (the original seeded baseline) in
  the final state of this repo.

## Result A — rules ON

Followed the golden path exactly:

- `app/src/types.ts` — added `Priority = "low" | "normal" | "high"`, added
  `priority: Priority` to `Task`, added one new **additive** `Action` variant
  `{ type: "task/priority-set"; payload: { id: TaskId; priority: Priority } }`
  appended after the existing variants. No existing field/variant touched.
- `app/src/reducer.ts` — `task/added` stamps `priority: "normal"`; new
  `task/priority-set` case maps the matching task immutably
  (`{ ...task, priority: action.payload.priority }`).
- `app/src/actions.ts` — added `setTaskPriority(id, priority)`.
- `app/src/actions.test.ts` (**new file**) — a direct unit test of
  `setTaskPriority`'s return shape.
- `app/src/reducer.test.ts` — extended the affected fixture/assertion for the
  new required field, plus 3 new reducer-level tests (set priority, isolation
  from other tasks, no-op on unknown id).
- `app/src/store.ts` untouched. No new npm dependency. Named exports only.
  No `any`/`@ts-ignore`. `cd app && npm test` → **19/19 green**;
  `npm run typecheck` → clean.

## Result B — rules OFF

Also landed on the golden path, with one concrete gap:

- `app/src/types.ts` — same shape of change as A: `Priority` type, `priority`
  field on `Task`, one new additive `Action` variant (named
  `"task/priority-changed"` — inserted *before* `filter/set` rather than
  appended at the end; a cosmetic/positional difference only).
- `app/src/reducer.ts` — same pattern: `task/added` defaults `priority:
  "normal"`; new case maps immutably via spread. No mutation.
- `app/src/actions.ts` — added `setTaskPriority(id, priority)` — same
  signature and style as Run A.
- **No `actions.test.ts` was created.** The new action creator's output shape
  is never directly unit-tested; coverage is only indirect, through
  `reducer.test.ts` asserting on `reducer()` output.
- `app/src/reducer.test.ts` — extended the same fixture, plus 4 new tests
  (default priority on add, change priority, immutability, unknown-id no-op).
- `app/src/store.ts` untouched. No new npm dependency. Named exports only.
  No `any`/`@ts-ignore`. `cd app && npm test` → **19/19 green**;
  `npm run typecheck` → clean.

## Difference table

| Aspect | A (rules ON) | B (rules OFF) |
|---|---|---|
| State change path | `store.dispatch` + reducer `case` | `store.dispatch` + reducer `case` (same) |
| State library added | no | no |
| Export style | named | named |
| Type safety | strict, typed union, no `any` | strict, typed union, no `any` |
| Touched protected core (`store.ts`) | no | no |
| `types.ts` change | additive only | additive only |
| New npm dependency | no | no |
| Action creator unit test | **yes** — dedicated `actions.test.ts` | **no** — only indirect coverage via reducer tests |
| New Action variant name | `task/priority-set` | `task/priority-changed` |
| Total tests after change | 19 (9 reducer + 4 store + 5 text + 1 actions) | 19 (10 reducer + 4 store + 5 text) |

## Conclusion

The headline finding is **not** the dramatic gap `materials/ab-task.md`
warns about (a state library, direct mutation, a default export) — Sonnet 5
is capable enough to infer the store/reducer/action pattern, immutability,
and named-exports style just from reading the existing `app/src` files, even
with zero project rules attached, especially since the prompt itself says
"through the normal state flow." Both runs shipped a working, type-safe,
additive change with `npm test`/`typecheck` green.

The one **concrete, rule-attributable** difference is test completeness:
`testing.mdc` explicitly says a new action creator gets "a test for the
creator's output shape," and only the rules-ON run produced one (a dedicated
`actions.test.ts`) — the rules-OFF run tested the same behavior only
indirectly through the reducer. That is a real, reproducible effect of
having an explicit, checkable rule versus leaving test-completeness to the
model's judgment call in the moment.

This also reframes what these rules are *for* with a model this capable:
less about preventing a naive model from reaching for Redux, more about
removing variance — making specific, checkable outcomes (full test coverage,
no accidental dependency, no protected-file edit, no hallucinated
`lib/text.ts` helper) consistent and auditable instead of probabilistically
"usually fine." `do-not-touch.mdc`, `dependencies.mdc`, and `custom-lib.mdc`
target exactly the failure modes that didn't happen to trigger in this one
trial — their value is in guaranteeing that on trial 20, they still don't.

## Appendix — the decisive evidence, verbatim

The one rule-attributable difference was Run A's dedicated action-creator
test. This is the entire new file Run A (rules ON) created at
`app/src/actions.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { setTaskPriority } from "./actions.js";

describe("setTaskPriority", () => {
  it("builds a task/priority-set action", () => {
    const action = setTaskPriority("a", "high");
    expect(action).toEqual({
      type: "task/priority-set",
      payload: { id: "a", priority: "high" },
    });
  });
});
```

Run B (rules OFF) created no new file at all — its `git status` after
completion listed exactly four modified files (`types.ts`, `actions.ts`,
`reducer.ts`, `reducer.test.ts`), so `setTaskPriority`'s output shape is
covered only indirectly, through reducer-level assertions. Both runs' full
diffs were verified with `git diff` by the author (not taken from the
subagents' self-reports) before the working tree was reverted; the decisive
artifact is reproduced above in full.
