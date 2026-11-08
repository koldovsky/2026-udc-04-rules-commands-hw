---
description: "Read-only audit of a path (default app/src) against every rule in .cursor/rules/ with a status table"
---

Audit this path against the project rules: $ARGUMENTS

If $ARGUMENTS is empty, audit `app/src`.

READ-ONLY: never create, edit, or delete files, and never install packages. Only read files and run read-only commands (`git grep`, `git diff`, `Get-ChildItem`, `npm test`, `npm run typecheck`).

1. List every rule in `.cursor/rules/*.mdc`, currently `architecture.mdc`, `conventions.mdc`, `do-not-touch.mdc`, `testing.mdc`, `custom-lib.mdc`, `no-new-deps.mdc`. Include any new ones too.
2. For each rule, read its `## Rule` and `## How to verify` sections.
3. Run each "How to verify" check that applies to the audited path, narrowing `-- app/src` to that path where it makes sense. Shell is PowerShell: never use `2>nul` or `>nul`.
4. Read the audited files yourself for violations the greps cannot catch (e.g. in-place mutation, inline `state.tasks` filtering, hand-built action objects).
5. Mark a rule OK only when every relevant check passes. If a rule does not apply to the path (e.g. `testing.mdc` with no `*.test.ts` files in scope), mark it OK and say "not applicable" in the Evidence column.

Output exactly one table with one row per rule file:

| Rule file | Status (OK / VIOLATION) | Evidence (file:line or command output) | Suggested fix |
|---|---|---|---|

- For a VIOLATION, cite each offending `file:line` or the failing command with its key output line.
- Describe each suggested fix in one sentence; do not apply it.

End with one line: `Summary: <N> OK, <M> VIOLATION out of <total> rules for <path>.`
