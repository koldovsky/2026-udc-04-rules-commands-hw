# Cross-tool check (Task E — bonus)

**Tools:** Claude Code (executed live, see methodology note) + Cursor
(reasoned from documented behavior — not executed; see limitation below).
**Same prompt used in both:** "Describe this project's conventions and
architecture, focusing on the `app/` directory, and list which files are
off-limits to modify without approval."

## Methodology / limitation

Only one Agentic IDE (Claude Code) was actually available in this
environment — there is no way to launch a real Cursor session here. Rather
than skip Task E entirely (it's optional, and "absence is not an error" per
the walkthrough), this does two honest things instead of faking a second
tool's output:

1. **Claude Code** was tested for real: a fresh subagent with zero prior
   context was given only the prompt above, with no hints about which files
   to open, and was asked to separately report exactly which files it
   consulted and what showed up in its context automatically versus what it
   had to go find.
2. **Cursor**'s expected behavior is described from its documented,
   well-established rule-attachment mechanics (`globs` auto-attach on
   matching files, `alwaysApply: true` always attaches), applied to the
   actual 7 rule files in this repo — not a fabricated transcript. This is
   marked clearly below as *not executed*. If you have Cursor installed,
   the honest way to complete this table is to paste the same prompt there
   and compare against row 1.

## Did the rules / AGENTS.md get picked up?

| Tool | Picked up rules/AGENTS.md without extra setup? | Notes |
|---|---|---|
| Claude Code | **Partial** | Root `CLAUDE.md` (which points to root `AGENTS.md`) was injected into context automatically via a system-reminder, with zero deliberate action. Everything else — `app/AGENTS.md`, `app/CLAUDE.md`, and all 7 `.cursor/rules/*.mdc` files — was **not** auto-loaded; the model had to go find it. It did, quickly: a plain `ls` of the repo root surfaced a `.cursor/` directory, and root `AGENTS.md`'s "Conventions" section explicitly documents the `.cursor/rules/*.mdc` / `.cursor/commands/*.md` / `app/AGENTS.md` path convention, which pointed it straight there. End result was fully accurate (architecture, protected files, fixed `lib/text.ts` API, dependency policy all correctly described), but it took ~10 exploratory reads, not zero. |
| Cursor (not executed) | **Expected: yes, by design** | Cursor's rule engine auto-attaches any `.mdc` file whose `globs` match a file currently in context, and always attaches `alwaysApply: true` rules regardless. All 7 rules here use `globs: app/**` or narrower (or are `alwaysApply: true`), so touching anything under `app/` should pull in essentially the whole rule-set with no reminder needed — that's the mechanism the walkthrough is built around. Whether a current Cursor build also auto-reads `AGENTS.md` the way Claude Code reads `CLAUDE.md` was **not verified live** — confirm locally before relying on this row. |

## Differences observed

- **Discovery mechanism differs, not the content.** Claude Code's free
  auto-load is narrower (just root `CLAUDE.md`/`AGENTS.md`) than Cursor's
  (whole rule-set, glob-matched, by design) — but nothing in this repo's
  `.cursor/rules/*.mdc` content contradicts `app/AGENTS.md`; they were
  written to mirror each other, so whichever a given tool picks up first, the
  guidance is the same.
- Claude Code needed root `AGENTS.md` to act as a map ("rules live at
  `.cursor/rules/*.mdc`") before it went and read them — i.e. the cross-tool
  baseline (`AGENTS.md`) had real, observed value here beyond being "the
  Task B target": it's also what made a tool with no native `.cursor/rules`
  support find that content at all.
- A tool-specific file was genuinely load-bearing for Claude Code
  specifically: without root `CLAUDE.md` existing (pointing at `AGENTS.md`),
  there would have been zero automatic context — the model would have had to
  stumble onto the repo structure from a cold, contextless `ls` alone (which,
  to be fair, is exactly what surfaced `.cursor/` in this trial anyway).

## Conclusion

The baseline is portable in *content* — one rule-set, one `AGENTS.md`,
consistent across tools — but not in *discovery*: each tool needs its own
on-ramp (`CLAUDE.md` for Claude Code, the `.cursor/rules/globs` mechanism
for Cursor) to actually surface that shared content without a human
reminding it. Keeping both `CLAUDE.md` and `AGENTS.md` next to the
`.cursor/rules/` they mirror, as this repo now does at both the root and
`app/` level, is what makes that portability real rather than theoretical.
The Cursor half of this comparison should be re-run live by whoever has it
installed to confirm the "expected" row above.
