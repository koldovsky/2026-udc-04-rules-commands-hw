# A/B validation (Task D)

> Copy to `docs/ab-validation.md` and fill in. Run the SAME prompt twice — once
> with rules ON, once with rules OFF (rename `.mdc` → `.mdc.off` or move them
> aside), in a NEW chat each time.

**Rule(s) under test:** 
architecture.mdc, conventions.mdc, depencencies.mdc, testing.mdc

**Prompt (same for A and B):**
the change request from `materials/ab-task.md`
(add a `priority` field + a way to change it).

**Tool used:** 
Claude Code Sonnet 5 (added instruction to CLAUDE.md: ALWAYS APPLY rules @.cursor/rules/*.mdc)

## Result A — rules ON

store.ts untouched, types.ts diff is purely additive, no any/@ts-ignore/export default. Everything follows the golden path.
No any, no @ts-ignore, no default exports, no new dependency, and store.ts was not modified. Overall: the agent did the priority task well

The implementation matches materials/ab-task.md well:

- app/src/types.ts:11: added Priority = "low" | "normal" | "high".
- app/src/types.ts:17: added priority to Task.
- app/src/types.ts:35: added a typed action variant.
- app/src/actions.ts:25: added setTaskPriority.
- app/src/reducer.ts:21: new tasks default to "normal".
- app/src/reducer.ts:46: priority changes go through reducer state flow and are immutable.
- app/src/reducer.test.ts:65: colocated tests cover priority default, update, and immutability.
  
npm test (19 tests) and npm run typecheck both pass.

## Result B — rules OFF

- app/src/types.ts: added Priority = "low" | "normal" | "high", added priority: Priority to Task, added task/priority-set action variant.
- app/src/reducer.ts: task/added now defaults new tasks to priority: "normal"; new task/priority-set case updates a task's priority immutably (no-op for unknown id).
- app/src/actions.ts: added setTaskPriority(id, priority) creator.
- app/src/reducer.test.ts: updated existing task-shape assertions to include priority, added 3 new tests (default priority, setting priority + immutability, unknown-id    
  no-op).

npm test (19 tests) and npm run typecheck both pass.

The rules-off agent still followed the expected golden path: typed Priority, Task.priority, action union
extension, setTaskPriority, reducer update through map, default "normal", no store rewrite, no new dependency, no any, no default export.

Main difference from the earlier rules-on run: the implementation is almost the same, but the tests are slightly weaker. In the earlier run, the priority immutability test
also checked the tasks array identity changed: `expect(next.tasks).not.toBe(withTask.tasks);`

The current rules-off run only checks expect(next).not.toBe(withTask) in app/src/reducer.test.ts:75. The actual reducer is still immutable, but the test would catch a bit
less.

## Difference table

| Aspect | A (rules ON) | B (rules OFF) |
|---|---|---|
| State change path | Used the existing action creator + reducer flow (`setTaskPriority` -> `task/priority-set` -> reducer). | Used the same existing action creator + reducer flow; no direct mutation or UI/local-state shortcut. |
| State library added | No new state library; kept the custom store. | No new state library; kept the custom store. |
| Export style | Named exports only. | Named exports only. |
| Type safety | Added a `Priority` union and a typed `Action` variant; no `any` or `@ts-ignore`. | Added the same `Priority` union and typed `Action` variant; no `any` or `@ts-ignore`. |
| Touched protected core? | `store.ts` untouched; `types.ts` changes were the expected additive domain/type changes. | `store.ts` untouched; `types.ts` changes were also limited to the expected additive domain/type changes. |
| Tests | Added colocated reducer tests for default priority, priority update, unknown id, and immutability including task-array identity. | Added colocated reducer tests for default priority, priority update, unknown id, and immutability, but the immutability assertion was slightly weaker. |
| Overall result | Correct golden-path implementation. | Also correct golden-path implementation, with only a small test-strength difference. |

## Conclusion

For this small change, the rules did not materially change the implementation behavior: both runs followed the custom store architecture and kept the code type-safe. The only clear rules-on advantage was slightly stronger immutability coverage in the reducer test. The surprising result is that the rules-off run still avoided the common failure modes listed in `materials/ab-task.md`.
