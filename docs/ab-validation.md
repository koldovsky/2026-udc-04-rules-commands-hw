# A/B validation (Task D)

> Copy to `docs/ab-validation.md` and fill in. Run the SAME prompt twice — once
> with rules ON, once with rules OFF (rename `.mdc` → `.mdc.off` or move them
> aside), in a NEW chat each time.

**Rule(s) under test:** <e.g. architecture.mdc + conventions.mdc>
**Prompt (same for A and B):** the change request from `materials/ab-task.md`
(add a `priority` field + a way to change it).
**Tool used:** <e.g. Cursor>

## Result A — rules ON

<what the AI produced: which files it touched, did it extend the Action union +
reducer, use action creators, keep it immutable, avoid new deps?>

## Result B — rules OFF

<what the AI produced with the rules disabled: direct mutation? a state library?
default export? `any`?>

## Difference table

| Aspect | A (rules ON) | B (rules OFF) |
|---|---|---|
| State change path | <e.g. dispatch + reducer> | <e.g. direct mutation / useState> |
| State library added | <no> | <e.g. zustand> |
| Export style | <named> | <default> |
| Type safety | <strict, typed union> | <`any` / untyped> |
| Touched protected core? | <no> | <e.g. edited store.ts> |

## Conclusion

<1–3 sentences: did the rules actually change behaviour? which rule mattered
most? anything that surprised you?>
