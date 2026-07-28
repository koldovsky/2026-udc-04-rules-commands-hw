# A/B validation (Task D)

**Rule(s) under test:** `architecture.mdc`, `conventions.mdc`, `do-not-touch.mdc`,
`testing.mdc`, `read-through-selectors.mdc`, `no-new-dependencies.mdc`.
**Prompt (same for A and B):** the change request from `materials/ab-task.md` —
add a `priority` field to `Task` (`"low" | "normal" | "high"`, default `"normal"`
for newly added tasks) and a way to change it through the normal state flow,
type-safe, existing tests green.
**Tool used:** Claude Code (model Opus 4.8). To isolate the rules as the only
variable, each run was a **fresh, independent subagent** started from a pristine
`app/`, using the **same model**. Run B was explicitly forbidden from reading
`.cursor/`, `AGENTS.md`, or `CLAUDE.md`; Run A was pointed at the rules +
`app/AGENTS.md`. The rules-ON result (Run A) is the change kept in the repo.

## Result A — rules ON

Followed the golden path and, notably, kept the change **backward-compatible**:

- `types.ts`: added `Priority` union, a **`task/prioritized`** `Action` variant,
  and an **optional** `priority?: Priority` on `Task` (additive).
- `reducer.ts`: handled `task/prioritized` **immutably** (`map` + spread).
- `actions.ts`: added named creator `setTaskPriority(id, priority)`.
- `selectors.ts`: added a **`taskPriority(task)` read helper** that resolves the
  default (`task.priority ?? "normal"`) — the "default normal" requirement is
  honored **at read time** through a selector.
- Tests: appended new AAA cases to `reducer.test.ts` and created a colocated
  `selectors.test.ts`. **Zero seeded test assertions were modified.**
- No npm dependency; named exports; no `any`; `store.ts` untouched.
- `npm run typecheck` clean; `npm test` → 21 passed.

## Result B — rules OFF

Read only `app/src/`. Because the seeded code is heavily commented and
opinionated, the unguided run still inferred the dispatch + reducer pattern — it
did **not** reach for a state library, mutate state, use `any`, or edit
`store.ts`. The divergence was in **blast radius and design**:

- `types.ts`: added `Priority`, the `task/prioritized` variant, and a
  **required** `priority: Priority` on `Task`.
- `reducer.ts`: `task/added` sets `priority: "normal"` at **write time**; handled
  `task/prioritized` immutably.
- `actions.ts`: added `setTaskPriority(id, priority)`.
- **Because `priority` was required, two existing seeded tests no longer
  compiled**, so the run **edited those seeded assertions** (the `toEqual` in
  "adds a task as not done" and the `Task` literal in the unknown-id test) to add
  `priority: "normal"`. No selector was added (reads would touch `.priority`
  directly).
- No npm dependency; named exports; no `any`; `store.ts` untouched.
- `npm test` → 17 passed (after modifying the seeded cases).

## Difference table

| Aspect | A (rules ON) | B (rules OFF) |
|---|---|---|
| State change path | `dispatch` → reducer (`task/prioritized`) + `setTaskPriority` creator | Same — `dispatch` → reducer + creator |
| `priority` field | **optional** (`priority?`), default resolved at read time | **required**, default written in reducer |
| Seeded tests modified | **none** (backward-compatible) | **2 seeded assertions edited** to compile |
| Read path | **`taskPriority` selector added** (read-through-selectors) | none — direct field access |
| State library added | no | no |
| Export style | named | named |
| Type safety | strict, typed `Priority`, no `any` | strict, typed `Priority`, no `any` |
| Touched protected core (`store.ts`)? | no | no |
| New dependency | no | no |
| Tests | 21 passed | 17 passed |

## Conclusion

**The expected disaster didn't happen — and that is the honest surprise.** The
premise of `materials/ab-task.md` is that a rules-OFF AI typically pulls in
Redux/Zustand, mutates `state.tasks[i].priority` directly, uses `any`, adds a
default export, or edits the protected `store.ts`. My rules-OFF run did **none**
of that. The reason is the seeded code itself: `app/src/` is dense with guiding
comments ("PROTECTED CORE", "add a variant to the `Action` union… then handle it
here", "never mutates state in place") and a clean, consistent structure, so a
capable model infers the dispatch + reducer golden path on its own. The code is
already doing much of the job the rules were written to do.

**So the rules changed the outcome not in *whether* the feature worked, but in
its blast radius.** Both runs added `priority` correctly; they split on one
design choice with real consequences:

- **Rules OFF** made `priority` a **required** field. That broke the two existing
  seeded tests (their `Task` literals were missing the new field), so the run
  **reached into working seeded tests and edited them** to compile.
- **Rules ON** made `priority` **optional** and resolved the "default normal"
  requirement at read time via a new `taskPriority` selector
  (`task.priority ?? "normal"`), leaving **every seeded test untouched** — a
  purely additive, backward-compatible change.

**Which rules caused the better outcome:** `read-through-selectors` (the ON run
built a selector for the default instead of touching the field directly) and the
`testing` / `do-not-touch` intent of keeping existing tests green with minimal,
additive edits.

**Takeaway:** on a messy codebase, rules stop catastrophes; on a well-structured
one where the model already behaves reasonably, they still add value by biasing
the AI toward the **smaller, safer, more backward-compatible diff**. That nuance
— rather than a blunt "ON = good, OFF = broken" — is exactly what the A/B test is
meant to reveal instead of assume.

**Caveat:** this is a single trial with one capable model on a heavily commented
codebase. A weaker model, or a less self-documenting codebase, would likely
surface the louder divergence the ticket predicts (a state library, direct
mutation, `any`), where the rules' catastrophe-prevention value would reappear.
