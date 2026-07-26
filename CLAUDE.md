# CLAUDE.md

See [AGENTS.md](./AGENTS.md) for context, conventions, and guardrails for this
homework repo.

Note: `app/AGENTS.md` is a **separate** file scoped to the sample app (Task B —
now generalized into a tool-agnostic baseline). It is authoritative for work
inside `app/`; `app/CLAUDE.md` just imports it so Claude Code picks it up too.

## Project rules (shared with Cursor — single source of truth)

The Task A rule-set lives in `.cursor/rules/` because that is the path the graded
review looks at. Claude Code does not read `.mdc` files on its own, so the imports
below pull the exact same files in — one rule-set, two tools, no duplication.

@.cursor/rules/architecture.mdc
@.cursor/rules/do-not-touch.mdc
@.cursor/rules/conventions.mdc
@.cursor/rules/state-access.mdc
@.cursor/rules/testing.mdc
@.cursor/rules/custom-lib.mdc
@.cursor/rules/dependencies.mdc

The `globs` / `alwaysApply` keys in those files are Cursor's activation syntax;
Claude Code ignores them and loads every imported rule for the whole session.

> **Task D note:** to run the "rules OFF" pass, renaming `.mdc` → `.mdc.off` is not
> enough — comment out the seven imports above as well, or Claude Code keeps reading
> the rules and the A/B comparison is meaningless.
