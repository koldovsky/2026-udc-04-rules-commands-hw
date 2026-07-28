# Cross-tool check (Task E — bonus)

**Tools:** **Claude Code** (entered via `app/CLAUDE.md`, a thin `@AGENTS.md`
pointer → `app/AGENTS.md`) and **GitHub Copilot in VS Code** (Agent mode, which
discovers the nested `app/AGENTS.md` natively). Two genuinely different tools and
underlying models — not the same engine twice.

**Same prompt used in both:** "Describe this project's conventions and
architecture: how state is managed and changed, export style, testing approach,
and which files are protected. Ground each claim in the actual `app/` code."

## Did the rules / AGENTS.md get picked up?

| Tool | Picked up rules/AGENTS.md without extra setup? | Notes |
|---|---|---|
| Claude Code (`app/CLAUDE.md`) | Yes | Read `app/CLAUDE.md`, which is a thin `@AGENTS.md` pointer, and resolved to `app/AGENTS.md` as the single source of truth. No extra setup. |
| GitHub Copilot (VS Code, Agent mode) | Yes | Discovered the **nested `app/AGENTS.md`** on its own while inspecting `app/src/` and reproduced the full baseline, citing real files/line ranges. VS Code supports nested `AGENTS.md` (see below), and the deeper `app/AGENTS.md` outranks the repo-root `AGENTS.md`. |

Both tools independently surfaced the same load-bearing points, each grounded in
`app/src/`:

- **Custom in-house store**, explicitly NOT Redux/Zustand/MobX — Copilot called
  it out as "the custom store IS the exercise".
- **State changes only via `store.dispatch(action)`** — both named `dispatch` as
  the sole gateway, through the pure reducer.
- **Immutable updates** (spread / `map` / `filter`, never in place).
- **Named exports only; no `any`/`@ts-ignore`.**
- **Vitest, colocated `*.test.ts`**; `npm test` / `npm run test:watch`.
- **Protected core**: both flagged `types.ts` and `store.ts` — Copilot even
  quoted the files' own **"PROTECTED CORE"** headers — and both described the
  extend-don't-modify golden path (Action union → reducer → creator → test).
- **Fixed `lib/text.ts` API** (`slugify`, `truncate`, `normalizeSpaces`), with
  the "don't hallucinate helpers / not lodash" caveat.
- **No new dependencies.**

## Differences observed

- **No substantive divergence** in the guidance each tool conveyed — the two
  descriptions matched on every point above. The main difference was
  presentation: Copilot cited explicit `file:line` ranges and rendered summary
  tables; Claude Code gave prose grounded in the same files.
- **Entry mechanic differs, baseline is identical.** Claude Code enters via
  `app/CLAUDE.md` and follows its `@AGENTS.md` pointer; Copilot reads
  `app/AGENTS.md` directly. Same file, no duplicated content, nothing to drift.
- **`.cursor/rules` are Cursor-specific** and are NOT what Copilot or Claude Code
  load. The portable layer across all three tools is `AGENTS.md` / `CLAUDE.md`;
  the `.mdc` rules are the Cursor-enforced projection of the same expectations.


## Conclusion

The Task B baseline is genuinely portable: the **same `app/AGENTS.md`** steered
three different tools — Cursor (via `.cursor/rules` projecting the same rules),
Claude Code (via the `CLAUDE.md` pointer), and GitHub Copilot in VS Code (via
native nested-`AGENTS.md` discovery) — to the same, code-grounded description of
the architecture, with no per-tool duplication. Because the Claude Code and
Copilot runs used **different tools and models**, this is a real cross-engine
result rather than one model twice; the only material dependency is that
Copilot's nested-`AGENTS.md` pickup needs a recent VS Code (else use a
`.github/copilot-instructions.md` fallback).
