# Command test log (Task C)

## `/add-action` — real run

**Command:** `.cursor/commands/add-action.md`
**Arguments:** `rename a task (change its title by id)`
**Date:** 2026-08-05

### What the command produced

| File | Change |
|---|---|
| `app/src/types.ts` | **additive only**: new `Action` variant `{ type: "task/renamed"; payload: { id: TaskId; title: string } }` |
| `app/src/reducer.ts` | new `case "task/renamed"` using `map` + spread (immutable, unknown id → tasks unchanged) |
| `app/src/actions.ts` | new named creator `renameTask(id: TaskId, title: string): Action` |
| `app/src/reducer.test.ts` | 3 colocated vitest cases: happy path, immutability (`not.toBe` + previous title intact), unknown id no-op |

Not touched: `app/src/store.ts`, `app/package.json`, `app/tsconfig.json`.
No new dependencies, no `any`/`@ts-ignore`, named exports only.

### Verification

```
cd app && npm run typecheck   # tsc --noEmit — no errors
cd app && npm test            # 3 files, 18 tests passed (was 15)
git diff --stat               # only types.ts / reducer.ts / actions.ts / reducer.test.ts
```

### Observation

The command's step 2 ("`types.ts` is protected — diff must be purely
additive") plus step 6 (immutability + edge-case tests) are what kept the run
on the golden path: the union was extended rather than rewritten, and the
edge case (`renameTask("missing", …)`) was covered without being asked for.

## `/refactor` and `/analyze-error`

Defined in `.cursor/commands/` (and mirrored to `.claude/commands/`); not run
in this session — `/add-action` is the command validated on a real task.

