# A/B validation (Task D)

**Rule(s) under test:** `architecture.mdc`, `conventions.mdc`, `do-not-touch.mdc`,
`testing.mdc`, `actions-selectors.mdc` (and `custom-lib.mdc` in the set)
**Prompt (same for A and B):** the change request from `materials/ab-task.md`
(add a `priority` field + a way to change it).
**Tool used:** Cursor (Agent)

## Result A — rules ON

Setup: `.cursor/rules/*.mdc` active; same prompt from `materials/ab-task.md` in a
new chat with the rule-set loaded.

What the AI produced:

- **Files touched:** `app/src/types.ts`, `app/src/reducer.ts`, `app/src/actions.ts`,
  `app/src/reducer.test.ts`.
- **State path:** golden path — `Priority` type + `priority` on `Task`;
  `task/prioritized` added to the `Action` union; immutable handler in
  `reducer.ts`; `setPriority(id, priority)` action creator; new tasks default to
  `"normal"`.
- **No** Redux/Zustand/MobX; **no** new npm dependency; **no** direct mutation.
- **Exports:** named only; **no** `any` / `@ts-ignore`.
- **`store.ts`:** not edited (`do-not-touch`). **`types.ts` contract
  (`do-not-touch`):** only the golden-path add-action extensions are allowed —
  `Priority` (`"low" | "normal" | "high"`), `Task.priority`, and the
  `task/prioritized` `Action` variant; any other `types.ts` edits are forbidden.
  Public `createStore` signature unchanged.
- **Tests:** colocated updates in `reducer.test.ts` (default priority +
  immutability for `setPriority`); `cd app && npm test` — 16/16 green;
  `npm run typecheck` clean.

## Result B — rules OFF

Setup: all `.cursor/rules/*.mdc` removed/disabled for this run; same prompt from
`materials/ab-task.md` in a fresh agent chat (Composer). `app/AGENTS.md` and
in-file code comments were still present on disk.

What the AI produced:

- **Files touched:** `app/src/types.ts`, `app/src/reducer.ts`, `app/src/actions.ts`,
  `app/src/reducer.test.ts` (same set as a rules-ON golden-path change).
- **State path:** still custom `dispatch` + pure reducer — added
  `task/prioritized` to the `Action` union, handled it immutably in `reducer.ts`,
  added `setPriority` in `actions.ts`. New tasks default `priority: "normal"`.
- **No** Redux/Zustand/MobX/`useState` store swap; **no** new npm dependency.
- **Exports:** named only; **no** `any` / `@ts-ignore`.
- **`store.ts`:** not edited.
- **Tests:** updated expectations + immutability case; `cd app && npm test` —
  16/16 green (same suite total as Result A after re-run on the current tree);
  `npm run typecheck` clean.

Notable for the write-up: with rules OFF the model did **not** fall into the
classic failure modes from `materials/ab-task.md` (direct mutation, pulling in a
state library, default export, `any`). The seeded store/reducer/`Action` pattern
in the code (and `app/AGENTS.md`) was enough to steer the same golden path. The
`.mdc` rules were therefore not the only signal — but they are still the
explicit, portable enforcement layer for tools that do not read `AGENTS.md` the
same way.

## Difference table

| Aspect | A (rules ON) | B (rules OFF) |
|---|---|---|
| State change path | `dispatch` + `Action` union + pure reducer + `setPriority` | Same: `dispatch` + `Action` union + pure reducer + `setPriority` |
| State library added | No | No |
| Export style | Named exports only | Named exports only |
| Type safety | Strict `Priority` union; typed `Action` variant; no `any` | Same; no `any` / `@ts-ignore` |
| Touched protected core? | Same `do-not-touch` contract: `store.ts` untouched; `types.ts` only `Priority` + `Task.priority` + `task/prioritized` (no other type edits); `createStore` signature unchanged | Same `do-not-touch` contract: `store.ts` untouched; `types.ts` only `Priority` + `Task.priority` + `task/prioritized` (no other type edits); `createStore` signature unchanged |
| Explicit rule citations / guardrails in approach | Followed `.cursor/rules/` (architecture, do-not-touch, testing, conventions) | No `.mdc` loaded; steered by seeded code comments + `app/AGENTS.md` |
| Classic OFF failure modes (mutation / Zustand / default export) | Absent | Also absent (unexpected vs `ab-task.md` examples) |

## Conclusion

On this prompt and codebase, rules ON vs OFF did **not** produce a large
behavioural gap: both runs stayed on the custom-store golden path. What mattered
most for the OFF run was the seeded architecture in `app/src/` (and
`app/AGENTS.md`), not the absence of `.mdc` files. The rules still earn their
keep as an explicit, tool-portable checklist (`architecture.mdc` /
`do-not-touch.mdc` especially) for agents or sessions that would otherwise ignore
comments — but this A/B showed that strong in-repo baselines can already prevent
the classic OFF mistakes.
