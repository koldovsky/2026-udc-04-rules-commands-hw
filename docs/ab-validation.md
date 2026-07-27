# A/B validation (Task D)

> **STATUS: SCAFFOLD — not yet filled in.** Every `<!-- TODO -->` below must be
> replaced with what the AI actually did before this PR is opened. Do not
> paraphrase from memory: fill each row from the captured diffs
> (`run-a.diff` / `run-b.diff`).

**Rule(s) under test:** `architecture.mdc`, `conventions.mdc`, `do-not-touch.mdc`,
`dependencies.mdc`, `custom-lib.mdc`, `state-access.mdc`, `testing.mdc`
**Prompt (same for A and B):** the change request from `materials/ab-task.md`
— add a `priority` field to `Task` (`"low" | "normal" | "high"`, default
`"normal"`) plus a way to change it, kept type-safe with tests green.
**Tool used:** <!-- TODO: e.g. Cursor 0.4x / Claude Code -->
**Model used:** <!-- TODO: same model in both runs, or the comparison is invalid -->
**Date:** <!-- TODO -->

## What "OFF" means in run B

Disabling only `.cursor/rules/*.mdc` would not be a clean OFF: `AGENTS.md`,
`app/AGENTS.md` and `CLAUDE.md` repeat much of the same architecture guidance,
and the agent reads those too. So run B disabled:

<!-- TODO: keep the line that matches what you actually did, delete the other -->
- [ ] **Rules only** — `.cursor/rules/*.mdc` → `*.mdc.off`. Measures the marginal
      value of the rule-set *on top of* the AGENTS.md baseline.
- [ ] **All agent context** — the `.mdc` files **and** `AGENTS.md`,
      `app/AGENTS.md`, `CLAUDE.md`, `app/CLAUDE.md` moved aside. Measures the
      value of the whole context layer.

Both runs started from an identical clean working tree (`git status` clean, the
seeded 15 tests green), same model, new chat each time, prompt pasted verbatim
with no follow-up steering.

## Result A — rules ON

<!-- TODO: what the AI produced. Answer concretely:
     - which files did it touch (from run-a.diff)?
     - did it extend the Action union in types.ts and handle it in reducer.ts?
     - immutable update, or in-place mutation?
     - did it add an action creator, or build the action literal inline?
     - did it add a test? did npm test / npm run typecheck pass?
     - did it ask before touching the protected core?
-->

Files touched:

```
<!-- TODO: paste `git diff --stat` from run A -->
```

## Result B — rules OFF

<!-- TODO: same questions, honestly. Watch for:
     - a state library (zustand/redux) added to package.json
     - direct mutation: state.tasks[i].priority = ...
     - default export, `any`, @ts-ignore
     - edits to store.ts instead of reducer.ts
     - a hallucinated lib/text.ts helper
     - no test added
     If run B happened to behave well, say so — a null result recorded honestly
     is worth more than an invented difference.
-->

Files touched:

```
<!-- TODO: paste `git diff --stat` from run B -->
```

## Difference table

Each row is checkable from the two diffs, not from impression.

| Aspect | A (rules ON) | B (rules OFF) |
|---|---|---|
| State change path (`dispatch`+reducer / direct mutation / other) | <!-- TODO --> | <!-- TODO --> |
| `Action` union extended in `types.ts`? | <!-- TODO --> | <!-- TODO --> |
| Reducer update immutable? | <!-- TODO --> | <!-- TODO --> |
| Action creator added in `actions.ts`? | <!-- TODO --> | <!-- TODO --> |
| State library added to `package.json`? | <!-- TODO --> | <!-- TODO --> |
| Export style (named / default) | <!-- TODO --> | <!-- TODO --> |
| `any` / `@ts-ignore` present? | <!-- TODO --> | <!-- TODO --> |
| Touched protected core (`store.ts`)? | <!-- TODO --> | <!-- TODO --> |
| Asked before editing protected files? | <!-- TODO --> | <!-- TODO --> |
| Colocated test added? | <!-- TODO --> | <!-- TODO --> |
| `npm test` green? | <!-- TODO --> | <!-- TODO --> |
| `npm run typecheck` clean? | <!-- TODO --> | <!-- TODO --> |
| Default `priority` for existing tasks handled? | <!-- TODO --> | <!-- TODO --> |

## Conclusion

<!-- TODO: 1–3 sentences.
     - did the rules actually change behaviour, and where most sharply?
     - which single rule earned its keep? which one never fired?
     - anything that surprised you — including a rule that was ignored?
-->

## Follow-up

<!-- TODO: optional but valuable — if a rule was ignored or under-specified in
     run A, say what you changed in it afterwards. That is the real payoff of
     running an A/B at all.
-->
