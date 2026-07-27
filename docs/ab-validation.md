# A/B validation (Task D)

**Rule(s) under test:** all 6 rules in `.cursor/rules/` (`architecture.mdc`,
`conventions.mdc`, `do-not-touch.mdc`, `testing.mdc`, `custom-lib.mdc`,
`actions.mdc`), rules ON vs OFF as a group.
**Prompt (same for A and B):** the change request from `materials/ab-task.md`
(add a `priority` field to `Task` + a way to change it, type-safe, tests
green). Prompt was not reworded between runs.
**Tool used:** Claude Code, separate fresh agent sessions with no shared
context, both starting from a clean `app/` (4 `Action` variants, no
`priority`, 15 tests).

## Result A — rules ON

Extended `Action` in `app/src/types.ts` with a `task/priority-set` variant,
added `Priority` and a `priority` field on `Task`. Handled it in
`app/src/reducer.ts` immutably (spread + `.map`); `task/added` defaults
`priority` to `"normal"`. Added `setTaskPriority(id, priority)` in
`app/src/actions.ts` following the existing pattern. `store.ts` untouched,
no existing `Action` variants changed, no new dependencies, named exports
only, no `any`. Extended the colocated `reducer.test.ts` (3 new tests + 2
updated). `npm test`: 18/18 passing, `npm run typecheck`: clean.

This run was captured for comparison and then checked out (not kept) so
Result B could be captured from the same clean baseline — see "Which result
was kept" below.

## Result B — rules OFF (2 runs)

Both runs: before starting, the agent renamed all `*.mdc` files to
`*.mdc.off` without reading their contents, and did not read
`AGENTS.md`/`CLAUDE.md`/`architecture-brief.md` — only the raw `app/src`
code.

Both runs independently landed on the same golden path: extend `Action` in
`types.ts` → immutable case in `reducer.ts` → action creator in
`actions.ts` → colocated test. In neither run: no state library, no direct
mutation, no edits to `store.ts` or existing `Action` variants, no `any`.
The second run (nudged to "work quickly, don't over-analyze the existing
code first") produced 19 tests (instead of 18) and named the creator
`setPriority` instead of `setTaskPriority` — a small but concrete naming
difference. `npm test`: 18-19/18-19 passing both times, `npm run typecheck`:
clean.

## Which result was kept

`app/src/actions.ts` on disk currently defines `setPriority`, which is
**Result B, run 2** (rules OFF) — that is the version kept as the real
commit, not Result A. Result A (`setTaskPriority`) was captured for this
comparison and then reverted so Result B could start from the same clean
baseline; it does not exist in the current code.

## Difference table

| Aspect | A (rules ON) | B (rules OFF, kept version) |
|---|---|---|
| State change path | dispatch + Action union + reducer | same |
| State library added | no | no |
| Export style | named | named |
| Type safety | strict, no `any` | strict, no `any` |
| Protected core (`store.ts`) touched? | no | no |
| Action creator name | `setTaskPriority` | `setPriority` (kept in `actions.ts`) |
| Test count after change | 18 | 19 |
| Test/typecheck result | green | green |

## Висновок

На цьому конкретному запиті правила не дали архітектурного розриву — і з
правилами, і без них модель самостійно повторює golden path застосунку
(reducer + action creator + тест), без бібліотек і без мутацій. Єдина
реальна, конкретна відмінність — у неймінгу (`setTaskPriority` vs
`setPriority`) та кількості доданих тестів. Показово, що в репозиторії
залишилась саме версія з прогону "правила OFF" (`setPriority`) — сам факт,
що вона теж вийшла коректною й неймінг не єдиний "правильний" варіант,
підтверджує головний висновок: код `app/src` вже достатньо простий і
послідовний, щоб модель скопіювала патерн за прикладом навіть без явних
правил. Це не означає, що правила зайві — ефект `do-not-touch.mdc` і
`custom-lib.mdc` очікувано сильніше проявляється на менш очевидних або більш
ризикованих запитах, а не на цьому.
