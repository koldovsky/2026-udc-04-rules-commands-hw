# CLAUDE.md — `app/`

Cross-tool bonus for Task B: Cursor and Copilot read `AGENTS.md`, Claude Code
reads `CLAUDE.md`. Rather than duplicate the baseline (two copies drift), this
file imports it — one source of truth, every tool.

@AGENTS.md

Enforceable rules for this app live in `../.cursor/rules/*.mdc` and are imported
by the repo-root `CLAUDE.md`, so they are already active in this session.
