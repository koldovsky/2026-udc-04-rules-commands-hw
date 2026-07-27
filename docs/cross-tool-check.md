# Cross-tool check (Task E)

> **Status: method fixed, results pending.** The probe below has been designed
> and its discriminators verified; the two runs have not been recorded yet.
> Every results cell is marked `PENDING` on purpose — nothing here is filled in
> from expectation.

**Tools:** Cursor · Claude Code (Opus 5)
**Same prompt used in both:** a context-introspection probe, verbatim in
`task-e-probe.txt` — six questions, no tools allowed, "NOT IN CONTEXT" required
where a thing is absent.

## Why not "describe this project's conventions"

The walkthrough suggests a behavioural prompt. I used an introspection probe
instead, for one reason: **a behavioural prompt cannot tell a loaded rule from a
lucky guess.** Asked to add a util, a competent model will use named exports and
a colocated test whether or not it read `conventions.mdc` — those are ordinary
TypeScript habits, and the surrounding code demonstrates them. A pass proves
nothing, and a fail is ambiguous.

So the probe asks what is *in context*, and each question targets a string that
exists in exactly one file in the repo. That converts "did the rules steer it?"
into "did the bytes arrive?", which is checkable.

## Discriminators

Each marker was verified unique across every `*.md` and `*.mdc` in the repo
(`docs/` excluded — it is not loaded as context):

| Q | Marker | Lives only in | Loading mode |
|---|---|---|---|
| 2 | `Documentation language: Ukrainian or English` | `AGENTS.md` (root) | tool-neutral baseline |
| 3 | `verified not to expand` | `CLAUDE.md` (root) | Claude-Code-specific baseline |
| 4 | heading `Definition of done for a change here` | `app/AGENTS.md` | nested baseline |
| 5 | `grep -rn "from \"[a-z@]" app/src` | `.cursor/rules/dependencies.mdc` | `alwaysApply: true` |
| 6 | `escapeHtml`, `pad`, `words` | `.cursor/rules/custom-lib.mdc` | `globs: app/src/lib/**` |

Q5 and Q6 are split deliberately. `dependencies.mdc` is always-on;
`custom-lib.mdc` is glob-scoped. A tool that answers Q5 but not Q6 is doing glob
scoping correctly, which is a different result from not loading rules at all —
and a table with one "rules" row would have hidden the difference.

## Did the rules / AGENTS.md get picked up?

| Tool | Q2 root `AGENTS.md` | Q3 root `CLAUDE.md` | Q4 `app/AGENTS.md` | Q5 alwaysApply rule | Q6 glob-scoped rule | Verdict |
|---|---|---|---|---|---|---|
| Cursor | PENDING | PENDING | PENDING | PENDING | PENDING | PENDING |
| Claude Code | PENDING | PENDING | PENDING | PENDING | PENDING | PENDING |

### Prior evidence (different probe, same question)

One data point already exists and is worth stating before the runs, so it can be
confirmed or contradicted rather than quietly reused. A fresh Claude Code
session on 2026-07-27 was given an earlier probe of the same shape. It loaded
root `CLAUDE.md` in full and reported **NOT IN CONTEXT** for three separate
rules-only markers. That is what removed the `@.cursor/rules/*.mdc` import lines
from `CLAUDE.md` — they had been added on the assumption they worked, and did
not. See `docs/ab-validation.md`.

That probe did not ask about `app/AGENTS.md`, and it never ran in Cursor. Both
gaps are what this check closes.

## Differences observed

PENDING — fill from the raw answers, not from the summary.

## Conclusion

PENDING.
