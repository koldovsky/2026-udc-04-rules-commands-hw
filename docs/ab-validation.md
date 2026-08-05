# A/B validation (Task D)

**Rule(s) under test:** the whole rule-set — primarily `do-not-touch.mdc`,
`conventions.mdc`, `testing.mdc`, `state-access.mdc`, `dependencies.mdc` — plus
the generalized `app/AGENTS.md` / `CLAUDE.md` baseline from Task B.
**Prompt (identical for A and B):** the change request from
`materials/ab-task.md` — add a `priority` field to `Task` (`"low" | "normal" |
"high"`, default `"normal"`), add a way to change it through the normal state
flow, keep everything type-safe and the existing tests green. Not reworded
between runs.
**Tool used:** Claude Code CLI, non-interactive (`claude -p "<prompt>"
--permission-mode acceptEdits`), a **fresh session per run**, repo working tree
clean before each run (`git status` empty).

**How ON/OFF was toggled:** for run B every context file was renamed to
`*.off` — `.cursor/rules/*.mdc` (7 files), root `AGENTS.md` / `CLAUDE.md`,
`app/AGENTS.md` / `app/CLAUDE.md` — so the agent saw only the source code and
the prompt. Afterwards `git checkout -- .` restored the tree and the `.off`
files were removed before run A.

Raw diffs captured: `/tmp/ws4ab/run-a-on-app.diff`, `/tmp/ws4ab/run-b-off-app.diff`
(summarized below).

## Result A — rules ON

Files touched: `app/src/types.ts`, `app/src/reducer.ts`, `app/src/actions.ts`,
`app/src/reducer.test.ts`. Nothing else — `store.ts`, `package.json`,
`tsconfig.json` untouched, no new dependency.

- `types.ts` diff is **strictly additive: `+4 / -0`** — `export type Priority`,
  the `priority` field on `Task`, and one new union variant
  `{ type: "task/prioritized"; payload: { id: TaskId; priority: Priority } }`.
  The existing union lines were left byte-for-byte alone.
- `reducer.ts`: `"task/added"` now seeds `priority: "normal"`; new
  `case "task/prioritized"` uses `map` + spread; unknown id is a no-op.
- `actions.ts`: creator named **`setPriority(id, priority): Action`** —
  consistent with the existing `setFilter` naming.
- `reducer.test.ts` (`+26 / -4`): 3 new tests, written with explicit
  `// Arrange / // Act / // Assert` comments, including a dedicated
  **immutability test** (`expect(reprioritized).not.toBe(withTask)` plus the
  previous task's priority still `"normal"`), and an unknown-id edge case. The
  existing test title was updated to describe the new behavior
  ("adds a task as not done **with normal priority**").
- Verification reported by the agent: `npm run typecheck` **and** `npm test`
  (21 tests green).

## Result B — rules OFF

Same four files, and the overall shape was also action-based (the seeded code
itself carries `PROTECTED CORE` comments, so the architecture survived) — but
the discipline slipped:

- `types.ts` diff is **`+9 / -5`**: besides the additive parts, the agent
  **reformatted the entire `Action` union** with column-aligned `payload:`
  columns, rewriting 5 untouched lines of a protected file — a gratuitous,
  review-noisy change to the core contract.
- Creator named **`changeTaskPriority(id, priority)`**, breaking the
  `addTask` / `toggleTask` / `setFilter` naming rhythm; action type
  `"task/priority-changed"` instead of the single-word past-participle style
  used everywhere else.
- Tests (`+20 / -3`): 3 new tests — default priority, change priority, unknown
  id — but **no immutability test** at all (`testing.mdc` demands one per new
  action variant). The existing test title was left stale while its assertion
  was changed.
- Verification reported: `npm test` only; **no `typecheck` run**.
- No new dependency and no direct mutation — the classic "rules OFF" failures
  (zustand, `state.tasks[i].priority = …`, `any`) did **not** appear here.

## Difference table

| Aspect | A (rules ON) | B (rules OFF) |
|---|---|---|
| State change path | `dispatch` + `Action` variant + reducer | same (seeded comments carried it) |
| Protected `types.ts` diff | `+4 / -0`, purely additive | `+9 / -5`, whole `Action` union reformatted |
| Action creator name | `setPriority` (mirrors `setFilter`) | `changeTaskPriority` (off-convention) |
| Action type string | `"task/prioritized"` (matches `task/added`) | `"task/priority-changed"` |
| Immutability test for the new action | yes (`not.toBe` + old value intact) | **missing** |
| AAA structure in tests | explicit Arrange/Act/Assert | implicit |
| Stale test names | fixed ("…with normal priority") | left stale |
| Verification run | `npm run typecheck` + `npm test` | `npm test` only |
| State library added | no | no |
| Export style / `any` | named exports, no `any` | named exports, no `any` |
| Touched `store.ts` / deps | no | no |

## Conclusion

The rules did change behaviour — but the interesting part is *where*. With a
strong model on a small, heavily-commented codebase, the headline architecture
(custom store, dispatch + reducer, no state library, no `any`) held up in both
runs; the seeded `PROTECTED CORE` comments already do part of the job. The
rules earned their keep on the **fine-grained, review-relevant** things: a
minimal additive diff in the protected `types.ts` (`+4/-0` vs `+9/-5` with an
unrequested reformat), naming consistent with the existing creators, a
mandatory immutability test, AAA structure, and running `typecheck` as well as
`npm test`. Most valuable rule: `do-not-touch.mdc` (additive-only diff in the
core) closely followed by `testing.mdc` (the immutability test appeared only in
run A).

**Surprise / honest caveat:** both runs added a **required** `priority` field to
`Task`, which forced edits to two existing test fixtures — `do-not-touch.mdc`
says to ask before non-additive core changes, but in a non-interactive
(`-p`) session the agent cannot ask, so it proceeded. Follow-up idea: make the
rule prescribe the fallback explicitly ("if approval is impossible, prefer an
**optional** field `priority?: Priority` so existing fixtures keep compiling").

## Repo state

Run A was kept as the real change (`app/src/types.ts`, `reducer.ts`,
`actions.ts`, `reducer.test.ts`); run B was discarded with `git checkout -- .`.
`cd app && npm run typecheck && npm test` → **21 tests, 3 files, green**.

