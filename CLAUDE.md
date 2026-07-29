# CLAUDE.md

See [AGENTS.md](./AGENTS.md) for context, conventions, and guardrails for this
homework repo.

Note: `app/AGENTS.md` is a **separate** file inside `app/`. It started as a
deliberately thin, single-tool stub and has been generalized into a cross-tool
baseline (Task B, done) — it is the guidance to follow when working *inside*
`app/`, while this root file covers the homework repo as a whole.

## Rules

The rule-set lives in `.cursor/rules/*.mdc` — seven rules, ~3.7k tokens total.
Cursor loads them automatically by `globs` / `alwaysApply`. **Claude Code does
not load them at all**, so if you are Claude Code:

> **Read `.cursor/rules/*.mdc` before your first edit under `app/`.** All seven.
> They are the binding rules for this repo; this file and `AGENTS.md` are only a
> summary of them.

This is deliberately an instruction to read, not an import. `@.cursor/rules/...`
import lines were tried here and **verified not to expand** — probed in a fresh
session on 2026-07-27, which saw this file's text but none of the rule bodies.
Do not re-add them believing they work.

Each rule's frontmatter carries a `globs:` line stating its intended scope
(`architecture.mdc` → `app/**`, `custom-lib.mdc` → `app/src/lib/**`, and so on).
Reading all seven and applying the ones that match is the closest equivalent to
what Cursor does automatically.

When adding a rule, no wiring is needed here — but say so in `AGENTS.md` if it
changes the summary.
