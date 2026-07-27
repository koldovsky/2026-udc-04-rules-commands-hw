# Cross-tool check (Task E — bonus)

**Tools:** Claude Code + GitHub Copilot
**Same prompt used in both:** "Describe this project's conventions."

## Did the rules / AGENTS.md get picked up?

| Tool           | Picked up rules/AGENTS.md without extra setup? | Notes                                                                                                                                                       |
|----------------|------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Claude Code    | no — needs `app/CLAUDE.md`                     | Pointer file to `AGENTS.md`. Once present: full adherence, matches the real Task D diff.                                                                    |
| GitHub Copilot | no — needs `.github/copilot-instructions.md`   | Copilot can read `AGENTS.md` directly, but some surfaces still key off this file as native entrypoint. Even then, adherence is mostly, not fully, reliable. |

## Differences observed

Both needed a tool-specific file on top of `AGENTS.md` — neither picked it up
zero-config. `CLAUDE.md` could just point to `AGENTS.md`, because Claude
Code's agentic loop reads referenced files into context every session.
`.github/copilot-instructions.md` had to excerpt the rules instead: Copilot's
instruction mechanism, especially for inline completions, injects a fixed
block of text per request rather than reliably chasing a file reference
first. Even with its excerpt in place, Copilot follows the rules less
consistently than Claude Code.

## Conclusion

The `AGENTS.md` rules themselves are portable, but not the "just point to it"
convenience — Claude Code gets that from being agentic, Copilot needs the
rules restated in its own native file and still warrants closer review.
