# A/B validation (Task D)

> Run the SAME prompt twice — once with rules ON, once with rules OFF — in a NEW
> chat each time. Do not reword the prompt between runs.

**Rule(s) under test:** `architecture.mdc` + `conventions.mdc` + `do-not-touch.mdc`
+ `testing.mdc` + `dependencies.mdc` + `actions-selectors.mdc`, mirrored for
Copilot in `.github/copilot-instructions.md`.
**Prompt (same for A and B):** the change request from `materials/ab-task.md`
(add a `priority` field to `Task`: `"low" | "normal" | "high"`, default
`"normal"`; add a way to change it; keep it type-safe and tests green).
**Tool used:** GitHub Copilot (VS Code, Agent mode, GPT-5.5).

## How to reproduce

In Copilot the rules live where Copilot reads them, so the ON/OFF toggle moves
those files aside (not `.cursor/rules`, which Copilot ignores):

```bash
# A — rules ON: fresh Agent chat, paste the ab-task.md request, capture result.
#     confirm the reply shows "Used reference: copilot-instructions.md".
git stash push -- app/src            # save A, reset tree so B starts clean

# B — rules OFF:
mv .github/copilot-instructions.md .github/copilot-instructions.md.off
mv AGENTS.md AGENTS.md.off
mv app/AGENTS.md app/AGENTS.md.off
# fresh Agent chat, paste the SAME request, capture result, then restore:
git checkout -- app/src && git clean -fd app/src
mv .github/copilot-instructions.md.off .github/copilot-instructions.md
mv AGENTS.md.off AGENTS.md
mv app/AGENTS.md.off app/AGENTS.md
git stash pop                        # restore the A result
```

## Result A — rules ON

- Added `Priority = "low" | "normal" | "high"` and a `priority` field on `Task`
  in `app/src/types.ts` (additive only — protected core respected).
- Added `task/prioritized` variant to the `Action` union in `app/src/types.ts`.
- Handled it immutably in `app/src/reducer.ts` (`map` + spread, no mutation);
  `task/added` now defaults `priority: "normal"`.
- Added `setPriority(id, priority)` action creator in `app/src/actions.ts`.
- Added colocated tests: three in `app/src/reducer.test.ts` (set priority,
  immutability, other tasks untouched) **plus a store-level dispatch test** in
  `app/src/store.test.ts` proving the change flows through `createStore().dispatch`.
- `cd app && npm test` green (**19 passed**), `npm run typecheck` clean.
- No new dependencies, no state library, named exports, no `any`, store engine
  untouched.

## Result B — rules OFF

With the rule files moved aside, GPT-5.5 still produced a broadly correct,
golden-path solution — but with less rigor and different naming:

- Added `TaskPriority = "low" | "normal" | "high"` and `priority` on `Task`.
- Added `task/prioritySet` variant + `setTaskPriority(id, priority)` creator.
- Reducer handled it immutably; `task/added` defaults `priority: "normal"`.
- Added **one** colocated reducer test ("sets a task's priority") — no
  immutability assertion, no store-level dispatch coverage.
- `cd app && npm test` green (**16 passed**), `npm run typecheck` clean.
- No state library, named exports, no `any`, store engine untouched.

## Difference table

| Aspect | A (rules ON) | B (rules OFF) |
|---|---|---|
| State change path | dispatch + reducer (`task/prioritized`) | dispatch + reducer (`task/prioritySet`) — same path |
| State library added | no | no |
| Export style | named | named |
| Type safety | strict, typed `Priority` union | strict, typed `TaskPriority` union |
| Immutability | `map` + spread, no mutation | `map` + spread, no mutation |
| Touched protected core? | additive `Action`/field only | additive `Action`/field only |
| Tests added / green? | 4 tests incl. store-level + immutability / 19 passed | 1 reducer test only / 16 passed |
| Naming discipline | `Priority` / `setPriority` | `TaskPriority` / `setTaskPriority` |

## Conclusion

With a strong model (GPT-5.5) the rules did **not** rescue the architecture —
even OFF the model stayed on the golden path (dispatch + immutable reducer, no
state library, no `any`, protected core untouched). The rules' value showed up
in **rigor and consistency**, not correctness: rules-ON added store-level
dispatch coverage and explicit immutability tests (19 vs 16 passing) and matched
the repo's naming conventions, whereas rules-OFF did the minimum viable test.
The `testing.mdc` rule mattered most here. Honest takeaway: on a capable model,
rule-sets are a **quality/consistency floor**, not a safety net — the gap would
widen on weaker models or vaguer prompts.


