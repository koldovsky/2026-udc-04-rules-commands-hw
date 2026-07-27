# CLAUDE.md

See [AGENTS.md](./AGENTS.md) for context, conventions, and guardrails for this
homework repo.

Note: `app/AGENTS.md` is a **separate** file inside `app/`. It started as a
deliberately thin, single-tool stub and has been generalized into a cross-tool
baseline (Task B, done) — it is the guidance to follow when working *inside*
`app/`, while this root file covers the homework repo as a whole.

## Rules

The rule-set lives in `.cursor/rules/*.mdc`. Cursor loads those automatically by
`globs` / `alwaysApply`; Claude Code does not, so they are pulled in explicitly
below. Both tools therefore run on the same rule text — one source of truth, no
second copy to drift.

@.cursor/rules/architecture.mdc
@.cursor/rules/conventions.mdc
@.cursor/rules/do-not-touch.mdc
@.cursor/rules/testing.mdc
@.cursor/rules/custom-lib.mdc
@.cursor/rules/dependencies.mdc
@.cursor/rules/state-access.mdc

Two differences from how Cursor applies these, worth knowing:

- **No glob scoping here.** Cursor activates `architecture.mdc` only for
  `app/**`; via this import every rule is in context for every session in this
  repo, whatever you are editing. That costs ~3.7k tokens and means a rule may
  apply somewhere its `globs:` line says it should not — when in doubt the
  frontmatter of each rule states its intended scope.
- **`.mdc` frontmatter comes along** with the imported text. It is metadata for
  Cursor, not instructions; read the `# Rule Name` / `## Rule` body.

When adding a rule, add its `@` line here too, or Claude Code will silently not
see it — which is exactly the failure documented in `docs/ab-validation.md`.
