# Cross-tool check (Task E — bonus)

> Verify the SAME rules / `AGENTS.md` steer a second tool. Fill in after running
> the same short prompt in two tools.

**Tools:** GitHub Copilot (VS Code, GPT-5.5) + Claude Code. This repo carries the
cross-tool baseline in `AGENTS.md` + `app/AGENTS.md` (+ `app/CLAUDE.md`), the
Cursor rules in `.cursor/rules/`, a Copilot mirror in
`.github/copilot-instructions.md`, and commands in `.cursor/commands/` +
`.claude/commands/`.
**Same prompt used in both:** the `materials/ab-task.md` request — "add a
`priority` field to `Task` (`low | normal | high`, default `normal`), add a way
to change it through the normal state flow, keep it type-safe and tests green".

## Did the rules / AGENTS.md get picked up?

| Tool | Picked up rules/AGENTS.md without extra setup? | Notes |
|---|---|---|
| GitHub Copilot (GPT-5.5) | Yes — via `.github/copilot-instructions.md` | Reply cited `copilot-instructions.md` as a reference; followed golden path (dispatch + immutable reducer, colocated + store-level tests, no `any`, protected core additive-only). |
| Claude Code | Yes — via `AGENTS.md` | Explicitly reasoned "following the golden path from AGENTS.md"; identified the `Priority` union, additive `Task` field, `task/prioritized` variant, immutable `map` reducer, `setPriority` creator, and confirmed 19/19 tests + clean typecheck with no protected-core violations. |

## Differences observed

- **Rule discovery differs by tool.** Copilot does **not** read `.cursor/rules/*.mdc`;
  it needed the Copilot-native `.github/copilot-instructions.md` mirror. Claude
  Code picked the same guidance straight from `AGENTS.md` with no extra file.
  So the portable carrier is `AGENTS.md`; each tool also has a native surface
  (`.cursor/rules/`, `.github/copilot-instructions.md`, `CLAUDE.md`).
- **Behaviour on an already-implemented tree.** Because the run happened with the
  rules-ON `priority` implementation restored, Claude Code correctly detected the
  feature was already present and reported "nothing to change" instead of
  re-implementing — a sensible, idempotent read of the same golden path Copilot
  wrote to.
- **Same architecture, same guardrails** across both: named exports, no `any`,
  no state library, immutable updates, protected core untouched.

## Conclusion

The baseline is genuinely portable: the identical intent produced identical
architecture in two different tools, as long as each tool's native instruction
surface mirrors `AGENTS.md`. `AGENTS.md` is the source of truth; `.cursor/rules/`
and `.github/copilot-instructions.md` are thin per-tool projections of it.


