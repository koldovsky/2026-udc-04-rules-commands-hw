# A/B validation (Task D)

**Rule(s) under test:** all 6 rules in `.cursor/rules/` — `architecture.mdc`,
`conventions.mdc`, `custom-lib.mdc`, `do-not-touch.mdc`, `no-new-deps.mdc`,
`testing.mdc`.

**Prompt (same for A and B):** "The request" from `materials/ab-task.md`, pasted
verbatim:

> Add a task **priority** to the task board:
>
> - Add a `priority` field to `Task`: `"low" | "normal" | "high"` (default
>   `"normal"` for newly added tasks).
> - Add a way to change a task's priority through the normal state flow.
> - Keep everything type-safe and the existing tests green.

**Tool used:** Cursor Agent (Build mode, local), model Claude Opus 5.5 Medium in
both runs, a new chat for each run, identical prompt.

**OFF condition:** only `.cursor/rules/*.mdc` renamed to `*.mdc.off`; root
`AGENTS.md`, `app/AGENTS.md` (golden path + guardrails), `app/CLAUDE.md` and
`.cursor/commands/` stayed in place.

## Result A — rules ON

- **Files touched (4, +59/-5):** `app/src/types.ts` (+4/-0),
  `app/src/actions.ts` (+5/-1), `app/src/reducer.ts` (+16/-1),
  `app/src/reducer.test.ts` (+34/-3).
- **Types:** new `export type Priority = "low" | "normal" | "high"`, new field
  `priority: Priority` on `Task`, new `Action` variant
  `{ type: "task/prioritySet"; payload: { id: TaskId; priority: Priority } }`.
- **Action creator:** `setTaskPriority(id: TaskId, priority: Priority): Action`
  (named export, existing creators unchanged).
- **Reducer:** `task/added` now sets `priority: "normal"`; new
  `case "task/prioritySet"` (placed after `task/removed`) returns
  `{ ...state, tasks: state.tasks.map(...) }` with `{ ...task, priority }` for
  the matching id — immutable, no mutation.
- **Fixtures edited:** the expected object in "adds a task as not done" and the
  inline `AppState` in "returns the same state for an unknown id toggle" both
  got `priority: "normal"`.
- **Tests added (4):** "adds a task with normal priority by default"; "sets a
  task's priority"; "does not mutate the previous state when setting priority"
  (`expect(next).not.toBe(withTask)`, `expect(next.tasks).not.toBe(withTask.tasks)`,
  old task still `"normal"`); "leaves other tasks untouched when setting
  priority" (untouched task keeps `"normal"` and the same reference).
- **Protected core:** `types.ts` changed additively only (no removed lines);
  `store.ts` and `app/package.json` untouched; no new deps.
- **Checks:** `npm test` 19/19 passed, typecheck clean. ~3 min (23:32–23:35),
  4–5 permission prompts, no follow-up messages. Its first command listed
  `../.cursor/rules` and read `types.ts`, `actions.ts`, `reducer.ts`,
  `selectors.ts`.

## Result B — rules OFF

- **Files touched (4, +53/-5):** `app/src/types.ts` (+4/-0),
  `app/src/actions.ts` (+5/-1), `app/src/reducer.ts` (+16/-1),
  `app/src/reducer.test.ts` (+28/-3).
- **Types:** identical to A — same `Priority` type, `priority` field and
  `task/prioritySet` variant (the `types.ts` diff has the same blob hash,
  `d6298f9`, as in A).
- **Action creator:** identical to A — `setTaskPriority(id, priority)` (same blob
  hash `31dc1bb` for `actions.ts`).
- **Reducer:** same immutable `map` + spread implementation and same
  `priority: "normal"` default; the only difference is placement — the new case
  sits right after `task/added` instead of after `task/removed`.
- **Fixtures edited:** the same two fixtures as A, with the same changes.
- **Tests added (3):** "sets a task's priority without mutating the previous
  state" (new value `"high"`, old task still `"normal"`,
  `expect(next.tasks[0]).not.toBe(withTask.tasks[0])`); "leaves other tasks
  untouched when setting priority" (same reference); "ignores a priority change
  for an unknown id" (`toEqual` on tasks). No dedicated default-priority test —
  the default is only covered by the edited "adds a task as not done" fixture.
- **Protected core:** `types.ts` additive only; `store.ts` and
  `app/package.json` untouched; no new deps. No direct mutation, no state
  library, no default export, no `any` / `@ts-ignore`.
- **Checks:** `npm test` 18/18 passed, typecheck clean. 23:40–23:41 (worked
  1m10s), 3 permission prompts, no follow-up messages. The agent said: "Rules
  are currently disabled (.mdc.off), so I'm working from AGENTS.md", and at the
  end said the result is usable as the rules-OFF run of an A/B test.

## Difference table

| Aspect | A (rules ON) | B (rules OFF) |
|---|---|---|
| State change path | action creator `setTaskPriority` + `task/prioritySet` case in reducer (immutable `map` + spread) | same |
| State library added | no | no |
| Export style | named | named |
| Type safety | strict: `Priority` union + typed `Action` variant, no `any` / `@ts-ignore` | same (identical `types.ts` diff) |
| Touched protected core? | `types.ts` additive only; `store.ts` untouched | `types.ts` additive only; `store.ts` untouched |
| Files touched (+/-) | 4 files, +59/-5 | 4 files, +53/-5 |
| New tests (count + what) | 4: default priority, set priority, no-mutation, other tasks untouched | 3: set priority + no-mutation (combined), other tasks untouched, unknown id ignored |
| Purity assertion (`not.toBe`) present? | yes — on `state` and on `state.tasks` | yes — on the changed task object only |
| Default `"normal"` tested? | yes — dedicated test plus edited fixture | only via the edited "adds a task as not done" fixture |
| Run time / permission prompts | ~3 min / 4–5 | 1m10s / 3 |
| Agent referenced rules? | yes — first command listed `../.cursor/rules` | said rules were disabled (`.mdc.off`) and worked from `AGENTS.md` |

## Conclusion

Behaviour barely differed: both runs followed the golden path (additive
`types.ts` change, `setTaskPriority` creator, immutable reducer case, colocated
tests, no new deps, `store.ts` untouched), and `types.ts` / `actions.ts` are
byte-identical between the two diffs. The only real differences are in testing
depth — A added a dedicated default-priority test and asserted new `state` /
`tasks` references, B added an unknown-id test instead — plus A took longer and
explicitly read the rules first. The small gap is likely because the same golden
path and guardrails are also written in the root `AGENTS.md` and
`app/AGENTS.md`, which stayed loaded in run B; B also saw the `.mdc.off` file
names, so it likely knew it was the OFF run, which is possible contamination.
For a cleaner A/B next time I would move the rules and every `AGENTS.md` /
`CLAUDE.md` completely out of the workspace (not rename them in place) for the
OFF run, so the agent has no guidance and no hint that it is being tested.
