---
description: "Diagnose an error/stack trace and propose a safe fix"
---

Analyze this error and propose a fix: $ARGUMENTS

1. Read the error/stack trace and locate the failing file and line in `app/src`.
2. Explain the ROOT cause in 1–2 sentences (not just the symptom).
3. Propose the minimal fix. Prefer correcting types/logic over suppressing.
4. NEVER fix it with `any`, `as any`, `@ts-ignore`, or `@ts-expect-error`.
5. NEVER edit the protected core (`app/src/store.ts`, `app/src/types.ts`) beyond
   agreed additive changes; keep state updates immutable and exports named.
6. If a test is missing for the bug, add a colocated failing-then-passing test.
7. Verify with `cd app && npm test` and `npm run typecheck` (both green).

Follow the project conventions in `.cursor/rules/` (custom store — NOT
Redux/Zustand; no `any`/`@ts-ignore`; do not touch the protected core).

