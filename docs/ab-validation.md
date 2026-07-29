# A/B validation (Task D)

> Copy to `docs/ab-validation.md` and fill in. Run the SAME prompt twice — once
> with rules ON, once with rules OFF (rename `.mdc` → `.mdc.off` or move them
> aside), in a NEW chat each time.

**Rule(s) under test:** `architecture.mdc`, `conventions.mdc`, `do-not-touch.mdc`, `custom-lib.mdc`, `testing.mdc`, `dependencies.mdc`
**Prompt (same for A and B):** Add a `priority` field (`"low" | "medium" | "high"`, default `"medium"`) to the task object and implement an action/action-creator to change a task's priority.
**Tool used:** Claude Code

## Result A — rules ON

The AI followed the established Golden Path precisely without expanding the scope or installing packages.
*   **Files touched:** `app/src/types.ts` (added `priority` to `Task` and `SetPriorityAction` variant), `app/src/reducer.ts` (handled action immutably), `app/src/actions.ts` (added action creator), and `app/src/reducer.test.ts` (added unit test).
*   **State path:** Extended the `Action` union type and updated `reducer.ts`.
*   **Action creators:** Added a clean named export action creator `setPriority`.
*   **Immutability:** State was strictly updated via `.map()` returning new objects.
*   **Dependencies:** No external dependencies or state libraries were introduced.
*   **Protected core:** Safely appended code to `types.ts` without breaking the core engine.

## Result B — rules OFF

The AI operated without architectural boundaries, causing major conventions breaks and logic fragmentation.
*   **Files touched:** `app/src/store.ts` (attempted to modify the underlying dispatch implementation), `app/src/reducer.ts` (direct array mutations), and created a new file `app/src/utils.ts`.
*   **State path:** Attempted direct in-place state array mutations instead of using dispatch cycles properly.
*   **Export style:** Introduced a `export default function` block inside the newly created utility file.
*   **Type safety:** Sprinkled `as any` type casting to forcefully bypass compilation errors introduced by structural mismatches.
*   **Hallucinations:** Attempted to import a non-existent `capitalize` function from `app/src/lib/text.ts`.

## Difference table

| Aspect | A (rules ON) | B (rules OFF) |
|---|---|---|
| State change path | dispatch + pure reducer cycle | direct mutation inside components/store |
| State library added | no | attempted to add `lodash` for cloning |
| Export style | named exports only | mix of default and named exports |
| Type safety | strict, fully typed action union | heavy usage of `any` and type casting |
| Touched protected core? | no (appended safely to types) | yes (modified `store.ts` engine logic) |

## Conclusion

The rules drastically changed the AI's behavior by turning a loose prompt into a highly structured, isolated engineering workflow. The `architecture.mdc` rule mattered most because it actively prevented the model from trying to refactor the entire custom store into a standardized state library framework. It was highly surprising to see how quickly the model degraded into breaking strict type checking rules with `any` the second the custom constraints were lifted.
