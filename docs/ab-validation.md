# A/B validation (Task D)

> Copy to `docs/ab-validation.md` and fill in. Run the SAME prompt twice — once
> with rules ON, once with rules OFF (rename `.mdc` → `.mdc.off` or move them
> aside), in a NEW chat each time.

**Rule(s) under test:** architecture.mdc + conventions.mdc + do-not-touch.mdc + selectors-actions.mdc + testing.mdc
**Prompt (same for A and B):** 
- Add a `priority` field to `Task`: `"low" | "normal" | "high"` (default
  `"normal"` for newly added tasks).
- Add a way to change a task's priority through the normal state flow.
- Keep everything type-safe and the existing tests green.

**Tool used:** Claude Code

## Result A — rules ON

With the .cursor/rules/*.mdc files enabled, Claude Code first inspected the
existing architecture and explicitly identified the expected state-change path:

types.ts → actions.ts → reducer.ts

It also loaded the applicable project rules, including:

conventions.mdc
selectors-actions.mdc
testing.mdc
do-not-touch.mdc

The AI modified the following files:

app/src/types.ts
app/src/actions.ts
app/src/reducer.ts
app/src/reducer.test.ts

Created app/src/selectors.test.ts

The implementation:

added a Priority union type:
"low" | "normal" | "high"
added priority: Priority to Task
added a "task/priority-set" variant to the Action discriminated union
added a named setTaskPriority(id, priority) action creator
initialized newly added tasks with priority: "normal"
handled priority changes in the reducer using an immutable map
preserved the existing task object for unknown task IDs
updated existing test fixtures for the new required field
added tests for:
default priority
changing priority
immutability
unknown task IDs
added no npm dependencies
did not modify app/src/store.ts
introduced no any, @ts-ignore, or default exports

Verification results:

npm run typecheck — passed
npm test — passed, 28/28 tests

## Result B — rules OFF

The .mdc rule files were renamed to .mdc.off.

Claude Code did not find active .cursor/rules/*.mdc files, but the test was
not fully isolated from project instructions.

During the run, Claude Code:

used the /add-action command from .claude/commands/add-action.md
inspected AGENTS.md and CLAUDE.md
explicitly opened:
.cursor/rules/conventions.mdc.off
.cursor/rules/selectors-actions.mdc.off

Therefore, the disabled rule contents were still available to the AI and
influenced its implementation.

The AI modified:

app/src/types.ts
app/src/actions.ts
app/src/reducer.ts
app/src/reducer.test.ts

The implementation:

added the same typed Priority union
added priority to Task
extended the Action discriminated union
added a named setTaskPriority action creator
used the existing reducer-based state flow
updated state immutably
added tests for the new behavior
added no dependencies
did not modify store.ts
introduced no any, @ts-ignore, or default exports

Verification results:

npm run typecheck — passed
npm test — passed, 17/17 tests



## Difference table

| Aspect | A (rules ON) | B (rules OFF) |
|---|---|---|
| State change path | Action union → action creator → reducer → dispatch-compatible flow | Same action-based reducer flow |
| State library added | no | no |
| Export style | Named exports | Named exports |
| Type safety | Strict Priority union and typed Action variant | Strict Priority union and typed Action variant |
| Touched protected core? | types.ts changed only for the required field and action; store.ts untouched | types.ts changed only for the required field and action; store.ts untouched |

## Conclusion

The two implementations were very similar, so this run does not provide a clean
measurement of the effect of .mdc rules alone. The rules-on version produced
slightly broader test coverage, but the rules-off run still followed the same
architecture because Claude Code used /add-action, AGENTS.md, CLAUDE.md,
and even read the renamed .mdc.off files.
