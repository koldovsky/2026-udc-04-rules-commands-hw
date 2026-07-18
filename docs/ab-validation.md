# A/B validation (Task D)

**Rule(s) under test:** the full set in `.cursor/rules/` — primarily
`architecture.mdc`, `do-not-touch.mdc`, `conventions.mdc`, `testing.mdc`,
`no-new-dependencies.mdc` — plus the generalized `app/AGENTS.md` baseline.
**Prompt (same for A and B):** the change request from `materials/ab-task.md`
(add a `priority` field + a way to change it), pasted verbatim, new
agent/chat for each run.
**Tool used:** Claude Code (each scenario run as a fresh agent with a clean
context). For scenario B, ALL guidance files were disabled by renaming:
`.cursor/rules/*.mdc → *.mdc.off`, `app/AGENTS.md`, `app/CLAUDE.md`, root
`AGENTS.md`/`CLAUDE.md` → `*.off`. After capturing the B result the code was
reverted (`git checkout -- app/`) and the rules restored before running A.

## Result A — rules ON

Followed the golden path exactly and **explicitly cited the rules** it was
complying with ("per the do-not-touch rule's sanctioned extensions",
"no assertions weakened or removed"):

- `types.ts`: additions only — `TaskPriority` union type, `priority: TaskPriority`
  on `Task`, new `Action` variant `task/prioritySet`.
- `reducer.ts`: `task/added` defaults `priority: "normal"`; new immutable
  `task/prioritySet` case (`map` + spread, no-op for unknown id).
- `actions.ts`: named-export creator `setTaskPriority(id, priority)`.
- `reducer.test.ts`: **4 new AAA tests** — default priority on add, setting
  priority, an explicit immutability check for the new case, no-op for
  unknown id.
- Did not touch `store.ts`, `selectors.ts`, `lib/text.ts`. No new deps, no
  `any`, named exports. Ran both `npm test` (19 passed) **and**
  `npm run typecheck` before finishing.

## Result B — rules OFF

Better than the "worst case" the task warns about — no Redux/Zustand, no
mutation, no default exports (see the caveat in the conclusion) — but visibly
less disciplined:

- Same overall shape: `Priority` type + `task/prioritySet` variant in
  `types.ts`, immutable reducer case, `setTaskPriority` creator.
- Only **2 new tests**, and **no immutability test** for the new reducer case
  — the immutability guarantee went unverified.
- No self-imposed "additions only" constraint on `types.ts` — it edited the
  protected file freely and never mentioned the protected-core notion.
- No reference to conventions at all; compliance was incidental, not stated —
  nothing would have stopped it from drifting on a harder task.

## Difference table

| Aspect | A (rules ON) | B (rules OFF) |
|---|---|---|
| State change path | dispatch + reducer, explicitly "golden path" | dispatch + reducer (incidental) |
| State library added | no — rule cited | no — by luck of strong code comments |
| Export style | named — rule cited | named — uncited |
| Type safety | strict union `TaskPriority`, typecheck run | strict union `Priority`, typecheck run |
| Touched protected core? | additions-only in `types.ts`, cited do-not-touch rule | edited `types.ts` with no awareness it was protected |
| Tests added | 4 (incl. explicit immutability test for the new case) | 2 (no immutability coverage for the new case) |
| Awareness of constraints | quotes rules, verifies against them | none stated |

## Conclusion

The rules changed behaviour, but less dramatically than expected — the gap
showed up in **discipline and verification**, not architecture. The reason:
this codebase's inline comments (`PROTECTED CORE`, "deliberately NOT Redux")
already act as embedded rules, so scenario B still found the golden path.
The rules earned their keep at the margin: with them ON the agent treated
`types.ts` as guarded (additions only, said so out loud), added double the
test coverage including an immutability check required by `testing.mdc`, and
checked its own work against the rule set. Takeaway: rules matter most where
the code can't speak for itself — and `do-not-touch.mdc` + `testing.mdc`
mattered most here.
