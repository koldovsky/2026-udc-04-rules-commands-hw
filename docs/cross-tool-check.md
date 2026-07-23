# Cross-tool check (Task E — bonus)

**Tools:** Cursor + Claude Code (CLI)
**Same prompt used in both:**
> "Add a new util `wordCount` to `app/src/lib/text.ts` following the existing pattern"

## Did the rules / AGENTS.md get picked up?

| Tool | Picked up rules/AGENTS.md without extra setup? | Notes |
|------|------------------------------------------------|-------|
| Cursor | Yes | Reads `.cursor/rules/*.mdc` natively (glob-matched). `app/AGENTS.md` visible as project file when opened or referenced. |
| Claude Code | Yes | Reads `app/CLAUDE.md` automatically (directory-scoped instructions). Commands from `.claude/commands/` available as slash commands. `AGENTS.md` visible as project context. |

## Observed behavior — both tools followed rules

| Aspect | Cursor (via `.cursor/rules/`) | Claude Code (via `app/CLAUDE.md`) |
|--------|-------------------------------|-----------------------------------|
| Named export | `export function wordCount` | `export function wordCount` |
| No `any` | Proper `string` typing | Proper `string` typing |
| Didn't touch `store.ts` | Correct — only `lib/text.ts` | Correct — only `lib/text.ts` |
| Colocated test | Added to `text.test.ts` | Added to `text.test.ts` |
| Test framework | vitest (AAA pattern) | vitest (AAA pattern) |
| No new dependencies | No npm install | No npm install |
| Function style matches existing | Same JSDoc + pure function pattern | Same JSDoc + pure function pattern |

## Differences observed

| Difference | Detail |
|-----------|--------|
| Rule delivery mechanism | Cursor uses `.mdc` frontmatter (`globs:`, `alwaysApply:`). Claude Code uses `CLAUDE.md` (flat markdown, directory-scoped). |
| Commands format | Identical — both tools read `.md` with `description` frontmatter + `$ARGUMENTS`. Shared via `.cursor/commands/` ↔ `.claude/commands/` (same files copied). |
| `AGENTS.md` pickup | Cursor shows it as project context; Claude Code uses it if referenced from root `CLAUDE.md`. For guaranteed pickup, `app/CLAUDE.md` mirror is needed. |
| Glob-based activation | Cursor activates rules per-glob automatically. Claude Code loads all `CLAUDE.md` in directory hierarchy — no glob filtering. |

## How portability was achieved

1. **`app/AGENTS.md`** — tool-agnostic baseline (structure, commands, conventions, architecture, guardrails). Works as reference for any tool.
2. **`app/CLAUDE.md`** — compact mirror of the same rules, ensures Claude Code loads them without relying on `.cursor/rules/`.
3. **`.cursor/commands/*.md`** copied to **`.claude/commands/*.md`** — identical format, both tools accept them as slash commands.
4. **`.cursor/rules/*.mdc`** — Cursor-specific enrichment (globs, alwaysApply) layered on top of the shared baseline.

## Conclusion

Правила портабельні між Cursor і Claude Code з мінімальним overhead: спільний
`AGENTS.md` як baseline + tool-specific delivery файли (`CLAUDE.md` для Claude
Code, `.mdc` для Cursor). Команди працюють в обох без змін — формат ідентичний.
Єдина відмінність — механізм активації (glob-matching vs directory-scoping), але
кінцева поведінка AI однакова: named exports, immutable patterns, colocated tests,
захищені файли не чіпаються.
