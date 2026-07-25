# A/B validation (Task D)

**Rules under test:** the complete `.cursor/rules/` set, with particular focus
on `architecture.mdc`, `conventions.mdc`, `dependencies.mdc`, and
`do-not-touch.mdc`.

**Tool and model:** Cursor Agent with Claude Opus 5, high reasoning, in a new
chat for each run.

**Prompt (identical for A and B):**

> Add a task **priority** to the task board:
>
> - Add a `priority` field to `Task`: `"low" | "normal" | "high"` (default
>   `"normal"` for newly added tasks).
> - Add a way to change a task's priority through the normal state flow.
> - Keep everything type-safe and the existing tests green.

## Result A — rules ON

With all `.mdc` rules enabled, the agent modified `app/src/types.ts`,
`app/src/actions.ts`, `app/src/reducer.ts`, and
`app/src/reducer.test.ts`. It added the `Priority` type, extended `Task` and
the `Action` union, added `setPriority`, and handled `task/prioritized` with an
immutable `map`. New tasks receive `priority: "normal"`. No dependency or
store-engine change was made, and all exports remain named.

`cd app && npm test` passed: 3 test files and 19 tests.

## Result B — rules OFF

For this run, the six rule files were renamed from `.mdc` to `.mdc.off` and the
same prompt was sent in a new chat. The agent changed the same four source/test
files and followed the same state flow: typed action union → `setPriority`
action creator → immutable reducer case → colocated Vitest coverage. It added
no dependency, used no `any` or default export, and did not change
`app/src/store.ts`.

The no-rules branch also passes `cd app && npm test`: 3 test files and 19
tests.

## Difference table

| Aspect | A (rules ON) | B (rules OFF) |
|---|---|---|
| Rules available to the agent | Six `.mdc` rules were active. | The same files were renamed to `.mdc.off`. |
| Files changed | `types.ts`, `actions.ts`, `reducer.ts`, `reducer.test.ts` | The same four files |
| State change path | `Action` union → `setPriority` → `task/prioritized` reducer case | The identical path |
| Reducer update | Immutable `tasks.map`; writes the default as `priority: "normal"`. | The same immutable `tasks.map`; uses `priority: DEFAULT_PRIORITY` for newly added tasks. |
| Default-priority representation | Inline string literal `"normal"` | Shared typed `DEFAULT_PRIORITY` constant |
| Tests | Covers default priority, priority changes, immutability, unchanged other-task value, and unknown IDs. | Covers the same cases; its other-task test additionally checks that the untouched task keeps its object reference. |
| State library / dependency added | No | No |
| Export style and type safety | Named exports; typed `Priority`; no `any` | Named exports; typed `Priority`; no `any` |
| Protected core | `types.ts` was extended as the task explicitly requires; `store.ts` was untouched. | `types.ts` was extended as the task explicitly requires; `store.ts` was untouched. |
| Verification | 19/19 tests passed | 19/19 tests passed |

## Conclusion

This A/B run did not produce a meaningful behavioral or architectural gap: both
Opus 5 high-reasoning runs independently chose the app's prescribed extension
path even when the Cursor rules were disabled. The surprising result is that
the implementations are semantically equivalent; the concrete difference is
only how the `"normal"` default is represented and a slightly stronger
object-identity assertion in the rules-off test. This single comparison shows
that the rules did not materially change this model's output for this focused,
well-specified task; more varied or less architecture-revealing prompts would
probably be needed to measure their influence reliably.
