# Cross-tool check (Task E — bonus)

**Tools:** Claude Code (`claude-fable-5`) + OpenAI Codex CLI 0.144.1
(`gpt-5.6-terra`, `--sandbox workspace-write`, fresh session).
**Same prompt used in both:** the change request from `materials/ab-task.md`
(add a `priority` field + a way to change it through the normal state flow),
verbatim — the same prompt as the A/B validation. Before the Codex run,
`app/src` was reset to the seeded state; afterwards it was restored to the
committed rules-ON result.

## Did the rules / AGENTS.md get picked up?

| Tool | Picked up rules/AGENTS.md without extra setup? | Notes |
|---|---|---|
| Claude Code | yes | Read `app/AGENTS.md` / `CLAUDE.md` and `.cursor/rules/*.mdc`; explicitly cited "do-not-touch" and "golden path" while working (see `docs/ab-validation.md`, scenario A). |
| Codex CLI | yes | Its literal FIRST command was `Get-Content app/AGENTS.md` — native `AGENTS.md` support, zero extra setup. It never read `.cursor/rules/` (Cursor-specific format), so the generalized `AGENTS.md` did all the steering. |

Codex's run, step by step: read `AGENTS.md` → read the source → one patch
adding `Priority` to `types.ts` (additions only), a `task/priority-set`
reducer case (immutable `map` + spread), a named-export `setTaskPriority`
creator → ran `npm test` (16 passed) AND `npm run typecheck` — exactly the
"finish every change with both commands green" guardrail from `AGENTS.md`.
No new dependencies, no `any`, `store.ts` untouched.

## Differences observed

- **Rule sources are tool-specific; `AGENTS.md` is the common denominator.**
  Claude Code consumed both `AGENTS.md` and the `.cursor/rules/` set; Codex
  only `AGENTS.md`. Because Task B folded the key constraints into
  `AGENTS.md`, Codex still behaved correctly — the baseline is what ported.
- **Action naming:** Codex chose `task/priority-set`, Claude Code
  `task/prioritySet` — the `AGENTS.md` convention list doesn't pin action
  string format, so each tool improvised (Codex's kebab-case actually matches
  the file-naming rule's spirit). A candidate improvement for the baseline.
- **Test depth:** Codex added 1 new test + extended the add-task test (16
  total); Claude Code with the full rule set added 4 (19 total), including an
  explicit immutability test — the extra depth came from `testing.mdc`,
  which Codex never saw.
- **Diff hygiene:** Codex's patch re-emitted a few untouched lines
  (whitespace churn around `toggleTask`/`removeTask`); Claude Code's diff was
  additions-only.
- Environment quirk, not a rules issue: Codex first hit the PowerShell
  execution policy on `npm.ps1` and self-recovered via `npm.cmd`.

## Conclusion

The generalized `AGENTS.md` proved genuinely portable: a second tool that has
never seen the Cursor rules picked it up automatically and followed the
golden path end-to-end. The gap that remained (fewer tests, unpinned action
naming) maps exactly to detail that lives only in `.cursor/rules/` —
i.e. the baseline carries the architecture, tool-specific rule files add the
discipline.
