# Cross-tool check (Task E — bonus)

**Tools:** Claude Code + Cursor
**Same prompt used in both:** «додай новий util за зразком `lib/text.ts`»
(add a new util following the pattern of `app/src/lib/text.ts`)

## Did the rules / AGENTS.md get picked up?

| Tool | Picked up rules/AGENTS.md without extra setup? | Notes |
|---|---|---|
| Claude Code | yes | Blind test (fresh session, isolated worktree checkout, no hints given beyond the prompt above). It proactively read `AGENTS.md`, `CLAUDE.md`, `app/AGENTS.md`, `app/CLAUDE.md`, and all 6 `.cursor/rules/*.mdc` files before writing any code. Result: added `wordCount(input: string): number` to `app/src/lib/text.ts` with a colocated AAA-style vitest test in `text.test.ts` — named export only, no `any`/`@ts-ignore`, no hallucinated lodash-style helper, no touch to `store.ts`/`types.ts`, no new dependency. `npm test` and `npm run typecheck` both passed. |
| Cursor | not tested | Ran out of Cursor usage/quota before the same prompt could be run, so there is no real observation for this row — only the Claude Code side was actually exercised. |

## Differences observed

Could not compare tool-specific pickup behavior directly since the Cursor run didn't happen. One portability-relevant nuance did surface while setting up the Claude Code blind test: `.cursor/rules/` and `.claude/commands/` are currently **untracked** in git (`git status` shows `?? .cursor/`, `?? .claude/`) in this repo, while `AGENTS.md`/`CLAUDE.md` at the root and in `app/` are committed. A first blind-test attempt used an isolated `git worktree` checkout, which only materializes committed files — so that run saw `AGENTS.md`/`CLAUDE.md` but not the 6 `.cursor/rules/*.mdc` files at all, even though the on-disk repo has them. Once the untracked rule/command files were copied into the worktree by hand, the rerun picked them up and followed them precisely. Takeaway: the baseline's portability across tools (and across machines/CI) depends on the rule files actually being **committed**, not just present in the working directory.

## Conclusion

Only one side of the cross-tool comparison could be verified in practice (Cursor usage ran out before its run): Claude Code picked up `AGENTS.md`/`CLAUDE.md`/`.cursor/rules/*.mdc` on its own and followed every rule with no extra reminders, which is a good sign for the baseline's portability — but the actual bonus goal (comparing two tools side by side) is incomplete pending a Cursor run with remaining quota.
