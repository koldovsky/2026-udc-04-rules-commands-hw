# Cross-tool check (Task E — bonus)

**Tools:** Cursor (Tool 1) + opencode/nemotron-3-ultra-free (Tool 2)
**Same prompt used in both:** "Describe this project's conventions."

## Did the rules / AGENTS.md get picked up?

| Tool | Picked up rules/AGENTS.md without extra setup? | Notes |
|---|---|---|
| Cursor (Tool 1) | yes | Loaded root `AGENTS.md`, workspace `.cursor/rules/*.mdc` (architecture, conventions, do-not-touch, testing, custom-lib, actions-selectors), and `materials/architecture-brief.md` context. Described custom store, named exports, immutability, protected core, vitest colocated tests, fixed `lib/text.ts` API — without the user restating those rules in the prompt. |
| opencode/nemotron-3-ultra-free (Tool 2) | yes | Loaded root `AGENTS.md`, read `.cursor/rules/*.mdc` (6 rules), `.cursor/commands/*.md` (3 commands), `.claude/commands/*.md` (3 commands), `app/AGENTS.md`, `materials/architecture-brief.md`. Described custom store, protected core, action pattern, selectors, immutable updates, fixed `lib/text.ts` API, conventions (named exports, no any, immutable, kebab-case), vitest, no lint, rules/commands structure — without the user restating those rules in the prompt. |

## Differences observed

Both tools picked up the same core conventions from the shared `AGENTS.md` and rule files. Tool 1 (Cursor) explicitly noted loading `.cursor/rules/*.mdc` and `materials/architecture-brief.md` as context. Tool 2 (opencode) additionally discovered the `.cursor/commands/` and `.claude/commands/` command files, which Tool 1's notes didn't explicitly mention. No tool-specific files (`CLAUDE.md`, `.github/copilot-instructions.md`) were needed on top of the shared `AGENTS.md`.

## Conclusion

The baseline `AGENTS.md` + rule/command files proved highly portable — both tools independently reconstructed the same architectural conventions and constraints without extra prompting, demonstrating the cross-tool baseline works in practice.
