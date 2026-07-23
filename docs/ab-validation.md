# A/B validation (Task D)

**Rule(s) under test:** `architecture.mdc`, `conventions.mdc`, `do-not-touch.mdc`, `testing.mdc`
**Prompt (same for A and B):** the change request from `materials/ab-task.md`
(add a `priority` field + a way to change it).
**Tool used:** Claude Code (CLI)

## Result A — rules ON

AI запитав дозвіл перед зміною захищеного `types.ts` (згідно з `do-not-touch.mdc`).

Змінені файли: `types.ts`, `reducer.ts`, `actions.ts`, `reducer.test.ts`.
**НЕ** змінені: `store.ts` (захищене ядро).

Що зробив:
- Додав окремий тип `Priority = "low" | "normal" | "high"` — reusable.
- Додав обов'язкове поле `priority: Priority` до інтерфейсу `Task`.
- Додав варіант `"task/prioritized"` до `Action` union (discriminated union).
- Обробив новий action у `reducer.ts` іммутабельно (`.map()` + spread).
- Оновив `"task/added"` case — нові задачі мають `priority: "normal"` за замовчуванням.
- Додав action creator `setPriority(id, priority)` у `actions.ts`.
- Додав 3 нових тести у `reducer.test.ts` (AAA патерн, vitest).
- Typecheck чистий, 20/20 тестів зелені.
- Без нових залежностей, без `any`, named exports, listeners сповіщуються через dispatch.

## Result B — rules OFF

AI одразу відредагував `store.ts` і `types.ts` без запиту дозволу.

Змінені файли: `types.ts`, `store.ts`.
**НЕ** змінені: `reducer.ts`, `actions.ts`, тести.

Що зробив:
- Додав `priority?:` як **optional** поле (можна забути встановити).
- Продублював літеральний тип `"low" | "normal" | "high"` у двох місцях (store + types).
- Додав метод `setPriority()` **прямо в `store.ts`** (захищений файл) — поза dispatch/reducer циклом.
- Мутує стан напряму: `task.priority = priority` — **listeners не сповіщуються**.
- Використав `(t: any)` у `.find()`.
- Не додав action variant, action creator, або тестів.
- Typecheck пройшов (бо `any` + optional), існуючі тести зелені (бо нічого не ламає поверхнево).
- Прихований баг: UI ніколи не дізнається про зміну priority, бо `dispatch` не викликається.

## Difference table

| Aspect | A (rules ON) | B (rules OFF) |
|--------|-------------|---------------|
| State change path | `store.dispatch(action)` → reducer → listeners | Пряма мутація через `store.setPriority()`, listeners NOT notified |
| Touched `store.ts`? | Ні | Так — додав метод прямо в engine |
| Asked permission? | Так, перед зміною `types.ts` | Ні |
| Immutability | `.map()` + spread (новий об'єкт) | `task.priority = priority` (мутація in-place) |
| Action union extended? | Так (`"task/prioritized"`) | Ні |
| Action creator added? | Так (`setPriority()` у `actions.ts`) | Ні |
| Type safety | Strict: окремий `Priority` type, обов'язкове поле | `any` у find callback, optional `priority?` |
| Export style | Named exports | Named (випадково збіглось) |
| New dependencies? | Ні | Ні |
| Tests added? | 3 нових тести (AAA, vitest) | 0 тестів |
| Hidden bugs? | Жодних | Priority зміна не тригерить subscribers — тиха регресія |

## Conclusion

Правила кардинально змінили поведінку AI. Найважливіше правило —
**`architecture.mdc`**: без нього AI обійшов dispatch/reducer цикл і створив
приховану регресію (зміна стану без сповіщення listeners). Правило
**`do-not-touch.mdc`** запобігло модифікації захищеного `store.ts`. Правило
**`conventions.mdc`** виключило `any` і забезпечило strict typing. Без правил AI
обрав «шлях найменшого опору» — мінімальну зміну, яка формально не ламає тести,
але порушує архітектурний інваріант і вносить тихий баг у runtime.
