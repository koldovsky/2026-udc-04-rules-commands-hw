---
description: "Analyze a TypeScript, test, or runtime error and propose a project-compliant fix"
---

Do the following for: $ARGUMENTS

1. Read the provided error message, stack trace, or compiler output. 
2. Identify the root cause rather than only the failing line. 
3. Explain why the error occurs in the context of the current project. 
4. Propose the smallest change that fixes the issue. 
5. Ensure the proposed fix follows the project's architecture and coding conventions. 
6. If multiple valid solutions exist, recommend the safest one and explain the trade-offs.
7. Suggest any missing or updated tests if the fix changes application behaviour.

Follow the project conventions in `.cursor/rules/` 

In particular: 
- Do not use `any`. 
- Do not use `@ts-ignore`. 
- Keep reducers pure. 
- Preserve immutable state updates. 
- Do not replace the custom store with Redux, Zustand, MobX, or another state library. 
- Do not modify `app/src/store.ts` or `app/src/types.ts` unless the error explicitly requires those files to change. 
- Do not recommend adding new npm dependencies without explicit approval. 

When appropriate, recommend verifying the fix by running: 

```bash 
cd app && npm run typecheck && npm test
```
