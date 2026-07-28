---
description: "Add a new Action to the custom store architecture"
---

Do the following for: $ARGUMENTS

1. Determine the new application behavior that should be implemented. 
2. Add a new Action variant to the discriminated union in `app/src/types.ts`. 
3. Implement the new action handling in `app/src/reducer.ts`. 
4. Add or update an action creator in `app/src/actions.ts`. 
5. Reuse existing selectors where possible. If reusable derived state is needed, add or extend a selector in `app/src/selectors.ts`. 
6. Add or update a colocated `*.test.ts` file covering the new behavior. 
7. Keep the reducer pure and use immutable state updates. 
8. Verify the implementation remains fully type-safe. Follow the project conventions in `.cursor/rules/`.

Follow the project conventions in `.cursor/rules/`.

In particular: 
- Use the custom store architecture. 
- Change state only through `store.dispatch(action)`. 
- Use named exports only. - Do not use `any` or `@ts-ignore`. 
- Do not mutate application state. 
- Do not introduce Redux, Zustand, MobX, Jotai, or other state libraries. 
- Do not modify `app/src/store.ts` unless explicitly requested. 
- Modify `app/src/types.ts` only to add the required Action variant. 
- Suggest running: 

```bash 
cd app && npm run typecheck && npm test
```
