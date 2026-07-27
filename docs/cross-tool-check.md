# Cross-tool check (Task E — bonus)

**Tools:** Claude Code + GitHub Copilot (model: MAI-Code-1-Flash)
**Same prompt used in both:** "Add a new util to `app/src/lib/text.ts`
following the existing pattern in that file."

## Did the rules / AGENTS.md get picked up?

| Tool | Picked up rules/AGENTS.md without extra setup? | Notes |
|---|---|---|
| Claude Code | yes | Fresh session, no hints given. Read root `CLAUDE.md` → `AGENTS.md`, then `app/CLAUDE.md` → `app/AGENTS.md`, then `app/src/lib/text.ts`'s own header comment, all unprompted, before writing any code. |
| GitHub Copilot (MAI-Code-1-Flash) | yes (partial evidence) | Reported opening `text.ts` and its test file first, then explicitly "checking the brief and nearby conventions to choose a helper that fits the project's intended API" before writing code — consistent with picking up `architecture-brief.md`/`AGENTS.md`-level guidance, though the exact files read weren't itemized in its summary. |

## What each tool did (verified)

**Claude Code:** added `capitalize(input: string): string` to
`app/src/lib/text.ts` — named export, one-line JSDoc matching the style of
`slugify`/`truncate`/`normalizeSpaces`, no `any`, no changes to existing
functions. Added a colocated test in `app/src/lib/text.test.ts` (2 cases:
normal string, empty string). Did not touch `app/src/store.ts` or
`app/src/types.ts`; no new dependencies. `cd app && npm test`: 21/21
passing; `npm run typecheck`: clean.

**GitHub Copilot (MAI-Code-1-Flash):** independently added the **same**
helper, `capitalize`, in `text.ts` (its run happened after Claude Code's and
ended up overwriting that version in place — the two implementations were
functionally identical, just a slightly different one-line doc comment:
Copilot's reads `Capitalize the first character of the input string.` vs
Claude Code's more example-driven phrasing), with matching tests added first
in `text.test.ts` ("regression test first, in the same style as the existing
text utilities"). Verification: 3 test files passed, 21/21 tests passing.
(One tool-side hiccup unrelated to the code: the first test run hit a local
PowerShell execution-policy restriction, resolved by relaxing the policy for
that shell session — not a rules or code issue.)

Re-verified independently after both runs: `app/src/lib/text.ts` and
`app/src/lib/text.test.ts` on disk currently hold Copilot's version of
`capitalize` (named export, one-line JSDoc, no `any`) with its 2 test cases;
`cd app && npm test` is 21/21 green and `npm run typecheck` is clean.

Both tools converged on `capitalize` — the exact example name that
`custom-lib.mdc` and `lib/text.ts`'s own header comment call out as a
function agents commonly *hallucinate* into existing without adding it.
Here, both tools treated it correctly as something to add for real rather
than assume already present.

## Differences observed

Суттєвої розбіжності немає: обидва інструменти додали ту саму функцію, у
тому самому файлі, як named export, з колокованим тестом, без правок
захищених файлів чи нових залежностей — і обидва завершили роботу з
повністю зеленим тестовим набором. Єдина відмінність була несуттєвою —
Copilot зіткнувся з локальним обмеженням PowerShell execution-policy перед
верифікацією і сам його усунув; це не пов'язано з правилами чи вмістом
AGENTS.md.

## Conclusion

Базовий контекст (`AGENTS.md`/`CLAUDE.md` разом із правилом `custom-lib.mdc`)
підтвердив свою портативність на практиці: два різні інструменти, отримавши
однаковий короткий промпт без додаткових підказок, самостійно виявили й
дотрималися фіксованого API `lib/text.ts`, видавши практично однаковий коректний результат.
