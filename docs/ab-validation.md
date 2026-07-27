# A/B validation (Task D)

> Both runs are captured and analysed below. Findings are taken from the two
> saved diffs (`run-a.diff`, `run-b-app.diff`), verified by re-applying each to
> a clean tree and running `tsc --noEmit` and `npm test` — not from memory of
> what the chat said.

**Rule(s) under test:** `architecture.mdc`, `conventions.mdc`, `do-not-touch.mdc`,
`dependencies.mdc`, `custom-lib.mdc`, `state-access.mdc`, `testing.mdc`
**Prompt (same for A and B):** the change request from `materials/ab-task.md`
— add a `priority` field to `Task` (`"low" | "normal" | "high"`, default
`"normal"`) plus a way to change it, kept type-safe with tests green.
**Tool used:** Claude Code
**Model used:** Opus 5 (same model in both runs)
**Date:** 2026-07-27

## ⚠️ Validity caveat — read this before the results

Both runs were done in **Claude Code**, but the toggled artefacts were
`.cursor/rules/*.mdc`. Claude Code does not automatically load
`.cursor/rules/*.mdc` — its native context files are `CLAUDE.md` and
`AGENTS.md`. Cursor loads `.mdc` rules by `globs`/`alwaysApply`; Claude Code has
no equivalent auto-loading for that directory, and this repo has no hook or
setting that injects them (`.claude/settings.local.json` only sets a Bash
permission).

So the honest reading is that **the ON/OFF toggle probably toggled nothing** in
this tool. In both runs the agent most likely saw the same context —
`AGENTS.md`, `app/AGENTS.md`, `CLAUDE.md`, `app/CLAUDE.md` — which stayed active
throughout by design.

There is one loose thread: `AGENTS.md` and `app/AGENTS.md` *point* at
`.cursor/rules/*.mdc` by path, so an agent could choose to open them. That is
opportunistic, not automatic, and in run B those paths did not resolve (the
files were renamed `.off`). Whether either run actually read them is not
recorded.

This does not invalidate the observations below — the two diffs are real and
verified — but it changes what they are evidence *of*. See the Conclusion.

**Attempted fix, and what it taught.** The root `CLAUDE.md` was given
`@.cursor/rules/*.mdc` import lines to pull the rules in. A probe in a fresh
Claude Code session on 2026-07-27 showed **the imports do not expand**: the
session had the current `CLAUDE.md` text (including the literal `@` lines) but
none of the rule bodies — three separate rules-only markers (`escapeHtml`, the
`actions.ts`→`store.ts` circular-import point, and the `grep -rn` verification
commands) all came back "NOT IN CONTEXT".

The probe file itself mentioned those three marker words, so it was not a
perfectly sterile test — but contamination could only have produced a false
*positive*, and the result was negative, so the conclusion holds.

The import lines have since been removed and replaced with an explicit
instruction to read `.cursor/rules/*.mdc`. The practical consequence for this
document stands: **Claude Code is the wrong tool for this A/B**, because there
is no automatic mechanism there for the rules to be toggled on and off. The
faithful re-run belongs in Cursor.

## What "OFF" means in run B

**Rules only.** Run B disabled the seven `.cursor/rules/*.mdc` files (renamed to
`*.mdc.off`) and nothing else. `AGENTS.md`, `app/AGENTS.md`, `CLAUDE.md` and
`app/CLAUDE.md` stayed active in **both** runs.

This is a deliberate choice, and it narrows what the experiment measures. Those
baseline files already carry much of the same guidance — the golden path, the
"not Redux/Zustand" constraint, the protected core, named exports. So this A/B
measures the **marginal** value of the glob-scoped rule-set *on top of* an
already-good `AGENTS.md`, not the value of having any agent context at all.

Two consequences to keep in mind when reading the results below:

- A **small** difference is a legitimate outcome here, and it does not mean the
  rules are worthless — it may mean `AGENTS.md` is already doing the heavy
  lifting. Say that plainly in the conclusion rather than inflating the gap.
- The rules carry things the baseline does not spell out — `domain/pastTense`
  action naming, the `noUncheckedIndexedAccess` guard, the "ask before editing
  the protected core" handshake, the per-rule `How to verify` steps. Those are
  where a difference, if any, should show up first. Watch them specifically.

Both runs started from an identical clean working tree (`git status` clean, the
seeded 15 tests green), same model, new chat each time, prompt pasted verbatim
with no follow-up steering.

## Result A — rules ON

The agent followed the golden path exactly, in order: `types.ts` → `reducer.ts`
→ `actions.ts` → colocated test.

- Added `export type Priority = "low" | "normal" | "high"` and a **required**
  `priority` field on `Task` in `types.ts`, plus the union variant
  `{ type: "task/prioritized"; payload: { id: TaskId; priority: Priority } }`.
  The `domain/pastTense` naming convention was followed without prompting.
- Handled the new action in `reducer.ts` immutably (`.map` + spread), placed
  above `default`. `store.ts` was **not touched at all**.
- Added the creator `setPriority(id, priority): Action` in `actions.ts` —
  returning `Action`, not a narrowed literal.
- Added three tests and updated the two existing fixtures that the now-required
  field invalidated. One test asserts immutability by identity, exactly as
  `testing.mdc` prescribes:
  `expect(next.tasks[1]).toBe(withTasks.tasks[1])` together with
  `expect(next.tasks[0]).not.toBe(withTasks.tasks[0])`.
- No new dependency, no state library, named exports throughout, no `any`,
  no `@ts-ignore`.

Verified by re-applying `run-a.diff` to a clean tree: `npx tsc --noEmit` clean,
`npm test` **18 passed** (15 seeded + 3 new).

**No handshake before the protected-file edit.** `do-not-touch.mdc` requires the
agent to announce a protected-file edit and wait for approval before touching
`types.ts`. The edit was additive and permitted in substance, but the agent
edited silently. Given the validity caveat, the likeliest explanation is simply
that the rule was never in context — not that it was read and ignored.

Design decision worth noting: `priority` was made **required** rather than
optional, which is more type-safe but forced the existing test fixtures to be
updated. An optional field would have been a defensible alternative.

Files touched:

```
 app/src/actions.ts      |    6 +++++-
 app/src/reducer.test.ts |   36 ++++++++++++++++++++++++++++++++----
 app/src/reducer.ts      |   17 ++++++++++++++++-
 app/src/types.ts        |    4 ++++
 4 files changed, 57 insertions(+), 6 deletions(-)
```

## Result B — rules OFF

**Run B produced essentially the same change as run A.** None of the failure
modes the rules were written to prevent appeared: no state library, no direct
mutation, no default export, no `any`, no edit to `store.ts`, no hallucinated
`lib/text.ts` helper, and the tests were written without being asked.

The strongest evidence is the git blob hashes. Two of the four files came out
**byte-identical** across the two runs:

| File | Result blob — run A | Result blob — run B |
|---|---|---|
| `app/src/types.ts` | `b1cbee0` | `b1cbee0` — identical |
| `app/src/reducer.ts` | `c348eba` | `c348eba` — identical |
| `app/src/actions.ts` | `0b58f8e` | `0574916` — differs |
| `app/src/reducer.test.ts` | `25cc54e` | `b457f7b` — differs |

The `Action` variant name (`task/prioritized`), the `Priority` type, the
required `priority` field, the immutable `.map` + spread reducer case — all
chosen identically without the rules present.

The two files that differ, differ almost entirely cosmetically:

- Creator named `setTaskPriority` (B) vs `setPriority` (A).
- Multi-line vs single-line import formatting.
- Different test titles and a different order of the same three test cases.

**One substantive difference, in run A's favour.** Both runs assert that
untouched tasks keep their identity:
`expect(prioritized.tasks[1]).toBe(withTasks.tasks[1])`. Only run A additionally
asserts that the *changed* task is a new object:

```ts
expect(next.tasks[0]).not.toBe(withTasks.tasks[0]);
```

Without that second assertion, run B's test would still pass if the reducer
mutated the target task in place — which is precisely the bug the immutability
rule exists to catch. This is the one place `testing.mdc` measurably raised the
bar.

Verified on the working tree as produced: `npx tsc --noEmit` clean, `npm test`
**18 passed**.

Files touched:

```
 app/src/actions.ts      |    6 +++++-
 app/src/reducer.test.ts |   41 +++++++++++++++++++++++++++++++++++++----
 app/src/reducer.ts      |   17 ++++++++++++++++-
 app/src/types.ts        |    4 ++++
 4 files changed, 62 insertions(+), 6 deletions(-)
```

> Capture note: the raw `run-b.diff` is 27 KB because `git diff` also recorded
> the seven `.mdc` → `.mdc.off` renames as deletions. The run's actual output is
> the `app/`-only slice (`run-b-app.diff`, 5.1 KB), which is what is analysed
> above. Worth knowing for anyone repeating this: capture with
> `git diff -- app/`, not a bare `git diff`.

## Difference table

Each row is checkable from the two diffs, not from impression.

| Aspect | A (rules ON) | B (rules OFF) | Differs? |
|---|---|---|---|
| State change path | `dispatch` + reducer | `dispatch` + reducer | no |
| `Action` union extended in `types.ts`? | yes — `task/prioritized` | yes — `task/prioritized` | no (file byte-identical) |
| Action naming follows `domain/pastTense`? | yes | yes | no |
| Reducer update immutable? | yes — `.map` + spread | yes — `.map` + spread | no (file byte-identical) |
| Action creator added in `actions.ts`? | yes — `setPriority` | yes — `setTaskPriority` | name only |
| State library added to `package.json`? | no | no | no |
| Export style | named | named | no |
| `any` / `@ts-ignore` present? | no | no | no |
| Touched protected core (`store.ts`)? | no | no | no |
| Asked before editing protected `types.ts`? | **no — edited silently** | no (no rule demanded it) | no |
| Colocated test added? | yes — 3 new cases | yes — 3 new cases | no |
| Asserts untouched tasks keep identity? | yes | yes | no |
| **Asserts the changed task is a new object?** | **yes — `.not.toBe(...)`** | **no** | **yes** |
| `npm test` green? | yes — 18 passed | yes — 18 passed | no |
| `npm run typecheck` clean? | yes | yes | no |
| `priority` required vs optional | required; fixtures updated | required; fixtures updated | no |

One row out of sixteen shows a real difference.

## Conclusion

**The result is near-null, and the most likely reason is the tool, not the
rules.** `types.ts` and `reducer.ts` came out byte-identical across the two
runs, and every guarantee the rules protect held in run B. Given the caveat
above, the simplest explanation is that Claude Code never loaded the `.mdc`
files in *either* run — so both runs had identical context, and the residual
differences (a creator named `setTaskPriority` vs `setPriority`, different test
titles, one extra assertion) are ordinary run-to-run variation from a
non-deterministic model, not evidence about the rules.

I originally read the one substantive difference — run A asserting
`.not.toBe(...)` on the changed task — as `testing.mdc` earning its keep. With
the caveat in view that claim does not hold up: a single unreplicated run cannot
distinguish "the rule worked" from "the model happened to write a better test
this time". It is recorded above as an observation, not as proof.

**What this experiment actually established:**

- The `AGENTS.md` baseline from Task B is sufficient, on its own, to get the
  golden path, immutable updates, named exports, no state library, no `any`, an
  untouched `store.ts`, and unprompted tests — in Claude Code, for this task.
- Whatever the `.mdc` rule-set contributes, **this run did not measure it.**

**What it did not establish:** anything about the rules themselves, in either
direction.

To actually measure the rule-set, one of these is needed:

1. **Re-run the A/B in Cursor**, which does auto-load `.cursor/rules/*.mdc` by
   `globs`/`alwaysApply`. Same prompt, same procedure. This is the faithful
   version of the experiment as the assignment intends it.
2. **Not Claude Code.** The `@` import route was tried and does not work (see
   above), so there is no automatic loading there to switch off. Rules only
   reach Claude Code if the agent is told to read them, and an instruction the
   agent may or may not follow is not a controllable experimental variable.
3. **Or test the context layer as a whole** — an `off-all` run that also parks
   `AGENTS.md`/`CLAUDE.md`. That answers a different but real question: what the
   baseline is worth versus no context at all.

### Why option 1 was not done — a hard blocker, not a skipped step

**The Cursor re-run is currently impossible for me: the free-plan request quota
on this account is exhausted.** Cursor's free tier caps AI requests, and the cap
was reached before this A/B could be repeated there. Two clean runs (rules ON,
rules OFF) of a multi-file change plus follow-up verification are well past what
the remaining budget allows, and a partial run would be worse than none — it
would produce a diff I could not attribute to the rules or to a truncated
session.

So option 1 stays as the correct next step, not as an oversight. It needs either
a paid Cursor plan or a quota reset; both are outside what this submission can
arrange. Options 2 and 3 do not substitute for it: option 2 is the negative
finding already recorded above, and option 3 measures a different variable
(baseline context vs no context), not the rule-set.

The same blocker applies to `docs/cross-tool-check.md`, whose Cursor row is
`PENDING` for this reason.

Two further limits worth stating so the result is not over-read:

- **A single task is a weak sample**, and `priority` maps very cleanly onto the
  existing `toggleTask` pattern — the model had a strong in-file example to
  imitate regardless of any rule.
- **One run per condition** measures nothing about variance. Any future
  comparison needs several runs per condition before a one-row difference in a
  table means anything.

## Follow-up

### `do-not-touch.mdc` — the handshake clause contradicted itself (fixed)

Run A prompted a close read of the rule, which turned up a real defect in its
wording. To be precise about provenance: the experiment did **not** prove this
caused the missing handshake — per the caveat above, the rule most likely was
never loaded. The defect was found by reading the rule, and is worth fixing on
its own merits. The rule said both of these:

> `types.ts` — ADDITIVE changes only (a new `Action` variant, a new optional
> field on `Task`).

> Before any edit to these files, state in the reply: which file, what the
> addition is, and why the reducer/actions layer could not absorb it. Then wait
> for a yes.

The first sentence grants blanket permission for additive edits; the second
demands approval for *any* edit. Faced with a request that is unambiguously
additive, reading it as "this is the allowed category, proceed" is the more
natural interpretation — so the handshake never happened.

**Fixed after both runs were captured** (editing it earlier would have made the
runs incomparable). The single ambiguous block was replaced with three
explicitly separated cases:

1. `store.ts` — no edits at all without approval, including comments and
   formatting.
2. `types.ts`, **additive** — allowed **without** approval, but the reply must
   list every addition by name. Silent extension now violates the rule even when
   the diff itself is clean.
3. `types.ts`, **non-additive** (rename / remove / retype / narrow, or making an
   optional field required) — stop and ask.

A note was also added that adding a *required* field to `Task` is case 2 but
breaks every existing object literal, so it must be called out with the fixtures
it forced to change — exactly what both runs did silently. A fourth `How to
verify` step now checks for the announcement, not just for a clean diff.

**Still unproven.** Confirming the fix works needs a run in a tool that actually
loads `.cursor/rules/` — i.e. Cursor. That is the same re-run the Conclusion
calls for, and it is blocked by the exhausted free-plan quota described there.
