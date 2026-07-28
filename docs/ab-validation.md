# A/B validation (Task D)

**Rule(s) under test:** the full Claude Code guidance stack for this project —
root `CLAUDE.md`, `app/CLAUDE.md` (which imports `app/AGENTS.md`'s golden
path/guardrails via `@AGENTS.md`), and `.claude/rules/*.md`
(`architecture.md`, `conventions.md`, `custom-lib.md`, `dependencies.md`,
`do-not-touch.md`, `testing.md`). For rigor, run B also hid `.claude/commands/`
and the entire `.cursor/` directory — see "Methodology note" below for why.

**Prompt (same for A and B):** the fixed change request from
`materials/ab-task.md` — add a `priority` field (`"low" | "normal" | "high"`,
default `"normal"`) to `Task`, plus a way to change it, type-safe, tests green.

**Tool used:** Claude Code, via a fresh `general-purpose` subagent per run
(no memory of the authoring conversation — the closest available substitute
for "new chat," since the same session that wrote the rules can't run an
unbiased OFF test itself).

## Methodology note (adapted from the walkthrough for Claude Code)

The walkthrough's mechanism (`rename .mdc → .mdc.off`) targets Cursor. Claude
Code reads `CLAUDE.md` (not `AGENTS.md` directly — only via `@AGENTS.md`
import) plus `.claude/rules/`, so the OFF condition needed to hide those
instead. The **first** OFF attempt only hid `CLAUDE.md`, `app/CLAUDE.md`, and
`.claude/rules/`, and still produced the exact golden-path result — the
subagent had read `.claude/commands/add-action.md` directly (it has full
filesystem access and isn't limited to Claude Code's auto-loaded context) and
cited it as its source. That run was discarded as contaminated. The **second**
attempt additionally hid `.claude/commands/` and the whole `.cursor/`
directory before re-running — that's the result recorded below as "Result B."

## Result A — rules ON

The subagent extended the app via the exact golden path: added a `Priority`
type and `priority: Priority` field to `Task`, added a `task/priority-set`
`Action` variant, handled it immutably in the reducer (`state.tasks.map(...)`,
no-op for an unknown id), added `setTaskPriority(id, priority)` to
`actions.ts` next to the existing creators, and added 3 new colocated tests
(set priority, immutability, unknown-id no-op) plus updated 2 existing tests
for the new required field. `app/src/store.ts` was untouched; `types.ts` only
got the two sanctioned additions. `npm test` (18/18) and `npm run typecheck`
both passed. No dependencies added; named exports only.

## Result B — rules OFF (fully clean: `.claude/`, `.cursor/`, and the
`CLAUDE.md` chain all hidden)

Functionally identical to Result A: same `Priority` type placement, same
`task/priority-set` `Action` variant, same immutable `.map()` handling in the
reducer, same `setTaskPriority` creator with the same signature, same 3 new
tests plus the same 2 existing-test updates, `store.ts` untouched, no
dependencies added, named exports only. `npm test` (18/18) and
`npm run typecheck` both passed. The only differences were cosmetic — slightly
different test descriptions and import line-wrapping.

## Difference table

| Aspect | A (rules ON) | B (rules OFF, fully clean) |
|---|---|---|
| State change path | `dispatch` + reducer (`task/priority-set`) | `dispatch` + reducer (`task/priority-set`) — identical |
| State library added | No | No |
| Export style | Named exports only | Named exports only |
| Type safety | Strict, typed `Priority` union, no `any` | Strict, typed `Priority` union, no `any` |
| Touched protected core? | No (`store.ts` untouched; `types.ts` only additive) | No (`store.ts` untouched; `types.ts` only additive) |
| Tests | 18/18 pass, 3 new + 2 updated | 18/18 pass, 3 new + 2 updated |

## Conclusion

For this specific prompt, no material behavioral difference was observed
between rules ON and a fully-clean rules OFF — both runs independently
converged on the same golden path. This isn't a null result about the rules
being pointless; it's a signal about *where* their value actually shows up.
The seeded codebase is small and highly consistent (four near-identical action
creators, one reducer with a uniform immutable-update idiom), and a capable
model reading that code before making a structurally analogous addition
naturally matched the existing pattern — with or without an explicit rule
saying to. The first (contaminated) OFF attempt was a more useful finding than
the eventual clean one: it showed the model will actively seek out and use
*any* discoverable project documentation — a command file, a rules file, an
AGENTS.md — as a behavioral anchor if one exists, which is arguably the more
important property to have than the rules mattering in this one narrow case.
Where I'd expect the ON/OFF gap to actually widen with this prompt style is on
narrower, less-inferable constraints the existing code doesn't visibly
demonstrate — e.g. the `lib/text.ts` hallucination guard (nothing in the
seeded code shows what helpers *don't* exist) or a prompt that tempts a new
dependency, rather than a prompt that just extends an already-uniform pattern.
