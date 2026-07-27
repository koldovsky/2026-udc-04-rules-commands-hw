---
description: "Diagnose an error/stack trace and propose a fix without any/@ts-ignore or edits to protected files"
---

Diagnose this error and propose a fix: $ARGUMENTS

1. Read the error message/stack trace carefully; locate the failing file(s)
   and line(s) it points to.
2. Trace the root cause through the actual data flow: action creator
   (`app/src/actions.ts`) → `store.dispatch` → `app/src/reducer.ts` →
   subscribed listeners → reads via `app/src/selectors.ts`. Read the
   referenced code rather than guessing.
3. Propose a fix that:
   - Does NOT use `any` or `@ts-ignore` to silence the error
     (`.cursor/rules/conventions.mdc`).
   - Does NOT edit `app/src/store.ts` or `app/src/types.ts` unless the user
     explicitly named one of those files (`.cursor/rules/do-not-touch.mdc`).
   - Does NOT add a new dependency as a shortcut
     (`.cursor/rules/dependencies.mdc`).
   - Keeps state updates immutable and routed through `dispatch`, never
     direct mutation (`.cursor/rules/architecture.mdc`).
4. Explain the root cause in 1-2 sentences before showing the fix.
5. Apply the fix, then run `cd app && npm test && npm run typecheck` and
   confirm both pass.

If the real fix genuinely requires touching a protected file or a new
dependency, stop and ask for explicit approval instead of proceeding.
