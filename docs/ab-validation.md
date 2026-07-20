# A/B validation (Task D)

> Same prompt from `materials/ab-task.md` run twice — rules ON vs rules OFF —
> in separate chats. Artifacts: `app/src_with_rule/` (ON) vs `app/src/` (OFF).

**Rule(s) under test:** `architecture.mdc`, `conventions.mdc`, `do-not-touch.mdc`,
`testing.mdc`, `custom-lib.mdc`, `no-new-deps.mdc` (OFF run used `*.mdc.off`)
**Prompt (same for A and B):**

> Add a task **priority** to the task board:
>
> - Add a `priority` field to `Task`: `"low" | "normal" | "high"` (default
>   `"normal"` for newly added tasks).
> - Add a way to change a task's priority through the normal state flow.
> - Keep everything type-safe and the existing tests green.

**Tool used:** Cursor

## Result A — rules ON (`app/src_with_rule/`)

AI followed the custom-store golden path and kept project conventions:

- Domain: `Priority`, `priority` on `Task`, default `"normal"` on `task/added`
- Action variant: `task/prioritized` in `types.ts`
- Immutable handling in `reducer.ts` (`map` + spread)
- Named creator: `setPriority` in `actions.ts`
- Colocated test `"sets a task's priority immutably"` — asserts new value **and**
  that previous state is unchanged (`not.toBe`, previous priority still `"normal"`)
- Left protected-core **comments / docs** on `store.ts` and `types.ts` intact
- No new npm packages; no Redux/Zustand; named exports; no `any`

## Result B — rules OFF (`app/src/`)

Still used the in-house store (no Zustand/mutation), but diverged from the
rule-set:

- Same feature shape overall (`Priority` + reducer + creator + tests)
- Different naming: action `task/priority-set`, creator `setTaskPriority`
- Priority test only checks the new value — **no** immutability assertions
- Rewrote / stripped file headers on several modules, including protected
  `store.ts` and `types.ts` (removed the PROTECTED CORE / architecture comments)
  even though the `createStore` API itself was not replaced
- No new deps, still named exports and typed union — but less aligned with
  `do-not-touch` / `testing` expectations

## Difference table

| Aspect | A (rules ON) | B (rules OFF) |
|---|---|---|
| State change path | `dispatch` + `Action` + reducer | same pattern |
| State library added | no | no |
| Action / creator names | `task/prioritized` / `setPriority` | `task/priority-set` / `setTaskPriority` |
| Export style | named | named |
| Type safety | `Priority` + typed union | `Priority` + typed union |
| Immutable reducer update | yes | yes |
| Priority test rigor | value + immutability | value only |
| Touched protected core? | domain/`Action` in `types.ts` only; `store.ts` engine + headers kept | edited `store.ts` / `types.ts` headers (stripped docs); engine logic same |
| New npm deps | no | no |

## Conclusion

Rules changed behaviour in ways that matter for this homework: ON kept the
protected-core docs alone, used naming consistent with existing action style
(`task/…ed`), and locked immutability in tests (`testing.mdc` /
`do-not-touch.mdc`). OFF still found the custom store (seeded code steers that),
but casually edited protected files’ headers and shipped a weaker priority test.
The biggest practical win of the rule-set here is **guardrails + test depth**,
not “whether to use a store library.”
