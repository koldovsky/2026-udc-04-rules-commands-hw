---
description: Analyzes a TypeScript or Vitest test failure and provides a safe fix without violating project guardrails.
arguments:
  - name: errorMessage
    description: The full stack trace, compilation error, or test failure output.
    required: true
---

# Command: Analyze and Fix Error

You are tasked with analyzing the following error or test failure output and providing a safe, clean solution.

## Error Context to Analyze:
`$errorMessage`

## Constraints for the Solution:
1.  **No Bypasses:** You are strictly forbidden from using `any`, `@ts-ignore`, or type assertions (`as any`) to quiet the TypeScript compiler. The fix must comply with strict `noUncheckedIndexedAccess`.
2.  **Protected Core Guard:** Do NOT alter `app/src/store.ts` or `app/src/types.ts` to fix standard runtime/test issues unless the error explicitly highlights a fundamental structural bug approved by the developer.
3.  **No Guessing Tools:** Lint tools are not configured in this project. Do not try to run or fix code via lint commands.
4.  **Verification:** After proposing or applying the fix, instruct the user to run (or run yourself via CLI tool) `cd app && npm run typecheck` and `npm test` to verify the solution works perfectly.
